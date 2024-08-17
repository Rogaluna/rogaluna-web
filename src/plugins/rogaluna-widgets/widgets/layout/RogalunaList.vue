<template>
  <div class="list-container" :class="{'is-horizontal': horizontal}">
    <div v-for="(item, index) in items" :key="index"
      class="list-item"
      :style="[itemStyle]">
      <slot name="item" :item="item" :index="index">{{ item.name }}</slot>
    </div>
  </div>
</template>

<script>

/**
 * RogalunaList
 * 
 * 支持横向排列的列表控件
 * 
 * @prop {Array} items - 列表项数据数组
 * @prop {Boolean} horizontal - 设置列表方向
 * @prop {Object} itemStyle - 元素样式
 * 
 * @note 这个控件能够设置元素的排列方向，只需要将horizontal属性添加，即可使得横向排列。
 */

export default {
  name: 'RogalunaList',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    itemStyle: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &.is-horizontal {
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .list-item {
    padding: 10px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>