import { WebexRequestCore } from './core';

export class PeopleResource extends WebexRequestCore {
  constructor(accessToken: string) {
    super(accessToken, 'people');
  }

  getPersonDetails(personId: string, query?: { callingData: boolean }) {
    return super.get(personId, query);
  }

  getMyOwnDetails(query?: { callingData: boolean }) {
    return super.get('me', query);
  }

  listPeople(query?: {
    email?: string;
    displayName?: string;
    id?: string;
    orgId?: string;
    callingData?: boolean;
    locationId?: string;
    max?: bigint;
  }) {
    return super.get(undefined, query).then((r) => r.items);
  }
}
