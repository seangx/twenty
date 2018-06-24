"use strict";
cc._RF.push(module, '40702T5pIVBmpfaARHhhCMJ', 'consts');
// Script/consts.js

"use strict";

var CubeColors = cc.Enum({
  Blue: -1
});

var GameState = cc.Enum({
  Idle: -1,
  Pause: -1,
  Running: -1,
  AddNewLine: -1,
  Over: -1
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

var StarTypes = cc.Enum({
  "Neptune": -1,
  "Uranus": -1,
  "Saturn": -1,
  "Jupiter": -1,
  "Mars": -1,
  "Earth": -1,
  "Venus": -1,
  "Mercury": -1,
  "mingwangx": -1,
  "sun": -1,
  "s9": -1,
  "s10": -1,
  "s11": -1,
  "s12": -1,
  "s13": -1,
  "s14": -1,
  "s15": -1,
  "s16": -1,
  "s17": -1,
  "s18": -1,
  "s19": -1,
  "s20": -1,
  "s21": -1,
  "s22": -1,
  "s23": -1,
  "s24": -1,
  "s25": -1,
  "s26": -1,
  "s27": -1,
  "s28": -1,
  "s29": -1,
  "s30": -1,
  "s31": -1,
  "s32": -1,
  "s33": -1,
  "s34": -1,
  "s35": -1,
  "MaxLevel": -1
});

module.exports = {
  CubeColors: CubeColors,
  CubeState: CubeState,
  StarTypes: StarTypes,
  GameState: GameState
};

cc._RF.pop();