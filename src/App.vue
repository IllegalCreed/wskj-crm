<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "App",
  mounted() {
    this.getMetadataList();
    this.getRoleList();
  },
  methods: {
    ...mapActions({
      getMetadataList: "getMetadataList",
      getRoleList: "getRoleList"
    })
  }
};
</script>

<style>
#app {
  height: 100%;
}
</style>
