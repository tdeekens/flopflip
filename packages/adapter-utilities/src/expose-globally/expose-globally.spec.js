import getGlobalThis from 'globalthis';
import { update } from 'lodash';
import exposeGlobally from './expose-globally';

const testAdapter = {
  id: 'test',
  configure: () => null,
};
const updateFlags = () => null;

it('should expose `adapter` globally', () => {
  exposeGlobally(testAdapter, updateFlags);

  const globalThis = getGlobalThis(testAdapter, updateFlags);

  expect(globalThis).toHaveProperty('__flopflip__.test.adapter', testAdapter);
});

it('should expose `updateFlags` globally', () => {
  exposeGlobally(testAdapter, updateFlags);

  const globalThis = getGlobalThis();

  expect(globalThis).toHaveProperty(
    '__flopflip__.test.updateFlags',
    updateFlags
  );
});
