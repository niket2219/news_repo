import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEditor from './pages/ArticleEditor';

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LangProvider>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'sans-serif', fontSize: 14 } }} />
          <AppRoutes />
        </LangProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes with Header/Footer */}
      <Route path="/" element={<WithLayout><Home /></WithLayout>} />
      <Route path="/article/:id" element={<WithLayout><ArticlePage /></WithLayout>} />
      <Route path="/category/:category" element={<WithLayout><CategoryPage /></WithLayout>} />

      {/* Admin routes - no public header */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/article/new" element={<ArticleEditor />} />
      <Route path="/admin/article/edit/:id" element={<ArticleEditor />} />
    </Routes>
  );
}

function WithLayout({ children }) {
  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}

export default App;
