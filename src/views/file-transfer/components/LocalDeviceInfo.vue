<template>
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
          <v-list-item-title class="left-align">本地IP: {{ localIP }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="left-align">
            <v-tooltip top v-if="audioInput">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="mdi mdi-microphone" v-bind="attrs" v-on="on"></v-icon>
              </template>
              <span>音频输入设备</span>
            </v-tooltip>
            <v-tooltip top v-if="audioOutput">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="mdi mdi-volume-high" v-bind="attrs" v-on="on"></v-icon>
              </template>
              <span>音频输出设备</span>
            </v-tooltip>
            <v-tooltip top v-if="videoInput">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="mdi mdi-video" v-bind="attrs" v-on="on"></v-icon>
              </template>
              <span>视频输入设备</span>
            </v-tooltip>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      browser: '',
      platform: '',
      language: '',
      gpu: '',
      localIP: '',
      audioInput: false,
      audioOutput: false,
      videoInput: false,
    };
  },
  mounted() {
    this.getSystemInfo();
    this.getLocalIP();
  },
  methods: {
    async getSystemInfo() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        devices.forEach((device) => {
          if (device.kind === 'audioinput') this.audioInput = true;
          if (device.kind === 'audiooutput') this.audioOutput = true;
          if (device.kind === 'videoinput') this.videoInput = true;
        });
      } catch (error) {
        console.error('Error accessing devices:', error);
      }

      this.browser = this.getBrowserInfo();
      this.platform = this.getPlatformInfo();
      this.language = navigator.language;
      this.gpu = this.getGPUInfo();
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
    },
    getLocalIP() {
      const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      if (!RTCPeerConnection) {
        console.warn('WebRTC not supported by browser');
        this.localIP = 'Unavailable';
        return;
      }

      const pc = new RTCPeerConnection();
      pc.createDataChannel('');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch((err) => console.error('Error creating offer:', err));
      pc.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const ipRegex = /(\d{1,3}(\.\d{1,3}){3})/;
          const match = event.candidate.candidate.match(ipRegex);
          if (match) {
            this.localIP = match[1];
            pc.close();
          }
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.left-align {
  text-align: left;
}
</style>
