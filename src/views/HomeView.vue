<template>
  <div class="home">
    <div class="menu">
      <rogaluna-list
      :items="items"
      :horizontal="true"
      :item-style="{border: 0, padding: 0}">
        <template v-slot:item="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div 
              class="glassIco" 
              v-bind="attrs"
              v-on="on"
              @click="handleItemClick(item)"
              >
                <div style="font-size: larger;" :class="item.iconClass">

                </div>
              </div>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </template>
      </rogaluna-list>
    </div>
  </div>
</template>

<script>
import RogalunaList from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaList.vue';

export default {
  name: 'HomeView',
  components: {
    RogalunaList
  },
  data() {
    return {
      items: [
        {
          name: '文件传输',
          routerName: 'file-transfer',
          iconClass: 'xedia rogaluna-icon-file_transfer'
        }, 
        {
          name: '云存储',
          routerName: 'cloud-storage',
          iconClass: 'xedia rogaluna-icon-CLOUD_DISK'
        }, 
        {
          name: '音乐台',
          routerName: 'music-station',
          iconClass: 'xedia rogaluna-icon-changpianCD'
        },
        {
          name: '邮箱',
          routerName: 'e-mail',
          iconClass: 'xedia rogaluna-icon-email'
        },
        {
          name: '编码手册',
          routerName: 'code-book',
          iconClass: 'xedia rogaluna-icon-cpp'
        },
        // {
        //     routerName: 'useful-tools',
        //     iconClass: 'xedia rogaluna-icon-tools-hardware'
        // }
      ]
    }
  },
  methods: {
    handleItemClick(item) {
        this.$router.push({ name: item.routerName });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/glass/dynamicGlassStyle.scss";

.home {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
