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
          <v-select
            label="分类标签"
            v-model="form.categoryTags"
            :items="categories"
            multiple
            chips
            :rules="[rules.required]"
            required
          ></v-select>
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
import getBookCategoriesAPI from '@/plugins/axios/api/library/getBookCategories';
import newBookAPI from '@/plugins/axios/api/library/newBook';

export default {
  data() {
    return {
      visible: true, // 控制对话框的显示
      valid: false,  // 用于表单验证状态
      form: {
        bookName: '',
        bookDescription: '',
        categoryTags: []
      },
      
      rules: {
        required: value => !!value || '此字段为必填项', // 验证规则
      }
    };
  },
  props: {
    categories: [], // 分类选项
  },
  methods: {
    flattenCategories(categories) {
      let flatCategories = [];

      const flatten = (category, parent = '') => {
        for (let key in category) {
          let fullName = parent ? `${parent} / ${key}` : key;
          flatCategories.push({
            label: fullName,
            value: key
          });

          if (Object.keys(category[key].subcategories).length > 0) {
            flatten(category[key].subcategories, fullName);
          }
        }
      };

      flatten(categories);
      return flatCategories;
    },
    async confirm() {
      if (this.$refs.bookForm.validate()) {
        this.$emit('confirm', this.form);
        this.visible = false;
        this.$emit('close');
      }
    },
    cancel() {
      // 取消操作，关闭对话框
      this.$emit('cancel');
      this.visible = false;
      this.$emit('close'); // 用于触发销毁逻辑
    }
  }
};
</script>
