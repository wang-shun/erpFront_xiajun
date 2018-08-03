import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Row, Col, Table, Popover } from 'antd';
import styles from './style.less';

@window.regStateCache
class detailAgent extends Component {

    constructor() {
        super();
        this.state = {

        };
    }
    componentDidMount() {
        var a = this.props.location.query;
        console.log(a)
        this.props.dispatch({
            type: 'order/agentInfo',
            payload: {
                userNo: a.userNo,
                status: a.status,
            },
        });
    }
    render() {
        const p = this;
        const { agentInfoList = {} } = this.props;
        var a = this.props.location.query;
        var statusA = a.status;
        console.log(statusA)
        const columnsAgent = [
            {
                title: '订单号',
                dataIndex: 'subOrderNo',
                key: 'subOrderNo',
                width: '12%',
                render(t, r) {
                    return (
                        <span>订单号：{r.subOrderNo}</span>
                    );
                }
            },
            {
                title: '',
                dataIndex: 'skuPic',
                key: 'skuPic',
                width: '12%',
                render(text) {
                    if (!text) return '-';
                    let picUrl = "";
                    if (JSON.parse(text).picList) {
                        const picList = JSON.parse(text).picList;
                        picUrl = (picList.length && picList[0]) ? picList[0].url : '';
                    } else {
                        picUrl = "http://img.haihu.com/25_1528347764630.jpg?x-oss-process=image/resize,w_200/auto-orient,0";
                    }
                    const t = picUrl;
                    return (
                        t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
                            <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
                        </Popover> : '-'
                    );
                },
            },
            {
                title: '商品名',
                dataIndex: 'itemName',
                key: 'itemName',
                width: '12%',
            },
            {
                title: '销售价格',
                dataIndex: 'salePrice',
                key: 'salePrice',
                width: '12%',
                render(t, r) {
                    return (
                        <div>
                            <span>¥ {r.salePrice}</span>
                            <br />
                            <span>{r.scale}</span>
                            <span style={{ marginLeft: 10 }}>x{r.quantity}</span>
                        </div>
                    );
                }
            },
            { title: '收货人地址', dataIndex: 'receiverInfo', key: 'receiverInfo', width: '12%' },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: '12%',
                render(text) {
                    switch (text) {
                        case 0: return <font color="#ff642e">待付款</font>;
                        case 3: return <font color="#ff642e">已付款待发货</font>;
                        case 1: return <font color="#ff642e">部分发货</font>;
                        case 2: return <font color="#0c97a1">全部发货</font>;
                        case -1: return <font color="#ff2e38">关闭</font>;
                        case -3: return <font color="#ff2e38">售后处理中</font>;
                        case -4: return <font color="#549707">售后完成</font>;
                        case 4: return <font color="#549707">订单完成</font>;
                        case 5: return <font color="#549707">已签收</font>;
                        case 6: return <font color="red">新建</font>;
                        default: return '-';
                    }
                },

            },
            { title: '销售时间', dataIndex: 'orderTime', key: 'orderTime', width: '12%' },
            {
                title: '佣金金额',
                dataIndex: 'totalSettlement',
                key: 'totalSettlement',
                width: '16%',

            }
        ]
        return (
            <div>
                <div style={{ height: 85, borderTop: '2px solid #00cbd7', borderBottom: '1px solid #f4f4f4', borderLeft: '1px solid #f4f4f4', borderRight: '1px solid #f4f4f4', color: '#4a4a4a', marginBottom: '20px' }}>
                    <Row >
                        <Col span={2} style={{ fontSize: 25, padding: '10px 0px 0px 20px' }}>
                            <span><img role="presentation" src={agentInfoList.profile} width={60} height={60} /></span>
                        </Col>
                        <Col span={2} style={{ fontSize: 25, padding: '20px 0px 0px 20px' }}>
                            <span>{agentInfoList.name}</span>
                        </Col>
                        <Col span={4} style={{ fontSize: 14, padding: '30px 0px 0px 0px' }}>
                            <span>{agentInfoList.agentLevel}</span>
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={14} style={{ fontSize: 20, padding: '25px 0px 0px 0px' }}>
                            {statusA == '1' && <span>可结算佣金 ¥ {agentInfoList.commission}</span>}
                            {statusA == '0' && <span>待结算佣金 ¥ {agentInfoList.commission}</span>}
                            {statusA == '2' && <span>已结算佣金 ¥ {agentInfoList.commission}</span>}
                        </Col>
                    </Row>
                </div>
                <Form>
                    <Row>
                        <Col>
                            <Table
                                columns={columnsAgent}
                                dataSource={agentInfoList.orderInfo}
                                size="large"
                                rowKey={record => record.subOrderNo}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ order }) {
    const { agentInfoList } = order;
    return {
        agentInfoList,
    };
}

export default connect(mapStateToProps)(Form.create()(detailAgent));
