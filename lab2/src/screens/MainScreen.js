import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { generateMockNews, initialNews } from '../data/newsData';

const PAGE_SIZE = 6;

export default function MainScreen({ navigation }) {
  const [news, setNews] = useState(initialNews);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setNews(generateMockNews(10, 1));
      setRefreshing(false);
    }, 1200);
  };

  const handleLoadMore = () => {
    if (loadingMore) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      setNews((currentNews) => [
        ...currentNews,
        ...generateMockNews(PAGE_SIZE, currentNews.length + 1),
      ]);
      setLoadingMore(false);
    }, 1200);
  };

  const renderNewsItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('Details', { newsItem: item })}
      style={styles.card}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>News Feed</Text>
      <Text style={styles.headerSubtitle}>
        Pull down to refresh or scroll to the bottom to load more items.
      </Text>
      <Pressable
        onPress={() => navigation.navigate('Contacts')}
        style={styles.contactsButton}
      >
        <Text style={styles.contactsButtonText}>Open Contacts</Text>
      </Pressable>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {loadingMore ? (
        <>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.footerText}>Loading more news...</Text>
        </>
      ) : (
        <Text style={styles.footerText}>You have reached the end of the current list.</Text>
      )}
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  contactsButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  contactsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#cbd5e1',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#475569',
  },
  separator: {
    height: 14,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
