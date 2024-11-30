import getGlobalThis from 'globalthis';
import { it, expect } from 'vitest';

import exposeGlobally from './expose-globally';

const testAdapter = {
  id: 'test',
  configure: () => null,
};

it('should expose `adapter` globally', () => {
  exposeGlobally(testAdapter);

  const global = getGlobalThis();

  expect(global).toHaveProperty('__flopflip__.test', testAdapter);
});
