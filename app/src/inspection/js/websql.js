/* eslint-disable */
const isOpenDB = function() {
  return plus.sqlite.isOpenDatabase({
    name: "EAMDB",
    path: "_doc/EAMDB.db"
  });
}

const DB = {
  openDB: function(tableList, cb, cbe) {
    if (!isOpenDB()) {
      plus.sqlite.openDatabase({
        name: 'EAMDB',
        path: '_doc/EAMDB.db',
        success: function(e) {
          let promiseTableList = tableList.map(function(createTableFn, index) {
            return new Promise(function(resolve, reject) {
              createTableFn(resolve, reject);
            })
          })
          Promise.all(promiseTableList).then(function(result) {
            if (cb) cb(result);
          }).catch(function(error) {
            if(cbe) cbe(error);
            uni.showModal({
              title: '提示',
              content: '数据表创建失败'
            })
          })
        },
        fail: function(e) {
          if(cbe) cbe(e);
          uni.showModal({
            title: '提示',
            content: '数据库打开失败'
          })
          console.log('openDatabase failed: ' + JSON.stringify(e));
        }
      });
    } else {
      if (cb) cb();
    }
  },
  openEamDataBase: function(){
    plus.sqlite.openDatabase({
      name: 'EAMDB',
      path: '_doc/EAMDB.db',
      success: function(e) {
        console.log('openDatabaseSuccess!')
      },
      fail: function(e) {
        console.log('openDatabase failed: ' + JSON.stringify(e));
      }
    })
  },
  closeDB: function(cb) {
    if (isOpenDB()) {
      plus.sqlite.closeDatabase({
        name: 'EAMDB',
        success: function(e) {
          console.log('closeDatabase success!');
          if(cb) cb();
        },
        fail: function(e) {
          console.log('closeDatabase failed: ' + JSON.stringify(e));
        }
      });
    }
  },
  executeSql: function(sql, cb, cbe) {
    if (isOpenDB()) {
      plus.sqlite.executeSql({
        name: 'EAMDB',
        sql: sql,
        success: function(e) {
          console.log('executeSql success!');
          if (cb) cb();
        },
        fail: function(e) {
          console.log('executeSql failed: ' + JSON.stringify(e));
          if (cbe) cbe(e)
        }
      })
    } else {
      this.openEamDataBase()
      this.executeSql(sql, cb, cbe);
    }

  },
  selectSql: function(sql, cb, cbe) {
    let isOpenDBFlag = isOpenDB()
    console.log(JSON.stringify(isOpenDBFlag))
    if (isOpenDBFlag) {
      plus.sqlite.selectSql({
        name: 'EAMDB',
        sql: sql,
        success: function(data) {
          console.log('selectSql success! ');
          if (cb) cb(data);
        },
        fail: function(e) {
          console.log('selectSql failed: ' + JSON.stringify(e));
          if (cbe) cbe(e)
        }
      });
    } else {
      this.openEamDataBase()
      this.selectSql(sql, cb, cbe);
    }
  },
  drop: function(tableName, cb, cbe) {
    if (isOpenDB()) {
      let sql = `DROP TABLE IF EXISTS ${tableName};`;
      plus.sqlite.executeSql({
        name: 'EAMDB',
        sql: sql,
        success: function(e) {
          console.log('executeSql success!');
          if (cb) cb();
        },
        fail: function(e) {
          console.log('executeSql failed: ' + JSON.stringify(e));
          if (cbe) cbe(e)
        }
      })
    }else{
      this.openEamDataBase()
      this.drop(tableName, cb, cbe)
    }
  }
}

export default DB
