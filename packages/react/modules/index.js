const version = VERSION;

export {
  injectFeatureToggle,
  injectFeatureToggles,
  branchUntoggled,
  FeatureToggled,
  FlagsSubscription,
} from './components';

export { default as isFeatureEnabled } from './helpers/is-feature-enabled';
export {
  DEFAULT_FLAG_PROP_KEY,
  DEFAULT_FLAGS_PROP_KEY,
  ALL_FLAGS,
} from './constants';

export { version };
