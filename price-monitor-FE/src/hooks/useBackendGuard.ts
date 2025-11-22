import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GuardParams {
  isError: boolean;
  error: unknown;
}

// Redirect to NotFound if backend appears down (network error or 5xx without data)
export function useBackendGuard({ isError, error }: GuardParams){
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isError) return;
    // Detect axios network error shape or missing response
    const err: any = error;
    const status = err?.response?.status;
    const network = err?.code === 'ERR_NETWORK' || !err?.response;
    const server = status && status >= 500;
    if(network || server){
      navigate('/not-found', { replace: true });
    }
  }, [isError, error, navigate]);
}
