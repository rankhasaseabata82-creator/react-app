export default function BookCard({ book }) {
  const lowStock = book.quantity < 2;
  return (
    <div className={`card mb-3 ${lowStock ? 'border-danger' : ''}`}>
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
        <p className="card-text mb-1"><strong>Genre:</strong> {book.genre}</p>
        <p className="card-text mb-1"><strong>ISBN:</strong> {book.isbn}</p>
        <p className={`card-text fw-bold ${lowStock ? 'text-danger' : 'text-success'}`}>
          In stock: {book.quantity} {lowStock && '⚠️ LOW'}
        </p>
      </div>
    </div>
  );
}