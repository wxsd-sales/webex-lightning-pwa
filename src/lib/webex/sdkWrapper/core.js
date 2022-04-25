import { WEBEX_CONFIG } from '../../constants';
import { WebexError } from '../../types';

/**
 * Creates a Webex instance.
 * @param {string} accessToken
 * @param {Record<string, unknown>} config
 *
 * @returns {Promise<Webex>}
 */
export const initializeWebex = (accessToken, config = WEBEX_CONFIG) =>
  new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line no-undef
      const webex = new Webex({
        config: config,
        credentials: { access_token: accessToken }
      });
      resolve(webex);
    } catch (e) {
      reject(`${WebexError.INITIALIZATION}: ${e}`);
    }
  });
