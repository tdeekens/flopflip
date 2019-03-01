import React from 'react';
import { shallow } from 'enzyme';
import adapter, { updateFlags } from '@flopflip/memory-adapter';
import { render } from 'react-testing-library';

const mergeOptional = (defaultValue, value) =>
  value === null ? undefined : { ...defaultValue, ...value };

const defaultFlags = { enabledFeature: true, disabledFeature: false };
const defaultAdapterArgs = {
  user: { key: 'nerd@tdeekens.name' },
};

const renderWithAdapter = (
  node,
  { components: { ConfigureFlopFlip }, adapterArgs, flags, ...rtlOptions }
) => {
  const defaultedAdapterArgs = mergeOptional(defaultAdapterArgs, adapterArgs);
  const defaultedFlags = mergeOptional(defaultFlags, flags);

  return {
    ...render(
      <ConfigureFlopFlip
        adapter={adapter}
        adapterArgs={defaultedAdapterArgs}
        defaultFlags={defaultedFlags}
      >
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

const PropsToComponent = props => (
  <>
    {Object.entries(props).map(([key, value]) => (
      <div key={key} data-testid={key}>
        {String(value)}
      </div>
    ))}
  </>
);

export * from 'react-testing-library';
export {
  renderWithAdapter,
  getComponentInstance,
  adapter,
  updateFlags,
  PropsToComponent,
};
