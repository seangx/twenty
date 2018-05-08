cc.Class({
  extends: cc.Component,

  properties: {
    cubePrefabs: [cc.Prefab]
  },

  // use this for initialization
  onLoad: function () {
    cc.director.getPhysicsManager().enabled=true;
    gameManager.init(this.cubePrefabs);
  },

  // called every frame
  update: function (dt) {

  },
});
