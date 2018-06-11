// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    labelName: cc.Label,
    labelRadius: cc.Label,
    labelDiameter: cc.Label,
  },

  init (index) {
    cc.log("init star-description layer");
    let config = configManager.getStarConfigByIndex(index);
    this.labelName.string = cc.js.formatStr("%s", config.name);
    this.labelRadius.string = cc.js.formatStr("轨道半径:%d", config.radius);
    this.labelDiameter.string = cc.js.formatStr("直径:%d", config.diameter);
  },

  start () {

  },

  // update (dt) {},
});
