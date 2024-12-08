<template>
  <div class="component-container">



    <rogaluna-list
      horizontal
      :items="preButtons"
      :item-style="{border: 0, padding: 0}">
      <template v-slot:item="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon
              v-bind="attrs"
              v-on="on"
              @click="item.onclick">
              <svg class="__icon__s"
                aria-hidden="true"
                icon
                style="font-size: smaller;">
                <use :xlink:href="item.icon"></use>
              </svg>
            </v-btn>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </template>
    </rogaluna-list>



    <div class="breadcrumbs-container" @click="showInput" style="flex-grow: 1; margin: 0 10px;">
      <v-breadcrumbs v-if="!inputVisible" :items="eventBus.sharedState.path">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :key="item.text"
            :disabled="item.disabled"
            @click.stop="handleBreadcrumbClick(item)"
          >
            <span>{{ item.text }}</span>
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-text-field ref="editableInput" v-else @click.stop="" v-model="editablePath" @blur="hideInput" @keyup.enter="handleInputConfirm" />
    </div>



    <rogaluna-list
      horizontal
      :items="postButtons"
      :item-style="{border: 0, padding: 0}">
      <template v-slot:item="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon 
              v-bind="attrs"
              v-on="on"
              @click="item.onclick">
              <v-badge
                dot
                :value="item.value"
                color="red"
                overlap
              >
                <svg class="__icon__s"
                  aria-hidden="true"
                  icon
                  style="font-size: smaller;">
                  <use :xlink:href="item.icon"></use>
                </svg>
              </v-badge>
            </v-btn>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </template>
    </rogaluna-list>



  </div>
</template>

<script>

/**
 * 头部工具栏
 * 
 */

import RogalunaList from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaList.vue';
import getParentFolderAPI from '@/plugins/axios/api/cloud-drive/getParentFolder';
import getUidFromPathAPI from '@/plugins/axios/api/cloud-drive/getUidFromPath'

export default {
  inject: ['eventBus'],
  components: {
    RogalunaList
  },
  props: {
    uploadDot: Boolean
  },
  watch: {
    uploadDot() {
      this.postButtons[0].value = this.uploadDot;
    },
  },
  data() {
    return {
      editablePath: this.eventBus.formatArrayToPath(this.eventBus.sharedState.path),
      preButtons: [
        {
          text: "返回",
          icon: "#rogaluna-icon-jiantou_xiangzuo",
          onclick: ()=>{
            this.eventBus.undo();
          }
        },{
          text: "前进",
          icon: "#rogaluna-icon-jiantou_xiangyou",
          onclick: ()=>{
            this.eventBus.redo();
          }
        },{
          text: "上一级",
          icon: "#rogaluna-icon-jiantou_xiangshang",
          onclick: ()=>{
            if (this.eventBus.sharedState.path.length > 1) { // 如果不是根目录
              getParentFolderAPI(this.eventBus.sharedState.currentFolderUid)
                .then(response => {
                  this.eventBus.setDir(response.parentUid);
                })

              
            }
          }
        },
        {
          text: "返回Root",
          icon: "#rogaluna-icon-home",
          onclick: ()=>{
            this.eventBus.setDir(''); //必须重置为空字符串，不能重置为rootUid
          }
        },
      ],
      postButtons: [
        {
          text: "上传列表",
          icon: "#rogaluna-icon-upload",
          onclick: ()=>{
            this.eventBus.sharedState.isUploadPanelVisible = true;
          },
          value: this.uploadDot
        }
      ],
      inputVisible: false,
    }
  },

  methods: {
    showInput() {
      this.inputVisible = true;
      this.editablePath = this.eventBus.formatArrayToPath(this.eventBus.sharedState.path);
      this.$nextTick(() => {
        this.$refs.editableInput.focus(); // 在输入框显示后聚焦
      });
    },
    hideInput() {
      this.inputVisible = false;
      this.editablePath = this.eventBus.formatArrayToPath(this.eventBus.sharedState.path);
    },
    handleInputConfirm() {
      // 将字符串发送给服务器
      // debugger
      let inputPath = this.editablePath;
      if (!inputPath.startsWith("root")) {
        // 如果路径不以 root 开头，自动添加 root
        inputPath = "root" + (inputPath.startsWith("/") ? "" : "/") + inputPath;
      }

      getUidFromPathAPI(inputPath)
          .then(response => {
            if (response.uid == this.eventBus.sharedState.rootUid) {
              this.eventBus.setDir("");
            } else {
              this.eventBus.setDir(response.uid);
            }
          })
        this.hideInput();
    },
    handleBreadcrumbClick(item) {
      // 点击路径编辑器
      const clickedIndex = this.eventBus.sharedState.path.findIndex(b => b.text === item.text);
      const breadcrumbsSegment = this.eventBus.sharedState.path.slice(0, clickedIndex + 1);
      let path = this.eventBus.formatArrayToPath(breadcrumbsSegment);
      getUidFromPathAPI(path)
        .then(response => {
          if (response.uid == this.eventBus.sharedState.rootUid) {
            this.eventBus.setDir("");
          } else {
            this.eventBus.setDir(response.uid);
          }
          
        })
    }
  }
}
</script>

<style lang="scss" scoped>

.component-container {
  display: flex;
  align-items: center;
  background-color: none;
  border-width: 0px 0px 1px 0px;
  border-color: var(--split-color);
  border-style: solid;
  padding: 5px;

  .breadcrumbs-container {

    .v-breadcrumbs {
      background-color: var(--deep-background-color);
      border: 1px var(--split-color) solid;
      padding: 10px;

      ::v-deep .v-breadcrumbs__item {
        cursor: pointer;
      }

      ::v-deep .v-breadcrumbs__divider{
        cursor: default;
      }
    }

    .v-input {
      background-color: var(--deep-background-color);
      border: 1px var(--accent-color) solid;
      padding: 10px;
      margin: 0px;

      ::v-deep .v-input__control {
        .v-input__slot {
          margin: 0 !important;
          padding-bottom: 1px;

          input {
            font-size: 14px !important;
            padding: 0px !important;
          }
        }

        .v-text-field__details {
          min-height: 0px !important;
          height: 0px !important;
        }
      }
    }
  }
}

</style>
