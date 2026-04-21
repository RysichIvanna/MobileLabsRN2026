import { SectionList, StyleSheet, Text, View } from 'react-native';

import { contactsSections } from '../data/contactsData';

export default function ContactsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <SectionList
        sections={contactsSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#475569',
  },
  separator: {
    height: 10,
  },
});
