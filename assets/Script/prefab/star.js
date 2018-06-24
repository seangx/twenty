// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {StarTypes} from "../consts.js";

cc.Class({
  extends: cc.Component,

  properties: {
    starFrames: [cc.SpriteFrame],
    starType: {
      default: 0,
      type: StarTypes,
    },
    displaySprite: cc.Sprite,
    isDark:cc.Boolean
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.changeSpriteFrame();
  },

  changeSpriteFrame(){
    Utils.safeChangeSpriteFrame(this.displaySprite, this.starFrames[this.starType]);
  },

  setStarType(starType){
    this.starType=Math.min(starType,StarTypes.MaxLevel-1);
    this.changeSpriteFrame();
  },

  levelUp(){
    this.starType++;
    this.starType=Math.min(this.starType,StarTypes.MaxLevel-1);
    this.changeSpriteFrame();
  },

  dark(){
    this.displaySprite.node.color=cc.color(50,50,50,255);
    this.isDark=true;
  },

  unDark(){
    this.displaySprite.node.color=cc.color(255,255,255,255);
    this.isDark=false;

  },

  // update (dt) {},
});
