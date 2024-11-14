<template>
  <div>
    <rogaluna-grid :items="books" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
      <template v-slot:default="{ item }">
        <book-grid-item :book="item" @itemClick="editBook(item)"/>
      </template>
      <template #end>
        <add-grid-item text="新建" @click="newBook"></add-grid-item>
      </template>
    </rogaluna-grid>
  </div>
</template>

<script>
import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import BookGridItem from '../../components/BookGridItem.vue';
import AddGridItem from '../../components/AddGridItem.vue';

import NewDialog from './components/NewDialog.vue';

import getBookCategoriesAPI from '@/plugins/axios/api/library/getBookCategories'
import getBookListAPI from '@/plugins/axios/api/library/getBookList';

export default {
  components: {
    RogalunaGrid,
    BookGridItem,
    AddGridItem
  },
  data() {
    return {
      books: []
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    fetchBooks() {
      // 获取此用户编写的书籍列表
      getBookListAPI(2, '#')
        .then(response => {
          this.books = response.data;
        })
    },
    async newBook() {
      const categories = (await getBookCategoriesAPI()).categories;

      this.$rogalunaWidgets.showDialog(
        NewDialog,
        { 
          categories: categories.children
        },
        { 
          confirm: (form) => { console.log(`form`, form); }, 
          cancel: () => { console.log('用户点击了取消'); } 
        } // 事件回调
      )
    },
    editBook(item) {
      this.$router.push({name: 'editor', query: {id: item.id}});
    }
  }
}
</script>

<style lang="scss" scoped>

</style>