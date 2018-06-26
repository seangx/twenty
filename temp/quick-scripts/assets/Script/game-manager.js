(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game-manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '43794RbDhNIo5858JBR61IA', 'game-manager', __filename);
// Script/game-manager.js

"use strict";

var _consts = require("consts");

var _platform = require("./platform/platform");

var _platform2 = _interopRequireDefault(_platform);

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
var GameManager = cc.Class({

  properties: {
    rowCount: 8,
    columnCount: 7,
    space: 5,

    cubes: [],
    columnPositions: [],
    rowPositions: [],
    cubeTemplate: cc.Node,
    cubePrefabs: [],
    gameNode_: null,

    halfWidth: 0,
    halfHeight: 0,

    maxLevel: 0,
    maxHistory: 0,
    leftTime: 10,
    newLineTime: 10,

    mainNode: cc.Node,

    state: {
      default: _consts.GameState.Idle,
      type: _consts.GameState
    }
  },

  setState: function setState(state) {
    if (this.state === state) {
      return;
    }
    switch (state) {
      case _consts.GameState.AddNewLine:
        {
          // cc.director.getPhysicsManager().enabled=false;
          break;
        }
      case _consts.GameState.Running:
        {
          // cc.director.getPhysicsManager().enabled=true;
        }
    }
    this.state = state;
  },
  init: function init(prefabs, mainNode, auSource) {
    _platform2.default.instance.getStorage("maxLevel", function (maxLevel) {
      var _this = this;

      this.mainNode = mainNode;
      this.gameNode_ = mainNode.getChildByName("game-node");
      this.cubePrefabs = prefabs;

      this.halfWidth = this.gameNode_.width / 2;
      this.halfHeight = this.gameNode_.height / 2;

      this.cubeTemplate = cc.instantiate(this.cubePrefabs[0]);

      this.au_ = auSource;

      this.reset();
      this.maxLevel = 0;
      if (maxLevel) {
        this.maxHistory = parseInt(maxLevel);
      }

      if (this.maxLevel <= 0) {
        this.showStarDes(this.maxLevel);
      }

      _platform2.default.instance.onHide(function () {
        if (_this.state !== _consts.GameState.Over || _this.state !== _consts.GameState.Pause) {
          _this.setState(_consts.GameState.Pause);
        }
      });

      cc.log("game manager init");
    }.bind(this));
  },
  restart: function restart() {
    this.reset();
    this.mainNode.getComponent(cc.Animation).play("game-restart");
  },
  reset: function reset() {
    this.clear();

    this.setState(_consts.GameState.Running);
    this.leftTime = this.newLineTime;
    this.maxLevel = 0;
    this.initCubes();
  },
  clear: function clear() {
    this.foreachCubes(function (item, cell) {
      if (item) {
        item.removeFromParent();
      }
    });
    // this.gameNode_.removeAllChildren(true);
  },
  foreachCubes: function foreachCubes(cb) {
    for (var i = 0; i < this.cubes.length; i++) {
      var row = this.cubes[i];
      for (var j = 0; j < row.length; j++) {
        cb(row[j], { row: i, column: j });
      }
    }
  },
  randColorCube: function randColorCube() {
    var max = _consts.CubeColors.Blue + 1;
    var color = Math.floor(Math.random() * 10) % max;
    return cc.instantiate(this.cubePrefabs[color]);
  },
  initCubes: function initCubes() {
    this.cubes = [];
    //初始化数组
    for (var i = 0; i < this.rowCount; i++) {
      var tmp = [];
      for (var j = 0; j < this.columnCount; j++) {
        tmp.push(null);
        //cube的x坐标
        if (this.columnPositions.length < this.columnCount) {
          this.columnPositions.push(this.space + this.cubeTemplate.width / 2 + (this.cubeTemplate.width + this.space) * j);
        }
      }
      //cube的y坐标
      if (this.rowPositions.length < this.rowCount) {
        this.rowPositions.push(this.space + this.cubeTemplate.height / 2 + (this.cubeTemplate.height + this.space) * i);
      }
      this.cubes.push(tmp);
    }

    //初始化cube
    for (var _i = 0; _i < 2; _i++) {
      for (var _j = 0; _j < this.columnCount; _j++) {
        var cube = this.randColorCube();
        if (!cube) {
          cc.error("init cube fail");
          return;
        }
        cube.getComponent("cube").init({ row: _i, column: _j }, this.randLevel());
        cube.x = this.space + cube.width / 2 + (cube.width + this.space) * _j;
        cube.y = this.space + cube.height / 2 + (cube.height + this.space) * _i;

        // cube.parent=this.gameNode_;

        this.cubes[_i][_j] = this.createCube({ row: _i, column: _j });
      }
    }
  },
  randLevel: function randLevel() {
    // if (this.maxLevel<3){
    //   return  parseInt(Math.random()*10)%2;
    // }
    // if (this.maxLevel<6){
    //   return parseInt(Math.random()*10)%(this.maxLevel);
    // }
    // if (this.maxLevel<11){
    //   return parseInt(Math.random()*10)%(this.maxLevel-1);
    // }
    // return Math.min(5+parseInt(Math.random()*10)%(this.maxLevel-5),14);
    if (this.maxLevel <= 0) {
      return this.maxLevel;
    }
    return parseInt(Math.random() * 10) % this.maxLevel;
  },
  posToPoint: function posToPoint(pos) {
    var cell = { row: 0, column: 0 };
    for (var i = 0; i < this.rowCount; i++) {
      if (pos.y > (i + 1) * (this.cubeTemplate.height + this.space)) {
        continue;
      }
      cell.row = i;
      for (var j = 0; j < this.columnCount; j++) {
        if (pos.x < (j + 1) * (this.cubeTemplate.width + this.space)) {
          cell.column = j;
          return cell;
        }
      }
    }

    cc.warn("invalid touch position");
    return cell;
  },
  removeCube: function removeCube(cube) {
    this.gameNode_.emit(cc.Node.EventType.TOUCH_END);
    cube.removeFromParent();
    var cubeCom = cube.getComponent("cube");

    if (this.cubes[cubeCom.cell.row][cubeCom.cell.column] === cube) {
      this.cubes[cubeCom.cell.row][cubeCom.cell.column] = null;
    }
  },


  //移动数组位置到显示位置
  cubeMoved: function cubeMoved(cube) {
    cc.log("cube moved");
    var cell = this.posToPoint(cube.position);
    // if (this.cubes[cell.row][cell.column]){
    //   cc.error("can not move cube");
    //   return;
    // }

    var cubeCom = cube.getComponent("cube");
    var oldCell = cubeCom.cell;
    if (cell.row === oldCell.row && cell.column === oldCell.column) {
      return;
    }
    if (this.cubes[oldCell.row][oldCell.column] === cube) {
      //删除旧位置信息
      cc.log("remove old cube,cell:", JSON.stringify(oldCell));
      this.cubes[oldCell.row][oldCell.column] = null;
    }
    // else if(this.cubes[oldCell.row][oldCell.column]&&this.cubes[oldCell.row][oldCell.column]!==cube){//当前位置已存在
    //   if (cell.row>=this.cubes.length-2){
    //     cc.warn("move to top");
    //     return;
    //   }
    //   cell.row+=1;
    // }

    this.cubes[cell.row][cell.column] = cube;
    cubeCom.setCellPos(cell);
  },
  getCube: function getCube(row, column) {
    return this.cubes[row][column];
  },
  setCube: function setCube(row, column, cube) {
    if (this.cubes[row][column]) {
      cc.warn("can not set,cell is not nil");
      return;
    }
    this.cubes[row][column] = cube;
  },
  levelChange: function levelChange(level) {
    if (level > this.maxLevel) {
      this.maxLevel = level;
      _platform2.default.instance.submitScore(dataManager.userInfo.userId3, this.maxLevel);
      this.showStarDes(this.maxLevel);
      if (this.maxLevel > this.maxHistory) {
        this.maxHistory = this.maxLevel;
        _platform2.default.instance.setStorage("maxLevel", this.maxLevel.toString());
      }
      cc.game.emit("max-level-changed");
    }
  },
  savePlayerData: function savePlayerData() {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.setStorage({
        key: "maxLevel",
        data: this.maxLevel.toString(),
        success: function success() {
          console.log("save level success");
        }
      });
    }
  },
  update: function update(dt) {
    // this.checkFallingDownPosition();
    if (this.state !== _consts.GameState.Running) {
      return;
    }
    this.leftTime -= dt;
    if (this.leftTime <= 0) {
      this.addNewLine();
      this.leftTime = this.newLineTime;
    }
  },
  isDead: function isDead() {
    var topLine = this.cubes[this.cubes.length - 1];
    for (var i = 0; i < topLine.length; i++) {
      if (topLine[i]) {
        return true;
      }
    }
    return false;
  },
  addNewLine: function addNewLine() {
    var _this2 = this;

    if (this.isDead()) {
      this.gameOver();
      return;
    }
    this.setState(_consts.GameState.AddNewLine);
    cc.game.emit("add-new-line");
    for (var i = 0; i < this.cubes.length; i++) {
      var row = this.cubes[i];
      for (var j = 0; j < row.length; j++) {
        var cube = row[j];
        if (!cube) {
          continue;
        }
        if (cube.getComponent("cube").state === _consts.CubeState.Bombing) {
          this.removeCube(cube);
          continue;
        }
        cube.emit("move-up");
        // this.cubes[i][j]=null;
      }
    }

    //避免新旧碰撞，延迟加载新0星球
    setTimeout(function () {
      if (_this2.state != _consts.GameState.AddNewLine) {
        return;
      }
      _this2.setState(_consts.GameState.Running);
      for (var _i2 = 0; _i2 < _this2.columnCount; _i2++) {
        var _cube = _this2.createCube({ row: 0, column: _i2 });
        // cube.y=-cube.height/2;
        _this2.cubes[0][_i2] = _cube;
        // cube.emit("move-up");
      }
    }, 180);
  },
  gameOver: function gameOver() {
    this.setState(_consts.GameState.Over);
    cc.game.emit("game-over");
    this.mainNode.getComponent(cc.Animation).play("game-over");
  },
  createCube: function createCube(cell) {
    var cube = cc.instantiate(this.cubePrefabs[0]);
    cube.x = this.space + cube.width / 2 + (cube.width + this.space) * cell.column;
    cube.y = this.space + cube.height / 2 + (cube.height + this.space) * cell.row;
    cube.parent = this.gameNode_;
    cube.getComponent("cube").init(cell, this.randLevel());
    return cube;
  },
  playBombSound: function playBombSound() {
    this.au_.play();
  },
  showStarDes: function showStarDes(index) {
    // let node=cc.find("star-description");
    // if (!node){
    //   cc.warn("star-description is not find");
    //   return;
    // }
    //
    // node.getComponent(node.name).init(index);
    // node.active=true;
  },
  hideStarDes: function hideStarDes(index) {
    // let node=cc.find("star-description");
    // if (!node){
    //   cc.warn("star-description is not find");
    //   return;
    // }
    // // node.getComponent(node.name).init(index);
    // node.active=false;
  }
});

window.gameManager = new GameManager();

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
        //# sourceMappingURL=game-manager.js.map
        