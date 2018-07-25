import React from 'react';
import { Router, IndexRoute, Route, Redirect } from 'dva/router';
import { routerCfg } from './constants';

// 视图组件
import MainLayout from './layouts/Main';
import Message from './components/Message';
import Login from './components/Login';
import LoginTest from './components/Login/LoginTest'
import Overview from './components/Overview';
import Products from './components/Products/Products';
import FindProducts from './components/Products/FindProducts';
import Brands from './components/Products/Brands';
import PackageScale from './components/Products/PackageScale';
import PackageLevel from './components/Products/PackageLevel';
import Package from './components/Products/Package';
import Sku from './components/Sku/Sku';
import Category from './components/Category/Category';
import Order from './components/Order/Order';
import ErpOrder from './components/Order/ErpOrder';
import ShippingOrder from './components/Order/ShippingOrder';
import ReturnOrder from './components/Order/ReturnOrder';
import SaleChannel from './components/Order/SaleChannel';
import Purchase from './components/Purchase/Purchase'; // 采购管理
import PurchaseStorage from './components/Purchase/PurchaseStorage'; // 采购入库管理
import Journal from './components/Check/Journal'; // 流水管理
import Receipt from './components/Check/Receipt'; // 小票管理
import UncompletePurchaseStorage from './components/Purchase/UncompletePurchaseStorage';// 未完成采购
import Agency from './components/Agency/Agency';
import AgencyType from './components/Agency/AgencyType';
import BuyerList from './components/Agency/BuyerList';
import Inventory from './components/Inventory/Inventory';
import Warehouse from './components/Inventory/Warehouse'; // 仓库管理
import Inout from './components/Inventory/Inout'; // 仓库管理
import Out from './components/Inventory/Out'; // 仓库管理
import Resource from './components/Permission/Resource';
import Test from './components/Permission/Test';
import Role from './components/Permission/Role';
import User from './components/Permission/User';
import Organization from './components/Permission/Organization';
import ReportSaleByDay from './components/Report/ReportSaleByDay';
import ReportSaleByCategory from './components/Report/ReportSaleByCategory';
import ReportSaleByBrand from './components/Report/ReportSaleByBrand';
import ReportItemListing from './components/Report/ReportItemListing';
import ReportShippingByDay from './components/Report/ReportShippingByDay';
import ReportSaleBySaleName from './components/Report/ReportSaleBySaleName';
import ReportDeliveryByDate from './components/Report/ReportDeliveryByDate';
import ReportSaleRefund from './components/Report/ReportSaleRefund';
import ReportFreightByDay from './components/Report/ReportFreightByDay';
import ReportPurchaseBySku from './components/Report/ReportPurchaseBySku';
import ReportSaleByScale from './components/Report/ReportSaleByScale';
import StockWarehouse from './components/Inventory/Stock'; // 备货仓库管理
import PurchaseReceipt from './components/Purchase/PurchaseReceipt'; // 小票管理
import PurchaseReceiptTask from './components/Purchase/PurchaseReceiptTask'; // 小票明细管理
import ReportNoStock from './components/Report/ReportNoStock';
import ReportNoSendPackage from './components/Report/ReportNoSendPackage';
import ReportlogisticCompanyAvgPackage from './components/Report/ReportlogisticCompanyAvgPackage';
import RoleMng from './components/RoleMng/RoleMng';
// 小程序设置
import appset from './components/MyApp/appset';



function redirectHelper(...args) {
  // 传入参数3，为onEnter
  const len = args.length;
  const { location } = args[len - 3];
  const replace = args[len - 2];
  const callback = args[len - 1];
  const lastLoginTime = parseInt(localStorage.getItem('HAIERP_LAST_LOGIN') || 0, 10);
  const isTimeout = new Date().getTime() - lastLoginTime > (60 * 24 * 60 * 1000) - 10000; // 24小时超时
  if (isTimeout && location.pathname !== `/${routerCfg.LOGIN}`) replace(`/${routerCfg.LOGIN}`);
  else if (location.pathname === '/') replace(`/${routerCfg.OVERVIEW}`);
  callback();
}

function RouterConfig({ history }) {
  return (
    <Router history={history}>
    <Route path={`/${routerCfg.LOGINTEST}`} component={LoginTest} />
    <Route
        path="/"
        component={MainLayout}
        onEnter={redirectHelper}
        onChange={redirectHelper}
      >
        <IndexRoute component={Login} />
        {/* 临时处理 */}
        {/* <Route path={`/${routerCfg.SETTINGS}`} component={Warehouse} /> */}
        <Route path={`/${routerCfg.SETTINGS}/${routerCfg.WAREHOUSE}`} component={Warehouse} />

        {/* <Route path={`/${routerCfg.MYAPP}`} component={appset} /> */}
        <Route path={`/${routerCfg.MYAPP}/${routerCfg.APP_SETTINGS}`} component={appset} />


        {/* <Route path={`/${routerCfg.MARKETING}`} component={SaleChannel} /> */}
        <Route path={`/${routerCfg.MARKETING}/${routerCfg.SALE_CHANNEL}`} component={SaleChannel} />

        <Route path={`/${routerCfg.LOGIN}`} component={Login} />
        <Route path={`/${routerCfg.MESSAGE}`} component={Message} />
        <Route path={`/${routerCfg.OVERVIEW}`} component={Overview} />
        <Route path={`/${routerCfg.PERMISSION}/${routerCfg.RESOURCE}`} component={Resource} />
        <Route path={`/${routerCfg.PERMISSION}/${routerCfg.ROLE}`} component={Role} />
        <Route path={`/${routerCfg.PERMISSION}/${routerCfg.TEST}`} component={Test} />
        <Route path={`/${routerCfg.PERMISSION}/${routerCfg.USER}`} component={User} />
        <Route path={`/${routerCfg.PERMISSION}/${routerCfg.ORGANIZATION}`} component={Organization} />

        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`} component={Products} />
        {/* <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.FINDITEM_LIST}`} component={FindProducts} /> */}
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.BRAND_LIST}`} component={Brands} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.SKU_LIST}`} component={Sku} />
        {/* <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PACKAGE_SCALE}`} component={PackageScale} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PACKAGE_LEVEL}`} component={PackageLevel} /> */}
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PACKAGE_SCALE}`} component={Package} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.CATE_LIST}`} component={Category} />

        <Route path={`/${routerCfg.SALE}/${routerCfg.ORDER_LIST}`} component={Order} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.ERP_ORDER}`} component={ErpOrder} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.SHIPPING_ORDER}`} component={ShippingOrder} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.RETURN_ORDER}`} component={ReturnOrder} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.SALE_CHANNEL}`} component={SaleChannel} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.PURCHASE_LIST}`} component={Purchase} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.PURCHASE_STORAGE}`} component={PurchaseStorage} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.UNCOMPLETE_TASK_DAILY_ORDER}`} component={UncompletePurchaseStorage} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.CHECK}/${routerCfg.JOURNAL}`} component={Journal} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.CHECK}/${routerCfg.RECEIPT}`} component={Receipt} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.RECEIPT_LIST}`} component={PurchaseReceipt} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.RECEIPT_TASK_LIST}`} component={PurchaseReceiptTask} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.BUYER_LIST}`} component={BuyerList} />
        <Route path={`/${routerCfg.PERSON}/${routerCfg.AGENCY_LIST}`} component={Agency} />
        <Route path={`/${routerCfg.PERSON}/${routerCfg.AGENCY_TYPE}`} component={AgencyType} />
        <Route path={`/${routerCfg.INVENTORY}/${routerCfg.INVENTORY_LIST}`} component={Inventory} />
        {/* <Route path={`/${routerCfg.INVENTORY}/${routerCfg.WAREHOUSE}`} component={Warehouse} /> */}
        <Route path={`/${routerCfg.INVENTORY}/${routerCfg.INOUT}`} component={Inout} />
        <Route path={`/${routerCfg.INVENTORY}/${routerCfg.OUT}`} component={Out} />
        <Route path={`/${routerCfg.INVENTORY}/${routerCfg.STOCKWAREHOUSE}`} component={StockWarehouse} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SALE_BY_DAY}`} component={ReportSaleByDay} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SALE_BY_CATEGORY}`} component={ReportSaleByCategory} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SALE_BY_BRAND}`} component={ReportSaleByBrand} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_ITEM_LISTING}`} component={ReportItemListing} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SHIPPING_BY_DAY}`} component={ReportShippingByDay} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SALE_BYSCALE_NAME}`} component={ReportSaleBySaleName} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_DELIVERY_BY_DATE}`} component={ReportDeliveryByDate} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SALE_REFUND}`} component={ReportSaleRefund} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_FREIGHT_BY_DAY}`} component={ReportFreightByDay} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_PURCHASE_BY_SKU}`} component={ReportPurchaseBySku} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_SALE_BYSCALE}`} component={ReportSaleByScale} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_NOSTOCKREPORT}`} component={ReportNoStock} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_PXPACKAGEREPORT}`} component={ReportNoSendPackage} />
        <Route path={`/${routerCfg.REPORT}/${routerCfg.REPORT_AVGREPORT}`} component={ReportlogisticCompanyAvgPackage} />
        <Route path={`/${routerCfg.ROLE_MNG}`} component={RoleMng} />
        {/* 一级导航重定向 */}
        <Redirect from={`/${routerCfg.PERMISSION}`} to={`/${routerCfg.PERMISSION}/${routerCfg.ROLE}`} />
        <Redirect from={`/${routerCfg.PRODUCTS}`} to={`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`} />
        <Redirect from={`/${routerCfg.SALE}`} to={`/${routerCfg.SALE}/${routerCfg.ORDER_LIST}`} />
        <Redirect from={`/${routerCfg.PURCHASE}`} to={`/${routerCfg.PURCHASE}/${routerCfg.PURCHASE_LIST}`} />
        <Redirect from={`/${routerCfg.PERSON}`} to={`/${routerCfg.PERSON}/${routerCfg.AGENCY_LIST}`} />
        <Redirect from={`/${routerCfg.INVENTORY}`} to={`/${routerCfg.INVENTORY}/${routerCfg.INVENTORY_LIST}`} />
        <Redirect from={`/${routerCfg.REPORT}`} to={`/${routerCfg.REPORT}/${routerCfg.REPORT_SHIPPING_BY_DAY}`} />
        <Redirect from={`/${routerCfg.SETTINGS}`} to={`/${routerCfg.SETTINGS}/${routerCfg.WAREHOUSE}`} />
        <Redirect from={`/${routerCfg.MARKETING}`} to={`/${routerCfg.MARKETING}/${routerCfg.SALE_CHANNEL}`} />
        <Redirect from={`/${routerCfg.MYAPP}`} to={`/${routerCfg.MYAPP}/${routerCfg.APP_SETTINGS}`} />        
        {/* 二级导航重定向 */}
        <Redirect from={`/${routerCfg.PURCHASE}/${routerCfg.CHECK}`} to={`/${routerCfg.PURCHASE}/${routerCfg.CHECK}/${routerCfg.JOURNAL}`} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
