<template>
<div class="root-container">
  <my-header></my-header>
  <div class="main-container">
    <Menu class="menu" theme="dark" :active-name="currentPage" @on-select="navigate">
      <MenuGroup title="CRM管理">
        <MenuItem name="3">
          <Icon type="ios-eye"></Icon>
          机会管理
        </MenuItem>
      </MenuGroup>
      <MenuGroup title="系统管理">
        <MenuItem name="1">
          <Icon type="ios-people"></Icon>
          用户管理
        </MenuItem>
        <MenuItem name="2">
          <Icon type="cube"></Icon>
          元数据管理
        </MenuItem>
      </MenuGroup>
    </Menu>
    <router-view class="router"></router-view>
  </div>
</div>
</template>

<script>
import Header from "../components/Header";
export default {
  data() {
    return {
      currentPage: "3"
    };
  },
  components: {
    "my-header": Header
  },
  mounted() {
    if (this.$router.currentRoute.path.indexOf("user") > -1) {
      this.currentPage = "1";
    } else if (this.$router.currentRoute.path.indexOf("chance") > -1) {
      this.currentPage = "3";
    } else {
      this.currentPage = "2";
    }
  },
  methods: {
    navigate(name) {
      switch (name) {
        case "1":
          this.$router.push({ path: "userManager" });
          break;
        case "2":
          this.$router.push({ path: "metadataManager" });
          break;
        case "3":
          this.$router.push({ path: "chanceManager" });
          break;
        default:
          this.$router.push({ path: "home" });
          break;
      }
    }
  }
};
</script>

<style scoped>
.root-container {
  display: flex;
  flex-direction: column;
  align-content: stretch;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.main-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.router {
  flex: 1;
}
</style>
