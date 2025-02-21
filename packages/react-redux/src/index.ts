const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export { createFlopFlipEnhancer } from './enhancer';
export { STATE_SLICE as FLOPFLIP_STATE_SLICE } from './constants';
export { Configure as ConfigureFlopFlip } from './configure';
export { ReconfigureAdapter as ReconfigureFlopFlip } from './reconfigure';
export { ToggleFeature } from './toggle-feature';
export {
  createFlopflipReducer,
  flopflipReducer,
} from './ducks';
export {
  selectFlag as selectFeatureFlag,
  selectFlags as selectFeatureFlags,
} from './ducks';
export { branchOnFeatureToggle } from './branch-on-feature-toggle';
export { injectFeatureToggle } from './inject-feature-toggle';
export { injectFeatureToggles } from './inject-feature-toggles';
export { useAdapterReconfiguration } from './use-adapter-reconfiguration';
export { useAdapterStatus } from './use-adapter-status';
export { useAllFeatureToggles } from './use-all-feature-toggles';
export { useFeatureToggle } from './use-feature-toggle';
export { useFeatureToggles } from './use-feature-toggles';
export { useFlagVariation } from './use-flag-variation';
export { useFlagVariations } from './use-flag-variations';

export { version };
