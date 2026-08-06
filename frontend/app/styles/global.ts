import { StyleSheet } from "react-native";

export const colors = {
    background: "#ffffff",
    text: "#6b6d80"
}
export const globalStyles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  }
})
