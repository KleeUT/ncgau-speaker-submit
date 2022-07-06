import React, { useEffect, useState } from "react";
async function sendData({
  title,
  speakerName,
  speakerEmail,
  month,
  setSending,
  clearForm,
}: {
  title: string;
  speakerName: string;
  speakerEmail: string;
  month: string;
  setSending: (sending: boolean) => void;
  clearForm: () => void;
}): Promise<void> {
  setSending(true);
  await fetch("/api/talkSubmission", {
    method: "POST",
    body: JSON.stringify({ data: { title, speakerEmail, speakerName, month } }),
  });
  setSending(false);
  clearForm();
}

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    style={{
      display: "block",
      margin: "1rem",
    }}
    {...props}
  />
);

export default () => {
  const [title, setTitle] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerEmail, setSpeakerEmail] = useState("");
  const [month, setMonth] = useState("");
  const [sending, setSending] = useState(false);
  const [shouldSend, setShouldSend] = useState(false);

  useEffect(() => {
    if (shouldSend && !sending) {
      setShouldSend(false);
      sendData({
        title,
        speakerName,
        speakerEmail,
        setSending,
        month,
        clearForm: () => {
          setSpeakerName("");
          setSpeakerEmail("");
          setMonth("");
          setTitle("");
        },
      });
    }
  }, [shouldSend]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShouldSend(true);
        }}
      >
        <Label>
          Talk Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>
        <Label>
          Name:
          <input
            type="text"
            value={speakerName}
            onChange={(e) => setSpeakerName(e.target.value)}
          />
        </Label>
        <Label>
          Contact Email:
          <input
            type="text"
            value={speakerEmail}
            onChange={(e) => setSpeakerEmail(e.target.value)}
          />
        </Label>
        <Label>
          Month:
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </Label>
        <button>Send</button>
      </form>
    </div>
  );
};
