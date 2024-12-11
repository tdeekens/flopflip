import { useContext } from 'react';
import { expect, it, vi } from 'vitest';

import { useAdapterReconfiguration } from '../src/use-adapter-reconfiguration';

const reconfigure = vi.fn();

vi.mock(import('react'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useContext: vi.fn(() => ({ reconfigure })),
  };
});

it('should return a function', () => {
  expect(useAdapterReconfiguration()).toBe(reconfigure);
});
