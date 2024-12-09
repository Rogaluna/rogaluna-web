<template>
  <rogaluna-div
    ref="fileOperatePanel"
    :menuItems="menus.panel"
  >
    <v-data-iterator
      :items="items"
      :items-per-page="-1"
      hide-default-footer
    >
      <template v-slot:default="props">

        <div v-if="isListView">
          <v-data-table
            :headers="headers"
            :items="props.items"
            hide-default-footer
            :items-per-page="props.items.length"
          >
            <template v-slot:[`item`]="{ item }">
              <rogaluna-tr @click="handleRowClick(item)" @rclick="handleItemRightClick(item)" :menuItems="dispatchMenuOpts(item.type)">
                <td style="text-align: left;">
                  <svg class="__icon__s"
                    aria-hidden="true"
                    icon>
                    <use :xlink:href="getIcon(item.type)"></use>
                  </svg>
                </td>
                <td style="text-align: left;">
                  {{ item.name }}
                </td>
                <td style="text-align: left;">
                  {{ formatDate(item.lastModified) }}
                </td>
                <td style="text-align: left;">
                  {{ convertType(item.type) }}
                </td>
                <td style="text-align: left;">
                  {{ item.size || "-" }}
                </td>
              </rogaluna-tr>
            </template>
          </v-data-table>
        </div>


        <div v-else>
          <v-row>
            <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4">
              <v-card>
                <v-card-title>{{ item.name }}</v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-data-iterator>
  </rogaluna-div>
</template>

<script>
import RogalunaDiv from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaDiv.vue';
import RogalunaTr from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaTr.vue';

import FileListItem from './FileListItem.vue';
import getFileListAPI from '@/plugins/axios/api/cloud-drive/getFileList';
import fetchFileDirectLinkAPI from '@/plugins/axios/api/cloud-drive/fetchFileDirectLink'
import postFileAPI from '@/plugins/axios/api/cloud-drive/postFile';
import createFolderAPI from '@/plugins/axios/api/cloud-drive/createFolder';

import NewFolderDialog from './NewFolderDialog.vue';
import DeleteConfirmDialog from './DeleteConfirmDialog.vue';
import RenameDialog from './RenameDialog.vue';
import FileDetailDialog from './FileDetailDialog.vue';
import renameFileAPI from '@/plugins/axios/api/cloud-drive/renameFile';
import deleteFileAPI from '@/plugins/axios/api/cloud-drive/deleteFile';

export default {
  components: { 
    RogalunaDiv,
    RogalunaTr,
    FileListItem
  },
  inject: ['eventBus'],
  computed: {},
  watch: {
    // 监听 sharedState.currentFolderUid 的变化
    'eventBus.sharedState.currentFolderUid': {
      handler(newVal, oldVal) {

        if (this.eventBus.sharedState.currentFolderUid != this.eventBus.sharedState.rootUid) {
          this.fetchData();
        }
      },
      deep: true, // 使得监听器可以检测数组或对象的变化
    }
  },
  data() {
    return {
      menus: {
        contextObject: {},
        panel: [
          // {
          //   label: '图标',
          //   value: '1',
          //   handler: () => {
          //     this.isListView = !this.isListView;
          //     this.panelMenu[0].label = this.isListView ? '图标' : '内容';
          //   }
          // }
          {
            label: '上传文件',
            icon: '#rogaluna-icon-upload',
            value: '1',
            handler: () => {
              
              this.$rogalunaWidgets.showFileSelector({}, (files) => {
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  const task = {
                    uuid: Date.now().toString(16) + '-' + Math.random().toString(16).substring(2),
                    name: file.name,
                    progress: 0,
                    size: 0,
                    totalSize: 0
                  }
                  postFileAPI(file, this.eventBus.sharedState.currentFolderUid, () => {
                    // 上传进行前调用
                    this.eventBus.sharedState.uploadList.push(task);
                  }, (upload) => {
                    task.progress = Math.floor((upload.size / upload.totalSize) * 100);
                    task.size = upload.size;
                    task.totalSize = upload.totalSize;
                  }, (response) => {
                    const index = this.eventBus.sharedState.uploadList.findIndex(obj => obj.uuid === task.uuid)
                    if (index !== -1) {
                      this.eventBus.sharedState.uploadList.splice(index, 1); // 从索引位置移除 1 个元素
                    }
                    this.fetchData();
                  })
                }
              })
            }
          },
          {
            label: '新建文件夹',
            icon: '#rogaluna-icon-file',
            value: '2',
            handler: () => {
              this.$rogalunaWidgets.showDialog(
                NewFolderDialog,
                { title: '新对话框', message: '这是一个动态创建的新对话框' },
                { 
                  confirm: (formData) => { 
                    
                    createFolderAPI(this.eventBus.sharedState.currentFolderUid, formData.folderName)
                      .then(response => {
                        console.log(response);
                        this.fetchData();
                      })  
                  }, 
                  cancel: () => { console.log('用户点击了取消'); } 
                } // 事件回调
              )
            }
          }
        ],
        dir: [
          {
            label: '打开文件夹',
            icon: '#rogaluna-icon-file',
            value: '1',
            handler: () => {
              this.eventBus.setDir(this.menus.contextObject.uid);
            }
          },
          // {
          //   label: '下载文件夹',
          //   icon: '#rogaluna-icon-download_file',
          //   value: '1',
          //   handler: () => {
              
          //   }
          // },
          // {
          //   label: '删除文件夹',
          //   icon: '#rogaluna-icon-a-deletefolder',
          //   value: '1',
          //   handler: () => {
          //     this.$rogalunaWidgets.showDialog(
          //       DeleteConfirmDialog,
          //       {
          //         initData: {
          //           message: `删除文件夹[ ${this.menus.contextObject.name} ]及其内部的所有文件？`
          //         }
          //       },
          //       {
          //         // confirm: () => {
          //         //   deleteFileAPI(this.menus.contextObject.uid)
          //         //     .then(response => {
          //         //       this.fetchData();
          //         //     })
          //         // }
          //       }
          //     )
          //   }
          // },
          {
            label: '重命名',
            icon: '#rogaluna-icon-rename',
            value: '1',
            handler: () => {
              this.$rogalunaWidgets.showDialog(
                RenameDialog,
                {
                  initData: this.menus.contextObject
                },
                {
                  confirm: (form) => {
                    const rename = form.rename;
                    renameFileAPI({
                      uid: this.menus.contextObject.uid,
                      name: rename
                    }).then(response => {
                      if (response.success) {
                        this.fetchData();
                      }
                    })
                  }
                }
              )
            }
          },
          {
            label: '详细信息',
            icon: '#rogaluna-icon-detail',
            value: '1',
            handler: () => {
              this.$rogalunaWidgets.showDialog(
                FileDetailDialog,
                {
                  initData: this.menus.contextObject
                },
                {}
              )
            }
          }
        ],
        file: [
          {
            label: '下载文件',
            icon: '#rogaluna-icon-download',
            value: '1',
            handler: () => {
              const targetMd5 = this.menus.contextObject.contentMd5;
              const targetFileName = this.menus.contextObject.name;
              fetchFileDirectLinkAPI(targetMd5, targetFileName)
              .then(response => {
                if (response.success) {
                  this.fetchData();
                }
              })
            }
          },
          {
            label: '删除文件',
            icon: '#rogaluna-icon-delete1',
            value: '1',
            handler: () => {
              this.$rogalunaWidgets.showDialog(
                DeleteConfirmDialog,
                {
                  initData: {
                    message: `删除文件[ ${this.menus.contextObject.name} ] ？`
                  }
                },
                {
                  confirm: () => {
                    deleteFileAPI(this.menus.contextObject.uid)
                      .then(response => {
                        this.fetchData();
                      })
                  }
                }
              )
            }
          },
          {
            label: '重命名',
            icon: '#rogaluna-icon-rename',
            value: '1',
            handler: () => {
              this.$rogalunaWidgets.showDialog(
                RenameDialog,
                {
                  initData: this.menus.contextObject
                },
                {
                  confirm: (form) => {
                    const rename = form.rename;
                    renameFileAPI({
                      uid: this.menus.contextObject.uid,
                      name: rename
                    }).then(response => {
                      console.log(`response`, response);
                    })
                  }
                }
              )
            }
          },
          {
            label: '详细信息',
            icon: '#rogaluna-icon-detail',
            value: '1',
            handler: () => {
              this.$rogalunaWidgets.showDialog(
                FileDetailDialog,
                {
                  initData: this.menus.contextObject
                },
                {}
              )
            }
          }
        ]
      },
      items: [],
      isListView: true,
      headers: [
        {
          text: '',
          value: 'icon',
          sortable: false,
          width: '36px'
        },
        {
          text: '名称',
          value: 'name',
        },
        {
          text: '修改日期',
          value: 'lastModified',
        },
        {
          text: '类型',
          value: 'type',
        },
        {
          text: '大小',
          value: 'size',
        }
      ],
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {

      // 异步数据获取
      this.$rogalunaWidgets.showLoading(this.$refs.fileOperatePanel, (stopLoading) => {
        
        getFileListAPI(this.eventBus.sharedState.currentFolderUid) // 当前文件夹 uid 是空的，则默认会获取到根目录
          .then(response => { // 获取的回复将包括文件列表和当前目录的uid

            if (this.eventBus.sharedState.rootUid == 'root') {
              // 根目录未初始化，初始化根目录
              this.eventBus.sharedState.rootUid = response.currentFolderUid;
            }
            this.eventBus.sharedState.currentFolderUid = response.currentFolderUid; // 将当前目录 uid 更新到 bus 中
            this.eventBus.sharedState.path = this.eventBus.formatPathToArray(response.path); // 设置格式化的路径
            this.items = response.data;
            stopLoading();
          })
      })
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月份从0开始
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    },
    convertType(type) {
      // 类型转换中文
      return this.$store.state.globalAttributes.fileTypeMapping[type] || type;
    },
    getIcon(type) {
      // 如果找到图标，返回图标；否则返回默认图标
      return `#${this.$store.state.globalAttributes.fileIconTypeMapping[type] || this.$store.state.globalAttributes.fileIconTypeMapping['default']}`;
    },
    dispatchMenuOpts(type) {
      switch (type) {
        case 'dir':
          return this.menus.dir;
        default:
          return this.menus.file;
      }
    },
    handleRowClick(item) {

    },
    handleItemRightClick(item) {
      this.menus.contextObject = item;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>