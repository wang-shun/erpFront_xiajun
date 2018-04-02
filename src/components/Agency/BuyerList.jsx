import React, {
	Component
} from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Form, Modal, Popconfirm ,Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class BuyerList extends Component {

	constructor() {
		super();
		this.state = {
			visible: false,
			title: '-', // modal的title
		};
	}
	// 这里的提交是新增或修改 不是分页， TODO: 分页
	handleSubmit() {
		const {
			buyerValues,
			dispatch
		} = this.props;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(err) {
				return;
			}
			if(buyerValues && Object.keys(buyerValues).length > 0) {
				dispatch({
					type: 'agency/updateBuyerType',
					payload: { ...fieldsValue,
						id: buyerValues.id,						
						pageIndex: 1
					},
				});                
			} 
			this.closeModal(false);
		});
	}


	closeModal(visible) {
		this.setState({
			visible
		});
		this.props.dispatch({
			type: 'agency/saveAgencyType',
			payload: {},
		}, () => {
			this._refreshData();
		});
	}

	handleQuery(record) {
		const p = this;
		p.setState({
			visible: true,
			title: '修改',
		}, () => {
			p.props.dispatch({
				type: 'agency/queryBuyerType',
				payload: {
					id: record.id
				},
			});
		});
	}

	handleDelete(record) {
		this.props.dispatch({
			type: 'agency/deleteBuyerType',
			payload: {
				id: record.id
			},
			cb() {
				this._refreshData();
			},
		});
	}

	render() {
		const p = this;
		const {
			form,
			buyerList = [],
			buyerValues = {},
			wareList = []
		} = p.props;
		const {
			getFieldDecorator
		} = form;
		const {
			title,
			visible
		} = p.state;
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			},
		};
		const columns = [{
				title: '买手名字',
				dataIndex: 'nickName',
				key: 'nickName'
			},
			{
				title: '所属仓库',
				dataIndex: 'warehouseName',
				key: 'warehouseName'
			},
			{
				title: '操作',
				dataIndex: 'operator',
				key: 'operator',
				render(t, r) {
					return(
						<div>
              <a href="javascript:void(0)" onClick={p.handleQuery.bind(p, r)} style={{ marginRight: 10 }}>修改</a>
              <Popconfirm title="确定删除此类别？" onConfirm={p.handleDelete.bind(p, r)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
					);
				},
			},
		];
		const modalProps = {
			title,
			visible,
			closable: true,
			onOk() {
				p.handleSubmit();
			},
			onCancel() {
				p.closeModal(false);
			},
		};

		return(
			<div>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={buyerList}
              bordered
              size="large"
              rowKey={record => record.id}
            />
          </Col>
        </Row>
        <Modal {...modalProps}>
          <Form>
            <FormItem
              label="所属仓库"
              {...formItemLayout}
            >
              {getFieldDecorator('warehouseId', {initialValue:buyerValues.warehouseId})(
                  <Select placeholder="请选择仓库" allowClear>
                    {wareList.map(el => <Option key={el.id} value={el.id}>{el.name}</Option>)}
                  </Select>)}
            </FormItem>
          </Form>
        </Modal>
      </div>
		);
	}
}

function mapStateToProps(state) {
	const {
		buyerList,
		buyerValues,
		wareList
	} = state.agency;
	return {
		buyerValues,
		buyerList,
		wareList,
	};
}

export default connect(mapStateToProps)(Form.create()(BuyerList));