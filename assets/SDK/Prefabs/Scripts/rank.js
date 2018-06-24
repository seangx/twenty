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
        closeBtn: {
            type: cc.Button,
            default: null
        },
        groupRankBtn: {
            type: cc.Button,
            default: null
        },
        display: {
            type: cc.Sprite,
            default: null
        },

        subTex_: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // if (window.G.debug) return;
        window.G.wxsdk.displayFriendRank(window.G.selfOpenId);
        this.subTex_ =  new cc.Texture2D();
    },

    updateSubDomainCanvas() {
        if (!this.subTex_) {
            return;
        }
        this.subTex_.initWithElement(sharedCanvas);
        this.subTex_.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.subTex_);
    },

    update() {
        // if (window.G.debug) return;
        this.updateSubDomainCanvas();
    },

    onClickCloseBtn() {
        this.node.destroy();
    },

    onClickGroupRankBtn() {
        // if (window.G.debug) return;
        window.G.wxsdk.displayGroupRank(window.G.selfOpenId);
    }
});
