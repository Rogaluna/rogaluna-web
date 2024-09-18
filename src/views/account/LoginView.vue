<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card
      class="pa-5"
      width="400"
      elevation="10"
      outlined
    >
      <v-card-title class="text-h5">登录</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="用户名/ID"
            outlined
            required
            dense
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="密码"
            type="password"
            outlined
            required
            dense
          ></v-text-field>

          <v-btn color="primary" class="mt-4" type="submit" block>登录</v-btn>
        </v-form>

        <v-divider class="my-4"></v-divider>

        <v-btn color="secondary" block @click="goToRegister">注册</v-btn>
        <!-- <v-btn color="secondary" class="mt-2" block @click="forgotPassword">忘记密码</v-btn> -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import loginAPI from '@/plugins/axios/api/account/login';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      loginAPI(this.username, this.password)

      // if (this.username === 'admin' && this.password === 'password') {
      //   localStorage.setItem('token', 'your-token');
      //   this.$router.push({ name: 'Home' });
      // } else {
      //   alert('Invalid credentials');
      // }
    },
    goToRegister() {
      this.$router.push({ name: 'register' });
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
