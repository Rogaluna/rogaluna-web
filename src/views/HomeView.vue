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
                <svg class="__icon__s"
                  aria-hidden="true"
                  icon
                  style="font-size: large;">
                  <use :xlink:href="item.iconClass"></use>
                </svg>
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
          name: '设置',
          routerName: 'setting',
          iconClass: '#rogaluna-icon-tools-hardware'
        }, 
        {
          name: '文件传输',
          routerName: 'file-transfer',
          iconClass: '#rogaluna-icon-file_transfer'
        }, 
        {
          name: '云存储',
          routerName: 'cloud-drive',
          iconClass: '#rogaluna-icon-CLOUD_DISK'
        }, 
        {
          name: '音乐台',
          routerName: 'music-station',
          iconClass: '#rogaluna-icon-changpianCD'
        },
        {
          name: '邮箱',
          routerName: 'e-mail',
          iconClass: '#rogaluna-icon-email'
        },
        {
          name: '图书馆',
          routerName: 'library',
          iconClass: '#rogaluna-icon-tushuguan'
        },
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
