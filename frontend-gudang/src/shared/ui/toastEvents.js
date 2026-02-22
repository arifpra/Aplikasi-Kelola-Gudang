const TOAST_EVENT = 'app:toast';

export function showToast(message, type = 'info') {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        id: Date.now(),
        message,
        type,
      },
    }),
  );
}

export function subscribeToast(handler) {
  const listener = (event) => handler(event.detail);
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
