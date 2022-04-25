<script lang="ts">
  import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
  import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
  import CommunicationUnified from 'carbon-icons-svelte/lib/CommunicationUnified.svelte';
  import { VALID_ACCESS_TOKEN, VALID_DESTINATION, DOC_LINK } from '../../lib/constants';
  import { ErrorKey, ErrorValue } from '../../lib/types';
  import { delErrorKey, getAuthorizedUserContext, getWebexContext, setErrorKey } from '../../lib/stores';

  export let isLoading = false;
  export let errors: Record<string, string> = undefined;
  export let accessToken: string = undefined;
  export let destination: string = undefined;
  export let onSubmitHook: (accessToken, destination) => Promise<unknown> = undefined;

  const authorizedUserContext = getAuthorizedUserContext();
  const webexContext = getWebexContext();

  let accessTokenInput: HTMLInputElement;
  let destinationInput: HTMLInputElement;

  function validateAccessToken() {
    return accessToken?.length > 0 && !accessTokenInput.checkValidity()
      ? setErrorKey(ErrorKey.ACCESS_TOKEN, ErrorValue.INVALID_ACCESS_TOKEN)
      : delErrorKey(ErrorKey.ACCESS_TOKEN);
  }

  function validateParticipantEmail() {
    return destination?.length > 0 && !destinationInput.checkValidity()
      ? setErrorKey(ErrorKey.DESTINATION, ErrorValue.INVALID_DESTINATION)
      : delErrorKey(ErrorKey.DESTINATION);
  }

  function handleOnSubmit(accessToken, destination) {
    isLoading = true;
    onSubmitHook(accessToken, destination).finally(() => (isLoading = false));
  }
</script>

<section class="container p-0">
  <form action="" on:submit|preventDefault={handleOnSubmit(accessToken, destination)}>
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
      autocapitalize="none"
      title="Input must match regex {VALID_ACCESS_TOKEN.source}"
      pattern={VALID_ACCESS_TOKEN.source}
      aria-invalid={!!errors?.accessToken || null}
      on:blur={validateAccessToken}
      bind:value={accessToken}
      disabled={isLoading}
      required
    />
    {#if errors?.accessToken}
      <small class="error-text">{errors.accessToken}</small>
    {/if}
    <label for="destination" title="required">
      Destination
      <sup class="error-text">*</sup>
    </label>
    <input
      bind:this={destinationInput}
      type="text"
      id="destination"
      name="destination"
      placeholder="Webex meeting link, PMR, SIP or email address"
      autocomplete="email"
      autocapitalize="none"
      title="Input must be a valid Webex meeting link, PMR, SIP or email address"
      pattern={VALID_DESTINATION.source}
      aria-invalid={!!errors?.destination || null}
      on:blur={validateParticipantEmail}
      bind:value={destination}
      disabled={isLoading}
      required
    />
    {#if errors?.destination}
      <small class="error-text">{errors.destination}</small>
    {/if}
    <div class="row">
      <div class="col-4">
        <button type="button" class="rounded-pill secondary" disabled={isLoading}>
          <SettingsAdjust class="icon" size={32} aria-label="Options" />
        </button>
      </div>
      <div class="col-8">
        <button type="submit" class="rounded-pill" disabled={isLoading} aria-busy={isLoading}>
          {#if isLoading === false}
            <img src="./images/webex-outline.svg" width="34" alt="Start" />
          {/if}
        </button>
      </div>
    </div>
  </form>
</section>
