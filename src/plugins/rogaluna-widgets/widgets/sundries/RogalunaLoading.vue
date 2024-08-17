<template>
  <div class="loading-overlay">
    <v-progress-circular 
      :size="50"
      :width="5"
      indeterminate 
      color="accent"
      ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'RogalunaLoading'
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.46;
  background-color: rgb(33, 33, 33);
  border-color: rgb(33, 33, 33);
  z-index: 9999;
}
</style>
