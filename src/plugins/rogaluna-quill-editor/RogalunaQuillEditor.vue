<template>
  <div class="rogaluna-quill-editor">
    <div ref="editor"></div>
  </div>
</template>

<script>
export default {
  name: 'RogalunaQuillEditor',
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      quill: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const Quill = this.$Quill;

      const editorOptions = {
        theme: 'rogaluna', // 使用自定义主题
        modules: {
          toolbar: true, // 确保启用 toolbar 模块
          ...this.options.modules,
        },
        ...this.options,
      };

      this.quill = new Quill(this.$refs.editor, {
  modules: {
    toolbar: [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
]
  },
  theme: 'snow'
});

      // 设置初始内容
      this.quill.root.innerHTML = this.value;

      // 监听文本变化事件
      this.quill.on('text-change', () => {
        const html = this.quill.root.innerHTML;
        this.$emit('input', html);
      });
    },
  },
  watch: {
    value(newValue) {
      if (this.quill && newValue !== this.quill.root.innerHTML) {
        const selection = this.quill.getSelection();
        this.quill.root.innerHTML = newValue;
        if (selection && this.quill.hasFocus()) {
          this.quill.setSelection(selection);
        }
      }
    },
  },
  beforeDestroy() {
    if (this.quill) {
      this.quill = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.rogaluna-quill-editor {
  /* 可以在这里添加自定义样式 */

  ::v-deep .ql-snow * {
    fill: var(--primary-color) !important;
    color: var(--light-background-color) !important;
    stroke: var(--light-background-color) !important;
  }
}


</style>
