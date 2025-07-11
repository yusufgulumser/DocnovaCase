import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Layout, 
  Table, 
  Button, 
  Card, 
  Space, 
  Alert, 
  DatePicker, 
  Select,
  Form,
  Row,
  Col,
  Typography,
  Tag,
  Divider
} from 'antd';
import { 
  EyeOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  ClearOutlined,
  FilterOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { searchInvoicesAsync, setSelectedInvoice, clearError } from '../store/invoiceSlice';
import AppHeader from '../components/AppHeader';
import {
  COUNTRY_OPTIONS,
  CURRENCIES,
  INVOICE_TYPES,
  PAYMENT_STATUSES,
  INVOICE_STATUSES,
  getStatusColor,
  getPaymentStatusColor,
  getCountryName,
  getStatusDisplay,
  getPaymentStatusDisplay
} from '../constants';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);
  const { invoiceList, loading, error, pagination } = useSelector((state) => state.invoices);

  const initialSearchParams = useMemo(() => ({
    companyId: "01c880ca-46b5-4699-a477-616b84770071",
    documentType: "OUTGOING",
    endDate: dayjs().toISOString(),
    page: 0,
    size: 20,
    startDate: dayjs().subtract(30, 'day').toISOString(),
    referenceDocument: "",
    type: null,
    status: null,
    paymentStatus: null,
    isDeleted: false
  }), []);

  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = useCallback((params) => {
    dispatch(searchInvoicesAsync({ 
      searchParams: params, 
      token 
    }));
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      handleSearch(initialSearchParams);
    }
  }, [token, handleSearch, initialSearchParams]);

  const getCurrentStatusDisplay = useCallback((status) => {
    return getStatusDisplay(status, i18n.language);
  }, [i18n.language]);

  const getCurrentPaymentStatusDisplay = useCallback((paymentStatus) => {
    return getPaymentStatusDisplay(paymentStatus, i18n.language);
  }, [i18n.language]);

  const getCurrentCountryName = useCallback((countryCode) => {
    return getCountryName(countryCode, i18n.language);
  }, [i18n.language]);

  const handleFormSubmit = useCallback((values) => {
    const newParams = {
      ...searchParams,
      startDate: values.dateRange ? values.dateRange[0].toISOString() : searchParams.startDate,
      endDate: values.dateRange ? values.dateRange[1].toISOString() : searchParams.endDate,
      documentType: values.documentType || searchParams.documentType,
      status: values.status || null,
      type: values.type || null,
      paymentStatus: values.paymentStatus || null,
      page: 0
    };

    const filters = {};
    if (values.dateRange) filters.dateRange = values.dateRange;
    if (values.documentType && values.documentType !== 'OUTGOING') filters.documentType = values.documentType;
    if (values.status) filters.status = values.status;
    if (values.customerCountryCode) filters.customerCountryCode = values.customerCountryCode;
    if (values.supplierCountryCode) filters.supplierCountryCode = values.supplierCountryCode;
    if (values.currency) filters.currency = values.currency;
    if (values.type) filters.type = values.type;
    if (values.paymentStatus) filters.paymentStatus = values.paymentStatus;

    setActiveFilters(filters);
    setSearchParams(newParams);
    handleSearch(newParams);
  }, [searchParams, handleSearch]);

  const handleClearFilters = useCallback(() => {
    form.resetFields();
    setActiveFilters({});
    setSearchParams(initialSearchParams);
    handleSearch(initialSearchParams);
  }, [form, initialSearchParams, handleSearch]);

  const handleTableChange = useCallback((paginationInfo) => {
    const newParams = {
      ...searchParams,
      page: paginationInfo.current - 1,
      size: paginationInfo.pageSize
    };
    setSearchParams(newParams);
    handleSearch(newParams);
  }, [searchParams, handleSearch]);

  const handleViewDetail = useCallback((record) => {
    dispatch(setSelectedInvoice(record));
    navigate(`/invoices/${record.id}`);
  }, [dispatch, navigate]);

  const getActiveFilterCount = useMemo(() => {
    return Object.keys(activeFilters).length;
  }, [activeFilters]);

  const columns = [
    {
      title: t('invoices.documentNumber'),
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text) => text || '-',
    },
    {
      title: t('invoices.date'),
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: t('invoices.company'),
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text) => text || '-',
    },
    {
      title: t('invoices.amount'),
      dataIndex: 'taxInclusiveAmount',
      key: 'taxInclusiveAmount',
      render: (amount, record) => {
        if (!amount) return '-';
        const currency = record.currency || 'EUR';
        return `${amount.toLocaleString()} ${currency}`;
      },
    },
    {
      title: t('invoices.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return status ? 
          <Tag color={getStatusColor(status)}>{getCurrentStatusDisplay(status)}</Tag> 
          : '-';
      },
    },
    {
      title: t('invoices.customerCountry'),
      dataIndex: 'customerCountryCode',
      key: 'customerCountryCode',
      render: (countryCode) => countryCode ? 
        <Tag>{getCurrentCountryName(countryCode)}</Tag> : '-',
    },
    {
      title: t('invoices.paymentStatus'),
      dataIndex: ['paymentDetails', 'paymentStatus'],
      key: 'paymentStatus',
      render: (paymentStatus) => paymentStatus ? 
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {getCurrentPaymentStatusDisplay(paymentStatus)}
        </Tag> : '-',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          size="small"
        >
          {t('invoices.detail')}
        </Button>
      ),
    },
  ];

  const filteredInvoices = useMemo(() => {
    let filtered = [...invoiceList];
    
    if (activeFilters.customerCountryCode) {
      filtered = filtered.filter(invoice => 
        invoice.customerCountryCode === activeFilters.customerCountryCode
      );
    }
    if (activeFilters.supplierCountryCode) {
      filtered = filtered.filter(invoice => 
        invoice.supplierCountryCode === activeFilters.supplierCountryCode
      );
    }
    if (activeFilters.currency) {
      filtered = filtered.filter(invoice => 
        invoice.currency === activeFilters.currency
      );
    }
    
    return filtered;
  }, [invoiceList, activeFilters]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2}>{t('invoices.title')}</Title>
          </div>
          
          <Card title={
            <Space>
              <FilterOutlined />
              {t('filters.search')}
            </Space>
          } size="small">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} lg={6}>
                  <Form.Item name="dateRange" label={t('filters.date')}>
                    <RangePicker 
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={6}>
                  <Form.Item name="documentType" label={t('filters.documentType')}>
                    <Select>
                      <Option value="OUTGOING">{t('filters.outgoing')}</Option>
                      <Option value="INCOMING">{t('filters.incoming')}</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={6}>
                  <Form.Item name="status" label={t('filters.status')}>
                    <Select allowClear placeholder={t('filters.selectStatus')}>
                      {INVOICE_STATUSES.map(status => (
                        <Option key={status} value={status}>
                          {getStatusDisplay(status, i18n.language)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} lg={6}>
                  <Form.Item label=" " style={{ marginBottom: 0 }}>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        icon={<SearchOutlined />}
                        loading={loading}
                      >
                        {t('filters.search')}
                      </Button>
                      <Button 
                        icon={<ReloadOutlined />}
                        onClick={() => handleSearch(searchParams)}
                        loading={loading}
                      >
                        {t('filters.refresh')}
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />

              <Row>
                <Col span={24}>
                  <Button
                    type="link"
                    icon={<FilterOutlined />}
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    style={{ padding: 0, marginBottom: 16 }}
                  >
                    {t('filters.advancedFilters')}
                    <DownOutlined 
                      style={{ 
                        marginLeft: 8,
                        transform: showAdvancedFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </Button>
                </Col>
              </Row>

              {showAdvancedFilters && (
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item name="customerCountryCode" label={t('filters.customerCountry')}>
                        <Select allowClear placeholder={t('filters.selectCountry')}>
                          {COUNTRY_OPTIONS.map(countryCode => (
                            <Option key={countryCode} value={countryCode}>
                              {getCountryName(countryCode, i18n.language)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item name="supplierCountryCode" label={t('filters.supplierCountry')}>
                        <Select allowClear placeholder={t('filters.selectCountry')}>
                          {COUNTRY_OPTIONS.map(countryCode => (
                            <Option key={countryCode} value={countryCode}>
                              {getCountryName(countryCode, i18n.language)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item name="currency" label={t('filters.currency')}>
                        <Select allowClear placeholder={t('filters.selectCurrency')}>
                          {CURRENCIES.map(currency => (
                            <Option key={currency} value={currency}>{currency}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item name="type" label={t('filters.invoiceType')}>
                        <Select allowClear placeholder={t('filters.selectType')}>
                          {INVOICE_TYPES.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item name="paymentStatus" label={t('filters.paymentStatus')}>
                        <Select allowClear placeholder={t('filters.selectPaymentStatus')}>
                          {PAYMENT_STATUSES.map(status => (
                            <Option key={status} value={status}>
                              {getPaymentStatusDisplay(status, i18n.language)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label=" " style={{ marginBottom: 0 }}>
                        <Button 
                          icon={<ClearOutlined />}
                          onClick={handleClearFilters}
                          style={{ width: '100%' }}
                        >
                          {t('filters.clearFilters')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )}
            </Form>
          </Card>

          {error && (
            <Alert
              message={t('invoices.error')}
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(clearError())}
              action={
                <Button size="small" onClick={() => {
                  dispatch(clearError());
                  handleSearch(searchParams);
                }}>
                  {t('common.retry')}
                </Button>
              }
            />
          )}

          {getActiveFilterCount > 0 && (
            <Card size="small">
              <Space wrap>
                <span style={{ fontWeight: 'bold' }}>{t('filters.activeFiltersLabel')}:</span>
                {Object.entries(activeFilters).map(([key, value]) => (
                  <Tag 
                    key={key} 
                    closable 
                    onClose={() => {
                      const newFilters = { ...activeFilters };
                      delete newFilters[key];
                      setActiveFilters(newFilters);
                      form.setFieldsValue({ [key]: undefined });
                    }}
                    color="blue"
                  >
                    {(() => {
                      const getFilterLabel = (filterKey) => {
                        switch (filterKey) {
                          case 'dateRange': return t('filters.date');
                          case 'documentType': return t('filters.documentType');
                          case 'status': return t('filters.status');
                          case 'customerCountryCode': return t('filters.customerCountryCode');
                          case 'supplierCountryCode': return t('filters.supplierCountryCode');
                          case 'currency': return t('filters.currency');
                          case 'type': return t('filters.type');
                          case 'paymentStatus': return t('filters.paymentStatus');
                          default: return filterKey;
                        }
                      };

                      const getFilterValue = (filterKey, filterValue) => {
                        switch (filterKey) {
                          case 'customerCountryCode':
                          case 'supplierCountryCode':
                            return getCountryName(filterValue, i18n.language);
                          case 'status':
                            return getStatusDisplay(filterValue, i18n.language);
                          case 'paymentStatus':
                            return getPaymentStatusDisplay(filterValue, i18n.language);
                          case 'documentType':
                            return filterValue === 'OUTGOING' ? t('filters.outgoing') : t('filters.incoming');
                          case 'dateRange':
                            return Array.isArray(filterValue) ? 
                              `${filterValue[0].format('DD/MM/YY')} - ${filterValue[1].format('DD/MM/YY')}` : 
                              filterValue;
                          default:
                            return filterValue;
                        }
                      };

                      return `${getFilterLabel(key)}: ${getFilterValue(key, value)}`;
                    })()}
                  </Tag>
                ))}
                <Button 
                  type="link" 
                  size="small" 
                  onClick={handleClearFilters}
                  style={{ padding: 0 }}
                >
                  {t('filters.clearAll')}
                </Button>
              </Space>
            </Card>
          )}

          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <span style={{ fontWeight: 'bold' }}>
                  {t('invoices.total')}: {filteredInvoices.length} {t('invoices.invoice')}
                </span>
                {filteredInvoices.length !== invoiceList.length && (
                  <span style={{ color: '#999' }}>
                    ({invoiceList.length} {t('invoices.filteredFrom')})
                  </span>
                )}
              </Space>
            </div>
            
            <Table
              columns={columns}
              dataSource={filteredInvoices}
              loading={loading}
              rowKey="id"
              pagination={{
                current: pagination.page + 1,
                pageSize: pagination.size,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} ${t('invoices.title').toLowerCase()}`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              onChange={handleTableChange}
              scroll={{ x: 1000 }}
              locale={{
                emptyText: t('invoices.noData')
              }}
            />
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default InvoiceList; 