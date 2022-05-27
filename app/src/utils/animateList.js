export default {
  /**
   * 删除的动画
   * @param list，数组,列表的数组
   * @param deletObj，要删除数据的对象，要唯一标识，并且在list中存在
   * @param selector 选择器
   * @param key 根据某个属性来寻找
   * @param type 是否是table列表或者还是自定义全列表
   * @param animateType 动画类型，add ,delete
   */
  animateFun({ deleteArr = [], selector, type = '', animateType = '' }) {
    deleteArr.forEach((index) => {
      // const index = list.findIndex(
      //   (item) => item[keyName] === deleteObj[keyName]
      // );
      const classType =
        animateType === 'delete'
          ? 'animate__fadeOutRight'
          : 'animate__fadeInRight';
      if (index === -1) return;
      if (type === 'table') {
        const removeClass = (dom) => {
          if (dom) {
            // dom.classList.remove('fadeInUp');
            // dom.classList.remove('animate__fadeInRight');
            dom.className = 'el-table__row';
            dom.classList.add('animate__animated');
            dom.classList.add(classType);
          }
        };
        const domList1 = document.querySelectorAll(
          `${selector} .el-table__body-wrapper .el-table__row`
        );
        removeClass(domList1[index]);
        const domList2 = document.querySelectorAll(
          `${selector} .el-table__fixed .el-table__row`
        );
        removeClass(domList2[index]);
        const domList3 = document.querySelectorAll(
          `${selector} .el-table__fixed-right .el-table__row`
        );
        removeClass(domList3[index]);
      } else {
        const dom = document.querySelectorAll(`${selector}`);
        dom[index].classList.add('animate__animated');
        dom[index].classList.add(classType);
      }
    });
  },
  /* eslint-disable no-await-in-loop */
  async renderListItem(selector) {
    const domArr1 = document.querySelectorAll(
      `${selector} .el-table__body-wrapper .el-table__row`
    );
    const domArr2 = document.querySelectorAll(
      `${selector} .el-table__fixed .el-table__row`
    );
    const domArr3 = document.querySelectorAll(
      `${selector} .el-table__fixed-right .el-table__row`
    );
    for (let i = 0; i < domArr1.length; i += 1) {
      this.addClassFun(domArr1[i], domArr2[i], domArr3[i], i);
    }
  },
  addClassFun(dom1, dom2, dom3, i) {
    // return new Promise((resolve) => {
    const classType = 'fadeInUp';
    const addClass = (dom) => {
      dom.className = 'el-table__row';
      dom.style = `animation-duration: ${100 * i}ms`;
      dom.classList.add('animate__animated');
      dom.classList.add(classType);
      setTimeout(() => {
        dom.classList.remove(classType);
      }, 100 * i);
    };
    if (dom1) {
      addClass(dom1);
    }
    if (dom2) {
      addClass(dom2);
    }
    if (dom3) {
      addClass(dom3);
    }
  },
};
