import getGlobalThis from 'globalthis';

import exposeGlobally from './expose-globally';

const testAdapter = {
  id: 'test',
  configure: () => null,
};

it('should expose `adapter` globally', () => {
  exposeGlobally(testAdapter);

  const globalThis = getGlobalThis();

  expect(globalThis).toHaveProperty('__flopflip__.test', testAdapter);
});
