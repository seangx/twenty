/**
 * Created by Joker on 2018/6/7.
 */
var ConfigManager=cc.Class({
  properties:{

  },
  init(){
    this.starConfig={
      "Neptune":{
        "name":"海王星",
        "radius":45000000000,
        "diameter":49532
      },
      "Uranus":{
        "name":"天王星",
        "radius":28700000000,
        "diameter":51118
      },
      "Saturn":{
        "name":"土星",
        "radius":14300000000,
        "diameter":120536
      },
      "Jupiter":{
        "name":"木星",
        "radius":7783000000,
        "diameter":142984
      },
      "Mars":{
        "name":"火星",
        "radius":2279000000,
        "diameter":6780
      },
      "Earth":{
        "name":"地球",
        "radius":1496000000,
        "diameter":12756
      },
      "Venus":{
        "name":"金星",
        "radius":1082000000,
        "diameter":12140
      },
      "Mercury":{
        "name":"水星",
        "radius":579000000,
        "diameter":4875
      }
    };
    this.levelConfig=[
      "Neptune",
      "Uranus",
      "Saturn",
      "Jupiter",
      "Mars",
      "Earth",
      "Venus",
      "Mercury"
    ];
  },
  getNameByIndex(i){
    return this.levelConfig[i];
  },
  getStarConfigByIndex(i){
    return this.starConfig[this.getNameByIndex(i)];
  },
});

window.configManager=new ConfigManager();