"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'main');
// Script/main.js

"use strict";

cc.Class({
  extends: cc.Component,

  properties: {
    cubePrefabs: [cc.Prefab]
  },

  // use this for initialization
  onLoad: function onLoad() {
    cc.director.getPhysicsManager().enabled = true;
    gameManager.init(this.cubePrefabs);
  },

  // called every frame
  update: function update(dt) {}
});

cc._RF.pop();