import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function App() {
  const [message, setMessage] = useState('Press the button to test the app.');
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    setLoading(true);
    setMessage('Loading...');

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/message`
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
  
    } catch (error) {
      setMessage(
        error instanceof Error 
        ? error.message 
        : 'Could not connect to backend'
      );
    } finally {
      setLoading(false);
    }

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fixly</Text>

      <Text style={styles.subtitle}>React Native Frontend Demo</Text>

      <Text style={styles.message}>{message}</Text>

      <Button
        title={loading ? 'Loading...' : 'Test Fixly'}
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