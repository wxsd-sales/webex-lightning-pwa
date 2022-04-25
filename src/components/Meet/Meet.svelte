<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
  import Microphone from 'carbon-icons-svelte/lib/Microphone.svelte';
  import MicrophoneOff from 'carbon-icons-svelte/lib/MicrophoneOff.svelte';
  import Video from 'carbon-icons-svelte/lib/Video.svelte';
  import VideoOff from 'carbon-icons-svelte/lib/VideoOff.svelte';
  import Screen from 'carbon-icons-svelte/lib/Screen.svelte';
  import ScreenOff from 'carbon-icons-svelte/lib/ScreenOff.svelte';
  import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getAuthorizedUserContext, getWebexContext } from '../../lib/stores';
  import { registerMeeting, startMeeting } from '../../lib/webex/sdkWrapper/meet';
  import { MUTE_AUDIO, MUTE_SHARE, MUTE_VIDEO, UNMUTE_AUDIO, UNMUTE_SHARE, UNMUTE_VIDEO } from '../../lib/constants';

  export let destination = undefined;
  export let onMeetingLeaveHook: (meeting) => Promise<unknown> = () => goto('/');

  const authorizedUserContext = getAuthorizedUserContext();
  const webexContext = getWebexContext();

  let localVideo: HTMLVideoElement;
  let localShare: HTMLVideoElement;
  let remoteAudio: HTMLAudioElement;
  let remoteVideo: HTMLVideoElement;
  let remoteShare: HTMLVideoElement;
  let toggleAudioButton: HTMLButtonElement;
  let toggleVideoButton: HTMLButtonElement;
  let toggleShareButton: HTMLButtonElement;
  let optionsButton: HTMLButtonElement;
  let hangupButton: HTMLButtonElement;
  let audioIcon = {
    muted: { 'aria-label': UNMUTE_AUDIO, 'component': MicrophoneOff },
    unmuted: { 'aria-label': MUTE_AUDIO, 'component': Microphone }
  };
  let activeAudioIcon = audioIcon.unmuted;
  let videoIcon = {
    muted: { 'aria-label': UNMUTE_VIDEO, 'component': VideoOff },
    unmuted: { 'aria-label': MUTE_VIDEO, 'component': Video }
  };
  let activeVideoIcon = videoIcon.unmuted;
  let shareIcon = {
    muted: { 'aria-label': MUTE_SHARE, 'component': ScreenOff },
    unmuted: { 'aria-label': UNMUTE_SHARE, 'component': Screen }
  };
  let activeShareIcon = shareIcon.unmuted;

  onMount(() => {
    if (navigator?.mediaDevices?.getDisplayMedia == null) {
      toggleShareButton.disabled = true;
    }

    function handleAudioChange(isAudioMuted: boolean) {
      console.info('isAudioMuted', isAudioMuted);
      isAudioMuted ? (activeAudioIcon = audioIcon.muted) : (activeAudioIcon = audioIcon.unmuted);
    }

    function handleVideoChange(isVideoMuted: boolean) {
      console.info('isVideoMuted', isVideoMuted);
      isVideoMuted ? (activeVideoIcon = videoIcon.muted) : (activeVideoIcon = videoIcon.unmuted);
    }

    function handleShareChange(isSharing: boolean) {
      console.info('isSharing', isSharing);
      isSharing ? (activeShareIcon = shareIcon.muted) : (activeShareIcon = shareIcon.unmuted);
    }

    function handleMeetingLeave(meeting: unknown) {
      console.info('meeting', meeting);
      onMeetingLeaveHook(meeting);
    }

    function handleMediaReady(media) {
      toggleAudioButton.disabled = false;
      toggleVideoButton.disabled = false;
      toggleShareButton.disabled = false;
    }

    registerMeeting($webexContext)
      .then((webex) =>
        startMeeting(
          webex,
          destination,
          localVideo,
          localShare,
          remoteAudio,
          remoteVideo,
          remoteShare,
          toggleAudioButton,
          toggleVideoButton,
          toggleShareButton,
          hangupButton,
          handleAudioChange,
          handleVideoChange,
          handleShareChange,
          handleMeetingLeave,
          handleMediaReady
        )
      )
      .catch((e) => console.error(e));
  });
</script>

<div class="container h-100 p-0">
  <section class="h-auto m-0 position-relative row">
    <div id="remote-view">
      <audio bind:this={remoteAudio} id="remote-view-audio" autoplay />
      <!-- svelte-ignore a11y-media-has-caption -->
      <video bind:this={remoteVideo} id="remote-view-primary" class="rounded" autoplay playsinline />
      <!-- svelte-ignore a11y-media-has-caption -->
      <video bind:this={remoteShare} id="remote-view-secondary" class="rounded" autoplay playsinline />
    </div>
    <div id="local-view">
      <video bind:this={localVideo} id="local-view-primary" class="rounded" muted autoplay playsinline />
      <video bind:this={localShare} id="local-view-secondary" class="rounded" muted autoplay playsinline />
    </div>
  </section>
  <section class="h-auto m-0 mt-1 row justify-content-around">
    <div class="col-2 p-0">
      <button
        bind:this={toggleAudioButton}
        id="audio"
        class="rounded-pill"
        type="button"
        data-tooltip={activeAudioIcon['aria-label']}
      >
        <svelte:component this={activeAudioIcon.component} class="icon" size={24} />
      </button>
    </div>
    <div class="col-2 p-0">
      <button
        bind:this={toggleVideoButton}
        id="video"
        class="rounded-pill"
        type="button"
        data-tooltip={activeVideoIcon['aria-label']}
      >
        <svelte:component this={activeVideoIcon.component} class="icon" size={24} />
      </button>
    </div>
    <div class="col-2 p-0">
      <button
        bind:this={toggleShareButton}
        id="share"
        class="rounded-pill"
        type="button"
        data-tooltip={activeShareIcon['aria-label']}
      >
        <svelte:component this={activeShareIcon.component} class="icon" size={24} />
      </button>
    </div>
    <div class="col-2 p-0">
      <button
        bind:this={optionsButton}
        id="options"
        class="contrast rounded-pill"
        type="button"
        data-tooltip="More Options"
      >
        <OverflowMenuHorizontal class="icon" size={24} aria-label="Options" />
      </button>
    </div>
    <div class="col-2 p-0">
      <button
        bind:this={hangupButton}
        id="hangupButton"
        class="contrast rounded-pill"
        type="button"
        data-tooltip="Leave Meeting"
      >
        <Close class="icon" size={24} aria-label="Leave Meeting" />
      </button>
    </div>
  </section>
</div>

<style>
  #remote-view,
  #local-view {
    display: grid;
  }

  #local-view {
    position: absolute;
    right: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
    bottom: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
    width: 25%;
    max-height: 720px;
  }

  #remote-view-secondary,
  #local-view-secondary {
    position: absolute;
    left: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
    top: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
    width: 25%;
    max-height: 720px;
  }

  #remote-view-primary {
    width: 100%;
    height: auto;
  }

  #local-view-primary {
    width: 100%;
    max-height: 720px;
  }
</style>
