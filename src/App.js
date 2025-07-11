import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ConfigProvider, Result, Button } from 'antd';
import trTR from 'antd/locale/tr_TR';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import store from './store';
import { restoreAuth } from './store/authSlice';
import Login from './pages/Login';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import ProtectedRoute from './components/ProtectedRoute';
import './i18n';
import './App.css';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('errors.pageNotFound', 'Aradığınız sayfa bulunamadı.')}
      extra={
        <Button type="primary" onClick={() => navigate('/invoices')}>
          {t('common.backToHome', 'Ana Sayfaya Dön')}
        </Button>
      }
    />
  );
};

const AppContent = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  
  const antdLocale = i18n.language === 'tr' ? trTR : enUS;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(restoreAuth({ user, token }));
        console.log('Token localStorage\'tan restore edildi');
      } catch (error) {
        console.error('Token restore hatası:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return (
    <ConfigProvider locale={antdLocale}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/invoices" 
              element={
                <ProtectedRoute>
                  <InvoiceList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/invoices/:id" 
              element={
                <ProtectedRoute>
                  <InvoiceDetail />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
