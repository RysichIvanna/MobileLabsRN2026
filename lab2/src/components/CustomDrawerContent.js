import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';

export default function CustomDrawerContent(props) {
  const { navigation, state } = props;
  const activeRouteName = state.routeNames[state.index];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RI</Text>
        </View>
        <Text style={styles.fullName}>Rysich Ivanna</Text>
        <Text style={styles.group}>Group: zipz 23-1</Text>
      </View>

      <View style={styles.menuBlock}>
        <DrawerItem
          label="News"
          focused={activeRouteName === 'NewsStack'}
          onPress={() => navigation.navigate('NewsStack')}
          labelStyle={styles.label}
          style={styles.item}
          activeBackgroundColor="#dbeafe"
          inactiveBackgroundColor="#ffffff"
          activeTintColor="#1d4ed8"
          inactiveTintColor="#334155"
        />
        <DrawerItem
          label="Contacts"
          focused={activeRouteName === 'ContactsStack'}
          onPress={() => navigation.navigate('ContactsStack')}
          labelStyle={styles.label}
          style={styles.item}
          activeBackgroundColor="#dbeafe"
          inactiveBackgroundColor="#ffffff"
          activeTintColor="#1d4ed8"
          inactiveTintColor="#334155"
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: '#f8fafc',
  },
  profileBlock: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#eff6ff',
    marginHorizontal: 12,
    marginBottom: 18,
    borderRadius: 22,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  fullName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  group: {
    fontSize: 14,
    color: '#475569',
  },
  menuBlock: {
    paddingHorizontal: 12,
  },
  item: {
    borderRadius: 14,
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
