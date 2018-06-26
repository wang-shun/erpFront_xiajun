import { message } from 'antd';
import fetch from '../utils/request';

const queryAgencyList = ({ payload }) => fetch.post('/seller/querySellerList', { data: payload }).catch(e => e);
const queryAgency = ({ payload }) => fetch.post('/seller/query', { data: payload }).catch(e => e);
const deleteAgency = ({ payload }) => fetch.post('/seller/delete', { data: payload }).catch(e => e);
const updateAgency = ({ payload }) => fetch.post('/seller/update', { data: payload }).catch(e => e);
const addAgency = ({ payload }) => fetch.post('/seller/add', { data: payload }).catch(e => e);
const queryAgencyTypeList = ({ payload }) => fetch.post('/sellerType/querySellerTypeList', { data: payload }).catch(e => e);
const queryAgencyType = ({ payload }) => fetch.post('/sellerType/query', { data: payload }).catch(e => e);
const deleteAgencyType = ({ payload }) => fetch.post('/sellerType/delete', { data: payload }).catch(e => e);
const updateAgencyType = ({ payload }) => fetch.post('/sellerType/update', { data: payload }).catch(e => e);
const addAgencyType = ({ payload }) => fetch.post('/sellerType/add', { data: payload }).catch(e => e);
const queryBuyerList = ({ payload }) => fetch.post('/purchase/queryBuyers', { data: payload }).catch(e => e);
const queryBuyerType = ({ payload }) => fetch.post('/wx/purchaseUser/query', { data: payload }).catch(e => e);
const updateBuyer = ({ payload }) => fetch.post('/purchase/update', { data: payload }).catch(e => e);
const addBuyer = ({ payload }) => fetch.post('/purchase/add', { data: payload }).catch(e => e);
const setCommission = ({ payload }) => fetch.post('/purchase/setCommission', { data: payload }).catch(e => e);
const deleteBuyerType = ({ payload }) => fetch.post('/purchase/delete', { data: payload }).catch(e => e);
const queryWareList = ({ payload }) => fetch.get('/warehouse/queryWarehouses', { data: payload }).catch(e => e);
const queryBuyerById = ({ payload }) => fetch.get('/purchase/queryBuyerById', { data: payload }).catch(e => e);

export default {
  namespace: 'agency',
  state: {
    typeList: [],
    buyerList: [],
    list: [],
    wareList: [],
    wareCurrent: 1,
    agencyValues: {},
    agencyTypeValues: {},
    total: 1,
    typeTotal: 1,
    currentPage: 1,
    typeCurrent: 1,
    buyerValues: {},
    buyerCurrent: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/person/agencyType' && !window.existCacheState('/person/agencyType')) {
          dispatch({
            type: 'queryAgencyTypeList',
            payload: { pageIndex: 1 },
          });
        }
        if (pathname === '/purchase/buyerList' && !window.existCacheState('/person/buyerList')) {
          dispatch({
            type: 'queryBuyerList',
            payload: { pageIndex: 1 },
          });
          dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
        }
        if (pathname === '/person/agencyList' && !window.existCacheState('/person/agencyList')) {
          dispatch({ type: 'queryAgencyList', payload: { pageIndex: 1 } });
          dispatch({ type: 'queryAgencyTypeList', payload: { pageIndex: 1 } });
        }
      });
    },
  },
  effects: {
    * queryAgencyList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ agency }) => agency.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(queryAgencyList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateList', payload: data });
      }
    },
    * queryAgency({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryAgency, { payload });
      if (data.success) {
        yield put({
          type: 'saveAgency',
          payload: data,
        });
      }
    },
    * addAgency({ payload }, { call }) {
      const data = yield call(addAgency, { payload });
      if (data.success) {
        message.success('新增销售成功');
      }
    },
    * deleteAgency({ payload, cb }, { call }) {
      const data = yield call(deleteAgency, { payload });
      if (data.success) {
        message.success('删除类目成功');
        cb();
      }
    },
    * updateAgency({ payload }, { call }) {
      const data = yield call(updateAgency, { payload });
      if (data.success) {
        message.success('修改类目成功');
      }
    },
    * queryAgencyTypeList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ agency }) => agency.typeCurrent);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveTypeCurrentPage', payload });
      }
      const data = yield call(queryAgencyTypeList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateTypeList', payload: data });
      }
    },
    * queryBuyerList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ agency }) => agency.buyerCurrent);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveBuyerCurrentPage', payload });
      }
      const data = yield call(queryBuyerList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateBuyerList', payload: data });
      }
    },
    * queryAgencyType({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryAgencyType, { payload });
      if (data.success) {
        yield put({
          type: 'saveAgencyType',
          payload: data,
        });
      }
    },
    * queryBuyerType({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryBuyerType, { payload });
      if (data.success) {
        yield put({
          type: 'saveBuyerType',
          payload: data,
        });
      }
    },
    * updateBuyer({ payload, cb }, { call, put }) {
      const data = yield call(updateBuyer, { payload });
      if (data.success) {
        message.success('修改成功');
        yield put({
          type: 'queryBuyerList',
          payload: {payload: data},
        });
        cb();
        // const listData = yield call(queryBuyerList, { payload });
        // if (listData.success) {
        //   yield put({ type: 'queryBuyerList', payload: listData });
        // }
      }
    },
    * addBuyer({ payload, cb }, { call, put }) {
      const data = yield call(addBuyer, { payload });
      if (data.success) {
        message.success('新增成功');
        yield put({
          type: 'queryBuyerList',
          payload: {payload: data},
        });
        cb();
        // const listData = yield call(queryBuyerList, { payload });
        // if (listData.success) {
        //   yield put({ type: 'queryBuyerList', payload: listData });
        // }
      }
    },
    * setCommission({ payload, cb }, { call, put }) {
      const data = yield call(setCommission, { payload });
      if (data.success) {
        message.success('佣金修改成功');
        yield put({
          type: 'queryBuyerList',
          payload: {payload: data},
        });
        cb();
      }
    },
    * queryBuyerById({ payload, cb }, { call, put }) {
      const data = yield call(queryBuyerById, { payload });
      if (data.success) {
         message.success('查询信息成功');
         yield put({
           type:'saveBuyerType',//调用reducers函数saveBuyerType，将回来的数据，写回至buyerValues
           payload: {payload:data},
       });
       cb();//自己传递的数据
       }
    },
    * addAgencyType({ payload }, { call }) {
      const data = yield call(addAgencyType, { payload });
      if (data.success) {
        message.success('新增类别成功');
      }
    },
    * deleteAgencyType({ payload, cb }, { call }) {
      const data = yield call(deleteAgencyType, { payload });
      if (data.success) {
        message.success('删除类目成功');
        cb();
      }
    },
    * deleteBuyerType({ payload, cb }, { call, put }) {
      const data = yield call(deleteBuyerType, { payload });
      if (data.success) {
        message.success('删除买手成功');
        const data1 = yield call(queryBuyerList, { payload });
        if (data1.success) {
          yield put({ type: 'updateBuyerList', payload: data1 });
        }
      }
    },
    * updateAgencyType({ payload }, { call }) {
      const data = yield call(updateAgencyType, { payload });
      if (data.success) {
        message.success('修改类目成功');
      }
    },
    * queryWareList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.wareCurrent);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveWareCurrent', payload });
      }
      const data = yield call(queryWareList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateWareList', payload: data });
      }
    },
  },
  reducers: {
    updateTypeList(state, { payload }) {
      return { ...state, typeList: payload.data, typeTotal: payload.totalCount };
    },
    updateBuyerList(state, { payload }) {
      return { ...state, buyerList: payload.data, typeTotal: payload.totalCount };
    },
    saveAgencyType(state, { payload }) {
      return { ...state, agencyTypeValues: payload.data };
    },
    saveBuyerType(state, { payload }) {
      return { ...state, buyerValues: payload.data || {} };
    },
    updateList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveAgency(state, { payload }) {
      return { ...state, agencyValues: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveTypeCurrentPage(state, { payload }) {
      return { ...state, typeCurrent: payload.pageIndex };
    },
    saveBuyerCurrentPage(state, { payload }) {
      return { ...state, buyerCurrent: payload.pageIndex };
    },
    updateWareList(state, { payload }) {
      return { ...state, wareList: payload.data };
    },
    saveWareCurrent(state, { payload }) {
      return { ...state, wareCurrent: payload.pageIndex };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
