import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext();

const makeId = () =>
  window.crypto?.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString() + Math.random().toString(16).slice(2);

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => load('books', []));
  const [users, setUsers] = useState(() =>
    load('users', [
      { id: 'ADMIN01', name: 'Admin', role: 'admin', password: 'admin123' },
    ])
  );
  const [transactions, setTransactions] = useState(() => load('transactions', []));
  const [currentUser, setCurrentUser] = useState(() => load('currentUser', null));

  useEffect(() => { localStorage.setItem('books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [currentUser]);

  
  const addBook = (book) =>
    setBooks(prev => [...prev, { ...book, id: makeId() }]);

  const updateBook = (id, updated) =>
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));

  const deleteBook = (id) =>
    setBooks(prev => prev.filter(b => b.id !== id));

  const adjustStock = (bookId, amount, type) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return; 

    setBooks(prev =>
      prev.map(b =>
        b.id === bookId ? { ...b, quantity: Math.max(0, b.quantity + amount) } : b
      )
    );

    setTransactions(prev => [
      {
        id: makeId(),
        bookId,
        bookTitle: book.title,
        type, 
        amount: Math.abs(amount), 
        date: new Date().toISOString(),
        user: currentUser?.name || 'Guest',
      },
      ...prev,
    ]);
  };

  const addUser = (user) => {
    if (users.some(u => u.id === user.id)) return false; // duplicate ID
    setUsers(prev => [...prev, { ...user }]);
    return true;
  };

  const updateUser = (id, updated) =>
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));

  const deleteUser = (id) =>
    setUsers(prev => prev.filter(u => u.id !== id));

  const login = (membershipId, password) => {
    const found = users.find(u => u.id === membershipId && u.password === password);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  return (
    <LibraryContext.Provider
      value={{
        books, users, transactions, currentUser,
        addBook, updateBook, deleteBook, adjustStock,
        addUser, updateUser, deleteUser, login, logout,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>');
  return ctx;
};
