const version = process.env.npm_package_version;
export {
  ToggleFeature,
  injectFeatureToggle,
  injectFeatureToggles,
  branchOnFeatureToggle,
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
} from './components';
export { useFeatureToggle } from './hooks';
export { version };
