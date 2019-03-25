import {TamuCombinationBaseImpl} from './base/tamu.combination.base.impl';
import * as THREE from 'three';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuGeometry} from 'tamujs';

export class CustomCombination extends TamuCombinationBaseImpl {

  public localMaterial: any;

  public pushMaterial: any;

  constructor() {
    super();
    this.width = 800;
    this.height = 800;
    this.materialData = [];
  }

  public makeObjects(option?: any): Promise<THREE.Geometry> {
    this.width = option.width;
    this.height = option.height;
    this.localMaterial = option.material;
    this.pushMaterial = option.pushMaterial;
    return new Promise<THREE.Geometry>(resolve => {
      new THREE.FBXLoader().load(option.url, obj => {
        resolve(this.mergeGeometry(obj));
      });
    });
  }

  public mergeGeometry(obj: THREE.Object3D): THREE.Geometry {
    let geo = new TamuGeometry();
    let index = 0;
    obj.traverse(child => {
      if (child instanceof THREE.Mesh) {
        geo.merge(new THREE.Geometry().fromBufferGeometry(<THREE.BufferGeometry>child.geometry), new THREE.Matrix4(), index);
        if (this.pushMaterial) {
          this.materialData.push(Object.assign({}, JSON.parse(JSON.stringify(this.localMaterial)), {uuid: FlooringplanUtil.guid()}));
        }
        index++;
      }
    });
    console.log('matertialData list====', this.materialData);
    return geo;
  }
}
