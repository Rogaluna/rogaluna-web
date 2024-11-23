<template>
  <div>
    <v-banner
      single-line
      :sticky="false"
    >
      <svg class="__icon__m"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-tushuguan"></use>
      </svg>
      <span class="title-text">&nbsp;&nbsp;图书馆</span>

      <!-- <template v-slot:actions>
        <SearchBar @search="handleSearch" />
      </template> -->
    </v-banner>
    <v-container class="library-center-view" fluid>
      <!-- 搜索结果列表 -->
      <div class="search-result" v-if="searchBooks.length > 0">
        <!-- <rogaluna-grid :items="books" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
          <template v-slot:default="{ item }">
            <book-grid-item :book="item" @itemClick="editBook(item)"/>
          </template>
        </rogaluna-grid> -->
      </div>
      <div class="recommend-result" v-else>
        <rogaluna-grid :items="recommendBooks" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
          <template v-slot:default="{ item }">
            <rogaluna-div
            :menuItems="menus.book"
            @rclick="handleItemRightClick(item)">
              <book-grid-item :book="item" @itemClick="readBook(item)"/>
            </rogaluna-div>
          </template>
        </rogaluna-grid>
      </div>
    </v-container>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue';
import ListItem from './components/ListItem.vue';

import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import RogalunaDiv from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaDiv.vue';
import BookGridItem from '../components/BookGridItem.vue';

import getBookListAPI from '@/plugins/axios/api/library/getBookList';

export default {
  name: 'LibraryCenterView',
  components: {
    SearchBar,
    ListItem,
    RogalunaGrid,
    RogalunaDiv,
    BookGridItem,
  },
  data() {
    return {
      recommendBooks: [], // 存储搜索结果的书籍数组
      searchBooks: [],
      menus: {
        contextObject: {},
        book: [
          {
            label: '阅读',
            icon: '#rogaluna-icon-timeout',
            value: '1',
            handler: () => {
              this.readBook(this.menus.contextObject);
            }
          },
        ]
      }
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    fetchBooks() {
      getBookListAPI()
        .then(response => {
          console.log(`response`, response);
          this.recommendBooks = response.data;
        })
    },
    handleItemRightClick(item) {
      this.menus.contextObject = item;
    },
    handleSearch(query) {
      // 搜索查询返回结果
      getBookListAPI()
        .then(response => {
          console.log(`response`, response);
          this.searchBooks = response.data;
        })
    },
    readBook(item) {
      this.$router.push({name: 'read-page', query: {id: item.id}});
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-banner__text {
  text-align: left;

  .title-text {
    background: linear-gradient(
      to right, 
      var(--light-background-color),
      var(--primary-color)
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    font-size: 24px;
  }
}

.library-center-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;

  width: 100%;

  .search-result {
    width: 100%;
  }

  .recommend-result {
    width: 100%;
  }
}
</style>