/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  StyleSheet,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import BackgroundGeolocation from 'react-native-background-geolocation';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const setupBackgroundGeolocation = () => {
    BackgroundGeolocation.ready(
      {
        autoSync: false,
        backgroundPermissionRationale: {
          title:
            "Allow {applicationName} to access this device's location even when the app is not in use.",
          message: 'This app collects location data.',
          positiveAction: 'Change to {backgroundPermissionOptionLabel}',
          negativeAction: 'Cancel',
        },
        allowIdenticalLocations: true,
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
        distanceFilter: 0,
        stopDetectionDelay: 5,
        stopTimeout: 5,
        locationTimeout: 30,
        debug: true,
        disableMotionActivityUpdates: true,
        disableStopDetection: true,
        pausesLocationUpdatesAutomatically: false,
        activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER_NAVIGATION,
        locationsOrderDirection: 'ASC',
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        maxDaysToPersist: 1,
        maxRecordsToPersist: 0,
        stopOnTerminate: false,
        startOnBoot: false,
        foregroundService: true,
        enableHeadless: true,
        heartbeatInterval: 60,
        preventSuspend: true,
        notification: {
          channelName: 'BG',
        },
        showsBackgroundLocationIndicator: true,
      },
      state => {
        console.debug('BackgroundGeolocation is configured and ready');
        console.debug(
          `BackgroundGeolocation state is ${JSON.stringify(state)}`,
        );
        BackgroundGeolocation.getProviderState(
          event => {
            console.info('[getProviderState] ' + JSON.stringify(event));
          },
          error => {
            console.warn(`Unable to get provider state because of ${error}`);
          },
        );
      },
    );
  };

  const startBackgroundGeolocation = async () => {
    await BackgroundGeolocation.start();
    await BackgroundGeolocation.changePace(true);
  };

  const stopBackgroundGeolocation = async () => {
    await BackgroundGeolocation.changePace(false);
    await BackgroundGeolocation.stop();
  };

  React.useEffect(() => {
    const subscriptions = {
      onLocation: null,
      onProviderChange: null,
      onHeartbeat: null,
      onConnectivityChange: null,
      onPowerSaveChange: null,
      onEnabledChange: null,
      onMotionChange: null,
      onActivityChange: null,
      onGeofence: null,
      onGeofencesChange: null,
    };

    const initialize = async () => {
      try {
        await BackgroundGeolocation.destroyLocations();
      } catch (e) {
        console.error(
          'Unable to delete positions from the library storage at the application startup' +
            JSON.stringify(e),
        );
      }
      subscriptions.onLocation = BackgroundGeolocation.onLocation(
        location => {
          console.info('[onLocation] ' + JSON.stringify(location));
        },
        error => {
          console.info('[onLocation] ERROR:' + JSON.stringify(error));
        },
      );

      subscriptions.onProviderChange = BackgroundGeolocation.onProviderChange(
        event => {
          console.info('[onProviderChange] ' + JSON.stringify(event));
        },
      );

      subscriptions.onHeartbeat = BackgroundGeolocation.onHeartbeat(event => {
        console.info('[onHeartbeat] ' + JSON.stringify(event));
      });

      subscriptions.onConnectivityChange =
        BackgroundGeolocation.onConnectivityChange(event => {
          console.info('[onConnectivityChange] ' + JSON.stringify(event));
        });

      subscriptions.onPowerSaveChange = BackgroundGeolocation.onPowerSaveChange(
        enabled => {
          console.info('[onPowerSaveChange] state: ' + JSON.stringify(enabled));
        },
      );

      subscriptions.onEnabledChange = BackgroundGeolocation.onEnabledChange(
        enabled => {
          console.info('[onEnabledChanged] state: ' + JSON.stringify(enabled));
        },
      );

      subscriptions.onMotionChange = BackgroundGeolocation.onMotionChange(
        event => {
          console.info('[onMotionChange] ' + JSON.stringify(event));
        },
      );

      subscriptions.onActivityChange = BackgroundGeolocation.onActivityChange(
        event => {
          console.info('[onActivityChange] ' + JSON.stringify(event));
        },
      );

      subscriptions.onGeofence = BackgroundGeolocation.onGeofence(event => {
        console.info('[onGeofence] ' + JSON.stringify(event));
      });

      subscriptions.onGeofencesChange = BackgroundGeolocation.onGeofencesChange(
        event => {
          console.info('[onGeofencesChange] ' + JSON.stringify(event));
        },
      );

      setupBackgroundGeolocation();
    };

    initialize();

    return function cleanup() {
      console.debug('Cleanup subscriptions');
      // remove all BG subscriptions
      Object.keys(subscriptions).forEach(k => subscriptions[k]?.remove());
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={[backgroundStyle, styles.container]}>
          <TouchableOpacity
            style={styles.button}
            onPress={startBackgroundGeolocation}>
            <Text>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={stopBackgroundGeolocation}>
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    marginVertical: 8,
    padding: 8,
  },
});

export default App;
