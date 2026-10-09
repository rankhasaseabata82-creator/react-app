import { useState } from 'react';
import { useLibrary } from './LibraryContext';

const emptyForm = { title: '', author: '', genre: '', isbn: '', quantity: 0 };

export default function BookManagement() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.author.trim()) e.author = 'Author is required';
    if (!form.genre.trim()) e.genre = 'Genre is required';
    if (!form.isbn.trim()) e.isbn = 'ISBN is required';
    if (form.quantity < 0) e.quantity = 'Quantity cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'quantity' ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingId) {
      updateBook(editingId, form);
      setEditingId(null);
    } else {
      addBook(form);
    }
    setForm(emptyForm);
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title, author: book.author, genre: book.genre,
      isbn: book.isbn, quantity: book.quantity,
    });
    setEditingId(book.id);
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      deleteBook(book.id);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Book Management</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5>{editingId ? 'Update Book' : 'Add New Book'}</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input name="title" placeholder="Title" className="form-control" value={form.title} onChange={handleChange} />
              {errors.title && <small className="text-danger">{errors.title}</small>}
            </div>
            <div className="col-md-6">
              <input name="author" placeholder="Author" className="form-control" value={form.author} onChange={handleChange} />
              {errors.author && <small className="text-danger">{errors.author}</small>}
            </div>
            <div className="col-md-6">
              <input name="genre" placeholder="Genre" className="form-control" value={form.genre} onChange={handleChange} />
              {errors.genre && <small className="text-danger">{errors.genre}</small>}
            </div>
            <div className="col-md-6">
              <input name="isbn" placeholder="ISBN" className="form-control" value={form.isbn} onChange={handleChange} />
              {errors.isbn && <small className="text-danger">{errors.isbn}</small>}
            </div>
            <div className="col-md-6">
              <input name="quantity" type="number" min="0" placeholder="Quantity" className="form-control" value={form.quantity} onChange={handleChange} />
              {errors.quantity && <small className="text-danger">{errors.quantity}</small>}
            </div>
            <div className="col-12">
              <button className="btn btn-primary me-2" type="submit">{editingId ? 'Update' : 'Add'} Book</button>
              {editingId && (
                <button className="btn btn-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h5>All Books</h5>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td>
                <td>{b.isbn}</td><td>{b.quantity}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(b)}>Update</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b)}>Delete</button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted">No books yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}