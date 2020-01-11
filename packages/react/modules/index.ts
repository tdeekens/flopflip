const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export {
  AdapterContext,
  createAdapterContext,
  ToggleFeature,
  ConfigureAdapter,
  ReconfigureAdapter,
} from './components';

export { getIsFeatureEnabled, getFlagVariation } from './helpers';

export {
  DEFAULT_FLAG_PROP_KEY,
  DEFAULT_FLAGS_PROP_KEY,
  ALL_FLAGS_PROP_KEY,
} from './constants';

export { setDisplayName, wrapDisplayName } from './hocs';

export { useAdapterReconfiguration } from './hooks';

export { version };
