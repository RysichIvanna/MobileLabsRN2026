import { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DetailsScreen({ navigation, route }) {
  const { newsItem } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: newsItem.title,
    });
  }, [navigation, newsItem.title]);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Image source={{ uri: newsItem.image }} style={styles.image} />
      <View style={styles.card}>
        <Text style={styles.title}>{newsItem.title}</Text>
        <Text style={styles.meta}>ID: {newsItem.id}</Text>
        <Text style={styles.description}>{newsItem.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  content: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    backgroundColor: '#cbd5e1',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  meta: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
});
