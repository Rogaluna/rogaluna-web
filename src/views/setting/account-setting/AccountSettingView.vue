<template>
  <div class="form-container">
    <v-form ref="form" v-model="valid">
      <!-- 用户 ID（不可修改） -->
      <v-text-field
        v-model="formData.userId"
        label="用户ID"
        readonly
        outlined
        disabled
        dense>
        <div slot="prepend">
          <svg class="__icon__s"
            aria-hidden="true"
            icon>
            <use xlink:href="#rogaluna-icon-idcard"></use>
          </svg>
        </div>
      </v-text-field>

      <!-- 用户名（可修改） -->
      <v-text-field
        v-model="formData.username"
        label="用户名"
        :rules="[rules.required]"
        outlined
        dense
        clearable>
        <div slot="prepend">
          <svg class="__icon__s importable"
            aria-hidden="true"
            icon>
            <use xlink:href="#rogaluna-icon-user"></use>
          </svg>
        </div>
      </v-text-field>

      <!-- 密码（可修改） -->
      <v-text-field
        v-model="formData.password"
        label="修改密码"
        type="password"
        :rules="[rules.required, rules.min]"
        outlined
        dense
        clearable>
        <div slot="prepend">
          <svg class="__icon__s importable"
            aria-hidden="true"
            icon>
            <use xlink:href="#rogaluna-icon-lock"></use>
          </svg>
        </div>
      </v-text-field>

      <!-- 权限（不可修改） -->
      <v-text-field
        v-model="formData.authority"
        label="权限"
        readonly
        outlined
        disabled
        dense>
        <div slot="prepend">
          <svg class="__icon__s"
            aria-hidden="true"
            icon>
            <use xlink:href="#rogaluna-icon-securityscan"></use>
          </svg>
        </div>
      </v-text-field>

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
          @click="fetchData"
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
import getAccountInfoAPI from "@/plugins/axios/api/account/getAccountInfo";
import modifyAccountInfoAPI from "@/plugins/axios/api/account/modifyAccountInfo";
import Cookies from "js-cookie";
import ConfirmModifyDialog from "./components/ConfirmModifyDialog.vue";

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
      getAccountInfoAPI()
        .then(response => {
          this.formData = {
            password: "",
            ...response.data
          };
        })
    },
    saveSettings() {
      if (this.$refs.form.validate()) {
        this.$rogalunaWidgets.showDialog(
          ConfirmModifyDialog,
          {},
          {
            confirm: (oldPassword) => {
              modifyAccountInfoAPI(this.formData.username, this.formData.password, oldPassword)
                .then(response => {
                  if (response.success) {
                    this.$rogalunaWidgets.showSnackbar("已更新账户信息。");
                    // 清除原有 token ，重新登录
                    Cookies.remove("token");
                    window.location.reload()
                  } else {
                    this.$rogalunaWidgets.showSnackbar("账户信息修改失败！");
                  }
                })
            }
          }
        )
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

  .importable {
    color: var(--primary-color);
  }
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}
</style>
