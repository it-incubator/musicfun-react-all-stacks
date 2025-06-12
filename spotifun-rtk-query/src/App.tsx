import "./App.css"
import { useGetPokemonByNameQuery } from "./store/tracks.ts"

function App() {

  const {data, error, isError, isLoading} = useGetPokemonByNameQuery()


  if (isLoading) return <span>loading...</span>
  if (isError) return <span>{JSON.stringify(error)}</span>
  return (
    <ul>
      {data!.data.map(t => <li>{t.attributes.title}</li>)}
    </ul>
  )
}

export default App
