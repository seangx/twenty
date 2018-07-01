// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// import {CubeState} from './color-cube';
import {CubeState,StarTypes,GameState} from "../consts";
import Star from "./star.js";

cc.Class({
  extends: cc.Component,

  properties: {
    state:{
      default:CubeState.Normal,
      type:CubeState
    },
    cell:cc.p(0,0),
    star:{
      default:null,
      type:Star
    },
    levelUpAnimation:cc.Prefab,
    id:0,
  },

  // LIFE-CYCLE CALLBACKS:

  onEnable() {
    this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
    // this.gameNode = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);

    this.node.on("level-up",this.onLevelUp,this);

    this.node.on("move-up",this.onMoveUp,this);

    this.touchStartPos=cc.p(0,0);
  },

  onDisable(){
    this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
    // this.gameNode = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);

    this.node.off("level-up",this.onLevelUp,this);

    this.node.off("move-up",this.onMoveUp,this);
    this.setState(CubeState.Block);
  },

  isTouched(){
    return this.state===CubeState.Touched||this.state===CubeState.TouchMove;
  },

  // destroy(){
  //   this.gameNode.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
  // },

  onLevelUp(){
    this.star.levelUp();
    gameManager.levelChange(this.star.starType);
    // gameManager.playDeadAction(this.node.position);
    this.playLevelUpAnimation();
    gameManager.playBombSound();
  },

  init(cell,starType,id) {
    this.cell=cell;
    this.star.setStarType(starType);
    this.disablePhysics();
    this.id=id;
    // this.state=CubeState.Normal;
    this.setState(CubeState.Normal);
  },

  start() {

  },

  setCellPos(cell){
    this.cell=cell;
  },

  setState(state) {
    cc.log(cc.js.formatStr("set state,old:%d,new:%d,pos:%s",this.state,state,JSON.stringify(this.cell)));
    if (this.state===CubeState.Bombing&&state!==CubeState.Block){
      cc.error("cube is marking dead");
      return;
    }
    if (this.state===state){
      return;
    }
    switch (state){
      case CubeState.Normal:{
        this.disablePhysics();
        this.resetY();
        this.resetX();
        gameManager.cubeMoved(this.node);
        break;
      }
      case CubeState.TouchMove:{
        break;
      }
      case CubeState.Touched:
      case CubeState.FallingDown:{
        this.activePhysics();
        // this.resetX();
      }
      case CubeState.FallingBottom:{
        break;
      }
    }
    this.state=state;
  },

  update(dt) {

    //添加新行时暂停下落
    switch (this.state){
      case CubeState.Bombing:{
        gameManager.removeCube(this.node);
        return;
      }
      case CubeState.TouchMove:{
        this.fitCell();
        break;
      }
      case CubeState.Normal:{
        // this.disablePhysics();
        this.checkFallingDown();
        break;
      }
      case CubeState.FallingBottom:{
        this.resetY();
        this.setState(CubeState.Normal);
        break;
      }
    }
    //非touch状态时进行触底检查
    if (this.state!==CubeState.Touched&&this.state!==CubeState.TouchMove){
      if (this.node.y<this.node.height/2+gameManager.space){
        this.setState(CubeState.FallingBottom);
      }
    }
  },

  onTouchStart(touch){
    cc.log("on touch start");
    if(this.state===CubeState.AddNewLine){
      return;
    }
    this.setState(CubeState.Touched);
    // let body=this.node.getComponent(cc.RigidBody);
    // body.awake=true;
    // body.type=cc.RigidBodyType.Dynamic;

    this.activePhysics();
    this.touchStartPos=touch.getLocation();
  },

  onTouchEnd(touch){
    cc.log("on touch end");
    this.node.parent.emit(cc.Node.EventType.TOUCH_END);   //告知touch关节触摸结束
    if (this.state!==CubeState.Touched&&this.state!==CubeState.TouchMove){
      return;
    }
    //重置mouse关节的冲量
    this.disablePhysics();
    this.setState(CubeState.FallingDown);
    this.resetX();

    this.touchStartPos=cc.p(0,0);
  },

  onTouchMove(touch){
    cc.log("on touch moved");
    let dis=cc.pDistance(cc.pSub(touch.getLocation(),this.touchStartPos),cc.p(0,0));
    if (dis>3){
      if (this.state===CubeState.Touched){
        this.setState(CubeState.TouchMove);
        // gameManager.cubeMove(this.cell);

      }
    }
  },

  fitCell(){
    let newCell=gameManager.posToPoint(this.node.position);
    if (newCell.row!==this.cell.row||newCell.column!==this.cell.column){
      gameManager.cubeMoved(this.node);

    }
  },

  checkBombing(cube1,cube2){
    if (cube1.star.starType!== cube2.star.starType) {
      return false;
    }

    if (cube1.state === CubeState.Bombing) {
      return false;
    }

    if (cube1.state===CubeState.TouchMove||cube1.state===CubeState.FallingDown){
      return true;
    }
    return false;
  },

  //仅动态类型才处理碰撞
  onBeginContact: function (contact, selfCollider, otherCollider) {
    if (selfCollider.body.type===cc.RigidBodyType.Static||gameManager.state===GameState.AddNewLine){
      return;
    }

    let cubeSelf=selfCollider.node.getComponent("cube");
    let cubeOther=otherCollider.getComponent("cube");
    if (!cubeSelf||!cubeOther){
      return;
    }

    if (this.checkBombing(cubeSelf,cubeOther)){
      cubeSelf.setState(CubeState.Bombing);
      cubeOther.node.emit("level-up");
      return;
    }

    if (cubeSelf.state===CubeState.FallingDown){
      cubeSelf.setState(CubeState.FallingBottom);
    }
  },

  resetY(){
    //更新cube的y坐标
    cc.log("reset y called");
    let cell=gameManager.posToPoint(this.node.position);
    this.node.y=gameManager.rowPositions[cell.row];
    cc.log("reset y,new y:"+this.node.y.toString());
  },
  resetX(){
    //更新cube的x坐标
    cc.log("reset x called");
    let cell=gameManager.posToPoint(this.node.position);
    this.node.x=gameManager.columnPositions[cell.column];
    cc.log("reset x,new x:"+this.node.x.toString());
  },

  activePhysics(){
    let body=this.node.getComponent(cc.RigidBody);
    body.awake=true;
    body.type=cc.RigidBodyType.Dynamic;
  },

  disablePhysics(){
    let body=this.node.getComponent(cc.RigidBody);
    if (body.type!==cc.RigidBodyType.Static){
      body.type=cc.RigidBodyType.Static;
    }
  },

  checkFallingDown(){
    if (this.cell.row<=0||gameManager.state!==GameState.Running){
      return;
    }
    let downCube=gameManager.getCube(this.cell.row-1,this.cell.column);
    if (!downCube){
      this.setState(CubeState.FallingDown);
    }
  },

  moveTouchedCubeUp(){
    this.disablePhysics();
    let moveTo=cc.moveTo(0.2,cc.pAdd(this.node.position,cc.p(0,this.node.height+gameManager.space)));
    this.node.runAction(cc.sequence(moveTo,cc.callFunc(()=>{
      this.activePhysics();
      // this.setState(CubeState.Touched);
    })));
  },

  onMoveUp(){
    if (this.state===CubeState.Touched||this.state===CubeState.TouchMove){
      if(this.cell.row===0){
        this.moveTouchedCubeUp();
        return;
      }
      return;
    }
    this.setState(CubeState.Block);
    this.disablePhysics();
    let moveTo=cc.moveTo(0.2,cc.pAdd(this.node.position,cc.p(0,this.node.height+gameManager.space)));
    this.node.runAction(cc.sequence(moveTo,cc.callFunc(()=>{
      this.setState(CubeState.Normal);
    })));
  },

  playLevelUpAnimation(){
    if (!this.levelUpAnimation){
      return;
    }
    let ani=cc.instantiate(this.levelUpAnimation);
    this.node.addChild(ani);
  },
});
