import { ApolloProvider } from "@apollo/client";
import AuthContextProvider from "@context/AuthContextProvider";
import BottomTabContextProvider from "@context/BottomTabContext";
import ThemeContextProvider from "@context/ThemeContext";
import { client } from "@graphql/client";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Main from "./app/Main";
import { View, Text } from "react-native";
import Test from "app/Test";

const App = () => {
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <ThemeContextProvider>
          <BottomTabContextProvider>
            <AuthContextProvider>
              <Main />
            </AuthContextProvider>
          </BottomTabContextProvider>
        </ThemeContextProvider>
      </ApolloProvider>
    </NavigationContainer>
  );
};

export default App;
