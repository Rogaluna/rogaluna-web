<template>
  <div class="book-grid-item" @click="handleItemClick">
    <v-img
      :src="bookCover"
      alt="Book Cover"
      class="book-cover"
      @error="handleImageError"
    ></v-img>
    <div class="book-title">
      <span>{{ book.name }}</span>
    </div>
    <div class="book-desc">
      {{ book.description }}
    </div>
    <!-- <div class="reading-progress">
      {{ (book.totalChapters - book.currentChapter) ? (book.totalChapters - book.currentChapter) + '章未读' : '已读到最新章节'}} 
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'BookGridItem',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      bookCover: '/api/library/cover?book=' + this.book.id // 初始使用书籍封面
    };
  },
  methods: {
    handleImageError() {
      this.bookCover = require('@/assets/defaultBookCover.svg'); // 当封面加载失败时，使用默认图片
    },
    handleItemClick() {
      this.$emit('itemClick', this.item);
    }
  }
};
</script>

<style lang="scss" scoped>
.book-grid-item {
  width: 170px;
  height: 300px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .book-cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border: 1px solid;
    border-radius: 5%;
    border-color: var(--split-color);
  }

  .book-title {
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    flex-grow: 1;
    padding: 10px 0;

    color: var(--light-background-color);
  }

  .book-desc {
    width: 100%;
    font-size: 12px;
    color: var(--split-color);
    text-align: left;
    overflow: hidden;
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .reading-progress {
    width: 100%;
    font-size: 12px;
    color: var(--split-color);
    text-align: right;
    overflow: hidden;
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
