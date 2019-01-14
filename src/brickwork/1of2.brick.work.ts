import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';

export class Oo2BrickWork implements TamuBrickWorkBase {
  private animationUtil: AnimationBase;
  constructor() {}
  public makeObjects(isAnimate?: boolean) {
    if (isAnimate) {
      this.animationUtil = new AnimationBase();
    }
    return {obj: '', positions: [1]}
  }
}
