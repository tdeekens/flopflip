/* eslint-disable @typescript-eslint/restrict-template-expressions */
import adapter from '@flopflip/memory-adapter';
import {
  act,
  buildQueries,
  fireEvent,
  queries,
  queryHelpers,
  render,
  screen,
} from '@testing-library/react';
import React, { cloneElement } from 'react';

const mergeOptional = (defaultValue, value) =>
  value === null ? undefined : { ...defaultValue, ...value };

const INTERNAL_FLAG_NAME = '__internalFlag__';
const INTERNAL_FLAG_VARIATION_LABEL = 'Change flag variation';
const defaultFlags = {
  [INTERNAL_FLAG_NAME]: true,
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
  getByFlagName,
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
  getByFlagName,
  findAllByFlagName,
  findByFlagName,
};

const changeFlagVariation = (flagName, flagVariation) =>
  fireEvent.change(screen.getByLabelText('Change flag variation'), {
    target: { value: JSON.stringify({ flagName, flagVariation }) },
  });

const defaultRender = (ui, { ...rtlOptions }) => {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const rendered = render(ui, {
    ...rtlOptions,
    queries: {
      ...queries,
      ...flagNameQueries,
    },
  });

  return rendered;
};

const fromEventString = (jsonAsString) => JSON.parse(jsonAsString);

const FlagChangeField = () => {
  return (
    <>
      <label htmlFor={INTERNAL_FLAG_VARIATION_LABEL}>
        {INTERNAL_FLAG_VARIATION_LABEL}
      </label>
      <input
        id={INTERNAL_FLAG_VARIATION_LABEL}
        type="text"
        onChange={(event) => {
          const { flagName, flagVariation } = JSON.parse(event.target.value);

          adapter.updateFlags({ [flagName]: fromEventString(flagVariation) });
        }}
      />
    </>
  );
};

const FlagsToComponent = (props) => {
  return (
    <ul>
      {Object.entries(props.propKey ? props[props.propKey] : props).map(
        ([flagName, flagVariation]) => (
          <li key={flagName} data-flag-name={flagName}>
            {String(flagVariation)}
          </li>
        )
      )}
    </ul>
  );
};

const UntoggledComponent = (props) => (
  <span data-flag-name={props.flagName} data-flag-status="disabled">
    Feature is untoggled
  </span>
);
UntoggledComponent.displayName = 'UntoggledComponent';
UntoggledComponent.defaultProps = {
  flagName: 'isFeatureEnabled',
};
const ToggledComponent = (props) => (
  <span data-flag-name={props.flagName} data-flag-status="enabled">
    Feature is toggled
  </span>
);
ToggledComponent.defaultProps = {
  flagName: 'isFeatureEnabled',
};
ToggledComponent.displayName = 'ToggledComponent';

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

  const wrapUiIfNeeded = (innerElement) =>
    Wrapper ? cloneElement(Wrapper, null, innerElement) : innerElement;

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const rendered = render(
    wrapUiIfNeeded(
      <ConfigureFlopFlip
        adapter={adapter}
        adapterArgs={defaultedAdapterArgs}
        defaultFlags={defaultedFlags}
      >
        <>
          <FlagChangeField />
          <ToggledComponent flagName={INTERNAL_FLAG_NAME} />
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
      changeFlagVariation(flagName, flagVariation),
    waitUntilConfigured: async () => {
      await screen.findByLabelText(INTERNAL_FLAG_VARIATION_LABEL);
      await rendered.findByFlagName(INTERNAL_FLAG_NAME);
    },
    ...rendered,
  };
};

const components = {
  FlagsToComponent,
  UntoggledComponent,
  ToggledComponent,
};

export * from '@testing-library/react';
export {
  act,
  adapter,
  components,
  defaultRender as render,
  renderWithAdapter,
  screen,
};
