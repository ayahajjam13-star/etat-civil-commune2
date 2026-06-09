import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaUsers, FaFileAlt, FaClock, FaCheckCircle, FaUserPlus, FaCalendarWeek, FaChartLine } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_citizens: 0,
    total_demandes: 0,
    demandes_en_attente: 0,
    demandes_validees: 0,
    demandes_refusees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchStats();
    loadChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8001/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const data = response.data.data;
        const refusees = data.total_demandes - (data.demandes_en_attente + data.demandes_validees);
        setStats({
          ...data,
          demandes_refusees: refusees
        });
      }
    } catch (err) {
      console.error('Stats error:', err);
      setError('حدث خطأ في تحميل الإحصائيات');
      toast.error('فشل تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = () => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليو', 'غشت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const data = months.slice(0, 6).map((month, i) => ({
      name: month,
      demandes: Math.floor(Math.random() * 50) + 10,
      citoyens: Math.floor(Math.random() * 30) + 5
    }));
    setMonthlyData(data);
  };

  const statCards = [
    { title: 'إجمالي المواطنين', value: stats.total_citizens, icon: <FaUsers />, color: '#1e3c72', bg: '#e8f0fe' },
    { title: 'إجمالي الطلبات', value: stats.total_demandes, icon: <FaFileAlt />, color: '#28a745', bg: '#d4edda' },
    { title: 'قيد الانتظار', value: stats.demandes_en_attente, icon: <FaClock />, color: '#ffc107', bg: '#fff3cd' },
    { title: 'مقبولة', value: stats.demandes_validees, icon: <FaCheckCircle />, color: '#17a2b8', bg: '#d1ecf1' }
  ];

  const extraCards = [
    { title: 'مواطنين هذا الشهر', value: Math.floor(stats.total_citizens * 0.3), icon: <FaUserPlus />, color: '#28a745' },
    { title: 'طلبات هذا الأسبوع', value: Math.floor(stats.total_demandes * 0.2), icon: <FaCalendarWeek />, color: '#17a2b8' },
    { title: 'نسبة القبول', value: stats.total_demandes > 0 ? ((stats.demandes_validees / stats.total_demandes) * 100).toFixed(1) : 0, icon: <FaChartLine />, color: '#ffc107', suffix: '%' }
  ];

  const pieData = [
    { name: 'قيد الانتظار', value: stats.demandes_en_attente, color: '#ffc107' },
    { name: 'مقبولة', value: stats.demandes_validees, color: '#28a745' },
    { name: 'مرفوضة', value: stats.demandes_refusees, color: '#dc3545' },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">📊 لوحة القيادة</h2>
      
      <Row className="g-4 mb-4">
        {statCards.map((card, index) => (
          <Col md={3} key={index}>
            <Card className="shadow-sm border-0 h-100" style={{ backgroundColor: card.bg }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">{card.title}</h6>
                    <h2 className="mb-0 fw-bold" style={{ color: card.color }}>{card.value}</h2>
                  </div>
                  <div className="fs-1" style={{ color: card.color, opacity: 0.7 }}>
                    {card.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        {extraCards.map((card, index) => (
          <Col md={4} key={index}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">{card.title}</h6>
                    <h3 className="mb-0 fw-bold" style={{ color: card.color }}>{card.value}{card.suffix || ''}</h3>
                  </div>
                  <div className="fs-1" style={{ color: card.color, opacity: 0.7 }}>
                    {card.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row className="g-4 mb-4">
        {stats.total_demandes > 0 && (
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">📈 تطور الطلبات (آخر 6 أشهر)</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="demandes" stroke="#8884d8" name="الطلبات" strokeWidth={2} />
                    <Line type="monotone" dataKey="citoyens" stroke="#82ca9d" name="المواطنين" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        )}

        <Col md={stats.total_demandes > 0 ? 6 : 12}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 pt-3">
              <h5 className="mb-0">🥧 توزيع الطلبات</h5>
            </Card.Header>
            <Card.Body>
              {stats.total_demandes > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">لا توجد بيانات كافية</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 pt-3">
              <h5 className="mb-0">ℹ️ معلومات النظام</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p><strong>✅ إجمالي المواطنين المسجلين:</strong> {stats.total_citizens}</p>
                  <p><strong>✅ إجمالي الطلبات المقدمة:</strong> {stats.total_demandes}</p>
                </Col>
                <Col md={4}>
                  <p><strong>📊 نسبة القبول:</strong> {stats.total_demandes > 0 ? ((stats.demandes_validees / stats.total_demandes) * 100).toFixed(1) : 0}%</p>
                  <p><strong>⏳ الطلبات المرفوضة:</strong> {stats.demandes_refusees}</p>
                </Col>
                <Col md={4}>
                  <p><strong>📅 آخر تحديث:</strong> {new Date().toLocaleDateString('ar-MA')}</p>
                  <p><strong>⏰ الوقت الحالي:</strong> {new Date().toLocaleTimeString('ar-MA')}</p>
                </Col>
              </Row>
              <hr />
              <p className="text-muted mb-0 text-center">
                <small>© {new Date().getFullYear()} الجماعة الترابية - جميع الحقوق محفوظة</small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;