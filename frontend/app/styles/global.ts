import { StyleSheet } from "react-native";

export const colors = {
  background: "#EAF6FF",   // soft baby blue
  card: "#FFFFFF",         // white surfaces
  primary: "#4bd600",      // bright green (main button)
  secondary: "#438afc",    // soft blue (secondary button)

  accentPink: "#FF8FA3",   // soft coral/pink
  accentPurple: "#A78BFA", // pastel purple

  textPrimary: "#333333",
  textSecondary: "#666666",
  textPlaceholder: "#A0A0A0",

  border: "#DDEFFF",
};
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
    color: colors.accentPink,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  inputText: {
    color: colors.textPrimary,
  },
  button: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 999,
    backgroundColor: colors.primary,

    alignSelf: "center",
    alignItems: "center",
  },

  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})
