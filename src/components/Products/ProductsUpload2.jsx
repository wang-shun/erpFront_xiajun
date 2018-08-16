import React, { Component } from 'react';
import { Modal, Upload, Icon, Row, Col, Button, Form, Select } from 'antd';
import { connect } from 'dva';
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
      mao: '',
      Yay: 1,
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
  uploadModal() {
    console.log(this.props)
    const { dispatch, form, close } = this.props;
    dispatch({ type: 'products/queryItemList', payload: { pageIndex: 1 } });
    form.resetFields();
    close();
  }
  render() {
    const p = this;
    const { title, visible } = p.props;
    const { mao, Yay } = this.state;
    const modalProps = {
      visible,
      width: 1100,
      wrapClassName: 'modalStyle',
      title,
      maskClosable: false,
      closable: true,
      okText: '确定',
      onCancel() {
        p.closeModal();
      },
    };
    const uploadProps = {
      action: '/item/improtItem',

      // action: '/uploadFile/picUpload',
      // listType: 'picture-card',
      listType: 'text',
      multiple: true,
      headers: {
        authorization: 'authorization-text',
      },
      data(file) {
        return {
          file: file.name,
        };
      },
      name: 'file',
      onRemove() {
        p.setState({
          Yay: 2,
        })
      },
      onChange(info, test) {
        if (Yay == 2) {
          p.setState({
            mao: '',
            Yay: 1,
          })

        } else {
          if (info.file.response == undefined) {
            return
          }
          else {
            console.log(info.file.response.msg)
            let kk = info.file.response.msg
            p.setState({
              mao: kk,
            })
          }
        }
      },
    };
    return (
      <Modal {...modalProps}
        onOk={this.uploadModal.bind(this)}
      >
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
                  <Button>
                    <Icon type="upload"/>点击上传
                    {/* <div className="ant-upload-text">点击上传</div> */}
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem>
                <p style={{ marginLeft: '30px' }}>请上传Excel商品列表，每个表格最多1000条记录 <span style={{ textDecoration: 'underline' }}><a href="http://www.buyer007.com/商品导入模版v1.0.xls">商品导入模板下载</a></span></p>
                {mao && <div style={{ color: 'red', marginLeft: '30px' }}>提示信息：</div>}
                <div dangerouslySetInnerHTML={{ __html: mao }} style={{ color: 'red', marginLeft: '30px' }}></div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  const { } = state.products;
  return {};
}
export default connect(mapStateToProps)(Form.create()(ProductsUpload2));