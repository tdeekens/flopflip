import { useContext } from 'react';
import { FlagsContext } from '../../components/flags-context';

const useFlagsContext = () => useContext(FlagsContext);

export default useFlagsContext;
