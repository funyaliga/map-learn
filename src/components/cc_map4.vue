<template>
  <div class="wrap">
    <div class="map" ref="mapRef"></div>
    <!-- <div class="shadows"></div>
    <div class="light"></div> -->
    <div class="test"></div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import worldGeo from "../assets/geojson/world.geo";
import countryLine from "../utils/countryLine";

console.log(worldGeo)

import envConifg from "../config/earth.config";
import starPng from "./a60226ea.png";
import earthPng from "./97ab87cd.png";
import earth2Png from "../assets/images/世界地图1.png";
export default defineComponent ({
  setup() {
    const mapRef = ref();

    // 场景
    let scene = new THREE.Scene();
    // 模型
    let mesh = {};
    // 相机
    let camera = {};
    // 相机设置
    let renderer = {};

    let controls = {};

    let group = new THREE.Group();


    const r = 120; // 半径
    const radius = 120; // 半径

    const axisHelper = new THREE.AxesHelper(120);
    const textureLoader = new THREE.TextureLoader();

    function initRenderer() {
      renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( mapRef.value.clientWidth, mapRef.value.clientHeight );
      mapRef.value.appendChild( renderer.domElement );
    }

    function initCamera() {
      camera = new THREE.PerspectiveCamera( 72, mapRef.value.clientWidth / mapRef.value.clientHeight, 1, 10000 );
      camera.position.set( 5, - 20, 200 );
      camera.lookAt( 0, 3, 0 );
    }

    /**
     * @description 初始化场景
     */
    function initScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0x020924 );
      scene.fog = new THREE.Fog( 0x020924, 200, 1000 );
    }

    function initControls() {
      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = true;
      controls.enableZoom = true;
      controls.autoRotate = false;
      controls.autoRotateSpeed = 2;
      controls.enablePan = true;
    }

    function initLight() {
      const ambientLight = new THREE.AmbientLight( 0xcccccc, 1.1 );
      scene.add( ambientLight );
      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
      directionalLight.position.set( 1, 0.1, 0 ).normalize();
      var directionalLight2 = new THREE.DirectionalLight( 0xff2ffff, 0.2 );
      directionalLight2.position.set( 1, 0.1, 0.1 ).normalize();
      scene.add( directionalLight );
      scene.add( directionalLight2 );
      var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.2 );
      hemiLight.position.set( 0, 1, 0 );
      scene.add( hemiLight );
      var directionalLight = new THREE.DirectionalLight( 0xffffff );
      directionalLight.position.set( 1, 500, - 20 );
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.top = 18;
      directionalLight.shadow.camera.bottom = - 10;
      directionalLight.shadow.camera.left = - 52;
      directionalLight.shadow.camera.right = 12;
      scene.add(directionalLight);
    }

    /**
   * @description 渲染
   */
    function renders() {
      renderer.clear();
      renderer.render( scene, camera );
    }

    function renderStar() {
      const positions = [];
      const colors = [];
      const geometry = new THREE.BufferGeometry();
      for (var i = 0; i < 10000; i ++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        positions.push( vertex.x, vertex.y, vertex.z );
        var color = new THREE.Color();
        color.setHSL( Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55 );
        colors.push( color.r, color.g, color.b );
      }
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

      const texture = textureLoader.load(starPng);

      var starsMaterial = new THREE.ParticleBasicMaterial( {
        map: texture,
        size: 1,
        transparent: true,
        opacity: 1,
        vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      } );

      let stars = new THREE.ParticleSystem( geometry, starsMaterial );
      stars.scale.set( 300, 300, 300 );
      scene.add( stars );
    }

    // 椭圆体
    function renderEllipsoid() {
      const geometry = new THREE.SphereGeometry( radius, 100, 100 );
      // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      geometry.applyMatrix( new THREE.Matrix4().makeScale( 1.0, 0.8, 0.8 ) );
      const msh = new THREE.Mesh( geometry, material );
      scene.add( msh );
    }

    function initEarth() {
      var globeGgeometry = new THREE.SphereGeometry( radius, 100, 100 );
      const texture = textureLoader.load(earthPng);
      var globeMaterial = new THREE.MeshStandardMaterial( { map: texture } );
      var globeMesh = new THREE.Mesh( globeGgeometry, globeMaterial );
      group.rotation.set( 0.5, 2.9, 0.1 );
      group.add( globeMesh );
      scene.add( group );
    }


    /**
     * 更新
     **/
    function animate() {
      if (controls) controls.update();
      // mesh.test.rotation.y += .001;
      group.rotation.y += .001;
      renders();
      requestAnimationFrame(animate);
    }

    onMounted(() => {
      initRenderer();
      initCamera();
      initScene();
      initLight();
      initControls();
      renderStar();

        initEarth();
      animate();
    });

    return {
      mapRef
    }
  },
})

</script>

<style scoped>
.wrap{
  position: relative;
  width: 700px;
  height: 700px;
}
.map {
  box-sizing: border-box;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background-image: url(../assets/images/地球底色.png);
  overflow: hidden;
}

.shadows,.light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  z-index: 10;
}
.shadows {
  background-image: url(../assets/images/阴影-柔光.png);
  background-size: cover;
  mix-blend-mode: soft-light;
}
.light {
  background-image: url(../assets/images/高光-颜色减淡.png);
  background-size: cover;
  mix-blend-mode: color-dodge;
}

/* .test{
  background: #000;
  width: 50%;
  height: 200px;
  position: absolute;
  top: 300px;
  left: 0;
} */
</style>