import 'babel-polyfill';
import 'jest-enzyme';
import * as commercetoolsEnzymeMatchers from '@commercetools/jest-enzyme-matchers';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true });
expect.extend(commercetoolsEnzymeMatchers);
