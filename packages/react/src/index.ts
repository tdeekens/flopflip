import { TProps as ToggleFeatureProps } from './components/toggle-feature';

export type TToggleFeatureProps = ToggleFeatureProps;

const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export {
  AdapterContext,
  ConfigureAdapter,
  createAdapterContext,
  ReconfigureAdapter,
  selectAdapterConfigurationStatus,
  ToggleFeature,
} from './components';
export {
  ALL_FLAGS_PROP_KEY,
  DEFAULT_FLAG_PROP_KEY,
  DEFAULT_FLAGS_PROP_KEY,
} from './constants';
export { getFlagVariation, getIsFeatureEnabled, isNil } from './helpers';
export { setDisplayName, wrapDisplayName } from './hocs';
export {
  useAdapterContext,
  useAdapterReconfiguration,
  useAdapterSubscription,
} from './hooks';

export { version };
