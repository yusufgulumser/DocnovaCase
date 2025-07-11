import React, { useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Alert, Row, Col, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginAsync, clearError } from '../store/authSlice';

const { Title } = Typography;
const { Option } = Select;

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/invoices');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onFinish = useCallback((values) => {
    dispatch(loginAsync(values));
  }, [dispatch]);

  const handleLanguageChange = useCallback((language) => {
    i18n.changeLanguage(language);
  }, [i18n]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: '400px' }}>
        <Col span={24}>
          <Card
            style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
                Docnova
              </Title>
              <Title level={4} style={{ color: '#666', fontWeight: 'normal' }}>
                {t('login.title')}
              </Title>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Select
                value={i18n.language}
                onChange={handleLanguageChange}
                style={{ width: 120 }}
                suffixIcon={<GlobalOutlined />}
              >
                <Option value="tr">Türkçe</Option>
                <Option value="en">English</Option>
              </Select>
            </div>

            {error && (
              <Alert
                message={t('login.loginError')}
                type="error"
                style={{ marginBottom: '20px' }}
                closable
                onClose={() => dispatch(clearError())}
              />
            )}

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              initialValues={{
                email: 'devmelauser@yopmail.com',
                password: 'Work123???'
              }}
            >
              <Form.Item
                name="email"
                label={t('login.email')}
                rules={[
                  {
                    required: true,
                    message: t('login.emailPlaceholder'),
                  },
                  {
                    type: 'email',
                    message: 'Geçerli bir e-posta adresi girin',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  placeholder={t('login.emailPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t('login.password')}
                rules={[
                  {
                    required: true,
                    message: t('login.passwordPlaceholder'),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                  placeholder={t('login.passwordPlaceholder')}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: '45px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {loading ? t('login.loading') : t('login.loginButton')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login; 