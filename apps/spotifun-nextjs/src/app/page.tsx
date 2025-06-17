import styles from "./page.module.css";
import { tracksApi, configureApi, localStorageKeys } from "@it-incubator/spotifun-api-sdk"

export default async function Home() {
  configureApi({
    baseURL: process.env.BASE_URL!,
    apiKey: process.env.API_KEY,
    getAccessToken: () => localStorage.getItem(localStorageKeys.accessToken),
    getRefreshToken: () => localStorage.getItem(localStorageKeys.refreshToken),
    setTokens: (access, refresh) => {
      localStorage.setItem(localStorageKeys.accessToken, access)
      localStorage.setItem(localStorageKeys.refreshToken, refresh)
    },
  });

  const tracks = await tracksApi.fetchTracks({ pageNumber: 1, pageSize: 5 }, {
    nextOptions: {
      tags: ['track'],
    }
  });

  return (
    <div className={styles.page}>
      {tracks.data.data.map((track) => (
        <li key={track.id}>{track.attributes.title}</li>
      ))}
    </div>
  );
}
