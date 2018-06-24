/**
 * Created by Joker on 2018/6/12.
 */
window.Utils={
  safeChangeSpriteFrame(sprite,frame){
    if (!sprite){
      return;
    }
    sprite.spriteFrame=frame;
  },
  safeCall(fn){
    if (fn&&typeof fn==="function"){
      fn.call();
    }
  }
};