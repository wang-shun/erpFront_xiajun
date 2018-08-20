import { message } from 'antd';
// import { routerCfg, originalNavigation } from '../constants';
import { backendCfg, routerCfg, setNavigation, originalNavigation } from '../constants';
import fetch from '../utils/request';

const login = ({ payload }) => fetch.post('haiLogin/login', { data: payload }).catch(e => e);
const logout = ({ payload }) => fetch.post('haiLogin/logout', { data: payload }).catch(e => e);
const queryPermissions = () => fetch.post('/user/resCodes').catch(e => e);
// 微信扫码中间页面
const wechatLogin = ({ payload }) => fetch.post('/wechatLogin/getUserInfo', { data: payload }).catch(e => e);
const loginByUserNo = ({ payload }) => fetch.post('/wechatLogin/loginByUserNo', { data: payload }).catch(e => e);


// 首页数据
const queryIndexData = ({ payload, url }) => fetch.post(url, { data: payload }).catch(e => e);
const querySiteMsg = ({ payload }) => fetch.post('/sitemsg/queryUserSiteMsg', { data: payload }).catch(e => e);
const readMsg = ({ payload }) => fetch.post('/sitemsg/readMsg', { data: payload }).catch(e => e);

const indexDataArr = [
  '/home/data',
];

export default {
  namespace: 'session',
  state: {
    username: localStorage.getItem('HAIERP_LAST_USERNAME'),
    dataSource: [],
    overviewInfo: {},
    msgList: [],
    wxData: '',
    wxInfo: {},
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
    wxRouterList(state, { payload }) {
      return { ...state, wxData: payload.data };
    },
    wechatLoginInfo(state, { payload }) {
      return { ...state, wxInfo: payload.data }
    }
  },
  effects: {
    * queryIndexData(payload, { call, put }) {
      const data = yield call(queryIndexData, { url: indexDataArr[0], payload: {} });
      const pa = {
        [indexDataArr[0].split('/')[2]]: data.data,
      };
      yield put({
        type: 'updateOverviewInfo',
        payload: pa,
      });

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
    * wechatLogin({ payload, cb, ca }, { call, put }) {
      const data = yield call(wechatLogin, { payload });
      if (data.success) {
        message.success(data.msg);
        yield put({ type: 'wechatLoginInfo', payload: data });
        cb();
        if (data.success) {
          const permissionData = yield call(queryPermissions);
          console.log(permissionData)
          if (permissionData.success) {
            const permissions = [...permissionData.data, routerCfg.OVERVIEW];
            const newNavigation = [];
            originalNavigation.forEach((el) => {

              if (permissions.indexOf(backendCfg[el.key]) === -1) {
                return;
              }
              if (!el.child || el.child.length === 0) {
                newNavigation.push(el);
                return;
              }
              // 有子代的，还要判断子代
              const child = el.child;
              const newChild = [];
              child.forEach((c) => {
                if (permissions.indexOf(backendCfg[c.key]) >= 0) {
                  newChild.push(c);
                }
              });
              const newEl = { ...el, child: newChild };
              newNavigation.push(newEl);
            });
            setNavigation(newNavigation);
            console.log(newNavigation)
            localStorage.setItem('HAIERP_LAST_LOGIN', new Date().getTime());
            localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(newNavigation));
            localStorage.setItem('HAIERP_LAST_USERNAME', data.data.username);

            // 更新用户名
            yield put({ type: 'updateUsername', payload: data.data.username });
            window.redirector(`/${routerCfg.OVERVIEW}`);
          }
          console.log('there')
          // localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(originalNavigation));
          window.redirector(`/${routerCfg.OVERVIEW}`);
        }
      }
      if (!data.success) {
        message.error('请勿刷新，否则需要重新扫码')
        ca();
      }
    },
    * loginByUserNo({ payload, cb }, { call, put }) {
      const data = yield call(loginByUserNo, { payload });
      if (data.success) {
        message.success(data.msg);
      }
      cb();
    },
    * login(payload, { call, put }) {
      const data = yield call(login, payload);
      if (data.success) {
        const permissionData = yield call(queryPermissions);
        console.log(permissionData)
        if (permissionData.success) {
          const permissions = [...permissionData.data, routerCfg.OVERVIEW];
          const newNavigation = [];
          originalNavigation.forEach((el) => {

            if (permissions.indexOf(backendCfg[el.key]) === -1) {
              return;
            }
            if (!el.child || el.child.length === 0) {
              newNavigation.push(el);
              return;
            }
            // 有子代的，还要判断子代
            const child = el.child;
            const newChild = [];
            child.forEach((c) => {
              if (permissions.indexOf(backendCfg[c.key]) >= 0) {
                newChild.push(c);
              }
            });
            const newEl = { ...el, child: newChild };
            newNavigation.push(newEl);
          });
          setNavigation(newNavigation);
          console.log(newNavigation)
          localStorage.setItem('HAIERP_LAST_LOGIN', new Date().getTime());
          localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(newNavigation));
          localStorage.setItem('HAIERP_LAST_USERNAME', payload.payload.username);

          // 更新用户名
          yield put({ type: 'updateUsername', payload: payload.payload.username });
          window.redirector(`/${routerCfg.OVERVIEW}`);
        }
        console.log('there')
        // localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(originalNavigation));
        window.redirector(`/${routerCfg.OVERVIEW}`);
      }// } else message.error(data.data);
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
            // dispatch({ type: 'wxRout', payload: {} });
          }, 0);
        }
      });
    },
  },
};
