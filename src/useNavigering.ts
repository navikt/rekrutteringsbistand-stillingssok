import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Navigeringsstate } from './utils/urlUtils';

const useNavigering = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const state = useLocation().state as Navigeringsstate | undefined;

    return {
        searchParams,
        navigate,
        state,
    };
};

export default useNavigering;
