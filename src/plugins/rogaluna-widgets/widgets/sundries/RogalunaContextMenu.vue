<template>
  <v-menu v-model="menuVisible" :position-x="menuPosition.x" :position-y="menuPosition.y" absolute>
    <v-list 
      dense
      :rounded="defaultAttr.list.rounded"
      :width="defaultAttr.list.width">
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        @click="item.handler"
      >
        <v-list-item-icon v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title align="left">{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'RogalunaContextMenu',
  data() {
    return {
      defaultAttr: {
        list: {
          rounded: false,
          width: '220px',
        }
      },

      menuVisible: false,
      menuPosition: { x: 0, y: 0 },
      menuItems: []
    };
  },
  methods: {
    showMenu(position, items) {
      this.menuPosition = position;
      this.menuItems = items;
      this.menuVisible = true;
    }
  }
};
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>
