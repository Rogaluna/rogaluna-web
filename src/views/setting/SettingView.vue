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
          name: '账户设置',
          iconClass: '#rogaluna-icon-file',
          handler: (self) => {
            self.$router.push({ name: 'account-setting' });
          }
        },
      ],
    };
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>

</style>