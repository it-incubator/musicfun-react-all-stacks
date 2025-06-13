import styles from "./page.module.css";
import { setInstanceConfig, tracksApi } from "@it-incubator/spotifun-api-sdk";

export default async function Home() {
  setInstanceConfig({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
  });

  const tracks = await tracksApi.fetchTracks({ pageNumber: 1, pageSize: 5 });

  return (
    <div className={styles.page}>
      {tracks.data.data.map((track) => (
        <li key={track.id}>{track.attributes.title}</li>
      ))}
    </div>
  );
}
