<template>
  <v-app id="app" data-app :style="{
      '--primary-color': theme.primary,
      '--primary-color-rgb': theme.primaryRGB,
      '--secondary-color': theme.secondary,
      '--secondary-color-rgb': theme.secondaryRGB,
      '--accent-color': theme.accent,
      '--accent-color-rgb': theme.accentRGB,
      '--split-color': theme.split,
      '--split-color-rgb': theme.splitRGB,
      '--deep-background-color': theme.deepBackground,
      '--deep-background-color-rgb': theme.deepBackgroundRGB,
      '--light-background-color': theme.lightBackground,
      '--light-background-color-rgb': theme.lightBackgroundRGB,
    }">
    <background-manager-component/>
  
    <router-view id="main-router"/>
  </v-app>
</template>

<script>
import BackgroundManagerComponent from '@/plugins/rogaluna-bk-manager/BackgroundManagerComponent.vue'

import ApplicationBus from '@/views/bus/application';

export default {
  name: 'HomeView',
  provide() {
    return {
      applicationBus: ApplicationBus,
    };
  },
  data() {
    return {
      themeName: 'dark',
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.themes[this.themeName];
    },
  },
  components: {
    BackgroundManagerComponent,
  },
}
</script>

<style lang="scss">
html {
  overflow: hidden !important;

  /*滚动条宽高 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    cursor: pointer;
  }

  /* 滚动条上的滚动滑块样式 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(var(--primary-color-rgb), 0.8);
    cursor: pointer;
  }

  /* 鼠标悬停时 */
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--primary-color-rgb), 0.6);
    cursor: pointer;
  }

  /* 鼠标按下时 */
  ::-webkit-scrollbar-thumb:active {
    background-color: var(--primary-color);
    cursor: pointer;
  }
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
    color: #FFF;

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
