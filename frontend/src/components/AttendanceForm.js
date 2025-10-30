import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

// ✅ USING PORT 5001 - SAME AS YOUR BACKEND
const API_URL = 'http://localhost:5001/api';

const AttendanceForm = ({ onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('❌ Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('💾 Saving to port 5001:', formData);
      
      const response = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Attendance recorded for ${formData.employeeName}!`);
        setFormData({
          employeeName: '',
          employeeID: '',
          date: new Date().toISOString().split('T')[0],
          status: 'Present'
        });
        onAttendanceAdded();
      } else {
        setMessage(`❌ Error: ${result.error || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setMessage('❌ Cannot connect to backend on port 5001');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">Mark Attendance</h4>
      </Card.Header>
      <Card.Body>
        {message && (
          <Alert variant={message.includes('✅') ? 'success' : 'danger'}>
            {message}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Employee Name *</Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Employee ID *</Form.Label>
            <Form.Control
              type="text"
              name="employeeID"
              value={formData.employeeID}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Form.Select>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? '🔄 Saving to Database...' : ' Save to Database'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AttendanceForm;