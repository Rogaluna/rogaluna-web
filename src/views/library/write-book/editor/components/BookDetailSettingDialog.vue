<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">书籍详细设置</v-card-title>

      <v-card-text>
        <v-form ref="bookForm" v-model="valid">
          <v-row>
            <v-col>
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
                required
              ></v-textarea>

              <!-- 分类标签 -->
              <v-menu
                v-model="menuVisible"
                :close-on-content-click="false"
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
            </v-col>
            <v-col>
              <rogaluna-image-uploader :src="form.coverUrl" @click="handleChangeImage">

              </rogaluna-image-uploader>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="del">删除书籍</v-btn>
        <v-btn color="primary" @click="confirm">确认</v-btn>
        <v-btn color="secondary" @click="cancel">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RogalunaImageUploader from '@/plugins/rogaluna-widgets/widgets/sundries/RogalunaImageUploader.vue';

export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    initData:{
      type: Object,
      require: true 
    }
  },
  components: {
    RogalunaImageUploader
  },
  data() {
    return {
      visible: true,
      menuVisible: false,
      valid: false,
      form: {
        bookName: this.initData.name,
        bookDescription: this.initData.description,
        categoryTags: this.getCategoryTagsFromIds(this.initData.tags),
        coverUrl: this.initData.coverUrl
      },
      rules: {
        required: value => !!value || '此字段为必填项'
      }
    };
  },
  computed: {
    selectedCategoryNames() {
      return this.form.categoryTags.map(tag => tag.name);
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) this.resetForm();
    }
  },
  methods: {
    del() {
      this.$emit('del');
      this.$emit('close');
    },
    confirm() {
      if (this.$refs.bookForm.validate()) {
        this.$emit('confirm', this.form);
        this.$emit('close');
      }
    },
    cancel() {
      this.$emit('cancel');
      this.$emit('close');
    },
    resetForm() {
      this.form.bookName = '';
      this.form.bookDescription = '';
      this.form.categoryTags = [];
      this.$refs.bookForm.resetValidation();
    },
    // 递归查找分类标签
    getCategoryTagsFromIds(ids) {
      const result = [];
      const findTags = (categories) => {
        categories.forEach(category => {
          if (ids.includes(category.id)) {
            result.push(category);
          }
          if (category.children && category.children.length > 0) {
            findTags(category.children);
          }
        });
      };
      findTags(this.categories);
      return result;
    },
    handleChangeImage() {
      this.$emit("changeCover");
    }
  }
};
</script>

<style scoped>
.treeview-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
</style>
