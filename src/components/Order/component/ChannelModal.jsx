import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Select, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelType: '2', // 类型，平台1，分销2
      channelLevelCount: 1, // 折扣率级别
    };
  }
  handleSubmit() {
    const p = this;
    const { form, dispatch, data } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.level1 && values.level1 > 100) {
        message.error('一级分销折扣应小于100');
        return;
      }
      if (values.level2 && values.level2 > 100) {
        message.error('二级分销折扣应小于100');
        return;
      }
      if (values.level3 && values.level3 > 100) {
        message.error('三级分销折扣应小于100');
        return;
      }

      if (values.channelType === '1') {
        if (values.level1) {
          values.discount = values.level1;
        }
      } else {
        if (values.level1) {
          values.discount1 = values.level1;
        }
        if (values.level2) {
          values.discount2 = values.level2;
          // values.discount = `${values.level1}|${values.level2}`;
        }
        if (values.level3) {
          values.discount3 = values.level3;        
          // values.discount = `${values.level1}|${values.level2}|${values.level3}`;
        }
      }
      
      delete values.level1;
      delete values.level2;
      delete values.level3;
      console.log(values);
      if (data.id) {
        values.id = data.id;
        dispatch({
          type: 'order/updateChannel',
          payload: { ...values },
          cb() { p.handleCancel(); },
        });
      } else {
        dispatch({
          type: 'order/addChannel',
          payload: { ...values },
          cb() { p.handleCancel(); },
        });
      }
    });
  }
  handleCancel() {
    const { close } = this.props;
    close();
  }
  handleChangeType(val) {
    this.setState({ channelType: val });
  }
  handleChangeLevel(val) {
    console.log(val);
    this.setState({ channelLevelCount: parseInt(val, 10) });
  }
  render() {
    const p = this;
    const { channelType, channelLevelCount } = this.state;
    const { form, visible, title, data = {} } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    return (
      <div>
        <Modal
          visible={visible}
          title={title}
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            <Row>
              <Col span={7}>
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
              <Col span={7}>
                <FormItem
                  label="类型"
                  {...formItemLayout}
                >
                  {getFieldDecorator('type', {
                    initialValue: typeof data.type === 'number' ? data.type.toString() : '2',
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择类型" allowClear onChange={this.handleChangeType.bind(this)}>
                      <Option key="2">分销</Option>
                      <Option key="1">平台</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              {channelType === '2' && <Col span={7}>
                <FormItem
                  label="分销层级"
                  {...formItemLayout}
                >
                  {getFieldDecorator('saleLevel', {
                    initialValue: typeof data.saleLevel === 'number' ? data.saleLevel.toString() : '1',
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" allowClear onChange={this.handleChangeLevel.bind(this)}>
                      <Option key="1">一级分销</Option>
                      <Option key="2">二级分销</Option>
                      <Option key="3">三级分销</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>}
            </Row>
            {channelType === '1' && <Row>
              <Col span={7}>
                <FormItem
                  label="折扣率"
                  {...formItemLayout}
                >
                  {getFieldDecorator('discount', {
                    initialValue: data.discount,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入折扣率" suffix="%" />,
                  )}
                </FormItem>
              </Col>
            </Row>}
            {channelType === '2' && <Row>
              <Col span={7}>
                <FormItem
                  label="折扣率"
                  {...formItemLayout}
                >
                  {getFieldDecorator('level1', {
                    initialValue: data.level1,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入折扣率" addonBefore="一级" suffix="%" />,
                  )}
                </FormItem>
              </Col>
              {channelLevelCount > 1 && <Col span={6} style={{ margin: '0 20px' }}>
                <FormItem>
                  {getFieldDecorator('level2', {
                    initialValue: data.level2,
                  })(
                    <Input placeholder="请输入折扣率" addonBefore="二级" suffix="%" />)}
                </FormItem>
              </Col>}
              {channelLevelCount > 2 && <Col span={6}>
                <FormItem>
                  {getFieldDecorator('level3', {
                    initialValue: data.level3,
                  })(
                    <Input placeholder="请输入折扣率" addonBefore="三级" suffix="%" />)}
                </FormItem>
              </Col>}
            </Row>}
            <Row >
              <Col span={7}>
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
              <Col span={6} style={{ margin: '0 20px' }}>
                <FormItem>
                  {getFieldDecorator('contactMobile', {
                    initialValue: data.contactMobile,
                  })(
                    <Input placeholder="请输入电话" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem>
                  {getFieldDecorator('contactEmail', {
                    initialValue: data.contactEmail,
                  })(
                    <Input placeholder="请输入邮箱地址" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <FormItem
                  label="链接地址"
                  {...formItemLayout}
                  labelCol={{ span: 3 }}
                >
                  {getFieldDecorator('contactUrl', {
                    initialValue: data.contactUrl,
                  })(
                    <Input placeholder="请输入链接地址" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <FormItem
                  label="备注"
                  {...formItemLayout}
                  labelCol={{ span: 3 }}
                >
                  {getFieldDecorator('remark', {
                    initialValue: data.remark,
                  })(
                    <Input placeholder="请输入备注" />,
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
