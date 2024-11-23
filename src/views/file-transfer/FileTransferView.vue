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
          name: '文件传输',
          iconClass: '#rogaluna-icon-file',
          handler: (self) => {
            self.$router.push({ name: 'account-setting' });
          }
        },
        {
          name: '本地网络与设备',
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


<!-- <template>
  <div class="file-transfer-view">
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-list>
            <v-row align="center">
              <v-col>
                <v-subheader>设备列表</v-subheader>
              </v-col>
              <v-col class="text-right">
                <v-menu offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </template>
                  <LocalDeviceInfo />
                </v-menu>
              </v-col>
            </v-row>
            <v-list-item
              v-for="(device, index) in devices"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title class="glassIco">{{ device.label || device.kind }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LocalDeviceInfo from './components/LocalDeviceInfo.vue';

export default {
  components: {
    LocalDeviceInfo,
  },
  data() {
    return {
      devices: [],
    };
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    async getDevices() {
      try {
        this.devices = await navigator.mediaDevices.enumerateDevices();
      } catch (error) {
        console.error('Error accessing devices:', error);
      }
    },
  },
};
</script> -->
