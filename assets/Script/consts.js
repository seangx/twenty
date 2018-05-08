const CubeColors=cc.Enum({
  Blue:-1,
});

const CubeState=cc.Enum({
  Normal:-1,
  Touched:-1,
  FallingDown:-1,
  Bombing:-1,
});



module.exports={
  CubeColors,
  CubeState
};