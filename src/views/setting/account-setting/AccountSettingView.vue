<template>
  <div class="form-container">
    <v-form ref="form" v-model="valid" lazy-validation>
      <!-- 用户 ID（不可修改） -->
      <v-text-field
        v-model="formData.userId"
        label="用户ID"
        prepend-icon="mdi-identifier"
        readonly
        outlined
        dense
      ></v-text-field>

      <!-- 用户名（可修改） -->
      <v-text-field
        v-model="formData.username"
        label="用户名"
        :rules="[rules.required]"
        prepend-icon="mdi-account"
        outlined
        dense
        clearable
      ></v-text-field>

      <!-- 密码（可修改） -->
      <v-text-field
        v-model="formData.password"
        label="密码"
        type="password"
        :rules="[rules.required, rules.min]"
        prepend-icon="mdi-lock"
        outlined
        dense
        clearable
      ></v-text-field>

      <!-- 权限（不可修改） -->
      <v-text-field
        v-model="formData.authority"
        label="权限"
        prepend-icon="mdi-shield-account"
        readonly
        outlined
        dense
      ></v-text-field>

      <!-- 按钮组 -->
      <div class="button-group">
        <v-btn
          :disabled="!valid"
          color="primary"
          @click="saveSettings"
        >
          保存
        </v-btn>
        <v-btn
          :disabled="!valid"
          @click="saveSettings"
        >
          重置
        </v-btn>
        <v-btn
          color="secondary"
          @click="logout"
        >
          退出登录
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      valid: false,
      formData: {
        userId: "",
        username: "",
        password: "",
        authority: "",
      },
      rules: {
        required: (value) => !!value || "此字段为必填项",
        min: (value) => value.length >= 6 || "密码至少需要6个字符",
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {

    },
    saveSettings() {
      if (this.$refs.form.validate()) {
        console.log("保存设置:", this.formData);
        this.$emit("save", this.formData);
      }
    },
    logout() {
      Cookies.remove("token");
      console.log("已退出登录");
      window.location.reload()
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 500px;
  margin-top: 20px;
  margin-left: 20px;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}
</style>
