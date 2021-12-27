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


import envConifg from "../config/earth.config";
import mapImg from '../assets/images/map.png'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default defineComponent ({
  setup() {
    const mapRef = ref();

    const worldDotRows = 180; // 密度
    const worldDotSize = .1

    const Ml = Math.PI / 180
    const GLOBE_RADIUS = 25  // 半径

    const scene = new THREE.Scene();
    const container = new THREE.Group();
    const axisHelper = new THREE.AxesHelper(120);
    let renderer = {};
    let camera = {};
    let orbitControls = {};
    let worldMesh = [];

    function Rl(t, e, n, i) {
      i = i || new THREE.Vector3;
      const r = (90 - t) * Ml
        , s = (e + 180) * Ml;
      return i.set(-n * Math.sin(r) * Math.cos(s), n * Math.cos(r), n * Math.sin(r) * Math.sin(s)),
      i
    }

    function initOrbitControls() {
      const os = new OrbitControls(camera, renderer.domElement);
      os.target = new THREE.Vector3(0, 0, 0); //控制焦点
      // os.autoRotate = false; //将自动旋转关闭
      // os.enablePan = false; // 不禁止鼠标平移, 可以用键盘来平移
      os.enableZoom = true; //禁止缩放
      // os.enableRotate = false; //禁止旋转
      os.maxDistance = 1000; // 最大外移动
      os.minDistance = 100; // 向内最小外移动
      orbitControls = os;
    }

    function getImageData(t) {
        const e = document.createElement("canvas").getContext("2d");
        return e.canvas.width = t.width,
        e.canvas.height = t.height,
        e.drawImage(t, 0, 0, t.width, t.height),
        e.getImageData(0, 0, t.width, t.height)
    }

    function visibilityForCoordinate(t, e, n) {
      const i = 4 * n.width
        , r = parseInt((t + 180) / 360 * n.width + .5)
        , s = n.height - parseInt((e + 90) / 180 * n.height - .5)
        , o = parseInt(i * (s - 1) + 4 * r) + 3;
      return n.data[o] > 90
    }

    function animate() {
      orbitControls.update();
      // 地球自转
      // mesh.earth.rotation.y -= 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    
    onMounted(() => {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      const {width, height} = mapRef.value.parentNode.getBoundingClientRect();
      renderer.setSize(width, height);
      // renderer.setClearColor(0xffffff, 1.0);
      
      camera = new THREE.PerspectiveCamera(20, width / height, 1,260)
      // camera = new THREE.PerspectiveCamera(20, width / height, 170,260)
      // camera = new THREE.PerspectiveCamera(
      //   60,
      //   width / height,
      //   1,
      //   2000
      // );
      mapRef.value.appendChild(renderer.domElement);

     
      const img = new Image();
      img.onload = () => {
        const light = new THREE.Light()
        const map = getImageData(img);
        for (let lat = -90; lat <= 90; lat += 180/worldDotRows) {
          const list = [];
          const radius = Math.cos(Math.abs(lat) * Ml) * GLOBE_RADIUS;
          const circumference = radius * Math.PI * 2;
          const dotsForLat = circumference * 2;
          for (let x = 0; x < dotsForLat; x++) {
            const long = -180 + x*360/dotsForLat;
            if (!visibilityForCoordinate(long, lat, map)) continue;
            const start = Rl(lat, long, GLOBE_RADIUS);
            light.position.set(start.x, start.y, start.z); 
            const end = Rl(lat, long, GLOBE_RADIUS + 5);
            light.lookAt(end.x, end.y, end.z); 
            light.updateMatrix()
            list.push(light.matrix.clone())
          }

          const geometry = new THREE.CircleBufferGeometry(worldDotSize,5);
          const material = new THREE.MeshStandardMaterial({
            color: 3818644,
            metalness: 0,
            roughness: .9,
            // transparent: !0,
            side: THREE.DoubleSide,
            alphaTest: .02
          });
          material.onBeforeCompile = function(t) {
            t.fragmentShader = t.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "\n        gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n        if (gl_FragCoord.z > 0.51) {\n          gl_FragColor.a = 1.0 + ( 0.51 - gl_FragCoord.z ) * 17.0;\n        }\n      ")
          }
          const meshs = new THREE.InstancedMesh(geometry, material, list.length);
          for (let i = 0; i < list.length; i++)
            meshs.setMatrixAt(i, list[i]);
          
          meshs.renderOrder = 3
          
          worldMesh = meshs;

          meshs.name = 'points';

          container.add(meshs)
        }

        scene.add(container)
        scene.add(axisHelper)
         initOrbitControls();
        console.log(container);
        console.log(scene);
        renderer.render(scene, camera)
        animate()
      }
      img.src = envConifg.base;
      
      

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