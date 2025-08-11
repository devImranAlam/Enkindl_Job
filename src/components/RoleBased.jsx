import { useSelector } from 'react-redux';

const RoleBased = ({ roles = [], children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleBased;