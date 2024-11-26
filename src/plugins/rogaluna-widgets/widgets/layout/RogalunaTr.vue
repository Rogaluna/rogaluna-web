<template>
  <tr 
    @contextmenu="handleRightClick"
    @click="handleClick"
    @dblclick="handleDoubleClick">
    <slot></slot>
  </tr>
</template>

<script>

/**
 * RogalunaDiv
 * 
 * 触发右键菜单的Tr控件，为了解决某些情况下Div无法处理或不易处理的情况
 * 
 * @prop {Boolean} preventDefault - 控制是否阻止右键点击的默认行为
 * @prop {Boolean} stopPropagation - 控制是否停止右键点击事件的传播
 * @prop {Array} menuItems - 右键菜单的菜单项数组，每个菜单项对象应包含 label 、 value 属性和一个 handler 函数对象
 * 
 * @emits rclick - 右键事件响应后触发的函数
 * - @param event - 回调的事件
 * 
 * @note 如果需要右键的上下文，可以使用rclick获取
 */

export default {
  name: 'RogalunaTr',
  props: {
    preventDefault: {
      type: Boolean,
      default: true
    },
    stopPropagation: {
      type: Boolean,
      default: true
    },
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleRightClick(event) {
      if (this.preventDefault) {
        event.preventDefault();
      }
      if (this.stopPropagation) {
        event.stopPropagation();
      }
      this.$emit('rclick', event);
      this.$rogalunaWidgets.showContextMenu({ x: event.clientX, y: event.clientY }, this.menuItems);
    },
    handleClick() {
      this.$emit('click');
    },
    handleDoubleClick() {
      this.$emit('dblclick');
    }
  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
