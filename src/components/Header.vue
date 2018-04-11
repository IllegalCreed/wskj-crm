<template>
<div class="root-container">
    <router-link :to="{ path: '/home' }">
      <img height="60" width="170" src="../assets/logo.png" alt="">
    </router-link>
    <div class="user-container">
      <h3 class="userName">{{userName}}</h3>
      <Button type="primary" size="small" @click="handleLogout">注销</Button>
    </div>
</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      userName: "老苏"
    };
  },
  methods: {
    ...mapActions({
      logout: "logout"
    }),
    handleLogout (event) {
      this.logout();
      this.$router.push({ path: "/login" })
    }
  }
};
</script>

<style scoped>
.root-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0px 30px;
  background-color: #494f5f;
  border-bottom: 1px solid #bfbfbf;
}
.user-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.userName {
  color: white;
  margin-right: 20px;
}
</style>
