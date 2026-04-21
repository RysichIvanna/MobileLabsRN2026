import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../styles/NewsItemStyles';

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
