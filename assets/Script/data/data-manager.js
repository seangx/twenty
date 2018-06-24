/**
 * Created by Joker on 2018/6/7.
 */

var DataManager=cc.Class({
  properties:{
    userInfo:null,
  },
  init(){

  },

  setUserInfo(info){
    this.userInfo=info;
  },

  getUserInfo(){
    return this.userInfo;
  }
});

window.dataManager=new DataManager();