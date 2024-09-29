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

.__icon__es {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}

.__icon__s {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}

.__icon__m {
  width: 3em;
  height: 3em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}

.__icon__l {
  width: 4em;
  height: 4em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}

.__icon__el {
  width: 5em;
  height: 5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}
</style>
