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

var StarNames = cc.Enum({
  "Neptune": -1,
  "Uranus": -1,
  "Saturn": -1,
  "Jupiter": -1,
  "Mars": -1,
  "Earth": -1,
  "Venus": -1,
  "Mercury": -1
});

module.exports = {
  CubeColors: CubeColors,
  CubeState: CubeState,
  StarNames: StarNames
};

cc._RF.pop();