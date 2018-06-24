import WXPlatform from './wx-platform';
import WebPlatform from './web-platform';
import PlatformInterface from './platform-interface';

export default class Platform {
    private static instance_: PlatformInterface;

    constructor() {
        // cc.assert(!GameManager.instance_, "Create game manager multiple times");
    }

    public static get instance(): PlatformInterface {
        if (Platform.instance_) {
          return Platform.instance_;
        }

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
          cc.log("Create platform wxgame.");
          Platform.instance_ = new WXPlatform();
        }
        else {
          cc.log("Create platform web.");
          Platform.instance_ = new WebPlatform();
        }

        return Platform.instance_;
    }
}