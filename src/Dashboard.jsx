import { useLibrary } from './LibraryContext';
import BookCard from './BookCard';

export default function Dashboard() {
  const { books, users, transactions } = useLibrary();
  const lowStock = books.filter(b => b.quantity < 2);
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-3"><div className="card text-white bg-primary p-3"><h5>Total Books</h5><h3>{books.length}</h3></div></div>
        <div className="col-md-3"><div className="card text-white bg-success p-3"><h5>Total Copies</h5><h3>{totalCopies}</h3></div></div>
        <div className="col-md-3"><div className="card text-white bg-warning p-3"><h5>Low Stock</h5><h3>{lowStock.length}</h3></div></div>
        <div className="col-md-3"><div className="card text-white bg-info p-3"><h5>Users</h5><h3>{users.length}</h3></div></div>
      </div>

      <h4>Book Availability</h4>
      {books.length === 0 ? (
        <p className="text-muted">No books yet. Add some from the Books page.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th>Status</th></tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id} className={b.quantity < 2 ? 'table-danger' : ''}>
                  <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td>
                  <td>{b.isbn}</td><td>{b.quantity}</td>
                  <td>{b.quantity < 2 ? 'Low' : 'Available'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h4 className="mt-4">Book Cards</h4>
      <div className="row">
        {books.map(b => (
          <div className="col-md-4" key={b.id}><BookCard book={b} /></div>
        ))}
      </div>
    </div>
  );
}