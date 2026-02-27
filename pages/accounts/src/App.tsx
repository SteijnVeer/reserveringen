import Header from '@components/Header';
import { useAuth } from '@contexts/AuthContext';
import useApi from '@hooks/useApi';
import useRelocateOnAuth from '@hooks/useRelocateOnAuth';
import { useEffect } from 'react';

export default function App() {
  useRelocateOnAuth({ whenUnauthenticatedPath: '/login' });
  const { isLoading, isAuthenticated, user } = useAuth();

  const userId = isAuthenticated && user
    ? user.userId
    : null;

  return (
    <body>
      <Header />
      {isLoading
        ? <p>Loading...</p>
        : userId && <AccountsList selfId={userId} />
      }
    </body>
  );
}

interface AccountListProps {
  selfId: string;
}

function AccountsList({ selfId }: AccountListProps) {
  const { data, makeRequest, error } = useApi('get /accounts');
  
  useEffect(() => {
    makeRequest();
  }, []);

  useEffect(() => {
    if (data)
      console.log('Accounts data:', data.accounts);
  }, [data]);
  
  return data ? (
    <>
      {data.accounts.map(({ userId, username, branch, permissionLevel }) => (
        <div key={userId}>
          {userId === selfId && <strong>(You)</strong>}
          <p>Username: {username}</p>
          <p>Branch: {branch}</p>
          <p>Permission Level: {permissionLevel}</p>
        </div>
      ))}
    </>
  ) : error ? (
    <p>Error loading accounts: {error}</p>
  ) : (
    <p>Loading accounts...</p>
  );
}
