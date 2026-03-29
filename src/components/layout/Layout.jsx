import React from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export default function Layout({ children, title = 'AnimeX' }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header title={title} />
        <main className="layout-content page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
