<template>
  <div>
    <aside-navigator :items="navItems"></aside-navigator>
    <v-main style="height: 100%;">
      <router-view/>
    </v-main>
  </div>
</template>

<script>
import RogalunaDiv from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaDiv.vue';

import AsideNavigator from './components/AsideNavigator.vue';

export default {
  components: {
    RogalunaDiv,

    AsideNavigator,
  },
  data() {
    return {
      navItems: [
        {
          name: '图书馆',
          routerName: 'file-manager',
          iconClass: 'mdi-folder',
        },
        {
          name: '收藏品',
          routerName: 'file-manager',
          iconClass: 'mdi-folder',
        },
        {
          name: '最近参阅',
          routerName: 'file-manager',
          iconClass: 'mdi-folder',
        }
      ],
    };
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>

</style>