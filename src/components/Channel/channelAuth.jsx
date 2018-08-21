import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Input, Form, Table, Row, Col, Button, Modal, Popconfirm } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class channelAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      haihuVisible: false,
      title: '',
      fontColor: 'black',
    };
  }

  componentDidMount() {
    //console.log("dadfd");
    this.setState({
      fontColor: 'red'
    })
  }

  //授权
  //暂时只支持有赞的授权
  authorize(id) {
    //console.log("id..."+id);
    if (id) {
      this.props.dispatch({
        type: 'channel/getOauthUrl',
      });
      const { authUrl = {} } = this.props;
      // console.log("AuthUrl..." + authUrl)
      if (authUrl) {
        window.open(authUrl);
        this.setState({
          title: "授权是否成功"
        })
        this.showModal();
      }
    }
  }

  editChannel(id) {
    this.setState({
      haihuVisible: true
    })
  }

  stop(id) {
    // this.setState({
    //   haihuVisible: true
    // })
  }

  start(id) {
    
  }

  //弹出确认的模态框
  showModal() {
    this.setState({
      visible: true,
    }, () => {
        // console.log("hehe");
        // this.props.dispatch({
        //   type: 'products/queryBrand',
        //   payload: { id },
        // });
     
    });
  }


  //添加渠道，暂时和授权调用同一个接口
  handleSubmit() {
    // 清除多选
    const { authUrl = {} } = this.props;
    // const { flag } = this.state;
    //let s = flag;
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        if (values.channelCode) {
          if (1 == values.channelCode) { //有赞
            if (authUrl) {
              window.open(authUrl);
              //弹出用户确认的模态框
              this.setState({
                title: "添加渠道是否成功"
              })
              this.showModal();
            }      
          } 
          if (2 == values.channelCode) { //海狐
            this.setState({
              haihuVisible: true
            })
          }
        }          
      });
     
  }

  handleCancel() {
    const p = this;
    this.props.dispatch({
      type: 'channel/queryChannelList',
    });
    p.setState({
      visible: false,
      haihuVisible: false
    })
  }

  handleOkClick() {
    const p = this;
    this.props.dispatch({
      type: 'channel/queryChannelList',
    });
    p.setState({
      visible: false
    })
  }

  handleOkClickHaihu() {
    const p = this;
    this.props.dispatch({
      type: 'channel/queryChannelList',
    });
    p.setState({
      haihuVisible: false
    })
  }


  render() {
    const p = this;
    const { form, channelList = [], channelShopDO = {} } = this.props;
    const { getFieldDecorator } = form;
    const { haihuVisible, visible, title, fontColor } = this.state;
    let openInit = "正常";
    let channelInit = "";
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    if (channelShopDO) {
      if (channelShopDO.open != undefined && channelShopDO.open != null) {
        if (channelShopDO.open == false) {
          openInit = "停用";
        }
      }
    }
    if (channelShopDO) {
      if (channelShopDO.channelNo != undefined && channelShopDO.channelNo != null) {
        let cNo = channelShopDO.channelNo;
        switch(cNo) {
          case "1":channelInit = "有赞";break;
          case "2":channelInit = "海狐海淘";break;
        }
      }
    }
    const columns = [
      {
        title: '渠道名',
        dataIndex: 'channelNo',
        key: 'channelNo',
        render(text) {
          switch(text) {
            case "1":return "有赞";
            case "2":return "海狐海淘";
            // case "3":return "淘宝";
            // case "4":return "京东";
          }
        }
      },
      { title: '店铺名', dataIndex: 'shopName', key: 'shopName' },
      { title: '店铺编码', dataIndex: 'shopCode', key: 'shopCode' },
      { title: '有效期', dataIndex: 'expiresTime', key: 'expiresTime',
        render(t){
          var c = "black";
          //判断当前时间和有效期之间的间距
          var stime = Date.parse(new Date());
          //console.log(stime)
          var etime = Date.parse(t);
          //console.log(etime)
          var usedTime = etime - stime;  //两个时间戳相差的毫秒数
          //console.log(usedTime)
	        //计算出小时数
          var leave1=Math.floor(usedTime/(3600*1000));    //计算天数后剩余的毫秒数
          //console.log(leave1)
          if (24 >= leave1) {//距离现在24小时，显示红色字体
            c = "red";
          }         
          return(
            <p style={{color:c}}>{t}</p>
          );
        }
      },
      { title: '状态', dataIndex: 'open', key: 'open', 
        render(text) {
          if (true == text) {
            return(
              <p>正常</p>
            );
          } else {
            return(
              <p style={{color:"red"}}>停用</p>
            );
          }
        }
      },
      {
        title: '操作',
        key: 'oper',
        render(t, r) {
          if (1 == r.channelNo && true == r.open) {
            return (
              <div>
                <div>
                  <a href="javascript:void(0)" onClick={p.authorize.bind(p, r.id)} >授权</a>
                </div>   
                <div>
                  <a href="javascript:void(0)" onClick={p.stop.bind(p, r.id)} >停用</a>
                </div>  
             </div>        
            );
          }
          if (2 == r.channelNo && true == r.open) {
            return (
              <div>
                <div>
                  <a href="javascript:void(0)" onClick={p.editChannel.bind(p, r.id)} >编辑</a>
                </div>
                <div>
                  <a href="javascript:void(0)" onClick={p.stop.bind(p, r.id)} >停用</a>
                </div>
              </div>
            );
          }
          if (2 == r.channelNo && false == r.open) {
            return (
              <div>
                <div>
                  <a href="javascript:void(0)" onClick={p.editChannel.bind(p, r.id)} >编辑</a>
                </div>
                <div>
                  <a href="javascript:void(0)" onClick={p.start.bind(p, r.id)} >启用</a>
                </div>
              </div>
            );
          }
          if (1 == r.channelNo && false == r.open) {
            return (
              <div>
                <div>
                  <a href="javascript:void(0)" onClick={p.authorize.bind(p, r.id)} >授权</a>
                </div>  
                <div>
                  <a href="javascript:void(0)" onClick={p.start.bind(p, r.id)} >启用</a>
                </div>   
              </div>     
            );
          }
        },
      },
    ];
    return (
      <div>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Col span="5">
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('channelCode', {
                })(
                  <Select
                    allowClear
                    placeholder="请选择渠道"
                    showSearch
                  >
                    <Option value={1}>有赞</Option>
                    <Option value={2}>海狐</Option>
                    {/* <Option value={3}>淘宝</Option>
                    <Option value={4}>京东</Option> */}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span="4">
              <Button htmlType="submit" size="large" type="primary">添加渠道</Button>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800}}>
            <Col span="6">
              <FormItem
                {...formItemLayout}
              >
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                {...formItemLayout}
              >
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                {...formItemLayout}
              >
              </FormItem>
            </Col>
            <Col span="6" >
              <FormItem
                {...formItemLayout}

              >
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table columns={columns} dataSource={channelList} rowKey={r => r.id} bordered />
        {/* 下面的内容是两个模态框 */}
        {
          visible && 
          <Modal visible={visible} title={title} cancelText="否" okText="是" onCancel={this.handleCancel.bind(this)} onOk={this.handleOkClick.bind(this)}>
          </Modal>
        }
        {
          haihuVisible && 
          <Modal visible={haihuVisible} title="请确认海狐的渠道信息" cancelText="取消" okText="确定" onCancel={this.handleCancel.bind(this)} onOk={this.handleOkClickHaihu.bind(this)}>
            <Row>
              <Col>
              <FormItem
                label="渠道名"
                {...formItemLayout}
              >
                {getFieldDecorator('channelNo', {
                  initialValue: channelInit,
                })(
                  <Input disabled />,
                )}
              </FormItem>
              </Col>
           </Row>
           <Row>
              <Col>
              <FormItem
                label="店铺名"
                {...formItemLayout}
              >
                {getFieldDecorator('shopName', {
                  initialValue: channelShopDO.shopName,
                })(
                  <Input  />,
                )}
              </FormItem>
              </Col>
           </Row>
           <Row>
              <Col>
              <FormItem
                label="店铺编码"
                {...formItemLayout}
              >
                {getFieldDecorator('shopCode', {
                  initialValue: channelShopDO.shopCode,
                })(
                  <Input disabled/>,
                )}
              </FormItem>
              </Col>
           </Row>
           <Row>
              <Col>
              <FormItem
                label="有效期"
                {...formItemLayout}
              >
                {getFieldDecorator('expiresTime', {
                  initialValue: channelShopDO.expiresTime,
                })(
                  <Input disabled />,
                )}
              </FormItem>
              </Col>
           </Row>
           <Row>
              <Col>
              <FormItem
                label="状态"
                {...formItemLayout}
              >
                {getFieldDecorator('open', {
                  initialValue: openInit,
                })(
                  <Input disabled />,
                )}
              </FormItem>
              </Col>
           </Row>
         
         
          </Modal>
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { channelList, authUrl, channelShopDO } = state.channel;
  return { channelList, authUrl, channelShopDO};
}



export default connect(mapStateToProps)(Form.create()(channelAuth));


