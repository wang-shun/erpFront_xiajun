import { message } from 'antd';
import fetch from '../utils/request';


export default {
  namespace: 'appset',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
      });
    },
  },
  effects: {
    
  },
  reducers: {
  },
};
