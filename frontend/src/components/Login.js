import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/login', {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success(`مرحباً ${response.data.user.name} 👋`);
        navigate('/dashboard');
      } else {
        setError('بيانات غير صحيحة');
        toast.error('فشل تسجيل الدخول');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'خطأ في تسجيل الدخول');
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <Row>
        <Col md={12}>
          <Card className="shadow-lg border-0 rounded-4" style={{ width: '420px' }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="mb-2">🏛️ الحالة المدنية</h2>
                <p className="text-muted">الجماعة الترابية - المغرب</p>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>📧 البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="admin@commune.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>🔒 كلمة المرور</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
                  {loading ? '⏳ جاري...' : '🚪 تسجيل الدخول'}
                </Button>
                <div className="text-center mt-4">
                  <small className="text-muted">
                    📝 compte de test: <strong>admin@commune.ma</strong> / <strong>admin123</strong>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;