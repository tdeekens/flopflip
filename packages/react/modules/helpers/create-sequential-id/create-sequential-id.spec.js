import createSequentialId from './create-sequential-id';

it('should return a function', () => {
  expect(typeof createSequentialId('foo')).toBe('function');
});

describe('when the factory is created', () => {
  let sequentialId;
  beforeEach(() => {
    sequentialId = createSequentialId('first-');
  });
  it('should return sequential ids', () => {
    expect(sequentialId()).toBe('first-1');
    expect(sequentialId()).toBe('first-2');
  });
});

describe('when two factories are created', () => {
  let sequentialIdFirst;
  let sequentialIdSecond;
  beforeEach(() => {
    sequentialIdFirst = createSequentialId('first-');
    sequentialIdSecond = createSequentialId('second-');
  });
  it('should have separate counters for each one', () => {
    expect(sequentialIdFirst()).toBe('first-1');
    expect(sequentialIdFirst()).toBe('first-2');
    expect(sequentialIdSecond()).toBe('second-1');
    expect(sequentialIdFirst()).toBe('first-3');
  });
});
