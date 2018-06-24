
var m_Animation = null;
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        Layer_Container : { default : null, type : cc.Node },
        canTouch : false,
        cancelBtn: {
            type: cc.Button,
            default: null
        },
        reviveBtn: {
            type: cc.Button,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    show() {
        // self = this;
        // if (m_Animation == null) m_Animation = new window.G.Animation();
        // this.canTouch = false;
        // m_Animation.play(this.Layer_Container, "onDialogShow", 1, function() {
        //     self.canTouch = true;
        // });
    },

    start () {
        self = this;
        if (m_Animation == null) m_Animation = new window.G.Animation();
    },

    onClickCancelBtn() {
        // if (!this.canTouch) return;
        // window.G.soundManager.playClickSound();   
        // m_Animation.play(this.Layer_Container, "onDialogHide", 1, function() {     
        //     G.mainLogic.tryGameOver();
        //     self.node.removeFromParent();
        // });
    },

    onClickReviveBtn() {
        if (!this.canTouch) return;
        window.G.soundManager.playClickSound();
        m_Animation.play(this.Layer_Container, "onDialogHide", 1, function() { 
            window.G.mainLogic.reviveTimes--;
            self.node.removeFromParent(); 
            self.revive();
            G.sdk.shareAppMessage({
                title: "玩的停不下来了！",
                imageUrl : window.G.panelGame.shareURL
            });
        });
    },

    revive() {
        // TODO: how to revive
        G.panelGame.gamePart.revive();
    },

    stopAnimation (){
        m_Animation.stop();
    },

    update (dt) {
        if (m_Animation != null) m_Animation.update();
    },

});
