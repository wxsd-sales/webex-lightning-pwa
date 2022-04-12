export const DOC_LINK = 'https://developer.webex.com/docs/getting-started#accounts-and-authentication';
export const WEBEX_API_ENDPOINT = 'https://webexapis.com/v1';
export const VALID_ACCESS_TOKEN = /^([a-zA-Z0-9]{64})_(.*)_([a-z0-9-]{36})$/;
export const APP_PATTERN = /^https?:\/\/(?:teams|teams-stage|teams-unstable|teams-test).webex.com/;
export const VALID_PHONE =
  /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
export const VALID_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const VALID_SIP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\w|-)+\.)*(webex|ciscospark|projectsquared).com$/;
export const VALID_PMR_ADDRESS = /([a-z0-9][-a-z0-9, '.']{0,62})@([a-z0-9][-a-z0-9, '.']{0,62})\.webex\.com/i;
export const VALID_PMR_LINK =
  /(https:\/\/)?([a-z0-9][-a-z0-9, '.']{0,62})\.webex\.com\/(meet|join)\/([a-z0-9][-a-z0-9, '.']{0,62})\/?/i;
export const VALID_MEETING_LINK =
  /(https:\/\/)?([a-z0-9][-a-z0-9, '.']{0,62})\.(?:webex|ciscospark)\.com\/(?:meet|join|m)\/([a-z0-9][-a-z0-9, '.']{0,62})\/?/i;
export const VALID_PIN = /([0-9]{4,6})/;
export const VALID_LOCI = /loci\/([\w-]+)/;
export const VALID_SHORT_SIP = /\d{9,11}@webex\.com/i;
export const VALID_SIP_MEETING_NUMBER = /(\d{9,11})@(?:\w+\.)?webex\.com/i;

// TODO: Add support for API resource ids, Cisco Spark URIs
export const VALID_DESTINATION = new RegExp(
  `(${VALID_MEETING_LINK.source})|(${VALID_PMR_LINK.source})|(${VALID_PMR_ADDRESS.source})|(${VALID_SIP.source})|(${VALID_EMAIL.source})`,
  'i'
);
