import type { TFlags } from '@flopflip/types';

import React from 'react';

const intialFlagsContext = {};
const FlagsContext = React.createContext<TFlags>(intialFlagsContext);

export default FlagsContext;
