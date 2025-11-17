import React from 'react';
import { Database } from 'lucide-react';
import './Admin_Database.css';

const Admin_Database = () => {
  return (
    <main className="database-page" role="main">
      <div className="database-page-inner">
        <div className="database-header-section">
          <Database size={40} className="header-icon" />
          <h1>Database Management</h1>
          <p>This is a placeholder for the database management page.</p>
        </div>
      </div>
    </main>
  );
};

export default Admin_Database;