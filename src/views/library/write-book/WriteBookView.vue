<template>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <v-banner
      single-line
      :sticky="false"
    >
      <svg class="__icon__m"
        aria-hidden="true"
        icon>
        <use xlink:href="#rogaluna-icon-xiezuo"></use>
      </svg>
      <span class="title-text">&nbsp;&nbsp;写作</span>

      <!-- <template v-slot:actions>
        <v-btn
          text
          color="primary"
          @click="newBook"
        >
          新建
        </v-btn>
      </template> -->
    </v-banner>

    <div style="flex-grow: 1; min-height: 0;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>

::v-deep .v-banner__text {
  text-align: left;

  .title-text {
    background: linear-gradient(
      to right, 
      var(--light-background-color),
      var(--primary-color)
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    font-size: 24px;
  }
}

</style>