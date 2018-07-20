import { message } from 'antd';
import fetch from '../utils/request';

const addPurchase = ({ payload }) => fetch.post('/purchaseTask/add', { data: payload }).catch(e => e);
const updatePurchase = ({ payload }) => fetch.post('/purchaseTask/update', { data: payload }).catch(e => e);
const queryPurchaseList = ({ payload }) => fetch.post('/purchaseTask/queryTaskDailyList', { data: payload }).catch(e => e);
const queryPurchase = ({ payload }) => fetch.post('/purchase/query', { data: payload }).catch(e => e);
const querypurchaseTask = ({ payload }) => fetch.post('/purchaseTask/query', { data: payload }).catch(e => e);

const queryBuyers = ({ payload }) => fetch.post('/purchase/queryBuyers', { data: payload }).catch(e => e);
const deletePurchase = ({ payload }) => fetch.post('/purchase/delete', { data: payload }).catch(e => e);
// 取消采购
const closeTaskDaily = ({ payload }) => fetch.post('/purchaseTask/closeTaskDaily', { data: payload }).catch(e => e);
// 完成采购
const finishTaskDaily = ({ payload }) => fetch.post('/purchaseTask/finishTaskDaily', { data: payload }).catch(e => e);
// 根据当前订单生成采购任务
const createByOrder = () => fetch.get('/purchase/autoAddByOrder').catch(e => e);
// 采购小票
const purchaseReceiptList = ({ payload }) => fetch.post('/receipt/queryReceipt', { data: payload }).catch(e => e);
// 采购小票明细
const purchaseReceiptTaskList = ({ payload }) => fetch.post('/receipt/queryTaskReceipt', { data: payload }).catch(e => e);
// 采购未完成时间
const purchaseNoCompleteTimeList = ({ payload }) => fetch.post('/purchase/nocompleteTaskDailyOrderTime', { data: payload }).catch(e => e);
// 采购未完成详情
const purchaseNoCompleteDateil = ({ payload }) => fetch.post('/purchase/nocompleteTaskDaily', { data: payload }).catch(e => e);
// 导入需求
const purchaseImprotTask = ({ payload }) => fetch.post('/purchaseTask/improtTask', { data: payload }).catch(e => e)


export default {
  namespace: 'purchase',
  state: {
    list: [],
    total: '',
    currentPage: 1,
    currentPageSize: 20,
    purchaseValues: {},
    editInfo: {},
    buyer: [],
    receiptList: [],
    receiptcurrentPage: 1,
    receiptcurrentPageSize: 20,
    receiptTotal: 1,
    receiptTaskList: [],
    receiptTaskPage: 1,
    receiptTaskPageSize: 20,
    receiptTaskTotal: 1,
    uncompleteTaskDailyOrder: [],
    noCompleteTimePage: 1,
    noCompleteTimePageSize: 20,
    noCompleteTimeTotal: 1,
    savePurchaseTask: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseList' && !window.existCacheState('/purchase/purchaseList')) {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
          }, 0);
        }
        if (pathname === '/purchase/preStock' && !window.existCacheState('/purchase/preStock')) {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
          }, 0);
        }
        if (pathname === '/purchase/receiptList' && !window.existCacheState('/purchase/receiptList')) {
          setTimeout(() => {
            dispatch({ type: 'purchaseReceiptList', payload: {} });
          }, 0);
        }
        if (pathname === '/purchase/receiptTaskList' && !window.existCacheState('/purchase/receiptTaskList')) {
          setTimeout(() => {
            dispatch({ type: 'purchaseReceiptTaskList', payload: {} });
          }, 0);
        }
        if (pathname === '/purchase/uncompleteTaskDailyOrder' && !window.existCacheState('/purchase/uncompleteTaskDailyOrder')) {
          setTimeout(() => {
            dispatch({ type: 'purchaseNoCompleteTimeList', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ purchase }) => purchase.currentPage);
      let pageSize = yield select(({ purchase }) => purchase.currentPageSize);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      if (payload && payload.pageSize) {
        pageSize = payload.pageSize;
        yield put({ type: 'saveCurrentPageSize', payload });
      }
      const data = yield call(queryPurchaseList, { payload: { ...payload, pageIndex, pageSize } });
      if (data.success) {
        yield put({ type: 'updatePurchaseList', payload: data });
      }
    },
    * addPurchase({ payload, cb }, { call }) {
      const data = yield call(addPurchase, { payload });
      if (data.success) {
        message.success('新增采购成功');
        cb();
      }
    },
    * updatePurchase({ payload, cb }, { call }) {
      const data = yield call(updatePurchase, { payload });
      if (data.success) {
        message.success('修改采购成功');
        cb();
      }
    },
    * queryPurchase({ payload }, { call, put }) {
      const newPayload = { ...payload };
      delete newPayload.type;
      const data = yield call(queryPurchase, { payload: newPayload });
      if (data.success) {
        yield put({
          type: 'savePurchase',
          payload: data,
        });
      }
    },
    * querypurchaseTask({ payload }, { call, put }) {
      const data = yield call(querypurchaseTask, { payload });
      if (data.success) {
        yield put({
          type: 'savequerypurchaseTask',
          payload: data,
        });
      }
    },

    * queryBuyers({ payload }, { call, put }) {
      const data = yield call(queryBuyers, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyers', payload: data });
      }
    },
    * deletePurchase({ payload, cb }, { call }) {
      const data = yield call(deletePurchase, { payload });
      if (data.success) cb();
    },
    * createByOrder({ payload, cb }, { call }) {
      const data = yield call(createByOrder);
      if (data.success) {
        message.success('生产采购任务成功');
        cb();
      }
    },
    * exportPurchase({ payload }, { put }) {
      window.open(`http://${location.host}/purchase/taskDailyExport?buyerTaskNo=${payload.buyerTaskNo}`);
      yield put({ type: 'queryPurchaseList', payload: {} });
    },
    exportNoCompleteDetail({ payload }) {
      window.open(`http://${location.host}/purchase/noCompleteExport?currentlyDate=${payload.currentlyDate}`);
    },
    * finishTaskDaily({ payload, cb }, { call }) {
      const data = yield call(finishTaskDaily, { payload });
      if (data.success) {
        message.success('完成采购成功');
        if (cb) cb();
      }
    },

    * closeTaskDaily({ payload, cb }, { call }) {
      const data = yield call(closeTaskDaily, { payload });
      if (data.success) {
        message.success('取消采购成功');
        if (cb) cb();
      }
    },
    // 小票管理
    * purchaseReceiptList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.receiptcurrentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveReceiptcurrentPage', payload });
      }
      if (payload && payload.pageSize) {
        // pageSize = payload.pageSize;
        yield put({ type: 'saveReceiptcurrentPageSize', payload });
      }
      const data = yield call(purchaseReceiptList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'updateReceiptList',
          payload: data,
        });
      }
    },
    // 小票明细
    * purchaseReceiptTaskList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.receiptTaskPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveReceiptTaskPage', payload });
      }
      if (payload && payload.pageSize) {
        // pageSize = payload.pageSize;
        yield put({ type: 'saveReceiptTaskPageSize', payload });
      }
      const data = yield call(purchaseReceiptTaskList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'updateReceiptTaskList',
          payload: data,
        });
      }
    },
    // 未完成时间
    * purchaseNoCompleteTimeList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ purchase }) => purchase.noCompleteTimePage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveNoCompleteTimePage', payload });
      }
      if (payload && payload.pageSize) {
        // pageSize = payload.pageSize;
        yield put({ type: 'saveNoCompleteTimePageSize', payload });
      }
      const data = yield call(purchaseNoCompleteTimeList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'updateNoCompleteTimeList',
          payload: data,
        });
      }
    },
    * purchaseNoCompleteDateil({ payload, cb }, { call }) {
      const data = yield call(purchaseNoCompleteDateil, { payload });
      if (data.success) {
        if (cb) cb(data.data);
      }
    },
    * clearOrder({ payload }, { put }) {
      yield put({
        type: 'clearOrder4Add',
        payload: {},
      });
    },
  },
  reducers: {
    updatePurchaseList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveCurrentPageSize(state, { payload }) {
      return { ...state, currentPageSize: payload.pageSize };
    },
    saveReceiptcurrentPage(state, { payload }) {
      return { ...state, receiptcurrentPage: payload.pageIndex };
    },
    saveReceiptcurrentPageSize(state, { payload }) {
      return { ...state, receiptTaskPageSize: payload.pageSize };
    },
    savePurchase(state, { payload }) {
      return { ...state, purchaseValues: payload };
    },
    updateBuyers(state, { payload }) {
      return { ...state, buyer: payload.data };
    },
    updateReceiptList(state, { payload }) {
      return { ...state, receiptList: payload.data, receiptTotal: payload.totalCount };
    },
    updateReceiptTaskList(state, { payload }) {
      return { ...state, receiptTaskList: payload.data, receiptTaskTotal: payload.totalCount };
    },
    saveReceiptTaskPage(state, { payload }) {
      return { ...state, receiptTaskPage: payload.pageIndex };
    },
    saveReceiptTaskPageSize(state, { payload }) {
      return { ...state, receiptTaskPageSize: payload.pageSize };
    },
    saveNoCompleteTimePage(state, { payload }) {
      return { ...state, noCompleteTimePage: payload.pageIndex };
    },
    saveNoCompleteTimePageSize(state, { payload }) {
      return { ...state, noCompleteTimePageSize: payload.pageSize };
    },
    savequerypurchaseTask(state, { payload }) {
      return { ...state, savePurchaseTask: payload.data }
    },
    clearOrder4Add(state, { payload }) {
      return { ...state, savePurchaseTask: {} };
    },
    updateNoCompleteTimeList(state, { payload }) {
      return { ...state, uncompleteTaskDailyOrder: payload.data, noCompleteTimeTotal: payload.totalCount };
    },
    clearEditInfo(state) { return { ...state, editInfo: {} }; },
  },
};
