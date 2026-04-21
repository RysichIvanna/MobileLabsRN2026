import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 8,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
  text: {
    fontSize: 13,
  },
});

export default styles;
