<template>
  <component :is="currentComponent" class="background-manager"/>
</template>

<script>
export default {
  computed: {
    componentPath() {
      return this.$store.state.plugins.rogalunaBkManager.componentPath;
    }
  },
  watch: {
    componentPath: {
      immediate: true,
      handler(newPath) {
        this.loadComponent(newPath);
      }
    }
  },
  data() {
    return {
      currentComponent: null
    };
  },
  created() {
    this.loadComponent(this.componentPath);
  },
  methods: {
    async loadComponent(path) {
      try {
        const component = await import(`./backgrounds/${path}`);
        this.currentComponent = component.default || component;
      } catch (error) {
        console.error(`Failed to load component at path: ${path}`, error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.background-manager {
  z-index: 0;
}
</style>