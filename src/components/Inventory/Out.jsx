import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Button, Select, Input, DatePicker, Popconfirm } from 'antd';

import OutModal from './components/OutModal';
import OutModalModify from './components/OutModalModify';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@window.regStateCache
class Out extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      objectValue:{},
      outVisble:false,
    };
  }
  handleSubmit(e, page) {
    if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.outTime) {
        values.startGmt = new Date(values.outTime[0]).format('yyyy-MM-dd');
        values.endGmt = new Date(values.outTime[1]).format('yyyy-MM-dd');
      }
      delete values.outTime;
      dispatch({
        type: 'inventory/queryOutList',
        payload: {
          ...values,
          page: typeof page === 'number' ? page : 1,
        },
      });
    });
  }
  showModal(type, r) {
    console.log(r)
    switch (type) {
      case 'add': this.setState({ visible: true,objectValue: '' }); break;
      case 'update':
        this.setState({ outVisble: true, objectValue:r }, () => {
          this.props.dispatch({
            type: 'inventory/queryOut',
            payload: { inventoryOutNo: r.inventoryOutNo },
          });
        });
        break;
      default: return false;
    }
  }
  closeModal() {
    this.props.dispatch({
      type: 'inventory/saveOut',
      payload: {},
    });
    this.handleSubmit();
    this.setState({ visible: false, outVisble: false, });
  }
  handleDelete(r) {
    const p = this;
    this.props.dispatch({
      type: 'inventory/deleteOut',
      payload: { id: r.id },
      cb() { p.handleSubmit(); },
    });
  }
  render() {
    const p = this;
    const { list = [], total, form, wareList = [], currentPage, outValues } = this.props;
    const { getFieldDecorator, resetFields } = form;
    const { visible, objectValue, outVisble } = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: '出库单ID', key: 'inventoryOutNo', dataIndex: 'inventoryOutNo', width: 100 },
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName', width: 100 },
      { title: '状态',
        key: 'status',
        dataIndex: 'status',
        width: 80,
        render(t) {
          switch (t) {
            case 0: return <font color="red" >未出库</font>;
            case 1: return <font color="blue" >已出库</font>;
            default: return false;
          }
        },
      },
      { title: '创建者', key: 'creator', dataIndex: 'creator', width: 80 },
      { title: '修改者', key: 'modifier', dataIndex: 'modifier', width: 80 },
      { title: '修改时间', key: 'gmtModify', dataIndex: 'gmtModify', width: 80 },
      { title: '描述', key: 'remark', dataIndex: 'remark', width: 80, render(text) { return text ? text : '-'; }},
      { title: '操作',
        key: 'oper',
        width: 80,
        render(text, record) {
          return (
            <div>
              <a onClick={p.showModal.bind(p, 'update', record)} style={{ marginRight: 10 }}>查看</a>
              <Popconfirm onConfirm={p.handleDelete.bind(p, record)} title="确认删除？">
                <a style={{ marginRight: 10 }}>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const paginationProps = {
      total,
      pageSize: 20,
      current: currentPage,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };
    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Form onSubmit={p.handleSubmit.bind(p)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="仓库"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseNo', {})(
                  <Select placeholder="请选择仓库" optionLabelProp="title" allowClear>
                    {wareList.map(el => <Option key={el.warehouseNo} title={el.name}>{el.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="出库单号"
                {...formItemLayout}
              >
                {getFieldDecorator('inventoryOutNo', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col style={{ marginLeft: 6 }}>
              <FormItem
                label="创建时间范围"
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('outTime', {})(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row className="operBtn">
          <Button type="primary" size="large" onClick={p.showModal.bind(p, 'add')}>新增出库单</Button>
        </Row>
        <Row>
          <Col>
            <Table
              bordered
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              rowKey={record => record.id}
              scroll={{ y: 500 }}
            />
          </Col>
        </Row>
        <OutModal
          visible={visible}
          close={this.closeModal.bind(this)}
          data={outValues}
          dataValue = {objectValue}
        />
        <OutModalModify
          visible = {outVisble}
          close = {this.closeModal.bind(this)}
          Mdata={outValues}
          dataValue = {objectValue}
        />
      </div>);
  }
}

function mapStateToProps(state) {
  const { outList, outTotal, wareList, outCurrent, outValues } = state.inventory;
  return { list: outList, total: outTotal, wareList, currentPage: outCurrent, outValues };
}

export default connect(mapStateToProps)(Form.create()(Out));
