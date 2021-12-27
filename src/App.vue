<template>
<div>
  <cc-map3 id="map"></cc-map3>
  <cc-map1 id="map"></cc-map1>
  <!-- <cc-map2 id="map2"></cc-map2> -->
</div>
</template>

<script>

import ccMap1 from "./components/cc_map.vue";
import ccMap2 from "./components/cc_map2.vue";
import ccMap3 from "./components/cc_map3.vue";
export default {
  name: "App",
  components: {
    ccMap1,
    ccMap2,
    ccMap3
  },
};
</script>

<style>
#app {
  overflow: hidden;
  border: 1px solid #ccc;
  width: 700px;
  height: 2000px;
  margin: 20px auto;
}
</style>