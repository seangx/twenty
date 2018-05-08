(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'main', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=main.js.map
        