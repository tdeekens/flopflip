import { mergeAdapterArgs } from './helpers';

describe('mergeAdapterArgs', () => {
  describe('when not `shouldOverwrite`', () => {
    const previousAdapterArgs = {
      'some-prop': 'was-present',
    };
    const nextAdapterArgs = {
      'another-prop': 'is-added',
    };

    it('should merge the next properties', () => {
      expect(
        mergeAdapterArgs(previousAdapterArgs, {
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        })
      ).toEqual(expect.objectContaining(nextAdapterArgs));
    });

    it('should keep the previous properties', () => {
      expect(
        mergeAdapterArgs(previousAdapterArgs, {
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        })
      ).toEqual(expect.objectContaining(previousAdapterArgs));
    });
  });

  describe('when `shouldOverwrite`', () => {
    const previousAdapterArgs = {
      'some-prop': 'was-present',
    };
    const nextAdapterArgs = {
      'another-prop': 'is-added',
    };

    it('should merge the next properties', () => {
      expect(
        mergeAdapterArgs(previousAdapterArgs, {
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: true },
        })
      ).toEqual(expect.objectContaining(nextAdapterArgs));
    });

    it('should not keep the previous properties', () => {
      expect(
        mergeAdapterArgs(previousAdapterArgs, {
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: true },
        })
      ).not.toEqual(expect.objectContaining(previousAdapterArgs));
    });
  });
});
