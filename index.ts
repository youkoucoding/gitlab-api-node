import type { pipelineType, jobType } from './type';
import dotenv from 'dotenv';
dotenv.config();

const _importDynamic = new Function('modulePath', 'return import(modulePath)');

async function fetch(...args: any[]) {
  const { default: fetch } = await _importDynamic('node-fetch');
  return fetch(...args);
}

const GITLAB_API = process.env.GITLAB_API;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const getFailedPipelines = async (projectId: number) => {
  const response = await fetch(`${GITLAB_API}/${projectId}/pipelines?per_page=200&page=1`, {
    method: 'get',
    headers: { 'PRIVATE-TOKEN': ACCESS_TOKEN },
  });

  const data = (await response.json()) as pipelineType[];

  return data
    .filter((d) => d.status === 'failed')
    .reduce((pre: any, cur) => {
      pre.push(cur.id);
      return pre;
    }, []);
};

const getFailedJobs = async (projectId: number) => {
  const response = await fetch(
    `${GITLAB_API}/${projectId}/jobs?scope[]=failed&per_page=100&page=1`,
    {
      method: 'get',
      headers: { 'PRIVATE-TOKEN': ACCESS_TOKEN },
    }
  );

  const data = (await response.json()) as jobType[];

  return data.reduce((previous: { id: number; name: string; pipelineId: number }[], cur) => {
    let id = cur.id as number;
    let name = cur.name as string;
    let pipelineId = cur?.pipeline?.id as number;
    previous.push({ id, name, pipelineId });
    return previous;
  }, []);
};

async function execute() {
  const pipelineIds = await getFailedPipelines(1234);
  const jobs = await getFailedJobs(1234);

  const result = pipelineIds.map((pipeline: number) => {
    const data = jobs.reduce((pre: any, cur) => {
      const id = pipeline.toString();
      // const obj= { name: cur.name, id: cur.pipelineId }
      if (pre[id] === undefined) pre[id] = [];
      pre[id].push(cur.name);
      return pre;
    }, {});
    return data;
  });

  return result;
}

execute();
