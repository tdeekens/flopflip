const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export {
  ToggleFeature,
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
} from './components';

export {
  injectFeatureToggle,
  injectFeatureToggles,
  branchOnFeatureToggle,
} from './hocs';

export {
  useFeatureToggle,
  useFeatureToggles,
  useAdapterStatus,
  useAdapterReconfiguration,
  useFlagVariation,
} from './hooks';

export { version };
