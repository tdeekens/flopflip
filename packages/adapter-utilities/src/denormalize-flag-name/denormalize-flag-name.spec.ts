import { TFlagName } from '@flopflip/types';
import { describe, it, expect } from "vitest";

import denormalizeFlagName from './denormalize-flag-name';

describe('with camel case', () => {
  it('should camel case to uppercased flag names', () => {
    const input: TFlagName = 'aFlag';
    const expected: string = 'a-flag';
    
    expect(denormalizeFlagName(input)).toEqual(expected);
  });
});
