import { message } from 'antd';
import fetch from '../utils/request';

const queryItemSkuPriceList = ({ payload }) => fetch.get('/itemSku/queryItemSkuPriceList', { data: payload }).catch(e => e);
const saveItemSkuPriceList = ({ payload }) => fetch.get('/itemSku/saveItemSkuPriceList', { data: payload }).catch(e => e);
const queryItemSkuPriceListByCondition = ({ payload }) => fetch.get('/itemSku/queryItemSkuPriceListByCondition', { data: payload }).catch(e => e);
const queryChannelListShop = ({ payload }) => fetch.get('/channelshop/queryChannelList', { data: payload }).catch(e => e);
const querySkuSalePrice = ({ payload }) => fetch.post('/itemSku/querySkuSalePrice', { data: payload }).catch(e => e);
const saveAllItemSkuInOneChannelPrice = ({ payload }) => fetch.post('/itemSku/saveAllItemSkuInOneChannelPrice', { data: payload }).catch(e => e);
const saveOneItemSkuMultiPrice = ({ payload }) => fetch.post('/itemSku/saveOneItemSkuMultiPrice', { data: payload }).catch(e => e);
const queryChannelList = () => fetch.post('/channelshop/queryChannelList').catch(e => e);//渠道列表
const getOauthUrl = () => fetch.post('/channelshop/getOauthUrl').catch(e => e);//渠道授权

export default {
  namespace: 'channel',
  state: {
    channelSkuList: [],
    currentPage: 1,
    currentPageSize: 20,
    channelTotal: 1,
    queryList: [],
    queryListShop: [],
    saleDetailList: [],
    detailPage: 1,
    detailPageSize: 20,
    detailTotal: 1,
    channelList: [],
    authUrl: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/channel/channelInstall' && !window.existCacheState('/channel/channelInstall')) {
          setTimeout(() => {
            dispatch({ type: 'queryItemSkuPriceList', payload: { pageIndex: 1 } });
            dispatch({ type: 'queryChannelListShop', payload: {} });
          }, 0);
        }
        if (pathname === '/channel/channelAuth' && !window.existCacheState('/channel/channelAuth')) {
          setTimeout(() => {
            dispatch({ type: 'queryChannelList', payload: {} });
            dispatch({ type: 'getOauthUrl', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    //查询渠道列表
     * queryChannelList(_, { call, put }) {
      const data = yield call(queryChannelList);
      if (data.success) {
        const channelList = data.data;
        yield put({
          type: 'updateState',
          payload: {
            channelList,
          },
        });
      }
    },
    //授权
    * getOauthUrl(_, { call, put }) {
    const data = yield call(getOauthUrl);
    if (data.success) {
      const authUrl = data.data;
      yield put({
        type: 'updateState',
        payload: {
          authUrl,
        },
      });
    }
  },
    * queryItemSkuPriceList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ channel }) => channel.currentPage);
      let pageSize = yield select(({ channel }) => channel.currentPageSize);
      if (payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveChannelIndex', payload });
      }
      if (payload.pageSize) {
        pageSize = payload.pageSize;
        yield put({ type: 'saveChannelSize', payload });
      }
      const data = yield call(queryItemSkuPriceList, { payload: { ...payload, pageIndex, pageSize } });
      if (data.success) {
        yield put({
          type: 'saveChannel',
          payload: data,
        });
      }
    },
    * saveItemSkuPriceList({ payload, cb }, { call }) {
      const data = yield call(saveItemSkuPriceList, { payload });
      if (data.success) {
        message.success('保存成功');
        cb();
      }
    },
    * queryItemSkuPriceListByCondition({ payload }, { call, put }) {
      const data = yield call(queryItemSkuPriceListByCondition, { payload });
      if (data.success) {
        yield put({
          type: 'saveCondition',
          payload: data,
        });
      }
    },
    * queryChannelListShop({ payload }, { call, put }) {
      const data = yield call(queryChannelListShop, { payload });
      if (data.success) {
        yield put({
          type: 'savequeryChannelListShop',
          payload: data,
        });
      }
    },
    * querySkuSalePrice({ payload, cb }, { call, put, select }) {
      let pageIndex = yield select(({ channel }) => channel.detailPage);
      let pageSize = yield select(({ channel }) => channel.detailPageSize);
      if (payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveDetailIndex', payload });
      }
      if (payload.pageSize) {
        pageSize = payload.pageSize;
        yield put({ type: 'saveDetailSize', payload });
      }
      const data = yield call(querySkuSalePrice, { payload: { ...payload, pageIndex, pageSize } });
      if (data.success) {
        yield put({
          type: 'saveQuerySkuSalePrice',
          payload: data,
        });
        cb();
      }
    },
    * saveAllItemSkuInOneChannelPrice({ payload, cb }, { call }) {
      const data = yield call(saveAllItemSkuInOneChannelPrice, { payload });
      if (data.success) {
        message.success('批量修改价格成功');
        cb();
      }
    },
    * saveOneItemSkuMultiPrice({ payload, cb }, { call }) {
      const data = yield call(saveOneItemSkuMultiPrice, { payload });
      if (data.success) {
        message.success('修改价格成功');
        cb();
      }
    },
  },
  reducers: {
    saveChannelIndex(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveChannelSize(state, { payload }) {
      return { ...state, pageSize: payload.pageSize };
    },
    saveChannel(state, { payload }) {
      return { ...state, channelSkuList: payload.data, channelTotal: payload.totalCount };
    },
    saveCondition(state, { payload }) {
      return { ...state, channelSkuList: payload.data }
    },
    savequeryChannelListShop(state, { payload }) {
      return { ...state, queryListShop: payload.data }
    },
    saveQuerySkuSalePrice(state, { payload }) {
      return { ...state, saleDetailList: payload.data, detailTotal: payload.totalCount }
    },
    saveDetailIndex(state, { payload }) {
      return { ...state, detailPage: payload.pageIndex };
    },
    saveDetailSize(state, { payload }) {
      return { ...state, detailPageSize: payload.pageSize };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
