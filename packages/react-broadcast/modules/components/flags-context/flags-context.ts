import React from 'react';
import { Flags } from '@flopflip/types';

const intialFlagsContext = {};
const FlagsContext = React.createContext<Flags>(intialFlagsContext);

export default FlagsContext;
