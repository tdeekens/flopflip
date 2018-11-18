// @flow

import type { Flags } from '@flopflip/types';

import createReactContext, { type Context } from 'create-react-context';

const FlagsContext: Context<Flags> = createReactContext({});

export default FlagsContext;
