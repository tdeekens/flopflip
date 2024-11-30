import React from 'react';
import { vi, it, expect } from 'vitest';

import useAdapterReconfiguration from './use-adapter-reconfiguration';

const reconfigure = vi.fn();

it('should return a function', () => {
  React.useContext = vi.fn(() => ({ reconfigure }));
  expect(useAdapterReconfiguration()).toBe(reconfigure);
});
