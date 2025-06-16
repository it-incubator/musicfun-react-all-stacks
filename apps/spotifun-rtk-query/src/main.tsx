import { configureApi, localStorageKeys } from "@it-incubator/spotifun-api-sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

configureApi({
  baseURL: import.meta.env.VITE_BASE_URL!,
  apiKey: import.meta.env.VITE_API_KEY,
  getAccessToken: () => localStorage.getItem(localStorageKeys.accessToken),
  getRefreshToken: () => localStorage.getItem(localStorageKeys.refreshToken),
  setTokens: (access, refresh) => {
    localStorage.setItem(localStorageKeys.accessToken, access);
    localStorage.setItem(localStorageKeys.refreshToken, refresh);
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
