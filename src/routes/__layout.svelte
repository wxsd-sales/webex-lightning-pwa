<!--suppress CheckEmptyScriptTag -->
<script lang="js">
  import '../app.scss';
  import { onMount } from 'svelte';
  import themeSwitcher from '@picocss/pico/docs/js/src/theme-switcher';
  import {
    setAuthorizedUserContext,
    setAccessTokenContext,
    setDestinationContext,
    setErrorsContext,
    setWebexContext
  } from '../lib/stores';

  setAuthorizedUserContext();
  setAccessTokenContext();
  setDestinationContext();
  setErrorsContext();
  setWebexContext();

  onMount(() => {
    // Initialize theme switcher
    themeSwitcher.addButton({ tag: 'BUTTON', class: 'contrast toggle theme-switcher', target: 'body' });
    themeSwitcher.init();
  });
</script>

<main class="align-items-center container-fluid h-100 row">
  <slot />
</main>
