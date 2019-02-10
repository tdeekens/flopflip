import createReactContext, { Context } from 'create-react-context';
import { Flags } from '@flopflip/types';

const FlagsContext: Context<Flags> = createReactContext({});

export default FlagsContext;
