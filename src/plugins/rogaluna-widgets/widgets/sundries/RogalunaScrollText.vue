<!-- 此组件改良自 https://blog.csdn.net/hyupeng1006/article/details/135241154 -->
<template>
  <div class="scrollText" ref="outer">
    <div class="st-inner" :class="{ 'st-scrolling': scroll && needToScroll }">
      <span class="st-section" ref="inner">{{ text }}</span>
      <span class="st-section" v-if="scroll && needToScroll">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scroll: {
      type: Boolean,
      default: true // 默认滚动
    }
  },
  data() {
    return {
      needToScroll: false, // 是否需要滚动
      text: "" // 当前显示的文本内容
    };
  },
  mounted() {
    this.setText();
    this.checkScroll();
  },
  methods: {
    // 检查是否需要滚动
    checkScroll() {
      this.$nextTick(() => {
        this.needToScroll = this.isOverflow();
      });
    },
    // 判断子元素宽度是否超出父元素宽度
    isOverflow() {
      const outer = this.$refs.outer;
      const inner = this.$refs.inner;
      if (!outer || !inner) return false;
      return inner.offsetWidth > outer.offsetWidth;
    },
    // 获取到父组件传递的插槽内容
    setText() {
      this.text =
        (this.$slots.default &&
          this.$slots.default.reduce((res, it) => res + it.text, "")) ||
        "";
    }
  }
};
</script>

<style lang="scss" scoped>
.scrollText {
  overflow: hidden;
  white-space: nowrap;
}
.st-inner {
  display: inline-block;
}
.st-scrolling .st-section {
  padding: 0 5px;
}

// 滚动动画
.st-scrolling {
  animation: scroll 10s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translate3d(0%, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
