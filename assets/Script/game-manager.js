// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {CubeState, CubeColors, GameState} from "consts";
import Platform from "./platform/platform";
var GameManager = cc.Class({

  properties: {
    rowCount: 6,
    columnCount: 6,
    space: 4,

    cubes: [],
    columnPositions: [],
    rowPositions: [],
    cubeTemplate: cc.Node,
    cubePrefab: cc.Prefab,
    gameNode_: null,

    halfWidth: 0,
    halfHeight: 0,

    maxLevel: 0,
    maxHistory: 0,
    leftTime: 8,
    newLineTime: 8,

    mainNode: cc.Node,
    cubePool: cc.NodePool,

    state: {
      default: GameState.Idle,
      type: GameState,
    },
    idGenerator: 1
  },

  setState(state){
    if (this.state === state) {
      return;
    }
    switch (state) {
      case GameState.AddNewLine: {
        // cc.director.getPhysicsManager().enabled=false;
        break;
      }
      case GameState.Running: {
        // cc.director.getPhysicsManager().enabled=true;
      }
    }
    this.state = state;
  },

  init(cubePrefab, mainNode, auSource) {
    Platform.instance.getStorage("maxLevel", function(maxLevel) {
      this.mainNode = mainNode;
      this.gameNode_ = mainNode.getChildByName("game-node");
      this.cubePrefab = cubePrefab;
      this.cubePool = new cc.NodePool;

      for (let i = 0; i < (this.rowCount + 1) * this.columnCount; i++) {
        let cube = cc.instantiate(cubePrefab);
        this.cubePool.put(cube);
      }

      this.halfWidth = this.gameNode_.width / 2;
      this.halfHeight = this.gameNode_.height / 2;

      this.cubeTemplate = cc.instantiate(this.cubePrefab);

      this.au_ = auSource;

      this.reset();
      this.maxLevel = 0;
      if (maxLevel) {
        this.maxHistory = parseInt(maxLevel);
      }

      if (this.maxLevel <= 0) {
        this.showStarDes(this.maxLevel);
      }

      Platform.instance.onHide(()=> {
        if (this.state !== GameState.Over && this.state !== GameState.Pause) {
          this.setState(GameState.Pause);
        }
      });

      cc.log("game manager init");
    }.bind(this));

  },

  restart(){
    this.reset();
    this.mainNode.getComponent(cc.Animation).play("game-restart");
  },

  reset(){
    this.clear();

    this.setState(GameState.Running);
    this.leftTime = this.newLineTime;
    this.maxLevel = 0;
    this.initCubes();
  },

  clear(){
    this.foreachCubes((item, cell)=> {
      if (item) {
        this.cubePool.put(item);
      }
    });
    // this.gameNode_.removeAllChildren(true);
  },

  foreachCubes(cb){
    for (let i = 0; i < this.cubes.length; i++) {
      let row = this.cubes[i];
      for (let j = 0; j < row.length; j++) {
        cb(row[j], {row: i, column: j});
      }
    }
  },

  initCubes() {
    this.cubes = [];
    //初始化数组
    for (let i = 0; i < this.rowCount; i++) {
      let tmp = [];
      for (let j = 0; j < this.columnCount; j++) {
        tmp.push(null);
        //cube的x坐标
        if (this.columnPositions.length < this.columnCount) {
          this.columnPositions.push(this.space + this.cubeTemplate.width / 2 + (this.cubeTemplate.width + this.space) * j);
        }
      }
      //cube的y坐标
      if (this.rowPositions.length < this.rowCount) {
        this.rowPositions.push(this.space + this.cubeTemplate.height / 2 + (this.cubeTemplate.height + this.space) * i);
      }
      this.cubes.push(tmp);
    }

    //初始化cube
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        this.cubes[i][j] = this.createCube({row: i, column: j});
      }
    }
  },

  randLevel(){
    // if (this.maxLevel<3){
    //   return  parseInt(Math.random()*10)%2;
    // }
    // if (this.maxLevel<6){
    //   return parseInt(Math.random()*10)%(this.maxLevel);
    // }
    // if (this.maxLevel<11){
    //   return parseInt(Math.random()*10)%(this.maxLevel-1);
    // }
    // return Math.min(5+parseInt(Math.random()*10)%(this.maxLevel-5),14);
    if (this.maxLevel <= 0) {
      return this.maxLevel;
    }
    return parseInt(Math.random() * 10) % this.maxLevel;
  },

  posToPoint(pos){
    let cell = {row: -1, column: -1};
    for (let i = 0; i < this.rowCount; i++) {
      if (pos.y < (i + 1) * (this.cubeTemplate.height + this.space)) {
        cell.row = i;
        break;
      }
    }
    for (let j = 0; j < this.columnCount; j++) {
      if (pos.x < (j + 1) * (this.cubeTemplate.width + this.space)) {
        cell.column = j;
        break;
      }
    }


    if (pos.y > (this.rowCount) * (this.cubeTemplate.height + this.space)){
      cell.row=this.rowCount-1;
    }
    if (pos.y<=0){
      cell.row=0;
    }

    return cell;
  },

  isSameCube(cube1, cube2){
    let com1 = cube1.getComponent("cube");
    let com2 = cube2.getComponent("cube");
    return com1.id === com2.id;
  },

  removeCube(cube){
    cc.log("put cube back ,length:", this.cubePool.size());
    this.gameNode_.emit(cc.Node.EventType.TOUCH_END);
    let cubeCom = cube.getComponent("cube");

    if (this.isSameCube(this.cubes[cubeCom.cell.row][cubeCom.cell.column], cube)) {
      this.cubes[cubeCom.cell.row][cubeCom.cell.column] = null;
    }
    this.cubePool.put(cube);
  },

  //移动数组位置到显示位置
  cubeMoved(cube){
    cc.log("cube moved");
    let cell = this.posToPoint(cube.position);

    let cubeCom = cube.getComponent("cube");
    let oldCell = cubeCom.cell;
    if (cell.row === oldCell.row && cell.column === oldCell.column || !this.cubes[oldCell.row][oldCell.column]) {
      return;
    }
    if (this.isSameCube(this.cubes[oldCell.row][oldCell.column], cube)) {  //删除旧位置信息
      cc.log("remove old cube,cell:", JSON.stringify(oldCell));
      this.cubes[oldCell.row][oldCell.column] = null;
    }

    this.cubes[cell.row][cell.column] = cube;
    cubeCom.setCellPos(cell);
  },

  getCube(row, column){
    return this.cubes[row][column];
  },

  setCube(row, column, cube){
    if (this.cubes[row][column]) {
      cc.warn("can not set,cell is not nil");
      return;
    }
    this.cubes[row][column] = cube;
  },

  levelChange(level){
    if (level > this.maxLevel) {
      this.maxLevel = level;
      if (dataManager.userInfo) {
        Platform.instance.submitScore(dataManager.userInfo.userId3, this.maxLevel);
      }
      this.showStarDes(this.maxLevel);
      if (this.maxLevel > this.maxHistory) {
        this.maxHistory = this.maxLevel;
        Platform.instance.setStorage("maxLevel", this.maxLevel.toString());
      }
      cc.game.emit("max-level-changed");
    }
  },

  savePlayerData(){
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.setStorage({
        key: "maxLevel",
        data: this.maxLevel.toString(),
        success: ()=> {
          console.log("save level success");
        }
      })
    }
  },

  update (dt) {
    // this.checkFallingDownPosition();
    if (this.state !== GameState.Running) {
      return;
    }
    this.leftTime -= dt;
    if (this.leftTime <= 0) {
      this.addNewLine();
      this.leftTime = this.newLineTime;
    }
  },

  isDead(){
    let topLine = this.cubes[this.cubes.length - 1];
    let topline2=this.cubes[this.cubes.length-2];
    for (let i = 0; i < topLine.length; i++) {
      if (topLine[i]&&topline2[i]) {
        return true;
      }
    }
    return false;
  },

  addNewLine(){
    if (this.isDead()) {
      this.gameOver();
      return;
    }
    this.setState(GameState.AddNewLine);
    for (let i = 0; i < this.cubes.length; i++) {
      let row = this.cubes[i];
      for (let j = 0; j < row.length; j++) {
        let cube = row[j];
        if (!cube) {
          continue;
        }
        if (cube.getComponent("cube").state === CubeState.Bombing) {
          continue;
        }
        cube.emit("move-up");
      }
    }

    //避免新旧碰撞，延迟加载新0星球
    setTimeout(()=> {
      if (this.state != GameState.AddNewLine) {
        return;
      }
      this.setState(GameState.Running);
      for (let i = 0; i < this.columnCount; i++) {
        let cube = this.createCube({row: 0, column: i});
        // cube.y=-cube.height/2;
        this.cubes[0][i] = cube;
        // cube.emit("move-up");
      }
    }, 200);
  },
  gameOver(){
    this.setState(GameState.Over);
    cc.game.emit("game-over");
    this.mainNode.getComponent(cc.Animation).play("game-over");
  },
  createCube(cell){
    let cube = this.cubePool.get();
    cc.log("get cube  from pool,length:", this.cubePool.size());
    if (!cube) {
      cc.error("over max cube pool");
      return;
    }
    let id = this.idGenerator;
    this.idGenerator++;
    cube.x = this.space + cube.width / 2 + (cube.width + this.space) * cell.column;
    cube.y = this.space + cube.height / 2 + (cube.height + this.space) * cell.row;
    cube.parent = this.gameNode_;
    cube.getComponent("cube").init(cell, this.randLevel(), id);
    return cube;
  },
  playBombSound(){
    this.au_.play();
  },

  showStarDes(index){
    // let node=cc.find("star-description");
    // if (!node){
    //   cc.warn("star-description is not find");
    //   return;
    // }
    //
    // node.getComponent(node.name).init(index);
    // node.active=true;
  },

  hideStarDes(index){
    // let node=cc.find("star-description");
    // if (!node){
    //   cc.warn("star-description is not find");
    //   return;
    // }
    // // node.getComponent(node.name).init(index);
    // node.active=false;
  },
  createAd(){
    Platform.instance.createdAd(
      {
        adsId: "xxfc",
        success: (ad)=> {
          cc.log("create ad success,ad:", JSON.stringify(ad));
        },
        fail:(err)=>{
          cc.log("create ad fail,err:",JSON.stringify(err));
        },
      },
    )
  }
});

window.gameManager = new GameManager();
