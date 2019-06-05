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
  useAdapterStatus,
  useAdapterReconfiguration,
} from './hooks';
export { version };
