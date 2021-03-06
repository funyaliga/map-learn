<template>
  <div class="wrap">
    <div class="map" ref="mapRef"></div>
    <div class="shadows"></div>
    <div class="light"></div>
    <div class="test"></div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import worldGeo from "../assets/geojson/world.geo";
import countryLine from "../utils/countryLine";
import lightHelp from "../utils/lightHelp";
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

    let container = new THREE.Group();
    let parentContainer = new THREE.Group();
    let group = new THREE.Group();

    const Ml = Math.PI / 180
    const worldDotRows = 120; // 密度
    const worldDotSize = 1

    const GLOBE_RADIUS = 120; // 半径

    const axisHelper = new THREE.AxesHelper(120);
    const textureLoader = new THREE.TextureLoader();
    
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

    function Rl(t, e, n, i) {
      i = i || new THREE.Vector3;
      const r = (90 - t) * Ml, s = (e + 180) * Ml;
      return i.set(-n * Math.sin(r) * Math.cos(s), n * Math.cos(r), n * Math.sin(r) * Math.sin(s)),
      i
    }

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
      scene.add(container)
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
      directionalLight2.position.set( 100, 0.1, 0.1 ).normalize();
      scene.add( directionalLight );
      scene.add( directionalLight2 );

      const lightHelper = new THREE.SpotLightHelper( directionalLight2 );
      scene.add(lightHelper);

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

      lightHelp(scene, directionalLight)
    }

    /**
   * @description 渲染
   */
    function renders() {
      renderer.clear();
      renderer.render( scene, camera );
    }

     function renderMapBg() {
      let canvas = document.createElement( 'canvas' );
      canvas.width = 256;
      canvas.height = 256;
      let context = canvas.getContext( '2d' );
      let gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );//创建一个圆形渐变对象
      gradient.addColorStop( 0.1, 'rgba(119,135,234,1)' );//内圈的颜色
      gradient.addColorStop( 1, 'rgba(181,198,248,1)' );//最外面的颜色
      context.fillStyle = gradient;
      context.fillRect( 0, 0, canvas.width, canvas.height );
      let shadowTexture = new THREE.CanvasTexture( canvas );//把刚刚画好的画布拿来作为画布贴图
      let shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture,transparent:true } );//用此贴图来当材质
      var geometry = new THREE.SphereBufferGeometry( GLOBE_RADIUS, 32, 32 ); 
      var sphere = new THREE.Mesh( geometry, shadowMaterial ); 
      scene.add( sphere );
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

    function renderMap() {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const map = getImageData(img);
          const light = new THREE.Light('#ffffff')
          const list = [];
          for (let lat = -90; lat <= 90; lat += 180/worldDotRows) {
            const radius = Math.cos(Math.abs(lat) * Ml) * GLOBE_RADIUS;
            const circumference = radius * Math.PI * 2; // 周长
            const dotsForLat = circumference * 0.4; // 维度点
            for (let x = 0; x < dotsForLat; x++) {
              const long = -180 + x * 360/dotsForLat;
              if (!visibilityForCoordinate(long, lat, map)) continue;
              const start = Rl(lat, long, GLOBE_RADIUS);
              light.position.set(start.x, start.y, start.z); 
              const end = Rl(lat, long, GLOBE_RADIUS + 5);
              light.lookAt(end.x, end.y, end.z); 
              light.updateMatrix()
              list.push(light.matrix.clone())
            }
          }
          const geometry = new THREE.CircleBufferGeometry(worldDotSize, 36);
          const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            // metalness: 0,
            roughness: .9,
            // transparent: !0,
            side: THREE.DoubleSide,
            // alphaTest: .02
          });
          material.onBeforeCompile = function(t) {
            t.fragmentShader = t.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "\n        gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n        if (gl_FragCoord.z > 0.51) {\n          gl_FragColor.a = 1.0 + ( 0.51 - gl_FragCoord.z ) * 17.0;\n        }\n      ")
          }
          const meshs = new THREE.InstancedMesh(geometry, material, list.length);
          for (let i = 0; i < list.length; i++) {
            meshs.setMatrixAt(i, list[i]);
          }
          
          meshs.renderOrder = 3

          meshs.name = 'points';

          container.add(meshs)
          container.rotation.set( 0.5, 2.9, 0.1 );
          resolve();
        }
        img.src = envConifg.base;
      })
    }

    /**
     * 更新
     **/
    function animate() {
      if (controls) controls.update();
      // mesh.test.rotation.y += .001;
      container.rotation.y += .001;
      renders();
      requestAnimationFrame(animate);
    }

    onMounted(() => {
      initRenderer();
      initCamera();
      initScene();
      initLight();
      initControls();
      // renderStar();
      // renderMapBg();
      renderMap();

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
  pointer-events: none;
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


</style>