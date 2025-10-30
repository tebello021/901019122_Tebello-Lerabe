import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Dashboard = ({ records, onRecordsUpdate }) => {
  // Calculate statistics
  const totalRecords = records.length;
  const presentCount = records.filter(record => record.status === 'Present').length;
  const absentCount = records.filter(record => record.status === 'Absent').length;
  
  // Get unique employees
  const uniqueEmployees = [...new Set(records.map(record => record.employeeName))];
  
  // Calculate attendance rate
  const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Attendance Dashboard</h1>
          <p className="text-muted mb-0">Real-time employee attendance overview and statistics</p>
        </div>
        <div className="text-muted">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <Row>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-people-fill fs-1"></i>
              </div>
              <h3 className="text-primary">{totalRecords}</h3>
              <Card.Title>Total Records</Card.Title>
              <small className="text-muted">All attendance entries</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-check-circle-fill fs-1"></i>
              </div>
              <h3 className="text-success">{presentCount}</h3>
              <Card.Title>Present</Card.Title>
              <small className="text-muted">Employees present</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <i className="bi bi-x-circle-fill fs-1"></i>
              </div>
              <h3 className="text-danger">{absentCount}</h3>
              <Card.Title>Absent</Card.Title>
              <small className="text-muted">Employees absent</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-graph-up fs-1"></i>
              </div>
              <h3 className="text-info">{attendanceRate}%</h3>
              <Card.Title>Attendance Rate</Card.Title>
              <small className="text-muted">Overall presence rate</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Employee Summary */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Employee Summary</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <h3 className="text-primary">{uniqueEmployees.length}</h3>
              <p className="text-muted mb-0">Unique Employees</p>
              <div className="mt-3">
                <small className="text-muted">
                  Tracking attendance for {uniqueEmployees.length} employees
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Status Overview</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="row text-center">
                <div className="col-6">
                  <h4 className="text-success">{presentCount}</h4>
                  <p className="text-muted mb-0">Present</p>
                </div>
                <div className="col-6">
                  <h4 className="text-danger">{absentCount}</h4>
                  <p className="text-muted mb-0">Absent</p>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  {attendanceRate}% overall attendance rate
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;