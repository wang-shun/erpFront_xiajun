import React, { Component } from 'react';
import { Modal, Input, Row, Col, Select, Form, Upload, Radio, Cascader, message, InputNumber, Icon } from 'antd';
import styles from './style.less';
import divisions from '../../utils/divisions.json';

const FormItem = Form.Item;
const Option = Select.Option;

class BusinessModal extends Component {

  constructor() {
    super();
    this.state = {
      countryNameExit: false,
      loading: false,
      showCate: true,
      showMessage: false,
      picList: null,
      previewVisible: false, // 上传图片的modal是否显示
      previewImage: '', // 上传图片的url
    };
  }

  handleSubmit() {
    const p = this;
    const { form, dispatch, cateData } = p.props;
    const { showCate } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue)
      // 处理图片
      if (fieldsValue.logoUrl) {
        const uploadMainPic = [];
        fieldsValue.logoUrl.forEach((item, index) => {
          uploadMainPic.push({
            uid: `i_${index}`,
            type: item.type,
            url: item.url || item.response.data,
          });
        });
        fieldsValue.logoUrl = JSON.stringify({ picList: uploadMainPic });
      }
      // 结束处理图片
      const values = {
        logoUrl: fieldsValue.logoUrl,
        companyName: fieldsValue.companyName,
        intro: fieldsValue.intro,
        loginName: fieldsValue.loginName,
        password: fieldsValue.password,
        name: fieldsValue.name,
        phone: fieldsValue.phone,
        email: fieldsValue.email,
        status: fieldsValue.status,
        mchId: fieldsValue.mchId,
        payKey: showCate == true ? fieldsValue.payKey1 : fieldsValue.payKey2,
        state: fieldsValue.address ? fieldsValue.address[0] : '',
        city: fieldsValue.address ? fieldsValue.address[1] : '',
        district: fieldsValue.address ? fieldsValue.address[2] : '',
        fullAddress: fieldsValue.fullAddress,
        country: fieldsValue.country,
        overseaAddress: fieldsValue.overseaAddress,
        mainCategory: fieldsValue.mainCategory,
        offlineAnnualSale: fieldsValue.offlineAnnualSale,
        onlineAnnualSale: fieldsValue.onlineAnnualSale,
      }
      console.log(values)
      console.log(cateData)
      if (cateData.length != 0) {
        console.log(cateData.companyNo, cateData.adminNo)
        console.log('zaizheli')
        dispatch({
          type: 'inventory/companyUpdate',
          payload: { ...values, companyNo: cateData.companyNo, adminNo: cateData.adminNo },
          cb: () => {
            this.props.dispatch({
              type: 'inventory/companyList',
              payload: {}
            })
            this.closeModal();
          }
        });

      } else {
        console.log('在这里')
        dispatch({
          type: 'inventory/companyAdd',
          payload: { ...values },
          cb: () => {
            this.props.dispatch({
              type: 'inventory/companyList',
              payload: {}
            })
            this.closeModal();
          }
        });
      }
    });
  }

  handleSelectCountry(country) {
    if (country === 'other') {
      this.setState({
        countryNameExit: true,
      });
    } else this.setState({ countryNameExit: false });
  }

  closeModal() {
    const { close, form } = this.props;
    form.resetFields();
    close(false);
    this.setState({
      picList: null,
    })
  }
  onChange = (e) => {
    console.log(e.target.value)
    if (e.target.value == '2') {
      this.setState({
        showCate: true,
        showMessage: false,
      })
    } else {
      this.setState({
        showCate: false,
        showMessage: true,
      })
    }
  }


  //
  handleCancel() {
    this.setState({
      previewVisible: false,
    });
  }
  render() {
    const p = this;
    const { form, visible, modalValues = {}, cateData, countries = [], } = this.props;
    const { showCate, showMessage, previewVisible, previewImage, picList } = this.state;
    const { getFieldDecorator } = form;
    const RadioGroup = Radio.Group;
    const cateModalData = cateData || {};
    console.log(cateModalData)
    const productData = (modalValues && modalValues.data) || {};
    const _roleIds = [];
    if (productData.wxList) {
      productData.wxList.forEach((el) => {
        if (el && el.id) _roleIds.push(el.id.toString());
      });
    }
    // const pCode = cateModalData.pCode && cateModalData.pCode !== 0 ? toString(cateModalData.pCode, 'SELECT') : undefined;
    const modalProps = {
      visible,
      wrapClassName: 'web',
      title: '查看/编辑/新增商家',
      width: 700,
      maskClosable: false,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      },
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const formItemLayout2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    };
    const initialAddress = [];
    if (cateModalData.state) initialAddress.push(cateModalData.state);
    if (cateModalData.city) initialAddress.push(cateModalData.city);
    if (cateModalData.district) initialAddress.push(cateModalData.district);
    // 图片
    // 获取初始化的图片列表
    let defaultPicList = [];
    if (cateModalData.logoUrl) {
      const picObj = JSON.parse(cateModalData.logoUrl.replace('&quot;'));
      defaultPicList = picObj.picList || [];
    }
    console.log(defaultPicList)
    // 操作加号
    let firstLoad = true;
    let showAddIcon = false;
    if (picList) firstLoad = false;
    if (firstLoad && defaultPicList.length < 1) showAddIcon = true;
    if (!firstLoad && picList && picList.length < 1) showAddIcon = true;

    const uploadProps = {
      action: '/uploadFile/picUpload',
      listType: 'picture-card',
      data(file) {
        return {
          pic: file.name,
        };
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/gif' || file.type === 'image/png';
        if (!isImg) { message.error('请上传图片文件'); }
        return isImg;
      },
      name: 'pic',
      onPreview(file) {
        p.setState({
          previewVisible: true,
          previewImage: file.url || file.thumbUrl,
        });
      },
      onChange(info) {
        p.setState({ picList: info.fileList });
        if (info.file.status === 'done') {
          if (info.file.response && info.file.response.success) {
            message.success(`${info.file.name} 成功上传`);
            // 添加文件预览
            const newFile = info.file;
            newFile.url = info.file.response.data;
          } else { message.error(`${info.file.name} 解析失败：${info.file.response.msg || info.file.response.errorMsg}`); }
        } else if (info.file.status === 'error') { message.error(`${info.file.name} 上传失败`); }
      },
    };
    return (
      <div className={styles.form}>
        <Modal
          {...modalProps}
        >
          <Form onSubmit={this.handleSubmit.bind(this)} style={{ marginLeft: 25 }}>
            <Row>
              <Col span={3} style={{ marginLeft: 20 }}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 9 }}
                  style={{ marginRight: '-20px' }}
                >
                  {getFieldDecorator('logoUrl', {
                    initialValue: defaultPicList,
                    valuePropName: 'fileList',
                    getValueFromEvent(e) {
                      if (!e || !e.fileList) {
                        return e;
                      }
                      const { fileList } = e;
                      return fileList;
                    },
                  })(
                    <Upload {...uploadProps}>
                      {showAddIcon && <div>
                        <Icon type="plus" className="uploadPlus" />
                        <div className="ant-upload-text">上传图片</div>
                      </div>}
                    </Upload>,
                  )}

                  <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </FormItem>

              </Col>
              <Col span={12}>
                <FormItem
                  label="公司名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('companyName', {
                    initialValue: cateModalData.companyName,
                    rules: [{
                      required: true, message: '请输入公司名'
                    }]
                  })(
                    <Input placeholder="" style={{ width: 410 }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="公司简介"
                  {...formItemLayout}
                >
                  {getFieldDecorator('intro', {
                    initialValue: cateModalData.intro,
                  })(
                    <Input style={{ width: 410, height: 60 }} />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{ width: '95%', height: 0, borderBottom: '#ccc 1px dashed' }}></div>
            <Row style={{ marginTop: 15 }}>
              <Col span={8}>
                <FormItem
                  label="登录名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('loginName', {
                    initialValue: cateModalData.loginName,
                    rules: [{
                      required: true, message: '请输入登录名'
                    }]
                  })(
                    <Input placeholder="" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="密码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('password', {
                    initialValue: 'wqVIP@123',
                    rules: [{
                      required: true, message: '请输入密码'
                    }]
                  })(
                    <Input placeholder="" disabled={true}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  label="联系人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('name', {
                    initialValue: cateModalData.name,
                    rules: [{
                      required: true, message: '请输入联系人'
                    }]
                  })(
                    <Input placeholder="" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="手机"
                  {...formItemLayout}
                >
                  {getFieldDecorator('phone', {
                    initialValue: cateModalData.phone,
                    rules: [{
                      required: true, message: '请输入手机号'
                    }]
                  })(
                    <Input placeholder="" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="邮箱"
                  {...formItemLayout}
                >
                  {getFieldDecorator('email', {
                    initialValue: cateModalData.email,
                  })(
                    <Input placeholder="" />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{ width: '95%', height: 0, borderBottom: '#ccc 1px dashed' }}></div>
            <Row style={{ marginTop: 6 }}>
              <Col>
                <FormItem
                  label="接入模式"
                  {...formItemLayout2}
                >
                  {getFieldDecorator('status', {
                    initialValue: cateModalData.status ? cateModalData.status : '2',
                    rules: [{
                      required: true,
                    }]
                  })(
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                      <Radio value="2">服务商模式</Radio>
                      <Radio value="1">商户模式</Radio>
                    </RadioGroup>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10} style={{ marginLeft: 5 }}>
                <FormItem
                  label="商户mch_id"
                  {...formItemLayout}
                >
                  {getFieldDecorator('mchId', {
                    initialValue: cateModalData.mchId,
                    rules: [{
                      required: true, message: '请输入商户mch_id'
                    }]
                  })(
                    <Input />)}
                </FormItem>
              </Col>
              {/* {showCate && <Col span={10} style={{ marginLeft: 5 }}>
                <FormItem
                  label="payKey"
                  {...formItemLayout}
                >
                  {getFieldDecorator('payKey1', {
                    initialValue: cateModalData.payKey,
                  })(
                    <Input />)}
                </FormItem>
              </Col>} */}
              {showMessage && <Col span={10} style={{ marginLeft: 5 }}>
                <FormItem
                  label="payKey"
                  {...formItemLayout}
                >
                  {getFieldDecorator('payKey2', {
                    initialValue: cateModalData.payKey,
                    rules: [{
                      required: true, message: '请输入payKey'
                    }]
                  })(
                    <Input />)}
                </FormItem>
              </Col>}
            </Row>
            <div style={{ width: '95%', height: 0, borderBottom: '#ccc 1px dashed' }}></div>
            <p style={{ marginTop: 8, marginLeft: 20, fontWeight: 'bold', marginBottom: 10 }}>中国大陆公司地址</p>
            <Row>
              <Col span={12} style={{ marginLeft: 14 }}>
                <FormItem
                  label="省市区"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 17 }}
                >
                  {getFieldDecorator('address', {
                    initialValue: initialAddress,
                  })(
                    <Cascader options={divisions} placeholder="请选择" popupClassName="cascaderPop" />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('fullAddress', {
                    initialValue: cateModalData.fullAddress,
                  })(
                    <Input placeholder="请输入详细地址" />)}
                </FormItem>
              </Col>
            </Row>
            <p style={{ marginLeft: 20, fontWeight: 'bold', marginBottom: 10 }}>海外公司地址</p>
            <Row>
              <Col span={8} style={{ marginLeft: 14 }}>
                <FormItem
                  label="国家"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 17 }}
                >
                  {getFieldDecorator('country', {
                    initialValue: cateModalData.country,
                  })(
                    <Select placeholder="请选择国家" allowClear>
                      {countries.map(country => <Option key={country.id} value={country.id}>{country.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('overseaAddress', {
                    initialValue: cateModalData.addressDetail,
                  })(
                    <Input placeholder="请输入海外详细地址" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="主要品类"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 17 }}
                >
                  {getFieldDecorator('mainCategory', {
                    initialValue: cateModalData.addressDetail,
                  })(
                    <Input placeholder="请输入主要品类" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={11} style={{ marginLeft: 6 }}>
                <FormItem
                  label="线下年销售额"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 17 }}
                  {...formItemLayout}
                >
                  {getFieldDecorator('offlineAnnualSale', {
                    initialValue: cateModalData.offlineAnnualSale,
                  })(
                    <InputNumber 
                    formatter={value => `${value}万元`}
                    parser={value => value.replace('万元', '')}
                    />)}
                </FormItem>
              </Col>
              <Col span={11} style={{ marginLeft: 6 }}>
                <FormItem
                  label="线上年销售额"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 17 }}
                  {...formItemLayout}
                >
                  {getFieldDecorator('onlineAnnualSale', {
                    initialValue: cateModalData.onlineAnnualSale,
                  })(
                    <InputNumber 
                    formatter={value => `${value}万元`}
                    parser={value => value.replace('万元', '')}
                    />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(BusinessModal);
