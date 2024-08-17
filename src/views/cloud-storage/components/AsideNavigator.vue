<template>
  <v-navigation-drawer
    app
    permanent
    class="transparent"
    mini-variant
  >
    <v-list dense>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        link
        class="d-flex justify-end"
        @click="handleItemClick(item)"
      >
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-icon v-bind="attrs" v-on="on" class="d-flex justify-end">
              <v-icon>{{ item.iconClass }}</v-icon>
            </v-list-item-icon>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AsideNavigator',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    handleItemClick(item) {
      this.$router.push({ name: item.routerName });
    }
  }
};
</script>

<style scoped>
.transparent {
  background: none;
}
</style>
