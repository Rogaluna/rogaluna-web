<template>
  <div style="height: 100%; display: flex;">
    <rogaluna-quill-editor 
        v-model="content" 
        :options="editorOptions"
        style="flex: 1; display: flex; flex-direction: column; height: 100%;"></rogaluna-quill-editor>
    <div style="width: 200px; height: 100%;">
      <!-- 这里放置工具栏组件 -->
       <side-book-state-bar :items="chapters" @sideOpts="handleSideOpts">
        
       </side-book-state-bar>
    </div>
  </div>
</template>

<script>
import RogalunaQuillEditor from '@/plugins/rogaluna-quill-editor/RogalunaQuillEditor.vue';
import SideBookStateBar from './components/SideBookStateBar.vue';
import BookDetailSettingDialog from './components/BookDetailSettingDialog.vue';
import NewChapterDialog from './components/NewChapterDialog.vue';
import SetChapterDialog from './components/SetChapterDialog.vue';

import getChapterListAPI from '@/plugins/axios/api/library/getChapterList';
import newChapterAPI from '@/plugins/axios/api/library/newChapter';
import getChapterContentAPI from '@/plugins/axios/api/library/getChapterContent';
import updateChapterContentAPI from '@/plugins/axios/api/library/updateChapterContent';
import getBookCategoriesAPI from '@/plugins/axios/api/library/getBookCategories';

export default {
  components: {
    RogalunaQuillEditor,
    SideBookStateBar
  },
  data() {
    return {
      content: '', // 编辑器内容
      editorOptions: {
        modules: {
          toolbar: true, // 或者传递工具栏配置对象
        },
      },
      chapters: []
    };
  },
  mounted() {
    this.fetchChapters();
  },
  methods: {
    fetchChapters() {
      const bookId =  this.$route.query.id;
      getChapterListAPI(bookId)
        .then(response => {
          const responseData = response.data;
          this.chapters = responseData;
        })
    },
    fetchChapterContent(chapterIndex) {
      const bookId = this.$route.query.id;
      getChapterContentAPI(bookId, chapterIndex)
        .then(response => {
          console.log(`response`, response);
          this.content += response;
        })
    },
    async handleSideOpts(event) {
      switch(event.type) {
        case 'addChapter':
          {
            this.$rogalunaWidgets.showDialog(
              NewChapterDialog,
              {},
              {
                confirm: (form) => { 
                  newChapterAPI({
                    id: this.$route.query.id,
                    ...form
                  })
                    .then(response => {
                      if (response.success) {
                        // 如果新建成功，那么刷新章节列表
                      } else {
                        // 否则弹出创建失败的消息
                        this.$rogalunaWidgets.showSnackbar("新建失败");
                      }
                    })                
                }, 
                cancel: () => { console.log('用户点击了取消'); } 
              }
            )
          }
        break;
        case 'moreSetting':
          {
            const categories = (await getBookCategoriesAPI()).categories;

            this.$rogalunaWidgets.showDialog(
              BookDetailSettingDialog,
              { 
                categories: categories.children
              },
              { 
                confirm: () => { console.log('用户点击了确认'); }, 
                cancel: () => { console.log('用户点击了取消'); } 
              } // 事件回调
            )
          }
        break;
        case 'setChapter':
          {
            this.$rogalunaWidgets.showDialog(
              SetChapterDialog,
              {},
              {
                del: () => { console.log('用户点击了删除'); },
                confirm: () => { console.log('用户点击了确认'); }, 
                cancel: () => { console.log('用户点击了取消'); } 
              }
            )
          }
        break;
        case 'selectChapter':
          {
            this.content = '';
            this.fetchChapterContent(event.payload.chapter_number);
          }
        break;
        case 'saveChapter':
          {
            updateChapterContentAPI({
              id: this.$route.query.id,
              index: event.payload,
              content: this.content,
            })
              .then(response => {
                console.log(`response`, response);
              })
          }
        break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.rogaluna-quill-editor {

  ::v-deep .ql-snow * {
    fill: var(--primary-color);
    color: var(--light-background-color);
    stroke: var(--light-background-color);
  }

  ::v-deep .ql-toolbar.ql-snow {
    border-width: 0px 1px 0px 0px;
    border-color: var(--split-color);
  }

  ::v-deep .ql-container.ql-snow {
    border-width: 1px 1px 1px 0px;
    border-style: solid;
    border-color: var(--split-color);

    &:focus-within {
      border-width: 1px;
      border-color: var(--primary-color);

      // 选择当前元素的兄弟元素 .ql-toolbar 并改变其样式
      &, ~ * {
        border-color: var(--primary-color);
      }
    }
  }
}

</style>