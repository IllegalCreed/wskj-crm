<template>
<div class="root-container">
  <img height="106" width="300" src="../assets/black_logo.png" alt="">
  <Form class="form" ref="loginForm" :model="loginForm" :rules="rules">
    <FormItem prop="user">
      <Input type="text" v-model="loginForm.user" placeholder="手机号">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="loginForm.password" placeholder="密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem>
      <Button long type="primary" @click="handleLogin('loginForm')">登录</Button>
    </FormItem>
  </Form>
</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loginForm: {
        user: "",
        password: ""
      },
      rules: {
        user: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码不得小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      login: "login"
    }),
    handleLogin(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.login({
            phone: this.loginForm.user,
            pwd: this.loginForm.password
          })
            .then(() => {
              this.$Message.success("登录成功!");
              this.$router.push({ path: "/home/chanceManager" });
            })
            .catch(() => {
              this.$Message.error("登录失败!");
            });
        } else {
          this.$Message.error("登录失败!");
        }
      });
    }
  }
};
</script>

<style scoped>
.root-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form {
  margin-top: 50px;
  width: 200px;
}
</style>
