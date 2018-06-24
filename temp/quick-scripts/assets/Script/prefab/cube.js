(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/prefab/cube.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1b9f60mB+5KE6yDSXu44Fvy', 'cube', __filename);
// Script/prefab/cube.js

"use strict";

var _consts = require("../consts");

var _star = require("./star.js");

var _star2 = _interopRequireDefault(_star);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
cc.Class({
  extends: cc.Component,

  properties: {
    state: {
      default: _consts.CubeState.Normal,
      type: _consts.CubeState
    },
    cell: cc.p(0, 0),
    star: {
      default: null,
      type: _star2.default
    },
    levelUpAnimation: cc.Prefab
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad: function onLoad() {
    var _this = this;

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    // this.gameNode = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

    this.node.on("level-up", this.onLevelUp, this);

    this.node.on("move-up", this.onMoveUp, this);

    cc.game.on("add-new-line", function () {
      if (!_this.isTouched() || _this.cell.row > 0) {
        return;
      }
      var moveTo = cc.moveTo(0.2, cc.pAdd(_this.node.position, cc.p(0, _this.node.height + gameManager.space)));
      _this.node.runAction(moveTo);
    });

    this.touchStartPos = cc.p(0, 0);
  },
  isTouched: function isTouched() {
    return this.state === _consts.CubeState.Touched || this.state === _consts.CubeState.TouchMove;
  },


  // destroy(){
  //   this.gameNode.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
  // },

  onLevelUp: function onLevelUp() {
    this.star.levelUp();
    gameManager.levelChange(this.star.starType);
    // gameManager.playDeadAction(this.node.position);
    this.playLevelUpAnimation();
    gameManager.playBombSound();
  },
  init: function init(cell, starType) {
    this.cell = cell;
    this.star.setStarType(starType);
    // this.setState(CubeState.Block);
  },
  start: function start() {},
  setCellPos: function setCellPos(cell) {
    this.cell = cell;
  },
  setState: function setState(state) {
    cc.log(cc.js.formatStr("set state,old:%d,new:%d,pos:%s", this.state, state, JSON.stringify(this.cell)));
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
          this.disablePhysics();
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
          return;
        }
      case _consts.CubeState.TouchMove:
        {
          this.fitCell();
          break;
        }
      case _consts.CubeState.Normal:
        {
          // this.disablePhysics();
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
  fitCell: function fitCell() {
    var newCell = gameManager.posToPoint(this.node.position);
    if (newCell.row !== this.cell.row || newCell.column !== this.cell.column) {
      gameManager.cubeMoved(this.node);
    }
  },
  checkBombing: function checkBombing(cube1, cube2) {
    if (cube1.star.starType !== cube2.star.starType) {
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
    if (selfCollider.body.type === cc.RigidBodyType.Static || gameManager.state === _consts.GameState.AddNewLine) {
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

  resetY: function resetY() {
    //更新cube的y坐标
    cc.log("reset y called");
    var cell = gameManager.posToPoint(this.node.position);
    this.node.y = gameManager.rowPositions[cell.row];
  },
  resetX: function resetX() {
    //更新cube的x坐标
    cc.log("reset x called");
    var cell = gameManager.posToPoint(this.node.position);
    this.node.x = gameManager.columnPositions[cell.column];
    cc.log("reset x,new x:" + this.node.x.toString());
  },
  activePhysics: function activePhysics() {
    var body = this.node.getComponent(cc.RigidBody);
    body.awake = true;
    body.type = cc.RigidBodyType.Dynamic;
  },
  disablePhysics: function disablePhysics() {
    var body = this.node.getComponent(cc.RigidBody);
    if (body.type !== cc.RigidBodyType.Static) {
      body.type = cc.RigidBodyType.Static;
    }
  },
  checkFallingDown: function checkFallingDown() {
    if (this.cell.row <= 0 || gameManager.state !== _consts.GameState.Running) {
      return;
    }
    var downCube = gameManager.getCube(this.cell.row - 1, this.cell.column);
    if (!downCube) {
      this.setState(_consts.CubeState.FallingDown);
    }
  },
  onMoveUp: function onMoveUp() {
    var _this2 = this;

    if (this.state === _consts.CubeState.Touched || this.state === _consts.CubeState.TouchMove) {
      return;
    }
    this.setState(_consts.CubeState.Block);
    var moveTo = cc.moveTo(0.2, cc.pAdd(this.node.position, cc.p(0, this.node.height + gameManager.space)));
    this.node.runAction(cc.sequence(moveTo, cc.callFunc(function () {
      gameManager.cubeMoved(_this2.node);
      _this2.setState(_consts.CubeState.Normal);
    })));
  },
  playLevelUpAnimation: function playLevelUpAnimation() {
    if (!this.levelUpAnimation) {
      return;
    }
    var ani = cc.instantiate(this.levelUpAnimation);
    this.node.addChild(ani);
  }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=cube.js.map
        