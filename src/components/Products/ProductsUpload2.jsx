import React, { Component } from 'react';
import { Modal, message, Upload, Icon, Input, Row, Col, Button, Form, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
//import reqwest from 'reqwest';

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

function toString(str, type) {
  if (typeof str !== 'undefined' && str !== null) {

    return str.toString();
  }
  if (type === 'SELECT') return undefined;
  return '';
}

class ProductsUpload2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      mao: ''
    };

  }
  closeModal() {
    const { form, close } = this.props;
    form.resetFields();
    close();
    // 清理skuTable
    setTimeout(() => {
      this.setState({ defaultBuyer: undefined, defaultStartTime: undefined, defaultEndTime: undefined });
    }, 100);
  }
  render() {
    const p = this;
    const { title, visible } = p.props;
    const {mao} = this.state;
    const modalProps = {
      visible,
      width: 1100,
      wrapClassName: 'modalStyle',
      title,
      maskClosable: false,
      closable: true,
      okText: 'OK',
      onOk() {
        p.closeModal();
      },
      onCancel() {
        p.closeModal();
      },
    };
    const uploadProps = {
      action: '/item/improtItem',

      // action: '/uploadFile/picUpload',
      listType: 'picture-card',
      multiple: true,
      data(file) {
        return {
          file: file.name,
        };
      },
      name: 'file',
      onChange(info, test) {
        console.log(p)
        console.log(info)
        // console.log(info.file)
        console.log(info.file.response)
        if(info.file.response == undefined){
          return
        }
        else{
          console.log(info.file.response.msg)
          let kk = info.file.response.msg
          p.setState({
            mao: kk,
          })
        }
      },
    };
    return (
    <Modal {...modalProps}>
        <Form >
          <Row>
            <Col>
              <FormItem
                label="上传Excel商品列表"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
                style={{ marginRight: '-20px' }}
              >
                <Upload {...uploadProps}>
                    <Icon type="plus" className="uploadPlus" />
                    <div className="ant-upload-text">点击上传</div>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem>
                <p style={{marginLeft:'30px'}}>请上传Excel商品列表，每个表格最多200条记录</p>
                {mao && <div style={{color:'red', marginLeft:'30px'}}>提示信息：</div>}
                <div dangerouslySetInnerHTML={{__html:mao}} style={{color:'red', marginLeft:'30px'}}></div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ProductsUpload2);
