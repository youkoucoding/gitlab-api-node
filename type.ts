type pipeline = {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
};

type job = {
  id: number;
  status: string;
  stage: string;
  name: string;
  ref: string;
  tag: false;
  allow_failure: boolean;
  created_at: string;
  started_at: string;
  finished_at: string;
  duration: number;
  queued_duration: number;
  pipeline: pipeline;
};

export type pipelineType = Partial<pipeline>;
export type jobType = Partial<job>;
