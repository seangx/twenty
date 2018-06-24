// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import Star from "../prefab/star.js";
cc.Class({
  extends: cc.Component,

  properties: {
    labelName: cc.Label,
    labelDes:cc.RichText,
    star:cc.Node
  },

  start () {
    cc.log("init star-description layer");
    cc.game.on("max-level-changed",this.onMaxLevelChanged,this);
  },

  onMaxLevelChanged(){
    if(!this.star){
      return;
    }
    let config = configManager.getStarConfigByIndex(gameManager.maxLevel);
    this.labelName.string = cc.js.formatStr("%s", config.name);
    this.labelDes.string=config.des;
    this.star.getComponent("star").setStarType(gameManager.maxLevel);
  },


  // update (dt) {},
});
