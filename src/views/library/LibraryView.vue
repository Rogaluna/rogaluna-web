<template>
  <div>
    <aside-navigator :items="navItems" :bottomItems="bottomNavItems"></aside-navigator>
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
          name: '图书馆',
          iconClass: '#rogaluna-icon-fenlei',
          handler: (self) => {
            self.$router.push({ name: 'library-center' });
          }
        },
        {
          name: '书架',
          iconClass: '#rogaluna-icon-Collection',
          handler: (self) => {
            self.$router.push({ name: 'bookshelf' });
          }
        },
        // {
        //   name: '收藏品',
        //   iconClass: '#rogaluna-icon-Collection',
        //   handler: (self) => {
        //     // self.$router.push({ name: 'file-manager' });
        //   }
        // },
        {
          name: '最近参阅',
          iconClass: '#rogaluna-icon-backups',
          handler: (self) => {
            self.$router.push({ name: 'read-history' });
          }
        }
      ],
      bottomNavItems: [
        {
          name: "写作",
          iconClass: "#rogaluna-icon-xiezuo",
          iconStyle: { color: this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.primary : this.$vuetify.theme.themes.light.primary },
          handler: (self) => {
            // 跳转到写书页面
            self.$router.push({ name: 'write-book' });
          }
        },
        {
          name: "首页",
          iconClass: "#rogaluna-icon-classification",
          handler: (self) => {
            self.$router.push({ name: 'home' });
          }
        }
      ]
    };
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>

</style>