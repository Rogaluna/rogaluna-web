<template>
  <div class="list-container" :class="{'is-horizontal': horizontal}">
    <div v-show="$slots.start" class="list-item" :style="[itemStyle]">
      <slot name="start"></slot>
    </div>
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="list-item" 
      :style="[itemStyle]"
    >
      <slot name="item" :item="item" :index="index">{{ item.name }}</slot>
    </div>
    <div v-show="$slots.end" class="list-item" :style="[itemStyle]">
      <slot name="end"></slot>
    </div>
  </div>
</template>

<script>
/**
 * RogalunaList
 * 
 * 支持横向和纵向排列的列表控件，并提供起始和结束插槽区域。
 * 
 * @prop {Array} items - 列表项数据数组
 * @prop {Boolean} horizontal - 设置列表方向（横向/纵向）
 * @prop {Object} itemStyle - 元素样式
 * 
 * @note 使用horizontal属性控制列表的排列方向。启用时列表会横向排列。
 *       起始和结束插槽(start和end)可用于在列表项前后插入自定义内容。
 * 
 * @example
 * <template>
 *   <div>
 *     <RogalunaList :items="items" :horizontal="true" :itemStyle="{ width: '100px', height: '50px' }">
 *       <template #start>
 *         <div>开始插槽</div>
 *       </template>
 *       <template #item="{ item, index }">
 *         <div>
 *           <p>{{ item.name }}</p>
 *           <p>Index: {{ index }}</p>
 *         </div>
 *       </template>
 *       <template #end>
 *         <div>结束插槽</div>
 *       </template>
 *     </RogalunaList>
 *   </div>
 * </template>
 * 
 * <script>
 * import RogalunaList from './RogalunaList.vue';
 *
 * export default {
 *   components: {
 *     RogalunaList
 *   },
 *   data() {
 *     return {
 *       items: [
 *         { name: 'Item 1' },
 *         { name: 'Item 2' },
 *         { name: 'Item 3' },
 *         { name: 'Item 4' }
 *       ]
 *     };
 *   }
 * };
 * <script>
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
};
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-direction: column;

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
