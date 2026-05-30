import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'mnubywum',
    dataset: 'production',
  },
  deployment: {
    appId: 'j2z5rujmw66r9344lzsdg0sv',
    autoUpdates: true
  }
});
