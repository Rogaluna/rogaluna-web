<template>
  <div style="height: 100%;">
    <rogaluna-quill-editor 
      v-model="content" 
      :options="editorOptions"
      style="display: flex; flex-direction: column; height: 100%;"></rogaluna-quill-editor>
  </div>
</template>

<script>
import RogalunaQuillEditor from '@/plugins/rogaluna-quill-editor/RogalunaQuillEditor.vue';

export default {
  components: {
    RogalunaQuillEditor
  },
  data() {
    return {
      content: '', // 编辑器内容
      editorOptions: {
        modules: {
          toolbar: true, // 或者传递工具栏配置对象
        },
      },
    };
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>