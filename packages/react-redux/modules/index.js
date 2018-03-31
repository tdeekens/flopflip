export {
  createFlopFlipEnhancer,
  STATE_SLICE as FLOPFLIP_STATE_SLICE,
} from './store';
export {
  flopflipReducer,
  selectFlags as selectFeatureFlags,
  selectFlag as selectFeatureFlag,
} from './ducks';
export {
  FeatureToggled,
  ToggleFeature,
  injectFeatureToggle,
  injectFeatureToggles,
  branchOnFeatureToggle,
  ConfigureFlopFlip,
  ReconfigureFlopFlip,
} from './components';

export { version } from '../package.json';
