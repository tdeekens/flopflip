import useAdapterReconfiguration from './use-adapter-reconfiguration';

const reconfigure = jest.fn();

it('should return a function', () => {
  useContext = jest.fn(() => ({ reconfigure }));
  expect(useAdapterReconfiguration()).toBe(reconfigure);
});
