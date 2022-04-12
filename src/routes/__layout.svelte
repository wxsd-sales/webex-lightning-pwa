<!--suppress CheckEmptyScriptTag -->
<script lang="js">
  import '@picocss/pico/css/pico.css';
  import '../app.css';
  import { onMount } from 'svelte';
  import themeSwitcher from '@picocss/pico/docs/js/src/theme-switcher';
  import {
    delErrorKey,
    getAccessTokenContext,
    getAuthorizedUserContext,
    getWebexContext,
    setAccessTokenContext,
    setAuthorizedUserContext,
    setErrorKey,
    setErrorsContext,
    setWebexContext
  } from '../lib/stores.ts';
  import { initializeWebex } from '../lib/webex';
  import { WEBEX_API_ENDPOINT } from '../lib/constants';
  import { ErrorKeys } from '../lib/types';

  setAccessTokenContext();
  setAuthorizedUserContext();
  setErrorsContext();
  setWebexContext();

  const accessTokenContext = getAccessTokenContext();
  const authorizedUserContext = getAuthorizedUserContext();
  const webexContext = getWebexContext();

  accessTokenContext.subscribe((value) => {
    if (value) {
      const headers = new Headers({
        'Authorization': 'Bearer ' + value,
        'Content-type': 'application/json;charset=UTF-8'
      });
      const request = new Request(WEBEX_API_ENDPOINT + '/people/me', { headers: headers });

      fetch(request)
        .then((response) => (response.ok ? response.json() : Promise.reject(response)))
        .then((data) => authorizedUserContext.set(data))
        .then(() => delErrorKey(ErrorKeys.ACCESS_TOKEN))
        .catch((error) => {
          authorizedUserContext.set(undefined);
          if (error?.status === 401) setErrorKey(ErrorKeys.ACCESS_TOKEN, 'Invalid or expired access token.');
          else if (error?.status >= 500) setErrorKey(ErrorKeys.ACCESS_TOKEN, 'Unknown server error.');
          else if (error?.status >= 400) setErrorKey(ErrorKeys.ACCESS_TOKEN, 'Unknown client error.');
        });
    }
  });

  authorizedUserContext.subscribe((value) => {
    if (value && $accessTokenContext) {
      initializeWebex($accessTokenContext)
        .then((webex) => webexContext.set(webex))
        .catch(() => setErrorKey(ErrorKeys.ACCESS_TOKEN, 'Could not initialize Webex.'));
    }
  });

  onMount(() => {
    // Initialize theme switcher
    themeSwitcher.addButton({
      tag: 'BUTTON',
      class: 'contrast toggle theme-switcher',
      target: 'body'
    });
    themeSwitcher.init();
  });
</script>

<main class="container-fluid grid full">
  <slot />
</main>
