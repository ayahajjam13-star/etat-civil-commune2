import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination, Card, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Demandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statutFilter, setStatutFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({
    citoyen_id: '', 
    type_demande: 'شهادة الميلاد', 
    date_demande: new Date().toISOString().split('T')[0], 
    statut: 'En attente'
  });

  useEffect(() => {
    fetchDemandes();
    fetchCitizens();
  }, [currentPage, statutFilter]);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = statutFilter ? `http://127.0.0.1:8001/api/demandes?page=${currentPage}&statut=${statutFilter}` : `http://127.0.0.1:8001/api/demandes?page=${currentPage}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setDemandes(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (err) {
      setError('خطأ في تحميل البيانات');
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCitizens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8001/api/citizens?per_page=100', { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setCitizens(response.data.data.data);
    } catch (err) {
      console.error('Error fetching citizens:', err);
    }
  };

  const exportToExcel = () => {
    const data = demandes.map(d => ({
      'المواطن': `${d.citoyen?.nom} ${d.citoyen?.prenom}`,
      'CIN': d.citoyen?.cin,
      'نوع الطلب': getTypeText(d.type_demande).replace(/[📄📑🏠⚰️💍🪪🛂🏘️💼📝]/g, '').trim(),
      'تاريخ الطلب': new Date(d.date_demande).toLocaleDateString(),
      'الحالة': getStatutText(d.statut)
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Demandes');
    XLSX.writeFile(wb, `demandes_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('تم تصدير البيانات بنجاح');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تحقق من البيانات قبل الإرسال
    const dataToSend = {
      citoyen_id: parseInt(formData.citoyen_id),
      type_demande: formData.type_demande,
      date_demande: formData.date_demande,
      statut: formData.statut
    };
    
    console.log('Sending data:', dataToSend);
    
    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `http://127.0.0.1:8001/api/demandes/${selectedDemande.id}` : 'http://127.0.0.1:8001/api/demandes';
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios({
        method: method,
        url: url,
        data: dataToSend,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setShowModal(false);
        fetchDemandes();
        resetForm();
        toast.success(isEditing ? 'تم التعديل بنجاح' : 'تم الإضافة بنجاح');
      } else {
        toast.error(response.data.message || 'حدث خطأ');
      }
    } catch (err) {
      console.error('Error details:', err.response?.data);
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        toast.error(errorMessages);
      } else {
        toast.error(err.response?.data?.message || 'حدث خطأ');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('❗ هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8001/api/demandes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchDemandes();
        toast.success('تم الحذف بنجاح');
      } catch (err) {
        toast.error('خطأ في الحذف');
      }
    }
  };

  const handleUpdateStatut = async (id, newStatut) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8001/api/demandes/${id}/statut`, 
        { statut: newStatut }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDemandes();
      toast.success(`تم تغيير الحالة إلى ${newStatut === 'Validée' ? 'مقبولة' : newStatut === 'Refusée' ? 'مرفوضة' : 'قيد الانتظار'}`);
    } catch (err) {
      toast.error('حدث خطأ');
    }
  };

  const handleEdit = (demande) => {
    setSelectedDemande(demande);
    setFormData({
      citoyen_id: demande.citoyen.id,
      type_demande: demande.type_demande,
      date_demande: demande.date_demande.split('T')[0],
      statut: demande.statut
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const getStatutBadge = (statut) => {
    const variants = { 'En attente': 'warning', 'Validée': 'success', 'Refusée': 'danger' };
    const texts = { 'En attente': '⏳ قيد الانتظار', 'Validée': '✅ مقبولة', 'Refusée': '❌ مرفوضة' };
    return <Badge bg={variants[statut]} className="badge-status">{texts[statut]}</Badge>;
  };

  const getStatutText = (statut) => {
    const texts = { 'En attente': 'قيد الانتظار', 'Validée': 'مقبولة', 'Refusée': 'مرفوضة' };
    return texts[statut];
  };

  const getTypeText = (type) => {
    const texts = {
      'شهادة الميلاد': '📄 شهادة الميلاد',
      'نسخة كاملة': '📑 نسخة كاملة',
      'شهادة الإقامة': '🏠 شهادة الإقامة',
      'شهادة الوفاة': '⚰️ شهادة الوفاة',
      'شهادة الزواج': '💍 شهادة الزواج',
      'بطاقة التعريف الوطنية': '🪪 بطاقة التعريف الوطنية',
      'جواز السفر': '🛂 جواز السفر',
      'شهادة السكنى': '🏘️ شهادة السكنى',
      'شهادة العمل': '💼 شهادة العمل',
      'شهادة التسجيل': '📝 شهادة التسجيل'
    };
    return texts[type] || type;
  };

  const resetForm = () => {
    setFormData({ 
      citoyen_id: '', 
      type_demande: 'شهادة الميلاد', 
      date_demande: new Date().toISOString().split('T')[0], 
      statut: 'En attente' 
    });
    setIsEditing(false);
    setSelectedDemande(null);
  };

  if (loading && demandes.length === 0) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2>📋 إدارة الطلبات</h2>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={exportToExcel}>
            <FaFileExcel className="me-2" /> Excel
          </Button>
          <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus className="me-2" /> طلب جديد
          </Button>
        </div>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form.Select style={{ width: '250px' }} value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}>
            <option value="">📊 جميع الحالات</option>
            <option value="En attente">⏳ قيد الانتظار</option>
            <option value="Validée">✅ مقبولة</option>
            <option value="Refusée">❌ مرفوضة</option>
          </Form.Select>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>المواطن</th>
                  <th>نوع الطلب</th>
                  <th>تاريخ الطلب</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((demande) => (
                  <tr key={demande.id}>
                    <td>
                      <strong>{demande.citoyen?.nom} {demande.citoyen?.prenom}</strong><br/>
                      <small className="text-muted">CIN: {demande.citoyen?.cin}</small>
                    </td>
                    <td style={{ fontSize: '1rem' }}>{getTypeText(demande.type_demande)}</td>
                    <td>{new Date(demande.date_demande).toLocaleDateString()}</td>
                    <td>{getStatutBadge(demande.statut)}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => { setSelectedDemande(demande); setShowViewModal(true); }}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(demande)}>
                        <FaEdit />
                      </Button>
                      {demande.statut === 'En attente' && (
                        <>
                          <Button variant="success" size="sm" className="me-2" onClick={() => handleUpdateStatut(demande.id, 'Validée')}>
                            <FaCheck />
                          </Button>
                          <Button variant="danger" size="sm" className="me-2" onClick={() => handleUpdateStatut(demande.id, 'Refusée')}>
                            <FaTimes />
                          </Button>
                        </>
                      )}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(demande.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-3">
              <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i+1} active={i+1 === currentPage} onClick={() => setCurrentPage(i+1)}>{i+1}</Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
            </Pagination>
          )}
        </Card.Body>
      </Card>

      {/* Modal Ajout/Modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? '✏️ تعديل طلب' : '➕ طلب جديد'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>المواطن</Form.Label>
              <Form.Select 
                value={formData.citoyen_id} 
                onChange={(e) => setFormData({...formData, citoyen_id: e.target.value})} 
                required
              >
                <option value="">اختر مواطناً</option>
                {citizens.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cin} - {c.nom} {c.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>نوع الطلب</Form.Label>
              <Form.Select 
                value={formData.type_demande} 
                onChange={(e) => setFormData({...formData, type_demande: e.target.value})} 
                required
              >
                <option value="شهادة الميلاد">📄 شهادة الميلاد</option>
                <option value="نسخة كاملة">📑 نسخة كاملة</option>
                <option value="شهادة الإقامة">🏠 شهادة الإقامة</option>
                <option value="شهادة الوفاة">⚰️ شهادة الوفاة</option>
                <option value="شهادة الزواج">💍 شهادة الزواج</option>
                <option value="بطاقة التعريف الوطنية">🪪 بطاقة التعريف الوطنية</option>
                <option value="جواز السفر">🛂 جواز السفر</option>
                <option value="شهادة السكنى">🏘️ شهادة السكنى</option>
                <option value="شهادة العمل">💼 شهادة العمل</option>
                <option value="شهادة التسجيل">📝 شهادة التسجيل</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>تاريخ الطلب</Form.Label>
              <Form.Control 
                type="date" 
                value={formData.date_demande} 
                onChange={(e) => setFormData({...formData, date_demande: e.target.value})} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الحالة</Form.Label>
              <Form.Select 
                value={formData.statut} 
                onChange={(e) => setFormData({...formData, statut: e.target.value})} 
                required
              >
                <option value="En attente">⏳ قيد الانتظار</option>
                <option value="Validée">✅ مقبولة</option>
                <option value="Refusée">❌ مرفوضة</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">حفظ</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Visualisation */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📋 تفاصيل الطلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDemande && (
            <div>
              <h5 className="mb-3">👤 معلومات المواطن</h5>
              <p><strong>الاسم:</strong> {selectedDemande.citoyen?.nom} {selectedDemande.citoyen?.prenom}</p>
              <p><strong>رقم البطاقة:</strong> {selectedDemande.citoyen?.cin}</p>
              <p><strong>الهاتف:</strong> {selectedDemande.citoyen?.telephone}</p>
              <p><strong>العنوان:</strong> {selectedDemande.citoyen?.adresse}</p>
              <hr/>
              <h5 className="mb-3">📄 معلومات الطلب</h5>
              <p><strong>النوع:</strong> {getTypeText(selectedDemande.type_demande)}</p>
              <p><strong>التاريخ:</strong> {new Date(selectedDemande.date_demande).toLocaleDateString()}</p>
              <p><strong>الحالة:</strong> {getStatutBadge(selectedDemande.statut)}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Demandes;