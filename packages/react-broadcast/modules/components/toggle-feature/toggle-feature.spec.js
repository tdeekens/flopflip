import React from 'react';
import { mount } from 'enzyme';
import ToggleFeature from './toggle-feature';
import Configure from '../configure';
import memoryAdapter, { updateFlags } from '@flopflip/memory-adapter';
import { FLAGS_CHANNEL } from '../../constants';

const FeatureComponent = () => <div />;
FeatureComponent.displayName = 'FeatureComponent';

const createTestProps = custom => ({
  adapterArgs: {},

  ...custom,
});

describe('when feature is disabled', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({ defaultFlags: { flag1: false, flag2: false } });
    wrapper = mount(
      <Configure {...props} adapter={memoryAdapter}>
        <ToggleFeature flag="flag1">
          <FeatureComponent />
        </ToggleFeature>
      </Configure>
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render the `FeatureComponent`', () => {
    expect(wrapper).not.toRender(FeatureComponent);
  });

  describe('when enabling feature', () => {
    beforeEach(() => {
      updateFlags({ flag1: true });
      wrapper.update();
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `FeatureComponent`', () => {
      expect(wrapper).toRender(FeatureComponent);
    });
  });
});
