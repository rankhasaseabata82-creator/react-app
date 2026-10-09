import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import { useLibrary } from './LibraryContext';

function Navbar() {
  const { currentUser, logout } = useLibrary();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/users');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Community Library</Link>
      <div className="navbar-nav me-auto">
        <NavLink className="nav-link" to="/">Dashboard</NavLink>
        <NavLink className="nav-link" to="/books">Books</NavLink>
        <NavLink className="nav-link" to="/transactions">Transactions</NavLink>
        <NavLink className="nav-link" to="/users">Users</NavLink>
      </div>
      {currentUser && (
        <div className="d-flex align-items-center text-white">
          <span className="me-3"> {currentUser.name} ({currentUser.role})</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;