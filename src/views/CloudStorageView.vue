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

import AsideNavigator from './cloud-storage/components/AsideNavigator.vue';
import HeaderToolBar from './cloud-storage/file-manager/components/HeaderToolBar.vue';

export default {
  components: {
    RogalunaDiv,

    AsideNavigator,
    HeaderToolBar,
  },
  data() {
    return {
      navItems: [
        {
          name: '文件',
          routerName: 'file-manager',
          iconClass: 'mdi-folder',
        },
        {
          name: '云计算机',
          routerName: 'cloud-computer',
          iconClass: 'xedia rogaluna-icon-zhuangtai_guizi',
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