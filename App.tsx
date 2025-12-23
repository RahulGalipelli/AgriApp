import React from "react";
import AppNavigator from "./src/navigations/AppNavigator";
import { AppProvider } from "./src/state/store";

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
