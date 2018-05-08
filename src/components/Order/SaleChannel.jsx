import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, DatePicker, Button, Row, Col, Select, Form, Icon, Tooltip } from 'antd';

// const FormItem = Form.Item;
// const Option = Select.Option;
// const { RangePicker } = DatePicker;

import ChannelModal from './component/ChannelModal';

@window.regStateCache
class SaleChannel extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      title: '',
    };
  }

  // handleSubmit(e, page) {
  //   const p = this;
  //   if (e) e.preventDefault();
  //   // 清除多选
  //   this.setState({ checkId: [] }, () => {
  //     this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
  //       if (err) return;
  //       if (fieldsValue.orderTime && fieldsValue.orderTime[0] && fieldsValue.orderTime[1]) {
  //         fieldsValue.startGmtCreate = new Date(fieldsValue.orderTime[0]).format('yyyy-MM-dd');
  //         fieldsValue.endGmtCreate = new Date(fieldsValue.orderTime[1]).format('yyyy-MM-dd');
  //       }
  //       delete fieldsValue.orderTime;
  //       this.props.dispatch({
  //         type: 'order/queryReturnOrderList',
  //         payload: {
  //           ...fieldsValue,
  //           pageIndex: typeof page === 'number' ? page : 1,
  //         },
  //         cb() {
  //           p.closeModal();
  //         },
  //       });
  //     });
  //   });
  // }

  updateModal(id) {
    const p = this;
    p.setState({
      visible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'order/queryChannel', payload: { id } });
    });
  }

  closeModal() {
    this.setState({ visible: false }, () => {
      this.props.dispatch({
        type: 'order/updateState',
        payload: {
          channelValues: {},
        },
      });
    });
  }

  handleDeleteChannel(id) {
    this.props.dispatch({
      type: 'order/deleteChannel',
      payload: {
        id,
      },
    });
  }

  render() {
    const p = this;
    const { form, channels, channelValues = {} } = p.props;
    console.log(channels);
    // const { getFieldDecorator, resetFields } = form;
    const { visible, title } = p.state;
    // const formItemLayout = {
    //   labelCol: { span: 10 },
    //   wrapperCol: { span: 14 },
    // };
    const columnsList = [
      { title: '销售渠道名称', dataIndex: 'name', key: 'name', width: '16%' },
      { title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '16%',
        render: (t, r) => {
          switch (t) {
            case '1':
              return '平台';
            case '2':
              return r.saleLevel;
            default: return '-';
          }
        },
      },
      { title: '折扣率', dataIndex: 'discount', key: 'discount', width: '16%',
        render: (t, r) => {
          if (r.type === '1') return t + '%';
          if (r.saleLevel === '1') return '一级: ' + r.discount1 + '%';
          if (r.saleLevel === '2') {
            return <div><div>一级: {r.discount1}%</div><div>二级: {r.discount2}%</div></div>;
          }
          if (r.saleLevel === '3') {
            return <div><div>一级: {r.discount1}%</div><div>二级: {r.discount2}%</div><div>三级: {r.discount3}%</div></div>;
          }
        }  
      },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: '16%' },
      { title: '对接人',
        dataIndex: 'contactName',
        key: 'contactName',
        width: '16%',
        render: (t, r) => {
          console.log(t, r);
          return (
            <div>
              <span>{t}</span>
              <Tooltip title={r.contactMobile}>
                <Icon type="phone" style={{ color: '#00cbd7', margin: '0 10px' }} />
              </Tooltip>
              <Tooltip title={r.contactEmail}>
                <Icon type="message" style={{ color: '#00cbd7' }} />
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'operator',
        render(text, record) {
          return (
            <div>
              <a onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <span> | </span>
              <a onClick={p.updateModal.bind(p, record.id)}>查看历史结算</a>
              <span> | </span>
              <a onClick={p.handleDeleteChannel.bind(p, record.id)}>删除</a>
            </div>);
        },
      },
    ];
    return (
      <div>
        {/* <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="主订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {})(
                  <Input placeholder="请输入主订单号" suffix={p.showClear('orderNo')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="子订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('erpNo', {})(
                  <Input placeholder="请输入子订单号" suffix={p.showClear('erpNo')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择订单状态" allowClear>
                    <Option value="0">待审核</Option>
                    <Option value="1">审核通过,退款中</Option>
                    <Option value="2">退款成功</Option>
                    <Option value="-1">关闭</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入UPC" suffix={p.showClear('upc')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入商品代码" suffix={p.showClear('skuCode')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入商品名称" suffix={p.showClear('itemName')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span={8}>
              <FormItem
                label="退款形式"
                {...formItemLayout}
              >
                {getFieldDecorator('returnType', {})(
                  <Select placeholder="请选择退单类型" allowClear>
                    <Option key="0">仅退款</Option>
                    <Option key="1">既退货又退款</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="退款来源"
                {...formItemLayout}
              >
                {getFieldDecorator('returnRefer', {})(
                  <Select placeholder="请选择退款来源" allowClear>
                    <Option key="0">ERP创建</Option>
                    <Option key="1">微信小程序</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="退单原因"
                {...formItemLayout}
              >
                {getFieldDecorator('returnReason', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option key="不想要了">不想要了</Option>
                    <Option key="发错货">发错货</Option>
                    <Option key="多发货">多发货</Option>
                    <Option key="采购不到">采购不到</Option>
                    <Option key="质量问题">质量问题</Option>
                    <Option key="尺码问题">尺码问题</Option>
                    <Option key="物流原因">物流原因</Option>
                    <Option key="客户错误下单">客户错误下单</Option>
                    <Option key="其他">其他</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="12" style={{ marginLeft: 6 }}>
              <FormItem
                label="退款时间"
                labelCol={{ span: 6 }}
              >
                {getFieldDecorator('orderTime', {})(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form> */}
        <Row className="operBtn" style={{ marginTop: 0, borderTop: 'none' }}>
          <Col>
            <Button type="primary" size="large" onClick={() => this.setState({ visible: true, title: '新增' })}>新建渠道</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columnsList}
              dataSource={channels}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={false}
            />
          </Col>
        </Row>
        {visible && <ChannelModal
          visible={visible}
          title={title}
          close={this.closeModal.bind(this)}
          data={channelValues}
          dispatch={this.props.dispatch}
        />}
      </div>
    );
  }
}

function mapStateToProps({ order }) {
  const { channels } = order;
  return {
    channels,
  };
}

export default connect(mapStateToProps)(Form.create()(SaleChannel));
