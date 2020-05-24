# @flopflip/react-broadcast

## 10.2.0
### Minor Changes



- [`bafdc4b`](https://github.com/tdeekens/flopflip/commit/bafdc4b27ace4c5490487b22f5f4ee3a5ce32ebf) [#1110](https://github.com/tdeekens/flopflip/pull/1110) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add use-flag-variations
  
  You can use evaluate multiple flag variations at the same time:
  
  ```js
  const [variation1, variation2] = useFlagVariations([FLAG.VARIATION_A, FLAG.VARIATION_B]);
  ```
  
  Is the same as:
  
  ```js
  const variation1 = useFlagVariation(FLAG.VARIATION_A);
  const variation2 = useFlagVariation(FLAG.VARIATION_B);
  ```


- [`8ce10a9`](https://github.com/tdeekens/flopflip/commit/8ce10a953e54bb9e159f606338d327f0a3ede8fb) [#1106](https://github.com/tdeekens/flopflip/pull/1106) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add use-flag-variation hook
  
  You can now conveniently a flag variation without evaluating its actual state (as with `useFeatureToggle`).
  
  ```js
  const variation = useFlagVariation('myFlagName');
  
  const isAEnabled = variation === VARIATION_A;
  const isBEnabled = variation === VARIATION_B;
  
  // Is the same as
  
  const isAEnabled = useFlagVariation('myFlagName', VARIATION_A);
  const isBEnabled = useFlagVariation('myFlagName', VARIATION_B);
  ```
  
  Using `useFlagVariation` is often a bit more concise if you want to work with the variation value yourself.

### Patch Changes

- Updated dependencies [[`bafdc4b`](https://github.com/tdeekens/flopflip/commit/bafdc4b27ace4c5490487b22f5f4ee3a5ce32ebf), [`8ce10a9`](https://github.com/tdeekens/flopflip/commit/8ce10a953e54bb9e159f606338d327f0a3ede8fb)]:
  - @flopflip/react@9.1.15
