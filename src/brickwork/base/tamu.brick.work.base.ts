import * as THREE from 'three';
export interface TamuBrickWorkBase {
  /**
   * 返回可以接动画的object3D数组
   * @param data
   * @param {THREE.Vector2} size
   * @param {boolean} isAnimate
   * @returns {{objs: THREE.Object3D[]; positions: THREE.Vector3[]}}
   */
  makeObjects(data: any, size: THREE.Vector2, isAnimate?: boolean): {objs: THREE.Object3D[], positions: THREE.Vector3[]};

  /**
   * 返回按照大小拼好的地板object3D
   * @param data
   * @returns {THREE.Object3D}
   */
  makeObject(data: any, size: THREE.Vector2): THREE.Object3D;

  /**
   * 根据大小计算拼法
   * @param data
   * @param {THREE.Vector2} size
   * @returns {THREE.Vector2[]}
   */
  makeVertices(data: any, size: THREE.Vector2): THREE.Vector2[];
}
