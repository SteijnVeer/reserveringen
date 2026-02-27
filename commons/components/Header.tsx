import { useAuth } from '@contexts/AuthContext';
import './header.css';

export interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <header>
      <HeaderMenu
        name='navigation'
        imgSrc='favicon.ico'
      >
        <div>
          {/* some buttons / info */}
        </div>
        <nav>
          {/* to pages */}
        </nav>
      </HeaderMenu>
      {children}
      <HeaderMenu
        name='account'
        imgSrc={!isAuthenticated
          ? '/assets/profile/logged-out.png'
          : user?.branch
            ? `/assets/profile/${user.branch}.jpg`
            : '/assets/profile/logged-in.png'
        }
      >
        {isAuthenticated && (
          <div
            className='flex row center space-between gap-1'
          >
            <InfoItem
              label='branch'
              value={user?.branch ?? 'Unknown'}
            />
            <InfoItem
              label='username'
              value={user?.username ?? 'Unknown'}
            />
          </div>
        )}
        <div
          className='flex row center space-between gap-2'
        >
          <button
            className='menu-button'
            onClick={isAuthenticated
              ? () => handleLogout()
              : () => handleNavigate('/login')
            }
          >
            {isAuthenticated
              ? 'Log out'
              : 'Log in'
            }
          </button>
          <button
            className='menu-button'
            onClick={() => handleNavigate('/preferences')}
          >
            Preferences
          </button>
        </div>
      </HeaderMenu>
    </header>
  );
}

interface HeaderMenuProps {
  name: string;
  imgSrc: string;
  children: React.ReactNode;
}

function HeaderMenu({ name, imgSrc, children }: HeaderMenuProps) {
  const toggleId = `${name}-menu-toggle`;
  const anchorId = `--${name}-menu-anchor`;
  return (
    <div
      className='header-menu'
    >
      <input
          type='checkbox'
          id={toggleId}
        />
        <label
          htmlFor={toggleId}
        >
          <img
            src={imgSrc}
            style={{ anchorName: anchorId }}
          />
        </label>
        <div
          style={{ positionAnchor: anchorId }}
        >
          {children}
        </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div
      className='flex column gap-1 grow'
    >
      <p className='info-label'>{label.toUpperCase()}:</p>
      <p className='info-value'>{value}</p>
    </div>
  );
}
