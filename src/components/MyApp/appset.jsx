import React, { Component } from 'react';
import { Form, Card, Button} from 'antd';
import { connect } from 'dva';


@window.regStateCache
class appset extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    geturlWx(){
        const { geturl } = this.props;
        console.log(geturl)
        window.open(geturl);           
    }
    newOpen(){
        window.open("https://mp.weixin.qq.com/")
    }
    render() {

        return (
            <div style={{ background: '#ECECEC',overflow:'hidden'}}>
                <div style={{ background: '#fff', height:50, fontSize:'14px', fontWeight:600,}}>只要您授权小程序给网擒天下全球购管理平台，无需任何开发，即可拥有自己的小程序商城</div>
                <div style={{ background: '#ECECEC', width:310,float:'left',margin:'30px'}}>
                    <Card bordered={false} style={{ width: 310, height:215 }}>
                        <p style={{ fontSize:'14px', fontWeight:600, textAlign:'center',marginBottom:'30px',marginTop:10}}>已经拥有微信小程序</p>
                        <p style={{textAlign:'center',marginBottom:'35px'}}>已注册微信小程序并通过验证</p>
                        <p style={{textAlign:'center'}}><Button size="large" type="primary" style={{width:200}} onClick={this.geturlWx.bind(this)}>授权微信小程序</Button></p>
                    </Card>
                </div>
                <div style={{ background: '#ECECEC', width:310,float:'left',margin:'30px 0px 30px 0px'}}>
                    <Card bordered={false} style={{ width: 310, height:215 }}>
                        <p style={{ fontSize:'14px', fontWeight:600, textAlign:'center',marginBottom:'30px',marginTop:10}}>还没有微信小程序</p>
                        <p style={{textAlign:'center'}}>点击下方按钮前往微信公众平台注册；注册</p>
                        <p style={{textAlign:'center',marginBottom:'17px'}}>成功后，再授权给网擒天下即可</p>
                        <p style={{textAlign:'center'}}><Button size="large" style={{width:200}} onClick={this.newOpen.bind(this)}>小程序官方注册</Button></p>
                    </Card>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { geturl } = state.appset;
    return { geturl };
}

export default connect(mapStateToProps)(Form.create()(appset));
