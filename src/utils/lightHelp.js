import * as THREE from "three";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils.js";

const lightHelpEnum = {
  DirectionalLight: 'DirectionalLightHelper',
  HemisphereLight: 'HemisphereLightHelper',
  PointLight: 'PointLightHelper',
  SpotLight: 'SpotLightHelper',
}

export default function (scene, light) {
  if(!light) {
    return;
  }

  const { type } = light;
  if(!lightHelpEnum[type]) return;

  const lightHelper = new THREE[lightHelpEnum[type]](light);
  scene.add(lightHelper);

  const sphereGeometry = new THREE.SphereGeometry( 10, 16, 8 );
  const darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  const wireframeMaterial = new THREE.MeshBasicMaterial( 
    { color: light.color || 0xffff00, wireframe: true, transparent: true } ); 
  const shape = new createMultiMaterialObject( 
    sphereGeometry, [ darkMaterial, wireframeMaterial ] );
  shape.position.set.apply(shape.position, Object.values(light.position));
  scene.add( shape );
}