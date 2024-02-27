---
"@flopflip/react-broadcast": minor
"@flopflip/react-redux": minor
"@flopflip/test-utils": minor
---

Included a new hook that allows a consumer to read all the flags configured in the FlopFlip context.

Example:

  ```javascript
import { useAllFeatureToggles } from '@flopflip/react-broadcast';

const MyComponent = () => {
  const allFeatureToggles = useAllFeatureToggles();

  return (
    <div>
      {allFeatureToggles.map(({ featureName, featureValue }) => (
        <div key={id}>
          <span>Feature name: {featureName}</span>
          <span>Feature value: {featureValue}</span>
        </div>
      ))}
    </div>
  );
};
```
