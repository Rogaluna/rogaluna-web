
<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ book.title }}</v-list-item-title>
      <v-list-item-subtitle>{{ book.author }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* 根据需要调整样式 */
</style>
