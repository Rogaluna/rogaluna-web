<template>
  <div>
    <v-banner
      single-line
      :sticky="false"
    >
      <svg class="__icon__m"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-fenlei"></use>
      </svg>
      <span class="title-text">&nbsp;&nbsp;书架</span>

      <template v-slot:actions>
        <v-btn
          text
          color="primary"
        >
          管理
        </v-btn>
      </template>
    </v-banner>

    <rogaluna-grid :items="books" :itemStyle="{ borderWidth: 0 }" :useEndElement="true" style="padding: 10px;">
      <template v-slot:default="{ item }">
        <book-grid-item :book="item" />
      </template>
      <template #end>
        <add-grid-item text="从浏览历史中添加"></add-grid-item>
      </template>
    </rogaluna-grid>
  </div>
</template>

<script>
import RogalunaGrid from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaGrid.vue';
import BookGridItem from '../components/BookGridItem.vue';
import AddGridItem from '../components/AddGridItem.vue';

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