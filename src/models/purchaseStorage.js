import { message } from 'antd';
import fetch from '../utils/request';
import { platform } from 'os';

// 采购入库相关接口
const queryPurchaseStorageList = ({ payload }) => fetch.post('/purchaseStorage/queryPurStorages', { data: payload }).catch(e => e);
const queryBuyerTaskList = ({ payload }) => fetch.post('/purchaseTask/queryTaskDailyList', { data: payload }).catch(e => e);
const addStorage = ({ payload }) => fetch.post('/purchaseStorage/add', { data: payload }).catch(e => e);
const updateStorage = ({ payload }) => fetch.post('/purchaseStorage/update', { data: payload }).catch(e => e);
const confirmStorage = ({ payload }) => fetch.post('/purchaseStorage/confirm', { data: payload }).catch(e => e);
const deleteStorage = ({ payload }) => fetch.post('/purchaseStorage/delete', { data: payload }).catch(e => e);
const queryPurchaseStorage = ({ payload }) => fetch.post('/purchaseStorage/query', { data: payload }).catch(e => e);
const multiConfirmStorage = ({ payload }) => fetch.post('/purchaseStorage/multiConfirm', { data: payload }).catch(e => e);

const mergePurchaseStorage = ({ payload }) => fetch.post('/purchaseStorage/mergePurchaseStorage', { data: payload }).catch(e => e); // 小程序合并入库
const queryBuyers = ({ payload }) => fetch.post('/purchase/queryBuyers', { data: payload }).catch(e => e);
// 采购入库new
const purchaseBuyer = ({ payload }) => fetch.post('/purchase/queryBuyers', { data: payload }).catch(e => e);
const purchaseWarehouse = ({ payload }) => fetch.post('/warehouse/selectWhList', { data: payload }).catch(e => e);
const purchaseSearchAll = ({ payload }) => fetch.post('/purchaseStorage/searchAll', { data: payload }).catch(e => e);
const purchaseByopenid= ({ payload }) => fetch.post('/purchaseStorage/searchByopenid', { data: payload }).catch(e => e);
const purchaseAndUpc= ({ payload }) => fetch.post('/purchaseStorage/searchByopenidAndUpc', { data: payload }).catch(e => e);
const queryHasComfirm= ({ payload }) => fetch.post('/purchaseStorage/queryHasComfirm', { data: payload }).catch(e => e);
const queryWithParam= ({ payload }) => fetch.post('/purchaseStorage/queryComfirmWithParam ', { data: payload }).catch(e => e);
const queryWithComfirm= ({ payload }) => fetch.post('/purchaseStorage/comfirm', { data: payload }).catch(e => e);
const queryWithDelete= ({ payload }) => fetch.post('/purchaseStorage/delete', { data: payload }).catch(e => e);

export default {
  namespace: 'purchaseStorage',
  state: {
    list: [],
    total: '',
    currentPage: 1,
    purchaseValues: {},
    buyer: [],
    // 修改的状态
    buyerTaskList: [],
    showModal: false,
    editInfo: {},
    showBarcodeModal: false,
    //采购入库new
    buyers: [],
    selectWhList: [],
    searchAllList: [],
    alreadyList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseStorage' && !window.existCacheState('/purchase/purchaseStorage')) {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseStorageList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
            dispatch({ type: 'inventory/queryWareList', payload: {} });
            //采购入库new
            dispatch({ type: 'purchaseBuyer', payload: {} });
            dispatch({ type: 'purchaseWarehouse', payload: {} });
            dispatch({ type: 'purchaseSearchAll', payload: {} });
            dispatch({ type: 'queryHasComfirm', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseStorageList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ purchaseStorage }) => purchaseStorage.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(queryPurchaseStorageList, { payload: { ...payload, pageIndex } });
      if (typeof data.success !== 'undefined') {
        yield put({ type: 'updatePurchaseStorageList', payload: data });
      }
    },
    * queryBuyers({ payload }, { call, put }) {
      const data = yield call(queryBuyers, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyers', payload: data });
      }
    },
    //采购入库new
    * purchaseBuyer({ payload }, { call, put }) {
    const data = yield call(purchaseBuyer, { payload });
    if (data.success) {
      yield put({ type: 'updatepurchaseBuyer', payload: data });
    }
    },
    * purchaseWarehouse({ payload }, { call, put }) {
    const data = yield call(purchaseWarehouse, { payload });
    if (data.success) {
      yield put({ type: 'updateWarehouse', payload: data });
    }
    },
    * purchaseSearchAll({ payload }, { call, put }) {
    const data = yield call(purchaseSearchAll, { payload });
    if (data.success) {
      yield put({ type: 'updateSearchAll', payload: data });
    }
    },
    * purchaseByopenid({ payload }, { call, put }) {
    const data = yield call(purchaseByopenid, { payload });
    if (data.success) {
      yield put({ type: 'updateByopenid', payload: data });
    }
    },

    * purchaseAndUpc({ payload }, { call, put }) {
    const data = yield call(purchaseAndUpc, { payload });
    if (data.success) {
      yield put({ type: 'updateAndUpc', payload: data });
    }
    },
    * queryHasComfirm({ payload }, { call, put }) {
    const data = yield call(queryHasComfirm, { payload });
    if (data.success) {
      yield put({ type: 'updateComfirm', payload: data });
    }
    },
    * queryWithParam({ payload }, { call, put }) {
    const data = yield call(queryWithParam, { payload });
    if (data.success) {
      yield put({ type: 'updateWithParam', payload: data });
    }
    },
    * queryWithComfirm({ payload }, { call, put }) {
    const data = yield call(queryWithComfirm, { payload });
    if (data.success) {
      yield put({ type: 'updateWithComfirm', payload: data });
    }
    },

    * queryWithDelete({ payload }, { call, put }) {
    const data = yield call(queryWithDelete, { payload });
    if (data.success) {
      message.success('删除角色成功');
    }
    },
    //
    * queryBuyerTaskList({ payload }, { call, put }) {
      const data = yield call(queryBuyerTaskList, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyerTaskList', payload: data });
      }
    },
    * addStorage({ payload, cb }, { call }) {
      const data = yield call(addStorage, { payload: payload.fieldsValue });
      if (data.success) {
        message.success('添加入库单成功');
        if (cb) cb();
      }
    },
    * updateStorage({ payload, cb }, { call }) {
      const data = yield call(updateStorage, { payload: payload.fieldsValue });
      if (data.success) {
        message.success('修改入库单成功');
        if (cb) cb();
      }
    },
    * confirmStorage({ payload, cb }, { call }) {
      const data = yield call(confirmStorage, { payload: payload.fieldsValue });
      if (data.success) {
        message.success('确认入库成功');
        if (cb) cb();
      }
    },
    * queryStorage({ payload, cb }, { call, put }) {
      const data = yield call(queryPurchaseStorage, { payload });
      if (data.success) {
        if (cb) {
          cb(data.data);
        }
        yield put({ type: 'saveStorage', payload: data });
      }
    },
    * deleteStorage({ payload, cb }, { call }) {
      const data = yield call(deleteStorage, { payload });
      if (data.success) {
        message.success('删除入库单成功');
        cb();
      }
    },
    * multiConfirmStorage({ payload, cb }, { call }) {
      const data = yield call(multiConfirmStorage, { payload });
      if (data.success) {
        message.success('批量入库成功');
        cb();
      }
    },
    * mergePurchaseStorage({ payload, cb }, { call }) {
      const data = yield call(mergePurchaseStorage, { payload });
      if (data.success) {
        message.success('合并入库成功');
        cb();
      }
    },
    exportDetail({ payload }) {
      window.open(`http://${location.host}/purchaseStorage/purchaseExport?id=${payload.id}`);
    },
  },
  reducers: {
    // 修改的状态
    toggleShowModal(state) { return { ...state, showModal: !state.showModal }; },
    toggleBarcodeModal(state) { return { ...state, showBarcodeModal: !state.showBarcodeModal }; },
    clearEditInfo(state) { return { ...state, editInfo: {} }; },
    updateEditInfo(state, { payload }) { return { ...state, editInfo: { ...state.editInfo, ...payload } }; },
    updatePurchaseStorageList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    updateBuyers(state, { payload }) {
      return { ...state, buyer: payload.data };
    },
    //采购入库new
    updatepurchaseBuyer(state, { payload }) {
      return { ...state, buyers: payload.data };
    },
    updateWarehouse(state, {payload}){
      return { ...state, selectWhList: payload.data };
    },
    updateSearchAll(state, {payload}){
      return { ...state, searchAllList: payload.data};
    },
    updateByopenid(state, {payload}){
      return { ...state, searchAllList: payload.data}
    },
    updateAndUpc(state, {payload}){
      return { ...state, listUpc: payload.data}
    },
    updateComfirm(state, {payload}){
      return { ...state, alreadyList: payload.data}
    },
    updateWithParam(state, {payload}){
      return { ...state, alreadyList: payload.data}
    },
    updateWithComfirm(state, {payload}){
      return { ...state, Mal: payload.data}
    },
    //
    updateBuyerTaskList(state, { payload }) {
      return { ...state, buyerTaskList: payload.data };
    },
    saveStorage(state, { payload }) {
      return { ...state, editInfo: payload.data };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
  },
};
