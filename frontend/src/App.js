import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import Dashboard from './components/Dashboard';
import './App.css';

const API_URL = 'http://localhost:5001/api';

// Simple Fixed Footer Component
const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3 fixed-footer">
      <div className="container">
        <p className="mb-0">© 2025 All Rights Reserved</p>
      </div>
    </footer>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  const testBackendConnection = async () => {
    try {
      console.log('Testing connection to port 5001...');
      const response = await fetch(`${API_URL}/test`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend connected:', data);
        setBackendStatus('connected');
        setError('');
        return true;
      } else {
        throw new Error(`Backend returned: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('disconnected');
      setError(`Cannot connect to backend: ${error.message}`);
      return false;
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      
      const isConnected = await testBackendConnection();
      if (!isConnected) return;

      console.log('Fetching attendance data...');
      const response = await fetch(`${API_URL}/attendance`);
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Database table not ready. Please initialize database first.');
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Attendance data received:', data);
      
      if (Array.isArray(data)) {
        setAttendanceRecords(data);
      } else if (data.data && Array.isArray(data.data)) {
        setAttendanceRecords(data.data);
      } else {
        setAttendanceRecords([]);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const retryConnection = () => {
    setError('');
    fetchAttendance();
  };

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      console.log('Initializing database...');
      
      const response = await fetch(`${API_URL}/init`);
      const result = await response.json();
      
      if (response.ok) {
        setError('Database initialized successfully! Now loading records...');
        setTimeout(() => {
          fetchAttendance();
        }, 1000);
      } else {
        setError(`Database initialization failed: ${result.error}`);
      }
    } catch (error) {
      setError(`Failed to initialize database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* Header/Navigation */}
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Employee Attendance Tracker
            <span className={`badge ms-2 ${backendStatus === 'connected' ? 'bg-success' : 'bg-warning'}`}>
              {backendStatus === 'connected' ? 'Connected' : 'Connecting...'}
            </span>
          </span>
          <div className="navbar-nav flex-row">
            <button 
              className={`btn mx-2 ${currentView === 'dashboard' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`btn mx-2 ${currentView === 'form' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setCurrentView('form')}
            >
              Mark Attendance
            </button>
            <button 
              className={`btn mx-2 ${currentView === 'records' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setCurrentView('records')}
            >
              View Records
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 main-content">
        <div className="container">
          {error && (
            <div className={`alert ${error.includes('✅') ? 'alert-success' : 'alert-warning'}`} role="alert">
              <div className="d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <div>
                  {error.includes('Database table not ready') && (
                    <button 
                      className="btn btn-sm btn-success me-2"
                      onClick={initializeDatabase}
                      disabled={loading}
                    >
                      {loading ? 'Initializing...' : 'Initialize Database'}
                    </button>
                  )}
                  <button 
                    className="btn btn-sm btn-outline-warning"
                    onClick={retryConnection}
                    disabled={loading}
                  >
                    Retry
                  </button>
                </div>
              </div>
              {error.includes('Database table not ready') && (
                <div className="mt-2 small">
                  <strong>Solution:</strong> Click "Initialize Database" to create the required table.
                </div>
              )}
            </div>
          )}
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading attendance records...</p>
            </div>
          ) : currentView === 'dashboard' ? (
            <Dashboard 
              records={attendanceRecords} 
              onRecordsUpdate={fetchAttendance}
            />
          ) : currentView === 'form' ? (
            <AttendanceForm onAttendanceAdded={fetchAttendance} />
          ) : (
            <AttendanceDashboard 
              records={attendanceRecords} 
              onRecordsUpdate={fetchAttendance}
            />
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <Footer />
    </div>
  );
}

export default App;