import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Cascader, Select ,Icon, message,} from 'antd';

import divisions from '../../../utils/divisions.json';
import check from '../../../utils/checkLib';
import copy from 'copy-to-clipboard';
import styles from '../style.less';

const FormItem = Form.Item;
const Option = Select.Option;

class InvoiceModal extends Component {
  handleSubmit() {
    const p = this;
    const { form, dispatch, data } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.address) {
        values.receiverState = values.address[0];
        values.receiverCity = values.address[1];
        values.receiverDistrict = values.address[2];
        delete values.address;
      }
      values.id = data.id;
      dispatch({
        type: 'order/updateShippingOrder',
        payload: { ...values },
        callback() { p.handleCancel(); },
      });
    });
  }
  handleCancel() {
    const { form, closeModal } = this.props;
    form.resetFields();
    closeModal();
  }
  checkPhone(rules, value, cb) {
    if (value && !check.phone(value)) cb('请输入正确的手机号码');
    cb();
  }
  checkIdCard(rules, value, cb) {
    if (!value) cb();
    else if (check.idcard(value)) cb();
    else cb(new Error('请填写正确的身份证号'));
  }
  copyAddress(address) {
    copy(address);
    message.success("复制成功")
  }
  render() {
    const p = this;
    const { visible, deliveryCompanyList, form, data } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const initialAddress = [];
    initialAddress.push(data.receiverState);
    initialAddress.push(data.receiverCity);
    initialAddress.push(data.receiverDistrict);

    //console.log(initialAddress);

    return (
      <div>
        <Modal
          visible={visible}
          title="修改"
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            <Row>
              <Col span={8}>
                <FormItem
                  label="收件人"
                  {...{
                    labelCol: { span: 9 },
                    wrapperCol: { span: 13 },
                  }}
                >
                  {getFieldDecorator('receiver', {
                    initialValue: data.receiver,
                    rules: [{ required: true, message: '请输入收件人' }],
                  })(
                    <Input placeholder="请输入收件人" />)}
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem
                  label="联系电话"
                  {...formItemLayout}
                >
                  {getFieldDecorator('telephone', {
                    initialValue: data.telephone,
                    rules: [{ required: true, validator: this.checkPhone.bind(this) }],
                  })(
                    <Input placeholder="请输入联系电话" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  label="邮编"
                  {...{
                    labelCol: { span: 9 },
                    wrapperCol: { span: 15 },
                  }}
                >
                  {getFieldDecorator('postcode', {
                    initialValue: data.postcode,
                  })(
                    <Input placeholder="请输入邮编" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="收件地址"
                  {...formItemLayout}
                >
                  {getFieldDecorator('address', {
                    initialValue: initialAddress,
                    rules: [{ required: true, message: '请输入收件人地址' }],
                  })(
                    <Cascader options={divisions} placeholder="请选择" popupClassName="cascaderPop" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label=""
                  {...{
                    labelCol: { span: 1 },
                    wrapperCol: { span: 22 },
                  }}
                >
                  {getFieldDecorator('addressDetail', {
                    initialValue: data.addressDetail,
                    rules: [{ required: true, message: '请输入详细地址' }],
                  })(
                    <Input placeholder="请输入详细地址" />)}
                </FormItem>
                <Icon type="copy" style={{ fontSize: 18, color: '#08c',position:'absolute',right:10,top:8 }} onClick={p.copyAddress.bind(p, initialAddress + "," + data.addressDetail)}/>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="物流公司名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('logisticCompany', {
                    initialValue: data.logisticCompany || undefined,
                    rules: [{ required: true, message: '请选择物流公司名称' }],
                  })(
                    <Select placeholder="请选择物流公司名称" allowClear>
                      {deliveryCompanyList.map(v => (
                        <Option value={v.name} key={v.name}>{v.name}</Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="渠道"
                  {...formItemLayout}
                >
                  {getFieldDecorator('type', {
                    initialValue: data.type ? data.type.toString() : undefined,
                    rules: [{ required: true, message: '请选择渠道' }],
                  })(
                    <Select placeholder="请选择渠道" allowClear>
                      <Option value="1" key="1">包税线</Option>
                      <Option value="4" key="4">USA-P</Option>
                      <Option value="5" key="5">USA-C</Option>
                      <Option value="2" key="2">身份证线</Option>
                      <Option value="3" key="3">BC线</Option>
                      <Option value="6" key="6">邮客食品线</Option>
                      <Option value="8" key="8">4PX经济A线</Option>
                      <Option value="9" key="9">4PX经济B线</Option>
                      <Option value="7" key="7">邮客奶粉线</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="物流运单号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('logisticNo', {
                    initialValue: data.logisticNo,
                  })(
                    <Input placeholder="请输入物流运单号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="物流状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status', {
                    initialValue: data.status ? data.status.toString() : '0',
                  })(
                    <Select placeholder="请选择物流状态" allowClear>
                      <Option value="0" key="0">已预报</Option>
                      <Option value="1" key="1">快递已发货</Option>
                      <Option value="2" key="2">客户已收货</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="运费"
                  {...formItemLayout}
                >
                  {getFieldDecorator('freight', {
                    initialValue: data.freight,
                  })(
                    <Input placeholder="请输入运费" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="身份证号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('idCard', {
                    initialValue: data.idCard,
                    rules: [{ validator: this.checkIdCard.bind(this) }],
                  })(
                    <Input placeholder="请输入身份证号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  label="备注"
                  {...{
                    labelCol: { span: 3 },
                    wrapperCol: { span: 20 },
                  }}
                >
                  {getFieldDecorator('remark', {
                    initialValue: data.remark,
                  })(
                    <Input placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.divider} style={{marginBottom:"20px",}}></Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="发件人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('sender', {
                    initialValue: data.sender,
                  })(
                    <Input placeholder="请输入发件人" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="电话号码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('senderPhone', {
                    initialValue: data.senderPhone,
                  })(
                    <Input placeholder="请输入发件人电话号码" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  label="寄件地址"
                  {...{
                    labelCol: { span: 3 },
                    wrapperCol: { span: 20 },
                  }}
                >
                  {getFieldDecorator('senderAddress', {
                    initialValue: data.senderAddress,
                  })(
                    <Input placeholder="请输入寄件地址" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(InvoiceModal);
