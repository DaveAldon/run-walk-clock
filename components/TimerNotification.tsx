import React, { useEffect, useState } from 'react';
import { Keyboard, TextInput, View, Button, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

const onSubmit = (run: number, walk: number, total: number) => {
  Keyboard.dismiss();

  // Find out how many seconds are in the total minutes
  const totalRunSeconds = (total * 60) / run;
  const totalWalkSeconds = (total * 60) / walk;

  // Create a notification for each interval
  for (let i = 1; i < totalRunSeconds; i++) {
    const schedulingOptionsRun = {
      content: {
        title: 'Run',
        body: 'Time to run!',
        sound: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: 'blue',
      },
      trigger: {
        seconds: run * i,
      },
    };
    Notifications.scheduleNotificationAsync(schedulingOptionsRun);
  }

  for (let i = 1; i < totalWalkSeconds; i++) {
    const schedulingOptionsWalk = {
      content: {
        title: 'Walk',
        body: 'Time to walk!',
        sound: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: 'blue',
      },
      trigger: {
        seconds: walk * i,
      },
    };
    Notifications.scheduleNotificationAsync(schedulingOptionsWalk);
  }

  // Create a notification for the end of the excercise
  const endOfExcercise = {
    content: {
      title: 'Walk',
      body: 'Time to walk!',
      sound: false,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: 'blue',
    },
    trigger: {
      seconds: total * 60,
    },
  };
  Notifications.scheduleNotificationAsync(endOfExcercise);
};

const handleNotification = () => {
  console.warn('ok! got your notif');
};

const askNotification = async () => {
  // We need to ask for Notification permissions for ios devices
  const { status } = await Notifications.requestPermissionsAsync();
  if (Constants.isDevice && status === 'granted') console.log('Notification permissions granted.');
};

const TimerNotification = () => {
  const [run, setRun] = useState('60');
  const [walk, setWalk] = useState('90');
  const [total, setTotalValidated] = useState('60');

  const setTotal = (totalInput: string) => {
    if (Number(totalInput) > 120) {
      totalInput = '120';
    }
    setTotalValidated(totalInput);
  };

  useEffect(() => {
    askNotification();
    // If we want to do something with the notification when the app
    // is active, we need to listen to notification events and
    // handle them in a callback
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, []);

  return (
    <View>
      <View style={styles.intervalViews}>
        <Text style={styles.inputTitle}>Walk Interval</Text>
        <TextInput
          onChangeText={setWalk}
          value={walk}
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.inputLegend}>seconds</Text>
      </View>
      <View style={styles.intervalViews}>
        <Text style={styles.inputTitle}>Run Interval</Text>
        <TextInput onChangeText={setRun} value={run} style={styles.input} keyboardType="numeric" />
        <Text style={styles.inputLegend}>seconds</Text>
      </View>
      <View style={styles.intervalViews}>
        <Text style={styles.inputTitle}>Excercise Length</Text>
        <TextInput
          onChangeText={setTotal}
          value={total}
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.inputLegend}>minutes</Text>
      </View>
      <Button onPress={() => onSubmit(Number(run), Number(walk), Number(total))} title="Start" />
      <Button
        onPress={() => Notifications.cancelAllScheduledNotificationsAsync()}
        title="Stop Excercise"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  intervalViews: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  inputTitle: { fontSize: 20, fontWeight: 'bold', width: '40%' },
  inputLegend: { fontSize: 20, width: '25%' },
  input: { fontSize: 20, borderWidth: 1, width: '20%', borderRadius: 10, padding: 10 },
});

export default TimerNotification;
