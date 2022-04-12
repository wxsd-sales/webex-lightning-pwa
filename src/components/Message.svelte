<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
  import MicrophoneFilled from 'carbon-icons-svelte/lib/MicrophoneFilled.svelte';
  import VideoFilled from 'carbon-icons-svelte/lib/VideoFilled.svelte';
  import Screen from 'carbon-icons-svelte/lib/Screen.svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { onMount } from 'svelte';
  import { getWebexContext } from '../lib/stores';
  import { listenMessage } from '../lib/webex';

  export let destination;

  const webexContext = getWebexContext();

  let loading = true;

  onMount(() => {
    listenMessage($webexContext);
  });
</script>

<section class="container centered no-padding" />

<style>
</style>
