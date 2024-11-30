<template>
  <div style="height: 100%; display: flex;">
    <rogaluna-quill-editor 
        v-model="content"
        :handlers="handlers"
        style="flex: 1; display: flex; flex-direction: column; height: 100%;"></rogaluna-quill-editor>
    <div style="width: 200px; height: 100%;">
      <!-- 这里放置工具栏组件 -->
       <side-book-state-bar ref="sideOptPanel" :items="chapters" @sideOpts="handleSideOpts">
        
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
import getCategoriesAPI from '@/plugins/axios/api/library/getCategories';
import getBookInfoAPI from '@/plugins/axios/api/library/getBookInfo';
import getBookCategoriesAPI from '@/plugins/axios/api/library/getBookCategories';
import getChapterInfoAPI from '@/plugins/axios/api/library/getChapterInfo';

import updateBookInfoAPI from '@/plugins/axios/api/library/updateBookInfo';
import updateChapterInfoAPI from '@/plugins/axios/api/library/updateChapterInfo';

import deleteChapterAPI from '@/plugins/axios/api/library/deleteChapter';
import deleteBookAPI from '@/plugins/axios/api/library/deleteBook';
import uploadLibraryResourceAPI from '@/plugins/axios/api/library/uploadLibraryRes';
import { BASE_HTTP_URL } from '@/plugins/axios/configs/baseUrl';

export default {
  components: {
    RogalunaQuillEditor,
    SideBookStateBar
  },
  data() {
    return {
      content: '', // 编辑器内容
      handlers: (editor) => {
        const self = this; // 获取外层指针以便在闭包内使用
        return {
          image() {
            const quill = editor.quill;

            self.$rogalunaWidgets.showFileSelector({ accept: 'image/*', multiple: false}, (files) => {
              for (const key of Object.keys(files)) {
                const file = files[key];
                
                // 将图片上传到服务器，获取已上传图片的 url
                uploadLibraryResourceAPI(file)
                  .then(response => {
                    console.log(`response`, response);
                    // 将 url 写入编辑器光标所在，构成 img
                    const md5 = response.data;
                    const url = `${BASE_HTTP_URL}/api/library/getResource?id=${md5}`;

                    // 获取当前光标位置
                    const range = quill.getSelection();
                    if (range) {
                      // 在光标位置插入图片
                      quill.insertEmbed(range.index, 'image', url);

                      // 将光标移动到图片之后
                      quill.setSelection(range.index + 1);
                    } else {
                      console.error('No selection found');
                    }
                  })
              }
            })
          },
        };
      }, // 编辑器选项处理重载
      chapters: [],
      originalResList: [],
    };
  },
  mounted() {
    this.fetchChapters();
  },
  methods: {
    fetchChapters() {
      this.$rogalunaWidgets.showLoading(this.$refs.sideOptPanel, async (stopLoading) => {
        const bookId =  this.$route.query.id;

        const response = await getChapterListAPI(bookId);
        const responseData = response.data;
        this.chapters = responseData;

        stopLoading();
      })
    },
    fetchChapterContent(chapterIndex) {
      const bookId = this.$route.query.id;
      getChapterContentAPI(bookId, chapterIndex)
        .then(response => {
          this.content = response;

          // 需要对原始获取的文本进行统计
          this.originalResList = this.statisticalCitationRes(response);
          console.log('资源引用列表:', this.originalResList);
        })
    },
    statisticalCitationRes(content) {
      // 统计引用的资源
      if (!content || typeof content !== 'string') {
          return [];
      }

      const resourceIds = [];

      // 匹配 src 属性中包含 /api/library/getResource?id= 的 id 值
      const regex = /src="[^"]*\/api\/library\/getResource\?id=([^"&]+)"/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
          // 将匹配到的 id 值添加到列表
          resourceIds.push(match[1]);
      }

      return resourceIds;
    },
    compareArrays(originalList, newList) {
      // 构建计数器函数
      const buildCounter = (array) => {
        const counter = new Map();
        for (const item of array) {
            counter.set(item, (counter.get(item) || 0) + 1);
        }
        return counter;
      }

      // 原始数组和新数组的计数器
      const originalCounter = buildCounter(originalList);
      const newCounter = buildCounter(newList);

      const added = [];
      const removed = [];

      // 遍历原始计数器，找出减少的元素
      for (const [item, count] of originalCounter.entries()) {
        const newCount = newCounter.get(item) || 0;
        if (newCount < count) {
          const diff = count - newCount;
          removed.push(...Array(diff).fill(item)); // 根据差值填充
        }
      }

      // 遍历新计数器，找出增加的元素
      for (const [item, count] of newCounter.entries()) {
        const originalCount = originalCounter.get(item) || 0;
        if (count > originalCount) {
          const diff = count - originalCount;
          added.push(...Array(diff).fill(item)); // 根据差值填充
        }
      }

      return { added, removed };
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
                        this.fetchChapters();
                        this.$rogalunaWidgets.showSnackbar("已添加");
                      } else {
                        this.$rogalunaWidgets.showSnackbar("新建章节失败");
                      }
                    })                
                }, 
                cancel: () => { console.log('取消'); } 
              }
            )
          }
        break;
        case 'moreSetting':
          {
            this.$rogalunaWidgets.showLoading(null, async (stopLoading) => {
              const bookId = this.$route.query.id;

              const categories = (await getCategoriesAPI()).categories;
              const bookInfo = (await getBookInfoAPI(bookId)).data;
              const bookCategory = (await getBookCategoriesAPI(bookId)).data.tags;

              this.$rogalunaWidgets.showDialog(
                BookDetailSettingDialog,
                { 
                  categories: categories.children,
                  initData: {
                    ...bookInfo,
                    tags: bookCategory
                  }
                },
                { 
                  del: () => {
                    deleteBookAPI(bookId)
                      .then(response => {
                        if (response.success) {
                          this.$rogalunaWidgets.showSnackbar("已删除书籍");
                          this.$router.push({ name: 'write-book' });
                        } else {
                          this.$rogalunaWidgets.showSnackbar("书籍删除失败");
                        }
                      })
                  },
                  confirm: (form) => { 
                    updateBookInfoAPI({
                      id: bookId,
                      name: form.bookName,
                      desc: form.bookDescription,
                      tags: form.categoryTags.map(obj => obj.id)
                    })
                      .then(response => {
                        if (response.success) {
                          this.$rogalunaWidgets.showSnackbar("书籍已更新");
                        } else {
                          this.$rogalunaWidgets.showSnackbar("书籍无法更新");
                        }
                      })
                  }, 
                  cancel: () => { console.log('取消'); } 
                } // 事件回调
              )

              stopLoading();
            })
          }
        break;
        case 'setChapter':
          {
            this.$rogalunaWidgets.showLoading(null, async (stopLoading) => {
              const bookId = this.$route.query.id;
              const chapterData = (await getChapterInfoAPI(bookId, event.payload.chapter_number)).data;
              
              this.$rogalunaWidgets.showDialog(
                SetChapterDialog,
                {
                  initData: chapterData
                },
                {
                  del: () => { 
                    deleteChapterAPI(bookId, chapterData.chapter_number)
                      .then(response => {
                        if (response.success) {
                          this.fetchChapters();
                          this.$rogalunaWidgets.showSnackbar("已删除");
                        } else {
                          this.$rogalunaWidgets.showSnackbar("删除失败");
                        }
                      })  
                  },
                  confirm: (form) => {
                    updateChapterInfoAPI({
                      ...form,
                      id: bookId,
                      index: chapterData.chapter_number
                    })
                      .then(response => {
                        if (response.success) {
                          this.$rogalunaWidgets.showSnackbar("章节已更新");
                        } else {
                          this.$rogalunaWidgets.showSnackbar("章节无法更新");
                        }
                      })
                  }, 
                  cancel: () => { console.log('取消'); } 
                }
              )

              stopLoading();
            })
          }
        break;
        case 'selectChapter':
          {
            this.fetchChapterContent(event.payload.chapter_number);
          }
        break;
        case 'saveChapter':
          {
            // 需要统计添加的资源引用、删除的资源引用
            const newResList = this.statisticalCitationRes(this.content);
            console.log(`新的资源引用列表`, newResList);

            const { added, removed } = this.compareArrays(this.originalResList, newResList);
            console.log("添加的元素:", added); 
            console.log("删除的元素:", removed);

            updateChapterContentAPI({
              id: this.$route.query.id,
              index: event.payload,
              content: this.content
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

  ::v-deep .ql-snow.ql-toolbar {

    button {

      .ql-stroke {
        stroke: var(--light-background-color);
      }

      .ql-fill {
        fill: var(--primary-color);
      }

      &:hover .ql-stroke {
        stroke: var(--primary-color);
      }

    }

    .ql-picker {
      .ql-stroke {
        stroke: var(--light-background-color);
        
      }

      .ql-picker-label {
        border-color: var(--split-color);
        color: var(--light-background-color);
      }

      .ql-picker-options {
        border-color: var(--split-color);
        background-color: var(--dark-background-color);

        .ql-picker-item {
          color: var(--light-background-color);

          &:hover {
            color: var(--primary-color);
          }

          &.ql-selected {
            color: var(--primary-color);
          }
        }

        
      }

      .ql-color-label {
        fill: var(--primary-color);
      }

      &:hover .ql-stroke {
        stroke: var(--primary-color);
      }
    }

    // button:hover {
    //   stroke: var(--light-background-color);
    // }
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