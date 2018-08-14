import { message } from 'antd';
import fetch from '../utils/request';

const getAuthUrlWx = ({ payload }) => fetch.post('/account/getAuthUrl', { data: payload }).catch(e => e);
const authcallbackWx = ({ payload }) => fetch.get('/account/authcallback', { data: payload }).catch(e => e);
const wechatApplet = ({ payload }) => fetch.get('/wechatApplet/list', { data: payload }).catch(e => e);
const weChatPublish = ({ payload }) => fetch.post('/wechatApplet/publish', { data: payload }).catch(e => e);
const wechatAppletUpdate = ({ payload }) => fetch.post('/wechatApplet/update', { data: payload }).catch(e => e);

export default {
  namespace: 'appset',
  state: {
    appletList: [],
    updateList:{},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/myApp/appSettings' && !window.existCacheState('/myApp/appSettings')) {
          setTimeout(() => {
            dispatch({ type: 'getAuthUrlWx', payload: {} });
          }, 0);
        }
        if (pathname === '/myApp/release' && !window.existCacheState('/myApp/release')) {
          setTimeout(() => {
            dispatch({ type: 'wechatApplet', payload: {} })
          }, 0);
        }
      });
    },
  },
  effects: {
    * getAuthUrlWx({ payload }, { call, put }) {
      const data = yield call(getAuthUrlWx, { payload });
      if (data.success) {
        yield put({
          type: 'savegetAuthUrlWx',
          payload: data,
        });
      }
    },

    * authcallbackWx({ payload, cb }, { call, put }) {
      const data = yield call(authcallbackWx, { payload });
      if (data.success) {
        message.success(data.msg);
      }
      cb();
    },
    * wechatApplet({ payload }, { call, put }) {
      const data = yield call(wechatApplet, { payload });
      if (data.success) {
        yield put({
          type: 'saveWechatApplet',
          payload: data,
        });
      }
    },
    * weChatPublish({ payload, cb }, { call, put }) {
      const data = yield call(weChatPublish, { payload });
      if (data.success) {
        message.success('批量发布成功');
        cb();
      }
    },
    * wechatAppletUpdate({ payload, cb }, { call, put }) {
      const data = yield call(wechatAppletUpdate, { payload });
      if (data.success) {
        yield put({
          type: 'saveUpdate',
          payload: data,
        });
        cb();
      }
    },
  },
  reducers: {
    savegetAuthUrlWx(state, { payload }) {
      return { ...state, geturl: payload.data };
    },
    saveWechatApplet(state, { payload }) {
      return { ...state, appletList: payload.data };
    },
    saveUpdate( state, { payload }){
      return{ ...state, updateList: payload.data}
    }
  },
};
