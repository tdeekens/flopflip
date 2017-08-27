const version = VERSION;

export {
  injectFeatureToggle,
  injectFeatureToggles,
  branchUntoggled,
  FeatureToggled,
  FlagsSubscription,
} from './components';

export { default as isUntoggled } from './helpers/is-untoggled';

export { version };
