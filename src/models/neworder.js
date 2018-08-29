import { message } from 'antd';
import qs from 'querystring';
import fetch from '../utils/request';
const searchPageList = ({ payload }) => fetch.post('/outerOrder/searchPageList', { data: payload }).catch(e => e);
const erpOrderDe = ({ payload }) => fetch.get('/erpOrder/detail', { data: payload }).catch(e => e);
const queryOrderListTwo = ({ payload }) => fetch.post('/outerOrder/index', { data: payload }).catch(e => e);
const erpOrderNumber = ({ payload }) => fetch.post('/erpOrder/return', { data: payload }).catch(e => e);
const queryReturnOrderById = ({ payload }) => fetch.post('/erpReturnOrder/queryById', { data: payload }).catch(e => e);
const queryShippingTrack = ({ payload }) => fetch.post('/shippingOrder/getShippingTrackDetail', { data: payload }).catch(e => e);
// 查询物流公司
export default {
  namespace: 'neworder',
  state: {
    //订单查询
    currentPage: 1,
    currentPageSize: 20,
    orderList: [],
    orderTotal: 1,
    erpDetailList: [],
    orderListTwo: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/neworder/orderManagement' && !window.existCacheState('/neworder/orderManagement')) {
          setTimeout(() => {
            dispatch({ type: 'searchPageList', payload: query });
          }, 0);
        }
      });
    },
  },
  effects: {
    * searchPageList({ payload }, { call, put, select }) { // 订单管理列表
      let pageIndex = yield select(({ neworder }) => neworder.currentPage);
      let pageSize = yield select(({ neworder }) => neworder.currentPageSize);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      if (payload && payload.pageSize) {
        pageSize = payload.pageSize;
        yield put({ type: 'saveCurrentPageSize', payload });
      }
      const data = yield call(searchPageList, { payload: { ...payload, pageIndex, pageSize } });
      if (data.success) {
        yield put({
          type: 'saveOrderList',
          payload: data,
        });
      }
    },
    * clearOrder({ payload }, { put }) {
      yield put({
        type: 'clearOrder4Add',
        payload: {},
      });
    },
    * erpOrderDe({ payload }, { call, put }) {
      const data = yield call(erpOrderDe, { payload });
      if (data.success) {
        yield put({
          type: 'erpOrderDeList',
          payload: data,
        });
      }
    },
    *queryOrderListTwo({ payload, cb }, { call, put }) {
      const data = yield call(queryOrderListTwo, { payload });
      if (data.success) {
        yield put({
          type: 'saveOrderListTwo',
          payload: data,
        });
        cb();
      }
    },
    * erpOrderNumber({ payload, cb }, { call }) {
      const data = yield call(erpOrderNumber, { payload });
      if (data.success) {
        message.success('退单成功');
        cb();
      }
    },
    * queryReturnOrderById({ payload, cb }, { call, put }) {
      const data = yield call(queryReturnOrderById, { payload });
      if (data.success) {
        message.success('退单成功');
        cb();
        // yield put({
        //   type: 'saveReturnValues',
        //   payload: data,
        // });
      }
    },
    * queryShippingTrack({ payload, cb }, { call }) {
      const data = yield call(queryShippingTrack, { payload });
      if (data.success) {
        if (cb) cb(data.data);
      }
    },
  },
  reducers: {
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveCurrentPageSize(state, { payload }) {
      return { ...state, currentPageSize: payload.pageSize };
    },
    saveOrderList(state, { payload }) {
      return { ...state, orderList: payload.data, orderTotal: payload.totalCount };
    },
    saveOrderListTwo(state, { payload }) {
      return { ...state, orderListTwo: payload.data };
    },
    erpOrderDeList(state, { payload }) {
      return { ...state, erpDetailList: payload.data }
    },
    clearOrder4Add(state, { payload }) {
      return { ...state, orderListTwo: [], erpDetailList: [] };
    },
    exportMainOrder({ payload }) {
      const param = qs.stringify(payload);
      window.open(`http://${location.host}/outerOrder/OuterOrderExportExcel?${param}`);
    },

  },
};
