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
    space: 20,

    cubes: [],
    cubeTemplate:cc.Node,
    cubePrefabs:[],
    gameNode_: null,

    halfWidth:0,
    halfHeight:0,
  },

  init(prefabs) {
    this.gameNode_ = cc.find("/Canvas/game-node", cc.director.getRunningScene());
    this.cubePrefabs=prefabs;

    this.halfWidth=this.gameNode_.width/2;
    this.halfHeight=this.gameNode_.height/2;

    this.cubeTemplate=cc.instantiate(this.cubePrefabs[0]);

    this.initCubes();
    cc.log("game manager init");
  },

  randColorCube(){
    let max=CubeColors.Blue+1;
    let color=Math.floor(Math.random()*10)%max;
    return cc.instantiate(this.cubePrefabs[color]);
  },

  initCubes() {
    this.cubes=[];
    for (let i=0;i<this.rowCount;i++){
      this.cubes.push([]);
      let tmp=[]
      for (let j=0;j<this.columnCount;j++){
        tmp.push(null);
      }
      this.cubes.push(tmp);
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < this.columnCount; j ++) {
        let cube=this.randColorCube();
        if (!cube){
          cc.error("init cube fail");
          return;
        }
        // cube.getComponent("cube").init();
        cube.x=this.space+cube.width/2+(cube.width+this.space)*j;
        cube.y=this.space+cube.height/2+(cube.height+this.space)*i;
        cube.parent=this.gameNode_;

        this.cubes[i][j]=cube;
      }
    }
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
    return position;
  },

  //dir:-1 or 1
  getLimitPosition(touchPos,node){
    let position=this.posToPoint(touchPos);

    let point=cc.p(0,0);

    if (!position.row>=this.cubes.length){
      cc.error("invalid row count");
      return;
    }
    for (let i=0;i<=position.column;i++){
      let cube=this.cubes[position.row][i];
      if (!cube){
        continue;
      }
      if (node === cube) {
        continue;
      }
      if (touchPos.x-node.x > 0){
        point.x=cube.x-this.space-cube.width;
        break;
      }else{
        point.x=cube.x+this.space+cube.width;
        break;
      }
    }

    for (let i=0;i<=position.row;i++){
      let cube=this.cubes[i][position.column];
      if (!cube){
        continue;
      }
      if (node === cube) {
        continue;
      }
      if (touchPos.y-node.y > 0){
        point.y=cube.y-this.space-cube.height;
        break;
      }else{
        point.y=cube.y+this.space+cube.height;
        break;
      }
    }

    return point;
  },

  update (dt) {
    
  },
});

window.gameManager=new GameManager();
