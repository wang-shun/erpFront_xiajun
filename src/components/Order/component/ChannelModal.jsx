import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class ChannelModal extends Component {
  handleSubmit() {
    const p = this;
    const { form, dispatch, data, returnType } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.returnPayTime) {
        values.returnPayTime = values.returnPayTime.format('YYYY-MM-DD');
      }
      if (values.receiveTime) {
        values.receiveTime = values.receiveTime.format('YYYY-MM-DD');
      }
      if (returnType === '新增') {
        const { orderNo, outerOrderId, erpNo } = data;
        const erpOrderId = data.id;
        dispatch({
          type: 'order/addReturnOrder',
          payload: { ...values, orderNo, outerOrderId, erpNo, erpOrderId },
          cb() { p.handleCancel(); },
        });
      } else {
        values.id = data.id;
        dispatch({
          type: 'order/updateReturnOrder',
          payload: { ...values },
          cb() { p.handleCancel(); },
        });
      }
    });
  }
  handleCancel() {
    const { form, close } = this.props;
    form.resetFields();
    close();
  }
  handleChangeType() {}
  handleChangeLevel() {}
  render() {
    const p = this;
    const { visible, form, data = {}, returnType } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
        <Modal
          visible={visible}
          title={returnType}
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            <Row>
              <Col span={8}>
                <FormItem
                  label="渠道名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('name', {
                    initialValue: data.name,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入渠道名称" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  label="类型"
                  {...formItemLayout}
                >
                  {getFieldDecorator('type', {
                    initialValue: typeof data.type === 'number' ? data.type.toString() : undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择类型" allowClear onChange={this.handleChangeType.bind(this)}>
                      <Option key="1">平台</Option>
                      <Option key="2">分销</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="分销层级"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status', {
                    initialValue: typeof data.status === 'number' ? data.status.toString() : undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" allowClear onClick={this.handleChangeLevel.bind(this)}>
                      <Option key="0">一级分销</Option>
                      <Option key="1">二级分销</Option>
                      <Option key="2">三级分销</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  label="折扣率"
                  {...formItemLayout}
                >
                  {getFieldDecorator('discount', {
                    initialValue: data.discount,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入折扣率" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  label="对接人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('contactName', {
                    initialValue: data.contactName,
                  })(
                    <Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('contactName', {
                    initialValue: data.contactName,
                  })(
                    <Input placeholder="请输入电话" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('contactName', {
                    initialValue: data.contactName,
                  })(
                    <Input placeholder="请输入邮箱地址" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="是否国内退货"
                  {...formItemLayout}
                >
                  {getFieldDecorator('isGn', {
                    initialValue: typeof (data.isGn) === 'number' ? data.isGn.toString() : '1',
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" allowClear>
                      <Option key="1">是</Option>
                      <Option key="0">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="收货时间"
                  {...formItemLayout}
                >
                  {getFieldDecorator('receiveTime', {
                    initialValue: data.receiveTime && moment(data.receiveTime, 'YYYY-MM-DD'),
                  })(
                    <DatePicker placeholder="请输入收货时间" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="是否入库"
                  {...formItemLayout}
                >
                  {getFieldDecorator('isCheckin', {
                    initialValue: typeof data.isCheckin === 'number' ? data.isCheckin.toString() : '1',
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" allowClear>
                      <Option key="1">是</Option>
                      <Option key="0">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="退款时间"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnPayTime', {
                    initialValue: data.returnPayTime && moment(data.returnPayTime, 'YYYY-MM-DD'),
                  })(
                    <DatePicker placeholder="请输入退款时间" style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="退单原因"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnReason', {
                    initialValue: data.returnReason,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择退单原因" allowClear>
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
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="退单原因详情"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnReasonDetail', {
                    initialValue: data.returnReasonDetail,
                  })(
                    <Input type="textarea" placeholder="请输入退单原因详情" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="备注"
                  {...formItemLayout}
                >
                  {getFieldDecorator('remark', {
                    initialValue: data.remark,
                  })(
                    <Input type="textarea" placeholder="请输入备注详情" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ChannelModal);
