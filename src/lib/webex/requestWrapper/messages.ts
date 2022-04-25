import { WebexRequestCore } from './core';

export class MessagesResource extends WebexRequestCore {
  constructor(accessToken: string) {
    super(accessToken, 'messages');
  }

  listDirectMessages(query: { parentId?: string; personId: string } | { parentId?: string; personEmail: string }) {
    return super.get('direct', query).then((r) => r.items);
  }

  listMessages(query: {
    roomId: string;
    parentId?: string;
    mentionedPeople?: string[];
    before?: string;
    beforeMessage?: string;
    max?: bigint;
  }) {
    return super.get(undefined, query).then((r) => r.items);
  }
}
