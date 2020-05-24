const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export {
  ToggleFeature,
  injectFeatureToggle,
  injectFeatureToggles,
  branchOnFeatureToggle,
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
} from './components';

export {
  useFeatureToggle,
  useFeatureToggles,
  useAdapterStatus,
  useAdapterReconfiguration,
  useFlagVariation,
} from './hooks';

export { version };
