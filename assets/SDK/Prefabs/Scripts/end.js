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
        indexBtn: {
            type: cc.Button,
            default: null
        },
        playAgainBtn: {
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
        this.subTex_ =  new cc.Texture2D();
    },

    updateSubDomainCanvas() {
        if ( !this.subTex_) {
            return;
        }
        this.subTex_.initWithElement(sharedCanvas);
        this.subTex_.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.subTex_);
    },

    update() {
        this.updateSubDomainCanvas();
    },

    onClickPlayAgainBtn() {
        console.log("onClickPlayAgainBtn")
        window.G.panelGame.controllerPart.clickStartGame();
        this.node.destroy();
    },

    onClickIndexBtn() {
        console.log("onClickIndexBtn")
        // window.G.panelGame.controllerPart.clickeBackToOpen();
        this.node.destroy();
    }
});
