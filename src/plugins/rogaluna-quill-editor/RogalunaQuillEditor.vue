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
      type: Array,
      default: () => [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        ["link", "image", "video", "formula"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ["clean"], // remove formatting button
      ],
    },
    handlers: {
      type: Function,
      default: () => {}, // 用户自定义的 handlers
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
        modules: {
          toolbar: {
            container: this.options,
            handlers: this.handlers(this),
          },
        },
        theme: 'rogaluna'
      };

      this.quill = new Quill(this.$refs.editor, editorOptions);

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

::v-deep .ql-container {
  flex-grow: 1;
  min-height: 0;
}
</style>
