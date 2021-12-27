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
import * as echarts from 'echarts';
import 'echarts-gl';

import envConifg from "../config/earth.config";
export default defineComponent ({
  setup() {
    const mapRef = ref();

    
    onMounted(() => {
      var myChart = echarts.init(mapRef.value);
      var option;
      option = {
        backgroundColor: '#000',
        globe: {
          baseTexture: envConifg.earthBg,
          displacementScale: 0.04,
          // shading: 'realistic',
          // realisticMaterial: {
          //   roughness: 0.9
          // },
          // postEffect: {
          //   enable: true
          // },
          // light: {
          //   main: {
          //     intensity: 5,
          //     shadow: true
          //   },
          // }
        }
      };

      option && myChart.setOption(option);
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