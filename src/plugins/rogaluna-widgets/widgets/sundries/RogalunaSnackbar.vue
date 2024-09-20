<!-- RogalunaSnackbar.vue -->
<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    shaped
    bottom
  >
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'RogalunaSnackbar',
  props: {
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      show: true // 控制 Snackbar 是否显示
    };
  }
};
</script>

<style scoped>
/* 你可以根据需要在这里添加样式 */
</style>
