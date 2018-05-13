// import { message } from 'antd';
import fetch from '../utils/request';

const queryMessageList = ({ payload }) => fetch.post('/sitemsg/queryUserSiteMsg', { data: payload }).catch(e => e);
const readMsg = ({ payload }) => fetch.post('/sitemsg/readMsg', { data: payload }).catch(e => e);

export default {
  namespace: 'message',
  state: {
    messageList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/message' && !window.existCacheState('/message')) {
          dispatch({
            type: 'queryMessageList',
          });
        }
      });
    },
  },
  effects: {
    * queryMessageList({ payload }, { call, put }) {
      const data = yield call(queryMessageList, { payload: { ...payload } });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            messageList: data.data,
          },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
