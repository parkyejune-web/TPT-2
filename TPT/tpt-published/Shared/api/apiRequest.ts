// import { Endpoints } from './endpoints';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig<Payload = unknown> {
  endpoint: string;
  method?: HttpMethod;
  payload?: Payload;
}

export async function apiRequest<Response, Payload = unknown>(
  config: ApiRequestConfig<Payload>,
): Promise<Response> {
  // TODO: wire up shared API request handler
  throw new Error(`apiRequest for ${config.endpoint} is not implemented`);
}
