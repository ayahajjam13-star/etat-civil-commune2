import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaSignOutAlt, FaBars, FaMoon, FaSun } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://127.0.0.1:8001/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(darkMode ? '☀️ الوضع الفاتح' : '🌙 الوضع الليلي');
  };

  const menuItems = [
    { path: '/dashboard', label: 'لوحة القيادة', icon: <FaTachometerAlt /> },
    { path: '/citizens', label: 'المواطنون', icon: <FaUsers /> },
    { path: '/demandes', label: 'الطلبات', icon: <FaFileAlt /> },
  ];

  return (
    <div>
      <Navbar expand="lg" className="px-3" style={{ background: '#1e3c72' }}>
        <Button 
          variant="outline-light" 
          size="sm" 
          className="d-md-none me-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </Button>
        <Navbar.Brand href="#" className="fw-bold">
          🏛️ الحالة المدنية
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button 
              variant="outline-light" 
              size="sm" 
              className="me-2"
              onClick={toggleDarkMode}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
            <Navbar.Text className="me-3 text-white">
              👋 مرحبا, {user.name}
            </Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              تسجيل الخروج
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="d-flex">
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: '280px', minHeight: 'calc(100vh - 56px)' }}>
          <div className="p-3">
            <div className="text-center mb-4 pt-3">
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <span style={{ fontSize: '2rem' }}>🏛️</span>
              </div>
              <h5 className="text-white mb-0">الجماعة الترابية</h5>
              <small className="text-white-50">المغرب</small>
            </div>
            
            <Nav className="flex-column">
              {menuItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`mb-2 ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Nav.Link>
              ))}
            </Nav>

            <hr className="bg-white-50 my-3" />
            
            <div className="mt-auto" style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
              <div className="text-center text-white-50 small">
                <small>© 2026</small><br />
                <small>الحالة المدنية</small>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow-1 p-4" style={{ background: '#f8f9fc', minHeight: 'calc(100vh - 56px)' }}>
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>

      <button className="dark-mode-toggle d-md-none" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default Layout;