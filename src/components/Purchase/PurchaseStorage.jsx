import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, Form, Tabs, Popconfirm, Modal, InputNumber } from 'antd';

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
      visible: false,
      title: '',
    };
  }
  //仓库选中
  storehouse(value, p) {
    const { selectWhList } = this.props
    console.log(selectWhList)
    console.log(value)
    if (value) {
      let Mao = value.label
      let sunM = value.key
      console.log(sunM)
      this.setState({
        upsvalue: value,
        mStore: Mao,
      })
    }
  }
  //买手选中
  storehouseTwo(value) {
    console.log(value)
    this.setState({
      upsvalueTwo: value,
    })
    this.props.dispatch({
      type: 'purchaseStorage/purchaseByopenid',
      payload: { buyerOpenId: value }
    })
  }
  changeActiveKey(key) {
    this.setState({ activeTab: key });
  }
  // handleSubmitList(e, values) {
  //   if (e) e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     console.log(values)
  //     console.log(values.buyerId)
  //     this.props.dispatch({
  //       type: 'purchaseStorage/purchaseByopenid',
  //       payload: { buyerOpenId: values.buyerId }
  //     })
  //   })
  // }
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
  handleSubmit(value) {
    this.props.form.validateFieldsAndScroll((err, values) => {

      this.props.dispatch({
        type: 'purchaseStorage/purchaseAndUpc',
        payload: { buyerOpenId: values.buyerId, upc: values.stoOrderNo }
      })
    })
  }
  wareHouse(p, r, index) {
    this.props.form.validateFieldsAndScroll([`r_${p.id}_shelfNo`, `r_${p.id}_quantity`], (err, values) => {
      const { upsvalue } = this.state
      p.warehouseNo = upsvalue.key
      p.quantity = parseInt(values["r_" + p.id + "_quantity"])
      p.shelfNo = values["r_" + p.id + "_shelfNo"]
      p.warehouseName = upsvalue.label
      console.log(p)
      this.props.dispatch({
        type: 'purchaseStorage/queryWithComfirm',
        payload: { detailVo: JSON.stringify(p) },
        cb: () => { this._refreshData(); },
      })

      // setTimeout(()=>this._refreshData(),2000);
    })
  }
  handleDelete(r, index) {
    console.log(r)
    console.log(index)
    this.props.dispatch({
      type: 'purchaseStorage/queryWithDelete',
      payload: { id: r.id },
      cb: () => { this._refreshData(); },
    })
  }

  // componentDidMount(){
  //   setTimeout(()=>this.props.form.resetFields(),100);
  // }
  showModal() {
    this.setState({
      visible: true,
      title: '直接入库'
    })
  }
  hSubmit() {
    const { form } = this.props
    console.log(form)
    form.validateFields((err, values) => {
      console.log(values)
      if (err) return;
      this.props.dispatch({
        type: 'purchaseStorage/inventoryAdd', payload: {
          skuCode: values.skuCode, warehouseNo: values.warehouseNo.key, positionNo: values.positionNo, quantity: parseInt(values.quantity)

        }
      });
      this.hCancel();
    })

  }
  hCancel() {
    this.setState({
      visible: false,
    })
  }

  render() {
    const p = this;
    const { form, buyers = [], selectWhList = [], searchAllList = [], listUpc = [], alreadyList = [] } = p.props;
    const { upsvalue, upsvalueTwo, activeTab, mStore, wareVisible, visible, title } = p.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const formItemLayoutT = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
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
              {getFieldDecorator(`r_${r.id}_warehouseName`, { initialValue: mStore, })(
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
              {getFieldDecorator(`r_${r.id}_quantity`, { initialValue: t || '', })(
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
              {getFieldDecorator(`r_${r.id}_shelfNo`, { initialValue: t || '', })(
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
        render(t, r, index) {
          return (
            <div>
              <p><Button type="primary" size="large" style={{ marginBottom: 5, marginRight: 10 }} onClick={p.wareHouse.bind(p, r, index)}>入库</Button></p>
              <p>
                <a href="javascript:void(0)" style={{ marginRight: 10 }}>备注 |</a>
                <Popconfirm title="确认删除？" onConfirm={p.handleDelete.bind(p, r, index)} >
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
      { title: '操作员', dataIndex: 'opUserName', key: 'opUserName' },
      { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName' },
      { title: '库位', dataIndex: 'shelfNo', key: 'shelfNo' },
      { title: '更新时间', dataIndex: 'gmtModify', key: 'gmtModify' },
      { title: '入库时间', dataIndex: 'opTime', key: 'opTime' },
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
          <Form>
            <Row gutter={20} style={{ width: 1100, marginLeft: '-68px' }}>
              <Col span="6">
                <FormItem
                  label="仓库"

                  {...formItemLayout}
                >
                  {getFieldDecorator('warehouseId', {})(
                    <Select labelInValue placeholder="请选择仓库" optionLabelProp="title" onChange={this.storehouse.bind(this)}>
                      {selectWhList.map(el => <Option key={el.warehouseNo} title={el.name}>{el.name}</Option>)}
                    </Select>)}
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="采购买手"

                  {...formItemLayout}
                >
                  {getFieldDecorator('buyerId', {})(
                    <Select placeholder="请选择买手" optionLabelProp="title"  onChange={this.storehouseTwo.bind(this)}>
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
                    // <Input placeholder="请扫UPC或手动输入" disabled={upsvalue != '' && upsvalueTwo != '' ? false : true} onKeyPress={this.handleSubmit.bind(this)} />)}
                    <Input placeholder="请扫UPC或手动输入" disabled={upsvalue != '' && upsvalueTwo != '' ? false : true} />)}
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem>
                  <Button htmlType="submit" type="primary" size="large" style={{ float: 'left', marginRight: 10 }} onClick={this.handleSubmit.bind(this)}>查询</Button>
                </FormItem>
              </Col>
            </Row>
            <Row style={{ height: 32 }}>
              <Col>
                <FormItem>
                  <Button htmlType="submit" type="primary" size="large" style={{ float: 'right', marginRight: 10 }} onClick={this.showModal.bind(this)}>直接入库</Button>
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
          {visible && <Modal
            visible={visible}
            title={title}
            onOk={this.hSubmit.bind(this)}
            onCancel={this.hCancel.bind(this)}
          >
            <Form>
              <Row>
                <Col>
                  <FormItem label="skuCode" {...formItemLayoutT}>
                    {getFieldDecorator('skuCode', {
                      rules: [{ required: true, message: '请输入skuCode' }],
                      // initialValue: roleModal.name,
                    })(
                      <Input placeholder="请输入skuCode" />,
                    )}
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="货架号" {...formItemLayoutT}>
                    {getFieldDecorator('positionNo', {
                      rules: [{ required: true, message: '请输入货架号' }],
                      // initialValue: roleModal.seq,
                    })(

                      <Input placeholder="请输入库数目" />,
                    )}
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="仓库号" {...formItemLayoutT}>
                    {getFieldDecorator('warehouseNo', {
                      rules: [{ required: true, message: '请输入仓库号' }],
                      // initialValue: roleModal.status,
                    })(
                      <Select labelInValue placeholder="请选择仓库" optionLabelProp="title"  onChange={this.storehouse.bind(this)}>
                        {selectWhList.map(el => <Option key={el.warehouseNo} title={el.name}>{el.name}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="入库数目" {...formItemLayoutT}>
                    {getFieldDecorator('quantity', {
                      rules: [{ required: true, message: '请输入库数目' }],
                      // initialValue: roleModal.description,
                    })(
                      <InputNumber placeholder="请输入货架号" />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>}
        </TabPane>
        <TabPane tab="已入库明细" key="2">
          <Form>
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
