---
'@flopflip/react-broadcast': minor
'@flopflip/react': patch
---

feat: add test context provider for react-broadcast

You can wrap your application using for instance `react-testing-library` as

```jsx
import { TestProviderFlopFlip } from '@flopflip/react-broadcast';
import { render } from '@testing-library/react';

const testFlags = {
  myFlag: true,
};

describe('rendering', () => {
  it('should render the application with feature flags', () => {
    render(
      <TestProviderFlopFlip flags={testFlags}>
        <App />
      </TestProviderFlopFlip>
    );
  });
});
```
