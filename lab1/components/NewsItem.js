import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function NewsItem({ title, date, text }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/50' }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', margin: 8, alignItems: 'center' },
  image: { width: 50, height: 50, marginRight: 10, backgroundColor: '#eee' },
  textContainer: { flex: 1 },
  title: { fontWeight: 'bold' },
  date: { color: 'gray', fontSize: 12 },
  text: { fontSize: 13 },
});
