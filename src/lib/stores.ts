import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import { browser } from '$app/env';
import { ErrorKey, StorageKey } from './types';

const storage = <T>(
  key: StorageKey,
  initialValue: T | undefined = undefined,
  browserStorage: boolean | Storage = !browser || localStorage
): Writable<T | undefined> => {
  const store = writable<T>(initialValue);

  if (browser && browserStorage && typeof browserStorage !== 'boolean') {
    const storedValueStr = browserStorage.getItem(key);
    if (storedValueStr != null) store.set(JSON.parse(storedValueStr));

    store.subscribe((val) =>
      val == null ? browserStorage.removeItem(key) : browserStorage.setItem(key, JSON.stringify(val))
    );

    window.addEventListener('storage', () => {
      const storedValueStr = browserStorage.getItem(key);
      if (storedValueStr == null) return;

      const localValue: T = JSON.parse(storedValueStr);
      if (localValue !== get(store)) store.set(localValue);
    });
  }

  return store;
};

const accessToken = Symbol();
const accessTokenWritable = storage<string>(StorageKey.ACCESS_TOKEN);

export function setAccessTokenContext(): void {
  return setContext(accessToken, accessTokenWritable);
}

export function getAccessTokenContext(): Writable<string> {
  return getContext(accessToken);
}

const errors = Symbol();
const errorsWritable = writable<Record<string, string>>({});

export function setErrorsContext(): void {
  return setContext(errors, errorsWritable);
}

export function getErrorsContext(): Writable<Record<string, string>> {
  return getContext(errors);
}

export function delErrorKey(key: ErrorKey) {
  errorsWritable.update((errors: Record<string, string>) => {
    delete errors[key];
    return errors;
  });
}

export function setErrorKey(key: ErrorKey, value: string) {
  errorsWritable.update((errors: Record<string, string>) => {
    errors[key] = value;
    return errors;
  });
}

const authorizedUser = Symbol();
const authorizedUserWritable = writable<Record<string, unknown>>();

export function setAuthorizedUserContext(): void {
  return setContext(authorizedUser, authorizedUserWritable);
}

export function getAuthorizedUserContext(): Writable<Record<string, unknown>> {
  return getContext(authorizedUser);
}

const destination = Symbol();
const destinationWritable = writable<string>();

export function setDestinationContext(): void {
  return setContext(destination, destinationWritable);
}

export function getDestinationContext(): Writable<string> {
  return getContext(destination);
}

const webex = Symbol();
const webexWritable = writable<unknown>();

export function setWebexContext(): void {
  return setContext(webex, webexWritable);
}

export function getWebexContext(): Writable<unknown> {
  return getContext(webex);
}
