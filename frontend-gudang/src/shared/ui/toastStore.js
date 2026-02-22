const TOAST_EVENT = 'app:toast';

export function showToast(payload) {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: payload,
    }),
  );
}

export function subscribeToast(handler) {
  const listener = (event) => handler(event.detail);
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
