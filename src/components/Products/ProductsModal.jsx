import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Input, Upload, Row, Col, Select, DatePicker, Form, Icon, Tabs, Radio, Cascader } from 'antd';
import moment from 'moment';  
import 'moment/locale/zh-cn';

import check from '../../utils/checkLib';
import SkuTable from './SkuTable';
import styles from './Products.less';

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

let editor = null;

function toString(str, type) {
  if (typeof str !== 'undefined' && str !== null) {
    return str.toString();
  }
  if (type === 'SELECT') return undefined;
  return '';
}
class ProductsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      picList: null,
      activeTab: '1',
      defaultBuyer: undefined,
      countryNameExit: false,
      skuvalue:'',
      channelSkuList:[],
      picUploadDisabled:false,
      idCardDefault:1,
    };
    // skuTable改写父级方法
    this.getSkuValue = null;
    this.clearSkuValue = null;
  }

  changeIdCardDefaultValue = (e) => {
    if (1 == e.target.value) {
      this.setState({
        idCardDefault:1
      });
    } else {
      this.setState({
        idCardDefault:0
      });
    }
  }

  // componentWillUpdate() {
   
  //   // const { modalValues = {} } = this.props;
  //   // const productData = (modalValues && modalValues.data) || {};
  //   // if (productData) {
  //   //   this.setState({
  //   //     idCardDefault: productData.idCard,
  //   //   })
  //   // }
  // }

  componentDidMount() {
    console.log("componentDidMount...")
    const { modalValues = {} } = this.props;
    const productData = (modalValues && modalValues.data) || {};
    const { channels = []} = this.props;
    let arrayA = channels;
    this.setState({
      skuvalue: arrayA,
    })
    // console.log(productData)
    // if (productData) {
    //   this.setState({
    //     idCardDefault: productData.idCard,
    //   })
    // }
  }



  changeActiveKey(id) {
    if (id === '2') {
      if (editor) editor.undestroy();
      else {
        /* eslint-disable */
        setTimeout(() => {
          editor = new wangEditor('editor-area');
          editor.config.uploadImgUrl = '/uploadFile/picUpload';
          editor.config.uploadImgFileName = 'pic';

          // 自定义load事件
          editor.config.uploadImgFns.onload = function (resultText, xhr) {
            var originalName = editor.uploadImgOriginalName || '';
            editor.command(null, 'insertHtml', '<img src="' + JSON.parse(resultText).data + '" alt="' + originalName + '" style="max-width:100%;"/>');
          };
          editor.create();

          // 赋值
          const { modalValues } = this.props;
          //editor.$txt.html(modalValues && modalValues.data && decodeURIComponent(modalValues.data.detail || ''));
          editor.$txt.html(modalValues && modalValues.data && modalValues.data.detail);
        }, 0);
        /* eslint-enable */
      }
    }
    this.setState({ activeTab: id });
  }

  handleSubmit() {
    const p = this;
    const { form, dispatch, modalValues } = this.props;
    const { getFieldValue } = this.props.form;
    if (-1 == getFieldValue('country')) {
      message.error('请填写新的国家名');
      return;
    }
    
    form.validateFieldsAndScroll((err, fieldsValue) => {
      // console.log(fieldsValue);
      if (err) {
        return;
      }
      if (fieldsValue.defaultBuyer) fieldsValue.buyerName = fieldsValue.defaultBuyer;
      delete fieldsValue.defaultBuyer;
      // 检验sku是否填写
      p.getSkuValue((skuList) => {
        const values = {
          ...fieldsValue,
          skuList,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY-MM-DD HH:mm:ss'),
          saleOnChannels: fieldsValue.saleOnChannels,
          categoryCode: fieldsValue.categoryCode[fieldsValue.categoryCode.length - 1],
        };
       
        // 处理图片
        if (values.mainPic) {
          const uploadMainPic = [];
          const mainPicNum = values.mainPicNum;
          values.mainPic.forEach((el, index) => {
            uploadMainPic.push({
              type: el.type,
              uid: `i_${index}`,
              url: el.url || el.response.data,
            });
          });
          values.mainPic = JSON.stringify({ picList: uploadMainPic, mainPicNum });

          values.skuList.forEach((el) => {
            if (el.skuPic && JSON.parse(el.skuPic).picList && JSON.parse(el.skuPic).picList.length === 0) {
              el.skuPic = JSON.stringify({ picList: [uploadMainPic[mainPicNum - 1]] });
            }
          });
        }
        // 处理skuRate
        values.skuList.forEach((el) => {
          if(el.skuRateString) {
            el.skuRateString = el.skuRateString.toString();
          } else {
            el.skuRateString = "0";
          }
        });

        //禁止提交的upc之中出现重复
        let upcArray = [];
        values.skuList.forEach((el) => {
          if (el.upc) {        
            for (let i = 0;i < upcArray.length;i++) {
              if (el.upc == upcArray[i]) {
                message.error("输入的upc不可以重复，请在此输入");
                return;
              }             
            }
            upcArray.push(el.upc);
          } 
        });

        function deleteNullElement(e) {
          return e!=null && e!=undefined;
        }
       
        
        values.skuList = JSON.stringify(values.skuList);
        

        // 处理图文详情
        const detailInfo = editor && editor.$txt && editor.$txt.html();
        const lastDetailInfo = modalValues && modalValues.data && modalValues.data.detail;
        values.detail = detailInfo ? encodeURIComponent(detailInfo) : lastDetailInfo ? encodeURIComponent(lastDetailInfo) : '';

        if (modalValues && modalValues.data) {
          dispatch({
            type: 'products/updateProducts',
            payload: { ...values, id: modalValues.data.id },
            cb() { p.closeModal(); },
          });
        } else {
          dispatch({
            type: 'products/addProducts',
            payload: { ...values },
            cb() { p.closeModal(); },
          });
        }
      });
    });
  }


  

  closeModal() {
    const { form, close } = this.props;
    form.resetFields();
    close();
    // 清理skuTable
    setTimeout(() => {
      this.clearSkuValue();
      // 清理编辑器
      if (editor) {
        editor.$txt.html('');
        editor.destroy();
      }
      editor = null;
      this.setState({ activeTab: '1', defaultBuyer: undefined });
    }, 100);
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }


  checkImg(rules, values, cb) {
    cb();
  }

  checkTel(rules, value, cb) {
    if (value && !check.phone(value)) cb('请输入正确的手机号码');
    cb();
  }

  checkEndDate(rules, value, cb) {
    const { getFieldValue } = this.props.form;
    if (!value) cb('请选择日期');
    if (!getFieldValue('startDate') && value) cb('请先填写开始时间');
    cb();
  }

  disabledEndDate(endDate) {
    const { getFieldValue } = this.props.form;
    const startDate = getFieldValue('startDate');
    if (!startDate) return false;
    return endDate < startDate;
  }

  checkMainPicNum(rules, value, cb) {
    if (this.props.form.getFieldValue('mainPic').length > 0 && !value) {
      cb(new Error('请选择主图'));
    } else cb();
  }

  interator(arr, value, data = []) {
    const p = this;
    arr.forEach((el) => {
      if (el.id.toString() === value) data.push(el);
      else if (el.children.length) p.interator(el.children, value, data);
    });
    return data;
  }

  chooseCate(rules, value, cb) {
    const { tree } = this.props;
    if (!value) cb('请选择类目');
    else {
      const data = this.interator(tree, value) || [];
      if (data[0] && data[0].level !== 3) cb('只能选择最后一级类目');
    }
    cb();
  }

  handleChangeBuyer(defaultBuyer) {
    this.setState({ defaultBuyer });
  }

  handleSelectCountry(country) {
    if (country === '-1') {
      this.setState({
        countryNameExit: true,
      });
    } else this.setState({ countryNameExit: false });
  }

  handleAddCountry() {
    const { form, dispatch } = this.props;
    const country = form.getFieldValue('newCountry');
    if (country) {
      dispatch({
        type: 'products/addCountry',
        payload: {
          payload: {
            name: country,
          },
          success(res) {
            form.setFieldValue('newCountry', res.id);
          },
        },
      });
    }
  }
  handleChange(value){
    //console.log("value...."+value)
    const { channels = []} = this.props;
    //console.log("channels...."+channels)
    let arrayA = channels;
    let arrayB = value;
    let arrayC = arrayA.filter((a, i) =>{
      return (arrayB.some(f=>(f === a.channelName)))
    })

    this.setState({
      skuvalue: arrayC,
    })
  }
  render() {
   
    const p = this;
    const { form, visible, allBrands = [], modalValues = {}, tree = [], packageScales, scaleTypes, allBuyers = [], countries = [], channels = [] } = this.props;
    //console.log(channels)
    const {idCardDefault, picUploadDisabled,previewVisible, previewImage, activeTab, countryNameExit, skuvalue } = this.state;
    const { getFieldDecorator } = form;
    let idCardDefaults = idCardDefault;
    // 图片字符串解析
    let mainPicNum;
    let picList = [];
   
    if (modalValues.data && modalValues.data.mainPic) {
      //console.log("main:"+modalValues.data.mainPic);
      const picObj = JSON.parse(modalValues.data.mainPic);
      mainPicNum = toString(picObj.mainPicNum, 'SELECT') || '1';
      picList = picObj.picList || [];
    }


    if (modalValues.data) {
      idCardDefaults = modalValues.data.idCard;     
    }

    // 详情数据
    const productData = (modalValues && modalValues.data) || {};


    const _roleIds = [];
    if (productData.wxList) {
      productData.wxList.forEach((el) => {
        if (el && el.id) _roleIds.push(el.id.toString());
      });
    }
    const modalProps = {
      visible,
      width: 1350,
      wrapClassName: 'modalStyle',
      title: productData.itemCode ? '修改' : '添加',
      maskClosable: false,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      },
    };
    const uploadProps = {
      action: '/uploadFile/picUpload',
      listType: 'picture-card',
      multiple: true,
      data(file) {
        //console.log("...data");
        return {
          pic: file.name,
        };
      },
      beforeUpload(file) {
        const filesList = p.state.picList || [];
        if(14 <= filesList.length) {
          //console.log("enter");
          message.info('您已上传15张，不可再传');
          p.setState({ picUploadDisabled: true });
        }
        //console.log("...beforeUpload");
        const isImg = file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/gif' || file.type === 'image/png';
        if (!isImg) { message.error('请上传图片文件'); }
        return isImg;
      },
      name: 'pic',
      onPreview(file) {
        //console.log("...onPreview");
        p.setState({
          previewVisible: true,
          previewImage: file.url || file.thumbUrl,
        });
       
      },
      onChange(info) {
        //console.log("...onChange");
        if (info.file.status === 'done') {
          if (info.file.response && info.file.response.success) {
            message.success(`${info.file.name} 成功上传`);
            // 添加文件预览
            const newFile = info.file;
            newFile.url = info.file.response.data;
          } else { message.error(`${info.file.name} 解析失败：${info.file.response.msg || info.file.response.errorMsg}`); }
        } else if (info.file.status === 'error') { message.error(`${info.file.name} 上传失败`); }
        // 主图选项增删联动
        const fileList = p.state.picList || [];
        const newFileList = info.fileList;
        const selectedMainPicNum = p.props.form.getFieldValue('mainPicNum');
        if (newFileList.length === 1 || (newFileList.length < fileList.length && selectedMainPicNum > newFileList.length)) {
          p.props.form.setFieldsValue({ mainPicNum: '1' });
        }
        p.setState({ picList: info.fileList });
      },
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItemLayoutSpecial = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const formItemLayoutWxIsSale = {
      labelCol: { span: 8 },
      wrapperCol: { span: 13 },
    };
    const fileListSource = this.state.picList || picList;

    let selectedCategoryCode = [];

    if (productData.categoryCode) {
      tree.forEach((el) => {
        if (el.children) {
          el.children.forEach((el2) => {
            if (el2.children) {
              el2.children.forEach((el3) => {
                if (el3.categoryCode.toString() === productData.categoryCode.toString()) {
                  selectedCategoryCode = [el.categoryCode.toString(), el2.categoryCode.toString(), el3.categoryCode.toString()];
                }
              });
            }
          })
        }
      })
    }

   //console.log(".......................")

    return (
      <Modal
        {...modalProps}
        className={styles.modalStyle}
      >
        <Tabs activeKey={activeTab} type="card" onChange={this.changeActiveKey.bind(this)}>
          <TabPane tab="基本信息" key="1">
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <Row>
                <Col span={7}>
                  <FormItem
                    label="商品类型"
                    {...formItemLayout}
                    required="true"
                  >
                    {getFieldDecorator('isAbroad', {
                      initialValue: productData.isAbroad == 0 ? 0 : 1,
                    })(
                      <RadioGroup onChange={this.changeIdCardDefaultValue} >
                        <Radio value={1}>海外商品</Radio>
                        <Radio value={0}>国内商品</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem
                    label="品牌"
                    {...formItemLayout}
                    required="true"
                  >
                    {getFieldDecorator('brand', {
                      initialValue: toString(productData.brand, 'SELECT'),
                      rules: [{ required: true, message: '请输入品牌' }],
                    })(
                      <Select
                        allowClear
                        placeholder="请输入品牌"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {allBrands && allBrands.map(item => <Option key={item.name}>{item.name}</Option>)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <FormItem
                    label="商品名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('name', {
                      initialValue: toString(productData.name),
                      rules: [{ required: true, message: '请输入商品名称' }],
                    })(
                      <Input placeholder="请输入商品名称" maxLength="60"/>,
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem
                    label="商品分组"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('itemGroup', {
                      rules: [{ message: '请输入分组' }],
                    })(
                      <Input placeholder="请输入分组" maxLength="60"/>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <FormItem
                    label="三级类目"
                    required="true"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('categoryCode', {
                      initialValue: selectedCategoryCode,
                      rules: [{ required: true, validator: this.chooseCate.bind(this) }],
                    })(
                      <Cascader options={tree} placeholder="请选择所属类目" expandTrigger="hover"/>,
                      // <TreeSelect placeholder="请选择所属类目" treeDefaultExpandAll treeData={tree} />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={7}>
                  <FormItem
                    label="选择国家"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('country', {
                      initialValue: productData.country, // toString(, 'SELECT'),
                      rules: [{ required: true, message: '请选择国家'}],
                    })(
                      <Select placeholder="请选择国家" allowClear onChange={this.handleSelectCountry.bind(this)}>
                        {countries.map(country => <Option key={country.id} value={country.id}>{country.name}</Option>)}
                        <Option key="_other" value="-1">其他</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                {countryNameExit && [<Col span={7} key="_1">
                  <FormItem
                    label="新国家名"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('newCountry', {
                      initialValue: productData.newCountry,
                    })(
                      <Input placeholder="请输入新国家名" />,
                    )}
                  </FormItem>
                </Col>, <Col span={7} key="_2">
                  <FormItem><Button style={{ marginLeft: 10 }} type="primary" size="small" onClick={this.handleAddCountry.bind(this)} >添加</Button></FormItem>
                </Col>]}
              </Row>
            
              <Row>
                <Col span={7}>
                  <FormItem
                    label="小程序可售"
                     {...formItemLayoutWxIsSale}
                   
                    required="true"
                  >
                    {getFieldDecorator('wxisSale', {
                      initialValue: productData.wxisSale == 0 ? 0 : 1, 
                    })(
                      <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem
                    label="是否身份证"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('idCard', {
                      initialValue:  idCardDefaults,
                      rules: [{ required: true, message: '请选择是否身份证' }],
                    })(
                      <RadioGroup>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={9}>
                  <FormItem
                    label="上架时间"
                    {...formItemLayoutSpecial}
                    required="true"
                  >
                    {getFieldDecorator('shelfMethod', {
                      initialValue: productData.shelfMethod || 0,
                    })(
                      <RadioGroup on>
                        <Radio value={0}>立即上架售卖</Radio>
                        <Radio value={1}>暂不售卖</Radio>
                        <Radio value={2}>自定义上架时间</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem
                  >
                    {getFieldDecorator('startTime', {
                      initialValue: (productData.startDate && moment(productData.startDate, 'YYYY-MM-DD HH:mm:ss')) || moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                      rules: [{ required: true, message: '请选择' }],
                    })(
                      <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                    )}
                  </FormItem>
                </Col>

              </Row>
              <Row>
                <Col span={21}>
                  <FormItem
                    label="添加图片"
                    required="true"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                  >
                    {getFieldDecorator('mainPic', {
                      initialValue: picList,
                      valuePropName: 'fileList',
                      getValueFromEvent(e) {
                        if (!e || !e.fileList) {
                          return e;
                        }
                        const { fileList } = e;
                        if (fileList[0] && ['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(fileList[0].type) === -1) {
                          fileList.shift();
                        }
                        return fileList;
                      },
                      rules: [{ validator: this.checkImg.bind(this) }],
                    })(
                      <Upload {...uploadProps} disabled={picUploadDisabled} >
                        <Icon type="plus" className={styles.uploadPlus} />
                        <div className="ant-upload-text"  >上传图片</div>
                      </Upload>,
                    )}

                    <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                {fileListSource.length > 0 && <Col span={7}>
                  <FormItem
                    label="选择主图"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('mainPicNum', {
                      initialValue: mainPicNum,
                      rules: [{ validator: this.checkMainPicNum.bind(this) }],
                    })(
                      <Select placeholder="请选择主图" allowClear>
                        {fileListSource.map((el, index) => (
                          <Option key={index} value={(index + 1).toString()}>{`图片${index + 1}`}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>}
              </Row>
              <Row>
                  <p style={{marginLeft:"11%" ,width: '80%'}}>
                  建议尺寸：800*800像素，最多上传15张
                  </p>
              </Row>
              <Row>
                <SkuTable
                  data={productData.itemSkus}
                  packageScales={packageScales}
                  scaleTypes={scaleTypes}
                  parent={p}
                  sve = {skuvalue}
                />
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="商品详情" key="2">
            <div id="editor-area" />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { packageScales, scaleTypes } = state.sku;
  const { channels } = state.products;
  // const { allBrands } = state.products;
  return {
    packageScales,
    scaleTypes,
    channels,
  };
}

export default connect(mapStateToProps)(Form.create()(ProductsModal));
