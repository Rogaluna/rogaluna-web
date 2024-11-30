<template>
  <div class="read-container">
    <v-banner
      single-line
      :sticky="false"
    >
      <svg class="__icon__m"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-tushuguan"></use>
      </svg>
      <span class="title-text">&nbsp;&nbsp;当前阅读</span>
    </v-banner>
    <!-- <div class="content" v-html="textContent"></div> -->
    <div v-if="bookView">
      <div class="book-info">
        <div class="cover-container">
          <v-img
            :src="bookCover"
            alt="Book Cover"
            class="book-cover"
            @error="handleImageError"
          ></v-img>
        </div>
        <div class="info-container">
          <div class="title-container">
            {{ book.name }}
          </div>
          <div class="author-container">
            Author：{{ user.username }}
          </div>
          <div class="option-container">
            <v-btn rounded @click="onRead">
              阅读
            </v-btn>

            <v-btn color="primary" rounded>
              收藏
            </v-btn>
          </div>
        </div>
      </div>
      <div>
        <directory :chapters="chapters" @chapterSelected="handleChapterSelect"></directory>
      </div>
    </div>

    <div v-else v-html="textContent" class="content-display" align="left">

    </div>
  </div>
</template>

<script>
import Directory from './components/Directory.vue';

import getBookInfoAPI from '@/plugins/axios/api/library/getBookInfo';
import getUserInfoAPI from '@/plugins/axios/api/account/getUserInfo';
import getBookReadProgressAPI from '@/plugins/axios/api/library/getBookReadProgress';
import getChapterListAPI from '@/plugins/axios/api/library/getChapterList';
import getChapterContentAPI from '@/plugins/axios/api/library/getChapterContent';

export default {
  components: {
    Directory
  },
  data() {
    return {
      bookView: true,
      book: {},
      user: {},
      chapters: [],
      readRecord: {},
      selectedIndex: -1,
      bookCover: `/api/library/cover?book=${this.$route.query.id}`,
      textContent: ''
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const bookId = this.$route.query.id;
      // 查询用户阅读的章节，如果有阅读记录，跳入章节内容，否则显示书籍详情
      getBookReadProgressAPI(bookId)
        .then(async (response) => {

          const chapterList = await getChapterListAPI(bookId)
          this.chapters = chapterList.data;
          console.log(`this.chapters`, this.chapters);

          if (response.success) {
            // 如果查询到了阅读记录
            this.readRecord = response.data;
            this.bookView = false;
          } else {
            // 没有找到阅读记录
            // 获取指定的书籍信息
            const bookInfo = await getBookInfoAPI(bookId)
            this.book = bookInfo.data;
            const userInfo = await getUserInfoAPI(bookInfo.data.user_id);
            this.user = userInfo.data;
          }

        })
    },
    fetchChapterContent(newChapterIndex) {
      const bookId = this.$route.query.id;
      this.selectedIndex = newChapterIndex;
      getChapterContentAPI(bookId, this.selectedIndex)
        .then(response => {
          this.textContent += response;
        })
    },
    handleImageError() {
      this.bookCover = require('@/assets/defaultBookCover.svg');
    },
    onRead() {
      // 跳转到章节阅读页面
      this.bookView = false;
      // 如果阅读记录不存在，则从第一章开始阅读，否则读取阅读记录中的数据
      if (this.readRecord) {
        this.fetchChapterContent(this.chapters[0].chapter_number);
      } else {
        this.fetchChapterContent(this.readRecord.chapter_number);
      }
      
    },
    handleChapterSelect(chapter) {
      console.log('选中的章节:', chapter)
      this.bookView = false;
      this.fetchChapterContent(chapter.chapter_number)
    },
  }
}
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

.read-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .content-display {
    overflow-y: scroll;
    flex-grow: 1;
    min-width: 0;
  }


  .book-info {
    display: flex;
    flex-direction: row;

    .cover-container {
      width: 168px;
      height: 225px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border-radius: 5%;

      .book-cover {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border: 1px solid;
        border-radius: 5%;
        border-color: var(--split-color);
      }
    }

    .info-container {
      display: flex;
      flex-direction: column;

      .title-container {

      }

      .author-container {

      }

      .option-container {

      }
    }
  }
}

</style>