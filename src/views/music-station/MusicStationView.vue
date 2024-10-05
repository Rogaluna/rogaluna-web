<template>
  <div>
    <aside-navigator :items="navItems"></aside-navigator>
    <v-main style="height: 100%;">
    
      <div style="flex-grow: 1; overflow-y: auto;">
        <router-view/>
      </div>

      <div>
        <MusicPlayerBar />
      </div>
    </v-main>
  </div>
</template>

<script>
import AsideNavigator from '../components/AsideNavigator.vue';
import MusicPlayerBar from './components/MusicPlayerBar.vue';

export default {
  components: {
    AsideNavigator,
    MusicPlayerBar
  },
  data() {
    return {
      navItems: [
        {
          name: '音乐台',
          iconClass: '#rogaluna-icon-fenlei',
          handler: (self) => {
            self.$router.push({ name: 'music-center' });
          }
        },
        {
          name: '收藏品',
          iconClass: '#rogaluna-icon-Collection',
          handler: (self) => {
            // self.$router.push({ name: 'file-manager' });
          }
        },
        {
          name: '最近播放',
          iconClass: '#rogaluna-icon-a-order-recentlysearch',
          handler: (self) => {
            // self.$router.push({ name: 'file-manager' });
          }
        }
      ],
    };
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-main__wrap {
  display: flex;
  flex-direction: column;
}
</style>