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
import ConfirmSaveDialog from './components/ConfirmSaveDialog.vue';
import uploadBookCoverAPI from '@/plugins/axios/api/library/uploadBookCover';

export default {
  components: {
    RogalunaQuillEditor,
    SideBookStateBar
  },
  data() {
    return {
      selectedChapter: -1,
      content: '', // 编辑器内容
      handlers: (editor) => {
        const self = this; // 获取外层指针以便在闭包内使用
        return {
          image() {
            const quill = editor.quill;

            const bookId = self.$route.query.id;
            const chapterIndex = self.selectedChapter;

            self.$rogalunaWidgets.showFileSelector({ accept: 'image/*', multiple: false}, (files) => {
              for (const key of Object.keys(files)) {
                const file = files[key];
                
                // 将图片上传到服务器，获取已上传图片的 url
                uploadLibraryResourceAPI(bookId, chapterIndex, file)
                  .then(response => {
                    console.log(`response`, response);
                    // 将 url 写入编辑器光标所在，构成 img
                    const token = response.data;
                    const url = `/api/library/getResource?token=${token}`;

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
      this.selectedChapter = chapterIndex;

      getChapterContentAPI(bookId, chapterIndex)
        .then(response => {
          this.content = response;
        })
    },
    tokenizeHtmlContent(htmlContent) {
      const tokens = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      function traverse(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
              // 开始标签
              const tagName = node.tagName.toLowerCase();
              const attributes = [];
              for (let attr of node.attributes) {
                  attributes.push({ name: attr.name, value: attr.value });
              }
              tokens.push({ type: 'startTag', tagName, attributes });

              // 递归遍历子节点
              for (let child of node.childNodes) {
                  traverse(child);
              }

              // 结束标签
              tokens.push({ type: 'endTag', tagName });
          } else if (node.nodeType === Node.TEXT_NODE) {
              // 文本节点
              const text = node.textContent;
              tokens.push({ type: 'text', content: text });
          } else if (node.nodeType === Node.COMMENT_NODE) {
              // 注释节点（可选）
              const comment = node.textContent;
              tokens.push({ type: 'comment', content: comment });
          }
      }

      // 开始遍历文档节点
      for (let child of doc.body.childNodes) {
          traverse(child);
      }

      return tokens;
    },
    splitTokensIntoLines(tokens) {
      const lines = [];
      let currentLine = [];

      const lineBreakTags = ['p', 'div', 'br', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr'];

      for (let token of tokens) {
          currentLine.push(token);

          if (
              (token.type === 'endTag' && lineBreakTags.includes(token.tagName)) ||
              (token.type === 'startTag' && token.tagName === 'br')
          ) {
              // 遇到行结束标签或 <br>，开始新的一行
              lines.push(currentLine);
              currentLine = [];
          }
      }

      // 添加最后一行
      if (currentLine.length > 0) {
          lines.push(currentLine);
      }

      return lines;
    },
    rebuildContentFromTokens(tokens) {
      let content = '';

      for (let token of tokens) {
          if (token.type === 'startTag') {
              const attributes = token.attributes
                  .map(attr => `${attr.name}="${attr.value}"`)
                  .join(' ');
              content += `<${token.tagName}${attributes ? ' ' + attributes : ''}>`;
          } else if (token.type === 'endTag') {
              content += `</${token.tagName}>`;
          } else if (token.type === 'text') {
              content += token.content;
          } else if (token.type === 'comment') {
              content += `<!--${token.content}-->`;
          }
      }

      return content;
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
                    tags: bookCategory,
                    coverUrl: `/api/library/getBookCover?id=${bookId}`,
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
                      tags: form.categoryTags.map(obj => obj.id),
                    })
                      .then(response => {
                        if (response.success) {
                          this.$rogalunaWidgets.showSnackbar("书籍已更新");
                        } else {
                          this.$rogalunaWidgets.showSnackbar("书籍无法更新");
                        }
                      })
                  }, 
                  changeCover: () => {
                    this.$rogalunaWidgets.showFileSelector({ accept: "image/*", multiple: false }, (files) => {
                      // 将选择的图片替换原图片
                      const file = files[0];
                      console.log(`file`, file);
                      uploadBookCoverAPI(bookId, file)
                        .then(response => {
                          console.log(`response`, response);
                        })
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
            // 以下内容很有可能需要使用对话框处理
            this.$rogalunaWidgets.showDialog(
              ConfirmSaveDialog,
              {},
              {
                confirm: async () => {
                  const bookId = this.$route.query.id;

                  updateChapterContentAPI({
                    id: bookId,
                    index: event.payload,
                    content: this.content,
                  }).then(response => {
                    if (response.success == true) {
                      this.$rogalunaWidgets.showSnackbar("章节已上传");
                    } else {
                      this.$rogalunaWidgets.showSnackbar("上传失败");
                    }
                  })
                }
              }
            )
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