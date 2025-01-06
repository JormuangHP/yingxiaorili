import { View, Text } from '../../../../components/Themed';
import { styles } from '../styles';

export default function Legend() {
  return (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: '#ff0000' }]} />
        <Text>传统节日</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: '#00ff00' }]} />
        <Text>国际节日</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: '#0000ff' }]} />
        <Text>营销节日</Text>
      </View>
    </View>
  );
}