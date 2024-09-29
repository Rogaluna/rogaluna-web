<template>
  <v-container class="library-center-view" fluid>
    <!-- 搜索栏组件 -->
    <SearchBar @search="handleSearch" />

    <!-- 搜索结果列表 -->
    <v-list v-if="books.length > 0">
      <ListItem
        v-for="(book, index) in books"
        :key="index"
        :book="book"
      />
    </v-list>
    <v-alert v-else type="info" dismissible>
      No books found. Please search again.
    </v-alert>
  </v-container>
</template>

<script>
import SearchBar from './components/SearchBar.vue';
import ListItem from './components/ListItem.vue';

export default {
  name: 'LibraryCenterView',
  components: {
    SearchBar,
    ListItem,
  },
  data() {
    return {
      books: [], // 存储搜索结果的书籍数组
    };
  },
  methods: {
    handleSearch(query) {
      // 模拟书籍数据，根据搜索查询返回结果
      this.books = this.mockSearch(query);
    },
    mockSearch(query) {
      // 模拟搜索结果
      const allBooks = [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        { title: 'Moby Dick', author: 'Herman Melville' },
        { title: '1984', author: 'George Orwell' },
      ];
      return allBooks.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    },
  },
};
</script>

<style scoped>
.library-center-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;

  width: 100%;
}
</style>