import { useState } from 'react';
import { useLibrary } from './LibraryContext';

function Transactions() {
  const { books, transactions, adjustStock, currentUser } = useLibrary();
  const [selectedBook, setSelectedBook] = useState('');
  const [amount, setAmount] = useState(1);

  const handleTransaction = (type) => {
    if (!selectedBook) return alert('Please select a book');
    if (amount <= 0) return alert('Amount must be greater than 0');

    const book = books.find(b => b.id === selectedBook);
    if (!book) return alert('Book not found');

    if (type === 'borrow' && book.quantity < amount) {
      return alert('Not enough stock to borrow');
    }

    adjustStock(selectedBook, type === 'add' ? amount : -amount, type);
    setAmount(1);
    setSelectedBook(''); 
  };

  return (
    <div>
      <h2 className="mb-4">Transactions</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5>New Transaction</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Book</label>
              <select className="form-select" value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
                <option value="">-- Select a book --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} (Qty: {b.quantity})</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Amount</label>
              <input type="number" min="1" className="form-control" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-success me-2" onClick={() => handleTransaction('add')}> Add Stock</button>
              <button className="btn btn-warning" onClick={() => handleTransaction('borrow')}> Borrow</button>
            </div>
          </div>
          {!currentUser && (
            <small className="text-muted d-block mt-2">
              You are not logged in — transaction will be logged as "Guest".
            </small>
          )}
        </div>
      </div>

      <h5>Transaction History</h5>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr><th>Date</th><th>Book</th><th>Type</th><th>Amount</th><th>User</th></tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleString()}</td>
                <td>{t.bookTitle}</td>
                <td>
                  <span className={`badge ${t.type === 'add' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {t.type === 'add' ? 'Added' : 'Borrowed'}
                  </span>
                </td>
                <td>{t.amount}</td>
                <td>{t.user}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="5" className="text-center text-muted">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;