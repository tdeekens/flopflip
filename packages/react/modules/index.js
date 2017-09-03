const version = VERSION;

export {
  injectFeatureToggle,
  injectFeatureToggles,
  branchUntoggled,
  FeatureToggled,
  FlagsSubscription,
} from './components';

export { default as isFeatureEnabled } from './helpers/is-feature-enabled';
export { defaultFlagName } from './helpers/is-feature-enabled';

export { version };
