import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function GalleryScreen() {
    return (
        <Text style={styles.footer}>Rysich Ivanna</Text>
    );
}

const styles = StyleSheet.create({
    footer: { textAlign: 'center', fontStyle: 'italic', margin: 8, color: 'gray' },
});