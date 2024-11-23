<template>
  <div :class="['add-grid-item']" @click="handleClick">
    <div class="plus">
      <div class="plus-sign">+</div>
      <div class="text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddGridItem',
  props: {
    text: {
      type: String,
      default: 'Add Item' // 父组件传入的文字
    }
  },
  methods: {
    handleClick() {
      this.$emit('click'); // 通过 emit 发送 click 事件
    }
  }
};
</script>

<style lang="scss" scoped>
.add-grid-item {
  width: 170px;
  height: 300px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5%;

  &:hover {
    background-color: rgba(var(--light-background-color-rgb), 0.5);
  }
}

.plus {
  width: 100%;
  height: 210px;
  border: 2px dashed var(--split-color);
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  .plus-sign {
    font-size: 48px;
    color: rgba(var(--light-background-color-rgb), 0.5625);
  }

  .text {
    margin-top: 10px;
    font-size: 16px;
    color: rgba(var(--light-background-color-rgb), 0.375);
    text-align: center;
  }
}
</style>
