<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">添加书籍</v-card-title>

      <v-card-text>
        <v-form ref="bookForm" v-model="valid">
          <!-- 书籍名称 -->
          <v-text-field
            label="书籍名称"
            v-model="form.bookName"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <!-- 书籍介绍 -->
          <v-textarea
            label="书籍描述"
            v-model="form.bookDescription"
            :rules="[rules.required]"
            required
          ></v-textarea>

          <!-- 分类标签 -->
          <v-menu
            v-model="menuVisible"
            close-on-content-click="false"
            max-width="400px"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-bind="attrs"
                v-on="on"
                label="选择分类标签"
                :value="selectedCategoryNames.join(', ')"
                readonly
              ></v-text-field>
            </template>

            <v-treeview
              :items="categories"
              v-model="form.categoryTags"
              activatable
              open-on-click
              item-text="name"
              item-value="id"
              multiple
              selectable
              return-object
              class="treeview-dropdown"
            ></v-treeview>
          </v-menu>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="confirm">确认</v-btn>
        <v-btn color="secondary" @click="cancel">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: true, // 控制对话框的显示
      menuVisible: false, // 控制菜单（下拉框）的显示状态
      valid: false, // 用于表单验证状态
      form: {
        bookName: '',
        bookDescription: '',
        categoryTags: [] // 用户选择的标签
      },
      rules: {
        required: value => !!value || '此字段为必填项' // 验证规则
      }
    };
  },
  props: {
    categories: {
      type: Array, // 期待传入的分类数据是一个数组
      required: true
    }
  },
  computed: {
    // 计算已选择的分类名称列表
    selectedCategoryNames() {
      return this.form.categoryTags.map(tag => tag.name);
    }
  },
  methods: {
    async confirm() {
      if (this.$refs.bookForm.validate()) {
        this.$emit('confirm', this.form); // 提交表单
        this.visible = false;
        this.$emit('close'); // 关闭对话框
      }
    },
    cancel() {
      this.$emit('cancel'); // 取消操作
      this.visible = false;
      this.$emit('close'); // 关闭对话框
    }
  }
};
</script>

<style scoped>
.treeview-dropdown {
  max-height: 200px; /* 限制高度 */
  overflow-y: auto;  /* 启用滚动条 */
}
</style>
