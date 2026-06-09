import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputGroup, Spinner, Alert, Pagination, Card, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaFileExcel, FaFilePdf, FaUpload, FaImage, FaFile, FaTrashAlt } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const Citizens = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [documentsList, setDocumentsList] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const [formData, setFormData] = useState({
    cin: '', nom: '', prenom: '', date_naissance: '', lieu_naissance: '', adresse: '', telephone: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    },
    maxFiles: 1
  });

  useEffect(() => {
    fetchCitizens();
  }, [currentPage, searchTerm]);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8001/api/citizens?page=${currentPage}&search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCitizens(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (err) {
      setError('خطأ في تحميل البيانات');
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const addDocument = () => {
    const docName = prompt('أدخل اسم الوثيقة (مثل: شهادة ميلاد, جواز سفر)');
    if (docName) {
      setDocumentsList([...documentsList, { name: docName, url: '' }]);
    }
  };

  const removeDocument = (index) => {
    const newList = [...documentsList];
    newList.splice(index, 1);
    setDocumentsList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('cin', formData.cin);
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('prenom', formData.prenom);
    formDataToSend.append('date_naissance', formData.date_naissance);
    formDataToSend.append('lieu_naissance', formData.lieu_naissance);
    formDataToSend.append('adresse', formData.adresse);
    formDataToSend.append('telephone', formData.telephone);
    formDataToSend.append('documents', JSON.stringify(documentsList));
    
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    }
    
    if (isEditing) {
      formDataToSend.append('_method', 'PUT');
    }
    
    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `http://127.0.0.1:8001/api/citizens/${selectedCitizen.id}` : 'http://127.0.0.1:8001/api/citizens';
      
      await axios({
        method: isEditing ? 'post' : 'post',
        url: url,
        data: formDataToSend,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setShowModal(false);
      fetchCitizens();
      resetForm();
      toast.success(isEditing ? 'تم التعديل بنجاح' : 'تم الإضافة بنجاح');
    } catch (err) {
      toast.error('حدث خطأ');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`❗ هل أنت متأكد من حذف ${name}؟`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8001/api/citizens/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCitizens();
        toast.success('تم الحذف بنجاح');
      } catch (err) {
        toast.error('خطأ في الحذف');
      }
    }
  };

  const handleEdit = (citizen) => {
    setSelectedCitizen(citizen);
    setFormData({
      cin: citizen.cin,
      nom: citizen.nom,
      prenom: citizen.prenom,
      date_naissance: citizen.date_naissance.split('T')[0],
      lieu_naissance: citizen.lieu_naissance,
      adresse: citizen.adresse,
      telephone: citizen.telephone
    });
    setDocumentsList(citizen.documents || []);
    setPhotoPreview(citizen.photo ? `http://127.0.0.1:8001/${citizen.photo}` : '');
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ cin: '', nom: '', prenom: '', date_naissance: '', lieu_naissance: '', adresse: '', telephone: '' });
    setDocumentsList([]);
    setPhotoFile(null);
    setPhotoPreview('');
    setIsEditing(false);
    setSelectedCitizen(null);
  };

  const exportToExcel = () => {
    const data = citizens.map(c => ({
      'CIN': c.cin,
      'الاسم': c.nom,
      'النسب': c.prenom,
      'تاريخ الميلاد': new Date(c.date_naissance).toLocaleDateString(),
      'مكان الميلاد': c.lieu_naissance,
      'الهاتف': c.telephone,
      'العنوان': c.adresse
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Citoyens');
    XLSX.writeFile(wb, `citoyens_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('تم تصدير البيانات بنجاح');
  };

  const exportToPDF = (citizen) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('🏛️ بطاقة تعريف المواطن', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`رقم البطاقة: ${citizen.cin}`, 20, 50);
    doc.text(`الاسم: ${citizen.nom} ${citizen.prenom}`, 20, 65);
    doc.text(`تاريخ الميلاد: ${new Date(citizen.date_naissance).toLocaleDateString()}`, 20, 80);
    doc.text(`مكان الميلاد: ${citizen.lieu_naissance}`, 20, 95);
    doc.text(`الهاتف: ${citizen.telephone}`, 20, 110);
    doc.text(`العنوان: ${citizen.adresse}`, 20, 125);
    doc.text(`تاريخ التسجيل: ${new Date(citizen.created_at).toLocaleDateString()}`, 20, 140);
    doc.save(`citoyen_${citizen.cin}.pdf`);
    toast.success('تم تصدير البطاقة بنجاح');
  };

  if (loading && citizens.length === 0) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2>👥 إدارة المواطنين</h2>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={exportToExcel}>
            <FaFileExcel className="me-2" /> Excel
          </Button>
          <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus className="me-2" /> مواطن جديد
          </Button>
        </div>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control placeholder="🔍 بحث بالاسم أو اللقب أو رقم البطاقة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>رقم البطاقة</th>
                  <th>الاسم الكامل</th>
                  <th>تاريخ الميلاد</th>
                  <th>مكان الميلاد</th>
                  <th>الهاتف</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map((citizen) => (
                  <tr key={citizen.id}>
                    <td>
                      {citizen.photo ? (
                        <img src={`http://127.0.0.1:8001/${citizen.photo}`} alt="photo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaImage />
                        </div>
                      )}
                    </td>
                    <td>{citizen.cin}</td>
                    <td>{citizen.nom} {citizen.prenom}</td>
                    <td>{new Date(citizen.date_naissance).toLocaleDateString()}</td>
                    <td>{citizen.lieu_naissance}</td>
                    <td>{citizen.telephone}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => { setSelectedCitizen(citizen); setShowViewModal(true); }}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(citizen)}>
                        <FaEdit />
                      </Button>
                      <Button variant="secondary" size="sm" className="me-2" onClick={() => exportToPDF(citizen)}>
                        <FaFilePdf />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(citizen.id, citizen.nom)}>
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
          <Modal.Title>{isEditing ? '✏️ تعديل مواطن' : '➕ إضافة مواطن جديد'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم البطاقة</Form.Label>
                  <Form.Control type="text" value={formData.cin} onChange={(e) => setFormData({...formData, cin: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم</Form.Label>
                  <Form.Control type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>النسب</Form.Label>
                  <Form.Control type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>تاريخ الميلاد</Form.Label>
                  <Form.Control type="date" value={formData.date_naissance} onChange={(e) => setFormData({...formData, date_naissance: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>مكان الميلاد</Form.Label>
                  <Form.Control type="text" value={formData.lieu_naissance} onChange={(e) => setFormData({...formData, lieu_naissance: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>الهاتف</Form.Label>
                  <Form.Control type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>العنوان</Form.Label>
                  <Form.Control as="textarea" rows={2} value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} required />
                </Form.Group>
              </Col>
              
              {/* Upload Photo */}
              <Col md={12}>
                <Form.Label className="mb-2">الصورة الشخصية</Form.Label>
                <div {...getRootProps()} style={{ border: '2px dashed #ccc', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px' }}>
                  <input {...getInputProps()} />
                  {photoPreview ? (
                    <img src={photoPreview} alt="aperçu" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '10px' }} />
                  ) : (
                    <div><FaUpload size={30} /><p>اسحب الصورة أو اضغط للاختيار</p></div>
                  )}
                </div>
              </Col>

              {/* Documents */}
              <Col md={12}>
                <Form.Label className="mb-2">الوثائق المرفقة</Form.Label>
                <Button variant="outline-primary" size="sm" onClick={addDocument} className="mb-2">
                  <FaPlus /> إضافة وثيقة
                </Button>
                {documentsList.map((doc, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded">
                    <span><FaFile className="me-2" />{doc.name}</span>
                    <Button variant="link" size="sm" onClick={() => removeDocument(index)}><FaTrashAlt color="red" /></Button>
                  </div>
                ))}
              </Col>
            </Row>
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
          <Modal.Title>📋 معلومات المواطن</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCitizen && (
            <div>
              <div className="text-center mb-3">
                {selectedCitizen.photo ? (
                  <img src={`http://127.0.0.1:8001/${selectedCitizen.photo}`} alt="photo" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                    <FaImage size={50} />
                  </div>
                )}
              </div>
              <p><strong>رقم البطاقة:</strong> {selectedCitizen.cin}</p>
              <p><strong>الاسم:</strong> {selectedCitizen.nom}</p>
              <p><strong>النسب:</strong> {selectedCitizen.prenom}</p>
              <p><strong>تاريخ الميلاد:</strong> {new Date(selectedCitizen.date_naissance).toLocaleDateString()}</p>
              <p><strong>مكان الميلاد:</strong> {selectedCitizen.lieu_naissance}</p>
              <p><strong>الهاتف:</strong> {selectedCitizen.telephone}</p>
              <p><strong>العنوان:</strong> {selectedCitizen.adresse}</p>
              
              {selectedCitizen.documents && selectedCitizen.documents.length > 0 && (
                <>
                  <hr />
                  <h6>📄 الوثائق المرفقة:</h6>
                  <ul>
                    {selectedCitizen.documents.map((doc, idx) => (
                      <li key={idx}>{doc.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Citizens;