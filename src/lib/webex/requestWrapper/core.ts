import { WEBEX_API_ENDPOINT } from '../../constants';
import type { WebexRequestBody, WebexResponseBody } from '../../types';

export abstract class WebexRequestCore extends Function {
  baseUrl = WEBEX_API_ENDPOINT;
  resource: string;
  headers: Headers;

  protected constructor(accessToken: string, resource: string, contentType = 'application/json;charset=UTF-8') {
    super();
    this.resource = resource;
    this.headers = new Headers({
      'Authorization': 'Bearer ' + accessToken,
      'Content-type': contentType
    });
  }

  delete(endpoint?: string, query?: Record<string, unknown>): Promise<WebexResponseBody> {
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    const queryParams = query ? `?${new URLSearchParams(query)}` : '';
    const resourceEndpoint = endpoint ? `/${endpoint}` : '';
    const url = endpoint
      ? `${this.baseUrl}/${this.resource}/${resourceEndpoint}${queryParams}`
      : `${this.baseUrl}/${this.resource}${queryParams}`;
    const request = new Request(url, { method: 'DELETE', headers: this.headers });

    return fetch(request).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  }

  get(endpoint?: string, query?: Record<string, unknown>): Promise<WebexResponseBody> {
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    const params = query ? `?${new URLSearchParams(query)}` : '';
    const url = endpoint
      ? `${this.baseUrl}/${this.resource}/${endpoint}${params}`
      : `${this.baseUrl}/${this.resource}${params}`;
    const request = new Request(url, { method: 'GET', headers: this.headers });

    return fetch(request).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  }

  post(endpoint?: string, body?: Record<string, unknown>): Promise<WebexResponseBody> {
    const url = endpoint ? `${this.baseUrl}/${this.resource}/${endpoint}` : `${this.baseUrl}/${this.resource}`;
    const request = new Request(url, { method: 'POST', headers: this.headers, body: JSON.stringify(body) });

    return fetch(request).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  }

  put(endpoint?: string, query?: Record<string, unknown>, body?: WebexRequestBody): Promise<WebexResponseBody> {
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    const params = query ? `?${new URLSearchParams(query)}` : '';
    const url = endpoint
      ? `${this.baseUrl}/${this.resource}/${endpoint}${params}`
      : `${this.baseUrl}/${this.resource}${params}`;
    const request = new Request(url, { method: 'PUT', headers: this.headers, body: JSON.stringify(body) });

    return fetch(request).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  }
}
