const version = process.env.npm_package_version;

export {
  injectFeatureToggle,
  injectFeatureToggles,
  branchOnFeatureToggle,
  AdapterContext,
  createAdapterContext,
  ToggleFeature,
  ConfigureAdapter,
  ReconfigureAdapter,
} from './components';

export { default as isFeatureEnabled } from './helpers/is-feature-enabled';
export {
  DEFAULT_FLAG_PROP_KEY,
  DEFAULT_FLAGS_PROP_KEY,
  ALL_FLAGS_PROP_KEY,
} from './constants';
export { omitProps, setDisplayName, wrapDisplayName, withProps } from './hocs';

export { version };
