<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">确认删除</v-card-title>

      <v-card-subtitle>{{ initData.message }}</v-card-subtitle>

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
  props: {
    initData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      visible: true, // 控制对话框的显示
    };
  },
  methods: {
    async confirm() {
      this.$emit('confirm');
      this.$emit('close');
    },
    cancel() {
      // 取消操作，关闭对话框
      this.$emit('cancel');
      this.$emit('close'); // 用于触发销毁逻辑
    }
  }
};
</script>
