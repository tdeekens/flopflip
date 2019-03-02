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

const queryByFlagName = (flagName, container) => {
  const [firstElement] = container.querySelectorAll(
    `[data-flag-name="${flagName}"]`
  );

  if (!firstElement) return null;

  return firstElement;
};

const defaultRender = (ui, { ...rtlOptions }) => {
  const rendered = render(ui, rtlOptions);

  return {
    queryByFlagName: flagName => queryByFlagName(flagName, rendered.container),
    ...rendered,
  };
};

const renderWithAdapter = (
  ui,
  {
    components: { ConfigureFlopFlip, Wrapper = null },
    adapterArgs,
    flags,
    ...rtlOptions
  }
) => {
  const defaultedAdapterArgs = mergeOptional(defaultAdapterArgs, adapterArgs);
  const defaultedFlags = mergeOptional(defaultFlags, flags);

  const wrapUiIfNeeded = innerElement =>
    Wrapper ? React.cloneElement(Wrapper, null, innerElement) : innerElement;

  const rendered = render(
    wrapUiIfNeeded(
      <ConfigureFlopFlip
        adapter={adapter}
        adapterArgs={defaultedAdapterArgs}
        defaultFlags={defaultedFlags}
      >
        {ui}
      </ConfigureFlopFlip>
    ),
    rtlOptions
  );
  return {
    queryByFlagName: flagName => queryByFlagName(flagName, rendered.container),
    ...rendered,
  };
};

const getComponentInstance = node => {
  const wrapper = shallow(node);

  return wrapper.instance();
};

const FlagsToComponent = props => (
  <>
    {Object.entries(props.propKey ? props[props.propKey] : props).map(
      ([flagName, flagVariation]) => (
        <div key={flagName} data-flag-name={flagName}>
          {String(flagVariation)}
        </div>
      )
    )}
  </>
);

const UntoggledComponent = props => (
  <span data-flag-name={props.flagName} data-flag-status="disabled">
    Feature is untoggled
  </span>
);
UntoggledComponent.displayName = 'UntoggledComponent';
UntoggledComponent.defaultProps = {
  flagName: 'isFeatureEnabled',
};
const ToggledComponent = props => (
  <span data-flag-name={props.flagName} data-flag-status="enabled">
    Feature is toggled
  </span>
);
ToggledComponent.defaultProps = {
  flagName: 'isFeatureEnabled',
};
ToggledComponent.displayName = 'ToggledComponent';

const components = {
  FlagsToComponent,
  UntoggledComponent,
  ToggledComponent,
};

export * from 'react-testing-library';
export {
  defaultRender as render,
  renderWithAdapter,
  getComponentInstance,
  adapter,
  updateFlags,
  components,
};
