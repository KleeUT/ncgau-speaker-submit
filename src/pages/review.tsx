import React, { useEffect, useState } from "react";
import { Submission } from "../../types";

async function fetchSubmissions(
  setLoading: (loading: boolean) => void,
  setData: (data: Submission[]) => void,
  setError: (errMessage: string) => void
): Promise<void> {
  setLoading(true);
  const res = await fetch(`/api/talkSubmission`, {});
  if (res.ok) {
    const bod = (await res.json()) as { data: Submission[] };
    setData(bod.data);
  } else {
    setError(`Couldn't load data got status ${res.status}`);
  }
  setLoading(false);
}

export default () => {
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [data, setData] = useState<Submission[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !error && !hasLoaded) {
      fetchSubmissions(setLoading, setData, setError);
      setHasLoaded(true);
    }
  }, [loading]);

  if (error) {
    return (
      <>
        <h1>Error</h1>
        <p>{error}</p>
      </>
    );
  }

  return <ReviewPage data={data} />;
};

const ReviewPage = ({ data }: { data: Submission[] }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Speaker</th>
            <th>Email</th>
            <th>Month</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d) => (
            <tr key={d.id}>
              <td>{d.title}</td>
              <td>{d.speakerName}</td>
              <td>{d.speakerEmail}</td>
              <td>{d.month}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
