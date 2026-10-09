import { useState } from 'react';
import { useLibrary } from './LibraryContext';

const emptyUser = { name: '', id: '', role: 'member', password: '' };

function UserManagement() {
  const { users, currentUser, addUser, updateUser, deleteUser, login, logout } = useLibrary();
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.id || !form.password) {
      return alert('All fields are required');
    }
    if (editingId) {
      updateUser(editingId, form);
      setEditingId(null);
    } else {
      const ok = addUser(form); 
      if (!ok) return alert('Membership ID already exists');
    }
    setForm(emptyUser);
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, id: user.id, role: user.role, password: user.password || '' });
    setEditingId(user.id);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      deleteUser(user.id);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(loginForm.id, loginForm.password)) {
      setLoginError('');
      setLoginForm({ id: '', password: '' });
    } else {
      setLoginError('Invalid membership ID or password');
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div>
      <h2 className="mb-4">User Management</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5>{currentUser ? `Logged in as ${currentUser.name}` : 'Login'}</h5>
          {currentUser ? (
            <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
          ) : (
            <form onSubmit={handleLogin} className="row g-3">
              <div className="col-md-4">
                <input className="form-control" placeholder="Membership ID" value={loginForm.id}
                  onChange={e => setLoginForm({ ...loginForm, id: e.target.value })} />
              </div>
              <div className="col-md-4">
                <input type="password" className="form-control" placeholder="Password" value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
              </div>
              <div className="col-md-4">
                <button className="btn btn-primary" type="submit">Login</button>
              </div>
              {loginError && <div className="text-danger">{loginError}</div>}
              <small className="text-muted">
                Default admin → ID: <b>ADMIN01</b>, Password: <b>admin123</b>
              </small>
            </form>
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h5>{editingId ? 'Update User' : 'Add New User'}</h5>
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-3">
                  <input name="name" className="form-control" placeholder="Full Name" value={form.name} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <input name="id" className="form-control" placeholder="Membership ID" value={form.id} onChange={handleChange} disabled={!!editingId} />
                </div>
                <div className="col-md-2">
                  <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                    <option value="member">Member</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100" type="submit">{editingId ? 'Update' : 'Add'}</button>
                </div>
                {editingId && (
                  <div className="col-12">
                    <button type="button" className="btn btn-secondary btn-sm"
                      onClick={() => { setEditingId(null); setForm(emptyUser); }}>
                      Cancel Edit
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <h5>All Users</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td><td>{u.id}</td><td>{u.role}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(u)}>Update</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u)} disabled={u.id === currentUser?.id}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!currentUser && <p className="text-muted">Log in as admin to manage users.</p>}
    </div>
  );
}

export default UserManagement;