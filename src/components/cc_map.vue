<template>
  <div class="map" ref="mapRef"></div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

    const axisHelper = new THREE.AxesHelper(120);
    const textureLoader = new THREE.TextureLoader();

    // 初始化树
    function initTHREE() {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(mapRef.value.clientWidth, mapRef.value.clientHeight);
      renderer.setClearColor(0xffffff, 1.0);
      mapRef.value.appendChild(renderer.domElement);
    }

    // 初始化相机
    function initCamera() {
      camera = new THREE.PerspectiveCamera(
        45,
        mapRef.value.clientWidth / mapRef.value.clientHeight,
        1,
        2000
      );
      camera.position.z = 300;
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
      os.maxDistance = 1000; // 最大外移动
      os.minDistance = 100; // 向内最小外移动
      orbitControls = os;
    }

    function initBg() {
      // 把背景图加载过来当做纹理。
      const texture = textureLoader.load(envConifg.earthBg);
      // 这个绘制球体
      const geometry = new THREE.SphereGeometry(envConifg.r, 50, 50);
      // 放入纹理
      const material = new THREE.MeshLambertMaterial({
        map: texture,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    function glRender() {
      renderer.render(scene, camera);
      requestAnimationFrame(glRender);
    }
    onMounted(() => {
      initTHREE();
      initCamera();
      initScene();
      initAxisHelper();
      initLight();
      initOrbitControls();
      initBg();
      glRender();
    });

    return {
			mapRef
		}
  },
})

</script>

<style scoped>
.map {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>