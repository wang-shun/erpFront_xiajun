import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button, Modal, Popover, Popconfirm, DatePicker, Icon, message, Checkbox } from 'antd';

import DeliveryModal from './component/DeliveryModal'; // 发货
import BatchDeliveryModal from './component/BatchDeliveryModal'; // 批量发货
import ErpOrderModal from './ErpOrderModal'; //
import SplitOrder from './component/SplitOrder'; // 拆分订单
import RecordList from './component/RecordList'; // 记录
import ReturnOrderModal from './component/ReturnOrderModal'; // 退单

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@window.regStateCache
class ErpOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      title: '',
      checkId: [], // 发货时传的ID
      needSplitId: '',
      deliveryModalVisible: false,
      returnModalVisible: false,
      returnType: '',
      type: 'add', // 发货的判断
      batchDeliveryVisible: false,
      closeModalVisible: false,
      closeReason: undefined,
      formInfo: '',
    };
  }
  handleSubmit(e, page, pageSize) {
    if (e) e.preventDefault();
    const { currentPageSize } = this.props;
    // 清除多选
    this.setState({ checkId: [] }, () => {
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        if (fieldsValue.orderTime && fieldsValue.orderTime[0] && fieldsValue.orderTime[1]) {
          fieldsValue.startGmtCreate = new Date(fieldsValue.orderTime[0]).format('yyyy-MM-dd');
          fieldsValue.endGmtCreate = new Date(fieldsValue.orderTime[1]).format('yyyy-MM-dd');
        }
        delete fieldsValue.orderTime;
        this.props.dispatch({
          type: 'order/queryErpOrderList',
          payload: {
            ...fieldsValue,
            pageIndex: typeof page === 'number' ? page : 1,
            pageSize: pageSize || currentPageSize,
          },
        });
      });
    });
  }
  showDeliveryModal() { // 发货
    const p = this;
    // 请求信息
    this.props.dispatch({
      type: 'order/queryErpOrderDetail',
      payload: {
        erpOrderId: this.state.checkId,
        callback() {
          p.setState({ deliveryModalVisible: true });
        },
      },
    });
  }
  showBatchDeliveryModal() { // 批量发货
    const { checkId } = this.state;
    const p = this;
    this.props.dispatch({
      type: 'order/batchDeliveryForm',
      payload: { erpOrderId: JSON.stringify(checkId) },
      callback(data) {
        if (data.success) {
          p.setState({ batchDeliveryVisible: true, formInfo: data.data });
        } else {
          Modal.error({
            title: '提示',
            content: data.msg,
          });
        }
      },
    });
  }
  replayAssign() {
    const p = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/replayAssign',
      payload: {
        orderIds: JSON.stringify(p.state.checkId),
        callback() {
          p.setState({ checkId: [] }); // 取消选择 checkId
          p._refreshData();
        },
      },
    });
  }
  handleCloseModalVisible() {
    this.setState({ closeModalVisible: true, closeReason: undefined });
  }
  handleCloseReason(value) {
    this.setState({ closeReason: value });
  }
  closeErpOrder(type) { // 子订单关闭
    const p = this;
    const { dispatch } = this.props;
    switch (type) {
      case 'save':
        dispatch({
          type: 'order/closeErpOrder',
          payload: {
            orderIds: JSON.stringify(p.state.checkId),
            closeReason: p.state.closeReason,
            callback() {
              p.setState({ checkId: [], closeModalVisible: false }); // 取消选择 checkId
              p._refreshData();
            },
          },
        });
        break;
      case 'close':
        p.setState({ closeModalVisible: false });
        break;
      default: return false;
    }
  }
  showModal(id, e) {
    if (e) e.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'order/queryErpOrder', payload: { id } });
    });
  }
  closeDeliveryModal() {
    this.props.dispatch({
      type: 'order/saveErpOrderDetail',
      payload: {},
    });
    this.setState({ deliveryModalVisible: false, checkId: [] }, () => {
      this._refreshData();
    });
  }
  closeBatchDeliveryModal() {
    this.setState({ batchDeliveryVisible: false, checkId: [] }, () => {
      this._refreshData();
    });
  }
  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    }, () => {
      this.props.dispatch({
        type: 'order/saveErpOrder',
        payload: {},
      });
      this._refreshData();
    });
  }
  showReturnOrderModal(type, r) {
    switch (type) {
      case 'update':
        this.setState({ returnModalVisible: true, returnType: '修改' }, () => {
          this.props.dispatch({
            type: 'order/queryReturnOrderById',
            payload: { id: r.erpReturnOrderId },
          });
        });
        break;
      case 'add':
        this.setState({ returnModalVisible: true, returnType: '新增' }, () => {
          this.props.dispatch({
            type: 'order/saveReturnValues',
            payload: { data: r },
          });
        });
        break;
      default: return false;
    }
  }
  handleOrderModal(r){
    let orderNumber = r.subOrderNo  
    this.props.dispatch({
      type: 'order/erpOrderNumber',
      payload: {subOrderNo:orderNumber},
    });
  }
  closeReturnModal() {
    this.setState({ returnModalVisible: false }, () => {
      this.props.dispatch({
        type: 'order/saveReturnValues',
        payload: {},
      });
      this._refreshData();
    });
  }
  handleInventory(type, id) {
    const p = this;
    switch (type) {
      case 'lock':
        this.props.dispatch({
          type: 'order/lockErpOrder',
          payload: { id },
          cb() { p._refreshData(); },
        });
        break;
      case 'release':
        this.props.dispatch({
          type: 'order/releaseInventory',
          payload: { id },
          cb() { p._refreshData(); },
        });
        break;
      default: return false;
    }
  }
  prepareShipping() { // 预出库
    const p = this;
    this.props.dispatch({
      type: 'order/prepareShipping',
      payload: { erpOrderId: JSON.stringify(this.state.checkId) },
      cb() { p._refreshData(); },
    });
  }
  handleEmptyInput(type) { // 清空内容
    const { setFieldsValue } = this.props.form;
    switch (type) {
      case 'orderNo': setFieldsValue({ orderNo: undefined }); break;
      case 'erpNo': setFieldsValue({ erpNo: undefined }); break;
      case 'targetNo': setFieldsValue({ targetNo: undefined }); break;
      case 'skuCode': setFieldsValue({ skuCode: undefined }); break;
      case 'itemName': setFieldsValue({ itemName: undefined }); break;
      case 'upc': setFieldsValue({ upc: undefined }); break;
      case 'receiver': setFieldsValue({ receiver: undefined }); break;
      case 'telephone': setFieldsValue({ telephone: undefined }); break;
      case 'idCard': setFieldsValue({ idCard: undefined }); break;
      default: return false;
    }
  }
  showClear(type) { // 是否显示清除按钮
    const { getFieldValue } = this.props.form;
    const data = getFieldValue(type);
    if (data) {
      return <Icon type="close-circle" onClick={this.handleEmptyInput.bind(this, type)} />;
    }
    return null;
  }
  exportErpOrder() { // 导出订单
    const { form } = this.props;
    const p = this;
    let checkedSubOrderId = this.state.checkId;
    //console.log("se:"+checkedSubOrderId);
    //console.log("ses:"+checkedSubOrderId.length);
    let checkedSubOrderIdString = '';
    for(var i = 0;i < checkedSubOrderId.length;i++) {
     // console.log("ses:"+i+checkedSubOrderId[i]);
      checkedSubOrderIdString = checkedSubOrderIdString+checkedSubOrderId[i]+",";
    }
    checkedSubOrderIdString = checkedSubOrderIdString.substring(0,checkedSubOrderIdString.length-1);
    let startGmtCreate = "";
    let endGmtCreate = "";
    if(0 < checkedSubOrderId.length) {//有勾选则导出勾选的订单
        console.log("勾选了订单");
        p.props.dispatch({
          type: 'order/exportErpOrder',
          payload: {
            // ...values,
            startGmtCreate,
            endGmtCreate,
            checkedSubOrderIdString,
          },
        });
    } else {
      form.validateFields((err, values) => {
        if (err) return;
        let startGmtCreate;
        let endGmtCreate;
        let checkedSubOrderIdString = '';
        if (values.orderTime && values.orderTime[0] && values.orderTime[1]) {
          startGmtCreate = new Date(values.orderTime[0]).format('yyyy-MM-dd');
          endGmtCreate = new Date(values.orderTime[1]).format('yyyy-MM-dd');
          delete values.orderTime;
          p.props.dispatch({
            type: 'order/exportErpOrder',
            payload: {
              // ...values,
              startGmtCreate,
              endGmtCreate,
              checkedSubOrderIdString,
            },
          });
        } else {
          message.error('请勾选订单或者选择创建时间范围');
        }
      });        
    }  
  }
  handleSelect(r, type, e) {
    const checked = e.target.checked;
    if (type === 'ALL') {
      this.setState({ checkId: checked ? this.props.erpOrderList.map(el => el.id) : [] });
    } else {
      const checkId = this.state.checkId;
      const newCheckId = [];
      checkId.forEach((id) => {
        if (id !== r.id) {
          newCheckId.push(id);
        }
      });
      if (checked) newCheckId.push(r.id);
      this.setState({ checkId: newCheckId });
    }
  }
  render() {
    const p = this;
    const { erpOrderList, erpOrderTotal, currentPage, currentPageSize, erpOrderDetail, form, dispatch, agencyList = [], erpOrderValues = {}, deliveryCompanyList = [], wareList = [], agentManList = [], returnOrderValues = {}, loginRoler } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { deliveryModalVisible, checkId, type, modalVisible, title, batchDeliveryVisible, formInfo, returnModalVisible, returnType, closeModalVisible, closeReason } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    // const rowSelection = {
    //   onChange(selectedRowKeys, selectedRows) {
    //     const listId = [];
    //     selectedRows.forEach((el) => {
    //       listId.push(el.id);
    //     });
    //     p.setState({ checkId: listId });
    //   },
    //   selectedRowKeys: p.state.checkId,
    // };
    const columns = [
      { title: (
        <Checkbox
          indeterminate={checkId.length > 0 && checkId.length !== erpOrderList.length}
          checked={erpOrderList.length > 0 && checkId.length === erpOrderList.length}
          onChange={p.handleSelect.bind(p, null, 'ALL')}
        />),
        dataIndex: 'selection',
        key: 'selection',
        width: 30,
        fixed: 'left',
        render(t, r) {
          return (
            <Checkbox
              checked={checkId.indexOf(r.id) > -1}
              onChange={p.handleSelect.bind(p, r, null)}
            />
          );
        },
      },
      { title: '主订单号', dataIndex: 'orderNo', key: 'orderNo', width: 100 },
      { title: '子订单号', dataIndex: 'subOrderNo', key: 'subOrderNo', width: 110, render(text) { return text || '-'; }},
      // { title: '销售人员', dataIndex: 'salesName', key: 'salesName', width: 50 },
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: 100 },
      { title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        width: 100,
        render(text, r) {
          return <span>{r.receiverState ? `${r.receiverState} ${r.receiverCity} ${r.receiverDistrict} ${r.receiverAddress}` : '-'}</span>;
        },
      },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: 100 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 100 },
      // { title: '身份证', dataIndex: 'ifidCard', key: 'ifidCard', width: 50,render(text, record) {if(!record.idCard) return ('无');return ('有');}},
      { title: '身份证号码', dataIndex: 'idCard', key: 'idCard', width: 100,render(text) { return text || '-'; }},
      { title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render(text) {
          switch (text) {
            case 0: return <font color="#ff642e">待付款</font>;
            case 3: return <font color="#ff642e">已付款待发货</font>;
            case 1: return <font color="#ff642e">部分发货</font>;
            case 2: return <font color="#0c97a1">全部发货</font>;
            case -1: return <font color="#ff2e38">关闭</font>;
            case -3: return <font color="#ff2e38">售后处理中</font>;
            case -4: return <font color="#549707">售后完成</font>;
            case 4: return <font color="#549707">订单完成</font>;
            case 5: return <font color="#549707">已签收</font>;
            case 6: return <font color="red">新建</font>;

            default: return '-';
          }
        },
      },
      { title: '关闭理由', dataIndex: 'closeReason', key: 'closeReason', width: 100, render(t) { return t || '-'; } },
      {
        title: '备货状态',
        dataIndex: 'stockStatus',
        key: 'stockStatus',
        width: 100,
        render(text) {
          switch (text) {
            case -4: return <font>退货完成</font>;
            case -1: return <font>已关闭</font>;
            case 1: return <font color="sienna">部分备货</font>;
            case 2: return <font color="saddlebrown">部分在途备货</font>;
            case 3: return <font color="saddlebrown">全部在途备货</font>;
            case 4: return <font color="sienna">混合备货完成</font>;
            case 9: return <font color="red">已释放</font>;
            case 10: return <font color="blue">已备货</font>;
            case 11: return <font color="green">预出库</font>;
            default: return '-';
          }
        },
      },
      // { title: '销售时间', dataIndex: 'orderTime', key: 'orderTime', width: 100, render(text) { return text ? text.slice(0, 10) : '-'; } },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100, render(text) { return text || '-'; } },
      //{ title: '物流公司', dataIndex: 'logisticCompany', key: 'logisticCompany', width: 100, render(text) { return text || '-'; } },
      //{ title: '物流单号', dataIndex: 'logisticNo', key: 'logisticNo', width: 100, render(text) { return <font color="purple">{text}</font> || '-'; } },
      //{ title: '规格1', dataIndex: 'color', key: 'color', width: 100, render(text) { return text || '-'; } },
      { title: '尺码', dataIndex: 'scale', key: 'scale', width: 100, render(text) { return text || '-'; } },
      { title: '图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 100,
        render(text) {
          if (!text) return '-';
          try {
            const picList = JSON.parse(text).picList;
            const t = picList.length > 0 && picList[0] != null ? JSON.parse(text).picList[0].url : '';
            // console.log('image info', picList, t);
            return (
              t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
                <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
              </Popover> : '-'
            );
          } catch (e) {
            // console.log(e);
            // console.log(text);
            return (
              text ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(text)} style={{ width: 400 }} />}>
                <img role="presentation" src={imgHandlerThumb(text)} width={60} height={60} />
              </Popover> : '-'
            );
          }
        },
      },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 100 },
      //{ title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
      //{ title:  '货号', dataIndex: 'thirdSkuCode', key: 'thirdSkuCode', width: 100 },
      // { title: '外部订单号', dataIndex: 'targetNo', key: 'targetNo', width: 100, render(text) { return text || '-'; } },
      { title: '发货方式', dataIndex: 'logisticType', key: 'logisticType', width: 100, render(text) { return text === 0 ? '直邮' : (text === 1 ? '拼邮' : '-'); } },
      { title: '仓库名', dataIndex: 'warehouseName', key: 'warehouseName', width: 100, render(text) { return text || '-'; } },
      { title: '商品数量', dataIndex: 'quantity', key: 'quantity', width: 100, render(text) { return text || '-'; } },
      { title: '商品单价', dataIndex: 'salePrice', key: 'salePrice', width: 100, render(text) { return text || '-'; } },
      // { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 220 },
      // { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200 },
      { title: '备注', dataIndex: 'memo', key: 'memo', render(text) { return text || '-'; } },

      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 120,
        fixed: 'right',
        render(t, r) {
        	  if(p.props.loginRoler) return('-');
          return (
            <div>
              {/* {r.status === 0 && r.quantity > 1 && <SplitOrder dispatch={dispatch} record={r} handleSubmit={p.handleSubmit.bind(p)} />} */}
              {r.status === 6 && <RecordList dispatch={dispatch} record={r} />}
              {r.status === 3 && <RecordList dispatch={dispatch} record={r} />}
              {r.status === 6 && <div><a href="javascript:void(0)" onClick={p.showModal.bind(p, r.id)} >修改</a></div>}
              {r.status === 0 && [0, 1, 2, 9].indexOf(r.stockStatus) > -1 &&
              <Popconfirm title="确定分配库存吗？" onConfirm={p.handleInventory.bind(p, 'lock', r.id)}>
                {/* <div><a href="javascript:void(0)" >分配库存</a></div> */}
              </Popconfirm>}
              {r.status === 0 && [0, 9].indexOf(r.stockStatus) === -1 &&
              <Popconfirm title="确定释放库存吗？" onConfirm={p.handleInventory.bind(p, 'release', r.id)}>
                {/* <div><a href="javascript:void(0)" >释放库存</a></div> */}
              </Popconfirm>}
              {/* {r.erpReturnOrderId ?
                <div><a href="javascript:void(0)" onClick={p.showReturnOrderModal.bind(p, 'update', r)}>修改退单</a></div> :
                <div><a href="javascript:void(0)" onClick={p.showReturnOrderModal.bind(p, 'add', r)}>退单</a></div>} */}
                {r.status === 2 && <div><a href="javascript:void(0)" onClick={p.showReturnOrderModal.bind(p, 'add', r)}>退单</a></div>}
                {r.status === 5 && <div><a href="javascript:void(0)" onClick={p.showReturnOrderModal.bind(p, 'add', r)}>退单</a></div>}
                {r.status===3 && <Popconfirm title="确定退单吗？" onConfirm={p.handleOrderModal.bind(p, r)}>
                <div><a href="javascript:void(0)" >退单</a></div>
              </Popconfirm>}
              {r.status === 6 && <Popconfirm title="确定退单吗？" onConfirm={p.handleOrderModal.bind(p, r)}>
                <div><a href="javascript:void(0)" >退单</a></div>
              </Popconfirm>}
              {/* {r.status !== 0 && <div><span style={{ color: '#ccc' }}>暂无</span></div>} */}
            </div>);
        },
      },
    ];
    const pagination = {
      total: erpOrderTotal,
      current: currentPage,
      pageSize: currentPageSize,
      showSizeChanger: true,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      onShowSizeChange(current, size) {
        p.handleSubmit(null, 1, size);
      },
    };
    const isNotSelected = this.state.checkId.length === 0;
    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="主订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {})(
                  <Input placeholder="请输入" suffix={p.showClear('orderNo')} />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="子订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('erpNo', {})(
                  <Input placeholder="请输入" suffix={p.showClear('erpNo')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入" suffix={p.showClear('targetNo')} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="10">全部</Option>
                    <Option value="0">待付款</Option>
                    <Option value="3">已付款待发货</Option>
                    <Option value="2">全部发货</Option>
                    <Option value="-1">关闭</Option>
                    <Option value="-3">售后处理中</Option>
                    <Option value="-4">售后完成</Option>
                    <Option value="4">订单完成</Option>
                    <Option value="5">已签收</Option>
                    <Option value="5">新建</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="备货状态"
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">未备货</Option>
                    <Option value="1">部分备货</Option>
                    <Option value="2">部分在途备货</Option>
                    <Option value="3">全部在途备货</Option>
                    <Option value="4">混合备货完成</Option>
                    <Option value="9">已释放</Option>
                    <Option value="10">已备货</Option>
                    <Option value="11">预出库</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入" suffix={p.showClear('skuCode')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入" suffix={p.showClear('itemName')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入" suffix={p.showClear('upc')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {})(
                  <Input placeholder="请输入" suffix={p.showClear('receiver')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="销售人员"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {})(
                  <Select placeholder="请选择销售" allowClear>
                    {agencyList.map((el) => {
                      return <Option key={el.id} value={el.name}>{el.name}</Option>;
                    })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="发货方式"
                {...formItemLayout}
              >
                {getFieldDecorator('logisticType', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">直邮</Option>
                    <Option value="1">拼邮</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="手机号码"
                {...formItemLayout}
              >
                {getFieldDecorator('telephone', {})(
                  <Input placeholder="请输入" suffix={p.showClear('telephone')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="仓库"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseId', {})(
                  <Select placeholder="请选择仓库" optionLabelProp="title" allowClear>
                    {wareList.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="关闭理由"
                {...formItemLayout}
              >
                {getFieldDecorator('closeReason', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option key="退单">退单</Option>
                    <Option key="做错单">做错单</Option>
                    <Option key="其他">其他</Option>
                  </Select>)}
              </FormItem>
            </Col>
            {p.props.loginRoler ?
	        		<Col>　</Col> :
		        		<Col span="8">
	              <FormItem
	                label="代理商"
	                {...formItemLayout}
	              >
	                {getFieldDecorator('openId', {})(
	                  <Select placeholder="请选择代理商" allowClear>
	                    {agentManList.map(v => (
	                      <Option value={v.openId} key={v.nickName}>{v.nickName}</Option>
	                    ))}
	                  </Select>,
	                )}
	              </FormItem>
	            </Col>
	        	}
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span='16'>
              <FormItem
                label="创建时间范围"
                labelCol={{ span: 5 }}
              >
                {getFieldDecorator('orderTime', {})(<RangePicker />)}
              </FormItem>
            </Col>
           <Col span="8">
              <FormItem
                label="身份证"
                {...formItemLayout}
              >
               {getFieldDecorator('idCard', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option key="1">有</Option>
                    <Option key="0">无</Option>
                  </Select>)}
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
        {p.props.loginRoler ?
        		<Row>　</Row> :
        		<Row className="operBtn">
	          <Button style={{ float: 'left', marginRight: 10 }} type="primary" disabled={isNotSelected} size="large" onClick={p.showDeliveryModal.bind(p)}>发货</Button>
	          {/* <Button style={{ float: 'left', marginRight: 10 }} type="primary" disabled={isNotSelected} size="large" onClick={p.showBatchDeliveryModal.bind(p)}>批量发货</Button> */}
	          {/* <Button style={{ float: 'left', marginRight: 10 }} type="primary" disabled={isNotSelected} size="large" onClick={p.prepareShipping.bind(p)}>预出库</Button> */}
	          {/* <Button style={{ float: 'right', marginLeft: 10 }} type="primary" disabled={isNotSelected} size="large" onClick={p.replayAssign.bind(p)}>重分配库存</Button> */}
	          <Popover
	            title="关闭"
	            trigger="click"
	            visible={closeModalVisible}
	            onVisibleChange={this.handleCloseModalVisible.bind(this)}
	            content={<div style={{ width: 200 }}>
	              <Row>
	                <Col span="8" style={{ marginTop: 6 }}>关闭理由：</Col>
	                <Col span="16">
	                  <Select placeholder="请选择" onChange={p.handleCloseReason.bind(p)} style={{ width: '100%' }} value={closeReason || undefined}>
	                    <Option key="退单">退单</Option>
	                    <Option key="做错单">做错单</Option>
	                    <Option key="其他">其他</Option>
	                  </Select>
	                </Col>
	              </Row>
	              <Row style={{ marginTop: 10 }}>
	                <Col style={{ float: 'left' }}><Button type="primary" size="small" onClick={p.closeErpOrder.bind(p, 'save')}>保存</Button></Col>
	                <Col style={{ float: 'right' }}><Button type="ghost" size="small" onClick={p.closeErpOrder.bind(p, 'close')}>关闭</Button></Col>
	              </Row>
	            </div>}
	          >
	            {/* <Button style={{ float: 'right', marginLeft: 10 }} disabled={isNotSelected} size="large">关闭</Button> */}
	          </Popover>
	          <Button style={{ float: 'right' }} type="primary" size="large" onClick={p.exportErpOrder.bind(p)}>导出订单</Button>
	        </Row>
        	}
        <DeliveryModal
          visible={deliveryModalVisible}
          deliveryCompanyList={deliveryCompanyList}
          agentManList={agentManList}
          checkId={checkId}
          data={erpOrderDetail}
          closeModal={this.closeDeliveryModal.bind(this)}
          dispatch={dispatch}
          type={type}
          wareList={wareList}
        />
        <BatchDeliveryModal
          visible={batchDeliveryVisible}
          deliveryCompanyList={deliveryCompanyList}
           agentManList={agentManList}
          checkId={checkId}
          closeModal={this.closeBatchDeliveryModal.bind(this)}
          dispatch={dispatch}
          formInfo={formInfo}
        />
        <Table
          columns={columns}
          dataSource={erpOrderList}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: 2150, y: 500 }}
          bordered={true}
        />
        <ErpOrderModal
          visible={modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={erpOrderValues}
          agencyList={agencyList}
          title={title}
          dispatch={dispatch}
        />
        <ReturnOrderModal
          visible={returnModalVisible}
          close={this.closeReturnModal.bind(this)}
          data={returnOrderValues}
          returnType={returnType}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { erpOrderList, erpOrderTotal, erpCurrentPage, erpCurrentPageSize, erpOrderDetail, erpOrderValues, deliveryCompanyList, returnOrderValues ,agentManList, loginRoler} = state.order;
  const { list } = state.agency;
  const { wareList } = state.inventory;
  return {
    erpOrderList,
    erpOrderTotal,
    currentPage: erpCurrentPage,
    currentPageSize: erpCurrentPageSize,
    erpOrderDetail,
    agencyList: list,
    erpOrderValues,
    deliveryCompanyList,
    wareList,
    agentManList,
    returnOrderValues,
    loginRoler
  };
}

export default connect(mapStateToProps)(Form.create()(ErpOrder));
