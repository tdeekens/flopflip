import { adapter as memoryAdapter } from '@flopflip/memory-adapter';
import {
  act,
  buildQueries,
  fireEvent,
  queries,
  queryHelpers,
  render,
  screen,
} from '@testing-library/react';
import { cloneElement } from 'react';
import { afterEach } from 'vitest';

afterEach(memoryAdapter.reset);

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
const getMultipleFlagNamesError = (_, flagName) =>
  `Found multiple elements with the 'data-flag-name' attribute of: '${flagName}'.`;
const getMissingFlagNameError = (_, flagName) =>
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

const defaultRender = (ui, { ...rtlOptions } = {}) => {
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

function FlagChangeField() {
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

          memoryAdapter.updateFlags({
            [flagName]: fromEventString(flagVariation),
          });
        }}
      />
    </>
  );
}

function FlagsToComponent({ propKey, ...remainingProps }) {
  return (
    <ul>
      {Object.entries(propKey ? remainingProps[propKey] : remainingProps).map(
        ([flagName, flagVariation]) => (
          <li key={flagName} data-flag-name={flagName}>
            {String(flagVariation)}
          </li>
        )
      )}
    </ul>
  );
}

function UntoggledComponent({ flagName = 'isFeatureEnabled' }) {
  return (
    <span data-flag-name={flagName} data-flag-status="disabled">
      Feature is untoggled
    </span>
  );
}

UntoggledComponent.displayName = 'UntoggledComponent';

function ToggledComponent({ flagName = 'isFeatureEnabled' }) {
  return (
    <span data-flag-name={flagName} data-flag-status="enabled">
      Feature is toggled
    </span>
  );
}

ToggledComponent.displayName = 'ToggledComponent';

const renderWithAdapter = (
  ui,
  {
    components: { ConfigureFlopFlip, Wrapper = null },
    adapter,
    adapterArgs,
    flags,
    ...rtlOptions
  }
) => {
  const defaultedAdapterArgs = mergeOptional(defaultAdapterArgs, adapterArgs);
  const defaultedFlags = mergeOptional(defaultFlags, flags);
  const defaultedAdapter = adapter || memoryAdapter;

  const wrapUiIfNeeded = (innerElement) =>
    Wrapper ? cloneElement(Wrapper, null, innerElement) : innerElement;

  const rendered = render(
    wrapUiIfNeeded(
      <ConfigureFlopFlip
        adapter={defaultedAdapter}
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
    changeFlagVariation(flagName, flagVariation) {
      return changeFlagVariation(flagName, flagVariation);
    },
    async waitUntilConfigured() {
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
  memoryAdapter as adapter,
  components,
  defaultFlags,
  defaultRender as render,
  renderWithAdapter,
  screen,
};
