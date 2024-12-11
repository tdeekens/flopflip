import { useContext } from 'react';

import { AdapterContext } from './adapter-context';

const useAdapterContext = () => useContext(AdapterContext);

export { useAdapterContext };
