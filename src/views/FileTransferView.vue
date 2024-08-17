<template>
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
                  <v-card>
                    <v-subheader>本地设备</v-subheader>
                    <v-list>
                      
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="left-align">浏览器: {{ browser }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="left-align">操作系统: {{ platform }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="left-align">语言: {{ language }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="left-align">GPU: {{ gpu }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="left-align">
                            <v-tooltip top v-if="audioInput">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon 
                                  class="mdi mdi-microphone"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-icon>
                              </template>
                              <span>音频输入设备</span>
                            </v-tooltip>
                            <v-tooltip top v-if="audioOutput">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon 
                                  class="mdi mdi-volume-high"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-icon>
                              </template>
                              <span>音频输出设备</span>
                            </v-tooltip>
                            <v-tooltip top v-if="videoInput">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon 
                                  class="mdi mdi-video"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-icon>
                              </template>
                              <span>音频输出设备</span>
                            </v-tooltip>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
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
export default {
  data() {
    return {
      devices: [],
      browser: '',
      platform: '',
      language: '',
      gpu: '',
      audioInput: '',
      audioOutput: '',
      videoInput: '',
    };
  },
  mounted() {
    this.getSystemInfo();
  },
  methods: {
    async getSystemInfo() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        devices.map(device => (
          this.getDeviceKind(device.kind)
        ));
      } catch (error) {
        console.error('Error accessing devices:', error);
      }
      
      this.browser = this.getBrowserInfo();
      this.platform = this.getPlatformInfo();
      this.language = navigator.language;
      this.gpu = this.getGPUInfo();
    },
    getDeviceKind(kind) {
      switch (kind) {
        case 'audioinput':
          this.audioInput = '音频输入设备';
          break;
        case 'audiooutput':
          this.audioOutput = '音频输出设备';
          break;
        case 'videoinput':
          this.videoInput = '视频输入设备';
          break;
        default:
          return kind;
      }
    },
    getBrowserInfo() {
      const userAgent = navigator.userAgent;
      const browserInfo = userAgent.match(/(firefox|msie|chrome|safari|trident|edge|opr|edg(?=\/))\/?\s*(\d+)/i) || [];
      return `${browserInfo[1]} ${browserInfo[2]}`;
    },
    getPlatformInfo() {
      const platform = navigator.platform;
      if (platform.startsWith('Win')) return 'Windows';
      if (platform.startsWith('Mac')) return 'MacOS';
      if (platform.startsWith('Linux')) return 'Linux';
      return platform;
    },
    getGPUInfo() {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          const match = renderer.match(/(NVIDIA|AMD|Intel)\s+([A-Za-z0-9\- ]+)/i);
          return match ? match[2] : 'Unknown GPU';
        }
      }
      return 'Unknown GPU';
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/css/glass/dynamicGlassStyle.scss";

.file-transfer-view {
  width: 100%;
  height: 100%;
  margin: auto;
}

.left-align {
  text-align: left;
}
</style>
