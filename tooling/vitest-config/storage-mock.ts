import { vi } from 'vitest';

// Replaces `localStorage` and `sessionStorage` with in-memory stores whose
// methods are `vi.fn()` spies, so tests can assert on and stub storage access.
//
// jsdom exposes both as getter-only properties on `window`. They have to be
// redefined, as plain assignment throws.

class StorageMock {
  #store = new Map<string, string>();

  getItem = vi.fn((key: string) => this.#store.get(key) ?? null);

  setItem = vi.fn((key: string, value: unknown) => {
    // Storage always coerces values to strings.
    this.#store.set(key, `${value}`);
  });

  removeItem = vi.fn((key: string) => {
    this.#store.delete(key);
  });

  clear = vi.fn(() => {
    this.#store.clear();
  });

  key = vi.fn((index: number) => [...this.#store.keys()][index] ?? null);

  get length() {
    return this.#store.size;
  }

  toString() {
    return '[object Storage]';
  }
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  Object.defineProperty(globalThis, name, {
    value: new StorageMock(),
    configurable: true,
    writable: true,
  });
}
