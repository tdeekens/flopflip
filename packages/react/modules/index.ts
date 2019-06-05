const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

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

export { getIsFeatureEnabled } from './helpers';

export {
  DEFAULT_FLAG_PROP_KEY,
  DEFAULT_FLAGS_PROP_KEY,
  ALL_FLAGS_PROP_KEY,
} from './constants';

export { omitProps, setDisplayName, wrapDisplayName, withProps } from './hocs';

export { useAdapterReconfiguration } from './hooks';

export { version };
