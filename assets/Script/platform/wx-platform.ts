import PlatformInterface from './platform-interface';
const sdk = require("../libs/sdk.min.js");
const conf = require('../libs/sdk-conf.js');
const crossSDK=require("../libs/cross-sdk.min.js");
var crossConf=require("../libs/cross-sdk-conf.js");


export default class WXPlatform extends PlatformInterface {
  public init(): boolean {
    sdk.init(conf);
    return true;
  }

  public onShow(callback) {
    wx.onShow(callback);
  }

  public offShow(callback) {
    wx.offShow(callback);
  }

  public onHide(callback) {
    wx.onHide(callback);
  }

  public offHide(callback) {
    wx.offHide(callback);
  }

  public getLaunchOptionsSync(): any {
    return wx.getLaunchOptionsSync();
  }

  public setStorage(key, data) {
    wx.setStorage({key: key, data: data});
  }

  public getStorage(key, cb) {
    wx.getStorage({
      key: key, success: (res)=> {
        cb(res.data);
      }, fail: ()=> {
        cb("0");
      }
     });
  }

  public submitScore(openid, score, cb) {
    wx.postMessage({
      message: "submitScore",
      value: score
    });
    if (!cb || typeof cb !== "function") {
      return;
    }
    cb(null);
  }

  public displayFriendRankList(openid) {
    console.log('wx postMessage friend rank self open id=', openid);
    wx.postMessage({
      message: "friendRank",
      value: {self: openid}
    });
  }

  public displayGrounpRankList(openid) {
    console.log('wx postMessage groupRank self open id=', openid);
    wx.shareAppMessage({
      title: "查看群排行",
      success: (res) => {
        console.log("share success, res=", JSON.stringify(res));
        if (res.shareTickets != null) {
          wx.postMessage({
            message: "groupRank",
            value: {self: openid, "ticket": res.shareTickets[0]}
          })
        }
      }
    })
  }

  public shareAppMessage(title,imgUrl,cb){
    sdk.shareAppMessage({
      title:  title,
      query: 'channel=xxfc',
      success: (err,res)=>{
        if (err){
          cc.error(err);
          cb(err);
        }
        cb(null);
      },
      imageUrl:imgUrl,
      fail:(err)=>{
        cc.error(err);
      }
    })
  }

  public createdAd(obj){
    crossSDK.createAd(obj);
  };
  public onAdChange(cb:Function){
    crossSDK.onChange(cb);
  };

  public login(cb) {
    sdk.decodeLogin((user, error, checkedSession)=> {
      if (!cb || typeof cb !== "function") {
        return;
      }
      if (error) {
        cb(error, null);
        return;
      }
      console.log("login success, user=", JSON.stringify(user));
      crossConf.openID=user.userInfo.userId3;
      crossSDK.init(crossConf);
      cb(null, user.userInfo);
    }, ()=> {
      let sys = wx.getSystemInfoSync();

      // 你需要这么手动计算一下授权按钮的位置, 具体位置你自己定
      let buttonWidth = 247;
      let buttonRatio = 278 / 247;
      let buttonRealWidth = (247 / 1080) * sys.windowWidth;
      let buttonRealHeigth = buttonRealWidth * buttonRatio;
      let top = (sys.windowHeight / 1920) * 1193 - Math.round(buttonRealHeigth / 2)
      // 这个是前几步获得的授权按钮图片
      let buttonImageUrl = 'https://gc-oss.hortorgames.com/auth-1526891844.png';
      console.log("login button url=", buttonImageUrl);

      let button = sdk.getGetUserInfoBtn({
        type: 'image',
        // text: '获取用户信息',
        image: buttonImageUrl,
        style: {
          left: sys.windowWidth / 2 - Math.round(buttonRealWidth / 2),
          top: top,
          width: buttonRealWidth,
          height: buttonRealHeigth,
          borderRadius: 4
        }
      }, (data, err, button) => {
        if (err) {
          cb(err);
          return;
        }
        // 授权成功
        if (data) {
          console.log("login success, data=", JSON.stringify(data));
          // 隐藏 button
          button.hide();
        }
      });
    })
  }
}


