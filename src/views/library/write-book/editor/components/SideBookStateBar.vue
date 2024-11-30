<template>
  <div class="side-book-state-bar">
    <!-- 第一行: 目录展示区域 -->
    <div class="directory">
      <!-- 目录内容展示 -->
      <rogaluna-list :items="items" :itemStyle="{padding: 0, borderWidth: 0, justifyContent: 'flex-start', cursor: 'pointer'}">
        <template #item="{ item }">
          <div class="item" :class="selectedIndex == item.chapter_number ? 'selected-item': ''" @click="selectChapter(item)">
            <span>
              <span class="index-symbol"><sup>#<sub>{{ item.chapter_number }}</sub>&nbsp;</sup></span>
              <span class="title-symbol">{{ item.title }}</span>
            </span>
            <span>
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon @click="chapterSetting(item)">
                    <svg class="__icon__es"
                      aria-hidden="true"
                      icon
                      v-bind="attrs"
                      v-on="on">
                      <use xlink:href="#rogaluna-icon-more"></use>
                    </svg>
                  </v-btn>
                </template>
                <span>章节设置</span>
              </v-tooltip>
            </span>
          </div>
        </template>
      </rogaluna-list>
    </div>

    <!-- 第二行: 底部图标按钮 -->
    <div class="bottom-icon">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="saveChapter(selectedIndex)" :disabled="selectedIndex < 0">
            <svg class="__icon__s"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on">
              <use xlink:href="#rogaluna-icon-Checkout"></use>
            </svg>
          </v-btn>
        </template>
        <span>保存撰写</span> 
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="addChapter">
            <svg class="__icon__s"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on">
              <use xlink:href="#rogaluna-icon-add"></use>
            </svg>
          </v-btn>
        </template>
        <span>添加章节</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="moreSetting">
            <svg class="__icon__s"
              aria-hidden="true"
              icon
              v-bind="attrs"
              v-on="on">
              <use xlink:href="#rogaluna-icon-more"></use>
            </svg>
          </v-btn>
        </template>
        <span>书籍设置</span>
      </v-tooltip>
      
    </div>
  </div>
</template>

<script>
import RogalunaList from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaList.vue';

export default {
  components: {
    RogalunaList
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedIndex: -1
    }
  },
  methods: {
    selectChapter(item) {
      this.selectedIndex = item.chapter_number;
      this.$emit('sideOpts', {type: 'selectChapter', payload: item});
    },
    chapterSetting(item) {
      this.$emit('sideOpts', {type: 'setChapter', payload: item});
    },
    addChapter() {
      this.$emit('sideOpts', {type: 'addChapter'});
    },
    moreSetting() {
      this.$emit('sideOpts', {type: 'moreSetting'});
    },
    saveChapter(chapterIndex) {
      this.$emit('sideOpts', {type: 'saveChapter', payload: chapterIndex});
    }
  },
};
</script>

<style scoped lang="scss">
.side-book-state-bar {  
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: transparent;
  justify-content: space-between;

  .directory {
    padding: 8px;
    overflow-y: scroll;
  
    .item {
      .index-symbol {
        color: var(--split-color);
      }
    
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-width: 0px 0px 1px 0px;
      border-style: solid;
      border-color: var(--light-color);

      &:hover {
        .title-symbol {
          color: var(--primary-color);
        }
      }
    }

    .selected-item {
      color: var(--primary-color);
    }
  }

  .bottom-icon {
    padding: 8px;
    display: flex;
    justify-content: right;
  }
}
</style>
