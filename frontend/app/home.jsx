import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.status}>
        <Text style={styles.satusText}>Toutes</Text>
        <Text style={styles.satusText}>En attente</Text>
        <Text style={styles.satusText}>Termines</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  status: {
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#e0ddddff",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderRadius: 15,
    marginVertical: 25,

    marginHorizontal: 30,
  },
  satusText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6b6868ff",
    paddingHorizontal: 6,
  },
  focusStatusText: {
    backgroundColor: "white",

    paddingVertical: 5,
    borderRadius: 10,
    color: "blue",
  },
});
