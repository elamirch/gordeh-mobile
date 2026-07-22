import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gordeh.app',
  appName: 'گرده',
  webDir: 'www',
  server: {
    url: 'https://gordeh.com',
    cleartext: false
  }
};

export default config;
