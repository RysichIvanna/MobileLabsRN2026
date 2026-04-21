import React from 'react';
import { Text, View } from 'react-native';
import Footer from '../components/Footer';
import styles from '../styles/ProfileScreenStyles';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>профіль користувача</Text>
      <Footer />
    </View>
  );
}
