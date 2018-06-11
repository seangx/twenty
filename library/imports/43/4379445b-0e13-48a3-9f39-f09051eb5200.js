"use strict";
cc._RF.push(module, '43794RbDhNIo5858JBR61IA', 'game-manager');
// Script/game-manager.js

"use strict";

var _consts = require("consts");

var GameManager = cc.Class({

  properties: {
    rowCount: 8,
    columnCount: 7,
    space: 15,

    cubes: [],
    columnPositions: [],
    rowPositions: [],
    cubeTemplate: cc.Node,
    cubePrefabs: [],
    gameNode_: null,

    halfWidth: 0,
    halfHeight: 0,

    maxLevel: 0,
    leftTime: 10,
    newLineTime: 10,
    isPause: 0,

    mainNode: cc.Node
  },

  init: function init(prefabs, mainNode, auSource) {
    this.mainNode = mainNode;
    this.gameNode_ = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.cubePrefabs = prefabs;

    this.halfWidth = this.gameNode_.width / 2;
    this.halfHeight = this.gameNode_.height / 2;

    this.cubeTemplate = cc.instantiate(this.cubePrefabs[0]);

    this.au_ = auSource;

    this.reset();
    if (this.maxLevel <= 0) {
      this.showStarDes(this.maxLevel);
    }
    cc.log("game manager init");
  },
  restart: function restart() {
    this.reset();
    this.mainNode.getComponent(cc.Animation).play("game-restart");
  },
  reset: function reset() {
    this.clear();

    this.isPause = false;
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
        //cube的y坐标
        if (this.rowPositions.length < this.rowCount) {
          this.rowPositions.push(this.space + this.cubeTemplate.height / 2 + (this.cubeTemplate.height + this.space) * j);
        }
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
    this.cubes[cubeCom.cell.row][cubeCom.cell.column] = null;
  },


  //移动数组位置到显示位置
  cubeMoved: function cubeMoved(cube) {
    cc.log("cube moved");
    var cell = this.posToPoint(cube.position);
    if (this.cubes[cell.row][this.column]) {
      cc.error("can not move cube");
      return;
    }
    var cubeCom = cube.getComponent("cube");
    var oldCell = cubeCom.cell;
    if (this.cubes[oldCell.row][oldCell.column] === cube) {
      //删除旧位置信息
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
      this.showStarDes(this.maxLevel);
    }
  },
  update: function update(dt) {
    // this.checkFallingDownPosition();
    if (this.isPause) {
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
    if (this.isDead()) {
      this.gameOver();
      return;
    }
    cc.game.emit("add-new-line");
    for (var i = 0; i < this.cubes.length; i++) {
      var row = this.cubes[i];
      for (var j = 0; j < row.length; j++) {
        var cube = row[j];
        if (!cube) {
          continue;
        }
        // if (cube.getComponent("cube").state!==CubeState.Normal){
        //   continue;
        // }
        cube.emit("move-up");
        // this.cubes[i][j]=null;
      }
    }

    for (var _i2 = 0; _i2 < this.columnCount; _i2++) {
      var _cube = this.createCube({ row: 0, column: _i2 });
      _cube.y = -_cube.height / 2;
      this.cubes[0][_i2] = _cube;
      // cube.emit("move-up");
    }
  },
  gameOver: function gameOver() {
    this.isPause = true;
    this.mainNode.getComponent(cc.Animation).play("game-over");
  },
  createCube: function createCube(cell) {
    var cube = cc.instantiate(this.cubePrefabs[0]);
    cube.getComponent("cube").init(cell, this.randLevel());
    cube.x = this.space + cube.width / 2 + (cube.width + this.space) * cell.column;
    cube.y = this.space + cube.height / 2 + (cube.height + this.space) * cell.row;
    cube.parent = this.gameNode_;
    return cube;
  },
  playBombSound: function playBombSound() {
    this.au_.play();
  },
  showStarDes: function showStarDes(index) {
    var node = cc.find("star-description");
    if (!node) {
      cc.warn("star-description is not find");
      return;
    }
    node.getComponent(node.name).init(index);
    node.active = true;
  },
  hideStarDes: function hideStarDes(index) {
    var node = cc.find("star-description");
    if (!node) {
      cc.warn("star-description is not find");
      return;
    }
    // node.getComponent(node.name).init(index);
    node.active = false;
  }
}); // Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


window.gameManager = new GameManager();

cc._RF.pop();