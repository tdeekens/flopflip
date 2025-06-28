import type { TProps as ToggleFeatureProps } from './toggle-feature';

export type TToggleFeatureProps = ToggleFeatureProps;

const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export {
  AdapterContext,
  createAdapterContext,
  selectAdapterConfigurationStatus,
} from './adapter-context';
export { ConfigureAdapter } from './configure-adapter';
export {
  ALL_FLAGS_PROP_KEY,
  DEFAULT_FLAG_PROP_KEY,
  DEFAULT_FLAGS_PROP_KEY,
} from './constants';
export { getFlagVariation } from './/get-flag-variation';
export { getIsFeatureEnabled } from './get-is-feature-enabled';
export { isNil } from './is-nil';
export { ReconfigureAdapter } from './reconfigure-adapter';
export { setDisplayName } from './set-display-name';
export { ToggleFeature } from './toggle-feature';
export { useAdapterContext } from './use-adapter-context';
export { useAdapterReconfiguration } from './use-adapter-reconfiguration';
export { useAdapterSubscription } from './use-adapter-subscription';
export { wrapDisplayName } from './wrap-display-name';

export { version };
