require('jest-enzyme');
require('jest-dom/extend-expect');
require('react-testing-library/cleanup-after-each');

const commercetoolsEnzymeMatchers = require('@commercetools/jest-enzyme-matchers');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true });
expect.extend(commercetoolsEnzymeMatchers);
