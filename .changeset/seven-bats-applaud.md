---
'@flopflip/react-broadcast': patch
'@flopflip/react-redux': major
'@flopflip/react': patch
---

refactor: adapters to have own state slice

The `react-redux` package has one potential breaking change. If you used `selectFlags` and/or or `selectFlag` directly then you will have to use their new signature.

```diff
-useSelector(selectFlags);
+useSelector(selectFlags());
```

```diff
-useSelector(selectFlag('fooFlag');
+useSelector(selectFlag([adapter.id], 'fooFlag'));
```

In the second example `memory` could be `id` of your adapter. In the future we plan to support multiple adapters resulting in an array being passed.

Note that in other locations, e.g. with `useFeatureToggle` we now which adapter you are using as we retrive it from the adapter context.
