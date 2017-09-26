import 'babel-polyfill';
import * as commercetoolsEnzymeMatchers from '@commercetools/jest-enzyme-matchers';
import * as enzymeMatchers from 'enzyme-matchers';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });
expect.extend(commercetoolsEnzymeMatchers);
expect.extend(enzymeMatchers);
