import React, { useEffect, useCallback } from 'react';
import { 
  Layout, 
  Button, 
  Card, 
  Space, 
  Typography, 
  Descriptions, 
  Row, 
  Col, 
  Tag,
  Alert
} from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import AppHeader from '../components/AppHeader';
import {
  getStatusColor,
  getPaymentStatusColor,
  getCountryName,
  getStatusDisplay,
  getPaymentStatusDisplay
} from '../constants';

const { Content } = Layout;
const { Title, Text } = Typography;

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const { selectedInvoice } = useSelector((state) => state.invoices);

  useEffect(() => {
    if (!selectedInvoice) {
      navigate('/invoices');
    }
  }, [selectedInvoice, navigate]);

  const handleBack = useCallback(() => {
    navigate('/invoices');
  }, [navigate]);

  const getCurrentCountryName = useCallback((countryCode) => {
    return getCountryName(countryCode, i18n.language);
  }, [i18n.language]);

  const getCurrentStatusDisplay = useCallback((status) => {
    return getStatusDisplay(status, i18n.language);
  }, [i18n.language]);

  const getCurrentPaymentStatusDisplay = useCallback((paymentStatus) => {
    return getPaymentStatusDisplay(paymentStatus, i18n.language);
  }, [i18n.language]);

  if (!selectedInvoice) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Content style={{ padding: '24px' }}>
          <Alert 
            message={t('invoices.details.notFound')}
            description={t('invoices.details.notFoundDesc')}
            type="warning"
            showIcon
            action={
              <Button onClick={handleBack}>
                {t('invoices.details.backToList')}
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
                type="default"
              >
                {t('common.back')}
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                {t('invoices.details.title')}
              </Title>
            </Space>
            {selectedInvoice.status && (
              <Tag color={getStatusColor(selectedInvoice.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                {getCurrentStatusDisplay(selectedInvoice.status)}
              </Tag>
            )}
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title={t('invoices.details.basicInfo')} size="small">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={t('invoices.details.fields.invoiceNumber')}>
                    <Text strong>{selectedInvoice.invoiceNumber || '-'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.issueDate')}>
                    {selectedInvoice.issueDate ? dayjs(selectedInvoice.issueDate).format('DD/MM/YYYY') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.documentType')}>
                    {selectedInvoice.documentType === 'OUTGOING' ? t('filters.outgoing') : t('filters.incoming')}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.createdDate')}>
                    {selectedInvoice.createdTime ? dayjs(selectedInvoice.createdTime).format('DD/MM/YYYY HH:mm') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.dueDate')}>
                    {selectedInvoice.dueDate ? dayjs(selectedInvoice.dueDate).format('DD/MM/YYYY') : '-'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title={t('invoices.details.companyInfo')} size="small">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={t('invoices.details.fields.supplierName')}>
                    <Text strong>{selectedInvoice.supplierName || '-'}</Text>
                    {selectedInvoice.supplierVat && (
                      <div><Text type="secondary">{t('invoices.details.fields.vatNo')}: {selectedInvoice.supplierVat}</Text></div>
                    )}
                    {selectedInvoice.supplierId && (
                      <div><Text type="secondary">{t('invoices.details.fields.taxNo')}: {selectedInvoice.supplierId}</Text></div>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.customerName')}>
                    <Text strong>{selectedInvoice.customerName || '-'}</Text>
                    {selectedInvoice.customerVat && (
                      <div><Text type="secondary">{t('invoices.details.fields.vatNo')}: {selectedInvoice.customerVat}</Text></div>
                    )}
                    {selectedInvoice.customerId && (
                      <div><Text type="secondary">{t('invoices.details.fields.customerId')}: {selectedInvoice.customerId}</Text></div>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.countryInfo')}>
                    <div>
                      <Text type="secondary">{t('invoices.details.fields.supplierCountryCode')}: {getCurrentCountryName(selectedInvoice.supplierCountryCode)}</Text>
                    </div>
                    <div>
                      <Text type="secondary">{t('invoices.details.fields.customerCountryCode')}: {getCurrentCountryName(selectedInvoice.customerCountryCode)}</Text>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24}>
              <Card title={t('invoices.details.amounts')} size="small">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                      <Text type="secondary">{t('invoices.details.fields.taxInclusiveAmount')}</Text>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a', marginTop: '8px' }}>
                        {selectedInvoice.taxInclusiveAmount ? 
                          `${selectedInvoice.taxInclusiveAmount.toLocaleString()} ${selectedInvoice.currency || 'EUR'}` 
                          : '-'
                        }
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
                      <Text type="secondary">{t('invoices.details.fields.taxAmount')}</Text>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fa8c16', marginTop: '8px' }}>
                        {(selectedInvoice.taxInclusiveAmount && selectedInvoice.taxExclusiveAmount) ? 
                          `${(selectedInvoice.taxInclusiveAmount - selectedInvoice.taxExclusiveAmount).toLocaleString()} ${selectedInvoice.currency || 'EUR'}` 
                          : '-'
                        }
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f0f5ff', border: '1px solid #91caff' }}>
                      <Text type="secondary">{t('invoices.details.fields.taxExclusiveAmount')}</Text>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1677ff', marginTop: '8px' }}>
                        {selectedInvoice.taxExclusiveAmount ? 
                          `${selectedInvoice.taxExclusiveAmount.toLocaleString()} ${selectedInvoice.currency || 'EUR'}` 
                          : '-'
                        }
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24}>
              <Card title={t('invoices.details.other')} size="small">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={t('invoices.details.fields.type')}>
                    {selectedInvoice.type || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.status')}>
                    <Tag color={getStatusColor(selectedInvoice.status)}>
                      {getCurrentStatusDisplay(selectedInvoice.status)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.fields.currency')}>
                    {selectedInvoice.currency || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('invoices.details.deliveryDate')}>
                    {selectedInvoice.deliveryDate ? dayjs(selectedInvoice.deliveryDate).format('DD/MM/YYYY') : '-'}
                  </Descriptions.Item>
                  {selectedInvoice.errorMessage && (
                    <Descriptions.Item label={t('invoices.details.errorMessage')}>
                      <Text type="danger">{selectedInvoice.errorMessage}</Text>
                    </Descriptions.Item>
                  )}
                  {selectedInvoice.paymentDetails && (
                    <Descriptions.Item label={t('invoices.details.paymentInfo')}>
                      <div>
                        <Text>{t('invoices.details.fields.paymentStatus')}: </Text>
                        <Tag color={getPaymentStatusColor(selectedInvoice.paymentDetails.paymentStatus)}>
                          {getCurrentPaymentStatusDisplay(selectedInvoice.paymentDetails.paymentStatus)}
                        </Tag>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Text>{t('invoices.details.paidAmount')}: {selectedInvoice.paymentDetails.paidAmount} {selectedInvoice.currency}</Text>
                      </div>
                      <div>
                        <Text>{t('invoices.details.remainingAmount')}: {selectedInvoice.paymentDetails.remainingAmount} {selectedInvoice.currency}</Text>
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};

export default InvoiceDetail; 