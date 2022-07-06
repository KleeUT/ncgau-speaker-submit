import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Submission } from "../../types";

async function fetchSubmissions(
  setLoading: (loading: boolean) => void,
  setData: (data: Submission[]) => void,
  setError: (errMessage: string) => void,
  accessToken: string
): Promise<void> {
  setLoading(true);
  const res = await fetch(`/api/talkSubmission`, {
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
  });
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
  const [accessToken, setAccessToken] = useState("");

  const { loginWithRedirect, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (accessToken) {
      return;
    }
    async function getToken() {
      const token = await getAccessTokenSilently({
        audience: "speaker-submit",
      });
      setAccessToken(token);
    }

    getToken();
  });

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    if (!loading && !error && !hasLoaded) {
      fetchSubmissions(setLoading, setData, setError, accessToken);
      setHasLoaded(true);
    }
  }, [loading, accessToken]);

  if (error) {
    return (
      <>
        <h1>Error</h1>
        <p>{error}</p>
      </>
    );
  }

  if (!accessToken) {
    return (
      <button
        onClick={() =>
          loginWithRedirect({
            appState: {
              returnTo: "/submit",
            },
          })
        }
      ></button>
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
