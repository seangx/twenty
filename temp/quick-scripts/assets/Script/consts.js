(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/consts.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '40702T5pIVBmpfaARHhhCMJ', 'consts', __filename);
// Script/consts.js

"use strict";

var CubeColors = cc.Enum({
  Blue: -1
});

var CubeState = cc.Enum({
  Normal: -1,
  Touched: -1,
  FallingDown: -1,
  Bombing: -1
});

module.exports = {
  CubeColors: CubeColors,
  CubeState: CubeState
};

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
        //# sourceMappingURL=consts.js.map
        