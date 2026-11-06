import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('Press the button to test the app.');

  function handlePress() {
    setMessage('Hello from Fixly! The button works.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fixly</Text>

      <Text style={styles.subtitle}>React Native Frontend Demo</Text>

      <Text style={styles.message}>{message}</Text>

      <Button
        title="Test Fixly"
        onPress={handlePress}
        color="#087F8C"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#087F8C',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 32,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
});