/**
 * Created by Joker on 2018/6/7.
 */
import UserInfo from "./user-info.js";

var DataManager=cc.Class({
  properties:{
    userInfo:{
      type:UserInfo,
      default:null,
    },
  },
  init(){

  },

  getUserInfo(){
    return new UserInfo();
  }
});

window.dataManager=new DataManager();