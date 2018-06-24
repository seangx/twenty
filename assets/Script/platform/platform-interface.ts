
export default abstract class PlatformInterface {
  public abstract init(): boolean;

  public abstract onShow(callobject);
  public abstract onHide(callobject);
  public abstract getLaunchOptionsSync(): any;
  public abstract setStorage(key,data):any;
  public abstract getStorage(key,cb:Function);
  public abstract login(cb);
  public abstract submitScore(openid,score,cb);
  public abstract displayFriendRankList(openid);
  public abstract displayGroupRankList(openid);
  public abstract shareAppMessage(title,imgUrl,cb:Function);
}