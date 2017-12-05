import React from 'react';
import { shallow } from 'enzyme';
import warning from 'warning';
import FeatureToggled from './feature-toggled';

jest.mock('warning');

describe('rendering', () => {
  beforeEach(() => {
    shallow(
      <FeatureToggled isFeatureEnabled>
        <div />
      </FeatureToggled>
    );
  });

  it('should warn about a deprecation', () => {
    expect(warning).toHaveBeenCalled();
  });
});
