<template>
  <div class="search-container">
    <v-text-field
      placeholder="搜索"
      v-model="query"
      clearable
      @keyup.enter="onSearch"
    />
  </div>
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

<style lang="scss" scoped>

.search-container {
  width: 40vh;
}
</style>
