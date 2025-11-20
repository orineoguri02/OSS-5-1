import React, { useState, useEffect } from 'react';
import { Alert, Button, Table, Spinner } from 'react-bootstrap';
import UserModal from '../Modal/UserModal';

const API_URL = "https://6916b719a7a34288a27e1f78.mockapi.io/users";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        showMessage('Failed to load users', 'danger');
      }
    } catch (error) {
      showMessage('Failed to load users', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData) => {
    try {
      const isEditMode = !!userData.id;
      const url = isEditMode ? `${API_URL}/${userData.id}` : API_URL;
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          age: userData.age,
          city: userData.city
        })
      });

      if (response.ok) {
        showMessage(`데이터 ${isEditMode ? '수정' : '추가'} 성공!`, 'success');
        setShowModal(false);
        getUsers();
      } else {
        showMessage('Operation failed', 'danger');
      }
    } catch (error) {
      showMessage('Operation failed', 'danger');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('유저 데이터를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage('유저 데이터 삭제 성공!', 'success');
        getUsers();
      } else {
        showMessage('유저 데이터 삭제 실패!', 'danger');
      }
    } catch (error) {
      showMessage('유저 데이터 삭제 실패!', 'danger');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleShowModal = (user = null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getIcon = (type) => {
    const icons = {
      success: 'check-circle-fill',
      danger: 'exclamation-triangle-fill',
      warning: 'exclamation-circle-fill'
    };
    return icons[type] || 'info-circle-fill';
  };

  return (
    <div className="main-card">
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
          <i className={`bi bi-${getIcon(message.type)}`}></i> {message.text}
        </Alert>
      )}

      <div className="action-bar">
        <h3 className="mb-0">User List</h3>
        <div>
          <Button variant="secondary" onClick={getUsers} className="me-2">
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </Button>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="bi bi-person-plus-fill"></i> Add User
          </Button>
        </div>
      </div>

      <div id="contents">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">데이터를 불러오는 중...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
            <h4>No users found</h4>
          </div>
        ) : (
          <Table hover responsive>
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.id}</strong></td>
                  <td><strong>{user.name}</strong></td>
                  <td>
                    <i className="bi bi-envelope"></i> {user.email}
                  </td>
                  <td>{user.age}</td>
                  <td>
                    <i className="bi bi-geo-alt-fill"></i> {user.city}
                  </td>
                  <td>
                    <button 
                      className="btn-action" 
                      onClick={() => handleShowModal(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-action" 
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <UserModal
        show={showModal}
        handleClose={handleCloseModal}
        user={selectedUser}
        onSave={saveUser}
      />
    </div>
  );
}

export default UserManagement;

