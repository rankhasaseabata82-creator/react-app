import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LibraryProvider } from './LibraryContext';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import BookManagement from './BookManagement';
import Transactions from './Transactions';
import UserManagement from './UserManagement';

export default function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <Navbar />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </LibraryProvider>
    </BrowserRouter>
  );
}