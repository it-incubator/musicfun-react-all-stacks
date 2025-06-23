import styles from "./page.module.css";
import {tracksApi} from "@/shared/api/tracks/tracksApi";
import {authApi} from "@/shared/api/auth-api";
import {redirectAfterOauthUri} from "@/shared/api/base";

export default async function Home() {
  // configureApi({
  //   baseURL: process.env.BASE_URL!,
  //   apiKey: process.env.API_KEY,
  //   getAccessToken: () => localStorage.getItem(localStorageKeys.accessToken),
  //   getRefreshToken: () => localStorage.getItem(localStorageKeys.refreshToken),
  //   setTokens: (access, refresh) => {
  //     localStorage.setItem(localStorageKeys.accessToken, access)
  //     localStorage.setItem(localStorageKeys.refreshToken, refresh)
  //   },
  // });


  const tracks = await tracksApi.fetchTracks({ pageNumber: 1, pageSize: 5 });

  return (
    <div className={styles.page}>
      <header>
        <a href={authApi.oauthUrl(redirectAfterOauthUri)}>Login via apihub</a>
      </header>
      {tracks.data.map((track) => (
        <li key={track.id}>{track.attributes.title}</li>
      ))}
    </div>
  );
}
