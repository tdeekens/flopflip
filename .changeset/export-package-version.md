---
'@flopflip/cache': patch
'@flopflip/combine-adapters': patch
'@flopflip/cypress-plugin': patch
'@flopflip/graphql-adapter': patch
'@flopflip/http-adapter': patch
'@flopflip/launchdarkly-adapter': patch
'@flopflip/localstorage-adapter': patch
'@flopflip/localstorage-cache': patch
'@flopflip/memory-adapter': patch
'@flopflip/react': patch
'@flopflip/react-broadcast': patch
'@flopflip/react-redux': patch
'@flopflip/sessionstorage-cache': patch
'@flopflip/splitio-adapter': patch
---

fix: export the package version again

Since 15.0.0 the exported `version` was the unreplaced placeholder `"__@FLOPFLIP/VERSION_OF_RELEASE__"`, as the Babel plugin replacing it no longer ran after the move to tsup and later tsdown. The build now replaces it with the version of each package.
