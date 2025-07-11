import React, { useCallback } from 'react';
import { Layout, Button, Select, Space, Typography, Dropdown } from 'antd';
import { LogoutOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/authSlice';

const { Header } = Layout;
const { Text } = Typography;
const { Option } = Select;

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleLanguageChange = useCallback((language) => {
    i18n.changeLanguage(language);
  }, [i18n]);

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('common.logout'),
      onClick: handleLogout,
    },
  ];

  return (
    <Header 
      style={{ 
        background: '#fff', 
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <Typography.Title 
          level={3} 
          style={{ 
            margin: 0, 
            color: '#1890ff',
            fontWeight: 'bold'
          }}
        >
          Docnova
        </Typography.Title>
      </div>
      
      <Space size="large">
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          style={{ width: 120 }}
          suffixIcon={<GlobalOutlined />}
        >
          <Option value="tr">Türkçe</Option>
          <Option value="en">English</Option>
        </Select>
        
        <Space>
          <UserOutlined style={{ color: '#666' }} />
          <Text style={{ color: '#666' }}>
            {user?.email || 'User'}
          </Text>
        </Space>
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" icon={<LogoutOutlined />}>
            {t('common.logout')}
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader; 