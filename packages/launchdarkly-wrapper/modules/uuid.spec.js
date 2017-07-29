import uuid from './uuid';

describe('when generating', () => {
  it('should return a unique id of `36` characters', () => {
    expect(uuid()).toHaveLength(36);
  });
});
