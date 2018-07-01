import PlatformInterface from './platform-interface';

export default class WebPlatform extends PlatformInterface {
  public init(): boolean {

    return true;
  }

  public onShow(callback) {
  }

  public offShow(callback) {
  }

  public onHide(callback) {
  }

  public offHide(callback) {
  }

  public getLaunchOptionsSync(): any { 
    return {
      query: {}
    };
  }

  public setStorage(key,data){
    // wx.setStorage({key:key,data:data});
  }
  public getStorage(key,cb){
    cb("0");
    // wx.getStorage({key:key,success:cb});
  }
  public login(cb){
    cb(null,{});
  }

  public submitScore(openid,score,cb){
    cb(null);
  }
  public displayFriendRankList(openid){
    return;
  }
  public displayGroupRankList(openid){
    return;
  }

  public shareAppMessage(title,imgUrl,cb){

  }

  public createdAd(obj){};
  public onAdChange(cb:Function){};
}

