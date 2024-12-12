import { useContext } from 'react';

import { FlagsContext } from './flags-context';

const useFlagsContext = () => useContext(FlagsContext);

export { useFlagsContext };
