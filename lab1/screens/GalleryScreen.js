import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Footer from "../components/Footer"

const data = Array(8).fill({});

export default function GalleryScreen() {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => <View style={styles.box} />}
        contentContainerStyle={styles.container}
      />
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  box: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    width: 150,
    height: 100,
    margin: 8,
    borderRadius: 8,
  },
});
