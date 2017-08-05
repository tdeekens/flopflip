import 'babel-polyfill';
import * as commercetoolsEnzymeMatchers from '@commercetools/jest-enzyme-matchers';
import * as enzymeMatchers from 'enzyme-matchers';

expect.extend(commercetoolsEnzymeMatchers);
expect.extend(enzymeMatchers);
