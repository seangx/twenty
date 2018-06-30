"use strict";
cc._RF.push(module, '43794RbDhNIo5858JBR61IA', 'game-manager');
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
    rowCount: 6,
    columnCount: 6,
    space: 4,

    cubes: [],
    columnPositions: [],
    rowPositions: [],
    cubeTemplate: cc.Node,
    cubePrefab: cc.Prefab,
    gameNode_: null,

    halfWidth: 0,
    halfHeight: 0,

    maxLevel: 0,
    maxHistory: 0,
    leftTime: 5,
    newLineTime: 5,

    mainNode: cc.Node,
    cubePool: cc.NodePool,

    state: {
      default: _consts.GameState.Idle,
      type: _consts.GameState
    },
    idGenerator: 1
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
  init: function init(cubePrefab, mainNode, auSource) {
    _platform2.default.instance.getStorage("maxLevel", function (maxLevel) {
      var _this = this;

      this.mainNode = mainNode;
      this.gameNode_ = mainNode.getChildByName("game-node");
      this.cubePrefab = cubePrefab;
      this.cubePool = new cc.NodePool();

      for (var i = 0; i < (this.rowCount + 1) * this.columnCount; i++) {
        var cube = cc.instantiate(cubePrefab);
        this.cubePool.put(cube);
      }

      this.halfWidth = this.gameNode_.width / 2;
      this.halfHeight = this.gameNode_.height / 2;

      this.cubeTemplate = cc.instantiate(this.cubePrefab);

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
    var _this2 = this;

    this.foreachCubes(function (item, cell) {
      if (item) {
        _this2.cubePool.put(item);
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
  isSameCube: function isSameCube(cube1, cube2) {
    var com1 = cube1.getComponent("cube");
    var com2 = cube2.getComponent("cube");
    return com1.id === com2.id;
  },
  removeCube: function removeCube(cube) {
    cc.log("put cube back ,length:", this.cubePool.size());
    this.gameNode_.emit(cc.Node.EventType.TOUCH_END);
    var cubeCom = cube.getComponent("cube");

    if (this.isSameCube(this.cubes[cubeCom.cell.row][cubeCom.cell.column], cube)) {
      this.cubes[cubeCom.cell.row][cubeCom.cell.column] = null;
    }
    this.cubePool.put(cube);
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
    if (cell.row === oldCell.row && cell.column === oldCell.column || !this.cubes[oldCell.row][oldCell.column]) {
      return;
    }
    if (this.isSameCube(this.cubes[oldCell.row][oldCell.column], cube)) {
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
      if (dataManager.userInfo) {
        _platform2.default.instance.submitScore(dataManager.userInfo.userId3, this.maxLevel);
      }
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
    var _this3 = this;

    if (this.isDead()) {
      this.gameOver();
      return;
    }
    this.setState(_consts.GameState.AddNewLine);
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
      if (_this3.state != _consts.GameState.AddNewLine) {
        return;
      }
      _this3.setState(_consts.GameState.Running);
      for (var _i2 = 0; _i2 < _this3.columnCount; _i2++) {
        var _cube = _this3.createCube({ row: 0, column: _i2 });
        // cube.y=-cube.height/2;
        _this3.cubes[0][_i2] = _cube;
        // cube.emit("move-up");
      }
    }, 100);
  },
  gameOver: function gameOver() {
    this.setState(_consts.GameState.Over);
    cc.game.emit("game-over");
    this.mainNode.getComponent(cc.Animation).play("game-over");
  },
  createCube: function createCube(cell) {
    var cube = this.cubePool.get();
    cc.log("get cube  from pool,length:", this.cubePool.size());
    if (!cube) {
      cc.error("over max cube pool");
      return;
    }
    var id = this.idGenerator;
    this.idGenerator++;
    cube.x = this.space + cube.width / 2 + (cube.width + this.space) * cell.column;
    cube.y = this.space + cube.height / 2 + (cube.height + this.space) * cell.row;
    cube.parent = this.gameNode_;
    cube.getComponent("cube").init(cell, this.randLevel(), id);
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