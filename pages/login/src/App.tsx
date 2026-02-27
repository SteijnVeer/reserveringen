import Header from '@components/Header';
import { useAuth } from '@contexts/AuthContext';
import useApi from '@hooks/useApi';
import { useEffect } from 'react';

export default function App() {
  const { login, isAuthenticated, loginState } = useAuth();

  const { data: branchesData, makeRequest: fetchBranches, requestState: branchesState, error: branchesError } = useApi('get /branches');

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (isAuthenticated)
      // Redirect to home page on successful authentication
      // window.location.href = '/';
      {}
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const branch = formData.get('branch') as string;

    await login(username, password, branch);
  };

  const inputsDisabled = loginState === 'loading' || isAuthenticated;

  return (
    <body>
      <Header>
        {/* You can add header content here */}
      </Header>
      <form
        name='loginForm'
        onSubmit={handleSubmit}
      >
        <h3>
          Login to account
        </h3>
        <label
          htmlFor='branch'
        >
          Branch
        </label>
        <select
          name='branch'
          id='branch'
          defaultValue=''
          required
          disabled={inputsDisabled}
        >
          <option
            value=''
            disabled
          >
            Select a branch
          </option>
          {branchesData && branchesData.branches.map(branch => (
            <option
              key={branch}
              value={branch}
            >
              {branch}
            </option>
          ))}
        </select>
        <label
          htmlFor='username'
        >
          Username
        </label>
        <input
          type='text'
          name='username'
          id='username'
          autoComplete='username'
          required
          disabled={inputsDisabled}
        />
        <label
          htmlFor='password'
        >
          Password
        </label>
        <input
          type='password'
          name='password'
          id='password'
          autoComplete='current-password'
          required
          disabled={inputsDisabled}
        />
        <button
          type='submit'
          disabled={inputsDisabled}
        >
          {loginState === 'loading'
            ? 'Logging in...'
            : isAuthenticated
              ? 'Already logged in'
              : 'Login'
          }
        </button>
        {loginState === 'error' && (
          <p className='error'>
            Login failed. Please check your credentials.
          </p>
        )}
        {branchesState === 'error' && branchesError && (
          <p className='error'>
            Failed to load branches: {branchesError}
          </p>
        )}
      </form>
    </body>
  );
}
