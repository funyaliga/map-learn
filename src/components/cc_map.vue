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

    let orbitControls = {};

    const r = 120; // 半径

    const axisHelper = new THREE.AxesHelper(120);
    const textureLoader = new THREE.TextureLoader();

    // 初始化树
    function initTHREE() {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(mapRef.value.clientWidth, mapRef.value.clientHeight);
      // renderer.setClearColor(0xffffff, 1.0);
      mapRef.value.appendChild(renderer.domElement);
    }

    // 初始化相机
    function initCamera() {
      camera = new THREE.PerspectiveCamera(
        60,
        mapRef.value.clientWidth / mapRef.value.clientHeight,
        1,
        2000
      );
      camera.position.z = 240;
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    }
    
    function initScene() {
      scene = new THREE.Scene();
    }
    // 初始辅助线
    function initAxisHelper() {
      scene.add(axisHelper)
    }
    // 初始光源
    function initLight() {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
    }
    // 初始轨道
    function initOrbitControls() {
      const os = new OrbitControls(camera, renderer.domElement);
      os.target = new THREE.Vector3(0, 0, 0); //控制焦点
      os.autoRotate = false; //将自动旋转关闭
      os.enablePan = false; // 不禁止鼠标平移, 可以用键盘来平移
      os.enableZoom = false; //禁止缩放
      // os.enableRotate = false; //禁止旋转
      os.maxDistance = 1000; // 最大外移动
      os.minDistance = 100; // 向内最小外移动
      orbitControls = os;
    }

    // function initBg() {
    //   // 把背景图加载过来当做纹理。
    //   const texture = textureLoader.load(envConifg.bg);
    //   // 这个绘制球体
    //   const geometry = new THREE.SphereGeometry(120, 50, 50);
    //   // 放入纹理
    //   const material = new THREE.MeshLambertMaterial({
    //     map: texture,
    //   });
    //   mesh.earthBg = new THREE.Mesh(geometry, material);
    //   scene.add(mesh.earthBg);
    // }

    function initEarth() {
      // 把背景图加载过来当做纹理。
      const texture = textureLoader.load(envConifg.earth2);
      texture.center.set(0, 0);
      // 这个绘制球体
      const geometry = new THREE.SphereGeometry(r, 50, 50);
      // 放入纹理
      const material = new THREE.MeshLambertMaterial({
        transparent: true,
        map: texture,
      });
      mesh.earth = new THREE.Mesh(geometry, material);
      scene.add(mesh.earth);
    }

    // function initEarth() {
    //   worldGeo.features.forEach((country) => {
    //     if (country.geometry.type === "Polygon") {
    //       country.geometry.coordinates = [country.geometry.coordinates];
    //     }
    //     var line = countryLine(r, country.geometry.coordinates);
    //     scene.add(line);
    //   });
    // }

    function animate() {
      orbitControls.update();
      // 地球自转
      mesh.earth.rotation.y -= 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function glRender() {
      renderer.render(scene, camera);
      requestAnimationFrame(glRender);
    }
    onMounted(() => {
      console.log(mapRef.value);
      initTHREE();
      initCamera();
      initScene();
      // initAxisHelper();
      initLight();
      initOrbitControls();
      // initBg();
      initEarth();
      glRender();
      // animate();
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