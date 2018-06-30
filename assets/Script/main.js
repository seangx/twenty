import Platform from "./platform/platform";
import {CubeState,CubeColors,GameState} from "consts";
cc.Class({
  extends: cc.Component,

  properties: {
    cubePrefab: cc.Prefab,
    progressTime:cc.ProgressBar,
    labelCurrentMax:cc.Label,
    labelTopHistory:cc.Label,
    labelNewStar:cc.Label,

    starsForProgress:[cc.Node],
    subDomainEndPrefab:cc.Prefab,
    gamePauseNode:cc.Node,
    starDes:cc.Node,
  },

  // use this for initialization
  onLoad: function () {
    cc.log("enter main scene");
    cc.director.getPhysicsManager().enabled=true;
    // cc.director.getPhysicsManager().debugDrawFlags=1;
    // cc.view.enableAntiAlias(false);

    configManager.init();
    gameManager.init(this.cubePrefab,this.node,this.node.getComponent(cc.AudioSource));

    // cc.game.addPersistRootNode(this.starDesNode);

    this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    this.initProgress();
    cc.game.on("max-level-changed",this.onMaxLevelChanged,this);
    cc.game.on("game-over",this.onGameOver,this);
  },
  onDestroy(){
    cc.game.off("max-level-changed",this.onMaxLevelChanged,this);
    cc.game.off("game-over",this.onGameOver,this);
  },

  initProgress(){
    let children=this.starsForProgress;
    for (let i=0;i<children.length;i++){
      let child=children[i];
      if (i===0){
        child.x=-1;
        child.getComponent("star").setStarType(gameManager.maxLevel);
        child.scale=1.05
      }else{
        child.x=(109*(i));
        child.getComponent("star").setStarType(gameManager.maxLevel+(i));
        child.getComponent("star").dark();
        child.scale=1;
      }
    }
  },

  onGameOver(){
    let endLayer=cc.instantiate(this.subDomainEndPrefab);
    this.node.addChild(endLayer);
    Platform.instance.displayFriendRankList(dataManager.userInfo.userId3);
  },

  onMaxLevelChanged(){
    // this.starDes.active=true;
    this.labelNewStar.string=cc.js.formatStr("发现新星球:%s",configManager.getStarConfigByIndex(gameManager.maxLevel).name);
    this.getComponent(cc.Animation).play("show-new-star-tip");
    for (let i in this.starsForProgress){
      let item=this.starsForProgress[i];
      let moveLeft=cc.moveBy(0.5,cc.p(-109,0));
      this.starsForProgress[i].runAction(cc.sequence(moveLeft,cc.callFunc(function(){
        if (this.x<-424){   //移出左侧屏幕的精灵放到右侧备用
          this.x=435;
          this.getComponent("star").setStarType(gameManager.maxLevel+4);  //为超出屏幕的星星设置纹理
        }
        if (this.x<=5){
          this.getComponent("star").unDark();
          if (this.x>-110){
            this.scale=1.05;
          }else{
            this.scale=1;
          }
        }else{
          this.getComponent("star").dark();
        }
      },item)));
    }
  },

  onTouchStart(touch){
    gameManager.hideStarDes();
    this.starDes.active=false;
  },

  // called every frame
  update: function (dt) {
    gameManager.update(dt);

    this.progressTime.progress=gameManager.leftTime/gameManager.newLineTime;
    this.labelCurrentMax.string="分数："+(gameManager.maxLevel+1).toString();
    this.labelTopHistory.string="最高："+(gameManager.maxHistory+1).toString();

    if (gameManager.state===GameState.Pause){
      this.gamePauseNode.active=true;
    }
  },
  onRestartClicked(){
    gameManager.restart();
    this.initProgress();
  },
  onContinueClicked(){
    this.gamePauseNode.active=false;
    gameManager.setState(GameState.Running);
  },
  onPauseClicked(){
    gameManager.setState(GameState.Pause);
  },
  onShareClicked(){
    let config=configManager.getStarConfigByIndex(gameManager.maxLevel);
    Platform.instance.shareAppMessage(`浩瀚的银河中，守护我那颗星星叫做${config.name}`,"",()=>{
      cc.log("share success");
    })
  }
});
