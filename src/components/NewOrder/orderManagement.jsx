import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Modal, Popover, Icon, Menu, DatePicker, Popconfirm, Form, message } from 'antd';
import styles from './style.less';

import OrderModal from './OrderModal';
import ReturnOrderModal from './component/ReturnOrderModal'; // 退单


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;

@window.regStateCache
class orderManagement extends Component {

  constructor() {
    super();

    this.state = {
      current: '1',
      expandedRows: [],
      checkId: [],
      selectedRowKeys: [],
      orderSelected: [],
      subOrderId: [],
      orderNos: [],
      subOrderIds: [],
      modalVisible: false,
      title: '',
      orderTimeVisible: false,
      returnModalVisible: false,
      returnType: '',
      returnOrderValues: {},
      exportVisible: false,
      exportTitle: '',
      shippingTrack: [],
      showTrack: false,
      showTitle: '',
    };
  }

  //过滤主表信息
  filterMainTable(sr) {
    for (let i = 0; i < sr.length; i++) {
      if ("string" == typeof (sr[i])) {
        delete sr[i];
      }
    }
  }

  //过滤子表信息
  filterSubTable(sr) {
    for (let i = 0; i < sr.length; i++) {
      if ("string" != typeof (sr[i])) {
        delete sr[i];
      }
    }
  }

  //判断数组subOrderIdList里面的所有元素是否全部在数组sr里面
  arrayContains(sr, subOrderIdList) {
    let result = true;
    for (let i = 0; i < subOrderIdList.length; i++) {
      let id = subOrderIdList[i];
      if (-1 == sr.indexOf(id)) {
        result = false;
      }
    }
    return result;
  }

  mergeArray(result, mainTable, subTable) {
    for (let i = 0; i < mainTable.length; i++) {
      result.push(mainTable[i]);
    }
    for (let j = 0; j < subTable.length; j++) {
      result.push(subTable[j]);
    }
  }

  mergeTwoArray(result, mainTable) {
    for (let i = 0; i < mainTable.length; i++) {
      result.push(mainTable[i]);
    }
  }

  //处理主表的选择框
  handleMainOrder = (sr, selectedRows) => {
    this.filterSubTable(sr)
    let result = [];
    let mainTable = [];
    let subTable = [];
    const { subOrderIds, orderNos } = this.state;
    this.mergeTwoArray(subTable, subOrderIds);
    const { selectedRowKeys, subOrderId } = this.state;
    for (let i = 0; i < sr.length; i++) {
      mainTable.push(sr[i])
    }
    //处理子表
    for (let j = 0; j < selectedRows.length; j++) {
      let curOrder = selectedRows[j];
      let subOrderDOList = curOrder.subOrderDOList;
      for (let m = 0; m < subOrderDOList.length; m++) {
        let curSubOrder = subOrderDOList[m];
        subTable.push(curSubOrder.id)
      }
    }
    this.mergeArray(result, subTable, mainTable)
    this.setState({
      selectedRowKeys: result
    })
  }

  //处理子表的选择框
  handleSubOrder = (sr) => {
    this.filterMainTable(sr);
    let result = [];
    let mainTable = [];
    let subTable = [];
    const { orderList } = this.props;
    for (let m = 0; m < sr.length; m++) {
      subTable.push(sr[m]);
    }
    for (let i = 0; i < orderList.length; i++) {
      let subOrderIdList = [];
      let curOrder = orderList[i];
      let subOrderList = curOrder.subOrderDOList;
      for (let j = 0; j < subOrderList.length; j++) {
        let curSubOrder = subOrderList[j];
        subOrderIdList.push(curSubOrder.id);
      }
      if (this.arrayContains(sr, subOrderIdList)) {
        mainTable.push(curOrder.orderNo);
      }
    }
    this.mergeArray(result, mainTable, subTable)
    this.setState({
      selectedRowKeys: result,
      subOrderIds: subTable,
    })
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    var statusCode;
    if (e.key == "1") {
      this.props.dispatch({ type: 'neworder/searchPageList', payload: {} });
    }
    if (e.key == "2") { var statusCode = 0 }
    if (e.key == "3") { var statusCode = 3 }
    if (e.key == "4") { var statusCode = 1 }
    if (e.key == "5") { var statusCode = 2 }
    if (e.key == "6") { var statusCode = -3 }
    if (e.key == "7") { var statusCode = -4 }
    if (e.key == "8") { var statusCode = 5 }
    if (e.key == "9") { var statusCode = 4 }
    this.props.dispatch({ type: 'neworder/searchPageList', payload: { status: statusCode } });
  }
  batchExport() {
    this.setState({
      exportVisible: true,
      exportTitle: '请选择导出订单的时间',
    })
  }
  newOrder() {
    this.setState({
      modalVisible: true,
      orderTimeVisible: false,
      title: '新增',
    });
    this.props.dispatch({ type: 'neworder/clearOrder', payload: {} });
  }
  trajectory(r) {
    const p = this;
    this.props.dispatch({
      type: 'order/queryShippingTrack',
      payload: { shippingNo: r.shippingNo },
      cb(data) {
        p.setState({
          shippingTrack: data,
          showTrack: true,
          showTitle: '物流轨迹'
        });
      },
    })
  }
  updateOrder(orderNo, e) {
    if (e) e.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      orderTimeVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({
        type: 'neworder/queryOrderListTwo',
        payload: { orderNo },
        cb: () => {
          p.props.dispatch({ type: 'neworder/erpOrderDe', payload: { orderNo } });
        }
      });
    });
  }
  showReturnOrderModal(r) {
    this.setState({ returnModalVisible: true, returnType: '新增', returnOrderValues: r }, () => {
      // this.props.dispatch({
      //   type: 'order/saveReturnValues',
      //   payload: { data: r },
      // });
    });
  }
  closeModal() {
    this.setState({ modalVisible: false }, () => {
      this.props.dispatch({
        type: 'neworder/searchPageList',
        payload: {},
      });
    });
  }
  handleOrderModal(r) {
    let orderNumber = r.subOrderNo
    this.props.dispatch({
      type: 'neworder/erpOrderNumber',
      payload: { subOrderNo: orderNumber },
      cb: () => {
        this.props.dispatch({
          type: 'neworder/searchPageList',
          payload: {},
        });
      },
    });
  }
  closeReturnModal() {
    this.setState({ returnModalVisible: false }, () => {
      // this.props.dispatch({
      //   type: 'order/saveReturnValues',
      //   payload: {},
      // });
      // this._refreshData();
    });
  }
  handleCancel() {
    this.setState({
      exportVisible: false,
    })
  }
  handleOk() {
    const { form } = this.props;
    const p = this;
    form.validateFields((err, values) => {
      if (err) return;
      let startGmtCreate;
      let endGmtCreate;
      if (values.orderTime && values.orderTime[0] && values.orderTime[1]) {
        startGmtCreate = new Date(values.orderTime[0]).format('yyyy-MM-dd');
        endGmtCreate = new Date(values.orderTime[1]).format('yyyy-MM-dd');
        delete values.orderTime;
        p.props.dispatch({
          type: 'order/exportMainOrder',
          payload: {
            // ...values,
            startGmtCreate,
            endGmtCreate,
          },
        });
        this.setState({
          exportVisible: false,
        })
      } else {
        message.error('请选择创建时间范围');
      }
    });

  }
  showCancel() {
    this.setState({
      showTrack: false,
    })
  }
  render() {
    const p = this;
    const { form, dispatch, orderList, erpDetailList, orderListTwo } = p.props;
    const { expandedRows, selectedRowKeys, orderSelected, modalVisible, title, orderTimeVisible, returnType, returnModalVisible, returnOrderValues, exportVisible, exportTitle, showTrack, showTitle, shippingTrack } = this.state;
    console.log(shippingTrack)
    const { getFieldDecorator } = form;
    let orderValue = orderListTwo[0];
    if (orderList) {
      orderList.forEach(function (v) { expandedRows.push(v.orderNo) })
    }
    //把订单的总金额字段移入子订单中
    if (orderList) {
      for (let i = 0; i < orderList.length; i++) {
        let curOrder = orderList[i];
        if (curOrder.totalAmount != null && curOrder.totalAmount != undefined) {
          let totalAmount = curOrder.totalAmount;
          let subOrderDOList = curOrder.subOrderDOList;
          for (let j = 0; j < subOrderDOList.length; j++) {
            let curSubOrder = subOrderDOList[j];
            curSubOrder.tempAmount = totalAmount;//前端临时添加的字段
          }
        }
      }
    }
    const expandedRowRender = (record) => {
      const subTabData = record.subOrderDOList;
      const orderTotalStatus = record.status;
      const columns = [
        {
          title: '图片地址',
          dataIndex: 'skuPic',
          key: 'skuPic',
          width: '6%',
          render(text) {
            const t = text ? JSON.parse(text).picList[0].url : '';
            return (
              t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
                <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
              </Popover> : '-'
            );
          },
        },
        {
          title: '商品信息',
          dataIndex: 'itemName',
          key: 'itemName',
          width: '24%',
          render(t, r) {
            return (
              <div>
                <p>{r.itemName}</p>
                <p style={{ color: '#4A90E2', fontSize: '13px' }}>UPC: {r.upc}</p>
              </div>
            )
          }
        },
        {
          title: '价格',
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: '6%',
          render(t, r) {
            return (
              <div>
                <p>{r.salePrice}</p>
                <p>{r.color}{r.scale}</p>
              </div>
            )
          }
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          key: 'quantity',
          width: '5%',
          render(t, r) {
            return (
              <div>
                <p>{r.quantity}</p>
              </div>
            )
          }
        },
        { title: '备货状态', dataIndex: 'stockStatus', key: 'stockStatus', width: '5%' },
        {
          title: '收货信息',
          dataIndex: 'receiver',
          key: 'receiver',
          width: '20%',
          render(t, r) {
            return (
              <div>
                <p>{r.receiver}</p>
                <p>
                  <span>{r.telephone}</span>
                  {r.idCard != null && <span style={{ marginLeft: '15px' }}><Icon type="check-circle" style={{ color: '#7ED321' }} />身份证</span>}
                  {r.idCard == null && <span style={{ marginLeft: '15px' }}><Icon type="check-circle" />身份证</span>}
                </p>
                <p>{r.receiverState}{r.receiverCity}{r.receiverDistrict}{r.receiverAddress}</p>
              </div>
            )
          }
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          key: 'status',
          width: '10%',
          render(t) {
            switch (t) {
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
          }
        },
        {
          title: '收款金额',
          dataIndex: 'tempAmount',
          colSpan: 3,
          key: 'tempAmount',
          width: '12%',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index == 0) {
              obj.props.rowSpan = 100;
              // return orderTotalPrice;
            }
            if (index >= 1) {
              obj.props.rowSpan = 0;
              //return;
            }
            return obj;
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: '12%',
          // render: (value, row, index) => {
          //   const obj = {
          //     children:
          //       <div>
          //         {(orderTotalStatus === 1 || orderTotalStatus === 2 || orderTotalStatus === 4 || orderTotalStatus === 5 || orderTotalStatus === -3 || orderTotalStatus === -4) && <a href="javascript:void(0)" onClick={p.trajectory.bind(p, record)}>查看轨迹</a>}
          //         <br />
          //         {/* {(orderTotalStatus === 6 || orderTotalStatus === 3) && <a href="javascript:void(0)" onClick={p.updateOrder.bind(p, record.orderNo)}>修改订单</a>} */}
          //         <br />
          //         {(orderTotalStatus === 2 || orderTotalStatus === 5) && <div><a href="javascript:void(0)" onClick={p.showReturnOrderModal.bind(p, record)}>退货</a></div>}
          //         {(orderTotalStatus === 3 || orderTotalStatus === 6) && <Popconfirm title="确定退单吗？" onConfirm={p.handleOrderModal.bind(p, record)}>
          //           <div><a href="javascript:void(0)" >退款</a></div>
          //         </Popconfirm>}
          //         <br />
          //       </div>,
          //     props: {},

          //   };

          //   if (index == 0) {
          //     obj.props.rowSpan = 100;

          //     // return orderTotalPrice;
          //   }
          //   if (index >= 1) {
          //     obj.props.rowSpan = 0;
          //     //return;
          //   }
          //   return obj;

          // },
          render(t, r) {
            return (
              <div>
                {(r.status === 1 || r.status === 2 || r.status === 4 || r.status === 5 || r.status === -3 || r.status === -4) && <a href="javascript:void(0)" onClick={p.trajectory.bind(p, r)}>查看轨迹</a>}
                <br />
                {(r.status === 2 || r.status === 5) && <div><a href="javascript:void(0)" onClick={p.showReturnOrderModal.bind(p, r)}>退货</a></div>}
                {(r.status === 3 || r.status === 6) && <Popconfirm title="确定退单吗？" onConfirm={p.handleOrderModal.bind(p, r)}>
                  <div><a href="javascript:void(0)" >退款</a></div>
                </Popconfirm>}
                <br />
              </div>
            )
          }
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={subTabData}
          pagination={false}
          showHeader={false}
          // rowSelection={childRowSelection}
          rowKey={record => record.id}
          bordered
        />
      );
    }
    const columns = [

      {
        title: '商品信息',
        dataIndex: 'itemName',
        key: 'itemName',
        width: '12%',
        render(t, r) {
          return (
            <div>
              <p>订单号: {r.orderNo}</p>
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: '18%',
        render(t, r) {
          return (
            <div>
              <p>商户订单号: {r.channelOrderNo}</p>
            </div>
          )
        }
      },
      {
        title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: '6%',
        render(t, r) {
          switch (r.status) {
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
        }
      },
      { title: '数量', dataIndex: 'quantity1', key: 'quantity1', width: '5%' },
      { title: '备货状态', dataIndex: 'stockStatus1', key: 'stockStatus1', width: '5%' },
      { title: '收货信息', dataIndex: 'receiver1', key: 'receiver1', width: '20%' },
      { title: '订单状态', dataIndex: 'status1', key: 'status1', width: '10%' },
      {
        title: '收款金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: '12%',
        render(t, r) {
          return (
            <div>
              <p>创建时间: {r.orderTime}</p>
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '12%',
        render(t, record) {
          return (
            <div>
              {(record.status === 6 || record.status === 3) && <Button type="primary" size="small" style={{ marginLeft: -10 }} onClick={p.updateOrder.bind(p, record.orderNo)}>修改订单</Button>}
            </div>
          )
        }
      },
    ]
    //主表选择框
    const rowSelection = {
      selectedRowKeys,
      onChange: (sr, selectedRows) => {
        this.handleMainOrder(sr, selectedRows);
      }
    };
    //子表选择框
    const childRowSelection = {
      selectedRowKeys,
      onChange: (sr) => {
        this.handleSubOrder(sr);
      }
    };
    return (
      <div className={styles.form}>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="1">全部</Menu.Item>
          <Menu.Item key="2">待付款</Menu.Item>
          <Menu.Item key="3">待发货</Menu.Item>
          <Menu.Item key="4">部分发货</Menu.Item>
          <Menu.Item key="5">全部发货</Menu.Item>
          <Menu.Item key="6">售后中</Menu.Item>
          <Menu.Item key="7">售后完成</Menu.Item>
          <Menu.Item key="8">已签收</Menu.Item>
          <Menu.Item key="9">订单完成</Menu.Item>
        </Menu>
        <Form>
          <Row style={{ margin: '10px 0px' }}>
            <Col span='5' style={{ float: 'right' }}>
              <Search
                placeholder=""
                enterButton="搜索"
                size="large"
                onSearch={value => console.log(value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="primary" size="large" onClick={this.batchExport.bind(this)}>批量导出订单</Button>
              <Button type="primary" size="large" onClick={this.newOrder.bind(this)} style={{ marginLeft: '10px' }}>新增订单</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col>
              <Table
                // className="components-table-demo-nested"
                columns={columns}
                dataSource={orderList}
                // rowSelection={rowSelection}
                rowKey={record => record.orderNo}
                expandedRowRender={expandedRowRender}
                expandIconAsCell={false}
                expandIconColumnIndex={-1}
                defaultExpandAllRows={true}
                expandedRowKeys={expandedRows}
              />
            </Col>
          </Row>
        </Form>
        <OrderModal
          visible={modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={orderValue}
          erpDetailListValues={erpDetailList}
          // agencyList={agencyList}
          title={title}
          dispatch={dispatch}
          orderTimeVisible={orderTimeVisible}
        />
        <ReturnOrderModal
          visible={returnModalVisible}
          close={this.closeReturnModal.bind(this)}
          data={returnOrderValues}
          returnType={returnType}
          dispatch={dispatch}
        />
        <Modal
          visible={exportVisible}
          title={exportTitle}
          onCancel={this.handleCancel.bind(this)}
          onOk={this.handleOk.bind(this)}
        >
          <Form>
            <Row gutter={20} style={{ width: 800 }}>
              <Col style={{ marginLeft: 6 }}>
                <FormItem
                  label="创建时间范围"
                  labelCol={{ span: 3 }}
                >
                  {getFieldDecorator('orderTime', {})(<RangePicker />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          visible={showTrack}
          title={showTitle}
          centered={true}
          footer={null}
          onCancel={this.showCancel.bind(this)}
          width={600}
        >
            <div className="flow-list" >
              <div className="new-order-flow new-p-re">
                <ul className="new-of-storey">
                  {
                    shippingTrack.map((item, index) => {
                      return <li key={index}>
                        {
                          index === 0 ? <span className="top-white" /> : ''
                        }
                        {
                          index === shippingTrack.length - 1 ?
                            <span className="bottom-white" /> : ''
                        }
                        <span className={`icon ${index === 0 ? 'on' : ''}`} />
                        <span className={index === 0 ? 'first' : ''}>
                          {item.info}
                        </span>
                        <span
                          className={index === 0 ? 'first' : ''}>
                          {item.gmtCreate}
                        </span>
                      </li>
                    })
                  }
                </ul>
              </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { orderList, orderListTwo, erpDetailList } = state.neworder;
  return {
    orderList,
    orderListTwo,
    erpDetailList,
  };
}
export default connect(mapStateToProps)(Form.create()(orderManagement));
