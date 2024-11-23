<template>
  <v-navigation-drawer
    v-model="visible"
    app
    right
    temporary
    dark
    width="300"
  >
    <v-toolbar flat>
      <v-toolbar-title>播放列表</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDrawer">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "PlayListDrawer",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    closeDrawer() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* 如果需要自定义样式，可以在这里添加 */
</style>
