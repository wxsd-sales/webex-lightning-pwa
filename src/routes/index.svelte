<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
  import {
    getAuthorizedUserContext,
    getAccessTokenContext,
    getDestinationContext,
    getErrorsContext,
    getWebexContext,
    setErrorKey,
    delErrorKey
  } from '../lib/stores';
  import Main from '../components/Main/Main.svelte';
  import { PeopleResource } from '../lib/webex/requestWrapper/people';
  import { initializeWebex } from '../lib/webex/sdkWrapper/core';
  import { ErrorKey, ErrorValue, WebexError } from '../lib/types';
  import type { AppComponent } from '../lib/types';
  import Meet from '../components/Meet/Meet.svelte';
  import Message from '../components/Message/Message.svelte';

  const authorizedUserContext = getAuthorizedUserContext();
  const accessTokenContext = getAccessTokenContext();
  const destinationContext = getDestinationContext();
  const errorsContext = getErrorsContext();
  const webexContext = getWebexContext();

  let activeAppView: AppComponent = 'main';

  function onSubmitHook(accessToken, destination) {
    accessTokenContext.set(accessToken);
    destinationContext.set(destination);

    const onFailure = (error) => {
      if (error?.status === 401) {
        setErrorKey(ErrorKey.ACCESS_TOKEN, ErrorValue.INVALID_EXPIRED_ACCESS_TOKEN);
      } else if (error?.status >= 500) {
        setErrorKey(ErrorKey.ACCESS_TOKEN, ErrorValue.UNEXPECTED_SERVER_ERROR);
      } else if (error?.status >= 400) {
        setErrorKey(ErrorKey.ACCESS_TOKEN, ErrorValue.UNEXPECTED_CLIENT_ERROR);
      } else {
        setErrorKey(ErrorKey.ACCESS_TOKEN, WebexError.INITIALIZATION);
      }

      activeAppView = 'main';
    };

    const onSuccess = (authorizedUser, webex) => {
      authorizedUserContext.set(authorizedUser);
      webexContext.set(webex);
      delErrorKey(ErrorKey.ACCESS_TOKEN);

      activeAppView = 'meet';
    };

    return Promise.all([
      new PeopleResource($accessTokenContext).getMyOwnDetails({ callingData: true }),
      initializeWebex($accessTokenContext)
    ])
      .then(([authorizedUser, webex]) => onSuccess(authorizedUser, webex))
      .catch((e) => onFailure(e));
  }
</script>

<svelte:head>
  <title>Webex Lightning PWA</title>
</svelte:head>

{#if activeAppView === 'main'}
  <Main {onSubmitHook} errors={$errorsContext} accessToken={$accessTokenContext} destination={$destinationContext} />
{:else if activeAppView === 'meet'}
  <Meet destination={$destinationContext} />
{:else if activeAppView === 'message'}
  <Message destination={$destinationContext} />
{/if}
