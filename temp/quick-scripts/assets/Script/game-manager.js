(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game-manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '43794RbDhNIo5858JBR61IA', 'game-manager', __filename);
// Script/game-manager.js

"use strict";

var _consts = require("consts");

var GameManager = cc.Class({

  properties: {
    rowCount: 8,
    columnCount: 7,
    space: 20,

    cubes: [],
    cubeTemplate: cc.Node,
    cubePrefabs: [],
    gameNode_: null,

    halfWidth: 0,
    halfHeight: 0
  },

  init: function init(prefabs) {
    this.gameNode_ = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.cubePrefabs = prefabs;

    this.halfWidth = this.gameNode_.width / 2;
    this.halfHeight = this.gameNode_.height / 2;

    this.cubeTemplate = cc.instantiate(this.cubePrefabs[0]);

    this.initCubes();
    cc.log("game manager init");
  },
  randColorCube: function randColorCube() {
    var max = _consts.CubeColors.Blue + 1;
    var color = Math.floor(Math.random() * 10) % max;
    return cc.instantiate(this.cubePrefabs[color]);
  },
  initCubes: function initCubes() {
    this.cubes = [];
    for (var i = 0; i < this.rowCount; i++) {
      this.cubes.push([]);
      var tmp = [];
      for (var j = 0; j < this.columnCount; j++) {
        tmp.push(null);
      }
      this.cubes.push(tmp);
    }
    for (var _i = 0; _i < 3; _i++) {
      for (var _j = 0; _j < this.columnCount; _j++) {
        var cube = this.randColorCube();
        if (!cube) {
          cc.error("init cube fail");
          return;
        }
        // cube.getComponent("cube").init();
        cube.x = this.space + cube.width / 2 + (cube.width + this.space) * _j;
        cube.y = this.space + cube.height / 2 + (cube.height + this.space) * _i;
        cube.parent = this.gameNode_;

        this.cubes[_i][_j] = cube;
      }
    }
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
    return position;
  },


  //dir:-1 or 1
  getLimitPosition: function getLimitPosition(touchPos, node) {
    var position = this.posToPoint(touchPos);

    var point = cc.p(0, 0);

    if (!position.row >= this.cubes.length) {
      cc.error("invalid row count");
      return;
    }
    for (var i = 0; i <= position.column; i++) {
      var cube = this.cubes[position.row][i];
      if (!cube) {
        continue;
      }
      if (node === cube) {
        continue;
      }
      if (touchPos.x - node.x > 0) {
        point.x = cube.x - this.space - cube.width;
        break;
      } else {
        point.x = cube.x + this.space + cube.width;
        break;
      }
    }

    for (var _i2 = 0; _i2 <= position.row; _i2++) {
      var _cube = this.cubes[_i2][position.column];
      if (!_cube) {
        continue;
      }
      if (node === _cube) {
        continue;
      }
      if (touchPos.y - node.y > 0) {
        point.y = _cube.y - this.space - _cube.height;
        break;
      } else {
        point.y = _cube.y + this.space + _cube.height;
        break;
      }
    }

    return point;
  },
  update: function update(dt) {}
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
        