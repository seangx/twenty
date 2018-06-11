// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {CubeState,CubeColors} from "consts";
var GameManager=cc.Class({

  properties: {
    rowCount: 8,
    columnCount: 7,
    space: 15,

    cubes: [],
    columnPositions:[],
    rowPositions:[],
    cubeTemplate:cc.Node,
    cubePrefabs:[],
    gameNode_: null,

    halfWidth:0,
    halfHeight:0,

    maxLevel:0,
    leftTime:10,
    newLineTime:10,
    isPause:0,

    mainNode:cc.Node,
  },

  init(prefabs,mainNode,auSource) {
    this.mainNode=mainNode;
    this.gameNode_ = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.cubePrefabs=prefabs;

    this.halfWidth=this.gameNode_.width/2;
    this.halfHeight=this.gameNode_.height/2;

    this.cubeTemplate=cc.instantiate(this.cubePrefabs[0]);

    this.au_=auSource;

    this.reset();
    if (this.maxLevel<=0){
      this.showStarDes(this.maxLevel);
    }
    cc.log("game manager init");
  },

  restart(){
    this.reset();
    this.mainNode.getComponent(cc.Animation).play("game-restart");
  },

  reset(){
    this.clear();

    this.isPause=false;
    this.leftTime=this.newLineTime;
    this.maxLevel=0;
    this.initCubes();
  },

  clear(){
    this.foreachCubes((item,cell)=>{
      if (item){
        item.removeFromParent();
      }
    });
    // this.gameNode_.removeAllChildren(true);
  },

  foreachCubes(cb){
    for (let i=0;i<this.cubes.length;i++){
      let row=this.cubes[i];
      for (let j=0;j<row.length;j++){
        cb(row[j],{row:i,column:j});
      }
    }
  },

  randColorCube(){
    let max=CubeColors.Blue+1;
    let color=Math.floor(Math.random()*10)%max;
    return cc.instantiate(this.cubePrefabs[color]);
  },

  initCubes() {
    this.cubes=[];
    //初始化数组
    for (let i=0;i<this.rowCount;i++){
      let tmp=[];
      for (let j=0;j<this.columnCount;j++){
        tmp.push(null);
        //cube的x坐标
        if (this.columnPositions.length<this.columnCount){
          this.columnPositions.push(this.space+this.cubeTemplate.width/2+(this.cubeTemplate.width+this.space)*j);
        }
        //cube的y坐标
        if (this.rowPositions.length<this.rowCount){
          this.rowPositions.push(this.space+this.cubeTemplate.height/2+(this.cubeTemplate.height+this.space)*j);
        }
      }
      this.cubes.push(tmp);
    }

    //初始化cube
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.columnCount; j ++) {
        let cube=this.randColorCube();
        if (!cube){
          cc.error("init cube fail");
          return;
        }
        cube.getComponent("cube").init({row:i,column:j},this.randLevel());
        cube.x=this.space+cube.width/2+(cube.width+this.space)*j;
        cube.y=this.space+cube.height/2+(cube.height+this.space)*i;

        // cube.parent=this.gameNode_;

        this.cubes[i][j]=this.createCube({row:i,column:j});
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
    if (this.maxLevel<=0){
      return this.maxLevel;
    }
    return parseInt(Math.random()*10)%this.maxLevel;
  },

  posToPoint(pos){
    let cell={row:0,column:0};
    for (let i=0;i<this.rowCount;i++){
      if (pos.y > (i+1) * (this.cubeTemplate.height+this.space)){
        continue;
      }
      cell.row=i;
      for (let j=0;j<this.columnCount;j++){
        if (pos.x<(j+1) * (this.cubeTemplate.width+this.space)){
          cell.column=j;
          return cell;
        }
      }
    }

    cc.warn("invalid touch position");
    return cell;
  },

  removeCube(cube){
    this.gameNode_.emit(cc.Node.EventType.TOUCH_END);
    cube.removeFromParent();
    let cubeCom=cube.getComponent("cube");
    this.cubes[cubeCom.cell.row][cubeCom.cell.column]=null;

  },

  //移动数组位置到显示位置
  cubeMoved(cube){
    cc.log("cube moved");
    let cell=this.posToPoint(cube.position);
    if (this.cubes[cell.row][this.column]){
      cc.error("can not move cube");
      return;
    }
    let cubeCom=cube.getComponent("cube");
    let oldCell=cubeCom.cell;
    if (this.cubes[oldCell.row][oldCell.column]===cube){  //删除旧位置信息
      this.cubes[oldCell.row][oldCell.column]=null;
    }
    // else if(this.cubes[oldCell.row][oldCell.column]&&this.cubes[oldCell.row][oldCell.column]!==cube){//当前位置已存在
    //   if (cell.row>=this.cubes.length-2){
    //     cc.warn("move to top");
    //     return;
    //   }
    //   cell.row+=1;
    // }

    this.cubes[cell.row][cell.column]=cube;
    cubeCom.setCellPos(cell);
  },

  getCube(row,column){
    return this.cubes[row][column];
  },

  setCube(row,column,cube){
    if (this.cubes[row][column]){
      cc.warn("can not set,cell is not nil");
      return;
    }
    this.cubes[row][column]=cube;
  },

  levelChange(level){
    if (level>this.maxLevel){
      this.maxLevel=level;
      this.showStarDes(this.maxLevel);
    }
  },

  update (dt) {
    // this.checkFallingDownPosition();
    if(this.isPause){
      return;
    }
    this.leftTime-=dt;
    if (this.leftTime<=0){
      this.addNewLine();
      this.leftTime=this.newLineTime;
    }
  },

  isDead(){
    let topLine=this.cubes[this.cubes.length-1];
    for (let i=0;i<topLine.length;i++){
      if (topLine[i]){
        return true;
      }
    }
    return false;
  },

  addNewLine(){
    if(this.isDead()){
      this.gameOver();
      return;
    }
    cc.game.emit("add-new-line");
    for(let i=0;i<this.cubes.length;i++) {
      let row=this.cubes[i];
      for (let j=0;j<row.length;j++) {
        let cube=row[j];
        if (!cube){
          continue;
        }
        // if (cube.getComponent("cube").state!==CubeState.Normal){
        //   continue;
        // }
        cube.emit("move-up");
        // this.cubes[i][j]=null;
      }
    }

    for (let i=0;i<this.columnCount;i++){
      let cube=this.createCube({row:0,column:i});
      cube.y=-cube.height/2;
      this.cubes[0][i]=cube;
      // cube.emit("move-up");
    }
  },
  gameOver(){
    this.isPause=true;
    this.mainNode.getComponent(cc.Animation).play("game-over");
  },
  createCube(cell){
    let cube=cc.instantiate(this.cubePrefabs[0]);
    cube.getComponent("cube").init(cell,this.randLevel());
    cube.x=this.space+cube.width/2+(cube.width+this.space)*cell.column;
    cube.y=this.space+cube.height/2+(cube.height+this.space)*cell.row;
    cube.parent=this.gameNode_;
    return cube;
  },
  playBombSound(){
    this.au_.play();
  },

  showStarDes(index){
    let node=cc.find("star-description");
    if (!node){
      cc.warn("star-description is not find");
      return;
    }
    node.getComponent(node.name).init(index);
    node.active=true;
  },
  hideStarDes(index){
    let node=cc.find("star-description");
    if (!node){
      cc.warn("star-description is not find");
      return;
    }
    // node.getComponent(node.name).init(index);
    node.active=false;
  }
});

window.gameManager=new GameManager();
