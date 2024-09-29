<template>
  <v-navigation-drawer
    app
    permanent
    class="transparent"
    mini-variant
  >
    <v-list dense class="flex-list">
      <!-- 顶部选项 -->
      <div class="item-list">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          link
          class="d-flex justify-end"
          @click="handleItemClick(item)"
        >
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <svg class="__icon__m item"
                aria-hidden="true"
                icon
                v-bind="attrs"
                v-on="on"
                :style="item.iconStyle">
                <use :xlink:href="item.iconClass"></use>
              </svg>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>
      </div>

      <!-- 使用 v-spacer 将下方的内容推到最底部 -->
      <v-spacer></v-spacer>

      <!-- 分隔线 -->
      <v-divider/>

      <!-- 底部选项 -->
      <div class="item-list">
        <v-list-item
          v-for="(item, index) in bottomItems"
          :key="index"
          link
          class="d-flex justify-end"
          @click="handleItemClick(item)"
        >
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <svg class="__icon__m item"
                aria-hidden="true"
                icon
                v-bind="attrs"
                v-on="on"
                :style="item.iconStyle">
                <use :xlink:href="item.iconClass"></use>
              </svg>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>
      </div>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AsideNavigator',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    bottomItems: {
      type: Array,
      default: () => [
        {
          name: "首页",
          iconClass: "#rogaluna-icon-classification",
          handler: (self) => {
            self.$router.push({ name: 'home' });
          }
        }
      ],
    }
  },
  methods: {
    handleItemClick(item) {
      item.handler(this);
    },
  }
};
</script>

<style scoped>
.transparent {
  background: none;
}

.flex-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item-list {
  flex-grow: 0; /* 确保生成的项目不会伸展 */
}

.home-item {
  margin-top: auto; /* 将首页按钮推到列表底部 */
}
</style>
