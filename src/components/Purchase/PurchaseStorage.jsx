import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, Form, Tabs, Popconfirm } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@window.regStateCache
class PurchaseStorage extends Component {

  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      showDetail: false,
      data: [],
      upsvalue: '',
      upsvalueTwo: '',
      activeTab: '1',
      mStore: '',
      wareVisible: true,
    };
  }
  //仓库选中
  storehouse(value, p) {
    const { selectWhList } = this.props
    console.log(selectWhList)
    if (value) {
      let Mao = value.label
      this.setState({
        upsvalue: value,
        mStore: Mao,
      })
    }
  }
  //买手选中
  storehouseTwo(value) {
    this.setState({
      upsvalueTwo: value,
    })
  }
  changeActiveKey(key) {
    console.log(key)
    this.setState({ activeTab: key });
  }
  handleSubmit(e, values) {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      console.log(values.buyerId)
      this.props.dispatch({
        type: 'purchaseStorage/purchaseByopenid',
        payload: { buyerOpenId: values.buyerId }
      })
    })
  }
  alreadMo(e, values) {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values.buyerId)
      console.log(values.stoOrderNo)
      if (values.buyerId == undefined && values.stoOrderNo == undefined) {
        this.props.dispatch({
          type: 'purchaseStorage/queryWithParam',
          payload: { buyerOpenId: '', upc: '' }
        })
      } else if (values.buyerId == undefined && values.stoOrderNo != undefined) {
        this.props.dispatch({
          type: 'purchaseStorage/queryWithParam',
          payload: {
            buyerOpenId: '',
            upc: values.stoOrderNo,
          }
        })
      } else if (values.buyerId != undefined && values.stoOrderNo == undefined) {
        this.props.dispatch({
          type: 'purchaseStorage/queryWithParam',
          payload: {
            buyerOpenId: values.buyerId,
            upc: '',
          }
        })
      } else if (values.buyerId != undefined && values.stoOrderNo != undefined) {
        this.props.dispatch({
          type: 'purchaseStorage/queryWithParam',
          payload: {
            buyerOpenId: values.buyerId,
            upc: values.stoOrderNo,
          }
        })
      }

    })
  }
  keypress(value) {
    console.log('this')
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      this.props.dispatch({
        type: 'purchaseStorage/purchaseAndUpc',
        payload: { buyerOpenId: values.buyerId, upc: values.stoOrderNo }
      })
    })
  }
  wareHouse(p, r) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.r_undefined_quantity == "" || values.r_undefined_shelfNo == "") {
        return;
      }
      p.warehouseName = values.r_undefined_warehouseName
      p.quantity = values.r_undefined_quantity
      p.shelfNo = values.r_undefined_shelfNo
      
      this.props.dispatch({
        type: 'purchaseStorage/queryWithComfirm',
        payload: { detailVo: JSON.stringify(p)}
      })

    })
  }
  handleDelete(id) {
    console.log(id)
    this.props.dispatch({
      type: 'purchaseStorage/queryWithDelete',
      payload: { id: id }
    })
  }
  render() {
    const p = this;
    const { form, buyers = [], selectWhList = [], searchAllList = [], listUpc = [], alreadyList = [] } = p.props;
    const { upsvalue, upsvalueTwo, activeTab, mStore, wareVisible } = p.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '入库单号', dataIndex: 'storageNo', key: 'storageNo' },
      { title: '商品名', dataIndex: 'skuName', key: 'skuName' },
      { title: 'UPC', dataIndex: 'upc', key: 'upc' },
      { title: '规格', dataIndex: 'specifications', key: 'specifications' },
      { title: '预入库数', dataIndex: 'transQuantity', key: 'transQuantity' },
      { title: '采购买手', dataIndex: 'buyerName', key: 'buyerName' },
      { title: '最新更新时间', dataIndex: 'gmtModify', key: 'gmtModify' },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate' },
      { title: '状态', dataIndex: 'statusName', key: 'statusName' },
    ];
    const columnsSelectList = [
      { title: '入库单号', dataIndex: 'storageNo', key: 'storageNo' },
      { title: '商品名', dataIndex: 'skuName', key: 'skuName' },
      { title: 'UPC', dataIndex: 'upc', key: 'upc' },
      { title: '规格', dataIndex: 'specifications', key: 'specifications' },
      { title: '预入库数', dataIndex: 'transQuantity', key: 'transQuantity' },
      { title: '采购买手', dataIndex: 'buyerName', key: 'buyerName' },
      { title: '最新更新时间', dataIndex: 'gmtModify', key: 'gmtModify' },
      {
        title: '入库仓库', dataIndex: 'warehouseName', key: 'warehouseName',
        render(t, r) {
          return (
            <FormItem>
              {getFieldDecorator(`r_${r.key}_warehouseName`, { initialValue: mStore, rules: [{ required: true, message: '该项必填' }] })(
                <Input placeholder="请填写仓库" disabled={true} />)}
            </FormItem>
          );
        },
      },
      {
        title: '入库数', dataIndex: 'quantity', key: 'quantity',
        render(t, r) {
          return (
            <FormItem>
              {getFieldDecorator(`r_${r.key}_quantity`, { initialValue: t || '', rules: [{ required: true, message: '该项必填' }] })(
                <Input placeholder="请填写入库数" />)}
            </FormItem>
          );
        },
      },
      {
        title: '货架号', dataIndex: 'shelfNo', key: 'shelfNo',
        render(t, r) {
          return (
            <FormItem>
              {getFieldDecorator(`r_${r.key}_shelfNo`, { initialValue: t || '', rules: [{ required: true, message: '该项必填' }] })(
                <Input placeholder="请填写货架号" />)}
            </FormItem>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(t, r) {
          return (
            <div>
              <p><Button type="primary" size="large" style={{ marginBottom: 5, marginRight: 10 }} onClick={p.wareHouse.bind(p, r)}>入库</Button></p>
              <p>
                <a href="javascript:void(0)" style={{ marginRight: 10 }}>备注 |</a>
                <Popconfirm title="确认删除？" onConfirm={p.handleDelete.bind(p, r.id)} >
                  <a href="javascript:void(0)" style={{ marginRight: 10, color: "gray" }}>删除</a>
                </Popconfirm>
              </p>
            </div>);
        },
      },
    ];
    const alreadyColumns = [
      { title: '入库单号', dataIndex: 'storageNo', key: 'storageNo' },
      { title: '商品名', dataIndex: 'skuName', key: 'skuName' },
      { title: 'UPC', dataIndex: 'upc', key: 'upc' },
      { title: '入库数', dataIndex: 'quantity', key: 'quantity' },
      { title: '买手', dataIndex: 'buyerName', key: 'buyerName' },
      { title: '操作员', dataIndex: '', key: 'buyerName' },
      { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName' },
      { title: '库位', dataIndex: 'gmtCreate', key: 'gmtCreate' },
      { title: '更新时间', dataIndex: 'statusName', key: 'statusName' },
      { title: '入库时间', dataIndex: 'statusName', key: 'statusName' },
      { title: '状态', dataIndex: 'statusName', key: 'statusName' },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(t, r) {
          return (
            <div>
              <p style={{ marginRight: 10 }}>查看</p>
              <p style={{ marginRight: 10 }}>修改</p>
              <p>删除</p>
            </div>);
        },
      },

    ]
    return (
      <Tabs activeKey={activeTab} type="card" onChange={this.changeActiveKey.bind(this)}>
        <TabPane tab="扫码入库" key="1">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row gutter={20} style={{ width: 1100, marginLeft: '-68px' }}>
              <Col span="6">
                <FormItem
                  label="仓库"

                  {...formItemLayout}
                >
                  {getFieldDecorator('warehouseId', {})(
                    <Select labelInValue placeholder="请选择仓库" optionLabelProp="title" combobox allowClear onChange={this.storehouse.bind(this)}>
                      {selectWhList.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                    </Select>)}
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="采购买手"

                  {...formItemLayout}
                >
                  {getFieldDecorator('buyerId', {})(
                    <Select placeholder="请选择买手" optionLabelProp="title" combobox allowClear onChange={this.storehouseTwo.bind(this)}>
                      {buyers.map(el => <Option key={el.openId} title={el.nickName}>{el.nickName}</Option>)}
                    </Select>)}
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="UPC"

                  {...formItemLayout}
                >
                  {getFieldDecorator('stoOrderNo', {})(
                    <Input placeholder="请扫UPC或手动输入" disabled={upsvalue != '' && upsvalueTwo != '' ? false : true} onKeyPress={this.keypress.bind(this)} />)}
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem>
                  <Button htmlType="submit" type="primary" size="large" style={{ float: 'left', marginRight: 10 }}>查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col>
              新增入库操作：
              </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columnsSelectList}
                dataSource={listUpc}
                bordered
                size="large"
                rowKey={record => record.id}
                pagination={false}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col>
              预入库列表：
              </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columnsList}
                dataSource={searchAllList}
                bordered
                size="large"
                rowKey={record => record.id}
                pagination={false}

              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="已入库明细" key="2">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row gutter={20} style={{ width: 1100, marginLeft: '-68px' }}>
              <Col span="6">
                <FormItem
                  label="UPC"

                  {...formItemLayout}
                >
                  {getFieldDecorator('stoOrderNo', {})(
                    <Input placeholder="请扫UPC或手动输入" />)}
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="采购买手"

                  {...formItemLayout}
                >
                  {getFieldDecorator('buyerId', {})(
                    <Select placeholder="请选择买手" optionLabelProp="title" combobox allowClear onChange={this.storehouseTwo.bind(this)}>
                      {buyers.map(el => <Option key={el.openId} title={el.nickName}>{el.nickName}</Option>)}
                    </Select>)}
                </FormItem>
              </Col>
              {/* <Col span="6">
                <FormItem
                  label="商品名"

                  {...formItemLayout}
                >
                  {getFieldDecorator('warehouseId', {})(
                    <Input placeholder="请输入商品关键字" />
                  )}
                </FormItem>
              </Col> */}
              <Col span="6">
                <FormItem>
                  <Button type="primary" size="large" style={{ float: 'left', marginRight: 10 }} onClick={this.alreadMo.bind(this)}>查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col>
              <Table
                columns={alreadyColumns}
                dataSource={alreadyList}
                bordered
                size="large"
                rowKey={record => record.id}
                pagination={false}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    );
  }
}

function mapStateToProps(state) {
  const { list, total, currentPage, buyer, showModal, editInfo, buyerTaskList, showBarcodeModal, buyers, selectWhList, searchAllList, listUpc, alreadyList } = state.purchaseStorage;
  const { wareList } = state.inventory;
  return {
    list, total, currentPage, buyer, wareList, showModal, editInfo, buyerTaskList, showBarcodeModal, buyers, selectWhList, searchAllList, listUpc, alreadyList
  };
}

export default connect(mapStateToProps)(Form.create()(PurchaseStorage));
