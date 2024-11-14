<template>
  <v-dialog v-model="visible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline">章节设置</v-card-title>

      <v-card-text>
        <v-form ref="chapterForm" v-model="valid">
          <!-- 排序索引 -->
          <v-text-field
            label="排序索引"
            v-model="form.index"
            :rules="[rules.required, rules.numeric]"
            required
          ></v-text-field>

          <!-- 章节名称 -->
          <v-text-field
            label="章节名称"
            v-model="form.name"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <!-- 组名称 -->
          <v-text-field
            label="组名称"
            v-model="form.group"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="del">删除章节</v-btn>
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
      visible: true,
      valid: false,
      form: {
        index: '',
        name: '',
        group: ''
      },
      rules: {
        required: value => !!value || '此字段为必填项',
        numeric: value => !isNaN(value) || '必须为数字'
      }
    };
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
      if (this.$refs.chapterForm.validate()) {
        this.$emit('confirm', this.form);
        this.$emit('close');
      }
    },
    cancel() {
      this.$emit('cancel');
      this.$emit('close');
    },
    resetForm() {
      this.form.index = '';
      this.form.name = '';
      this.form.group = '';
      this.$refs.chapterForm.resetValidation();
    }
  }
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>
