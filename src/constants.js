/* eslint-disable object-property-newline */
export const API_URL = 'http://localhost';

// 后端权限码映射
export const backendCfg = {
  /* xiongjieying add */
  permission: 'permission',
  role: 'role',
  resource: 'resource',
  user: 'user',
  organization: 'organization',
  /**xiajun */
  myApp: 'myApp',
  appSettings: 'appSettings',
  appDecorate: 'appDecorate',
  release: 'release',
  /**xiajun */
  products: 'item',
  productsList: 'item_list',
  /**xiajun */
  //finditemList: 'finditem_list', // 商品列表
  channelPriceSet: 'channelPriceSet',//渠道价格设置(new)
  itemKindManage: 'itemKindManage',//商品分类管理(new)
  itemImport: "itemImport",//商品导入(new)
  itemDispatchSet: 'itemDispatchSet',//商品分销设置(new)
  /**xiajun */
  //营销管理，xiajun
  marketing: 'marketing',
  marketingTools: 'marketingTools',//营销工具
  distributeManage: 'distributeManage',//分销管理
  //设置，xiajun
  settings: 'settings',
  baseSettings: 'baseSettings',//基本设置
  eCommerceChannelSettings: 'eCommerceChannelSettings',//电商渠道设置
  shippingModuleManage: 'shippingModuleManage',//物流模块管理,
  business: 'business',
  brandList: 'item_brand',
  skuList: 'item_skulist',
  package: 'item_scale',
  packageLevel: 'item_level',
  category: 'category',
  sale: 'sale',
  orderList: 'sale_outerorder',
  erpOrder: 'sale_erporder',
  shippingOrder: 'sale_shippingorder',
  returnOrder: 'sale_erpreturnorder',
  saleChannel: 'sale_channel',
  saleAgent:'sale_agent',
  purchase: 'purchase',
  purchaseList: 'purchase_task',
  purchaseStorage: 'purchase_storage',
  uncompleteTaskDailyOrder: 'uncomplete_task_daily_order',
  person: 'seller',
  agencyType: 'seller_type',
  agencyList: 'seller_list',
  buyerList: 'buyer_list',
  inventory: 'inventory',
  sendingGoodsManage: 'sendingGoodsManage',//发货管理new
  inventoryList: 'inventory_list',
  warehouse: 'inventory_warehouse',
  //stockwarehouse: 'inventory_stockwarehouse', // 备货仓库管理
  inout: 'inventory_inout',
  inventoryCheck: 'inventoryCheck', // 盘点管理
  out: 'inventory_out',
  report: 'report',
  reportSaleByDay: 'report_sale_byday',
  reportSaleByCategory: 'report_sale_bycategory',
  reportSaleByBrand: 'report_sale_bybrand',
  reportItemListing: 'report_item_listing',
  reportShippingByDay: 'report_shipping_byday',
  reportDeliveryByDate: 'report_delivery_bydate',
  reportSaleRefund: 'report_sale_refund',
  reportFreightByDay: 'report_freight_byday',
  reportPurchaseBySku: 'report_purchase_bysku',
  reportSaleByScale: 'report_sale_byscale',
  reportSaleBySaleName: 'report_sale_byscalename',
  //receiptList: 'receipt_List',
  receiptTaskList: 'receipt_task_List',
  reportNoStockReport: 'report_NoStockReport',
  reportPxPackageReport: 'report_PxPackageReport',
  reportAvgReport: 'report_AvgReport',
  /* wxuser:'wxuser',
  wxactivity:'wx_activity',*/
  // 内置
  
  roleMng: 'role_mng',
  // 新订单管理
  order:'order',
  orderManage: 'orderManage',
  deliverManage: 'deliverManage',
  serviceManage:'serviceManage',
  //渠道管理
  channel:'channel',
  channelBinding : 'channelBinding',
  channelInstall: 'channelInstall',
};

// 路由字符串常量配置
export const routerCfg = {
  // 登录
  LOGIN: 'login',
  LOGINTEST:'logintest',
  // 信息
  MESSAGE: 'message',
  // 总览
  OVERVIEW: 'overview',
  // 我的小程序(new),xiajun
  MYAPP: 'myApp',
  APP_SETTINGS: 'appSettings',
  APP_DECORATE: 'appDecorate',
  APPSETTEST:'appsetTest',
  RELEASE:'release',
  // RELEASETEST:'releaseTest',
  //营销管理，xiajun
  MARKETING: 'marketing',
  MARKETING_TOOLS: 'marketingTools',//营销工具
  DISTRIBUTE_MANAGE: 'distributeManage',//分销管理
  SEEAGENT:'SeeAgent',
  DETAILAGENT:'detailAgent',

  // 权限管理
  PERMISSION: 'permission',
  ROLE: 'role',
  RESOURCE: 'resource',
  USER: 'user',
  TEST: 'test',
  ORGANIZATION: 'organization',
  // 商品管理
  PRODUCTS: 'products',
  PRODUCTS_LIST: 'productsList',
  BRAND_LIST: 'brandList',
  SKU_LIST: 'skuList',
  CATE_LIST: 'cateList',
  PACKAGE_SCALE: 'package',
  PACKAGE_LEVEL: 'packageLevel',
  /*xiajun*/
  //FINDITEM_LIST: 'finditemList', // 采购商品列表
  CHANNEL_PRICE_SET: 'channelPriceSet',//渠道价格设置(new)
  ITEM_KIND_MANAGE: 'itemKindManage',//商品分类管理(new)
  ITEM_IMPORT: "itemImport",//商品导入(new)
  ITEM_DISPATCH_SET: 'itemDispatchSet',//商品分销设置(new)
  /*xiajun*/

  // 销售管理
  SALE: 'sale',
  ORDER_LIST: 'orderList',
  ERP_ORDER: 'erpOrder',
  SHIPPING_ORDER: 'shippingOrder',
  RETURN_ORDER: 'returnOrder',
  SALE_CHANNEL: 'saleChannel',
  SALE_AGENT: 'saleAgent',
  AGENTTEST: 'AgentTest',
  // 采购管理
  PURCHASE: 'purchase',
  PURCHASE_LIST: 'purchaseList',
  PURCHASE_STORAGE: 'purchaseStorage',
  UNCOMPLETE_TASK_DAILY_ORDER: 'uncompleteTaskDailyOrder',
  //RECEIPT_LIST: 'receiptList', // 新增小票管理
  RECEIPT_TASK_LIST: 'receiptTaskList', // 小票明细管理
  /* CHECK: 'check', // 盘点管理
  JOURNAL: 'journal', // 流水管理
  RECEIPT: 'receipt', // 小票管理*/
  // 客户管理
  PERSON: 'person',
  AGENCY_LIST: 'agencyList',
  AGENCY_TYPE: 'agencyType',
  BUYER_LIST: 'buyerList',
  // 库存管理
  INVENTORY: 'inventory',
  SENDING_GOODS_MANAGE: 'sendingGoodsManage',//发货管理new
  INVENTORY_LIST: 'inventoryList',
  WAREHOUSE: 'warehouse', // 仓库管理
  INOUT: 'inout', // 出入库管理
  OUT: 'out', // 出库单管理
  INVENTORY_CHECK: 'inventoryCheck', // 盘点管理
  //STOCKWAREHOUSE: 'stockwarehouse', // 备货仓库管理

  //设置，xiajun
  SETTINGS: 'settings',
  BASE_SETTINGS: 'baseSettings',//基本设置
  E_COMMERCE_CHANNEL_SETTINGS: 'eCommerceChannelSettings',//电商渠道设置
  SHIPPING_MODULE_MANAGE: 'shippingModuleManage',//物流模块管理,
  BUSINESS: 'business',//商家信息管理
  // 报表管理
  REPORT: 'report',
  REPORT_SALE_BY_DAY: 'reportSaleByDay',
  REPORT_SALE_BY_CATEGORY: 'reportSaleByCategory',
  REPORT_SALE_BY_BRAND: 'reportSaleByBrand',
  REPORT_ITEM_LISTING: 'reportItemListing',
  REPORT_SHIPPING_BY_DAY: 'reportShippingByDay',
  REPORT_SALE_BYSCALE_NAME: 'reportSaleBySaleName', // 录入报表
  REPORT_DELIVERY_BY_DATE: 'reportDeliveryByDate',
  REPORT_SALE_REFUND: 'reportSaleRefund',
  REPORT_FREIGHT_BY_DAY: 'reportFreightByDay',
  REPORT_PURCHASE_BY_SKU: 'reportPurchaseBySku', // 采购入库sku
  REPORT_SALE_BYSCALE: 'reportSaleByScale', // 服装规格2占销售报表
  REPORT_NOSTOCKREPORT: 'reportNoStockReport', // 未备货报表
  REPORT_PXPACKAGEREPORT: 'reportPxPackageReport', // 包裹未发出报表
  REPORT_AVGREPORT: 'reportAvgReport', // 包裹时效
  // 微信用户管理
  /* WXUSER:'wxuser',
  WXUSERLIST:'wxactivity',*/

  // ROLE_MNG: 'roleMng',
  //新订单管理
  ORDER:'order',
  ORDERMANAGE: 'orderManage',
  DELIVERMANAGE: 'deliverManage',
  SERVICEMANAGE:'serviceManage',
  //渠道管理
  CHANNEL:'channel',
  CHANNELBINDING : 'channelBinding',
  CHANNELINSTALL: 'channelInstall',

};

export const originalNavigation = [
  { key: routerCfg.OVERVIEW, name: '首页', icon: 'laptop' },
  {
    key: routerCfg.PRODUCTS, name: '商品管理', icon: 'gift',
    child: [
      { key: routerCfg.PRODUCTS_LIST, name: '商品列表' },
      { key: routerCfg.SKU_LIST, name: 'SKU管理' },
      //{ key: routerCfg.CHANNEL_PRICE_SET, name: '渠道价格设置' },
      //{ key: routerCfg.ITEM_KIND_MANAGE, name: '商品分类管理' },
      { key: routerCfg.CATE_LIST, name: '类目管理' },
      { key: routerCfg.BRAND_LIST, name: '品牌管理' },
      { key: routerCfg.PACKAGE_SCALE, name: '包装管理' },
      // { key: routerCfg.PACKAGE_LEVEL, name: '包装规格' },
      // { key: routerCfg.FINDITEM_LIST, name: '采购商品' },
      //{ key: routerCfg.ITEM_IMPORT, name: '商品导入' },
      //{ key: routerCfg.ITEM_DISPATCH_SET, name: '商品分销设置' },
    ],
  },
  {
    key: routerCfg.PURCHASE, name: '采购管理', icon: 'shopping-cart',
    child: [
      { key: routerCfg.PURCHASE_LIST, name: '采购任务管理' },
      { key: routerCfg.PURCHASE_STORAGE, name: '采购入库管理' },

      //{ key: routerCfg.RECEIPT_TASK_LIST, name: '采购小票明细管理' },
      { key: routerCfg.RECEIPT_TASK_LIST, name: '采购小票管理' },
      { key: routerCfg.BUYER_LIST, name: '买手管理' },
      // { key: routerCfg.CHECK,
      //   name: '盘点管理',
      //   child: [
      //     { key: routerCfg.JOURNAL, name: '流水管理' },
      //     { key: routerCfg.RECEIPT, name: '小票管理' },
      //   ],
      // },

      //{ key: routerCfg.RECEIPT_LIST, name: '采购小票管理' },

      // { key: routerCfg.UNCOMPLETE_TASK_DAILY_ORDER, name: '未完成采购管理' },
    ],
  },
  {
    key: routerCfg.SALE, name: '订单管理', icon: 'calendar',
    child: [
      { key: routerCfg.ORDER_LIST, name: '订单管理' },
      { key: routerCfg.ERP_ORDER, name: '发货管理' },
      { key: routerCfg.RETURN_ORDER, name: '售后管理' },
      { key: routerCfg.SHIPPING_ORDER, name: '发货单管理' },
      //{ key: routerCfg.RETURN_ORDER, name: '退单管理' },

    ],
  },
  // {
  //   key: routerCfg.ORDER, name: '订单管理', icon: 'calendar',
  //   child: [
  //     { key: routerCfg.orderManage, name: '订单管理'},
  //     { key: routerCfg.deliverManage, name: '发货管理'},
  //     { key: routerCfg.serviceManage, name:'售后管理'}
  //   ]
  // },
  {
    key: routerCfg.MYAPP, name: '我的小程序', icon: 'message',
    child: [
      { key: routerCfg.APP_SETTINGS, name: '小程序设置' },
      // { key: routerCfg.APP_DECORATE, name: '小程序装修' },
      { key: routerCfg.RELEASE, name: '小程序发布管理' },
    ],
  },
  {
    key: routerCfg.MARKETING, name: '营销管理', icon: 'pie-chart', 
    child: [
      //{ key: routerCfg.MARKETING_TOOLS, name: '营销工具' },
      // { key: routerCfg.DISTRIBUTE_MANAGE, name: '分销管理' },
      { key: routerCfg.SALE_CHANNEL, name: '销售渠道管理' },
      { key: routerCfg.SALE_AGENT, name:'代理管理'},
    ],
  },
  // { key: routerCfg.PERSON, name: '客户管理', icon: 'user',
  //   child: [
  //     { key: routerCfg.AGENCY_LIST, name: '销售管理' },
  //     { key: routerCfg.AGENCY_TYPE, name: '销售类别' },
  //   ],
  // },
  {
    key: routerCfg.INVENTORY, name: '库存管理', icon: 'appstore-o',
    child: [
      // { key: routerCfg.SENDING_GOODS_MANAGE, name: '发货管理'},
      { key: routerCfg.INVENTORY_LIST, name: '库存管理' },

      { key: routerCfg.INOUT, name: '出入库记录' },
      { key: routerCfg.OUT, name: '出库单管理' },
      // { key: routerCfg.INVENTORY_CHECK, name: '盘点管理' },
      //{ key: routerCfg.STOCKWAREHOUSE, name: '备货仓管理' },
    ],
  },
  // { key: routerCfg.REPORT, name: '报表管理', icon: 'file',
  //   child: [
  //     { key: routerCfg.REPORT_SALE_BY_DAY, name: '销售报表(按天)' },
  //     { key: routerCfg.REPORT_SALE_BY_CATEGORY, name: '销售报表(按类目)' },
  //     { key: routerCfg.REPORT_SALE_BY_BRAND, name: '销售报表(按品牌)' },
  //     { key: routerCfg.REPORT_ITEM_LISTING, name: '上新报表' },
  //     { key: routerCfg.REPORT_SHIPPING_BY_DAY, name: '发货报表' },
  //     { key: routerCfg.REPORT_SALE_BYSCALE_NAME, name: '销售录入单报表' },
  //     { key: routerCfg.REPORT_DELIVERY_BY_DATE, name: '发货报表(按人按天)' },
  //     { key: routerCfg.REPORT_SALE_REFUND, name: '退单报表' },
  //     { key: routerCfg.REPORT_FREIGHT_BY_DAY, name: '物流费报表' },
  //     { key: routerCfg.REPORT_PURCHASE_BY_SKU, name: '采购入库sku' },
  //     { key: routerCfg.REPORT_SALE_BYSCALE, name: '服装规格2占销售比报表' },
  //     { key: routerCfg.REPORT_NOSTOCKREPORT, name: '未备货商品记录报表' },
  //     { key: routerCfg.REPORT_PXPACKAGEREPORT, name: '物流公司异常包裹报表' },
  //     { key: routerCfg.REPORT_AVGREPORT, name: '物流公司时效报表' },
  //   ],
  // },
  // { key: routerCfg.ROLE_MNG, name: '角色管理', icon: 'lock' },
  /*{ key: routerCfg.WXUSER, name: '小程序活动管理', icon: 'torsos',
   child: [
     { key: routerCfg.WXUSERLIST, name: '小程序优惠活动' },
   ],
 },*/
  //设置，xiajun
  {
    key: routerCfg.SETTINGS, name: '设置', icon: 'setting',
    child: [
      //{ key: routerCfg.BASE_SETTINGS, name: '基本设置'},
      //{ key: routerCfg.E_COMMERCE_CHANNEL_SETTINGS, name: '电商渠道设置' },
      { key: routerCfg.WAREHOUSE, name: '仓库设置' },
      { key: routerCfg.BUSINESS, name: '商家信息管理' },
      //{ key: routerCfg.WAREHOUSE, name: '物流模块管理' },
      //{ key: routerCfg.STOCKWAREHOUSE, name: '备货仓管理' },
    ],
  },
  {
    key: routerCfg.PERMISSION, name: '权限管理', icon: 'team',
    child: [     
      { key: routerCfg.ROLE, name: '角色管理' },
      { key: routerCfg.USER, name: '用户管理' },
      { key: routerCfg.ORGANIZATION, name: '部门管理' },
      { key: routerCfg.RESOURCE, name: '资源管理' },
    ],
  },
  { 
    key: routerCfg.CHANNEL, name:'渠道管理', icon:'fork',
    child: [
      // { key:routerCfg.channelBinding, name: '渠道绑定'},
      { key: routerCfg.CHANNELINSTALL, name:'价格设置'}
    ]
  },

];

let navigation = [];

export function getNavigation() { return originalNavigation; }
export function setNavigation(data) { navigation = data; }
