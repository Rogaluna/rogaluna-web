<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card
      class="pa-5"
      width="400"
      elevation="10"
      outlined
    >
      <v-card-title class="text-h5">注册</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="register" ref="form">
          <!-- 用户名输入框 -->
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            label="用户名"
            outlined
            required
            dense
            :error-messages="usernameError"
            @input="validateUsername"
          ></v-text-field>

          <!-- 密码输入框 -->
          <v-text-field
            v-model="password"
            label="密码"
            type="password"
            outlined
            required
            dense
            :rules="passwordRules"
          ></v-text-field>

          <!-- 确认密码输入框 -->
          <v-text-field
            v-model="confirmPassword"
            label="确认密码"
            type="password"
            outlined
            required
            dense
            :rules="confirmPasswordRules"
          ></v-text-field>

          <v-btn color="primary" class="mt-4" type="submit" block>注册</v-btn>
        </v-form>

        <v-divider class="my-4"></v-divider>

        <v-btn color="secondary" class="mt-2" block @click="goToLogin">已有账号？登录</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import registerAPI from '@/plugins/axios/api/account/register';

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      usernameError: '',
    };
  },
  computed: {
    // 验证密码和确认密码是否匹配
    confirmPasswordRules() {
      return [
        v => !!v || '确认密码不能为空',
        v => v === this.password || '两次输入的密码不一致',
      ];
    },
    // 验证密码输入
    passwordRules() {
      return [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码至少6位',
      ];
    },
    // 验证用户名（不能包含特殊字符）
    usernameRules() {
      return [
        v => !!v || '用户名不能为空',
        v => /^[a-zA-Z0-9]+$/.test(v) || '用户名不能包含特殊字符',
      ];
    },
  },
  methods: {
    register() {
      // 确保所有表单验证通过
      if (this.$refs.form.validate()) {
        registerAPI(this.username, this.password);
      }
    },
    // 验证用户名输入
    validateUsername() {
      if (!/^[a-zA-Z0-9]+$/.test(this.username)) {
        this.usernameError = '用户名不能包含特殊字符';
      } else {
        this.usernameError = '';
      }
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
