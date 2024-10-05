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
    <div v-if="useEndElement" class="grid-item" :style="[itemStyle]">
      <slot name="end"></slot>
    </div>
  </div>
</template>

<script>

/**
 * RogalunaGrid
 * 
 * 可设定行列的Grid控件,如果不设置row和col,将会自动布局(从上到下，从左到右依次排列)
 * 
 * @prop {Array} items - 列表项数据数组
 * @prop {Number} rows - 固定行数
 * @prop {Number} columns - 固定列数
 * @prop {Object} itemStyle - 元素样式
 * @prop {Bool} useEndElement - 启用末尾元素，可以在Grid末尾添加一个其他模板的组件
 * 
 * @note 当rows和columns有值时，会设置grid样式，依照设定的行列进行排列，而当rows和columns没有取值时，会依照元素大小依次排列，此时设置itemStyle的宽高会很有用。
 * 
 * @example 
 * 
<template>
  <div>
    <RogalunaGrid :items="items" :rows="3" :columns="3" :itemStyle="{ width: '100px', height: '100px' }">
      <template #default="{ item, index }">
        <div>
          <p>{{ item.name }}</p>
          <p>Index: {{ index }}</p>
        </div>
      </template>
    </RogalunaGrid>
  </div>
</template>

<>
import RogalunaGrid from './RogalunaGrid.vue';

export default {
  components: {
    RogalunaGrid
  },
  data() {
    return {
      items: [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' },
        { name: 'Item 4' },
        { name: 'Item 5' },
        { name: 'Item 6' },
        { name: 'Item 7' },
        { name: 'Item 8' },
        { name: 'Item 9' },
      ]
    };
  }
};
<script> // 此处需要替换为结束符

<style lang="scss" scoped>
p {
  margin: 0;
  text-align: center;
}
</style>

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
    },
    useEndElement: {
      type: Boolean,
      default: false
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
  flex-wrap: wrap;

  .grid-item {
    width: fit-content;
    height: fit-content;
    // padding: 10px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
}
</style>
