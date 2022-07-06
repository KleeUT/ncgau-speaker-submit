export type Submission = {
  id?: string;
  title: string;
  speakerName: string;
  speakerEmail: string;
  month: string;
};

export type PostSubmission = { data: Submission };
