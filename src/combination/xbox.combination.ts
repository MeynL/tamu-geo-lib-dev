import {TamuCombinationBaseImpl} from './base/tamu.combination.base.impl';
import * as THREE from 'three';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';

export class XboxCombination extends TamuCombinationBaseImpl {
  public readonly materialData: any[] = [
    {
      uuid: FlooringplanUtil.guid(),
      name: '面1',
      opts: {
        map: 'https://resources.wecareroom.com/item/2019/3/WMPNFVLT.jpeg',
      },
    },
    {
      uuid: FlooringplanUtil.guid(),
      name: '面2',
      opts: {
        map: 'https://resources.wecareroom.com/item/2019/3/MNTEKAXQ.jpeg',
      },
    },
  ];

  constructor() {
    super();
  }

  public makeObjects(): Promise<THREE.Geometry> {
    return new Promise<THREE.Geometry>(resolve => {
      new THREE.FBXLoader().load('https://resources.wecareroom.com/item/2019/3/TOBNMKSD', obj => {
        resolve(this.mergeGeometry(obj));
      });
    });
  }
}
