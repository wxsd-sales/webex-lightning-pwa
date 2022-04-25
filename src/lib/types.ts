export type AppComponent = 'main' | 'meet' | 'message' | 'unified';
export enum StorageKey {
  AUTHORIZED_USER = 'authorizedUser',
  ACCESS_TOKEN = 'accessToken'
}
export enum ErrorKey {
  ACCESS_TOKEN = 'accessToken',
  DESTINATION = 'destination'
}
export enum ErrorValue {
  INVALID_ACCESS_TOKEN = 'Invalid access token.',
  INVALID_EXPIRED_ACCESS_TOKEN = 'Invalid or expired access token.',
  INVALID_DESTINATION = 'Invalid destination.',
  UNEXPECTED_CLIENT_ERROR = 'Unexpected client error.',
  UNEXPECTED_SERVER_ERROR = 'Unexpected server error.'
}
export enum WebexError {
  INITIALIZATION = 'Could not initialize Webex',
  INITIALIZE_MEETINGS = 'Could not initialize meetings plugin',
  START_MEETING = 'Could not start meeting'
}

export type WebexResponseBody = Record<string, unknown>;
export type WebexRequestBody = Record<string, unknown>;
