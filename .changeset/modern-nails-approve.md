---
"@flopflip/react-broadcast": minor
"@flopflip/react": patch
---

feat: add test context provider for react-broadcast

You can wrap your application using for instance `react-testing-library` as

```jsx
import { FlopflipTestProvider } from '@flopflip/react-broadcast';

<FlopflipTestProvider flags={testFlags} status={adapterStatus}>
   <App />
</FlopflipTestProvider>
```
