<template>
  <div>
    <aside-navigator :items="navItems"></aside-navigator>
    <v-main style="height: 100%;">
      <div style="display: flex; flex-grow: 1; overflow: hidden;">
        <router-view/>
      </div>

      <div>
        <MusicPlayerBar />
      </div>
    </v-main>
  </div>
</template>

<script>
import EventBus from '@/views/music-station/bus/playManager'

import AsideNavigator from '../components/AsideNavigator.vue';
import MusicPlayerBar from './components/MusicPlayerBar.vue';

export default {
  provide() {
    return {
      eventBus: EventBus
    };
  },
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
            self.$router.push({ name: 'music-collection' });
          }
        },
        {
          name: '最近播放',
          iconClass: '#rogaluna-icon-backups',
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
  justify-content: space-between;
}
</style>