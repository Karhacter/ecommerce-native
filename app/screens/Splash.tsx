import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

const Splash = () => {
  const navigation = useNavigation<any>();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000); // Show buttons after 2000ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Animatable.Image
          animation="fadeIn"
          duration={2000}
          style={styles.backgroundImage}
          source={require("@/assets/images/Section1.png")}
        />

        {showButtons && (
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.overlay}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={[styles.buttonText, styles.signupButtonText]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 50,
  },
  loginButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButtonText: {
    color: "#fff",
  },
});

export default Splash;
