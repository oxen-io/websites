import { createStorybookConfigFromDefault } from '../lib/utils';

const config = createStorybookConfigFromDefault({
  refs: {
    ui: {
      title: 'UI',
      url: process.env.NODE_ENV === 'development' ? 'http://192.168.1.166:6011/' : 'ui/',
    },
    staking: {
      title: 'Staking',
      url: process.env.NODE_ENV === 'development' ? 'http://192.168.1.166:6012/' : 'staking/',
    },
    wallet: {
      title: 'Wallet',
      url: process.env.NODE_ENV === 'development' ? 'http://192.168.1.166:6013/' : 'wallet/',
    },
  },
});

export default config;
