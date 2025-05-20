import axios from "axios"

export const instance = axios.create({
  baseURL: "https://spotifun.it-incubator.app/api/1.0",
})
