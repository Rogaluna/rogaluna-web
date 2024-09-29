<template>
  <v-text-field
    label="Search for a book"
    v-model="query"
    clearable
    @keyup.enter="onSearch"
  />
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      query: '', // 搜索查询
    };
  },
  methods: {
    onSearch() {
      // 触发父组件的搜索事件
      this.$emit('search', this.query);
    },
  },
};
</script>

<style scoped>
/* 可以根据需要自定义样式 */
</style>
