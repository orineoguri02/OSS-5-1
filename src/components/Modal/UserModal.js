import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UserModal({ show, handleClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        city: user.city || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        age: '',
        city: ''
      });
    }
  }, [user, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.age || !formData.city) {
      alert('모든 필드를 입력해주세요');
      return;
    }
    onSave({
      ...formData,
      age: parseInt(formData.age),
      id: user?.id
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus-fill"></i>{' '}
          {user ? 'Edit User' : 'Add User'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} id="userForm">
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-person"></i> Name
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-envelope"></i> Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-calendar"></i> Age
            </Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="150"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-geo-alt"></i> City
            </Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;

