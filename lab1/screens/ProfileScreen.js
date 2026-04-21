import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Footer from "../components/Footer"
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Профіль користувача</Text>
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
