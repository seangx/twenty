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
import {CubeState} from "../consts";
cc.Class({
  extends: cc.Component,

  properties: {
    level: 1,
    labelLevel:cc.Label,
    state:{
      default:CubeState.Normal,
      type:CubeState
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
    this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);

    this.node.on("level-up",this.onLevelUp,this);

    this.moveCtl={
      up:true,
      down:true,
      left:true,
      right:true
    }
  },

  onLevelUp(){
    this.level++;
    this.labelLevel.string=this.level;
  },


  init(edges) {
    this.labelLevel.string=this.level;
  },

  start() {

  },

  setState(state) {
    if (this.state===state){
      return;
    }
    this.state=state;
  },

  update(dt) {
    if (this.state === CubeState.Bombing) {
      this.node.removeFromParent();
    }
  },

  onTouchStart(touch){
    this.setState(CubeState.Touched);
    this.node.getComponent(cc.PhysicsCollider).body.awake=true;
    this.node.getComponent(cc.PhysicsCollider).body.type=cc.RigidBodyType.Dynamic;

  },

  onTouchEnd(touch){
    // this.setState(CubeState.FallingDown);

  },

  onTouchMove(touch){
    let touchPos=this.node.parent.convertTouchToNodeSpaceAR(touch);
    this.node.position=touchPos;
    // let diff=cc.pSub(touchPos,this.node.position);
    // this.moveCube(diff,touchPos);
  },



  // 只在两个碰撞体开始接触时被调用一次
  onBeginContact: function (contact, selfCollider, otherCollider) {
    // this.node.getComponent(cc.PhysicsCollider).body.type=cc.RigidBodyType.Static;

    let cube1=selfCollider.node.getComponent("cube");
    let cube2=otherCollider.node.getComponent("cube");
    if (!cube1||!cube2){
      return;
    }
    if (cube1.level !== cube2.level) {
      return;
    }
    if (cube1.state === CubeState.Bombing) {
      return;
    }

    if (cube1.state===CubeState.Touched||cube1.state===CubeState.FallingDown){
      cube1.setState(CubeState.Bombing);
      cube2.node.emit("level-up");
    }
    // contact.disabledOnce=true;
    // selfCollider.body.type=cc.RigidBodyType.Kinematic;
  },

  // 每次将要处理碰撞体接触逻辑时被调用
  onPreSolve: function (contact, selfCollider, otherCollider) {
    // if (otherCollider.node.getComponent("cube")) {
    //   contact.disabledOnce=true;
    // }


  },


  // moveCube(diff,touchPos){
  //   let max=gameManager.getLimitPosition(touchPos,this.node);
  //   if ((diff.x>0&&this.moveCtl.right)||(diff.x<0&&this.moveCtl.left)){
  //     this.node.x+=diff.x;
  //     if (diff.x>0){
  //       this.node.x=Math.min(this.node.x,max.x);
  //     } else{
  //       this.node.x=Math.max(this.node.x,max.x);
  //     }
  //   }
  //
  //   if ((diff.y>0&&this.moveCtl.up)||(diff.y<0&&this.moveCtl.down)){
  //     this.node.y+=diff.y;
  //     if (diff.y>0){
  //       this.node.y=Math.min(this.node.y,max.y);
  //     } else{
  //       this.node.y=Math.max(this.node.y,max.y);
  //     }
  //   }
  // },
  //
  // updateMoveDir(otherNode,selfNode){
  //   let otherBox=otherNode.getBoundingBox();
  //   let selfBox=selfNode.getBoundingBox();
  //   if (Math.abs((otherBox.x - selfBox.x)) > selfBox.width/2) { //横向碰撞
  //     if((selfBox.x-otherBox.x)<=selfBox.width&&(selfBox.x-otherBox.x)>0){
  //       this.moveCtl.left=false;
  //     }else{
  //       this.moveCtl.left=true;
  //     }
  //
  //     if((otherBox.x-selfBox.x)<=selfBox.width&&(otherBox.x-selfBox.x)>0){
  //       this.moveCtl.right=false;
  //     }else{
  //       this.moveCtl.right=true;
  //     }
  //   }else{
  //     if((otherBox.y-selfBox.y)<=selfBox.height&&(otherBox.y-selfBox.y)>0){
  //       this.moveCtl.up=false;
  //     }else{
  //       this.moveCtl.up=true;
  //     }
  //
  //     if((selfBox.y-otherBox.y)<=selfBox.height&&(selfBox.y-otherBox.y)>0){
  //       this.moveCtl.down=false;
  //     }else{
  //       this.moveCtl.down=true;
  //     }
  //   }
  // },
  //
  // onCollisionEnter: function (other, self) {
  //   cc.log("on collision enter");
  //   this.updateMoveDir(other.node,self.node);
  // },
  //
  // onCollisionExit: function (other, self) {
  //   cc.log("on collision exit");
  //   this.updateMoveDir(other.node,self.node);
  // }
});
