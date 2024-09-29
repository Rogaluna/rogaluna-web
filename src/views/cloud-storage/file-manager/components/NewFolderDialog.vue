<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">新建文件夹</v-card-title>
      
      <v-card-text>
        <v-form ref="folderForm" v-model="valid">
          <!-- 文件夹名称 -->
          <v-text-field
            label="文件夹名称"
            v-model="form.folderName"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="confirm">确认</v-btn>
        <v-btn color="secondary" @click="cancel">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: true, // 控制对话框的显示
      valid: false,  // 用于表单验证状态
      form: {
        folderName: '' // 文件夹名称
      },
      rules: {
        required: value => !!value || '此字段为必填项', // 验证规则
      }
    };
  },
  methods: {
    async confirm() {
      if (this.$refs.folderForm.validate()) {
        this.$emit('confirm', this.form);
        this.visible = false;
        this.$emit('close');
      }
    },
    cancel() {
      // 取消操作，关闭对话框
      this.$emit('cancel');
      this.visible = false;
      this.$emit('close'); // 用于触发销毁逻辑
    }
  }
};
</script>
