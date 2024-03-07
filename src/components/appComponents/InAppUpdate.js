import {InteractionManager} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import SpInAppUpdates, {
  AndroidUpdateType,
} from 'sp-react-native-in-app-updates';
import Crashlytics from '@react-native-firebase/crashlytics';
import Labels from '../../utils/Strings';
import * as ENV from '../../../env';

class InAppUpdate {
  // InApp Update Variables
  inAppUpdates = new SpInAppUpdates(false);

  checkAppUpdate = () => {
    InteractionManager.runAfterInteractions(async () => {
      this.inAppUpdates
        .checkNeedsUpdate({curVersion: ENV.versionNumber})
        .then(response => {
          if (response.shouldUpdate) {
            const updateOptions = {
              updateType: AndroidUpdateType.IMMEDIATE,
            };

            this.inAppUpdates.startUpdate(updateOptions);
          } else {
            showMessage({
              icon: 'auto',
              message: Labels.versionUpdate,
              description: Labels.noUpdates,
              type: 'info',
            });
          }
        })
        .catch(error => {
          ENV.currentEnvironment != Labels.production &&
            Crashlytics().setAttributes({
              error: JSON.stringify(error),
              label: Labels.inAppUpdate,
              type: 'catch',
            });

          showMessage({
            icon: 'auto',
            message: Labels.error,
            description: Labels.errorVersionUpdates,
            type: 'danger',
          });
        });
    });
  };
}

export default new InAppUpdate();
