const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export { default as createFlopFlipEnhancer } from './store/enhancer';
// Import this separately to avoid a circular dependency
export {
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
  ToggleFeature,
} from './components';
export {
  createFlopflipReducer,
  flopflipReducer,
  selectFlag as selectFeatureFlag,
  selectFlags as selectFeatureFlags,
  UPDATE_FLAGS,
  UPDATE_STATUS,
} from './ducks';
export {
  branchOnFeatureToggle,
  injectFeatureToggle,
  injectFeatureToggles,
} from './hocs';
export {
  useAdapterReconfiguration,
  useAdapterStatus,
  useFeatureToggle,
  useFeatureToggles,
  useFlagVariation,
  useFlagVariations,
} from './hooks';
export { STATE_SLICE as FLOPFLIP_STATE_SLICE } from './store/constants';

export { version };
