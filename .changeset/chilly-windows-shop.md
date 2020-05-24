---
"@flopflip/react-broadcast": minor
"@flopflip/react-redux": minor
"@flopflip/react": patch
---

feat: add use-flag-variations

You can use evaluate multiple flag variations at the same time:

```js
const [variation1, variation2] = useFlagVariations([FLAG.VARIATION_A, FLAG.VARIATION_B]);
```

Is the same as:

```js
const variation1 = useFlagVariation(FLAG.VARIATION_A);
const variation2 = useFlagVariation(FLAG.VARIATION_B);
```
