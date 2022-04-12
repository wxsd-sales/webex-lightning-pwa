<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
  import MicrophoneFilled from 'carbon-icons-svelte/lib/MicrophoneFilled.svelte';
  import VideoFilled from 'carbon-icons-svelte/lib/VideoFilled.svelte';
  import Screen from 'carbon-icons-svelte/lib/Screen.svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { onMount } from 'svelte';
  import { getWebexContext } from '../lib/stores';
  import { registerDevice, startMeeting } from '../lib/webex';

  export let destination;

  const webexContext = getWebexContext();

  let loading = true;
  let localVideo: HTMLVideoElement;
  let remoteAudio: HTMLAudioElement;
  let remoteVideo: HTMLVideoElement;
  let hangupButton: HTMLButtonElement;

  onMount(() => {
    registerDevice($webexContext)
      .then((webex) => startMeeting(webex, destination, localVideo, remoteAudio, remoteVideo, hangupButton))
      .catch((e) => console.error(e))
      .finally(() => setTimeout(() => (loading = false), 4000));
  });
</script>

<section class="container centered no-padding">
  <div class="centered meet-container full no-padding">
    <div id="remote-view" class="centered full">
      {#if loading}
        <progress indeterminate id="status" />
      {/if}
      <audio bind:this={remoteAudio} id="remote-view-audio" autoplay />
      <!-- svelte-ignore a11y-media-has-caption -->
      <video bind:this={remoteVideo} id="remote-view-video" autoplay class="centered" />
    </div>
    <video bind:this={localVideo} id="local-view-video" muted autoplay />
  </div>
  <div class="grid container centered meet-controls">
    <button id="audio" type="button">
      <MicrophoneFilled class="icon" size={32} aria-label="Start" />
    </button>
    <button id="video" type="button">
      <VideoFilled class="icon" size={32} aria-label="Start" />
    </button>
    <button id="share" type="button">
      <Screen class="icon" size={32} aria-label="Start" />
    </button>
    <button bind:this={hangupButton} id="hangupButton" type="button">
      <Close class="icon" size={32} aria-label="Start" />
    </button>
  </div>
</section>

<style>
  video {
    border-radius: var(--border-radius);
  }

  .meet-container {
    position: relative;
    display: grid;
  }

  #status {
    position: absolute;
  }

  #remote-view,
  #local-view-video {
    display: grid;
  }

  #remote-view-video {
    width: 100%;
    height: auto;
  }

  #local-view-video {
    position: absolute;
    right: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
    bottom: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
    width: 25%;
    max-height: 720px;
  }

  .meet-controls {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    padding: 0.25rem 4rem;
  }

  .meet-controls > button {
    width: min-content;
    padding: 0.75rem;
    margin: 0;
  }
</style>
