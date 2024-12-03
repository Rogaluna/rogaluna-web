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
import ConfirmSaveDialog from './components/ConfirmSaveDialog.vue';

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
            // 以下内容很有可能需要使用对话框处理
            this.$rogalunaWidgets.showDialog(
              ConfirmSaveDialog,
              {},
              {
                confirm: async () => {
                  const bookId = this.$route.query.id;

                  const myersDiffCompare = (oldText, newText) => {
                    const m = oldText.length;
                    const n = newText.length;

                    // 定义二维数组D，用于保存编辑距离
                    const D = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

                    // 初始化边界条件
                    for (let i = 0; i <= m; i++) {
                      D[i][0] = i;
                    }
                    for (let j = 0; j <= n; j++) {
                      D[0][j] = j;
                    }

                    // 计算编辑距离矩阵
                    for (let i = 1; i <= m; i++) {
                      for (let j = 1; j <= n; j++) {
                        if (oldText[i - 1] === newText[j - 1]) {
                          D[i][j] = D[i - 1][j - 1]; // 没有修改
                        } else {
                          D[i][j] = Math.min(
                            D[i - 1][j] + 1,     // 删除操作
                            D[i][j - 1] + 1,     // 插入操作
                            D[i - 1][j - 1] + 1  // 替换操作
                          );
                        }
                      }
                    }

                    // 回溯得到差异行
                    const deletions = [];
                    const insertions = [];
                    let i = m, j = n;
                    while (i > 0 || j > 0) {
                      if (i > 0 && j > 0 && oldText[i - 1] === newText[j - 1]) {
                        // 如果两行相同，不做任何操作
                        i--;
                        j--;
                      } else {
                        if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + 1) {
                          // 替换操作，拆分为删除和插入
                          deletions.push(oldText[i - 1]);
                          insertions.push(newText[j - 1]);
                          i--;
                          j--;
                        } else if (i > 0 && D[i][j] === D[i - 1][j] + 1) {
                          // 删除操作
                          deletions.push(oldText[i - 1]);
                          i--;
                        } else if (j > 0 && D[i][j] === D[i][j - 1] + 1) {
                          // 插入操作
                          insertions.push(newText[j - 1]);
                          j--;
                        }
                      }
                    }

                    // 由于是从后向前回溯，需要反转数组
                    deletions.reverse();
                    insertions.reverse();

                    return { deletions, insertions };
                  }

                  const extractIds = (operations) => {
                    const ids = [];
                    operations.forEach(op => {
                      const match = op.match(/src="https?:\/\/[^"]*\/api\/library\/getResource\?id=([a-fA-F0-9]+)/);
                      if (match && match[1]) {
                        ids.push(match[1]);
                      }
                    });
                    return ids;
                  }

                  await this.$rogalunaWidgets.showProgressDialog(async (progress) => {
                    // 初始化对话框属性
                    progress.taskName = '保存章节';
                    progress.totalTasks = 4;
                    progress.currentTask = 0;
                    progress.useSubtitle = true;
                    progress.subtitle = '初始化中...';
                    progress.percentage = 0;
                    progress.indeterminate = false;
                    progress.autoComplete = false; // 不自动完成
                    progress.useCancel = true; // 显示“取消”按钮
                    progress.completed = false;

                    // 1.处理原始文本中...
                    progress.currentTask = 1;
                    progress.percentage = 0;
                    progress.subtitle = '处理原始文本中...';
                    const originText = await getChapterContentAPI(bookId, event.payload);

                    progress.percentage = 10;
                    const tokens1 = this.tokenizeHtmlContent(originText);

                    progress.percentage = 20;
                    const tokenLines1 = this.splitTokensIntoLines(tokens1);

                    progress.percentage = 30;
                    const lines1 = tokenLines1.map(lineTokens => {
                      this.rebuildContentFromTokens(lineTokens)
                      progress.percentage += (70 / tokenLines1.length);
                    });

                    // 2.处理修改文本中...
                    progress.currentTask = 2;
                    progress.percentage = 0;
                    progress.subtitle = '处理修改文本中...';

                    progress.percentage = 10;
                    const tokens2 = this.tokenizeHtmlContent(this.content);

                    progress.percentage = 20;
                    const tokenLines2 = this.splitTokensIntoLines(tokens2);

                    progress.percentage = 30;
                    const lines2 = tokenLines2.map(lineTokens => {
                      this.rebuildContentFromTokens(lineTokens)
                      progress.percentage += (70 / tokenLines1.length);
                    });

                    // 3.获取差异中...
                    progress.currentTask = 3;
                    progress.percentage = 0;
                    progress.subtitle = '获取差异中...';
                    const { deletions, insertions } = myersDiffCompare(lines1, lines2);

                    progress.percentage = 10;
                    const deletionIds = extractIds(deletions);

                    progress.percentage = 55;
                    const insertionIds = extractIds(insertions);

                    // 4.上传文本中...
                    progress.currentTask = 4;
                    progress.percentage = 0;
                    progress.subtitle = '上传文本中...';
                    const response = await updateChapterContentAPI({
                      id: bookId,
                      index: event.payload,
                      content: this.content,
                      removed: deletionIds,
                      added: insertionIds
                    })

                    progress.percentage = 100;
                    progress.completed = true;
                    if (response.success == true) {
                      progress.subtitle = "章节已上传";
                    } else {
                      progress.subtitle = "上传失败";
                    }
                  });
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