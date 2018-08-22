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
      haihuEditVisible: false,
      haihuEditModalValues: {},
      title: '',
      fontColor: 'black',
    };
  }

  componentDidMount() {
    this.setState({
      fontColor: 'red',
    })
  }

  refreshData() {
    this.props.dispatch({
      type: 'channel/queryChannelList',
    });
  }

  //编辑完海狐的渠道后提交
  editHaihuSubmit() {
    const p = this;
    const { dispatch, form } = this.props;
    const { haihuEditModalValues} = this.state;
    //编辑渠道
    form.validateFields((err, values) => {
      if (err) return;
      const { shopName, shopCode, open, expiresTime} = values;
      let channelNo = 2;
      let opens = true;
      if ("停用" == open) {
        opens = false;
      }
      let expireTime = new Date(expiresTime).format('yyyy-MM-dd HH:mm:ss');
      //console.log("va")
        dispatch({
          type: 'channel/saveHaihuInfo',
          payload: { id:haihuEditModalValues.id, channelNo:channelNo, shopName:shopName, shopCode:shopCode, open:opens, expiresTime:expireTime},
          // cb() {
          //   this.props.dispatch({
          //     type: 'channel/queryChannelList',
          //   });
          //   p.setState({
          //     haihuVisible: false
          //   })
          // },
        });      
    }); 
    p.setState({
          haihuEditVisible: false
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

  editHaihuChannel(r) {
    this.setState({
      haihuEditModalValues: r,
      haihuEditVisible: true
    })
  }

  //停用渠道
  stop(shopCode) {
    const p = this;
    const { dispatch, form } = this.props;
    dispatch({
      type: 'channel/changeOpen',
      payload: { shopCode: shopCode, open: false },
      cb: () =>{
        p.refreshData();
      }
    }); 
    
  }

  //启用渠道
  start(shopCode) {
    const p = this;
    const { dispatch, form } = this.props;
    dispatch({
      type: 'channel/changeOpen',
      payload: { shopCode: shopCode, open: true },
      cb: () =>{
        p.refreshData();
      }
    });       
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
      haihuVisible: false,
      haihuEditVisible: false,
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

  //海狐渠道的添加
  handleOkClickHaihu() {
    const p = this;
    const { dispatch, form } = this.props;
    //编辑渠道
    form.validateFields((err, values) => {
      if (err) return;
      const { shopName, shopCode, open, expiresTime} = values;
      let channelNo = 2;
      let opens = true;
      if ("停用" == open) {
        opens = false;
      }
      let expireTime = new Date(expiresTime).format('yyyy-MM-dd HH:mm:ss');
      //console.log("va")
        this.props.dispatch({
          type: 'channel/saveHaihuInfo',
          payload: { channelNo:channelNo, shopName:shopName, shopCode:shopCode, open:opens, expiresTime:expireTime},
          // cb() {
          //   this.props.dispatch({
          //     type: 'channel/queryChannelList',
          //   });
          //   p.setState({
          //     haihuVisible: false
          //   })
          // },
        });      
    }); 
    p.setState({
          haihuVisible: false
        })  
  }

  //渠道编码转渠道名字
  channelNoToName(channelShopDO) {
    if (channelShopDO) {
      if (channelShopDO.channelNo != undefined && channelShopDO.channelNo != null) {
        let cNo = channelShopDO.channelNo;
        switch(cNo) {
          case "1":channelShopDO.channelNo = "有赞";break;
          case "2":channelShopDO.channelNo = "海狐海淘";break;
        }
      }
    }
  }


  render() {
    const p = this;
    const { form, channelList = [], channelShopDO = {} } = this.props;
    const { getFieldDecorator } = form;
    const { haihuVisible, haihuEditVisible, visible, title, haihuEditModalValues} = this.state;
    let channelInit = "";
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    this.channelNoToName(channelShopDO);
    this.channelNoToName(haihuEditModalValues);
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
                  <a href="javascript:void(0)" onClick={p.stop.bind(p, r.shopCode)} >停用</a>
                </div>  
             </div>        
            );
          }
          if (2 == r.channelNo && true == r.open) {
            return (
              <div>
                <div>
                  <a href="javascript:void(0)" onClick={p.editHaihuChannel.bind(p, r)} >编辑</a>
                </div>
                <div>
                  <a href="javascript:void(0)" onClick={p.stop.bind(p, r.shopCode)} >停用</a>
                </div>
              </div>
            );
          }
          if (2 == r.channelNo && false == r.open) {
            return (
              <div>
                <div>
                  <a href="javascript:void(0)" onClick={p.editHaihuChannel.bind(p, r)} >编辑</a>
                </div>
                <div>
                  <a href="javascript:void(0)" onClick={p.start.bind(p, r.shopCode)} >启用</a>
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
                  <a href="javascript:void(0)" onClick={p.start.bind(p, r.shopCode)} >启用</a>
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
        {/* 有赞渠道添加的模态框 */}
        {
          visible && 
          <Modal visible={visible} title={title} cancelText="否" okText="是" onCancel={this.handleCancel.bind(this)} onOk={this.handleOkClick.bind(this)}>
          </Modal>
        }
        {/* 海狐渠道添加的模态框 */}
        {
          haihuVisible && 
          <Modal  visible={haihuVisible} title="添加海狐渠道" cancelText="取消" okText="确定" onCancel={this.handleCancel.bind(this)} onOk={this.handleOkClickHaihu.bind(this)}>
            <Row>
              <Col>
              <FormItem
                label="渠道名"
                {...formItemLayout}
              >
                {getFieldDecorator('channelNo', {
                  initialValue: channelShopDO.channelNo,
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
                  initialValue: channelShopDO.open == true ? "正常" : "停用",
                })(
                  <Input disabled />,
                )}
              </FormItem>
              </Col>
           </Row>                
          </Modal>
        }
        {/* 海狐渠道编辑的模态框 */}
        {
          haihuEditVisible && 
          <Modal  visible={haihuEditVisible} title="编辑海狐渠道" cancelText="取消" okText="确定" onCancel={this.handleCancel.bind(this)} onOk={this.editHaihuSubmit.bind(this)}>
            <Row>
              <Col>
              <FormItem
                label="渠道名"
                {...formItemLayout}
              >
                {getFieldDecorator('channelNo', {
                  initialValue: haihuEditModalValues.channelNo,
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
                  initialValue: haihuEditModalValues.shopName,
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
                  initialValue: haihuEditModalValues.shopCode,
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
                  initialValue: haihuEditModalValues.expiresTime,
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
                  initialValue: haihuEditModalValues.open == true ? "正常" : "停用",
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


