import React from 'react';
import { FlatList, Text, View } from 'react-native';
import NewsItem from '../components/NewsItem';
import Footer from '../components/Footer';
import styles from '../styles/HomeScreenStyles';

const news = Array(7).fill({
  title: 'Заголовок новини',
  date: 'Дата публікації',
  text: 'Короткий опис новини. Це може бути кілька речення, які дають уявлення про зміст новини.',
});

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Новини</Text>
      <FlatList
        data={news}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <NewsItem {...item} />}
      />
      <Footer />
    </View>
  );
}
