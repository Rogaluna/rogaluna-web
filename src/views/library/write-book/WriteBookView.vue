<template>
  <div>
    <v-banner
      single-line
      :sticky="false"
    >
      <svg class="__icon__m"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-xiezuo"></use>
      </svg>
      <span class="title-text">&nbsp;&nbsp;写作</span>

      <template v-slot:actions>
        <v-btn
          text
          color="primary"
          @click="newBook"
        >
          新建
        </v-btn>
      </template>
    </v-banner>

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
import BookGridItem from '../components/BookGridItem.vue';
import AddGridItem from '../components/AddGridItem.vue';

import NewDialog from './components/NewDialog.vue';

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
      this.$rogalunaWidgets.showDialog(
        NewDialog,
        { title: '新对话框', message: '这是一个动态创建的新对话框' },
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

::v-deep .v-banner__text {
  text-align: left;

  .title-text {
    background: linear-gradient(
      to right, 
      white, 
      red
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    font-size: 24px;
  }
}

</style>