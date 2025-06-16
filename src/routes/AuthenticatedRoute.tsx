import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../components/authentication/account';

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to={`/?redirect=${pathname}${search}`} />;
  }

  return children;
}
