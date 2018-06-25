import { message } from 'antd';
import { routerCfg, originalNavigation } from '../constants';
// import { backendCfg, routerCfg, setNavigation, originalNavigation } from '../constants';
import fetch from '../utils/request';

const login = ({ payload }) => fetch.post('haiLogin/login', { data: payload }).catch(e => e);
const logout = ({ payload }) => fetch.post('haiLogin/logout', { data: payload }).catch(e => e);
// const queryPermissions = () => fetch.post('/user/resCodes').catch(e => e);
const wxRout = ({ payload }) => fetch.post('wechatLogin/getUrl', { data: payload }).catch(e => e);

// 首页数据
const queryIndexData = ({ payload, url }) => fetch.post(url, { data: payload }).catch(e => e);
const querySiteMsg = ({ payload }) => fetch.post('/sitemsg/queryUserSiteMsg', { data: payload }).catch(e => e);
const readMsg = ({ payload }) => fetch.post('/sitemsg/readMsg', { data: payload }).catch(e => e);

const indexDataArr = [
  '/home/todayOrderNum',
  '/home/todayUnAlloOrderNum',
  '/home/unPurItemNum',
  '/home/todayInItemNum',
  '/home/purExcOrderNum',
  '/home/invExcOrderNum',
  '/home/todayPurOrderNum',
  '/home/todayPurItemNum',
  '/home/balancedItemNum',
  '/home/purchasingOrderNum',
  '/home/waitAlloOrderNum',
  '/home/inItemNum',
  '/home/purchaseProblem',
  '/home/onWayOrder',
  '/home/weekSales',
  '/home/monthSales',
  '/home/weekNewItem',
  '/home/monthNewItem',
  '/home/todaySendOrder',
];

export default {
  namespace: 'session',
  state: {
    username: localStorage.getItem('HAIERP_LAST_USERNAME'),
    dataSource: [],
    overviewInfo: {},
    msgList: [],
    wxData: '',
  },
  reducers: {
    updateUsername(state, { payload }) {
      return { ...state, username: payload };
    },
    updateOverviewInfo(state, { payload }) {
      return {
        ...state,
        overviewInfo: { ...state.overviewInfo, ...payload },
      };
    },
    commonUpdate(state, { payload }) {
      return { ...state, ...payload };
    },
    wxRouterList(state, {payload}){
      return { ...state, wxData: payload.data};
    }
  },
  effects: {
    * queryIndexData(payload, { call, put }) {
      for (let i = 0; i < indexDataArr.length; i++) {
        const data = yield call(queryIndexData, { url: indexDataArr[i], payload: {} });
        const pa = {
          [indexDataArr[i].split('/')[2]]: data.data,
        };
        yield put({
          type: 'updateOverviewInfo',
          payload: pa,
        });
      }
    },
    * querySiteMsg(payload, { call, put }) {
      const data = yield call(querySiteMsg, payload);
      yield put({
        type: 'updateOverviewInfo',
        payload: {
          msgList: data.data
        },
      });
    },
    * readMsg(payload, { call }) {
      yield call(readMsg, payload);
    },
    * logout(payload, { call }) {
      yield call(logout, payload);
    },
    * wxRout(payload, { call, put }) {
      const data = yield call(wxRout, { payload: { ...payload } });
      if (data.success) {
        yield put({
          type: 'wxRouterList',
          payload: data,
        });
      }
    },
    * login(payload, { call }) {
      const data = yield call(login, payload);
      if (data.success) {
        // const permissionData = yield call(queryPermissions);
        // 先处理权限
        // if (permissionData.success) {
        //   const permissions = [...permissionData.data, routerCfg.OVERVIEW];
        //   const newNavigation = [];
        //   originalNavigation.forEach((el) => {
        //     if (permissions.indexOf(backendCfg[el.key]) === -1) {
        //       return;
        //     }
        //     if (!el.child || el.child.length === 0) {
        //       newNavigation.push(el);
        //       return;
        //     }
        //     // 有子代的，还要判断子代
        //     const child = el.child;
        //     const newChild = [];
        //     child.forEach((c) => {
        //       if (permissions.indexOf(backendCfg[c.key]) >= 0) {
        //         newChild.push(c);
        //       }
        //     });
        //     const newEl = { ...el, child: newChild };
        //     newNavigation.push(newEl);
        //   });

        //   setNavigation(newNavigation);

        //   localStorage.setItem('HAIERP_LAST_LOGIN', new Date().getTime());
        //   localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(newNavigation));
        //   localStorage.setItem('HAIERP_LAST_USERNAME', payload.payload.username);

        //   // 更新用户名
        //   yield put({ type: 'updateUsername', payload: payload.payload.username });

        // window.redirector(`/${routerCfg.OVERVIEW}`);
        // }
        localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(originalNavigation));
        window.redirector(`/${routerCfg.OVERVIEW}`);
      } else message.error(data.data);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === `/${routerCfg.LOGIN}`) {
          localStorage.removeItem('HAIERP_LAST_LOGIN');
        }
        if (pathname === '/login' && !window.existCacheState('/login')) {
          setTimeout(() => {
            dispatch({ type: 'wxRout', payload: {} });
          }, 0);
        }
      });
    },
  },
};
