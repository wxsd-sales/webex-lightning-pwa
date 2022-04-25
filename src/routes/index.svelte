<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
  import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
  import CommunicationUnified from 'carbon-icons-svelte/lib/CommunicationUnified.svelte';
  import { VALID_ACCESS_TOKEN, VALID_DESTINATION, DOC_LINK } from '../lib/constants';
  import { delErrorKey, getAccessTokenContext, getErrorsContext, setErrorKey } from '../lib/stores';
  import { ErrorKeys } from '../lib/types';
  import type { AppComponent } from '../lib/types';
  import Meet from '../components/Meet.svelte';

  const accessTokenContext = getAccessTokenContext();
  const errorsContext = getErrorsContext();

  let appComponent: AppComponent = undefined;
  let accessToken: string = $accessTokenContext;
  let destination: string = undefined;
  let accessTokenInput: HTMLInputElement;
  let participantEmailInput: HTMLInputElement;

  function validateAccessToken() {
    return accessToken?.length > 0 && !accessTokenInput.checkValidity()
      ? setErrorKey(ErrorKeys.ACCESS_TOKEN, 'Invalid access token.')
      : delErrorKey(ErrorKeys.ACCESS_TOKEN);
  }
  function validateParticipantEmail() {
    return destination?.length > 0 && !participantEmailInput.checkValidity()
      ? setErrorKey(ErrorKeys.DESTINATION, 'Invalid destination.')
      : delErrorKey(ErrorKeys.DESTINATION);
  }

  function handleOnSubmit() {
    accessTokenContext.set(accessToken);
    appComponent = 'meet';
  }
</script>

<svelte:head>
  <title>Webex Lightning PWA</title>
</svelte:head>

{#if appComponent == null}
  <section class="container centered no-padding">
    <article>
      <form action="" on:submit|preventDefault={handleOnSubmit}>
        <label for="access-token" title="required">
          Your Access Token
          <small>
            (see <a href={DOC_LINK} target="_blank" rel="noreferrer">this link<Launch size={12} /></a> to get one)
          </small>
          <sup class="error-text" title="required">*</sup>
        </label>
        <input
          bind:this={accessTokenInput}
          type="password"
          id="access-token"
          name="access-token"
          title="Input must match regex {VALID_ACCESS_TOKEN.source}"
          pattern={VALID_ACCESS_TOKEN.source}
          aria-invalid={!!$errorsContext?.accessToken || null}
          on:blur={validateAccessToken}
          bind:value={accessToken}
          required
        />
        {#if $errorsContext?.accessToken}
          <small class="error-text">{$errorsContext.accessToken}</small>
        {/if}
        <label for="destination" title="required">
          Destination
          <sup class="error-text">*</sup>
        </label>
        <input
          bind:this={participantEmailInput}
          id="destination"
          name="destination"
          placeholder="Webex meeting link, PMR, SIP or email address"
          autocomplete="email"
          title="Input must a valid Webex meeting link, PMR, SIP or email address"
          pattern={VALID_DESTINATION.source}
          aria-invalid={!!$errorsContext?.destination || null}
          on:blur={validateParticipantEmail}
          bind:value={destination}
          required
        />
        {#if $errorsContext?.destination}
          <small class="error-text">{$errorsContext.destination}</small>
        {/if}
        <button type="submit">
          <CommunicationUnified class="icon" size={32} aria-label="Start" />
        </button>
      </form>
    </article>
  </section>
{:else if appComponent === 'meet'}
  <Meet {destination} />
{/if}
