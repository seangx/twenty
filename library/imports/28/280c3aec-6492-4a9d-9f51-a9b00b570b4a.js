"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'main');
// Script/main.js

"use strict";

cc.Class({
  extends: cc.Component,

  properties: {
    cubePrefabs: [cc.Prefab],
    progressTime: cc.ProgressBar,
    labelCurrentMax: cc.Label,
    labelTopHistory: cc.Label,

    starDesNode: cc.Node
  },

  // use this for initialization
  onLoad: function onLoad() {
    cc.director.getPhysicsManager().enabled = true;
    // cc.director.getPhysicsManager().debugDrawFlags=1;
    // cc.view.enableAntiAlias(false);
    configManager.init();
    gameManager.init(this.cubePrefabs, this.node, this.node.getComponent(cc.AudioSource));

    cc.game.addPersistRootNode(this.starDesNode);

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
  },

  onTouchStart: function onTouchStart(touch) {
    gameManager.hideStarDes();
  },


  // called every frame
  update: function update(dt) {
    gameManager.update(dt);

    this.progressTime.progress = gameManager.leftTime / gameManager.newLineTime;
    this.labelCurrentMax.string = (gameManager.maxLevel + 1).toString();
  },
  onRestartClicked: function onRestartClicked() {
    gameManager.restart();
  }
});

cc._RF.pop();