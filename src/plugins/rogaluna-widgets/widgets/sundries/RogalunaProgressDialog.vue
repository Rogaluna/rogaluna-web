<template>
  <v-dialog v-model="visible" persistent :width="width">
    <v-card>
      <v-card-title>{{ taskName }} ({{ currentTask }}/{{ totalTasks }})</v-card-title>
      <v-card-subtitle align="left" v-if="useSubtitle">{{ subtitle }}</v-card-subtitle>
      <v-card-text>
        <v-progress-linear
          :value="percentage"
          :indeterminate="indeterminate"
          color="primary"
        ></v-progress-linear>
        <span>{{ percentage }}%</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="!autoComplete"
          :disabled="!completed"
          @click="completeProgress"
        >
          完成
        </v-btn>
        <v-btn
          v-if="useCancel"
          :disabled="completed"
          @click="cancelProgress"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [String, Number],
      default: 500,
    },
    taskName: {
      type: String,
      default: '任务',
    },
    totalTasks: {
      type: Number,
      default: 1,
    },
    currentTask: {
      type: Number,
      default: 0,
    },
    useSubtitle: {
      type: Boolean,
      default: false,
    },
    subtitle: {
      type: String,
      default: '',
    },
    percentage: {
      type: Number,
      default: 0,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    autoComplete: {
      type: Boolean,
      default: false,
    },
    useCancel: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    completeProgress() {
      this.$emit('complete');
    },
    cancelProgress() {
      this.$emit('cancel');
    },
  },
};
</script>