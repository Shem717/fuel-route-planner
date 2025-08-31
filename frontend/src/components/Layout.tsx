import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="nav-item">Dashboard</li>
            <li className="nav-item">Courses</li>
            <li className="nav-item">Students</li>
          </ul>
        </nav>
      </aside>
      <header className="top-bar">
        <h1>Fuel Route Planner</h1>
      </header>
      <main className="content">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
