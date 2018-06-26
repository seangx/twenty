"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'main');
// Script/main.js

"use strict";

var _platform = require("./platform/platform");

var _platform2 = _interopRequireDefault(_platform);

var _consts = require("consts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
  extends: cc.Component,

  properties: {
    cubePrefabs: [cc.Prefab],
    progressTime: cc.ProgressBar,
    labelCurrentMax: cc.Label,
    labelTopHistory: cc.Label,
    labelNewStar: cc.Label,

    starsForProgress: [cc.Node],
    subDomainEndPrefab: cc.Prefab,
    gamePauseNode: cc.Node,
    starDes: cc.Node
  },

  // use this for initialization
  onLoad: function onLoad() {
    cc.log("enter main scene");
    cc.director.getPhysicsManager().enabled = true;
    // cc.director.getPhysicsManager().debugDrawFlags=1;
    // cc.view.enableAntiAlias(false);

    configManager.init();
    gameManager.init(this.cubePrefabs, this.node, this.node.getComponent(cc.AudioSource));

    // cc.game.addPersistRootNode(this.starDesNode);

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.initProgress();
    cc.game.on("max-level-changed", this.onMaxLevelChanged, this);
    cc.game.on("game-over", this.onGameOver, this);
  },
  onDestroy: function onDestroy() {
    cc.game.off("max-level-changed", this.onMaxLevelChanged, this);
    cc.game.off("game-over", this.onGameOver, this);
  },
  initProgress: function initProgress() {
    var children = this.starsForProgress;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (i === 0) {
        child.x = -1;
        child.getComponent("star").setStarType(gameManager.maxLevel);
        child.scale = 1.05;
      } else {
        child.x = 109 * i;
        child.getComponent("star").setStarType(gameManager.maxLevel + i);
        child.getComponent("star").dark();
        child.scale = 1;
      }
    }
  },
  onGameOver: function onGameOver() {
    var endLayer = cc.instantiate(this.subDomainEndPrefab);
    this.node.addChild(endLayer);
    _platform2.default.instance.displayFriendRankList(dataManager.userInfo.userId3);
  },
  onMaxLevelChanged: function onMaxLevelChanged() {
    // this.starDes.active=true;
    this.labelNewStar.string = cc.js.formatStr("发现新星球:%s", configManager.getStarConfigByIndex(gameManager.maxLevel).name);
    this.getComponent(cc.Animation).play("show-new-star-tip");
    for (var i in this.starsForProgress) {
      var item = this.starsForProgress[i];
      var moveLeft = cc.moveBy(0.5, cc.p(-109, 0));
      this.starsForProgress[i].runAction(cc.sequence(moveLeft, cc.callFunc(function () {
        if (this.x < -424) {
          //移出左侧屏幕的精灵放到右侧备用
          this.x = 435;
          this.getComponent("star").setStarType(gameManager.maxLevel + 4); //为超出屏幕的星星设置纹理
        }
        if (this.x <= 5) {
          this.getComponent("star").unDark();
          if (this.x > -110) {
            this.scale = 1.05;
          } else {
            this.scale = 1;
          }
        } else {
          this.getComponent("star").dark();
        }
      }, item)));
    }
  },
  onTouchStart: function onTouchStart(touch) {
    gameManager.hideStarDes();
    this.starDes.active = false;
  },


  // called every frame
  update: function update(dt) {
    gameManager.update(dt);

    this.progressTime.progress = gameManager.leftTime / gameManager.newLineTime;
    this.labelCurrentMax.string = "分数：" + (gameManager.maxLevel + 1).toString();
    this.labelTopHistory.string = "最高：" + (gameManager.maxHistory + 1).toString();

    if (gameManager.state === _consts.GameState.Pause) {
      this.gamePauseNode.active = true;
    }
  },
  onRestartClicked: function onRestartClicked() {
    gameManager.restart();
    this.initProgress();
  },
  onContinueClicked: function onContinueClicked() {
    this.gamePauseNode.active = false;
    gameManager.setState(_consts.GameState.Running);
  },
  onPauseClicked: function onPauseClicked() {
    gameManager.setState(_consts.GameState.Pause);
  },
  onShareClicked: function onShareClicked() {
    var config = configManager.getStarConfigByIndex(gameManager.maxLevel);
    _platform2.default.instance.shareAppMessage("\u6D69\u701A\u7684\u94F6\u6CB3\u4E2D\uFF0C\u5B88\u62A4\u6211\u90A3\u9897\u661F\u661F\u53EB\u505A" + config.name, "", function () {
      cc.log("share success");
    });
  }
});

cc._RF.pop();