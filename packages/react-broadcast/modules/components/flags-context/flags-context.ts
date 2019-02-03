// @flow

import { Flags } from '@flopflip/types';

import createReactContext, { Context } from 'create-react-context';

const FlagsContext: Context<Flags> = createReactContext({});

export default FlagsContext;
