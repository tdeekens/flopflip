/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import adapter, { updateFlags } from '@flopflip/memory-adapter';
import {
  render,
  screen,
  queries,
  fireEvent,
  waitForElement,
  queryHelpers,
  buildQueries,
  act,
} from '@testing-library/react';

const mergeOptional = (defaultValue, value) =>
  value === null ? undefined : { ...defaultValue, ...value };

const defaultFlags = {
  enabledFeature: true,
  disabledFeature: false,
  variation: 'A',
};
const defaultAdapterArgs = {
  user: { key: 'nerd@tdeekens.name' },
};

const queryByAllByFlagName = (...args) =>
  queryHelpers.queryAllByAttribute('data-flag-name', ...args);
const getMultipleFlagNamesError = (c, flagName) =>
  `Found multiple elements with the 'data-flag-name' attribute of: '${flagName}'.`;
const getMissingFlagNameError = (c, flagName) =>
  `Unable to find an element with the 'data-flag-name' attribute of: '${flagName}'.`;

const [
  queryByFlagName,
  getAllByFlagName,
  getByDataFlagName,
  findAllByFlagName,
  findByFlagName,
] = buildQueries(
  queryByAllByFlagName,
  getMultipleFlagNamesError,
  getMissingFlagNameError
);

const flagNameQueries = {
  queryByFlagName,
  getAllByFlagName,
  getByDataFlagName,
  findAllByFlagName,
  findByFlagName,
};

const changeFlagVariation = (rendered, flagName, flagVariation) =>
  fireEvent.change(rendered.getByTestId('change-flag-variation'), {
    target: { value: `${flagName}:${flagVariation}` },
  });

const defaultRender = (ui, { ...rtlOptions }) => {
  const rendered = render(ui, {
    ...rtlOptions,
    queries: {
      ...queries,
      ...flagNameQueries,
    },
  });

  return rendered;
};

const fromEventString = string => {
  if (string === 'true') return true;
  if (string === 'false') return false;

  return string;
};

const ChangeFlagVariation = () => (
  <input
    data-testid="change-flag-variation"
    type="text"
    onChange={event => {
      const [flagName, flagVariation] = event.target.value.split(':');

      updateFlags({ [flagName]: fromEventString(flagVariation) });
    }}
  />
);

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
        <>
          <ChangeFlagVariation />
          {ui}
        </>
      </ConfigureFlopFlip>
    ),
    {
      ...rtlOptions,
      queries: {
        ...queries,
        ...flagNameQueries,
      },
    }
  );
  return {
    changeFlagVariation: (flagName, flagVariation) =>
      changeFlagVariation(rendered, flagName, flagVariation),
    waitUntilReady: async () => {
      await rendered.findByTestId('change-flag-variation');
    },
    ...rendered,
  };
};

const FlagsToComponent = props =>
  Object.entries(props.propKey ? props[props.propKey] : props).map(
    ([flagName, flagVariation]) => (
      <div key={flagName} data-flag-name={flagName}>
        {String(flagVariation)}
      </div>
    )
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

export * from '@testing-library/react';
export {
  defaultRender as render,
  renderWithAdapter,
  adapter,
  updateFlags,
  components,
  screen,
  act,
};
