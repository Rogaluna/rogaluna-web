<template>
  <div :class="['container']" :style="containerStyle">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="grid-item"
      :style="[itemStyle]"
    >
      <slot :item="item" :index="index"></slot>
    </div>
  </div>
</template>

<script>

/**
 * RogalunaGrid
 * 
 * 可设定行列的Grid控件
 * 
 * @prop {Array} items - 列表项数据数组
 * @prop {Number} rows - 固定行数
 * @prop {Number} columns - 固定列数
 * @prop {Object} itemStyle - 元素样式
 * 
 * @note 当rows和columns有值时，会设置grid样式，依照设定的行列进行排列，而当rows和columns没有取值时，会依照元素大小依次排列，此时设置itemStyle的宽高会很有用。
 */

export default {
  name: 'RogalunaGrid',
  props: {
    rows: {
      type: Number,
      default: null
    },
    columns: {
      type: Number,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    itemStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    totalItems() {
      return this.items.length;
    },
    calculatedColumns() {
      if (this.columns) {
        return this.columns;
      }
      if (this.rows) {
        return Math.ceil(this.totalItems / this.rows);
      }
      return Math.ceil(Math.sqrt(this.totalItems));
    },
    calculatedRows() {
      if (this.rows) {
        return this.rows;
      }
      if (this.columns) {
        return Math.ceil(this.totalItems / this.columns);
      }
      return Math.ceil(Math.sqrt(this.totalItems));
    },
    containerStyle() {
      if (this.rows !== null || this.columns !== null) {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${this.calculatedColumns}, 1fr)`,
          gridTemplateRows: `repeat(${this.calculatedRows}, 1fr)`,
        };
      } else {
        return {
          display: 'flex'
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  max-width: none;

  .grid-item {
    padding: 10px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
}
</style>
