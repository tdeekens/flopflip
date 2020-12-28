import { useContext } from 'react';
import AdapterContext from '../../components/adapter-context';

const useAdapterContext = () => useContext(AdapterContext);

export default useAdapterContext;
