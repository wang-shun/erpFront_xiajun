import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, Form, Tabs, Popconfirm, Modal, InputNumber } from 'antd';
import BusinessModal from './BusinessModal';


const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
@window.regStateCache
class Business extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      title: '',
    };
  }
  showModal() {
    this.setState({
      modalVisible: true,
      title: '新增',
    })
    console.log(this.props)
    this.props.dispatch({ type: 'inventory/deleteGet', payload: {} }); 
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  updateModal(r) {
    console.log(r.companyNo)
    const p = this;
    p.setState({
      modalVisible: true,
      title: '编辑',
    }, () => {
      p.props.dispatch({ type: 'inventory/deleteGet', payload: {} }); 
      p.props.dispatch({
        type: 'inventory/companyGet',
        payload: { companyNo: r.companyNo },
      });
    });
  }

  handleDelete(r) {
    this.props.dispatch({
      type: 'inventory/companyDelete',
      payload: { companyNo: r.companyNo },
      cb: () => {
        this.props.dispatch({
          type: 'inventory/companyList',
          payload: {}
        })
      }
    });
  }
  handleSearch(num, size) {
    // const payload = { pageIndex: typeof num === 'number' ? num : 1 };
    // if (typeof size === 'number') payload.pageSize = size;
    console.log(num, size)
    const { form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue)
      this.props.dispatch({
        type: 'inventory/companyList',
        payload: { companyName: fieldsValue.companyName, status: fieldsValue.status, pageIndex: num, pageSize: size },
      })
    })
    // this.props.dispatch({
    //   type: 'inventory/companyList',
    //   payload,
    // });
  }
  stopModal(r) {
    // console.log(r.companyNo)
    this.props.dispatch({
      type: 'inventory/companyDisable',
      payload: { companyNo: r.companyNo },
      cb: () => {
        this.props.dispatch({
          type: 'inventory/companyList',
          payload: {}
        })
      }
    })
  }
  handleSubmit(r) {
    // console.log(r)
    const { form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue)
      this.props.dispatch({
        type: 'inventory/companyList',
        payload: { companyName: fieldsValue.companyName, status: fieldsValue.status },
      })
    })
  }
  render() {
    const p = this;
    const { cateList = [], dispatch, form, cateTotal, catePageSize, cateCompanyGetList, allCountryList } = p.props;
    const { title, modalVisible } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    const paginationProps = {
      defaultPageSize: 20,
      // showSizeChanger: true,
      total: cateTotal,
      pageSize: catePageSize,
      // pageSizeOptions: ['20', '30', '50', '100'],
      // onShowSizeChange(current, size) {
      //   p.props.dispatch({
      //     type: 'order/queryMallSaleAgents',
      //     payload: {
      //       pageIndex: current,
      //       pageSize: size,
      //     },
      //   });
      // },
      onChange(page, pageSize) {
        console.log(page, pageSize)
        p.handleSearch(page, pageSize);
        // console.log(page, pageSize)
      },
    };
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '联系人',
        dataIndex: 'adminName',
        key: 'adminName',
      },
      {
        title: '登录账号',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render(text) {
          switch (text) {
            case 0: return '正常';
            case 1: return '已关闭';
            default: return '-';
          }
        },
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '开通时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.updateModal.bind(p, r)}>编辑</a>
              <Popconfirm title="确定停用此商家？" onConfirm={p.stopModal.bind(p, r)}>
                <a href="javascript:void(0)" style={{ marginRight: 10 }}>停用</a>
              </Popconfirm>
              <Popconfirm title="确定删除此商家？" onConfirm={p.handleDelete.bind(p, r)}>
                <a href="javascript:void(0)" style={{ marginRight: 10 }}>删除</a>
              </Popconfirm>
            </div>);
        },
      },
    ];
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 1000 }}>
            <Col span="7">
              <FormItem
                label="公司名称"
                {...formItemLayout}
              >
                {getFieldDecorator('companyName', {})(
                  <Input placeholder="请输入商家公司名" />
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商家状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择操作类型" allowClear>
                    <Option value={0}>正常</Option>
                    <Option value={1}>已关闭</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col className="listBtnGroup" span="8">
              <Button htmlType="submit" size="large" type="primary" >查询</Button>
              <Button size="large" type="ghost" onClick={() => { form.resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row className="operBtn">
          <Button style={{ marginBottom: 20 }} type="primary" size="large" onClick={this.showModal.bind(this)}>新增商家</Button>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={cateList}
              bordered
              size="large"
              rowKey={record => record.companyNo}
              pagination={paginationProps}
            />
          </Col>
        </Row>
        <BusinessModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          cateData={cateCompanyGetList}
          countries={allCountryList}
          dispatch={dispatch}
          title={title}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { cateList, cateTotal, catePageSize, cateCompanyGetList, allCountryList } = state.inventory;
  return {
    cateList,
    cateTotal,
    catePageSize,
    cateCompanyGetList,
    allCountryList,
  };
}

export default connect(mapStateToProps)(Form.create()(Business));
