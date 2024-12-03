<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">确认保存</v-card-title>

      <v-card-text>
        <div align="left">
          保存将会丢失旧有的内容
        </div>
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
    };
  },
  methods: {
    async confirm() {
      this.$emit('confirm');
      this.visible = false;
      this.$emit('close');
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
