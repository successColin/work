// eslint-disable-next-line no-unused-vars
const isEmpty = (data) => data === null || data === undefined || data === '';
const isEmptyArray = (data) => (Array.isArray(data) ? data.length === 0 : true);

// eslint-disable-next-line import/prefer-default-export
export class NodeUtils {
  /**
   * 根据自增数生成64进制id
   * @returns 64进制id字符串
   */
  static idGenerator() {
    let qutient = new Date() - new Date('2020-08-01');
    qutient += Math.ceil(Math.random() * 1000); // 防止重複
    const chars =
      '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split('');
    const radix = chars.length;
    const res = [];
    do {
      const mod = qutient % radix;
      qutient = (qutient - mod) / radix;
      res.push(charArr[mod]);
    } while (qutient);
    return res.join('');
  }

  /**
   * 判断节点类型
   * @param {Node} node - 节点数据
   * @returns Boolean
   */
  static isConditionNode(node) {
    return node && node.type === 'condition';
  }

  static isCopyNode(node) {
    return node && node.type === 'copy';
  }

  static isStartNode(node) {
    return node && node.type === 'start';
  }

  static isApproverNode(node) {
    return node && node.type === 'approver';
  }

  static isFillInNode(node) {
    return node && node.type === 'fill';
  }

  static isBackEndNode(node) {
    return node && node.type === 'backend_data';
  }

  static isWebHookNode(node) {
    return node && node.type === 'webhook';
  }

  static isProcedureNode(node) {
    return node && node.type === 'procedure';
  }

  static isNoticeNode(node) {
    return node && node.type === 'notice';
  }

  /**
   *
   * @param obj 检查的对象
   * @param key 检查对象中的字段
   * @returns {boolean}
   */
  static isExistInObj(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  /**
   * 判断该值是否是对象
   * @param obj
   * @returns {boolean}
   */
  static isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  /**
   * 校验单个节点必填项完整性
   * @param {Node} node - 节点数据
   */
  // eslint-disable-next-line no-unused-vars
  static checkNode(node, parent) {
    // 抄送人应该可以默认自选
    let valid = true;
    const props = node.properties;
    // eslint-disable-next-line no-unused-expressions
    this.isStartNode(node) && !props.initiator && (valid = false);
    // eslint-disable-next-line no-unused-expressions
    this.isConditionNode(node) &&
      !props.isDefault &&
      !props.initiator &&
      isEmptyArray(props.conditions) &&
      (valid = false);

    const customSettings = ['myself', 'optional', 'director'];
    // eslint-disable-next-line no-unused-expressions
    this.isApproverNode(node) &&
      !customSettings.includes(props.assigneeType) &&
      isEmptyArray(props.approvers) &&
      (valid = false);
    return valid;
  }
}
