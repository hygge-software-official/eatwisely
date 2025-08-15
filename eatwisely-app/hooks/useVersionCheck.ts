import { useEffect, useState } from 'react';
import { checkVersion } from 'react-native-check-version';
import DeviceInfo from 'react-native-device-info';
import { Linking, Platform } from 'react-native';

const useVersionCheck = () => {
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const versionInfo = await checkVersion({
          bundleId: DeviceInfo.getBundleId(),
          currentVersion: DeviceInfo.getVersion(),
        });

        if (versionInfo.needsUpdate) {
          setIsUpdateRequired(true);
        }
      } catch (error) {
        console.error('Error checking version', error);
      } finally {
        setLoading(false);
      }
    };

    checkAppVersion();
  }, []);

  const handleUpdate = async () => {
    try {
      const versionInfo = await checkVersion();
      if (versionInfo.needsUpdate) {
        const url =
          Platform.OS === 'ios'
            ? `https://apps.apple.com/app/idYOUR_APP_ID`
            : `https://play.google.com/store/apps/details?id=${DeviceInfo.getBundleId()}`;
        Linking.openURL(url).catch((err) =>
          console.error('Error opening URL', err),
        );
      }
    } catch (error) {
      console.error('Error opening update URL', error);
    }
  };

  return { isUpdateRequired, loading, handleUpdate };
};

export default useVersionCheck;
