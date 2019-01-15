import {easing, tween, stagger, spring} from 'popmotion';
import * as THREE from 'three';

export class AnimationBase {
  protected animateList: any = [];
  public myAnimation: any;

  public tweenObjsByPosition(objs: THREE.Object3D[], endPositions: THREE.Vector3[], duration?: any, finishCallBack?: any) {
    objs.forEach((obj, index) => {
      this.animateList.push(tween({
        from: obj.position.toArray(),
        to: endPositions[index].toArray(),
        duration: duration ? duration : 2000,
        ease: easing.circIn
      }));
    });
    this.myAnimation = stagger(this.animateList, 100)
      .start({
        complete: () => {
          if (finishCallBack) {
            finishCallBack();
          }
        },
        update: (values: any) => {
          values.forEach((v: any, index: any) => {
            objs[index].position.fromArray(v);
          });
        }
      });
  }

  public tweenObjsByMatrix(objs: THREE.Object3D[], endMats: THREE.Matrix4[], duration?: any, finishCallBack?: any) {
    objs.forEach((obj, index) => {
      this.animateList.push(tween({
        from: obj.matrix.toArray(),
        to: endMats[index].toArray(),
        duration: duration ? duration : 2000,
        ease: easing.circIn,
      }));
    });
    this.myAnimation = stagger(this.animateList, 100)
      .start({
        complete: () => {
          if (finishCallBack) {
            finishCallBack();
          }
        },
        update: (values: any) => {
          values.forEach((v: any, index: any) => {
            objs[index].matrix.fromArray(v);
            let pos = objs[index].position;
            let qua = objs[index].quaternion;
            let scale = objs[index].scale;
            objs[index].matrix.decompose(pos, qua, scale);
          });
        }
      });
  }

  public springByPosition(objs: THREE.Object3D[], endPositions: THREE.Vector3[], stiffness?: any, damping?: any, finishCallBack?: any) {
    objs.forEach((obj, index) => {
      this.animateList.push(spring({
        from: obj.position.toArray(),
        to: endPositions[index].toArray(),
        stiffness: stiffness ? stiffness : 100,
        damping: damping ? damping : 10,
      }));
    });
    this.myAnimation = stagger(this.animateList, 100)
      .start({
        complete: () => {
          if (finishCallBack) {
            finishCallBack();
          }
        },
        update: (values: any) => {
          values.forEach((v: any, index: any) => {
            objs[index].position.fromArray(v);
          });
        }
      });
  }

  public springByMatrix(objs: THREE.Object3D[], endMats: THREE.Matrix4[], stiffness?: any, damping?: any, finishCallBack?: any) {
    objs.forEach((obj, index) => {
      this.animateList.push(spring({
        from: obj.matrix.toArray(),
        to: endMats[index].toArray(),
        stiffness: stiffness ? stiffness : 100,
        damping: damping ? damping : 10,
      }));
    });
    this.myAnimation = stagger(this.animateList, 100)
      .start({
        complete: () => {
          if (finishCallBack) {
            finishCallBack();
          }
        },
        update: (values: any) => {
          values.forEach((v: any, index: any) => {
            objs[index].matrix.fromArray(v);
            let pos = objs[index].position;
            let qua = objs[index].quaternion;
            let scale = objs[index].scale;
            objs[index].matrix.decompose(pos, qua, scale);
          });
        }
      });
  }

  public stopAnimation() {
    if (this.myAnimation) {
      this.myAnimation.stop();
    }
  }
}
