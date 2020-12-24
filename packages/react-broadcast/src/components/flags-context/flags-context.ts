import type { TFlags } from '@flopflip/types';

import { createContext } from 'react';

const intialFlagsContext = {};
const FlagsContext = createContext<TFlags>(intialFlagsContext);

export default FlagsContext;
