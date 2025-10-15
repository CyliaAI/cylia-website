import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const PrivateRoute = () => {
  const { isLoggedIn } = useGlobalContext();
  if (isLoggedIn == null) return <div></div>;
  return isLoggedIn ? <div></div> : <Navigate to="/login" />;
};
export default PrivateRoute;
