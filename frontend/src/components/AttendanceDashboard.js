import React, { useState } from 'react';
import { Table, Card, Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';

const API_URL = 'http://localhost:5001/api';

const AttendanceDashboard = ({ records, onRecordsUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeID?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !filterDate || record.date === filterDate;
    return matchesSearch && matchesDate;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`${API_URL}/attendance/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Record deleted successfully');
        onRecordsUpdate();
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      alert('Network error during deletion');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterDate('');
  };

  // Calculate statistics for the header
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(record => record.status === 'Present').length;
  const absentCount = filteredRecords.filter(record => record.status === 'Absent').length;

  return (
    <div>
      {/* Header with Stats */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Attendance Records</h1>
          <p className="text-muted mb-0">Manage and view all employee attendance records</p>
        </div>
        <div className="text-end">
          <div className="d-flex gap-3">
            <div className="text-center">
              <Badge bg="primary" className="fs-6">{totalRecords}</Badge>
              <div className="small text-muted">Total</div>
            </div>
            <div className="text-center">
              <Badge bg="success" className="fs-6">{presentCount}</Badge>
              <div className="small text-muted">Present</div>
            </div>
            <div className="text-center">
              <Badge bg="danger" className="fs-6">{absentCount}</Badge>
              <div className="small text-muted">Absent</div>
            </div>
          </div>
        </div>
      </div>

      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Attendance Records</h4>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <Row className="mb-4">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Search by Name or ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Filter by Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Records Table */}
          {filteredRecords.length === 0 ? (
            <Alert variant="info" className="text-center">
              {records.length === 0 
                ? "No attendance records found in database." 
                : "No records match your search criteria."}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Recorded At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <strong>{record.employeeName}</strong>
                      </td>
                      <td>
                        <code>{record.employeeID}</code>
                      </td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={record.status === 'Present' ? 'success' : 'danger'}>
                          {record.status}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          {record.created_at ? 
                            new Date(record.created_at).toLocaleString() : 
                            'N/A'
                          }
                        </small>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-3 text-muted">
            Showing {filteredRecords.length} of {records.length} records
            {filterDate && ` • Filtered by date: ${filterDate}`}
            {searchQuery && ` • Searching for: "${searchQuery}"`}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;