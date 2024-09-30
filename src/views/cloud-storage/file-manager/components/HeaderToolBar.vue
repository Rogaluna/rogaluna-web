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
      <v-breadcrumbs v-if="!inputVisible" :items="eventBus.sharedState.path" style="">
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

import getParentFolderAPI from '@/plugins/axios/api/cloud-storage/getParentFolder';

export default {
  inject: ['eventBus'],
  components: {
    RogalunaList
  },
  props: {
    uploadDot: Boolean,
    downloadDot: Boolean
  },
  watch: {
    uploadDot() {
      this.postButtons[0].value = this.uploadDot;
    },
    downloadDot() {
      this.postButtons[1].value = this.downloadDot;
    }
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
        },
        {
          text: "下载列表",
          icon: "#rogaluna-icon-download",
          onclick: ()=>{
            this.eventBus.sharedState.isDownloadPanelVisible = true;
          },
          value: this.downloadDot
        },
      ],
      inputVisible: false,
    }
  },
  
  mounted() {

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
      console.log(this.editablePath);
      // 将字符串发送给服务器

      const pathRegex = /^root(\/[a-zA-Z0-9%]+)*$/;
      if (!pathRegex.test(this.editablePath)) {
        // 路径不合法
        this.hideInput();
      } else {
        // const paths = this.editablePath.split('/').filter(p => p.trim() !== '');
        // const breadcrumbs = paths.map(text => ({ text }));
        // this.eventBus.setDir(breadcrumbs);
        this.hideInput();
      }
    },
    handleBreadcrumbClick(item) {
      // 点击路径编辑器
      // const clickedIndex = this.eventBus.sharedState.path.findIndex(b => b.text === item.text);
      // const breadcrumbsSegment = this.eventBus.sharedState.path.slice(0, clickedIndex + 1);
      // console.log(breadcrumbsSegment);
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
  border-color: #424242;
  border-style: solid;
  padding: 5px;

  .breadcrumbs-container {

    .v-breadcrumbs {
      background-color: rgba(0, 0, 0, 0.66);
      border: 1px rgb(200, 200, 200) solid;
      padding: 10px;

      ::v-deep .v-breadcrumbs__item {
        cursor: pointer;
      }

      ::v-deep .v-breadcrumbs__divider{
        cursor: default;
      }
    }

    .v-input {
      background-color: rgba(0, 0, 0, 0.66);
      border: 1px rgb(200, 200, 200) solid;
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
