const version = '__@FLOPFLIP/VERSION_OF_RELEASE__';

export {
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
  TestProviderFlopFlip,
  ToggleFeature,
} from './components';
export {
  branchOnFeatureToggle,
  injectFeatureToggle,
  injectFeatureToggles,
} from './hocs';
export {
  useAdapterReconfiguration,
  useAdapterStatus,
  useAllFeatureToggles,
  useFeatureToggle,
  useFeatureToggles,
  useFlagVariation,
  useFlagVariations,
} from './hooks';

export { version };
