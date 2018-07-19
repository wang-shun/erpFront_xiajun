import { message } from 'antd';
import fetch from '../utils/request';

const getAuthUrlWx = ({ payload }) => fetch.post('/account/getAuthUrl', { data: payload }).catch(e => e);


export default {
  namespace: 'appset',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if ((pathname === '/myApp/appSettings' && !window.existCacheState('/myApp/appSettings')|| (pathname === '/myApp' && !window.existCacheState('/myApp')))) {
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
    
  },
  reducers: {
    savegetAuthUrlWx(state, { payload }) {
      return { ...state, geturl: payload.data };
    },
  },
};
