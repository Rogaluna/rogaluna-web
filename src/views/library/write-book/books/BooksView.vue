<template>
  <div>
    <rogaluna-grid :items="books" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
      <template v-slot:default="{ item }">
        <book-grid-item :book="item" />
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

export default {
  components: {
    RogalunaGrid,
    BookGridItem,
    AddGridItem
  },
  data() {
    return {
      books: [
        { title: 'Book 1', cover: 'cover1.jpg', currentChapter: 5, totalChapters: 5 },
        { title: 'Book 2', cover: 'cover2.jpg', currentChapter: 8, totalChapters: 30 },
      ],
    };
  },
  methods: {
    newBook() {
      let categories;
      getBookCategoriesAPI()
        .then((response) => {
          categories = response.categories;
          console.log(`categories`, categories);
        })
      
      this.$rogalunaWidgets.showDialog(
        NewDialog,
        { categories: [
  {
    id: 1,
    name: '科学技术',
    children: [
      {
        id: 2,
        name: '计算机科学',
        children: [
          { id: 3, name: 'C++', children: [] },
          { id: 4, name: 'JavaScript', children: [] }
        ]
      }
    ]
  }
]
 },
        { 
          confirm: () => { console.log('用户点击了确认'); }, 
          cancel: () => { console.log('用户点击了取消'); } 
        } // 事件回调
      )
    }
  }
}
</script>

<style lang="scss" scoped>

</style>