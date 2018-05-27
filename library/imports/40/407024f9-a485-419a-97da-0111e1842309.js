"use strict";
cc._RF.push(module, '40702T5pIVBmpfaARHhhCMJ', 'consts');
// Script/consts.js

"use strict";

var CubeColors = cc.Enum({
  Blue: -1
});

var CubeState = cc.Enum({
  Normal: -1,
  Touched: -1,
  TouchMove: -1,
  FallingDown: -1,
  FallingBottom: -1,
  Bombing: -1,
  Block: -1
});

module.exports = {
  CubeColors: CubeColors,
  CubeState: CubeState
};

cc._RF.pop();