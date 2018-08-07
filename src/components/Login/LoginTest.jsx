import React, { Component } from 'react';
import { Form, Row, Col, Button, Table } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import styles from './style.less';

@window.regStateCache
class LoginTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Code:'',
            LoginToken:'',
        };
    }
    componentDidMount() {
        var a =  this.props.location.query;
        let code = a.code;
        // let state = a.state;
        // console.log(code,state);
        // this.props.dispatch({ type: 'permission/authorizedWx', payload: { code,state } }); 
        // this.props.dispatch(routerRedux.push('/permission/user'));\
        // let a = 1;
        // let code = a;
        this.props.dispatch({ type: 'session/wechatLogin', payload: { code: code }, cb: () => { this.wxInfoMess(); }, });
        this.setState({
            Code: code,
        })
    }
    wxInfoMess() {
        const { wxInfo } = this.props;
        let wxStatus = parseInt(wxInfo.status);
        console.log(wxStatus)
        if (wxStatus == 1) {
            this.props.dispatch(routerRedux.push('/overview'));
        } else if (wxStatus == 0) {
            this.props.dispatch(routerRedux.push('/login'))
        } else if( wxStatus == 2){
            this.setState({
                LoginToken:wxInfo.loginToken,
            })
        }
    }
    selectWx(r) {
        const { Code, LoginToken } = this.state;
        this.props.dispatch({ type: 'session/loginByUserNo', payload: { code: Code, loginToken: LoginToken,userNo: r.userNo, companyNo: r.companyNo}, cb: () => {this.props.dispatch(routerRedux.push('/overview')); }, });
    }
    render() {
        const p = this;
        const { wxInfo } = p.props;
        let A = wxInfo.userInfo;
        // console.log(JSON.parse(A))
        console.log(A)
        const wxList = A ? JSON.parse(A) : [];
        const columnsSelectList = [
            {
                title: '操作',
                dataIndex: 'operator',
                key: 'operator',
                width: 160,
                render(t, r, index) {
                    return (
                        <div>
                            <p><Button type="primary" size="large" style={{ marginBottom: 5, marginRight: 10 }} onClick={p.selectWx.bind(p, r)}>{r.companyName}</Button></p>
                        </div>);
                },
            },
        ]
        return (
            <div className={styles.formLogin}>
                <Row>
                    <Col className={ styles.formInfo}><p>请选择商家登录</p></Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            columns={columnsSelectList}
                            dataSource={wxList}                      
                            size="large"
                            rowKey={record => record.userNo}
                            pagination={false}
                            showHeader={false}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { wxInfo } = state.session;
    return { wxInfo };
}

export default connect(mapStateToProps)(Form.create()(LoginTest));
