import React from 'react';
import { TFlags } from '@flopflip/types';

const intialFlagsContext = {};
const FlagsContext = React.createContext<TFlags>(intialFlagsContext);

export default FlagsContext;
