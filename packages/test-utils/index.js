import React from 'react';
import { shallow } from 'enzyme';
import adapter from '@flopflip/memory-adapter';
import { render } from 'react-testing-library';

const mergeOptional = (defaultValue, value) =>
  value === null ? undefined : { ...defaultValue, ...value };

const defaultFlags = { enabledFeature: true, disabledFeature: false };

const defaultAdapterArgs = {
  user: { key: 'nerd@tdeekens.name' },
  defaultFlags,
};

const renderWithAdapter = (
  node,
  { components: { ConfigureFlopFlip }, adapterArgs, ...rtlOptions }
) => {
  const defaultedAdapterArgs = mergeOptional(defaultAdapterArgs, adapterArgs);

  return {
    ...render(
      <ConfigureFlopFlip adapter={adapter} adapterArgs={defaultedAdapterArgs}>
        {node}
      </ConfigureFlopFlip>,
      rtlOptions
    ),
  };
};

const getComponentInstance = node => {
  const wrapper = shallow(node);

  return wrapper.instance();
};

export * from 'react-testing-library';
export { renderWithAdapter, getComponentInstance, adapter };
