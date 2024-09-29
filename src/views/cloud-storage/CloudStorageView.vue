<template>
  <div>
    <aside-navigator :items="navItems"></aside-navigator>
    <v-main style="height: 100%;">
      <router-view/>
    </v-main>
  </div>
</template>

<script>
import AsideNavigator from '../components/AsideNavigator.vue';

export default {
  components: {
    AsideNavigator,
  },
  data() {
    return {
      navItems: [
        {
          name: '文件',
          iconClass: '#rogaluna-icon-file',
          handler: (self) => {
            self.$router.push({ name: 'file-manager' });
          }
        },
        // {
        //   name: '云计算机',
        //   iconClass: 'xedia rogaluna-icon-zhuangtai_guizi',
        //   handler: (self) => {
        //     self.$router.push({ name: 'cloud-computer' });
        //   }
        // }
      ],
    };
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>

</style>