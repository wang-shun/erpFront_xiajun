import { message } from 'antd';
import fetch from '../utils/request';

const getAuthUrlWx = ({ payload }) => fetch.post('/account/getAuthUrl', { data: payload }).catch(e => e);
const authcallbackWx = ({ payload }) => fetch.get('/account/authcallback', { data: payload }).catch(e => e);


export default {
  namespace: 'appset',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/myApp/appSettings' && !window.existCacheState('/myApp/appSettings')) {
          setTimeout(() => {
            dispatch({ type: 'getAuthUrlWx', payload: {} });
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
  },
  reducers: {
    savegetAuthUrlWx(state, { payload }) {
      return { ...state, geturl: payload.data };
    },
  },
};
