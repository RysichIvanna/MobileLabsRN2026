import React from 'react';
import { FlatList, View } from 'react-native';
import Footer from '../components/Footer';
import styles from '../styles/GalleryScreenStyles';

const data = Array(8).fill({});

export default function GalleryScreen() {
  return (
    <View style={styles.screen}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <View style={styles.box} />}
        contentContainerStyle={styles.container}
      />
      <Footer />
    </View>
  );
}
