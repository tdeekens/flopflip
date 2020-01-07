const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export { default as createFlopFlipEnhancer } from './store/enhancer';
// Import this separately to avoid a circular dependency
export { STATE_SLICE as FLOPFLIP_STATE_SLICE } from './store/constants';

export {
  createFlopflipReducer,
  flopflipReducer,
  selectFlags as selectFeatureFlags,
  selectFlag as selectFeatureFlag,
  UPDATE_STATUS,
  UPDATE_FLAGS,
} from './ducks';

export {
  ToggleFeature,
  injectFeatureToggle,
  injectFeatureToggles,
  branchOnFeatureToggle,
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
} from './components';

export { useAdapterReconfiguration, useAdapterStatus } from './hooks';

export { version };
