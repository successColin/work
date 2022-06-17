/* eslint-disable */
/**
 * @description 点检本地数据库操作方法
 * @autor yezhaojie
 * @update 2019/11/19
 * @readyDB                         创建数据库并且创建表,全部表创建成功后执行回调
 * @dropInspectionTables            删除所有表并关闭数据库,操作成功后执行回调
 *
 * @insertIntoInspectionDo          新增巡检任务数据存储
 * @insertIntoInspectionDeviceDo    新增巡检设备数据存储
 * @insertInspectionpointDo         新增巡检点数据存储
 * @insertFile                      新增文件数据
 *
 * @selectInspectionDo              查询巡检路线数据
 * @selectMoList                    查询设备列表
 * @selectPointDoList               查询巡检点数据
 * @selectworkingHours                  查询工时
 * @selectFileList                  查询文件数据
 * @selectInspectionHistory         查询上传结果页面列表,数量相关的
 * @selectPointsByInspectionDoId    查询已操作的点数据,上传用
 * @selectPointsResults             查询已操作的点数据,查看用
 * @selectInspectionUpData          查询需要上传的路线数据
 * @selectAllFile                   查询搜索未上传文件
 *
 * @updateSql                       通用的更新操作
 * @updateUploadstatus              批量更新上传状态通用接口
 *
 * @deleteFile                      删除文件数据
 * @deleteRoute                     删除巡检路线
 * @deleteSkipMo              删除设备相关的点
 * @deletePointByInspec             删除路线相关的点
 * @deleteInspectionConfig          删除巡检配置
 */
import DB from './websql.js';

const createInspectionDo = function(cb, cbe) {
  const sql =
     `CREATE TABLE inspectiondo (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       routeCode VARCHAR(50) NOT NULL,
       routeName VARCHAR(50) DEFAULT NULL,
       workingHours decimal(12,4) DEFAULT NULL,
       devicedocount int DEFAULT NULL
   )`;
  DB.executeSql(sql, () => {
    console.log('巡检路线表创建成功');
    if (cb) cb();
  }, (e) => {
    console.log('巡检路线表创建失败');
    if (cbe) cbe(e);
  });
};

const createInspectionDeviceDo = function(cb, cbe) {
  const sql =
     `CREATE TABLE inspectiondevicedo (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       deviceCode VARCHAR(50) NOT NULL,
       deviceName VARCHAR(50) DEFAULT NULL,
       inspectionRouteId int DEFAULT NULL,
        operatingstatus int default '0',
        uploadstatus int default '0',
       pointdocount int DEFAULT NULL
   )`;
  DB.executeSql(sql, () => {
    console.log('巡检路设备表创建成功');
    if (cb) cb();
  }, (e) => {
    console.log('巡检设备表创建失败');
    if (cbe) cbe(e);
  });
};

const createInspectionPointDo = function(cb, cbe) {
  //  operatingstatus 0：未点检 1：已点检
  //  uploadstatus 0：未上传 1：已上传
  const sql =
    `CREATE TABLE inspectionpointdo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routeCode VARCHAR(50) NOT NULL,
    routeName VARCHAR(50) DEFAULT NULL,
    inspectionRouteId int DEFAULT NULL,
    deviceId int DEFAULT NULL,
    deviceCode VARCHAR(50) DEFAULT NULL,
    deviceName VARCHAR(50) DEFAULT NULL,
    taskCode VARCHAR(50) DEFAULT NULL,
    taskName VARCHAR(50) DEFAULT NULL,
    inspectionPointId int DEFAULT NULL,
    inspectionTaskId int DEFAULT NULL,
    pointCode VARCHAR(50) DEFAULT NULL,
    pointName VARCHAR(50) DEFAULT NULL,
    taskType VARCHAR(50) DEFAULT NULL,
    taskStatus VARCHAR(50) DEFAULT NULL,
    inspectMethod VARCHAR(50) DEFAULT NULL,
    standardCondition VARCHAR(50) DEFAULT NULL,
    taskStartTime VARCHAR(50) DEFAULT NULL,
    taskMemo VARCHAR(50) DEFAULT NULL,
    devicePosition VARCHAR(50) DEFAULT NULL,
    operatingstatus int default '0',
    uploadstatus int default '0',
    standardMeasureLower decimal(12,4) DEFAULT NULL,
    standardMeasureUpper decimal(12,4) DEFAULT NULL,
    inspectOilQty decimal(12,4) DEFAULT NULL,
    inspectUserDesc VARCHAR(1000) DEFAULT NULL,
    inspectMeasureValue decimal(12,4) DEFAULT NULL,
    inspectMeasureValue1 decimal(12,4) DEFAULT NULL,
    inspectMeasureValue2 decimal(12,4) DEFAULT NULL,
    inspectMeasureValue3 decimal(12,4) DEFAULT NULL,
    inspectTime text DEFAULT NULL,
    inspectCondition int DEFAULT '0',
    qrCode VARCHAR(50) DEFAULT NULL,
    rfidCode VARCHAR(50) DEFAULT NULL,
    inspectUserId VARCHAR(50) DEFAULT NULL,
    standardOilQty int default '0',
    imageIds VARCHAR(50) DEFAULT NULL,
    timeCost int default '0',
    hasAbnormal VARCHAR(50) default NULL,
    uploadTime VARCHAR(50) default NULL,
    sno int DEFAULT NULL,
    rfid VARCHAR(50) DEFAULT NULL,
    exvarchar1 VARCHAR(50) DEFAULT NULL,
    exvarchar2 VARCHAR(50) DEFAULT NULL,
    exvarchar3 VARCHAR(50) DEFAULT NULL,
    exint1 int default '0',
    exint2 int default '0',
    exint3 int default '0',
    exdecimal1 decimal(12,4) DEFAULT NULL,
    exdecimal2 decimal(12,4) DEFAULT NULL,
    exdecimal3 decimal(12,4) DEFAULT NULL,
    exdate1 date DEFAULT NULL,
    exdate2 date DEFAULT NULL,
    exdate3 date DEFAULT NULL
   )`;

  DB.executeSql(sql, () => {
    console.log('巡检点表创建成功');
    if (cb) cb();
  }, (e) => {
    console.log('巡检点表创建失败');
    if (cbe) cbe(e);
  });
};

const createInspectionConfigDo = function(cb, cbe) {
  const sql =
    `CREATE TABLE inspectionConfigdo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routeLayer VARCHAR(500) DEFAULT NULL,
    deviceLayer VARCHAR(500) DEFAULT NULL,
    taskLayer VARCHAR(500) DEFAULT NULL
  )`;
  DB.executeSql(sql, () => {
    console.log('巡检配置表创建成功');
    if (cb) cb();
  }, (e) => {
    console.log('巡检配置表创建失败');
    if (cbe) cbe(e);
  });
};

const createInspectionFiles = function(cb, cbe) {
  const sql =
     `CREATE TABLE inspectionfiles (  
       id INTEGER PRIMARY KEY AUTOINCREMENT,  
       inspectionRouteId int DEFAULT NULL,  
       inspectionTaskId int DEFAULT NULL, 
       filetype int DEFAULT NULL, 
       filepath varchar(200) DEFAULT NULL,
       type int DEFAULT NULL,
       createdate text DEFAULT NULL,
       tombstone int DEFAULT NULL,
       uploadstatus int default '0'
      );`;

  DB.executeSql(sql, () => {
    console.log('文件表创建成功');
    if (cb) cb();
  }, (e) => {
    console.log('文件表创建失败');
    if (cbe) cbe(e);
  });
};

const readyDB = function(cb, cbe) {
  DB.openDB([createInspectionDo, createInspectionDeviceDo,
    createInspectionPointDo, createInspectionFiles, createInspectionConfigDo], (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const readyConfigDB = function(cb, cbe) {
  DB.openDB([createInspectionConfigDo], (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 插入巡检配置
const insertIntoInspectionConfigDo = function(inspectiondoConfig, cb, cbe) {
  let inspectiondoDataSql = '';
  const inspectiondoColumnName = ['id', 'routeLayer', 'deviceLayer', 'taskLayer'];
  const resInspectiondoConfigData = ['id', 'routeLayer', 'deviceLayer', 'taskLayer'];
  const str = JSON.stringify()
  const sqlStrBefore = ' select ';
  const sqlStrAfterAry = resInspectiondoConfigData.map((columnItem) => {
    const result = inspectiondoConfig[columnItem] ? `'${JSON.stringify(inspectiondoConfig[columnItem])}'` : 1;
    return result;
  });
  inspectiondoDataSql += (sqlStrBefore + sqlStrAfterAry.join(','));
  const sql = `insert into inspectionConfigdo(${inspectiondoColumnName.join(',')}) ${inspectiondoDataSql};`;
  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 批量插入巡检路线
const insertIntoInspectionDo = function(inspectiondoData, cb, cbe) {
  if (inspectiondoData.length === 0) return;
  let inspectiondoDataSql = '';
  const inspectiondoColumnName = ['id', 'routeCode', 'routeName', 'workingHours', 'devicedocount'];
  const resInspectiondoData = ['id', 'routeCode', 'routeName', 'workingHours', 'devicedocount'];
  inspectiondoData.forEach((item, index) => {
    const sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
    const sqlStrAfterAry = resInspectiondoData.map((columnItem) => {
      const result = (!item[columnItem] && item[columnItem] !== 0) ? 'null' : `'${item[columnItem]}'`;
      return result;
    });
    inspectiondoDataSql += (sqlStrBefore + sqlStrAfterAry.join(','));
  });
  const sql = `insert into inspectiondo(${inspectiondoColumnName.join(',')}) ${inspectiondoDataSql};`;
  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 批量插入巡检设备
const insertIntoInspectionDeviceDo = function(inspectiondoDeviceData, cb, cbe) {
  if (inspectiondoDeviceData.length === 0) return;
  let inspectiondevicedoDataSql = '';
  const inspectiondevicedoColumnName = ['id', 'deviceCode', 'deviceName', 'inspectionRouteId', 'pointdocount', 'uploadstatus'];
  const resInspectiondevicedoData = ['id', 'deviceCode', 'deviceName', 'inspectionRouteId', 'pointdocount', 'uploadstatus'];
  inspectiondoDeviceData.forEach((item, index) => {
    const sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
    // eslint-disable-next-line arrow-body-style
    const sqlStrAfterAry = resInspectiondevicedoData.map((columnItem) => {
      return (!item[columnItem] && item[columnItem] !== 0) ? 'null' : `'${item[columnItem]}'`;
      // return result;
    });
    inspectiondevicedoDataSql += (sqlStrBefore + sqlStrAfterAry.join(','));
  });
  const sql = `insert into inspectiondevicedo(${inspectiondevicedoColumnName.join(',')}) ${inspectiondevicedoDataSql};`;
  console.log(sql);
  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 批量插入巡检点D
const insertInspectionpointDo = function(inspectionpointdoData, cb, cbe) {
  if (inspectionpointdoData.length === 0) return;
  let inspectionpointdoDataSql = '';
  const inspectionpointdoColumnName = ['id', 'routeCode', 'routeName', 'inspectionRouteId', 'deviceId', 'deviceCode', 'deviceName', 'taskCode', 'taskName',
    'inspectionPointId', 'inspectionTaskId', 'pointCode', 'pointName', 'taskType', 'taskStatus', 'inspectMethod', 'standardCondition', 'taskStartTime', 'taskMemo', 'devicePosition',
    'uploadstatus', 'standardMeasureLower', 'standardMeasureUpper', 'inspectOilQty', 'inspectUserDesc', 'inspectMeasureValue', 'inspectTime', 'inspectCondition',
    'qrCode', 'rfidCode', 'inspectUserId', 'standardOilQty', 'imageIds', 'timeCost', 'hasAbnormal', 'uploadTime', 'inspectMeasureValue1', 'inspectMeasureValue2', 'inspectMeasureValue3',
    'sno', 'rfid', 'exvarchar1', 'exvarchar2', 'exvarchar3', 'exint1', 'exint2', 'exint3', 'exdecimal1', 'exdecimal2', 'exdecimal3', 'exdate1', 'exdate2', 'exdate3'
  ];
  const resInspectiondoData = ['id', 'routeCode', 'routeName', 'inspectionRouteId', 'deviceId', 'deviceCode', 'deviceName', 'taskCode', 'taskName',
    'inspectionPointId', 'inspectionTaskId', 'pointCode', 'pointName', 'taskType', 'taskStatus', 'inspectMethod', 'standardCondition', 'taskStartTime', 'taskMemo', 'devicePosition',
    'uploadstatus', 'standardMeasureLower', 'standardMeasureUpper', 'inspectOilQty', 'inspectUserDesc', 'inspectMeasureValue', 'inspectTime', 'inspectCondition',
    'qrCode', 'rfidCode', 'inspectUserId', 'standardOilQty', 'imageIds', 'timeCost', 'hasAbnormal', 'uploadTime', 'inspectMeasureValue1', 'inspectMeasureValue2', 'inspectMeasureValue3',
    'sno', 'rfid', 'exvarchar1', 'exvarchar2', 'exvarchar3', 'exint1', 'exint2', 'exint3', 'exdecimal1', 'exdecimal2', 'exdecimal3', 'exdate1', 'exdate2', 'exdate3'
  ];
  inspectionpointdoData.forEach((item, index) => {
    const sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
    // eslint-disable-next-line arrow-body-style
    const sqlStrAfterAry = resInspectiondoData.map((columnItem) => {
      const result = (!item[columnItem] && item[columnItem] !== 0) ? 'null' : `'${item[columnItem]}'`;
      return result;
    });
    inspectionpointdoDataSql += (sqlStrBefore + sqlStrAfterAry.join(','));
  });
  const sql = `insert into inspectionpointdo(${inspectionpointdoColumnName.join(',')}) ${inspectionpointdoDataSql};`;

  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 批量插入文件
const insertFile = function(insertFileData, cb, cbe) {
  if (insertFileData.length === 0) return;
  let insertFileSql = '';
  const fileColumnName = ['id', 'inspectionRouteId', 'inspectionTaskId', 'filetype', 'filepath', 'type', 'createdate',
    'tombstone'
  ];
  insertFileData.forEach((item, index) => {
    const sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
    // eslint-disable-next-line arrow-body-style
    const sqlStrAfterAry = fileColumnName.map((columnItem) => {
      return item[columnItem] === undefined ? 'null' : `'${item[columnItem]}'`;
      // return result;
    });
    insertFileSql += (sqlStrBefore + sqlStrAfterAry.join(','));
  });
  const sql = `insert into inspectionfiles(${fileColumnName.join(',')}) ${insertFileSql};`;

  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 根据巡检点Id查询文件
const selectFileList = function(inspectionTaskId, cb, cbe) {
  const sql =
    `SELECT * FROM
      inspectionfiles
    WHERE
      inspectionTaskId = ${inspectionTaskId};`;

  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 根据巡检点Id查询文件
const selectInspectionConfig = function(cb, cbe) {
  const sql =
    `SELECT * FROM
      inspectionConfigdo
    WHERE
      1 = 1;`;

  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 根据ID删除文件
const deleteFile = function(fileid, cb, cbe) {
  const sql = `DELETE FROM inspectionfiles WHERE id = ${fileid};`;

  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 查询巡检路线任务
const selectInspectionDo = function(params = {}, cb, cbe) {
  const keywords = params.keywords ? ` AND (inspectiondo.routeCode like '%${params.keywords}%' OR inspectiondo.routeName like '%${params.keywords}%')` : '';
  const sql =
    `SELECT inspectiondo.id,inspectiondo.routeCode, inspectiondo.routeName,
      (SELECT COUNT(*) 
      FROM (SELECT deviceCode,inspectionRouteId 
          FROM inspectionpointdo 
          WHERE inspectionpointdo.uploadstatus != 1
          GROUP BY inspectionRouteId,deviceCode
        ) motable
      WHERE motable.inspectionRouteId = inspectiondo.id) AS deviceCount,
      (SELECT COUNT(1) 
        FROM (SELECT COUNT(*) AS devicecount,SUM(operatingstatus) AS operatingcount,inspectionRouteId
          FROM inspectionpointdo
          WHERE inspectionpointdo.uploadstatus != 1
          GROUP BY inspectionRouteId,deviceCode
          HAVING devicecount = operatingcount) finishDeviceTable
      WHERE inspectionRouteId = inspectiondo.id) AS finishDeviceCount
    FROM
      inspectiondo
    WHERE
    1 = 1
    ${keywords}
    GROUP BY
      inspectiondo.id
    ORDER BY 
      inspectiondo.routeName;`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 根据路线任务id获取设备列表
const selectMoList = function(inspectionDoId, cb, cbe) {
  const sql =
    `SELECT inspectionpointdo.id, inspectionpointdo.deviceId, inspectionpointdo.deviceCode, inspectionpointdo.deviceName, inspectionpointdo.inspectionRouteId, inspectionpointdo.devicePosition, inspectionpointdo.operatingstatus,
    count(*) AS pointCount,
    (SELECT COUNT(*)
    FROM (SELECT deviceCode,inspectionRouteId 
        FROM inspectionpointdo 
        WHERE inspectionpointdo.uploadstatus != 1 AND inspectionpointdo.inspectCondition = 2
        GROUP BY inspectionRouteId,deviceCode
      ) motable
    WHERE motable.inspectionRouteId = ${inspectionDoId} AND motable.deviceCode = inspectionpointdo.deviceCode) AS abnormalPointCount,
    sum(inspectionpointdo.operatingstatus) AS finishPointCount
    FROM
      inspectionpointdo
      LEFT JOIN inspectiondo ON inspectionpointdo.inspectionRouteId = inspectiondo.id
    WHERE
      inspectionpointdo.inspectionRouteId = ${inspectionDoId} 
      AND inspectionpointdo.uploadstatus != 1
    GROUP BY
      inspectionpointdo.deviceCode
    ORDER BY 
      inspectionpointdo.deviceCode;`;
  console.log(sql);
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const selectworkingHours = function(id, cb, cbe) {
  const sql = `select workingHours from inspectiondo where id=${id}`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};
//  解锁查询是否有对应任务
const selectPointDoListByCode = function(inspectionDoId, code, type, cb, cbe) {
  let keywords;
  if (Number(type) === 1) {
    keywords = ` AND inspectionpointdo.rfidCode = '${code}'`;
  } else if (Number(type) === 2) {
    keywords = ` AND inspectionpointdo.qrCode = '${code}'`;
  } else {
    keywords = ` AND inspectionpointdo.deviceCode = '${code}'`;
  }
  const sql =
    `SELECT
    inspectionpointdo.inspectionPointId,
    inspectionpointdo.inspectionTaskId,
    inspectionpointdo.pointCode,
    inspectionpointdo.pointName,
    inspectionpointdo.taskName,
    inspectionpointdo.inspectionRouteId,
    inspectionpointdo.taskStartTime,
    inspectionpointdo.taskType,
    inspectionpointdo.operatingstatus,
    inspectionpointdo.standardMeasureUpper,
    inspectionpointdo.standardMeasureLower,
    inspectionpointdo.standardCondition,
    inspectionpointdo.inspectMethod,
    inspectionpointdo.inspectOilQty,
    inspectionpointdo.inspectCondition,
    inspectionpointdo.taskMemo,
    inspectionpointdo.inspectUserDesc,
    inspectionpointdo.inspectMeasureValue,
    inspectionpointdo.inspectMeasureValue1,
    inspectionpointdo.inspectMeasureValue2,
    inspectionpointdo.inspectMeasureValue3,
    inspectionpointdo.imageIds,
    inspectionpointdo.hasAbnormal,
    inspectionpointdo.timeCost,
    inspectionpointdo.uploadTime,
    inspectionpointdo.inspectTime,
    inspectionpointdo.exvarchar1,
    inspectionpointdo.exvarchar2,
    inspectionpointdo.exvarchar3,
    inspectionpointdo.exint1,
    inspectionpointdo.exint2,
    inspectionpointdo.exint3,
    inspectionpointdo.exdecimal1,
    inspectionpointdo.exdecimal2,
    inspectionpointdo.exdecimal3,
    inspectionpointdo.exdate1,
    inspectionpointdo.exdate2,
    inspectionpointdo.exdate3
  FROM
    inspectionpointdo
  LEFT JOIN inspectiondo ON inspectiondo.id = inspectionpointdo.inspectionRouteId
  WHERE
    inspectionpointdo.inspectionRouteId = ${inspectionDoId}
  ${keywords}
  AND inspectionpointdo.uploadstatus != 1
  ORDER BY
    inspectionpointdo.sno IS NULL,
    inspectionpointdo.sno ASC,
    inspectionpointdo.inspectionTaskId ASC;`;
  console.log(sql);
  DB.selectSql(sql, (res) => {
    console.log(res, 111111111)
    console.log(cb, 111111111)
    if (cb) cb(res);
  }, (e) => {
    console.log(e, 222222222222)
    if (cbe) cbe(e);
  });
};

// 查询巡检点列表
const selectPointDoList = function(inspectionDoId, deviceCode, cb, cbe) {
  const sql =
    `SELECT
      inspectionpointdo.inspectionPointId,
      inspectionpointdo.inspectionTaskId,
      inspectionpointdo.pointCode,
      inspectionpointdo.pointName,
      inspectionpointdo.taskName,
      inspectionpointdo.inspectionRouteId,
      inspectionpointdo.taskStartTime,
      inspectionpointdo.taskType,
      inspectionpointdo.operatingstatus,
      inspectionpointdo.standardMeasureUpper,
      inspectionpointdo.standardMeasureLower,
      inspectionpointdo.standardCondition,
      inspectionpointdo.inspectMethod,
      inspectionpointdo.inspectOilQty,
      inspectionpointdo.inspectCondition,
      inspectionpointdo.taskMemo,
      inspectionpointdo.inspectUserDesc,
      inspectionpointdo.inspectMeasureValue,
      inspectionpointdo.inspectMeasureValue1,
      inspectionpointdo.inspectMeasureValue2,
      inspectionpointdo.inspectMeasureValue3,
      inspectionpointdo.imageIds,
      inspectionpointdo.hasAbnormal,
      inspectionpointdo.uploadTime,
      inspectionpointdo.timeCost,
      inspectionpointdo.inspectTime
    FROM
      inspectionpointdo
    LEFT JOIN inspectiondo ON inspectiondo.id = inspectionpointdo.inspectionRouteId
    WHERE
      inspectionpointdo.inspectionRouteId = ${inspectionDoId}
    AND inspectionpointdo.deviceCode = '${deviceCode}'
    AND inspectionpointdo.uploadstatus != 1
    ORDER BY
      inspectionpointdo.sno IS NULL,
      inspectionpointdo.sno ASC,
      inspectionpointdo.id ASC;`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const updateSql = function(tableName, values, where, cb, cbe) {
  if (Object.prototype.toString.call(values) !== '[object Object]' && Object.prototype.toString.call(where) !==
    '[object Object]') return;
  const valuesAry = Object.keys(values).map((item) => `${item}='${values[item]}'`);
  const whereAry = Object.keys(where).map((item) => `${item}='${where[item]}'`);
  const valuesSql = valuesAry.join(',');
  const whereSql = whereAry.join(' AND ');
  const sql = `UPDATE ${tableName} SET ${valuesSql} WHERE ${whereSql};`;

  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
    uni.showModal({
      title: '提示',
      content: '数据更新失败'
    });
  });
};

//  解锁查询是否有对应任务
const selectPointtimeCost = function(inspectionTaskId, cb, cbe) {
  const sql =
    `SELECT
    inspectionpointdo.inspectionPointId,
    inspectionpointdo.inspectionTaskId,
    inspectionpointdo.timeCost,
    inspectionpointdo.inspectTime
  FROM
    inspectionpointdo
  WHERE
    inspectionpointdo.inspectionTaskId = ${inspectionTaskId};`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 获取路线的上传结果-- 上传用
const selectPointsByInspectionDoId = function(cb, cbe) {
  const sql =
  `select 
      inspectionPointId, deviceCode, deviceId, deviceName, 
      devicePosition, inspectMethod, inspectCondition, inspectMeasureValue1, inspectMeasureValue2, inspectMeasureValue3,
      inspectMeasureValue, inspectMethod, inspectOilQty, inspectTime, inspectUserDesc, 
      inspectUserId, pointCode, pointName, qrCode, rfidCode, routeCode, inspectionRouteId, 
      routeName, standardCondition, standardMeasureLower, standardMeasureUpper, 
      standardOilQty, taskCode, inspectionTaskId, taskMemo, 
      taskName, taskStartTime, taskStatus, imageIds, hasAbnormal, uploadTime, timeCost,
      taskType
  from 
    inspectionpointdo 
  where 
    operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0;`;

  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 获取路线的上传结果-- 查看用
const selectPointsResults = function(inspectionDoId, cb, cbe) {
  const sql =
    `select 
      inspectionPointId, deviceCode, deviceId, deviceName, 
      devicePosition, inspectMethod, inspectCondition, inspectMeasureValue1, inspectMeasureValue2, inspectMeasureValue3, 
      inspectMeasureValue, inspectMethod, inspectOilQty, inspectTime, inspectUserDesc, 
      inspectUserId, pointCode, pointName, qrCode, rfidCode, routeCode, inspectionRouteId, 
      routeName, standardCondition, standardMeasureLower, standardMeasureUpper, 
      standardOilQty, taskCode, inspectionTaskId, taskMemo, 
      taskName, taskStartTime, taskStatus, imageIds, hasAbnormal, uploadTime, timeCost,
      taskType, exvarchar1, exvarchar2, exvarchar3, exint1, exint2, exint3, exdecimal1,
      exdecimal2, exdecimal3, exdate1, exdate2, exdate3
    from 
      inspectionpointdo 
    where 
      operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0 and inspectionpointdo.inspectionRouteId = ${inspectionDoId};`;

  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 获取已修改路线
const selectInspectionHistory = function(cb, cbe) {
  const sql =
    `SELECT
    inspectiondo.id,
    inspectiondo.routeCode,
    inspectiondo.routeName,
    inspectiondo.workingHours,
    COUNT(*) AS allCount,
    SUM(
    CASE
    WHEN inspectionpointdo.inspectCondition = 1 THEN
    1
    ELSE
    0
    END
    ) AS normalCount,
    SUM(
    CASE
    WHEN inspectionpointdo.inspectCondition = 2 THEN
    1
    ELSE
    0
    END
    ) AS abNormalCount,
    SUM(
      CASE
      WHEN inspectionpointdo.inspectCondition = 3 THEN
      1
      ELSE
      0
      END
      ) AS shutDownCount,
    (
    SELECT
    COUNT(*)
    FROM
    (
    SELECT
      deviceCode,
      inspectionRouteId
    FROM
      inspectionpointdo
    WHERE operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0
    GROUP BY
    inspectionRouteId,
      deviceCode
    ) motable
    WHERE
    motable.inspectionRouteId = inspectiondo.id
    ) AS deviceCount
  FROM
    inspectionpointdo
  LEFT JOIN inspectiondo ON inspectionpointdo.inspectionRouteId = inspectiondo.id
  WHERE inspectionpointdo.operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0 AND inspectiondo.workingHours is not null
  GROUP BY
  inspectionpointdo.inspectionRouteId;`;

  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const dropInspectionTables = function(cb, cbe) {
  const dropTables = ['inspectiondo', 'inspectiondevicedo', 'inspectionpointdo', 'inspectionfiles', 'inspectionConfigdo'];
  const promiseDropTables = dropTables.map((tablesName) => {
    const result = new Promise((resolve, reject) => {
      DB.drop(tablesName, resolve, reject);
    });
    return result;
  });

  Promise.all(promiseDropTables).then((result) => {
    DB.closeDB(() => {
      if (cb) cb(result);
    });
  }).catch((error) => {
    if (cbe) cbe(error);
    uni.showModal({
      title: '提示',
      content: '数据表删除失败'
    });
  });
};

const dropInspectionConfigTables = function(cb, cbe) {
  const dropTables = ['inspectionConfigdo'];
  const promiseDropTables = dropTables.map((tablesName) => {
    const result = new Promise((resolve, reject) => {
      DB.drop(tablesName, resolve, reject);
    });
    return result;
  });

  Promise.all(promiseDropTables).then((result) => {
    DB.closeDB(() => {
      if (cb) cb(result);
    });
  }).catch((error) => {
    if (cbe) cbe(error);
    uni.showModal({
      title: '提示',
      content: '数据表删除失败'
    });
  });
};

// 查询需要上传的路线信息
const selectInspectionUpData = function (cb, cbe) {
  const sql =
    `SELECT
    inspectionpointdo.deviceCode,
    inspectionpointdo.deviceId,
    inspectionpointdo.deviceName,
    inspectionpointdo.devicePosition,
    inspectionpointdo.inspectCondition,
    inspectionpointdo.inspectMeasureValue,
    inspectionpointdo.inspectMeasureValue1,
    inspectionpointdo.inspectMeasureValue2,
    inspectionpointdo.inspectMeasureValue3,
    inspectionpointdo.inspectMethod,
    inspectionpointdo.inspectOilQty,
    inspectionpointdo.inspectTime,
    inspectionpointdo.inspectUserDesc,
    inspectionpointdo.inspectUserId,
    inspectionpointdo.pointCode,
    inspectionpointdo.inspectionPointId,
    inspectionpointdo.pointName,
    inspectionpointdo.qrCode,
    inspectionpointdo.rfidCode,
    inspectionpointdo.routeCode,
    inspectionpointdo.inspectionRouteId,
    inspectionpointdo.routeName,
    inspectionpointdo.standardCondition,
    inspectionpointdo.standardMeasureLower,
    inspectionpointdo.standardMeasureUpper,
    inspectionpointdo.standardOilQty,
    inspectionpointdo.taskCode,
    inspectionpointdo.inspectionTaskId,
    inspectionpointdo.taskMemo,
    inspectionpointdo.taskName,
    inspectionpointdo.taskStartTime,
    inspectionpointdo.taskStatus,
    inspectionpointdo.hasAbnormal,
    inspectionpointdo.timeCost,
    inspectionpointdo.uploadTime,
    inspectionpointdo.taskType
  FROM
    inspectionpointdo
  WHERE inspectionpointdo.operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0
  GROUP BY
    inspectionpointdo.inspectionRouteId;`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 批量修改
const updateUploadstatus = function (tableName, ary, cb, cbe) {
  const idStr = ary.join(',');
  const sql = `UPDATE ${tableName} SET uploadstatus = 1 WHERE inspectionTaskId in (${idStr});`;
  DB.executeSql(sql, () => {
    if (cb) cb();
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 查询图片对应的任务
const selectInspectionPointByImg = function (inspectionTaskId, cb, cbe) {
  const sql =
    `SELECT
    inspectionpointdo.imageIds,
    inspectionpointdo.taskName,
    inspectionpointdo.inspectionTaskId
  FROM
    inspectionpointdo
  WHERE inspectionpointdo.inspectionTaskId = ${inspectionTaskId};`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 查询文件
const selectAllFile = function (cb, cbe) {
  const sql =
  `SELECT
    id,
    inspectionTaskId,
    filepath
  FROM
    inspectionfiles
  WHERE
    uploadstatus = 0
  GROUP BY
  inspectionfiles.inspectionTaskId;`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const deleteRoute = function (inspectionRouteId, cb, cbe) {
  const sql = `delete from inspectiondo where id in (${inspectionRouteId});`;
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const deleteSkipMo = function(inspectionDoId, deviceId, cb, cbe) {
  const sql =
    `DELETE FROM inspectionpointdo WHERE inspectionpointdo.inspectionRouteId = ${inspectionDoId} AND inspectionpointdo.deviceId IN (${deviceId})`;
  console.log(sql);
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const deletePointByInspec = function (inspectionRouteId, cb, cbe) {
  const sql = `delete from inspectionpointdo where inspectionpointdo.inspectionRouteId in (${inspectionRouteId});`;
  console.log(sql);
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

const currencyHaiLiScanning = function(keycode, inspectiondoid, cb, cbe) {
  const sql = `select deviceCode from inspectionpointdo  where ';${keycode};' like '%;'||deviceCode||';%' and inspectionpointdo.inspectionRouteId = ${inspectiondoid} group by deviceCode`;
  console.log(sql);
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

// 判断强制点检点是否全部完成：forcepointfinish 0=没有全部完成；1=全部完成
const forceInspection = function(inspectiondoid, cb, cbe) {
  const sql = `SELECT a.deviceName, a.deviceCode, (count( a.id ) = count( b.filepath )) AS 'forcepointfinish' FROM inspectionpointdo a LEFT JOIN inspectionfiles b ON a.inspectionTaskId = b.inspectionTaskId WHERE a.inspectionRouteId = ${inspectiondoid} AND a.taskType = 999;`;
  console.log(sql);
  DB.selectSql(sql, (res) => {
    if (cb) cb(res);
  }, (e) => {
    if (cbe) cbe(e);
  });
};

export {
  readyDB,
  insertIntoInspectionDo,
  insertIntoInspectionDeviceDo,
  insertInspectionpointDo,
  selectInspectionDo,
  selectMoList,
  selectPointDoList,
  selectworkingHours,
  dropInspectionTables,
  updateSql,
  insertFile,
  selectFileList,
  deleteFile,
  selectInspectionHistory,
  selectPointsByInspectionDoId,
  selectPointsResults,
  selectInspectionUpData,
  updateUploadstatus,
  selectAllFile,
  deleteRoute,
  deleteSkipMo,
  deletePointByInspec,
  currencyHaiLiScanning,
  forceInspection,
  selectPointDoListByCode,
  selectInspectionPointByImg,
  selectPointtimeCost,
  insertIntoInspectionConfigDo,
  selectInspectionConfig,
  readyConfigDB,
  dropInspectionConfigTables
};
