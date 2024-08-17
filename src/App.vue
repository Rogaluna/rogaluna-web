<template>
    <v-app id="app" data-app>
        <background-manager-component/>
    
        <router-view id="main-router"/>
    </v-app>
</template>

<script>
import BackgroundManagerComponent from '@/plugins/rogaluna-bk-manager/BackgroundManagerComponent.vue'

export default {
  name: 'HomeView',
  components: {
    BackgroundManagerComponent,
  },
}
</script>

<style lang="scss">
html {
    overflow: hidden !important;
}

body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;

    #app {
        height: 100%;

        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;

        z-index: 0;
    }

    #main-router {
        z-index: 1;
        height: 100%;
    }
}
</style>
