import { useFetchTracksQuery } from "../../api/tracksApi.ts";

export const TracksPage = () => {
  const { data, error, isError, isLoading } = useFetchTracksQuery({
    pageNumber: 1,
    pageSize: 5,
    search: "1",
  });

  if (isLoading) return <span>loading...</span>;
  if (isError) return <span>{JSON.stringify(error)}</span>;
  return (
    <ul>
      {data!.data.map((t) => (
        <li>{t.attributes.title}</li>
      ))}
    </ul>
  );
};
