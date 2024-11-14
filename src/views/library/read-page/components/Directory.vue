<template>
  <v-treeview
    :items="treeItems"
    open-on-click
    :open.sync="openNodes"
    item-value="chapter_number"
    item-text="title"
    item-children="children"
    transition
  >
    <template v-slot:prepend="{ item }">
      <svg 
        v-if="!item.children"
        class="__icon__s"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-tushuguan"></use>
      </svg>
      <svg 
        v-else
        class="__icon__s"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-file"></use>
      </svg>
    </template>

    <template v-slot:label="{ item }">
      <div class="chapter-label" @click="handleItemClick(item)">
        {{ item.title }}
      </div>
    </template>
  </v-treeview>
</template>

<script>
export default {
  props: {
    chapters: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      openNodes: []
    }
  },
  computed: {
    // 构建并排序章节树
    treeItems() {
      const groupedItems = {}

      // 构建分组目录
      this.chapters.forEach(chapter => {
        const groups = chapter.group ? chapter.group.split('/') : []
        let currentLevel = groupedItems

        // 根据 group 字段构建嵌套结构
        groups.forEach(group => {
          if (!currentLevel[group]) {
            currentLevel[group] = { title: group, children: {}, chapter_number: Infinity }
          }
          currentLevel = currentLevel[group].children
        })

        // 将章节添加到相应分组
        currentLevel[chapter.chapter_number] = {
          ...chapter,
          children: []
        }
      })

      // 将嵌套对象转换为数组格式，并进行排序
      const convertToTree = (obj) => {
        return Object.values(obj)
          .map(item => {
            if (Object.keys(item.children).length === 0) {
              delete item.children
            } else {
              item.children = convertToTree(item.children)
            }
            return item
          })
          .sort((a, b) => a.chapter_number - b.chapter_number)
      }

      return convertToTree(groupedItems)
    }
  },
  methods: {
    // 点击章节条目时的处理逻辑
    handleItemClick(item) {
      if (item.children && item.children.length > 0) {
        // 如果有子节点，则切换展开/折叠状态
        const index = this.openNodes.indexOf(item.chapter_number)
        if (index === -1) {
          this.openNodes.push(item.chapter_number)
        } else {
          this.openNodes.splice(index, 1)
        }
      } else {
        // 如果是叶子节点，触发选中事件
        this.$emit('chapterSelected', item)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.chapter-label {
  display: flex;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

::v-deep .v-treeview-node {
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: var(--primary-color);
}

::v-deep .v-treeview-node--leaf {
  border-width: 0;
}
</style>
