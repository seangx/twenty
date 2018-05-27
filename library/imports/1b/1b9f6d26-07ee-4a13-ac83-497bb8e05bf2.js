"use strict";
cc._RF.push(module, '1b9f60mB+5KE6yDSXu44Fvy', 'cube');
// Script/prefab/cube.js

"use strict";

var _cc$Class;

var _consts = require("../consts");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// import {CubeState} from './color-cube';


cc.Class((_cc$Class = {
  extends: cc.Component,

  properties: {
    level: 0,
    state: {
      default: _consts.CubeState.Normal,
      type: _consts.CubeState
    },
    cell: cc.p(0, 0),
    levelFrames: [cc.SpriteFrame],
    background: cc.Sprite
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad: function onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    // this.gameNode = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

    this.node.on("level-up", this.onLevelUp, this);

    this.node.on("move-up", this.onMoveUp, this);

    this.touchStartPos = cc.p(0, 0);
  },


  // destroy(){
  //   this.gameNode.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
  // },

  onLevelUp: function onLevelUp() {
    this.level++;
    gameManager.levelChange(this.level);
    this.safeChangeLevelFrame();
    gameManager.playDeadAction(this.node.position);
    gameManager.playBombSound();
  },
  safeChangeLevelFrame: function safeChangeLevelFrame() {
    if (this.level >= this.levelFrames.length) {
      this.level = this.levelFrames.length - 1;
    }
    this.background.spriteFrame = this.levelFrames[this.level];
  },
  init: function init(cell, level) {
    this.cell = cell;
    this.level = level;
    // this.
    this.safeChangeLevelFrame();
    // this.setState(CubeState.Block);
  },
  start: function start() {},
  setCellPos: function setCellPos(cell) {
    this.cell = cell;
  },
  setState: function setState(state) {
    cc.log(cc.js.formatStr("set state,old:%d,new:%d,pos:%v", this.state, state, this.cell));
    if (this.state === _consts.CubeState.Bombing) {
      cc.error("cube is marking dead");
      return;
    }
    if (this.state === state) {
      return;
    }
    switch (state) {
      case _consts.CubeState.Normal:
        {
          gameManager.cubeMoved(this.node);
          break;
        }
      case _consts.CubeState.TouchMove:
        {
          break;
        }
      case _consts.CubeState.Touched:
      case _consts.CubeState.FallingDown:
        {
          this.activePhysics();
          // this.resetX();
        }
      case _consts.CubeState.FallingBottom:
        {
          break;
        }
    }
    this.state = state;
  },
  update: function update(dt) {
    switch (this.state) {
      case _consts.CubeState.Bombing:
        {
          gameManager.removeCube(this.node);
          break;
        }
      case _consts.CubeState.TouchMove:
        {
          break;
        }
      case _consts.CubeState.Normal:
        {
          this.disablePhysics();
          this.checkFallingDown();
          break;
        }
      case _consts.CubeState.FallingBottom:
        {
          this.resetY();
          this.setState(_consts.CubeState.Normal);
          break;
        }
    }
    //非touch状态时进行触底检查
    if (this.state !== _consts.CubeState.Touched && this.state !== _consts.CubeState.TouchMove) {
      if (this.node.y < this.node.height / 2 + gameManager.space) {
        this.setState(_consts.CubeState.FallingBottom);
      }
    }
  },
  onTouchStart: function onTouchStart(touch) {
    cc.log("on touch start");
    this.setState(_consts.CubeState.Touched);
    // let body=this.node.getComponent(cc.RigidBody);
    // body.awake=true;
    // body.type=cc.RigidBodyType.Dynamic;

    this.activePhysics();
    this.touchStartPos = touch.getLocation();
  },
  onTouchEnd: function onTouchEnd(touch) {
    cc.log("on touch end");
    this.node.parent.emit(cc.Node.EventType.TOUCH_END); //告知touch关节触摸结束
    if (this.state !== _consts.CubeState.Touched && this.state !== _consts.CubeState.TouchMove) {
      return;
    }
    //重置mouse关节的冲量
    this.disablePhysics();
    this.setState(_consts.CubeState.FallingDown);
    this.resetX();

    this.touchStartPos = cc.p(0, 0);
  },
  onTouchMove: function onTouchMove(touch) {
    cc.log("on touch moved");
    var dis = cc.pDistance(cc.pSub(touch.getLocation(), this.touchStartPos), cc.p(0, 0));
    if (dis > 3) {
      if (this.state === _consts.CubeState.Touched) {
        this.setState(_consts.CubeState.TouchMove);
        // gameManager.cubeMove(this.cell);
      }
    }
  },
  checkBombing: function checkBombing(cube1, cube2) {
    if (cube1.level !== cube2.level) {
      return false;
    }

    if (cube1.state === _consts.CubeState.Bombing) {
      return false;
    }

    if (cube1.state === _consts.CubeState.TouchMove || cube1.state === _consts.CubeState.FallingDown) {
      return true;
    }
    return false;
  },


  //仅动态类型才处理碰撞
  onBeginContact: function onBeginContact(contact, selfCollider, otherCollider) {
    if (selfCollider.body.type === cc.RigidBodyType.Static) {
      return;
    }

    var cubeSelf = selfCollider.node.getComponent("cube");
    var cubeOther = otherCollider.getComponent("cube");
    if (!cubeSelf || !cubeOther) {
      return;
    }

    if (this.checkBombing(cubeSelf, cubeOther)) {
      cubeSelf.setState(_consts.CubeState.Bombing);
      cubeOther.node.emit("level-up");
    }

    if (cubeSelf.state === _consts.CubeState.FallingDown) {
      cubeSelf.setState(_consts.CubeState.FallingBottom);
    }
  },
  // 每次处理完碰撞体接触逻辑时被调用
  onPostSolve: function onPostSolve(contact, selfCollider, otherCollider) {
    if (selfCollider.body.type === cc.RigidBodyType.Static) {
      return;
    }
  }

}, _defineProperty(_cc$Class, "onPostSolve", function onPostSolve(contact, selfCollider, otherCollider) {
  if (selfCollider.body.type === cc.RigidBodyType.Static) {
    return;
  }
}), _defineProperty(_cc$Class, "resetY", function resetY() {
  //更新cube的y坐标
  cc.log("reset y called");
  var cell = gameManager.posToPoint(this.node.position);
  this.node.y = gameManager.rowPositions[cell.row];
}), _defineProperty(_cc$Class, "resetX", function resetX() {
  //更新cube的x坐标
  cc.log("reset x called");
  var cell = gameManager.posToPoint(this.node.position);
  this.node.x = gameManager.columnPositions[cell.column];
  cc.log("reset x,new x:" + this.node.x.toString());
}), _defineProperty(_cc$Class, "activePhysics", function activePhysics() {
  var body = this.node.getComponent(cc.RigidBody);
  body.awake = true;
  body.type = cc.RigidBodyType.Dynamic;
}), _defineProperty(_cc$Class, "disablePhysics", function disablePhysics() {
  var body = this.node.getComponent(cc.RigidBody);
  if (body.type !== cc.RigidBodyType.Static) {
    body.type = cc.RigidBodyType.Static;
  }
}), _defineProperty(_cc$Class, "checkFallingDown", function checkFallingDown() {
  if (this.cell.row <= 0) {
    return;
  }
  var downCube = gameManager.getCube(this.cell.row - 1, this.cell.column);
  if (!downCube) {
    this.setState(_consts.CubeState.FallingDown);
  }
}), _defineProperty(_cc$Class, "onMoveUp", function onMoveUp() {
  var _this = this;

  this.setState(_consts.CubeState.Block);
  var moveTo = cc.moveTo(0.2, cc.pAdd(this.node.position, cc.p(0, this.node.height + gameManager.space)));
  this.node.runAction(cc.sequence(moveTo, cc.callFunc(function () {
    gameManager.cubeMoved(_this.node);
    _this.setState(_consts.CubeState.Normal);
  })));
}), _cc$Class));

cc._RF.pop();