const fs = require('fs');
const path = require('path');

module.exports = {
  beforeBuild: async (config) => {
    console.log('Running custom pre-build script');
    const sourceFile = path.join(__dirname, 'ios', 'GoogleService-Info.plist');
    const targetFile = path.join(config.path, 'ios', 'GoogleService-Info.plist');
    
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log('GoogleService-Info.plist copied successfully');
    } else {
      console.error('GoogleService-Info.plist not found in the source directory');
    }
  },
};