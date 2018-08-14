import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Form, Input, Tabs, Popover, Popconfirm, InputNumber, Button, Modal, message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
@window.regStateCache
class channelInstall extends Component {

    constructor() {
        super();
        this.state = {
            activeTab: '1',
            selectedRowKeys: [],
            showModalChannel: false,
            title: '',
            outDetailList: [],
            newDiscount: 1,
            confirmChannelNo: '',
        };
    }
    changeActiveKey(key) {
        this.setState({
            activeTab: key,

        })
    }
    onSearchOne(value) {
        console.log(value)
        if (value == '') {
            this.props.dispatch({
                type: 'channel/queryItemSkuPriceList',
                payload: {},
            });
        } else {
            this.props.dispatch({
                type: 'channel/queryItemSkuPriceList',
                payload: {
                    channelPriceKey: value,
                },
            });
        }
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    handlePrice(r) {
        // console.log(r)
        if (r.channelSalePriceList) {
            let oldArray = r.channelSalePriceList;
            let newArray = [];
            oldArray.forEach(function (v) { newArray.push(v.channelSkuKey); });
            for (var j = 0, len = newArray.length; j < len; j++) {
                newArray[j] = 'r_' + newArray[j] + '_salePrice'
            }
            //console.log(newArray)

            const { form } = this.props;
            form.validateFields((err, values) => {
                var a = newArray;
                var b = values;
                //console.log(b)

                let aAttLength = newArray.length
                for (let att in b) {
                    for (var k = 0; k < aAttLength; k++) {
                        if (newArray[k] == att)
                            break;
                    }
                    if (k == aAttLength) {
                        delete b[att]
                    }
                }
                // console.log(b)
                // console.log(r)
                let channelSalePriceLists = r.channelSalePriceList
                let cLength = channelSalePriceLists.length
                for (let i = 0; i < cLength; i++) {
                    let curPrice = channelSalePriceLists[i]
                    let key = curPrice.channelSkuKey
                    curPrice.salePrice = b["r_" + key + "_salePrice"]
                    console.log(b["r_" + key + "_salePrice"])
                }
                console.log(r)
                const skuChannelPriceEditVO = {
                    itemCode: r.itemCode,
                    skuCode: r.skuCode,
                    channelSalePriceList: r.channelSalePriceList
                }
                console.log(skuChannelPriceEditVO)
                this.props.dispatch({
                    type: 'channel/saveOneItemSkuMultiPrice',
                    payload: { skuChannelPriceEditVO: JSON.stringify(skuChannelPriceEditVO) },
                    cb: () => {
                        this.props.dispatch({
                            type: 'channel/queryItemSkuPriceList',
                            payload: {},
                        })
                    }
                })
            })
        }
    }
    showModal(r) {
        this.props.form.validateFieldsAndScroll([`r_${r.id}_discountPercent`], (err, values) => {
            let discountSale = values["r_" + r.id + "_discountPercent"]
            console.log(discountSale)
            if (discountSale == undefined) {
                message.error('请先填写折扣')
                return;
            } else (
                this.props.dispatch({
                    type: 'channel/querySkuSalePrice',
                    payload: { channelNo: r.channelNo },
                    cb: () => {
                        this.setState({
                            showModalChannel: true,
                            title: '预览',
                            newDiscount: discountSale,
                            confirmChannelNo: r.channelNo,
                        })
                    },
                })
            )


        })
    }
    handleCancel() {
        this.setState({
            showModalChannel: false,
        })
    }
    handleSubmit() {
        const { newDiscount, confirmChannelNo } = this.state;
        console.log(newDiscount, confirmChannelNo)
        this.props.dispatch({
            type: 'channel/saveAllItemSkuInOneChannelPrice',
            payload: { channelNo: confirmChannelNo, discountPercent: newDiscount },
            cb: () => {
                // message.success('批量修改价格成功')
                this.props.dispatch({
                    type: 'channel/queryItemSkuPriceList',
                    payload: {},
                })
                this.setState({
                    showModalChannel: false,
                })
            },
        })
    }
    render() {
        const p = this;
        const { activeTab, selectedRowKeys, showModalChannel, title, newDiscount } = p.state;
        const { channelSkuList = [], form, queryListShop = [], saleDetailList = [] } = p.props;
        const { getFieldDecorator } = form;
        const columnsAgent = [
            {
                title: '图片',
                dataIndex: 'skuPic',
                key: 'skuPic',
                width: '10%',
                render(text) {
                    if (!text) return '-';
                    const picList = JSON.parse(text).picList;
                    const t = (picList.length && picList[0]) ? picList[0].url : '';
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
                width: '10%',
            },
            {
                title: 'SKU代码',
                dataIndex: 'skuCode',
                key: 'skuCode',
                width: '10%',
            },
            {
                title: 'UPC',
                dataIndex: 'upc',
                key: 'upc',
                width: '10%',
            },
            {
                title: '销售价',
                dataIndex: 'salePrice',
                key: 'salePrice',
                width: '5%',
            },
            {
                title: '渠道供货价',
                dataIndex: 'channelSalePriceList',
                key: 'channelSalePriceList',
                width: '50%',
                render(t, r) {
                    return (
                        <div>
                            <ul id="ul_rwardList">
                                {
                                    t.map((val, index) => {
                                        return (
                                            <li className="db vh" key={val.channelSkuKey} style={{ float: 'left', marginLeft: 5 }}>
                                                <div>
                                                    {val.channelNo == 1 && <span>有赞</span>}
                                                    {val.channelNo == 2 && <span>海狐</span>}
                                                    {val.channelNo == 3 && <span>淘宝</span>}
                                                    {val.channelNo == 4 && <span>京东</span>}
                                                    {val.channelNo == 101 && <span>微信公众号</span>}
                                                    {val.channelNo == 102 && <span>微信</span>}
                                                    {/* <span><Input placeholder="请输入价格" style={{ width: '80%', marginLeft: 10 }} /></span> */}
                                                    <span style={{ display: 'inline-block' }}>
                                                        <FormItem label="" >
                                                            {getFieldDecorator(`r_${val.channelSkuKey}_salePrice`, {
                                                                rules: [{ required: true, message: '请输入价格' }],
                                                                initialValue: val.salePrice,
                                                            })(

                                                                <InputNumber placeholder="请输入价格" style={{ width: '50%', marginLeft: 10 }} />,
                                                            )}
                                                        </FormItem>
                                                    </span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    );
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '5%',
                render(t, r) {
                    return (
                        <div>
                            <Popconfirm title="确定修改渠道价格？" onConfirm={p.handlePrice.bind(p, r)}>
                                <a href="javascript:void(0)" style={{ marginLeft: 10 }}>修改价格</a>
                            </Popconfirm>
                        </div>
                    );
                }
            },
        ]
        const columnsBinding = [
            {
                title: '渠道',
                dataIndex: 'channelNo',
                key: 'channelNo',
                width: '10%',
                render(text) {
                    switch (text) {
                        case '1': return '有赞';
                        case '2': return '海狐海淘';
                        case '3': return '淘宝';
                        case '4': return '京东';
                        case '101': return '微信';
                        case '102': return '微信小程序';
                        default: return '-';
                    }
                },
            },
            {
                title: '折扣',
                dataIndex: 'discountPercent',
                key: 'discountPercent',
                width: '10%',
                render(t, r) {
                    return (
                        <FormItem>
                            {getFieldDecorator(`r_${r.id}_discountPercent`, )(
                                <InputNumber placeholder="请填写佣金" min={0} max={100} style={{ width: 120 }} />
                            )}
                            <span style={{ marginLeft: 5 }}>%</span>
                        </FormItem>
                    );
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '10%',
                render(t, r) {
                    return (
                        <div>
                            <Button type="primary" size="large" onClick={p.showModal.bind(p, r)}>预览</Button>
                        </div>
                    );
                }
            },
        ]
        const modalTableProps = {
            columns: [
                {
                    title: '图片',
                    dataIndex: 'skuPic',
                    key: 'skuPic',
                    width: '10%',
                    render(text) {
                        if (!text) return '-';
                        const picList = JSON.parse(text).picList;
                        const t = (picList.length && picList[0]) ? picList[0].url : '';
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
                    width: '10%',
                },
                {
                    title: 'SKU代码',
                    dataIndex: 'skuCode',
                    key: 'skuCode',
                    width: '10%',
                },
                {
                    title: 'UPC',
                    dataIndex: 'upc',
                    key: 'upc',
                    width: '10%',
                },
                {
                    title: '参考采购价',
                    dataIndex: 'salePrice',
                    key: 'salePrice',
                    width: '10%',
                },
                {
                    title: '销售价格',
                    dataIndex: 'upc2',
                    key: 'upc2',
                    width: '10%',
                    render(t, r) {
                        return (
                            <div>{r.salePrice * newDiscount / 100}</div>
                        );
                    }
                },
            ],
            dataSource: saleDetailList,
            bordered: true,
            pagination: true,
        };
        return (
            <Tabs activeKey={activeTab} type="card" onChange={this.changeActiveKey.bind(this)}>
                <TabPane tab="单个价格修改" key="1">
                    <Form>
                        <Row style={{ marginBottom: 10 }}>
                            <Col span="18"></Col>
                            <Col span="6">
                                <Search
                                    placeholder="输入SKU代码/UPC/商品名查询"
                                    enterButton={true}
                                    onSearch={this.onSearchOne.bind(this)}
                                    style={{ float: 'right' }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    columns={columnsAgent}
                                    dataSource={channelSkuList}
                                    size="large"
                                    rowKey={record => record.id}
                                />
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane tab="批量价格修改" key="2">
                    <Form>
                        <Row>
                            <Col>
                                <Table
                                    columns={columnsBinding}
                                    dataSource={queryListShop}
                                    size="large"
                                    rowKey={record => record.id}
                                    pagination={false}
                                />
                            </Col>
                        </Row>
                    </Form>
                    {showModalChannel && <Modal
                        visible={showModalChannel}
                        width={1000}
                        title={title}
                        onCancel={this.handleCancel.bind(this)}
                        onOk={this.handleSubmit.bind(this)}
                    >
                        <Form>
                            <Table {...modalTableProps} rowKey={r => r.id} />
                        </Form>
                    </Modal>}
                </TabPane>
            </Tabs>
        );
    }
}

function mapStateToProps(state) {
    const { channelSkuList, queryListShop, saleDetailList } = state.channel;
    return {
        channelSkuList,
        queryListShop,
        saleDetailList,
    };
}

export default connect(mapStateToProps)(Form.create()(channelInstall));
