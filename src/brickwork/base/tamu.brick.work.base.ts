import * as THREE from 'three';
export interface TamuBrickWorkBase {
  /**
   * 返回可以接动画的object3D数组
   * @param data
   * @param size
   * @param isAnimate
   */
  makeObjects(data: any, size: THREE.Vector2, isAnimate?: boolean): {objs: THREE.Object3D[], positions: THREE.Vector3[]};

  /**
   * 返回按照形状拼好的地板object3D
   * @param data
   * @param shape
   */
  makeObject(data: any, shape: THREE.Shape): THREE.Object3D;

  /**
   * 根据大小计算拼法
   * @param data
   * @param start
   * @param size
   */
  makeVertices(data: any, start: THREE.Vector2, size: THREE.Vector2): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][];
}
