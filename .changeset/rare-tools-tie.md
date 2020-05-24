---
"@flopflip/react-broadcast": minor
"@flopflip/react-redux": minor
"@flopflip/react": patch
---

feat: add use-flag-variation hook

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
