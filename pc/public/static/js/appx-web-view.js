/*! For license information please see index.js.LICENSE.txt */
!(function (e) {
  const t = {};

  function r(n) {
    if (t[n]) return t[n].exports;
    const o = t[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return e[n].call(o.exports, o, o.exports, r),
    o.l = !0,
    o.exports;
  }

  r.m = e,
  r.c = t,
  r.d = function (e, t, n) {
    r.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: n
    });
  }
  ,
  r.r = function (e) {
    typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: 'Module'
    }),
    Object.defineProperty(e, '__esModule', {
      value: !0
    });
  }
  ,
  r.t = function (e, t) {
    if (1 & t && (e = r(e)),
    8 & t) {
      return e;
    }
    if (4 & t && typeof e === 'object' && e && e.__esModule) return e;
    const n = Object.create(null);
    if (r.r(n),
    Object.defineProperty(n, 'default', {
      enumerable: !0,
      value: e
    }),
    2 & t && typeof e !== 'string') {
      for (const o in e) {
        r.d(n, o, ((t) => e[t])
          .bind(null, o));
      }
    }
    return n;
  }
  ,
  r.n = function (e) {
    const t = e && e.__esModule ? function () {
      return e.default;
    }
      : function () {
        return e;
      };
    return r.d(t, 'a', t),
    t;
  }
  ,
  r.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  ,
  r.p = '',
  r(r.s = 118);
}([function (e, t, r) {
  r.r(t),
  r.d(t, '__extends', (() => o
  )),
  r.d(t, '__assign', (() => a
  )),
  r.d(t, '__rest', (() => i
  )),
  r.d(t, '__decorate', (() => s
  )),
  r.d(t, '__param', (() => u
  )),
  r.d(t, '__metadata', (() => c
  )),
  r.d(t, '__awaiter', (() => l
  )),
  r.d(t, '__generator', (() => d
  )),
  r.d(t, '__exportStar', (() => p
  )),
  r.d(t, '__values', (() => f
  )),
  r.d(t, '__read', (() => _
  )),
  r.d(t, '__spread', (() => h
  )),
  r.d(t, '__spreadArrays', (() => m
  )),
  r.d(t, '__await', (() => v
  )),
  r.d(t, '__asyncGenerator', (() => g
  )),
  r.d(t, '__asyncDelegator', (() => y
  )),
  r.d(t, '__asyncValues', (() => E
  )),
  r.d(t, '__makeTemplateObject', (() => b
  )),
  r.d(t, '__importStar', (() => S
  )),
  r.d(t, '__importDefault', (() => w
  ));
  var n = function (e, t) {
    return (n = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (e, t) {
      e.__proto__ = t;
    }
        || function (e, t) {
          for (const r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
        }
    )(e, t);
  };

  function o(e, t) {
    function r() {
      this.constructor = e;
    }

    n(e, t),
    e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype,
    new r());
  }

  var a = function () {
    return (a = Object.assign || function (e) {
      for (var t, r = 1, n = arguments.length; r < n; r++) for (const o in t = arguments[r]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e;
    }
    ).apply(this, arguments);
  };

  function i(e, t) {
    const r = {};
    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let o = 0;
      for (n = Object.getOwnPropertySymbols(e); o < n.length; o++) t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
    }
    return r;
  }

  function s(e, t, r, n) {
    let o;
    const a = arguments.length;
    let
      i = a < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, r) : n;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') {
      i = Reflect.decorate(e, t, r, n);
    } else {
      for (let s = e.length - 1; s >= 0; s--) (o = e[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
    }
    return a > 3 && i && Object.defineProperty(t, r, i),
    i;
  }

  function u(e, t) {
    return function (r, n) {
      t(r, n, e);
    };
  }

  function c(e, t) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(e, t);
  }

  function l(e, t, r, n) {
    return new (r || (r = Promise))((((o, a) => {
      function i(e) {
        try {
          u(n.next(e));
        } catch (e) {
          a(e);
        }
      }

      function s(e) {
        try {
          u(n.throw(e));
        } catch (e) {
          a(e);
        }
      }

      function u(e) {
        e.done ? o(e.value) : new r((((t) => {
          t(e.value);
        })
        )).then(i, s);
      }

      u((n = n.apply(e, t || [])).next());
    })
    ));
  }

  function d(e, t) {
    let r;
    let n;
    let o;
    let a;
    let
      i = {
        label: 0,
        sent() {
          if (1 & o[0]) throw o[1];
          return o[1];
        },
        trys: [],
        ops: []
      };
    return a = {
      next: s(0),
      throw: s(1),
      return: s(2)
    },
    typeof Symbol === 'function' && (a[Symbol.iterator] = function () {
      return this;
    }
    ),
    a;

    function s(a) {
      return function (s) {
        return (function (a) {
          if (r) throw new TypeError('Generator is already executing.');
          for (; i;) {
            try {
              if (r = 1,
              n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n),
              0) : n.next) && !(o = o.call(n, a[1])).done) {
                return o;
              }
              switch (n = 0,
              o && (a = [2 & a[0], o.value]),
              a[0]) {
                case 0:
                case 1:
                  o = a;
                  break;
                case 4:
                  return i.label++,
                  {
                    value: a[1],
                    done: !1
                  };
                case 5:
                  i.label++,
                  n = a[1],
                  a = [0];
                  continue;
                case 7:
                  a = i.ops.pop(),
                  i.trys.pop();
                  continue;
                default:
                  if (!(o = i.trys,
                  (o = o.length > 0 && o[o.length - 1]) || a[0] !== 6 && a[0] !== 2)) {
                    i = 0;
                    continue;
                  }
                  if (a[0] === 3 && (!o || a[1] > o[0] && a[1] < o[3])) {
                    i.label = a[1];
                    break;
                  }
                  if (a[0] === 6 && i.label < o[1]) {
                    i.label = o[1],
                    o = a;
                    break;
                  }
                  if (o && i.label < o[2]) {
                    i.label = o[2],
                    i.ops.push(a);
                    break;
                  }
                  o[2] && i.ops.pop(),
                  i.trys.pop();
                  continue;
              }
              a = t.call(e, i);
            } catch (e) {
              a = [6, e],
              n = 0;
            } finally {
              r = o = 0;
            }
          }
          if (5 & a[0]) throw a[1];
          return {
            value: a[0] ? a[1] : void 0,
            done: !0
          };
        }([a, s]));
      };
    }
  }

  function p(e, t) {
    for (const r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
  }

  function f(e) {
    const t = typeof Symbol === 'function' && e[Symbol.iterator];
    let r = 0;
    return t ? t.call(e) : {
      next() {
        return e && r >= e.length && (e = void 0),
        {
          value: e && e[r++],
          done: !e
        };
      }
    };
  }

  function _(e, t) {
    let r = typeof Symbol === 'function' && e[Symbol.iterator];
    if (!r) return e;
    let n;
    let o;
    const a = r.call(e);
    const
      i = [];
    try {
      for (; (void 0 === t || t-- > 0) && !(n = a.next()).done;) i.push(n.value);
    } catch (e) {
      o = {
        error: e
      };
    } finally {
      try {
        n && !n.done && (r = a.return) && r.call(a);
      } finally {
        if (o) throw o.error;
      }
    }
    return i;
  }

  function h() {
    for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(_(arguments[t]));
    return e;
  }

  function m() {
    for (var e = 0, t = 0, r = arguments.length; t < r; t++) e += arguments[t].length;
    const n = Array(e);
    let o = 0;
    for (t = 0; t < r; t++) {
      for (let a = arguments[t], i = 0, s = a.length; i < s; i++,
      o++) {
        n[o] = a[i];
      }
    }
    return n;
  }

  function v(e) {
    return this instanceof v ? (this.v = e,
    this) : new v(e);
  }

  function g(e, t, r) {
    if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
    let n;
    const o = r.apply(e, t || []);
    const
      a = [];
    return n = {},
    i('next'),
    i('throw'),
    i('return'),
    n[Symbol.asyncIterator] = function () {
      return this;
    }
    ,
    n;

    function i(e) {
      o[e] && (n[e] = function (t) {
        return new Promise((((r, n) => {
          a.push([e, t, r, n]) > 1 || s(e, t);
        })
        ));
      }
      );
    }

    function s(e, t) {
      try {
        (r = o[e](t)).value instanceof v ? Promise.resolve(r.value.v)
          .then(u, c) : l(a[0][2], r);
      } catch (e) {
        l(a[0][3], e);
      }
      let r;
    }

    function u(e) {
      s('next', e);
    }

    function c(e) {
      s('throw', e);
    }

    function l(e, t) {
      e(t),
      a.shift(),
      a.length && s(a[0][0], a[0][1]);
    }
  }

  function y(e) {
    let t;
    let
      r;
    return t = {},
    n('next'),
    n('throw', ((e) => {
      throw e;
    }
    )),
    n('return'),
    t[Symbol.iterator] = function () {
      return this;
    }
    ,
    t;

    function n(n, o) {
      t[n] = e[n] ? function (t) {
        return (r = !r) ? {
          value: v(e[n](t)),
          done: n === 'return'
        } : o ? o(t) : t;
      }
        : o;
    }
  }

  function E(e) {
    if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
    let t;
    const
      r = e[Symbol.asyncIterator];
    return r ? r.call(e) : (e = f(e),
    t = {},
    n('next'),
    n('throw'),
    n('return'),
    t[Symbol.asyncIterator] = function () {
      return this;
    }
    ,
    t);

    function n(r) {
      t[r] = e[r] && function (t) {
        return new Promise((((n, o) => {
          (function (e, t, r, n) {
            Promise.resolve(n)
              .then(((t) => {
                e({
                  value: t,
                  done: r
                });
              }
              ), t);
          }(n, o, (t = e[r](t)).done, t.value));
        })
        ));
      };
    }
  }

  function b(e, t) {
    return Object.defineProperty ? Object.defineProperty(e, 'raw', {
      value: t
    }) : e.raw = t,
    e;
  }

  function S(e) {
    if (e && e.__esModule) return e;
    const t = {};
    if (e != null) for (const r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
    return t.default = e,
    t;
  }

  function w(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
},
function (e, t, r) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  });
  let n;
  let o;
  let a;
  let i;
  let s;
  let u;
  let c;
  let l;
  let d;
  const p = navigator.userAgent || navigator.swuserAgent;
  const f = p.match(/Android ([\d.]+)/);
  const
    _ = p.match(/TaurusApp\((\S*)/);
  t.clientInfo = (l = p.match(/DingMiniApp\/(\d+\.\d+\.\d+)/),
  d = (o = (n = p.match(/(AliApp|TaurusApp)\((\S*)/)) === null || void 0 === n ? void 0 : n[2]) === null || void 0 === o ? void 0 : o.split('/'),
  {
    clientName: ((a = d) === null || void 0 === a ? void 0 : a[0]) || 'unknown',
    clientVersion: ((u = (s = (i = d) === null || void 0 === i ? void 0 : i[1]) === null || void 0 === s ? void 0 : s.match(/(\d+\.\d+\.\d+)/)) === null || void 0 === u ? void 0 : u[1]) || '0.0.0',
    isDingtalkSDKClient: !!l,
    dingMiniSDKVersion: (c = l) === null || void 0 === c ? void 0 : c[1]
  });
  t.isIPad = !!p.match(/iPad;/),
  t.isWin = p.indexOf('dingtalk-win') > -1,
  t.isMac = p.indexOf('Macintosh; Intel Mac OS') > -1 && !t.isIPad,
  t.isDDPC = t.isWin || t.isMac,
  t.isAndroidPad = !!p.match(/ Pad\/APad/),
  t.isDingtalkSDK = !!_,
  t.AndroidVersion = f && f[1] || '100.0.0',
  t.isAndroid = p.indexOf('Android') > -1,
  t.isIOS = /iPhone|iPad|iPod|iOS/i.test(p),
  t.isLyraVM = p.indexOf('LyraVM') > -1;
  const h = {};
  const m = {};

  function v(e) {
    if (m[e]) return m[e];
    for (var t = [], r = e.split('.'), n = 0; n < r.length; n++) t.push(parseInt(r[n], 10));
    return m[e] = t,
    t;
  }

  function g(e, t) {
    if (e && t) {
      const r = `${e}__${t}`;
      if (r in h) return h[r];
      e = v(e),
      t = v(t);
      for (let n = 0, o = void 0, a = void 0; n < e.length; n++) {
        if ((o = t[n] || 0) > (a = e[n] || 0)) {
          h[r] = -1;
          break;
        }
        if (o < a) {
          h[r] = 1;
          break;
        }
      }
      return h[r] = h[r] || 0,
      h[r];
    }
    return 0;
  }

  t.compareVersion = g,
  t.compareSystemVersion = function (e) {
    return g(t.clientInfo.dingMiniSDKVersion || t.clientInfo.clientVersion, e);
  }
  ,
  t.uaTest = function (e) {
    return e.test(p);
  };
},
function (e, t, r) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  }),
  t.getMember = void 0,
  t.getMember = function (e, t) {
    for (var r = e, n = 0; n < t.length && r; n++) r.hasOwnProperty(t[n]) && (r = r[t[n]]);
    return r;
  };
}, ,
  function (e, t, r) {
    let n;
    const
      o = {};

    function a() {
      return (n || (n = new Function('return this')()),
      n).React;
    }

    for (let i = function (e) {
        Object.defineProperty(o, e, {
          get() {
            return a()[e];
          }
        });
      }, s = 0, u = ['Children', 'createRef', 'Component', 'PureComponent', 'createContext', 'forwardRef', 'lazy', 'memo', 'Fragment', 'StrictMode', 'unstable_ConcurrentMode', 'Suspense', 'unstable_Profiler', 'createElement', 'cloneElement', 'createFactory', 'isValidElement', 'version']; s < u.length; s++) {
      i(u[s]);
    }
    e.exports = o;
  },
  function (e, t, r) {
    let n;
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.TraceType = ((n = {})[1] = 'ClientDidFrameworkLoad',
    n[2] = 'ClientWillRegisterWorker',
    n[3] = 'ClientDidRegisterWorkerSuccess',
    n[4] = 'ClientWillCreateMessageChannel',
    n[5] = 'ClientWillPageFirstRender',
    n[6] = 'ClientDidPluginResourceLoad',
    n[100] = 'HostDidFrameworkLoad',
    n[101] = 'HostDidAppLaunch',
    n[102] = 'HostDidPageCreated',
    n[103] = 'HostWillPageOnLoad',
    n[104] = 'HostWillPageOnShow',
    n[105] = 'HostDidPageFirstRender',
    n[106] = 'HostWillPageOnReady',
    n.JS_ERROR = 'JS_ERROR',
    n.PAGE_METADATA = 'PAGE_METADATA',
    n),
    (function (e) {
      e.i = 'i',
      e.X = 'X',
      e.s = 's',
      e.t = 't',
      e.f = 'f',
      e.M = 'M';
    }(t.TracePhase || (t.TracePhase = {}))),
    t.appLaunchFlow = [t.TraceType[1], t.TraceType[100], t.TraceType[101]],
    t.pluginFlow = [t.TraceType[6]],
    t.pageInitFlow = [t.TraceType[2], t.TraceType[4], t.TraceType[3], t.TraceType[5], t.TraceType[102], t.TraceType[103], t.TraceType[105], t.TraceType[106]];
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.default = function (e, t, r) {
      const n = self;
      const o = n.AlipayJSBridge;

      function a(n) {
        n && n.error && console.error('callBridge error:', e, t, n),
        r && r(n);
      }

      o ? o.call(e, t, a) : document.addEventListener('AlipayJSBridgeReady', (() => {
        n.AlipayJSBridge.call(e, t, a);
      }
      ));
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.default = {
      WORKER_GLOBAL_ERROR: 11,
      RENDER_GLOBAL_ERROR: 12,
      REGISTER_WORKER_ERROR: 13,
      CUSTOM_WORKER_ERROR: 14,
      BLOCK_WORKER_ERROR: 15,
      HTTP_REQUEST_INFO: 16,
      HTTP_REQUEST_PV: 17
    },
    t.HTTP_REQUEST_INFO = 16,
    t.HTTP_REQUEST_PV = 17,
    t.WORKER_GLOBAL_ERROR = 11,
    t.RENDER_GLOBAL_ERROR = 12,
    t.REGISTER_WORKER_ERROR = 13,
    t.CUSTOM_WORKER_ERROR = 14,
    t.CUSTOM_REPORT = 100;
  }, , ,
  function (e, t, r) {
    const n = r(21);
    const o = r(22);
    const a = r(23);

    function i(e, t) {
      return t.encode ? t.strict ? n(e) : encodeURIComponent(e) : e;
    }

    function s(e) {
      const t = e.indexOf('?');
      return t === -1 ? '' : e.slice(t + 1);
    }

    function u(e, t) {
      const r = (function (e) {
        let t;
        switch (e.arrayFormat) {
          case 'index':
            return function (e, r, n) {
              t = /\[(\d*)\]$/.exec(e),
              e = e.replace(/\[\d*\]$/, ''),
              t ? (void 0 === n[e] && (n[e] = {}),
              n[e][t[1]] = r) : n[e] = r;
            };
          case 'bracket':
            return function (e, r, n) {
              t = /(\[\])$/.exec(e),
              e = e.replace(/\[\]$/, ''),
              t ? void 0 !== n[e] ? n[e] = [].concat(n[e], r) : n[e] = [r] : n[e] = r;
            };
          default:
            return function (e, t, r) {
              void 0 !== r[e] ? r[e] = [].concat(r[e], t) : r[e] = t;
            };
        }
      }(t = o({
        arrayFormat: 'none'
      }, t)));
      const n = Object.create(null);
      return typeof e !== 'string' ? n : (e = e.trim()
        .replace(/^[?#&]/, '')) ? (e.split('&')
          .forEach(((e) => {
            const t = e.replace(/\+/g, ' ')
              .split('=');
            const o = t.shift();
            let i = t.length > 0 ? t.join('=') : void 0;
            i = void 0 === i ? null : a(i),
            r(a(o), i, n);
          }
          )),
        Object.keys(n)
          .sort()
          .reduce(((e, t) => {
            const r = n[t];
            return Boolean(r) && typeof r === 'object' && !Array.isArray(r) ? e[t] = (function e(t) {
              return Array.isArray(t) ? t.sort() : typeof t === 'object' ? e(Object.keys(t))
                .sort(((e, t) => Number(e) - Number(t)
                ))
                .map(((e) => t[e]
                )) : t;
            }(r)) : e[t] = r,
            e;
          }
          ), Object.create(null))) : n;
    }

    t.extract = s,
    t.parse = u,
    t.stringify = function (e, t) {
      !1 === (t = o({
        encode: !0,
        strict: !0,
        arrayFormat: 'none'
      }, t)).sort && (t.sort = function () {
      }
      );
      const r = (function (e) {
        switch (e.arrayFormat) {
          case 'index':
            return function (t, r, n) {
              return r === null ? [i(t, e), '[', n, ']'].join('') : [i(t, e), '[', i(n, e), ']=', i(r, e)].join('');
            };
          case 'bracket':
            return function (t, r) {
              return r === null ? i(t, e) : [i(t, e), '[]=', i(r, e)].join('');
            };
          default:
            return function (t, r) {
              return r === null ? i(t, e) : [i(t, e), '=', i(r, e)].join('');
            };
        }
      }(t));
      return e ? Object.keys(e)
        .sort(t.sort)
        .map(((n) => {
          const o = e[n];
          if (void 0 === o) return '';
          if (o === null) return i(n, t);
          if (Array.isArray(o)) {
            const a = [];
            return o.slice()
              .forEach(((e) => {
                void 0 !== e && a.push(r(n, e, a.length));
              }
              )),
            a.join('&');
          }
          return `${i(n, t)}=${i(o, t)}`;
        }
        ))
        .filter(((e) => e.length > 0
        ))
        .join('&') : '';
    }
    ,
    t.parseUrl = function (e, t) {
      return {
        url: e.split('?')[0] || '',
        query: u(s(e), t)
      };
    };
  }, ,
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(13);
    t.formatWpkError = function (e) {
      if (!e) return '';
      if (typeof e === 'string') return e;
      if (Object.prototype.toString.call(e) === '[object Array]') {
        var t = e[4] && e[4].stack ? e[4].stack : '';
        const r = e[4].type === n.syncApiErrorType ? `${(a = e[4]).api} SyncApiError; code: ${a.code}; message: ${a.msg}` : e[0];
        return JSON.stringify({
          w_msg: r || '',
          stack: o(t),
          w_file: e[1] || '',
          w_line: e[2] || '',
          w_col: e[3] || ''
        });
      }
      let a;
      if (String(e.type) === 'error') {
        t = e.error && e.error.stack ? e.error.stack : '';
        return JSON.stringify({
          w_msg: e.toString() || '',
          stack: o(t),
          w_file: e.filename || '',
          w_line: e.lineno || '',
          w_col: e.colno || ''
        });
      }
      return Object.prototype.toString.call(e) === '[object Object]' ? JSON.stringify(e) : `${e}`;
    };
    var o = function (e) {
      if (e) {
        const t = e.split('\n');
        return t.shift(),
        t.join('\n');
      }
      return '';
    };
    t.appSamplingRateConfig = {
      2018102961965200: 0.1,
      2019011062892038: 0.1,
      2018122762676983: 0.1,
      2019062665683134: 0.1,
      2018122462675626: 0.1,
      2019080566070997: 0.1,
      2021001110675497: 0.1,
      2019072265944223: 0.1,
      2019092567798650: 0.1,
      2019012163125296: 0.1
    },
    t.isHitRate = function (e) {
      return e === 1 || e !== 0 && e >= Math.random();
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    t.syncApiErrorType = '__SyncApiError__';
    const o = (function (e) {
      function r(r) {
        let n = this;
        const o = r.code;
        const a = void 0 === o ? '99' : o;
        const i = r.msg;
        const s = void 0 === i ? 'unknown' : i;
        const u = r.api;
        const c = void 0 === u ? 'unknown' : u;
        return (n = e.call(this, s) || this).msg = s,
        n.code = String(a),
        n.api = c,
        n.type = t.syncApiErrorType,
        n;
      }

      return n.__extends(r, e),
      r;
    }(Error));
    t.SyncApiError = o;
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    let n;
    const
      o = r(0)
        .__importDefault(r(10));
    t.default = function (e) {
      return n || (e ? n = o.default.parse(e) : {});
    };
  },
  function (e, t, r) {
    r.r(t);
    r(2).getMember;
    t.default = {
      Ad: !0,
      Ar: !0,
      LivePlayer: !0,
      AiCamera: !0,
      CoverImage: !0,
      CoverView: !0,
      Lottie: !0,
      LivePusher: !0,
      Lifestyle: !0,
      Cdp: !0,
      ContactButton: !0
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    let n;
    let
      o = [];
    t.default = function (e, t, r) {
      o = o.concat(r),
      n || (n = setTimeout((() => {
        n = null,
        o.forEach(((e) => {
          e.context = t;
        }
        ));
        const r = o;
        o = [],
        e && e('ddExec', {
          serviceName: 'biz.util',
          actionName: 'traceLogBatch',
          args: {
            list: r
          }
        });
      }
      ), 50));
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(5);
    const o = [n.TracePhase.f, n.TracePhase.s, n.TracePhase.t];
    const a = {};

    function i(e) {
      return s(e.ph) && n.appLaunchFlow.indexOf(e.name) > -1;
    }

    function s(e) {
      return o.indexOf(e) > -1;
    }

    function u(e, t) {
      const r = t.dur;
      const o = e.ph;
      (s(o) || o === n.TracePhase.X) && r && (e.extraInfo.dur = r);
    }

    function c(e) {
      return n.TraceType[e];
    }

    const l = /(^|\/)__plugins__\/(.*?)\//;

    function d(e, t) {
      let r;
      let o;
      let a;
      let
        u = '';
      if (i(e) && (u = 'app_launch'),
      ((function (e) {
        return s(e.ph) && n.pageInitFlow.indexOf(e.name) > -1;
      }(e)) || e.name === n.TraceType.PAGE_METADATA) && (u = `cp_${t}`),
      (function (e) {
        return s(e.ph) && n.pluginFlow.indexOf(e.name) > -1;
      }(e))) {
        const c = e.extraInfo;
        const d = (void 0 === c ? {} : c).resourceUrl;
        u = `plugin_${r = void 0 === d ? '' : d,
        o = l.exec(r),
        a = 'Unknown',
        o && (a = o[2]),
        `${a}/r_`}${t}`;
      }
      e.traceId = u;
    }

    function p(e, t) {
      let r;
      let o;
      const
        a = {
          ph: (r = e.state,
          o = n.TraceType[r],
          n.appLaunchFlow.indexOf(o) > -1 || n.pageInitFlow.indexOf(o) > -1 || n.pluginFlow.indexOf(o) > -1 ? r === 101 || r === 106 ? n.TracePhase.f : r === 2 || r === 6 ? n.TracePhase.s : n.TracePhase.t : r === n.TraceType.PAGE_METADATA ? n.TracePhase.M : n.TracePhase.i),
          ts: e.time,
          context: '',
          cat: '',
          name: c(e.state),
          extraInfo: e.payload || {}
        };
      return e.state === n.TraceType.JS_ERROR && (a.cat = 'err'),
      d(a, t && t.viewId || ''),
      u(a, e),
      a;
    }

    t.trans = function (e, t) {
      const r = [];
      return e.forEach(((e) => {
        const o = p(e, t);
        !(function (e) {
          return !i(e) || !a[e.name] && (a[e.name] = !0,
          !0);
        }(o)) ? (o.ph !== n.TracePhase.M && (o.ph = n.TracePhase.i,
          o.traceId = ''),
          r.push(o)) : r.push(o);
      }
      )),
      r;
    };
  }, ,
  function (e, t, r) {
    r.r(t);
    r(2).getMember;
    t.default = {
      a_colorScheme_23_0: !0,
      a_tabbarAPI_23_0: 5000015,
      a_lottieContext_getLottieInfo_23_0: !1,
      a_audioInterruption_23_0: !1,
      a_videoContext_quality_23_0: !1,
      a_getWifiBroadcastInfo_23_0: !1,
      a_udpSocket_23_0: !1,
      a_tcpSocket_23_0: !1,
      a_showAuthenticDialog_23_0: !1,
      a_donateInBrowser_23_0: !1,
      a_videoContext_playbackRate_24_2: 5001039,
      a_videoContext_statusBar_24_2: !1,
      a_videoContext_snapshot_24_2: 5000015,
      a_videoContext_mute_24_2: !1,
      a_mapContext_updateIndoorMapActiveFloor_24_0: !1,
      a_mapContext_routePlan_24_0: !1,
      a_mapContext_getScale_24_0: !1,
      a_mapContext_screenToMap_24_0: !1,
      a_mapContext_mapToScreen_24_0: !1,
      a_mapContext_setMapType_24_0: !1,
      a_mapContext_addOverlays_24_0: !1,
      a_mapContext_calculatePointFromDistance_24_0: !1,
      a_mapContext_native_showRoute_24_3: 5001002,
      a_mapContext_changeMarkers_23_0: 5001002,
      a_mapContext_native_clearRoute_24_3: 5001002,
      a_mapContext_updateComponents_24_3: 5001002,
      a_mapContext_translateMarker_24_3: 5001002,
      a_mapContext_calculateDistance_24_3: 5001002,
      a_mapContext_smoothMoveMarker_24_3: 5001002,
      a_mapContext_smoothMovePolyline_24_3: 5001002,
      a_mapContext_getMapProperties_24_3: 5001002,
      a_mapContext_getRegion_24_3: 5001002,
      a_fontSizeSetting_24_3: 5001026,
      a_canvasContext_measureText_24_3: !1,
      a_request_header_acceptencoding_cannot_writable_24_7: !0,
      'c_lottie_downgrade-level_22_0': !1,
      'c_map_enable-satellite_22_0': !1,
      c_map_onPoiTap_22_0: !1,
      c_swiper_adjustVerticalHeight_23_0: !0,
      c_swiper_adjustHeightWithHighestItem_23_0: !0,
      c_lottie_scene_23_0: !1,
      'c_camera_output-dimension_23_0': !1,
      'c_rtc-room_23_0': !1,
      c_video_onQualityList_23_0: !1,
      'c_live-player_extra-info_23_0': !1,
      c_image_widthFixV2_24_4: !0,
      c_scrollView_removeWKOFSOnIOS13_24_4: !0,
      c_map_optimize_24_6: 5001002,
      c_map_onCalloutTap_24_6: 5001002,
      c_map_onRegionChangeApi_24_6: 5001002,
      c_map_onControlTap_24_6: 5001002,
      c_map_includePadding_24_6: 5001002,
      c_map_groundOverlays_24_6: 5001002,
      c_map_tileOverlay_24_6: 5001002,
      c_map_setting_24_6: 5001002,
      c_map_customMapStyle_24_6: 5001002,
      c_map_skew_24_6: 5001002,
      c_map_rotate_24_6: 5001002,
      c_map_polyline_24_6: 5001002,
      c_map_circles_24_6: 5001002,
      c_map_controls_24_6: 5001002,
      c_map_polygon_24_6: 5001002,
      c_map_includePoints_24_6: 5001002,
      c_map_markers_iconLayout_24_6: 5001002,
      c_map_markers_displayRanges_24_6: 5001002,
      c_map_markers_callout_24_6: 5001002,
      c_map_markers_customCallout_24_6: 5001002,
      c_map_markers_markerLevel_24_6: 5001002,
      c_map_markers_label_24_6: 5001002,
      c_map_markers_style_24_6: 5001002,
      c_map_panels_23_0: 5001002,
      c_map_onMarkerTap_23_0: !1,
      c_swiper_fixTouchRecircleAnimation_24_7: !0,
      c_button_fix_disabled_24_13: !0,
      f_snapshot_23_0: !1,
      f_renderDebugger_23_0: !1,
      f_promotionModal_23_0: !1,
      f_cloudService_23_0: !1,
      f_tinyAppConfig_merge_23_0: !1,
      f_androidSystemEmbedView_23_0: !0,
      f_plugin_23_0: 4007025,
      f_page_onKeyboardShowOrHide_23_2: !0,
      f_tracker_enableUTChannel_23_4: !0,
      f_trace_24_0: !0,
      f_forbid_loadPlugin_24_0: !0,
      f_fixMouseEvent_24_2: !0,
      f_allowDynamicPluginRefresh_24_5: !0,
      f_allowDynamicDefaultProps_24_3: !0,
      f_allowUpdateEventHandler4Component2_24_5: !0,
      f_filterAppxDomainForSecurity_24_5: !0,
      f_skipKeepAlive_24_0: 5001011,
      f_deepCheckTouchSupport_24_7: !0,
      f_enablePageNotFound_24_7: !0,
      f_plugin_error_appendix_24_11: !0,
      f_useGetterForUnimplementedApiWithFunctionConfig_24_8: !0,
      f_createRDSContext_2_6_7: !1,
      f_fixPageWhenLoadDynamicPlugin_24_13: !0,
      f_pc_inPageRenderType_2_7_10: !0
    };
  }, ,
  function (e, t, r) {
    e.exports = function (e) {
      return encodeURIComponent(e)
        .replace(/[!'()*]/g, ((e) => `%${e.charCodeAt(0)
          .toString(16)
          .toUpperCase()}`
        ));
    };
  },
  function (e, t, r) {
    const n = Object.getOwnPropertySymbols;
    const o = Object.prototype.hasOwnProperty;
    const a = Object.prototype.propertyIsEnumerable;

    function i(e) {
      if (e == null) throw new TypeError('Object.assign cannot be called with null or undefined');
      return Object(e);
    }

    e.exports = (function () {
      try {
        if (!Object.assign) return !1;
        const e = new String('abc');
        if (e[5] = 'de',
        Object.getOwnPropertyNames(e)[0] === '5') {
          return !1;
        }
        for (var t = {}, r = 0; r < 10; r++) t[`_${String.fromCharCode(r)}`] = r;
        if (Object.getOwnPropertyNames(t)
          .map(((e) => t[e]
          ))
          .join('') !== '0123456789') {
          return !1;
        }
        const n = {};
        return 'abcdefghijklmnopqrst'.split('')
          .forEach(((e) => {
            n[e] = e;
          }
          )),
        Object.keys({ ...n })
          .join('') === 'abcdefghijklmnopqrst';
      } catch (e) {
        return !1;
      }
    }()) ? Object.assign : function (e, t) {
        for (var r, s, u = i(e), c = 1; c < arguments.length; c++) {
          for (const l in r = Object(arguments[c])) o.call(r, l) && (u[l] = r[l]);
          if (n) {
            s = n(r);
            for (let d = 0; d < s.length; d++) a.call(r, s[d]) && (u[s[d]] = r[s[d]]);
          }
        }
        return u;
      };
  },
  function (e, t, r) {
    const n = new RegExp('%[a-f0-9]{2}', 'gi');
    const o = new RegExp('(%[a-f0-9]{2})+', 'gi');

    function a(e, t) {
      try {
        return decodeURIComponent(e.join(''));
      } catch (e) {
      }
      if (e.length === 1) return e;
      t = t || 1;
      const r = e.slice(0, t);
      const n = e.slice(t);
      return Array.prototype.concat.call([], a(r), a(n));
    }

    function i(e) {
      try {
        return decodeURIComponent(e);
      } catch (o) {
        for (let t = e.match(n), r = 1; r < t.length; r++) {
          t = (e = a(t, r)
            .join('')).match(n);
        }
        return e;
      }
    }

    e.exports = function (e) {
      if (typeof e !== 'string') throw new TypeError(`Expected \`encodedURI\` to be of type \`string\`, got \`${typeof e}\``);
      try {
        return e = e.replace(/\+/g, ' '),
        decodeURIComponent(e);
      } catch (t) {
        return (function (e) {
          for (var t = {
              '%FE%FF': '��',
              '%FF%FE': '��'
            }, r = o.exec(e); r;) {
            try {
              t[r[0]] = decodeURIComponent(r[0]);
            } catch (e) {
              const n = i(r[0]);
              n !== r[0] && (t[r[0]] = n);
            }
            r = o.exec(e);
          }
          t['%C2'] = '�';
          for (let a = Object.keys(t), s = 0; s < a.length; s++) {
            const u = a[s];
            e = e.replace(new RegExp(u, 'g'), t[u]);
          }
          return e;
        }(e));
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.default = function (e) {
      return e && typeof e === 'object' ? Object.keys(e) : [];
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.genUrl = function (e, t) {
      const r = t && t.isWorker || !1;
      const n = t && t.isCss || !1;
      return r ? `/external_modules/${e}` : n ? `/external_modules/${e}/index.css` : `/external_modules/${e}/index.js`;
    };
  }, , , , , , , , , , , ,
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(121));
    const a = r(12);
    const i = r(7);
    const s = r(1);
    const u = r(122);
    const c = n.__importDefault(r(6));
    let l = null;
    let d = null;

    function p(e) {
      if (l) return l;
      const t = u.getDDPreloadValue(this.getStartupParams(), 'wpkGateway');
      return (l = new o.default({
        bid: `dta_3_${e.appId}`,
        rel: e.version,
        uid: e.did,
        spa: !0,
        eappConfigs: O.bind(this),
        gateway: t || ''
      })).installAll(),
      console.log('init wpk'),
      l;
    }

    const f = [0x72b63455ab224, 0x72c5160d303e6, 0x72c477b77c6c6, 0x72b74362b0890, 0x72c53a8f72b20, 0x72b78a2b21537, 0x72e16fe2f3d27, 0x72c47e6c80a55, 0x72c4c3b7253fb, 0x72c5a2df93c02, 0x72e16fd2c9dd0, 0x72c513120a0f5];
    let _ = '';

    function h(e) {
      if (_) return _;
      const t = f.indexOf(+e) > -1 ? 'vip' : 'normal';
      const r = s.isIOS ? 'ios' : s.isAndroid ? 'android' : 'unknown';
      return _ = `${r}-${t}`;
    }

    function m(e, t, r) {
      d = r.querystring;
      const o = p.call(this, r);
      e === i.HTTP_REQUEST_INFO ? a.isHitRate(a.appSamplingRateConfig[r.appId] || 1) && o.reportApiError(t) : e === i.HTTP_REQUEST_PV ? (a.isHitRate(a.appSamplingRateConfig[r.appId] || 1) && o.reportFlow(),
      a.isHitRate(0.1) && o.reportFlow({
        bid: 'mini_program_ariver_monitor',
        w_cid: h(r.appId)
      }, !0)) : e === i.CUSTOM_REPORT ? o.report(n.__assign(n.__assign({
        bid: 'mini_program_ariver_monitor'
      }, t), {
        w_cid: h(r.appId)
      })) : (o.reportError(e, t),
      o.reportError(e, t, {
        bid: 'mini_program_ariver_monitor',
        c1: r.appId,
        w_cid: h(r.appId)
      }));
    }

    let v;
    let g = '';
    let y = '';
    let E = '';
    let b = '';
    let
      S = '';

    function w(e, t) {
      if (!v && g !== 'unknown') {
        if (e !== i.HTTP_REQUEST_PV && e !== i.CUSTOM_REPORT) {
          try {
            if (e === i.RENDER_GLOBAL_ERROR && ((r = t && t[0] || '') && r.toString()
              .indexOf('font-size-error-width-') === 0)) {
              return;
            }
          } catch (e) {
          }
          t = a.formatWpkError(t);
        }
        m.call(this, e, t, {
          appId: E,
          version: y,
          did: g,
          querystring: d
        });
      }
      let r;
    }

    t.default = function (e, t, r) {
      const n = this;
      d = r,
      g ? w.call(this, e, t) : c.default('getUtdid', {}, ((r) => {
        if (r && r.utdid) {
          try {
            g = r.utdid;
          } catch (e) {
            g = 'ddUnknown';
          }
        } else {
          g = 'ddUnknown';
        }
        const o = window.AlipayJSBridge;
        o && o.startupParams && (y = o.startupParams.package_nick || o.startupParams.version,
        v = o.startupParams.fromIDE,
        E = o.startupParams.appId,
        b = o.startupParams.locale,
        S = o.startupParams.defaultTitle),
        w.call(n, e, t);
      }
      ));
    }
    ,
    t.reportHttpRequestInfo = function (e, t) {
      console.log(e, t);
    }
    ,
    t.reportPV = function () {
    };
    let I = null;

    function O(e) {
      const t = this;
      try {
        if (!E) return void e({});
        !(function (e) {
          I ? e(I) : c.default('getSystemInfo', {}, ((t) => {
            e(I = t);
          }
          ));
        }(((r) => {
          try {
            e({
              SDKVersion: t.info.ExtSDKVersion,
              fromIDE: v,
              pgUrl: location.href,
              pgQuery: d,
              pgHash: location.hash,
              pgTitle: S,
              ddVer: r.version,
              lang: b,
              fr: r.platform,
              rom: r.system,
              brand: r.brand,
              model: r.model,
              screenWidth: r.screenWidth,
              screenHeight: r.screenHeight
            });
          } catch (t) {
            e({});
          }
        }
        )));
      } catch (t) {
        e({});
      }
    }
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = {};
    t.setSnapShotInfo = function (e, t) {
      t && (n[e] = t);
    }
    ,
    t.getSnapshotInfo = function (e) {
      return n[e];
    }
    ,
    t.getAllSnapshotInfo = function () {
      return n;
    }
    ,
    t.delSnapshotInfo = function (e) {
      delete n[e];
    };
  },
  function (e, t, r) {
    function n(e, t) {
      console[e](t);
    }

    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.ddconsole = n,
    t.error = function (e) {
      n('error', e);
    }
    ,
    t.log = function (e) {
      n('log', e);
    }
    ,
    t.warn = function (e) {
      n('warn', e);
    }
    ,
    t.debug = function (e) {
      n('debug', e);
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    let n;
    const o = r(0);
    const a = o.__importDefault(r(41));
    const
      i = o.__importDefault(r(4));
    !(function (e) {
      e.SQUARE = 'square',
      e.CIRCLE = 'circle';
    }(n || (n = {}))),
    t.default = {
      displayName: 'Avatar',
      getDefaultProps() {
        return {
          src: '',
          name: '',
          className: '',
          defaultColor: '#3296fa',
          defaultSrc: 'https://img.alicdn.com/tps/TB1.IgIKpXXXXbgXpXXXXXXXXXX-116-116.png',
          opacity: 1,
          size: 'big',
          loading: !1,
          shape: n.CIRCLE
        };
      },
      getInitialState() {
        return {
          loadError: !1,
          defaultSize: !0,
          style: {},
          loadErrors: []
        };
      },
      shouldComponentUpdate(e, t) {
        for (var r in this.props) if (this.props[r] !== e[r]) return !0;
        for (var r in this.state) if (this.state[r] !== t[r]) return !0;
        return !1;
      },
      imageLoadErorr() {
        this.setState({
          loadError: !0
        });
      },
      formatName(e) {
        let t = e || '';
        if (function (e) {
          return e.match(/^([a-zA-Z]|\s|,|\.)+$/) !== null;
        }(t)) {
          const r = (t = t.replace(/,|\./g, ' ')
            .replace(/\s+/g, ' ')).split(' ');
          return r.length === 1 ? t.slice(0, 2) : r && r[0].slice(0, 1) + r[1].slice(0, 1);
        }
        return t.replace(/,|\.|\s+/g, '')
          .slice(-2);
      },
      addAvatarShapeClass() {
        const e = {};
        return this.props.shape === n.SQUARE ? e['dd-avatar-square'] = !0 : e['dd-avatar-round'] = !0,
        e;
      },
      renderAvatar(e, t) {
        const r = this;
        const n = r.state;
        const s = n.style;
        const u = n.loadError;
        const c = n.defaultSize;
        const l = {};
        const d = r.addAvatarShapeClass();
        Object.assign(l, d);
        let p = '';
        return c && (l[`dd-avatar-size-${r.props.size}`] = !0,
        p = `dd-avatar-size-${r.props.size}`),
        r.props.className && (l[r.props.className] = !!r.props.className),
        s.opacity = r.props.opacity || 1,
        t && !e || u ? (s.backgroundColor = r.props.defaultColor || '#3296fa',
        i.default.createElement('div', {
          ref(e) {
            r.root = e;
          },
          className: a.default('dd-avatar', l),
          style: o.__assign({}, s)
        }, r.formatName(t))) : i.default.createElement('div', {
          ref(e) {
            r.root = e;
          },
          style: o.__assign({}, s),
          className: a.default('dd-avatar', l)
        }, i.default.createElement('img', {
          ref(e) {
            r.root = e;
          },
          style: o.__assign({}, s),
          className: a.default(r.addAvatarShapeClass(), p),
          src: e || r.props.defaultSrc,
          onError: this.imageLoadErorr
        }));
      },
      imageLoadErorrs(e) {
        this.state.imageLoadErorrs[e] = !0,
        this.setState({});
      },
      renderMutiElement(e) {
        const t = this;
        let r = '';
        t.props.src && (r = t.props.src[e]);
        const n = t.props.name[e];
        const o = t.state.loadErrors[e];
        return n && !r || o ? i.default.createElement('div', {
          className: 'dd-avatar-unit'
        }, n && n.slice(0, 1)) : i.default.createElement('div', {
          className: 'dd-avatar-unit'
        }, i.default.createElement('img', {
          src: r || t.props.defaultSrc,
          onError: this.imageLoadErorrs.bind(t, e)
        }));
      },
      renderLoading() {
        const e = this;
        const t = e.state;
        const r = t.style;
        const n = t.defaultSize;
        const s = {};
        const u = e.addAvatarShapeClass();
        return Object.assign(s, u),
        n && (s[`dd-avatar-size-${e.props.size}`] = !0),
        e.props.className && (s[e.props.className] = !!e.props.className),
        r.opacity = e.props.opacity || 1,
        r.backgroundColor = 'transparent',
        i.default.createElement('div', {
          className: a.default('dd-avatar', s),
          style: o.__assign({}, r)
        });
      },
      renderMutli() {
        let e;
        const t = this;
        const r = t.state;
        const n = r.style;
        const s = r.defaultSize;
        const u = {};
        const
          c = t.addAvatarShapeClass();
        return Object.assign(u, c),
        s && (u[`dd-avatar-size-${t.props.size}`] = !0),
        t.props.className && (u[t.props.className] = !!t.props.className),
        e = t.props.name.length <= 3 ? [i.default.createElement('div', {
          key: '1',
          className: 'dd-avatar-left dd-avatar-left-one'
        }, t.renderMutiElement(0)), i.default.createElement('div', {
          key: '2',
          className: 'dd-avatar-right'
        }, t.renderMutiElement(1), t.renderMutiElement(2))] : [i.default.createElement('div', {
          key: '1',
          className: 'dd-avatar-left'
        }, t.renderMutiElement(0), t.renderMutiElement(1)), i.default.createElement('div', {
          key: '2',
          className: 'dd-avatar-right'
        }, t.renderMutiElement(2), t.renderMutiElement(3))],
        n.opacity = t.props.opacity || 1,
        i.default.createElement('div', {
          ref(e) {
            t.root = e;
          },
          style: o.__assign({}, n),
          className: a.default('dd-avatar', u)
        }, e);
      },
      render() {
        const e = this;
        return e.props.loading ? e.renderLoading() : typeof e.props.src === 'string' || typeof e.props.name === 'string' ? e.renderAvatar(e.props.src, e.props.name) : e.props.src && toString.apply(e.props.src) === '[object Array]' || e.props.name && toString.apply(e.props.name) === '[object Array]' ? e.renderMutli() : void 0;
      }
    };
  },
  function (e, t, r) {
    let n;
    !(function () {
      const r = {}.hasOwnProperty;

      function o() {
        for (var e = [], t = 0; t < arguments.length; t++) {
          const n = arguments[t];
          if (n) {
            const a = typeof n;
            if (a === 'string' || a === 'number') {
              e.push(n);
            } else if (Array.isArray(n) && n.length) {
              const i = o.apply(null, n);
              i && e.push(i);
            } else if (a === 'object') for (const s in n) r.call(n, s) && n[s] && e.push(s);
          }
        }
        return e.join(' ');
      }

      e.exports ? (o.default = o,
      e.exports = o) : void 0 === (n = function () {
        return o;
      }
        .apply(t, [])) || (e.exports = n);
    }());
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = r(43);
    const a = r(135);
    const i = n.__importDefault(r(14));
    const s = n.__importDefault(r(6));
    let u = null;
    let c = null;
    let l = null;
    let d = null;

    function p(e) {
      return `${e}`;
    }

    function f(e) {
      return `${e.userId}`;
    }

    function _(e) {
      return new Promise((((t, r) => {
        s.default('getUserOpenData', {
          userIds: e
        }, ((n) => {
          n.error ? r(n) : t(v(n.data, e));
        }
        ));
      })
      ));
    }

    function h(e) {
      const t = i.default(AlipayJSBridge.startupParams.query).corpId;
      return new Promise((((r, n) => {
        t ? s.default('getUserOpenData', {
          userIds: e,
          corpId: t
        }, ((t) => {
          t.error ? n(t) : r(v(t.data, e));
        }
        )) : n({
          error: -2,
          errorMessage: 'corpId获取失败'
        });
      })
      ));
    }

    function m(e) {
      return function (t) {
        return new Promise((((r, n) => {
          s.default('getUserProfileByUids', {
            onlyCache: e,
            userIds: t
          }, ((e) => {
            e.error ? n(e) : r(v(e.data, t));
          }
          ));
        })
        ));
      };
    }

    function v(e, t) {
      Array.isArray(e) || (e = []);
      const r = {};
      return e.forEach(((e) => {
        r[e.userId] = e;
      }
      )),
      t.map(((e) => {
        const t = r[e];
        return t || {
          userId: e,
          nickName: '',
          avatar: '',
          errorMessage: 'not found'
        };
      }
      ));
    }

    t.loadImage = function (e, t) {
      switch (e) {
        case a.BUSS_TYPE.PERSONAL:
          return u || (u = new o.SingleToBatch(p, f, _, 20, 20)),
          u.getResult(t, '1');
        case a.BUSS_TYPE.CORP:
          return c || (c = new o.SingleToBatch(p, f, h, 20, 20)),
          c.getResult(t, '1');
        case a.BUSS_TYPE.INTERNAL_CACHE:
          return l || (l = new o.SingleToBatch(p, f, m(!0), 20, 20)),
          l.getResult(t, '1');
        case a.BUSS_TYPE.INTERNAL_NET:
          return d || (d = new o.SingleToBatch(p, f, m(!1), 20, 20)),
          d.getResult(t, '1');
        default:
          return Promise.reject({
            error: 5,
            errorMessage: '参数错误'
          });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = function (e, t) {
      this.param = e,
      this.group = t,
      this.result = new Promise(((e, t) => {
        this.resolve = e,
        this.reject = t;
      }));
    };
    const o = (function () {
      function e(e, t, r, n, o) {
        void 0 === n && (n = 100),
        void 0 === o && (o = 200),
        this._buildParamKey = e,
        this._buildResultKey = t,
        this._doRequest = r,
        this._maxCount = n,
        this._delayMs = o,
        this._cache = {},
        this._pendingCache = {},
        this._consumeTimer = null;
      }

      return e.prototype._addToWait = function (e, t) {
        this._cache[t] || (this._cache[t] = {});
        const r = this._buildParamKey(e);
        if (this._cache[t][r]) return this._cache[t][r];
        if (this._pendingCache[t] && this._pendingCache[t][r]) return this._pendingCache[t][r];
        const o = new n(e, t);
        return this._cache[t][r] = o,
        o;
      }
      ,
      e.prototype._deletePendingCache = function (e, t) {
        this._pendingCache[t] && this._pendingCache[t][e] && delete this._pendingCache[t][e];
      }
      ,
      e.prototype._prepareConsume = function () {
        this._consumeTimer === null && (this._consumeTimer = window.setTimeout(() => {
          this._consumeTimer = null;
          const e = this._cache;
          this._cache = {},
          Object.keys(e)
            .forEach((t) => {
              const r = Object.keys(e[t]);
              const n = Math.ceil(r.length / this._maxCount);
              this._pendingCache[t] || (this._pendingCache[t] = {});
              for (var o = function (n) {
                  const o = r.slice(n * a._maxCount, (n + 1) * a._maxCount);
                  const i = {};
                  const s = o.map(((r) => e[t][r].param
                  ));
                  o.forEach(function (r) {
                    i[r] = e[t][r],
                    this._pendingCache[t][r] = e[t][r];
                  }
                    .bind(a)),
                  a._doRequest(s, t)
                    .then(function (e) {
                      if (!Array.isArray(e)) throw new Error('result is not an array');
                      e.forEach((e) => {
                        const r = this._buildResultKey(e);
                        i[r] && (i[r].resolve(e),
                        i[r] = null),
                        this._deletePendingCache(r, t);
                      }),
                      Object.keys(i)
                        .forEach((e) => {
                          i[e] && (i[e].reject(new Error('cannot get result')),
                          i[e] = null),
                          this._deletePendingCache(e, t);
                        });
                    }
                      .bind(a))
                    .catch(function (e) {
                      Object.keys(i)
                        .forEach((r) => {
                          i[r] && (i[r].reject(e),
                          i[r] = null),
                          this._deletePendingCache(r, t);
                        });
                    }
                      .bind(a));
                }, a = this, i = 0; i < n; i++) {
                o(i);
              }
            });
        }, this._delayMs));
      }
      ,
      e.prototype.getResult = function (e, t) {
        return e && t ? (this._prepareConsume(),
        this._addToWait(e, t).result) : Promise.reject(new Error('param and group must be non-null'));
      }
      ,
      e;
    }());
    t.SingleToBatch = o;
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = r(43);
    const a = n.__importDefault(r(6));
    const i = function (e) {
      return function (t) {
        return (function (e, t) {
          console[e](t);
        }(e, t));
      };
    };

    function s(e) {
      return String(e);
    }

    function u(e) {
      return String(e.userId);
    }

    t.error = i('error'),
    t.log = i('log'),
    t.warn = i('warn'),
    t.debug = i('debug'),
    t.blankAvatarProfileGen = function (e) {
      return {
        userId: e,
        nickName: '',
        avatar: '',
        errorMessage: 'not found'
      };
    }
    ,
    t.blankOpenProfileGen = function (e) {
      return {
        userId: e,
        nick: '',
        orgTitle: '',
        deptList: [],
        errorMessage: 'not found'
      };
    };
    t.batchLazyLoaderGen = function (e) {
      let t;
      const r = e.paramsBuilder;
      const n = void 0 === r ? s : r;
      const a = e.resultBuilder;
      const i = void 0 === a ? u : a;
      const c = e.requestFn;
      const l = e.batchSize;
      const d = void 0 === l ? 20 : l;
      const p = e.waitingTime;
      const
        f = void 0 === p ? 20 : p;
      return {
        getResult() {
          for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
          return t || (t = new o.SingleToBatch(n, i, c, d, f)),
          t.getResult.apply(t, e);
        }
      };
    }
    ,
    t.openCallBridge = function (e, t) {
      return new Promise((((r, n) => {
        a.default(e, t, ((e) => {
          e.error ? n(e) : r(e);
        }
        ));
      })
      ));
    };
  },,,,,,,,,,, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,
  , , , , ,           function (e, t, r) {
    e.exports = r(119);
  },
  function (e, t, r) {
    !(function (e) {
      e._AppXExtVersion = '1.25.14',
      e._AppXExtBuildTime = '4-12 10:35:21',
      e._AppXExtBuildCommit = '156594c3',
      e._AppXBasicCfg = {
        clientName: 'dd',
        appxVersion: '1.25.7-dingtalk.3',
        trackerPluginType: 'TB',
        noUseInternalAPI: !0,
        bridgeName: 'dd',
        externalResource: ['2019052065147900', '2019091867592049', '2019101768407793', '2019011663033346', '2019062065630620', '2019010262738680', '2019071365789599', '2019082466422222', '2019042864365185'],
        extraNS: ['dt']
      },
      e._AppXCustomNativeComponents = Object.create(null),
      e._AppXCustomWebComponents = Object.create(null);
      const t = function (t, r) {
        e._AppXCustomNativeComponents[t] = r;
      };
      const n = function (t, r) {
        e._AppXCustomWebComponents[t] = r;
      };
      const o = function (t) {
        e._AppXFeatures = t;
      };
      const a = function (t) {
        e._AppXFns = t;
      };
      (function (t) {
        e._AppXToImplementComponents = t;
      }(r(15).default)),
      a(r(120)),
      t('camera', r(130).default),
      n('external-component', r(131).default),
      n('open-avatar', r(134).default),
      n('open-data', r(136).default),
      n('open-face', r(138).default),
      n('snapshot-hotarea', r(139).default),
      n('video', r(140).default),
      o(r(19).default),
      r(145);
    }(new Function('return this')()));
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = r(1);
    const a = n.__importDefault(r(37));
    const i = n.__importDefault(r(123));
    const s = r(124);
    const u = n.__importDefault(r(125));
    const c = n.__importStar(r(127));
    const l = r(5);
    const d = r(128);
    const p = r(129);
    t.rpx = function () {
      const e = s.__dangerGetRenderStartupParams().__extraUnresponsiveProbe;
      if (o.isIPad || o.isAndroidPad) return !1;
      if (e && typeof e === 'string') {
        try {
          const t = new RegExp(e);
          return !o.uaTest(t);
        } catch (t) {
          return console.error(`unsupport __extraUnresponsiveProbe value ${e}`),
          !0;
        }
      }
      return !0;
    }
    ,
    t.onError = function (e, t, r, n, o) {
      try {
        i.default.call(this, e, t, r, n, o),
        c.default.call(this, [{
          state: l.TraceType.JS_ERROR,
          time: Date.now(),
          payload: {
            msg: e
          }
        }]);
      } catch (e) {
      }
    }
    ,
    t.renderMethods = {
      wpkReport(e) {
        a.default.call(this, e.code, e.info, e.query);
      },
      takeAppSnapshot: u.default
    },
    t.onTrace = function (e, t, r, n) {
      try {
        const o = self;
        const a = [{
          state: e,
          time: t,
          dur: r,
          payload: n
        }];
        const i = c.addPageMeta();
        i && a.push(i),
        c.default.call(this, a, {
          viewId: o.APVIEWID
        });
      } catch (e) {
      }
    }
    ,
    t.onInit = function () {
      const e = this.getStartupParams();
      d.initTouchEventEmulator(e),
      p.addPCScrollBarPolifill();
    };
  },
  function (e, t, r) {
    e.exports = (function (e) {
      const t = {};

      function r(n) {
        if (t[n]) return t[n].exports;
        const o = t[n] = {
          i: n,
          l: !1,
          exports: {}
        };
        return e[n].call(o.exports, o, o.exports, r),
        o.l = !0,
        o.exports;
      }

      return r.m = e,
      r.c = t,
      r.d = function (e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
          enumerable: !0,
          get: n
        });
      }
      ,
      r.r = function (e) {
        typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
          value: 'Module'
        }),
        Object.defineProperty(e, '__esModule', {
          value: !0
        });
      }
      ,
      r.t = function (e, t) {
        if (1 & t && (e = r(e)),
        8 & t) {
          return e;
        }
        if (4 & t && typeof e === 'object' && e && e.__esModule) return e;
        const n = Object.create(null);
        if (r.r(n),
        Object.defineProperty(n, 'default', {
          enumerable: !0,
          value: e
        }),
        2 & t && typeof e !== 'string') {
          for (const o in e) {
            r.d(n, o, ((t) => e[t])
              .bind(null, o));
          }
        }
        return n;
      }
      ,
      r.n = function (e) {
        const t = e && e.__esModule ? function () {
          return e.default;
        }
          : function () {
            return e;
          };
        return r.d(t, 'a', t),
        t;
      }
      ,
      r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }
      ,
      r.p = '',
      r(r.s = 2);
    }([function (e, t) {
      e.exports = {
        sdk: {
          BID: 'wpkreporter',
          CID: 'jssdk',
          WID_KEY: '__wpkreporterwid_'
        },
        env: {
          EAPP: 'dd.miniprogram'
        },
        px: {
          SIGNKEY: 'Uvn#08uefVdwe&c4'
        },
        category: {
          JSERR: 1,
          API: 2,
          JSFSPERF: 3,
          RESLOADFAIL: 4,
          FLOW: 5,
          BKPG: 6,
          HARLOG: 7
        },
        navConn: {
          types: {
            BLUETOOTH: 'bluetooth',
            CELLULAR: 'cellular',
            ETHERNET: 'ethernet',
            MIXED: 'mixed',
            NONE: 'none',
            OTHER: 'other',
            UNKNOWN: 'unknown',
            WIFI: 'wifi',
            WIMAX: 'wimax'
          },
          effectiveTypes: {
            '2G': '2g',
            '3G': '3g',
            '4G': '4g',
            SLOW2G: 'slow-2g'
          }
        }
      };
    },
    function (e, t, r) {
      const n = r(0).sdk.WID_KEY;
      const o = function () {
        let e = Date.now();
        return typeof window !== 'undefined' && window.performance && typeof window.performance.now === 'function' && (e += performance.now()),
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ((t) => {
          const r = (e + 16 * Math.random()) % 16 | 0;
          return e = Math.floor(e / 16),
          (t === 'x' ? r : 11 & r).toString(16);
        }
        ));
      };
      const a = function (e) {
        return typeof e === 'object';
      };
      const i = function (e, t) {
        try {
          for (var r, n, o = e.split('.'), a = t.split('.'), i = o.length, s = 0; s < i; s++) if ((r = parseInt(o[s])) !== (n = parseInt(a[s]))) return r > n;
          return !0;
        } catch (e) {
        }
        return !1;
      };
      const s = {
        get(e) {
          let t = localStorage.getItem(e);
          if (t && (t = JSON.parse(t),
          Date.now() < t.expireAt)) {
            return t.wid;
          }
          const r = o();
          return this.set(e, r),
          r;
        },
        set(e, t) {
          t.expireAt = Date.now() + 15552e6,
          localStorage.setItem(e, JSON.stringify(t));
        }
      };
      e.exports = {
        uuid: o,
        isU4HA(e, t) {
          e = e || !1;
          try {
            if (typeof window !== 'undefined' && window.ucweb && window.ucweb.window || t) {
              for (var r = (t || navigator.userAgent).split(' '), n = r.length, o = !1, a = !1, s = 0; s < n; s++) {
                if (r[s].indexOf('UWS/') !== -1) {
                  const u = r[s].split('/');
                  a = i(u[1], '2.13.2.37');
                } else {
                  r[s].indexOf('AliApp(DingTalk/') !== -1 && (o = !0);
                }
              }
              return o ? a : e;
            }
          } catch (e) {
          }
          return !1;
        },
        getWid() {
          return typeof localStorage === 'undefined' ? o() : s.get(n);
        },
        cutStr(e, t) {
          return typeof e === 'string' ? e.substring(0, t) : '';
        },
        extend(e) {
          for (let t = 1, r = arguments.length; t < r; t++) {
            const n = arguments[t];
            for (const o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
          }
          return e;
        },
        isError(e) {
          const t = {}.toString.call(e);
          return a(e) && (t === '[object Error]' || t === '[object Exception]' || t instanceof Error);
        },
        isArray(e) {
          return {}.toString.call(e) === '[object Array]';
        },
        isObject: a,
        canReport(e) {
          return !!e && e !== 0 && (e >= 1 || e === '100%' || (/^\d+(\.\d+)?%$/.test(e) ? Math.random() < parseFloat(e) / 100 : e > 0 && e < 1 && Math.random() < e));
        },
        isFunction(e) {
          return typeof e === 'function';
        },
        categoryToType(e) {
          let t;
          switch (e) {
            case 1:
              t = 'jserr';
              break;
            case 2:
              t = 'api';
              break;
            case 3:
              t = 'jsfsperf';
              break;
            case 4:
              t = 'resloadfail';
              break;
            case 5:
              t = 'flow';
              break;
            case 6:
              t = 'bkpg';
              break;
            case 7:
              t = 'harlog';
              break;
            default:
              t = 'jssdkidx';
          }
          return t;
        },
        parseErrorStack(e) {
          if (e.stack) {
            const t = e.stack.split('\n');
            return t.shift(),
            t.join('\n');
          }
          return '';
        },
        objToJsonString(e) {
          return JSON ? JSON.stringify(e) : e.toString();
        },
        eappErrTypeToStr(e) {
          let t = '';
          switch (e) {
            case 11:
              t = 'worker_global_error';
              break;
            case 12:
              t = 'render_global_error';
              break;
            case 13:
              t = 'register_worker_error';
          }
          return t;
        }
      };
    },
    function (e, t, r) {
      e.exports = r(3);
    },
    function (e, t, r) {
      const n = r(4);
      const o = r(5);
      e.exports = function (e) {
        if (typeof dd === 'undefined') {
          return console.error('当前环境非钉钉E应用环境'),
          null;
        }
        const t = new n(e);
        return t.initialize(o),
        t;
      };
    },
    function (e, t, r) {
      const n = r(1);
      const o = r(0).category;

      function a(e) {
        if (!(this instanceof a)) return new a(e);
        e = e || {},
        this._init = !1,
        this.debug = e.debug || !1,
        this.toolKit = n,
        this._plugins = e.plugins || [],
        this.bid = e.bid,
        this.uid = e.uid,
        this.rel = e.rel,
        this.spa = e.spa || !1,
        this.cluster = e.cluster || 'cn',
        this.sampleRate = e.sampleRate,
        this.ignoreScriptError = e.ignoreScriptError || !1,
        this.onlyCustom = e.onlyCustom || !1,
        this.beforeSend = e.beforeSend || null,
        this.eappConfigs = e.eappConfigs,
        this.gateway = e.gateway,
        this._waitingQueue = [];
      }

      a.prototype = {
        VERSION: '1.1.9',
        initialize(e) {
          this.env = e.env,
          this.send = e.send,
          this.getWid = e.getWid;
        },
        ready() {
          return this._init;
        },
        setConfig(e) {
          return this.toolKit.isObject(e) && this.toolKit.extend(this, e),
          this;
        },
        report(e) {
          if (typeof e === 'string' && (e = {
            category: o.JSERR,
            msg: e
          }),
          e.sampleRate || (e.sampleRate = 1),
          this.toolKit.canReport(e.sampleRate || this.sampleRate)) {
            if (this.ready()) {
              const t = e.bid || this.bid;
              let r = e.rel || this.rel;
              this.toolKit.isFunction(r) && (r = r());
              let a = e.uid || this.uid;
              if (this.toolKit.isFunction(a) && (a = a()),
              a || (a = this.getWid()),
              this.toolKit.extend(e, {
                w_bid: t,
                w_rel: r,
                w_spa: this.spa,
                w_tm: +new Date(),
                w_cnt: 1,
                uid: a,
                type: this.toolKit.categoryToType(e.category),
                sdk_ver: this.VERSION,
                log_src: 'jssdk',
                wid: this.wid
              }),
              n.isFunction(this.eappConfigs)) {
                const i = this;
                i.eappConfigs(((t) => {
                  t && !t.fromIDE && i.send(e, t);
                }
                ));
              } else {
                this.send(e);
              }
            } else {
              this._waitingQueue.push(e);
            }
            return this;
          }
        },
        reportFlow(e, t) {
          return e = e || {},
          this.report(this.toolKit.extend(e || {}, {
            category: o.FLOW,
            sampleRate: 1,
            _force: t
          })),
          this;
        },
        reportError(e, t, r, n) {
          let a = {
            category: o.JSERR,
            w_errtype: this.toolKit.eappErrTypeToStr(e),
            _force: n
          };
          if (this.toolKit.isError(t)) {
            a.w_msg = t.toString(),
            a.stack = this.toolKit.parseErrorStack(t),
            a.w_file = t.filename || '',
            a.w_line = t.lineno || '',
            a.w_col = t.colno || '',
            this.report(a);
          } else if (typeof t === 'string') {
            let i;
            try {
              i = JSON.parse(t);
            } catch (e) {
              i = {
                w_msg: t
              };
            }
            a = this.toolKit.extend(a, i, r),
            this.report(a);
          }
          return this;
        },
        reportApiError(e, t) {
          if (e) {
            if (typeof e === 'string') {
              try {
                e = JSON.parse(e);
              } catch (e) {
                return;
              }
            }
            if (!e.url || !e.method || !e.status) return;
            this.toolKit.isObject(e.queryString) && (e.queryString = this.toolKit.objToQueryString(e.queryString)),
            this.report(this.toolKit.extend(t || {}, {
              msg: e.msg || '',
              w_res: e.url,
              w_method: e.method,
              w_param: e.queryString,
              w_body: JSON.stringify(e.body),
              w_resp: e.response,
              w_rc: e.status,
              w_rt: e.spent || '',
              c1: n.cutStr(e.c1, 128),
              c2: n.cutStr(e.c2, 128),
              c3: n.cutStr(e.c3, 128),
              c4: n.cutStr(e.c4, 128),
              c5: n.cutStr(e.c5, 128)
            }, {
              category: o.API,
              w_type: 16
            }));
          }
          return this;
        },
        install() {
          return this.wid = this.getWid(),
          this._sid = this.toolKit.uuid(),
          this._init = !0,
          this;
        },
        installAll() {
          return this.install();
        }
      },
      e.exports = a;
    },
    function (e, t, r) {
      const n = r(1);
      const o = r(0);
      const a = r(6);
      const i = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {};
      const s = i.navigator;
      const u = i.location;
      const c = function (e) {
        const t = window;
        const r = `wpkimgreporter_${+new Date()}.r${Math.floor(1e3 * Math.random())}`;
        const n = t[r] = new Image();
        n.onload = n.onerror = function () {
          t[r] = null;
        }
        ,
        n.src = e;
      };
      e.exports = {
        env: o.env.EAPP,
        root: i,
        send(e, t) {
          if (!(!e._force && this.toolKit.isU4HA(this.onlyCustom) && e.category !== 1 && e.category !== 2 && e.category < 100)) {
            let r;
            let
              n = this.toolKit.extend({
                w_url: u.origin + u.pathname,
                w_query: u.search,
                w_ref: u.hash.substring(1),
                ua: s.userAgent,
                net: (r = s.connection,
                r && r.type ? r.type === o.navConn.types.NONE ? 'disconnected' : r.type === o.navConn.types.CELLULAR ? r.effectiveType === o.navConn.effectiveTypes.SLOW2G ? '2g' : r.effectiveType : r.type : '')
              }, e);
            t && (n = this.toolKit.extend(n, {
              w_title: t.pgTitle,
              bver: t.ddVer,
              browser: 'dingtalk',
              lang: t.lang,
              fr: t.platform,
              rom: t.system,
              brand: t.brand,
              model: t.model,
              dsp_w: t.screenWidth,
              dsp_h: t.screenHeight,
              w_appx_ver: t.SDKVersion
            }));
            const i = new a({
              app: n.w_bid,
              ud: n.uid,
              ver: n.w_rel,
              type: n.type,
              sdkver: n.sdk_ver,
              signKey: o.px.SIGNKEY,
              gateway: this.gateway
            }).getUploadUrl();
            n._servAddr = i,
            this._waitingQueue.push(n),
            (function (e) {
              for (var t, r, n = e._waitingQueue, o = 0; o < n.length; o++) {
                r = (t = n[o])._servAddr,
                t.w_send_mode = 'imgsrc',
                t._servAddr = void 0,
                t._force = void 0,
                t = encodeURIComponent(e.toolKit.objToJsonString(t)),
                c(`${r}&data=${t}`);
              }
              e._waitingQueue = [];
            }(this));
          }
        },
        getWid() {
          return n.getWid();
        }
      };
    },
    function (e, t, r) {
      e.exports = r(7);
    },
    function (e, t, r) {
      const n = r(8);
      const o = {
        cn: {
          UPLOAD: 'https://px.effirst.com/api/v1/jssdk/upload',
          JCONIG: 'https://px.effirst.com/api/v1/jssdk/jconfig'
        },
        intl: {
          UPLOAD: 'https://px-intl.ucweb.com/api/v1/jssdk/upload',
          JCONFIG: 'https://px-intl.ucweb.com/api/v1/jssdk/jconfig'
        }
      };
      const a = function () {
        if (typeof console !== 'undefined') {
          const e = [].slice.call(arguments);
          console.warn.apply(this, ['「pxsdk」'].concat(e));
        }
      };
      const i = function (e) {
        let t = +new Date();
        return !0 === e && (t = Math.floor(t / 1e3)),
        t;
      };

      function s(e) {
        e = e || {},
        this.common = {
          app: e.app,
          cp: 'none',
          de: 4,
          seq: i() + Math.floor(10 * Math.random()),
          tm: i(!0),
          ud: e.ud,
          type: e.type,
          sver: e.sdkver
        },
        this.gateway = e.gateway,
        this.signKey = e.signKey,
        this.cluster = e.cluster ? e.cluster : 'cn';
      }

      s.prototype = {
        _check() {
          return this.common.app && this.signKey && this.common.ud && this.common.sver && this.common.type ? ['cn', 'intl'].indexOf(this.cluster) !== -1 || (a('不支持当前的 cluster参数: %s', this.cluster),
          !1) : (a(`缺少必传参数, app: ${this.common.app}, signKey: ${this.signKey}, ud: ${this.common.ud}, sdkver: ${this.common.sver}, type: ${this.common.type}`),
          !1);
        },
        getJConfigUrl() {
          return '';
        },
        getUploadUrl() {
          if (!this._check()) return '';
          const e = this.common;
          const t = (function (e, t) {
            e = e || {};
            const r = [];
            for (const o in e) r.push(o);
            r.sort();
            for (var a = r.length, i = [], s = 0; s < a; s++) i.push(`${r[s]}=${e[r[s]]}`);
            return i.push(t),
            n(i.join(''));
          }(e, this.signKey));
          e.sign = t;
          const r = this.gateway || o[this.cluster].UPLOAD;
          const a = (function (e) {
            const t = [];
            for (const r in e) t.push(`${r}=${e[r]}`);
            return t.join('&');
          }(e));
          return `${r}?wpk-header=${encodeURIComponent(a)}`;
        }
      },
      e.exports = s;
    },
    function (e, t) {
      function r(e, t) {
        const r = (65535 & e) + (65535 & t);
        return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r;
      }

      function n(e, t, n, o, a, i) {
        return r((s = r(r(t, e), r(o, i))) << (u = a) | s >>> 32 - u, n);
        let s;
        let
          u;
      }

      function o(e, t, r, o, a, i, s) {
        return n(t & r | ~t & o, e, t, a, i, s);
      }

      function a(e, t, r, o, a, i, s) {
        return n(t & o | r & ~o, e, t, a, i, s);
      }

      function i(e, t, r, o, a, i, s) {
        return n(t ^ r ^ o, e, t, a, i, s);
      }

      function s(e, t, r, o, a, i, s) {
        return n(r ^ (t | ~o), e, t, a, i, s);
      }

      function u(e, t) {
        let n;
        let u;
        let c;
        let l;
        let
          d;
        e[t >> 5] |= 128 << t % 32,
        e[14 + (t + 64 >>> 9 << 4)] = t;
        let p = 1732584193;
        let f = -271733879;
        let _ = -1732584194;
        let h = 271733878;
        for (n = 0; n < e.length; n += 16) {
          u = p,
          c = f,
          l = _,
          d = h,
          p = o(p, f, _, h, e[n], 7, -680876936),
          h = o(h, p, f, _, e[n + 1], 12, -389564586),
          _ = o(_, h, p, f, e[n + 2], 17, 606105819),
          f = o(f, _, h, p, e[n + 3], 22, -1044525330),
          p = o(p, f, _, h, e[n + 4], 7, -176418897),
          h = o(h, p, f, _, e[n + 5], 12, 1200080426),
          _ = o(_, h, p, f, e[n + 6], 17, -1473231341),
          f = o(f, _, h, p, e[n + 7], 22, -45705983),
          p = o(p, f, _, h, e[n + 8], 7, 1770035416),
          h = o(h, p, f, _, e[n + 9], 12, -1958414417),
          _ = o(_, h, p, f, e[n + 10], 17, -42063),
          f = o(f, _, h, p, e[n + 11], 22, -1990404162),
          p = o(p, f, _, h, e[n + 12], 7, 1804603682),
          h = o(h, p, f, _, e[n + 13], 12, -40341101),
          _ = o(_, h, p, f, e[n + 14], 17, -1502002290),
          p = a(p, f = o(f, _, h, p, e[n + 15], 22, 1236535329), _, h, e[n + 1], 5, -165796510),
          h = a(h, p, f, _, e[n + 6], 9, -1069501632),
          _ = a(_, h, p, f, e[n + 11], 14, 643717713),
          f = a(f, _, h, p, e[n], 20, -373897302),
          p = a(p, f, _, h, e[n + 5], 5, -701558691),
          h = a(h, p, f, _, e[n + 10], 9, 38016083),
          _ = a(_, h, p, f, e[n + 15], 14, -660478335),
          f = a(f, _, h, p, e[n + 4], 20, -405537848),
          p = a(p, f, _, h, e[n + 9], 5, 568446438),
          h = a(h, p, f, _, e[n + 14], 9, -1019803690),
          _ = a(_, h, p, f, e[n + 3], 14, -187363961),
          f = a(f, _, h, p, e[n + 8], 20, 1163531501),
          p = a(p, f, _, h, e[n + 13], 5, -1444681467),
          h = a(h, p, f, _, e[n + 2], 9, -51403784),
          _ = a(_, h, p, f, e[n + 7], 14, 1735328473),
          p = i(p, f = a(f, _, h, p, e[n + 12], 20, -1926607734), _, h, e[n + 5], 4, -378558),
          h = i(h, p, f, _, e[n + 8], 11, -2022574463),
          _ = i(_, h, p, f, e[n + 11], 16, 1839030562),
          f = i(f, _, h, p, e[n + 14], 23, -35309556),
          p = i(p, f, _, h, e[n + 1], 4, -1530992060),
          h = i(h, p, f, _, e[n + 4], 11, 1272893353),
          _ = i(_, h, p, f, e[n + 7], 16, -155497632),
          f = i(f, _, h, p, e[n + 10], 23, -1094730640),
          p = i(p, f, _, h, e[n + 13], 4, 681279174),
          h = i(h, p, f, _, e[n], 11, -358537222),
          _ = i(_, h, p, f, e[n + 3], 16, -722521979),
          f = i(f, _, h, p, e[n + 6], 23, 76029189),
          p = i(p, f, _, h, e[n + 9], 4, -640364487),
          h = i(h, p, f, _, e[n + 12], 11, -421815835),
          _ = i(_, h, p, f, e[n + 15], 16, 530742520),
          p = s(p, f = i(f, _, h, p, e[n + 2], 23, -995338651), _, h, e[n], 6, -198630844),
          h = s(h, p, f, _, e[n + 7], 10, 1126891415),
          _ = s(_, h, p, f, e[n + 14], 15, -1416354905),
          f = s(f, _, h, p, e[n + 5], 21, -57434055),
          p = s(p, f, _, h, e[n + 12], 6, 1700485571),
          h = s(h, p, f, _, e[n + 3], 10, -1894986606),
          _ = s(_, h, p, f, e[n + 10], 15, -1051523),
          f = s(f, _, h, p, e[n + 1], 21, -2054922799),
          p = s(p, f, _, h, e[n + 8], 6, 1873313359),
          h = s(h, p, f, _, e[n + 15], 10, -30611744),
          _ = s(_, h, p, f, e[n + 6], 15, -1560198380),
          f = s(f, _, h, p, e[n + 13], 21, 1309151649),
          p = s(p, f, _, h, e[n + 4], 6, -145523070),
          h = s(h, p, f, _, e[n + 11], 10, -1120210379),
          _ = s(_, h, p, f, e[n + 2], 15, 718787259),
          f = s(f, _, h, p, e[n + 9], 21, -343485551),
          p = r(p, u),
          f = r(f, c),
          _ = r(_, l),
          h = r(h, d);
        }
        return [p, f, _, h];
      }

      function c(e) {
        let t;
        let r = '';
        const
          n = 32 * e.length;
        for (t = 0; t < n; t += 8) r += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        return r;
      }

      function l(e) {
        let t;
        const
          r = [];
        for (r[(e.length >> 2) - 1] = void 0,
        t = 0; t < r.length; t += 1) {
          r[t] = 0;
        }
        const n = 8 * e.length;
        for (t = 0; t < n; t += 8) r[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        return r;
      }

      function d(e) {
        let t;
        let r;
        let
          n = '';
        for (r = 0; r < e.length; r += 1) {
          t = e.charCodeAt(r),
          n += '0123456789abcdef'.charAt(t >>> 4 & 15) + '0123456789abcdef'.charAt(15 & t);
        }
        return n;
      }

      function p(e) {
        return unescape(encodeURIComponent(e));
      }

      function f(e) {
        return (function (e) {
          return c(u(l(e), 8 * e.length));
        }(p(e)));
      }

      function _(e, t) {
        return (function (e, t) {
          let r;
          let n;
          let o = l(e);
          const a = [];
          const
            i = [];
          for (a[15] = i[15] = void 0,
          o.length > 16 && (o = u(o, 8 * e.length)),
          r = 0; r < 16; r += 1) {
            a[r] = 909522486 ^ o[r],
            i[r] = 1549556828 ^ o[r];
          }
          return n = u(a.concat(l(t)), 512 + 8 * t.length),
          c(u(i.concat(n), 640));
        }(p(e), p(t)));
      }

      e.exports = function (e, t, r) {
        return t ? r ? _(t, e) : d(_(t, e)) : r ? f(e) : d(f(e));
      };
    }
    ]));
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.getDDPreloadValue = function (e, t) {
      void 0 === e && (e = {});
      const r = e.ddPreloadValues;
      return (void 0 === r ? {} : r)[t];
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0)
      .__importDefault(r(37));
    const o = r(7);
    t.default = function (e, t, r, a, i) {
      void 0 === e && (e = ''),
      void 0 === t && (t = ''),
      void 0 === r && (r = -1),
      void 0 === a && (a = -1),
      void 0 === i && (i = {}),
      i = i || {},
      e.indexOf('nebula work error') === 0 ? n.default.call(this, o.REGISTER_WORKER_ERROR, [e, t, r, a, i]) : n.default.call(this, o.RENDER_GLOBAL_ERROR, [e, t, r, a, i]);
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.__dangerGetRenderStartupParams = function () {
      return window.AlipayJSBridge.startupParams;
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(126));
    const a = r(38);
    const i = n.__importDefault(r(6));
    t.default = function (e, t) {
      let r;
      const
        n = (r = a.getAllSnapshotInfo(),
        Object.getOwnPropertyNames(r)
          .map(((e) => r[e]
          ))
          .sort(((e, t) => (e.area.top > t.area.top ? 1 : e.area.top === t.area.top ? t.area.right - e.area.right : 0)
          )));
      i.default('takeAppSnapshot', {
        hotAreas: n
      }, t),
      o.default();
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0)
      .__importDefault(r(6));
    t.default = function () {
      let e = document.getElementsByTagName('body')[0].innerHTML;
      e = (e = (e = e.replace(/[\r\n]/g, '')).replace(/\s+/g, ' ')).replace(/<script>([\s\S]*)<\/script>/g, '');
      const t = (new DOMParser()).parseFromString(e, 'text/html');
      !(function e(t) {
        if (t) {
          const r = t.childNodes;
          if (r) {
            if (r.length) {
              for (let n = 0; n < r.length; n++) e(r[n]);
            } else {
              if (+t.nodeType == 3) {
                let o = t.nodeValue;
                o && (o = o.replace(/[^\s]/g, '*'),
                t.nodeValue = o);
              }
              if (String(t.tagName) === 'INPUT') {
                let a = t.value;
                a && (a = a.replace(/[^\s]/g, '*'),
                t.defaultValue = a);
              }
            }
          }
        }
      }(t)),
      e = t.getElementsByTagName('body')[0].innerHTML,
      n.default('snapshotDom', {
        bodyInnerStr: e
      });
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(6));
    const a = n.__importDefault(r(16));
    const i = r(5);
    const s = r(17);
    const u = a.default.bind(null, o.default, 'render');
    let c = !1;
    t.addPageMeta = function () {
      if (!c) {
        return c = !0,
        {
          state: i.TraceType.PAGE_METADATA,
          time: Date.now(),
          payload: {
            page: location.hash
          }
        };
      }
    }
    ,
    t.default = function (e, t) {
      let r;
      (r = self,
      r.AlipayJSBridge && r.AlipayJSBridge.startupParams || {}).enableTracing && u(s.trans(e, t));
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    let n;
    let o;
    const a = r(1);
    let i = !0;
    let
      s = 0;

    function u(e, t, r, n, o) {
      n = n || 0,
      o = o || 0,
      this.identifier = t,
      this.target = e,
      this.clientX = r.clientX + n,
      this.clientY = r.clientY + o,
      this.screenX = r.screenX + n,
      this.screenY = r.screenY + o,
      this.pageX = r.pageX + n,
      this.pageY = r.pageY + o;
    }

    function c() {
      const e = [];
      return e.item = function (e) {
        return this[e] || null;
      }
      ,
      e.identifiedTouch = function (e) {
        return this[e + 1] || null;
      }
      ,
      e;
    }

    function l(e) {
      return function (t) {
        let r;
        let a;
        let
          i;
        !1 !== o && (t.which === 1 && ((t.type == 'mousedown' || !n || n && !n.dispatchEvent) && (n = t.target),
        r = e,
        a = t,
        (i = document.createEvent('Event')).initEvent(r, !0, !0),
        i.altKey = a.altKey,
        i.ctrlKey = a.ctrlKey,
        i.metaKey = a.metaKey,
        i.shiftKey = a.shiftKey,
        i.touches = p(a),
        i.targetTouches = p(a),
        i.changedTouches = (function (e) {
          return d(e);
        }(a)),
        i.__fakeFrom = a.type,
        n.dispatchEvent(i),
        t.type == 'mouseup' && (n = null)));
      };
    }

    function d(e) {
      const t = c();
      return t.push(new u(n, 1, e, 0, 0)),
      t;
    }

    function p(e) {
      return e.type == 'mouseup' ? c() : d(e);
    }

    t.initTouchEmulator = function () {
      return !(('ontouchstart' in window || window.Modernizr && window.Modernizr.touch || (navigator.msMaxTouchPoints || navigator.maxTouchPoints) > 2) && (!a.isIPad || typeof String.prototype.replaceAll !== 'function')) && (a.isIPad ? (window.addEventListener('touchstart', ((e) => {
        e.__fakeFrom || (i = !1,
        s = Date.now(),
        o = !1,
        delete e.__fakeFrom);
      }
      ), !0),
      window.addEventListener('mousedown', (() => {
        const e = Date.now();
        (i || e - s > 1e3) && (o = !0),
        i = !0,
        s = e;
      }
      ), !0)) : o = !0,
      window.addEventListener('mousedown', l('touchstart'), !0),
      window.addEventListener('mousemove', l('touchmove'), !0),
      window.addEventListener('mouseup', l('touchend'), !0),
      !0);
    };
    let f = !1;
    t.initTouchEventEmulator = function (e) {
      e && !0 === e.enableTouchEmulator && (document.createTouch || (document.createTouch = function (e, t, r, n, o, a, i, s, c) {
        return void 0 !== s && void 0 !== c || (s = n - window.pageXOffset,
        c = o - window.pageYOffset),
        new u(t, r, {
          pageX: n,
          pageY: o,
          screenX: a,
          screenY: i,
          clientX: s,
          clientY: c
        });
      }
      ),
      document.createTouchList || (document.createTouchList = function () {
        for (var e = c(), t = 0; t < arguments.length; t++) e[t] = arguments[t];
        return e.length = arguments.length,
        e;
      }
      ),
      f = t.initTouchEmulator(),
      console.log('touch event polyfill success'));
    }
    ,
    t.isTouchEmulatorEnabled = function () {
      return f;
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(1);
    let o = !1;
    t.addPCScrollBarPolifill = function () {
      if (!o) {
        if (n.isDDPC) {
          const e = '\n        ::-webkit-scrollbar {\n        display: none;\n        }';
          const t = document.createElement('style');
          t.setAttribute('type', 'text/css'),
          t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e));
          const r = document.getElementsByTagName('head');
          r.length ? r[0].appendChild(t) : document.documentElement.appendChild(t);
        }
        o = !0;
      }
    };
  },
  function (e, t, r) {
    r.r(t);
    r(2).getMember;
    t.default = {
      view: {
        props: {
          'device-position': {
            type: 'string',
            default: 'back'
          },
          flash: {
            type: 'string',
            default: 'auto'
          }
        }
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(4));
    const a = r(132);
    const i = n.__importDefault(r(133));
    t.default = {
      name: 'external-component',
      isReactComponent: !0,
      factory(e) {
        return (0,
        e.createReactClass)({
          displayName: 'ExternalComponent',
          getInitialState() {
            return {
              loaded: !1,
              RealExternalComponent: null
            };
          },
          componentDidMount() {
            const e = this;
            const t = window.AlipayJSBridge.startupParams.appId;
            if (t && i.default.indexOf(t.toString()) !== -1) {
              const r = self;
              const n = this.props;
              const o = n.is;
              !0 === n.css && a.loadCss(o),
              a.load(o)
                .then((() => {
                  let t;
                  const
                    n = r.AFAppX[(t = o,
                    t.split('-')
                      .map(((e) => {
                        return (t = e).charAt(0)
                          .toUpperCase() + t.slice(1);
                        let t;
                      }
                      ))
                      .join(''))];
                  n ? (e.onLoad(o),
                  e.setState({
                    loaded: !0,
                    RealExternalComponent: n
                  })) : e.onError({
                    is: o,
                    errMsg: 'Invalid External Component'
                  });
                }
                ), ((t) => {
                  e.onError({
                    errMsg: t.message || 'load external component error',
                    is: o
                  });
                }
                ));
            }
          },
          onError(e) {
            const t = this.props.onError;
            typeof t === 'function' && t(e);
          },
          onLoad(e) {
            const t = this.props.onLoad;
            typeof t === 'function' && t({
              is: e
            });
          },
          saveRef(e) {
            this.externalComponentIns = e;
          },
          invoke(e, t, r) {
            const n = e.method;
            const o = e.args;
            if (this.externalComponentIns) {
              const a = this.externalComponentIns.getWrappedComponent();
              if (a && a[n]) {
                const i = a[n].call(a, o);
                return void (t && t(i));
              }
              r && r({
                error: 1,
                errMsg: `method ${n} not found`
              });
            } else {
              r && r({
                error: 2,
                errMsg: 'externalComponent instance not found'
              });
            }
          },
          render() {
            const e = this.state;
            const t = e.RealExternalComponent;
            const r = e.loaded;
            const a = this.props;
            const i = (a.onLoad,
            a.onError,
            n.__rest(a, ['onLoad', 'onError']));
            return r ? o.default.createElement(t, n.__assign({}, i, {
              ref: this.saveRef
            })) : null;
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = r(25);
    const a = {};
    const i = {};
    t.load = function (e) {
      return n.__awaiter(this, void 0, void 0, (function () {
        let t;
        return n.__generator(this, ((r) => {
          switch (r.label) {
            case 0:
              if (!e) throw new Error('External Component Load Error: with empty is');
              t = o.genUrl(e),
              r.label = 1;
            case 1:
              return r.trys.push([1, 3, , 4]),
              [4, (n = t,
              a[n] || (a[n] = new Promise((((e, t) => {
                const r = document.createElement('script');
                r.crossOrigin = !0,
                r.setAttribute('snapshot-delete', 'true'),
                r.onload = function () {
                  setTimeout((() => {
                    e();
                  }
                  ), 100);
                }
                ,
                r.onerror = function () {
                  t();
                }
                ,
                document.head.appendChild(r),
                r.src = n;
              })
              ))),
              a[n])];
            case 2:
              return r.sent(),
              [3, 4];
            case 3:
              throw r.sent(),
              new Error(`External Component Load Error: script load error ${t}`);
            case 4:
              return [2];
          }
          let n;
        }
        ));
      }
      ));
    }
    ,
    t.loadCss = function (e) {
      return n.__awaiter(this, void 0, void 0, (function () {
        let t;
        return n.__generator(this, ((r) => {
          switch (r.label) {
            case 0:
              if (!e) throw new Error('External Component Css Load Error: with empty is');
              t = o.genUrl(e, {
                isCss: !0
              }),
              r.label = 1;
            case 1:
              return r.trys.push([1, 3, , 4]),
              [4, (n = t,
              i[n] || (i[n] = new Promise((((e) => {
                const t = document.createElement('link');
                t.href = n,
                t.setAttribute('rel', 'stylesheet'),
                document.getElementsByTagName('head')[0].appendChild(t),
                e();
              })
              ))),
              i[n])];
            case 2:
              return r.sent(),
              [3, 4];
            case 3:
              throw r.sent(),
              new Error(`External Component Css Load Error: Style load error ${t}`);
            case 4:
              return [2];
          }
          let n;
        }
        ));
      }
      ));
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    }),
    t.default = ['2019052065147900', '2019091867592049', '2019101768407793', '2019011663033346', '2019062065630620', '2019010262738680', '2019071365789599', '2019082466422222', '2019042864365185'];
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    let n;
    let o;
    const a = r(0);
    const i = a.__importDefault(r(4));
    const s = r(39);
    const u = a.__importDefault(r(40));
    const
      c = r(42);
    !(function (e) {
      e.LOADING = 'loading',
      e.SUCCESS = 'success',
      e.FAIL = 'fail';
    }(n = t.AVATAR_STATUS || (t.AVATAR_STATUS = {}))),
    (function (e) {
      e.PERSONAL = 'personal',
      e.CORP = 'corp',
      e.INTERNAL_CACHE = 'internal_cache',
      e.INTERNAL_NET = 'internal_net';
    }(o = t.BUSS_TYPE || (t.BUSS_TYPE = {})));
    let l = null;
    t.default = {
      name: 'open-avatar',
      isReactComponent: !0,
      factory(e) {
        const t = e.createReactClass;
        return l || (l = t(u.default)),
        t({
          displayName: 'OpenAvatar',
          getInitialState() {
            return {
              status: n.SUCCESS,
              userInfo: null
            };
          },
          componentWillMount() {
            this.loadImage(this.props);
          },
          componentWillReceiveProps(e) {
            const t = this.state.userInfo;
            const r = t ? t.avatar : this.props.avatar;
            const n = t ? t.nickName : this.props.nickName;
            this.setState({
              userInfo: {
                avatar: r,
                nickName: n
              }
            });
            const o = e.userId != this.props.userId || e.openId != this.props.openId || e.uid != this.props.uid;
            const a = (e.userId || e.openId || e.uid) && !e.nickName && this.props.nickName;
            (o || a) && this.loadImage(e);
          },
          loadImage(e) {
            const t = this;
            const r = e.userId;
            const a = e.openId;
            const i = e.uid;
            e.nickName || (i ? (this.setState({
              status: n.LOADING
            }),
            c.loadImage(o.INTERNAL_CACHE, i)
              .then(((e) => {
                e && e.nickName ? (console.log(`from cache:uid:${i}`),
                t.setState({
                  status: n.SUCCESS,
                  userInfo: e
                })) : (console.log(`open-avatar for uid:${i} not in cache, get from net`),
                c.loadImage(o.INTERNAL_NET, i)
                  .then(((e) => {
                    console.log(`open-avatar from net:uid:${i}`),
                    e && !e.errorMessage && e.nickName ? t.setState({
                      status: n.SUCCESS,
                      userInfo: e
                    }) : (s.error(`open-avatar:uid:${i} has no user info, reason:${e.errorMessage}`),
                    t.setState({
                      status: n.FAIL,
                      userInfo: null
                    }));
                  }
                  ), ((e) => {
                    s.error(`open-avatar:open-avatar for uid:${i} occur error ${e}`),
                    t.setState({
                      status: n.FAIL,
                      userInfo: null
                    });
                  }
                  )));
              }
              ), ((e) => {
                s.error(`open-avatar:open-avatar for uid:${i} occur error ${e}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                });
              }
              ))) : a ? (this.setState({
              status: n.LOADING
            }),
            c.loadImage(o.PERSONAL, a)
              .then(((e) => {
                e && !e.errorMessage && e.nickName ? t.setState({
                  status: n.SUCCESS,
                  userInfo: e
                }) : (s.error(`open-avatar:openId:${a} has no user info, reason:${e.errorMessage}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                }));
              }
              ), ((e) => {
                s.error(`open-avatar:open-avatar for openId:${a} occur error ${e}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                });
              }
              ))) : r && (this.setState({
              status: n.LOADING
            }),
            c.loadImage(o.CORP, r)
              .then(((e) => {
                e && !e.errorMessage && e.nickName ? t.setState({
                  status: n.SUCCESS,
                  userInfo: e
                }) : (s.error(`open-avatar:userId:${r} has no user info, reason:${e.errorMessage}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                }));
              }
              ), ((e) => {
                s.error(`open-avatar for userId:${r} occur error ${e}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                });
              }
              ))));
          },
          render() {
            const e = this.props;
            const t = e.userId;
            const r = e.openId;
            const o = e.uid;
            const a = e.nickName;
            const s = e.avatar;
            const u = e.size;
            const c = e.opacity;
            const d = e.shape;
            const p = e.className;
            const f = this.state;
            const _ = f.status;
            const h = f.userInfo;
            if (!(t || r || o || a)) {
              return i.default.createElement(l, {
                size: u,
                name: '',
                opacity: c,
                loading: !1,
                shape: d,
                className: p
              });
            }
            if (a) {
              return i.default.createElement(l, {
                size: u,
                src: s,
                name: a,
                opacity: c,
                loading: !1,
                shape: d,
                className: p
              });
            }
            const m = h ? h.avatar : '';
            const v = h ? h.nickName : '';
            if (_ == n.LOADING) {
              const g = !m && !v;
              return i.default.createElement(l, {
                size: u,
                src: m,
                name: v,
                opacity: c,
                loading: g,
                shape: d,
                className: p
              });
            }
            return _ != n.FAIL && h && h.nickName ? i.default.createElement(l, {
              size: u,
              src: m,
              name: v,
              opacity: c,
              loading: !1,
              shape: d,
              className: p
            }) : i.default.createElement(l, {
              size: u,
              name: '',
              opacity: c,
              loading: !1,
              shape: d,
              className: p
            });
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    let n;
    let o;
    const a = r(0);
    const i = a.__importDefault(r(4));
    const s = r(39);
    const u = a.__importDefault(r(40));
    const
      c = r(42);
    !(function (e) {
      e.LOADING = 'loading',
      e.SUCCESS = 'success',
      e.FAIL = 'fail';
    }(n = t.AVATAR_STATUS || (t.AVATAR_STATUS = {}))),
    (function (e) {
      e.PERSONAL = 'personal',
      e.CORP = 'corp',
      e.INTERNAL_CACHE = 'internal_cache',
      e.INTERNAL_NET = 'internal_net';
    }(o = t.BUSS_TYPE || (t.BUSS_TYPE = {})));
    let l = null;
    t.default = {
      name: 'open-avatar',
      isReactComponent: !0,
      factory(e) {
        const t = e.createReactClass;
        return l || (l = t(u.default)),
        t({
          displayName: 'OpenAvatar',
          getInitialState() {
            return {
              status: n.SUCCESS,
              userInfo: null
            };
          },
          componentWillMount() {
            this.loadImage(this.props);
          },
          componentWillReceiveProps(e) {
            const t = this.state.userInfo;
            const r = t ? t.avatar : this.props.avatar;
            const n = t ? t.nickName : this.props.nickName;
            this.setState({
              userInfo: {
                avatar: r,
                nickName: n
              }
            });
            const o = e.userId != this.props.userId || e.openId != this.props.openId || e.uid != this.props.uid;
            const a = (e.userId || e.openId || e.uid) && !e.nickName && this.props.nickName;
            (o || a) && this.loadImage(e);
          },
          loadImage(e) {
            const t = this;
            const r = e.userId;
            const a = e.openId;
            const i = e.uid;
            e.nickName || (i ? (this.setState({
              status: n.LOADING
            }),
            c.loadImage(o.INTERNAL_CACHE, i)
              .then(((e) => {
                e && e.nickName ? (console.log(`from cache:uid:${i}`),
                t.setState({
                  status: n.SUCCESS,
                  userInfo: e
                })) : (console.log(`open-avatar for uid:${i} not in cache, get from net`),
                c.loadImage(o.INTERNAL_NET, i)
                  .then(((e) => {
                    console.log(`open-avatar from net:uid:${i}`),
                    e && !e.errorMessage && e.nickName ? t.setState({
                      status: n.SUCCESS,
                      userInfo: e
                    }) : (s.error(`open-avatar:uid:${i} has no user info, reason:${e.errorMessage}`),
                    t.setState({
                      status: n.FAIL,
                      userInfo: null
                    }));
                  }
                  ), ((e) => {
                    s.error(`open-avatar:open-avatar for uid:${i} occur error ${e}`),
                    t.setState({
                      status: n.FAIL,
                      userInfo: null
                    });
                  }
                  )));
              }
              ), ((e) => {
                s.error(`open-avatar:open-avatar for uid:${i} occur error ${e}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                });
              }
              ))) : a ? (this.setState({
              status: n.LOADING
            }),
            c.loadImage(o.PERSONAL, a)
              .then(((e) => {
                e && !e.errorMessage && e.nickName ? t.setState({
                  status: n.SUCCESS,
                  userInfo: e
                }) : (s.error(`open-avatar:openId:${a} has no user info, reason:${e.errorMessage}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                }));
              }
              ), ((e) => {
                s.error(`open-avatar:open-avatar for openId:${a} occur error ${e}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                });
              }
              ))) : r && (this.setState({
              status: n.LOADING
            }),
            c.loadImage(o.CORP, r)
              .then(((e) => {
                e && !e.errorMessage && e.nickName ? t.setState({
                  status: n.SUCCESS,
                  userInfo: e
                }) : (s.error(`open-avatar:userId:${r} has no user info, reason:${e.errorMessage}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                }));
              }
              ), ((e) => {
                s.error(`open-avatar for userId:${r} occur error ${e}`),
                t.setState({
                  status: n.FAIL,
                  userInfo: null
                });
              }
              ))));
          },
          render() {
            const e = this.props;
            const t = e.userId;
            const r = e.openId;
            const o = e.uid;
            const a = e.nickName;
            const s = e.avatar;
            const u = e.size;
            const c = e.opacity;
            const d = e.shape;
            const p = e.className;
            const f = this.state;
            const _ = f.status;
            const h = f.userInfo;
            if (!(t || r || o || a)) {
              return i.default.createElement(l, {
                size: u,
                name: '',
                opacity: c,
                loading: !1,
                shape: d,
                className: p
              });
            }
            if (a) {
              return i.default.createElement(l, {
                size: u,
                src: s,
                name: a,
                opacity: c,
                loading: !1,
                shape: d,
                className: p
              });
            }
            const m = h ? h.avatar : '';
            const v = h ? h.nickName : '';
            if (_ == n.LOADING) {
              const g = !m && !v;
              return i.default.createElement(l, {
                size: u,
                src: m,
                name: v,
                opacity: c,
                loading: g,
                shape: d,
                className: p
              });
            }
            return _ != n.FAIL && h && h.nickName ? i.default.createElement(l, {
              size: u,
              src: m,
              name: v,
              opacity: c,
              loading: !1,
              shape: d,
              className: p
            }) : i.default.createElement(l, {
              size: u,
              name: '',
              opacity: c,
              loading: !1,
              shape: d,
              className: p
            });
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(4));
    const a = n.__importDefault(r(41));
    const i = r(44);
    const s = r(137);
    const u = {
      userName: 1,
      userTitle: 1,
      userDepartment: 1,
      departmentName: 1
    };
    const c = {
      userName(e) {
        const t = e.nick;
        return void 0 === t ? '' : t;
      },
      userTitle(e) {
        const t = e.orgTitle;
        return void 0 === t ? '' : t;
      },
      userDepartment(e) {
        const t = e.deptList;
        return (void 0 === t ? [] : t).map(((e) => e.deptName || ''
        ))
          .join('/');
      }
    };

    function l() {
    }

    t.default = {
      name: 'open-data',
      isReactComponent: !0,
      factory(e) {
        return (0,
        e.createReactClass)({
          displayName: 'OpenData',
          getInitialState() {
            return {
              displayText: null
            };
          },
          getDefaultProps() {
            return {
              onError: l,
              defaultText: ''
            };
          },
          componentWillMount() {
            this.loadOpenData(this.props);
          },
          componentWillReceiveProps(e) {
            e.openId !== this.props.openId && this.loadOpenData(e);
          },
          dealErrorInfo(e, t) {
            const r = t.openId;
            const n = t.openType;
            const o = t.onError;
            const a = e.errorMessage || e.message || e.msg || 'unknown';
            i.error(`${n} for openId: ${r} occured error: ${a}`),
            this.setState({
              displayText: ''
            }),
            o({
              error: 11,
              errorMessage: a
            });
          },
          loadOpenData(e) {
            const t = this;
            const r = e.openId;
            const n = e.openType;
            const o = e.onError;
            r ? n && u[n] ? n === 'departmentName' ? s.loadOpenDeptInfo(String(r))
              .then(((e) => {
                if (!e || e.errorMessage) throw e;
                const r = e.name;
                t.setState({
                  displayText: r
                }),
                r === '' && o({
                  error: 13,
                  errorMessage: 'content is empty'
                });
              }
              ))
              .catch(((r) => {
                t.dealErrorInfo(r, e);
              }
              )) : s.loadOpenProfile(String(r))
              .then(((e) => {
                if (!e || e.errorMessage) throw e;
                const r = c[n](e);
                t.setState({
                  displayText: r
                }),
                r === '' && o({
                  error: 13,
                  errorMessage: 'content is empty'
                });
              }
              ))
              .catch(((r) => {
                t.dealErrorInfo(r, e);
              }
              )) : o({
              error: 12,
              errorMessage: 'unvalid openType'
            }) : o({
              error: 12,
              errorMessage: 'unvalid openId'
            });
          },
          render() {
            const e = this.props;
            const t = e.className;
            const r = e.defaultText;
            const n = e.openType;
            const i = this.state.displayText || r;
            return o.default.createElement('span', {
              className: a.default(`dd-open-data dd-open-data__${n}`, t)
            }, i);
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0)
      .__importDefault(r(14));
    const o = r(44);

    function a(e, t, r) {
      Array.isArray(e) || (e = []);
      const n = e.reduce(((e, t) => (e[t.userId] = t,
      e)
      ), {});
      return t.map(((e) => (n[e] ? n[e] : r(e))
      ));
    }

    function i(e) {
      return function (t) {
        return o.openCallBridge('getUserOpenData', {
          userIds: t,
          onlyCache: e
        })
          .then(((e) => a(e.data, t, o.blankAvatarProfileGen)
          ));
      };
    }

    const s = {
      personal: o.batchLazyLoaderGen({
        requestFn(e) {
          return o.openCallBridge('getUserOpenData', {
            userIds: e
          })
            .then(((t) => a(t.data, e, o.blankAvatarProfileGen)
            ));
        }
      }),
      corp: o.batchLazyLoaderGen({
        requestFn(e) {
          const t = n.default(AlipayJSBridge.startupParams.query).corpId;
          return t ? o.openCallBridge('getUserOpenData', {
            userIds: e,
            corpId: t
          })
            .then(((t) => a(t.data, e, o.blankAvatarProfileGen)
            )) : Promise.reject({
            error: -2,
            errorMessage: 'corpId获取失败'
          });
        }
      }),
      internal_cache: o.batchLazyLoaderGen({
        requestFn: i(!0)
      }),
      internal_net: o.batchLazyLoaderGen({
        requestFn: i(!1)
      })
    };
    t.loadAvatar = function (e, t) {
      return s[e] ? s[e].getResult(t, '1') : Promise.reject({
        error: 5,
        errorMessage: '参数错误'
      });
    };
    const u = o.batchLazyLoaderGen({
      requestFn(e) {
        const t = n.default(AlipayJSBridge.startupParams.query).corpId;
        return t ? o.openCallBridge('getUserSensitiveField', {
          userIds: e,
          corpId: t
        })
          .then(((t) => a(t.userEmployees, e, o.blankOpenProfileGen)
          )) : Promise.reject({
          error: -2,
          errorMessage: 'corpId获取失败'
        });
      }
    });
    t.loadOpenProfile = function (e) {
      return u.getResult(e, '2');
    };
    const c = o.batchLazyLoaderGen({
      requestFn(e) {
        const t = n.default(AlipayJSBridge.startupParams.query).corpId;
        if (!t) {
          return Promise.reject({
            error: -2,
            errorMessage: 'corpId获取失败'
          });
        }
        const r = e.map(((e) => parseInt(e)
        ));
        return o.openCallBridge('getDeptInfo', {
          deptIds: r,
          corpId: t
        })
          .then(((e) => (function (e, t) {
            Array.isArray(e) || (e = []);
            const r = e.reduce(((e, t) => (e[t.id] = t,
            e)
            ), {});
            return t.map(((e) => (r[e] ? r[e] : {
              id: e,
              name: '',
              errorMessage: 'not found'
            })
            ));
          }(e.deptList, r))
          ));
      },
      resultBuilder(e) {
        return String(e.id);
      }
    });
    t.loadOpenDeptInfo = function (e) {
      return c.getResult(e, '3');
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(4));
    const a = n.__importDefault(r(6));
    t.default = {
      name: 'open-face',
      isReactComponent: !0,
      factory(e) {
        return (0,
        e.createReactClass)({
          displayName: 'OpenFace',
          getDefaultProps() {
            return {
              corpId: '',
              userId: '',
              style: {},
              className: '',
              showUserName: !0
            };
          },
          getInitialState() {
            return {
              hasFace: !1,
              faceUrl: '',
              recordTime: '',
              userName: ''
            };
          },
          componentDidMount() {
            const e = this.props;
            const t = e.corpId;
            const r = e.userId;
            this.getUserFace(t, r);
          },
          componentDidUpdate(e) {
            const t = this.props;
            const r = t.corpId;
            const n = t.userId;
            r === e.corpId && n === e.userId || this.getUserFace(r, n);
          },
          getUserFace(e, t) {
            const r = this;
            a.default('getUserFace', {
              corpId: e,
              userId: t
            }, ((e) => {
              const t = e.error;
              const n = e.hasFace;
              const o = void 0 !== n && n;
              const a = e.faceUrl;
              const i = void 0 === a ? '' : a;
              const s = e.recordTime;
              const u = e.userName;
              const c = void 0 === u ? '' : u;
              t ? console.error('getUserFace', t) : r.setState({
                hasFace: o,
                faceUrl: i,
                recordTime: s,
                userName: c
              });
            }
            ));
          },
          onClick() {
            this.props.onTap(this.props.$appx.getNormalizedEvent('tap'));
          },
          renderUserName() {
            const e = this.props.showUserName;
            const t = this.state.userName;
            if (e) {
              return o.default.createElement('div', {
                className: 'dd-open-face-title'
              }, o.default.createElement('span', null, t));
            }
          },
          renderImage() {
            const e = this.state.hasFace ? this.state.faceUrl : 'https://img.alicdn.com/tfs/TB1BUOLgEY1gK0jSZFMXXaWcVXa-184-183.png';
            return o.default.createElement('div', {
              className: 'dd-open-face',
              style: {
                backgroundImage: `url(${e})`
              }
            });
          },
          render() {
            const e = this.props;
            const t = e.className;
            const r = e.style;
            return o.default.createElement('div', {
              className: `dd-open-face-container ${t}`,
              style: r,
              onClick: this.onClick
            }, this.renderImage(), this.renderUserName());
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0)
      .__importDefault(r(4));
    const o = r(38);
    let a = 0;
    t.default = {
      name: 'snapshot-hotarea',
      isReactComponent: !0,
      factory(e) {
        return (0,
        e.createReactClass)({
          displayName: 'SnapshotHotarea',
          getDefaultProps() {
            return {
              aciton: '',
              actionParams: '',
              style: {},
              className: ''
            };
          },
          setSnapshotRef(e) {
            this.myRef = e;
          },
          componentDidMount() {
            this.randomId = a++;
            const e = this.getComponentLocationInfo();
            o.setSnapShotInfo(this.randomId, e);
          },
          componentDidUpdate() {
            const e = this.getComponentLocationInfo();
            o.setSnapShotInfo(this.randomId, e);
          },
          getComponentLocationInfo() {
            const e = this.props;
            const t = e.action;
            const r = e.actionParams;
            let n = r;
            t === 'openLink' && (n = {
              url: r
            });
            const o = this.myRef.getBoundingClientRect();
            const a = o.left;
            const i = o.top;
            return {
              area: {
                left: a,
                right: o.right,
                top: i,
                bottom: o.bottom
              },
              action: {
                type: t,
                param: n
              }
            };
          },
          render() {
            const e = this.props;
            const t = e.children;
            const r = e.style;
            const o = e.className;
            return n.default.createElement('div', {
              className: o,
              style: r,
              ref: this.setSnapshotRef
            }, t);
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(4));
    const a = n.__importDefault(r(141));
    const i = n.__importDefault(r(142));
    const s = r(1);
    let u = null;
    let c = null;
    t.default = {
      name: 'video',
      isReactComponent: !0,
      factory(e) {
        const t = e.createReactClass;
        return u || (u = t(a.default)),
        c || (c = t(i.default)),
        t({
          displayName: 'Video',
          getDefaultProps() {
            return {
              enableNative: !1
            };
          },
          play() {
            this.refs.video.play();
          },
          snapshot() {
            for (var e, t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
            (e = this.refs.video).snapshot.apply(e, t);
          },
          pause() {
            this.refs.video.pause();
          },
          seek(e) {
            this.refs.video.seek(e);
          },
          stop() {
            this.refs.video.stop();
          },
          playbackRate(e) {
            this.refs.video.playbackRate(e);
          },
          requestFullScreen() {
            for (var e, t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
            (e = this.refs.video).requestFullScreen.apply(e, t);
          },
          exitFullScreen() {
            this.refs.video.exitFullScreen();
          },
          render() {
            return this.props.enableNative && s.AndroidVersion != '4.4.4' && !s.isDDPC && !s.isLyraVM ? o.default.createElement(c, n.__assign({
              ref: 'video'
            }, this.props)) : o.default.createElement(u, n.__assign({
              ref: 'video'
            }, this.props));
          }
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(4));
    t.default = {
      displayName: 'H5Video',
      getDefaultProps() {
        return {
          controls: !0,
          autoplay: !1,
          src: '',
          duration: 1 / 0,
          objectFit: 'contain',
          rawControls: !1
        };
      },
      onPause() {
        this.props.onPause && this.props.onPause();
      },
      onPlay() {
        this.props.onPlay && this.props.onPlay();
      },
      onError(e) {
        let t;
        if (e.target.error && e.target.error.code) {
          t = ['', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'][e.target.error.code];
        }
        this.props.onError && t && this.props.onError({
          detail: {
            errMsg: t
          }
        });
      },
      onEnded() {
        this.props.onEnded && this.props.onEnded();
      },
      onTimeUpdate() {
        const e = this.props.duration;
        const t = this.refs.root.currentTime;
        e && t > e && this.pause(),
        this.props.onTimeUpdate && this.props.onTimeUpdate({
          detail: {
            currentTime: t
          }
        });
      },
      play() {
        this.refs.root.play();
      },
      pause() {
        this.refs.root.pause();
      },
      seek(e) {
        this.refs.root.currentTime = e || 0;
      },
      snapshot(e, t, r) {
        r({
          error: -1,
          errorMessage: 'not support for web video component'
        });
      },
      playbackRate(e, t, r) {
        r({
          error: -1,
          errorMessage: 'not support for web video component'
        });
      },
      requestFullScreen() {
        console.error('h5 video component not support requestFullScreen api, please use enable-native for native video component');
      },
      sendDanmu() {
      },
      render() {
        const e = this.props;
        const t = n.__assign({
          objectFit: e.objectFit
        }, e.style);
        return o.default.createElement('video', {
          className: e.className,
          ref: 'root',
          style: t,
          src: e.src,
          poster: e.poster,
          id: e.id,
          autoPlay: e.autoplay,
          controls: e.controls,
          playsInline: e.playsinline,
          'webkit-playsinline': !!e.playsinline && 'true',
          onPlay: this.onPlay,
          onEnded: this.onEnded,
          onPause: this.onPause,
          onError: this.onError,
          onTimeUpdate: this.onTimeUpdate,
          'raw-controls': e.rawControls && e.rawControls.toString()
        });
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(4));
    const a = n.__importDefault(r(143));
    t.default = {
      displayName: 'NVideo',
      mixins: [a.default],
      getDefaultProps() {
        return {
          controls: !0,
          autoplay: !1,
          src: '',
          loop: !1,
          muted: !1,
          duration: 1 / 0,
          objectFit: 'contain',
          usecache: !1
        };
      },
      bindEvents() {
        return {
          'nbcomponent.video.bindplay': this.onPlay,
          'nbcomponent.video.bindpause': this.onPause,
          'nbcomponent.video.bindended': this.onEnded,
          'nbcomponent.video.bindtimeupdate': this.onTimeUpdate,
          'nbcomponent.video.bindfullscreenchange': this.onFullScreenChange,
          'nbcomponent.video.bindfirstframerendered': this.onFirstFrameRendered,
          'nbcomponent.video.bindwaiting': this.onWaiting,
          'nbcomponent.video.binderror': this.onError
        };
      },
      getRenderData() {
        const e = this.props;
        return {
          src: e.src,
          autoplay: e.autoplay,
          controls: e.controls,
          loop: e.loop,
          muted: e.muted,
          duration: e.duration,
          objectFit: e.objectFit,
          usecache: e.usecache
        };
      },
      play() {
        this.callNativeAction('play');
      },
      pause() {
        this.callNativeAction('pause');
      },
      stop() {
        this.callNativeAction('stop');
      },
      seek(e) {
        this.callNativeAction('seek', {
          position: 1e3 * e
        });
      },
      playbackRate(e, t, r) {
        this.callNativeAction('playbackRate', {
          rate: e
        }, ((e) => {
          e && (e.error || e.errorCode) && (e.error = e.errorCode || e.error,
          delete e.errorCode),
          e.error ? r(e) : t(e);
        }
        ));
      },
      requestFullScreen() {
        this.callNativeAction('requestFullScreen');
      },
      exitFullScreen() {
        this.callNativeAction('exitFullScreen');
      },
      snapshot(e, t, r) {
        this.callNativeAction('snapshot', {
          quality: e
        }, ((e) => {
          e && (e.error || e.errorCode) && (e.error = e.errorCode || e.error,
          delete e.errorCode),
          e.error ? r(e) : t(e);
        }
        ));
      },
      onPlay(e) {
        const t = e.data.element;
        this.callUserHandler('onPlay', t);
      },
      onPause(e) {
        const t = e.data.element;
        this.callUserHandler('onPause', t);
      },
      onEnded(e) {
        const t = e.data.element;
        this.callUserHandler('onEnded', t);
      },
      onTimeUpdate(e) {
        const t = e.data;
        const r = t.element;
        const n = t.currentTime;
        const o = t.duration;
        this.callUserHandler('onTimeUpdate', r, {
          detail: {
            currentTime: n,
            duration: o
          }
        });
      },
      onFullScreenChange(e) {
        const t = e.data;
        const r = t.element;
        const n = t.fullScreen;
        this.callUserHandler('onFullScreenChange', r, {
          detail: {
            fullScreen: n
          }
        });
      },
      onWaiting(e) {
        const t = e.data.element;
        this.callUserHandler('onWaiting', t);
      },
      onFirstFrameRendered(e) {
        const t = e.data.element;
        this.callUserHandler('onFirstFrameRendered', t);
      },
      onError(e) {
        const t = e.data;
        const r = t.element;
        const n = t.errorCode;
        const o = t.errorMessage;
        this.callUserHandler('onError', r, {
          detail: {
            errorCode: n,
            errorMessage: o
          }
        });
      },
      render() {
        const e = this.props;
        return o.default.createElement('object', {
          className: e.className,
          style: e.style,
          type: 'application/view',
          role: 'application',
          id: this.id
        }, o.default.createElement('param', {
          name: 'type',
          value: 'video'
        }), o.default.createElement('param', {
          name: 'id',
          value: this.id
        }));
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0);
    const o = n.__importDefault(r(144));
    const a = r(1);
    const i = n.__importDefault(r(6));
    let s = 0;
    t.default = {
      componentWillMount() {
        this.id = this.props.id || `appx_${++s}`;
      },
      componentDidMount() {
        a.isAndroid ? this.detachReady = o.default(document, {
          'nbcomponent.canrender': this.onNativeReady
        }) : this.renderComponent(),
        this.bindEvents && (this.detachEvents = o.default(document, this.bindEvents()));
      },
      componentDidUpdate() {
        this.renderComponent();
      },
      componentWillUnmount() {
        this.clearRenderDelay(),
        i.default('NBComponent.remove', {
          element: this.id
        }),
        this.detachEvents && this.detachEvents.remove && this.detachEvents.remove();
      },
      onNativeReady(e) {
        e && e.elementid !== this.id || this.renderComponent();
      },
      clearRenderDelay() {
        this.detachReady && this.detachReady.remove && (this.detachReady.remove(),
        this.detachReady = null);
      },
      callNativeAction(e, t, r) {
        typeof t === 'function' && (r = t,
        t = void 0),
        i.default('NBComponent.sendMessage', {
          data: t,
          element: this.id,
          actionType: e
        }, r);
      },
      renderComponent() {
        this.clearRenderDelay(),
        i.default('NBComponent.render', {
          element: this.id,
          data: this.getRenderData()
        });
      },
      callUserHandler(e, t, r) {
        const n = this.props[e];
        !n || t !== this.id && t || n.call(this.props, r);
      }
    };
  },
  function (e, t, r) {
    Object.defineProperty(t, '__esModule', {
      value: !0
    });
    const n = r(0)
      .__importDefault(r(24));
    t.default = function (e, t) {
      for (var r = n.default(t), o = 0, a = r; o < a.length; o++) {
        const i = a[o];
        e.addEventListener(i, t[i]);
      }
      return {
        remove() {
          for (let n = 0, o = r; n < o.length; n++) {
            const a = o[n];
            e.removeEventListener(a, t[a]);
          }
        }
      };
    };
  },
  function (e, t, r) {
  }
]));
/*!
 *
 * ap/v1.25.7
 * Fri Jan 21 2022 16:41:21 GMT+0800 (GMT+08:00)
 *
 */
const global = self;
const __appxStartTime = Date.now();
const AFAppX = (function (e) {
  const t = {};

  function n(i) {
    if (t[i]) return t[i].exports;
    const r = t[i] = {
      i,
      l: !1,
      exports: {}
    };
    return e[i].call(r.exports, r, r.exports, n),
    r.l = !0,
    r.exports;
  }

  return n.m = e,
  n.c = t,
  n.d = function (e, t, i) {
    n.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: i
    });
  }
  ,
  n.r = function (e) {
    typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: 'Module'
    }),
    Object.defineProperty(e, '__esModule', {
      value: !0
    });
  }
  ,
  n.t = function (e, t) {
    if (1 & t && (e = n(e)),
    8 & t) {
      return e;
    }
    if (4 & t && typeof e === 'object' && e && e.__esModule) return e;
    const i = Object.create(null);
    if (n.r(i),
    Object.defineProperty(i, 'default', {
      enumerable: !0,
      value: e
    }),
    2 & t && typeof e !== 'string') {
      for (const r in e) {
        n.d(i, r, ((t) => e[t])
          .bind(null, r));
      }
    }
    return i;
  }
  ,
  n.n = function (e) {
    const t = e && e.__esModule ? function () {
      return e.default;
    }
      : function () {
        return e;
      };
    return n.d(t, 'a', t),
    t;
  }
  ,
  n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  ,
  n.p = '',
  n(n.s = 131);
}([function (e, t, n) {
  e.exports = n(135);
},
function (e, t, n) {
  const i = n(87);
  n.d(t, 'a', (() => i.a
  )),
  n.d(t, 'b', (() => i.b
  )),
  n.d(t, 'c', (() => i.c
  )),
  n.d(t, 'd', (() => i.d
  )),
  n.d(t, 'e', (() => i.e
  )),
  n.d(t, 'f', (() => i.f
  )),
  n.d(t, 'g', (() => i.g
  )),
  n.d(t, 'h', (() => i.h
  ));
},
function (e, t, n) {
  n.d(t, 'w', (() => r
  )),
  n.d(t, 'e', (() => y
  )),
  n.d(t, 'b', (() => _
  )),
  n.d(t, 'o', (() => C
  )),
  n.d(t, 's', (() => S
  )),
  n.d(t, 'f', (() => E
  )),
  n.d(t, 'l', (() => k
  )),
  n.d(t, 'r', (() => O
  )),
  n.d(t, 'q', (() => P
  )),
  n.d(t, 'a', (() => N
  )),
  n.d(t, 'd', (() => I
  )),
  n.d(t, 'c', (() => A
  )),
  n.d(t, 'n', (() => j
  )),
  n.d(t, 'p', (() => R
  )),
  n.d(t, 'u', (() => D
  )),
  n.d(t, 'k', (() => F
  )),
  n.d(t, 't', (() => V
  )),
  n.d(t, 'm', (() => U
  )),
  n.d(t, 'i', (() => z
  )),
  n.d(t, 'v', (() => W
  )),
  n.d(t, 'g', (() => H
  )),
  n.d(t, 'h', (() => X
  )),
  n.d(t, 'j', (() => Y
  ));
  let i;
  var r = navigator.userAgent || navigator.swuserAgent;
  const a = r.match(/Ariver\/(\d+\.\d+\.\d+)/);
  const o = r.match(/Griver\/(\d+\.\d+\.\d+)/);
  const s = r.match(/DingMiniApp\/(\d+\.\d+\.\d+)/);
  const c = r.match(/AliApp\((\S*)/);
  const l = r.match(/AriverApp\((\S*)/);
  const u = r.match(/GriverApp\((\S*)/);
  const p = r.match(/TaurusApp\((\S*)/);
  const d = !!c && c.length === 2 && c[1].split('/') || !!l && l.length === 2 && l[1].split('/') || !!u && u.length === 2 && u[1].split('/') || !!p && p.length === 2 && p[1].split('/');
  const h = r.match(/VGUI\/(\d+\.\d+\.\d+)/);
  let f = ['', '0.0.0'];
  let m = 'unknown';
  const
    v = r.match(/Language\/(\S+)/);
  d ? (m = d[0],
  f = d[1].match(/(\d+\.\d+\.\d+)/),
  s && (i = f,
  f = s)) : o && (m = 'Griver',
  f = o);
  let g;
  const b = f[1].split('.')
    .map(((e) => Number(e)
    ));
  var y = m;
  var _ = 1e6 * b[0] + 1e3 * b[1] + b[2];
  const w = r.indexOf('InsidePlus') > -1;
  var C = r.toLowerCase()
    .indexOf('dingtalk') > -1 && !w;
  const x = r.indexOf('Windows') > -1;
  const T = r.indexOf('Macintosh') > -1;
  var S = x || T;
  var E = f && f[1];
  var k = (i && i[1],
  r.indexOf('Android') > -1);
  var O = !!r.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var P = r.indexOf('AlipayIDE') > -1;
  var N = '1.25.7';
  var I = '1-21 16:41:21';
  var A = '6cd685b8';
  var j = !!a;
  var R = (v && v[1],
  r.indexOf('Language/en') > -1);
  var D = r.indexOf('Language/zh-HK') > -1;
  const M = {};
  const
    L = {};

  function F() {
    if (void 0 !== g) return g;
    const e = r.match(/UCBS\/(\d+\.\d+)/);
    return g = e && e[1] || '';
  }

  var V = !!F();
  var U = k && !V;

  function B(e) {
    if (L[e]) return L[e];
    for (var t = [], n = e.split('.'), i = 0; i < n.length; i++) t.push(parseInt(n[i], 10));
    return L[e] = t,
    t;
  }

  function z(e, t) {
    if (e && t) {
      const n = `${e}__${t}`;
      if (n in M) return M[n];
      e = B(e),
      t = B(t);
      for (var i, r, a = 0; a < e.length; a++) {
        if ((i = t[a] || 0) > (r = e[a] || 0)) {
          M[n] = -1;
          break;
        }
        if (i < r) {
          M[n] = 1;
          break;
        }
      }
      return M[n] = M[n] || 0,
      M[n];
    }
    return 0;
  }

  function W() {
    console.log(`${y.toLocaleLowerCase()}/SDKVersion: ${N}`);
  }

  function H(e) {
    return z(E, e);
  }

  function X(e) {
    return F() ? z(F(), e) : -1;
  }

  var Y = !!h;
},
function (e, t) {
  function n() {
    return e.exports = n = Object.assign || function (e) {
      for (let t = 1; t < arguments.length; t++) {
        const n = arguments[t];
        for (const i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
      }
      return e;
    }
    ,
    n.apply(this, arguments);
  }

  e.exports = n;
},
function (e, t, n) {
  n.r(t),
  n.d(t, 'EInsideFeature', (() => i
  )),
  n.d(t, 'isFeatureAvailable', (() => c
  )),
  n.d(t, 'isFeatureAvailableWithDefault', (() => l
  )),
  n.d(t, 'isUnimplementedComponent', (() => p
  )),
  n.d(t, 'isUnimplementedAPI', (() => d
  )),
  n.d(t, 'isExpressionForUnimplementedAPIConfig', (() => h
  )),
  n.d(t, 'isAvailable', (() => f
  )),
  n.d(t, 'trackerPluginType', (() => v
  )),
  n.d(t, 'isNativeComponent', (() => b
  )),
  n.d(t, 'isNativeComponentForLyra', (() => y
  )),
  n.d(t, 'ExtSDKVersion', (() => _
  )),
  n.d(t, 'ExtBuildTime', (() => w
  )),
  n.d(t, 'ExtBuildCommit', (() => C
  )),
  n.d(t, 'addUnimplementedAPI', (() => T
  ));
  let i;
  const r = n(2);
  const a = n(99);
  const o = n(1);
  const
    s = n(10);

  function c(e) {
    const t = s.h[e];
    return !1 === t || !0 === t ? t : typeof t === 'number' && r.b >= t;
  }

  function l(e, t) {
    return void 0 !== s.h[e] ? c(e) : t;
  }

  function u(e) {
    return e({
      version: r.b,
      platform: r.r ? 'ios' : r.l ? 'android' : 'unknown',
      startupParams: Object(o.g)()
    });
  }

  function p(e) {
    const t = s.k[e];
    return void 0 !== t && (!0 === t || (typeof t === 'number' ? r.b < t : !(!t || typeof t !== 'function') && u(t)));
  }

  function d(e) {
    const t = s.j[e];
    return void 0 !== t && (!0 === t || (typeof t === 'number' ? r.b < t : !(!t || typeof t !== 'function') && u(t)));
  }

  function h(e) {
    return typeof s.j[e] === 'function';
  }

  function f(e) {
    return void 0 === e || (!1 === e || !0 === e ? e : typeof e === 'number' ? r.b >= e : typeof e === 'string' && e.split('.').length === 3 ? Object(r.i)(r.f, e) >= 0 : !(!e || typeof e !== 'function') && u(e));
  }

  !(function (e) {
    e.a_getVerifyEnvData_24_7 = 'a_getVerifyEnvData_24_7',
    e.a_startVerifyIdentity_24_7 = 'a_startVerifyIdentity_24_7',
    e.c_floatingModeUseUserPassedValue_24_7 = 'c_floatingModeUseUserPassedValue_24_7';
  }(i || (i = {})));
  let m;
  var v = s.a.trackerPluginType || a.a.inside;
  const g = {};
  var b = function () {
    return void 0 === m && (m = r.r || !!Object(r.k)() || c('f_androidSystemEmbedView_23_0') || r.s && c('f_pc_inPageRenderType_2_7_10')),
    m;
  };
  var y = function (e) {
    if (!1 === b()) return !1;
    if (void 0 !== g[e]) return g[e];
    const t = Object(o.g)().LyraNativeComponentList;
    return Array.isArray(t) ? g[e] = t.indexOf(e) > -1 : g[e] = !0,
    g[e];
  };
  var _ = s.f;
  var w = s.e;
  var C = s.d;
  const
    x = l('f_useGetterForUnimplementedApiWithFunctionConfig_24_8', !1);

  function T(e, t, n) {
    let i;
    let r;
    let
      a;
    h(t) && x ? (i = void 0,
    r = void 0,
    a = !1,
    Object.defineProperty(e, t, {
      enumerable: !0,
      configurable: !0,
      get() {
        return void 0 === r && !1 === a && (r = d(t),
        i = r ? void 0 : n),
        i;
      },
      set(e) {
        i = e,
        a = !0;
      }
    })) : e[t] = n;
  }
},
function (e, t, n) {
  const i = n(0);
  const r = n(138);
  if (void 0 === i) throw Error('create-react-class could not find the React object. If you are using script tags, make sure that React is being loaded before create-react-class.');
  const a = (new i.Component()).updater;
  e.exports = r(i.Component, i.isValidElement, a);
},
function (e, t, n) {
  function i(e, t, n) {
    const i = self;
    const r = i.AlipayJSBridge;

    function a(i) {
      i && i.error && (e === 'internalAPI' ? t && t.method !== 'onAppPerfEvent' && console.error(`callInternalAPI error: ${t.method}`, t, i) : console.error(`callBridge error: ${e}`, t, i)),
      n && n(i);
    }

    r ? r.call(e, t, a) : document.addEventListener('AlipayJSBridgeReady', (() => {
      i.AlipayJSBridge.call(e, t, a);
    }
    ));
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  n.d(t, 'b', (() => o
  )),
  n.d(t, 'a', (() => s
  ));
  const i = n(3);
  const r = n.n(i);
  const a = function () {
  };
  var o = {
    now() {
      return Date.now();
    },
    getStartupParams: a,
    beforeRegisterWorker: a,
    getWorkerUrl(e) {
      return e;
    },
    onInitMessageChannel: a,
    onSystemWorkerError: a,
    onPageNotFoundEvent: a,
    onRegisterWorkerReady: a,
    onRegisterWorkerSuccess: a,
    onRegisterWorkerFail: a,
    onPageRender: a,
    ViewMixins: []
  };

  function s(e) {
    r()(o, e);
  }
},
function (e, t, n) {
  const i = n(45);
  t.a = i.a;
},
function (e, t, n) {
  n.r(t);
  const i = n(17);
  t.default = i.a;
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  )),
  n.d(t, 'h', (() => o
  )),
  n.d(t, 'k', (() => s
  )),
  n.d(t, 'j', (() => c
  )),
  n.d(t, 'b', (() => l
  )),
  n.d(t, 'c', (() => u
  )),
  n.d(t, 'i', (() => p
  )),
  n.d(t, 'f', (() => d
  )),
  n.d(t, 'e', (() => h
  )),
  n.d(t, 'd', (() => f
  )),
  n.d(t, 'l', (() => v
  )),
  n.d(t, 'g', (() => S
  ));
  const i = self;

  function r(e) {
    return e.substring(0, 1)
      .toUpperCase() + e.substring(1);
  }

  var a = i._AppXBasicCfg || {
    clientName: 'ap',
    trackerPluginType: 'inside',
    noUseInternalAPI: !1
  };
  var o = i._AppXFeatures || {
    'c_lottie_downgrade-level_22_0': 10001078,
    'c_map_enable-satellite_22_0': 10001078,
    c_map_onPoiTap_22_0: 10001078,
    f_tinyAppConfig_merge_23_0: 10001080,
    f_androidSystemEmbedView_23_0: 10001080,
    c_map_panels_23_0: 10001080,
    c_map_onMarkerTap_23_0: 10001080,
    c_lottie_scene_23_0: 10001080,
    'c_camera_output-dimension_23_0': 10001080,
    'c_rtc-room_23_0': 10001080,
    c_video_onQualityList_23_0: 10001082,
    a_tabbarAPI_23_0: 10001080,
    a_lottieContext_getLottieInfo_23_0: 10001080,
    a_mapContext_changeMarkers_23_0: 10001080,
    a_audioInterruption_23_0: 10001080,
    'c_live-player_extra-info_23_0': 10001082,
    a_videoContext_quality_23_0: 10001082,
    a_getWifiBroadcastInfo_23_0: 10001082,
    a_udpSocket_23_0: 10001082,
    a_tcpSocket_23_0: 10001082,
    a_showAuthenticDialog_23_0: 10001082,
    a_donateInBrowser_23_0: !0,
    f_plugin_23_0: 10001080,
    f_snapshot_23_0: !0,
    f_renderDebugger_23_0: !0,
    f_promotionModal_23_0: !0,
    f_cloudService_23_0: !0,
    a_colorScheme_23_0: !1,
    c_swiper_adjustVerticalHeight_23_0: !1,
    f_page_onKeyboardShowOrHide_23_2: !1,
    f_tracker_enableUTChannel_23_4: !1,
    a_rtc_room_context_sendMessage_23_5: 10001088,
    c_rtc_room_onReceiveMessage_23_5: 10001088,
    a_fontSizeSetting_24_3: !1,
    a_getVerifyEnvData_24_7: !0,
    a_startVerifyIdentity_24_7: !0,
    c_floatingModeUseUserPassedValue_24_7: 10001098,
    a_gyroscope_24_7: 10001098,
    a_accelerometer_24_7: 10001098,
    a_compass_24_7: 10001098
  };
  var s = i._AppXToImplementComponents || {};
  var c = i._AppXToImplementAPIs || {};
  var l = (i._AppXApis,
  i._AppXApisCfg,
  i._AppXCustomApis,
  i._AppXCustomApisCfg,
  i._AppXCustomNativeComponents || {});
  var u = i._AppXCustomWebComponents || {};
  var p = i._AppXFns || {};
  var d = `${i._AppXExtVersion || ''}`;
  var h = `${i._AppXExtBuildTime || ''}`;
  var f = `${i._AppXExtBuildCommit || ''}`;
  const m = {};
  var v = {};
  const g = i.CLIENT_EXTEND_CONFIG && i.CLIENT_EXTEND_CONFIG.apis || [];
  if (g.length > 0) {
    for (let b = 0; b < g.length; b++) {
      const y = g[b] || {};
      const _ = y.type;
      const w = y.name;
      const C = y.namespace;
      const x = y.cmd;
      if (typeof w === 'string' && w !== '') {
        const T = {};
        C && (T.ns = C),
        x && (T.m = x),
        _ === 'event' ? (m[`on${r(w)}`] = T,
        m[`off${r(w)}`] = T) : _ === 'invoke' && (m[w] = T),
        C && ['invoke', 'event'].indexOf(_) > -1 && !v[C] && (v[C] = 1);
      }
    }
  }
  var S = i._AppXExtraComponents || {
    'add-to-home': {
      appId: '63300062',
      renderType: 'createPortal'
    },
    'common-extra': {},
    'focus-on-fortune': {
      appId: '63300084'
    },
    'life-follow': {
      appId: '63300166'
    },
    mkt: {
      appId: '63300143'
    },
    spread: {
      appId: '63300065'
    },
    ucdp: {
      appId: '63300165'
    },
    webp: {
      appId: '63300178'
    },
    'zm-credit-acceptance': {
      discard: !0
    },
    'zm-evaluation': {
      appId: '63300045'
    },
    'easy-member': {
      discard: !0
    },
    favorite: {
      discard: !0
    },
    'zm-credit-assessment': {
      appId: '63300162'
    },
    'bn-frame': {
      appId: '63300192',
      support: 10001082
    }
  };
  i._AppXFeatures && (i._AppXFeatures = void 0),
  i._AppXBasicCfg && (i._AppXBasicCfg = void 0),
  i._AppXToImplementComponents && (i._AppXToImplementComponents = void 0),
  i._AppXToImplementAPIs && (i._AppXToImplementAPIs = void 0),
  i._AppXApis && (i._AppXApis = void 0),
  i._AppXApisCfg && (i._AppXApisCfg = void 0),
  i._AppXCustomApis && (i._AppXCustomApis = void 0),
  i._AppXCustomApisCfg && (i._AppXCustomApisCfg = void 0),
  i._AppXCustomNativeComponents && (i._AppXCustomNativeComponents = void 0),
  i._AppXCustomWebComponents && (i._AppXCustomWebComponents = void 0),
  i._AppXExtraComponents && (i._AppXExtraComponents = void 0),
  i._AppXExtVersion && (i._AppXExtVersion = void 0),
  i._AppXExtBuildTime && (i._AppXExtBuildTime = void 0),
  i._AppXExtBuildCommit && (i._AppXExtBuildCommit = void 0);
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  ));
  const i = n(6);
  const r = !!n(10).a.noUseInternalAPI;

  function a(e, t, n) {
    if (void 0 === t && (t = {}),
    r) {
      Object(i.a)(e, t, n);
    } else {
      const a = {
        method: e,
        param: t
      };
      'viewId' in t && (a.viewId = t.viewId),
      Object(i.a)('internalAPI', a, n);
    }
  }
},
function (e, t, n) {
  const i = n(82);
  t.a = i.a;
},
function (e, t, n) {
  n.d(t, 't', (() => i
  )),
  n.d(t, 'q', (() => r
  )),
  n.d(t, 'n', (() => a
  )),
  n.d(t, 'o', (() => o
  )),
  n.d(t, 'p', (() => s
  )),
  n.d(t, 's', (() => c
  )),
  n.d(t, 'r', (() => l
  )),
  n.d(t, 'h', (() => u
  )),
  n.d(t, 'i', (() => p
  )),
  n.d(t, 'k', (() => d
  )),
  n.d(t, 'j', (() => h
  )),
  n.d(t, 'm', (() => f
  )),
  n.d(t, 'l', (() => m
  )),
  n.d(t, 'b', (() => v
  )),
  n.d(t, 'c', (() => g
  )),
  n.d(t, 'a', (() => b
  )),
  n.d(t, 'e', (() => y
  )),
  n.d(t, 'd', (() => _
  )),
  n.d(t, 'g', (() => w
  )),
  n.d(t, 'f', (() => C
  ));
  var i = !1;
  var r = i ? 'pendingKeyType' : 't';
  var a = i ? 'PendingKeyComponentId' : 'i';
  var o = i ? 'PendingKeyData' : 'd';
  var s = i ? 'PendingKeyOp' : 'o';
  var c = i ? 'PendingValuePage' : 1;
  var l = i ? 'PendingValueComponent' : 2;
  var u = i ? 'OpSet' : 1;
  var p = i ? 'OpSplice' : 2;
  var d = i ? 'PayloadKeyNativeComponents' : 'n';
  var h = i ? 'PayloadKeyMountedComponents' : 'm';
  var f = i ? 'PayloadKeyUnmountedComponents' : 'u';
  var m = i ? 'PayloadKeyPagePerf' : 'p';
  var v = i ? 'ComponentKeyId' : 'i';
  var g = i ? 'ComponentKeyIs' : 's';
  var b = i ? 'ComponentKeyDiffProps' : 'd';
  var y = i ? 'ComponentKeyOwnerId' : 'o';
  var _ = i ? 'ComponentKeyName' : 'n';
  var w = i ? 'DiffKeyUpdated' : 'u';
  var C = i ? 'DiffKeyDeleted' : 'e';
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  )),
  n.d(t, 'g', (() => s
  )),
  n.d(t, 'd', (() => c
  )),
  n.d(t, 'f', (() => l
  )),
  n.d(t, 'b', (() => u
  )),
  n.d(t, 'c', (() => p
  )),
  n.d(t, 'e', (() => d
  ));
  const i = n(104);
  n(69),
  n(72),
  n(66),
  n(49);

  function r(e) {
    const t = e.stylesheet;
    return o.stylesheet = t,
    o;
  }

  let a;
  var
    o = {
      getCurrentPageImpl: c
    };

  function s(e) {
    a = e;
  }

  function c() {
    return a;
  }

  function l() {
    return [a];
  }

  function u() {
    return o;
  }

  function p() {
    return o;
  }

  function d() {
    return null;
  }

  Object(i.b)(o);
},
function (e, t, n) {
  n.d(t, 'b', (() => r
  )),
  n.d(t, 'a', (() => a
  ));
  const i = n(41);

  function r() {
    let e;
    Object(i.a)() && (e = console).log.apply(e, arguments);
  }

  function a(e) {
    if (Object(i.d)(e)) {
      for (var t, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), a = 1; a < n; a++) r[a - 1] = arguments[a];
      (t = console).log.apply(t, [`[${e}]`].concat(r));
    }
  }
},
function (e, t, n) {
  n.d(t, 'd', (() => h
  )),
  n.d(t, 'c', (() => f
  )),
  n.d(t, 'e', (() => m
  )),
  n.d(t, 'a', (() => v
  )),
  n.d(t, 'b', (() => g
  )),
  n.d(t, 'f', (() => b
  ));
  const i = n(3);
  const r = n.n(i);
  const a = n(23);
  const o = n.n(a);
  const s = n(45);

  function c(e) {
    return void 0 === e && (e = []),
    [].slice.call(e, 0)
      .map(((e) => ({
        clientX: e.clientX,
        clientY: e.clientY,
        identifier: e.identifier,
        pageX: e.pageX,
        pageY: e.pageY
      })
      ));
  }

  function l(e) {
    const t = {};
    return e && ('pageX' in (e = e.nativeEvent || e.detail || e) && (t.pageX = e.pageX,
    t.pageY = e.pageY),
    'clientX' in e ? (t.clientX = e.clientX,
    t.clientY = e.clientY) : 'pageX' in t && (t.clientX = t.pageX - window.pageXOffset,
    t.clientY = t.pageY - window.pageYOffset)),
    {
      detail: t
    };
  }

  function u(e, t, n, i) {
    let a;
    const o = t.charAt(0)
      .toUpperCase() + t.slice(1);
    const
      s = e.props[`catch${o}`];

    function c() {
      return a || ((a = e.props.$appx.getNormalizedEvent({
        eventType: t,
        srcEvent: n
      }, i)).currentTarget = r()({}, a.currentTarget, e.getTargetForEvent()),
      a);
    }

    if (s && n.stopPropagation) {
      return n.stopPropagation(),
      void (typeof s === 'function' && s(c()));
    }
    const l = e.props[`on${o}`];
    typeof l === 'function' && l(c());
  }

  function p(e) {
    e.detachScrollEvent && (e.detachScrollEvent.remove(),
    e.detachScrollEvent = null);
  }

  function d(e) {
    return e.disableScroll;
  }

  function h(e) {
    const t = void 0 === e ? {} : e;
    const n = t.createTap;
    const i = void 0 === n ? l : n;
    const r = t.shouldIgnore;
    return {
      componentDidMount() {
        this.checkTapEvents();
      },
      componentDidUpdate() {
        this.checkTapEvents();
      },
      componentWillUnmount() {
        this.tapEvent && (this.tapEvent = this.tapEvent.remove());
      },
      checkTapEvents() {
        r && r(this.props) ? this.tapEvent && (this.tapEvent = this.tapEvent.remove()) : this.root && !this.tapEvent && (this.tapEvent = Object(s.a)(this.root, {
          tap: this.onTap
        }));
      },
      onTap(e) {
        this.props.disabled || (this.recordTarget(e),
        this.hasBubbleEvent('Tap') && u(this, 'tap', e, i && i.call(this, e, l)));
      }
    };
  }

  function f(e) {
    const t = void 0 === e ? {} : e;
    const n = t.createTap;
    const i = void 0 === n ? l : n;
    const r = t.shouldIgnore;
    return {
      componentDidMount() {
        this.checkLongTapEvents();
      },
      componentDidUpdate() {
        this.checkLongTapEvents();
      },
      componentWillUnmount() {
        this.longTapEvent && (this.longTapEvent = this.longTapEvent.remove());
      },
      checkLongTapEvents() {
        r && r(this.props) ? this.longTapEvent && (this.longTapEvent = this.longTapEvent.remove()) : this.root && !this.longTapEvent && (this.longTapEvent = Object(s.a)(this.root, {
          longtap: this.onLongTap
        }));
      },
      onLongTap(e) {
        this.recordTarget(e),
        this.hasBubbleEvent('LongTap') && u(this, 'longTap', e, i && i.call(this, e, l));
      }
    };
  }

  function m(e) {
    const t = (void 0 === e ? {} : e).createTouchList;
    const n = void 0 === t ? c : t;
    return {
      onTouchStart(e) {
        this.recordTarget(e),
        this.onHoverTouchStart && this.onHoverTouchStart(e),
        this.hasBubbleEvent('TouchStart') && u(this, 'touchStart', e, {
          touches: n.call(this, e.touches),
          changedTouches: n.call(this, e.changedTouches)
        });
      },
      onTouchMove(e) {
        this.recordTarget(e),
        this.hasBubbleEvent('TouchMove') && u(this, 'touchMove', e, {
          touches: n.call(this, e.touches),
          changedTouches: n.call(this, e.changedTouches)
        });
      },
      onTouchEnd(e) {
        this.recordTarget(e),
        this.onHoverTouchEnd && this.onHoverTouchEnd(),
        this.hasBubbleEvent('TouchEnd') && u(this, 'touchEnd', e, {
          touches: n.call(this, e.touches),
          changedTouches: n.call(this, e.changedTouches)
        });
      },
      onTouchCancel(e) {
        this.recordTarget(e),
        this.onHoverTouchCancel && this.onHoverTouchCancel(),
        this.hasBubbleEvent('TouchCancel') && u(this, 'touchCancel', e, {
          touches: n.call(this, e.touches),
          changedTouches: n.call(this, e.changedTouches)
        });
      }
    };
  }

  function v() {
    return {
      onTransitionEnd(e) {
        this.recordTarget(e),
        this.hasBubbleEvent('TransitionEnd') && u(this, 'transitionEnd', e, {
          detail: {
            elapsedTime: e.elapsedTime,
            propertyName: e.propertyName
          }
        });
      },
      onAnimationStart(e) {
        this.recordTarget(e),
        this.hasBubbleEvent('AnimationStart') && u(this, 'animationStart', e, {
          detail: {
            elapsedTime: e.elapsedTime,
            animationName: e.animationName
          }
        });
      },
      onAnimationIteration(e) {
        this.recordTarget(e),
        this.hasBubbleEvent('AnimationIteration') && u(this, 'animationIteration', e, {
          detail: {
            elapsedTime: e.elapsedTime,
            animationName: e.animationName
          }
        });
      },
      onAnimationEnd(e) {
        this.recordTarget(e),
        this.hasBubbleEvent('AnimationEnd') && u(this, 'animationEnd', e, {
          detail: {
            elapsedTime: e.elapsedTime,
            animationName: e.animationName
          }
        });
      }
    };
  }

  function g() {
    return {
      componentDidUpdate(e) {
        const t = this.props.hoverClass;
        e.hoverClass !== t && (this.needHandleHover = this.hoverRoot && t !== 'none',
        this.needHandleHover || this.hoverReset());
      },
      checkNeedHandleHover() {
        return void 0 === this.needHandleHover && (this.needHandleHover = this.hoverRoot && this.props.hoverClass !== 'none'),
        this.needHandleHover;
      },
      getDefaultClassList() {
        const e = this.props.className;
        if (this.defaultClass !== e) {
          this.defaultClass = e;
          const t = (`${e}`).trim();
          t.length > 0 ? this.defaultClassList = t.split(/\s+/) : this.defaultClassList = [];
        }
        return this.defaultClassList || [];
      },
      getHoverClassList() {
        const e = this.props.hoverClass;
        if (this.hoverClass !== e) {
          this.hoverClass = e;
          const t = (`${e}`).trim();
          t.length > 0 ? this.hoverClassList = t.split(/\s+/) : this.hoverClassList = [];
        }
        return this.hoverClassList || [];
      },
      onHoverTouchStart(e) {
        const t = this;
        const n = e.nativeEvent || e;
        if (this.checkNeedHandleHover()) {
          const i = this.props;
          const r = i.hoverStopPropagation;
          const a = i.hoverClass;
          const o = i.hoverStartTime;
          const s = i.disabled;
          n._hoverPropagationStopped || (r && (n._hoverPropagationStopped = !0),
          this.hoverTouch = !0,
          s || a === 'none' || n.touches.length !== 1 || (this.hoverTimerId = setTimeout((() => {
            if (t.hoverRoot) {
              t.hovering = !0;
              for (let e = t.getHoverClassList(), n = 0; n < e.length; n++) {
                const i = e[n];
                t.hoverRoot.classList.add(i);
              }
            }
          }
          ), o)));
        }
      },
      onHoverTouchEnd() {
        const e = this;
        if (this.hoverTouch) {
          const t = this.props.hoverStayTime;
          this.hoverTouch = !1,
          clearTimeout(this.hoverTimerId),
          this.hoverTimerId = null,
          this.hovering && window.requestAnimationFrame((() => {
            e.hovering && setTimeout((() => {
              e.hoverReset();
            }
            ), t);
          }
          ));
        }
      },
      onHoverTouchCancel() {
        this.hoverTouch && (this.hoverTouch = !1,
        clearTimeout(this.hoverTimerId),
        this.hoverTimerId = null,
        this.hoverReset());
      },
      hoverReset() {
        if (this.hovering) {
          const e = this.props.hoverClass;
          this.hovering = !1;
          const t = this.getDefaultClassList();
          if (this.hoverClassList && this.hoverClassList.length > 0 && this.hoverRoot) {
            for (let n = 0, i = this.hoverClassList; n < i.length; n++) {
              const r = i[n];
              t.indexOf(r) < 0 && this.hoverRoot.classList.remove(r);
            }
          }
          if (this.hoverClass === e) return;
          const a = this.getHoverClassList();
          if (e !== 'none' && a.length > 0 && this.hoverRoot) {
            for (let o = 0; o < a.length; o++) {
              const s = a[o];
              t.indexOf(s) < 0 && this.hoverRoot.classList.remove(s);
            }
          }
        }
      }
    };
  }

  function b(e) {
    const t = (void 0 === e ? {} : e).isDisableScroll;
    const n = void 0 === t ? d : t;
    return {
      componentDidMount() {
        this.__basicEventRoot = this.root || o.a.findDOMNode(this),
        this.__attachBasicEventMixinScroll();
      },
      componentDidUpdate() {
        this.__attachBasicEventMixinScroll();
      },
      componentWillUnmount() {
        p(this);
      },
      __attachBasicEventMixinScroll() {
        const e = n(this.props);
        const t = this.detachScrollEvent;
        if (this.__basicEventRoot) {
          return !e && t ? p(this) : void (!e || t || (this.detachScrollEvent = Object(s.a)(this.__basicEventRoot, {
            touchmove(e) {
              e.preventDefault();
            }
          })));
        }
      },
      recordTarget(e) {
        const t = e && (e.nativeEvent || e.detail && e.detail.nativeEvent);
        t && !t.$target && (t.$target = this.getTargetForEvent());
      },
      getTargetForEvent() {
        const e = this.props;
        const t = this.__basicEventRoot;
        return r()({}, e.$appx.getTargetForEvent(), {
          offsetLeft: t.offsetLeft,
          offsetTop: t.offsetTop
        });
      },
      hasBubbleEvent(e) {
        return this.props[`on${e}`] || this.props[`catch${e}`];
      }
    };
  }
},
function (e, t, n) {
  function i(e) {
    return e && typeof e === 'object' ? Object.keys(e) : [];
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  n(3);
  const i = n(24);
  const r = self;
  const a = {
    __modules: {}
  };
  const o = {
    get() {
      return r.appXPluginsConfig ? r.appXPluginsConfig : a;
    }
  };
  const s = n(43);
  const c = n(78);

  function l() {
    return null;
  }

  const u = n(15);
  n(51);
  n.d(t, 'g', (() => d
  )),
  n.d(t, 'a', (() => h
  )),
  n.d(t, 'b', (() => m
  )),
  n.d(t, 'f', (() => v
  )),
  n.d(t, 'h', (() => g
  )),
  n.d(t, 'i', (() => _
  )),
  n.d(t, 'c', (() => w
  )),
  n.d(t, 'e', (() => k
  )),
  n.d(t, 'd', (() => O
  ));
  const p = void 0 !== c.a;

  function d(e, t) {
    return `p-${e}-${t}`;
  }

  var h = 'dynamic-plugin://';
  const f = 'plugin://';
  var m = 'plugin-private://';

  function v(e, t) {
    return `${m}${e}/${t}`;
  }

  function g(e) {
    return Object(i.a)(e, f) || Object(i.a)(e, m);
  }

  function b(e) {
    const t = Object(s.c)();
    if (t && t[e]) return t[e].provider;
    console.error(`can not find plugin ${e}`);
  }

  function y(e) {
    return C(b(e));
  }

  function _(e, t) {
    const n = (void 0 === t ? {} : t).isPage;
    const r = void 0 === n || n;
    if (Object(i.a)(e, f)) {
      const a = e.match(/^plugin:\/\/([^\/]+)\/(.*)/);
      const o = a && a[1];
      const s = a && a[2];
      const c = r ? (function (e, t) {
        return I(y(e), t, e);
      }(o, s)) : (function (e, t) {
        return N(y(e), t, e);
      }(o, s));
      return c ? v(b(o), c) : e;
    }
    if (Object(i.a)(e, h)) {
      const l = e.match(/^dynamic-plugin:\/\/([^\/]+)\/(.*)/);
      const u = l && l[1];
      const p = l && l[2];
      const d = r ? O(u, p) : P(u, p);
      return d ? v(u, d) : e;
    }
    return e;
  }

  function w(e) {
    const t = e.match(/^plugin:\/\/([^\/]+)\/(.*)/);
    const n = t && t[1];
    if (n && !y(n)) {
      return p && console.error(`插件 ${n} 不存在!`),
      l;
    }
  }

  function C(e) {
    const t = o.get();
    return Object(u.a)('framework', 'getPlugin', t, e),
    t[e];
  }

  const x = {};
  const T = {};
  const S = {};
  const E = {};

  function k(e) {
    if (e in x) return x[e];
    if (Object(i.a)(e, h)) {
      x[e] = _(e, {
        isPage: !1
      });
    } else {
      const t = e.match(/^([^\/]+)\/(.*)/);
      if (t) {
        const n = t[1];
        const r = P(n, t[2]);
        r && (x[e] = v(n, r));
      }
    }
    return x[e];
  }

  function O(e, t) {
    return I(C(e), t, e);
  }

  function P(e, t) {
    return N(C(e), t, e);
  }

  function N(e, t, n) {
    if (e) {
      return e.publicComponents && e.publicComponents[t] ? e.publicComponents[t] : void (S[`${n}-${t}`] || (S[`${n}-${t}`] = 1,
      console.error(`plugin ${n} does not have publicComponents ${t}`)));
    }
    T[`${n}`] || (T[`${n}`] = 1,
    console.error(`plugin ${n} does not exists!`));
  }

  function I(e, t, n) {
    if (e) {
      return e.publicPages && e.publicPages[t] ? e.publicPages[t] : void (E[`${n}-${t}`] || (E[`${n}-${t}`] = 1,
      console.error(`plugin ${n} does not have public page ${t}`)));
    }
    T[`${n}`] || (T[`${n}`] = 1,
    console.error(`plugin ${n} does not exists!`));
  }
},
function (e, t, n) {
  const i = n(68);
  t.a = new i.a();
},
function (e, t, n) {
  n.d(t, 'b', (() => d
  )),
  n.d(t, 'a', (() => h
  )),
  n.d(t, 'c', (() => b
  ));
  const i = n(1);
  const r = n(6);
  const a = n(2);
  const o = n(38);
  const s = n(59);
  const c = n(39);
  const l = n(109);
  const u = n(30);
  let p = null;

  function d() {
    if (p == null) {
      const e = Object(i.g)().auto_behavior_switch;
      p = void 0 === e || e;
    }
    return p;
  }

  function h(e) {
    let t;
    let n;
    let o;
    let u;
    let p;
    let d;
    let h;
    let f;
    let m;
    let v;
    let g;
    let b;
    let
      y;
    Object(r.a)('remoteLog', {
      type: 'behavior',
      seedId: 'tinyapp-auto',
      actionId: e,
      bizType: Object(l.a)(),
      param4: (t = Object(i.g)(),
      n = t.appId,
      o = t.app_startup_type,
      u = void 0 === o ? '' : o,
      p = t.chInfo,
      d = void 0 === p ? '' : p,
      h = t.cdpchinfo,
      f = void 0 === h ? '' : h,
      m = t.scm,
      v = void 0 === m ? '' : m,
      g = t.appx_scm_data,
      b = void 0 === g ? '' : g,
      y = {
        appId: n,
        app_startup_type: u,
        chInfo: d,
        cdpchinfo: f,
        scm: v,
        SDKVersion: a.a,
        appx_scm_data: b,
        pagePath: Object(i.e)()
          .getPagePath(),
        appx_page_token: Object(s.a)()
      },
      Object(c.a)(y))
    });
  }

  const f = 5;
  let m = 0;

  function v(e) {
    return !(!e || !e.props || typeof e.props.catchTap !== 'function');
  }

  const g = Object(o.a)((() => {
    m++,
    h('clicked');
  }
  ), 300, {
    trailing: !1
  });

  function b(e, t, n, i) {
    n = n != null ? n : (function (e) {
      return !(!e || !e.props || typeof e.props.onTap !== 'function' && typeof e.props.catchTap !== 'function');
    }(e)),
    t || u.b.logClick(e, {
      clickable: n,
      isCaught: i != null ? i : v(e)
    }),
    m >= f || !d() || n && g();
  }
},
function (e, t, n) {
  let i;
  /*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
  !(function () {
    const n = {}.hasOwnProperty;

    function r() {
      for (var e = [], t = 0; t < arguments.length; t++) {
        const i = arguments[t];
        if (i) {
          const a = typeof i;
          if (a === 'string' || a === 'number') {
            e.push(i);
          } else if (Array.isArray(i) && i.length) {
            const o = r.apply(null, i);
            o && e.push(o);
          } else if (a === 'object') for (const s in i) n.call(i, s) && i[s] && e.push(s);
        }
      }
      return e.join(' ');
    }

    e.exports ? (r.default = r,
    e.exports = r) : void 0 === (i = function () {
      return r;
    }
      .apply(t, [])) || (e.exports = i);
  }());
},
function (e, t, n) {
  const i = n(0);
  const r = n.n(i);
  const a = n(2);
  const o = n(8);
  const s = n(6);
  const c = {};
  const l = {};
  t.a = {
    getId() {
      if (this.id) return this.id;
      if (void 0 !== this.props.id) {
        this.id = this.props.id;
      } else {
        const e = this.constructor.displayName;
        c[e] || (c[e] = {
          id: 0
        }),
        this.id = `appx_${e}_${c[e].id}`,
        c[e].id = c[e].id + 1;
      }
      return this.id;
    },
    onDidMountForNative() {
      a.l && a.t && !l[this.getId()] ? (this.readyForRender = !1,
      this.detachNativeReady = Object(o.a)(document, {
        'nbcomponent.canrender': this.onNativeReady
      })) : (this.readyForRender = !0,
      this.renderNativeComponent('mount'));
    },
    componentWillUnmount() {
      this.detachNativeReady && (this.detachNativeReady.remove(),
      this.detachNativeReady = null),
      this.nativeEvents && (this.nativeEvents.remove(),
      this.nativeEvents = null),
      (this.useNative && a.r || a.q || a.m) && Object(s.a)('NBComponent.remove', {
        element: this.getId()
      });
    },
    onNativeReady(e) {
      e && e.elementid !== this.getId() || (this.readyForRender = !0,
      l[this.getId()] = !0,
      this.renderNativeComponent('mount'));
    },
    clearRenderDelay() {
      this.detachNativeReady && (this.detachNativeReady.remove(),
      this.detachNativeReady = null);
    },
    getUnsupportJSX() {
      const e = this.props;
      const t = e.className;
      const n = e.style;
      const i = e.id;
      return r.a.createElement('div', {
        className: t,
        style: n,
        id: i
      }, '当前环境不支持', this.constructor.displayName, '组件');
    }
  };
},
function (e, t, n) {
  !(function e() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE === 'function') {
      0;
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (e) {
        console.error(e);
      }
    }
  }()),
  e.exports = n(134);
},
function (e, t, n) {
  function i(e, t) {
    return !(!e || !t) && e.slice(0, t.length) === t;
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  let i;
  let r;
  let
    a;
  n.d(t, 'c', (() => i
  )),
  n.d(t, 'a', (() => r
  )),
  n.d(t, 'b', (() => a
  )),
  (function (e) {
    e.CLICK = 'click',
    e.SCROLL = 'scroll',
    e.INPUT = 'input',
    e.TOUCH = 'touch';
  }(i || (i = {}))),
  (function (e) {
    e.START = 'start',
    e.END = 'end';
  }(r || (r = {}))),
  (function (e) {
    e.TEXT = 'text',
    e.TEXTAREA = 'textarea',
    e.CHECKBOX = 'checkbox',
    e.RADIO = 'radio';
  }(a || (a = {})));
},
function (e, t, n) {
  const i = n(128);
  const r = n.n(i);
  const a = n(17);
  const o = n(15);
  const s = n(27);
  const c = n.n(s);
  const l = n(33);
  const u = (function () {
    function e(e) {
      this._manager = e;
    }

    return e.prototype._getAppId = function () {
      return Object(l.a)().appId;
    }
    ,
    e;
  }());
  const p = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    c()(t, e);
    const n = t.prototype;
    return n.checkConfig = function (e) {
      return !('appId' in e) || typeof e.appId === 'string' && e.appId !== '';
    }
    ,
    n.matchConfig = function (e) {
      return !(e.appIdReg && !e.appIdReg.test(this._getAppId()));
    }
    ,
    t;
  }(u));
  const d = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    c()(t, e);
    const n = t.prototype;
    return n.checkConfig = function (e) {
      return !('appIdBlackList' in e) || typeof e.appIdBlackList === 'string' && e.appIdBlackList !== '';
    }
    ,
    n.matchConfig = function (e) {
      return !e.appIdBlackListReg || !e.appIdBlackListReg.test(this._getAppId());
    }
    ,
    t;
  }(u));
  const h = {};
  const f = {};

  function m(e) {
    if (f[e]) return f[e];
    for (var t = [], n = e.split('.'), i = 0; i < n.length; i++) t.push(parseInt(n[i], 10));
    return f[e] = t,
    t;
  }

  function v(e, t) {
    if (e && t) {
      const n = `${e}__${t}`;
      if (n in h) return h[n];
      e = m(e),
      t = m(t);
      for (var i, r, a = 0; a < e.length; a++) {
        if ((i = t[a] || 0) > (r = e[a] || 0)) {
          h[n] = -1;
          break;
        }
        if (i < r) {
          h[n] = 1;
          break;
        }
      }
      return h[n] = h[n] || 0,
      h[n];
    }
    return 0;
  }

  const g = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    c()(t, e);
    const n = t.prototype;
    return n.checkConfig = function (e) {
      return !('version' in e && (!Array.isArray(e.version) || e.version.length !== 2));
    }
    ,
    n.matchConfig = function (e) {
      return !e.version || v(this._manager.getSDKVersion(), e.version[0]) !== -1 && v(this._manager.getSDKVersion(), e.version[1]) !== 1;
    }
    ,
    t;
  }(u));
  const b = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    c()(t, e);
    const n = t.prototype;
    return n.checkConfig = function (e) {
      return !('versionBlackList' in e && (!Array.isArray(e.versionBlackList) || e.versionBlackList.length !== 2));
    }
    ,
    n.matchConfig = function (e) {
      return !e.versionBlackList || v(this._manager.getSDKVersion(), e.versionBlackList[0]) === -1 || v(this._manager.getSDKVersion(), e.versionBlackList[1]) === 1;
    }
    ,
    t;
  }(u));
  const y = (function () {
    function e(e) {
      this._handle = e,
      this._inited = !1,
      this._keyMap = Object.create(null),
      this._rules = [],
      this._caches = {},
      this._missedDataCaches = {},
      this._stableDirtyKeyCaches = {},
      this._rules.push(new p(this)),
      this._rules.push(new d(this)),
      this._rules.push(new g(this)),
      this._rules.push(new b(this));
    }

    const t = e.prototype;
    return t._matchSwitchConfig = function (e) {
      for (let t = 0, n = this._rules; t < n.length; t++) {
        if (!n[t].matchConfig(e)) return !1;
      }
      return !0;
    }
    ,
    t._checkSwitchConfig = function (e) {
      if (!e) return !1;
      for (let t = 0, n = this._rules; t < n.length; t++) {
        if (!n[t].checkConfig(e)) return !1;
      }
      return 'value' in e;
    }
    ,
    t._formatParsingError = function (e, t, n, i) {
      void 0 === i && (i = '');
      const r = t ? `${e}.${t}` : e;
      const a = i instanceof Error ? i.message : `${i}`;
      return `"${r}" config parse error, config: ${typeof n === 'string' ? n : JSON.stringify(n)}${a ? `, error: ${a}` : ''}\n`;
    }
    ,
    t.setSDKVersion = function (e) {
      return this._SDKVersion = e,
      this;
    }
    ,
    t.getSDKVersion = function () {
      return this._SDKVersion;
    }
    ,
    t._getDirtyKeyCaches = function () {
      return this._stableDirtyKeyCaches;
    }
    ,
    t.getStableSwitch = function (e) {
      if (this._inited || (this._stableDirtyKeyCaches[e] = !0),
      !this._stableDirtyKeyCaches[e]) {
        return this.getSwitch(e, void 0);
      }
    }
    ,
    t.getSwitch = function (e, t) {
      if (this._inited && this._SDKVersion != null) {
        const n = this._caches[e];
        if (void 0 !== n) return n;
        if (this._missedDataCaches[e]) return t;
        const i = this._keyMap[e];
        if (!i || !i.length) {
          return this._missedDataCaches[e] = !0,
          t;
        }
        for (let r = 0; r < i.length; r++) {
          const a = i[r];
          if (a && this._matchSwitchConfig(a)) {
            return this._caches[e] = a.value,
            a.value;
          }
        }
        return this._missedDataCaches[e] = !0,
        t;
      }
    }
    ,
    t.clearCache = function () {
      this._caches = {},
      this._missedDataCaches = {};
    }
    ,
    t._init = function (e, t) {
      const n = this;
      t && typeof t === 'object' && (this._stableDirtyKeyCaches = t);
      let i = '';
      try {
        if (this._inited) throw new Error('manager had initialized');
        let r;
        Object(o.a)('framework', '[switch system] Initializing the switching system', e),
        r = e == null ? {} : typeof e === 'object' ? e : typeof e === 'string' ? JSON.parse(e) : {},
        Object(a.a)(r)
          .forEach(((e) => {
            try {
              if (r[e] === '') return void Object(o.a)('framework', `[switch system] "${e}" is not configured`);
              const t = JSON.parse(r[e]);
              Object(a.a)(t)
                .forEach(((r) => {
                  const a = t[r];
                  if (Array.isArray(a)) {
                    for (let o = 0; o < a.length; o++) {
                      const s = a[o];
                      if (n._checkSwitchConfig(s)) {
                        const c = {
                          value: s.value
                        };
                        try {
                          s.appId && (c.appIdReg = new RegExp(s.appId)),
                          s.appIdBlackList && (c.appIdBlackListReg = new RegExp(s.appIdBlackList)),
                          s.version && (c.version = s.version),
                          s.versionBlackList && (c.versionBlackList = s.versionBlackList);
                        } catch (t) {
                          i += n._formatParsingError(e, r, s, t);
                          continue;
                        }
                        n._keyMap[r] || (n._keyMap[r] = []),
                        n._keyMap[r].push(c);
                      } else {
                        i += n._formatParsingError(e, r, s, 'config format error');
                      }
                    }
                  } else {
                    i += n._formatParsingError(e, r, a, 'config is not Array');
                  }
                }
                ));
            } catch (t) {
              i += n._formatParsingError(e, '', r[e], t);
            }
          }
          ));
      } catch (e) {
        this._handle(e);
      }
      i && this._handle(new Error(i)),
      Object(o.a)('framework', '[switch system] End of initialization', this._keyMap),
      this._inited = !0;
    }
    ,
    r()(e, [{
      key: 'isInitialized',
      get() {
        return this._inited && this._SDKVersion != null;
      }
    }]),
    e;
  }());
  const _ = n(32);
  n.d(t, 'a', (() => w
  ));
  var w = new y((((e) => Object(_.a)(e))
  ));
},
function (e, t) {
  e.exports = function (e, t) {
    e.prototype = Object.create(t.prototype),
    e.prototype.constructor = e,
    e.__proto__ = t;
  };
},
function (e, t, n) {
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = r.a.createElement('div', null, '组件无权限调用');
  t.a = {
    checkPermission(e) {
      const t = Object(a.g)().componentsPermissionCfg;
      return !1 !== (void 0 === t ? {} : t)[e];
    },
    getPermissionJSX(e) {
      const t = e.className;
      const n = e.style;
      const i = e.id;
      return r.a.createElement('div', {
        className: `${t} a-component-permission`,
        style: n,
        id: i
      }, o);
    }
  };
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(82);
  let o = 0;

  function s(e) {
    let t = e;
    return Array.isArray(t) && (t = t.concat()),
    t;
  }

  function c(e) {
    return e[e.valueProp || 'value'];
  }

  const l = {
    statics: {
      isFormControl: !0
    },
    getInitialState() {
      const e = this.props;
      let t = Object(a.a)(c(e));
      return !0 === t && e.$appx.tagName === 'input' && (t = ''),
      this.name = e.name || `__unknown_for_control_${++o}`,
      {
        value: t
      };
    },
    getCurrentValue() {
      return this.props.controlled ? c(this.props) : this.state.value;
    },
    componentDidMount() {
      if (this.context.form) {
        const e = this.getCurrentValue();
        this.initialValue = s(e),
        this.context.form.registerField(this.name, this),
        this.context.form.setFieldValue(this.name, e);
      }
    },
    componentWillReceiveProps(e) {
      this.props.controlled || c(e) !== c(this.props) && this.setState({
        value: Object(a.a)(c(e))
      });
    },
    componentDidUpdate() {
      this.updateFormValue();
    },
    componentWillUnmount() {
      this.context.form && this.context.form.removeField(this.name);
    },
    updateFormValue() {
      this.context.form && this.context.form.setFieldValue(this.name, this.getCurrentValue());
    },
    reset() {
      const e = this;
      this.props.controlled || (this.isResetting = !0,
      this.setState({
        value: s(this.initialValue)
      }, (() => {
        e.isResetting = !1;
      }
      )));
    }
  };
  const u = n(0);
  const p = n.n(u)
    .a
    .createContext({});
  const d = r()({}, l, {
    statics: r()({}, l.statics, {
      contextType: p
    })
  });
  n.d(t, 'a', (() => p
  ));
  t.b = d;
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(23);
  const o = 100;
  const s = n(1);
  const c = n(59);
  const l = n(25);
  const u = n(11);
  const p = n(38);
  const d = (function () {
    function e() {
      this._cacheData = [],
      this._doUpload = Object(p.a)(this._doUpload.bind(this), 500, {
        leading: !1
      });
    }

    const t = e.prototype;
    return t.report = function (e) {
      e.type === l.c.CLICK ? (this._cacheData.push(e),
      this.forceUpload()) : (this._cacheData.push(e),
      this._doUpload());
    }
    ,
    t._doUpload = function () {
      this.forceUpload();
    }
    ,
    t.forceUpload = function () {
      this._cacheData.length && (Object(u.a)('handleUEPEvent', {
        eventArray: this._cacheData
      }),
      this._cacheData = []);
    }
    ,
    e;
  }());
  const h = (function () {
    function e(e) {
      this.manager = e,
      this._cacheClickAt = 0,
      this._locked = !1,
      this._catchUnlock = function () {
        this._unlock(),
        this._cacheClickComponent && this._reportCacheClick();
      }
      ,
      this._catchUnlock = Object(p.a)(this._catchUnlock.bind(this), 50, {
        leading: !1,
        trailing: !0
      });
    }

    const t = e.prototype;
    return t._lock = function () {
      this._locked = !0,
      this._catchUnlock();
    }
    ,
    t._unlock = function () {
      this._locked = !1,
      this._catchUnlock.cancel();
    }
    ,
    t._islocked = function () {
      return this._locked;
    }
    ,
    t.logClick = function (e, t) {
      this._islocked() ? this._cacheClickComponent && (t.clickable ? (this._reportClick(e, t, Date.now()),
      this._clearData(),
      this._unlock()) : t.isCaught && (this._reportCacheClick(),
      this._unlock())) : t.clickable ? (this._reportClick(e, t, Date.now()),
      t.isCaught || this._lock()) : this._cacheClickComponent || (t.isCaught ? this._reportClick(e, t, Date.now()) : (this._cacheClickData = t,
      this._cacheClickComponent = e,
      this._cacheClickAt = Date.now(),
      this._lock()));
    }
    ,
    t._getText = function (e) {
      try {
        if (e && e.props && e.props.$appx && e.props.$appx.tagName === 'text') {
          const t = Object(a.findDOMNode)(e);
          return t ? (t.textContent || '').substr(0, 50) : '';
        }
      } catch (e) {
        return '';
      }
      return '';
    }
    ,
    t._clearData = function () {
      this._cacheClickData = void 0,
      this._cacheClickComponent = void 0,
      this._cacheClickAt = 0;
    }
    ,
    t._reportClick = function (e, t, n) {
      const i = t.clickable;
      this.manager.getReport()
        .report({
          clickable: i,
          target: this.manager.getTarget(e),
          xpath: this.manager.getXPath(e),
          text: this._getText(e),
          type: l.c.CLICK,
          subPageToken: Object(c.a)(),
          timestamp: n
        });
    }
    ,
    t._reportCacheClick = function () {
      this._cacheClickComponent && (this._reportClick(this._cacheClickComponent, this._cacheClickData, this._cacheClickAt),
      this._clearData());
    }
    ,
    e;
  }());
  const f = (function () {
    function e(e) {
      this.manager = e,
      this._lastEffectiveTimestamp = 0;
    }

    const t = e.prototype;
    return t.logClick = function (e, t) {
      const n = Date.now();
      if (!(n - this._lastEffectiveTimestamp < 300)) {
        this._lastEffectiveTimestamp = n;
        const i = (function (e, t) {
          if (void 0 === t && (t = !1),
          e == null) {
            return {
              xpath: 'viewport',
              clickable: !1
            };
          }
          for (var n = e._reactInternalFiber, i = [], r = 0, s = t; n && r < o;) {
            if (n && n.stateNode && n.stateNode.$appx != null) {
              const c = n.stateNode;
              const l = c.$appx.tagName;
              let u = -1;
              try {
                s = s || c.props && (c.props.onTap || c.props.catchTap);
                const p = Object(a.findDOMNode)(c);
                p && p.parentNode && (u = Array.prototype.slice.call(p.parentNode.children)
                  .indexOf(p));
              } catch (e) {
              }
              i.unshift(`${l}[${u}]`);
            }
            n = n.return,
            r++;
          }
          return r >= o && i.unshift('...'),
          i.unshift('viewport'),
          {
            xpath: i.join('/'),
            clickable: !!s
          };
        }(e, t.clickable));
        this.manager.getReport()
          .report(r()({}, i, {
            target: this.manager.getTarget(e),
            text: this._getText(e),
            type: l.c.CLICK,
            subPageToken: Object(c.a)(),
            timestamp: Date.now()
          }));
      }
    }
    ,
    t._getText = function (e) {
      return '';
    }
    ,
    e;
  }());
  const m = (function () {
    function e(e) {
      this.manager = e;
    }

    const t = e.prototype;
    return t.logFocus = function (e, t) {
      this._originalValue = t,
      this._inputingComponent = e;
    }
    ,
    t.logBlur = function (e, t, n) {
      e === this._inputingComponent && this.manager.logInput(e, {
        inputType: t,
        changed: this._originalValue != n
      }),
      this._clearData();
    }
    ,
    t._clearData = function () {
      this._originalValue = void 0,
      this._inputingComponent = void 0;
    }
    ,
    e;
  }());
  let v = 0;

  function g() {
    return s.h.getSwitch('uepReportDataSwitch', !1);
  }

  const b = (function () {
    function e() {
      const e = this;
      this._report = new d(),
      this._inputFeature = new m(this),
      s.b.addListener('afterStartRender', (() => {
        const t = s.h.getSwitch('uepClickRefactor', !1);
        e._clickFeature = t ? new f(e) : new h(e);
      }
      ));
    }

    const t = e.prototype;
    return t.getReport = function () {
      return this._report;
    }
    ,
    t.forceUpload = function () {
      return this._report.forceUpload();
    }
    ,
    t.getXPath = function (e) {
      return (function (e) {
        if (e == null) return 'viewport';
        for (var t = e._reactInternalFiber, n = [], i = 0; t && i < o;) {
          if (t && t.stateNode && t.stateNode.$appx != null) {
            const r = t.stateNode.$appx.tagName;
            let s = -1;
            try {
              const c = Object(a.findDOMNode)(t.stateNode);
              c && c.parentNode && (s = Array.prototype.slice.call(c.parentNode.children)
                .indexOf(c));
            } catch (e) {
            }
            n.unshift(`${r}[${s}]`);
          }
          t = t.return,
          i++;
        }
        return i >= o && n.unshift('...'),
        n.unshift('viewport'),
        n.join('/');
      }(e));
    }
    ,
    t.getTarget = function (e) {
      return e ? (e.__uepComponentId || (e.__uepComponentId = `${++v}`),
      e.__uepComponentId) : '-1';
    }
    ,
    t.logClick = function (e, t) {
      g() && this._clickFeature && this._clickFeature.logClick(e, t);
    }
    ,
    t.logScroll = function (e, t) {
      g() && this.getReport()
        .report(r()({}, t, {
          xpath: this.getXPath(e),
          target: this.getTarget(e),
          timestamp: Date.now(),
          subPageToken: Object(c.a)(),
          type: l.c.SCROLL
        }));
    }
    ,
    t.logTouch = function (e) {
      g() && this.getReport()
        .report(r()({}, e, {
          timestamp: Date.now(),
          subPageToken: Object(c.a)(),
          type: l.c.TOUCH
        }));
    }
    ,
    t.logInput = function (e, t) {
      g() && this.getReport()
        .report(r()({}, t, {
          target: this.getTarget(e),
          xpath: this.getXPath(e),
          timestamp: Date.now(),
          subPageToken: Object(c.a)(),
          type: l.c.INPUT
        }));
    }
    ,
    t.logFocus = function (e, t) {
      g() && this._inputFeature.logFocus(e, t);
    }
    ,
    t.logBlur = function (e, t, n) {
      g() && this._inputFeature.logBlur(e, t, n);
    }
    ,
    e;
  }());
  n.d(t, 'b', (() => y
  )),
  n.d(t, 'a', (() => g
  ));
  var y = new b();
},
function (e, t, n) {
  n.d(t, 'i', (() => a
  )),
  n.d(t, 'h', (() => o
  )),
  n.d(t, 'c', (() => s
  )),
  n.d(t, 'f', (() => c
  )),
  n.d(t, 'g', (() => l
  )),
  n.d(t, 'd', (() => u
  )),
  n.d(t, 'b', (() => p
  )),
  n.d(t, 'a', (() => d
  )),
  n.d(t, 'e', (() => h
  )),
  n.d(t, 'j', (() => f
  )),
  n.d(t, 'l', (() => m
  )),
  n.d(t, 'k', (() => v
  ));
  const i = n(3);
  const r = n.n(i);
  var a = 'ts5';
  var o = 'ts6';
  var s = 'ts7';
  var c = 'ts8';
  var l = 'ts11';
  var u = 'ts12';
  var p = 'ts17';
  var d = 'ts18';
  var h = 'ts19';
  var f = 'ts20';
  var m = {};

  function v(e) {
    r()(m, e);
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = self;

  function r(e) {
    e.message || (e = new Error(e)),
    i.onerror ? i.onerror(e.message, e.sourceURL, e.line, e.column, e) : console.error(e);
  }
},
function (e, t, n) {
  let i;
  const
    r = n(17);

  function a() {
    return i;
  }

  self.__getStartupParams = a,
  n.d(t, 'a', (() => s
  )),
  n.d(t, 'b', (() => c
  ));
  const o = self;

  function s() {
    return o.__appxStartupParams ? o.__appxStartupParams : a() || {};
  }

  var c = function (e) {
    Object(r.a)(e).length && (i = e);
  };
},
function (e, t, n) {
  const i = navigator;
  const r = i.swuserAgent || i.userAgent;
  t.a = {
    OS: 'web',
    ide: r.indexOf('AlipayIDE') > -1,
    browser: r.indexOf('Android') > -1 ? 'android' : r.match(/iPhone|iPad|iOS/i) ? 'ios' : 'unknown'
  };
},
function (e, t, n) {
  t.a = {
    currentPageConfig: null,
    currentComponentConfig: null
  };
},
function (e, t, n) {
  const i = [];
  var r = {
    _listeners: i,
    fireChange(e) {
      r.trackerConfig = e;
      for (var t = void 0, n = {}, a = 0; a < e.length; a++) {
        t || (t = {});
        for (let o = 0, s = e[a].eventTarget; o < s.length; o++) {
          const c = s[o];
          const l = c.element;
          const u = void 0 === l ? '' : l;
          const p = c.trigger;
          p !== 'exposure' || t[u] || (t[u] = 1),
          p !== 'click' || n[u] || (n[u] = 1);
        }
      }
      r.exposureElements = t,
      r.clickElements = n;
      for (let d = 0; d < i.length; d++) {
        (0,
        i[d])(e);
      }
    },
    offChange(e) {
      const t = i.indexOf(e);
      t !== -1 && i.splice(t, 1);
    },
    onChange(e) {
      i.indexOf(e) === -1 && i.push(e);
    }
  };
  t.a = r;
},
function (e, t, n) {
  const i = n(1);
  const r = n(11);
  const a = n(6);
  const o = n(83);
  const s = n(2);
  const c = n(4);
  const l = n(39);
  const u = n(9);
  const p = n(48);
  const d = n(80);
  const h = function (e) {
    const t = e.error || {};
    const n = t.type || e.type || void 0;
    let i = t.column || e.col;
    let r = t.line || e.line;
    const a = t.stack || [];
    let o = t.sourceURL || e.url;
    if (!i || !r || o === '__errorUrl') {
      let s = (a[0] || '').split(':');
      let c = s.length;
      c > 2 ? (r = r || (parseInt(s[c - 2]) || '_1'),
      i = i || (parseInt(s[c - 1]) || '_1'),
      o = o || s[c - 3]) : (c = (s = (a[1] || '').split(':')).length) > 2 && (r = r || (parseInt(s[c - 2]) || '_1'),
      i = i || (parseInt(s[c - 1]) || '_1'),
      o = o || s[c - 3]);
    }
    const l = `${t.message || e.msg}^${r}^${i}`;
    o || (o = '__errorUrl');
    let u = o;
    return u.charAt(0) === '_' && (u = u.slice(1)),
    {
      msg: l,
      errorUrl: o,
      originalUrl: u,
      stack: a,
      pureMsg: `${t.message || e.msg}`,
      line: r,
      col: i,
      errorType: n
    };
  };
  const f = /\/__plugins__\/(.*?)\//;
  const m = /plugin-private:\/\/(.*?)\//;
  const v = function (e, t) {
    let n = '';
    if (e && e != '__errorUrl') {
      const i = f.exec(e);
      if (i) {
        n = i[1];
      } else {
        const r = m.exec(t);
        r && (n = r[1]);
      }
    }
    return n;
  };
  const g = (n(121),
  n(99));
  const b = c.trackerPluginType === g.a.TB || c.trackerPluginType === g.a.common;
  n.d(t, 'a', (() => D
  ));
  let y;
  let _;
  let w;
  let C;
  let x;
  let T;
  let S;
  let E;
  let k = '';
  let O = '';
  let P = '';
  const N = s.n ? 'ariver' : 'nebula';
  const
    I = navigator.userAgent;

  function A() {
    return void 0 === S && (S = Object(c.isFeatureAvailable)('f_supportAppxSwitch_24_8') ? i.h.getSwitch('switchYuyanToJSAPI', !1) || !1 : Object(c.isFeatureAvailableWithDefault)('f_switch_yuyan_2_6_8', !1)),
    S;
  }

  function j(e, t, n) {
    if (P === '') {
      const f = Object(i.g)() || {};
      f.appId && (O = f.version || '',
      y = f.fromIDE,
      P = f.appId,
      C = f.debug,
      _ = f.cluePID,
      T = f.templateAppId,
      s.r || (w = f.isNotTinyProcess,
      x = f.isV8Worker === 'true' ? 'V8' : 'sw'));
    }
    if (!y) {
      const m = h(t);
      const g = m.msg;
      const S = m.errorUrl;
      const j = m.stack;
      const D = m.originalUrl;
      const M = m.pureMsg;
      const L = m.col;
      const F = m.line;
      const V = m.errorType;
      const U = v(S, location.hash);
      const B = `${s.a} ${s.d}-${s.c} | ${c.ExtSDKVersion} ${c.ExtBuildTime}-${c.ExtBuildCommit}`;
      const z = s.r ? `iOS-${N}` : `Android-${N}-${w}-${x}`;
      if (!1 !== A() || (void 0 === E && (E = i.h.getSwitch('stopReportError2Clue', 0) || 0),
      E) === 1) {

      } else {
        const W = {
          pid: 'miniprogram',
          code: e,
          msg: g,
          uid: k,
          page: location.href,
          ua: I,
          rel: O,
          c1: B,
          c2: P,
          c3: `${s.e}/${s.f}`,
          c4: S,
          c5: j,
          c6: z
        };
        if (P !== '') {
          const H = new Image();
          W.pid = `miniprogram-${_ || P}`,
          H.src = `https://gm.mmstat.com/fsp.1.1?${(function (e) {
            const t = [];
            for (const n in e) e.hasOwnProperty(n) && t.push(`${encodeURIComponent(n)}=${encodeURIComponent(e[n])}`);
            return t.join('&');
          }(W))}`;
        }
      }
      const X = {
        pid: 'miniprogram',
        code: e,
        msg: M,
        bm_appid: P,
        fullURL: P,
        page: location.href,
        rel: O,
        d1: `${s.a} ${s.d}-${s.c}`,
        d2: s.f,
        d3: S,
        d4: z,
        d5: s.e,
        d6: `${c.ExtSDKVersion} ${c.ExtBuildTime}-${c.ExtBuildCommit}`,
        c1: F,
        c2: L,
        c3: j,
        s9: 'appx',
        d9: V
      };
      if (U && (X.d7 = U),
      T && (X.d10 = T),
      _ && (X.c5 = _),
      A() ? (X.c3 = X.c3.join('\n'),
      Object(r.a)('handleLoggingAction', {
        actionType: 'reportEvent',
        params: {
          eventId: '102023',
          bizType: 'yuyanmonitorl',
          extData: X
        }
      })) : (function (e, t) {
        const n = ['D-AE', '', '', '', '2', '', '', t, '1000', '102023', 'H5behavior', '2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', I.replace(/,/g, '%2C'), '', '', '', '', '', '', Object(u.default)(e)
          .map(((t) => `${R(t)}=${R(e[t])}`
          ))
          .join('^')];
        const i = `https://mdap.alipay.com/loggw/dwcookieLogGet.do?data=${R(n.join(','))}&time=${(new Date()).getTime()}`;
        (new Image()).src = i;
      }(X, k)),
      n) {
        b && e === p.a.BLOCK_WORKER_ERROR && Object(r.a)('handleLoggingAction', {
          commonData: {
            SDKVersion: s.a,
            appId: P,
            appxVersion: s.a,
            currentPagePath: '',
            url: ''
          },
          extData: {
            errorCode: `H5_CUSTOM_ERROR_TINY_${p.a.RENDER_GLOBAL_ERROR}`,
            errorStack: JSON.stringify(j || []),
            errorUrl: S,
            errorType: 'SYSTEM_ERROR',
            msg: g,
            pluginId: U
          },
          subType: 'RV_JSFRAMEWORK_ERROR',
          type: 'error'
        });
      } else {
        const Y = {
          errorMsg: g,
          errorUrl: S,
          pluginId: U,
          SDKVersion: B,
          AppXWorkerSDKVersion: self.AppXWorkerSDKVersion,
          stack: j,
          OS: z,
          errorType: V
        };
        Object(d.b)()[D] && (Y.extraAppId = Object(d.b)()[D]),
        Object(a.a)('remoteLog', {
          type: 'error',
          seedId: 'H5_CUSTOM_ERROR',
          param1: `H5_CUSTOM_ERROR_TINY_${e}`,
          param3: Object(l.a)(Y)
        }),
        o.a.emitRemoteTrackerEvent('Tracker.error', {
          errorUrl: S,
          pluginId: U,
          errorStack: j,
          errorCode: `H5_CUSTOM_ERROR_TINY_${e}`,
          errorType: V,
          msg: g
        });
      }
      if (C === 'error') {
        let $ = '';
        Object(u.default)(p.a)
          .map(((t) => {
            e === p.a[t] && ($ = t);
          }
          )),
        Object(a.a)('alert', {
          title: $,
          message: `${S.indexOf('af-appx') >= 0 ? 'FrameworkError' : 'BizError'}-${g}`
        });
      }
    }
  }

  function R(e) {
    return e ? encodeURIComponent(e)
      .replace(/'/g, '%27') : e;
  }

  function D(e, t, n) {
    if (void 0 === n && (n = !1),
    k) {
      j(e, t, n);
    } else if (s.o) {
      Object(a.a)('ddExec', {
        serviceName: 'device.base',
        actionName: 'getUUID',
        args: {}
      }, ((i) => {
        if (i && i.success && i.content) {
          try {
            const r = JSON.parse(i.content);
            k = r.uuid;
          } catch (e) {
            k = 'ddUnknown';
          }
        } else {
          k = 'ddUnknown';
        }
        j(e, t, n);
      }
      ));
    } else {
      const o = Object(i.g)() || {};
      o.appxUtdid ? (k = o.appxUtdid,
      j(e, t, n)) : Object(r.a)('getUserInfo', {}, ((i) => {
        k = i && i.userId || 'unknown',
        j(e, t, n);
      }
      ));
    }
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = n(108);

  function r(e, t, n) {
    let r = !0;
    let a = !0;
    return n && (r = 'leading' in n ? n.leading : r,
    a = 'trailing' in n ? n.trailing : a),
    Object(i.a)(e, t, {
      leading: r,
      maxWait: t,
      trailing: a
    });
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = n(9);

  function r(e) {
    return e ? typeof e === 'string' ? e : Object(i.default)(e)
      .map(((t) => {
        let n;
        let
          i = `${t}=`;
        return i += (n = e[t],
        n !== null && typeof n === 'object' ? typeof n.toString === 'function' ? String(n) : '' : String(n)).replace(/,/g, ';')
          .replace(/\^/g, '@')
          .replace(/\=/g, '~');
      }
      ))
      .join('^') : '';
  }
},
function (e, t, n) {
  const i = n(1);
  const r = n(38);
  const a = n(11);
  const o = n(6);
  t.a = (function (e, t) {
    let n;
    const a = t.callInternalAPI;
    const
      o = t.callBridge;
    !(function (e, t, n) {
      let r = i.b.addListener(e, o);
      const a = setTimeout(o, t);

      function o() {
        n(),
        r && typeof r.remove === 'function' && (r.remove(),
        r = void 0),
        clearTimeout(a);
      }
    }('pageReady', 4e3, (() => {
      n = !0,
      u();
    }
    )));
    let s;
    let c = [];
    let
      l = [];

    function u() {
      if (c.length && n) {
        const t = l;
        l = [],
        a('remoteLogBatch', {
          data: c,
          type: e
        }, (() => {
          for (let e = 0; e < t.length; e++) {
            (0,
            t[e])();
          }
        }
        )),
        c = [];
      }
    }

    return function (t, n) {
      const a = Object(i.g)().jsApi_remoteLog;
      const p = Number(a);
      a && !isNaN(p) ? (s = s || Object(r.a)(u, p, {
        leading: !1
      }),
      c.push(t),
      typeof n === 'function' && l.push(n),
      s()) : o(e === 'remoteLogBatch' ? 'remoteLog' : e, t, n);
    };
  }('remoteLogBatch', {
    callInternalAPI: a.a,
    callBridge: o.a
  }));
},
function (e, t, n) {
  n.d(t, 'a', (() => o
  )),
  n.d(t, 'b', (() => s
  )),
  n.d(t, 'c', (() => c
  )),
  n.d(t, 'd', (() => l
  ));
  const i = n(33);
  const r = n(34);
  const a = {};
  var o = function () {
    return !!Object(i.a)().debug || Object(i.a)().nbsn === 'DEBUG';
  };
  var s = function () {
    return o() || r.a.ide;
  };
  var c = function () {
    return l('framework');
  };

  function l(e) {
    if (void 0 === Object(i.a)().debug) return !1;
    let t = a[e];
    if (void 0 === t) {
      const n = Object(i.a)().debug;
      a[e] = typeof n === 'string' && (t = !!n.match(new RegExp(`\\b${e}\\b`)));
    }
    return t;
  }
},
function (e, t, n) {
  function i(e) {
    if (typeof e === 'function') {
      try {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
        return e.apply(void 0, n);
      } catch (e) {
        console.error('AppX DevTools encountered an error: %s', e);
      }
    }
  }

  function r(e) {
    if (typeof __APPX_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') return !1;
    const t = __APPX_DEVTOOLS_GLOBAL_HOOK__;
    if (t.isDisabled) return !0;
    try {
      e(t);
    } catch (e) {
      console.error('AppX DevTools encountered an error: %s.', e);
    }
    return !0;
  }

  n.d(t, 'b', (() => i
  )),
  n.d(t, 'a', (() => r
  ));
},
function (e, t, n) {
  n.d(t, 'b', (() => c
  )),
  n.d(t, 'a', (() => l
  )),
  n.d(t, 'e', (() => u
  )),
  n.d(t, 'd', (() => p
  )),
  n.d(t, 'c', (() => d
  ));
  let i;
  const r = n(3);
  const a = n.n(r);
  const o = self;
  const
    s = {};

  function c() {
    return o.appXAppJson ? o.appXAppJson : s.appJSON;
  }

  function l(e) {
    a()(s, e);
  }

  function u() {
    return s.bizStartTime;
  }

  function p() {
    return s.bizEndTime;
  }

  function d() {
    const e = (c() || {}).app;
    const t = void 0 === e ? {} : e;
    if (i) return i;
    if (i = {},
    t.plugins && (i = a()({}, t.plugins)),
    t.subPackages) {
      for (let n = 0, r = t.subPackages; n < r.length; n++) {
        const o = r[n];
        o.plugins && (i = a()(i, o.plugins));
      }
    }
    return i;
  }
},
function (e, t, n) {
  n.d(t, 'b', (() => c
  )),
  n.d(t, 'a', (() => l
  )),
  n.d(t, 'c', (() => u
  ));
  n(3);
  let i;
  const r = n(1);
  const a = n(2);
  const o = n(76);
  const s = n(4);
  var c = (n(10),
  o.a.callBridge,
  o.a.callBridgeSync,
  function () {
    const e = Object(r.e)();
    return l(e);
  }
  );
  var
    l = function (e) {
      return e ? {
        $viewId: e.publicInstance.$viewId,
        query: e.query,
        pagePath: e.pagePath,
        startTime: e.$startTime,
        isAppFirstPage: e.isAppFirstPage,
        callRemoteBridge() {
          e.callRemoteBridge.apply(e, arguments);
        },
        callRemoteComponent() {
          e.callRemoteComponent.apply(e, arguments);
        },
        callRemote(t, n, i) {
          e.callRemoteBridge('invokeMethod', {
            method: t,
            params: n
          }, i);
        }
      } : null;
    };

  function u() {
    return void 0 === i && (i = {
      info: {
        SDKVersion: a.a,
        BuildCommit: a.c,
        BuildTime: a.d,
        ExtSDKVersion: s.ExtSDKVersion,
        ExtBuildCommit: s.ExtBuildCommit,
        ExtBuildTime: s.ExtBuildTime
      },
      getStartupParams: r.g
    }),
    i;
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = n(17);

  function r(e, t) {
    for (var n = Object(i.a)(t), r = 0; r < n.length; r++) {
      const a = n[r];
      e.addEventListener(a, t[a]);
    }
    return {
      remove() {
        for (let i = 0; i < n.length; i++) {
          const r = n[i];
          e.removeEventListener(r, t[r]);
        }
      }
    };
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = n(17);

  function r(e, t) {
    if (e === t) return !0;
    if (typeof e !== 'object' || e === null || typeof t !== 'object' || t === null) return !1;
    const n = Object(i.a)(e);
    const r = Object(i.a)(t);
    const a = n.length;
    if (a !== r.length) return !1;
    for (let o = 0; o < a; o++) {
      const s = n[o];
      if (!t.hasOwnProperty(s)) return !1;
      if (e[s] !== t[s]) return !1;
    }
    return !0;
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  )),
  n.d(t, 'b', (() => o
  ));
  const i = n(1);
  const r = 'af-appx-page-change';

  function a() {
    i.b.emit(r);
  }

  function o(e) {
    i.b.on(r, e);
  }
},
function (e, t, n) {
  t.a = {
    WORKER_GLOBAL_ERROR: 11,
    RENDER_GLOBAL_ERROR: 12,
    REGISTER_WORKER_ERROR: 13,
    CUSTOM_WORKER_ERROR: 14,
    BLOCK_WORKER_ERROR: 15,
    WORKER_UnhandledRejection_Error: 16,
    TRACER: 11002,
    UNEXPECTED_BEHAVIOR: 11006,
    COMPONENT_NOT_FOUND: 11128
  };
},
function (e, t, n) {
  n.d(t, 'c', (() => i
  )),
  n.d(t, 'b', (() => r
  )),
  n.d(t, 'a', (() => a
  ));
  var i = {};
  var r = {};

  function a() {
    i = {},
    r = {};
  }
},
function (e, t, n) {
  const i = {
    ClientDidFrameworkLoad: 1,
    ClientWillRegisterWorker: 2,
    ClientDidRegisterWorkerSuccess: 3,
    ClientWillCreateMessageChannel: 4,
    ClientWillPageFirstRender: 5,
    ClientDidPluginResourceLoad: 6,
    HostDidFrameworkLoad: 100,
    HostDidAppLaunch: 101,
    HostDidPageCreated: 102,
    HostWillPageOnLoad: 103,
    HostWillPageOnShow: 104,
    HostDidPageFirstRender: 105,
    HostWillPageOnReady: 106
  };
  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  ));
  const i = n(17);
  const r = Object;

  function a(e) {
    const t = [];
    if (e) {
      if (r.values) return r.values(e);
      for (let n = 0, a = Object(i.a)(e); n < a.length; n++) {
        const o = a[n];
        t.push(e[o]);
      }
    }
    return t;
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => c
  )),
  n.d(t, 'b', (() => l
  )),
  n.d(t, 'c', (() => u
  ));
  let i;
  let r;
  const a = n(33);
  const
    o = (n(7),
    n(51),
    10);

  function s() {
    return (function () {
      if (r) return r;
      let e = Object(a.a)().tabBarItems;
      if (e) {
        typeof e === 'string' && (e = JSON.parse(e));
        for (var t = {}, n = e.length, i = 0; i < n; i++) e[i].pagePath && (t[e[i].pagePath] = o + i);
        return r = t,
        t;
      }
    }()) || i;
  }

  function c(e) {
    const t = s();
    return t && e in t ? t[e] : -1;
  }

  function l(e) {
    return c(e) !== -1;
  }

  function u(e) {
    if (e) {
      const t = e.pagePath;
      const n = e.tabIndex;
      n && ((i = i || {})[t] = n);
    }
  }
},
function (e, t, n) {
  t.a = {};
},
function (e, t) {
  const n = Array.prototype.slice;
  e.exports = function (e) {
    const t = n.call(arguments, 1);
    return t.forEach(((t) => {
      t && typeof t === 'object' && Object.keys(t)
        .forEach(((n) => {
          e[n] = t[n];
        }
        ));
    }
    )),
    e;
  };
},
function (e, t, n) {
  n.d(t, 'a', (() => o
  ));
  const i = n(7);

  function r(e, t, n, r) {
    i.b.trace && i.b.trace(6, e, t, {
      resourceUrl: n,
      isSuccess: r
    });
  }

  const a = {};

  function o(e, t) {
    void 0 === e && (e = []);
    for (var n = [], o = function (e, t) {
        const o = t[e];
        const s = new Promise((((e) => {
          a[o] ? e() : (function (e, t) {
            const n = i.b.now();
            a[e] = 1;
            const o = document.createElement('script');
            o.onload = function () {
              for (var a = i.b.now(), o = arguments.length, s = new Array(o), c = 0; c < o; c++) s[c] = arguments[c];
              t.apply(null, s),
              r(n, a - n, e, !0);
            }
            ,
            o.onerror = function () {
              r(n, i.b.now() - n, e, !1);
            }
            ,
            o.src = e,
            o.setAttribute('snapshot-delete', 'true'),
            document.head.appendChild(o);
          }(o, e));
        })
        ));
        n.push(s);
      }, s = 0, c = e; s < c.length; s++) {
      o(s, c);
    }
    Promise.all(n)
      .then(t);
  }
},
function (e, t, n) {
  function i(e) {
    let t;
    return e && (t = e()),
    t && (t = t.default || t),
    t;
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  function i(e) {
    if (/^(rgb|RGB)/.test(e)) {
      for (var t = e.replace(/(?:\(|\)|rgba|RGBA)*/g, '')
          .replace(/(?:\(|\)|rgb|RGB)*/g, '')
          .split(','), n = '#', i = 0; i < t.length; i++) {
        let r = Number(t[i]);
        i === 3 && (r = parseInt(`${255 * r}`));
        let a = r.toString(16);
        a.length < 2 && (a = `0${a}`),
        n += a;
      }
      return n.length === 7 && (n += 'ff'),
      n.length !== 9 && (n = e),
      n;
    }
    return e;
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = n(89);

  function r(e) {
    return e.split('-')
      .map(((e) => Object(i.a)(e)
      ))
      .join('');
  }
},
function (e, t, n) {
  n(3),
  n(129),
  n(71),
  n(52),
  n(19),
  n(15),
  new (n(68).a)(),
  JSON.parse;
  n(18);
  const i = n(1);
  const r = n(78);
  const a = n(76);
  const o = n(10);
  const s = n(44);
  const c = n(2);
  const l = n(37);
  n(109),
  n(9),
  n(4);
  n.d(t, 'a', (() => p
  ));

  function u(e) {
    let t;
    let n;
    let r;
    let
      a = Object(i.e)();
    return e && void 0 !== e.$viewId && (t = e.$viewId,
    n = Object(i.d)(),
    r = null,
    n && n.getAllPages()
      .some(((e) => e.viewId === t && (r = e,
      !0)
      )),
    a = r || a),
    Object(s.a)(a);
  }

  function p(e) {
    const t = e || Object(i.e)();
    return t.workerPageStartTime || t.$startTime;
  }

  let d;
  s.b,
  a.a.callBridge,
  a.a.callBridgeSync,
  a.a.on,
  a.a.off,
  i.b,
  i.g,
  c.r,
  c.l,
  c.q,
  l.a;
},
function (e, t, n) {
  const i = n(33);
  n.d(t, 'a', (() => i.a
  )),
  n.d(t, 'b', (() => i.b
  ));
},
function (e, t, n) {
  const i = n(93);
  const r = n(75);
  const a = n(9);
  const o = n(91);
  const s = n(20);
  i.a.EventHub.addListener('didMount', ((e) => {
    const t = e.dom;
    const n = e.instance;
    const i = r.a.getTestProps.call(n);
    if (i !== r.b) {
      for (let o = 0, s = Object(a.default)(i); o < s.length; o++) {
        const c = s[o];
        t.setAttribute(c, i[c]);
      }
    }
    n && n.props && (n.props.onTap || n.props.catchTap) && t && t.setAttribute('data-clickable', 'true');
  }
  )),
  i.a.EventHub.addListener('onTap', ((e) => {
    const t = e.instance;
    Object(o.b)(t),
    t && t.props && t.props.$appx && t.props.$appx.tagName === 'view' && Object(s.c)(t, !1),
    r.a.logTestId.call(t);
  }
  )),
  t.a = i.a;
},
function (e, t, n) {
  n.d(t, 'a', (() => s
  )),
  n.d(t, 'b', (() => c
  ));
  const i = n(34);
  const r = n(65);
  const a = n(77);
  const o = i.a.browser === 'ios';

  function s(e) {
    let t = c(e);
    return `${t = t > 0 && t < 1 ? o ? 0.5 : 1 : Math.floor(t)}px`;
  }

  function c(e) {
    return !1 !== Object(a.a)() ? e / 750 * Object(r.a)() : e / 2;
  }
},
function (e, t, n) {
  t.a = {};
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  ));
  const i = window;
  const r = {};

  function a(e, t, n, a) {
    let o = r[e];
    if (o) return o.done ? void t() : void o.queue.push(t);
    o = r[e] = {
      done: !1,
      queue: [t]
    };
    const s = document.createElement('script');
    s.crossOrigin = !0,
    s.setAttribute('snapshot-delete', 'true'),
    s.addEventListener('load', (() => {
      setTimeout((() => {
        o.done = !0,
        o.queue.forEach(((e) => e()
        )),
        o.queue = [];
      }
      ), 1);
    }
    )),
    s.onreadystatechange = s.onerror = function () {
      typeof n === 'function' && void 0 !== a && (this.readyState && (this.readyState !== 'loaded' && this.readyState !== 'complete' || i[a]) || n());
    }
    ,
    s.src = e,
    document.head.appendChild(s);
  }
},
function (e, t, n) {
  let i;

  function r() {
    return void 0 === i && (i = document.documentElement.clientWidth),
    i;
  }

  function a() {
    return {
      width: i,
      height: document.documentElement.clientHeight
    };
  }

  function o(e) {
    i = e;
  }

  n.d(t, 'a', (() => r
  )),
  n.d(t, 'b', (() => a
  )),
  n.d(t, 'c', (() => o
  ));
},
function (e, t, n) {
  n.d(t, 'a', (() => i
  )),
  n.d(t, 'c', (() => r
  )),
  n.d(t, 'b', (() => a
  ));
  var i = {};
  var r = {};

  function a() {
    r = {},
    i = {};
  }
},
function (e, t, n) {
  function i(e) {
    return e.replace(/-(\w)/g, ((e, t) => t.toUpperCase()
    ));
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(32);
  self;

  function o() {
    this.allListeners = {};
  }

  const s = o.prototype = {
    _addListener(e, t, n) {
      const i = this;
      void 0 === n && (n = {});
      let r = e;
      Array.isArray(r) || (r = [r]);
      for (let a = this.allListeners, o = 0, s = r; o < s.length; o++) {
        const c = s[o];
        const l = a[c] = a[c] || [];
        if (l.indexOf(t) !== -1) return;
        n.prepend ? l.unshift(t) : l.push(t);
      }
      return {
        remove() {
          i.removeListener(r, t);
        }
      };
    },
    addListener(e, t) {
      return this._addListener(e, t);
    },
    prependListener(e, t) {
      return this._addListener(e, t, {
        prepend: !0
      });
    },
    listeners(e) {
      return e ? this.allListeners[e] || [] : this.allListeners;
    },
    listenerCount(e) {
      if (e) return this.listeners(e).length;
      for (var t = this.allListeners, n = Object.keys(t), i = 0, r = 0; r < n.length; r++) {
        const a = n[r];
        i += t[a] && t[a].length || 0;
      }
      return i;
    },
    emit(e) {
      let t = e;
      Array.isArray(t) || (t = [t]);
      for (var n = r()({}, this.allListeners), i = arguments.length, o = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++) o[s - 1] = arguments[s];
      for (let c = 0, l = t; c < l.length; c++) {
        const u = l[c];
        const p = n[u];
        if (p && p.length) {
          for (let d = 0, h = p.concat(); d < h.length; d++) {
            const f = h[d];
            try {
              f.apply(void 0, o);
            } catch (e) {
              Object(a.a)(e);
            }
          }
        }
      }
    },
    removeListener(e, t) {
      let n = e;
      Array.isArray(n) || (n = [n]);
      for (let i = this.allListeners, r = 0, a = n; r < a.length; r++) {
        const o = a[r];
        const s = i[o];
        if (s) {
          if (t) {
            const c = s.indexOf(t);
            c !== -1 && s.splice(c, 1);
          } else {
            delete i[o];
          }
        }
      }
    }
  };
  s.on = s.addListener,
  s.off = s.removeListener,
  t.a = o;
},
function (e, t, n) {
  let i = {};
  let r = {};
  const a = {
    registerComponent(e, t) {
      i[e] || (i[e] = t);
    },
    getComponent(e) {
      return r[e] || (r[e] = i[e] && i[e]()),
      r[e];
    },
    clear() {
      r = {},
      i = {};
    },
    getComponentClassCache() {
      return r;
    }
  };
  t.a = a;
},
function (e, t, n) {
  n.d(t, 'a', (() => o
  )),
  n.d(t, 'b', (() => s
  ));
  let i;
  const r = n(7);
  const
    a = n(26);

  function o(e) {
    if (s() && e && e.type === 1) return e;
  }

  function s() {
    return void 0 === i && (i = !!(r.b && r.b.multiCfg && r.b.multiCfg.enableStyleScope || a.a.getSwitch('enableStyleScope', !1))),
    i;
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  ));
  const i = n(43);
  const r = n(33);

  function a() {
    const e = Object(r.a)().homePage;
    if (e) return e;
    const t = Object(i.b)();
    return (t && t.app || {}).$homepage;
  }
},
function (e, t, n) {
  let i = {};
  var r = {
    registerComponent(e, t) {
      i[e] && console.warn(`Page ${e} is already declared!`),
      i[e] = t;
    },
    getComponent(e) {
      return i[e] && i[e]();
    },
    getRunnable(e) {
      return r.getComponent(e);
    },
    clear() {
      i = {};
    }
  };
  t.a = r;
},
function (e, t, n) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
  t.a = window.requestAnimationFrame || (window.requestAnimationFrame = function (e) {
    typeof e === 'function' && setTimeout((() => {
      e();
    }
    ), 17);
  }
  );
},
function (e, t, n) {
  const i = n(2);
  const r = n(8);
  const a = i.j ? {
    componentDidMount() {
      this.initVoice();
    },
    componentDidUpdate(e) {
      const t = this.root;
      const n = this.props;
      if (t && t.addVoiceCommand) {
        const i = n.voiceEnabled;
        if (!1 === i) {
          i !== e.voiceEnabled && this.voiceEvent && (this.voiceEvent = this.voiceEvent.remove());
        } else {
          for (let r = 0, a = ['voiceCommands', 'voiceText']; r < a.length; r++) {
            const o = a[r];
            if (n[o] && e[o] !== n[o]) {
              t.removeAllVoiceCommand && t.removeAllVoiceCommand(),
              this.initVoice();
              break;
            }
          }
        }
      } else {
        this.voiceEvent && (this.voiceEvent = this.voiceEvent.remove());
      }
    },
    componentWillUnmount() {
      const e = this.root;
      this.voiceEvent && this.voiceEvent.remove(),
      e && e.removeAllVoiceCommand && e.removeAllVoiceCommand();
    },
    initVoice() {
      const e = this.root;
      if (e && e.addVoiceCommand) {
        this.voiceEvent && (this.voiceEvent = this.voiceEvent.remove());
        const t = this.props;
        const n = t.voiceEnabled;
        const i = t.voiceCommands;
        const a = t.voiceRecognitionMode;
        const o = void 0 === a ? 0 : a;
        const s = t.voiceText;
        if (!0 === n) {
          if (e.voiceEnabled = !0,
          Array.isArray(i)) {
            for (let c = 0; c < i.length; c++) {
              const l = i[c];
              e.addVoiceCommand({
                action: l,
                customCommands: [],
                recognitionMode: o
              });
            }
          }
          s && e.addVoiceCommand({
            action: 'vgui/custom',
            customCommands: s,
            recognitionMode: o
          });
        }
        this.voiceEvent = Object(r.a)(e, {
          voice: this.onVoice
        });
      }
    },
    onVoice(e) {
      const t = void 0 === e ? {} : e;
      const n = t.result;
      const i = t.text;
      const r = t.action;
      const a = this.props.onVoice;
      a && a({
        detail: {
          result: n,
          text: i,
          action: r
        }
      });
    }
  } : void 0;
  t.a = a;
},
function (e, t, n) {
  n.d(t, 'b', (() => o
  ));
  let i;
  const r = n(1);
  let a = 0;
  var
    o = {};

  function s() {
    return void 0 !== i ? i : i = Object(r.g)().runStage === 'test';
  }

  function c() {
    if (s()) {
      let e = {};
      const t = this.props || {};
      this.dataTestId = this.dataTestId || ++a,
      e = {
        'data-testid': this.dataTestId
      };
      const n = typeof this.isBindOnTap === 'function' && this.isBindOnTap();
      return (t.onTap || t.catchTap || n) && (e['data-is-bind-on-tap'] = !0),
      e;
    }
    return o;
  }

  t.a = {
    getTestProps: c,
    logTestId() {
      if (s()) {
        const e = c.call(this);
        console.log(`[data-testid]=${e['data-testid']} response`);
      }
    }
  };
},
function (e, t, n) {
  t.a = {
    callBridge(e, t, n) {
    },
    callInternalAPI(e, t, n) {
    }
  };
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  ));
  const i = n(65);
  const r = n(33);

  function a() {
    const e = self;
    return !1 !== Object(r.a)().responsive || !(!e._AppXFns || !e._AppXFns.rpx) && !1 !== e._AppXFns.rpx(Object(i.b)());
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = self;
  var r = i.importScripts;
  const a = i.AlipayJSBridge;
  i.fetch;
  a && (a.call,
  a.callSync);
},
function (e, t, n) {
  const i = n(0);
  const r = n.n(i)
    .a
    .createContext({});
  t.a = r;
},
function (e, t, n) {
  n.d(t, 'b', (() => c
  )),
  n.d(t, 'a', (() => l
  ));
  const i = n(11);
  const r = n(64);
  const a = n(107);
  const o = {};
  const s = {};

  function c() {
    return s;
  }

  function l(e, t, n, c) {
    void 0 === c && (c = {});
    let l = o[t];
    if (l) return l.done ? void n() : void l.queue.push(n);
    l = o[t] = {
      done: !1,
      queue: [n]
    };
    let u = 0;
    !(function n() {
      c.src && c.src.indexOf('https://hpm.local.alipay.net/') === 0 ? Object(r.a)(c.src, (() => {
        window[e] && (l.done = !0,
        l.queue.forEach(((e) => e()
        )),
        l.queue = []);
      }
      )) : Object(i.a)('addPkgRes', {
        resAppId: t
      }, ((i) => {
        if (i && i.urls && i.urls.length > 0) {
          for (let p = 0, d = i.urls; p < d.length; p++) {
            const h = d[p];
            if (Object(a.a)(h, 'index.js')) {
              s[h] = t,
              Object(r.a)(h, (() => {
                window[e] && (l.done = !0,
                l.queue.forEach(((e) => e()
                )),
                l.queue = []);
              }
              ));
              break;
            }
          }
        } else {
          u < 5 ? (u++,
          setTimeout(n, 1e3)) : (c.onError && c.onError({
            detail: {
              error: 999,
              errorMessage: '组件加载失败'
            }
          }),
          delete o[t]);
        }
      }
      ));
    }());
  }
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(27);
  const o = n.n(a);
  const s = n(0);
  const c = n.n(s);
  const l = n(21);
  const u = n.n(l);
  const p = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  const d = 'a-loading';
  const h = c.a.createElement('div', {
    className: `${d}-item`
  });
  const f = c.a.createElement('div', {
    className: `${d}-item`
  });
  const m = c.a.createElement('div', {
    className: `${d}-item`
  });
  const v = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    return o()(t, e),
    t.prototype.render = function () {
      let e;
      const t = this.props;
      const n = t.mode;
      const i = p(t, ['mode']);
      const
        a = u()(((e = {})[`${d}-indicator`] = !0,
        e.white = n === 'white',
        e));
      return c.a.createElement('div', r()({
        role: 'img',
        className: a
      }, i), h, f, m);
    }
    ,
    t;
  }(c.a.PureComponent));
  t.a = v;
},
function (e, t, n) {
  t.a = function (e) {
    return e && typeof e === 'object' && '_v' in e ? e._v : e;
  };
},
function (e, t, n) {
  const i = n(1);
  const r = n(36);

  function a(e, t) {
    const n = Object(i.e)();
    n && n.callRemoteSecret('emitTrackerEvent', e, t);
  }

  const o = [];
  let s = !1;

  function c() {
    s = !0,
    o.forEach(((e) => {
      a(e[0], e[1]);
    }
    )),
    o.length = 0,
    l && typeof l.remove === 'function' && l.remove(),
    clearTimeout(u);
  }

  var l = i.b.on('pageLoad', c);
  var u = setTimeout(c, 1500);
  t.a = {
    setTrackerConfig(e) {
      r.a.fireChange(e);
    },
    collectRemoteTrackerData(e, t) {
      Object(i.e)()
        .callRemoteSecret('collectTrackerData', Object(i.e)()
          .getId(), e, t);
    },
    reportRemoteTrackerData(e, t) {
      Object(i.e)()
        .callRemoteSecret('reportTrackerData', Object(i.e)()
          .getId(), e, t);
    },
    emitRemoteTrackerEvent(e, t) {
      !s && o.length <= 10 ? o.push([e, t]) : a(e, t);
    }
  };
},
function (e, t, n) {
  n.d(t, 'a', (() => i
  )),
  n.d(t, 'b', (() => r
  ));
  var i = function (e, t, n) {
    void 0 === n && (n = 0);
    const i = {
      left: e.left - n < t.left ? t.left : e.left,
      top: e.top - n < t.top ? t.top : e.top,
      right: e.right + n > t.right ? t.right : e.right,
      bottom: e.bottom + n > t.bottom ? t.bottom : e.bottom,
      width: 0,
      height: 0
    };
    return i.right > i.left ? i.width = i.right - i.left : i.right = i.left = i.bottom = i.top = 0,
    i.bottom > i.top ? i.height = i.bottom - i.top : i.right = i.left = i.bottom = i.top = 0,
    i;
  };

  function r(e, t, n) {
    void 0 === n && (n = 0);
    const r = document.documentElement;
    const a = {
      top: 0,
      left: 0,
      bottom: r.clientHeight,
      right: r.clientWidth
    };
    if (void 0 === t) return i(e, a, n);
    const o = i(t, a, n);
    if (o.width * o.height > 0) {
      const s = i(e, a, n);
      return s.width * s.height > 0 ? i(s, o, n) : s;
    }
    return o;
  }
},
function (e, t, n) {
  const i = n(54);
  const r = n.n(i);
  if (!global.Symbol) {
    let a = 0;
    const o = function (e) {
      return `$$_appx_symbol_${e}_${++a}_$$`;
    };
    o.iterator = o('Symbol.iterator'),
    global.Symbol = o;
  }
  Object.assign = r.a;
  let s;
  const c = n(3);
  const l = n.n(c);
  const u = n(5);
  const p = n.n(u);
  const d = n(69);
  const h = n(19);
  const f = n(88);
  const m = n(14);
  const v = n(7);
  const g = n(26);
  const
    b = function (e, t) {
      const n = {};
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
      if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
        let r = 0;
        for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
      }
      return n;
    };

  function y(e) {
    const t = e || {};
    const n = (t.children,
    t.$scopedSlots,
    t.slot,
    t.$isCustomComponent,
    b(t, ['children', '$scopedSlots', 'slot', '$isCustomComponent']));
    return (function () {
      if (void 0 === s) {
        const e = v.b.multiCfg;
        s = e && !0 === e.forbidReturnOwner ? e.forbidReturnOwner : g.a.getSwitch('forbidReturnOwner', !1);
      }
      return s;
    }()) && n && void 0 !== n.__owner && delete n.__owner,
    n;
  }

  const _ = n(17);
  const w = n(13);
  const C = n(97);
  const x = n(46);
  const T = n(41);

  function S(e, t) {
    return e ? (function (e) {
      return Array.isArray(e);
    }(e)) ? e.slice() : l()({}, e) : t ? [] : {};
  }

  function E(e, t, n, i, r) {
    const a = n[0];
    return (r && e === t || !e) && (e = S(t, typeof a === 'number')),
    n.length === 1 ? i(e, a) : (t && (t = t[a]),
    e[a] = E(e[a], t, n.slice(1), i, !0),
    e);
  }

  const k = {};

  function O(e, t, n) {
    void 0 === n && (n = []);
    for (var i = l()({}, e), r = function (e, r) {
        const a = r[e];
        const o = Object(C.a)(a);
        E(i, i, o, ((e, i) => {
          const r = t[a];
          return e[i] === r && r && typeof r === 'object' && n.push(a),
          e[i] = r,
          e;
        }
        ));
      }, a = 0, o = Object(_.a)(t); a < o.length; a++) {
      r(a, o);
    }
    if (n.length && Object(T.b)()) {
      const s = n.join('\', \'');
      k[s] || (k[s] = 1);
    }
    return Object(x.a)(i, e) ? e : i;
  }

  function P(e, t) {
    for (var n = l()({}, e), i = function (e, i) {
        const r = i[e];
        const a = Object(C.a)(r);
        E(n, n, a, ((e, n) => {
          let i = e[n];
          return Array.isArray(i) && ((i = i.concat()).splice.apply(i, t[r]),
          e[n] = i),
          e;
        }
        ));
      }, r = 0, a = Object(_.a)(t); r < a.length; r++) {
      i(r, a);
    }
    return Object(x.a)(n, e) ? e : n;
  }

  function N(e) {
    return e === w.h ? O : P;
  }

  const I = n(0);
  const A = n.n(I);
  const j = n(18);

  function R(e) {
    return e && e.memoizedProps || {};
  }

  function D(e) {
    const t = e.type;
    return t && t.$builtInCom;
  }

  function M(e, t) {
    const n = e.memoizedProps;
    return n && n.__owner === t;
  }

  let L;
  const F = 'classSelector';
  const
    V = 'idSelector';

  function U(e, t) {
    if (e === null || typeof e === 'string') return !1;
    switch (t.type) {
      case F:
        return (function (e, t) {
          let n = R(e = e.return).className || '';
          return (` ${n = String(n)
            .replace(/\s/g, ' ')} `).indexOf(` ${t} `) > -1;
        }(e, t.name));
      case V:
        return (function (e, t) {
          return R(e = e.return).id === t;
        }(e, t.name));
      default:
        return Object(m.d)()
          .consoleToWorker('warn', 'sjs: only support CLASS_SELECTOR & ID_SELECTOR'),
        !1;
    }
  }

  function B(e, t, n) {
    void 0 === n && (n = {});
    let i = [];
    if (typeof e !== 'string') {
      return Object(m.d)()
        .consoleToWorker('warn', 'sjs: Selector expects a string'),
      i;
    }
    const r = (function (e) {
      return function (t) {
        return U(t, e);
      };
    }(function (e) {
      return e[0] === '.' ? {
        type: F,
        name: e.slice(1)
      } : e[0] === '#' ? {
        type: V,
        name: e.slice(1)
      } : {};
    }(e)));
    return i = i.concat(function (e, t, n) {
      for (let i = n.single, r = void 0 === i || i, a = n.owner, o = [], s = e, c = e; ;) {
        if (t(c) && D(c) && M(c, a) && o.push(c.stateNode),
        r && o.length) {
          return o;
        }
        if (c.child) {
          c = c.child;
        } else {
          if (c === s) return o;
          for (; !c.sibling;) {
            if (!c.return || c.return === s) return o;
            c = c.return;
          }
          c = c.sibling;
        }
      }
    }(t, r, n));
  }

  const z = function (e, t) {
    return void 0 === t && (t = 1),
    L(e, t, 1);
  };

  function W(e) {
    return {
      selectAllComponents(t) {
        return e && e.$isCustomComponent ? (function (e, t) {
          return B(e, t && t._reactInternalFiber, {
            owner: t,
            single: !1
          });
        }(t, e)).filter(Boolean)
          .map(((e) => Object.freeze(z(W(e)))
          )) : [];
      },
      selectComponent(t) {
        if (!e || !e.$isCustomComponent) return null;
        const n = (function (e, t) {
          return B(e, t && t._reactInternalFiber, {
            owner: t
          })[0];
        }(t, e));
        return n ? Object.freeze(z(W(n))) : null;
      },
      addClass() {
        return e && e.$addClass && e.$addClass.apply(e, arguments),
        this;
      },
      removeClass() {
        return e && e.$removeClass && e.$removeClass.apply(e, arguments),
        this;
      },
      hasClass(t) {
        return !(!e || !e.$hasClass) && e.$hasClass(t);
      },
      getDataset() {
        let t = {};
        return e && e.props && e.props.$appx && (t = e.props.$appx.getDataset()),
        z(t);
      },
      callMethod(t, n) {
        let i;
        return n = n || {},
        (i = e && e.$isCustomComponent ? e : e && e.props && e.props.$appx && e.props.$appx.page) && i.callMethodFromSjs(t, z(n, 0)),
        this;
      },
      setStyle(t) {
        return e && e.$setStyle && e.$setStyle(z(t, 0)),
        this;
      }
    };
  }

  function H(e, t) {
    return !L && t && t.prefix && (L = t.prefix),
    function (n) {
      const i = W(e);
      return t(z(n), Object.freeze(z(i)));
    };
  }

  function X(e) {
    return typeof e === 'function' && e.sjs;
  }

  let Y;
  let $;
  const K = {
    componentWillUnmount() {
      Object(m.d)()
        .removeComponent(this);
    },
    $getEventHandler(e) {
      const t = this;
      if (X(e)) return H(this, e);
      if (!0 === e) return e;
      if (!e || typeof e !== 'string') return null;
      const n = this.eventHandlers;
      if (!n[e]) {
        const i = n[e] = function () {
          for (var n, i = arguments.length, r = new Array(i), a = 0; a < i; a++) r[a] = arguments[a];
          (n = Object(m.d)()).callRemotePage.apply(n, ['onComponentRenderEvent', t.id, e].concat(r));
        };
        i.handleName = e,
        i.type = 2,
        i.id = this.id;
      }
      return n[e];
    },
    callMethodFromSjs(e) {
      for (var t, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
      (t = Object(m.d)()).callRemotePage.apply(t, ['onComponentRenderEvent', this.id, e].concat(i));
    },
    $getRefHandler(e) {
      const t = this.getPluginId();
      return t && (e = Object(j.g)(t, e)),
      Object(m.d)()
        .getRefHandler(e);
    },
    setData(e, t) {
      let n = this.state.data;
      if (Array.isArray(e)) {
        for (let i = 0; i < e.length; i++) {
          const r = e[i];
          n = N(r.op)(n, r.data);
        }
      } else {
        n = N(e.op)(n, e.data);
      }
      this.setState({
        data: n
      }, t);
    },
    getRenderContent(e) {
      let t;
      let n;
      const
        i = y(this.props);
      return i.$slots = (t = this.props.children,
      n = {},
      A.a.Children.forEach(t, ((e) => {
        const t = e && e.props && e.props.slot || '$default';
        const i = n[t] || [];
        i.push(e),
        n[t] = i;
      }
      )),
      n),
      i.$scopedSlots = this.props.$scopedSlots,
      e()
        .call(this, l()({
          $id: this.id
        }, i, this.state.data));
    }
  };
  const q = n(56);
  const G = n(70);
  let
    J = 1;

  function Q() {
    Y = [],
    $ = [];
  }

  Q(),
  h.a.addListener(['beforePageReady', 'beforePageUpdate'], ((e) => {
    let t = e.payload;
    (Y.length || $.length) && (t = e.payload = l()({}, e.payload)),
    Y.length && (t[w.j] = Y),
    $.length && (t[w.m] = $),
    Q();
  }
  ));
  let Z = {};
  const ee = /^on[A-Z]/;
  const te = n(79);

  function ne(e) {
    return e.__componentContext || (e.__componentContext = {
      page: e.context.page,
      parent: e
    }),
    e.__componentContext;
  }

  let ie;
  let re;
  let ae;
  let oe;
  let se;
  let ce;
  var le = {
    classWithContext(e) {
      e.contextType = te.a;
    },
    updateDOMPath(e, t) {
      const n = (t || e.context).parent;
      e.indexInSiblings = ++n.domChildIndex,
      e.domPath = null;
    },
    getDOMPath(e) {
      if (!e.domPath) {
        const t = e.context.parent;
        e.domPath = `${le.getDOMPath(t)}-${e.indexInSiblings}`;
      }
      return e.domPath;
    },
    renderWithContext(e, t, n) {
      return e.domChildIndex = 0,
      n && (e.domPath = '1'),
      A.a.createElement(te.a.Provider, {
        value: n ? (i = e,
        i.__componentContext || (i.__componentContext = {
          page: i,
          parent: i
        }),
        i.__componentContext) : ne(e)
      }, t);
      let i;
    }
  };
  const ue = le;
  const
    pe = n(63);

  function de() {
    if (void 0 === ae) {
      const e = v.b.multiCfg;
      ae = !!e && (e.supportAppxSwitch ? g.a.getSwitch('outputComponent2TreeInfo245', !1) : e.outputComponent2TreeInfo);
    }
    return ae;
  }

  const he = n(43);

  function fe() {
    return (function () {
      if (void 0 === ie) {
        const e = v.b.multiCfg;
        ie = e && !0 === e.allowDynamicDefaultProps ? e.allowDynamicDefaultProps : g.a.getSwitch('allowDynamicDefaultProps', !1);
      }
      return ie;
    }()) && ((e = Object(he.b)()) && e.app && e.app.useDynamicPlugins);
    let e;
  }

  let me = {};
  let ve = {};

  function ge(e) {
    ve = l()(ve, e);
  }

  let be = {};

  function ye(e) {
    return (be = l()({
      data: {},
      pathIdMap: {}
    }, e)).plugin = l()({}, e.plugin),
    be.pathIdMap = l()({}, e.pathIdMap),
    be;
  }

  function _e(e) {
    const t = e.is;
    pe.a[t] = {
      system: e
    },
    d.a.registerComponent(t, (() => {
      let n;

      function i() {
        return n || (n = Object(q.a)(e.render)),
        n;
      }

      const r = p()({
        displayName: t,
        statics: {
          isCustomComponent: 1,
          is: t
        },
        mixins: [f.a, K],
        getDefaultProps() {
          return (function (e) {
            return (fe() ? me[e] || ve[e] : me[e]) || {};
          }(t));
        },
        getInitialState() {
          this.$isCustomComponent = 1,
          this.is = t,
          ue.updateDOMPath(this);
          const n = ue.getDOMPath(this);
          const i = this.id = be.pathIdMap[n];
          if (!this.id) {
            const r = `worker render components is not sync! can not find id from path: ${n}:${t}`;
            throw de() && this.context.page.outputComponent2TreeInfo({
              errorMessage: r,
              errorType: 'PATH_NOT_EXISTS_NOT_SYNC'
            }),
            new Error(r);
          }
          delete be.pathIdMap[n];
          const a = be.plugin[i];
          return a && (this.pluginId = a,
          delete be.plugin[i]),
          this.is = t,
          e.styleScope && (this.styleScope = Object(G.a)(e.styleScope)),
          this.context.page.addComponent(this),
          this.eventHandlers = {},
          {
            data: be.data[this.id] || {}
          };
        },
        componentWillReceiveProps() {
          ue.updateDOMPath(this);
        },
        $getComponentEventHandler(e) {
          return e;
        },
        getPluginId() {
          return this.pluginId;
        },
        render() {
          return ue.renderWithContext(this, this.getRenderContent(i));
        }
      });
      return ue.classWithContext(r),
      r;
    }
    ));
  }

  function we(e) {
    const t = e.is;
    return pe.a[t] = {
      system: e
    },
    e.component2 ? _e(e) : (function (e) {
      const t = e.is;
      d.a.registerComponent(t, (() => {
        let n;
        let
          i;

        function r() {
          return n || (n = Object(q.a)(e.render)),
          n;
        }

        function a() {
          return i || (i = Z[t] || {});
        }

        return p()({
          displayName: t,
          statics: {
            isCustomComponent: 1,
            is: t
          },
          mixins: [f.a, K],
          getDefaultProps() {
            return a().props || {};
          },
          getInitialState() {
            return this.$isCustomComponent = 1,
            this.is = t,
            e.styleScope && (this.styleScope = Object(G.a)(e.styleScope)),
            this.id = this.id || ++J,
            Object(m.d)()
              .addComponent(this),
            this.eventHandlers = {},
            this.componentEventHandlers = {},
            {
              data: l()({}, a().data)
            };
          },
          componentDidMount() {
            this.recordMounted(this.diffProps(a().props || {}), !0);
          },
          componentDidUpdate(e) {
            let t;
            const
              n = this.diffProps(e);
            n ? this.recordMounted(n) : Y.push(((t = {})[w.b] = this.id,
            t));
          },
          componentWillUnmount() {
            $.push(this.id);
          },
          recordMounted(e, n) {
            let i;
            const
              r = ((i = {})[w.b] = this.id,
              i);
            if (n && (r[w.c] = t),
            Y.push(r),
            e) {
              const a = this.normalizeProps(e);
              const o = a.newProps;
              const s = a.ownerId;
              r[w.a] = o,
              s && (r[w.e] = s);
            }
          },
          getPluginId() {
          },
          diffProps(e) {
            for (var t, n, i, r = this.props, a = [], o = {}, s = 0, c = Object(_.a)(y(e)); s < c.length; s++) {
              const l = c[s];
              l in r ? e[l] !== r[l] && (o[l] = r[l],
              t = !0) : (a.push(l),
              n = !0);
            }
            for (let u = 0, p = Object(_.a)(y(r)); u < p.length; u++) {
              const d = p[u];
              d in e || (o[d] = r[d],
              t = !0);
            }
            return t && ((i = i || {})[w.g] = o),
            n && ((i = i || {})[w.f] = a),
            i;
          },
          normalizeProps(e) {
            let t;
            const
              n = {};
            if (e[w.f] && (n[w.f] = e[w.f]),
            e[w.g]) {
              for (let i = n[w.g] = l()({}, e[w.g]), r = 0, a = Object(_.a)(i); r < a.length; r++) {
                const o = a[r];
                o.match(ee) && i[o] && (t = i[o][w.e],
                i[o] = i[o][w.d]);
              }
            }
            return {
              ownerId: t,
              newProps: n
            };
          },
          $getComponentEventHandler(e) {
            let t;
            if (!e || typeof e !== 'string') return null;
            const n = this.componentEventHandlers;
            return n[e] ? n[e] : (n[e] = ((t = {})[w.d] = e,
            t[w.e] = this.id,
            t),
            n[e]);
          },
          render() {
            return this.getRenderContent(r);
          }
        });
      }
      ));
    }(e));
  }

  const Ce = n(124);
  const xe = n(23);
  const Te = n.n(xe);
  const Se = n(15);
  const Ee = n(72);
  const ke = n(52);
  const Oe = /#([^?]+)(\?.+)?/;
  const Pe = '__appxPageId';
  const Ne = new RegExp(`[&?]${Pe}=(\\d+)(?:&|$)`);
  const Ie = 'i';
  const Ae = 's';
  const je = 'appxSystemFromWorker';
  const Re = 'a';
  const De = 'm';
  const Me = n(32);
  const Le = n(35);
  const Fe = n(86);
  const Ve = JSON.stringify;

  function Ue() {
  }

  function Be(e) {
    this.page = {
      pagePath: 'unknown'
    },
    this.callbacks = {},
    this.handles = {},
    this.pendings = [],
    this.pendingMessages = [],
    this.bridge = Le.a.bridge,
    this.secret = Fe.a,
    this.setParams(e),
    this.self = this;
  }

  Be.prototype = {
    constructor: Be,
    setParams(e) {
      const t = this;
      r()(this, e),
      this.port && (this.port.onmessage = function (e) {
        return t.onMessage(e);
      }
      );
    },
    setPage(e) {
      this.page = e,
      e.endpoint = this;
    },
    getCallbackId() {
      return this.callbackSeq = this.callbackSeq || 0,
      this.callbackSeq += 2,
      this.callbackSeq;
    },
    runBatch(e) {
      const t = this.isBatching;
      this.isBatching = !0;
      try {
        e();
      } finally {
        this.isBatching = t;
      }
    },
    flush() {
      for (let e = this.pendings, t = 0; t < e.length; t++) {
        const n = e[t];
        this.processData.apply(this, n);
      }
      this.pendings = [];
    },
    processData(e, t) {
      for (var n = this, i = e[De], r = e[Re], a = e.c, o = e.s, s = e.e, c = a && a.split('.') || [], l = this, u = 0; u < c.length; u++) {
        const p = c[u];
        l = l && l[p];
      }
      if (l) {
        let d;
        const
          h = r.concat();
        if (o ? h.push((function () {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          n.callRemote.apply(n, ['self', 'invokeCallback', o].concat(t));
        }
        )) : h.push(Ue),
        s ? h.push((function () {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          n.callRemote.apply(n, ['self', 'invokeCallback', s].concat(t));
        }
        )) : h.push(Ue),
        l[i]) {
          return void (d = l)[i].apply(d, h);
        }
      }
      Object(Se.a)('framework', `[${this.type}] Page ${this.page.pagePath} unhandled message`, t);
    },
    onData(e, t) {
      const n = e[De];
      const i = this.peek && this.peek(e, t);
      if (i === 'pending') {
        return n !== 'console' && Object(Se.a)('framework', `[${this.type}] Page ${this.page.pagePath} onPendingMessage`, e, t),
        void this.pendings.push([e, t]);
      }
      i !== 'cancel' && (n !== 'console' && Object(Se.a)('framework', `[${this.type}] Page ${this.page.pagePath} onMessage`, e, t),
      this.processData(e, t));
    },
    setCurrentDataLength(e) {
      this.currentDataLength = e;
    },
    getCurrentDataLength() {
      return this.currentDataLength;
    },
    onMessage(e) {
      const t = this;
      const n = e.data;
      let i = n;
      typeof n === 'string' && (this.setCurrentDataLength(n.length),
      i = JSON.parse(n));
      const r = i.data;
      Array.isArray(r) ? r.forEach(((e) => t.onData(e, i)
      )) : this.onData(r, i);
    },
    invokeCallback(e) {
      if (!this.unloaded) {
        const t = this.callbacks;
        if (t) {
          if (e && t[e]) {
            for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
            t[e].apply(t, i);
          }
          e % 2 == 0 && (e -= 1),
          delete t[e],
          delete t[e + 1];
        }
      }
    },
    generateOneMessage(e, t) {
      let n;
      if (!this.unloaded) {
        for (var i, r, a = arguments.length, o = new Array(a > 2 ? a - 2 : 0), s = 2; s < a; s++) o[s - 2] = arguments[s];
        return typeof o[o.length - 2] === 'function' ? (i = this.getCallbackId() - 1,
        this.callbacks[i] = o[o.length - 2],
        r = i + 1,
        this.callbacks[r] = o[o.length - 1],
        o.pop(),
        o.pop()) : typeof o[o.length - 1] === 'function' && (i = this.getCallbackId() - 1,
        this.callbacks[i] = o[o.length - 1],
        r = i + 1,
        o.pop()),
        (n = {}).c = e,
        n[De] = t,
        n.d = this.viewId,
        n.s = i,
        n.e = r,
        n[Re] = o,
        n;
      }
    },
    callRemoteBridge() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      this.callRemote.apply(this, ['bridge'].concat(t));
    },
    callRemotePage() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      this.callRemote.apply(this, ['page'].concat(t));
    },
    callRemoteSecret() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      this.callRemote.apply(this, ['secret'].concat(t));
    },
    callRemoteSelf() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      this.callRemote.apply(this, ['self'].concat(t));
    },
    callRemoteComponent(e) {
      for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
      this.callRemote.apply(this, [`page.refComponents.${e}`].concat(n));
    },
    callRemoteHandle() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      this.callRemote.apply(this, ['handles'].concat(t));
    },
    callRemotePlugin() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      this.callRemote.apply(this, ['secret.plugins'].concat(t));
    },
    callRemote() {
      this.isBatching || !this.port ? this.addPendingMessage.apply(this, arguments) : this.postMessage(this.generateOneMessage.apply(this, arguments));
    },
    addPendingMessage() {
      this.pendingMessages.push(this.generateOneMessage.apply(this, arguments));
    },
    unshiftPendingMessage() {
      this.pendingMessages.unshift(this.generateOneMessage.apply(this, arguments));
    },
    clearPendingMessages() {
      this.pendingMessages = [];
    },
    hasPendingMessages() {
      return !!this.pendingMessages.length;
    },
    flushPendingMessages(e) {
      const t = this.pendingMessages;
      this.pendingMessages = [],
      this.postMessage(t, e);
    },
    console: (function (e) {
      function t(t) {
        return e.apply(this, arguments);
      }

      return t.toString = function () {
        return e.toString();
      }
      ,
      t;
    }((function (e) {
      console[e].apply(console, [].slice.call(arguments, 1, -2));
    }
    ))),
    postMessage(e, t) {
      if (this.port) {
        try {
          this.port.postMessage(Ve({
            data: e,
            type: t
          }));
        } catch (t) {
          console.error(`when transfer page data or component data of page ${this.page.pagePath},data json stringify failed, please check data`, e),
          Object(Me.a)(t);
        }
        Object(Se.a)('framework', `[${this.type}] Page ${this.page.pagePath} postMessage`, {
          type: t,
          data: e
        });
      }
    },
    destroy() {
      this.port && (this.port.onmessage = null,
      this.port = null);
    }
  };
  const ze = n(55);
  const We = self;

  function He(e) {
    const t = e[De];
    const n = e[Re];
    const i = n && n[0] || {};
    const r = i.dynamicPlugins;
    const a = i.isRefresh;
    if ((function () {
      if (void 0 === re) {
        const e = v.b.multiCfg;
        re = e && !0 === e.allowDynamicPluginRefresh ? e.allowDynamicPluginRefresh : g.a.getSwitch('allowDynamicPluginRefresh', !1);
      }
      return re;
    }()) && a && t === 'startRender' && r) {
      return r;
    }
  }

  function Xe(e) {
    return new Promise((((t) => {
      let n;
      const i = e.queryString;
      const r = e.id;
      const a = e.pagePath;
      const o = new MessageChannel();
      var s = new Be({
        type: 'render',
        port: o.port1,
        peek(e, i) {
          const r = i.type;
          if (r === Ae) {
            return h.a.emit(je, e),
            'cancel';
          }
          if (r === Ie) {
            if (Object(Se.b)(`framework startup perf render: framework bundle start: ${We.__appxStartTime}`),
            Object(Se.b)(`framework startup perf render: framework bundle end: ${We.__appxEndTime}`),
            Object(Se.b)(`framework startup perf render: biz bundle start: ${Object(he.e)()}`),
            Object(Se.b)(`framework startup perf render: biz bundle end: ${Object(he.d)()}`),
            Object(Se.b)(`framework startup perf render: page start: ${Date.now()}`),
            !n) {
              n = e;
              const a = He(e);
              a ? Object(ze.a)(a, (() => {
                t(c);
              }
              )) : t(c);
            }
            return 'pending';
          }
          return s.page && s.page.pagePath !== 'unknown' ? void 0 : 'pending';
        }
      });
      var c = {
        flush() {
          s.flush();
        },
        initPage(e) {
          s.setPage(e),
          e.id = r,
          s.processData(n);
        }
      };
      const
        l = {
          pagePath: a,
          viewId: We.APVIEWID,
          id: r
        };
      i && (l.queryString = i),
      We.$appxServiceWorker.ready.then(((e) => {
        v.b.onInitMessageChannel(),
        e.active.postMessage(l, [o.port2]);
      }
      ));
    })
    ));
  }

  const Ye = n(24);
  const $e = n(60);
  const Ke = n(78);
  const qe = n(51);
  const Ge = {}.callBridge;
  const Je = {};
  const Qe = {};

  function Ze(e) {
    return new Promise((((t) => {
      et ? t() : Object(ze.a)(e, t);
    })
    ));
  }

  self.bootstrapSubPackage = function (e, t) {
    const n = t.success;
    Je[e] = 1,
    n(),
    Qe[e] && (Qe[e](),
    delete Qe[e]);
  };
  var et = void 0 !== Ke.a;

  function tt(e) {
    return new Promise((((t) => {
      !(function (e, t) {
        let n = `/${e}`;
        if (et) {
          Object(Ke.a)(`${n}/index.worker.js`),
          t();
        } else {
          const i = document.createElement('script');
          const r = self.appXRuntimeConfig;
          r && r.contextPath && (n = r.contextPath + n),
          i.src = `${n}/index.js`,
          document.head.appendChild(i),
          Qe[e] = t;
        }
      }(e, t));
    })
    ));
  }

  const nt = {};

  function it(e) {
    return nt[e] === 1 ? Promise.resolve() : nt[e] ? nt[e] : (nt[e] = new Promise((((t, n) => {
      function i() {
        nt[e] = 1,
        t();
      }

      const r = Object($e.a)().appxCli;
      const a = (function (e) {
        const t = e.indexOf('?');
        t !== -1 && (e = e.slice(0, t));
        const n = Object(he.b)();
        if (!n || !n.app.subPackages) return !1;
        for (let i = n.app.subPackages, r = 0; r < i.length; r++) {
          const a = i[r];
          const o = `${a.root}/`;
          if (Object(Ye.a)(e, o)) {
            for (let s = a.pages, c = void 0 === s ? [] : s, l = 0, u = c.length; l < u; l++) {
              if (o + c[l] === e) return a.root;
            }
          } else if (Object(Ye.a)(e, j.b)) {
            const p = e.match(/^plugin-private:\/\/([^\/]+)\/(.*)/);
            const d = p && p[1];
            if (d && a.plugins) {
              for (let h = 0, f = Object(qe.a)(a.plugins); h < f.length; h++) {
                if (f[h].provider === d) return !0;
              }
            }
          }
        }
        return !1;
      }(e));
      if (a) {
        const o = Le.a.bridge.call;
        if (Je[a]) {
          i();
        } else {
          et && o('showLoading');
          const s = function (t) {
            const r = void 0 === t ? {} : t;
            const o = r.plugins;
            const s = void 0 === o ? [] : o;
            const c = r.error;
            (void 0 === c ? void 0 : c) ? (v.b.multiCfg && v.b.multiCfg.skipKeepAlive && Ge('internalAPI', {
              method: 'skipKeepAlive',
              param: {}
            }),
            et && Le.a.bridge.call('hideLoading'),
            delete nt[e],
            n()) : Promise.all([Ze(s), tt(a)])
              .then((() => {
                et && Le.a.bridge.call('hideLoading'),
                i();
              }
              ));
          };
          r ? s() : o('loadSubPackage', {
            packages: [a]
          }, s);
        }
      } else {
        i();
      }
    })
    )),
    nt[e]);
  }

  const rt = n(105);
  const at = n(27);
  const ot = n.n(at);
  const st = /^\s+in\s+([^\s]+)/;
  const ct = /AppX\(([^\s]+)\)/g;
  const lt = n(34);
  const ut = navigator.userAgent;
  const pt = ut.indexOf('Language/en') > -1;
  const dt = ut.indexOf('Language/zh-HK') > -1;
  let ht = '系统错误，正在排查';
  let ft = '建议退出小程序后重新进入';
  let mt = '更新';
  let vt = '退出';
  pt ? (ht = 'System error, troubleshooting!',
  ft = 'It is recommended to reopen after exiting the mini program',
  mt = 'Update',
  vt = 'Exit') : dt && (ht = '人氣太旺，請稍後再試',
  ft = '建議退出小程序後重新進入');
  const gt = self;

  function bt() {
    let e;
    (e = gt.AlipayJSBridge).call.apply(e, arguments);
  }

  const yt = (function (e) {
    function t(t) {
      let n;
      return (n = e.call(this, t) || this).retry = function () {
        bt('updateApp');
      }
      ,
      n.exit = function () {
        bt('exitApp');
      }
      ,
      n.state = {
        errorMessage: '',
        icon: 'https://gw.alipayobjects.com/mdn/miniapp_de/afts/img/A*2kqdQo8Mia0AAAAAAAAAAABkARQnAQ'
      },
      n;
    }

    ot()(t, e),
    t.getDerivedStateFromError = function () {
      let e = '发生错误，请查看控制台!';
      return pt ? e = 'An error has occurred. Please check the console.' : dt && (e = '人氣太旺，請稍後再試'),
      {
        errorMessage: e
      };
    };
    const n = t.prototype;
    return n.componentDidMount = function () {
      const e = this;
      bt('getAppInfo', {
        appId: gt.AlipayJSBridge.startupParams.appId || '',
        stageCode: ''
      }, ((t) => {
        t.iconUrl && e.setState({
          icon: t.iconUrl
        });
      }
      ));
    }
    ,
    n.componentDidCatch = function (e, t) {
      e.type = 'SYSTEM_ERROR',
      Object(Me.a)(e);
      let n;
      let i;
      let
        r = e && e.message || '';
      r.indexOf('Minified React error') !== -1 && (r = '');
      try {
        r = `${r}\nPlease check your axml: \n${n = t.componentStack,
        i = Object(m.d)()
          .getPagePath(),
        void 0 === n && (n = ''),
        n.split('\n')
          .map(((e) => {
            if (e) {
              const t = e.match(st);
              const n = t && t[1];
              if (n && n !== 'ErrorBoundary') {
                return n === 'PageComponent' ? e.replace('PageComponent', i) : Object(Ye.a)(n, 'AppX') || Object(Ye.a)(n, '/') ? e.replace('PageComponent', i)
                  .replace(ct, ((e, t) => t
                  )) : void 0;
              }
            }
          }
          ))
          .filter(Boolean)
          .join('\n')}`;
      } catch (e) {
        console.error(e);
      }
      Object(m.d)()
        .consoleToWorker('warn', r);
    }
    ,
    n.render = function () {
      if (this.state.errorMessage) {
        const e = {
          backgroundImage: `url(${this.state.icon})`
        };
        return A.a.createElement('div', {
          className: 'a-page-result'
        }, A.a.createElement('div', {
          className: 'a-page-result-wrap'
        }, A.a.createElement('div', {
          className: 'a-page-result-pic-error',
          style: e
        }), A.a.createElement('div', {
          className: 'a-page-result-title'
        }, Object(T.a)() ? this.state.errorMessage : ht), A.a.createElement('div', {
          className: 'a-page-result-brief'
        }, ft)), A.a.createElement('div', {
          className: 'a-page-result-button-group'
        }, Object(T.a)() && !lt.a.ide ? A.a.createElement('a', {
          onClick: this.retry,
          className: 'a-page-result-button'
        }, mt) : null, lt.a.ide ? null : A.a.createElement('a', {
          onClick: this.exit,
          className: 'a-page-result-button'
        }, vt)));
      }
      return this.props.children;
    }
    ,
    t;
  }(A.a.Component));
  const _t = n(33);
  let wt = 0;
  const Ct = typeof performance === 'object' && performance && typeof performance.now === 'function' ? function () {
    return 1e3 * performance.now() + wt;
  }
    : function () {
      return 1e3 * Date.now();
    };

  function xt(e, t, n) {
    try {
      return e.apply(t, n);
    } catch (e) {
      console.error(e);
    }
  }

  function Tt(e) {
    switch (e) {
      case 'component::setData':
      case 'component::SpliceData':
      case 'page::setData':
      case 'page::spliceData':
        return `@${e}`;
      default:
        return `#${e}`;
    }
  }

  const St = (function () {
    function e() {
    }

    const t = e.prototype;
    return t.attachTracer = function (e) {
      this.tracer = e;
    }
    ,
    t.notifyPage = function () {
      (function () {
        if (void 0 === se) {
          const e = v.b.multiCfg;
          se = e && !0 === e.supportAppxSwitch ? g.a.getSwitch('reporterBehavior', 'Manual') : 'NotSync';
        }
        return se;
      }()) === 'NotSync' && this.startUpload();
    }
    ,
    t.startUpload = function () {
      const e = Object(m.d)();
      e && e.callRemotePage('uploadTrace');
    }
    ,
    t.uploadTrace = function (e) {
      this.uploadJSON([].concat(this.tracer.toDescriptors(), e), ((e, t) => {
        e ? Object(Se.a)('framework', '[TRACER] upload failed.') : t && t.url && (Object(Se.a)('framework', `[TRACER] upload succeeded, size: ${t.size}, ${t.url}`),
        Object(Me.a)(new Error(`[Tracer] trace data url: ${t.url}`)));
      }
      ));
    }
    ,
    t.uploadJSON = function (e, t) {
      let n;
      let i;
      const
        r = (void 0 === ce && (ce = g.a.getSwitch('reportConfig', {
          endpoint: 'https://basement-gzone.alipay.com',
          id: '5f69aaea5abc9d05553fd6b6',
          key: 'Fmpd8TVhNPcQnLXPxRKTHg38'
        })),
        ce);
      if (r) {
        const a = r.endpoint;
        const o = r.id;
        const s = r.key;
        n = {
          data: JSON.stringify(e),
          headers: {
            'x-base-id': o,
            'x-base-masterKey': s,
            'x-basement-file-content-type': 'application/json'
          },
          url: `${a}/api/1.0/files/internal?fileName=profile.json&targetEnv=PROD`,
          method: 'POST',
          onSuccess(e) {
            t(!1, e);
          },
          onFail() {
            t(!0);
          }
        },
        (i = self.AlipayJSBridge) && !i.startupParams.fromTR ? (n.headers = l()({}, n.headers, {
          'Content-Type': 'application/text'
        }),
        i.call('httpRequest', n, ((e) => {
          try {
            n.onSuccess(JSON.parse(e.data));
          } catch (e) {
            n.onFail(e);
          }
        }
        ))) : n.onSuccess({});
      }
    }
    ,
    e;
  }());
  const Et = (function () {
    function e(e, t, n) {
      this.jobId = e,
      this.jobName = t,
      this.tracer = n,
      this.events = [],
      this.start = Ct();
    }

    const t = e.prototype;
    return t.clean = function () {
      this.events = [];
    }
    ,
    t.getDescriptors = function () {
      return this.events.reduce(((e, t) => e.concat(t.toDescriptors())
      ), []);
    }
    ,
    t.markJobEnd = function (e, t) {
      void 0 === e && (e = this.start),
      void 0 === t && (t = Ct()),
      this.start = e,
      this.duration = t - e || 0.1;
      try {
        this.tracer.jobStack.pop();
      } catch (e) {
        throw new Error('[AppxTracer] no availble job to end.');
      }
    }
    ,
    e;
  }());
  const kt = (function () {
    function e(e, t, n, i, r) {
      this.mType = e,
      this.tType = t,
      this.eventId = n,
      this.name = i,
      this.args = r,
      this.type = 1,
      this.start = Ct();
    }

    const t = e.prototype;
    return t.toDescriptors = function () {
      return void 0 === this.duration && this.markEventEnd(),
      [{
        args: l()({
          eventId: this.eventId
        }, this.args),
        cat: this.mType,
        dur: this.duration,
        name: this.name,
        ph: 'X',
        pid: this.tType,
        tid: 0,
        ts: this.start
      }];
    }
    ,
    t.markEventEnd = function (e, t) {
      return void 0 === e && (e = this.start),
      void 0 === t && (t = Ct()),
      this.start = e,
      this.duration = t - this.start || 0.1,
      this.duration;
    }
    ,
    e;
  }());

  function Ot(e) {
    switch (e) {
      case 0:
        return 'Render';
      case 1:
        return 'Worker';
      default:
        return 'anonymous';
    }
  }

  const Pt = (function () {
    function e(e) {
      this.type = e,
      this.nextUniqueId = 1,
      this.jobs = [],
      this.jobStack = [];
    }

    const t = e.prototype;
    return t.addReporter = function (e) {
      this.reporter = e,
      e.attachTracer(this);
    }
    ,
    t.getReporter = function () {
      return this.reporter;
    }
    ,
    t.toDescriptors = function () {
      const e = [{
        args: {
          name: Ot(this.type)
        },
        cat: 'process_name',
        name: 'process_name',
        ph: 'M',
        pid: this.type,
        ts: 0
      }];
      return this.jobs.reduce(((e, t) => e.concat(t.getDescriptors())
      ), e);
    }
    ,
    t.getNextUniqueId = function () {
      return this.nextUniqueId++;
    }
    ,
    t.createJob = function (e, t) {
      const n = new Et(e, t, this);
      return this.jobs.push(n),
      this.jobStack.push(n),
      n;
    }
    ,
    t.createEvent = function (e, t, n) {
      const i = this.getCurrentJob();
      const r = new kt(e, this.type, this.getNextUniqueId(), t, n);
      return i.events.push(r),
      r;
    }
    ,
    t.getCurrentJob = function () {
      const e = this.jobStack[this.jobStack.length - 1];
      if (e) return e;
      throw new Error('No job in jobStack');
    }
    ,
    e;
  }());
  const Nt = [null, null];

  function It(e) {
    return Nt[e] || (wt = 1e3 * Date.now() - Ct(),
    Nt[e] = new Pt(e)),
    Nt[e];
  }

  function At() {
    return Nt[0];
  }

  function jt(e) {
    return {
      all(t, n) {
        !(function (e, t, n) {
          const i = e.prototype[t];
          e.prototype[t] = function () {
            let e;
            let t;
            let r;
            const a = Ct();
            const o = xt(n.before, null, [this, arguments]);
            let
              s = arguments;
            if (o) {
              e = o[0];
              const c = o[1];
              s = void 0 === c ? arguments : c;
            }
            try {
              t = i.apply(this, s);
            } catch (e) {
              r = e,
              !0;
            }
            return xt(n.after, null, [this, [e, s, r], t, a]);
          };
        }(e, t, n));
      },
      before(t, n) {
        !(function (e, t, n) {
          const i = e.prototype[t];
          e.prototype[t] = function () {
            const e = xt(n, null, [this, arguments]) || arguments;
            i.apply(this, e);
          };
        }(e, t, n));
      },
      after(t, n) {
        !(function (e, t, n) {
          const i = e.prototype[t];
          e.prototype[t] = function () {
            let e;
            let t;
            const
              r = Ct();
            try {
              t = i.apply(this, arguments);
            } catch (t) {
              e = t,
              !0;
            }
            return xt(n, null, [this, arguments, e, t, r]);
          };
        }(e, t, n));
      }
    };
  }

  function Rt(e) {
    return {
      all(t, n) {
        !(function (e, t, n) {
          const i = e.getProperty(t);
          e.setProperty(t, (function (e) {
            let t;
            let r;
            let a;
            const o = Ct();
            const s = xt(n.before, null, [e, arguments]);
            let
              c = arguments;
            if (s) {
              t = s[0];
              const l = s[1];
              c = void 0 === l ? arguments : l;
            }
            try {
              r = i.apply(e, c);
            } catch (e) {
              !0,
              a = e;
            }
            return xt(n.after, null, [e, [t, c, a], r, o]);
          }
          ));
        }(e, t, n));
      },
      before(t, n) {
        !(function (e, t, n) {
          const i = e.getProperty(t);
          e.setProperty(t, (function (e) {
            const t = xt(n, null, [e, arguments]) || arguments;
            return i.apply(e, t);
          }
          ));
        }(e, t, n));
      },
      after(t, n) {
        !(function (e, t, n) {
          const i = e.getProperty(t);
          e.setProperty(t, (function (e) {
            let t;
            let r;
            const
              a = Ct();
            try {
              r = i.apply(e, arguments);
            } catch (e) {
              t = e,
              !0;
            }
            return xt(n, null, [e, arguments, t, r, a]);
          }
          ));
        }(e, t, n));
      }
    };
  }

  function Dt(e) {
    void 0 === e && (e = []);
    const t = It(0);
    return t.createJob(1, 'Client'),
    t.addReporter(new St()),
    e.forEach(((e) => {
      t.createEvent(e.method, Tt(e.method), e.payload)
        .markEventEnd(e.start);
    }
    )),
    (function (e) {
      const t = Rt((n = ue,
      {
        getProperty(e) {
          return n[e];
        },
        setProperty(e, t) {
          n[e] = t;
        }
      }));
      let n;
      t.after('updateDOMPath', ((t, n, i, r, a) => {
        const o = n[0];
        const s = (n[1] || o.context).parent;
        e.createEvent('updateDOMPath', Tt('updateDOMPath'), {
          instance: {
            indexInSiblings: o.indexInSiblings,
            path: o.is
          },
          parent: {
            domChildIndex: s.domChildIndex,
            path: s.is || s.pagePath
          }
        })
          .markEventEnd(a);
      }
      )),
      t.after('getDOMPath', ((t, n, i, r, a) => {
        const o = n[0];
        return e.createEvent('getDOMPath', Tt('getDOMPath'), {
          instance: {
            domPath: r,
            path: o.pagePath || o.is
          }
        })
          .markEventEnd(a),
        r;
      }
      )),
      t.after('renderWithContext', ((t, n, i, r, a) => {
        const o = n[0];
        return e.createEvent('renderWithContext', Tt('renderWithContext'), {
          instance: {
            path: o.pagePath || o.is
          }
        })
          .markEventEnd(a),
        r;
      }
      ));
    }(t)),
    (function (e) {
      const t = jt(Be);
      t.all('onMessage', {
        before(t, n) {
          return [e.createEvent('onMessage', Tt('onMessage'), {
            message: JSON.parse(n[0].data)
          })];
        },
        after(e, t, n, i) {
          t[0].markEventEnd(i);
        }
      }),
      t.after('postMessage', ((t, n, i, r, a) => {
        const o = n[0];
        return e.createEvent('postMessage', Tt('postMessage'), {
          message: {
            data: o
          }
        })
          .markEventEnd(a),
        r;
      }
      ));
    }(t)),
    t;
  }

  let Mt;
  const
    Lt = (function () {
      function e() {
        this.state = 0,
        this.traces = [];
      }

      const t = e.prototype;
      return t.add = function (e) {
        this.traces.push(e);
      }
      ,
      t.release = function () {
        this.traces = [];
      }
      ,
      t.getCurrentState = function () {
        return this.state;
      }
      ,
      t.setState = function (e) {
        this.state = e;
      }
      ,
      t.getTraces = function () {
        return this.traces;
      }
      ,
      e;
    }());

  function Ft() {
    return Mt || (Mt = new Lt()),
    Mt;
  }

  const Vt = navigator.serviceWorker;
  const Ut = self;

  function Bt(e) {
    if (void 0 === e && (e = {}),
    e.error) {
      const t = e.errorMessage || e.error;
      console.error('[framework] bridge postMessage error', t);
    }
  }

  function zt(e, t, n) {
    return (function (e, t) {
      return new Promise((((n, i) => {
        let r = e;
        r.charAt(0) !== '/' && (r = `/${r}`),
        r = `${location.protocol}//${location.host}${r}`;
        const a = Vt.controller;
        if (a) {
          const o = a.scriptURL;
          console.log('[framework] sw urls', r, o),
          r !== o ? Vt.getRegistration(t)
            .then(((e) => {
              if (!e) return n(r);
              e.unregister()
                .then(((e) => {
                  e ? console.log('[framework] sw unregister', a.state) : console.error('[framework] sw unregister unknown error'),
                  n(r);
                }
                ))
                .catch(((e) => {
                  console.error('[framework] sw unregister error', e),
                  i(e);
                }
                ));
            }
            )) : n(r);
        } else {
          Vt ? n(r) : (console.error('[framework] service worker not implemented!!!!'),
          i(new Error('service worker not implemented')));
        }
      })
      ));
    }(e, n)).then((() => Vt.register(e, {
      scope: n
    })
    ))
      .then((() => (function (e) {
        return Vt.ready.then(((t) => {
          if (t.pushManager && e) {
            return t.pushManager.subscribe({
              userVisibleOnly: !0
            })
              .then(((t) => {
                const n = t.applicationId;
                e.call('setServiceWorkerID', {
                  id: n
                });
              }
              ))
              .catch(((e) => {
                throw console.error('[framework] pushManager error', e),
                e;
              }
              ));
          }
        }
        ));
      }(t))
      ));
  }

  function Wt(e) {
    let t = 1;
    const n = {};
    let i = [];
    document.addEventListener('message', ((e) => {
      const t = e.data;
      if (t && t.type === 'messagePort') {
        const i = t.msgPortId;
        i && n[i] ? (n[i].postMessage(t.data),
        (function (e) {
          const t = Ft();
          if (t.getCurrentState() === 0) {
            const n = {
              start: 1e3 * Date.now(),
              method: 'onMessage',
              payload: JSON.parse(e)
            };
            t.add(n),
            t.setState(1);
          }
        }(t.data))) : console.error('[framework] unknown message', e);
      }
    }
    ));
    var r = {
      controller: {
        postMessage(i, r) {
          const a = r && r[0];
          if (a) {
            const o = ++t;
            n[o] = a,
            a.onmessage = function (t) {
              e.call('postMessage', {
                type: 'messagePort',
                data: t.data,
                msgPortId: o
              }, Bt);
            }
            ,
            e.call('postMessage', {
              data: i,
              eventPorts: [{
                id: o
              }]
            }, Bt);
          }
        }
      },
      _isServiceWorkerReady: !1,
      _readyCallback() {
        if (i && i.length > 0) {
          for (let e = 0, t = i; e < t.length; e++) {
            const n = t[e];
            if (n && n.callback) {
              try {
                n.callback({
                  active: r.controller,
                  scope: this.scope
                }),
                n.resolve && n.resolve({
                  active: r.controller,
                  scope: this.scope
                });
              } catch (e) {
                n.reject && n.reject(e);
              }
            }
          }
          i = [];
        }
        this._isServiceWorkerReady = !0;
      },
      register(t, n) {
        void 0 === n && (n = {});
        const i = this;
        let a = t;
        const o = n.scope;
        if (o && (r.scope = o),
        a.charAt(0) !== '/') {
          const s = location.pathname;
          const c = s.lastIndexOf('/');
          a = s.slice(0, c + 1) + a;
        }
        return a = `${location.protocol}//${location.host}${a}`,
        new Promise((((t, n) => {
          e.call('registerWorker', {
            worker: a
          }, ((e) => {
            if (e.error) {
              const a = e.errorMessage || e.error;
              n(new Error(a));
            } else {
              t({
                active: r.controller,
                scope: o
              }),
              i._readyCallback();
            }
          }
          ));
        })
        ));
      },
      ready: {
        then(e) {
          let t;
          if (r._isServiceWorkerReady) {
            t = new Promise((((t, n) => {
              try {
                e({
                  active: r.controller,
                  scope: r.scope
                }),
                t({
                  active: r.controller,
                  scope: r.scope
                });
              } catch (e) {
                n(e);
              }
            })
            ));
          } else {
            const n = {
              callback: e,
              resolve() {
              },
              reject(e) {
                console.error('[framework]', e);
              }
            };
            t = new Promise((((e, t) => {
              n.resolve = e,
              n.reject = t;
            })
            )),
            i.push(n);
          }
          return t;
        }
      }
    };
    return r;
  }

  function Ht(e) {
    Ut.$appxServiceWorker || (lt.a.browser === 'ios' || lt.a.ide || Object(_t.a)().enablePolyfillWorker ? Ut.$appxServiceWorker = Wt(e) : Ut.$appxServiceWorker = {
      get controller() {
        return Vt.controller;
      },
      get ready() {
        return Vt.ready;
      },
      register(t, n) {
        const i = n.scope;
        return zt(t, e, i);
      }
    });
  }

  const Xt = n(95);
  const Yt = n(98);

  function $t(e, t, n) {
    let i;
    let r;
    let a;
    const
      o = e && e.match(t);
    i = o && o[1];
    const s = o && o[2];
    if (i) {
      const c = i.match(/^([^@]+)@?(.*)/);
      r = c && c[2],
      (a = c && c[1]) && (e = Object(j.f)(a, n ? n(a, s) : s));
    }
    return {
      pagePath: e,
      domain: i,
      pluginId: a,
      version: r || '*'
    };
  }

  const Kt = self;

  function qt(e) {
    e();
  }

  function Gt(e, t, n, i) {
    let r;
    const a = (function (e) {
      let t;
      const n = e && e.match(Oe);
      let
        i = n && n[1];
      i && i.charAt(0) === '/' && (i = i.slice(1));
      let r = n && n[2] || '';
      const a = r.match(Ne);
      return a && (t = parseInt(a[1], 10),
      r = r.replace(Ne, '')),
      r.charAt(0) === '?' && (r = r.slice(1)),
      void 0 === t && (t = Object(ke.b)(i) ? Object(ke.a)(i) : 0),
      {
        id: t,
        pagePath: i,
        queryString: r
      };
    }(location.href));
    const o = (function (e) {
      const t = e.pagePath;
      return Object(Ye.a)(t, j.b) ? $t(t, /^plugin-private:\/\/([^\/]+)\/(.*)/) : Object(Ye.a)(t, j.a) ? $t(t, /^dynamic-plugin:\/\/([^\/]+)\/(.*)/, j.d) : {
        pagePath: t
      };
    }(a));
    const s = o.pagePath;
    const c = o.domain;
    const
      l = o.pluginId;
    if (s) {
      const u = [it(s), (r = Kt.__appxPlugins,
      new Promise((((e) => {
        Object(ze.a)(r, e);
      })
      )))];
      (function (e, t, n) {
        if (void 0 === e && (e = []),
        !t) {
          return !1;
        }
        if (n = n || t,
        Array.isArray(e)) {
          for (let i = 0, r = e; i < r.length; i++) {
            const a = r[i];
            const o = a && a.match(/__plugins__\/([^\/]+)\//);
            if ((o && o[1]) === n) return !1;
          }
        }
        return !0;
      }(Kt.__appxPlugins, c, l)) && u.push(function (e) {
        return new Promise((((t, n) => {
          (0,
          Le.a.bridge.call)('internalAPI', {
            method: 'loadPlugin',
            param: {
              plugin: e
            }
          }, ((e) => {
            void 0 === e && (e = {}),
            e.error ? n('render loadPlugin failed') : Object(ze.a)([e.url], t);
          }
          ));
        })
        ));
      }(c));
      const p = Promise.all(u);
      p.then((() => {
        Ee.a.getComponent(s) && Object(rt.a)(s);
      }
      ));
      const d = p.then((() => Ee.a.getComponent(s) && Object(Xt.a)(s)
      ));
      Promise.all([Xe(a), d])
        .then(((r) => {
          const a = r[0];
          const o = Ee.a.getComponent(s);
          if (o) {
            Object(Se.b)('framework: Render page', s),
            t && t(i);
            const c = A.a.createElement(yt, null, A.a.createElement(o, {
              pagePath: s,
              messageChannel: a
            }));
            !!document.querySelector('.a-page') && !1 !== Object($e.a)().useHydrate ? Te.a.hydrate(c, e) : Te.a.render(c, e),
            a.flush();
          } else {
            !(function (e, t) {
              const n = Object(Yt.c)(e);
              t && t(n);
            }(s, n));
          }
        }
        ))
        .catch(((e) => {
          console.error(e),
          Object(Me.a)(e);
        }
        ));
    }
  }

  h.a.addListener(je, ((e) => {
    const t = e.code;
    const n = e.e;
    if (e.type !== 'event_for_page_not_found') {
      if (t && n) {
        const i = document.getElementById('__react-content');
        v.b.onSystemWorkerError({
          code: t,
          e: n,
          container: i,
          page: i && i.querySelector('.a-page')
        });
      }
    } else {
      v.b.onPageNotFoundEvent({
        code: t,
        e: n
      });
    }
  }
  )),
  Kt.bootstrapApp = function (e) {
    const t = e.onReady;
    const n = void 0 === t ? qt : t;
    const i = e.worker;
    h.a.addListener('afterStartRender', (() => {
      if (function () {
        if (void 0 === oe) {
          const e = v.b.multiCfg;
          oe = !(!e || !0 !== e.setupAppxTracer) || g.a.getSwitch('setupAppxTracer', !1);
        }
        return oe;
      }()) {
        const e = Dt(Ft()
          .getTraces());
        Kt.$AppxTracer = e;
      }
      !(function () {
        const e = Ft();
        e.getCurrentState() === 1 && (e.release(),
        e.setState(2));
      }());
    }
    )),
    n(((e) => {
      void 0 === e && (e = {}),
      Object($e.b)(v.b.getStartupParams()),
      Ht(e.bridge),
      v.b.beforeRegisterWorker(),
      (function (e) {
        const t = e.onReady;
        const n = e.worker;
        const i = void 0 === n ? 'index.worker.js' : n;
        const r = e.container;
        const a = void 0 === r ? document.getElementById('__react-content') : r;
        const o = e.onRender;
        const s = e.onSuccess;
        const c = e.onFail;
        Object(Se.a)('framework', '[RENDER] Load worker url', i),
        Object(Se.b)(`framework [RENDER] Load worker url${i}`);
        const l = Kt.$appxServiceWorker;
        l.register(i, {
          scope: './'
        })
          .then((() => {
            l.ready.then((() => {
              t && t(),
              location.hash.length > 1 ? (Object(Se.a)('framework', '[RENDER] render page when sw ready'),
              Gt(a, o, c, 'initial hash')) : (Object(Se.b)(`framework [render] addEventListener hashchange start ${location.hash}`),
              window.addEventListener('hashchange', (() => {
                Object(Se.b)(`framework [RENDER] render page when hashchange ${location.hash}`),
                Gt(a, o, c, 'hashchange');
              }
              ), !1),
              Object(Se.b)(`framework [render] addEventListener hashchange end ${location.hash}`));
            }
            )),
            s && s(),
            Object(Se.b)('framework: Register worker succeeded.', i);
          }
          ))
          .catch(((e) => {
            c && c(e),
            Object(Se.b)(`framework: Register worker failed with ${e.stack || e} ${i}`);
          }
          ));
      }({
        worker: v.b.getWorkerUrl(i),
        onReady: v.b.onRegisterWorkerReady,
        onFail: v.b.onRegisterWorkerFail,
        onSuccess: v.b.onRegisterWorkerSuccess,
        onRender: v.b.onPageRender
      }));
    }
    ));
  };
  let Jt;
  let Qt;
  let Zt;
  let en;
  let tn;
  const nn = function (e, t) {
    e[t ? 'changedTouches' : 'touches'] = [{
      identifier: 0,
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      target: e.target
    }];
  };
  let rn = null;
  let an = null;
  let on = 0;
  let sn = 0;
  let cn = 0;
  let ln = null;
  let un = !1;
  let pn = !1;
  let dn = !1;
  let
    hn = !0;
  const fn = function (e, t, n) {
    const i = new CustomEvent(t, n);
    e.target.dispatchEvent(i);
  };
  const mn = function (e) {
    for (; e; e = e.parentNode) if (e.__scrolling && Date.now() - e.__scrolling < 50) return !0;
    return !1;
  };
  const vn = self;
  const gn = function () {
    an && (an = clearTimeout(an));
  };
  const bn = function (e, t, n, i) {
    if (on) {
      if (gn(),
      on = 0,
      i && (e = ln,
      t = sn,
      n = cn),
      !Jt || Date.now() - Jt.__scrolling > 1e3) {
        setTimeout((() => {
          wn(e, t, n, i);
        }
        ), 0);
      } else {
        let r = 0;
        Qt > 25 && Qt <= 50 ? r = 80 : Qt > 50 && Qt <= 150 ? r = 200 : Qt > 150 && (r = 300),
        rn = setTimeout((() => {
          wn(e, t, n, i, !0);
        }
        ), r);
      }
    }
  };
  const yn = function (e, t, n) {
    on && Math.abs(t - sn) < 5 && Math.abs(n - cn) < 5 || (gn(),
    on = 0);
  };
  const _n = function (e, t, n) {
    on || (pn = !1,
    (on = e.timeStamp) === 0 && 'onpointerdown' in document && (function () {
      if (void 0 === en) {
        const e = v.b.multiCfg;
        en = e && !0 === e.fixMouseEvent ? e.fixMouseEvent : g.a.getSwitch('fixMouseEvent242', !1);
      }
      return en;
    }()) && (on = Date.now()),
    an && (an = clearTimeout(an)),
    rn && (rn = clearTimeout(rn)),
    mn(e.target) ? un = !0 : (un = !1,
    an = setTimeout((() => {
      fn(e, 'longtap', {
        detail: {
          pageX: t,
          pageY: n,
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          nativeEvent: {}
        },
        bubbles: !0
      }),
      pn = !0;
    }
    ), 350)),
    sn = t,
    cn = n,
    ln = e);
  };
  var wn = function (e, t, n, i, r) {
    r && mn(e.target) && (un = !0),
    i || un || pn || fn(ln, 'tap', {
      detail: {
        pageX: t,
        pageY: n,
        clientX: ln.touches[0].clientX,
        clientY: ln.touches[0].clientY,
        nativeEvent: {}
      },
      bubbles: !0
    });
  };
  vn.addEventListener('scroll', ((e) => {
    Jt = e.target !== document ? e.target : document.documentElement.scrollTop ? document.documentElement : document.body;
    const t = Date.now();
    const n = Jt.__scrolling ? Date.now() - Jt.__scrolling : 0;
    Qt = n < 500 ? Qt ? (n + Qt) / 2 : n : 0,
    rn && (rn = clearTimeout(rn)),
    Jt.__scrolling = t;
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('touchstart', ((e) => {
    Zt && (Zt = clearTimeout(Zt)),
    dn = !0,
    hn = !1,
    e.touches.length === 1 && _n(e, e.touches[0].pageX, e.touches[0].pageY);
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('touchmove', ((e) => {
    e.touches.length === 1 ? yn(0, e.touches[0].pageX, e.touches[0].pageY) : (gn(),
    on = 0);
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('touchend', ((e) => {
    Zt = setTimeout((() => {
      dn = !1;
    }
    ), 100),
    e.changedTouches.length === 1 && bn(e, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('touchcancel', (() => {
    Zt = setTimeout((() => {
      dn = !1;
    }
    ), 100),
    bn(null, 0, 0, !0);
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('mousedown', ((e) => {
    (function () {
      if (void 0 === tn) {
        const e = v.b.multiCfg;
        tn = e && !0 === e.deepCheckTouchSupport ? e.deepCheckTouchSupport : g.a.getSwitch('deepCheckTouchSupport247', !1);
      }
      return tn;
    }()) && !dn && (dn = !hn),
    hn = !0,
    dn || (nn(e, !1),
    _n(e, e.pageX, e.pageY));
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('mousemove', ((e) => {
    dn || yn(0, e.pageX, e.pageY);
  }
  ), {
    capture: !0,
    passive: !1
  }),
  vn.addEventListener('mouseup', ((e) => {
    dn || (nn(e, !0),
    bn(e, e.pageX, e.pageY));
  }
  ), {
    capture: !0,
    passive: !1
  });
  const Cn = n(42);

  function xn(e) {
    h.a.addListener('pagePerf', ((t) => {
      const n = t.page;
      const i = t.transferStart;
      const r = t.transferEnd;
      const a = t.renderStart;
      const o = t.renderEnd;
      const s = t.dataLen;
      Object(Cn.b)(e.onPagePerf, {
        page: n.publicInstance,
        transferStart: i,
        transferEnd: r,
        renderStart: a,
        renderEnd: o,
        dataLen: s
      });
    }
    ));
  }

  const Tn = {};
  ['warn', 'error', 'log', 'debug', 'info', 'group', 'groupEnd'].forEach(((e) => {
    Tn[e] = function () {
      for (var t, n = arguments.length, i = new Array(n), r = 0; r < n; r++) i[r] = arguments[r];
      (t = Object(m.d)()).consoleToWorker.apply(t, [e].concat(i));
    };
  }
  ));
  const Sn = Tn;
  const En = n(94);
  const kn = {
    getInitialState() {
      return this.refHandlers = {},
      this.refComponents = {},
      {};
    },
    $getRefHandler(e) {
      const t = this.getPluginId();
      return t && (e = Object(j.g)(t, e)),
      this.getRefHandler(e);
    },
    getRefHandler(e) {
      const t = this;
      return this.refHandlers[e] ? this.refHandlers[e] : (this.refHandlers[e] = function (n) {
        let i = n;
        i && i.getWrappedComponent && (i = i.getWrappedComponent()),
        t.refComponents[e] = i;
      }
      ,
      this.refHandlers[e]);
    }
  };

  function On(e) {
    return e && !!Object(_.a)(e).length;
  }

  const Pn = n(45);
  const Nn = {
    initComponentInstances() {
      this.componentInstances = {};
    },
    getAllComponents() {
      return Object(qe.a)(this.componentInstances);
    },
    getComponentById(e) {
      return this.componentInstances[e];
    },
    addComponent(e) {
      this.componentInstances[e.id] = e;
    },
    removeComponent(e) {
      delete this.componentInstances[e.id];
    }
  };
  const In = n(53);
  const An = n(31);
  const jn = self;
  const Rn = n(50);
  h.a.addListener(['beforePageReady'], ((e) => {
    let t;
    let n;
    const
      i = e.page;
    Object(An.k)(((t = {})[An.a] = i.$readyTime,
    t[An.e] = i.$readyTime,
    t[An.j] = v.b.now(),
    t)),
    e.payload = l()({}, e.payload, ((n = {})[w.l] = An.l,
    n));
  }
  ));
  const Dn = {};
  const Mn = self;
  const Ln = l()({}, Nn, {
    setId(e) {
      this.id = e;
    },
    getId() {
      return this.id;
    },
    setPagePath(e) {
      this.pagePath = e;
    },
    getPagePath() {
      return this.pagePath;
    },
    setEndpoint(e) {
      this.endpoint = e,
      e.setPage(this);
    },
    clearEndPort() {
      this.endpoint.destroy(),
      this.endpoint = null;
    },
    callRemotePage() {
      let e;
      !this.unloaded && this.endpoint && (e = this.endpoint).callRemotePage.apply(e, arguments);
    },
    callRemoteBridge() {
      let e;
      !this.unloaded && this.endpoint && (e = this.endpoint).callRemoteBridge.apply(e, arguments);
    },
    callRemoteSecret() {
      let e;
      !this.unloaded && this.endpoint && (e = this.endpoint).callRemoteSecret.apply(e, arguments);
    },
    callRemoteComponent() {
      let e;
      !this.unloaded && this.endpoint && (e = this.endpoint).callRemoteComponent.apply(e, arguments);
    },
    isRemoteReady() {
      return !(!this.endpoint || !this.endpoint.port);
    },
    callRemotePlugin() {
      let e;
      !this.unloaded && this.endpoint && (e = this.endpoint).callRemotePlugin.apply(e, arguments);
    }
  }, {
    getInitialState() {
      const e = this;
      return Nn.initComponentInstances.call(this),
      this.$isCustomComponent = 1,
      this.pagePath = this.props.pagePath,
      this.pageType = 'RENDER',
      l()(this, {
        bridge: Le.a.bridge,
        eventHandlers: {},
        componentEventHandlers: {},
        self: this,
        viewId: Mn.APVIEWID,
        publicInstance: {
          $viewId: Mn.APVIEWID,
          route: this.pagePath,
          get data() {
            return e.state.data;
          },
          setData() {
            throw new Error('render does not support setData!');
          }
        }
      }),
      Object(m.g)(this),
      e.$page = this,
      this.props.messageChannel.initPage(this),
      this.startRenderTime = v.b.now(),
      this.state || {};
    },
    changeFontSizeSetting(e) {
      this.fontSizeSettingLevel = e,
      this.refreshFontSizeSetting();
    },
    refreshFontSizeSetting() {
      this.fontSizeSettingLevel && this.root && this.root.setAttribute && this.root.setAttribute('data-x-useragent-fontsize-level', this.fontSizeSettingLevel);
    },
    componentDidUpdate() {
      this.refreshFontSizeSetting();
    },
    componentDidMount() {
      if (this.$readyTime = v.b.now(),
      !this.startRenderConfig) {
        throw new Error('page missing startRender!');
      }
      const e = this.startRenderConfig;
      const t = e.workerTime;
      const n = e.isRefresh;
      this.logRenderTime([t, this.startRenderTime]);
      const i = this.publicInstance;
      const r = {
        page: this
      };
      Object(Se.b)(`framework startup perf render: page end: ${v.b.now()}`),
      h.a.emit(['beforePageLoad', 'beforePageReady'], r);
      const a = r.payload;
      const o = On(a);
      n ? o && this.callRemotePage('update', a) : this.callRemotePage('ready', a),
      (i.onReachBottom || i.onPageScroll) && (this.onReachBottomDistance = Object($e.a)().onReachBottomDistance || 50,
      Object(Pn.a)(window, {
        scroll: this.checkScroll
      })),
      Object(Pn.a)(window, {
        resize: this.onWindowResize
      }),
      this.startRenderConfig = {},
      this.refreshFontSizeSetting(),
      h.a.emit(['pageReady', 'pageLoad'], {
        page: this
      }),
      this.styleScope && this.styleScope.type === 1 && this.root.setAttribute('data-sa', this.styleScope.id);
    },
    consoleToWorker() {
      for (var e, t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
      (e = this.endpoint).callRemoteSelf.apply(e, ['console'].concat(n));
    },
    logRenderTime(e) {
      const t = e[0];
      const n = e[1];
      h.a.emit('pagePerf', {
        page: this,
        transfer: n - t,
        render: v.b.now() - n,
        transferStart: t,
        transferEnd: n,
        renderStart: n,
        renderEnd: v.b.now(),
        dataLen: this.endpoint.getCurrentDataLength()
      }),
      Object(T.a)() && this.consoleToWorker('log', `framework:${this.pagePath}: transfer costs ${n - t}ms, render costs ${v.b.now() - n}ms.`);
    },
    startRender(e) {
      if (v.b.trace && v.b.trace(Rn.a.ClientWillPageFirstRender, Date.now()),
      !this.state) {
        this.startRenderConfig = e;
        const t = e.data;
        const n = e.id;
        const i = e.isAppFirstPage;
        const r = e.publicInstance;
        const a = void 0 === r ? this.publicInstance : r;
        const o = e.isRestarted;
        const s = e.workerPageStartTime;
        const c = e.pluginId;
        const u = e.appxFrameworkConfig;
        const p = void 0 === u ? {} : u;
        const d = e.switchDirtyKeyMap;
        const f = void 0 === d ? {} : d;
        if (this.state = {
          data: t
        },
        g.a._init(p, f),
        (function (e, t) {
          void 0 === t && (t = void 0),
          Object(T.c)() && (jn.$appxRenderDebugData = jn.$appxRenderDebugData || [],
          t ? jn.$appxRenderDebugData.push(l()({}, e, {
            tag: t
          })) : jn.$appxRenderDebugData.push(e),
          jn.$appxFireRenderDebugEvent && jn.$appxFireRenderDebugEvent());
        }({
          op: 0,
          data: t
        })),
        this.pluginId = c,
        this.isRestarted = o,
        this.isAppFirstPage = i,
        this.workerPageStartTime = s,
        In.a[this.pagePath]) {
          const m = In.a[this.pagePath].system && In.a[this.pagePath].system.styleScope;
          m && (this.styleScope = Object(G.a)(m));
        }
        a && (this.publicInstance = l()({}, this.publicInstance, a)),
        this.setId(n),
        this.afterStartRender(e),
        h.a.emit('afterStartRender');
      }
    },
    getPluginId() {
      return this.pluginId;
    },
    onPageUpdate(e) {
      this.logRenderTime(e);
      const t = {
        page: this
      };
      h.a.emit('beforePageUpdate', t);
      const n = t.payload;
      On(n) && this.callRemotePage('update', n),
      h.a.emit('pageUpdate', {
        page: this
      });
    },
    onWindowResize() {
      this.callRemotePage('onWindowResize', {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    },
    checkScroll() {
      const e = window;
      const t = e.innerHeight;
      const n = e.pageYOffset;
      let i = document.body.scrollHeight;
      (i = i || document.documentElement.scrollHeight,
      this.publicInstance.onPageScroll && this.callRemotePage('onPageScroll', {
        scrollTop: n,
        scrollHeight: i
      }),
      this.publicInstance.onReachBottom && n > 0) && (i - (t + n) <= this.onReachBottomDistance ? this.shouldNotFireOnReachBottom || (this.shouldNotFireOnReachBottom = !0,
      this.callRemotePage('onReachBottom')) : this.shouldNotFireOnReachBottom = !1);
    },
    $getEventHandler(e) {
      const t = this;
      if (X(e)) return H(this, e);
      if (!0 === e) return e;
      if (!e || typeof e !== 'string') return null;
      if (!this.eventHandlers[e]) {
        const n = this.eventHandlers[e] = function () {
          for (var n = arguments.length, i = new Array(n), r = 0; r < n; r++) i[r] = arguments[r];
          t.callRemotePage.apply(t, ['onRenderEvent', e].concat(i));
        };
        n.handleName = e,
        n.type = 1;
      }
      return this.eventHandlers[e];
    },
    callMethodFromSjs(e) {
      for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
      this.callRemotePage.apply(this, ['onRenderEvent', e].concat(n));
    },
    setPendingData(e, t) {
      for (var n = this, i = e.pendingData, r = e.workerTime, a = v.b.now(), o = [], s = {}, c = 0; c < i.length; c++) {
        const l = i[c];
        const u = l[w.q];
        const p = l[w.o];
        const d = l[w.n];
        const h = l[w.p] || w.h;
        u === w.s ? o.push({
          data: p,
          op: h
        }) : u === w.r && this.getComponentById(d) && (s[d] = s[d] || [],
        s[d].push({
          data: p,
          op: h
        }));
      }
      Te.a.unstable_batchedUpdates((() => {
        for (let e = 0, t = Object(_.a)(s); e < t.length; e++) {
          const i = t[e];
          n.getComponentById(i)
            .setData(s[i]);
        }
        o.length && n.setData(o);
      }
      )),
      this.onPageUpdate([r, a]),
      t && t();
    },
    beforeReceiveData() {
      if (!this.state) throw new Error('page missing startRender');
    },
    setData(e, t) {
      for (var n = this.state.data, i = 0; i < e.length; i++) {
        const r = e[i];
        n = N(r.op)(n, r.data);
      }
      this.setState({
        data: n
      }, t);
    },
    getRootNode() {
      return this.root;
    },
    saveRoot(e) {
      this.root = e;
    },
    getRender() {
      const e = (function (e) {
        if (e in Dn) return Dn[e];
        const t = In.a[e].system;
        return Dn[e] = Object(q.a)(t.render);
      }(this.pagePath)).call(this, this.state.data || {});
      const t = this.getRenderContent(e);
      return A.a.createElement('div', {
        className: 'a-page tiny-page',
        ref: this.saveRoot
      }, t);
    }
  });
  const Fn = p()({
    displayName: 'PageComponent',
    mixins: [kn, Ln],
    afterStartRender(e) {
      const t = e.componentsConfig;
      Z = t;
    },
    $getComponentEventHandler(e) {
      let t;
      if (!e || typeof e !== 'string') return null;
      const n = this.componentEventHandlers;
      return n[e] ? n[e] : (n[e] = ((t = {})[w.d] = e,
      t[w.e] = 1,
      t),
      n[e]);
    },
    receiveData(e, t) {
      const n = e.workerTime;
      const i = e.pendingData;
      if (this.beforeReceiveData(),
      !i.length) {
        return t();
      }
      this.setPendingData({
        pendingData: i,
        workerTime: n
      }, t);
    },
    getRenderContent(e) {
      return e;
    },
    render() {
      return this.getRender();
    }
  });

  function Vn(e) {
    return e == null ? `^${String(e)}` : typeof e === 'string' ? `$${e}` : typeof e === 'number' ? `n${e}` : typeof e === 'boolean' ? `b${e}` : null;
  }

  function Un() {
    this.clear();
  }

  Un.prototype = {
    constructor: Un,
    _getEntry(e) {
      for (let t = this._entries, n = 0, i = t.length; n < i; n++) {
        if (t[n][0] === e) {
          return {
            index: n,
            value: t[n]
          };
        }
      }
    },
    get(e) {
      const t = Vn(e);
      if (t !== null) return this._store[t];
      const n = this._getEntry(e);
      return n && n.value[1];
    },
    entries() {
      for (var e = [], t = 0, n = Object.keys(this._store); t < n.length; t++) {
        const i = n[t];
        e.push([i, this._store[i]]);
      }
      return e.concat(this._entries);
    },
    forEach(e, t) {
      for (let n = 0, i = this.entries(); n < i.length; n++) {
        const r = i[n];
        e.call(t, r[1], r[0], this);
      }
    },
    get size() {
      return this.entries().length;
    },
    set(e, t) {
      const n = Vn(e);
      if (n === null) {
        const i = this._getEntry(e);
        i ? i.value[1] = t : this._entries.push([e, t]);
      } else {
        this._store[n] = t;
      }
    },
    delete(e) {
      const t = Vn(e);
      if (t === null) {
        const n = this._getEntry(e);
        n && this._entries.splice(n.index, 1);
      } else {
        delete this._store[t];
      }
    },
    clear() {
      this._store = {},
      this._entries = [];
    }
  };
  const Bn = Un;
  const zn = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };

  function Wn(e) {
    return e.domPath ? e.domPath : `${Wn(e.context.parent)}-${e.indexInSiblings}`;
  }

  function Hn(e) {
    const t = e || {};
    t.children,
    t.$scopedSlots,
    t.slot,
    t.$slots,
    t.$isCustomComponent,
    t.__tag,
    t.__owner;
    return zn(t, ['children', '$scopedSlots', 'slot', '$slots', '$isCustomComponent', '__tag', '__owner']);
  }

  const Xn = (function () {
    function e(e, t) {
      const n = this;
      this.shouldStop = !1,
      this.shouldSkip = !1,
      this.context = {
        stop() {
          return n.shouldStop = !0;
        },
        skip() {
          return n.shouldSkip = !0;
        }
      },
      this.ast = e,
      this.visitor = t;
    }

    return e.prototype.walk = function () {
      for (let e = this.ast, t = e; ;) {
        const n = this.shouldStop;
        const i = this.shouldSkip;
        this.shouldStop = !1,
        this.shouldSkip = !1,
        this.visitor.enter.call(this.context, t, t.return);
        const r = this.shouldStop;
        const a = this.shouldSkip;
        if (this.shouldStop = n,
        this.shouldSkip = i,
        r) {
          return;
        }
        if (!t.child || a) {
          if (t === e) return;
          for (; !t.sibling;) {
            if (!t.return || t.return === e) return;
            t = t.return;
          }
          t = t.sibling;
        } else {
          t = t.child;
        }
      }
    }
    ,
    e;
  }());

  function Yn(e, t) {
    const n = e._reactInternalFiber;
    const i = {
      type: 'Page',
      domPath: t.domPath,
      domChildIndex: t.domChildIndex,
      is: t.pagePath,
      data: t.publicInstance ? t.publicInstance.data : t.state.data,
      children: []
    };
    const r = new Bn();
    return r.set(n, i),
    (function (e, t) {
      new Xn(e, t).walk();
    }(n, {
      enter(e) {
        if (e !== n && e.stateNode && e.stateNode.$isCustomComponent) {
          const i = e.stateNode;
          const a = {
            type: 'Component',
            domPath: Wn(i),
            domChildIndex: i.domChildIndex,
            is: i.is,
            data: i.publicInstance ? i.publicInstance.data : i.state.data,
            props: Hn(i.publicInstance ? i.publicInstance.props : i.props),
            children: []
          };
          r.set(e, a);
          const o = i.context.parent === t ? n : i.context.parent._reactInternalFiber;
          const s = r.get(o);
          s && s.children.push(a);
        }
      }
    })),
    i;
  }

  const $n = p()({
    displayName: 'PageComponent',
    mixins: [kn, Ln],
    componentDidMount() {
      const e = this.startRenderAfterCurrentComponents;
      const t = e.afterCurrentComponents;
      const n = e.currentComponents;
      if (t && (Object(Se.a)('framework', 'startRender currentComponents', n, t),
      Object.keys(t.pathIdMap).length)) {
        const i = 'startRender: worker render components is not sync!';
        throw de() && this.outputComponent2TreeInfo({
          afterCurrentComponents: t,
          errorType: 'START_RENDER_NOT_SYNC',
          errorMessage: i
        }),
        new Error(`${i} afterCurrentComponents: ${JSON.stringify(t)}`);
      }
      this.startRenderAfterCurrentComponents = {};
    },
    outputComponent2TreeInfo(e) {
      this.callRemotePage('outputComponent2TreeInfo', l()({}, e, {
        tree: Yn(this, this)
      }));
      const t = At();
      t && t.getReporter()
        .notifyPage();
    },
    uploadTrace(e) {
      const t = At();
      t && t.getReporter()
        .uploadTrace(e);
    },
    afterStartRender(e) {
      let t;
      let n;
      const i = e.componentDefaultProps;
      const r = e.currentComponents;
      const
        a = e.dynamicDefaultProps;
      i && (t = i,
      me = l()(me, t)),
      fe() && a && ge(a),
      r && (n = ye(r)),
      this.startRenderAfterCurrentComponents = {
        currentComponents: r,
        afterCurrentComponents: n
      };
    },
    $getComponentEventHandler(e) {
      return e;
    },
    receiveData(e, t) {
      let n;
      const i = this;
      const r = e.pendingData;
      const a = e.currentComponents;
      const o = e.workerTime;
      const
        s = e.dynamicDefaultProps;
      if (this.beforeReceiveData(),
      fe() && s && ge(s),
      a && (n = ye(a)),
      !r.length) {
        return t();
      }
      this.setPendingData({
        pendingData: r,
        workerTime: o
      }, (() => {
        if (n && (Object(Se.a)('framework', 'receiveData currentComponents', a, n),
        Object.keys(n.pathIdMap).length)) {
          const e = 'receiveData: worker render components is not sync!';
          throw de() && i.outputComponent2TreeInfo({
            afterCurrentComponents: n,
            errorType: 'RECEIVE_DATA_NOT_SYNC',
            errorMessage: e
          }),
          new Error(`${e} afterCurrentComponents: ${JSON.stringify(n)}`);
        }
        t && t();
      }
      ));
    },
    getRenderContent(e) {
      return ue.renderWithContext(this, e, !0);
    },
    render() {
      return this.getRender();
    }
  });
  const Kn = function (e) {
    const t = e.pagePath;
    const n = e.component2;
    Object(ke.c)(e),
    In.a[t] = {
      system: e
    },
    Ee.a.registerComponent(t, (() => (n ? $n : Fn)
    ));
  };
  const qn = n(103);
  const Gn = n(106);
  const Jn = function (e) {
    Object(he.a)(e),
    Object(Gn.b)();
  };
  Object(Cn.a)(xn),
  n.d(t, 'c', (() => Ce.default
  )),
  n.d(t, 'f', (() => we
  )),
  n.d(t, 'k', (() => Sn
  )),
  n.d(t, 'e', (() => En.a
  )),
  n.d(t, 'd', (() => Kn
  )),
  n.d(t, 'b', (() => m.a
  )),
  n.d(t, 'g', (() => m.b
  )),
  n.d(t, 'i', (() => m.e
  )),
  n.d(t, 'a', (() => Le.a
  )),
  n.d(t, 'h', (() => qn.a
  )),
  n.d(t, 'j', (() => Jn
  ));
},
function (e, t, n) {
  t.a = {};
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(88);
  const o = n(23);
  const s = n.n(o);
  const c = {
    componentDidMount() {
      const e = this.props['style-scope'];
      if (e && (this.wrappedComponent && this.wrappedComponent.constructor && this.wrappedComponent.constructor.displayName) !== 'Picker') {
        const t = s.a.findDOMNode(this);
        t && t.nodeType === 1 && t.setAttribute('data-sa', e.id);
      }
    }
  };
  const l = n(5);
  const u = n.n(l);
  const p = n(127);
  const d = n.n(p);
  const h = n(0);
  const f = n.n(h);
  const m = n(34);
  const v = n(17);
  let g;
  const b = n(102);
  const y = n(35);
  const _ = n(67);
  const w = n(19);
  const C = n(46);
  const
    x = n(13);

  function T() {
    g = {};
  }

  T(),
  w.a.addListener(['beforePageReady', 'beforePageUpdate'], ((e) => {
    let t;
    Object.keys(g).length && (e.payload = r()({}, e.payload, ((t = {})[x.k] = g,
    t)),
    T());
  }
  ));
  const S = /^on([A-Z])/;

  function E(e) {
    return e.replace(S, ((e, t) => t.toLowerCase()
    ));
  }

  function k(e) {
    for (var t = {}, n = 0, i = Object.keys(e); n < i.length; n++) {
      const r = i[n];
      const a = e[r];
      r.match(S) && typeof a === 'function' && (t[E(r)] = [a.handleName, a.type],
      a.id && t[E(r)].push(a.id));
    }
    return t;
  }

  function O(e, t) {
    return !(!e || !t) && (e.length != t.length && e.every(((e, n) => e === t[n]
    )));
  }

  function P(e) {
    const t = this.props;
    if (t === e) return !1;
    let n = !1;
    const i = this.getDataset();
    const r = this._dataset;
    this._dataset = i,
    Object(C.a)(i, r) || (n = !0);
    const a = k(t);
    const o = this._events;
    this._events = a;
    const s = Object.keys(a);
    const c = s.length;
    if (c !== Object.keys(o).length) return !0;
    for (let l = 0; l < c; l++) {
      if (!O(a[s[l]], o[s[l]])) return !0;
    }
    return n;
  }

  const N = {
    componentDidMount() {
      this.isNativeComponent() && (this._dataset = this.getDataset(),
      this._events = k(this.props),
      g[this.getNativeId()] = {
        dataset: this._dataset,
        tagName: this.getTagName(),
        events: this._events
      });
    },
    componentDidUpdate(e) {
      this.isNativeComponent() && P.call(this, e) && (g[this.getNativeId()] = {
        dataset: this._dataset,
        events: this._events
      });
    },
    componentWillUnmount() {
      this.isNativeComponent() && (g[this.getNativeId()] = null);
    }
  };
  const I = /^aria[A-Z\-]/;
  let A;
  const j = n(14);
  const R = {
    getCurrentPage() {
      return Object(j.d)();
    }
  };
  const D = self;
  const
    M = {
      getTrackerConfig(e) {
        return void 0 === e && (e = {}),
        void 0 === A && (A = D.__Ali_TRACKING_HOOK__ && !0 === D.__Ali_TRACKING_HOOK__.injectDataset),
        A && void 0 !== this.props['data-tracker'] && (e['data-tracker'] = this.props['data-tracker']),
        e;
      }
    };

  function L(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
    return !0;
  }

  const F = function (e, t) {
    let n;
    void 0 === t && (t = L);
    let i;
    let r = [];
    let
      a = !1;
    return function () {
      for (var o = arguments.length, s = new Array(o), c = 0; c < o; c++) s[c] = arguments[c];
      return a && n === this && t(s, r) ? i : (i = e.apply(this, s),
      a = !0,
      n = this,
      r = s,
      i);
    };
  };
  const V = n(95);
  const U = n(79);
  const B = n(7);
  const z = n(18);
  const W = n(119);
  const H = n(70);
  const X = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  let Y = 0;
  const $ = {};
  const K = /^on[A-Z]/;

  function q(e) {
    return !!e.match(K);
  }

  function G(e) {
    void 0 === e && (e = {});
    const t = e;
    const n = t.pure;
    const i = void 0 === n || n;
    const o = t.name;
    const s = void 0 === o ? '' : o;
    const l = t.isNativeComponent;
    const p = t.isExtraComponent;
    const h = void 0 !== p && p;
    return function (e) {
      const t = i ? [a.a] : [];
      m.a.browser && t.push(N),
      Object(H.b)() && t.push(c),
      t.push(R),
      t.push(M);
      const n = u()({
        displayName: `AppX(${s})`,
        statics: {
          contextType: U.a
        },
        mixins: t,
        getInitialState() {
          const e = this;
          this.__cachesEventHandles = {},
          this.$appx = r()({}, this.$appx, {
            bridge: y.a.bridge,
            getTargetForEvent: this.getTargetForEvent,
            getNormalizedStyle: this.getNormalizedStyle,
            getDOMProps: this.getDOMProps,
            getDataset: this.getDataset,
            getNormalizedEvent: this.getNormalizedEvent,
            getNormalizedSrc(t, n) {
              return Object(W.a)(t, e, n);
            },
            tagName: s,
            page: this.getCurrentPage(),
            isNativeComponent: this.isNativeComponent(),
            getTrackerConfig: this.getTrackerConfig
          });
          const t = this;
          const n = this.owner = t.props.__owner;
          const i = this.pluginId = n && n.getPluginId();
          return this.canRender = !i || (function (e, t) {
            const n = Object(V.b)(t);
            return !n || !(e in n) || n[e];
          }(s, i)),
          this.memorizedNormalizeStyle = F((() => Object(b.a)(t)
          )),
          i && (this.getClassName = F(((e) => (function (e, t) {
            return e.trim()
              .split(/\s+/)
              .map(((e) => Object(z.g)(t, e)
              ))
              .join(' ');
          }(e, i))
          )),
          this.getIdForPlugin = F(((e) => {
            if (e) return Object(z.g)(i, e);
          }
          ))),
          this.$appx.getClassName = this.getClassName,
          {};
        },
        getIdForPlugin(e) {
          return e;
        },
        componentDidMount() {
          this.canRender && w.a.emit('builtinComponentDidMount', {
            instance: this,
            tagName: this.getTagName(),
            isNative: this.isNativeComponent()
          });
        },
        componentWillUnmount() {
          ['input', 'textarea'].indexOf(s) > -1 && $[this.nativeId] && delete $[this.nativeId];
        },
        $getNormalizedStyle() {
          const e = this.props;
          const t = e.style;
          const n = e.className;
          return m.a.browser ? this.memorizedNormalizeStyle(t) : this.memorizedNormalizeStyle(t, n);
        },
        getClassName(e) {
          return e;
        },
        $getCacheEventHandle(e) {
          const t = this;
          const n = this.__cachesEventHandles;
          if (e in n) return n[e];
          const i = (function (e) {
            const t = e.slice(2);
            return t.charAt(0)
              .toLowerCase() + t.slice(1);
          }(e));
          return n[e] = function () {
            const n = t.props[e];
            if (n) {
              for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
              let s;
              const
                c = a[0];
              if (c && c.type && c.timeStamp && c.target && c.currentTarget) {
                n.apply(void 0, a);
              } else {
                n((s = t.$appx).getNormalizedEvent.apply(s, [i].concat(a)));
              }
            }
          };
        },
        $getNormalizedProps() {
          const e = this.props;
          const t = (e.slot,
          X(e, ['slot']));
          h || (t.$appx = this.$appx),
          t.className && (t.className = this.getClassName(t.className)),
          (function (e, t) {
            const n = `${e.className || ''}`;
            t && n.indexOf(` a-${t}`) === -1 && (e.className = ` a-${t} ${n}`);
          }(t, s)),
          delete t.style;
          const n = this.$getNormalizedStyle();
          t.style = n || void 0;
          const i = this.constructor.$numProps;
          if (i) {
            for (let r = 0; r < i.length; r++) {
              const a = i[r];
              typeof t[a] === 'string' && (t[a] = parseFloat(t[a]));
            }
          }
          for (let o = 0, c = Object(v.a)(t); o < c.length; o++) {
            const l = c[o];
            q(l) && typeof t[l] === 'function' && (t[l] = this.$getCacheEventHandle(l));
          }
          return t;
        },
        isNativeComponent() {
          return void 0 !== this._isNativeComponent ? this._isNativeComponent : typeof l === 'function' ? this._isNativeComponent = l(this.props) : (this._isNativeComponent = !!l,
          l);
        },
        getNormalizedStyle(e) {
          if (e) {
            let t = e;
            return typeof e === 'string' && (t = {
              style: e
            }),
            Object(b.a)(this, t);
          }
        },
        getDOMProps(e) {
          return (function (e, t) {
            void 0 === t && (t = {});
            for (let n = 0, i = Object(v.a)(e); n < i.length; n++) {
              const r = i[n];
              (r === 'role' || r.match(I)) && (t[r] = e[r]);
            }
            return t;
          }(this.props, e));
        },
        getDataset(e) {
          for (var t = e || this.props, n = {}, i = 0, r = Object(v.a)(t); i < r.length; i++) {
            const a = r[i];
            if (a.slice(0, 5) === 'data-') n[Object(_.a)(a.slice(5))] = t[a];
          }
          return n;
        },
        getTagName() {
          return s;
        },
        getTargetForEvent() {
          const e = {
            id: this.props.id,
            tagName: s,
            dataset: this.getDataset()
          };
          return this.isNativeComponent() && (['input', 'textarea'].indexOf(s) > -1 ? e.id = this.getNativeId()
            .split('_appxObject_')[0] : e.id = this.getNativeId()),
          e;
        },
        getNativeId(e) {
          if (this.nativeId) return this.nativeId;
          const t = this.props.id;
          if (t) {
            if (['input', 'textarea'].indexOf(s) > -1) {
              const n = `${e ? this.getIdForPlugin(t) : t}`;
              $[n] ? this.nativeId = `${n}_appxObject_${++Y}` : (this.nativeId = n,
              $[n] = 1);
            } else {
              this.nativeId = e ? this.getIdForPlugin(t) : t;
            }
          } else {
            this.nativeId = `appx-native-component-${++Y}`;
          }
          return this.nativeId;
        },
        getNormalizedEvent(e, t) {
          let n;
          let
            i = e;
          i.eventType && (n = i.srcEvent,
          i = i.eventType);
          const a = n && (n.nativeEvent || n.detail && n.detail.nativeEvent) || n;
          const o = this.getTargetForEvent();
          let s = a && a.$target || o;
          return a && !a.$target && (a.$target = s),
          s = r()({
            targetDataset: s.dataset
          }, s, {
            dataset: o.dataset
          }),
          r()({
            type: i,
            timeStamp: B.b.now(),
            target: s,
            currentTarget: o
          }, t);
        },
        saveRef(e) {
          this.wrappedComponent = e;
        },
        getWrappedComponent() {
          return this.wrappedComponent;
        },
        render() {
          if (!this.canRender) {
            return f.a.createElement('div', {
              style: {
                color: 'red'
              }
            }, ' ', s, ' 不能在插件中使用');
          }
          const t = this.$getNormalizedProps();
          e.prototype.render && (t.ref = this.saveRef),
          this.isNativeComponent() ? t.id = this.getNativeId(!0) : t.id = this.getIdForPlugin(t.id);
          const n = r()({}, t);
          if (this.pluginId) {
            for (let i = (function (e, t) {
                const n = Object(V.b)(t);
                return n && e in n && Array.isArray(n[e]) ? n[e] : [];
              }(s, this.pluginId)), a = 0; a < i.length; a++) {
              delete n[i[a]];
            }
          }
          return f.a.createElement(e, n);
        }
      });
      const o = d()(n, e);
      e.$builtInCom = 1;
      const p = [];
      const g = e.defaultProps;
      if (g) {
        for (let C = 0, x = Object(v.a)(g); C < x.length; C++) {
          const T = x[C];
          typeof g[T] === 'number' && p.push(T);
        }
        p.length && (o.$numProps = p);
      }
      return o;
    };
  }

  n(86);
  const J = n(60);
  const Q = n(26);
  const Z = n(85);
  n.d(t, 'c', (() => G
  )),
  n.d(t, 'e', (() => j.d
  )),
  n.d(t, 'f', (() => j.f
  )),
  n.d(t, 'd', (() => j.c
  )),
  n.d(t, 'b', (() => w.a
  )),
  n.d(t, 'g', (() => J.a
  )),
  n.d(t, 'h', (() => Q.a
  )),
  n.d(t, 'a', (() => Z.a
  ));
},
function (e, t, n) {
  const i = n(46);
  t.a = {
    shouldComponentUpdate(e, t) {
      return !Object(i.a)(e, this.props) || !Object(i.a)(t, this.state);
    }
  };
},
function (e, t, n) {
  function i(e) {
    return e.charAt(0)
      .toUpperCase() + e.slice(1);
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  let i;
  const r = n(0);
  const a = n.n(r);
  const o = {
    success: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M65 130c-35.899 0-65-29.101-65-65S29.101 0 65 0s65 29.101 65 65-29.101 65-65 65zm28.749-84.5a1 1 0 0 0-.71.295L58.363 80.654l-13.75-13.651a1 1 0 0 0-.705-.29H32.752L58.362 93.7l44.886-48.2h-9.5z" fill-rule="evenodd"/></svg>'
    },
    info: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M65 130c-35.899 0-65-29.101-65-65S29.101 0 65 0s65 29.101 65 65-29.101 65-65 65zM52.812 48.75v4.063h8.126V97.5h-8.126v4.063H81.25V97.5h-8.125V48.75H52.812zM65 40.625a8.125 8.125 0 1 0 0-16.25 8.125 8.125 0 0 0 0 16.25z" fill-rule="evenodd"/></svg>'
    },
    warn: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M65 130c-35.899 0-65-29.101-65-65S29.101 0 65 0s65 29.101 65 65-29.101 65-65 65zM60.521 29.25l.988 51.02a1 1 0 0 0 1 .98h6.066a1 1 0 0 0 1-.98l.967-50a1 1 0 0 0-1-1.02h-9.02zm5.02 70.417a5.958 5.958 0 1 0 0-11.917 5.958 5.958 0 0 0 0 11.917z" fill-rule="evenodd"/></svg>'
    },
    waiting: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M67.684 68.171L67.766 26h-6.36l-1.888 46.562-.092.19.083.04-.011.275h.586l30.94 14.76 2.544-4.406-25.884-15.25zM65 130c-35.899 0-65-29.101-65-65S29.101 0 65 0s65 29.101 65 65-29.101 65-65 65z" fill-rule="evenodd"/></svg>'
    },
    clear: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M65 130c-35.899 0-65-29.101-65-65S29.101 0 65 0s65 29.101 65 65-29.101 65-65 65zm9.692-65L90.83 48.863a6.846 6.846 0 0 0 .017-9.71c-2.696-2.695-7.024-2.668-9.71.017L65 55.308 48.863 39.17a6.846 6.846 0 0 0-9.71-.017c-2.695 2.696-2.668 7.024.017 9.71L55.308 65 39.17 81.137a6.846 6.846 0 0 0-.017 9.71c2.696 2.695 7.024 2.668 9.71-.017L65 74.692 81.137 90.83a6.846 6.846 0 0 0 9.71.017c2.695-2.696 2.668-7.024-.017-9.71L74.692 65z" fill-rule="evenodd"/></svg>'
    },
    success_no_circle: {
      size: '0 0 130 89',
      content: '<svg width="130" height="89" xmlns="http://www.w3.org/2000/svg"><path d="M112.132 0H130L47.227 88.884 0 39.118h20.92a1 1 0 0 1 .704.29l25.603 25.418L111.423.295a1 1 0 0 1 .709-.295z" fill-rule="evenodd"/></svg>'
    },
    download: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M65 11.818c-29.325 0-53.182 23.857-53.182 53.182 0 29.325 23.857 53.182 53.182 53.182 29.325 0 53.182-23.857 53.182-53.182 0-29.325-23.857-53.182-53.182-53.182M65 130c-35.84 0-65-29.16-65-65S29.16 0 65 0s65 29.16 65 65-29.16 65-65 65"/><path d="M59.728 75.224V35.909h11.819v39.315h13.212L65.335 94.649 45.909 75.224z"/></g></svg>'
    },
    cancel: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M65 130c-35.899 0-65-29.101-65-65S29.101 0 65 0s65 29.101 65 65-29.101 65-65 65zm19.446-89.77L64.76 59.919l-19.432-19.43-4.896 4.896 19.431 19.43-19.631 19.632 4.896 4.896L64.76 69.711l19.887 19.888 4.897-4.896-19.888-19.888 19.687-19.688-4.896-4.896z" fill-rule="evenodd"/></svg>'
    },
    search: {
      size: '0 0 130 130',
      content: '<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M130 118.53l-11.364 11.468-31.138-31.32c-9.168 7.066-20.583 11.308-33.005 11.308C24.398 109.986 0 85.364 0 54.993 0 24.623 24.398 0 54.493 0c30.094 0 54.491 24.62 54.491 54.992 0 11.977-3.835 23.028-10.277 32.056L130 118.53zM54.493 13.334c-22.801 0-41.285 18.65-41.285 41.658 0 23.009 18.483 41.661 41.285 41.661 22.796 0 41.279-18.652 41.279-41.66 0-23.01-18.483-41.66-41.279-41.66z" fill-rule="evenodd" opacity=".896"/></svg>'
    },
    success_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_success_fill" stroke="none" stroke-width="1" fill-rule="evenodd"><path d="M56.4640602,79.5500172 L37.6614482,60.7474051 C36.5076264,59.5935833 34.6369116,59.5935833 33.4830898,60.7474051 L31.3939107,62.8365843 C30.2400889,63.9904058 30.2400889,65.8611206 31.3939107,67.0149424 L54.3748811,89.9959128 C54.9517921,90.5728238 55.7079262,90.8612791 56.4640602,90.8612791 C57.2201943,90.8612791 57.9763284,90.5728238 58.5532394,89.9959128 L101.730851,46.8183008 C102.884673,45.664479 102.884673,43.7937642 101.730851,42.6399424 L99.6416723,40.5507632 C98.4878505,39.3969414 96.617136,39.3969414 95.4633142,40.5507632 L56.4640602,79.5500172 Z M65,130 C29.1014912,130 0,100.898509 0,65 C0,29.1014912 29.1014912,0 65,0 C100.898509,0 130,29.1014912 130,65 C130,100.898509 100.898509,130 65,130 Z" id="Combined-Shape"  fill-rule="evenodd"></path></g></svg>'
    },
    info_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_info" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M59.0909091,53.1818182 L70.9090909,53.1818182 L70.9090909,94.5454545 L79.7727273,94.5454545 L79.7727273,103.409091 L50.2272727,103.409091 L50.2272727,94.5454545 L59.0909091,94.5454545 L59.0909091,62.0454545 L50.2272727,62.0454545 L50.2272727,53.1818182 L59.0909091,53.1818182 Z M0,65 C0,29.1022727 29.1022727,0 65,0 C100.897727,0 130,29.1022727 130,65 C130,100.897727 100.897727,130 65,130 C29.1022727,130 0,100.897727 0,65 Z M65,121.136364 C96.0041136,121.136364 121.136364,96.0041136 121.136364,65 C121.136364,33.9958864 96.0041136,8.86363636 65,8.86363636 C33.9958864,8.86363636 8.86363636,33.9958864 8.86363636,65 C8.86363636,96.0041136 33.9958864,121.136364 65,121.136364 Z M65,47.2727273 C60.104749,47.2727273 56.1363636,43.304342 56.1363636,38.4090909 C56.1363636,33.5138399 60.104749,29.5454545 65,29.5454545 C69.895251,29.5454545 73.8636364,33.5138399 73.8636364,38.4090909 C73.8636364,43.304342 69.895251,47.2727273 65,47.2727273 Z" id="Combined-Shape" fill-rule="evenodd"></path></g></svg>'
    },
    warn_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_warn" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M0,65 C0,29.1022727 29.1022727,0 65,0 C100.897727,0 130,29.1022727 130,65 C130,100.897727 100.897727,130 65,130 C29.1022727,130 0,100.897727 0,65 Z M59.2742543,23.6363636 C59.2149917,23.6363636 59.1557428,23.6381467 59.0965874,23.6417102 C57.46779,23.739833 56.2269329,25.1397782 56.3250554,26.7685757 L59.1728691,74.0411806 C59.2668416,75.6010867 60.5592925,76.8180376 62.1220266,76.8180595 L68.1140918,76.8181428 C69.6821846,76.8181647 70.9771474,75.5931646 71.0641295,74.027486 L73.6903901,26.7547977 C73.693422,26.7002208 73.6949389,26.6455702 73.6949389,26.5909091 C73.6949389,24.9591588 72.372144,23.6363636 70.7403935,23.6363636 L59.2742543,23.6363636 Z M65,103.409091 C69.895251,103.409091 73.8636364,99.4407056 73.8636364,94.5454545 C73.8636364,89.6502035 69.895251,85.6818182 65,85.6818182 C60.104749,85.6818182 56.1363636,89.6502035 56.1363636,94.5454545 C56.1363636,99.4407056 60.104749,103.409091 65,103.409091 Z" id="Combined-Shape"  fill-rule="evenodd"></path></g></svg>'
    },
    waiting_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_waiting" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M69.3485866,68.1754675 C70.3034354,67.3625689 70.9090909,66.1517495 70.9090909,64.7994717 L70.9090909,22.1590909 C70.9090909,19.7114653 68.9248982,17.7272727 66.4772727,17.7272727 C64.0296472,17.7272727 62.0454545,19.7114653 62.0454545,22.1590909 L62.0454545,62.9723206 L35.6337688,89.3840063 C33.9030359,91.1147392 33.9030359,93.920811 35.6337688,95.6515439 C37.3645013,97.3822764 40.1705735,97.3822764 41.901306,95.6515439 L69.0606348,68.4922151 C69.1626292,68.3902204 69.2586133,68.2844914 69.3485866,68.1754675 Z M0,65 C0,29.1022727 29.1022727,0 65,0 C100.897727,0 130,29.1022727 130,65 C130,100.897727 100.897727,130 65,130 C29.1022727,130 0,100.897727 0,65 Z" id="Combined-Shape" fill-rule="evenodd"></path></g></svg>'
    },
    clear_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_clear" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M66.4772727,60.2097355 L43.4816058,37.2140686 C42.3391242,36.0715866 40.4727419,36.0739671 39.3201241,37.2265849 L37.2265849,39.3201241 C36.0643825,40.4823265 36.0683635,42.3359007 37.2140686,43.4816058 L60.2097355,66.4772727 L37.2140686,89.4729396 C36.0715866,90.6154213 36.0739671,92.4818035 37.2265849,93.6344213 L39.3201241,95.7279605 C40.4823265,96.8901629 42.3359007,96.886182 43.4816058,95.7404769 L66.4772727,72.74481 L89.4729396,95.7404769 C90.6154213,96.8829588 92.4818035,96.8805784 93.6344213,95.7279605 L95.7279605,93.6344213 C96.8901629,92.472219 96.886182,90.6186447 95.7404769,89.4729396 L72.74481,66.4772727 L95.7404769,43.4816058 C96.8829588,42.3391242 96.8805784,40.4727419 95.7279605,39.3201241 L93.6344213,37.2265849 C92.472219,36.0643825 90.6186447,36.0683635 89.4729396,37.2140686 L66.4772727,60.2097355 Z M65,130 C29.1014912,130 0,100.898509 0,65 C0,29.1014912 29.1014912,0 65,0 C100.898509,0 130,29.1014912 130,65 C130,100.898509 100.898509,130 65,130 Z" id="Combined-Shape"  fill-rule="evenodd"></path></g></svg>'
    },
    success_no_circle_dd: {
      size: '0 0 130 89',
      content: '<svg width="130px" height="94px" viewBox="0 0 130 94" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_success_no_circle" stroke="none" stroke-width="1"  fill-rule="evenodd"><g transform="translate(0.000000, -19.000000)"><rect id="icon_right_fill" opacity="0" x="0" y="0" width="130" height="130"></rect><path d="M47.5357788,90.8214071 L12.6073364,55.8929647 C11.3213067,54.6069349 9.23624052,54.6069349 7.95021078,55.8929647 L0.964522303,62.8786532 C-0.321507434,64.1646829 -0.321507434,66.2497491 0.964522303,67.5357788 L45.207216,111.778472 C46.4932457,113.064502 48.5783119,113.064502 49.8643416,111.778472 L129.035478,32.6073364 C130.321507,31.3213067 130.321507,29.2362405 129.035478,27.9502108 L122.049789,20.9645223 C120.763759,19.6784926 118.678693,19.6784926 117.392664,20.9645223 L47.5357788,90.8214071 Z" id="Combined-Shape" ></path></g></g></svg>'
    },
    download_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_download" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M71,74.6240161 L85.803477,59.8205391 C86.9572988,58.6667173 88.8280136,58.6667173 89.9818354,59.8205391 L92.0710145,61.9097183 C93.2248363,63.0635398 93.2248363,64.9342546 92.0710145,66.0880764 L69.0900441,89.0690468 C67.9362223,90.2228686 66.0655076,90.2228686 64.9116858,89.0690468 L64.8147808,88.9721418 C64.41459,88.8296775 64.0389751,88.5982692 63.7186229,88.2779173 L42.8268317,67.3861258 C41.6730099,66.2323043 41.6730099,64.3615895 42.8268317,63.2077677 L44.9160108,61.1185885 C46.0698326,59.9647667 47.9405471,59.9647667 49.0943689,61.1185885 L62.1363636,74.1605832 L62.1363636,2.94430742 C62.1363636,1.31821135 63.4442236,0 65.0878263,0 L68.0485373,0 C69.6785852,0 71,1.29944791 71,2.94430742 L71,74.6240161 Z M41.4545455,35.4545455 L41.4545455,44.3181818 L14.8636364,44.3181818 L14.8636364,121.136364 L115.318182,121.136364 L115.318182,44.3181818 L91.6818182,44.3181818 L91.6818182,35.4545455 L115.318182,35.4545455 C120.213433,35.4545455 124.181818,39.4229308 124.181818,44.3181818 L124.181818,121.136364 C124.181818,126.031615 120.213433,130 115.318182,130 L14.8636364,130 C9.96838517,130 6,126.031615 6,121.136364 L6,44.3181818 C6,39.4229308 9.96838517,35.4545455 14.8636364,35.4545455 L41.4545455,35.4545455 Z" id="Combined-Shape"  fill-rule="evenodd"></path></g></svg>'
    },
    cancel_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_cancel" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M66.4772727,60.2097355 L87.369064,39.317944 C88.5228857,38.1641225 90.3936005,38.1641225 91.5474223,39.317944 L93.6366015,41.4071231 C94.790423,42.5609449 94.790423,44.4316597 93.6366015,45.5854815 L72.74481,66.4772727 L93.6366015,87.369064 C94.790423,88.5228857 94.790423,90.3936005 93.6366015,91.5474223 L91.5474223,93.6366015 C90.3936005,94.790423 88.5228857,94.790423 87.369064,93.6366015 L66.4772727,72.74481 L45.5854815,93.6366015 C44.4316597,94.790423 42.5609449,94.790423 41.4071231,93.6366015 L39.317944,91.5474223 C38.1641225,90.3936005 38.1641225,88.5228857 39.317944,87.369064 L60.2097355,66.4772727 L39.317944,45.5854815 C38.1641225,44.4316597 38.1641225,42.5609449 39.317944,41.4071231 L41.4071231,39.317944 C42.5609449,38.1641225 44.4316597,38.1641225 45.5854815,39.317944 L66.4772727,60.2097355 Z M65,130 C29.1014912,130 0,100.898509 0,65 C0,29.1014912 29.1014912,0 65,0 C100.898509,0 130,29.1014912 130,65 C130,100.898509 100.898509,130 65,130 Z M65,121.136364 C96.0032574,121.136364 121.136364,96.0032574 121.136364,65 C121.136364,33.9967426 96.0032574,8.86363636 65,8.86363636 C33.9967426,8.86363636 8.86363636,33.9967426 8.86363636,65 C8.86363636,96.0032574 33.9967426,121.136364 65,121.136364 Z" id="Combined-Shape"  fill-rule="evenodd"></path></g></svg>'
    },
    search_dd: {
      size: '0 0 130 130',
      content: '<svg width="130px" height="130px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="icon_search" stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M99.1578313,92.2141544 L126.564634,119.620956 C128.429279,121.485601 128.418902,124.519164 126.574522,126.363545 L124.335269,128.602797 C122.476085,130.461981 119.472555,130.472783 117.592681,128.592909 L89.7244774,100.724706 C80.6410669,107.207984 69.5215312,111.022251 57.5111257,111.022251 C26.8531776,111.022251 2,86.1690738 2,55.5111257 C2,24.8531776 26.8531776,0 57.5111257,0 C88.1690738,0 113.022251,24.8531776 113.022251,55.5111257 C113.022251,69.5821308 107.786898,82.4303538 99.1578313,92.2141544 Z M57.5111257,101.506058 C82.9134257,101.506058 103.506058,80.9134257 103.506058,55.5111257 C103.506058,30.1088257 82.9134257,9.51619297 57.5111257,9.51619297 C32.1088257,9.51619297 11.516193,30.1088257 11.516193,55.5111257 C11.516193,80.9134257 32.1088257,101.506058 57.5111257,101.506058 Z" id="Combined-Shape"  fill-rule="evenodd"></path></g></svg>'
    },
    'contact-button': {
      size: '0 0 101 101',
      content: '<svg width="101" height="101" viewBox="0 0 101 101" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M0 50.5C0 78.39 22.61 101 50.5 101S101 78.39 101 50.5 78.39 0 50.5 0 0 22.61 0 50.5z" /><path d="M71.52 26H29.486c-4.132-.002-7.483 3.352-7.485 7.49v29.813c0 4.137 3.348 7.49 7.479 7.49h4.35v10.705a1.501 1.501 0 0 0 2.691.913 70.674 70.674 0 0 1 5.193-5.964c1.254-1.28 2.46-2.394 3.597-3.296 1.93-1.535 3.545-2.354 4.589-2.358l.181.006h.66l2.442.006c4.445.005 8.89.005 13.335 0l3.585-.006h1.413c4.134 0 7.485-3.356 7.485-7.496V33.49c0-4.137-3.349-7.49-7.48-7.49zM51.377 69.586c.012-.069.02-.137.023-.207a.475.475 0 0 1-.023.207zM76 63.303a4.491 4.491 0 0 1-4.488 4.491h-1.41l-3.585.003c-5.255.003-10.51.003-15.765 0l-.645-.003.015.015c-.071-.009-.14-.02-.216-.02-1.905 0-4.035 1.081-6.46 3.007-1.244.988-2.54 2.184-3.875 3.545a73.709 73.709 0 0 0-2.742 2.975v-8.022c0-.83-.672-1.503-1.5-1.503h-5.844A4.482 4.482 0 0 1 25 63.311V33.49a4.484 4.484 0 0 1 4.485-4.486h42.03A4.484 4.484 0 0 1 76 33.49v29.813z" fill="#FFF"/></g></svg>'
    }
  };
  const s = {};
  const c = 'a-icon-sprite-node';
  const
    l = document.querySelector(`#${c}`);
  const u = n(2);
  const p = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  t.a = function (e) {
    const t = e.size;
    const n = void 0 === t ? 23 : t;
    const r = e.type;
    const d = e.color;
    const h = p(e, ['size', 'type', 'color']);
    let f = r;
    return u.o && (f = `${r}_dd`),
    (function (e) {
      if (e && !s[e]) {
        if (i || l === null || (i = l),
        !i) {
          const t = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          t.setAttribute('xmlns', 'http://www.w3.org/2000/svg'),
          t.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink'),
          t.setAttribute('style', 'position: absolute; width: 0; height: 0'),
          t.setAttribute('id', c),
          i = document.body.insertBefore(t, document.body.firstChild || null);
        }
        if (i.querySelector(`#${e}`) !== null) return void (s[e] = 1);
        if (!o[e]) return;
        const n = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
        n.setAttribute('id', e),
        n.setAttribute('viewBox', o[e].size);
        const r = (new DOMParser()).parseFromString(o[e].content, 'image/svg+xml').documentElement;
        n.appendChild(r),
        i.appendChild(n),
        s[e] = 1;
      }
    }(f)),
    a.a.createElement('svg', {
      className: `a-icon-svg a-icon-${r}`,
      style: {
        width: n,
        height: n,
        fill: d
      },
      role: 'img'
    }, a.a.createElement('use', {
      xlinkHref: `#${f}`
    }), a.a.createElement('title', null, h['aria-label']));
  };
},
function (e, t, n) {
  const i = n(36);
  const r = n(121);
  const a = n(9);
  n.d(t, 'b', (() => l
  )),
  n.d(t, 'a', (() => u
  ));
  const o = '$DATASET.';

  function s(e, t) {
    return void 0 === t && (t = ''),
    typeof t === 'string' && ((t = t.trim()).charAt(0) === '.' && t.split(/\s+/).length === 1 ? e.root && e.root.classList.contains(t.slice(1)) : t.charAt(0) === '#' && e.props.id === t.slice(1));
  }

  function c(e, t) {
    const n = i.a.trackerConfig;
    if (n) {
      for (var c = e.props.$appx.getDataset(), l = e.props.$appx.bridge, u = 0; u < n.length; u++) {
        for (var p = n[u], d = p.eventCode, h = function (n, i) {
            const u = i[n];
            const p = u.data;
            const h = u.action;
            const f = u.element;
            if (u.trigger === t && s(e, f)) {
              const m = {};
              const v = {};
              Object(a.default)(p)
                .forEach(((e) => {
                  let t;
                  let n;
                  const
                    i = p[e];
                  n = o,
                  (t = i) && t.slice(0, n.length) === n ? v[e] = i.slice(o.length) : m[e] = i;
                }
                ));
              const g = Object(r.a)(c, v);
              l[h === 'collect' ? 'collectRemoteTrackerData' : 'reportRemoteTrackerData'](d, {
                dataConfig: m,
                params: g
              });
            }
          }, f = 0, m = p.eventTarget; f < m.length; f++) {
          h(f, m);
        }
      }
    }
  }

  function l(e) {
    (function (e) {
      if (!e || !i.a.clickElements) return !1;
      let t = !1;
      if (i.a.clickElements[`#${e.id}`]) {
        t = !0;
      } else {
        for (let n = e.getAttribute('class')
            .trim()
            .split(/\s+/), r = 0; r < n.length; r++) {
          const a = n[r];
          if (i.a.clickElements[`.${a}`]) {
            t = !0;
            break;
          }
        }
      }
      return t;
    }(e.root)) && c(e, 'click');
  }

  function u(e) {
    c(e, 'exposure');
  }
},
function (e, t, n) {
  function i(e, t) {
    for (let n = 0; n < t.length; n++) {
      const i = t[n];
      e.indexOf(i) === -1 && e.push(i);
    }
    return e;
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(16);
  const u = {
    isValidAnimation(e) {
      const t = e || this.props.animation;
      return t && t.length;
    },
    componentDidMount() {
      this._animTimer = [],
      this.isValidAnimation() && this.doAnimation();
    },
    componentDidUpdate(e) {
      this.props.animation !== e.animation && (this.isValidAnimation(e.animation) && this.stopAnimation(),
      this.isValidAnimation() && this.doAnimation());
    },
    componentWillUnmount() {
      this.deleteAllAnimTimers();
    },
    createAnimTimeout(e, t) {
      const n = this;
      var i = setTimeout((() => {
        n.deleteAnimTimer(i),
        e();
      }
      ), t);
      this._animTimer.push(i);
    },
    deleteAllAnimTimers() {
      for (let e = 0, t = this._animTimer; e < t.length; e++) {
        const n = t[e];
        clearTimeout(n);
      }
      this._animTimer = [];
    },
    deleteAnimTimer(e) {
      const t = this._animTimer.indexOf(e);
      t !== -1 && (clearTimeout(this._animTimer[t]),
      this._animTimer.splice(t, 1));
    }
  };
  const p = {
    width: 1,
    height: 1,
    top: 1,
    left: 1,
    bottom: 1,
    right: 1
  };
  const d = {
    opacity: 1,
    backgroundColor: 1
  };
  const h = {
    translateX: 1,
    translateY: 1,
    translateZ: 1
  };
  const f = {
    rotateX: 1,
    rotateY: 1,
    rotateZ: 1
  };
  const m = {
    skewX: 1,
    skewY: 1
  };
  const v = n(68);
  const g = n(7);
  const b = n(45);
  const y = n(13);
  const _ = n(102);
  const w = n(118);
  const C = {
    getInitialState() {
      return {
        __sjsClass: ''
      };
    },
    $hasClass(e) {
      e = this.props.$appx.getClassName(e);
      let t = this.getClassName(' ', this.props.className, this.state.__sjsClass) || '';
      return (t = t.split(' ')).indexOf(e) > -1;
    },
    $addClass() {
      for (var e = this, t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
      if (n.length) {
        const r = this.state.__sjsClass;
        let a = '';
        n.forEach(((t) => {
          (t = (t = e.props.$appx.getClassName(t)).replace(/^\s+|\s+$/g, '')) && (e.root.classList.contains(t) || (e.root.classList.toggle(t),
          a = a ? `${a} ${t}` : t));
        }
        )),
        this.setState({
          __sjsClass: a ? r + (r ? ' ' : '') + a : r
        });
      }
    },
    $removeClass() {
      for (var e = this, t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
      if (n.length) {
        let r = this.state.__sjsClass ? this.state.__sjsClass.split(/\s+/) : [];
        n.forEach(((t) => {
          (t = (t = e.props.$appx.getClassName(t)).replace(/^\s+|\s+$/g, '')) && e.root.classList.contains(t) && (e.root.classList.toggle(t),
          r = r.filter(((e) => e !== t
          )));
        }
        )),
        this.setState({
          __sjsClass: r.join(' ')
        });
      }
    },
    $setStyle(e) {
      let t;
      e && (typeof (t = e) === 'string' && (t = Object(_.b)(t.trim())),
      t = Object(w.a)(t),
      this.setState({
        __sjsStyle: t
      }));
    },
    getClassName(e, t, n) {
      return t ? n ? t + e + n : t : n;
    }
  };

  function x(e) {
    return typeof e === 'number' ? `${e}px` : e;
  }

  function T() {
  }

  function S(e, t) {
    return `${e}(${t.map(((e) => `${e}deg`
    ))
      .join(',')})`;
  }

  function E(e, t) {
    return `${e}(${t.join(',')})`;
  }

  function k(e, t) {
    return `${e}(${t.map(((e) => x(e)
    ))
      .join(',')})`;
  }

  function O(e, t) {
    if (e) {
      const n = new RegExp(`${t}\\([^)]+\\)`, 'gi');
      return e.replace(n, '');
    }
    return e;
  }

  const P = [Object(l.f)(), Object(l.d)(), Object(l.c)(), Object(l.e)(), Object(l.a)(), Object(l.b)(), u].concat(g.b.ViewMixins, [C]);
  g.b.VoiceMixin && P.push(g.b.VoiceMixin);
  var N = c()({
    displayName: 'View',
    mixins: P,
    getDefaultProps() {
      return {
        hoverClass: 'none',
        hoverStartTime: 50,
        hoverStayTime: 400,
        hoverStopPropagation: !1
      };
    },
    componentDidMount() {
      N.EventHub.emit('didMount', {
        dom: this.root,
        instance: this
      }),
      this.viewTapEvent = Object(b.a)(this.root, {
        tap: this.onViewTap
      });
    },
    componentWillUnmount() {
      this.viewTapEvent && (this.viewTapEvent = this.viewTapEvent.remove());
    },
    doAnimation() {
      const e = this;
      const t = this.props;
      let n = 0;
      const i = t.animation;
      const a = this.root.style;
      const o = i.length;
      i.forEach(((i, s) => {
        const c = i.config;
        const l = c.timeFunction;
        const u = c.delay;
        const v = void 0 === u ? 0 : u;
        const g = c.duration;
        const b = c.transformOrigin;
        n += v,
        e.createAnimTimeout((() => {
          r()(a, t.$appx.getNormalizedStyle({
            style: {
              transitionTimingFunction: l,
              transitionProperty: 'all',
              transitionDuration: `${g}ms`,
              transformOrigin: b
            }
          }));
          const n = (function (e, t, n) {
            for (var i = {}, r = (function (e) {
                for (var t = [], n = 0; n < e.length; n++) {
                  const i = e[n];
                  const r = i[0];
                  const a = i[1];
                  r === 'rotate' ? t.push(['rotateZ', a]) : r === 'scale' ? (t.push(['scaleX', [a[0]]]),
                  t.push(['scaleY', void 0 !== a[1] ? [a[1]] : [a[0]]])) : r === 'scale3d' ? (t.push(['scaleX', [a[0]]]),
                  t.push(['scaleY', [a[1]]]),
                  t.push(['scaleZ', [a[2]]])) : r === 'translate' ? (t.push(['translateX', [a[0]]]),
                  t.push(['translateY', [a[1]]])) : r === 'translate3d' ? (t.push(['translateX', [a[0]]]),
                  t.push(['translateY', [a[1]]]),
                  t.push(['translateZ', [a[2]]])) : r === 'skew' ? (t.push(['skewX', [a[0]]]),
                  t.push(['skewY', [a[1]]])) : t.push(i);
                }
                return t;
              }(t || [])), a = n.style.transform || '', o = 0; o < r.length; o++) {
              const s = r[o];
              const c = s[0];
              const l = s[1];
              if (p[c]) {
                i[c] = x(l[0]);
              } else if (d[c]) {
                i[c] = l[0];
              } else if (a = O(a, c),
              c === 'rotate3d') {
                const u = l.concat();
                u.length === 4 && (u[3] += 'deg'),
                a += ` ${c}(${u.join(',')})`;
              } else {
                f[c] || m[c] ? a += ` ${S(c, l)}` : h[c] ? a += ` ${k(c, l)}` : a += ` ${E(c, l)}`;
              }
            }
            return a && (i.transform = a.trim()),
            e.props.$appx.getNormalizedStyle({
              style: i
            });
          }(e, i.animation, e.root));
          if (e.createAnimTimeout((() => {
            r()(a, n);
          }
          ), 0),
          s === o - 1) {
            const c = g + v + 50;
            e.createAnimTimeout((() => {
              e.stopAnimation();
            }
            ), c);
          }
        }
        ), n),
        n += g + 10;
      }
      ));
    },
    stopAnimation() {
      this.deleteAllAnimTimers();
      const e = this.root.style;
      r()(e, this.props.$appx.getNormalizedStyle({
        style: {
          transitionTimingFunction: '',
          transitionProperty: '',
          transitionDelay: '',
          transitionDuration: '',
          transformOrigin: ''
        }
      }));
    },
    saveRoot(e) {
      this.hoverRoot = this.root = e;
    },
    onViewTap() {
      N.EventHub.emit('onTap', {
        instance: this
      });
    },
    render() {
      const e = this.props;
      const t = e.children;
      const n = e.hidden;
      const i = e.tagName;
      const a = void 0 === i ? 'div' : i;
      const s = e.presetDOMProps;
      const c = e.$appx;
      const l = a;
      let u = e.style;
      const p = this.state;
      const d = p.__sjsStyle;
      const h = p.__sjsClass;
      (n || d) && (u = r()({}, u, d, n ? {
        display: 'none'
      } : {}));
      const f = {
        className: h ? this.getClassName(' ', e.className, h) : e.className,
        style: u,
        ref: this.saveRoot,
        id: e.id,
        onClick: y.t ? this.onTap : T,
        onTransitionEnd: this.onTransitionEnd,
        onTouchStart: this.onTouchStart,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd,
        onTouchCancel: this.onTouchCancel,
        onAnimationStart: this.onAnimationStart,
        onAnimationIteration: this.onAnimationIteration,
        onAnimationEnd: this.onAnimationEnd
      };
      return s && r()(f, s),
      c.getDOMProps(f),
      c.getTrackerConfig(f),
      o.a.createElement(l, f, t);
    }
  });
  N.EventHub = new v.a();
  t.a = N;
},
function (e, t, n) {
  const i = n(92);

  function r() {
    this.deps = [],
    this.style = '';
  }

  r.prototype = {
    imports() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      return Object(i.a)(this.deps, t),
      this;
    },
    exports(e) {
      return this.style = e,
      this;
    },
    toObjects() {
      if (this.objectArray) return this.objectArray;
      this.objectArray = [];
      for (var e = [], t = 0, n = this.deps; t < n.length; t++) {
        const r = n[t].toObjects();
        Object(i.a)(e, r);
      }
      return e.push(this),
      this.objectArray = e,
      e;
    },
    toString() {
      return this.valueString ? this.valueString : (this.valueString = this.toObjects()
        .map(((e) => e.style
        ))
        .join('\n'),
      this.valueString);
    }
  },
  t.a = r;
},
function (e, t, n) {
  n.d(t, 'b', (() => o
  )),
  n.d(t, 'a', (() => s
  ));
  const i = n(96);
  const r = n(35);
  const a = {};

  function o(e) {
    return a[e];
  }

  function s(e) {
    const t = Object(i.b)(e);
    r.a.bridge.call;
    return new Promise((((e) => {
      t && t.length,
      e();
    })
    ));
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => l
  )),
  n.d(t, 'b', (() => d
  )),
  n.d(t, 'c', (() => h
  ));
  const i = n(92);
  const r = n(51);
  const a = n(53);
  const o = n(63);
  const s = n(66);
  const c = n(18);

  function l(e) {
    if (e in s.a) return s.a[e];
    const t = [];
    const n = a.a[e].system.usingComponents;
    if (n) {
      for (let o = 0, c = Object(r.a)(n); o < c.length; o++) {
        const l = u(c[o]);
        Object(i.a)(t, l);
      }
      s.a[e] = t;
    }
    return t;
  }

  function u(e) {
    if (e = Object(c.i)(e, {
      isPage: !1
    }),
    s.c[e]) {
      return s.c[e];
    }
    const t = s.c[e] = [e];
    if (o.a[e]) {
      for (let n = o.a[e].system.usingComponents, a = void 0 === n ? {} : n, l = 0, p = Object(r.a)(a); l < p.length; l++) {
        const d = u(p[l]);
        Object(i.a)(t, d);
      }
    }
    return t;
  }

  const p = {};

  function d(e) {
    if (e in p) return p[e];
    const t = /^plugin-private:\/\/([^\/]+)\//;
    const n = l(e)
      .map(((e) => {
        const n = e.match(t);
        return n && n[1];
      }
      ))
      .filter(Boolean);
    return p[e] = n,
    n;
  }

  function h(e) {
    return u(e);
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => s
  ));
  const i = /^\./;
  const r = /[^.[\]]+|\[(?:(-?\d+)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  const a = /\\(\\)?/g;
  const o = {};

  function s(e) {
    if (o[e]) return o[e];
    const t = [];
    return i.test(e) && t.push(''),
    e.replace(r, ((e, n, i, r) => {
      let o = e;
      i ? o = r.replace(a, '$1') : n && (o = parseInt(n, 10)),
      t.push(o);
    }
    )),
    o[e] = t,
    t;
  }
},
function (e, t, n) {
  n.d(t, 'a', (() => i
  )),
  n.d(t, 'b', (() => r
  )),
  n.d(t, 'c', (() => a
  ));
  var i = 'PAGE_NOT_FOUND';
  var r = 'PAGE_NOT_FOUND_WITH_RESCUE_TRY';

  function a(e) {
    const t = new Error(`page '${e}' not found!`);
    return t.type = i,
    t;
  }
},
function (e, t, n) {
  let i;
  n.d(t, 'a', (() => i
  )),
  (function (e) {
    e.inside = 'inside',
    e.TB = 'TB',
    e.common = 'common';
  }(i || (i = {})));
},
function (e, t, n) {
  function i(e) {
    return Math.sqrt(e.x * e.x + e.y * e.y);
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  n.d(t, 'a', (() => a
  ));
  const i = n(0);
  const r = n.n(i);

  function a(e, t) {
    return void 0 === t && (t = []),
    r.a.Children.forEach(e, ((e) => {
      e && e.type === r.a.Fragment ? a(e.props.children, t) : t.push(e);
    }
    )),
    t;
  }
},
function (e, t, n) {
  const i = n(118);
  const r = n(34);

  function a(e) {
    const t = {};
    if (e) {
      for (var n = 0, i = {}, r = e.replace(/url\([^)]+\)/g, ((e) => (i[n += 1] = e,
        `_appx_${n}`)
        ))
          .split(';')
          .filter(((e) => !!e.trim()
          ))
          .map(((e) => e.replace(/_appx_(\d+)/g, ((e, t) => i[t] || e
          ))
          )), a = 0; a < r.length; a++) {
        const o = r[a];
        const s = o.indexOf(':');
        let c = void 0;
        let l = void 0;
        s !== -1 && (c = o.slice(0, s)
          .trim(),
        l = o.slice(s + 1)
          .trim(),
        t[c] = l);
      }
    }
    return t;
  }

  function o(e, t) {
    let n;
    const o = t || e.props;
    const
      s = o.style;
    if (s && (typeof (n = s) === 'string' && (n = a(n.trim())),
    n = Object(i.a)(n)),
    r.a.browser) {
      return n;
    }
    o.className,
    o.id;
    let c = [];
    e.$appx.tagName;
    return c = (function (e, t, n, i, r) {
      return e;
    }(c)),
    n && c.push(n),
    c.length || (c = void 0),
    c;
  }

  n.d(t, 'b', (() => a
  )),
  n.d(t, 'a', (() => o
  ));
},
function (e, t, n) {
  const i = n(69);
  const r = n(104);
  const a = n(18);
  const o = n(32);
  const s = 'COMPONENT_NOT_FOUND';
  n.d(t, 'a', (() => l
  ));
  const c = {};

  function l(e) {
    const t = Object(a.i)(e, {
      isPage: !1
    });
    const n = i.a.getComponent(t);
    if (!n) {
      let l = 'unknown';
      const u = Object(r.a)();
      if (u && (l = u.getCurrentPageImpl()) && (l = l.getPagePath()),
      !c[`${e}-${l}`]) {
        c[`${e}-${l}`] = 1;
        let p = `Can not find Component ${e}`;
        e.indexOf(a.a) === 0 && (p += ` in Page: ${l}`),
        console.warn(p);
        const d = new Error(p);
        d.type = s,
        Object(o.a)(d);
      }
      return Object(a.c)(t);
    }
    return n;
  }
},
function (e, t, n) {
  let i;
  n.d(t, 'b', (() => r
  )),
  n.d(t, 'a', (() => a
  ));
  self;

  function r(e) {
    i = e;
  }

  function a() {
    return i;
  }
},
function (e, t, n) {
  n.d(t, 'b', (() => y
  )),
  n.d(t, 'a', (() => _
  ));
  const i = n(56);
  const r = n(62);
  const a = n(34);
  const o = n(65);
  const s = n(53);
  const c = n(63);
  const l = n(96);
  const u = n(14);
  const p = n(94);
  const d = n(49);
  const h = n(77);

  function f(e) {
    for (var t = [], n = 0; n < e.length; n++) {
      const r = e[n];
      if (!d.b[r]) {
        const a = c.a[r];
        const o = a && a.system.stylesheet;
        o && t.push(Object(i.a)(o)),
        d.b[r] = 1;
      }
    }
    return t;
  }

  const m = a.a.browser === 'ios' ? '0.5px' : '1px';
  const v = 'data-page-path';
  const g = document.getElementsByTagName('head')[0];

  function b(e, t, n) {
    if (void 0 === n && (n = v),
    e) {
      for (var i = !1, a = [].concat.apply([], g.getElementsByTagName('style')), o = 0; o < a.length; o++) {
        if (a[o].getAttribute(n) === t) {
          i = !0;
          break;
        }
      }
      if (!i) {
        const s = Object(r.b)(2) < 1 ? /\b0\.0[12]rem/g : Object(r.b)(1) < 1 ? /\b0\.01rem/g : null;
        let c = e.toString();
        if (c) {
          const l = document.createElement('style');
          l.type = 'text/css',
          l.setAttribute(n, t),
          s && (c = c.replace(s, m)),
          l.innerHTML = c,
          g.appendChild(l);
        }
      }
    }
  }

  function y(e) {
    e in d.c || b((function (e) {
      if (e in d.c) return d.c[e];
      const t = new p.a();
      const n = f(Object(l.c)(e));
      return n.length && t.imports.apply(t, n),
      d.c[e] = t,
      t;
    }(e)), e, 'data-component-path');
  }

  function _(e) {
    document.documentElement.style.fontSize = !1 !== Object(h.a)() ? `${100 * Object(o.a)() / 750}px` : '50px',
    b((function (e) {
      if (e in d.c) return d.c[e];
      let t;
      let n;
      const r = s.a[e].system;
      const a = r.stylesheet;
      const o = r.usingComponents;
      let c = [];
      const
        h = Object(u.b)();
      return t = a ? Object(i.a)(a) : new p.a(),
      o && (c = f(Object(l.a)(e))),
      h && h.stylesheet && c.unshift(Object(i.a)(h.stylesheet)),
      c.length && (n = t).imports.apply(n, c),
      d.c[e] = t,
      t;
    }(e)), e);
  }

  window.addEventListener('resize', (() => {
    const e = document.documentElement.clientWidth;
    !1 !== Object(h.a)() && e !== Object(o.a)() && e > 0 && (Object(o.c)(e),
    document.documentElement.style.fontSize = `${100 * Object(o.a)() / 750}px`);
  }
  ));
},
function (e, t, n) {
  n.d(t, 'a', (() => l
  )),
  n.d(t, 'b', (() => m
  ));
  const i = n(42);
  const r = n(19);
  const a = ['pageLoad', 'pageShow', 'pageHide', 'pageReady', 'pageUnload', 'pageUpdate'];
  const o = ['onAppLaunch', 'onAppShow', 'onAppHide', 'onAppError', 'onAppUnhandledRejection'];
  const s = ['onTabItemTap', 'onPageScroll', 'onReachBottom', 'onPopMenuClick', 'onTitleClick', 'onOptionMenuClick', 'onPullDownRefresh', 'onPullIntercept'];

  function c() {
  }

  for (var l = {}, u = 0, p = [].concat(o, s, ['onShareAppMessage', 'onSetData', 'onRenderBlockError']); u < p.length; u++) {
    const d = p[u];
    l[d] = c;
  }

  function h(e) {
    return /\w+Sync$/.test(e);
  }

  function f(e) {
    for (let t = function (t) {
        const n = a[t];
        r.a.addListener(n, ((t) => {
          let r;
          const a = t.page;
          const
            o = {
              page: a.publicInstance
            };
          n === 'pageLoad' && (o.query = a.query),
          Object(i.b)(e[`on${r = n,
          r[0].toUpperCase() + r.slice(1)}`], o);
        }
        ));
      }, n = 0; n < a.length; n++) {
      t(n);
    }
    for (let c = function (t) {
        const n = s[t];
        l[n] = function (t, r) {
          Object(i.b)(e[n], {
            page: t.publicInstance,
            options: r
          });
        };
      }, u = 0; u < s.length; u++) {
      c(u);
    }
    for (let p = function (t) {
        const n = o[t];
        l[n] = function (t, r) {
          let a;
          const
            o = n === 'appError' ? 'error' : 'options';
          Object(i.b)(e[n], ((a = {})[o] = r,
          a.app = t.publicInstance,
          a));
        };
      }, d = 0; d < o.length; d++) {
      p(d);
    }
    l.onSetData = function (t, n, r) {
      let a;
      void 0 === r && (r = !0);
      const o = r ? 'page' : 'component';
      Object(i.b)(e.onSetData, ((a = {})[o] = t.publicInstance,
      a.options = n,
      a.isPage = r,
      a));
    }
    ,
    l.onShareAppMessage = function (t, n, r) {
      let a;
      const
        o = r ? 'page' : 'app';
      Object(i.b)(e.onShareAppMessage, ((a = {
        options: n,
        isPage: r
      })[o] = t.publicInstance,
      a));
    }
    ,
    l.onRenderBlockError = function (t) {
      void 0 === t && (t = !1),
      Object(i.b)(e.onRenderBlockError, t);
    }
    ,
    r.a.addListener('apiSyncCall', ((t) => {
      const n = t.name;
      const r = t.reqId;
      const a = t.params;
      h(n) && Object(i.b)(e.onApiSyncCall, {
        name: n,
        reqId: r,
        params: a
      });
    }
    )),
    r.a.addListener('apiCall', ((t) => {
      const n = t.name;
      const r = t.reqId;
      const a = t.params;
      h(n) || Object(i.b)(e.onApiCall, {
        name: n,
        reqId: r,
        params: a
      });
    }
    )),
    r.a.addListener('apiSyncCallback', ((t) => {
      const n = t.name;
      const r = t.res;
      const a = void 0 === r ? {} : r;
      const o = t.params;
      const s = void 0 === o ? {} : o;
      const c = t.reqId;
      h(n) && Object(i.b)(e.onApiSyncCallback, {
        name: n,
        res: a,
        params: s,
        reqId: c
      });
    }
    )),
    r.a.addListener('apiCallback', ((t) => {
      const n = t.name;
      const r = t.res;
      const a = void 0 === r ? {} : r;
      const o = t.params;
      const s = void 0 === o ? {} : o;
      const c = t.reqId;
      h(n) || Object(i.b)(e.onApiCallback, {
        name: n,
        res: a,
        params: s,
        reqId: c
      });
    }
    ));
  }

  function m() {
    return Object(i.a)(f);
  }
},
function (e, t, n) {
  function i(e, t) {
    return e && e.slice(0 - t.length) === t;
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  function i(e, t, n) {
    let i;
    let r;
    let a;
    let o;
    let s;
    let c;
    let l = 0;
    let u = !1;
    let p = !1;
    let d = !0;
    const
      h = !t && t !== 0 && typeof requestAnimationFrame === 'function';

    function f(t) {
      const n = i;
      const a = r;
      return i = r = void 0,
      l = t,
      o = e.apply(a, n);
    }

    function m(e, t) {
      return h ? requestAnimationFrame(e) : setTimeout(e, t);
    }

    function v(e) {
      return l = e,
      s = m(b, t),
      u ? f(e) : o;
    }

    function g(e) {
      const n = e - c;
      return void 0 === c || n >= t || n < 0 || p && e - l >= a;
    }

    function b() {
      const e = Date.now();
      if (g(e)) return y(e);
      s = m(b, (function (e) {
        const n = e - l;
        const i = t - (e - c);
        return p ? Math.min(i, a - n) : i;
      }(e)));
    }

    function y(e) {
      return s = void 0,
      d && i ? f(e) : (i = r = void 0,
      o);
    }

    t = +t || 0,
    n && (u = n.leading,
    a = (p = 'maxWait' in n) ? Math.max(+n.maxWait || 0, t) : a,
    d = 'trailing' in n ? n.trailing : d);
    const _ = function () {
      for (var e = Date.now(), n = g(e), a = arguments.length, l = new Array(a), u = 0; u < a; u++) l[u] = arguments[u];
      if (i = l,
      r = this,
      c = e,
      n) {
        if (void 0 === s) return v(c);
        if (p) {
          return s = m(b, t),
          f(c);
        }
      }
      return void 0 === s && (s = m(b, t)),
      o;
    };
    return _.cancel = function () {
      void 0 !== s && (function (e) {
        if (h) return cancelAnimationFrame(e);
        clearTimeout(e);
      }(s)),
      l = 0,
      i = c = r = s = void 0;
    }
    ,
    _.flush = function () {
      return void 0 === s ? o : y(Date.now());
    }
    ,
    _.pending = function () {
      return void 0 !== s;
    }
    ,
    _;
  }

  n.d(t, 'a', (() => i
  ));
},
function (e, t, n) {
  n.d(t, 'a', (() => r
  ));
  const i = n(1);
  var r = function () {
    return `TinyAppBiz-${Object(i.g)().appId}`;
  };
},
function (e, t, n) {
  let i;
  let r;
  const a = n(36);
  const o = n(91);
  const s = n(84);
  let c = !1;
  const l = {};
  const u = [];
  let p = 0;
  const
    d = function () {
      r && (r = cancelAnimationFrame(r)),
      r = requestAnimationFrame((() => {
        for (let e = 0; e < u.length; e++) {
          const t = u[e];
          const n = l[t];
          n && n.checkVisible && !n.handleRafId && (n.rafId && (n.rafId = cancelAnimationFrame(n.rafId)),
          n.rafId = requestAnimationFrame(n.checkVisible));
        }
      }
      ));
    };
  t.a = {
    componentDidMount() {
      this.appxComponentId = ++p,
      this.viewAppear = !1,
      this.firstAppeared = !1,
      this.exposureStatus = 0,
      a.a.exposureElements && this.onExposureConfigChange(),
      a.a.onChange(this.onExposureConfigChange),
      this.handleAppearAndExposure();
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.className;
      const i = t.id;
      a.a.exposureElements && this.exposureStatus !== 2 && (n && n !== e.className || i && i !== e.id) && this.onExposureConfigChange(),
      this.handleAppearAndExposure();
    },
    componentWillUnmount() {
      a.a.offChange(this.onExposureConfigChange),
      this.removeCheckAppearAndExposureConfig(),
      this.removeAllParentEventLister();
    },
    onExposureConfigChange() {
      this.exposureStatus === 0 && this.root && (function (e) {
        let t = !1;
        if (!a.a.exposureElements) return t;
        if (a.a.exposureElements[`#${e.id}`]) {
          t = !0;
        } else {
          for (let n = e.getAttribute('class')
              .trim()
              .split(/\s+/), i = 0; i < n.length; i++) {
            const r = n[i];
            if (a.a.exposureElements[`.${r}`]) {
              t = !0;
              break;
            }
          }
        }
        return t;
      }(this.root)) && (this.exposureStatus = 1,
      this.handleAppearAndExposure());
    },
    hasAppearEvent() {
      const e = this.props;
      const t = e.onAppear;
      const n = e.onDisappear;
      return !(!e.onFirstAppear || this.firstAppeared) || !(!t && !n);
    },
    removeAllParentEventLister() {
      this.scrollParentEvent && (this.scrollParentEvent(),
      this.scrollParentEvent = null),
      this.swiperParentEvent && (this.swiperParentEvent(),
      this.swiperParentEvent = null);
    },
    removeCheckAppearAndExposureConfig() {
      if (l[this.appxComponentId]) {
        const e = u.indexOf(this.appxComponentId);
        e !== -1 && u.splice(e, 1),
        delete l[this.appxComponentId];
      }
      u.length || (window.removeEventListener('scroll', d),
      c = !1);
    },
    getScrollParent() {
      return this.scrollParent && this.scrollParent.parentNode !== null ? this.scrollParent : this.findScrollParent(this.root);
    },
    getSwiperParent() {
      return this.swiperParent && this.swiperParent.parentNode !== null ? this.swiperParent : this.findSwiperParent(this.root);
    },
    getScrollViewParent() {
      return this.scrollViewParent && this.scrollViewParent.parentNode !== null ? this.scrollViewParent : this.findScrollViewParent(this.root);
    },
    scrollAndAnimationCallback() {
      this.rafId && (this.rafId = cancelAnimationFrame(this.rafId)),
      this.rafId = requestAnimationFrame(this.checkVisible);
    },
    handleAppearAndExposure() {
      const e = this;
      this.hasAppearEvent() || this.exposureStatus === 1 ? (l[this.appxComponentId] || (l[this.appxComponentId] = this,
      u.push(this.appxComponentId),
      c || (window.addEventListener('scroll', d, {
        passive: !0
      }),
      c = !0)),
      this.handleRafId && (this.handleRafId = cancelAnimationFrame(this.handleRafId)),
      this.handleRafId = requestAnimationFrame((() => {
        e.rafId && cancelAnimationFrame(e.rafId),
        e.checkVisible();
        const t = e.getScrollParent();
        const n = e.getSwiperParent();
        const i = e.getScrollViewParent();
        t ? e.scrollParent === t && void 0 !== e.scrollParent || (e.scrollParentEvent && (e.scrollParentEvent(),
        e.scrollParentEvent = null),
        e.scrollParent = t,
        t.addEventListener('scroll', e.scrollAndAnimationCallback, {
          passive: !0
        }),
        e.scrollParentEvent = function () {
          t.removeEventListener('scroll', e.scrollAndAnimationCallback, {
            passive: !0
          });
        }
        ) : e.scrollParentEvent && (e.scrollParentEvent(),
        e.scrollParentEvent = null),
        i ? i !== t && (e.scrollViewParent === i && void 0 !== e.scrollViewParent || (e.scrollViewParentEvent && (e.scrollViewParentEvent(),
        e.scrollViewParentEvent = null),
        e.scrollViewParent = i,
        i.addEventListener('scroll', e.scrollAndAnimationCallback, {
          passive: !0
        }),
        e.scrollViewParentEvent = function () {
          i.removeEventListener('scroll', e.scrollAndAnimationCallback, {
            passive: !0
          });
        }
        )) : e.scrollViewParentEvent && (e.scrollViewParentEvent(),
        e.scrollViewParentEvent = null),
        n ? e.swiperParent === n && void 0 !== e.swiperParent || (e.swiperParentEvent && (e.swiperParentEvent(),
        e.swiperParentEvent = null),
        e.swiperParent = n,
        n.addEventListener('swiperAnimationEnd', e.scrollAndAnimationCallback),
        e.swiperParentEvent = function () {
          n.removeEventListener('swiperAnimationEnd', e.scrollAndAnimationCallback);
        }
        ) : e.swiperParentEvent && (e.swiperParentEvent(),
        e.swiperParentEvent = null),
        e.handleRafId = cancelAnimationFrame(e.handleRafId);
      }
      ))) : (this.removeCheckAppearAndExposureConfig(),
      this.removeAllParentEventLister());
    },
    findSwiperParent(e) {
      if (e) {
        const t = e.parentNode;
        return t && t !== document.body ? t.hasAttribute('is-scroll-parent') ? t : this.findSwiperParent(t) : void 0;
      }
    },
    findScrollViewParent(e) {
      if (e) {
        const t = e.parentNode;
        return t && t !== document.body ? t.classList.contains('a-scroll-view') ? t : this.findScrollViewParent(t) : void 0;
      }
    },
    findScrollParent(e) {
      if (e) {
        const t = e.parentNode;
        if (t && t !== document.body) {
          const n = window.getComputedStyle(t);
          const i = n['overflow-x'];
          const r = n['overflow-y'];
          return i === 'auto' || r === 'auto' || i === 'scroll' || r === 'scroll' ? t : this.findScrollParent(t);
        }
      }
    },
    checkVisible() {
      if (this.root) {
        const e = this.props;
        const t = e.onAppear;
        const n = e.onDisappear;
        const r = e.onFirstAppear;
        const c = e.appearOffset;
        const l = void 0 === c ? 0 : c;
        const u = this.root.getBoundingClientRect();
        let p = !1;
        if (u.width * u.height > 0) {
          let d = this.scrollParent ? this.scrollParent.getBoundingClientRect() : void 0;
          if (this.swiperParent) {
            const h = this.swiperParent.getBoundingClientRect();
            d = void 0 === d ? h : Object(s.a)(d, h);
          }
          if (this.scrollViewParent && this.scrollViewParent !== this.scrollParent) {
            const f = this.scrollViewParent.getBoundingClientRect();
            d = void 0 === d ? f : Object(s.a)(d, f);
          }
          const m = Object(s.b)(u, d, l);
          const v = m.width * m.height;
          p = l > 0 ? v > 0 : v / Math.min(u.width * u.height, (function () {
            if (!i) {
              const e = document.documentElement;
              i = e.clientHeight * e.clientWidth;
            }
            return i;
          }())) >= 0.5;
        }
        p ? (this.viewAppear || (t && t(),
        this.firstAppeared || (this.firstAppeared = !0,
        r && r())),
        this.hasAppearEvent() || this.exposureStatus === 1 || this.removeAllParentEventLister(),
        this.viewAppear = !0) : (this.viewAppear && n && n(),
        this.viewAppear = !1),
        this.exposureStatus === 1 && !0 === this.firstAppeared && (this.exposureStatus = 2,
        Object(o.a)(this),
        a.a.offChange(this.onExposureConfigChange),
        this.handleAppearAndExposure()),
        this.rafId && (this.rafId = cancelAnimationFrame(this.rafId));
      }
    }
  };
},
function (e, t, n) {
  const i = n(3);
  const r = n.n(i);
  const a = n(27);
  const o = n.n(a);
  const s = n(0);
  const c = n.n(s);
  const l = n(21);
  const u = n.n(l);
  const p = n(81);
  const d = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  const h = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    return o()(t, e),
    t.prototype.render = function () {
      let e;
      const t = this.props;
      const n = t.children;
      const i = t.className;
      const a = t.type;
      const o = t.size;
      const s = t.disabled;
      const l = t.loading;
      const h = t.onClick;
      const f = t.deepRef;
      const m = d(t, ['children', 'className', 'type', 'size', 'disabled', 'loading', 'onClick', 'deepRef']);
      const v = u()(((e = {})[i] = !0,
      e['a-button-primary'] = a === 'primary',
      e['a-button-ghost'] = a === 'ghost',
      e['a-button-warn'] = a === 'warn',
      e['a-button-small'] = o === 'mini',
      e['a-button-disabled'] = s,
      e));
      const
        g = {
          'data-clickable': !0
        };
      return s && (g.disabled = 'true'),
      c.a.createElement('a', r()({
        role: 'button',
        className: v
      }, m, g, {
        onClick: s ? void 0 : h,
        'aria-disabled': s,
        ref: f
      }), l ? c.a.createElement(p.a, {
        mode: a === 'primary' ? 'white' : ''
      }) : null, n);
    }
    ,
    t;
  }(c.a.PureComponent));
  t.a = h;
},
function (e, t, n) {
  n.d(t, 'a', (() => d
  ));
  const i = n(3);
  const r = n.n(i);
  const a = n(27);
  const o = n.n(a);
  const s = n(0);
  const c = n.n(s);
  const l = n(21);
  const u = n.n(l);
  const p = n(90);
  var d = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    return o()(t, e),
    t.prototype.render = function () {
      let e;
      const t = this.props;
      const n = t.id;
      const i = t.prefixCls;
      const a = t.className;
      const o = void 0 === a ? '' : a;
      const s = t.style;
      const l = t.type;
      const d = void 0 === l ? 'checkbox' : l;
      const h = t.disabled;
      const f = t.checked;
      const m = t.onChange;
      const v = t.color;
      const g = t.role;
      const b = void 0 === g ? this.props.type || 'checkbox' : g;
      const y = u()(((e = {})['a-shared-checkbox'] = !0,
      e['a-shared-checkbox-disabled'] = h,
      e[o] = !0,
      e[`${i}-checked`] = f,
      e[`${i}-disabled`] = h,
      e));
      const
        _ = h ? {
          color: '#adadad'
        } : v ? {
          color: v
        } : {};
      return c.a.createElement('span', {
        className: y,
        style: s,
        id: n,
        role: b,
        'aria-checked': f
      }, c.a.createElement('input', {
        type: d,
        disabled: h,
        className: `${i}-input`,
        checked: !!f,
        onChange: m
      }), f ? c.a.createElement(p.a, r()({
        type: d === 'radio' ? 'success' : 'success_no_circle',
        size: d === 'radio' ? 22 : 16
      }, _)) : null);
    }
    ,
    t;
  }(c.a.PureComponent));
},
function (e, t, n) {
  const i = n(0);
  const r = n.n(i);
  t.a = r.a.createContext({});
},
function (e, t, n) {
  n.d(t, 'a', (() => o
  ));
  const i = n(2);
  const r = n(11);
  const a = window.devicePixelRatio;

  function o(e, t, n) {
    if (e && (e.focus(),
    i.l)) {
      if (Object(i.h)('2.13') >= 0 || !0 === n && e.type !== 'password' && !1 === t) return null;
      const o = e.getBoundingClientRect();
      const s = o.right;
      const c = o.bottom;
      Object(r.a)('inputFocus4Android', {
        coordinateX: String(s * a),
        coordinateY: String(c * a)
      });
    }
  }
},
function (e, t, n) {
  const i = n(0);
  const r = n.n(i);
  t.a = r.a.createContext({});
},
function (e, t, n) {
  n.d(t, 'a', (() => o
  ));
  let i;
  const r = n(1);
  const
    a = n(2);

  function o() {
    if (i == null) {
      const e = Object(r.g)().isVoiceOverRunning;
      i = r.h.getSwitch('a11yComponentEnable', !1) && !!/AlipayDefined\(.*(ac\:.*V.*)\)/g.exec(a.w) || !0 === e;
    }
    return i;
  }
},
function (e, t, n) {
  const i = n(0);
  const r = n.n(i);
  t.a = r.a.createContext({});
},
function (e, t, n) {
  const i = n(67);
  const r = n(62);
  const a = new RegExp('^((?:NaN|-?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity)))$');

  function o(e) {
    let t = e;
    return typeof t === 'string' && (t = t.replace(/\b([.\d]+)rpx\b/gi, ((e, t) => `${Object(r.a)(parseFloat(t))}`
    )),
    t.trim()
      .match(a)) ? parseFloat(t) : t;
  }

  function s(e, t) {
    let n;
    return (n = {})[e] = o(t[e]),
    n;
  }

  const c = n(126);
  const l = n.n(c);

  function u(e) {
    return l.a.supportedProperty(e);
  }

  function p(e, t) {
    return l.a.supportedValue(e, t);
  }

  function d(e) {
    return e.indexOf('flex') !== -1 || e.indexOf('display') !== -1;
  }

  const h = n(17);

  function f(e) {
    for (var t = {}, n = 0, r = Object(h.a)(e); n < r.length; n++) {
      const a = s(r[n], e);
      if (!1 === a) return;
      for (let o = 0, c = Object(h.a)(a); o < c.length; o++) {
        const l = c[o];
        const f = a[l];
        const m = l.indexOf('--') === 0 ? l : u(Object(i.a)(l));
        m && (t[m] = d(m) ? p(m, f) : f);
      }
    }
    return t;
  }

  n.d(t, 'a', (() => f
  ));
},
function (e, t, n) {
  const i = n(14);
  const r = n(24);
  const a = n(18);

  function o(e, t) {
    const n = t.split('/');
    n[n.length - 1] && n.pop();
    for (var i = n.concat(e.split('/')), r = [], a = 0; a < i.length; a++) {
      const o = i[a];
      o && o !== '.' && (o === '..' ? r.pop() : r.push(o));
    }
    return r.join('/');
  }

  const s = function (e, t) {
    let n = e;
    let i = '';
    const s = n.indexOf('?');
    return s !== -1 && (i = n.slice(s + 1),
    n = n.slice(0, s)),
    n.charAt(0) === '/' ? n = n.slice(1) : t && (n = (function (e, t) {
      if (Object(a.h)(e)) return e;
      if (Object(r.a)(e, '/')) return e;
      if (Object(r.a)(e, './') || Object(r.a)(e, '../') || (e = `./${e}`),
      Object(a.h)(t)) {
        const n = t.match(/^(plugin(-private)?:\/\/[^\/]+)\/(.*)/);
        return `${n[1]}/${o(e, n[3])}`;
      }
      return o(e, t);
    }(n, t))),
    `${n}${i = i ? `?${i}` : i}`;
  };
  n.d(t, 'a', (() => l
  ));
  const c = ['http://', 'https://', 'file://', 'data:image', 'myfile://', 'local://', 'temp://', '//'];

  function l(e, t, n) {
    let o;
    if (void 0 === t && (t = {}),
    typeof e === 'string' && e.trim()) {
      if (c.some(((t) => Object(r.a)(e, t)
      ))) {
        o = e;
      } else {
        let l = (n || Object(i.d)()).getPagePath();
        const u = t.pluginId;
        u && (l = t.owner.is || t.owner.getPagePath()),
        o = s(e, l);
        const p = global.appXRuntimeConfig;
        if (p && p.resolvePluginUrl) return o = p.resolvePluginUrl(o, u);
        u && Object(r.a)(o, a.b) && (o = o.replace(a.b, '/__plugins__/')),
        Object(r.a)(o, '/') || (o = `/${o}`),
        u && !Object(r.a)(o, '/__plugins__/') && (o = `/__plugins__/${u}${o}`),
        p && p.contextPath && (o = p.contextPath + o);
      }
    }
    return o;
  }
},
function (e, t, n) {
  const i = n(119);
  n.d(t, 'a', (() => o
  )),
  n.d(t, 'b', (() => s
  ));
  let r = 0;
  const a = {};

  function o(e, t) {
    const n = t.success;
    const o = t.fail;
    const s = Object(i.a)(e);
    let c = a[s];
    c ? n(c) : (c = new Image(),
    e.indexOf('data:image') !== 0 && (c.crossOrigin = 'Anonymous'),
    c.src = s,
    c._cacheSrc = s,
    c._src = e,
    c._id = ++r,
    !(function (e) {
      return !!e.complete && (void 0 === e.naturalWidth || e.naturalWidth !== 0);
    }(c)) ? (c.onload = function () {
        n(c);
      }
      ,
      c.onerror = function () {
        o(c);
      }
      ) : n(c));
  }

  function s(e, t) {
    const n = {};
    const i = {};
    const r = e.length;
    let s = 0;

    function c() {
      ++s === r && t({
        loaded: n,
        failed: i
      });
    }

    function l(e) {
      const t = e._src;
      a[e._cacheSrc] = e,
      n[t] = (function (e) {
        return {
          url: e._src,
          width: e.naturalWidth,
          height: e.naturalHeight,
          id: e._id
        };
      }(e)),
      c();
    }

    function u(e) {
      const t = e._src;
      i[t] = {
        url: t,
        id: -1,
        width: -1,
        height: -1
      },
      c();
    }

    for (let p = 0; p < r; p++) {
      o(e[p], {
        success: l,
        fail: u
      });
    }
  }
},
function (e, t, n) {
  const i = n(97);
  const r = n(9);

  function a(e, t) {
    if (e) {
      const n = {};
      return Object(r.default)(t)
        .forEach(((r) => {
          n[r] = (function (e, t) {
            if (e) {
              for (var n = 0, r = (t = Object(i.a)(t)).length; e && n < r;) e = e[t[n++]];
              return n && n === r ? e : void 0;
            }
            return e;
          }(e, t[r]));
        }
        )),
      n;
    }
  }

  n.d(t, 'a', (() => a
  ));
},
function (e, t, n) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  });
  let i;
  const
    r = n(123);
  let a = '';
  let o = '';
  if (((i = r) && i.__esModule ? i : {
    default: i
  }).default) {
    const s = {
      Moz: '-moz-',
      ms: '-ms-',
      O: '-o-',
      Webkit: '-webkit-'
    };
    const c = document.createElement('p').style;
    for (const l in s) {
      if (`${l}Transform` in c) {
        a = l,
        o = s[l];
        break;
      }
    }
  }
  t.default = {
    js: a,
    css: o
  };
},
function (e, t, n) {
  n.r(t),
  n.d(t, 'isBrowser', (() => r
  ));
  const i = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (e) {
    return typeof e;
  }
    : function (e) {
      return e && typeof Symbol === 'function' && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
    };
  var r = (typeof window === 'undefined' ? 'undefined' : i(window)) === 'object' && (typeof document === 'undefined' ? 'undefined' : i(document)) === 'object' && document.nodeType === 9;
  t.default = r;
},
function (e, t, n) {
  n.r(t),
  n.d(t, 'default', (() => p
  ));
  const i = n(27);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(103);
  const c = n(105);
  const l = n(18);
  const u = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  var p = (function (e) {
    function t(t) {
      let n;
      return (n = e.call(this, t) || this).injectComponentStyle(),
      n;
    }

    r()(t, e);
    const n = t.prototype;
    return n.getSnapshotBeforeUpdate = function (e) {
      return this.props.is !== e.is && this.props.is && this.injectComponentStyle(),
      null;
    }
    ,
    n.injectComponentStyle = function () {
      const e = Object(l.e)(this.props.is);
      e && Object(c.b)(e);
    }
    ,
    n.render = function () {
      const e = this.props;
      const t = e.is;
      const n = (e.key,
      u(e, ['is', 'key']));
      const i = Object(l.e)(t);
      const r = Object(s.a)(i);
      return r ? o.a.createElement(r, n) : null;
    }
    ,
    t;
  }(o.a.Component));
},
function (e, t, n) {
  n.r(t),
  n.d(t, 'default', (() => d
  ));
  const i = n(0);
  const r = n.n(i);
  const a = n(5);
  const o = n.n(a);
  const s = n(1);
  const c = n(9);
  const l = n(58);
  const u = {
    navigateTo(e) {
      Object(s.e)()
        .callRemoteBridge('navigateTo', e);
    }
  };
  const p = self;

  function d(e, t, n) {
    let i;
    void 0 === e && (e = {}),
    void 0 === t && (t = !1);
    const a = e;
    const d = a.name;
    const h = a.factory;
    const f = a.pure;
    const m = a.isReactComponent;
    const v = a.needChildren;
    const g = Object(l.a)(d);
    Object.defineProperty(p.AFAppX || n, g, {
      configurable: !0,
      get() {
        return (function () {
          if (i) return i;
          const e = h({
            createReactClass: o.a,
            extraBridge: u
          });
          return i = t && m || void 0 !== e.prototype.isReactComponent ? Object(s.c)({
            name: d,
            pure: f
          })(e) : Object(s.c)({
            name: d,
            pure: f
          })(o()({
            displayName: g,
            componentDidMount() {
              this.cachedHandles = {},
              this.renderExtraComponent('mount');
            },
            componentDidUpdate() {
              this.renderExtraComponent('update');
            },
            componentWillUnmount() {
              this._unloaded = !0,
              this.componentInstance && this.componentInstance.destroy && this.componentInstance.destroy();
            },
            renderExtraComponent(t) {
              if (!this._unloaded) {
                const n = this.getFormattedProps();
                t === 'mount' ? this.componentInstance = new e(this.root, n, u) : t === 'update' && this.componentInstance && this.componentInstance.update && this.componentInstance.update(n);
              }
            },
            getCacheEventHandle(e) {
              const t = this;
              const n = this.cachedHandles;
              return n[e] ? n[e] : (n[e] = function (n) {
                t.props[e] && t.props[e](n);
              }
              ,
              n[e]);
            },
            getFormattedProps() {
              for (var e = {}, n = 0, i = Object(c.default)(this.props); n < i.length; n++) {
                const r = i[n];
                r.indexOf('on') === 0 ? e[r] = this.getCacheEventHandle(r) : t && r === 'children' && !v || (e[r] = this.props[r]);
              }
              return e;
            },
            saveRoot(e) {
              this.root = e;
            },
            render() {
              const e = this.props;
              const t = e.id;
              const n = e.style;
              const i = e.className;
              return r.a.createElement('div', {
                className: i,
                ref: this.saveRoot,
                id: t,
                style: n
              });
            }
          }));
        }());
      }
    });
  }
},
function (e, t, n) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  }),
  t.supportedValue = t.supportedProperty = t.prefix = void 0;
  const i = o(n(122));
  const r = o(n(141));
  const a = o(n(143));

  function o(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }

  t.default = {
    prefix: i.default,
    supportedProperty: r.default,
    supportedValue: a.default
  },
  /**
       * CSS Vendor prefix detection and property feature testing.
       *
       * @copyright Oleg Slobodskoi 2015
       * @website https://github.com/jsstyles/css-vendor
       * @license MIT
       */
  t.prefix = i.default,
  t.supportedProperty = r.default,
  t.supportedValue = a.default;
},
function (e, t, n) {
  const i = {
    childContextTypes: !0,
    contextTypes: !0,
    defaultProps: !0,
    displayName: !0,
    getDefaultProps: !0,
    getDerivedStateFromProps: !0,
    mixins: !0,
    propTypes: !0,
    type: !0
  };
  const r = {
    name: !0,
    length: !0,
    prototype: !0,
    caller: !0,
    callee: !0,
    arguments: !0,
    arity: !0
  };
  const a = Object.defineProperty;
  const o = Object.getOwnPropertyNames;
  const s = Object.getOwnPropertySymbols;
  const c = Object.getOwnPropertyDescriptor;
  const l = Object.getPrototypeOf;
  const u = l && l(Object);
  e.exports = function e(t, n, p) {
    if (typeof n !== 'string') {
      if (u) {
        const d = l(n);
        d && d !== u && e(t, d, p);
      }
      let h = o(n);
      s && (h = h.concat(s(n)));
      for (let f = 0; f < h.length; ++f) {
        const m = h[f];
        if (!(i[m] || r[m] || p && p[m])) {
          const v = c(n, m);
          try {
            a(t, m, v);
          } catch (e) {
          }
        }
      }
      return t;
    }
    return t;
  };
},
function (e, t) {
  function n(e, t) {
    for (let n = 0; n < t.length; n++) {
      const i = t[n];
      i.enumerable = i.enumerable || !1,
      i.configurable = !0,
      'value' in i && (i.writable = !0),
      Object.defineProperty(e, i.key, i);
    }
  }

  e.exports = function (e, t, i) {
    return t && n(e.prototype, t),
    i && n(e, i),
    e;
  };
},
function (e, t, n) {
  const i = n(144);
  const r = n(54);

  function a(e, t) {
    return t.encode ? t.strict ? i(e) : encodeURIComponent(e) : e;
  }

  t.extract = function (e) {
    return e.split('?')[1] || '';
  }
  ,
  t.parse = function (e, t) {
    const n = (function (e) {
      let t;
      switch (e.arrayFormat) {
        case 'index':
          return function (e, n, i) {
            t = /\[(\d*)\]$/.exec(e),
            e = e.replace(/\[\d*\]$/, ''),
            t ? (void 0 === i[e] && (i[e] = {}),
            i[e][t[1]] = n) : i[e] = n;
          };
        case 'bracket':
          return function (e, n, i) {
            t = /(\[\])$/.exec(e),
            e = e.replace(/\[\]$/, ''),
            t ? void 0 !== i[e] ? i[e] = [].concat(i[e], n) : i[e] = [n] : i[e] = n;
          };
        default:
          return function (e, t, n) {
            void 0 !== n[e] ? n[e] = [].concat(n[e], t) : n[e] = t;
          };
      }
    }(t = r({
      arrayFormat: 'none'
    }, t)));
    const i = Object.create(null);
    return typeof e !== 'string' ? i : (e = e.trim()
      .replace(/^(\?|#|&)/, '')) ? (e.split('&')
        .forEach(((e) => {
          const t = e.replace(/\+/g, ' ')
            .split('=');
          const r = t.shift();
          let a = t.length > 0 ? t.join('=') : void 0;
          a = void 0 === a ? null : decodeURIComponent(a),
          n(decodeURIComponent(r), a, i);
        }
        )),
      Object.keys(i)
        .sort()
        .reduce(((e, t) => {
          const n = i[t];
          return Boolean(n) && typeof n === 'object' && !Array.isArray(n) ? e[t] = (function e(t) {
            return Array.isArray(t) ? t.sort() : typeof t === 'object' ? e(Object.keys(t))
              .sort(((e, t) => Number(e) - Number(t)
              ))
              .map(((e) => t[e]
              )) : t;
          }(n)) : e[t] = n,
          e;
        }
        ), Object.create(null))) : i;
  }
  ,
  t.stringify = function (e, t) {
    const n = (function (e) {
      switch (e.arrayFormat) {
        case 'index':
          return function (t, n, i) {
            return n === null ? [a(t, e), '[', i, ']'].join('') : [a(t, e), '[', a(i, e), ']=', a(n, e)].join('');
          };
        case 'bracket':
          return function (t, n) {
            return n === null ? a(t, e) : [a(t, e), '[]=', a(n, e)].join('');
          };
        default:
          return function (t, n) {
            return n === null ? a(t, e) : [a(t, e), '=', a(n, e)].join('');
          };
      }
    }(t = r({
      encode: !0,
      strict: !0,
      arrayFormat: 'none'
    }, t)));
    return e ? Object.keys(e)
      .sort()
      .map(((i) => {
        const r = e[i];
        if (void 0 === r) return '';
        if (r === null) return a(i, t);
        if (Array.isArray(r)) {
          const o = [];
          return r.slice()
            .forEach(((e) => {
              void 0 !== e && o.push(n(i, e, o.length));
            }
            )),
          o.join('&');
        }
        return `${a(i, t)}=${a(r, t)}`;
      }
      ))
      .filter(((e) => e.length > 0
      ))
      .join('&') : '';
  };
},
function (e, t) {
  e.exports = function (e) {
    if (void 0 === e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
    return e;
  };
},
function (e, t, n) {
  function i(e) {
    return e && e.default ? e.default : e;
  }

  n(132),
  n(133);
  const r = i(n(23));
  const a = i(n(5));
  const o = n(178);
  const s = n(145);
  const c = n(194);
  const l = n(186);
  const u = n(177);
  const p = n(125);
  const d = self;
  d.ReactDOM = r,
  d.createReactClass = a,
  d.React.createClass = d.React.createClass || a;
  const h = {};
  for (const f in o) o.hasOwnProperty(f) && (h[f] = o[f]);
  i(s)(h),
  i(c)(h),
  i(l)(h),
  i(u)(h),
  h.addExtraComponent = i(p),
  e.exports = h;
},
function (e, t) {
},
function (e, t, n) {
  n.r(t);
  const i = n(1);
  const r = n(2);
  i.h.setSDKVersion(r.a);
},
function (e, t, n) {
  /** @license React v16.6.0
     * react-dom.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
  const i = n(0);
  const r = n(54);
  const a = n(136);

  function o(e) {
    for (var t = arguments.length - 1, n = `https://reactjs.org/docs/error-decoder.html?invariant=${e}`, i = 0; i < t; i++) n += `&args[]=${encodeURIComponent(arguments[i + 1])}`;
    !(function (e, t, n, i, r, a, o, s) {
      if (!e) {
        if (e = void 0,
        void 0 === t) {
          e = Error('Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.');
        } else {
          const c = [n, i, r, a, o, s];
          let l = 0;
          (e = Error(t.replace(/%s/g, (() => c[l++]
          )))).name = 'Invariant Violation';
        }
        throw e.framesToPop = 1,
        e;
      }
    }(!1, `Minified React error #${e}; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. `, n));
  }

  function s(e, t, n, i, r, a, o, s, c) {
    const l = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, l);
    } catch (e) {
      this.onError(e);
    }
  }

  i || o('227');
  let c = !1;
  let l = null;
  let u = !1;
  let p = null;
  const d = {
    onError(e) {
      c = !0,
      l = e;
    }
  };

  function h(e, t, n, i, r, a, o, u, p) {
    c = !1,
    l = null,
    s.apply(d, arguments);
  }

  let f = null;
  const m = {};

  function v() {
    if (f) {
      for (const e in m) {
        const t = m[e];
        let n = f.indexOf(e);
        if (n > -1 || o('96', e),
        !b[n]) {
          for (const i in t.extractEvents || o('97', e),
          b[n] = t,
          n = t.eventTypes) {
            let r = void 0;
            const a = n[i];
            const s = t;
            const c = i;
            y.hasOwnProperty(c) && o('99', c),
            y[c] = a;
            const l = a.phasedRegistrationNames;
            if (l) {
              for (r in l) l.hasOwnProperty(r) && g(l[r], s, c);
              r = !0;
            } else {
              a.registrationName ? (g(a.registrationName, s, c),
              r = !0) : r = !1;
            }
            r || o('98', i, e);
          }
        }
      }
    }
  }

  function g(e, t, n) {
    _[e] && o('100', e),
    _[e] = t,
    w[e] = t.eventTypes[n].dependencies;
  }

  var b = [];
  var y = {};
  var _ = {};
  var w = {};
  let C = null;
  let x = null;
  let T = null;

  function S(e, t, n, i) {
    t = e.type || 'unknown-event',
    e.currentTarget = T(i),
    (function (e, t, n, i, r, a, s, d, f) {
      if (h.apply(this, arguments),
      c) {
        if (c) {
          var m = l;
          c = !1,
          l = null;
        } else {
          o('198'),
          m = void 0;
        }
        u || (u = !0,
        p = m);
      }
    }(t, n, void 0, e)),
    e.currentTarget = null;
  }

  function E(e, t) {
    return t == null && o('30'),
    e == null ? t : Array.isArray(e) ? Array.isArray(t) ? (e.push.apply(e, t),
    e) : (e.push(t),
    e) : Array.isArray(t) ? [e].concat(t) : [e, t];
  }

  function k(e, t, n) {
    Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e);
  }

  let O = null;

  function P(e, t) {
    if (e) {
      const n = e._dispatchListeners;
      const i = e._dispatchInstances;
      if (Array.isArray(n)) {
        for (let r = 0; r < n.length && !e.isPropagationStopped(); r++) S(e, t, n[r], i[r]);
      } else {
        n && S(e, t, n, i);
      }
      e._dispatchListeners = null,
      e._dispatchInstances = null,
      e.isPersistent() || e.constructor.release(e);
    }
  }

  function N(e) {
    return P(e, !0);
  }

  function I(e) {
    return P(e, !1);
  }

  const A = {
    injectEventPluginOrder(e) {
      f && o('101'),
      f = Array.prototype.slice.call(e),
      v();
    },
    injectEventPluginsByName(e) {
      let t;
      let
        n = !1;
      for (t in e) {
        if (e.hasOwnProperty(t)) {
          const i = e[t];
          m.hasOwnProperty(t) && m[t] === i || (m[t] && o('102', t),
          m[t] = i,
          n = !0);
        }
      }
      n && v();
    }
  };

  function j(e, t) {
    let n = e.stateNode;
    if (!n) return null;
    let i = C(n);
    if (!i) return null;
    n = i[t];
    switch (t) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
        (i = !i.disabled) || (i = !((e = e.type) === 'button' || e === 'input' || e === 'select' || e === 'textarea')),
        e = !i;
        break;
      default:
        e = !1;
    }
    return e ? null : (n && typeof n !== 'function' && o('231', t, typeof n),
    n);
  }

  function R(e, t) {
    if (e !== null && (O = E(O, e)),
    e = O,
    O = null,
    e && (k(e, t ? N : I),
    O && o('95'),
    u)) {
      throw t = p,
      u = !1,
      p = null,
      t;
    }
  }

  const D = Math.random()
    .toString(36)
    .slice(2);
  const M = `__reactInternalInstance$${D}`;
  const L = `__reactEventHandlers$${D}`;

  function F(e) {
    if (e[M]) return e[M];
    for (; !e[M];) {
      if (!e.parentNode) return null;
      e = e.parentNode;
    }
    return (e = e[M]).tag === 5 || e.tag === 6 ? e : null;
  }

  function V(e) {
    return !(e = e[M]) || e.tag !== 5 && e.tag !== 6 ? null : e;
  }

  function U(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    o('33');
  }

  function B(e) {
    return e[L] || null;
  }

  function z(e) {
    do {
      e = e.return;
    } while (e && e.tag !== 5);
    return e || null;
  }

  function W(e, t, n) {
    (t = j(e, n.dispatchConfig.phasedRegistrationNames[t])) && (n._dispatchListeners = E(n._dispatchListeners, t),
    n._dispatchInstances = E(n._dispatchInstances, e));
  }

  function H(e) {
    if (e && e.dispatchConfig.phasedRegistrationNames) {
      for (var t = e._targetInst, n = []; t;) {
        n.push(t),
        t = z(t);
      }
      for (t = n.length; t-- > 0;) W(n[t], 'captured', e);
      for (t = 0; t < n.length; t++) W(n[t], 'bubbled', e);
    }
  }

  function X(e, t, n) {
    e && n && n.dispatchConfig.registrationName && (t = j(e, n.dispatchConfig.registrationName)) && (n._dispatchListeners = E(n._dispatchListeners, t),
    n._dispatchInstances = E(n._dispatchInstances, e));
  }

  function Y(e) {
    e && e.dispatchConfig.registrationName && X(e._targetInst, null, e);
  }

  function $(e) {
    k(e, H);
  }

  const K = !(typeof window === 'undefined' || !window.document || !window.document.createElement);

  function q(e, t) {
    const n = {};
    return n[e.toLowerCase()] = t.toLowerCase(),
    n[`Webkit${e}`] = `webkit${t}`,
    n[`Moz${e}`] = `moz${t}`,
    n;
  }

  const G = {
    animationend: q('Animation', 'AnimationEnd'),
    animationiteration: q('Animation', 'AnimationIteration'),
    animationstart: q('Animation', 'AnimationStart'),
    transitionend: q('Transition', 'TransitionEnd')
  };
  const J = {};
  let Q = {};

  function Z(e) {
    if (J[e]) return J[e];
    if (!G[e]) return e;
    let t;
    const
      n = G[e];
    for (t in n) if (n.hasOwnProperty(t) && t in Q) return J[e] = n[t];
    return e;
  }

  K && (Q = document.createElement('div').style,
  'AnimationEvent' in window || (delete G.animationend.animation,
  delete G.animationiteration.animation,
  delete G.animationstart.animation),
  'TransitionEvent' in window || delete G.transitionend.transition);
  const ee = Z('animationend');
  const te = Z('animationiteration');
  const ne = Z('animationstart');
  const ie = Z('transitionend');
  const re = 'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting'.split(' ');
  let ae = null;
  let oe = null;
  let se = null;

  function ce() {
    if (se) return se;
    let e;
    let t;
    const n = oe;
    const i = n.length;
    const r = 'value' in ae ? ae.value : ae.textContent;
    const
      a = r.length;
    for (e = 0; e < i && n[e] === r[e]; e++) ;
    const o = i - e;
    for (t = 1; t <= o && n[i - t] === r[a - t]; t++) ;
    return se = r.slice(e, t > 1 ? 1 - t : void 0);
  }

  function le() {
    return !0;
  }

  function ue() {
    return !1;
  }

  function pe(e, t, n, i) {
    for (const r in this.dispatchConfig = e,
    this._targetInst = t,
    this.nativeEvent = n,
    e = this.constructor.Interface) {
      e.hasOwnProperty(r) && ((t = e[r]) ? this[r] = t(n) : r === 'target' ? this.target = i : this[r] = n[r]);
    }
    return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : !1 === n.returnValue) ? le : ue,
    this.isPropagationStopped = ue,
    this;
  }

  function de(e, t, n, i) {
    if (this.eventPool.length) {
      const r = this.eventPool.pop();
      return this.call(r, e, t, n, i),
      r;
    }
    return new this(e, t, n, i);
  }

  function he(e) {
    e instanceof this || o('279'),
    e.destructor(),
    this.eventPool.length < 10 && this.eventPool.push(e);
  }

  function fe(e) {
    e.eventPool = [],
    e.getPooled = de,
    e.release = he;
  }

  r(pe.prototype, {
    preventDefault() {
      this.defaultPrevented = !0;
      const e = this.nativeEvent;
      e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue !== 'unknown' && (e.returnValue = !1),
      this.isDefaultPrevented = le);
    },
    stopPropagation() {
      const e = this.nativeEvent;
      e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble !== 'unknown' && (e.cancelBubble = !0),
      this.isPropagationStopped = le);
    },
    persist() {
      this.isPersistent = le;
    },
    isPersistent: ue,
    destructor() {
      let e;
      const
        t = this.constructor.Interface;
      for (e in t) this[e] = null;
      this.nativeEvent = this._targetInst = this.dispatchConfig = null,
      this.isPropagationStopped = this.isDefaultPrevented = ue,
      this._dispatchInstances = this._dispatchListeners = null;
    }
  }),
  pe.Interface = {
    type: null,
    target: null,
    currentTarget() {
      return null;
    },
    eventPhase: null,
    bubbles: null,
    cancelable: null,
    timeStamp(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: null,
    isTrusted: null
  },
  pe.extend = function (e) {
    function t() {
    }

    function n() {
      return i.apply(this, arguments);
    }

    var i = this;
    t.prototype = i.prototype;
    const a = new t();
    return r(a, n.prototype),
    n.prototype = a,
    n.prototype.constructor = n,
    n.Interface = r({}, i.Interface, e),
    n.extend = i.extend,
    fe(n),
    n;
  }
  ,
  fe(pe);
  const me = pe.extend({
    data: null
  });
  const ve = pe.extend({
    data: null
  });
  const ge = [9, 13, 27, 32];
  const be = K && 'CompositionEvent' in window;
  let ye = null;
  K && 'documentMode' in document && (ye = document.documentMode);
  const _e = K && 'TextEvent' in window && !ye;
  const we = K && (!be || ye && ye > 8 && ye <= 11);
  const Ce = String.fromCharCode(32);
  const xe = {
    beforeInput: {
      phasedRegistrationNames: {
        bubbled: 'onBeforeInput',
        captured: 'onBeforeInputCapture'
      },
      dependencies: ['compositionend', 'keypress', 'textInput', 'paste']
    },
    compositionEnd: {
      phasedRegistrationNames: {
        bubbled: 'onCompositionEnd',
        captured: 'onCompositionEndCapture'
      },
      dependencies: 'blur compositionend keydown keypress keyup mousedown'.split(' ')
    },
    compositionStart: {
      phasedRegistrationNames: {
        bubbled: 'onCompositionStart',
        captured: 'onCompositionStartCapture'
      },
      dependencies: 'blur compositionstart keydown keypress keyup mousedown'.split(' ')
    },
    compositionUpdate: {
      phasedRegistrationNames: {
        bubbled: 'onCompositionUpdate',
        captured: 'onCompositionUpdateCapture'
      },
      dependencies: 'blur compositionupdate keydown keypress keyup mousedown'.split(' ')
    }
  };
  let Te = !1;

  function Se(e, t) {
    switch (e) {
      case 'keyup':
        return ge.indexOf(t.keyCode) !== -1;
      case 'keydown':
        return t.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'blur':
        return !0;
      default:
        return !1;
    }
  }

  function Ee(e) {
    return typeof (e = e.detail) === 'object' && 'data' in e ? e.data : null;
  }

  let ke = !1;
  const Oe = {
    eventTypes: xe,
    extractEvents(e, t, n, i) {
      let r = void 0;
      let a = void 0;
      if (be) {
        e: {
          switch (e) {
            case 'compositionstart':
              r = xe.compositionStart;
              break e;
            case 'compositionend':
              r = xe.compositionEnd;
              break e;
            case 'compositionupdate':
              r = xe.compositionUpdate;
              break e;
          }
          r = void 0;
        }
      } else {
        ke ? Se(e, n) && (r = xe.compositionEnd) : e === 'keydown' && n.keyCode === 229 && (r = xe.compositionStart);
      }
      return r ? (we && n.locale !== 'ko' && (ke || r !== xe.compositionStart ? r === xe.compositionEnd && ke && (a = ce()) : (oe = 'value' in (ae = i) ? ae.value : ae.textContent,
      ke = !0)),
      r = me.getPooled(r, t, n, i),
      a ? r.data = a : (a = Ee(n)) !== null && (r.data = a),
      $(r),
      a = r) : a = null,
      (e = _e ? (function (e, t) {
        switch (e) {
          case 'compositionend':
            return Ee(t);
          case 'keypress':
            return t.which !== 32 ? null : (Te = !0,
            Ce);
          case 'textInput':
            return (e = t.data) === Ce && Te ? null : e;
          default:
            return null;
        }
      }(e, n)) : (function (e, t) {
        if (ke) {
          return e === 'compositionend' || !be && Se(e, t) ? (e = ce(),
          se = oe = ae = null,
          ke = !1,
          e) : null;
        }
        switch (e) {
          case 'paste':
            return null;
          case 'keypress':
            if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
              if (t.char && t.char.length > 1) return t.char;
              if (t.which) return String.fromCharCode(t.which);
            }
            return null;
          case 'compositionend':
            return we && t.locale !== 'ko' ? null : t.data;
          default:
            return null;
        }
      }(e, n))) ? ((t = ve.getPooled(xe.beforeInput, t, n, i)).data = e,
        $(t)) : t = null,
      a === null ? t : t === null ? a : [a, t];
    }
  };
  let Pe = null;
  let Ne = null;
  let Ie = null;

  function Ae(e) {
    if (e = x(e)) {
      typeof Pe !== 'function' && o('280');
      const t = C(e.stateNode);
      Pe(e.stateNode, e.type, t);
    }
  }

  function je(e) {
    Ne ? Ie ? Ie.push(e) : Ie = [e] : Ne = e;
  }

  function Re() {
    if (Ne) {
      let e = Ne;
      const t = Ie;
      if (Ie = Ne = null,
      Ae(e),
      t) {
        for (e = 0; e < t.length; e++) Ae(t[e]);
      }
    }
  }

  function De(e, t) {
    return e(t);
  }

  function Me(e, t, n) {
    return e(t, n);
  }

  function Le() {
  }

  let Fe = !1;

  function Ve(e, t) {
    if (Fe) return e(t);
    Fe = !0;
    try {
      return De(e, t);
    } finally {
      Fe = !1,
      (Ne !== null || Ie !== null) && (Le(),
      Re());
    }
  }

  const Ue = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };

  function Be(e) {
    const t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === 'input' ? !!Ue[e.type] : t === 'textarea';
  }

  function ze(e) {
    return (e = e.target || e.srcElement || window).correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e;
  }

  function We(e) {
    if (!K) return !1;
    let t = (e = `on${e}`) in document;
    return t || ((t = document.createElement('div')).setAttribute(e, 'return;'),
    t = typeof t[e] === 'function'),
    t;
  }

  function He(e) {
    const t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  }

  function Xe(e) {
    e._valueTracker || (e._valueTracker = (function (e) {
      const t = He(e) ? 'checked' : 'value';
      const n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      let i = `${e[t]}`;
      if (!e.hasOwnProperty(t) && void 0 !== n && typeof n.get === 'function' && typeof n.set === 'function') {
        const r = n.get;
        const a = n.set;
        return Object.defineProperty(e, t, {
          configurable: !0,
          get() {
            return r.call(this);
          },
          set(e) {
            i = `${e}`,
            a.call(this, e);
          }
        }),
        Object.defineProperty(e, t, {
          enumerable: n.enumerable
        }),
        {
          getValue() {
            return i;
          },
          setValue(e) {
            i = `${e}`;
          },
          stopTracking() {
            e._valueTracker = null,
            delete e[t];
          }
        };
      }
    }(e)));
  }

  function Ye(e) {
    if (!e) return !1;
    const t = e._valueTracker;
    if (!t) return !0;
    const n = t.getValue();
    let i = '';
    return e && (i = He(e) ? e.checked ? 'true' : 'false' : e.value),
    (e = i) !== n && (t.setValue(e),
    !0);
  }

  const $e = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  const Ke = /^(.*)[\\\/]/;
  const qe = typeof Symbol === 'function' && Symbol.for;
  const Ge = qe ? Symbol.for('react.element') : 60103;
  const Je = qe ? Symbol.for('react.portal') : 60106;
  const Qe = qe ? Symbol.for('react.fragment') : 60107;
  const Ze = qe ? Symbol.for('react.strict_mode') : 60108;
  const et = qe ? Symbol.for('react.profiler') : 60114;
  const tt = qe ? Symbol.for('react.provider') : 60109;
  const nt = qe ? Symbol.for('react.context') : 60110;
  const it = qe ? Symbol.for('react.concurrent_mode') : 60111;
  const rt = qe ? Symbol.for('react.forward_ref') : 60112;
  const at = qe ? Symbol.for('react.suspense') : 60113;
  const ot = qe ? Symbol.for('react.memo') : 60115;
  const st = qe ? Symbol.for('react.lazy') : 60116;
  const ct = typeof Symbol === 'function' && Symbol.iterator;

  function lt(e) {
    return e === null || typeof e !== 'object' ? null : typeof (e = ct && e[ct] || e['@@iterator']) === 'function' ? e : null;
  }

  function ut(e) {
    if (e == null) return null;
    if (typeof e === 'function') return e.displayName || e.name || null;
    if (typeof e === 'string') return e;
    switch (e) {
      case it:
        return 'ConcurrentMode';
      case Qe:
        return 'Fragment';
      case Je:
        return 'Portal';
      case et:
        return 'Profiler';
      case Ze:
        return 'StrictMode';
      case at:
        return 'Suspense';
    }
    if (typeof e === 'object') {
      switch (e.$$typeof) {
        case nt:
          return 'Context.Consumer';
        case tt:
          return 'Context.Provider';
        case rt:
          var t = e.render;
          return t = t.displayName || t.name || '',
          e.displayName || (t !== '' ? `ForwardRef(${t})` : 'ForwardRef');
        case ot:
          return ut(e.type);
        case st:
          if (e = e._status === 1 ? e._result : null) return ut(e);
      }
    }
    return null;
  }

  function pt(e) {
    let t = '';
    do {
      switch (e.tag) {
        case 2:
        case 16:
        case 0:
        case 1:
        case 5:
        case 8:
          var n = e._debugOwner;
          var i = e._debugSource;
          var r = ut(e.type);
          var a = null;
          n && (a = ut(n.type)),
          n = r,
          r = '',
          i ? r = ` (at ${i.fileName.replace(Ke, '')}:${i.lineNumber})` : a && (r = ` (created by ${a})`),
          a = `\n    in ${n || 'Unknown'}${r}`;
          break;
        default:
          a = '';
      }
      t += a,
      e = e.return;
    } while (e);
    return t;
  }

  const dt = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
  const ht = Object.prototype.hasOwnProperty;
  const ft = {};
  const mt = {};

  function vt(e, t, n, i, r) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4,
    this.attributeName = i,
    this.attributeNamespace = r,
    this.mustUseProperty = n,
    this.propertyName = e,
    this.type = t;
  }

  const gt = {};
  'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'.split(' ')
    .forEach(((e) => {
      gt[e] = new vt(e, 0, !1, e, null);
    }
    )),
  [['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']].forEach(((e) => {
    const t = e[0];
    gt[t] = new vt(t, 1, !1, e[1], null);
  }
  )),
  ['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(((e) => {
    gt[e] = new vt(e, 2, !1, e.toLowerCase(), null);
  }
  )),
  ['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(((e) => {
    gt[e] = new vt(e, 2, !1, e, null);
  }
  )),
  'allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'.split(' ')
    .forEach(((e) => {
      gt[e] = new vt(e, 3, !1, e.toLowerCase(), null);
    }
    )),
  ['checked', 'multiple', 'muted', 'selected'].forEach(((e) => {
    gt[e] = new vt(e, 3, !0, e, null);
  }
  )),
  ['capture', 'download'].forEach(((e) => {
    gt[e] = new vt(e, 4, !1, e, null);
  }
  )),
  ['cols', 'rows', 'size', 'span'].forEach(((e) => {
    gt[e] = new vt(e, 6, !1, e, null);
  }
  )),
  ['rowSpan', 'start'].forEach(((e) => {
    gt[e] = new vt(e, 5, !1, e.toLowerCase(), null);
  }
  ));
  const bt = /[\-:]([a-z])/g;

  function yt(e) {
    return e[1].toUpperCase();
  }

  function _t(e, t, n, i) {
    let r = gt.hasOwnProperty(t) ? gt[t] : null;
    (r !== null ? r.type === 0 : !i && (t.length > 2 && (t[0] === 'o' || t[0] === 'O') && (t[1] === 'n' || t[1] === 'N'))) || ((function (e, t, n, i) {
      if (t == null || (function (e, t, n, i) {
        if (n !== null && n.type === 0) return !1;
        switch (typeof t) {
          case 'function':
          case 'symbol':
            return !0;
          case 'boolean':
            return !i && (n !== null ? !n.acceptsBooleans : (e = e.toLowerCase()
              .slice(0, 5)) !== 'data-' && e !== 'aria-');
          default:
            return !1;
        }
      }(e, t, n, i))) {
        return !0;
      }
      if (i) return !1;
      if (n !== null) {
        switch (n.type) {
          case 3:
            return !t;
          case 4:
            return !1 === t;
          case 5:
            return isNaN(t);
          case 6:
            return isNaN(t) || t < 1;
        }
      }
      return !1;
    }(t, n, r, i)) && (n = null),
    i || r === null ? (function (e) {
      return !!ht.call(mt, e) || !ht.call(ft, e) && (dt.test(e) ? mt[e] = !0 : (ft[e] = !0,
      !1));
    }(t)) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, `${n}`)) : r.mustUseProperty ? e[r.propertyName] = n === null ? r.type !== 3 && '' : n : (t = r.attributeName,
    i = r.attributeNamespace,
    n === null ? e.removeAttribute(t) : (n = (r = r.type) === 3 || r === 4 && !0 === n ? '' : `${n}`,
    i ? e.setAttributeNS(i, t, n) : e.setAttribute(t, n))));
  }

  function wt(e) {
    switch (typeof e) {
      case 'boolean':
      case 'number':
      case 'object':
      case 'string':
      case 'undefined':
        return e;
      default:
        return '';
    }
  }

  function Ct(e, t) {
    const n = t.checked;
    return r({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: n != null ? n : e._wrapperState.initialChecked
    });
  }

  function xt(e, t) {
    let n = t.defaultValue == null ? '' : t.defaultValue;
    const i = t.checked != null ? t.checked : t.defaultChecked;
    n = wt(t.value != null ? t.value : n),
    e._wrapperState = {
      initialChecked: i,
      initialValue: n,
      controlled: t.type === 'checkbox' || t.type === 'radio' ? t.checked != null : t.value != null
    };
  }

  function Tt(e, t) {
    (t = t.checked) != null && _t(e, 'checked', t, !1);
  }

  function St(e, t) {
    Tt(e, t);
    const n = wt(t.value);
    const i = t.type;
    if (n != null) {
      i === 'number' ? (n === 0 && e.value === '' || e.value != n) && (e.value = `${n}`) : e.value !== `${n}` && (e.value = `${n}`);
    } else if (i === 'submit' || i === 'reset') return void e.removeAttribute('value');
    t.hasOwnProperty('value') ? kt(e, t.type, n) : t.hasOwnProperty('defaultValue') && kt(e, t.type, wt(t.defaultValue)),
    t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }

  function Et(e, t, n) {
    if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
      const i = t.type;
      if (!(i !== 'submit' && i !== 'reset' || void 0 !== t.value && t.value !== null)) return;
      t = `${e._wrapperState.initialValue}`,
      n || t === e.value || (e.value = t),
      e.defaultValue = t;
    }
    (n = e.name) !== '' && (e.name = ''),
    e.defaultChecked = !e.defaultChecked,
    e.defaultChecked = !!e._wrapperState.initialChecked,
    n !== '' && (e.name = n);
  }

  function kt(e, t, n) {
    t === 'number' && e.ownerDocument.activeElement === e || (n == null ? e.defaultValue = `${e._wrapperState.initialValue}` : e.defaultValue !== `${n}` && (e.defaultValue = `${n}`));
  }

  'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'.split(' ')
    .forEach(((e) => {
      const t = e.replace(bt, yt);
      gt[t] = new vt(t, 1, !1, e, null);
    }
    )),
  'xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type'.split(' ')
    .forEach(((e) => {
      const t = e.replace(bt, yt);
      gt[t] = new vt(t, 1, !1, e, 'http://www.w3.org/1999/xlink');
    }
    )),
  ['xml:base', 'xml:lang', 'xml:space'].forEach(((e) => {
    const t = e.replace(bt, yt);
    gt[t] = new vt(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace');
  }
  )),
  gt.tabIndex = new vt('tabIndex', 1, !1, 'tabindex', null);
  const Ot = {
    change: {
      phasedRegistrationNames: {
        bubbled: 'onChange',
        captured: 'onChangeCapture'
      },
      dependencies: 'blur change click focus input keydown keyup selectionchange'.split(' ')
    }
  };

  function Pt(e, t, n) {
    return (e = pe.getPooled(Ot.change, e, t, n)).type = 'change',
    je(n),
    $(e),
    e;
  }

  let Nt = null;
  let It = null;

  function At(e) {
    R(e, !1);
  }

  function jt(e) {
    if (Ye(U(e))) return e;
  }

  function Rt(e, t) {
    if (e === 'change') return t;
  }

  let Dt = !1;

  function Mt() {
    Nt && (Nt.detachEvent('onpropertychange', Lt),
    It = Nt = null);
  }

  function Lt(e) {
    e.propertyName === 'value' && jt(It) && Ve(At, e = Pt(It, e, ze(e)));
  }

  function Ft(e, t, n) {
    e === 'focus' ? (Mt(),
    It = n,
    (Nt = t).attachEvent('onpropertychange', Lt)) : e === 'blur' && Mt();
  }

  function Vt(e) {
    if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return jt(It);
  }

  function Ut(e, t) {
    if (e === 'click') return jt(t);
  }

  function Bt(e, t) {
    if (e === 'input' || e === 'change') return jt(t);
  }

  K && (Dt = We('input') && (!document.documentMode || document.documentMode > 9));
  const zt = {
    eventTypes: Ot,
    _isInputEventSupported: Dt,
    extractEvents(e, t, n, i) {
      const r = t ? U(t) : window;
      let a = void 0;
      let o = void 0;
      let s = r.nodeName && r.nodeName.toLowerCase();
      if (s === 'select' || s === 'input' && r.type === 'file' ? a = Rt : Be(r) ? Dt ? a = Bt : (a = Vt,
      o = Ft) : (s = r.nodeName) && s.toLowerCase() === 'input' && (r.type === 'checkbox' || r.type === 'radio') && (a = Ut),
      a && (a = a(e, t))) {
        return Pt(a, n, i);
      }
      o && o(e, r, t),
      e === 'blur' && (e = r._wrapperState) && e.controlled && r.type === 'number' && kt(r, 'number', r.value);
    }
  };
  const Wt = pe.extend({
    view: null,
    detail: null
  });
  const Ht = {
    Alt: 'altKey',
    Control: 'ctrlKey',
    Meta: 'metaKey',
    Shift: 'shiftKey'
  };

  function Xt(e) {
    const t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : !!(e = Ht[e]) && !!t[e];
  }

  function Yt() {
    return Xt;
  }

  let $t = 0;
  let Kt = 0;
  let qt = !1;
  let Gt = !1;
  const Jt = Wt.extend({
    screenX: null,
    screenY: null,
    clientX: null,
    clientY: null,
    pageX: null,
    pageY: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    getModifierState: Yt,
    button: null,
    buttons: null,
    relatedTarget(e) {
      return e.relatedTarget || (e.fromElement === e.srcElement ? e.toElement : e.fromElement);
    },
    movementX(e) {
      if ('movementX' in e) return e.movementX;
      const t = $t;
      return $t = e.screenX,
      qt ? e.type === 'mousemove' ? e.screenX - t : 0 : (qt = !0,
      0);
    },
    movementY(e) {
      if ('movementY' in e) return e.movementY;
      const t = Kt;
      return Kt = e.screenY,
      Gt ? e.type === 'mousemove' ? e.screenY - t : 0 : (Gt = !0,
      0);
    }
  });
  const Qt = Jt.extend({
    pointerId: null,
    width: null,
    height: null,
    pressure: null,
    tangentialPressure: null,
    tiltX: null,
    tiltY: null,
    twist: null,
    pointerType: null,
    isPrimary: null
  });
  const Zt = {
    mouseEnter: {
      registrationName: 'onMouseEnter',
      dependencies: ['mouseout', 'mouseover']
    },
    mouseLeave: {
      registrationName: 'onMouseLeave',
      dependencies: ['mouseout', 'mouseover']
    },
    pointerEnter: {
      registrationName: 'onPointerEnter',
      dependencies: ['pointerout', 'pointerover']
    },
    pointerLeave: {
      registrationName: 'onPointerLeave',
      dependencies: ['pointerout', 'pointerover']
    }
  };
  const en = {
    eventTypes: Zt,
    extractEvents(e, t, n, i) {
      let r = e === 'mouseover' || e === 'pointerover';
      let a = e === 'mouseout' || e === 'pointerout';
      if (r && (n.relatedTarget || n.fromElement) || !a && !r) return null;
      if (r = i.window === i ? i : (r = i.ownerDocument) ? r.defaultView || r.parentWindow : window,
      a ? (a = t,
      t = (t = n.relatedTarget || n.toElement) ? F(t) : null) : a = null,
      a === t) {
        return null;
      }
      let o = void 0;
      let s = void 0;
      let c = void 0;
      let l = void 0;
      e === 'mouseout' || e === 'mouseover' ? (o = Jt,
      s = Zt.mouseLeave,
      c = Zt.mouseEnter,
      l = 'mouse') : e !== 'pointerout' && e !== 'pointerover' || (o = Qt,
      s = Zt.pointerLeave,
      c = Zt.pointerEnter,
      l = 'pointer');
      const u = a == null ? r : U(a);
      if (r = t == null ? r : U(t),
      (e = o.getPooled(s, a, n, i)).type = `${l}leave`,
      e.target = u,
      e.relatedTarget = r,
      (n = o.getPooled(c, t, n, i)).type = `${l}enter`,
      n.target = r,
      n.relatedTarget = u,
      i = t,
      a && i) {
        e: {
          for (r = i,
          l = 0,
          o = t = a; o; o = z(o)) {
            l++;
          }
          for (o = 0,
          c = r; c; c = z(c)) {
            o++;
          }
          for (; l - o > 0;) {
            t = z(t),
            l--;
          }
          for (; o - l > 0;) {
            r = z(r),
            o--;
          }
          for (; l--;) {
            if (t === r || t === r.alternate) break e;
            t = z(t),
            r = z(r);
          }
          t = null;
        }
      } else {
        t = null;
      }
      for (r = t,
      t = []; a && a !== r && ((l = a.alternate) === null || l !== r);) {
        t.push(a),
        a = z(a);
      }
      for (a = []; i && i !== r && ((l = i.alternate) === null || l !== r);) {
        a.push(i),
        i = z(i);
      }
      for (i = 0; i < t.length; i++) X(t[i], 'bubbled', e);
      for (i = a.length; i-- > 0;) X(a[i], 'captured', n);
      return [e, n];
    }
  };
  const tn = Object.prototype.hasOwnProperty;

  function nn(e, t) {
    return e === t ? e !== 0 || t !== 0 || 1 / e == 1 / t : e != e && t != t;
  }

  function rn(e, t) {
    if (nn(e, t)) return !0;
    if (typeof e !== 'object' || e === null || typeof t !== 'object' || t === null) return !1;
    const n = Object.keys(e);
    let i = Object.keys(t);
    if (n.length !== i.length) return !1;
    for (i = 0; i < n.length; i++) if (!tn.call(t, n[i]) || !nn(e[n[i]], t[n[i]])) return !1;
    return !0;
  }

  function an(e) {
    let t = e;
    if (e.alternate) {
      for (; t.return;) t = t.return;
    } else {
      if ((2 & t.effectTag) != 0) return 1;
      for (; t.return;) if ((2 & (t = t.return).effectTag) != 0) return 1;
    }
    return t.tag === 3 ? 2 : 3;
  }

  function on(e) {
    an(e) !== 2 && o('188');
  }

  function sn(e) {
    if (!(e = (function (e) {
      let t = e.alternate;
      if (!t) {
        return (t = an(e)) === 3 && o('188'),
        t === 1 ? null : e;
      }
      for (var n = e, i = t; ;) {
        const r = n.return;
        const a = r ? r.alternate : null;
        if (!r || !a) break;
        if (r.child === a.child) {
          for (var s = r.child; s;) {
            if (s === n) {
              return on(r),
              e;
            }
            if (s === i) {
              return on(r),
              t;
            }
            s = s.sibling;
          }
          o('188');
        }
        if (n.return !== i.return) {
          n = r,
          i = a;
        } else {
          s = !1;
          for (var c = r.child; c;) {
            if (c === n) {
              s = !0,
              n = r,
              i = a;
              break;
            }
            if (c === i) {
              s = !0,
              i = r,
              n = a;
              break;
            }
            c = c.sibling;
          }
          if (!s) {
            for (c = a.child; c;) {
              if (c === n) {
                s = !0,
                n = a,
                i = r;
                break;
              }
              if (c === i) {
                s = !0,
                i = a,
                n = r;
                break;
              }
              c = c.sibling;
            }
            s || o('189');
          }
        }
        n.alternate !== i && o('190');
      }
      return n.tag !== 3 && o('188'),
      n.stateNode.current === n ? e : t;
    }(e)))) {
      return null;
    }
    for (let t = e; ;) {
      if (t.tag === 5 || t.tag === 6) return t;
      if (t.child) {
        t.child.return = t,
        t = t.child;
      } else {
        if (t === e) break;
        for (; !t.sibling;) {
          if (!t.return || t.return === e) return null;
          t = t.return;
        }
        t.sibling.return = t.return,
        t = t.sibling;
      }
    }
    return null;
  }

  const cn = pe.extend({
    animationName: null,
    elapsedTime: null,
    pseudoElement: null
  });
  const ln = pe.extend({
    clipboardData(e) {
      return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
    }
  });
  const un = Wt.extend({
    relatedTarget: null
  });

  function pn(e) {
    const t = e.keyCode;
    return 'charCode' in e ? (e = e.charCode) === 0 && t === 13 && (e = 13) : e = t,
    e === 10 && (e = 13),
    e >= 32 || e === 13 ? e : 0;
  }

  const dn = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified'
  };
  const hn = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta'
  };
  const fn = Wt.extend({
    key(e) {
      if (e.key) {
        const t = dn[e.key] || e.key;
        if (t !== 'Unidentified') return t;
      }
      return e.type === 'keypress' ? (e = pn(e)) === 13 ? 'Enter' : String.fromCharCode(e) : e.type === 'keydown' || e.type === 'keyup' ? hn[e.keyCode] || 'Unidentified' : '';
    },
    location: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    repeat: null,
    locale: null,
    getModifierState: Yt,
    charCode(e) {
      return e.type === 'keypress' ? pn(e) : 0;
    },
    keyCode(e) {
      return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
    },
    which(e) {
      return e.type === 'keypress' ? pn(e) : e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
    }
  });
  const mn = Jt.extend({
    dataTransfer: null
  });
  const vn = Wt.extend({
    touches: null,
    targetTouches: null,
    changedTouches: null,
    altKey: null,
    metaKey: null,
    ctrlKey: null,
    shiftKey: null,
    getModifierState: Yt
  });
  const gn = pe.extend({
    propertyName: null,
    elapsedTime: null,
    pseudoElement: null
  });
  const bn = Jt.extend({
    deltaX(e) {
      return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
    },
    deltaY(e) {
      return 'deltaY' in e ? e.deltaY : 'wheelDeltaY' in e ? -e.wheelDeltaY : 'wheelDelta' in e ? -e.wheelDelta : 0;
    },
    deltaZ: null,
    deltaMode: null
  });
  const yn = [['abort', 'abort'], [ee, 'animationEnd'], [te, 'animationIteration'], [ne, 'animationStart'], ['canplay', 'canPlay'], ['canplaythrough', 'canPlayThrough'], ['drag', 'drag'], ['dragenter', 'dragEnter'], ['dragexit', 'dragExit'], ['dragleave', 'dragLeave'], ['dragover', 'dragOver'], ['durationchange', 'durationChange'], ['emptied', 'emptied'], ['encrypted', 'encrypted'], ['ended', 'ended'], ['error', 'error'], ['gotpointercapture', 'gotPointerCapture'], ['load', 'load'], ['loadeddata', 'loadedData'], ['loadedmetadata', 'loadedMetadata'], ['loadstart', 'loadStart'], ['lostpointercapture', 'lostPointerCapture'], ['mousemove', 'mouseMove'], ['mouseout', 'mouseOut'], ['mouseover', 'mouseOver'], ['playing', 'playing'], ['pointermove', 'pointerMove'], ['pointerout', 'pointerOut'], ['pointerover', 'pointerOver'], ['progress', 'progress'], ['scroll', 'scroll'], ['seeking', 'seeking'], ['stalled', 'stalled'], ['suspend', 'suspend'], ['timeupdate', 'timeUpdate'], ['toggle', 'toggle'], ['touchmove', 'touchMove'], [ie, 'transitionEnd'], ['waiting', 'waiting'], ['wheel', 'wheel']];
  const _n = {};
  const wn = {};

  function Cn(e, t) {
    const n = e[0];
    const i = `on${(e = e[1])[0].toUpperCase() + e.slice(1)}`;
    t = {
      phasedRegistrationNames: {
        bubbled: i,
        captured: `${i}Capture`
      },
      dependencies: [n],
      isInteractive: t
    },
    _n[e] = t,
    wn[n] = t;
  }

  [['blur', 'blur'], ['cancel', 'cancel'], ['click', 'click'], ['close', 'close'], ['contextmenu', 'contextMenu'], ['copy', 'copy'], ['cut', 'cut'], ['auxclick', 'auxClick'], ['dblclick', 'doubleClick'], ['dragend', 'dragEnd'], ['dragstart', 'dragStart'], ['drop', 'drop'], ['focus', 'focus'], ['input', 'input'], ['invalid', 'invalid'], ['keydown', 'keyDown'], ['keypress', 'keyPress'], ['keyup', 'keyUp'], ['mousedown', 'mouseDown'], ['mouseup', 'mouseUp'], ['paste', 'paste'], ['pause', 'pause'], ['play', 'play'], ['pointercancel', 'pointerCancel'], ['pointerdown', 'pointerDown'], ['pointerup', 'pointerUp'], ['ratechange', 'rateChange'], ['reset', 'reset'], ['seeked', 'seeked'], ['submit', 'submit'], ['touchcancel', 'touchCancel'], ['touchend', 'touchEnd'], ['touchstart', 'touchStart'], ['volumechange', 'volumeChange']].forEach(((e) => {
    Cn(e, !0);
  }
  )),
  yn.forEach(((e) => {
    Cn(e, !1);
  }
  ));
  const xn = {
    eventTypes: _n,
    isInteractiveTopLevelEventType(e) {
      return void 0 !== (e = wn[e]) && !0 === e.isInteractive;
    },
    extractEvents(e, t, n, i) {
      const r = wn[e];
      if (!r) return null;
      switch (e) {
        case 'keypress':
          if (pn(n) === 0) return null;
        case 'keydown':
        case 'keyup':
          e = fn;
          break;
        case 'blur':
        case 'focus':
          e = un;
          break;
        case 'click':
          if (n.button === 2) return null;
        case 'auxclick':
        case 'dblclick':
        case 'mousedown':
        case 'mousemove':
        case 'mouseup':
        case 'mouseout':
        case 'mouseover':
        case 'contextmenu':
          e = Jt;
          break;
        case 'drag':
        case 'dragend':
        case 'dragenter':
        case 'dragexit':
        case 'dragleave':
        case 'dragover':
        case 'dragstart':
        case 'drop':
          e = mn;
          break;
        case 'touchcancel':
        case 'touchend':
        case 'touchmove':
        case 'touchstart':
          e = vn;
          break;
        case ee:
        case te:
        case ne:
          e = cn;
          break;
        case ie:
          e = gn;
          break;
        case 'scroll':
          e = Wt;
          break;
        case 'wheel':
          e = bn;
          break;
        case 'copy':
        case 'cut':
        case 'paste':
          e = ln;
          break;
        case 'gotpointercapture':
        case 'lostpointercapture':
        case 'pointercancel':
        case 'pointerdown':
        case 'pointermove':
        case 'pointerout':
        case 'pointerover':
        case 'pointerup':
          e = Qt;
          break;
        default:
          e = pe;
      }
      return $(t = e.getPooled(r, t, n, i)),
      t;
    }
  };
  const Tn = xn.isInteractiveTopLevelEventType;
  const Sn = [];

  function En(e) {
    let t = e.targetInst;
    let n = t;
    do {
      if (!n) {
        e.ancestors.push(n);
        break;
      }
      var i;
      for (i = n; i.return;) i = i.return;
      if (!(i = i.tag !== 3 ? null : i.stateNode.containerInfo)) break;
      e.ancestors.push(n),
      n = F(i);
    } while (n);
    for (n = 0; n < e.ancestors.length; n++) {
      t = e.ancestors[n];
      const r = ze(e.nativeEvent);
      i = e.topLevelType;
      for (var a = e.nativeEvent, o = null, s = 0; s < b.length; s++) {
        let c = b[s];
        c && (c = c.extractEvents(i, t, a, r)) && (o = E(o, c));
      }
      R(o, !1);
    }
  }

  let kn = !0;

  function On(e, t) {
    if (!t) return null;
    const n = (Tn(e) ? Nn : In).bind(null, e);
    t.addEventListener(e, n, !1);
  }

  function Pn(e, t) {
    if (!t) return null;
    const n = (Tn(e) ? Nn : In).bind(null, e);
    t.addEventListener(e, n, !0);
  }

  function Nn(e, t) {
    Me(In, e, t);
  }

  function In(e, t) {
    if (kn) {
      let n = ze(t);
      if ((n = F(n)) === null || typeof n.tag !== 'number' || an(n) === 2 || (n = null),
      Sn.length) {
        const i = Sn.pop();
        i.topLevelType = e,
        i.nativeEvent = t,
        i.targetInst = n,
        e = i;
      } else {
        e = {
          topLevelType: e,
          nativeEvent: t,
          targetInst: n,
          ancestors: []
        };
      }
      try {
        Ve(En, e);
      } finally {
        e.topLevelType = null,
        e.nativeEvent = null,
        e.targetInst = null,
        e.ancestors.length = 0,
        Sn.length < 10 && Sn.push(e);
      }
    }
  }

  const An = {};
  let jn = 0;
  const Rn = `_reactListenersID${(`${Math.random()}`).slice(2)}`;

  function Dn(e) {
    return Object.prototype.hasOwnProperty.call(e, Rn) || (e[Rn] = jn++,
    An[e[Rn]] = {}),
    An[e[Rn]];
  }

  function Mn(e) {
    if (void 0 === (e = e || (typeof document !== 'undefined' ? document : void 0))) return null;
    try {
      return e.activeElement || e.body;
    } catch (t) {
      return e.body;
    }
  }

  function Ln(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }

  function Fn(e, t) {
    let n;
    let
      i = Ln(e);
    for (e = 0; i;) {
      if (i.nodeType === 3) {
        if (n = e + i.textContent.length,
        e <= t && n >= t) {
          return {
            node: i,
            offset: t - e
          };
        }
        e = n;
      }
      e: {
        for (; i;) {
          if (i.nextSibling) {
            i = i.nextSibling;
            break e;
          }
          i = i.parentNode;
        }
        i = void 0;
      }
      i = Ln(i);
    }
  }

  function Vn() {
    for (var e = window, t = Mn(); t instanceof e.HTMLIFrameElement;) {
      try {
        e = t.contentDocument.defaultView;
      } catch (e) {
        break;
      }
      t = Mn(e.document);
    }
    return t;
  }

  function Un(e) {
    const t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === 'input' && (e.type === 'text' || e.type === 'search' || e.type === 'tel' || e.type === 'url' || e.type === 'password') || t === 'textarea' || e.contentEditable === 'true');
  }

  const Bn = K && 'documentMode' in document && document.documentMode <= 11;
  const zn = {
    select: {
      phasedRegistrationNames: {
        bubbled: 'onSelect',
        captured: 'onSelectCapture'
      },
      dependencies: 'blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange'.split(' ')
    }
  };
  let Wn = null;
  let Hn = null;
  let Xn = null;
  let Yn = !1;

  function $n(e, t) {
    let n = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
    return Yn || Wn == null || Wn !== Mn(n) ? null : ('selectionStart' in (n = Wn) && Un(n) ? n = {
      start: n.selectionStart,
      end: n.selectionEnd
    } : n = {
      anchorNode: (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection()).anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    },
    Xn && rn(Xn, n) ? null : (Xn = n,
    (e = pe.getPooled(zn.select, Hn, e, t)).type = 'select',
    e.target = Wn,
    $(e),
    e));
  }

  const Kn = {
    eventTypes: zn,
    extractEvents(e, t, n, i) {
      let r;
      let
        a = i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
      if (!(r = !a)) {
        e: {
          a = Dn(a),
          r = w.onSelect;
          for (let o = 0; o < r.length; o++) {
            const s = r[o];
            if (!a.hasOwnProperty(s) || !a[s]) {
              a = !1;
              break e;
            }
          }
          a = !0;
        }
        r = !a;
      }
      if (r) return null;
      switch (a = t ? U(t) : window,
      e) {
        case 'focus':
          (Be(a) || a.contentEditable === 'true') && (Wn = a,
          Hn = t,
          Xn = null);
          break;
        case 'blur':
          Xn = Hn = Wn = null;
          break;
        case 'mousedown':
          Yn = !0;
          break;
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          return Yn = !1,
          $n(n, i);
        case 'selectionchange':
          if (Bn) break;
        case 'keydown':
        case 'keyup':
          return $n(n, i);
      }
      return null;
    }
  };

  function qn(e, t) {
    return e = r({
      children: void 0
    }, t),
    (t = (function (e) {
      let t = '';
      return i.Children.forEach(e, ((e) => {
        e != null && (t += e);
      }
      )),
      t;
    }(t.children))) && (e.children = t),
    e;
  }

  function Gn(e, t, n, i) {
    if (e = e.options,
    t) {
      t = {};
      for (var r = 0; r < n.length; r++) t[`$${n[r]}`] = !0;
      for (n = 0; n < e.length; n++) {
        r = t.hasOwnProperty(`$${e[n].value}`),
        e[n].selected !== r && (e[n].selected = r),
        r && i && (e[n].defaultSelected = !0);
      }
    } else {
      for (n = `${wt(n)}`,
      t = null,
      r = 0; r < e.length; r++) {
        if (e[r].value === n) {
          return e[r].selected = !0,
          void (i && (e[r].defaultSelected = !0));
        }
        t !== null || e[r].disabled || (t = e[r]);
      }
      t !== null && (t.selected = !0);
    }
  }

  function Jn(e, t) {
    return t.dangerouslySetInnerHTML != null && o('91'),
    r({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: `${e._wrapperState.initialValue}`
    });
  }

  function Qn(e, t) {
    let n = t.value;
    n == null && (n = t.defaultValue,
    (t = t.children) != null && (n != null && o('92'),
    Array.isArray(t) && (t.length <= 1 || o('93'),
    t = t[0]),
    n = t),
    n == null && (n = '')),
    e._wrapperState = {
      initialValue: wt(n)
    };
  }

  function Zn(e, t) {
    let n = wt(t.value);
    const i = wt(t.defaultValue);
    n != null && ((n = `${n}`) !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    i != null && (e.defaultValue = `${i}`);
  }

  function ei(e) {
    const t = e.textContent;
    t === e._wrapperState.initialValue && (e.value = t);
  }

  A.injectEventPluginOrder('ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin'.split(' ')),
  C = B,
  x = V,
  T = U,
  A.injectEventPluginsByName({
    SimpleEventPlugin: xn,
    EnterLeaveEventPlugin: en,
    ChangeEventPlugin: zt,
    SelectEventPlugin: Kn,
    BeforeInputEventPlugin: Oe
  });
  const ti = {
    html: 'http://www.w3.org/1999/xhtml',
    mathml: 'http://www.w3.org/1998/Math/MathML',
    svg: 'http://www.w3.org/2000/svg'
  };

  function ni(e) {
    switch (e) {
      case 'svg':
        return 'http://www.w3.org/2000/svg';
      case 'math':
        return 'http://www.w3.org/1998/Math/MathML';
      default:
        return 'http://www.w3.org/1999/xhtml';
    }
  }

  function ii(e, t) {
    return e == null || e === 'http://www.w3.org/1999/xhtml' ? ni(t) : e === 'http://www.w3.org/2000/svg' && t === 'foreignObject' ? 'http://www.w3.org/1999/xhtml' : e;
  }

  let ri = void 0;
  const ai = (function (e) {
    return typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction ? function (t, n, i, r) {
      MSApp.execUnsafeLocalFunction((() => e(t, n)
      ));
    }
      : e;
  }(((e, t) => {
    if (e.namespaceURI !== ti.svg || 'innerHTML' in e) {
      e.innerHTML = t;
    } else {
      for ((ri = ri || document.createElement('div')).innerHTML = `<svg>${t}</svg>`,
      t = ri.firstChild; e.firstChild;) {
        e.removeChild(e.firstChild);
      }
      for (; t.firstChild;) e.appendChild(t.firstChild);
    }
  }
  )));

  function oi(e, t) {
    if (t) {
      const n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) return void (n.nodeValue = t);
    }
    e.textContent = t;
  }

  const si = {
    animationIterationCount: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  };
  const ci = ['Webkit', 'ms', 'Moz', 'O'];

  function li(e, t) {
    for (let n in e = e.style,
    t) {
      if (t.hasOwnProperty(n)) {
        const i = n.indexOf('--') === 0;
        let r = n;
        const a = t[n];
        r = a == null || typeof a === 'boolean' || a === '' ? '' : i || typeof a !== 'number' || a === 0 || si.hasOwnProperty(r) && si[r] ? (`${a}`).trim() : `${a}px`,
        n === 'float' && (n = 'cssFloat'),
        i ? e.setProperty(n, r) : e[n] = r;
      }
    }
  }

  Object.keys(si)
    .forEach(((e) => {
      ci.forEach(((t) => {
        t = t + e.charAt(0)
          .toUpperCase() + e.substring(1),
        si[t] = si[e];
      }
      ));
    }
    ));
  const ui = r({
    menuitem: !0
  }, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
  });

  function pi(e, t) {
    t && (ui[e] && (t.children != null || t.dangerouslySetInnerHTML != null) && o('137', e, ''),
    t.dangerouslySetInnerHTML != null && (t.children != null && o('60'),
    typeof t.dangerouslySetInnerHTML === 'object' && '__html' in t.dangerouslySetInnerHTML || o('61')),
    t.style != null && typeof t.style !== 'object' && o('62', ''));
  }

  function di(e, t) {
    if (e.indexOf('-') === -1) return typeof t.is === 'string';
    switch (e) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }

  function hi(e, t) {
    const n = Dn(e = e.nodeType === 9 || e.nodeType === 11 ? e : e.ownerDocument);
    t = w[t];
    for (let i = 0; i < t.length; i++) {
      const r = t[i];
      if (!n.hasOwnProperty(r) || !n[r]) {
        switch (r) {
          case 'scroll':
            Pn('scroll', e);
            break;
          case 'focus':
          case 'blur':
            Pn('focus', e),
            Pn('blur', e),
            n.blur = !0,
            n.focus = !0;
            break;
          case 'cancel':
          case 'close':
            We(r) && Pn(r, e);
            break;
          case 'invalid':
          case 'submit':
          case 'reset':
            break;
          default:
            re.indexOf(r) === -1 && On(r, e);
        }
        n[r] = !0;
      }
    }
  }

  function fi() {
  }

  let mi = null;
  let vi = null;

  function gi(e, t) {
    switch (e) {
      case 'button':
      case 'input':
      case 'select':
      case 'textarea':
        return !!t.autoFocus;
    }
    return !1;
  }

  function bi(e, t) {
    return e === 'textarea' || e === 'option' || e === 'noscript' || typeof t.children === 'string' || typeof t.children === 'number' || typeof t.dangerouslySetInnerHTML === 'object' && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }

  const yi = setTimeout;
  const _i = clearTimeout;

  function wi(e) {
    for (e = e.nextSibling; e && e.nodeType !== 1 && e.nodeType !== 3;) e = e.nextSibling;
    return e;
  }

  function Ci(e) {
    for (e = e.firstChild; e && e.nodeType !== 1 && e.nodeType !== 3;) e = e.nextSibling;
    return e;
  }

  new Set();
  const xi = [];
  let Ti = -1;

  function Si(e) {
    Ti < 0 || (e.current = xi[Ti],
    xi[Ti] = null,
    Ti--);
  }

  function Ei(e, t) {
    Ti++,
    xi[Ti] = e.current,
    e.current = t;
  }

  const ki = {};
  const Oi = {
    current: ki
  };
  const Pi = {
    current: !1
  };
  let Ni = ki;

  function Ii(e, t) {
    const n = e.type.contextTypes;
    if (!n) return ki;
    const i = e.stateNode;
    if (i && i.__reactInternalMemoizedUnmaskedChildContext === t) return i.__reactInternalMemoizedMaskedChildContext;
    let r;
    const
      a = {};
    for (r in n) a[r] = t[r];
    return i && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = t,
    e.__reactInternalMemoizedMaskedChildContext = a),
    a;
  }

  function Ai(e) {
    return (e = e.childContextTypes) != null;
  }

  function ji(e) {
    Si(Pi),
    Si(Oi);
  }

  function Ri(e) {
    Si(Pi),
    Si(Oi);
  }

  function Di(e, t, n) {
    Oi.current !== ki && o('168'),
    Ei(Oi, t),
    Ei(Pi, n);
  }

  function Mi(e, t, n) {
    let i = e.stateNode;
    if (e = t.childContextTypes,
    typeof i.getChildContext !== 'function') {
      return n;
    }
    for (const a in i = i.getChildContext()) a in e || o('108', ut(t) || 'Unknown', a);
    return r({}, n, i);
  }

  function Li(e) {
    let t = e.stateNode;
    return t = t && t.__reactInternalMemoizedMergedChildContext || ki,
    Ni = Oi.current,
    Ei(Oi, t),
    Ei(Pi, Pi.current),
    !0;
  }

  function Fi(e, t, n) {
    const i = e.stateNode;
    i || o('169'),
    n ? (t = Mi(e, t, Ni),
    i.__reactInternalMemoizedMergedChildContext = t,
    Si(Pi),
    Si(Oi),
    Ei(Oi, t)) : Si(Pi),
    Ei(Pi, n);
  }

  let Vi = null;
  let Ui = null;

  function Bi(e) {
    return function (t) {
      try {
        return e(t);
      } catch (e) {
      }
    };
  }

  function zi(e, t, n, i) {
    this.tag = e,
    this.key = n,
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
    this.index = 0,
    this.ref = null,
    this.pendingProps = t,
    this.firstContextDependency = this.memoizedState = this.updateQueue = this.memoizedProps = null,
    this.mode = i,
    this.effectTag = 0,
    this.lastEffect = this.firstEffect = this.nextEffect = null,
    this.childExpirationTime = this.expirationTime = 0,
    this.alternate = null;
  }

  function Wi(e, t, n, i) {
    return new zi(e, t, n, i);
  }

  function Hi(e) {
    return !(!(e = e.prototype) || !e.isReactComponent);
  }

  function Xi(e, t) {
    let n = e.alternate;
    return n === null ? ((n = Wi(e.tag, t, e.key, e.mode)).elementType = e.elementType,
    n.type = e.type,
    n.stateNode = e.stateNode,
    n.alternate = e,
    e.alternate = n) : (n.pendingProps = t,
    n.effectTag = 0,
    n.nextEffect = null,
    n.firstEffect = null,
    n.lastEffect = null),
    n.childExpirationTime = e.childExpirationTime,
    n.expirationTime = e.expirationTime,
    n.child = e.child,
    n.memoizedProps = e.memoizedProps,
    n.memoizedState = e.memoizedState,
    n.updateQueue = e.updateQueue,
    n.firstContextDependency = e.firstContextDependency,
    n.sibling = e.sibling,
    n.index = e.index,
    n.ref = e.ref,
    n;
  }

  function Yi(e, t, n, i, r, a) {
    let s = 2;
    if (i = e,
    typeof e === 'function') {
      Hi(e) && (s = 1);
    } else if (typeof e === 'string') {
      s = 5;
    } else {
      e: switch (e) {
        case Qe:
          return $i(n.children, r, a, t);
        case it:
          return Ki(n, 3 | r, a, t);
        case Ze:
          return Ki(n, 2 | r, a, t);
        case et:
          return (e = Wi(12, n, t, 4 | r)).elementType = et,
          e.type = et,
          e.expirationTime = a,
          e;
        case at:
          return (e = Wi(13, n, t, r)).elementType = at,
          e.type = at,
          e.expirationTime = a,
          e;
        default:
          if (typeof e === 'object' && e !== null) {
            switch (e.$$typeof) {
              case tt:
                s = 10;
                break e;
              case nt:
                s = 9;
                break e;
              case rt:
                s = 11;
                break e;
              case ot:
                s = 14;
                break e;
              case st:
                s = 16,
                i = null;
                break e;
            }
          }
          o('130', e == null ? e : typeof e, '');
      }
    }
    return (t = Wi(s, n, t, r)).elementType = e,
    t.type = i,
    t.expirationTime = a,
    t;
  }

  function $i(e, t, n, i) {
    return (e = Wi(7, e, i, t)).expirationTime = n,
    e;
  }

  function Ki(e, t, n, i) {
    return e = Wi(8, e, i, t),
    t = (1 & t) == 0 ? Ze : it,
    e.elementType = t,
    e.type = t,
    e.expirationTime = n,
    e;
  }

  function qi(e, t, n) {
    return (e = Wi(6, e, null, t)).expirationTime = n,
    e;
  }

  function Gi(e, t, n) {
    return (t = Wi(4, e.children !== null ? e.children : [], e.key, t)).expirationTime = n,
    t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    },
    t;
  }

  function Ji(e, t) {
    e.didError = !1;
    const n = e.earliestPendingTime;
    n === 0 ? e.earliestPendingTime = e.latestPendingTime = t : n > t ? e.earliestPendingTime = t : e.latestPendingTime < t && (e.latestPendingTime = t),
    er(t, e);
  }

  function Qi(e, t) {
    e.didError = !1;
    let n = e.latestPingedTime;
    n !== 0 && n <= t && (e.latestPingedTime = 0),
    n = e.earliestPendingTime;
    let i = e.latestPendingTime;
    n === t ? e.earliestPendingTime = i === t ? e.latestPendingTime = 0 : i : i === t && (e.latestPendingTime = n),
    n = e.earliestSuspendedTime,
    i = e.latestSuspendedTime,
    n === 0 ? e.earliestSuspendedTime = e.latestSuspendedTime = t : n > t ? e.earliestSuspendedTime = t : i < t && (e.latestSuspendedTime = t),
    er(t, e);
  }

  function Zi(e, t) {
    const n = e.earliestPendingTime;
    return e = e.earliestSuspendedTime,
    (t === 0 || n !== 0 && n < t) && (t = n),
    (t === 0 || e !== 0 && e < t) && (t = e),
    t;
  }

  function er(e, t) {
    const n = t.earliestSuspendedTime;
    const i = t.latestSuspendedTime;
    let r = t.earliestPendingTime;
    const a = t.latestPingedTime;
    (r = r !== 0 ? r : a) === 0 && (e === 0 || i > e) && (r = i),
    (e = r) !== 0 && n !== 0 && n < e && (e = n),
    t.nextExpirationTimeToWorkOn = r,
    t.expirationTime = e;
  }

  let tr = !1;

  function nr(e) {
    return {
      baseState: e,
      firstUpdate: null,
      lastUpdate: null,
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
  }

  function ir(e) {
    return {
      baseState: e.baseState,
      firstUpdate: e.firstUpdate,
      lastUpdate: e.lastUpdate,
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
  }

  function rr(e) {
    return {
      expirationTime: e,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
      nextEffect: null
    };
  }

  function ar(e, t) {
    e.lastUpdate === null ? e.firstUpdate = e.lastUpdate = t : (e.lastUpdate.next = t,
    e.lastUpdate = t);
  }

  function or(e, t) {
    const n = e.alternate;
    if (n === null) {
      var i = e.updateQueue;
      var r = null;
      i === null && (i = e.updateQueue = nr(e.memoizedState));
    } else {
      i = e.updateQueue,
      r = n.updateQueue,
      i === null ? r === null ? (i = e.updateQueue = nr(e.memoizedState),
      r = n.updateQueue = nr(n.memoizedState)) : i = e.updateQueue = ir(r) : r === null && (r = n.updateQueue = ir(i));
    }
    r === null || i === r ? ar(i, t) : i.lastUpdate === null || r.lastUpdate === null ? (ar(i, t),
    ar(r, t)) : (ar(i, t),
    r.lastUpdate = t);
  }

  function sr(e, t) {
    let n = e.updateQueue;
    (n = n === null ? e.updateQueue = nr(e.memoizedState) : cr(e, n)).lastCapturedUpdate === null ? n.firstCapturedUpdate = n.lastCapturedUpdate = t : (n.lastCapturedUpdate.next = t,
    n.lastCapturedUpdate = t);
  }

  function cr(e, t) {
    const n = e.alternate;
    return n !== null && t === n.updateQueue && (t = e.updateQueue = ir(t)),
    t;
  }

  function lr(e, t, n, i, a, o) {
    switch (n.tag) {
      case 1:
        return typeof (e = n.payload) === 'function' ? e.call(o, i, a) : e;
      case 3:
        e.effectTag = -1025 & e.effectTag | 64;
      case 0:
        if ((a = typeof (e = n.payload) === 'function' ? e.call(o, i, a) : e) == null) break;
        return r({}, i, a);
      case 2:
        tr = !0;
    }
    return i;
  }

  function ur(e, t, n, i, r) {
    tr = !1;
    for (var a = (t = cr(e, t)).baseState, o = null, s = 0, c = t.firstUpdate, l = a; c !== null;) {
      var u = c.expirationTime;
      u > r ? (o === null && (o = c,
      a = l),
      (s === 0 || s > u) && (s = u)) : (l = lr(e, 0, c, l, n, i),
      c.callback !== null && (e.effectTag |= 32,
      c.nextEffect = null,
      t.lastEffect === null ? t.firstEffect = t.lastEffect = c : (t.lastEffect.nextEffect = c,
      t.lastEffect = c))),
      c = c.next;
    }
    for (u = null,
    c = t.firstCapturedUpdate; c !== null;) {
      const p = c.expirationTime;
      p > r ? (u === null && (u = c,
      o === null && (a = l)),
      (s === 0 || s > p) && (s = p)) : (l = lr(e, 0, c, l, n, i),
      c.callback !== null && (e.effectTag |= 32,
      c.nextEffect = null,
      t.lastCapturedEffect === null ? t.firstCapturedEffect = t.lastCapturedEffect = c : (t.lastCapturedEffect.nextEffect = c,
      t.lastCapturedEffect = c))),
      c = c.next;
    }
    o === null && (t.lastUpdate = null),
    u === null ? t.lastCapturedUpdate = null : e.effectTag |= 32,
    o === null && u === null && (a = l),
    t.baseState = a,
    t.firstUpdate = o,
    t.firstCapturedUpdate = u,
    e.expirationTime = s,
    e.memoizedState = l;
  }

  function pr(e, t, n) {
    t.firstCapturedUpdate !== null && (t.lastUpdate !== null && (t.lastUpdate.next = t.firstCapturedUpdate,
    t.lastUpdate = t.lastCapturedUpdate),
    t.firstCapturedUpdate = t.lastCapturedUpdate = null),
    dr(t.firstEffect, n),
    t.firstEffect = t.lastEffect = null,
    dr(t.firstCapturedEffect, n),
    t.firstCapturedEffect = t.lastCapturedEffect = null;
  }

  function dr(e, t) {
    for (; e !== null;) {
      const n = e.callback;
      if (n !== null) {
        e.callback = null;
        const i = t;
        typeof n !== 'function' && o('191', n),
        n.call(i);
      }
      e = e.nextEffect;
    }
  }

  function hr(e, t) {
    return {
      value: e,
      source: t,
      stack: pt(t)
    };
  }

  const fr = {
    current: null
  };
  let mr = null;
  let vr = null;
  let gr = null;

  function br(e, t) {
    const n = e.type._context;
    Ei(fr, n._currentValue),
    n._currentValue = t;
  }

  function yr(e) {
    const t = fr.current;
    Si(fr),
    e.type._context._currentValue = t;
  }

  function _r(e) {
    mr = e,
    gr = vr = null,
    e.firstContextDependency = null;
  }

  function wr(e, t) {
    return gr !== e && !1 !== t && t !== 0 && (typeof t === 'number' && t !== 1073741823 || (gr = e,
    t = 1073741823),
    t = {
      context: e,
      observedBits: t,
      next: null
    },
    vr === null ? (mr === null && o('293'),
    mr.firstContextDependency = vr = t) : vr = vr.next = t),
    e._currentValue;
  }

  const Cr = {};
  const xr = {
    current: Cr
  };
  const Tr = {
    current: Cr
  };
  const Sr = {
    current: Cr
  };

  function Er(e) {
    return e === Cr && o('174'),
    e;
  }

  function kr(e, t) {
    Ei(Sr, t),
    Ei(Tr, e),
    Ei(xr, Cr);
    let n = t.nodeType;
    switch (n) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : ii(null, '');
        break;
      default:
        t = ii(t = (n = n === 8 ? t.parentNode : t).namespaceURI || null, n = n.tagName);
    }
    Si(xr),
    Ei(xr, t);
  }

  function Or(e) {
    Si(xr),
    Si(Tr),
    Si(Sr);
  }

  function Pr(e) {
    Er(Sr.current);
    const t = Er(xr.current);
    const n = ii(t, e.type);
    t !== n && (Ei(Tr, e),
    Ei(xr, n));
  }

  function Nr(e) {
    Tr.current === e && (Si(xr),
    Si(Tr));
  }

  const Ir = $e.ReactCurrentOwner;
  const Ar = (new i.Component()).refs;

  function jr(e, t, n, i) {
    n = (n = n(i, t = e.memoizedState)) == null ? t : r({}, t, n),
    e.memoizedState = n,
    (i = e.updateQueue) !== null && e.expirationTime === 0 && (i.baseState = n);
  }

  const Rr = {
    isMounted(e) {
      return !!(e = e._reactInternalFiber) && an(e) === 2;
    },
    enqueueSetState(e, t, n) {
      e = e._reactInternalFiber;
      let i = Eo();
      const r = rr(i = $a(i, e));
      r.payload = t,
      n != null && (r.callback = n),
      or(e, r),
      Ga(e, i);
    },
    enqueueReplaceState(e, t, n) {
      e = e._reactInternalFiber;
      let i = Eo();
      const r = rr(i = $a(i, e));
      r.tag = 1,
      r.payload = t,
      n != null && (r.callback = n),
      or(e, r),
      Ga(e, i);
    },
    enqueueForceUpdate(e, t) {
      e = e._reactInternalFiber;
      let n = Eo();
      const i = rr(n = $a(n, e));
      i.tag = 2,
      t != null && (i.callback = t),
      or(e, i),
      Ga(e, n);
    }
  };

  function Dr(e, t, n, i, r, a, o) {
    return typeof (e = e.stateNode).shouldComponentUpdate === 'function' ? e.shouldComponentUpdate(i, a, o) : !t.prototype || !t.prototype.isPureReactComponent || (!rn(n, i) || !rn(r, a));
  }

  function Mr(e, t, n) {
    let i = !1;
    let r = ki;
    let a = t.contextType;
    return typeof a === 'object' && a !== null ? a = Ir.currentDispatcher.readContext(a) : (r = Ai(t) ? Ni : Oi.current,
    a = (i = (i = t.contextTypes) != null) ? Ii(e, r) : ki),
    t = new t(n, a),
    e.memoizedState = t.state !== null && void 0 !== t.state ? t.state : null,
    t.updater = Rr,
    e.stateNode = t,
    t._reactInternalFiber = e,
    i && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = r,
    e.__reactInternalMemoizedMaskedChildContext = a),
    t;
  }

  function Lr(e, t, n, i) {
    e = t.state,
    typeof t.componentWillReceiveProps === 'function' && t.componentWillReceiveProps(n, i),
    typeof t.UNSAFE_componentWillReceiveProps === 'function' && t.UNSAFE_componentWillReceiveProps(n, i),
    t.state !== e && Rr.enqueueReplaceState(t, t.state, null);
  }

  function Fr(e, t, n, i) {
    const r = e.stateNode;
    r.props = n,
    r.state = e.memoizedState,
    r.refs = Ar;
    let a = t.contextType;
    typeof a === 'object' && a !== null ? r.context = Ir.currentDispatcher.readContext(a) : (a = Ai(t) ? Ni : Oi.current,
    r.context = Ii(e, a)),
    (a = e.updateQueue) !== null && (ur(e, a, n, r, i),
    r.state = e.memoizedState),
    typeof (a = t.getDerivedStateFromProps) === 'function' && (jr(e, t, a, n),
    r.state = e.memoizedState),
    typeof t.getDerivedStateFromProps === 'function' || typeof r.getSnapshotBeforeUpdate === 'function' || typeof r.UNSAFE_componentWillMount !== 'function' && typeof r.componentWillMount !== 'function' || (t = r.state,
    typeof r.componentWillMount === 'function' && r.componentWillMount(),
    typeof r.UNSAFE_componentWillMount === 'function' && r.UNSAFE_componentWillMount(),
    t !== r.state && Rr.enqueueReplaceState(r, r.state, null),
    (a = e.updateQueue) !== null && (ur(e, a, n, r, i),
    r.state = e.memoizedState)),
    typeof r.componentDidMount === 'function' && (e.effectTag |= 4);
  }

  const Vr = Array.isArray;

  function Ur(e, t, n) {
    if ((e = n.ref) !== null && typeof e !== 'function' && typeof e !== 'object') {
      if (n._owner) {
        n = n._owner;
        let i = void 0;
        n && (n.tag !== 1 && o('289'),
        i = n.stateNode),
        i || o('147', e);
        const r = `${e}`;
        return t !== null && t.ref !== null && typeof t.ref === 'function' && t.ref._stringRef === r ? t.ref : ((t = function (e) {
          let t = i.refs;
          t === Ar && (t = i.refs = {}),
          e === null ? delete t[r] : t[r] = e;
        }
        )._stringRef = r,
        t);
      }
      typeof e !== 'string' && o('284'),
      n._owner || o('290', e);
    }
    return e;
  }

  function Br(e, t) {
    e.type !== 'textarea' && o('31', Object.prototype.toString.call(t) === '[object Object]' ? `object with keys {${Object.keys(t)
      .join(', ')}}` : t, '');
  }

  function zr(e) {
    function t(t, n) {
      if (e) {
        const i = t.lastEffect;
        i !== null ? (i.nextEffect = n,
        t.lastEffect = n) : t.firstEffect = t.lastEffect = n,
        n.nextEffect = null,
        n.effectTag = 8;
      }
    }

    function n(n, i) {
      if (!e) return null;
      for (; i !== null;) {
        t(n, i),
        i = i.sibling;
      }
      return null;
    }

    function i(e, t) {
      for (e = new Map(); t !== null;) {
        t.key !== null ? e.set(t.key, t) : e.set(t.index, t),
        t = t.sibling;
      }
      return e;
    }

    function r(e, t, n) {
      return (e = Xi(e, t)).index = 0,
      e.sibling = null,
      e;
    }

    function a(t, n, i) {
      return t.index = i,
      e ? (i = t.alternate) !== null ? (i = i.index) < n ? (t.effectTag = 2,
      n) : i : (t.effectTag = 2,
      n) : n;
    }

    function s(t) {
      return e && t.alternate === null && (t.effectTag = 2),
      t;
    }

    function c(e, t, n, i) {
      return t === null || t.tag !== 6 ? ((t = qi(n, e.mode, i)).return = e,
      t) : ((t = r(t, n)).return = e,
      t);
    }

    function l(e, t, n, i) {
      return t !== null && t.elementType === n.type ? ((i = r(t, n.props)).ref = Ur(e, t, n),
      i.return = e,
      i) : ((i = Yi(n.type, n.key, n.props, null, e.mode, i)).ref = Ur(e, t, n),
      i.return = e,
      i);
    }

    function u(e, t, n, i) {
      return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? ((t = Gi(n, e.mode, i)).return = e,
      t) : ((t = r(t, n.children || [])).return = e,
      t);
    }

    function p(e, t, n, i, a) {
      return t === null || t.tag !== 7 ? ((t = $i(n, e.mode, i, a)).return = e,
      t) : ((t = r(t, n)).return = e,
      t);
    }

    function d(e, t, n) {
      if (typeof t === 'string' || typeof t === 'number') {
        return (t = qi(`${t}`, e.mode, n)).return = e,
        t;
      }
      if (typeof t === 'object' && t !== null) {
        switch (t.$$typeof) {
          case Ge:
            return (n = Yi(t.type, t.key, t.props, null, e.mode, n)).ref = Ur(e, null, t),
            n.return = e,
            n;
          case Je:
            return (t = Gi(t, e.mode, n)).return = e,
            t;
        }
        if (Vr(t) || lt(t)) {
          return (t = $i(t, e.mode, n, null)).return = e,
          t;
        }
        Br(e, t);
      }
      return null;
    }

    function h(e, t, n, i) {
      const r = t !== null ? t.key : null;
      if (typeof n === 'string' || typeof n === 'number') return r !== null ? null : c(e, t, `${n}`, i);
      if (typeof n === 'object' && n !== null) {
        switch (n.$$typeof) {
          case Ge:
            return n.key === r ? n.type === Qe ? p(e, t, n.props.children, i, r) : l(e, t, n, i) : null;
          case Je:
            return n.key === r ? u(e, t, n, i) : null;
        }
        if (Vr(n) || lt(n)) return r !== null ? null : p(e, t, n, i, null);
        Br(e, n);
      }
      return null;
    }

    function f(e, t, n, i, r) {
      if (typeof i === 'string' || typeof i === 'number') return c(t, e = e.get(n) || null, `${i}`, r);
      if (typeof i === 'object' && i !== null) {
        switch (i.$$typeof) {
          case Ge:
            return e = e.get(i.key === null ? n : i.key) || null,
            i.type === Qe ? p(t, e, i.props.children, r, i.key) : l(t, e, i, r);
          case Je:
            return u(t, e = e.get(i.key === null ? n : i.key) || null, i, r);
        }
        if (Vr(i) || lt(i)) return p(t, e = e.get(n) || null, i, r, null);
        Br(t, i);
      }
      return null;
    }

    function m(r, o, s, c) {
      for (var l = null, u = null, p = o, m = o = 0, v = null; p !== null && m < s.length; m++) {
        p.index > m ? (v = p,
        p = null) : v = p.sibling;
        const g = h(r, p, s[m], c);
        if (g === null) {
          p === null && (p = v);
          break;
        }
        e && p && g.alternate === null && t(r, p),
        o = a(g, o, m),
        u === null ? l = g : u.sibling = g,
        u = g,
        p = v;
      }
      if (m === s.length) {
        return n(r, p),
        l;
      }
      if (p === null) {
        for (; m < s.length; m++) {
          (p = d(r, s[m], c)) && (o = a(p, o, m),
          u === null ? l = p : u.sibling = p,
          u = p);
        }
        return l;
      }
      for (p = i(r, p); m < s.length; m++) {
        (v = f(p, r, m, s[m], c)) && (e && v.alternate !== null && p.delete(v.key === null ? m : v.key),
        o = a(v, o, m),
        u === null ? l = v : u.sibling = v,
        u = v);
      }
      return e && p.forEach(((e) => t(r, e)
      )),
      l;
    }

    function v(r, s, c, l) {
      let u = lt(c);
      typeof u !== 'function' && o('150'),
      (c = u.call(c)) == null && o('151');
      for (var p = u = null, m = s, v = s = 0, g = null, b = c.next(); m !== null && !b.done; v++,
      b = c.next()) {
        m.index > v ? (g = m,
        m = null) : g = m.sibling;
        const y = h(r, m, b.value, l);
        if (y === null) {
          m || (m = g);
          break;
        }
        e && m && y.alternate === null && t(r, m),
        s = a(y, s, v),
        p === null ? u = y : p.sibling = y,
        p = y,
        m = g;
      }
      if (b.done) {
        return n(r, m),
        u;
      }
      if (m === null) {
        for (; !b.done; v++,
        b = c.next()) {
          (b = d(r, b.value, l)) !== null && (s = a(b, s, v),
          p === null ? u = b : p.sibling = b,
          p = b);
        }
        return u;
      }
      for (m = i(r, m); !b.done; v++,
      b = c.next()) {
        (b = f(m, r, v, b.value, l)) !== null && (e && b.alternate !== null && m.delete(b.key === null ? v : b.key),
        s = a(b, s, v),
        p === null ? u = b : p.sibling = b,
        p = b);
      }
      return e && m.forEach(((e) => t(r, e)
      )),
      u;
    }

    return function (e, i, a, c) {
      let l = typeof a === 'object' && a !== null && a.type === Qe && a.key === null;
      l && (a = a.props.children);
      let u = typeof a === 'object' && a !== null;
      if (u) {
        switch (a.$$typeof) {
          case Ge:
            e: {
              for (u = a.key,
              l = i; l !== null;) {
                if (l.key === u) {
                  if (l.tag === 7 ? a.type === Qe : l.elementType === a.type) {
                    n(e, l.sibling),
                    (i = r(l, a.type === Qe ? a.props.children : a.props)).ref = Ur(e, l, a),
                    i.return = e,
                    e = i;
                    break e;
                  }
                  n(e, l);
                  break;
                }
                t(e, l),
                l = l.sibling;
              }
              a.type === Qe ? ((i = $i(a.props.children, e.mode, c, a.key)).return = e,
              e = i) : ((c = Yi(a.type, a.key, a.props, null, e.mode, c)).ref = Ur(e, i, a),
              c.return = e,
              e = c);
            }
            return s(e);
          case Je:
            e: {
              for (l = a.key; i !== null;) {
                if (i.key === l) {
                  if (i.tag === 4 && i.stateNode.containerInfo === a.containerInfo && i.stateNode.implementation === a.implementation) {
                    n(e, i.sibling),
                    (i = r(i, a.children || [])).return = e,
                    e = i;
                    break e;
                  }
                  n(e, i);
                  break;
                }
                t(e, i),
                i = i.sibling;
              }
              (i = Gi(a, e.mode, c)).return = e,
              e = i;
            }
            return s(e);
        }
      }
      if (typeof a === 'string' || typeof a === 'number') {
        return a = `${a}`,
        i !== null && i.tag === 6 ? (n(e, i.sibling),
        (i = r(i, a)).return = e,
        e = i) : (n(e, i),
        (i = qi(a, e.mode, c)).return = e,
        e = i),
        s(e);
      }
      if (Vr(a)) return m(e, i, a, c);
      if (lt(a)) return v(e, i, a, c);
      if (u && Br(e, a),
      void 0 === a && !l) {
        switch (e.tag) {
          case 1:
          case 0:
            o('152', (c = e.type).displayName || c.name || 'Component');
        }
      }
      return n(e, i);
    };
  }

  const Wr = zr(!0);
  const Hr = zr(!1);
  let Xr = null;
  let Yr = null;
  let $r = !1;

  function Kr(e, t) {
    const n = Wi(5, null, null, 0);
    n.elementType = 'DELETED',
    n.type = 'DELETED',
    n.stateNode = t,
    n.return = e,
    n.effectTag = 8,
    e.lastEffect !== null ? (e.lastEffect.nextEffect = n,
    e.lastEffect = n) : e.firstEffect = e.lastEffect = n;
  }

  function qr(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) !== null && (e.stateNode = t,
        !0);
      case 6:
        return (t = e.pendingProps === '' || t.nodeType !== 3 ? null : t) !== null && (e.stateNode = t,
        !0);
      default:
        return !1;
    }
  }

  function Gr(e) {
    if ($r) {
      let t = Yr;
      if (t) {
        const n = t;
        if (!qr(e, t)) {
          if (!(t = wi(n)) || !qr(e, t)) {
            return e.effectTag |= 2,
            $r = !1,
            void (Xr = e);
          }
          Kr(Xr, n);
        }
        Xr = e,
        Yr = Ci(t);
      } else {
        e.effectTag |= 2,
        $r = !1,
        Xr = e;
      }
    }
  }

  function Jr(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3;) e = e.return;
    Xr = e;
  }

  function Qr(e) {
    if (e !== Xr) return !1;
    if (!$r) {
      return Jr(e),
      $r = !0,
      !1;
    }
    let t = e.type;
    if (e.tag !== 5 || t !== 'head' && t !== 'body' && !bi(t, e.memoizedProps)) {
      for (t = Yr; t;) {
        Kr(e, t),
        t = wi(t);
      }
    }
    return Jr(e),
    Yr = Xr ? wi(e.stateNode) : null,
    !0;
  }

  function Zr() {
    Yr = Xr = null,
    $r = !1;
  }

  const ea = $e.ReactCurrentOwner;

  function ta(e, t, n, i) {
    t.child = e === null ? Hr(t, null, n, i) : Wr(t, e.child, n, i);
  }

  function na(e, t, n, i, r) {
    n = n.render;
    const a = t.ref;
    return Pi.current || t.memoizedProps !== i || a !== (e !== null ? e.ref : null) ? (ta(e, t, i = n(i, a), r),
    t.child) : da(e, t, r);
  }

  function ia(e, t, n, i, r, a) {
    if (e === null) {
      var o = n.type;
      return typeof o !== 'function' || Hi(o) || void 0 !== o.defaultProps || n.compare !== null ? ((e = Yi(n.type, null, i, null, t.mode, a)).ref = t.ref,
      e.return = t,
      t.child = e) : (t.tag = 15,
      t.type = o,
      ra(e, t, o, i, r, a));
    }
    return o = e.child,
    (r === 0 || r > a) && (r = o.memoizedProps,
    (n = (n = n.compare) !== null ? n : rn)(r, i) && e.ref === t.ref) ? da(e, t, a) : ((e = Xi(o, i)).ref = t.ref,
      e.return = t,
      t.child = e);
  }

  function ra(e, t, n, i, r, a) {
    return e !== null && (r === 0 || r > a) && rn(e.memoizedProps, i) && e.ref === t.ref ? da(e, t, a) : oa(e, t, n, i, a);
  }

  function aa(e, t) {
    const n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.effectTag |= 128);
  }

  function oa(e, t, n, i, r) {
    let a = Ai(n) ? Ni : Oi.current;
    return a = Ii(t, a),
    _r(t),
    n = n(i, a),
    t.effectTag |= 1,
    ta(e, t, n, r),
    t.child;
  }

  function sa(e, t, n, i, r) {
    if (Ai(n)) {
      var a = !0;
      Li(t);
    } else {
      a = !1;
    }
    if (_r(t),
    t.stateNode === null) {
      e !== null && (e.alternate = null,
      t.alternate = null,
      t.effectTag |= 2),
      Mr(t, n, i),
      Fr(t, n, i, r),
      i = !0;
    } else if (e === null) {
      var o = t.stateNode;
      var s = t.memoizedProps;
      o.props = s;
      var c = o.context;
      var l = n.contextType;
      typeof l === 'object' && l !== null ? l = Ir.currentDispatcher.readContext(l) : l = Ii(t, l = Ai(n) ? Ni : Oi.current);
      var u = n.getDerivedStateFromProps;
      var p = typeof u === 'function' || typeof o.getSnapshotBeforeUpdate === 'function';
      p || typeof o.UNSAFE_componentWillReceiveProps !== 'function' && typeof o.componentWillReceiveProps !== 'function' || (s !== i || c !== l) && Lr(t, o, i, l),
      tr = !1;
      var d = t.memoizedState;
      c = o.state = d;
      var h = t.updateQueue;
      h !== null && (ur(t, h, i, o, r),
      c = t.memoizedState),
      s !== i || d !== c || Pi.current || tr ? (typeof u === 'function' && (jr(t, n, u, i),
      c = t.memoizedState),
      (s = tr || Dr(t, n, s, i, d, c, l)) ? (p || typeof o.UNSAFE_componentWillMount !== 'function' && typeof o.componentWillMount !== 'function' || (typeof o.componentWillMount === 'function' && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount === 'function' && o.UNSAFE_componentWillMount()),
      typeof o.componentDidMount === 'function' && (t.effectTag |= 4)) : (typeof o.componentDidMount === 'function' && (t.effectTag |= 4),
      t.memoizedProps = i,
      t.memoizedState = c),
      o.props = i,
      o.state = c,
      o.context = l,
      i = s) : (typeof o.componentDidMount === 'function' && (t.effectTag |= 4),
      i = !1);
    } else {
      o = t.stateNode,
      s = t.memoizedProps,
      o.props = s,
      c = o.context,
      typeof (l = n.contextType) === 'object' && l !== null ? l = Ir.currentDispatcher.readContext(l) : l = Ii(t, l = Ai(n) ? Ni : Oi.current),
      (p = typeof (u = n.getDerivedStateFromProps) === 'function' || typeof o.getSnapshotBeforeUpdate === 'function') || typeof o.UNSAFE_componentWillReceiveProps !== 'function' && typeof o.componentWillReceiveProps !== 'function' || (s !== i || c !== l) && Lr(t, o, i, l),
      tr = !1,
      c = t.memoizedState,
      d = o.state = c,
      (h = t.updateQueue) !== null && (ur(t, h, i, o, r),
      d = t.memoizedState),
      s !== i || c !== d || Pi.current || tr ? (typeof u === 'function' && (jr(t, n, u, i),
      d = t.memoizedState),
      (u = tr || Dr(t, n, s, i, c, d, l)) ? (p || typeof o.UNSAFE_componentWillUpdate !== 'function' && typeof o.componentWillUpdate !== 'function' || (typeof o.componentWillUpdate === 'function' && o.componentWillUpdate(i, d, l),
      typeof o.UNSAFE_componentWillUpdate === 'function' && o.UNSAFE_componentWillUpdate(i, d, l)),
      typeof o.componentDidUpdate === 'function' && (t.effectTag |= 4),
      typeof o.getSnapshotBeforeUpdate === 'function' && (t.effectTag |= 256)) : (typeof o.componentDidUpdate !== 'function' || s === e.memoizedProps && c === e.memoizedState || (t.effectTag |= 4),
      typeof o.getSnapshotBeforeUpdate !== 'function' || s === e.memoizedProps && c === e.memoizedState || (t.effectTag |= 256),
      t.memoizedProps = i,
      t.memoizedState = d),
      o.props = i,
      o.state = d,
      o.context = l,
      i = u) : (typeof o.componentDidUpdate !== 'function' || s === e.memoizedProps && c === e.memoizedState || (t.effectTag |= 4),
      typeof o.getSnapshotBeforeUpdate !== 'function' || s === e.memoizedProps && c === e.memoizedState || (t.effectTag |= 256),
      i = !1);
    }
    return ca(e, t, n, i, a, r);
  }

  function ca(e, t, n, i, r, a) {
    aa(e, t);
    const o = (64 & t.effectTag) != 0;
    if (!i && !o) {
      return r && Fi(t, n, !1),
      da(e, t, a);
    }
    i = t.stateNode,
    ea.current = t;
    const s = o && typeof n.getDerivedStateFromError !== 'function' ? null : i.render();
    return t.effectTag |= 1,
    e !== null && o ? (t.child = Wr(t, e.child, null, a),
    t.child = Wr(t, null, s, a)) : ta(e, t, s, a),
    t.memoizedState = i.state,
    r && Fi(t, n, !0),
    t.child;
  }

  function la(e) {
    const t = e.stateNode;
    t.pendingContext ? Di(0, t.pendingContext, t.pendingContext !== t.context) : t.context && Di(0, t.context, !1),
    kr(e, t.containerInfo);
  }

  function ua(e, t) {
    if (e && e.defaultProps) {
      for (const n in t = r({}, t),
      e = e.defaultProps) {
        void 0 === t[n] && (t[n] = e[n]);
      }
    }
    return t;
  }

  function pa(e, t, n) {
    let i = t.mode;
    let r = t.pendingProps;
    let a = t.memoizedState;
    a !== null && (a.alreadyCaptured ? e !== null && a === e.memoizedState ? a = {
      alreadyCaptured: !0,
      didTimeout: !0,
      timedOutAt: a.timedOutAt
    } : (a.alreadyCaptured = !0,
    a.didTimeout = !0) : a = null);
    let o = a !== null && a.didTimeout;
    if (e === null) {
      o ? (o = r.fallback,
      r = $i(null, i, 0, null),
      i = $i(o, i, n, null),
      r.sibling = i,
      (n = r).return = i.return = t) : n = i = Hr(t, null, r.children, n);
    } else {
      const s = e.memoizedState;
      s !== null && s.didTimeout ? (e = (i = e.child).sibling,
      o ? (n = r.fallback,
      (i = Xi(i, i.pendingProps)).effectTag |= 2,
      (r = i.sibling = Xi(e, n, e.expirationTime)).effectTag |= 2,
      n = i,
      i.childExpirationTime = 0,
      i = r,
      n.return = i.return = t) : (o = e.child,
      i = Wr(t, i.child, r.children, n),
      Wr(t, o, null, n),
      n = i)) : (e = e.child,
      o ? (o = r.fallback,
      (r = $i(null, i, 0, null)).effectTag |= 2,
      r.child = e,
      e.return = r,
      (i = r.sibling = $i(o, i, n, null)).effectTag |= 2,
      n = r,
      r.childExpirationTime = 0,
      n.return = i.return = t) : i = n = Wr(t, e, r.children, n));
    }
    return t.memoizedState = a,
    t.child = n,
    i;
  }

  function da(e, t, n) {
    e !== null && (t.firstContextDependency = e.firstContextDependency);
    const i = t.childExpirationTime;
    if (i === 0 || i > n) return null;
    if (e !== null && t.child !== e.child && o('153'),
    t.child !== null) {
      for (n = Xi(e = t.child, e.pendingProps, e.expirationTime),
      t.child = n,
      n.return = t; e.sibling !== null;) {
        e = e.sibling,
        (n = n.sibling = Xi(e, e.pendingProps, e.expirationTime)).return = t;
      }
      n.sibling = null;
    }
    return t.child;
  }

  function ha(e, t, n) {
    let i = t.expirationTime;
    if (e !== null && e.memoizedProps === t.pendingProps && !Pi.current && (i === 0 || i > n)) {
      switch (t.tag) {
        case 3:
          la(t),
          Zr();
          break;
        case 5:
          Pr(t);
          break;
        case 1:
          Ai(t.type) && Li(t);
          break;
        case 4:
          kr(t, t.stateNode.containerInfo);
          break;
        case 10:
          br(t, t.memoizedProps.value);
          break;
        case 13:
          if ((i = t.memoizedState) !== null && i.didTimeout) return (i = t.child.childExpirationTime) !== 0 && i <= n ? pa(e, t, n) : (t = da(e, t, n)) !== null ? t.sibling : null;
      }
      return da(e, t, n);
    }
    switch (t.expirationTime = 0,
    t.tag) {
      case 2:
        i = t.elementType,
        e !== null && (e.alternate = null,
        t.alternate = null,
        t.effectTag |= 2),
        e = t.pendingProps;
        var r = Ii(t, Oi.current);
        if (_r(t),
        r = i(e, r),
        t.effectTag |= 1,
        typeof r === 'object' && r !== null && typeof r.render === 'function' && void 0 === r.$$typeof) {
          if (t.tag = 1,
          Ai(i)) {
            var a = !0;
            Li(t);
          } else {
            a = !1;
          }
          t.memoizedState = r.state !== null && void 0 !== r.state ? r.state : null;
          var s = i.getDerivedStateFromProps;
          typeof s === 'function' && jr(t, i, s, e),
          r.updater = Rr,
          t.stateNode = r,
          r._reactInternalFiber = t,
          Fr(t, i, e, n),
          t = ca(null, t, i, !0, a, n);
        } else {
          t.tag = 0,
          ta(null, t, r, n),
          t = t.child;
        }
        return t;
      case 16:
        switch (r = t.elementType,
        e !== null && (e.alternate = null,
        t.alternate = null,
        t.effectTag |= 2),
        a = t.pendingProps,
        e = (function (e) {
          let t = e._result;
          switch (e._status) {
            case 1:
              return t;
            case 2:
            case 0:
              throw t;
            default:
              throw e._status = 0,
              (t = (t = e._ctor)()).then(((t) => {
                e._status === 0 && (t = t.default,
                e._status = 1,
                e._result = t);
              }
              ), ((t) => {
                e._status === 0 && (e._status = 2,
                e._result = t);
              }
              )),
              e._result = t,
              t;
          }
        }(r)),
        t.type = e,
        r = t.tag = (function (e) {
          if (typeof e === 'function') return Hi(e) ? 1 : 0;
          if (e != null) {
            if ((e = e.$$typeof) === rt) return 11;
            if (e === ot) return 14;
          }
          return 2;
        }(e)),
        a = ua(e, a),
        s = void 0,
        r) {
          case 0:
            s = oa(null, t, e, a, n);
            break;
          case 1:
            s = sa(null, t, e, a, n);
            break;
          case 11:
            s = na(null, t, e, a, n);
            break;
          case 14:
            s = ia(null, t, e, ua(e.type, a), i, n);
            break;
          default:
            o('283', e);
        }
        return s;
      case 0:
        return i = t.type,
        r = t.pendingProps,
        oa(e, t, i, r = t.elementType === i ? r : ua(i, r), n);
      case 1:
        return i = t.type,
        r = t.pendingProps,
        sa(e, t, i, r = t.elementType === i ? r : ua(i, r), n);
      case 3:
        return la(t),
        (i = t.updateQueue) === null && o('282'),
        r = (r = t.memoizedState) !== null ? r.element : null,
        ur(t, i, t.pendingProps, null, n),
        (i = t.memoizedState.element) === r ? (Zr(),
        t = da(e, t, n)) : (r = t.stateNode,
        (r = (e === null || e.child === null) && r.hydrate) && (Yr = Ci(t.stateNode.containerInfo),
        Xr = t,
        r = $r = !0),
        r ? (t.effectTag |= 2,
        t.child = Hr(t, null, i, n)) : (ta(e, t, i, n),
        Zr()),
        t = t.child),
        t;
      case 5:
        return Pr(t),
        e === null && Gr(t),
        i = t.type,
        r = t.pendingProps,
        a = e !== null ? e.memoizedProps : null,
        s = r.children,
        bi(i, r) ? s = null : a !== null && bi(i, a) && (t.effectTag |= 16),
        aa(e, t),
        n !== 1073741823 && 1 & t.mode && r.hidden ? (t.expirationTime = 1073741823,
        t = null) : (ta(e, t, s, n),
        t = t.child),
        t;
      case 6:
        return e === null && Gr(t),
        null;
      case 13:
        return pa(e, t, n);
      case 4:
        return kr(t, t.stateNode.containerInfo),
        i = t.pendingProps,
        e === null ? t.child = Wr(t, null, i, n) : ta(e, t, i, n),
        t.child;
      case 11:
        return i = t.type,
        r = t.pendingProps,
        na(e, t, i, r = t.elementType === i ? r : ua(i, r), n);
      case 7:
        return ta(e, t, t.pendingProps, n),
        t.child;
      case 8:
      case 12:
        return ta(e, t, t.pendingProps.children, n),
        t.child;
      case 10:
        e: {
          if (i = t.type._context,
          r = t.pendingProps,
          s = t.memoizedProps,
          br(t, a = r.value),
          s !== null) {
            let c = s.value;
            if ((a = c === a && (c !== 0 || 1 / c == 1 / a) || c != c && a != a ? 0 : 0 | (typeof i._calculateChangedBits === 'function' ? i._calculateChangedBits(c, a) : 1073741823)) === 0) {
              if (s.children === r.children && !Pi.current) {
                t = da(e, t, n);
                break e;
              }
            } else {
              for ((s = t.child) !== null && (s.return = t); s !== null;) {
                if ((c = s.firstContextDependency) !== null) {
                  do {
                    if (c.context === i && (c.observedBits & a) != 0) {
                      if (s.tag === 1) {
                        var l = rr(n);
                        l.tag = 2,
                        or(s, l);
                      }
                      (s.expirationTime === 0 || s.expirationTime > n) && (s.expirationTime = n),
                      (l = s.alternate) !== null && (l.expirationTime === 0 || l.expirationTime > n) && (l.expirationTime = n);
                      for (let u = s.return; u !== null;) {
                        if (l = u.alternate,
                        u.childExpirationTime === 0 || u.childExpirationTime > n) {
                          u.childExpirationTime = n,
                          l !== null && (l.childExpirationTime === 0 || l.childExpirationTime > n) && (l.childExpirationTime = n);
                        } else {
                          if (l === null || !(l.childExpirationTime === 0 || l.childExpirationTime > n)) break;
                          l.childExpirationTime = n;
                        }
                        u = u.return;
                      }
                    }
                    l = s.child,
                    c = c.next;
                  } while (c !== null);
                } else {
                  l = s.tag === 10 && s.type === t.type ? null : s.child;
                }
                if (l !== null) {
                  l.return = s;
                } else {
                  for (l = s; l !== null;) {
                    if (l === t) {
                      l = null;
                      break;
                    }
                    if ((s = l.sibling) !== null) {
                      s.return = l.return,
                      l = s;
                      break;
                    }
                    l = l.return;
                  }
                }
                s = l;
              }
            }
          }
          ta(e, t, r.children, n),
          t = t.child;
        }
        return t;
      case 9:
        return r = t.type,
        i = (a = t.pendingProps).children,
        _r(t),
        i = i(r = wr(r, a.unstable_observedBits)),
        t.effectTag |= 1,
        ta(e, t, i, n),
        t.child;
      case 14:
        return ia(e, t, r = t.type, a = ua(r.type, t.pendingProps), i, n);
      case 15:
        return ra(e, t, t.type, t.pendingProps, i, n);
      case 17:
        return i = t.type,
        r = t.pendingProps,
        r = t.elementType === i ? r : ua(i, r),
        e !== null && (e.alternate = null,
        t.alternate = null,
        t.effectTag |= 2),
        t.tag = 1,
        Ai(i) ? (e = !0,
        Li(t)) : e = !1,
        _r(t),
        Mr(t, i, r),
        Fr(t, i, r, n),
        ca(null, t, i, !0, e, n);
      default:
        o('156');
    }
  }

  function fa(e) {
    e.effectTag |= 4;
  }

  let ma = void 0;
  let va = void 0;
  let ga = void 0;
  let ba = void 0;

  function ya(e, t) {
    const n = t.source;
    let i = t.stack;
    i === null && n !== null && (i = pt(n)),
    n !== null && ut(n.type),
    t = t.value,
    e !== null && e.tag === 1 && ut(e.type);
    try {
      console.error(t);
    } catch (e) {
      setTimeout((() => {
        throw e;
      }
      ));
    }
  }

  function _a(e) {
    const t = e.ref;
    if (t !== null) {
      if (typeof t === 'function') {
        try {
          t(null);
        } catch (t) {
          Ya(e, t);
        }
      } else {
        t.current = null;
      }
    }
  }

  function wa(e) {
    switch (typeof Ui === 'function' && Ui(e),
    e.tag) {
      case 1:
        _a(e);
        var t = e.stateNode;
        if (typeof t.componentWillUnmount === 'function') {
          try {
            t.props = e.memoizedProps,
            t.state = e.memoizedState,
            t.componentWillUnmount();
          } catch (t) {
            Ya(e, t);
          }
        }
        break;
      case 5:
        _a(e);
        break;
      case 4:
        Ta(e);
    }
  }

  function Ca(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }

  function xa(e) {
    e: {
      for (var t = e.return; t !== null;) {
        if (Ca(t)) {
          var n = t;
          break e;
        }
        t = t.return;
      }
      o('160'),
      n = void 0;
    }
    let i = t = void 0;
    switch (n.tag) {
      case 5:
        t = n.stateNode,
        i = !1;
        break;
      case 3:
      case 4:
        t = n.stateNode.containerInfo,
        i = !0;
        break;
      default:
        o('161');
    }
    16 & n.effectTag && (oi(t, ''),
    n.effectTag &= -17);
    e: t: for (n = e; ;) {
      for (; n.sibling === null;) {
        if (n.return === null || Ca(n.return)) {
          n = null;
          break e;
        }
        n = n.return;
      }
      for (n.sibling.return = n.return,
      n = n.sibling; n.tag !== 5 && n.tag !== 6;) {
        if (2 & n.effectTag) continue t;
        if (n.child === null || n.tag === 4) continue t;
        n.child.return = n,
        n = n.child;
      }
      if (!(2 & n.effectTag)) {
        n = n.stateNode;
        break e;
      }
    }
    for (let r = e; ;) {
      if (r.tag === 5 || r.tag === 6) {
        if (n) {
          if (i) {
            var a = t;
            var s = r.stateNode;
            var c = n;
            a.nodeType === 8 ? a.parentNode.insertBefore(s, c) : a.insertBefore(s, c);
          } else {
            t.insertBefore(r.stateNode, n);
          }
        } else {
          i ? (s = t,
          c = r.stateNode,
          s.nodeType === 8 ? (a = s.parentNode).insertBefore(c, s) : (a = s).appendChild(c),
          (s = s._reactRootContainer) != null || a.onclick !== null || (a.onclick = fi)) : t.appendChild(r.stateNode);
        }
      } else if (r.tag !== 4 && r.child !== null) {
        r.child.return = r,
        r = r.child;
        continue;
      }
      if (r === e) break;
      for (; r.sibling === null;) {
        if (r.return === null || r.return === e) return;
        r = r.return;
      }
      r.sibling.return = r.return,
      r = r.sibling;
    }
  }

  function Ta(e) {
    for (let t = e, n = !1, i = void 0, r = void 0; ;) {
      if (!n) {
        n = t.return;
        e: for (; ;) {
          switch (n === null && o('160'),
          n.tag) {
            case 5:
              i = n.stateNode,
              r = !1;
              break e;
            case 3:
            case 4:
              i = n.stateNode.containerInfo,
              r = !0;
              break e;
          }
          n = n.return;
        }
        n = !0;
      }
      if (t.tag === 5 || t.tag === 6) {
        e: for (var a = t, s = a; ;) {
          if (wa(s),
          s.child !== null && s.tag !== 4) {
            s.child.return = s,
            s = s.child;
          } else {
            if (s === a) break;
            for (; s.sibling === null;) {
              if (s.return === null || s.return === a) break e;
              s = s.return;
            }
            s.sibling.return = s.return,
            s = s.sibling;
          }
        }
        r ? (a = i,
        s = t.stateNode,
        a.nodeType === 8 ? a.parentNode.removeChild(s) : a.removeChild(s)) : i.removeChild(t.stateNode);
      } else if (t.tag === 4 ? (i = t.stateNode.containerInfo,
      r = !0) : wa(t),
      t.child !== null) {
        t.child.return = t,
        t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return;
        (t = t.return).tag === 4 && (n = !1);
      }
      t.sibling.return = t.return,
      t = t.sibling;
    }
  }

  function Sa(e, t) {
    switch (t.tag) {
      case 1:
        break;
      case 5:
        var n = t.stateNode;
        if (n != null) {
          const i = t.memoizedProps;
          let r = e !== null ? e.memoizedProps : i;
          e = t.type;
          let a = t.updateQueue;
          if (t.updateQueue = null,
          a !== null) {
            for (n[L] = i,
            e === 'input' && i.type === 'radio' && i.name != null && Tt(n, i),
            di(e, r),
            t = di(e, i),
            r = 0; r < a.length; r += 2) {
              const s = a[r];
              const c = a[r + 1];
              s === 'style' ? li(n, c) : s === 'dangerouslySetInnerHTML' ? ai(n, c) : s === 'children' ? oi(n, c) : _t(n, s, c, t);
            }
            switch (e) {
              case 'input':
                St(n, i);
                break;
              case 'textarea':
                Zn(n, i);
                break;
              case 'select':
                e = n._wrapperState.wasMultiple,
                n._wrapperState.wasMultiple = !!i.multiple,
                (a = i.value) != null ? Gn(n, !!i.multiple, a, !1) : e !== !!i.multiple && (i.defaultValue != null ? Gn(n, !!i.multiple, i.defaultValue, !0) : Gn(n, !!i.multiple, i.multiple ? [] : '', !1));
            }
          }
        }
        break;
      case 6:
        t.stateNode === null && o('162'),
        t.stateNode.nodeValue = t.memoizedProps;
        break;
      case 3:
      case 12:
      case 13:
      case 17:
        break;
      default:
        o('163');
    }
  }

  function Ea(e, t, n) {
    (n = rr(n)).tag = 3,
    n.payload = {
      element: null
    };
    const i = t.value;
    return n.callback = function () {
      Do(i),
      ya(e, t);
    }
    ,
    n;
  }

  function ka(e, t, n) {
    (n = rr(n)).tag = 3;
    const i = e.type.getDerivedStateFromError;
    if (typeof i === 'function') {
      const r = t.value;
      n.payload = function () {
        return i(r);
      };
    }
    const a = e.stateNode;
    return a !== null && typeof a.componentDidCatch === 'function' && (n.callback = function () {
      typeof i !== 'function' && (Ba === null ? Ba = new Set([this]) : Ba.add(this));
      const n = t.value;
      const r = t.stack;
      ya(e, t),
      this.componentDidCatch(n, {
        componentStack: r !== null ? r : ''
      });
    }
    ),
    n;
  }

  function Oa(e) {
    switch (e.tag) {
      case 1:
        Ai(e.type) && ji();
        var t = e.effectTag;
        return 1024 & t ? (e.effectTag = -1025 & t | 64,
        e) : null;
      case 3:
        return Or(),
        Ri(),
        (64 & (t = e.effectTag)) != 0 && o('285'),
        e.effectTag = -1025 & t | 64,
        e;
      case 5:
        return Nr(e),
        null;
      case 13:
        if (1024 & (t = e.effectTag)) {
          e.effectTag = -1025 & t | 64,
          t = (t = e.alternate) !== null ? t.memoizedState : null;
          let n = e.memoizedState;
          return n === null ? n = {
            alreadyCaptured: !0,
            didTimeout: !1,
            timedOutAt: 0
          } : t === n ? n = {
            alreadyCaptured: !0,
            didTimeout: n.didTimeout,
            timedOutAt: n.timedOutAt
          } : n.alreadyCaptured = !0,
          e.memoizedState = n,
          e;
        }
        return null;
      case 4:
        return Or(),
        null;
      case 10:
        return yr(e),
        null;
      default:
        return null;
    }
  }

  ma = function (e, t) {
    for (let n = t.child; n !== null;) {
      if (n.tag === 5 || n.tag === 6) {
        e.appendChild(n.stateNode);
      } else if (n.tag !== 4 && n.child !== null) {
        n.child.return = n,
        n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null;) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      n.sibling.return = n.return,
      n = n.sibling;
    }
  }
  ,
  va = function () {
  }
  ,
  ga = function (e, t, n, i, a) {
    let o = e.memoizedProps;
    if (o !== i) {
      let s = t.stateNode;
      switch (Er(xr.current),
      e = null,
      n) {
        case 'input':
          o = Ct(s, o),
          i = Ct(s, i),
          e = [];
          break;
        case 'option':
          o = qn(s, o),
          i = qn(s, i),
          e = [];
          break;
        case 'select':
          o = r({}, o, {
            value: void 0
          }),
          i = r({}, i, {
            value: void 0
          }),
          e = [];
          break;
        case 'textarea':
          o = Jn(s, o),
          i = Jn(s, i),
          e = [];
          break;
        default:
          typeof o.onClick !== 'function' && typeof i.onClick === 'function' && (s.onclick = fi);
      }
      pi(n, i),
      s = n = void 0;
      let c = null;
      for (n in o) {
        if (!i.hasOwnProperty(n) && o.hasOwnProperty(n) && o[n] != null) {
          if (n === 'style') {
            var l = o[n];
            for (s in l) {
              l.hasOwnProperty(s) && (c || (c = {}),
              c[s] = '');
            }
          } else {
            n !== 'dangerouslySetInnerHTML' && n !== 'children' && n !== 'suppressContentEditableWarning' && n !== 'suppressHydrationWarning' && n !== 'autoFocus' && (_.hasOwnProperty(n) ? e || (e = []) : (e = e || []).push(n, null));
          }
        }
      }
      for (n in i) {
        let u = i[n];
        if (l = o != null ? o[n] : void 0,
        i.hasOwnProperty(n) && u !== l && (u != null || l != null)) {
          if (n === 'style') {
            if (l) {
              for (s in l) {
                !l.hasOwnProperty(s) || u && u.hasOwnProperty(s) || (c || (c = {}),
                c[s] = '');
              }
              for (s in u) {
                u.hasOwnProperty(s) && l[s] !== u[s] && (c || (c = {}),
                c[s] = u[s]);
              }
            } else {
              c || (e || (e = []),
              e.push(n, c)),
              c = u;
            }
          } else {
            n === 'dangerouslySetInnerHTML' ? (u = u ? u.__html : void 0,
            l = l ? l.__html : void 0,
            u != null && l !== u && (e = e || []).push(n, `${u}`)) : n === 'children' ? l === u || typeof u !== 'string' && typeof u !== 'number' || (e = e || []).push(n, `${u}`) : n !== 'suppressContentEditableWarning' && n !== 'suppressHydrationWarning' && (_.hasOwnProperty(n) ? (u != null && hi(a, n),
            e || l === u || (e = [])) : (e = e || []).push(n, u));
          }
        }
      }
      c && (e = e || []).push('style', c),
      a = e,
      (t.updateQueue = a) && fa(t);
    }
  }
  ,
  ba = function (e, t, n, i) {
    n !== i && fa(t);
  };
  const Pa = {
    readContext: wr
  };
  const Na = $e.ReactCurrentOwner;
  let Ia = 0;
  let Aa = 0;
  let ja = !1;
  let Ra = null;
  let Da = null;
  let Ma = 0;
  let La = -1;
  let Fa = !1;
  let Va = null;
  let Ua = !1;
  var Ba = null;

  function za() {
    if (Ra !== null) {
      for (let e = Ra.return; e !== null;) {
        const t = e;
        switch (t.tag) {
          case 1:
            var n = t.type.childContextTypes;
            n != null && ji();
            break;
          case 3:
            Or(),
            Ri();
            break;
          case 5:
            Nr(t);
            break;
          case 4:
            Or();
            break;
          case 10:
            yr(t);
        }
        e = e.return;
      }
    }
    Da = null,
    Ma = 0,
    La = -1,
    Fa = !1,
    Ra = null;
  }

  function Wa(e) {
    for (; ;) {
      let t = e.alternate;
      const n = e.return;
      const i = e.sibling;
      if ((512 & e.effectTag) == 0) {
        let a = t;
        let s = (t = e).pendingProps;
        switch (t.tag) {
          case 2:
          case 16:
            break;
          case 15:
          case 0:
            break;
          case 1:
            Ai(t.type) && ji();
            break;
          case 3:
            Or(),
            Ri(),
            (s = t.stateNode).pendingContext && (s.context = s.pendingContext,
            s.pendingContext = null),
            a !== null && a.child !== null || (Qr(t),
            t.effectTag &= -3),
            va(t);
            break;
          case 5:
            Nr(t);
            var c = Er(Sr.current);
            var l = t.type;
            if (a !== null && t.stateNode != null) {
              ga(a, t, l, s, c),
              a.ref !== t.ref && (t.effectTag |= 128);
            } else if (s) {
              let u = Er(xr.current);
              if (Qr(t)) {
                a = (s = t).stateNode;
                var p = s.type;
                var d = s.memoizedProps;
                var h = c;
                switch (a[M] = s,
                a[L] = d,
                l = void 0,
                c = p) {
                  case 'iframe':
                  case 'object':
                    On('load', a);
                    break;
                  case 'video':
                  case 'audio':
                    for (p = 0; p < re.length; p++) On(re[p], a);
                    break;
                  case 'source':
                    On('error', a);
                    break;
                  case 'img':
                  case 'image':
                  case 'link':
                    On('error', a),
                    On('load', a);
                    break;
                  case 'form':
                    On('reset', a),
                    On('submit', a);
                    break;
                  case 'details':
                    On('toggle', a);
                    break;
                  case 'input':
                    xt(a, d),
                    On('invalid', a),
                    hi(h, 'onChange');
                    break;
                  case 'select':
                    a._wrapperState = {
                      wasMultiple: !!d.multiple
                    },
                    On('invalid', a),
                    hi(h, 'onChange');
                    break;
                  case 'textarea':
                    Qn(a, d),
                    On('invalid', a),
                    hi(h, 'onChange');
                }
                for (l in pi(c, d),
                p = null,
                d) {
                  d.hasOwnProperty(l) && (u = d[l],
                  l === 'children' ? typeof u === 'string' ? a.textContent !== u && (p = ['children', u]) : typeof u === 'number' && a.textContent !== `${u}` && (p = ['children', `${u}`]) : _.hasOwnProperty(l) && u != null && hi(h, l));
                }
                switch (c) {
                  case 'input':
                    Xe(a),
                    Et(a, d, !0);
                    break;
                  case 'textarea':
                    Xe(a),
                    ei(a);
                    break;
                  case 'select':
                  case 'option':
                    break;
                  default:
                    typeof d.onClick === 'function' && (a.onclick = fi);
                }
                l = p,
                s.updateQueue = l,
                (s = l !== null) && fa(t);
              } else {
                d = t,
                a = l,
                h = s,
                p = c.nodeType === 9 ? c : c.ownerDocument,
                u === ti.html && (u = ni(a)),
                u === ti.html ? a === 'script' ? ((a = p.createElement('div')).innerHTML = '<script><\/script>',
                p = a.removeChild(a.firstChild)) : typeof h.is === 'string' ? p = p.createElement(a, {
                  is: h.is
                }) : (p = p.createElement(a),
                a === 'select' && h.multiple && (p.multiple = !0)) : p = p.createElementNS(u, a),
                (a = p)[M] = d,
                a[L] = s,
                ma(a, t, !1, !1),
                h = a;
                const f = c;
                const m = di(p = l, d = s);
                switch (p) {
                  case 'iframe':
                  case 'object':
                    On('load', h),
                    c = d;
                    break;
                  case 'video':
                  case 'audio':
                    for (c = 0; c < re.length; c++) On(re[c], h);
                    c = d;
                    break;
                  case 'source':
                    On('error', h),
                    c = d;
                    break;
                  case 'img':
                  case 'image':
                  case 'link':
                    On('error', h),
                    On('load', h),
                    c = d;
                    break;
                  case 'form':
                    On('reset', h),
                    On('submit', h),
                    c = d;
                    break;
                  case 'details':
                    On('toggle', h),
                    c = d;
                    break;
                  case 'input':
                    xt(h, d),
                    c = Ct(h, d),
                    On('invalid', h),
                    hi(f, 'onChange');
                    break;
                  case 'option':
                    c = qn(h, d);
                    break;
                  case 'select':
                    h._wrapperState = {
                      wasMultiple: !!d.multiple
                    },
                    c = r({}, d, {
                      value: void 0
                    }),
                    On('invalid', h),
                    hi(f, 'onChange');
                    break;
                  case 'textarea':
                    Qn(h, d),
                    c = Jn(h, d),
                    On('invalid', h),
                    hi(f, 'onChange');
                    break;
                  default:
                    c = d;
                }
                pi(p, c),
                u = void 0;
                const v = p;
                const g = h;
                const b = c;
                for (u in b) {
                  if (b.hasOwnProperty(u)) {
                    let y = b[u];
                    u === 'style' ? li(g, y) : u === 'dangerouslySetInnerHTML' ? (y = y ? y.__html : void 0) != null && ai(g, y) : u === 'children' ? typeof y === 'string' ? (v !== 'textarea' || y !== '') && oi(g, y) : typeof y === 'number' && oi(g, `${y}`) : u !== 'suppressContentEditableWarning' && u !== 'suppressHydrationWarning' && u !== 'autoFocus' && (_.hasOwnProperty(u) ? y != null && hi(f, u) : y != null && _t(g, u, y, m));
                  }
                }
                switch (p) {
                  case 'input':
                    Xe(h),
                    Et(h, d, !1);
                    break;
                  case 'textarea':
                    Xe(h),
                    ei(h);
                    break;
                  case 'option':
                    d.value != null && h.setAttribute('value', `${wt(d.value)}`);
                    break;
                  case 'select':
                    (c = h).multiple = !!d.multiple,
                    (h = d.value) != null ? Gn(c, !!d.multiple, h, !1) : d.defaultValue != null && Gn(c, !!d.multiple, d.defaultValue, !0);
                    break;
                  default:
                    typeof c.onClick === 'function' && (h.onclick = fi);
                }
                (s = gi(l, s)) && fa(t),
                t.stateNode = a;
              }
              t.ref !== null && (t.effectTag |= 128);
            } else {
              t.stateNode === null && o('166');
            }
            break;
          case 6:
            a && t.stateNode != null ? ba(a, t, a.memoizedProps, s) : (typeof s !== 'string' && (t.stateNode === null && o('166')),
            a = Er(Sr.current),
            Er(xr.current),
            Qr(t) ? (l = (s = t).stateNode,
            a = s.memoizedProps,
            l[M] = s,
            (s = l.nodeValue !== a) && fa(t)) : (l = t,
            (s = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(s))[M] = t,
            l.stateNode = s));
            break;
          case 11:
            break;
          case 13:
            s = t.memoizedState,
            l = a !== null ? a.memoizedState : null,
            (s !== null && s.didTimeout) !== (l !== null && l.didTimeout) && (t.effectTag |= 4);
            break;
          case 7:
          case 8:
          case 12:
            break;
          case 4:
            Or(),
            va(t);
            break;
          case 10:
            yr(t);
            break;
          case 9:
          case 14:
            break;
          case 17:
            Ai(t.type) && ji();
            break;
          default:
            o('156');
        }
        if (Ra = null,
        t = e,
        Ma === 1073741823 || t.childExpirationTime !== 1073741823) {
          for (s = 0,
          l = t.child; l !== null;) {
            a = l.expirationTime,
            c = l.childExpirationTime,
            (s === 0 || a !== 0 && a < s) && (s = a),
            (s === 0 || c !== 0 && c < s) && (s = c),
            l = l.sibling;
          }
          t.childExpirationTime = s;
        }
        n !== null && (512 & n.effectTag) == 0 && (n.firstEffect === null && (n.firstEffect = e.firstEffect),
        e.lastEffect !== null && (n.lastEffect !== null && (n.lastEffect.nextEffect = e.firstEffect),
        n.lastEffect = e.lastEffect),
        e.effectTag > 1 && (n.lastEffect !== null ? n.lastEffect.nextEffect = e : n.firstEffect = e,
        n.lastEffect = e));
      } else {
        if ((e = Oa(e)) !== null) {
          return e.effectTag &= 511,
          e;
        }
        n !== null && (n.firstEffect = n.lastEffect = null,
        n.effectTag |= 512);
      }
      if (i !== null) return i;
      if (n === null) break;
      e = n;
    }
    return null;
  }

  function Ha(e) {
    let t = ha(e.alternate, e, Ma);
    return e.memoizedProps = e.pendingProps,
    t === null && (t = Wa(e)),
    Na.current = null,
    t;
  }

  function Xa(e, t, n) {
    ja && o('243'),
    ja = !0,
    Na.currentDispatcher = Pa;
    let i = e.nextExpirationTimeToWorkOn;
    i === Ma && e === Da && Ra !== null || (za(),
    Ma = i,
    Ra = Xi((Da = e).current, null),
    e.pendingCommitExpirationTime = 0);
    for (var r = !1; ;) {
      try {
        if (t) {
          for (; Ra !== null && !Ro();) Ra = Ha(Ra);
        } else {
          for (; Ra !== null;) Ra = Ha(Ra);
        }
      } catch (t) {
        if (Ra === null) {
          r = !0,
          Do(t);
        } else {
          Ra === null && o('271');
          var a = Ra;
          var s = a.return;
          if (s !== null) {
            e: {
              let c = e;
              let l = s;
              let u = a;
              let p = t;
              if (s = Ma,
              u.effectTag |= 512,
              u.firstEffect = u.lastEffect = null,
              p !== null && typeof p === 'object' && typeof p.then === 'function') {
                var d = p;
                p = l;
                let h = -1;
                let f = -1;
                do {
                  if (p.tag === 13) {
                    var m = p.alternate;
                    if (m !== null && ((m = m.memoizedState) !== null && m.didTimeout)) {
                      f = 10 * (m.timedOutAt - 2);
                      break;
                    }
                    typeof (m = p.pendingProps.maxDuration) === 'number' && (m <= 0 ? h = 0 : (h === -1 || m < h) && (h = m));
                  }
                  p = p.return;
                } while (p !== null);
                p = l;
                do {
                  if ((m = p.tag === 13) && (void 0 === p.memoizedProps.fallback ? m = !1 : m = (m = p.memoizedState) === null || !m.didTimeout),
                  m) {
                    if (l = Ka.bind(null, c, p, u, (1 & p.mode) == 0 ? 1 : s),
                    d.then(l, l),
                    (1 & p.mode) == 0) {
                      p.effectTag |= 32,
                      ta(u.alternate, u, null, s),
                      u.effectTag &= -513,
                      u.tag === 1 && (u.effectTag &= -421,
                      u.alternate === null && (u.tag = 17));
                      break e;
                    }
                    h === -1 ? c = 1073741823 : (f === -1 && (f = 10 * (Zi(c, s) - 2) - 5e3),
                    c = f + h),
                    c >= 0 && La < c && (La = c),
                    p.effectTag |= 1024,
                    p.expirationTime = s;
                    break e;
                  }
                  p = p.return;
                } while (p !== null);
                p = Error('An update was suspended, but no placeholder UI was provided.');
              }
              Fa = !0,
              p = hr(p, u),
              c = l;
              do {
                switch (c.tag) {
                  case 3:
                    u = p,
                    c.effectTag |= 1024,
                    c.expirationTime = s,
                    sr(c, s = Ea(c, u, s));
                    break e;
                  case 1:
                    if (u = p,
                    l = c.type,
                    d = c.stateNode,
                    (64 & c.effectTag) == 0 && (typeof l.getDerivedStateFromError === 'function' || d !== null && typeof d.componentDidCatch === 'function' && (Ba === null || !Ba.has(d)))) {
                      c.effectTag |= 1024,
                      c.expirationTime = s,
                      sr(c, s = ka(c, u, s));
                      break e;
                    }
                }
                c = c.return;
              } while (c !== null);
            }
            Ra = Wa(a);
            continue;
          }
          r = !0,
          Do(t);
        }
      }
      break;
    }
    if (ja = !1,
    gr = vr = mr = Na.currentDispatcher = null,
    r) {
      Da = null,
      e.finishedWork = null;
    } else if (Ra !== null) {
      e.finishedWork = null;
    } else {
      if ((t = e.current.alternate) === null && o('281'),
      Da = null,
      Fa) {
        if (r = e.latestPendingTime,
        a = e.latestSuspendedTime,
        s = e.latestPingedTime,
        r !== 0 && r > i || a !== 0 && a > i || s !== 0 && s > i) {
          return Qi(e, i),
          void To(e, t, i, e.expirationTime, -1);
        }
        if (!e.didError && !n) {
          return e.didError = !0,
          i = e.nextExpirationTimeToWorkOn = i,
          n = e.expirationTime = 1,
          void To(e, t, i, n, -1);
        }
      }
      n || La === -1 ? (e.pendingCommitExpirationTime = i,
      e.finishedWork = t) : (Qi(e, i),
      (n = 10 * (Zi(e, i) - 2)) < La && (La = n),
      n = 10 * (Eo() - 2),
      n = La - n,
      To(e, t, i, e.expirationTime, n < 0 ? 0 : n));
    }
  }

  function Ya(e, t) {
    let n;
    e: {
      for (ja && !Ua && o('263'),
      n = e.return; n !== null;) {
        switch (n.tag) {
          case 1:
            var i = n.stateNode;
            if (typeof n.type.getDerivedStateFromError === 'function' || typeof i.componentDidCatch === 'function' && (Ba === null || !Ba.has(i))) {
              or(n, e = ka(n, e = hr(t, e), 1)),
              Ga(n, 1),
              n = void 0;
              break e;
            }
            break;
          case 3:
            or(n, e = Ea(n, e = hr(t, e), 1)),
            Ga(n, 1),
            n = void 0;
            break e;
        }
        n = n.return;
      }
      e.tag === 3 && (or(e, n = Ea(e, n = hr(t, e), 1)),
      Ga(e, 1)),
      n = void 0;
    }
    return n;
  }

  function $a(e, t) {
    return Aa !== 0 ? e = Aa : ja ? e = Ua ? 1 : Ma : 1 & t.mode ? (e = ho ? 2 + 10 * (1 + ((e - 2 + 15) / 10 | 0)) : 2 + 25 * (1 + ((e - 2 + 500) / 25 | 0)),
    Da !== null && e === Ma && (e += 1)) : e = 1,
    ho && e > ao && (ao = e),
    e;
  }

  function Ka(e, t, n, i) {
    let r = e.earliestSuspendedTime;
    let a = e.latestSuspendedTime;
    if (r !== 0 && i >= r && i <= a) {
      a = r = i,
      e.didError = !1;
      const o = e.latestPingedTime;
      (o === 0 || o < a) && (e.latestPingedTime = a),
      er(a, e);
    } else {
      Ji(e, r = $a(r = Eo(), t));
    }
    (1 & t.mode) != 0 && e === Da && Ma === i && (Da = null),
    qa(t, r),
    (1 & t.mode) == 0 && (qa(n, r),
    n.tag === 1 && n.stateNode !== null && ((t = rr(r)).tag = 2,
    or(n, t))),
    (n = e.expirationTime) !== 0 && ko(e, n);
  }

  function qa(e, t) {
    (e.expirationTime === 0 || e.expirationTime > t) && (e.expirationTime = t);
    let n = e.alternate;
    n !== null && (n.expirationTime === 0 || n.expirationTime > t) && (n.expirationTime = t);
    let i = e.return;
    let r = null;
    if (i === null && e.tag === 3) {
      r = e.stateNode;
    } else {
      for (; i !== null;) {
        if (n = i.alternate,
        (i.childExpirationTime === 0 || i.childExpirationTime > t) && (i.childExpirationTime = t),
        n !== null && (n.childExpirationTime === 0 || n.childExpirationTime > t) && (n.childExpirationTime = t),
        i.return === null && i.tag === 3) {
          r = i.stateNode;
          break;
        }
        i = i.return;
      }
    }
    return r === null ? null : r;
  }

  function Ga(e, t) {
    (e = qa(e, t)) !== null && (!ja && Ma !== 0 && t < Ma && za(),
    Ji(e, t),
    ja && !Ua && Da === e || ko(e, e.expirationTime),
    yo > bo && (yo = 0,
    o('185')));
  }

  function Ja(e, t, n, i, r) {
    const a = Aa;
    Aa = 1;
    try {
      return e(t, n, i, r);
    } finally {
      Aa = a;
    }
  }

  let Qa = null;
  let Za = null;
  let eo = 0;
  let to = void 0;
  let no = !1;
  let io = null;
  let ro = 0;
  var ao = 0;
  let oo = !1;
  let so = !1;
  let co = null;
  let lo = null;
  let uo = !1;
  let po = !1;
  var ho = !1;
  let fo = null;
  const mo = a.unstable_now();
  let vo = 2 + (mo / 10 | 0);
  let go = vo;
  var bo = 50;
  var yo = 0;
  let _o = null;
  const wo = 1;

  function Co() {
    vo = 2 + ((a.unstable_now() - mo) / 10 | 0);
  }

  function xo(e, t) {
    if (eo !== 0) {
      if (t > eo) return;
      to !== null && a.unstable_cancelCallback(to);
    }
    eo = t,
    e = a.unstable_now() - mo,
    to = a.unstable_scheduleCallback(Po, {
      timeout: 10 * (t - 2) - e
    });
  }

  function To(e, t, n, i, r) {
    e.expirationTime = i,
    r !== 0 || Ro() ? r > 0 && (e.timeoutHandle = yi(So.bind(null, e, t, n), r)) : (e.pendingCommitExpirationTime = n,
    e.finishedWork = t);
  }

  function So(e, t, n) {
    e.pendingCommitExpirationTime = n,
    e.finishedWork = t,
    Co(),
    go = vo,
    Io(e, n);
  }

  function Eo() {
    return no ? go : (Oo(),
    ro !== 0 && ro !== 1073741823 || (Co(),
    go = vo),
    go);
  }

  function ko(e, t) {
    if (e.nextScheduledRoot === null) {
      e.expirationTime = t,
      Za === null ? (Qa = Za = e,
      e.nextScheduledRoot = e) : (Za = Za.nextScheduledRoot = e).nextScheduledRoot = Qa;
    } else {
      const n = e.expirationTime;
      (n === 0 || t < n) && (e.expirationTime = t);
    }
    no || (uo ? po && (io = e,
    ro = 1,
    Ao(e, 1, !0)) : t === 1 ? No(1, null) : xo(e, t));
  }

  function Oo() {
    let e = 0;
    let t = null;
    if (Za !== null) {
      for (let n = Za, i = Qa; i !== null;) {
        let r = i.expirationTime;
        if (r === 0) {
          if ((n === null || Za === null) && o('244'),
          i === i.nextScheduledRoot) {
            Qa = Za = i.nextScheduledRoot = null;
            break;
          }
          if (i === Qa) {
            Qa = r = i.nextScheduledRoot,
            Za.nextScheduledRoot = r,
            i.nextScheduledRoot = null;
          } else {
            if (i === Za) {
              (Za = n).nextScheduledRoot = Qa,
              i.nextScheduledRoot = null;
              break;
            }
            n.nextScheduledRoot = i.nextScheduledRoot,
            i.nextScheduledRoot = null;
          }
          i = n.nextScheduledRoot;
        } else {
          if ((e === 0 || r < e) && (e = r,
          t = i),
          i === Za) {
            break;
          }
          if (e === 1) break;
          n = i,
          i = i.nextScheduledRoot;
        }
      }
    }
    io = t,
    ro = e;
  }

  function Po(e) {
    if (e.didTimeout && Qa !== null) {
      Co();
      let t = Qa;
      do {
        const n = t.expirationTime;
        n !== 0 && vo >= n && (t.nextExpirationTimeToWorkOn = vo),
        t = t.nextScheduledRoot;
      } while (t !== Qa);
    }
    No(0, e);
  }

  function No(e, t) {
    if (lo = t,
    Oo(),
    lo !== null) {
      for (Co(),
      go = vo; io !== null && ro !== 0 && (e === 0 || e >= ro) && (!oo || vo >= ro);) {
        Ao(io, ro, vo >= ro),
        Oo(),
        Co(),
        go = vo;
      }
    } else {
      for (; io !== null && ro !== 0 && (e === 0 || e >= ro);) {
        Ao(io, ro, !0),
        Oo();
      }
    }
    if (lo !== null && (eo = 0,
    to = null),
    ro !== 0 && xo(io, ro),
    lo = null,
    oo = !1,
    yo = 0,
    _o = null,
    fo !== null) {
      for (e = fo,
      fo = null,
      t = 0; t < e.length; t++) {
        const n = e[t];
        try {
          n._onComplete();
        } catch (e) {
          so || (so = !0,
          co = e);
        }
      }
    }
    if (so) {
      throw e = co,
      co = null,
      so = !1,
      e;
    }
  }

  function Io(e, t) {
    no && o('253'),
    io = e,
    ro = t,
    Ao(e, t, !0),
    No(1, null);
  }

  function Ao(e, t, n) {
    if (no && o('245'),
    no = !0,
    lo === null || n) {
      var i = e.finishedWork;
      i !== null ? jo(e, i, t) : (e.finishedWork = null,
      (i = e.timeoutHandle) !== -1 && (e.timeoutHandle = -1,
      _i(i)),
      Xa(e, !1, n),
      (i = e.finishedWork) !== null && jo(e, i, t));
    } else {
      (i = e.finishedWork) !== null ? jo(e, i, t) : (e.finishedWork = null,
      (i = e.timeoutHandle) !== -1 && (e.timeoutHandle = -1,
      _i(i)),
      Xa(e, !0, n),
      (i = e.finishedWork) !== null && (Ro() ? e.finishedWork = i : jo(e, i, t)));
    }
    no = !1;
  }

  function jo(e, t, n) {
    const i = e.firstBatch;
    if (i !== null && i._expirationTime <= n && (fo === null ? fo = [i] : fo.push(i),
    i._defer)) {
      return e.finishedWork = t,
      void (e.expirationTime = 0);
    }
    e.finishedWork = null,
    e === _o ? yo++ : (_o = e,
    yo = 0),
    Ua = ja = !0,
    e.current === t && o('177');
    const r = e.pendingCommitExpirationTime;
    r === 0 && o('261'),
    e.pendingCommitExpirationTime = 0;
    const a = t.expirationTime;
    const s = t.childExpirationTime;
    const c = a === 0 || s !== 0 && s < a ? s : a;
    if (e.didError = !1,
    c === 0) {
      e.earliestPendingTime = 0,
      e.latestPendingTime = 0,
      e.earliestSuspendedTime = 0,
      e.latestSuspendedTime = 0,
      e.latestPingedTime = 0;
    } else {
      const l = e.latestPendingTime;
      l !== 0 && (l < c ? e.earliestPendingTime = e.latestPendingTime = 0 : e.earliestPendingTime < c && (e.earliestPendingTime = e.latestPendingTime));
      const u = e.earliestSuspendedTime;
      u === 0 ? Ji(e, c) : c > e.latestSuspendedTime ? (e.earliestSuspendedTime = 0,
      e.latestSuspendedTime = 0,
      e.latestPingedTime = 0,
      Ji(e, c)) : c < u && Ji(e, c);
    }
    if (er(0, e),
    Na.current = null,
    t.effectTag > 1) {
      if (t.lastEffect !== null) {
        t.lastEffect.nextEffect = t;
        var p = t.firstEffect;
      } else {
        p = t;
      }
    } else {
      p = t.firstEffect;
    }
    mi = kn;
    const d = Vn();
    if (Un(d)) {
      if ('selectionStart' in d) {
        var h = {
          start: d.selectionStart,
          end: d.selectionEnd
        };
      } else {
        e: {
          const f = d.ownerDocument;
          const m = f && f.defaultView || window;
          const v = m.getSelection && m.getSelection();
          if (v && v.rangeCount !== 0) {
            const g = v.anchorNode;
            const b = v.anchorOffset;
            const y = v.focusNode;
            const _ = v.focusOffset;
            try {
              g.nodeType,
              y.nodeType;
            } catch (e) {
              h = null;
              break e;
            }
            let w = 0;
            let C = -1;
            let x = -1;
            let T = 0;
            let S = 0;
            let E = d;
            let k = null;
            t: for (; ;) {
              for (var O; E !== g || b !== 0 && E.nodeType !== 3 || (C = w + b),
              E !== y || _ !== 0 && E.nodeType !== 3 || (x = w + _),
              E.nodeType === 3 && (w += E.nodeValue.length),
              (O = E.firstChild) !== null;) {
                k = E,
                E = O;
              }
              for (; ;) {
                if (E === d) break t;
                if (k === g && ++T === b && (C = w),
                k === y && ++S === _ && (x = w),
                (O = E.nextSibling) !== null) {
                  break;
                }
                k = (E = k).parentNode;
              }
              E = O;
            }
            h = C === -1 || x === -1 ? null : {
              start: C,
              end: x
            };
          } else {
            h = null;
          }
        }
      }
      var P = h || {
        start: 0,
        end: 0
      };
    } else {
      P = null;
    }
    for (vi = {
      focusedElem: d,
      selectionRange: P
    },
    kn = !1,
    Va = p; Va !== null;) {
      let N = !1;
      let I = void 0;
      try {
        for (; Va !== null;) {
          if (256 & Va.effectTag) {
            const A = Va.alternate;
            e: {
              const j = Va;
              switch (j.tag) {
                case 1:
                  if (256 & j.effectTag && A !== null) {
                    const R = A.memoizedProps;
                    const D = A.memoizedState;
                    const M = j.stateNode;
                    M.props = j.memoizedProps,
                    M.state = j.memoizedState;
                    const L = M.getSnapshotBeforeUpdate(R, D);
                    M.__reactInternalSnapshotBeforeUpdate = L;
                  }
                  break e;
                case 3:
                case 5:
                case 6:
                case 4:
                case 17:
                  break e;
                default:
                  o('163');
              }
            }
          }
          Va = Va.nextEffect;
        }
      } catch (e) {
        N = !0,
        I = e;
      }
      N && (Va === null && o('178'),
      Ya(Va, I),
      Va !== null && (Va = Va.nextEffect));
    }
    for (Va = p; Va !== null;) {
      let F = !1;
      let V = void 0;
      try {
        for (; Va !== null;) {
          const U = Va.effectTag;
          if (16 & U && oi(Va.stateNode, ''),
          128 & U) {
            const B = Va.alternate;
            if (B !== null) {
              const z = B.ref;
              z !== null && (typeof z === 'function' ? z(null) : z.current = null);
            }
          }
          switch (14 & U) {
            case 2:
              xa(Va),
              Va.effectTag &= -3;
              break;
            case 6:
              xa(Va),
              Va.effectTag &= -3,
              Sa(Va.alternate, Va);
              break;
            case 4:
              Sa(Va.alternate, Va);
              break;
            case 8:
              var W = Va;
              Ta(W);
              var H = W;
              H.return = null,
              H.child = null,
              H.alternate && (H.alternate.child = null,
              H.alternate.return = null);
          }
          Va = Va.nextEffect;
        }
      } catch (e) {
        F = !0,
        V = e;
      }
      F && (Va === null && o('178'),
      Ya(Va, V),
      Va !== null && (Va = Va.nextEffect));
    }
    const X = vi;
    const Y = Vn();
    const $ = X.focusedElem;
    const K = X.selectionRange;
    if (Y !== $ && $ && $.ownerDocument && (function e(t, n) {
      return !(!t || !n) && (t === n || (!t || t.nodeType !== 3) && (n && n.nodeType === 3 ? e(t, n.parentNode) : 'contains' in t ? t.contains(n) : !!t.compareDocumentPosition && !!(16 & t.compareDocumentPosition(n))));
    }($.ownerDocument.documentElement, $))) {
      if (K !== null && Un($)) {
        const q = K.start;
        let G = K.end;
        if (void 0 === G && (G = q),
        'selectionStart' in $) {
          $.selectionStart = q,
          $.selectionEnd = Math.min(G, $.value.length);
        } else {
          const J = $.ownerDocument || document;
          const Q = (J && J.defaultView || window).getSelection();
          const Z = $.textContent.length;
          let ee = Math.min(K.start, Z);
          let te = void 0 === K.end ? ee : Math.min(K.end, Z);
          if (!Q.extend && ee > te) {
            const ne = te;
            te = ee,
            ee = ne;
          }
          const ie = Fn($, ee);
          const re = Fn($, te);
          if (ie && re && (Q.rangeCount !== 1 || Q.anchorNode !== ie.node || Q.anchorOffset !== ie.offset || Q.focusNode !== re.node || Q.focusOffset !== re.offset)) {
            const ae = J.createRange();
            ae.setStart(ie.node, ie.offset),
            Q.removeAllRanges(),
            ee > te ? (Q.addRange(ae),
            Q.extend(re.node, re.offset)) : (ae.setEnd(re.node, re.offset),
            Q.addRange(ae));
          }
        }
      }
      for (var oe = [], se = $; se = se.parentNode;) {
        se.nodeType === 1 && oe.push({
          element: se,
          left: se.scrollLeft,
          top: se.scrollTop
        });
      }
      typeof $.focus === 'function' && $.focus();
      for (let ce = 0; ce < oe.length; ce++) {
        const le = oe[ce];
        le.element.scrollLeft = le.left,
        le.element.scrollTop = le.top;
      }
    }
    for (vi = null,
    kn = !!mi,
    mi = null,
    e.current = t,
    Va = p; Va !== null;) {
      let ue = !1;
      let pe = void 0;
      try {
        for (; Va !== null;) {
          const de = Va.effectTag;
          if (36 & de) {
            let he = void 0;
            const fe = Va.alternate;
            const me = Va;
            switch (me.tag) {
              case 1:
                var ve = me.stateNode;
                if (4 & me.effectTag) {
                  if (fe === null) {
                    ve.props = me.memoizedProps,
                    ve.state = me.memoizedState,
                    ve.componentDidMount();
                  } else {
                    const ge = fe.memoizedProps;
                    const be = fe.memoizedState;
                    ve.props = me.memoizedProps,
                    ve.state = me.memoizedState,
                    ve.componentDidUpdate(ge, be, ve.__reactInternalSnapshotBeforeUpdate);
                  }
                }
                var ye = me.updateQueue;
                ye !== null && (ve.props = me.memoizedProps,
                ve.state = me.memoizedState,
                pr(0, ye, ve));
                break;
              case 3:
                var _e = me.updateQueue;
                if (_e !== null) {
                  let we = null;
                  if (me.child !== null) {
                    switch (me.child.tag) {
                      case 5:
                        we = me.child.stateNode;
                        break;
                      case 1:
                        we = me.child.stateNode;
                    }
                  }
                  pr(0, _e, we);
                }
                break;
              case 5:
                var Ce = me.stateNode;
                fe === null && 4 & me.effectTag && gi(me.type, me.memoizedProps) && Ce.focus();
                break;
              case 6:
              case 4:
              case 12:
                break;
              case 13:
                if (32 & me.effectTag) {
                  me.memoizedState = {
                    alreadyCaptured: !0,
                    didTimeout: !1,
                    timedOutAt: 0
                  },
                  Ga(me, 1);
                  break;
                }
                var xe = fe !== null ? fe.memoizedState : null;
                var Te = me.memoizedState;
                var Se = xe !== null && xe.didTimeout;
                var Ee = me;
                if (Te === null ? he = !1 : (he = Te.didTimeout) && (Ee = me.child,
                Te.alreadyCaptured = !1,
                Te.timedOutAt === 0 && (Te.timedOutAt = Eo())),
                he !== Se && Ee !== null) {
                  e: for (let ke = Ee, Oe = he, Pe = ke; ;) {
                    if (Pe.tag === 5) {
                      const Ne = Pe.stateNode;
                      if (Oe) {
                        Ne.style.display = 'none';
                      } else {
                        const Ie = Pe.stateNode;
                        const Ae = Pe.memoizedProps.style;
                        const je = Ae != null && Ae.hasOwnProperty('display') ? Ae.display : null;
                        Ie.style.display = je;
                      }
                    } else if (Pe.tag === 6) {
                      Pe.stateNode.nodeValue = Oe ? '' : Pe.memoizedProps;
                    } else if (Pe.child !== null) {
                      Pe.child.return = Pe,
                      Pe = Pe.child;
                      continue;
                    }
                    if (Pe === ke) break;
                    for (; Pe.sibling === null;) {
                      if (Pe.return === null || Pe.return === ke) break e;
                      Pe = Pe.return;
                    }
                    Pe.sibling.return = Pe.return,
                    Pe = Pe.sibling;
                  }
                }
                break;
              case 17:
                break;
              default:
                o('163');
            }
          }
          if (128 & de) {
            const Re = Va.ref;
            if (Re !== null) {
              const De = Va.stateNode;
              switch (Va.tag) {
                case 5:
                  var Me = De;
                  break;
                default:
                  Me = De;
              }
              typeof Re === 'function' ? Re(Me) : Re.current = Me;
            }
          }
          const Le = Va.nextEffect;
          Va.nextEffect = null,
          Va = Le;
        }
      } catch (e) {
        ue = !0,
        pe = e;
      }
      ue && (Va === null && o('178'),
      Ya(Va, pe),
      Va !== null && (Va = Va.nextEffect));
    }
    ja = Ua = !1,
    typeof Vi === 'function' && Vi(t.stateNode);
    const Fe = t.expirationTime;
    const Ve = t.childExpirationTime;
    const Ue = Fe === 0 || Ve !== 0 && Ve < Fe ? Ve : Fe;
    Ue === 0 && (Ba = null),
    e.expirationTime = Ue,
    e.finishedWork = null;
  }

  function Ro() {
    return !!oo || !(lo === null || lo.timeRemaining() > wo) && (oo = !0);
  }

  function Do(e) {
    io === null && o('246'),
    io.expirationTime = 0,
    so || (so = !0,
    co = e);
  }

  function Mo(e, t) {
    const n = uo;
    uo = !0;
    try {
      return e(t);
    } finally {
      (uo = n) || no || No(1, null);
    }
  }

  function Lo(e, t) {
    if (uo && !po) {
      po = !0;
      try {
        return e(t);
      } finally {
        po = !1;
      }
    }
    return e(t);
  }

  function Fo(e, t, n) {
    if (ho) return e(t, n);
    uo || no || ao === 0 || (No(ao, null),
    ao = 0);
    const i = ho;
    const r = uo;
    uo = ho = !0;
    try {
      return e(t, n);
    } finally {
      ho = i,
      (uo = r) || no || No(1, null);
    }
  }

  function Vo(e, t, n, i, r) {
    const a = t.current;
    e: if (n) {
      t: {
        an(n = n._reactInternalFiber) === 2 && n.tag === 1 || o('170');
        var s = n;
        do {
          switch (s.tag) {
            case 3:
              s = s.stateNode.context;
              break t;
            case 1:
              if (Ai(s.type)) {
                s = s.stateNode.__reactInternalMemoizedMergedChildContext;
                break t;
              }
          }
          s = s.return;
        } while (s !== null);
        o('171'),
        s = void 0;
      }
      if (n.tag === 1) {
        const c = n.type;
        if (Ai(c)) {
          n = Mi(n, c, s);
          break e;
        }
      }
      n = s;
    } else {
      n = ki;
    }
    return t.context === null ? t.context = n : t.pendingContext = n,
    t = r,
    (r = rr(i)).payload = {
      element: e
    },
    (t = void 0 === t ? null : t) !== null && (r.callback = t),
    or(a, r),
    Ga(a, i),
    i;
  }

  function Uo(e, t, n, i) {
    let r = t.current;
    return Vo(e, t, n, r = $a(Eo(), r), i);
  }

  function Bo(e) {
    if (!(e = e.current).child) return null;
    switch (e.child.tag) {
      case 5:
      default:
        return e.child.stateNode;
    }
  }

  function zo(e) {
    let t = 2 + 25 * (1 + ((Eo() - 2 + 500) / 25 | 0));
    t <= Ia && (t = Ia + 1),
    this._expirationTime = Ia = t,
    this._root = e,
    this._callbacks = this._next = null,
    this._hasChildren = this._didComplete = !1,
    this._children = null,
    this._defer = !0;
  }

  function Wo() {
    this._callbacks = null,
    this._didCommit = !1,
    this._onCommit = this._onCommit.bind(this);
  }

  function Ho(e, t, n) {
    e = {
      current: t = Wi(3, null, null, t ? 3 : 0),
      containerInfo: e,
      pendingChildren: null,
      earliestPendingTime: 0,
      latestPendingTime: 0,
      earliestSuspendedTime: 0,
      latestSuspendedTime: 0,
      latestPingedTime: 0,
      didError: !1,
      pendingCommitExpirationTime: 0,
      finishedWork: null,
      timeoutHandle: -1,
      context: null,
      pendingContext: null,
      hydrate: n,
      nextExpirationTimeToWorkOn: 0,
      expirationTime: 0,
      firstBatch: null,
      nextScheduledRoot: null
    },
    this._internalRoot = t.stateNode = e;
  }

  function Xo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '));
  }

  function Yo(e, t, n, i, r) {
    Xo(n) || o('200');
    let a = n._reactRootContainer;
    if (a) {
      if (typeof r === 'function') {
        const s = r;
        r = function () {
          const e = Bo(a._internalRoot);
          s.call(e);
        };
      }
      e != null ? a.legacy_renderSubtreeIntoContainer(e, t, r) : a.render(t, r);
    } else {
      if (a = n._reactRootContainer = (function (e, t) {
        if (t || (t = !(!(t = e ? e.nodeType === 9 ? e.documentElement : e.firstChild : null) || t.nodeType !== 1 || !t.hasAttribute('data-reactroot'))),
        !t) {
          for (var n; n = e.lastChild;) e.removeChild(n);
        }
        return new Ho(e, !1, t);
      }(n, i)),
      typeof r === 'function') {
        const c = r;
        r = function () {
          const e = Bo(a._internalRoot);
          c.call(e);
        };
      }
      Lo((() => {
        e != null ? a.legacy_renderSubtreeIntoContainer(e, t, r) : a.render(t, r);
      }
      ));
    }
    return Bo(a._internalRoot);
  }

  function $o(e, t) {
    const n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
    return Xo(t) || o('200'),
    (function (e, t, n) {
      const i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: Je,
        key: i == null ? null : `${i}`,
        children: e,
        containerInfo: t,
        implementation: n
      };
    }(e, t, null, n));
  }

  Pe = function (e, t, n) {
    switch (t) {
      case 'input':
        if (St(e, n),
        t = n.name,
        n.type === 'radio' && t != null) {
          for (n = e; n.parentNode;) n = n.parentNode;
          for (n = n.querySelectorAll(`input[name=${JSON.stringify(`${t}`)}][type="radio"]`),
          t = 0; t < n.length; t++) {
            const i = n[t];
            if (i !== e && i.form === e.form) {
              const r = B(i);
              r || o('90'),
              Ye(i),
              St(i, r);
            }
          }
        }
        break;
      case 'textarea':
        Zn(e, n);
        break;
      case 'select':
        (t = n.value) != null && Gn(e, !!n.multiple, t, !1);
    }
  }
  ,
  zo.prototype.render = function (e) {
    this._defer || o('250'),
    this._hasChildren = !0,
    this._children = e;
    const t = this._root._internalRoot;
    const n = this._expirationTime;
    const i = new Wo();
    return Vo(e, t, null, n, i._onCommit),
    i;
  }
  ,
  zo.prototype.then = function (e) {
    if (this._didComplete) {
      e();
    } else {
      let t = this._callbacks;
      t === null && (t = this._callbacks = []),
      t.push(e);
    }
  }
  ,
  zo.prototype.commit = function () {
    const e = this._root._internalRoot;
    let t = e.firstBatch;
    if (this._defer && t !== null || o('251'),
    this._hasChildren) {
      let n = this._expirationTime;
      if (t !== this) {
        this._hasChildren && (n = this._expirationTime = t._expirationTime,
        this.render(this._children));
        for (var i = null, r = t; r !== this;) {
          i = r,
          r = r._next;
        }
        i === null && o('251'),
        i._next = r._next,
        this._next = t,
        e.firstBatch = this;
      }
      this._defer = !1,
      Io(e, n),
      t = this._next,
      this._next = null,
      (t = e.firstBatch = t) !== null && t._hasChildren && t.render(t._children);
    } else {
      this._next = null,
      this._defer = !1;
    }
  }
  ,
  zo.prototype._onComplete = function () {
    if (!this._didComplete) {
      this._didComplete = !0;
      const e = this._callbacks;
      if (e !== null) {
        for (let t = 0; t < e.length; t++) {
          (0,
          e[t])();
        }
      }
    }
  }
  ,
  Wo.prototype.then = function (e) {
    if (this._didCommit) {
      e();
    } else {
      let t = this._callbacks;
      t === null && (t = this._callbacks = []),
      t.push(e);
    }
  }
  ,
  Wo.prototype._onCommit = function () {
    if (!this._didCommit) {
      this._didCommit = !0;
      const e = this._callbacks;
      if (e !== null) {
        for (let t = 0; t < e.length; t++) {
          const n = e[t];
          typeof n !== 'function' && o('191', n),
          n();
        }
      }
    }
  }
  ,
  Ho.prototype.render = function (e, t) {
    const n = this._internalRoot;
    const i = new Wo();
    return (t = void 0 === t ? null : t) !== null && i.then(t),
    Uo(e, n, null, i._onCommit),
    i;
  }
  ,
  Ho.prototype.unmount = function (e) {
    const t = this._internalRoot;
    const n = new Wo();
    return (e = void 0 === e ? null : e) !== null && n.then(e),
    Uo(null, t, null, n._onCommit),
    n;
  }
  ,
  Ho.prototype.legacy_renderSubtreeIntoContainer = function (e, t, n) {
    const i = this._internalRoot;
    const r = new Wo();
    return (n = void 0 === n ? null : n) !== null && r.then(n),
    Uo(t, i, e, r._onCommit),
    r;
  }
  ,
  Ho.prototype.createBatch = function () {
    const e = new zo(this);
    const t = e._expirationTime;
    let n = this._internalRoot;
    let i = n.firstBatch;
    if (i === null) {
      n.firstBatch = e,
      e._next = null;
    } else {
      for (n = null; i !== null && i._expirationTime <= t;) {
        n = i,
        i = i._next;
      }
      e._next = i,
      n !== null && (n._next = e);
    }
    return e;
  }
  ,
  De = Mo,
  Me = Fo,
  Le = function () {
    no || ao === 0 || (No(ao, null),
    ao = 0);
  };
  let Ko;
  let qo;
  const
    Go = {
      createPortal: $o,
      findDOMNode(e) {
        if (e == null) return null;
        if (e.nodeType === 1) return e;
        const t = e._reactInternalFiber;
        return void 0 === t && (typeof e.render === 'function' ? o('188') : o('268', Object.keys(e))),
        e = (e = sn(t)) === null ? null : e.stateNode;
      },
      hydrate(e, t, n) {
        return Yo(null, e, t, !0, n);
      },
      render(e, t, n) {
        return Yo(null, e, t, !1, n);
      },
      unstable_renderSubtreeIntoContainer(e, t, n, i) {
        return (e == null || void 0 === e._reactInternalFiber) && o('38'),
        Yo(e, t, n, !1, i);
      },
      unmountComponentAtNode(e) {
        return Xo(e) || o('40'),
        !!e._reactRootContainer && (Lo((() => {
          Yo(null, null, e, !1, (() => {
            e._reactRootContainer = null;
          }
          ));
        }
        )),
        !0);
      },
      unstable_createPortal() {
        return $o.apply(void 0, arguments);
      },
      unstable_batchedUpdates: Mo,
      unstable_interactiveUpdates: Fo,
      flushSync(e, t) {
        no && o('187');
        const n = uo;
        uo = !0;
        try {
          return Ja(e, t);
        } finally {
          uo = n,
          No(1, null);
        }
      },
      unstable_flushControlled(e) {
        const t = uo;
        uo = !0;
        try {
          Ja(e);
        } finally {
          (uo = t) || no || No(1, null);
        }
      },
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
        Events: [V, U, B, A.injectEventPluginsByName, y, $, function (e) {
          k(e, Y);
        },
        je, Re, In, R]
      },
      unstable_createRoot(e, t) {
        return Xo(e) || o('278'),
        new Ho(e, !0, t != null && !0 === t.hydrate);
      }
    };
  qo = (Ko = {
    findFiberByHostInstance: F,
    bundleType: 0,
    version: '16.6.0',
    rendererPackageName: 'react-dom'
  }).findFiberByHostInstance,
  (function (e) {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') return !1;
    const t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (t.isDisabled || !t.supportsFiber) return !0;
    try {
      const n = t.inject(e);
      Vi = Bi(((e) => t.onCommitFiberRoot(n, e)
      )),
      Ui = Bi(((e) => t.onCommitFiberUnmount(n, e)
      ));
    } catch (e) {
    }
  }(r({}, Ko, {
    findHostInstanceByFiber(e) {
      return (e = sn(e)) === null ? null : e.stateNode;
    },
    findFiberByHostInstance(e) {
      return qo ? qo(e) : null;
    }
  })));
  const Jo = {
    default: Go
  };
  const Qo = Jo && Go || Jo;
  e.exports = Qo.default || Qo;
},
function (e, t, n) {
  /** @license React v16.6.0
     * react.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
  const i = n(54);
  const r = typeof Symbol === 'function' && Symbol.for;
  const a = r ? Symbol.for('react.element') : 60103;
  const o = r ? Symbol.for('react.portal') : 60106;
  const s = r ? Symbol.for('react.fragment') : 60107;
  const c = r ? Symbol.for('react.strict_mode') : 60108;
  const l = r ? Symbol.for('react.profiler') : 60114;
  const u = r ? Symbol.for('react.provider') : 60109;
  const p = r ? Symbol.for('react.context') : 60110;
  const d = r ? Symbol.for('react.concurrent_mode') : 60111;
  const h = r ? Symbol.for('react.forward_ref') : 60112;
  const f = r ? Symbol.for('react.suspense') : 60113;
  const m = r ? Symbol.for('react.memo') : 60115;
  const v = r ? Symbol.for('react.lazy') : 60116;
  const g = typeof Symbol === 'function' && Symbol.iterator;

  function b(e) {
    for (var t = arguments.length - 1, n = `https://reactjs.org/docs/error-decoder.html?invariant=${e}`, i = 0; i < t; i++) n += `&args[]=${encodeURIComponent(arguments[i + 1])}`;
    !(function (e, t, n, i, r, a, o, s) {
      if (!e) {
        if (e = void 0,
        void 0 === t) {
          e = Error('Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.');
        } else {
          const c = [n, i, r, a, o, s];
          let l = 0;
          (e = Error(t.replace(/%s/g, (() => c[l++]
          )))).name = 'Invariant Violation';
        }
        throw e.framesToPop = 1,
        e;
      }
    }(!1, `Minified React error #${e}; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. `, n));
  }

  const y = {
    isMounted() {
      return !1;
    },
    enqueueForceUpdate() {
    },
    enqueueReplaceState() {
    },
    enqueueSetState() {
    }
  };
  const _ = {};

  function w(e, t, n) {
    this.props = e,
    this.context = t,
    this.refs = _,
    this.updater = n || y;
  }

  function C() {
  }

  function x(e, t, n) {
    this.props = e,
    this.context = t,
    this.refs = _,
    this.updater = n || y;
  }

  w.prototype.isReactComponent = {},
  w.prototype.setState = function (e, t) {
    typeof e !== 'object' && typeof e !== 'function' && e != null && b('85'),
    this.updater.enqueueSetState(this, e, t, 'setState');
  }
  ,
  w.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
  }
  ,
  C.prototype = w.prototype;
  const T = x.prototype = new C();
  T.constructor = x,
  i(T, w.prototype),
  T.isPureReactComponent = !0;
  const S = {
    current: null,
    currentDispatcher: null
  };
  const E = Object.prototype.hasOwnProperty;
  const k = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };

  function O(e, t, n) {
    let i = void 0;
    const r = {};
    let o = null;
    let s = null;
    if (t != null) {
      for (i in void 0 !== t.ref && (s = t.ref),
      void 0 !== t.key && (o = `${t.key}`),
      t) {
        E.call(t, i) && !k.hasOwnProperty(i) && (r[i] = t[i]);
      }
    }
    let c = arguments.length - 2;
    if (c === 1) {
      r.children = n;
    } else if (c > 1) {
      for (var l = Array(c), u = 0; u < c; u++) l[u] = arguments[u + 2];
      r.children = l;
    }
    if (e && e.defaultProps) for (i in c = e.defaultProps) void 0 === r[i] && (r[i] = c[i]);
    return {
      $$typeof: a,
      type: e,
      key: o,
      ref: s,
      props: r,
      _owner: S.current
    };
  }

  function P(e) {
    return typeof e === 'object' && e !== null && e.$$typeof === a;
  }

  const N = /\/+/g;
  const I = [];

  function A(e, t, n, i) {
    if (I.length) {
      const r = I.pop();
      return r.result = e,
      r.keyPrefix = t,
      r.func = n,
      r.context = i,
      r.count = 0,
      r;
    }
    return {
      result: e,
      keyPrefix: t,
      func: n,
      context: i,
      count: 0
    };
  }

  function j(e) {
    e.result = null,
    e.keyPrefix = null,
    e.func = null,
    e.context = null,
    e.count = 0,
    I.length < 10 && I.push(e);
  }

  function R(e, t, n) {
    return e == null ? 0 : (function e(t, n, i, r) {
      let s = typeof t;
      s !== 'undefined' && s !== 'boolean' || (t = null);
      let c = !1;
      if (t === null) {
        c = !0;
      } else {
        switch (s) {
          case 'string':
          case 'number':
            c = !0;
            break;
          case 'object':
            switch (t.$$typeof) {
              case a:
              case o:
                c = !0;
            }
        }
      }
      if (c) {
        return i(r, t, n === '' ? `.${D(t, 0)}` : n),
        1;
      }
      if (c = 0,
      n = n === '' ? '.' : `${n}:`,
      Array.isArray(t)) {
        for (var l = 0; l < t.length; l++) {
          var u = n + D(s = t[l], l);
          c += e(s, u, i, r);
        }
      } else if (t === null || typeof t !== 'object' ? u = null : u = typeof (u = g && t[g] || t['@@iterator']) === 'function' ? u : null,
      typeof u === 'function') {
        for (t = u.call(t),
        l = 0; !(s = t.next()).done;) {
          c += e(s = s.value, u = n + D(s, l++), i, r);
        }
      } else {
        s === 'object' && b('31', (i = `${t}`) === '[object Object]' ? `object with keys {${Object.keys(t)
          .join(', ')}}` : i, '');
      }
      return c;
    }(e, '', t, n));
  }

  function D(e, t) {
    return typeof e === 'object' && e !== null && e.key != null ? (function (e) {
      const t = {
        '=': '=0',
        ':': '=2'
      };
      return `$${(`${e}`).replace(/[=:]/g, ((e) => t[e]
      ))}`;
    }(e.key)) : t.toString(36);
  }

  function M(e, t) {
    e.func.call(e.context, t, e.count++);
  }

  function L(e, t, n) {
    const i = e.result;
    const r = e.keyPrefix;
    e = e.func.call(e.context, t, e.count++),
    Array.isArray(e) ? F(e, i, n, ((e) => e
    )) : e != null && (P(e) && (e = (function (e, t) {
      return {
        $$typeof: a,
        type: e.type,
        key: t,
        ref: e.ref,
        props: e.props,
        _owner: e._owner
      };
    }(e, r + (!e.key || t && t.key === e.key ? '' : `${(`${e.key}`).replace(N, '$&/')}/`) + n))),
    i.push(e));
  }

  function F(e, t, n, i, r) {
    let a = '';
    n != null && (a = `${(`${n}`).replace(N, '$&/')}/`),
    R(e, L, t = A(t, a, i, r)),
    j(t);
  }

  const V = {
    Children: {
      map(e, t, n) {
        if (e == null) return e;
        const i = [];
        return F(e, i, null, t, n),
        i;
      },
      forEach(e, t, n) {
        if (e == null) return e;
        R(e, M, t = A(null, null, t, n)),
        j(t);
      },
      count(e) {
        return R(e, (() => null
        ), null);
      },
      toArray(e) {
        const t = [];
        return F(e, t, null, ((e) => e
        )),
        t;
      },
      only(e) {
        return P(e) || b('143'),
        e;
      }
    },
    createRef() {
      return {
        current: null
      };
    },
    Component: w,
    PureComponent: x,
    createContext(e, t) {
      return void 0 === t && (t = null),
      (e = {
        $$typeof: p,
        _calculateChangedBits: t,
        _currentValue: e,
        _currentValue2: e,
        Provider: null,
        Consumer: null
      }).Provider = {
        $$typeof: u,
        _context: e
      },
      e.Consumer = e;
    },
    forwardRef(e) {
      return {
        $$typeof: h,
        render: e
      };
    },
    lazy(e) {
      return {
        $$typeof: v,
        _ctor: e,
        _status: -1,
        _result: null
      };
    },
    memo(e, t) {
      return {
        $$typeof: m,
        type: e,
        compare: void 0 === t ? null : t
      };
    },
    Fragment: s,
    StrictMode: c,
    unstable_ConcurrentMode: d,
    Suspense: f,
    unstable_Profiler: l,
    createElement: O,
    cloneElement(e, t, n) {
      e == null && b('267', e);
      let r = void 0;
      const o = i({}, e.props);
      let s = e.key;
      let c = e.ref;
      let l = e._owner;
      if (t != null) {
        void 0 !== t.ref && (c = t.ref,
        l = S.current),
        void 0 !== t.key && (s = `${t.key}`);
        var u = void 0;
        for (r in e.type && e.type.defaultProps && (u = e.type.defaultProps),
        t) {
          E.call(t, r) && !k.hasOwnProperty(r) && (o[r] = void 0 === t[r] && void 0 !== u ? u[r] : t[r]);
        }
      }
      if ((r = arguments.length - 2) === 1) {
        o.children = n;
      } else if (r > 1) {
        u = Array(r);
        for (let p = 0; p < r; p++) u[p] = arguments[p + 2];
        o.children = u;
      }
      return {
        $$typeof: a,
        type: e.type,
        key: s,
        ref: c,
        props: o,
        _owner: l
      };
    },
    createFactory(e) {
      const t = O.bind(null, e);
      return t.type = e,
      t;
    },
    isValidElement: P,
    version: '16.6.0',
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      ReactCurrentOwner: S,
      assign: i
    }
  };
  const U = {
    default: V
  };
  const B = U && V || U;
  e.exports = B.default || B;
},
function (e, t, n) {
  e.exports = n(137);
},
function (e, t, n) {
  /** @license React v16.6.0
     * scheduler.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
  Object.defineProperty(t, '__esModule', {
    value: !0
  });
  let i = null;
  let r = 3;
  let a = -1;
  let o = -1;
  let s = !1;
  let c = !1;
  const l = typeof performance === 'object' && typeof performance.now === 'function';
  const u = {
    timeRemaining: l ? function () {
      if (i !== null && i.expirationTime < o) return 0;
      const e = y() - performance.now();
      return e > 0 ? e : 0;
    }
      : function () {
        if (i !== null && i.expirationTime < o) return 0;
        const e = y() - Date.now();
        return e > 0 ? e : 0;
      },
    didTimeout: !1
  };

  function p() {
    if (!s) {
      const e = i.expirationTime;
      c ? b() : c = !0,
      g(f, e);
    }
  }

  function d() {
    let e = i;
    let t = i.next;
    if (i === t) {
      i = null;
    } else {
      var n = i.previous;
      i = n.next = t,
      t.previous = n;
    }
    e.next = e.previous = null,
    n = e.callback,
    t = e.expirationTime,
    e = e.priorityLevel;
    const a = r;
    const s = o;
    r = e,
    o = t;
    try {
      var c = n(u);
    } finally {
      r = a,
      o = s;
    }
    if (typeof c === 'function') {
      if (c = {
        callback: c,
        priorityLevel: e,
        expirationTime: t,
        next: null,
        previous: null
      },
      i === null) {
        i = c.next = c.previous = c;
      } else {
        n = null,
        e = i;
        do {
          if (e.expirationTime >= t) {
            n = e;
            break;
          }
          e = e.next;
        } while (e !== i);
        n === null ? n = i : n === i && (i = c,
        p()),
        (t = n.previous).next = n.previous = c,
        c.next = n,
        c.previous = t;
      }
    }
  }

  function h() {
    if (a === -1 && i !== null && i.priorityLevel === 1) {
      s = !0,
      u.didTimeout = !0;
      try {
        do {
          d();
        } while (i !== null && i.priorityLevel === 1);
      } finally {
        s = !1,
        i !== null ? p() : c = !1;
      }
    }
  }

  function f(e) {
    s = !0,
    u.didTimeout = e;
    try {
      if (e) {
        for (; i !== null;) {
          const n = t.unstable_now();
          if (!(i.expirationTime <= n)) break;
          do {
            d();
          } while (i !== null && i.expirationTime <= n);
        }
      } else if (i !== null) {
        do {
          d();
        } while (i !== null && y() - t.unstable_now() > 0);
      }
    } finally {
      s = !1,
      i !== null ? p() : c = !1,
      h();
    }
  }

  let m;
  let v;
  let g;
  let b;
  let y;
  const _ = Date;
  const w = typeof setTimeout === 'function' ? setTimeout : void 0;
  const C = typeof clearTimeout === 'function' ? clearTimeout : void 0;
  const x = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : void 0;
  const
    T = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : void 0;

  function S(e) {
    m = x(((t) => {
      C(v),
      e(t);
    }
    )),
    v = w((() => {
      T(m),
      e(t.unstable_now());
    }
    ), 100);
  }

  if (l) {
    const E = performance;
    t.unstable_now = function () {
      return E.now();
    };
  } else {
    t.unstable_now = function () {
      return _.now();
    };
  }
  if (typeof window !== 'undefined' && window._schedMock) {
    const k = window._schedMock;
    g = k[0],
    b = k[1],
    y = k[2];
  } else if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    let O = null;
    let P = -1;
    const N = function (e, t) {
      if (O !== null) {
        const n = O;
        O = null;
        try {
          P = t,
          n(e);
        } finally {
          P = -1;
        }
      }
    };
    g = function (e, t) {
      P !== -1 ? setTimeout(g, 0, e, t) : (O = e,
      setTimeout(N, t, !0, t),
      setTimeout(N, 1073741823, !1, 1073741823));
    }
    ,
    b = function () {
      O = null;
    }
    ,
    y = function () {
      return 1 / 0;
    }
    ,
    t.unstable_now = function () {
      return P === -1 ? 0 : P;
    };
  } else {
    typeof console !== 'undefined' && (typeof x !== 'function' && console.error('This browser doesn\'t support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills'),
    typeof T !== 'function' && console.error('This browser doesn\'t support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills'));
    let I = null;
    let A = !1;
    let j = -1;
    let R = !1;
    let D = !1;
    let M = 0;
    let L = 33;
    let F = 33;
    y = function () {
      return M;
    };
    const V = `__reactIdleCallback$${Math.random()
      .toString(36)
      .slice(2)}`;
    window.addEventListener('message', ((e) => {
      if (e.source === window && e.data === V) {
        A = !1,
        e = I;
        const n = j;
        I = null,
        j = -1;
        const i = t.unstable_now();
        let r = !1;
        if (M - i <= 0) {
          if (!(n !== -1 && n <= i)) {
            return R || (R = !0,
            S(U)),
            I = e,
            void (j = n);
          }
          r = !0;
        }
        if (e !== null) {
          D = !0;
          try {
            e(r);
          } finally {
            D = !1;
          }
        }
      }
    }
    ), !1);
    var U = function (e) {
      if (I !== null) {
        S(U);
        let t = e - M + F;
        t < F && L < F ? (t < 8 && (t = 8),
        F = t < L ? L : t) : L = t,
        M = e + F,
        A || (A = !0,
        window.postMessage(V, '*'));
      } else {
        R = !1;
      }
    };
    g = function (e, t) {
      I = e,
      j = t,
      D || t < 0 ? window.postMessage(V, '*') : R || (R = !0,
      S(U));
    }
    ,
    b = function () {
      I = null,
      A = !1,
      j = -1;
    };
  }
  t.unstable_ImmediatePriority = 1,
  t.unstable_UserBlockingPriority = 2,
  t.unstable_NormalPriority = 3,
  t.unstable_IdlePriority = 4,
  t.unstable_runWithPriority = function (e, n) {
    switch (e) {
      case 1:
      case 2:
      case 3:
      case 4:
        break;
      default:
        e = 3;
    }
    const i = r;
    const o = a;
    r = e,
    a = t.unstable_now();
    try {
      return n();
    } finally {
      r = i,
      a = o,
      h();
    }
  }
  ,
  t.unstable_scheduleCallback = function (e, n) {
    let o = a !== -1 ? a : t.unstable_now();
    if (typeof n === 'object' && n !== null && typeof n.timeout === 'number') {
      n = o + n.timeout;
    } else {
      switch (r) {
        case 1:
          n = o + -1;
          break;
        case 2:
          n = o + 250;
          break;
        case 4:
          n = o + 1073741823;
          break;
        default:
          n = o + 5e3;
      }
    }
    if (e = {
      callback: e,
      priorityLevel: r,
      expirationTime: n,
      next: null,
      previous: null
    },
    i === null) {
      i = e.next = e.previous = e,
      p();
    } else {
      o = null;
      let s = i;
      do {
        if (s.expirationTime > n) {
          o = s;
          break;
        }
        s = s.next;
      } while (s !== i);
      o === null ? o = i : o === i && (i = e,
      p()),
      (n = o.previous).next = o.previous = e,
      e.next = o,
      e.previous = n;
    }
    return e;
  }
  ,
  t.unstable_cancelCallback = function (e) {
    const t = e.next;
    if (t !== null) {
      if (t === e) {
        i = null;
      } else {
        e === i && (i = t);
        const n = e.previous;
        n.next = t,
        t.previous = n;
      }
      e.next = e.previous = null;
    }
  }
  ,
  t.unstable_wrapCallback = function (e) {
    const n = r;
    return function () {
      const i = r;
      const o = a;
      r = n,
      a = t.unstable_now();
      try {
        return e.apply(this, arguments);
      } finally {
        r = i,
        a = o,
        h();
      }
    };
  }
  ,
  t.unstable_getCurrentPriorityLevel = function () {
    return r;
  };
},
function (e, t, n) {
  const i = n(54);
  const r = n(139);
  const a = n(140);
  const o = 'mixins';
  e.exports = function (e, t, n) {
    const s = [];
    const c = {
      mixins: 'DEFINE_MANY',
      statics: 'DEFINE_MANY',
      propTypes: 'DEFINE_MANY',
      contextTypes: 'DEFINE_MANY',
      childContextTypes: 'DEFINE_MANY',
      getDefaultProps: 'DEFINE_MANY_MERGED',
      getInitialState: 'DEFINE_MANY_MERGED',
      getChildContext: 'DEFINE_MANY_MERGED',
      render: 'DEFINE_ONCE',
      componentWillMount: 'DEFINE_MANY',
      componentDidMount: 'DEFINE_MANY',
      componentWillReceiveProps: 'DEFINE_MANY',
      shouldComponentUpdate: 'DEFINE_ONCE',
      componentWillUpdate: 'DEFINE_MANY',
      componentDidUpdate: 'DEFINE_MANY',
      componentWillUnmount: 'DEFINE_MANY',
      UNSAFE_componentWillMount: 'DEFINE_MANY',
      UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',
      UNSAFE_componentWillUpdate: 'DEFINE_MANY',
      updateComponent: 'OVERRIDE_BASE'
    };
    const l = {
      getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
    };
    var u = {
      displayName(e, t) {
        e.displayName = t;
      },
      mixins(e, t) {
        if (t) for (let n = 0; n < t.length; n++) d(e, t[n]);
      },
      childContextTypes(e, t) {
        e.childContextTypes = i({}, e.childContextTypes, t);
      },
      contextTypes(e, t) {
        e.contextTypes = i({}, e.contextTypes, t);
      },
      getDefaultProps(e, t) {
        e.getDefaultProps ? e.getDefaultProps = f(e.getDefaultProps, t) : e.getDefaultProps = t;
      },
      propTypes(e, t) {
        e.propTypes = i({}, e.propTypes, t);
      },
      statics(e, t) {
        !(function (e, t) {
          if (!t) return;
          for (const n in t) {
            const i = t[n];
            if (t.hasOwnProperty(n)) {
              if (a(!(n in u), 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', n),
              n in e) {
                const r = l.hasOwnProperty(n) ? l[n] : null;
                return a(r === 'DEFINE_MANY_MERGED', 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', n),
                void (e[n] = f(e[n], i));
              }
              e[n] = i;
            }
          }
        }(e, t));
      },
      autobind() {
      }
    };

    function p(e, t) {
      const n = c.hasOwnProperty(t) ? c[t] : null;
      y.hasOwnProperty(t) && a(n === 'OVERRIDE_BASE', 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', t),
      e && a(n === 'DEFINE_MANY' || n === 'DEFINE_MANY_MERGED', 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', t);
    }

    function d(e, n) {
      if (n) {
        a(typeof n !== 'function', 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.'),
        a(!t(n), 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.');
        const i = e.prototype;
        const r = i.__reactAutoBindPairs;
        for (const s in n.hasOwnProperty(o) && u.mixins(e, n.mixins),
        n) {
          if (n.hasOwnProperty(s) && s !== o) {
            const l = n[s];
            const d = i.hasOwnProperty(s);
            if (p(d, s),
            u.hasOwnProperty(s)) {
              u[s](e, l);
            } else {
              const h = c.hasOwnProperty(s);
              if (typeof l === 'function' && !h && !d && !1 !== n.autobind) {
                r.push(s, l),
                i[s] = l;
              } else if (d) {
                const v = c[s];
                a(h && (v === 'DEFINE_MANY_MERGED' || v === 'DEFINE_MANY'), 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', v, s),
                v === 'DEFINE_MANY_MERGED' ? i[s] = f(i[s], l) : v === 'DEFINE_MANY' && (i[s] = m(i[s], l));
              } else {
                i[s] = l;
              }
            }
          }
        }
      } else {

      }
    }

    function h(e, t) {
      for (const n in a(e && t && typeof e === 'object' && typeof t === 'object', 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'),
      t) {
        t.hasOwnProperty(n) && (a(void 0 === e[n], 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', n),
        e[n] = t[n]);
      }
      return e;
    }

    function f(e, t) {
      return function () {
        const n = e.apply(this, arguments);
        const i = t.apply(this, arguments);
        if (n == null) return i;
        if (i == null) return n;
        const r = {};
        return h(r, n),
        h(r, i),
        r;
      };
    }

    function m(e, t) {
      return function () {
        e.apply(this, arguments),
        t.apply(this, arguments);
      };
    }

    function v(e, t) {
      return t.bind(e);
    }

    const g = {
      componentDidMount() {
        this.__isMounted = !0;
      }
    };
    const b = {
      componentWillUnmount() {
        this.__isMounted = !1;
      }
    };
    var y = {
      replaceState(e, t) {
        this.updater.enqueueReplaceState(this, e, t);
      },
      isMounted() {
        return !!this.__isMounted;
      }
    };
    const _ = function () {
    };
    return i(_.prototype, e.prototype, y),
    function (e) {
      var t = function (e, i, o) {
        this.__reactAutoBindPairs.length && (function (e) {
          for (let t = e.__reactAutoBindPairs, n = 0; n < t.length; n += 2) {
            const i = t[n];
            const r = t[n + 1];
            e[i] = v(e, r);
          }
        }(this)),
        this.props = e,
        this.context = i,
        this.refs = r,
        this.updater = o || n,
        this.state = null;
        const s = this.getInitialState ? this.getInitialState() : null;
        a(typeof s === 'object' && !Array.isArray(s), '%s.getInitialState(): must return an object or null', t.displayName || 'ReactCompositeComponent'),
        this.state = s;
      };
      for (const i in t.prototype = new _(),
      t.prototype.constructor = t,
      t.prototype.__reactAutoBindPairs = [],
      s.forEach(d.bind(null, t)),
      d(t, g),
      d(t, e),
      d(t, b),
      t.getDefaultProps && (t.defaultProps = t.getDefaultProps()),
      a(t.prototype.render, 'createClass(...): Class specification must implement a `render` method.'),
      c) {
        t.prototype[i] || (t.prototype[i] = null);
      }
      return t;
    };
  };
},
function (e, t, n) {
  e.exports = {};
},
function (e, t, n) {
  const i = function (e) {
  };
  e.exports = function (e, t, n, r, a, o, s, c) {
    if (i(t),
    !e) {
      let l;
      if (void 0 === t) {
        l = new Error('Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.');
      } else {
        const u = [n, r, a, o, s, c];
        let p = 0;
        (l = new Error(t.replace(/%s/g, (() => u[p++]
        )))).name = 'Invariant Violation';
      }
      throw l.framesToPop = 1,
      l;
    }
  };
},
function (e, t, n) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  }),
  t.default = function (e) {
    if (!s) return e;
    if (c[e] != null) return c[e];
    (0,
    a.default)(e) in s.style ? c[e] = e : r.default.js + (0,
      a.default)(`-${e}`) in s.style ? c[e] = r.default.css + e : c[e] = !1;
    return c[e];
  };
  const i = o(n(123));
  var r = o(n(122));
  var a = o(n(142));

  function o(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }

  var s = void 0;
  var c = {};
  if (i.default) {
    s = document.createElement('p');
    const l = window.getComputedStyle(document.documentElement, '');
    for (const u in l) isNaN(u) || (c[l[u]] = l[u]);
  }
},
function (e, t, n) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  }),
  t.default = function (e) {
    return e.replace(i, r);
  };
  var i = /[-\s]+(.)?/g;

  function r(e, t) {
    return t ? t.toUpperCase() : '';
  }
},
function (e, t, n) {
  Object.defineProperty(t, '__esModule', {
    value: !0
  }),
  t.default = function (e, t) {
    if (!s) return t;
    if (typeof t !== 'string' || !isNaN(parseInt(t, 10))) return t;
    const n = e + t;
    if (o[n] != null) return o[n];
    try {
      s.style[e] = t;
    } catch (e) {
      return o[n] = !1,
      !1;
    }
    s.style[e] !== '' ? o[n] = t : ((t = r.default.css + t) === '-ms-flex' && (t = '-ms-flexbox'),
    s.style[e] = t,
    s.style[e] !== '' && (o[n] = t));
    o[n] || (o[n] = !1);
    return s.style[e] = '',
    o[n];
  };
  const i = a(n(123));
  var r = a(n(122));

  function a(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }

  var o = {};
  var s = void 0;
  i.default && (s = document.createElement('p'));
},
function (e, t, n) {
  e.exports = function (e) {
    return encodeURIComponent(e)
      .replace(/[!'()*]/g, ((e) => `%${e.charCodeAt(0)
        .toString(16)
        .toUpperCase()}`
      ));
  };
},
function (e, t, n) {
  function i(e) {
    return e && e.default ? e.default : e;
  }

  const r = n(4);
  let a = n(9);
  const o = i(r).isUnimplementedComponent;
  a = i(a);
  const s = {
    get Ad() {
      const e = n(146);
      return e.default || e;
    },
    get AiCamera() {
      const e = n(147);
      return e.default || e;
    },
    get Ar() {
      const e = n(148);
      return e.default || e;
    },
    get Audio() {
      const e = n(191);
      return e.default || e;
    },
    get Button() {
      const e = n(190);
      return e.default || e;
    },
    get Camera() {
      const e = n(149);
      return e.default || e;
    },
    get Canvas() {
      const e = n(181);
      return e.default || e;
    },
    get Cdp() {
      const e = n(150);
      return e.default || e;
    },
    get ContactButton() {
      const e = n(151);
      return e.default || e;
    },
    get Checkbox() {
      const e = n(152);
      return e.default || e;
    },
    get CheckboxGroup() {
      const e = n(153);
      return e.default || e;
    },
    get CoverImage() {
      const e = n(154);
      return e.default || e;
    },
    get CoverView() {
      const e = n(155);
      return e.default || e;
    },
    get Form() {
      const e = n(156);
      return e.default || e;
    },
    get Icon() {
      const e = n(157);
      return e.default || e;
    },
    get Image() {
      const e = n(188);
      return e.default || e;
    },
    get Input() {
      const e = n(158);
      return e.default || e;
    },
    get Label() {
      const e = n(159);
      return e.default || e;
    },
    get Lifestyle() {
      const e = n(160);
      return e.default || e;
    },
    get Lottie() {
      const e = n(161);
      return e.default || e;
    },
    get LivePlayer() {
      const e = n(162);
      return e.default || e;
    },
    get LivePusher() {
      const e = n(163);
      return e.default || e;
    },
    get Map() {
      const e = n(185);
      return e.default || e;
    },
    get MovableArea() {
      const e = n(164);
      return e.default || e;
    },
    get MovableView() {
      const e = n(179);
      return e.default || e;
    },
    get Navigator() {
      const e = n(193);
      return e.default || e;
    },
    get Picker() {
      const e = n(192);
      return e.default || e;
    },
    get PickerView() {
      const e = n(182);
      return e.default || e;
    },
    get PickerViewColumn() {
      const e = n(165);
      return e.default || e;
    },
    get Progress() {
      const e = n(166);
      return e.default || e;
    },
    get PageMeta() {
      const e = n(167);
      return e.default || e;
    },
    get Radio() {
      const e = n(168);
      return e.default || e;
    },
    get RadioGroup() {
      const e = n(169);
      return e.default || e;
    },
    get RichText() {
      const e = n(170);
      return e.default || e;
    },
    get ScrollView() {
      const e = n(187);
      return e.default || e;
    },
    get Slider() {
      const e = n(184);
      return e.default || e;
    },
    get Swiper() {
      const e = n(171);
      return e.default || e;
    },
    get SwiperItem() {
      const e = n(172);
      return e.default || e;
    },
    get Switch() {
      const e = n(173);
      return e.default || e;
    },
    get Text() {
      const e = n(183);
      return e.default || e;
    },
    get Textarea() {
      const e = n(180);
      return e.default || e;
    },
    get Video() {
      const e = n(174);
      return e.default || e;
    },
    get View() {
      const e = n(189);
      return e.default || e;
    },
    get WebView() {
      const e = n(175);
      return e.default || e;
    },
    get MatchMedia() {
      const e = n(176);
      return e.default || e;
    },
    get Component() {
      const e = n(124);
      return e.default || e;
    }
  };
  e.exports = function (e) {
    for (let t = function (t, n) {
        const i = n[t];
        o(i) || Object.defineProperty(e, i, {
          configurable: !0,
          get() {
            return s[i];
          }
        });
      }, n = 0, i = a(s); n < i.length; n++) {
      t(n, i);
    }
  };
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(8);
  const p = n(6);
  const d = n(4);
  const h = n(28);
  const f = n(22);
  const m = ['unitId', 'extInfo', 'immediately'];
  const v = o.a.createElement('param', {
    name: 'type',
    value: 'ad'
  });
  const g = Object(s.c)({
    name: 'ad',
    isNativeComponent() {
      return Object(d.isNativeComponentForLyra)('ad');
    }
  })(l()({
    displayName: 'Ad',
    mixins: [h.a, f.a],
    getDefaultProps() {
      return {
        unitId: '',
        extInfo: {},
        immediately: !1
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {
        height: 0
      };
    },
    componentDidMount() {
      this.useNative && (this.nativeEvents = Object(u.a)(document, {
        'nbcomponent.ad.onRenderSuccess': this.onRenderSuccess
      }),
      this.onDidMountForNative());
    },
    componentDidUpdate(e) {
      for (let t = 0; t < m.length; t++) {
        const n = m[t];
        if (e[n] !== this.props[n]) {
          this.renderNativeComponent();
          break;
        }
      }
    },
    onRenderSuccess(e) {
      const t = e.data;
      const n = t.element;
      const i = t.height;
      const r = this.props.onLoad;
      n === this.getId() && this.setState({
        height: i
      }, (() => {
        r && r({
          detail: {
            height: i
          }
        });
      }
      ));
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        const t = e.unitId;
        const n = e.extInfo;
        const i = e.immediately;
        Object(p.a)('NBComponent.render', {
          element: this.getId(),
          data: {
            spaceCode: t,
            extInfo: n,
            immediately: i
          }
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      if (!this.checkPermission('ad')) {
        return this.getPermissionJSX({
          className: n,
          style: t,
          id: i
        });
      }
      if (!this.useNative) return this.getUnsupportJSX();
      const a = this.state.height;
      return o.a.createElement('div', {
        style: {
          height: `${a}px`
        }
      }, o.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: r()({}, t, {
          height: `${a}px`
        }),
        id: i,
        type: 'application/view',
        role: 'application'
      }, v, o.a.createElement('param', {
        name: 'id',
        value: this.getId()
      })));
    }
  }));
  t.default = g;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(4);
  const l = n(6);
  const u = n(28);
  const p = n(22);
  const d = r.a.createElement('param', {
    name: 'type',
    value: 'ai-camera'
  });
  const h = Object(a.c)({
    name: 'ai-camera',
    isNativeComponent() {
      return Object(c.isNativeComponentForLyra)('ai-camera');
    }
  })(s()({
    displayName: 'AiCamera',
    mixins: [u.a, p.a],
    getDefaultProps() {
      return {
        devicePosition: 'back',
        flash: 'auto'
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.onDidMountForNative();
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        const t = e.devicePosition;
        const n = e.flash;
        const i = e.orientation;
        const r = e.outputDimension;
        const a = e.applyMicPermissionWhenInit;
        const o = e.recordVideoOnly;
        const s = e.extraInfo;
        Object(l.a)('NBComponent.render', {
          element: this.getId(),
          data: {
            type: 'ai-camera',
            devicePosition: t,
            flash: n,
            orientation: i,
            outputDimension: r,
            applyMicPermissionWhenInit: a,
            recordVideoOnly: o,
            extraInfo: s
          }
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      const a = e.devicePosition;
      const o = e.flash;
      const s = e.orientation;
      const c = e.outputDimension;
      const l = e.applyMicPermissionWhenInit;
      const u = e.recordVideoOnly;
      const p = e.extraInfo;
      return this.checkPermission('ai-camera') ? this.useNative ? r.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: t,
        id: i,
        type: 'application/view',
        role: 'application'
      }, d, r.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }), r.a.createElement('param', {
        name: 'devicePosition',
        value: a
      }), r.a.createElement('param', {
        name: 'flash',
        value: o
      }), r.a.createElement('param', {
        name: 'orientation',
        value: s
      }), r.a.createElement('param', {
        name: 'outputDimension',
        value: c
      }), r.a.createElement('param', {
        name: 'applyMicPermissionWhenInit',
        value: l
      }), r.a.createElement('param', {
        name: 'recordVideoOnly',
        value: u
      }), r.a.createElement('param', {
        name: 'extraInfo',
        value: p
      })) : this.getUnsupportJSX() : this.getPermissionJSX({
        className: n,
        style: t,
        id: i
      });
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(6);
  const l = n(4);
  const u = n(28);
  const p = n(22);
  const d = r.a.createElement('param', {
    name: 'type',
    value: 'ar'
  });
  const h = Object(a.c)({
    name: 'ar',
    isNativeComponent() {
      return Object(l.isNativeComponentForLyra)('ar');
    }
  })(s()({
    displayName: 'Ar',
    mixins: [u.a, p.a],
    getDefaultProps() {
      return {
        trackFaceSmile: 0,
        trackFaceBeauty: 0
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.useNative && this.onDidMountForNative();
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        Object(c.a)('NBComponent.render', {
          element: this.getId(),
          data: {
            type: 'ar',
            src: e.src,
            'gesture-rotatable': e.gestureRotatable,
            'gesture-draggable': e.gestureDraggable,
            'gesture-scalable': e.gestureScalable,
            'track-mode': e.trackMode,
            'track-attitude': e.trackAttitude,
            'camera-enable': e.cameraEnable,
            'camera-position': e.cameraPosition,
            'track-face': e.trackFace,
            'track-face-max': e.trackFaceMax,
            'track-face-smile': e.trackFaceSmile,
            'track-face-beauty': e.trackFaceBeauty
          }
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      return this.checkPermission('ar') ? this.useNative ? r.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: t,
        id: i,
        type: 'application/view',
        role: 'application'
      }, d, r.a.createElement('param', {
        name: 'id',
        value: this.getId()
      })) : this.getUnsupportJSX() : this.getPermissionJSX({
        className: n,
        style: t,
        id: i
      });
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(6);
  const l = n(4);
  const u = n(28);
  const p = n(22);
  const d = r.a.createElement('param', {
    name: 'type',
    value: 'camera'
  });
  const h = Object(a.c)({
    name: 'camera',
    isNativeComponent() {
      return Object(l.isNativeComponentForLyra)('camera');
    }
  })(s()({
    displayName: 'Camera',
    mixins: [u.a, p.a],
    getDefaultProps() {
      return {
        mode: 'normal',
        devicePosition: 'back',
        flash: 'auto'
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.useNative && this.onDidMountForNative();
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        const t = e.mode;
        const n = e.devicePosition;
        const i = e.flash;
        const r = e.scanArea;
        const a = e.frameSize;
        const o = e.frameFormat;
        const s = e.applyMicPermissionWhenInit;
        const l = e.outputDimension;
        const u = e.recordVideoOnly;
        const p = e.extraInfo;
        Object(c.a)('NBComponent.render', {
          element: this.getId(),
          data: {
            type: 'camera',
            mode: t,
            devicePosition: n,
            flash: i,
            scanArea: r,
            frameSize: a,
            frameFormat: o,
            applyMicPermissionWhenInit: s,
            outputDimension: l,
            recordVideoOnly: u,
            extraInfo: p
          }
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      const a = e.mode;
      const o = e.devicePosition;
      const s = e.flash;
      const c = e.frameSize;
      const l = e.applyMicPermissionWhenInit;
      const u = e.outputDimension;
      const p = e.recordVideoOnly;
      const h = e.extraInfo;
      return this.checkPermission('camera') ? this.useNative ? r.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: t,
        id: i,
        type: 'application/view',
        role: 'application'
      }, d, r.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }), r.a.createElement('param', {
        name: 'mode',
        value: a
      }), r.a.createElement('param', {
        name: 'devicePosition',
        value: o
      }), r.a.createElement('param', {
        name: 'flash',
        value: s
      }), r.a.createElement('param', {
        name: 'frameSize',
        value: c
      }), r.a.createElement('param', {
        name: 'applyMicPermissionWhenInit',
        value: l
      }), r.a.createElement('param', {
        name: 'outputDimension',
        value: u
      }), r.a.createElement('param', {
        name: 'recordVideoOnly',
        value: p
      }), r.a.createElement('param', {
        name: 'extraInfo',
        value: h
      })) : this.getUnsupportJSX() : this.getPermissionJSX({
        className: n,
        style: t,
        id: i
      });
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(8);
  const p = n(6);
  const d = n(4);
  const h = n(28);
  const f = n(22);
  const m = ['spaceCode', 'extInfo', 'immediately'];
  const v = o.a.createElement('param', {
    name: 'type',
    value: 'ad'
  });
  const g = Object(s.c)({
    name: 'cdp',
    isNativeComponent() {
      return Object(d.isNativeComponentForLyra)('cdp');
    }
  })(l()({
    displayName: 'Cdp',
    mixins: [h.a, f.a],
    getDefaultProps() {
      return {
        spaceCode: '',
        extInfo: {},
        immediately: !1
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {
        height: 0
      };
    },
    componentDidMount() {
      this.useNative && (this.nativeEvents = Object(u.a)(document, {
        'nbcomponent.ad.onRenderSuccess': this.onRenderSuccess
      }),
      this.onDidMountForNative());
    },
    componentDidUpdate(e) {
      for (let t = 0; t < m.length; t++) {
        const n = m[t];
        if (e[n] !== this.props[n]) {
          this.renderNativeComponent();
          break;
        }
      }
    },
    onRenderSuccess(e) {
      const t = e.data;
      const n = t.element;
      const i = t.height;
      const r = this.props.onRenderSuccess;
      n === this.getId() && this.setState({
        height: i
      }, (() => {
        r && r({
          detail: {
            height: i
          }
        });
      }
      ));
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        const t = e.spaceCode;
        const n = e.extInfo;
        const i = e.immediately;
        Object(p.a)('NBComponent.render', {
          element: this.getId(),
          data: {
            spaceCode: t,
            extInfo: n,
            immediately: i
          }
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      if (!this.checkPermission('cdp')) {
        return this.getPermissionJSX({
          className: n,
          style: t,
          id: i
        });
      }
      if (!this.useNative) return this.getUnsupportJSX();
      const a = this.state.height;
      return o.a.createElement('div', {
        style: {
          height: `${a}px`
        }
      }, o.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: r()({}, t, {
          height: `${a}px`
        }),
        id: i,
        type: 'application/view',
        role: 'application'
      }, v, o.a.createElement('param', {
        name: 'id',
        value: this.getId()
      })));
    }
  }));
  t.default = g;
},
function (e, t, n) {
  n.r(t);
  let i;
  const r = n(3);
  const a = n.n(r);
  const o = n(0);
  const s = n.n(o);
  const c = n(1);
  const l = n(5);
  const u = n.n(l);
  const p = n(62);
  const d = n(90);
  const h = n(11);
  const
    f = n(6);

  function m() {
    return c.h.getSwitch('defaultCloudServiceRouter244', 'miniapp');
  }

  const v = Object(c.c)({
    name: 'contact-button'
  })(u()({
    displayName: 'ContactButton',
    onTap() {
      let e;
      const
        t = this;
      e = function (e) {
        const n = (void 0 === e ? {} : e).type;
        if ((void 0 === n ? 'miniapp' : n) === 'chat') {
          const i = t.props;
          const r = i.tntInstId;
          const a = i.scene;
          const o = i.alipayCardNo;
          const s = i.extInfo;
          const l = Object(c.g)().appId;
          Object(f.a)('APSocialNebulaPlugin.queryBCChatSchema', {
            businessId: l,
            bcRoleType: '1',
            relationType: 'CLOUDSERVICEAPP',
            extInfo: JSON.stringify({
              tntInstId: r,
              scene: a,
              alipayCardNo: o,
              extInfo: s,
              appId: l
            }),
            showLoading: 'Y',
            shouldJump: 'Y'
          }, ((e) => {
            e.success || t.startCloudServiceApp();
          }
          ));
        } else {
          t.startCloudServiceApp();
        }
      }
      ,
      i ? e(i) : Object(f.a)('tinyAppConfig', {
        key: 'cloudServiceConfig',
        scopeType: 'app'
      }, ((t) => {
        if (t && t.value) {
          try {
            i = JSON.parse(t.value),
            e({
              type: i.type || m()
            });
          } catch (t) {
            e({
              type: m()
            });
          }
        } else {
          e({
            type: m()
          });
        }
      }
      ));
    },
    startCloudServiceApp() {
      const e = this.props;
      const t = e.tntInstId;
      const n = e.scene;
      const i = e.alipayCardNo;
      const r = e.extInfo;
      const a = Object(c.g)().appId;
      Object(h.a)('startApp', {
        appId: '2017112000050756',
        param: {
          page: `pages/cschat/cschat?tntInstId=${t}&scene=${n}&alipayCardNo=${i}&extInfo=${encodeURIComponent(r)}&appId=${a}`
        }
      });
    },
    render() {
      const e = this.props;
      const t = e.color;
      const n = void 0 === t ? '#00A3FF' : t;
      const i = e.icon;
      const r = e.$appx;
      const o = this.props.size;
      let c = void 0 === o ? 25 : o;
      (`${c}`).indexOf('rpx') > -1 && (c = Object(p.a)(parseInt(c)));
      const l = {
        size: c,
        color: n
      };
      let u = s.a.createElement(d.a, a()({
        type: 'contact-button'
      }, l));
      return i && (u = s.a.createElement('img', {
        src: r.getNormalizedSrc(i),
        style: {
          width: parseFloat(c)
        }
      })),
      s.a.createElement('div', {
        className: 'a-contact-button',
        onClick: this.onTap
      }, u);
    }
  }));
  t.default = v;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(112);
  const o = n(1);
  const s = n(5);
  const c = n.n(s);
  const l = n(113);
  const u = n(12);
  const p = n(30);
  const d = n(25);
  const h = Object(o.c)({
    name: 'checkbox'
  })(c()({
    displayName: 'Checkbox',
    statics: {
      isFormControl: 1,
      contextType: l.a
    },
    getDefaultProps() {
      return {
        checked: !1,
        disabled: !1,
        value: '',
        controlled: !1
      };
    },
    getInitialState() {
      const e = this;
      return this.invokeWithCheckboxGroup(((t) => {
        t.updateCheckbox(e);
      }
      )),
      {
        checked: !!Object(u.a)(this.props.checked)
      };
    },
    componentWillReceiveProps(e) {
      this.props.checked === e.checked || e.controlled || this.setState({
        checked: !!Object(u.a)(e.checked)
      });
    },
    componentDidUpdate(e) {
      const t = this;
      const n = this.props;
      const i = n.checked;
      const r = n.value;
      i !== e.checked ? this.invokeWithCheckboxGroup(((e) => {
        e.updateCheckbox(t);
      }
      )) : Object(u.a)(i) && r !== e.value && this.invokeWithCheckboxGroup(((t) => {
        t.replaceCheckboxValue(e.value, r);
      }
      ));
    },
    componentWillUnmount() {
      const e = this;
      this.invokeWithCheckboxGroup(((t) => {
        t.removeCheckbox(e);
      }
      ));
    },
    invokeWithCheckboxGroup(e) {
      const t = this.context.checkboxGroup;
      t && !this.props.controlled && e(t);
    },
    reset() {
      const e = this;
      this.invokeWithCheckboxGroup(((t) => {
        const n = t.state.value || [];
        e.setState({
          checked: n.indexOf(e.props.value) !== -1
        });
      }
      ));
    },
    onChange(e) {
      e.stopPropagation && e.stopPropagation();
      const t = this.props;
      const n = t.controlled;
      const i = t.onChange;
      const r = t.value;
      const a = e.target.checked;
      n || this.setState({
        checked: a
      }),
      this.invokeWithCheckboxGroup(((e) => {
        e.onChange({
          detail: {
            value: a,
            value2: r
          }
        });
      }
      )),
      i && i({
        detail: {
          value: a
        }
      }),
      p.b.logInput(this, {
        changed: !0,
        inputType: d.b.CHECKBOX
      });
    },
    render() {
      const e = this.props;
      const t = e.disabled;
      const n = e.className;
      const i = e.style;
      const o = e.id;
      const s = e.controlled;
      const c = e.color;
      const l = e.checked;
      return r.a.createElement(a.a, {
        prefixCls: 'a-checkbox',
        className: n,
        id: o,
        style: i,
        checked: s ? Object(u.a)(l) : this.state.checked,
        disabled: t,
        onChange: this.onChange,
        color: c
      });
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(61);
  const c = n(29);
  const l = n(1);
  const u = n(5);
  const p = n.n(u);
  const d = n(113);
  const h = n(82);
  const f = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  const m = (c.b.reset,
  f(c.b, ['reset']));
  const v = Object(l.c)({
    pure: !1,
    name: 'checkbox-group'
  })(p()({
    displayName: 'CheckboxGroup',
    mixins: [m],
    getInitialState() {
      return this.myContext = {
        checkboxGroup: this
      },
      this.checkboxs = [],
      {};
    },
    reset() {
      if (!this.props.controlled) {
        this.state.value = this.initialValue.concat();
        for (let e = 0, t = this.checkboxs; e < t.length; e++) {
          t[e].reset();
        }
        this.updateFormValue();
      }
    },
    updateCheckbox(e) {
      this.checkboxs.indexOf(e) === -1 && this.checkboxs.push(e);
      const t = e.props;
      const n = t.value;
      const i = t.checked;
      this.updateValue(n, Object(h.a)(i));
    },
    replaceCheckboxValue(e, t) {
      const n = this.state.value;
      if (n) {
        const i = n.indexOf(e);
        i !== -1 && n.splice(i, 1, t);
      }
    },
    updateValue(e, t) {
      const n = this.state.value && this.state.value || [];
      if (t && n.indexOf(e) === -1) {
        n.push(e);
      } else if (!t) {
        const i = n.indexOf(e);
        i !== -1 && n.splice(i, 1);
      }
      this.state.value = n;
    },
    removeCheckbox(e) {
      const t = this.initialValue;
      const n = this.checkboxs;
      const i = n.indexOf(e);
      if (i !== -1) {
        n.splice(i, 1);
        const r = e.props.value;
        const a = this.state.value;
        let o = -1;
        if (t && (o = t.indexOf(r)),
        o !== -1 && t.splice(o, 1),
        a) {
          const s = a.indexOf(r);
          s !== -1 && a.splice(s, 1);
        }
      }
    },
    onChange(e) {
      const t = e.detail;
      const n = t.value2;
      const i = t.value;
      this.updateValue(n, i),
      this.updateFormValue(),
      this.props.onChange && this.props.onChange({
        detail: {
          value: this.state.value
        }
      });
    },
    render() {
      return o.a.createElement(d.a.Provider, {
        value: this.myContext
      }, o.a.createElement(s.a, r()({}, this.props, {
        presetDOMProps: {
          role: 'group'
        }
      })));
    }
  }));
  t.default = v;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(4);
  const l = n(8);
  const u = n(6);
  const p = n(47);
  const d = n(20);
  let h = 0;
  const f = Object(a.c)({
    name: 'cover-image',
    isNativeComponent() {
      return Object(c.isNativeComponentForLyra)('cover-image');
    }
  })(s()({
    displayName: 'CoverImage',
    getInitialState() {
      return this.useNative = (Object(a.g)().inPageRenderType || '').indexOf('ALL') === -1 && this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.useNative && (this.renderCoverImage(),
      this.coverImageEvents = Object(l.a)(document, {
        'nbcomponent.image.bindtap': this.onCoverImageTap
      }));
    },
    componentDidUpdate() {
      this.useNative && this.renderCoverImage();
    },
    componentWillUnmount() {
      this.useNative && (Object(u.a)('NBComponent.remove', {
        element: this.getId()
      }),
      this.coverImageEvents.remove());
    },
    onCoverImageTap(e) {
      const t = e.data.element;
      const n = this.props.onTap;
      t === this.getId() && (Object(d.c)(this, !0, !!n, !1),
      n && n());
    },
    onTap() {
      const e = this.props.onTap;
      Object(d.c)(this, !1, !!e, !1),
      e && e();
    },
    getId() {
      return this.id ? this.id : (this.id = this.props.id || `appx_coverImage_${++h}`,
      this.id);
    },
    dispatchCoverImageReRender() {
    },
    renderCoverImage() {
      const e = this.props;
      const t = e.$appx;
      const n = e.src;
      this.coverImageRef.parentNode.dataset.component !== 'cover-view' ? Object(u.a)('NBComponent.render', {
        version: '2.0',
        element: this.getId(),
        data: {
          src: t.getNormalizedSrc(n)
        }
      }) : this.dispatchCoverImageReRender(),
      Object(p.a)();
    },
    saveRef(e) {
      this.coverImageRef = e;
    },
    render() {
      const e = this.props;
      const t = e.$appx;
      const n = e.src;
      const i = e.style;
      const a = e.className;
      return this.useNative ? r.a.createElement('div', {
        style: i,
        className: `nbcomponent ${a}`,
        id: this.getId(),
        'nbcomponent-type': 'image',
        'nbcomponent-data': `{"src": "${t.getNormalizedSrc(n)}"}`,
        ref: this.saveRef
      }) : r.a.createElement('img', {
        style: i,
        className: a,
        id: this.getId(),
        src: t.getNormalizedSrc(n),
        onClick: this.onTap,
        ref: this.saveRef
      });
    }
  }));
  t.default = f;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(8);
  const l = n(6);
  const u = n(57);
  const p = n(4);
  const d = n(108);
  const h = n(47);
  const f = n(20);
  let m = 0;
  const v = Object(a.c)({
    name: 'cover-view',
    isNativeComponent() {
      return Object(p.isNativeComponentForLyra)('cover-view');
    }
  })(s()({
    displayName: 'CoverView',
    getInitialState() {
      return this.useNative = (Object(a.g)().inPageRenderType || '').indexOf('ALL') === -1 && this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.useNative && (this.coverViewRef.parentNode.dataset.component !== 'cover-view' && (this.renderCoverView = Object(d.a)(this.renderCoverView, 30, void 0)),
      this.renderCoverView(),
      this.coverViewEvents = Object(c.a)(document, {
        'nbcomponent.text.bindtap': this.onCoverViewTap
      }),
      this.NBTypeChanged = !1,
      this.coverViewReRenderEvents = Object(c.a)(document, {
        coverViewReRender: this.onCoverViewReRender,
        coverImageReRender: this.onCoverViewReRender
      }));
    },
    componentDidUpdate() {
      this.useNative && (this.checkNBTypeChanged(),
      this.renderCoverView());
    },
    componentWillUnmount() {
      this.useNative && (Object(l.a)('NBComponent.remove', {
        element: this.getId()
      }),
      this.coverViewEvents.remove(),
      this.coverViewReRenderEvents.remove());
    },
    onCoverViewTap(e) {
      const t = e.data.element;
      const n = this.props.onTap;
      t === this.getId() && (Object(f.c)(this, !0, !!n, !1),
      n && n());
    },
    onTap() {
      const e = this.props.onTap;
      Object(f.c)(this, !1, !!e, !1),
      e && e();
    },
    onCoverViewReRender(e) {
      const t = e.detail.node;
      this.coverViewRef.parentNode.dataset.component !== 'cover-view' && this.coverViewRef.contains(t) && this.renderCoverView();
    },
    getId() {
      return this.id ? this.id : (this.id = this.props.id || `appx_coverView_${++m}`,
      this.id);
    },
    checkNBTypeChanged() {
      this.NBTypeChanged && (Object(l.a)('NBComponent.remove', {
        version: '2.0',
        element: this.getId()
      }),
      this.NBTypeChanged = !1);
    },
    dispatchCoverViewReRender() {
    },
    renderCoverView() {
      if (this.coverViewRef) {
        const e = window.getComputedStyle(this.coverViewRef, null);
        const t = Object(u.a)(e['background-color']);
        const n = parseInt(e['border-width']);
        const i = e['border-style'];
        const r = Object(u.a)(e['border-color']);
        const a = parseInt(e['border-radius']);
        const o = this.coverViewRef.parentNode;
        if (!1 === this.hasNotStringTypeChild) {
          const s = this.coverViewRef.innerHTML;
          const c = Object(u.a)(e.color);
          const p = parseFloat(e['font-size'])
            .toFixed(2);
          const d = e['text-align'];
          this.coverViewRef.setAttribute('nbcomponent-data', `{"text": "${s}", "backgroundColor": "${t}", "color": "${c}", "fontSize": "${p}", "textAlign": "${d}", "borderWidth": "${n}", "borderStyle": "${i}", "borderColor": "${r}", "borderRadius": "${a}"}`),
          o.dataset.component !== 'cover-view' ? Object(l.a)('NBComponent.render', {
            version: '2.0',
            element: this.getId(),
            data: {
              text: s,
              backgroundColor: t,
              color: c,
              fontSize: p,
              textAlign: d,
              borderWidth: n,
              borderStyle: i,
              borderColor: r,
              borderRadius: a
            }
          }) : this.dispatchCoverViewReRender();
        } else {
          const f = this.props.scrollTop;
          const m = void 0 === f ? 0 : f;
          e['overflow-y'] === 'scroll' && this.coverViewRef.setAttribute('nbcomponent-type', 'scrollview'),
          this.coverViewRef.setAttribute('nbcomponent-data', `{"backgroundColor": "${t}", "scrollTop": "${m}", "borderWidth": "${n}", "borderStyle": "${i}", "borderColor": "${r}", "borderRadius": "${a}"}`),
          o.dataset.component !== 'cover-view' ? Object(l.a)('NBComponent.render', {
            version: '2.0',
            element: this.getId(),
            data: {
              backgroundColor: t,
              scrollTop: m,
              borderWidth: n,
              borderStyle: i,
              borderColor: r,
              borderRadius: a
            }
          }) : this.dispatchCoverViewReRender();
        }
        Object(h.a)();
      }
    },
    saveRef(e) {
      this.coverViewRef = e;
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.children;
      if (!this.useNative) {
        return r.a.createElement('div', {
          className: n,
          id: this.getId(),
          style: t,
          onClick: this.onTap
        }, i);
      }
      let a = !1;
      return r.a.Children.forEach(i, ((e) => {
        typeof e !== 'string' && typeof e !== 'number' && (a = !0,
        'container');
      }
      )),
      void 0 === this.NBTypeChanged ? this.hasNotStringTypeChild = a : a !== this.hasNotStringTypeChild && (this.hasNotStringTypeChild = a,
      this.NBTypeChanged = !0),
      r.a.createElement('div', {
        className: `nbcomponent ${n}`,
        'data-component': 'cover-view',
        id: this.getId(),
        'nbcomponent-type': a ? 'container' : 'text',
        style: t,
        ref: this.saveRef
      }, i);
    }
  }));
  t.default = v;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(11);
  const p = n(9);
  const d = n(29);
  const h = Object(s.c)({
    pure: !1,
    name: 'form'
  })(l()({
    displayName: 'Form',
    getInitialState() {
      return this.myContext = {
        form: this
      },
      this.fieldsValue = {},
      this.fields = {},
      {};
    },
    registerField(e, t) {
      this.fields[e] = t;
    },
    setFieldValue(e, t) {
      this.fieldsValue[e] = t;
    },
    removeField(e) {
      delete this.fieldsValue[e],
      delete this.fields[e];
    },
    _onSubmit(e, t, n) {
      const i = {
        value: this.fieldsValue
      };
      t && (i.formId = t),
      n && (i.receiverFormId = n);
      const r = {
        detail: i,
        buttonTarget: {
          dataset: e || {}
        }
      };
      this.props.onSubmit(r);
    },
    submit(e) {
      const t = this;
      const n = this.props;
      const i = n.onSubmit;
      const r = n.reportSubmit;
      const a = n.receiverUserId;
      if (i) {
        if (r) {
          const o = {};
          a && (o.receiverUserId = a),
          Object(u.a)('requestTemplateData', o, ((n) => {
            t._onSubmit(e, n.formId, n.receiverFormId);
          }
          ));
        } else {
          this._onSubmit(e);
        }
      }
    },
    reset() {
      const e = this;
      Object(p.default)(this.fields)
        .forEach(((t) => {
          e.fields[t].reset();
        }
        )),
      this.props.onReset && this.props.onReset();
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.style;
      const i = e.id;
      const a = e.children;
      const s = e.$appx;
      return o.a.createElement(d.a.Provider, {
        value: this.myContext
      }, o.a.createElement('div', r()({
        className: t,
        style: n,
        id: i,
        role: 'form'
      }, s.getTrackerConfig()), a));
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(90);
  const c = n(81);
  const l = n(1);
  const u = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  t.default = Object(l.c)({
    name: 'icon'
  })(((e) => {
    const t = e.$appx;
    const n = e.className;
    const i = e.style;
    const a = e.id;
    const l = e.type;
    const p = e.mode;
    const d = u(e, ['$appx', 'className', 'style', 'id', 'type', 'mode']);
    const h = t && t.getDOMProps();
    return o.a.createElement('span', {
      className: n,
      style: r()({}, i),
      id: a,
      'aria-hidden': e['aria-hidden']
    }, l === 'loading' ? o.a.createElement(c.a, r()({
      mode: p
    }, h)) : o.a.createElement(s.a, r()({
      type: l
    }, d, h)));
  }
  ));
},
function (e, t, n) {
  n.r(t);
  let i;
  const r = n(3);
  const a = n.n(r);
  const o = n(0);
  const s = n.n(o);
  const c = n(5);
  const l = n.n(c);
  const u = n(21);
  const p = n.n(u);
  const d = n(46);
  const h = n(1);
  const f = n(29);
  const m = n(114);
  const v = n(57);
  const g = n(8);
  const b = n(9);
  const y = n(6);
  const _ = n(11);
  const w = n(2);
  const C = n(4);
  const x = n(12);
  const T = n(30);
  const S = n(25);
  const E = self;
  const k = {};
  const O = ['number', 'digit', 'idcard', 'numberpad', 'digitpad', 'idcardpad'];
  const
    P = function () {
      return i || (i = {
        value: '',
        type: 'text',
        password: !1,
        placeholder: '',
        disabled: !1,
        maxlength: 140,
        focus: !1,
        confirmType: 'done',
        confirmHold: !1,
        selectionStart: -1,
        selectionEnd: -1,
        controlled: !1,
        randomNumber: !1,
        enableNative: navigator.userAgent.indexOf('AlipayClient') !== -1 || Object(h.g)().enableNativeInput,
        enableNewNativeInput: !0
      }),
      i;
    };
  const N = s.a.createElement('param', {
    name: 'type',
    value: 'input'
  });
  const I = Object(h.c)({
    name: 'input',
    pure: !1,
    isNativeComponent(e) {
      if (w.o) return !1;
      const t = a()({}, P(), e);
      const n = t.enableNative && Object(C.isNativeComponentForLyra)('input') && !w.q && t.enableNewNativeInput && !!E.ENABLEINPAGEINPUT;
      return w.l ? t.type === 'text' && !t.password && n : n;
    }
  })(l()({
    displayName: 'Input',
    mixins: [f.b],
    getDefaultProps() {
      return P();
    },
    getInitialState() {
      const e = this.props;
      const t = e.focus;
      const n = e.enableNative;
      return this.a11yComponentEnable = h.h.getSwitch('a11yComponentEnable', !1),
      this.compositionend = !0,
      this.prevNewInputData = {},
      this.supportNative = n && !w.q && Object(C.isNativeComponent)(),
      this.useNewInput = this.props.$appx.isNativeComponent,
      this.useInputElement = w.r && Object(h.g)().useInputHoldPosition,
      {
        focused: t,
        compositionValue: ''
      };
    },
    componentDidMount() {
      this.useNewInput ? (w.l && !k[this.getId()] ? (this.readyForRender = !1,
      this.detachInputReady = Object(g.a)(document, {
        'nbcomponent.canrender': this.onNativeReady
      })) : (this.readyForRender = !0,
      this.renderNewInput(this.state.focused)),
      this.detachEvents = Object(g.a)(document, {
        'nbcomponent.input.input': this.onNewInputEvent,
        'nbcomponent.input.focus': this.onNewInputEvent,
        'nbcomponent.input.blur': this.onNewInputEvent
      })) : (this.state.focused && this.focus(!0),
      this.input && (this.inputEvents = Object(g.a)(this.input, {
        keydown: this.onKeyDown
      })));
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.focus;
      const i = t.syncInput;
      const r = t.value;
      const a = t.controlled;
      const o = this.state.compositionValue;
      const s = !!n && !e.focus && !this.state.focused;
      if (this.useNewInput) {
        o === '' && this.renderNewInput(s);
      } else if (w.r && !0 === this.compositionend && i && E._currentInput === this.input && E.AlipayH5Keyboad._getInputJsonWithElement && Object(_.a)('resetNativeKeyBoardInput', E.AlipayH5Keyboad._getInputJsonWithElement(E._currentInput)),
      this.updateNativeKeyBoardInput(),
      s && this.focus(!1),
      a && this.needHandleCursor()) {
        const c = this.lastInputValue;
        const l = this.lastCursor;
        this.lastInputValue = void 0,
        this.lastCursor = void 0,
        void 0 !== c && void 0 !== l && c === Object(x.a)(r) && this.input.setSelectionRange(l, l);
      }
    },
    componentWillUnmount() {
      this.input && this.inputEvents && this.inputEvents.remove(),
      this.useNewInput && (this.detachInputReady && this.detachInputReady.remove(),
      Object(y.a)('NBComponent.remove', {
        element: this.getId()
      }),
      this.detachEvents.remove());
    },
    isValidValue(e) {
      const t = this.props.type;
      let n = e.target && e.target.validity && e.target.validity.valid;
      return void 0 === n && (n = !0),
      (t !== 'digit' && t !== 'number' || !w.r) && t !== 'idcard' || n;
    },
    resetIOSNumberTypeValue() {
      const e = this.props.type;
      e !== 'digit' && e !== 'number' || !w.r || void 0 !== this.state.value && this.state.value !== '' || !this.input || (this.input.value = '');
    },
    getCurrentInputValue(e) {
      void 0 === e && (e = 'noRender');
      let t = Object(x.a)(this.getCurrentValue());
      if (t === null) {
        if (e === 'render') {
          Object(h.e)()
            .consoleToWorker('warn', 'waring: value is invalid, please check it, It may be a NaN or null, etc..., and we transfer it to ""');
        }
        t = '';
      }
      return `${t}`;
    },
    needHandleCursor() {
      const e = this.props.type;
      return document.activeElement === this.input && (!this.supportNative && O.indexOf(e) === -1 || this.supportNative && w.l && O.indexOf(e) > -1);
    },
    handleAndroidCustomKeyboard(e, t) {
      const n = this.state.focused;
      let i = !1;
      typeof e !== 'string' && typeof e !== 'number' || (i = (`${e}`).length === 0),
      w.l && O.indexOf(t) > -1 && n && !w.o && Object(y.a)('setInputTextChanged', {
        textEmpty: i
      });
    },
    updateNativeKeyBoardInput() {
      if (E._currentInput === this.input && !0 === this.compositionend) {
        const e = Object(v.a)(window.getComputedStyle(this.container, null).color);
        const t = {
          text: this.getCurrentInputValue(),
          color: e
        };
        void 0 !== this.lastCursor && (t.cursor = this.lastCursor),
        this.lastInputValue = void 0,
        this.lastCursor = void 0,
        Object(_.a)('updateNativeKeyBoardInput', t);
      }
    },
    onNewInputEvent(e) {
      const t = e.type;
      const n = e.data;
      const i = void 0 === n ? {} : n;
      const r = i.element;
      const a = i.marked;
      const o = i.value;
      if (r === this.getId() && void 0 !== t) {
        const s = t.substring(18);
        const c = this.props.controlled;
        switch (w.r && c || (this.prevNewInputData.value = o),
        s) {
          case 'focus':
            E._AppxActiveNativeElement = this.getId(),
            this.setState({
              focused: !0
            });
            break;
          case 'blur':
            this.setState({
              focused: !1
            });
            break;
          case 'input':
            var l = a !== 'Y' ? '' : `${o}`;
            var u = {};
            l !== this.state.compositionValue && (u.compositionValue = l),
            l !== '' || c || (u.value = o),
            Object(b.default)(u).length !== 0 && this.setState(u);
        }
      }
    },
    renderNewInput(e) {
      const t = this;
      if (this.readyForRender) {
        this.clearRenderDelay();
        const n = this.props;
        const i = n.type;
        const r = n.password;
        const o = n.disabled;
        const s = n.maxlength;
        const c = n.confirmType;
        const l = n.confirmHold;
        const u = n.selectionStart;
        const p = n.selectionEnd;
        const h = n.randomNumber;
        const f = n.cursor;
        const m = n.placeholder;
        const v = n.controlled;
        const g = window.getComputedStyle(this.input, null);
        const b = {
          backgroundColor: g.backgroundColor
        };
        if (w.l && (b.visibility = window.getComputedStyle(this.container, null).visibility,
        this.placeholder)) {
          const _ = window.getComputedStyle(this.placeholder, null);
          _ && (b.placeHolderValue = m,
          b.placeHolderColor = _.color,
          b.placeHolderSize = _.fontSize);
        }
        const C = a()({
          type: r ? 'password' : 'text',
          keyboard: i || 'text',
          value: this.getCurrentInputValue(),
          color: g.color,
          disabled: o,
          fontSize: g.fontSize,
          fontFamily: g.fontFamily,
          fontWeight: g.fontWeight,
          lineHeight: g.lineHeight,
          maxlength: s,
          canPaste: !0,
          textAlign: g.textAlign,
          selectionStart: u,
          selectionEnd: p,
          returnType: c,
          canReturn: !0 === l ? 'N' : 'Y',
          randomNumber: !0 === h ? 'Y' : 'N',
          cursor: f,
          controlled: v
        }, b);
        Object(d.a)(C, this.prevNewInputData) ? !this.state.focused && e && Object(y.a)('NBComponent.sendMessage', {
          actionType: 'focus',
          element: this.getId()
        }) : (this.prevNewInputData = C,
        Object(y.a)('NBComponent.render', {
          element: this.getId(),
          data: a()({
            tagName: 'input',
            position: 'static',
            placeholder: '',
            timestamp: `${(new Date()).getTime()}`,
            canPaste: !0
          }, C)
        }, ((n) => {
          n.success && e && Object(y.a)('NBComponent.sendMessage', {
            actionType: 'focus',
            element: t.getId()
          });
        }
        )));
      }
    },
    isSupportNativeControlled() {
      return w.r && O.indexOf(this.props.type) > -1 && !w.o;
    },
    onInput(e) {
      const t = this.props;
      const n = t.onInput;
      const i = t.controlled;
      const r = t.maxlength;
      const a = e.target.value;
      let o = !0;
      const s = {};
      if (this.supportNative && w.r) {
        this.compositionend = !0 !== e.nativeEvent.marked;
        const c = this.compositionend ? '' : `${a}`;
        c !== this.state.compositionValue && (s.compositionValue = c);
      }
      if (!w.o && !Object(C.isFeatureAvailable)('c_input_web_type_number_24_4') || this.supportNative || this.isValidValue(e)) {
        const l = (`${a}`).length;
        if (this.isSupportNativeControlled() && l > r && (o = !1),
        n && this.compositionend && o) {
          const u = {
            value: a
          };
          if (this.needHandleCursor()) {
            const p = this.input.selectionStart;
            i && p !== l && p !== 0 && (this.lastInputValue = a,
            this.lastCursor = p),
            u.cursor = p;
          } else {
            const d = e.nativeEvent && e.nativeEvent.cursor;
            void 0 !== d && (i && d !== l && (this.lastInputValue = a,
            this.lastCursor = d),
            u.cursor = d);
          }
          n({
            appxReturnHandle: ['bridge', 'setKeyboardCursor'],
            detail: u
          });
        }
        i && this.compositionend ? this.isSupportNativeControlled() || this.updateNativeKeyBoardInput() : s.value = a,
        Object(b.default)(s).length !== 0 && this.setState(s);
      } else {
        this.resetIOSNumberTypeValue();
      }
    },
    onFocus() {
      const e = this.props;
      const t = e.onFocus;
      const n = e.type;
      const i = this.getCurrentInputValue();
      this.handleAndroidCustomKeyboard(i, n),
      this.setState({
        focused: !0
      }),
      t && t({
        detail: {
          value: i
        }
      }),
      T.b.logFocus(this, i);
    },
    onBlur(e) {
      const t = this.props;
      const n = t.password;
      const i = t.type;
      !n && (this.supportNative || !(w.q || w.o || Object(C.isFeatureAvailable)('c_input_web_type_number_24_4')) && w.r && O.indexOf(i) > -1) && (w.r || !w.r && i === 'text') ? e.nativeEvent.simulated && this.blur() : this.blur();
    },
    blur() {
      const e = this.props.onBlur;
      const t = this.getCurrentInputValue();
      this.setState({
        focused: !1
      }),
      e && e({
        detail: {
          value: t
        }
      }),
      T.b.logBlur(this, S.b.TEXT, t);
    },
    onKeyDown(e) {
      const t = this.props.onConfirm;
      t && (e.keyCode === 13 || e.data && e.data.keyCode === 13) && t({
        detail: {
          value: e.target.value
        }
      });
    },
    focus(e) {
      void 0 === e && (e = !0),
      !this.props.disabled && this.input && Object(m.a)(this.input, e, this.supportNative);
    },
    saveContainer(e) {
      this.container = e;
    },
    saveInput(e) {
      this.input = e;
    },
    savePlaceholder(e) {
      this.placeholder = e;
    },
    handleComposition(e) {
      if (e.type === 'compositionend') {
        if (this.compositionend) return;
        this.compositionend = !0;
        const t = this.props;
        const n = t.onInput;
        const i = t.controlled;
        const r = e.target.value;
        const a = {
          value: r
        };
        const o = this.input.selectionStart;
        i && o !== (`${r}`).length && (this.lastInputValue = r,
        this.lastCursor = o),
        a.cursor = o,
        i && !n && this.setState({
          value: this.getCurrentInputValue()
        }),
        n && n({
          appxReturnHandle: ['bridge', 'setKeyboardCursor'],
          detail: a
        });
      } else {
        this.compositionend = !1;
      }
    },
    getId() {
      return this.id ? this.id : (this.id = `${this.props.id}__object`,
      this.id);
    },
    onNativeReady(e) {
      e && e.elementid !== this.getId() || (this.readyForRender = !0,
      k[this.getId()] = !0,
      this.renderNewInput(this.state.focused));
    },
    clearRenderDelay() {
      this.detachInputReady && (this.detachInputReady.remove(),
      this.detachInputReady = null);
    },
    onFormSubmit(e) {
      return e.preventDefault(),
      !1;
    },
    render() {
      let e;
      const t = this.props;
      const n = t.placeholder;
      const i = t.type;
      const r = t.password;
      const o = t.disabled;
      const c = t.maxlength;
      const l = t.className;
      const u = t.style;
      const d = t.id;
      const h = t.placeholderStyle;
      const f = t.placeholderClass;
      const m = t.confirmType;
      const v = t.confirmHold;
      const g = t.selectionStart;
      const b = t.selectionEnd;
      const y = t.randomNumber;
      const _ = t.cursor;
      const x = t.controlled;
      const T = t.$appx;
      const
        S = this.compositionend ? this.getCurrentInputValue('render') : this.state.value;
      this.handleAndroidCustomKeyboard(S, i);
      const E = this.state.compositionValue;
      const k = {
        type: 'text',
        onInput: this.onInput
      };
      r ? k.type = 'password' : O.indexOf(i) > -1 && (k['data-keyboard'] = i,
      k['data-randomnumber'] = !0 === y ? 'Y' : 'N',
      !w.o && !Object(C.isFeatureAvailable)('c_input_web_type_number_24_4') || this.supportNative || (i !== 'idcard' ? (k.type = 'number',
      k.step = 'any') : k.pattern = '[0-9]*[x|X]?$')),
      w.o && i === 'search' && (k.type = 'search'),
      this.supportNative || k.type !== 'text' && k.type !== 'search' || !w.r || (k.onCompositionStart = this.handleComposition,
      k.onCompositionEnd = this.handleComposition),
      !r && this.supportNative && (w.r || !w.r && k.type === 'text') && (k['data-keyboard'] = i,
      k['data-selection-start'] = g,
      k['data-selection-end'] = b,
      k['data-return-type'] = m,
      k['data-return'] = !0 === v ? 'N' : 'Y',
      void 0 !== _ && (k['data-cursor'] = _),
      this.isSupportNativeControlled() && (k['data-controlled'] = x ? 'Y' : 'N'));
      const P = p()(((e = {})['a-input-placeholder'] = !0,
      e[f] = !!f,
      e));
      const I = this.a11yComponentEnable && T && T.getDOMProps() || {};
      const A = s.a.createElement('input', a()({
        ref: this.saveInput,
        className: 'a-input-content',
        value: S,
        disabled: o,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        maxLength: c
      }, I, k));
      const j = this.useInputElement ? s.a.createElement('input', {
        className: `a-input-content nbcomponentanimation-${this.getId()}`,
        id: this.getId(),
        type: 'text',
        'data-component-type': 'input',
        'data-disabled': o,
        ref: this.saveInput
      }) : s.a.createElement('object', {
        className: `a-input-content  nbcomponentanimation-${this.getId()}`,
        id: this.getId(),
        type: 'application/view'
      }, N, s.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }));
      return s.a.createElement('div', {
        className: l,
        id: d,
        style: u,
        ref: this.saveContainer
      }, s.a.createElement('div', {
        className: 'a-input-wrap'
      }, S === '' && E === '' && n && s.a.createElement('div', {
        className: P,
        style: h ? T.getNormalizedStyle(h) : {},
        ref: this.savePlaceholder
      }, s.a.createElement('span', null, n)), this.useNewInput && !this.useInputElement ? s.a.createElement('input', a()({
        ref: this.saveInput,
        style: {
          position: 'absolute',
          visibility: 'hidden',
          zIndex: 0
        }
      }, I, {
        className: 'a-input-content',
        'data-id': this.getId()
      })) : null, this.useNewInput ? j : k.type == 'search' ? s.a.createElement('form', {
        action: '',
        onSubmit: this.onFormSubmit
      }, A) : A));
    }
  }));
  t.default = I;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(1);
  const u = n(32);
  const p = n(6);
  const d = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };

  function h(e, t) {
    void 0 === t && (t = !0),
    e && (e.dataset.id ? Object(p.a)('NBComponent.sendMessage', {
      actionType: 'focus',
      element: e.dataset.id
    }) : (t && e.click(),
    e.focus()));
  }

  t.default = Object(l.c)({
    pure: !1,
    name: 'label'
  })(c()({
    onClick() {
      const e = this.props.for;
      if (e) {
        let t;
        try {
          t = document.querySelector(`#${e} input, #${e} textarea`);
        } catch (t) {
          Object(u.a)(t),
          Object(l.e)()
            .consoleToWorker('error', `${e} 是非法值，label组件for属性值必须由字母开头`);
        }
        h(t);
      } else {
        this.labelRoot && h(this.labelRoot.querySelector('input, textarea'), !1);
      }
    },
    saveLabel(e) {
      this.labelRoot = e;
    },
    render() {
      const e = this.props;
      const t = (e.$appx,
      e['style-scope'],
      d(e, ['$appx', 'style-scope']));
      return delete t.for,
      o.a.createElement('label', r()({}, t, {
        onClick: this.onClick,
        ref: this.saveLabel
      }));
    }
  }));
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(21);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(81);
  const p = n(16);
  const d = n(111);
  const h = n(11);
  const f = n(6);
  const m = n(8);
  const v = 'a-lifestyle';
  let g = null;
  const b = r.a.createElement(u.a, {
    style: {
      width: 20,
      height: 20
    }
  });
  const y = r.a.createElement(u.a, null);
  const _ = Object(s.c)({
    name: 'lifestyle'
  })(l()({
    displayName: 'Lifestyle',
    mixins: [Object(p.b)()],
    getDefaultProps() {
      return {
        hoverStartTime: 20,
        hoverStayTime: 70,
        hoverClass: 'a-button-active'
      };
    },
    getInitialState() {
      return g = g || this,
      {
        loading: !0,
        btnLoading: !0,
        error: '',
        name: 'test',
        followed: !1,
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/pGVdjcoWrmDEBDRnhsCc.jpg'
      };
    },
    componentDidMount() {
      g === this && (this.syncStatus(),
      this.documentEvents = Object(m.a)(document, {
        resume: this.syncStatus
      }),
      this.logSpmExpoOrClick('a192.b8091.c19417', 'exposure'));
    },
    componentWillUnmount() {
      g = null,
      this.documentEvents && this.documentEvents.remove();
    },
    logSpmExpoOrClick(e, t) {
      Object(f.a)('remoteLog', {
        type: 'monitor',
        bizType: 'TINYAPP',
        logLevel: 2,
        param1: Object(s.e)()
          .getPagePath(),
        spmId: e,
        actionId: t
      });
    },
    syncStatus() {
      const e = this;
      const t = this.props.publicId;
      Object(h.a)('getLifestyleInfo', {
        publicId: t
      }, ((t) => {
        'error' in t ? e.setState({
          loading: !1,
          btnLoading: !1,
          error: !0
        }) : (t.logo && (t.logo = t.logo.replace(/\[pixelWidth\]/g, '128')),
        e.setState({
          loading: !1,
          btnLoading: !1,
          followed: t.isFollowed,
          icon: t.logo,
          name: `${t.name} - 生活号`
        }));
      }
      ));
    },
    addFollow() {
      const e = this;
      const t = this.props;
      const n = t.publicId;
      const i = t.onFollow;
      this.setState({
        btnLoading: !0
      }),
      this.logSpmExpoOrClick('a192.b8091.c19417.d35174', 'clicked'),
      Object(h.a)('addFollow', {
        publicId: n,
        sourceId: 'tinyApp'
      }, ((t) => {
        let n = !1;
        t.success === 'true' && (n = !0,
        i && i()),
        e.setState({
          btnLoading: !1,
          followed: n
        }),
        Object(f.a)('toast', {
          content: n ? '关注成功' : '关注失败'
        });
      }
      ));
    },
    jumpToLifestyle() {
      const e = this.props.publicId;
      this.logSpmExpoOrClick('a192.b8091.c19417.d35175', 'clicked'),
      Object(h.a)('startApp', {
        appId: '20000042',
        param: {
          publicBizType: 'LIFE_APP',
          publicId: e,
          sourceId: 'tinyApp'
        }
      });
    },
    jump(e) {
      const t = this;
      e.stopPropagation(),
      this.state.followed ? this.jumpToLifestyle() : Object(f.a)('confirm', {
        title: '提示',
        message: '确认关注此生活号?',
        okButton: '关注'
      }, ((e) => {
        !0 === e.ok ? (t.addFollow(),
        t.logSpmExpoOrClick('a192.b8091.c19417.d35176', 'clicked')) : t.logSpmExpoOrClick('a192.b8091.c19417.d35177', 'clicked');
      }
      ));
    },
    saveHoverRoot(e) {
      this.hoverRoot = e;
    },
    render() {
      let e;
      if (g !== this) return null;
      const t = this.state;
      const n = t.loading;
      const i = t.followed;
      const a = t.name;
      const s = t.icon;
      const c = t.error;
      const l = t.btnLoading;
      const u = this.props.memo;
      if (c) return null;
      const p = o()(((e = {})[v] = !0,
      e[`${v}-loading`] = n,
      e[`${v}-high`] = typeof u === 'string',
      e));
      return n ? r.a.createElement('div', {
        className: p
      }, b) : r.a.createElement('div', {
        className: p,
        onClick: this.jumpToLifestyle
      }, r.a.createElement('div', {
        className: `${v}-name-wrap`
      }, r.a.createElement('img', {
        src: s,
        className: `${v}-icon`
      }), u ? r.a.createElement('div', {
        className: `${v}-memo`
      }, r.a.createElement('div', {
        className: `${v}-name`
      }, a), r.a.createElement('div', {
        className: `${v}-desc`
      }, u)) : r.a.createElement('span', {
        className: `${v}-name`
      }, a)), r.a.createElement('div', {
        className: `${v}-btn-wrap`
      }, l ? y : r.a.createElement(d.a, {
        className: 'a-button a-lifestyle-btn',
        type: 'ghost',
        onClick: this.jump,
        deepRef: this.saveHoverRoot,
        onTouchStart: this.onHoverTouchStart,
        onTouchEnd: this.onHoverTouchEnd,
        onTouchCancel: this.onHoverTouchCancel
      }, i ? '查看' : '关注')));
    }
  }));
  t.default = _;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(5);
  const o = n.n(a);
  const s = n(1);
  const c = n(4);
  const l = n(6);
  const u = n(22);
  const p = r.a.createElement('param', {
    name: 'type',
    value: 'lottieview'
  });
  const d = Object(s.c)({
    name: 'lottie',
    isNativeComponent() {
      return Object(c.isNativeComponentForLyra)('lottie');
    },
    trackPageUpdateForIOS: !0
  })(o()({
    displayName: 'Lottie',
    mixins: [u.a],
    getDefaultProps() {
      return {
        autoplay: !1,
        speed: 1,
        repeatCount: 0,
        autoReverse: !1,
        variableLottie: !1,
        variableMap: null,
        renderType: '',
        downgradeLevel: '',
        scene: ''
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.onDidMountForNative();
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        const t = e.autoplay;
        const n = e.path;
        const i = e.speed;
        const r = e.repeatCount;
        const a = e.autoReverse;
        const o = e.$appx;
        const s = e.assetsPath;
        const c = e.placeholder;
        const u = e.djangoId;
        const p = e.md5;
        const d = e.optimize;
        const h = e.variableLottie;
        const f = e.variableMap;
        const m = e.renderType;
        const v = e.downgradeLevel;
        const g = e.scene;
        const b = {
          autoplay: t,
          path: o.getNormalizedSrc(n),
          speed: i,
          repeatCount: r,
          autoReverse: a,
          assetsPath: o.getNormalizedSrc(s),
          placeholder: o.getNormalizedSrc(c),
          djangoId: u,
          md5: p,
          optimize: d,
          variableLottie: h,
          variableMap: f,
          renderType: m,
          downgradeLevel: v,
          scene: g
        };
        Object(l.a)('NBComponent.render', {
          element: this.getId(),
          data: b
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      return this.useNative ? r.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: t,
        id: i,
        type: 'application/view',
        role: 'application'
      }, p, r.a.createElement('param', {
        name: 'id',
        value: this.getId()
      })) : this.getUnsupportJSX();
    }
  }));
  t.default = d;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(4);
  const l = n(6);
  const u = n(28);
  const p = n(22);
  const d = ['src', 'mode', 'autoplay', 'muted', 'orientation', 'objectFit', 'backgroundMute', 'minCache', 'maxCache', 'extraInfo', 'floatingMode'];
  const h = r.a.createElement('param', {
    name: 'type',
    value: 'live-player'
  });
  const f = Object(a.c)({
    name: 'live-player',
    isNativeComponent() {
      return Object(c.isNativeComponentForLyra)('live-player');
    },
    trackPageUpdateForIOS: !0
  })(s()({
    displayName: 'LivePlayer',
    mixins: [u.a, p.a],
    getDefaultProps() {
      return {
        src: void 0,
        mode: 'live',
        autoplay: !1,
        muted: !1,
        orientation: 'vertical',
        objectFit: 'contain',
        backgroundMute: !1,
        minCache: 1,
        maxCache: 3,
        floatingMode: 'none'
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.onDidMountForNative();
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        for (var e = {}, t = 0; t < d.length; t++) {
          const n = d[t];
          e[n] = this.props[n];
        }
        e['extra-info'] = this.props.extraInfo,
        Object(c.isFeatureAvailable)(c.EInsideFeature.c_floatingModeUseUserPassedValue_24_7) || e.floatingMode !== 'miniprogram' || (e.floatingMode = 'microapp'),
        Object(l.a)('NBComponent.render', {
          element: this.getId(),
          data: e
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      const a = e.mode;
      const o = e.src;
      return this.checkPermission('live-player') ? this.useNative ? r.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: t,
        id: i,
        type: 'application/view',
        role: 'application'
      }, h, r.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }), r.a.createElement('param', {
        name: 'mode',
        value: a
      }), r.a.createElement('param', {
        name: 'src',
        value: o
      })) : this.getUnsupportJSX() : this.getPermissionJSX({
        className: n,
        style: t,
        id: i
      });
    }
  }));
  t.default = f;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);
  const o = n(5);
  const s = n.n(o);
  const c = n(4);
  const l = n(6);
  const u = n(28);
  const p = n(22);
  const d = r.a.createElement('param', {
    name: 'type',
    value: 'live-pusher'
  });
  const h = Object(a.c)({
    name: 'live-pusher',
    isNativeComponent() {
      return Object(c.isNativeComponentForLyra)('live-pusher');
    },
    trackPageUpdateForIOS: !0
  })(s()({
    displayName: 'LivePusher',
    mixins: [u.a, p.a],
    getDefaultProps() {
      return {
        url: '',
        mode: 'RTC',
        autopush: !1,
        muted: !1,
        enableCamera: !0,
        autoFocus: !0,
        orientation: !1,
        beauty: 0,
        whiteness: 0,
        aspect: '9:16',
        minBitrate: 200,
        maxBitrate: 1e3,
        waitingImage: void 0,
        waitingImageHash: void 0,
        zoom: !1,
        backgroundMute: !1,
        enableAgc: !0,
        enableAns: !0,
        record: !1,
        remoteMirror: !1,
        localMirror: 'auto'
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      {};
    },
    componentDidMount() {
      this.onDidMountForNative();
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    renderNativeComponent() {
      if (this.readyForRender && this.useNative) {
        this.clearRenderDelay();
        const e = this.props;
        const t = e.url;
        const n = e.mode;
        const i = e.autopush;
        const r = e.muted;
        const a = e.enableCamera;
        const o = e.autoFocus;
        const s = e.orientation;
        const c = e.beauty;
        const u = e.whiteness;
        const p = e.aspect;
        const d = e.minBitrate;
        const h = e.maxBitrate;
        const f = e.waitingImage;
        const m = e.waitingImageHash;
        const v = e.zoom;
        const g = e.backgroundMute;
        const b = e.devicePosition;
        const y = e.enableAgc;
        const _ = e.enableAns;
        const w = e.record;
        const C = e.remoteMirror;
        const x = e.localMirror;
        Object(l.a)('NBComponent.render', {
          element: this.getId(),
          data: {
            url: t,
            mode: n,
            autopush: i,
            muted: r,
            enableCamera: a,
            autoFocus: o,
            orientation: s,
            beauty: c,
            whiteness: u,
            aspect: p,
            minBitrate: d,
            maxBitrate: h,
            waitingImage: f,
            waitingImageHash: m,
            zoom: v,
            backgroundMute: g,
            devicePosition: b,
            enableAgc: y,
            enableAns: _,
            record: w,
            remoteMirror: C,
            localMirror: x
          }
        });
      }
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      const a = e.mode;
      const o = e.url;
      const s = e.remoteMirror;
      const c = e.localMirror;
      return this.checkPermission('live-pusher') ? this.useNative ? r.a.createElement('object', {
        className: `${n} nbcomponentanimation-${this.getId()}`,
        style: t,
        id: i,
        type: 'application/view',
        role: 'application'
      }, d, r.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }), r.a.createElement('param', {
        name: 'mode',
        value: a
      }), r.a.createElement('param', {
        name: 'url',
        value: o
      }), r.a.createElement('param', {
        name: 'remoteMirror',
        value: s
      }), r.a.createElement('param', {
        name: 'localMirror',
        value: c
      })) : this.getUnsupportJSX() : this.getPermissionJSX({
        className: n,
        style: t,
        id: i
      });
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(1);
  const u = n(8);
  const p = n(100);
  const d = n(6);
  const h = n(115);

  function f(e, t) {
    void 0 === t && (t = []);
    for (let n = 0, i = t; n < i.length; n++) {
      const r = i[n];
      if (e === r.root || r.root.contains(e)) return r;
    }
  }

  const m = Object(l.c)({
    name: 'movable-area'
  })(c()({
    displayName: 'MovableArea',
    getInitialState() {
      return this.myContext = {
        movableArea: this
      },
      this.movableViews = [],
      this.triangle = {
        x: null,
        y: null
      },
      this.pinchDistance = null,
      this.scalingMV = null,
      {};
    },
    getDefaultProps() {
      return {
        scaleArea: !1
      };
    },
    componentDidMount() {
      this.movableAreaEvents = Object(u.a)(this.root, {
        touchstart: this.onMovableAreaTouchStart,
        touchmove: this.onMovableAreaTouchMove,
        touchend: this.onMovableAreaTouchEnd
      }),
      this.updateArea();
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.className;
      const i = t.style;
      const r = t.id;
      e.className === n && e.style === i && e.id === r || this.updateArea();
    },
    componentWillUnmount() {
      this.movableAreaEvents && this.movableAreaEvents.remove(),
      this.movableViews = [];
    },
    updateArea() {
      if (this.root) {
        let e;
        let t;
        const n = window.getComputedStyle(this.root);
        const
          i = this.root.getBoundingClientRect();
        e = ['Left', 'Right'].map(((e) => parseFloat(n[`border${e}Width`]) + parseFloat(n[`padding${e}`])
        )),
        t = ['Top', 'Bottom'].map(((e) => parseFloat(n[`border${e}Width`]) + parseFloat(n[`padding${e}`])
        )),
        this.height = i.height - t[0] - t[1],
        this.width = i.width - e[0] - e[1];
        for (let r = 0, a = this.movableViews; r < a.length; r++) {
          a[r].updateByParent();
        }
      }
    },
    updateMovableView(e) {
      const t = this.movableViews;
      t.indexOf(e) === -1 && (t.push(e),
      this.updateArea());
    },
    removeMovableView(e) {
      const t = this.movableViews;
      const n = t.indexOf(e);
      n !== -1 && (t.splice(n, 1),
      this.updateArea());
    },
    onMovableAreaTouchStart(e) {
      const t = e.touches;
      if (t && t.length > 1 && (Object(l.g)().allowsBounceVertical !== 'NO' && Object(d.a)('setCanPullDown', {
        canPullDown: !1
      }, ((e) => {
        console.log('setCanPullDown', e);
      }
      )),
      this.pinchDistance = Object(p.a)({
        x: t[0].pageX - t[1].pageX,
        y: t[0].pageY - t[1].pageY
      }),
      !this.props.scaleArea)) {
        const n = f(t[0].target, this.movableViews);
        const i = f(t[1].target, this.movableViews);
        this.scalingMV = n && n === i ? n : null;
      }
    },
    onMovableAreaTouchMove(e) {
      const t = e.touches;
      if (t && t.length > 1) {
        e.preventDefault();
        const n = {
          x: t[1].pageX - t[0].pageX,
          y: t[1].pageY - t[0].pageY
        };
        if (this.triangle.x !== null && this.pinchDistance > 0) {
          const i = Object(p.a)(n) / this.pinchDistance;
          this.updateScale(i);
        }
        this.triangle = n;
      }
    },
    onMovableAreaTouchEnd(e) {
      const t = e.touches;
      if (this.triangle = {
        x: null,
        y: null
      },
      this.pinchDistance = null,
      t && t.length > 0) {

      } else if (Object(l.g)().allowsBounceVertical !== 'NO' && Object(d.a)('setCanPullDown', {
        canPullDown: !0
      }, ((e) => {
        console.log(e);
      }
      )),
      e.changedTouches) {
        if (this.props.scaleArea) {
          for (let n = 0, i = this.movableViews; n < i.length; n++) {
            i[n].endScaleByMA();
          }
        } else {
          this.scalingMV && this.scalingMV.endScaleByMA();
        }
      }
    },
    updateScale(e) {
      if (e && e !== 1) {
        if (this.props.scaleArea) {
          for (let t = 0, n = this.movableViews; t < n.length; t++) {
            n[t].setScaleByMA(e);
          }
        } else {
          this.scalingMV && this.scalingMV.setScaleByMA(e);
        }
      }
    },
    saveRoot(e) {
      this.root = e;
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.id;
      const i = e.style;
      const a = e.children;
      const s = e.$appx;
      return o.a.createElement(h.a.Provider, {
        value: this.myContext
      }, o.a.createElement('div', r()({
        className: t,
        style: i,
        id: n,
        'data-component': 'movable-area',
        ref: this.saveRoot
      }, s.getTrackerConfig()), a));
    }
  }));
  t.default = m;
},
function (e, t, n) {
  n.r(t);
  const i = n(1);
  const r = Object(i.c)({
    name: 'picker-view-column'
  })((() => null
  ));
  t.default = r;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(1);
  t.default = Object(l.c)({
    name: 'progress'
  })(c()({
    statics: {
      getDerivedStateFromProps(e, t) {
        const n = e.active;
        const i = e.percent;
        return {
          lastActive: n,
          width: t.lastActive !== n && n ? 0 : `${i}%`
        };
      }
    },
    displayName: 'Progress',
    getInitialState() {
      return this.a11yComponentEnable = l.h.getSwitch('a11yComponentEnable', !1),
      {};
    },
    componentDidMount() {
      this.props.active && this.updateWidth();
    },
    componentDidUpdate(e) {
      this.props.active !== e.active && this.props.active && this.updateWidth();
    },
    updateWidth() {
      const e = this;
      setTimeout((() => {
        e.setState({
          width: `${e.props.percent}%`
        });
      }
      ), 10);
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.style;
      const i = e.id;
      const a = e.showInfo;
      const s = e.percent;
      const c = void 0 === s ? 0 : s;
      const l = e.strokeWidth;
      const u = e.color;
      const p = e.activeColor;
      const d = e.backgroundColor;
      const h = e.$appx;
      const f = d ? {
        backgroundColor: d
      } : {};
      const m = {
        borderColor: p || u,
        width: this.state.width
      };
      return l && (m.borderBottomWidth = `${l}px`),
      this.a11yComponentEnable ? o.a.createElement('div', {
        className: t,
        style: n,
        id: i
      }, o.a.createElement('div', r()({
        className: 'a-progress-container',
        role: 'progressbar',
        'aria-valuenow': c,
        'aria-valuemin': 0,
        'aria-valuemax': 100
      }, h.getDOMProps()), o.a.createElement('div', {
        style: f,
        className: 'a-progress-outer',
        'aria-hidden': 'true'
      }, o.a.createElement('div', {
        className: 'a-progress-bar',
        style: m
      }))), a && o.a.createElement('div', {
        role: 'presentation',
        className: 'a-progress-info'
      }, `${c}%`)) : o.a.createElement('div', {
        className: t,
        style: n,
        id: i
      }, o.a.createElement('div', {
        className: 'a-progress-container'
      }, o.a.createElement('div', r()({
        style: f,
        className: 'a-progress-outer',
        role: 'progressbar',
        'aria-valuenow': c,
        'aria-valuemin': 0,
        'aria-valuemax': 100
      }, h.getDOMProps()), o.a.createElement('div', {
        className: 'a-progress-bar',
        style: m
      }))), a && o.a.createElement('div', {
        role: 'presentation',
        className: 'a-progress-info'
      }, `${c}%`));
    }
  }));
},
function (e, t, n) {
  n.r(t);
  const i = n(1);
  const r = n(5);
  const a = n.n(r);
  const o = Object(i.c)({
    pure: !1,
    name: 'page-meta'
  })(a()({
    displayName: 'PageMeta',
    render() {
      return null;
    }
  }));
  t.default = o;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(112);
  const o = n(1);
  const s = n(5);
  const c = n.n(s);
  const l = n(117);
  const u = n(12);
  const p = n(30);
  const d = n(25);
  const h = Object(o.c)({
    name: 'radio'
  })(c()({
    displayName: 'Radio',
    statics: {
      isFormControl: 1,
      contextType: l.a
    },
    getDefaultProps() {
      return {
        checked: !1,
        disabled: !1,
        value: '',
        controlled: !1
      };
    },
    getInitialState() {
      const e = this;
      return this.invokeWithRadioGroup(((t) => {
        t.updateRadio(e);
      }
      )),
      {
        checked: !!Object(u.a)(this.props.checked)
      };
    },
    componentWillReceiveProps(e) {
      this.props.checked === e.checked || e.controlled || this.setState({
        checked: !!Object(u.a)(e.checked)
      });
    },
    componentDidUpdate(e) {
      const t = this;
      this.props.checked !== e.checked && this.invokeWithRadioGroup(((e) => {
        e.updateRadio(t);
      }
      ));
    },
    componentWillUnmount() {
      const e = this;
      this.invokeWithRadioGroup(((t) => {
        t.removeRadio(e);
      }
      ));
    },
    invokeWithRadioGroup(e) {
      const t = this.context.radioGroup;
      t && !this.props.controlled && e(t);
    },
    reset() {
      const e = this;
      this.invokeWithRadioGroup(((t) => {
        e.setState({
          checked: e.props.value === t.state.value
        });
      }
      ));
    },
    onGroupNotify() {
      const e = this;
      this.invokeWithRadioGroup(((t) => {
        const n = e.props.value === t.state.value;
        n !== e.state.checked && e.setState({
          checked: n
        });
      }
      ));
    },
    onChange(e) {
      e.stopPropagation && e.stopPropagation();
      const t = this.props;
      const n = t.controlled;
      const i = t.onChange;
      const r = t.value;
      const a = e.target.checked;
      a && (n || this.setState({
        checked: a
      }),
      this.invokeWithRadioGroup(((e) => {
        e.onChange({
          detail: {
            value: r,
            checked: a
          }
        });
      }
      )),
      i && i({
        detail: {
          value: a
        }
      })),
      p.b.logInput(this, {
        changed: !0,
        inputType: d.b.RADIO
      });
    },
    render() {
      const e = this.props;
      const t = e.disabled;
      const n = e.className;
      const i = void 0 === n ? '' : n;
      const o = e.id;
      const s = e.style;
      const c = e.color;
      const l = e.controlled;
      const p = e.checked;
      return r.a.createElement(a.a, {
        id: o,
        type: 'radio',
        prefixCls: 'a-radio',
        style: s,
        className: i,
        checked: l ? Object(u.a)(p) : this.state.checked,
        disabled: t,
        onChange: this.onChange,
        color: c
      });
    }
  }));
  t.default = h;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(61);
  const c = n(29);
  const l = n(1);
  const u = n(5);
  const p = n.n(u);
  const d = n(117);
  const h = n(12);
  const f = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  const m = (c.b.reset,
  f(c.b, ['reset']));
  const v = Object(l.c)({
    pure: !1,
    name: 'radio-group'
  })(p()({
    displayName: 'RadioGroup',
    mixins: [m],
    getInitialState() {
      this.myContext = {
        radioGroup: this
      },
      this.radios = [];
    },
    updateRadio(e) {
      const t = this.radios;
      const n = e.props;
      t.indexOf(e) === -1 && t.push(e),
      Object(h.a)(n.checked) && (this.state.value = n.value);
    },
    removeRadio(e) {
      const t = this.radios;
      const n = t.indexOf(e);
      n !== -1 && t.splice(n, 1);
    },
    onChange(e) {
      this.state.value = e.detail.value,
      this.updateFormValue();
      for (let t = 0, n = this.radios; t < n.length; t++) {
        n[t].onGroupNotify();
      }
      const i = this.props.onChange;
      i && i({
        detail: {
          value: this.state.value
        }
      });
    },
    reset() {
      if (!this.props.controlled) {
        this.state.value = this.initialValue;
        for (let e = 0, t = this.radios; e < t.length; e++) {
          t[e].reset();
        }
        this.updateFormValue();
      }
    },
    render() {
      return o.a.createElement(d.a.Provider, {
        value: this.myContext
      }, o.a.createElement(s.a, r()({}, this.props, {
        presetDOMProps: {
          role: 'radiogroup'
        }
      })));
    }
  }));
  t.default = v;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(16);
  const p = n(9);
  const d = n(8);
  const h = n(20);
  const f = {
    amp: '&',
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
    apos: '\''
  };

  function m() {
  }

  function v(e) {
    return e.replace(/&([a-zA-Z]*?);/g, ((e, t) => {
      if (f.hasOwnProperty(t) && f[t]) return f[t];
      if (/^#[0-9]{1,4}$/.test(t)) return String.fromCharCode(t.slice(1));
      if (/^#x[0-9a-f]{1,4}$/i.test(t)) return String.fromCharCode(`0${t.slice(1)}`);
      throw new Error(`HTML Entity "${e}" is not supported.`);
    }
    ));
  }

  const g = {
    a: 1,
    abbr: 1,
    b: 1,
    blockquote: 1,
    br: 1,
    code: 1,
    col: {
      span: 1,
      width: 1
    },
    colgroup: {
      span: 1,
      width: 1
    },
    dd: 1,
    del: 1,
    div: 1,
    dl: 1,
    dt: 1,
    em: 1,
    fieldset: 1,
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1,
    hr: 1,
    i: 1,
    img: {
      alt: 1,
      src: 1,
      height: 1,
      width: 1
    },
    ins: 1,
    label: 1,
    legend: 1,
    li: 1,
    ol: {
      start: 1,
      type: 1
    },
    p: 1,
    q: 1,
    span: 1,
    strong: 1,
    sub: 1,
    sup: 1,
    table: {
      width: 1
    },
    tbody: 1,
    td: {
      colspan: 1,
      height: 1,
      rowspan: 1,
      width: 1
    },
    tfoot: 1,
    th: {
      colspan: 1,
      height: 1,
      rowspan: 1,
      width: 1
    },
    thead: 1,
    tr: 1,
    ul: 1
  };
  const b = Object(s.c)({
    name: 'rich-text'
  })(l()({
    displayName: 'RichText',
    getDefaultProps() {
      return {
        nodes: []
      };
    },
    mixins: [Object(u.f)(), Object(u.d)(), Object(u.c)(), Object(u.e)()],
    componentDidMount() {
      this.tapEvent = Object(d.a)(this.root, {
        tap: this.onRichTextTap
      });
    },
    componentWillUnmount() {
      this.tapEvent && (this.tapEvent = this.tapEvent.remove());
    },
    onRichTextTap() {
      Object(h.c)(this, !1);
    },
    getNodeProps(e, t) {
      const n = this;
      const i = {};
      if (typeof e.attrs !== 'object') return {};
      const r = g[t];
      return Object(p.default)(e.attrs)
        .forEach(((t) => {
          const a = t.toLowerCase();
          const o = v(e.attrs[t]);
          a === 'class' ? i.className = o : a === 'style' ? i.style = n.props.$appx.getNormalizedStyle(o) : r && r.hasOwnProperty(a) && r[a] && (i[a] = o);
        }
        )),
      i;
    },
    parseNodes(e) {
      const t = this;
      const n = [];
      return e.forEach(((e) => {
        if (typeof e === 'object') {
          const i = void 0 === e.type || e.type === 'node' || e.type === '';
          const r = e.type === 'text' && typeof e.text === 'string' && e.text !== '';
          const a = typeof e.name === 'string' && e.name !== '';
          if (i && a) {
            const s = e.name.toLowerCase();
            if (g.hasOwnProperty(s) && g[s]) {
              let c = null;
              const l = t.getNodeProps(e, s);
              Array.isArray(e.children) && e.children.length && (c = t.parseNodes(e.children));
              const u = o.a.createElement(s, l, c);
              n.push(u);
            }
          } else {
            r && n.push(v(e.text));
          }
        }
      }
      )),
      n;
    },
    renderContent() {
      let e;
      const
        t = this.props.nodes;
      if (Array.isArray(t)) {
        try {
          e = this.parseNodes(t);
        } catch (t) {
          console.error(t),
          e = null;
        }
      } else {
        e = null,
        console.group(`${new Date()} nodes属性只支持 Array 类型`),
        console.warn('For developer:nodes属性只支持 Array 类型，请检查输入的值。'),
        console.groupEnd();
      }
      return e;
    },
    saveRoot(e) {
      this.root = e;
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.style;
      const i = e.id;
      const a = e.$appx;
      return o.a.createElement('div', r()({
        id: i,
        className: t,
        style: n,
        ref: this.saveRoot,
        onClick: m,
        onTouchStart: this.onTouchStart,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd,
        onTouchCancel: this.onTouchCancel
      }, a.getTrackerConfig()), this.renderContent());
    }
  }));
  t.default = b;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(21);
  const u = n.n(l);
  const p = n(1);
  const d = n(8);
  const h = n(16);
  const f = n(73);
  const m = n(2);
  const v = n(62);
  const g = n(89);
  const b = n(101);
  const y = n(12);
  const _ = n(4);
  const w = n(74);
  let C;
  const
    x = [Object(h.f)(), Object(h.e)()];
  w.a && x.push(w.a);
  let T;
  const
    S = function () {
      return void 0 === C && (C = Object(_.isFeatureAvailable)('f_supportAppxSwitch_24_8') ? p.h.getSwitch('swiperFixCircleAnimation248', !0) : Object(_.isFeatureAvailableWithDefault)('c_swiper_fixTouchRecircleAnimation_24_7', !0)),
      C;
    };
  t.default = Object(p.c)({
    pure: !1,
    name: 'swiper'
  })(c()({
    displayName: 'Swiper',
    mixins: x,
    getDefaultProps() {
      return {
        indicatorDots: !1,
        vertical: !1,
        autoplay: !1,
        circular: !1,
        current: 0,
        interval: 5e3,
        duration: 500,
        previousMargin: '0px',
        nextMargin: '0px',
        disableProgrammaticAnimation: !1,
        adjustVerticalHeight: Object(_.isFeatureAvailable)('c_swiper_adjustVerticalHeight_23_0'),
        adjustHeightWithHighestItem: Object(_.isFeatureAvailable)('c_swiper_adjustHeightWithHighestItem_23_0'),
        swipeRatio: 0.2,
        swipeSpeed: 0.05,
        touchAngle: 45
      };
    },
    getInitialState() {
      const e = this.filterChildrenAndReturnCount();
      const t = Object(y.a)(this.props.current);
      return this.current = t >= 0 && t <= e - 1 ? t : 0,
      {};
    },
    componentDidMount() {
      const e = this;
      const t = this.props;
      const n = t.autoplay;
      const i = t.vertical;
      this.trackSpeed = 0,
      this.trackTime = 0,
      this.currentPosition = -this.current,
      this.animationCfg = null,
      this.animateDiff = 0,
      this.isChanging = !1,
      n && this.startAutoplay(),
      this.documentEvents = Object(d.a)(document, {
        resume() {
          n && e.startAutoplay();
        },
        pause() {
          n && e.stopAutoplay();
        }
      }),
      this.SlidesRef && (this.slidesTouchEvents = Object(d.a)(this.SlidesRef, {
        touchstart: this.onSwiperTouchStart,
        touchmove: this.onSwiperTouchMove,
        touchend: this.onSwiperTouchEnd,
        touchcancel: this.onSwiperTouchEnd
      })),
      this.adjustHeight(i);
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.current;
      const i = t.autoplay;
      const r = t.interval;
      const a = t.vertical;
      const o = t.disableProgrammaticAnimation;
      this.adjustHeight(a);
      const s = this.filterChildrenAndReturnCount();
      if (n !== e.current && n !== this.current || s < this.current || s === 1) {
        const c = Object(y.a)(n);
        const l = s < this.current || s === 1;
        this.animationCfg = null,
        this.goToSlide({
          targetIndex: c,
          disableProgrammaticAnimation: !!l || o,
          source: 'didUpdate'
        });
      }
      !i || this.autoplayID && i === e.autoplay && r === e.interval || this.startAutoplay(),
      i || i === e.autoplay || this.stopAutoplay();
    },
    componentWillUnmount() {
      this.slidesTouchEvents && (this.slidesTouchEvents.remove(),
      this.slidesTouchEvents = null),
      this.documentEvents && this.documentEvents.remove(),
      this.stopAutoplay();
    },
    getDomOuterHeight(e) {
      if (e) {
        let t = e.offsetHeight;
        try {
          const n = window.getComputedStyle(e);
          t = parseInt(n.height || '0') + parseInt(n.marginTop || '0') + parseInt(n.marginBottom || '0');
        } catch (e) {
        }
        return t != t && (t = e.offsetHeight),
        t;
      }
      return 0;
    },
    getSlideHeight(e) {
      let t = 0;
      return e && e.childNodes[0] && (t = this.getDomOuterHeight(e.childNodes[0])),
      t;
    },
    adjustHeight(e) {
      const t = this.SlidesRef && this.SlidesRef.childNodes[0];
      const n = this.props;
      const i = n.adjustVerticalHeight;
      const r = n.adjustHeightWithHighestItem;
      if ((!e || i) && t && t.childNodes[0]) {
        let a = this.getSlideHeight(t);
        if (r) for (let o = a, s = 1; s < this.SlidesRef.childNodes.length; s++) (o = this.getSlideHeight(this.SlidesRef.childNodes[s])) > a && (a = o);
        parseInt(window.getComputedStyle(this.SwiperWrap).height) !== a && void 0 !== a && (this.SwiperWrap.style.height = `${a}px`);
      }
    },
    handleMarginUnit(e) {
      let t = e;
      return e.indexOf('rpx') >= 0 && (t = Object(v.a)(2 * parseInt(e))),
      t;
    },
    filterChildrenAndReturnCount() {
      const e = this.props.children;
      if (this.cacheChildren === e && void 0 !== this.cacheSlideCount) return this.cacheSlideCount;
      for (var t = [], n = 0, i = Object(b.a)(e); n < i.length; n++) {
        const r = i[n];
        r && t.push(r);
      }
      return this.cacheChildren = e,
      this.cacheSlideCount = t.length,
      this.handledChildren = t,
      this.cacheSlideCount;
    },
    autoplayIterator() {
      const e = this.filterChildrenAndReturnCount();
      if (!(e < 2)) {
        const t = this.current;
        this.goToSlide({
          targetIndex: t >= e - 1 ? 0 : t + 1,
          source: 'autoplay'
        });
      }
    },
    startAutoplay() {
      this.stopAutoplay();
      const e = this.props;
      const t = e.interval;
      const n = e.duration;
      this.filterChildrenAndReturnCount() > 1 && t > 0 && (this.autoplayID = setInterval(this.autoplayIterator, Math.max(n + 100, t)));
    },
    stopAutoplay() {
      this.autoplayID && (clearInterval(this.autoplayID),
      this.autoplayID = null);
    },
    animateSlider(e) {
      this.animationCfg = e,
      this.animationDirection = e.direction,
      this.doAnimate();
    },
    doAnimate() {
      const e = this.props;
      const t = e.onChange;
      const n = e.onAnimationEnd;
      const i = this.filterChildrenAndReturnCount();
      const r = this.current;
      if (this.animationCfg) {
        const a = this.animationCfg;
        const o = a.toPos;
        const s = a.acc;
        const c = a.startTime;
        const l = a.endTime;
        const u = a.source;
        const p = a.index;
        const d = a.duration;
        const h = a.realTimes;
        const m = a.durationTimes;
        const v = l - Date.now();
        if (v <= 0) {
          return this.animationCfg = null,
          this.animateCurrent = void 0,
          this.animationDirection = void 0,
          this.currentPosition = Math.abs(o) >= i ? 0 : o,
          this.isChanging = !1,
          this.updateSwiperStyle({
            animationEnd: !0
          }),
          n && n({
            detail: {
              current: p,
              source: u
            }
          }),
          void this.dispatchAnimationEndEvent();
        }
        if (h > 1) {
          if (Date.now() - c >= d / h * (m - 1)) {
            const g = this.touchObject && this.touchObject.direction === -1 ? r - 1 : r + 1;
            this.animationCfg.realTimes = h,
            this.animationCfg.durationTimes = m + 1,
            t && r !== p && void 0 !== u && u !== 'didUpdate' && t({
              detail: {
                current: g,
                source: u,
                isChanging: g !== p
              }
            }),
            this.isChanging = g !== p,
            this.current = g;
          }
        } else {
          this.current = p,
          t && r !== p && void 0 !== u && u !== 'didUpdate' && t({
            detail: {
              current: p,
              source: u
            }
          });
        }
        const b = s * v * v / 2;
        const y = o + b;
        this.currentPosition = y,
        this.animateCurrent = p,
        this.animateDiff = b,
        this.updateSwiperStyle({
          nextPos: y
        }),
        Object(f.a)(this.doAnimate);
      }
    },
    generateTransformVal(e) {
      return this.props.vertical ? `translate(0, ${100 * e}%) translateZ(0)` : `translate(${100 * e}%, 0) translateZ(0)`;
    },
    goToSlide(e) {
      let t;
      const n = e.targetIndex;
      const i = e.source;
      const r = void 0 === i ? void 0 : i;
      const a = e.realTimes;
      const o = void 0 === a ? 1 : a;
      const s = e.direction;
      const c = void 0 === s ? 1 : s;
      const l = e.disableProgrammaticAnimation;
      const u = this.props;
      const p = u.vertical;
      const d = u.circular;
      const h = u.duration;
      const
        f = this.filterChildrenAndReturnCount();
      t = n < 0 ? 0 : n;
      let m = this.getTargetOffset(p, 0, t);
      const v = this.current;
      if (d && f > 1) {
        if (t === 0) {
          if (c === 1) {
            if ((r === 'didUpdate' || r === 'autoplay') && this.SlidesRef) {
              const g = this.SlidesRef.childNodes[0];
              const b = this.generateTransformVal(f);
              g.style.transform = b,
              g.style.WebkitTransform = b;
            }
            S() && r === 'touch' && v === 0 || (m = this.getTargetOffset(p, 0, f));
          } else {
            m = this.getTargetOffset(p, 0, 0);
          }
        }
        t === f - 1 && (c === 1 ? m = this.getTargetOffset(p, 0, f - 1) : S() && r === 'touch' && v === f - 1 || (m = this.getTargetOffset(p, 0, -1)));
      }
      if (h > 0 && !l) {
        this.animateSlider({
          toPos: m,
          source: r,
          acc: 2 * (this.currentPosition - m) / (h * h),
          startTime: Date.now(),
          endTime: Date.now() + h,
          duration: h,
          index: t,
          realTimes: o,
          durationTimes: 1,
          direction: c
        });
      } else {
        this.animationCfg = null,
        this.animateCurrent = void 0,
        this.animationDirection = void 0,
        this.current = t,
        this.updateSwiperStyle(),
        this.dispatchAnimationEndEvent();
        const y = this.props.onChange;
        y && void 0 !== r && r !== 'didUpdate' && y({
          detail: {
            current: t,
            source: r
          }
        });
      }
    },
    dispatchAnimationEndEvent() {
      this.SwiperWrap && this.SwiperWrap.dispatchEvent(new CustomEvent('swiperAnimationEnd'));
    },
    updateDirection(e, t, n) {
      void 0 === n && (n = 45);
      const i = this.touchObject;
      const a = i.direction;
      const o = i.dx;
      const s = i.dy;
      if (void 0 === a || t === 'end' && !this.props.disableUpdateDirection) {
        let c = 0;
        const l = Math.atan2(-s, -o);
        let u = Math.round(180 * l / Math.PI);
        u < 0 && (u = 360 - Math.abs(u)),
        e ? u >= 90 - n && u <= 90 + n ? c = 1 : u >= 270 - n && u <= 270 + n && (c = -1) : (u <= n && u >= 0 && (c = 1),
        u <= 360 && u >= 360 - n && (c = 1),
        u >= 180 - n && u <= 180 + n && (c = -1)),
        r()(this.touchObject, {
          direction: c
        });
      }
    },
    updateTouchObject(e, t, n) {
      const i = e.touches && e.touches[0] || {};
      const a = i.pageX;
      const o = i.pageY;
      switch (t) {
        case 'start':
          this.touchObject = {
            startX: a,
            startY: o,
            endX: a,
            endY: o,
            dx: 0,
            dy: 0,
            mdx: 0,
            mdy: 0
          };
          break;
        case 'move':
          if (this.touchObject) {
            const s = this.touchObject;
            const c = s.startX;
            const l = s.startY;
            const u = s.endX;
            const p = s.endY;
            r()(this.touchObject, {
              endX: a,
              endY: o,
              dx: a - c,
              dy: o - l,
              mdx: a - u,
              mdy: o - p
            }),
            this.updateDirection(n, 'start', this.props.touchAngle);
          }
      }
    },
    fireTouchEvent(e, t) {
      let n;
      this[(n = t,
      `on${Object(g.a)(n)}`)](e);
    },
    onSwiperTouchStart(e) {
      if (!this.props.disableTouch && (this.fireTouchEvent(e, 'touchStart'),
      e.touches.length === 1 && !this.triggerFromStart)) {
        this.animationCfg = null;
        const t = this.props;
        const n = t.autoplay;
        const i = t.vertical;
        if (this.filterChildrenAndReturnCount() <= 1) return;
        this.triggerFromStart = !0,
        this.trackSpeed = 0,
        this.trackTime = Date.now(),
        this.updateTouchObject(e, 'start', i),
        n && this.stopAutoplay();
      }
    },
    onSwiperTouchMove(e) {
      if (!this.props.disableTouch && (this.fireTouchEvent(e, 'touchMove'),
      e.touches.length === 1 && this.triggerFromStart)) {
        e.stopPropagation();
        const t = this.props;
        const n = t.vertical;
        const i = t.circular;
        this.updateTouchObject(e, 'move', n),
        n && !1 === (void 0 === T && (T = Object(_.isFeatureAvailable)('f_supportAppxSwitch_24_8') ? p.h.getSwitch('swiperFixVerticalMove2411', !0) : Object(_.isFeatureAvailableWithDefault)('c_swiper_fixVerticalMove_24_11', !0)),
        C) ? e.preventDefault() : this.touchObject && void 0 !== this.touchObject.direction && this.touchObject.direction !== 0 && e.preventDefault();
        const r = this.filterChildrenAndReturnCount();
        if (r < 2) return;
        const a = this.current;
        const o = this.touchObject;
        const s = o.dx;
        const c = o.dy;
        const l = o.mdx;
        const u = o.mdy;
        const d = o.direction;
        const h = this.trackTime;
        if (this.trackTime = Date.now(),
        this.trackSpeed = -(0.5 * this.trackSpeed + 0.5 * (n ? u : l) / (this.trackTime - h)),
        d !== 0) {
          const f = n ? c : s;
          let m = 0;
          i || (a === 0 && d === -1 && (m = -0.6 * Math.abs(f)),
          a === r - 1 && d === 1 && (m = 0.6 * Math.abs(f)));
          const v = this.getTargetOffset(n, f + m);
          this.currentPosition = v + (this.animationDirection > 0 ? this.animateDiff : -1 * this.animateDiff),
          i && this.updateSlideItemStyleForCircular(this.currentPosition, d),
          this.updateSlidesStyle(this.currentPosition);
        }
      }
    },
    onSwiperTouchEnd(e) {
      if (!this.props.disableTouch) {
        if (e.type === 'touchend' ? this.fireTouchEvent(e, 'touchEnd') : e.type === 'touchcancel' && this.fireTouchEvent(e, 'touchCancel'),
        this.triggerFromStart) {
          const t = this.filterChildrenAndReturnCount();
          if (t <= 1) return;
          this.triggerFromStart = null;
          const n = this.props;
          const i = n.circular;
          const r = n.vertical;
          const a = n.autoplay;
          const o = n.acceleration;
          const s = n.swipeRatio;
          const c = n.swipeSpeed;
          const l = n.touchAngle;
          const u = this.current;
          this.updateDirection(r, 'end', l);
          const p = this.touchObject;
          const d = p.direction;
          const h = p.dx;
          const f = p.dy;
          const v = Math.abs(r ? f : h);
          this.clickSafe = v > 44;
          let g = 1;
          let b = 1;
          if (d !== 0 && v > 5) {
            let y = u;
            (v > (r ? this.SwiperContainer.offsetHeight : this.SwiperContainer.offsetWidth) * Math.min(1 * s, 0.5) || Math.abs(this.trackSpeed) > 1 * c) && (!i && o && Math.abs(this.trackSpeed) > 0.15 && (g = Math.floor(Math.abs(this.trackSpeed) / (m.l ? 0.15 : 0.22))),
            d === 1 ? i ? y = u >= t - 1 ? 0 : u + 1 : (u < t - 1 && (y = Math.min(u + g, t - 1)),
            b = y - u) : i ? y = u === 0 ? t - 1 : u - 1 : (u > 0 && (y = Math.max(u - g, 0)),
            b = u - y)),
            this.goToSlide({
              targetIndex: y,
              source: 'touch',
              realTimes: b,
              direction: d
            });
          } else {
            this.updateSwiperStyle(),
            this.dispatchAnimationEndEvent();
          }
          a && this.startAutoplay();
        } else {
          this.updateSwiperStyle(),
          this.dispatchAnimationEndEvent();
        }
      }
    },
    onSwiperClick(e) {
      this.clickSafe && (e.preventDefault(),
      e.stopPropagation(),
      e.nativeEvent && e.nativeEvent.stopPropagation());
    },
    getTargetOffset(e, t, n) {
      void 0 === t && (t = 0);
      const i = this.current;
      const r = this.animateCurrent;
      const a = void 0 !== n ? n : void 0 !== r ? r : i;
      return e ? t / this.SwiperContainer.offsetHeight - a : t / this.SwiperContainer.offsetWidth - a;
    },
    updateSwiperStyle(e) {
      const t = void 0 === e ? {} : e;
      const n = t.nextPos;
      const i = void 0 === n ? void 0 : n;
      const r = t.animationEnd;
      const a = void 0 !== r && r;
      this.updateSlidesStyle(i),
      this.updateSlideItemStyle(a),
      this.updateIndicatorDotsStyle();
    },
    updateSlidesStyle(e) {
      if (this.SlidesRef) {
        const t = this.props.onTransition;
        t && t();
        const n = this.generateTransformVal(void 0 !== e ? e : -this.current);
        this.SlidesRef.style.transform = n,
        this.SlidesRef.style.WebkitTransform = n;
      }
    },
    updateSlideItemStyle(e) {
      if (this.SlidesRef) {
        const t = this.props;
        const n = t.activeClass;
        const i = t.changingClass;
        const r = t.circular;
        const a = this.current;
        const o = this.filterChildrenAndReturnCount();
        const s = this.SlidesRef.childNodes;
        const c = s.length;
        if (c !== 0) {
          for (let l = 0; l < c; l++) {
            const u = s[l];
            if (this.isChanging ? void 0 !== i && (void 0 !== n && u.classList.remove(n),
            a === l ? u.classList.add(i) : u.classList.remove(i),
            l === o && (a === 0 ? u.classList.add(i) : u.classList.remove(i))) : void 0 !== n && (void 0 !== i && u.classList.remove(i),
            a === l ? u.classList.add(n) : u.classList.remove(n),
            l === o && (a === 0 ? u.classList.add(n) : u.classList.remove(n))),
            e && r && (l === 0 || l === o - 1)) {
              let p = void 0;
              p = o > 3 ? l === 0 && a === o - 1 ? this.generateTransformVal(a + 1) : l === o - 1 && a === 0 ? this.generateTransformVal(a - 1) : this.generateTransformVal(l) : this.generateTransformVal(l),
              s[l].style.transform = p,
              s[l].style.WebkitTransform = p;
            }
          }
        }
      }
    },
    updateSlideItemStyleForCircular(e, t) {
      if (this.SlidesRef) {
        const n = this.current;
        const i = this.filterChildrenAndReturnCount();
        if (i >= 2) {
          let r;
          let a;
          let o;
          let s;
          const
            c = this.SlidesRef.childNodes;
          if (i > 2 && p.h.getSwitch('swiperOptimize1241', !0)) {
            return Math.abs(e) + 1 >= i ? (r = this.generateTransformVal(i),
            a = this.generateTransformVal(i - 1)) : Math.abs(e) <= 1 ? (r = this.generateTransformVal(0),
            a = t === 1 && i === 3 ? this.generateTransformVal(i - 1) : this.generateTransformVal(-1)) : (r = t === 1 && Math.abs(e) + 2 > i ? this.generateTransformVal(i) : this.generateTransformVal(0),
            a = this.generateTransformVal(i - 1)),
            c[0].style.transform = r,
            c[0].style.WebkitTransform = r,
            c[i - 1].style.transform = a,
            void (c[i - 1].style.WebkitTransform = a);
          }
          if (n === 0) {
            o = e > n ? this.generateTransformVal(-1) : this.generateTransformVal(i - 1),
            c[i - 1].style.transform = o,
            c[i - 1].style.WebkitTransform = o;
          }
          if (n === i - 1) {
            s = Math.abs(e) < n ? this.generateTransformVal(0) : this.generateTransformVal(i),
            c[0].style.transform = s,
            c[0].style.WebkitTransform = s;
          }
        }
      }
    },
    updateIndicatorDotsStyle() {
      if (this.Indicator) {
        const e = this.props;
        const t = e.indicatorActiveColor;
        const n = e.indicatorColor;
        const i = this.Indicator.childNodes;
        const r = i.length;
        if (r !== 0) {
          for (let a = 0; a < r; a++) {
            const o = i[a];
            this.current === a ? (o.classList.add('a-swiper-dot-active'),
            o.style.backgroundColor = t) : (o.classList.remove('a-swiper-dot-active'),
            o.style.backgroundColor = n);
          }
        }
      }
    },
    getContainerStyle(e) {
      let t;
      const n = this.props;
      const i = n.previousMargin;
      const
        r = n.nextMargin;
      return (t = {})[e ? 'top' : 'left'] = `${this.handleMarginUnit(i)}`,
      t[e ? 'bottom' : 'right'] = `${this.handleMarginUnit(r)}`,
      t;
    },
    getSlidesStyle() {
      if (!this.animationCfg) {
        const e = this.current;
        const t = this.generateTransformVal(-e);
        return {
          transform: t,
          WebkitTransform: t
        };
      }
      return {};
    },
    getSlideStyle(e) {
      const t = this.generateTransformVal(e);
      return {
        transform: t,
        WebkitTransform: t
      };
    },
    saveSwiperWrap(e) {
      this.SwiperWrap = e;
    },
    saveSlidesContainer(e) {
      this.SwiperContainer = e;
    },
    saveSlidesRef(e) {
      this.SlidesRef = e;
    },
    saveIndicator(e) {
      this.Indicator = e;
    },
    renderSlideItem() {
      const e = this;
      const t = this.filterChildrenAndReturnCount();
      const n = this.current;
      const i = this.props;
      const r = i.activeClass;
      const a = i.circular;
      return this.handledChildren.map(((i, s) => {
        let c;
        return c = t >= 3 && a && !e.animationCfg ? s === 0 && n === t - 1 ? e.getSlideStyle(n + 1) : s === t - 1 && n === 0 ? e.getSlideStyle(n - 1) : e.getSlideStyle(s) : e.getSlideStyle(s),
        o.a.cloneElement(i, {
          style: c,
          key: `${s}-child`,
          index: s,
          current: n,
          activeClass: r
        });
      }
      ));
    },
    renderIndicatorDots() {
      const e = this.props;
      const t = e.indicatorDots;
      const n = e.indicatorColor;
      const i = e.indicatorActiveColor;
      const r = this.current;
      const a = this.filterChildrenAndReturnCount();
      const s = [];
      let c = null;
      if (t) {
        for (let l = 0; l < a; l++) {
          var p;
          const d = u()(((p = {})['a-swiper-dot'] = !0,
          p['a-swiper-dot-active'] = r === l,
          p));
          const
            h = {};
          r === l && i && (h.backgroundColor = i),
          r !== l && n && (h.backgroundColor = n),
          s.push(o.a.createElement('div', {
            className: d,
            style: h,
            key: `dot-${l}`
          }));
        }
        c = o.a.createElement('div', {
          className: 'a-swiper-indicator',
          ref: this.saveIndicator
        }, s);
      }
      return c;
    },
    render() {
      let e;
      const t = this.props;
      const n = t.style;
      const i = t.className;
      const a = t.vertical;
      const s = t.id;
      const c = t.snapshotSwiperCurrent;
      const l = t.snapshotSwiperVertical;
      const p = t.$appx;
      const
        d = u()(((e = {})[i] = !0,
        e['a-swiper-vertical'] = a,
        e));
      return o.a.createElement('div', r()({
        ref: this.saveSwiperWrap,
        id: s,
        className: d,
        style: n,
        'is-scroll-parent': '1'
      }, p.getTrackerConfig()), o.a.createElement('div', {
        ref: this.saveSlidesContainer,
        style: this.getContainerStyle(a),
        className: 'a-swiper-container'
      }, o.a.createElement('div', {
        ref: this.saveSlidesRef,
        style: this.getSlidesStyle(),
        className: 'a-swiper-slides',
        onClick: this.onSwiperClick,
        'snapshot-swiper-current': c,
        'snapshot-swiper-vertical': l && 'true'
      }, this.renderSlideItem())), this.renderIndicatorDots());
    }
  }));
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  t.default = Object(s.c)({
    pure: !1,
    name: 'swiper-item'
  })(((e) => {
    const t = e.children;
    const n = e.style;
    const i = e.$appxStyle;
    const a = e.className;
    const s = e.id;
    const c = e.current;
    const l = e.index;
    const u = e.activeClass;
    const p = u && c === l ? `${a} ${u}` : a;
    return o.a.createElement('div', {
      style: r()({}, n, i),
      className: p,
      id: s
    }, t);
  }
  ));
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(21);
  const u = n.n(l);
  const p = n(29);
  const d = n(1);
  const h = n(2);
  const f = function (e, t) {
    const n = {};
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && typeof Object.getOwnPropertySymbols === 'function') {
      let r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++) t.indexOf(i[r]) < 0 && (n[i[r]] = e[i[r]]);
    }
    return n;
  };
  t.default = Object(d.c)({
    name: 'switch'
  })(c()({
    displayName: 'Switch',
    mixins: [p.b],
    getDefaultProps() {
      return {
        checked: !1,
        valueProp: 'checked',
        controlled: !1
      };
    },
    onChange(e) {
      const t = e.target.checked;
      const n = this.props;
      const i = n.controlled;
      const r = n.onChange;
      i || this.setState({
        value: t
      }),
      r && r({
        detail: {
          value: t
        }
      });
    },
    render() {
      let e;
      let t;
      const n = this.props;
      const i = n.className;
      const a = n.style;
      const s = n.color;
      const c = n.disabled;
      const l = (n.checked,
      n.onChange,
      n.valueProp,
      n.controlled,
      n.$appx,
      n['style-scope'],
      f(n, ['className', 'style', 'color', 'disabled', 'checked', 'onChange', 'valueProp', 'controlled', '$appx', 'style-scope']));
      const p = this.getCurrentValue();
      const d = u()(((e = {})[i] = !0,
      e['a-switch-android'] = h.l,
      e));
      const m = u()(((t = {}).checkbox = !0,
      t['checkbox-disabled'] = c,
      t));
      const
        v = a || {};
      return s && p && (v.backgroundColor = s),
      o.a.createElement('label', r()({
        className: d,
        role: 'switch',
        'aria-checked': !!p
      }, l), o.a.createElement('input', {
        type: 'checkbox',
        className: 'a-switch-checkbox',
        disabled: c,
        checked: p,
        onChange: this.onChange,
        value: p ? 'on' : 'off'
      }), o.a.createElement('div', {
        className: m,
        style: v
      }));
    }
  }));
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(21);
  const p = n.n(u);
  const d = n(32);
  const h = n(8);
  const f = n(6);
  const m = n(2);
  const v = n(4);
  const g = n(28);
  const b = n(22);
  const y = ['initialTime', 'duration', 'controls', 'loop', 'showFullscreenBtn', 'showPlayBtn', 'showCenterPlayBtn', 'objectFit', 'pageGesture', 'enableProgressGesture', 'extraInfo', 'enableHistory', 'floatingMode'];
  const _ = o.a.createElement('param', {
    name: 'type',
    value: 'video'
  });
  const w = Object(s.c)({
    name: 'video',
    isNativeComponent(e) {
      return !1 !== e.enableNative && Object(v.isNativeComponentForLyra)('video');
    }
  })(l()({
    displayName: 'Video',
    mixins: [g.a, b.a],
    getDefaultProps() {
      return {
        src: '',
        autoplay: !1,
        initialTime: 0,
        duration: 0,
        controls: !0,
        loop: !1,
        muted: !1,
        showFullscreenBtn: !0,
        showPlayBtn: !0,
        showCenterPlayBtn: !0,
        objectFit: 'contain',
        pageGesture: !1,
        enableProgressGesture: !0,
        mobilenetHintType: 1,
        posterSize: 'contain',
        showMuteBtn: !0,
        showThinProgressBar: !1,
        floatingMode: 'none'
      };
    },
    getInitialState() {
      const e = this.props;
      const t = e.$appx;
      const n = e.muted;
      return this.useNative = t.isNativeComponent,
      {
        muted: n
      };
    },
    componentDidMount() {
      if (this.useNative) {
        const e = this.props;
        const t = e.autoplay;
        const n = e.poster;
        const i = e.src;
        this.nativeEvents = Object(h.a)(document, {
          'nbcomponent.video.onChangeState': this.onChangeState,
          'nbcomponent.video.onError': this.onNativeError
        }),
        this.readyForPlay = !1,
        m.r || m.q || (this.detachNativeReady = Object(h.a)(document, {
          'nbcomponent.canrender': this.onNativeReady
        })),
        t && this.renderVideo(!0),
        void 0 === n && i && this.setDefaultPoster();
      }
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.autoplay;
      const i = t.src;
      const r = t.muted;
      const a = t.poster;
      if (this.useNative) {
        if (e.autoplay !== n && n) {
          this.renderVideo(!0);
        } else if (this.readyForPlay) {
          let o = !1;
          if (e.src !== i) {
            m.l ? this.stop() : this.readyForPlay = !1,
            n && this.renderVideo(!0);
          } else {
            for (let s = 0; s < y.length; s++) {
              const c = y[s];
              if (e[c] !== this.props[c]) {
                o = !0,
                this.executeNBRender();
                break;
              }
            }
            o || e.muted === r || this.mute(r);
          }
        }
        void 0 === a && e.src !== i && i && this.setDefaultPoster();
      } else {
        r !== e.muted && this.mute(r);
      }
    },
    setDefaultPoster() {
      const e = this;
      const t = this.props.src;
      Object(f.a)('getPosterFromVideoUrl', {
        src: t
      }, ((t) => {
        t && t.apFilePath && e.setState({
          poster: t.apFilePath
        });
      }
      ));
    },
    renderNativeComponent() {
      this.executeNBRender(!0);
    },
    renderVideo(e) {
      if (void 0 === e && (e = !1),
      m.r || m.q) {
        this.executeNBRender(e);
      } else {
        let t;
        const n = this.getId();
        let
          i = !0;
        try {
          t = document.querySelector(`#${n}`);
        } catch (e) {
          Object(d.a)(e),
          Object(s.e)()
            .consoleToWorker('error', `${n} 是非法值，video组件id属性值必须由字母开头`),
          i = !1;
        }
        if (!i) return;
        if (t) {
          this.readyForPlay && this.executeNBRender(e);
        } else {
          const r = document.querySelector(`#${n}-wrap`);
          if (r) {
            const a = document.createDocumentFragment();
            const o = document.createElement('object');
            const c = document.createElement('param');
            const l = document.createElement('param');
            o.className = `a-video-con nbcomponentanimation-${n}`,
            o.id = n,
            o.type = 'application/view',
            o.role = 'application',
            c.name = 'type',
            c.value = 'video',
            l.name = 'id',
            l.value = n,
            o.appendChild(c),
            o.appendChild(l),
            a.appendChild(o),
            r.appendChild(a);
          }
        }
      }
    },
    executeNBRender(e) {
      const t = this;
      void 0 === e && (e = !1);
      const n = this.props;
      let i = n.floatingMode;
      Object(v.isFeatureAvailable)(v.EInsideFeature.c_floatingModeUseUserPassedValue_24_7) || i !== 'miniprogram' || (i = 'microapp'),
      Object(f.a)('NBComponent.render', {
        element: this.getId(),
        props: {},
        data: {
          autoplay: !!e || n.autoplay,
          src: n.src,
          'initial-time': n.initialTime,
          duration: n.duration,
          controls: n.controls,
          loop: n.loop,
          muted: n.muted,
          'show-fullscreen-btn': n.showFullscreenBtn,
          'show-play-btn': n.showPlayBtn,
          'show-center-play-btn': n.showCenterPlayBtn,
          'object-fit': n.objectFit,
          'page-gesture': n.pageGesture,
          'enable-progress-gesture': n.enableProgressGesture,
          'extra-info': n.extraInfo,
          direction: n.direction,
          'mobilenet-hint-type': n.mobilenetHintType,
          showMuteBtn: n.showMuteBtn,
          showThinProgressBar: n.showThinProgressBar,
          enableHistory: n.enableHistory,
          floatingMode: i
        }
      }, ((e) => {
        e.success && (t.readyForPlay = !0);
      }
      ));
    },
    onChangeState(e) {
      const t = e.data;
      const n = t.state;
      const i = t.element;
      if (this.getId() === i) {
        switch (n) {
          case 0:
            this.onStop();
            break;
          case 1:
            this.onPlay();
            break;
          case 5:
            this.onRenderStartOrError();
        }
      }
    },
    onStop() {
      this.nativeVideoViewHasRemoved || this.removeNativeView(),
      this.playIcon && (this.playIcon.style.display = 'block'),
      this.poster && (this.poster.style.display = 'block'),
      this.nativeVideoViewHasRemoved = !1;
    },
    onPlay() {
      if (!this.useNative) {
        const e = this.props.onPlay;
        e && e();
      }
    },
    onPause() {
      const e = this.props.onPause;
      e && e();
    },
    onEnded() {
      const e = this.props.onEnded;
      e && e();
    },
    onRenderStartOrError() {
      this.poster && (this.poster.style.display = 'none'),
      this.playIcon && (this.playIcon.style.display = 'none');
    },
    onNativeError(e) {
      this.getId() === e.data.element && this.onRenderStartOrError();
    },
    onTimeUpdate(e) {
      const t = this.props.onTimeUpdate;
      t && t({
        detail: {
          currentTime: e.currentTarget.currentTime
        }
      });
    },
    onError(e) {
      let t;
      if (e.target.error && e.target.error.code) {
        t = ['', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'][e.target.error.code];
      }
      const n = this.props.onError;
      n && t && n({
        detail: {
          errMsg: t
        }
      });
    },
    play() {
      this.useNative ? this.readyForPlay ? this.videoAction({
        action: 'play'
      }) : this.renderVideo(!0) : this.root.play();
    },
    stop() {
      this.useNative ? (this.videoAction({
        action: 'stop'
      }),
      this.removeNativeView()) : console.error('当前版本不支持stop');
    },
    pause() {
      this.useNative || this.root.pause();
    },
    seek(e) {
      this.useNative || (this.root.currentTime = e || 0);
    },
    mute(e) {
      this.useNative ? this.videoAction({
        action: 'mute',
        data: {
          ison: e
        }
      }) : this.setState({
        muted: e
      });
    },
    removeNativeView() {
      if (this.useNative) {
        if (m.r || m.q) {
          Object(f.a)('NBComponent.remove', {
            element: this.getId()
          });
        } else {
          try {
            document.querySelector(`#${this.getId()}-wrap`).innerHTML = '';
          } catch (e) {
          }
        }
        this.readyForPlay = !1,
        this.nativeVideoViewHasRemoved = !0;
      }
    },
    videoAction(e) {
      Object(f.a)('NBComponent.sendMessage', {
        actionType: e.action,
        element: this.getId(),
        data: e.data || {}
      });
    },
    saveRoot(e) {
      this.root = e;
    },
    savePoster(e) {
      this.poster = e;
    },
    savePlayIcon(e) {
      this.playIcon = e;
    },
    renderPlayIcon() {
      let e;
      const t = this.props;
      const n = t.showCenterPlayBtn;
      const i = t.hidePlay;
      const
        r = t.autoplay;
      if (i || !1 === n) return null;
      const a = p()(((e = {})['a-video-play'] = !0,
      e));
      const s = r ? {
        display: 'none'
      } : {};
      return o.a.createElement('div', {
        ref: this.savePlayIcon,
        className: a,
        style: s,
        onClick: this.play
      });
    },
    render() {
      const e = this.props;
      const t = e.style;
      const n = e.className;
      const i = e.id;
      const a = e.mobilenetHintType;
      if (!this.checkPermission('video')) {
        return this.getPermissionJSX({
          className: n,
          style: t,
          id: i
        });
      }
      const s = this.state;
      const c = s.poster;
      const l = s.muted;
      if (this.useNative) {
        let u;
        let d;
        let h;
        const f = p()(((u = {})['a-video-poster'] = !0,
        u));
        const v = p()(((d = {})['a-video-wrap'] = !0,
        d));
        const g = p()(((h = {})['a-video-con'] = !0,
        h[`nbcomponentanimation-${this.getId()}`] = !0,
        h));
        let
          b = null;
        (m.r || m.q) && (b = o.a.createElement('object', {
          className: g,
          id: e.id,
          type: 'application/view',
          role: 'application'
        }, _, o.a.createElement('param', {
          name: 'id',
          value: this.getId()
        })));
        let y = {};
        (void 0 !== e.poster || c) && (y = {
          backgroundImage: `url(${e.$appx.getNormalizedSrc(e.poster || c)})`
        }),
        e.posterSize !== 'contain' && (y.backgroundSize = e.posterSize);
        const w = o.a.createElement('div', {
          ref: this.savePoster,
          className: f,
          style: y
        });
        const C = a <= 1;
        return o.a.createElement('div', {
          className: e.className,
          style: e.style,
          ref: this.saveRoot
        }, C ? null : w, o.a.createElement('div', {
          className: v,
          id: `${this.getId()}-wrap`
        }, b), C ? w : null, this.renderPlayIcon());
      }
      return o.a.createElement('video', {
        className: e.className,
        ref: this.saveRoot,
        style: r()({}, e.style, {
          objectFit: e.objectFit
        }),
        src: e.src,
        poster: e.poster || c,
        id: this.getId(),
        autoPlay: e.autoplay,
        controls: e.controls,
        onPlay: this.onPlay,
        onEnded: this.onEnded,
        onPause: this.onPause,
        onError: this.onError,
        onTimeUpdate: this.onTimeUpdate,
        playsInline: 'true',
        'webkit-playsinline': 'true',
        muted: l
      });
    }
  }));
  t.default = w;
},
function (e, t, n) {
  n.r(t);
  let i;
  const r = n(0);
  const a = n.n(r);
  const o = n(23);
  const s = n.n(o);
  const c = n(5);
  const l = n.n(c);
  const u = n(21);
  const p = n.n(u);
  const d = n(1);
  const h = n(6);
  const f = n(4);
  const m = n(28);
  const v = n(22);
  const g = n(40);
  const b = n(2);
  const y = n(48);
  const _ = n(37);
  const w = y.a.UNEXPECTED_BEHAVIOR;
  const
    C = {
      position: 'fixed',
      top: '0px',
      left: '0px',
      bottom: '0px',
      right: '0px',
      width: '100%',
      height: '100%'
    };
  let x;
  let T;
  let S;
  const
    E = 'https://render.alipay.com/p/s/tinyapperror?bizCode=nebula&errorCode=1201&subErrorCode=N12503&errorSubTitle=';

  function k(e) {
    for (var t = e.length, n = 0; n < t && (e.charAt(n) === '.' || e.charAt(n) === '*');) n++;
    return n > 0 ? e.substring(n) : e;
  }

  function O(e, t) {
    d.h.getSwitch('enableDomainCheck', !1) || !1 ? (S || (S = new Promise((((e) => {
      Object(h.a)('tinyAppConfig', {
        key: 'webviewAllowedDomain',
        scopeType: 'app'
      }, ((t) => {
        try {
          if (t && t.value) {
            const n = JSON.parse(t.value);
            e(n);
          } else {
            e(void 0);
          }
        } catch (t) {
          e(void 0);
        }
      }
      ));
    })
    ))),
    S.then(((n) => {
      try {
        if (void 0 !== n) {
          const i = new URL(e).host;
          i === '' ? (Object(_.a)(w, {
            error: {
              column: -1,
              line: -1,
              message: `invalid src with empty host @appx1.0: ${e.slice(0, 100)}`,
              sourceURL: '',
              stack: ''
            }
          }),
          t(e)) : !(function (e, t) {
            try {
              for (let n = 0; n < t.length; n++) {
                const i = t[n];
                if (typeof i === 'string' && i.trim() !== '') {
                  const r = k(i.trim());
                  if (r.length !== 0) {
                    if (e === r) return !0;
                    if (e.endsWith(r)) return !0;
                  } else {
                    const a = (void 0 === T && (T = d.h.getSwitch('ignoreCheckWildcard', !1) || !1),
                    T);
                    if (Object(_.a)(w, {
                      error: {
                        column: -1,
                        line: -1,
                        message: `unexpected domain with wildcardChar and ${!a && 'not'} ignoreCheck @appx1.0: ${i}`,
                        sourceURL: '',
                        stack: ''
                      }
                    }),
                    a) {
                      return !0;
                    }
                  }
                } else {
                  Object(_.a)(w, {
                    error: {
                      column: -1,
                      line: -1,
                      message: `unexpected empty rule @appx1.0: ${i}`,
                      sourceURL: '',
                      stack: ''
                    }
                  });
                }
              }
              return !1;
            } catch (e) {
              return !0;
            }
          }(i, n)) ? (Object(_.a)(w, {
              error: {
                column: -1,
                line: -1,
                message: `invalid src @appx1.0: ${e}`,
                sourceURL: '',
                stack: ''
              }
            }),
            t(`${void 0 === x && (x = d.h.getSwitch('webviewErrorBaseURL', E) || E),
            x}${encodeURIComponent(e)}`)) : t(e);
        } else {
          Object(_.a)(w, {
            error: {
              column: -1,
              line: -1,
              message: `invalid ruleList @appx1.0: ${e}`,
              sourceURL: '',
              stack: ''
            }
          }),
          t(e);
        }
      } catch (n) {
        Object(_.a)(w, {
          error: {
            column: -1,
            line: -1,
            message: `throw exception when execute checkDomainIsValid @appx1.0: ${e}`,
            sourceURL: '',
            stack: ''
          }
        }),
        t(e);
      }
    }
    ))) : t(e);
  }

  const P = a.a.createElement('param', {
    name: 'type',
    value: 'web-view'
  });
  const N = a.a.createElement('div', null, '当前环境不支持web-view组件');
  const I = Object(d.c)({
    name: 'web-view',
    isNativeComponent() {
      return Object(f.isNativeComponentForLyra)('web-view');
    }
  })(l()({
    displayName: 'WebView',
    mixins: [m.a, v.a],
    getDefaultProps() {
      return {
        enableWK: !0,
        enhanced: !1
      };
    },
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      this.pluginId = this.props.__owner && this.props.__owner.getPluginId(),
      {};
    },
    componentDidMount() {
      this.useNative ? this.onDidMountForNative() : Object(g.a)({
        type: 'monitor',
        bizType: 'TINYAPP',
        seedId: 'APPX_WEB_VIEW_RENDER_FAIL'
      });
    },
    componentDidUpdate() {
      this.renderNativeComponent();
    },
    componentWillUnmount() {
      this.webview_container && document.body.removeChild(this.webview_container);
    },
    getWebViewContainer() {
      return this.webview_container ? this.webview_container : (this.webview_container = document.createElement('div'),
      this.webview_container.setAttribute('snapshot-delete', 'true'),
      document.body.appendChild(this.webview_container),
      this.webview_container);
    },
    renderNativeComponent() {
      const e = this;
      if (this.readyForRender) {
        this.clearRenderDelay();
        const t = this.props;
        const n = t.src;
        const i = t.enableWK;
        const r = t.appId;
        const a = t.mini;
        const o = {
          appId: r,
          enableWK: i,
          mini: void 0 !== a && a,
          overlay: this.getOverlayValue()
        };
        O(n, ((t) => {
          o.src = t,
          Object(h.a)('NBComponent.render', {
            element: e.getId(),
            props: o
          });
        }
        ));
      }
    },
    getOverlayValue() {
      const e = this.props.allowOverlay;
      return !(!d.h.getSwitch('forceWebViewOverlay', !1) || void 0 !== e) || !!e;
    },
    renderPluginIdParam() {
      const e = this.pluginId;
      return e ? a.a.createElement('param', {
        name: 'pluginId',
        value: e
      }) : null;
    },
    getOverlayParam() {
      const e = this.getOverlayValue();
      return e ? a.a.createElement('param', {
        name: 'overlay',
        value: e
      }) : null;
    },
    getUCRenderModeParam() {
      const e = this.getOverlayValue();
      const t = d.h.getSwitch('UCRenderMode4WebView', 2) || 2;
      return t && (void 0 === i && (i = !(!b.l || !Object(f.isFeatureAvailable)('c_webView_allowOverlay_2_7_0'))),
      i) && e ? a.a.createElement('param', {
          name: 'uc_render_mode',
          value: t
        }) : null;
    },
    render() {
      const e = this.props;
      const t = e.mini;
      const n = void 0 !== t && t;
      const i = e.appId;
      const r = e.style;
      const o = e.className;
      const c = e.id;
      const l = this.getOverlayValue();
      if (n || l) {
        let u;
        if (!this.useNative) return this.getUnsupportJSX();
        if (n) {
          if (!this.checkPermission('mini-web-view')) {
            return this.getPermissionJSX({
              className: `${o} a-web-view-mini`,
              style: r,
              id: c
            });
          }
        } else if (l && !this.checkPermission('web-view')) {
          return this.getPermissionJSX({
            className: o,
            style: r,
            id: c
          });
        }
        const d = p()(((u = {})[o] = n,
        u['a-web-view-mini'] = n,
        u[`nbcomponentanimation-${this.getId()}`] = !0,
        u));
        const h = n ? r : C;
        return a.a.createElement('object', {
          className: d,
          type: 'application/view',
          id: c,
          role: 'application',
          style: h
        }, P, a.a.createElement('param', {
          name: 'id',
          value: this.getId()
        }), a.a.createElement('param', {
          name: 'appId',
          value: i
        }), a.a.createElement('param', {
          name: 'mini',
          value: n
        }), this.getOverlayParam(), this.getUCRenderModeParam(), this.renderPluginIdParam());
      }
      if (!this.useNative) return s.a.createPortal(N, this.getWebViewContainer());
      if (!this.checkPermission('web-view')) {
        return this.getPermissionJSX({
          className: o,
          style: r,
          id: c
        });
      }
      const f = this.props.enhanced ? 'dd-web-view' : 'web-view';
      return s.a.createPortal(a.a.createElement('object', {
        className: `nbcomponentanimation-${this.getId()}`,
        type: 'application/view',
        role: 'application',
        id: c,
        style: C
      }, a.a.createElement('param', {
        name: 'type',
        value: f
      }), a.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }), a.a.createElement('param', {
        name: 'appId',
        value: i
      }), this.renderPluginIdParam()), this.getWebViewContainer());
    }
  }));
  t.default = I;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(1);
  const u = n(8);
  const p = n(9);
  const d = ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight', 'orientation'];
  t.default = Object(l.c)({
    name: 'match-media'
  })(c()({
    displayName: 'MatchMedia',
    getInitialState() {
      return this.data = {},
      this.mediaQueryStr = '',
      {
        isVisible: !0
      };
    },
    componentWillMount() {
      this.processProps(),
      this.setState({
        isVisible: this.isMediaQueryMatched(!0)
      });
    },
    componentDidMount() {
      const e = this;
      this.windowEvents = Object(u.a)(window, {
        resize() {
          e.setState({
            isVisible: e.isMediaQueryMatched(!1)
          });
        }
      });
    },
    componentDidUpdate(e) {
      for (let t = 0; t < d.length; t++) {
        const n = d[t];
        if (e[n] !== this.props[n]) {
          this.processProps(),
          this.setState({
            isVisible: this.isMediaQueryMatched(!0)
          });
          break;
        }
      }
    },
    componentWillUnmount() {
      this.windowEvents && this.windowEvents.remove();
    },
    processProps() {
      const e = this;
      d.forEach(((t) => {
        void 0 !== e.props[t] && (e.data[t] = t === 'orientation' ? /^[-_a-z0-9]+$/i.test(e.props[t]) ? e.props[t] : '' : Number(e.props[t]) >= 0 ? Number(e.props[t]) : '');
      }
      ));
    },
    isMediaQueryMatched(e) {
      if (e) {
        this.mediaQueryStr = '';
        for (let t = 0, n = Object(p.default)(this.data); t < n.length; t++) {
          const i = n[t];
          const r = i.replace(/[A-Z]/g, ((e) => `-${e.toLowerCase()}`
          ));
          this.mediaQueryStr && (this.mediaQueryStr += ' and '),
          this.mediaQueryStr += `(${r}: ${this.data[i]}${i === 'orientation' ? '' : 'px'})`;
        }
      }
      return window.matchMedia(this.mediaQueryStr).matches;
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.style;
      const i = e.id;
      let a = n;
      return this.state.isVisible || (a = r()({}, a, {
        display: 'none'
      })),
      o.a.createElement('div', {
        className: t,
        id: i,
        style: a
      }, this.props.children);
    }
  }));
},
function (e, t, n) {
  n.r(t),
  n.d(t, 'default', (() => o
  ));
  const i = n(10);
  const r = n(125);
  const a = n(9);

  function o(e) {
    for (let t = 0, n = Object(a.default)(i.c); t < n.length; t++) {
      const o = n[t];
      const s = i.c[o];
      s.name = o,
      Object(r.default)(s, !0, e);
    }
  }
},
function (e, t, n) {
  n.r(t);
  const i = {};
  n.r(i),
  n.d(i, 'Platform', (() => x
  ));
  const r = {};
  n.r(r),
  n.d(r, 'SelectorQuery', (() => i
  ));
  const a = n(3);
  const o = n.n(a);
  const s = n(50);
  const c = n(6);
  const l = n(11);
  const u = n(85);
  const p = n(14);
  const d = n(52);
  const h = n(86);
  const f = n(54);
  const m = n.n(f);
  const v = n(55);
  m()(h.a, {
    plugins: {
      loadPlugins(e, t) {
        Object(v.a)(e, t);
      }
    }
  });
  const g = self;
  const b = [];
  for (var y = {
      call() {
        let e;
        return (e = g.AlipayJSBridge).call.apply(e, arguments);
      },
      fireMessage(e) {
        for (let t = 0; t < b.length; t++) {
          (0,
          b[t])(e);
        }
      },
      onMessage(e) {
        return b.push(e),
        function () {
          const t = b.indexOf(e);
          t !== -1 && b.splice(t, 1);
        };
      },
      reLaunch(e) {
        const t = Object(p.d)();
        if (t) {
          t.callRemoteBridge('reLaunch', e);
        } else {
          let n = e.url;
          n.charAt(0) === '/' && (n = n.slice(1));
          let i = n;
          const r = n.indexOf('?');
          r !== -1 && (i = n.slice(0, r)),
          Object(d.b)(n) ? y.call('switchTab', {
            tag: n,
            recreate: !0
          }) : y.call('pushWindow', {
            url: `#${n}`,
            launchParamsTag: i,
            param: {
              closeAllWindow: !0,
              fromRelaunch: !0,
              animationType: 'none'
            }
          });
        }
      },
      pageScrollTo(e, t, n) {
        let i = e.scrollTop;
        const r = e.duration;
        let a = void 0 === r ? 0 : r;
        const o = e.selector;
        if (a = Number.isNaN(Number(a)) ? 0 : Math.max(0, Number(a)),
        o && void 0 === i) {
          const s = document.querySelector(o);
          s && (i = s.getBoundingClientRect().top + g.pageYOffset);
        }
        let c = null;
        const l = document.documentElement;
        if (void 0 !== i) {
          i < 0 && (i = 0);
          const u = l.clientHeight;
          const p = l.scrollHeight - u;
          p >= 0 && p < i && (i = p),
          g.cancelAnimationFrame(c);
          const d = g.pageYOffset;
          const h = i - d;
          if (a === 0 || h === 0) {
            return h !== 0 && window.scrollTo(window.pageXOffset, i),
            void (t && t({
              success: !0
            }));
          }
          const f = Date.now();
          c = g.requestAnimationFrame((function e() {
            const n = Date.now() - f;
            const r = (function (e, t, n, i) {
              return -n * (e /= i) * (e - 2) + t;
            }(n, d, h, a));
            if (a <= n) {
              return window.scrollTo(window.pageXOffset, i),
              void (t && t({
                success: !0
              }));
            }
            window.scrollTo(window.pageXOffset, r),
            c = window.requestAnimationFrame(e);
          }
          ));
        } else {
          n && n({
            error: 1,
            errorMessage: 'need scrollTop or selector'
          });
        }
      }
    }, _ = function (e, t) {
      const n = t[e];
      y[n] = function (e) {
        !(function e(t, n) {
          if ((n = n || 0) > 10) {
            t({
              error: 1,
              errorMessage: 'Can not find valid page!'
            });
          } else {
            const i = Object(p.d)();
            i ? t({
              page: i
            }) : setTimeout((() => e(t, n + 1)
            ), 100);
          }
        }(((t) => {
          const i = t.page;
          i && i.callRemoteBridge(n, e);
        }
        )));
      };
    }, w = 0, C = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack']; w < C.length; w++) {
    _(w, C);
  }
  u.a.bridge = y;
  let x;
  const T = y;
  const S = n(83);
  const E = n(1);
  const k = n(23);
  const O = n.n(k);
  const P = document;
  const
    N = window;

  function I(e, t) {
    if (t === 'rect') {
      for (var n = e.getBoundingClientRect(), i = {}, r = ['left', 'right', 'top', 'bottom', 'width', 'height'], a = 0; a < r.length; a++) void 0 !== n[r[a]] && (i[r[a]] = n[r[a]]);
      return i;
    }
    if (t === 'scroll') {
      return {
        scrollTop: e.scrollTop,
        scrollLeft: e.scrollLeft
      };
    }
  }

  function A(e, t, n) {
    const i = {};
    if (t) {
      if (t.id && (i.id = n(e, 0)),
      t.dataset && (i.dataset = n(e, 1)),
      t.node) {
        const r = n(e, 3);
        r && (i.nodeName = r.nodeName,
        i.nodeId = r.nodeId,
        r.nodeCanvasType && (i.nodeCanvasType = r.nodeCanvasType));
      }
      if (t.context,
      t.scrollOffset && (i.scrollTop = e.scrollTop,
      i.scrollLeft = e.scrollLeft),
      t.size || t.rect) {
        const a = e.getBoundingClientRect();
        t.rect && (i.left = a.left,
        i.right = a.right,
        i.top = a.top,
        i.bottom = a.bottom),
        t.size && (i.width = a.width,
        i.height = a.height);
      }
    }
    return i;
  }

  function j(e, t, n) {
    let i;
    if (e) {
      const r = Object(E.e)()
        .getComponentById(e);
      r && (i = O.a.findDOMNode(r));
    } else {
      i = document;
    }
    if (i) return n ? [].slice.call(i.querySelectorAll(t), 0) : i.querySelector(t);
  }

  !(function (e) {
    !(function (e) {
      e[e.Width = 0] = 'Width',
      e[e.Height = 1] = 'Height';
    }(e.EViewportType || (e.EViewportType = {}))),
    (function (e) {
      e[e.Id = 0] = 'Id',
      e[e.Dataset = 1] = 'Dataset',
      e[e.Context = 2] = 'Context',
      e[e.Node4Canvas = 3] = 'Node4Canvas';
    }(e.ENodeDetailType || (e.ENodeDetailType = {})));
  }(x || (x = {})));
  const R = function (e) {
    return e === r.SelectorQuery.Platform.EViewportType.Width ? window.innerWidth : window.innerHeight;
  };
  const D = function (e, t) {
    if (t === r.SelectorQuery.Platform.ENodeDetailType.Id) return e.id;
    if (t !== r.SelectorQuery.Platform.ENodeDetailType.Dataset) {
      if (t === r.SelectorQuery.Platform.ENodeDetailType.Node4Canvas) {
        if (e.classList.contains('a-canvas')) {
          return {
            nodeName: 'canvas',
            nodeId: e.id,
            nodeCanvasType: e.getAttribute('canvas-type') || ''
          };
        }
      } else {
        r.SelectorQuery.Platform.ENodeDetailType.Context;
      }
    }
  };
  let M;
  const L = n(2);
  const F = n(4);
  const V = {
    loadFontFace(e, t, n) {
      void 0 === e && (e = {});
      const i = e;
      const r = i.family;
      const a = void 0 === r ? '' : r;
      const o = i.source;
      const s = void 0 === o ? '' : o;
      const c = i.desc;
      const l = void 0 === c ? {} : c;
      const u = document.fonts;
      if (u) {
        const p = new FontFace(a, s, l);
        p.load()
          .then(((e) => {
            t({
              status: e.status
            }),
            u.add(p);
          }
          ), (() => {
            n({
              status: p.status
            });
          }
          ));
      } else {
        if (!a || !s) {
          return void n({
            status: 'error'
          });
        }
        const d = document.createElement('style');
        const h = `@font-face {font-family: "${a}"; src: ${s}; font-weight: ${l.weight}; font-stretch: ${l.stretch}; font-variant: ${l.variant}; font-feature-setting:${l.featureSetting}; unicode-range: ${l.unicodeRange}; font-style: ${l.style}; }`;
        d.appendChild(document.createTextNode(h)),
        document.head.appendChild(d),
        t({
          status: 'loaded'
        });
      }
    }
  };
  const
    U = n(9);
  !(function (e) {
    e.Light = 'light',
    e.Dark = 'dark';
  }(M || (M = {})));
  let B;
  const z = M.Light;
  const W = ((B = {})[M.Light] = 'lightmode',
  B[M.Dark] = 'darkmode',
  B);
  const H = Object(U.default)(W)
    .map(((e) => W[e]
    ));
  let
    X = [z];

  function Y() {
    return window.matchMedia && L.r && window.matchMedia('(prefers-color-scheme: dark)').matches ? M.Dark : L.l && ((e = (navigator.userAgent || navigator.swuserAgent).match(/\scolorScheme\/([^\s]*)/)) && e[1] || M.Light) === M.Dark ? M.Dark : M.Light;
    let e;
  }

  function $(e) {
    void 0 === e && (e = M.Light),
    W[e] && X.indexOf(e) > -1 && (document.documentElement.classList.remove.apply(document.documentElement.classList, H),
    document.documentElement.classList.add(W[e]));
  }

  function K(e) {
    if (typeof e.supportColorScheme === 'string') {
      try {
        e.supportColorScheme = JSON.parse(e.supportColorScheme);
      } catch (t) {
        console.error('error support color scheme config'),
        e.supportColorScheme = [];
      }
    }
    let t;
    void 0 === (t = e.supportColorScheme) && (t = []),
    (X = t.filter(((e) => e === M.Light || e === M.Dark
    ))).length > 1 ? $(Y()) : $(X[0] || z);
  }

  const q = {
    changeColorScheme(e) {
      $(e);
    }
  };
  const G = n(73);
  const J = n(84);
  let Q = !1;
  const Z = {};
  const ee = {};
  const te = function (e) {
    return void 0 === e && (e = {}),
    {
      left: e.left || 0,
      top: e.top || 0,
      right: e.right || 0,
      bottom: e.bottom || 0
    };
  };
  const ne = function (e) {
    return void 0 === e && (e = {}),
    {
      left: e.left,
      top: e.top,
      right: e.right,
      bottom: e.bottom,
      width: e.width,
      height: e.height
    };
  };
  const ie = function (e) {
    const t = e.targetNode;
    const n = e.relatives;
    const i = e.thresholds;
    const r = e.currentRatio;
    const a = e.intersectionObserverId;
    if (t) {
      const o = (function (e) {
        for (var t = document.documentElement, n = t.clientWidth, i = t.clientHeight, r = null, a = 0; a < e.length; a++) {
          const o = e[a];
          const s = o.node;
          const c = o.margins;
          const l = s ? s.getBoundingClientRect() : {
            left: 0,
            top: 0,
            right: n,
            bottom: i,
            width: n,
            height: i
          };
          const u = {
            left: l.left - c.left,
            top: l.top - c.top,
            right: l.right + c.right,
            bottom: l.bottom + c.bottom
          };
          r = r ? Object(J.a)(r, u) : u;
        }
        return r;
      }(n));
      const s = ne(t.getBoundingClientRect());
      const c = Object(J.a)(o, s);
      const l = s.width * s.height;
      const u = l ? c.width * c.height / l : 0;
      e.currentRatio = u;
      let p = void 0 === r;
      r !== u && i.forEach(((e) => {
        if (p) return !1;
        u <= e && r >= e ? p = !0 : u >= e && r <= e && (p = !0);
      }
      )),
      p && Object(E.e)()
        .callRemoteBridge('_fireIntersectionObserver', {
          intersectionObserverId: a,
          info: {
            id: t.id,
            dataset: t.dataset,
            time: Date.now(),
            boundingClientRect: s,
            intersectionRatio: u,
            intersectionRect: ne(c),
            relativeRect: o
          }
        });
    }
  };
  const re = function () {
    Q || Object(G.a)((() => {
      Q = !0,
      (function () {
        for (const e in ee) ie(ee[e]);
        Q = !1;
      }());
    }
    ));
  };
  const ae = n(64);
  const oe = window;
  const se = n(120);
  const ce = n(71);
  const le = n(107);
  const ue = n(8);
  const pe = n(40);
  const de = n(39);
  const he = n(41);
  const fe = self;
  let me = !1;
  let ve = !1;
  const ge = {};
  Object(ue.a)(document, {
    pause() {
      me = !0;
    },
    resume() {
      me = !1,
      ve = !1;
    }
  }),
  E.b.addListener('titleCloseClick', (() => {
    ve = !0;
  }
  ));
  const be = function (e, t) {
    void 0 === t && (t = '');
    const n = Object(E.g)();
    const i = n.chInfo;
    const r = n.chinfo;
    Object(pe.a)({
      type: 'monitor',
      bizType: 'TINYAPP',
      seedId: 'APPX_PromotionModal_Load_Stage',
      param1: e,
      param2: t,
      param4: Object(de.a)({
        chInfo: i || r
      })
    });
  };
  const ye = function (e) {
    const t = e.startupParams;
    const n = e.type;
    const i = e.resAppId;
    const r = e.extraParams;
    const a = void 0 === r ? {} : r;
    const o = e.needLog;
    const s = void 0 === o ? '' : o;
    if (!ge[`${n}Loaded`]) {
      ge[`${n}Loaded`] = !0;
      const c = Object(E.e)();
      const u = Object(E.e)();
      const p = u.isAppFirstPage;
      const h = u.isRestarted;
      const f = u.getPagePath;
      let m = 0;
      !(function e() {
        Object(l.a)('addPkgRes', {
          resAppId: i
        }, ((i) => {
          if (s && be(`${s}2`),
          !i || !i.urls || i.urls.length === 0) {
            return s && be(`${s}no_url${m}`, i ? i.errorMessage || i.error : ''),
            void (m < 5 && (m++,
            setTimeout(e, 1e3)));
          }
          for (var r = !1, o = function (e, i) {
              const o = i[e];
              if (Object(le.a)(o, 'index.js')) {
                return s && be(`${s}3`),
                r = !0,
                new Promise((((e) => {
                  Object(ae.a)(o, e, (() => {
                    s && be(`${s}url_load_error`);
                  }
                  ));
                })
                )).then((() => {
                  s && be(`${s}4`),
                  fe[`AppX${n}`] && (s && be(`${s}5`),
                  new fe[`AppX${n}`](document.body, {
                    isTab(e) {
                      void 0 === e && (e = {});
                      const t = e.url;
                      let n = void 0 === t ? '' : t;
                      return n.charAt(0) === '/' && (n = n.slice(1)),
                      Object(d.b)(n);
                    },
                    navigateTo(e) {
                      c.callRemoteBridge('navigateTo', e);
                    },
                    switchTab(e) {
                      c.callRemoteBridge('switchTab', e);
                    },
                    isPagePaused() {
                      return me;
                    },
                    isAppFirstPage() {
                      return !!p || !!h;
                    },
                    isAppClosed() {
                      return ve;
                    },
                    isAppHomePage() {
                      return Object(ce.a)() === f();
                    },
                    startupParams: t,
                    extraParams: a,
                    resUrl: o
                  }));
                }
                )),
                'break';
              }
            }, l = 0, u = i.urls; l < u.length; l++) {
            if (o(l, u) === 'break') break;
          }
          !r && s && be(`${s}no_index.js`);
        }
        ));
      }());
    }
  };
  E.b.addListener('pageReady', (() => {
    (Object(F.isFeatureAvailable)('f_renderDebugger_23_0') && setTimeout((() => {
      Object(he.c)() && ye({
        startupParams: {},
        type: 'RenderDebugger',
        resAppId: '63300039'
      });
    }
    ), 500),
    Object(F.isFeatureAvailable)('f_cloudService_23_0') || Object(F.isFeatureAvailable)('f_promotionModal_23_0')) && new Promise((((e) => {
      Object(E.e)()
        .callRemoteSecret('getStartupParams', e);
    })
    )).then(((e) => {
      void 0 === e && (e = {});
      const t = function () {
        Object(F.isFeatureAvailable)('f_cloudService_23_0') && Object(c.a)('tinyAppConfig', {
          key: 'cloudService',
          scopeType: 'app'
        }, ((t) => {
          if (t && t.value) {
            const n = JSON.parse(t.value);
            typeof n === 'object' && n.isHomeOpen === 'YES' && ye({
              startupParams: e,
              type: 'CloudService',
              resAppId: '63300167',
              extraParams: {
                customerId: n.customerId
              }
            });
          }
        }
        ));
      };
      const n = E.h.getSwitch('removeGlobalExtra2411', !0);
      if (!0 !== n && void 0 !== n) {
        const i = Object(E.e)();
        const r = i.isAppFirstPage;
        const a = i.isRestarted;
        if (e.appXPromotionModal == '1' && (r || a)) {
          be('startupParams1'),
          ye({
            startupParams: e,
            type: 'PromotionModal',
            resAppId: '63300076',
            needLog: 'startupParams'
          }),
          t();
        } else {
          if (Object(F.isFeatureAvailable)('f_tinyAppConfig_merge_23_0')) {
            return void Object(c.a)('tinyAppConfig', {
              keys: [{
                key: 'miniAppCloseIntercept',
                scopeType: 'app'
              }, {
                key: 'miniOperateConfig',
                scopeType: 'app'
              }, {
                key: 'cloudService',
                scopeType: 'app'
              }]
            }, ((t) => {
              void 0 === t && (t = {});
              const n = t.value || {};
              const i = n.miniAppCloseIntercept;
              const r = n.miniOperateConfig;
              const a = n.cloudService;
              let o = '';
              i && (o = JSON.parse(i));
              let s = '';
              r && (s = JSON.parse(r));
              let c = '';
              a && (c = JSON.parse(a)),
              typeof o === 'object' && o.appXPromotionModalClose === '1' ? (be('tinyAppConfig1'),
              ye({
                startupParams: e,
                type: 'PromotionModalClose',
                resAppId: '63300201',
                extraParams: o,
                needLog: 'tinyAppConfig'
              })) : typeof s === 'object' && s.appXPromotionModal === '1' && (be('tinyAppConfig1'),
              ye({
                startupParams: e,
                type: 'PromotionModalByConfig',
                resAppId: '63300201',
                extraParams: s,
                needLog: 'tinyAppConfig'
              })),
              typeof c === 'object' && c.isHomeOpen === 'YES' && Object(F.isFeatureAvailable)('f_cloudService_23_0') && ye({
                startupParams: e,
                type: 'CloudService',
                resAppId: '63300167',
                extraParams: {
                  customerId: c.customerId
                }
              });
            }
            ));
          }
          Object(c.a)('tinyAppConfig', {
            key: 'miniAppCloseIntercept',
            scopeType: 'app'
          }, ((t) => {
            if (t && t.value) {
              const n = JSON.parse(t.value);
              typeof n === 'object' && n.appXPromotionModalClose === '1' ? (be('tinyAppConfig1'),
              ye({
                startupParams: e,
                type: 'PromotionModalClose',
                resAppId: '63300201',
                extraParams: n,
                needLog: 'tinyAppConfig'
              })) : Object(c.a)('tinyAppConfig', {
                key: 'miniOperateConfig',
                scopeType: 'app'
              }, ((t) => {
                if (t && t.value) {
                  const n = JSON.parse(t.value);
                  typeof n === 'object' && n.appXPromotionModal === '1' && (be('tinyAppConfig1'),
                  ye({
                    startupParams: e,
                    type: 'PromotionModalByConfig',
                    resAppId: '63300201',
                    extraParams: n,
                    needLog: 'tinyAppConfig'
                  }));
                }
              }
              ));
            }
          }
          )),
          t();
        }
      } else {
        t();
      }
    }
    ));
  }
  ));
  const _e = n(80);
  const we = {};
  let Ce = [];
  const xe = n(47);
  const Te = n(20);
  const Se = n(77);
  const Ee = n(30);
  const ke = n(25);
  let Oe;
  const Pe = xe.a;
  let
    Ne = 0;
  Object(xe.b)(re),
  Object(ue.a)(document, {
    onShare(e) {
      const t = Object(p.d)();
      t && t.publicInstance.onShareAppMessage && e.preventDefault();
    },
    firePullToRefresh(e) {
      e.preventDefault();
    },
    pullIntercept(e) {
      e.preventDefault();
    },
    favorite(e) {
      const t = E.h.getSwitch('removeGlobalExtra2411', !0);
      if (!0 !== t && void 0 !== t && e.data.action !== 'removeFromFavorite') {
        const n = Object(p.d)();
        Oe ? Oe.update(e.data) : Object(_e.a)('AppXFavoriteModal', '63300055', (() => {
          Oe = new window.AppXFavoriteModal(document.body, e.data);
        }
        ), n && n.props);
      }
    }
  }),
  Object(ue.a)(window, {
    resize: Pe,
    animationstart: Pe,
    animationiteration: Pe,
    animationend: Pe,
    transitionend: Pe
  }),
  window.addEventListener('scroll', (() => {
    re();
  }
  ), {
    capture: !0,
    passive: !0
  }),
  Object(F.isFeatureAvailable)('f_snapshot_23_0') && E.b.addListener(['pageReady', 'snapshot', 'templateSnapshot'], ((e) => {
    const t = e.type;
    const n = void 0 === t ? 'pageReady' : t;
    const i = e.templateType;
    const r = Object(E.g)();
    const a = !1 !== r.isSnapshotEnabled;
    const o = r.isEnableTemplateSnapshot;
    const s = !1 !== r.isAutoSnapshot;
    const c = function (e) {
      const t = Object(ce.a)();
      const n = Object(p.f)()[0].getPagePath();
      if (L.l && n || t && n === t) {
        let r = document.documentElement.cloneNode(!0);
        if (!r.querySelector('[snapshot-font-size]')) {
          const a = document.createElement('script');
          a.setAttribute('snapshot-font-size', '1'),
          !1 !== Object(Se.a)() ? a.innerHTML = 'document.documentElement.style.fontSize = (100 * document.documentElement.clientWidth / 750) + "px";' : a.innerHTML = 'document.documentElement.style.fontSize = "50px";',
          r.querySelector('head')
            .appendChild(a);
        }
        for (let o = r.querySelectorAll('[snapshot-delete], .snapshot-delete'), s = o.length, c = 0; c < s; c++) o[c].parentNode.removeChild(o[c]);
        for (let u = r.querySelectorAll('[snapshot-ignore], .snapshot-ignore'), d = u.length, h = 0; h < d; h++) u[h].innerHTML = '';
        if (e === 'saveTemplateSnapshot') {
          for (let f = r.querySelectorAll('[snapshot-replace], .snapshot-replace'), m = f.length, v = 0; v < m; v++) {
            f[v].classList.contains('a-image') ? (f[v].style.backgroundImage = '',
            f[v].childNodes.length > 0 && f[v].childNodes[0].removeAttribute('src')) : f[v].innerHTML = '';
          }
        }
        if (['saveTemplateSnapshot', 'saveSnapshot'].indexOf(e) > -1) {
          for (let g = r.querySelectorAll('.a-swiper-slides'), b = 0; b < g.length; b++) {
            const y = g[b];
            let _ = y.getAttribute('snapshot-swiper-current');
            if (void 0 !== _) {
              const w = y.getAttribute('snapshot-swiper-vertical');
              if (_ = Number(_),
              isNaN(_)) {
                return;
              }
              const C = w === 'true' ? `translate(0, ${100 * -_}%) translateZ(0)` : `translate(${100 * -_}%, 0) translateZ(0)`;
              g[b].style.transform = C,
              g[b].style.WebkitTransform = C;
            }
          }
          for (let x = r.querySelectorAll('param[value=weex-view]'), T = 0; T < x.length; T++) {
            if (x[T].name === 'type') x[T].parentNode.setAttribute('snapshot', 'true');
          }
        }
        const S = {
          snapshot: `<!DOCTYPE html>${r.outerHTML.replace(/<script src=\"https:\/\/appx\/af-appx.min.js#nebula-addcors\" crossorigin=\"\"><\/script>\n/g, '')}`,
          pagePath: n
        };
        e === 'saveTemplateSnapshot' && (S.templateType = i),
        Object(l.a)(e, S),
        r = null;
      }
    };
    if (a && n !== 'templateSnapshot') {
      if (n === 'pageReady' && !s) return;
      c('saveSnapshot');
    }
    n === 'templateSnapshot' && o && c('saveTemplateSnapshot');
  }
  )),
  E.b.addListener(['pageReady', 'pageUpdate'], (() => {
    Ne < 6 && (Ne++,
    console.log('[RENDER] setData')),
    Pe();
  }
  )),
  E.b.prependListener('pageReady', ((e) => {
    const t = e.page;
    const n = {
      state: 'pageLoaded',
      page: t.pagePath,
      time: t.$readyTime
    };
    t.isAppFirstPage || (n.loadTime = t.$readyTime - t.workerPageStartTime),
    Object(l.a)('onAppPerfEvent', n),
    S.a.emitRemoteTrackerEvent('Tracker.onAppPerf', n);
  }
  )),
  Object(L.v)(),
  E.b.addListener('builtinComponentDidMount', ((e) => {
    const t = e.tagName + (e.isNative ? '-native' : '');
    we[t] || (we[t] = 1,
    Ce.push(t));
  }
  )),
  E.b.addListener(['pageReady', 'pageUpdate'], (() => {
    Ce.length > 0 && (Object(pe.a)({
      type: 'monitor',
      bizType: 'TINYAPP',
      seedId: 'APPX_COMPONENT_USAGE',
      param1: Ce.join('|')
    }),
    Ce = []);
  }
  )),
  E.b.on('pageReady', (() => {
    if (Object(Te.b)() || Object(Ee.a)()) {
      let e = !1;
      var t = (function (e, t) {
        void 0 === t && (t = 500);
        let n;
        let i = !1;
        let r = 0;
        const a = function (e) {
          clearTimeout(n),
          n = setTimeout((() => o(Date.now(), e)
          ), t);
        };
        var
          o = function (t, n) {
            return r = t,
            n = [i = !i].concat(n),
            e.apply(null, n);
          };
        return function () {
          const e = Array.prototype.slice.call(arguments);
          const n = Date.now();
          i && n - r <= t ? a(e) : (i || a(e),
          o(n, e));
        };
      }(((n) => {
        !e && Object(Te.b)() && (e = !0,
        Object(Te.a)('scrolled'),
        Object(Ee.a)() || window.removeEventListener('scroll', t)),
        Object(Ee.a)() && Ee.b.logScroll(null, {
          state: n ? ke.a.START : ke.a.END,
          xOffset: window.scrollX,
          yOffset: window.scrollY
        });
      }
      ), 500));
      window.addEventListener('scroll', t);
    }
    if (Object(Ee.a)()) {
      const n = document.querySelector('.a-page.tiny-page');
      n && n.addEventListener('click', (() => {
        Ee.b.logClick(null, {
          clickable: !1,
          isCaught: !0
        });
      }
      )),
      window.addEventListener('touchstart', ((e) => {
        const t = e.touches && e.touches[0] || {};
        const n = t.clientX;
        const i = t.clientY;
        Ee.b.logTouch({
          state: ke.a.START,
          xPos: n,
          yPos: i
        });
      }
      ), {
        passive: !0,
        capture: !0
      }),
      window.addEventListener('touchend', ((e) => {
        const t = e.changedTouches && e.changedTouches[0] || {};
        const n = t.clientX;
        const i = t.clientY;
        Ee.b.logTouch({
          state: ke.a.END,
          xPos: n,
          yPos: i
        });
      }
      ), {
        passive: !0,
        capture: !0
      });
    }
  }
  ));
  const Ie = n(10);
  const Ae = n(44);
  const je = Object(F.isFeatureAvailable)('f_onPagePerf_24_11') && Ie.i && Ie.i.onPagePerf && Ie.i.onPagePerf.bind(Object(Ae.c)());
  let Re = !1;
  E.b.on('pagePerf', ((e) => {
    const t = e.transfer;
    const n = e.render;
    const i = e.dataLen;
    const r = {
      state: 'firstPaint',
      pagePath: Object(E.e)()
        .getPagePath(),
      time: Date.now(),
      data: {
        transferTime: t,
        renderTime: n,
        dataLen: i
      }
    };
    je && je(r),
    Re || (Re = !0,
    Object(l.a)('onAppPerfEvent', r),
    E.b.emit('Tracker.onAppPerf', r));
  }
  ));
  const De = n(31);
  const Me = Object(F.isFeatureAvailable)('f_trace_24_0') && Ie.i && Ie.i.onTrace && Ie.i.onTrace.bind(Object(Ae.c)());
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
  var Le = function () {
    return (Le = Object.assign || function (e) {
      for (var t, n = 1, i = arguments.length; n < i; n++) for (const r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      return e;
    }
    ).apply(this, arguments);
  };

  function Fe(e, t, n, i) {
    return new (n || (n = Promise))((((r, a) => {
      function o(e) {
        try {
          c(i.next(e));
        } catch (e) {
          a(e);
        }
      }

      function s(e) {
        try {
          c(i.throw(e));
        } catch (e) {
          a(e);
        }
      }

      function c(e) {
        let t;
        e.done ? r(e.value) : (t = e.value,
        t instanceof n ? t : new n((((e) => {
          e(t);
        })
        ))).then(o, s);
      }

      c((i = i.apply(e, t || [])).next());
    })
    ));
  }

  function Ve(e, t) {
    let n;
    let i;
    let r;
    let a;
    let
      o = {
        label: 0,
        sent() {
          if (1 & r[0]) throw r[1];
          return r[1];
        },
        trys: [],
        ops: []
      };
    return a = {
      next: s(0),
      throw: s(1),
      return: s(2)
    },
    typeof Symbol === 'function' && (a[Symbol.iterator] = function () {
      return this;
    }
    ),
    a;

    function s(a) {
      return function (s) {
        return (function (a) {
          if (n) throw new TypeError('Generator is already executing.');
          for (; o;) {
            try {
              if (n = 1,
              i && (r = 2 & a[0] ? i.return : a[0] ? i.throw || ((r = i.return) && r.call(i),
              0) : i.next) && !(r = r.call(i, a[1])).done) {
                return r;
              }
              switch (i = 0,
              r && (a = [2 & a[0], r.value]),
              a[0]) {
                case 0:
                case 1:
                  r = a;
                  break;
                case 4:
                  return o.label++,
                  {
                    value: a[1],
                    done: !1
                  };
                case 5:
                  o.label++,
                  i = a[1],
                  a = [0];
                  continue;
                case 7:
                  a = o.ops.pop(),
                  o.trys.pop();
                  continue;
                default:
                  if (!(r = (r = o.trys).length > 0 && r[r.length - 1]) && (a[0] === 6 || a[0] === 2)) {
                    o = 0;
                    continue;
                  }
                  if (a[0] === 3 && (!r || a[1] > r[0] && a[1] < r[3])) {
                    o.label = a[1];
                    break;
                  }
                  if (a[0] === 6 && o.label < r[1]) {
                    o.label = r[1],
                    r = a;
                    break;
                  }
                  if (r && o.label < r[2]) {
                    o.label = r[2],
                    o.ops.push(a);
                    break;
                  }
                  r[2] && o.ops.pop(),
                  o.trys.pop();
                  continue;
              }
              a = t.call(e, o);
            } catch (e) {
              a = [6, e],
              i = 0;
            } finally {
              n = r = 0;
            }
          }
          if (5 & a[0]) throw a[1];
          return {
            value: a[0] ? a[1] : void 0,
            done: !0
          };
        }([a, s]));
      };
    }
  }

  Object.create;
  Object.create;
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
  var Ue = function (e, t) {
    return (Ue = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (e, t) {
      e.__proto__ = t;
    }
          || function (e, t) {
            for (const n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
          }
    )(e, t);
  };
  var Be = function () {
    return (Be = Object.assign || function (e) {
      for (var t, n = 1, i = arguments.length; n < i; n++) for (const r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      return e;
    }
    ).apply(this, arguments);
  };

  function ze(e, t, n, i) {
    return new (n || (n = Promise))((((r, a) => {
      function o(e) {
        try {
          c(i.next(e));
        } catch (e) {
          a(e);
        }
      }

      function s(e) {
        try {
          c(i.throw(e));
        } catch (e) {
          a(e);
        }
      }

      function c(e) {
        e.done ? r(e.value) : new n((((t) => {
          t(e.value);
        })
        )).then(o, s);
      }

      c((i = i.apply(e, t || [])).next());
    })
    ));
  }

  function We(e, t) {
    let n;
    let i;
    let r;
    let a;
    let
      o = {
        label: 0,
        sent() {
          if (1 & r[0]) throw r[1];
          return r[1];
        },
        trys: [],
        ops: []
      };
    return a = {
      next: s(0),
      throw: s(1),
      return: s(2)
    },
    typeof Symbol === 'function' && (a[Symbol.iterator] = function () {
      return this;
    }
    ),
    a;

    function s(a) {
      return function (s) {
        return (function (a) {
          if (n) throw new TypeError('Generator is already executing.');
          for (; o;) {
            try {
              if (n = 1,
              i && (r = 2 & a[0] ? i.return : a[0] ? i.throw || ((r = i.return) && r.call(i),
              0) : i.next) && !(r = r.call(i, a[1])).done) {
                return r;
              }
              switch (i = 0,
              r && (a = [2 & a[0], r.value]),
              a[0]) {
                case 0:
                case 1:
                  r = a;
                  break;
                case 4:
                  return o.label++,
                  {
                    value: a[1],
                    done: !1
                  };
                case 5:
                  o.label++,
                  i = a[1],
                  a = [0];
                  continue;
                case 7:
                  a = o.ops.pop(),
                  o.trys.pop();
                  continue;
                default:
                  if (!(r = (r = o.trys).length > 0 && r[r.length - 1]) && (a[0] === 6 || a[0] === 2)) {
                    o = 0;
                    continue;
                  }
                  if (a[0] === 3 && (!r || a[1] > r[0] && a[1] < r[3])) {
                    o.label = a[1];
                    break;
                  }
                  if (a[0] === 6 && o.label < r[1]) {
                    o.label = r[1],
                    r = a;
                    break;
                  }
                  if (r && o.label < r[2]) {
                    o.label = r[2],
                    o.ops.push(a);
                    break;
                  }
                  r[2] && o.ops.pop(),
                  o.trys.pop();
                  continue;
              }
              a = t.call(e, o);
            } catch (e) {
              a = [6, e],
              i = 0;
            } finally {
              n = r = 0;
            }
          }
          if (5 & a[0]) throw a[1];
          return {
            value: a[0] ? a[1] : void 0,
            done: !0
          };
        }([a, s]));
      };
    }
  }

  function He() {
  }

  function Xe(e, t) {
    for (const n in t) e[n] = t[n];
    return e;
  }

  function Ye(e, t) {
    t.appendChild(e);
  }

  function $e(e, t, n) {
    t.insertBefore(e, n);
  }

  function Ke(e) {
    e.parentNode.removeChild(e);
  }

  function qe(e) {
    for (let t = 0; t < e.length; t += 1) e[t] && e[t].d();
  }

  function Ge(e) {
    return document.createElement(e);
  }

  function Je(e) {
    return document.createTextNode(e);
  }

  function Qe() {
    return document.createComment('');
  }

  function Ze(e, t, n) {
    e.addEventListener(t, n, !1);
  }

  function et(e, t, n) {
    e.removeEventListener(t, n, !1);
  }

  function tt(e, t, n) {
    e.setAttribute(t, n);
  }

  function nt(e, t, n) {
    e.style.setProperty(t, n);
  }

  function it() {
    return Object.create(null);
  }

  function rt(e) {
    this.destroy = He,
    this.fire('destroy'),
    this.set = this.get = He,
    !1 !== e && this._fragment.u(),
    this._fragment.d(),
    this._fragment = this._state = null;
  }

  function at(e, t) {
    return e != e ? t == t : e !== t || e && typeof e === 'object' || typeof e === 'function';
  }

  function ot(e, t) {
    const n = e in this._handlers && this._handlers[e].slice();
    if (n) {
      for (let i = 0; i < n.length; i += 1) {
        const r = n[i];
        r.__calling || (r.__calling = !0,
        r.call(this, t),
        r.__calling = !1);
      }
    }
  }

  function st(e) {
    return e ? this._state[e] : this._state;
  }

  function ct(e, t, n) {
    const i = t.bind(this);
    return n && !1 === n.init || i(this.get()[e], void 0),
    this.on(n && n.defer ? 'update' : 'state', ((t) => {
      t.changed[e] && i(t.current[e], t.previous && t.previous[e]);
    }
    ));
  }

  function lt(e, t) {
    if (e === 'teardown') return this.on('destroy', t);
    const n = this._handlers[e] || (this._handlers[e] = []);
    return n.push(t),
    {
      cancel() {
        const e = n.indexOf(t);
        ~e && n.splice(e, 1);
      }
    };
  }

  function ut(e) {
    this._set(Xe({}, e)),
    this.root._lock || (this.root._lock = !0,
    dt(this.root._beforecreate),
    dt(this.root._oncreate),
    dt(this.root._aftercreate),
    this.root._lock = !1);
  }

  function pt(e) {
    const t = this._state;
    const n = {};
    let i = !1;
    for (const r in e) this._differs(e[r], t[r]) && (n[r] = i = !0);
    i && (this._state = Xe(Xe({}, t), e),
    this._recompute(n, this._state),
    this._bind && this._bind(n, this._state),
    this._fragment && (this.fire('state', {
      changed: n,
      current: this._state,
      previous: t
    }),
    this._fragment.p(n, this._state),
    this.fire('update', {
      changed: n,
      current: this._state,
      previous: t
    })));
  }

  function dt(e) {
    for (; e && e.length;) e.shift()();
  }

  function ht(e, t) {
    this._fragment[this._fragment.i ? 'i' : 'm'](e, t || null);
  }

  function ft() {
    this._fragment && this._fragment.u();
  }

  let mt;
  const vt = Xe;
  const gt = {
    destroy: rt,
    get: st,
    fire: ot,
    observe: ct,
    on: lt,
    set: ut,
    teardown: rt,
    _recompute: He,
    _set: pt,
    _mount: ht,
    _unmount: ft,
    _differs: at
  };
  const
    bt = it;

  function yt(e, t) {
    this._fragment.c(),
    this._mount(e, t);
  }

  function _t(e, t) {
    let n;
    let
      i = t.visible && Rt(e, t);
    return {
      c() {
        i && i.c(),
        n = Qe();
      },
      m(e, t) {
        i && i.m(e, t),
        $e(n, e, t);
      },
      p(t, r) {
        r.visible ? i ? i.p(t, r) : ((i = Rt(e, r)).c(),
        i.m(n.parentNode, n)) : i && (i.u(),
        i.d(),
        i = null);
      },
      u() {
        i && i.u(),
        Ke(n);
      },
      d() {
        i && i.d();
      }
    };
  }

  function wt(e, t) {
    let n;
    let
      i;
    return {
      c() {
        n = Ge('span'),
        i = Je(t.pluginDesc),
        n.className = 'a-msg-subscribe-tips-small',
        nt(n, 'user-select', 'none'),
        nt(n, 'white-space', 'pre-line');
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n);
      },
      p(e, t) {
        e.pluginDesc && (i.data = t.pluginDesc);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function Ct(e, t) {
    let n;
    let i = t.item;
    let
      r = (t.each_value,
      t.index,
      i.show && xt(e, t));
    return {
      c() {
        r && r.c(),
        n = Je('\n                ');
      },
      m(e, t) {
        r && r.m(e, t),
        $e(n, e, t);
      },
      p(t, a) {
        i = a.item,
        a.each_value,
        a.index,
        i.show ? r ? r.p(t, a) : ((r = xt(e, a)).c(),
        r.m(n.parentNode, n)) : r && (r.u(),
        r.d(),
        r = null);
      },
      u() {
        r && r.u(),
        Ke(n);
      },
      d() {
        r && r.d();
      }
    };
  }

  function xt(e, t) {
    let n;
    let i;
    let r;
    let a;
    let o;
    let s;
    let c;
    let l;
    let u;
    let p = t.item;
    let
      d = (t.each_value,
      t.index,
      p.entityName);
    return {
      c() {
        n = Ge('div'),
        i = Ge('div'),
        r = Ge('div'),
        a = Ge('div'),
        c = Ge('div'),
        l = Je(d),
        u = Ge('img'),
        i.className = 'a-msg-subscribe-item-border',
        a.className = o = `a-msg-checkbox-synthetic ${p.checked ? 'a-msg-checkbox-checked' : ''} `,
        Ze(r, 'click', Dt),
        tt(r, 'role', 'checkbox'),
        tt(r, 'aria-checked', s = p.checked),
        r.className = 'a-msg-checkbox',
        r._svelte = {
          component: e,
          each_value: t.each_value,
          index: t.index
        },
        Ze(c, 'click', Mt),
        c.className = 'a-msg-subscribe-label',
        c._svelte = {
          component: e,
          each_value: t.each_value,
          index: t.index
        },
        Ze(u, 'click', Lt),
        tt(u, 'role', 'button'),
        u.className = 'a-msg-subscribe-icon',
        u.alt = '消息示例',
        u.src = 'https://gw.alipayobjects.com/mdn/rms_3af502/afts/img/A*BubSR7KnRtEAAAAAAAAAAABkARQnAQ',
        nt(u, 'background-size', 'contain'),
        nt(u, 'background-position', 'center center'),
        u._svelte = {
          component: e,
          each_value: t.each_value,
          index: t.index
        },
        n.className = 'a-msg-subscribe-item';
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n),
        Ye(r, n),
        Ye(a, r),
        Ye(c, n),
        Ye(l, c),
        Ye(u, n);
      },
      p(e, t) {
        p = t.item,
        t.each_value,
        t.index,
        e.entityList && o !== (o = `a-msg-checkbox-synthetic ${p.checked ? 'a-msg-checkbox-checked' : ''} `) && (a.className = o),
        e.entityList && s !== (s = p.checked) && tt(r, 'aria-checked', s),
        r._svelte.each_value = t.each_value,
        r._svelte.index = t.index,
        e.entityList && d !== (d = p.entityName) && (l.data = d),
        c._svelte.each_value = t.each_value,
        c._svelte.index = t.index,
        u._svelte.each_value = t.each_value,
        u._svelte.index = t.index;
      },
      u() {
        Ke(n);
      },
      d() {
        et(r, 'click', Dt),
        et(c, 'click', Mt),
        et(u, 'click', Lt);
      }
    };
  }

  function Tt(e, t) {
    let n;
    let i;
    let r;
    let a;
    let o;
    let s;
    let c;
    let l;
    let u;
    let
      p;
    return {
      c() {
        n = Ge('div'),
        i = Ge('div'),
        r = Ge('div'),
        a = Ge('div'),
        o = Ge('div'),
        s = Ge('div'),
        c = Ge('div'),
        l = Ge('div'),
        u = Ge('div'),
        p = Je('建议勾选'),
        i.className = 'a-msg-subscribe-mask',
        nt(i, 'display', 'none'),
        nt(i, 'z-index', '99'),
        a.className = 'a-msg-subscribe-popover-arrow',
        u.className = 'a-msg-subscribe-remember-tip-text',
        l.className = 'a-msg-subscribe-popover-item-slot-holder a-msg-subscribe-popover-item-ver-center',
        c.className = 'a-msg-subscribe-popover-item-wrapper',
        s.className = 'a-msg-subscribe-popover-item ',
        o.className = 'a-msg-subscribe-popover-inner',
        r.className = 'a-msg-subscribe-popover-content a-msg-subscribe-popover-placement-top',
        n.className = 'a-msg-subscribe-popover-container';
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n),
        Ye(r, n),
        Ye(a, r),
        Ye(o, r),
        Ye(s, o),
        Ye(c, s),
        Ye(l, c),
        Ye(u, l),
        Ye(p, u);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function St(e, t) {
    let n;
    let i;
    let r;
    let a;
    let o;
    let s;
    let c;
    let
      l;

    function u(t) {
      const n = e.get();
      e.onOneTimeRememberChange(n.oneTimeRemember);
    }

    let p = t.showCheckGuide && Tt();
    return {
      c() {
        n = Ge('div'),
        i = Ge('div'),
        r = Ge('div'),
        a = Ge('div'),
        p && p.c(),
        s = Ge('label'),
        c = Je(t.bottomText),
        a.className = o = `a-msg-checkbox-synthetic ${t.oneTimeRemember ? 'a-msg-checkbox-checked' : ''} `,
        Ze(r, 'click', u),
        tt(r, 'role', 'checkbox'),
        tt(r, 'aria-checked', t.oneTimeRemember),
        r.className = 'a-msg-checkbox a-msg-remember-checkbox',
        i.className = 'a-msg-subscribe-popover a-msg-subscribe-remember-tip',
        s.className = 'a-msg-remember-label',
        n.className = l = `a-msg-subscribe-remember-action ${t.showCheckGuide ? 'a-msg-subscribe-remember-action-with-popover' : ''} `;
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n),
        Ye(r, i),
        Ye(a, r),
        p && p.m(i, null),
        Ye(s, n),
        Ye(c, s);
      },
      p(e, t) {
        e.oneTimeRemember && o !== (o = `a-msg-checkbox-synthetic ${t.oneTimeRemember ? 'a-msg-checkbox-checked' : ''} `) && (a.className = o),
        e.oneTimeRemember && tt(r, 'aria-checked', t.oneTimeRemember),
        t.showCheckGuide ? p || ((p = Tt()).c(),
        p.m(i, null)) : p && (p.u(),
        p.d(),
        p = null),
        e.bottomText && (c.data = t.bottomText),
        e.showCheckGuide && l !== (l = `a-msg-subscribe-remember-action ${t.showCheckGuide ? 'a-msg-subscribe-remember-action-with-popover' : ''} `) && (n.className = l);
      },
      u() {
        Ke(n),
        p && p.u();
      },
      d() {
        et(r, 'click', u),
        p && p.d();
      }
    };
  }

  function Et(e, t) {
    let n;
    let i;
    let
      r;

    function a(t) {
      const n = e.get();
      e.onLongTermRefuseChange(n.oneTimeRemember);
    }

    return {
      c() {
        n = Ge('div'),
        i = Ge('label'),
        r = Je(t.bottomText),
        Ze(i, 'click', a),
        tt(i, 'role', 'button'),
        i.className = 'a-msg-remember-label a-msg-remember-label-btn',
        n.className = 'a-msg-subscribe-remember-action';
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n),
        Ye(r, i);
      },
      p(e, t) {
        e.bottomText && (r.data = t.bottomText);
      },
      u() {
        Ke(n);
      },
      d() {
        et(i, 'click', a);
      }
    };
  }

  function kt(e, t) {
    let n;
    let i;
    let
      r = t.demoData.first.demo;
    return {
      c() {
        n = Ge('div'),
        i = Je(r),
        n.className = 'a-msg-demo-field a-msg-first-temp-name';
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n);
      },
      p(e, t) {
        e.demoData && r !== (r = t.demoData.first.demo) && (i.data = r);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function Ot(e, t) {
    let n;
    let i;
    let r;
    let a;
    let o;
    let s = t.item;
    let c = (t.each_value_1,
    t.index,
    s.name);
    let
      l = s.demo;
    return {
      c() {
        n = Ge('div'),
        i = Ge('span'),
        r = Je(c),
        a = Ge('span'),
        o = Je(l),
        i.className = 'a-msg-subscribe-card-temp-key',
        nt(i, 'user-select', 'none'),
        nt(i, 'white-space', 'pre-line'),
        a.className = 'a-msg-subscribe-card-temp-value',
        nt(a, 'user-select', 'none'),
        nt(a, 'white-space', 'pre-line'),
        n.className = 'a-msg-demo-field';
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n),
        Ye(r, i),
        Ye(a, n),
        Ye(o, a);
      },
      p(e, t) {
        s = t.item,
        t.each_value_1,
        t.index,
        e.demoData && c !== (c = s.name) && (r.data = c),
        e.demoData && l !== (l = s.demo) && (o.data = l);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function Pt(e, t) {
    for (var n, i = t.demoData.keywords, r = [], a = 0; a < i.length; a += 1) {
      r[a] = Ot(0, Xe(Xe({}, t), {
        each_value_1: i,
        item: i[a],
        index: a
      }));
    }
    return {
      c() {
        for (let e = 0; e < r.length; e += 1) r[e].c();
        n = Qe();
      },
      m(e, t) {
        for (let i = 0; i < r.length; i += 1) r[i].m(e, t);
        $e(n, e, t);
      },
      p(e, t) {
        const i = t.demoData.keywords;
        if (e.demoData) {
          for (var a = 0; a < i.length; a += 1) {
            const o = Xe(Xe({}, t), {
              each_value_1: i,
              item: i[a],
              index: a
            });
            r[a] ? r[a].p(e, o) : (r[a] = Ot(0, o),
            r[a].c(),
            r[a].m(n.parentNode, n));
          }
          for (; a < r.length; a += 1) {
            r[a].u(),
            r[a].d();
          }
          r.length = i.length;
        }
      },
      u() {
        for (let e = 0; e < r.length; e += 1) r[e].u();
        Ke(n);
      },
      d() {
        qe(r);
      }
    };
  }

  function Nt(e, t) {
    let n;
    let i;
    let
      r = t.demoData.remark.demo;
    return {
      c() {
        n = Ge('div'),
        i = Je(r),
        n.className = 'a-msg-demo-field a-msg-first-temp-name';
      },
      m(e, t) {
        $e(n, e, t),
        Ye(i, n);
      },
      p(e, t) {
        e.demoData && r !== (r = t.demoData.remark.demo) && (i.data = r);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function It(e, t) {
    let n;
    return {
      c() {
        (n = Ge('img')).className = 'a-msg-push-img',
        n.alt = '背景图',
        tt(n, 'aria-hidden', 'true'),
        nt(n, 'background-size', 'contain'),
        nt(n, 'background-position', 'center center'),
        nt(n, 'height', '1.60rem'),
        n.src = 'https://gw.alipayobjects.com/mdn/rms_3af502/afts/img/A*uwcSQaQk0HAAAAAAAAAAAABkARQnAQ';
      },
      m(e, t) {
        $e(n, e, t);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function At(e, t) {
    let n;
    return {
      c() {
        (n = Ge('img')).className = 'a-msg-push-img',
        n.alt = '背景图',
        tt(n, 'aria-hidden', 'true'),
        nt(n, 'background-size', 'contain'),
        nt(n, 'background-position', 'center center'),
        nt(n, 'height', '2.60rem'),
        n.src = 'https://gw.alipayobjects.com/mdn/rms_3af502/afts/img/A*7AnKRLb-GUUAAAAAAAAAAABkARQnAQ';
      },
      m(e, t) {
        $e(n, e, t);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function jt(e, t) {
    let n;
    return {
      c() {
        (n = Ge('img')).className = 'a-msg-push-img',
        n.alt = '背景图',
        tt(n, 'aria-hidden', 'true'),
        nt(n, 'background-size', 'contain'),
        nt(n, 'background-position', 'center center'),
        nt(n, 'height', '3.76rem'),
        n.src = 'https://gw.alipayobjects.com/mdn/rms_3af502/afts/img/A*UEdWRZL05p8AAAAAAAAAAABkARQnAQ';
      },
      m(e, t) {
        $e(n, e, t);
      },
      u() {
        Ke(n);
      },
      d: He
    };
  }

  function Rt(e, t) {
    for (var n, i, r, a, o, s, c, l, u, p, d, h, f, m, v, g, b, y, _, w, C, x, T, S, E, k, O, P, N, I, A, j, R, D, M, L, F, V, U, B, z, W, H, X, Y, $, K, q, G, J, Q, Z, ee, te, ne, ie, re, ae, oe, se, ce, le, ue, pe, de, he, fe, me, ve, ge, be, ye, _e, we = t.subscribeType === 'longterm' && wt(0, t), Ce = t.entityList, xe = [], Te = 0; Te < Ce.length; Te += 1) {
      xe[Te] = Ct(e, Xe(Xe({}, t), {
        each_value: Ce,
        item: Ce[Te],
        index: Te
      }));
    }

    function Se(t) {
      e.onPopupClose();
    }

    function Ee(t) {
      e.onSubmitSubscribeClick();
    }

    let ke = t.subscribeType === 'onetime' && t.bottomTextShow && St(e, t);
    let Oe = t.subscribeType === 'longterm' && t.bottomTextShow && Et(e, t);

    function Pe(t) {
      e.onReturnMsgClick();
    }

    let Ne = t.demoData.first && t.demoData.first.demo && kt(0, t);
    let Ie = t.demoData.keywords && Pt(0, t);
    let Ae = t.demoData.remark && t.demoData.remark.demo && Nt(0, t);
    let je = t.showEntityIds.length === 1 && It();
    let Re = t.showEntityIds.length === 2 && At();
    let De = t.showEntityIds.length === 3 && jt();

    function Me(t) {
      e.onOpenPushClick();
    }

    function Le(t) {
      e.onCancelPushClick();
    }

    function Fe(t) {
      e.onPopupClose();
    }

    function Ve(t) {
      e.onSubmitSubscribeOfConfirmClick();
    }

    return {
      c() {
        n = Ge('div'),
        i = Ge('div'),
        r = Ge('div'),
        a = Ge('div'),
        o = Ge('div'),
        s = Ge('div'),
        c = Ge('div'),
        l = Ge('div'),
        u = Ge('img'),
        p = Ge('span'),
        d = Je(t.ownerName),
        h = Ge('span'),
        f = Je('申请'),
        m = Ge('div'),
        v = Ge('span'),
        g = Je(t.pluginTitle),
        we && we.c(),
        b = Ge('div'),
        y = Ge('div');
        for (let Ce = 0; Ce < xe.length; Ce += 1) xe[Ce].c();
        _ = Ge('div'),
        w = Ge('div'),
        C = Ge('div'),
        x = Ge('div'),
        T = Je('取消'),
        S = Ge('div'),
        E = Ge('div'),
        k = Je('同意'),
        ke && ke.c(),
        N = Je('\n\n              '),
        Oe && Oe.c(),
        R = Ge('div'),
        D = Ge('div'),
        M = Ge('div'),
        L = Ge('img'),
        F = Ge('div'),
        V = Je('消息示例'),
        U = Ge('div'),
        Ne && Ne.c(),
        B = Je('\n              '),
        Ie && Ie.c(),
        z = Je('\n              '),
        Ae && Ae.c(),
        X = Ge('div'),
        je && je.c(),
        Y = Je('\n            '),
        Re && Re.c(),
        $ = Je('\n            '),
        De && De.c(),
        K = Ge('div'),
        q = Je('开启推送通知权限'),
        G = Ge('div'),
        J = Je('不漏掉任何一条订单更新提醒'),
        Q = Ge('div'),
        Z = Je('立即开启'),
        ee = Ge('div'),
        te = Je('暂时不用'),
        re = Ge('div'),
        ae = Ge('div'),
        oe = Ge('div'),
        se = Je('订阅后将长期为你发送通知消息'),
        ce = Ge('div'),
        le = Je('之后发送消息前将不再询问'),
        ue = Ge('div'),
        pe = Ge('div'),
        de = Ge('div'),
        he = Ge('div'),
        fe = Je('以后再说'),
        me = Ge('div'),
        ve = Ge('div'),
        ge = Je('确认订阅'),
        r.className = 'a-msg-subscribe-popup-mask',
        nt(r, 'z-index', '1000'),
        u.className = 'a-msg-subscribe-logo',
        u.alt = 'logo',
        tt(u, 'aria-hidden', 'true'),
        nt(u, 'background-size', 'contain'),
        nt(u, 'background-position', 'center center'),
        u.src = t.ownerLogo,
        p.className = 'a-msg-subscribe-appname',
        nt(p, 'user-select', 'none'),
        nt(p, 'overflow', 'hidden'),
        nt(p, 'text-overflow', 'ellipsis'),
        nt(p, 'white-space', 'pre-line'),
        h.className = 'a-msg-subscribe-head-tips',
        nt(h, 'user-select', 'none'),
        nt(h, 'white-space', 'pre-line'),
        l.className = 'a-msg-subscribe-head',
        v.className = 'a-msg-subscribe-tips-big',
        nt(v, 'user-select', 'none'),
        nt(v, 'white-space', 'pre-line'),
        m.className = 'a-msg-subscribe-tips',
        b.className = 'a-msg-subscribe-line',
        y.className = 'a-msg-subscribe-main',
        Ze(x, 'click', Se),
        tt(x, 'role', 'button'),
        x.className = 'a-msg-subscribe-action-btn',
        C.className = 'a-msg-subscribe-flexbox-item',
        Ze(E, 'click', Ee),
        tt(E, 'role', 'button'),
        E.className = O = `a-msg-subscribe-action-btn a-msg-subscribe-action-btn-allow ${t.btnDisable && !t.oneTimeRemember ? 'a-msg-subscribe-action-btn-allow-disabled' : ''}`,
        tt(E, 'aria-disabled', P = t.btnDisable && !t.oneTimeRemember),
        S.className = ' a-msg-subscribe-flexbox-item',
        w.className = 'a-msg-subscribe-flexbox  a-msg-subscribe-flexbox-dir-row a-msg-subscribe-flexbox-nowrap a-msg-subscribe-flexbox-justify-start a-msg-subscribe-flexbox-align-center a-msg-subscribe-flexbox-align-content-stretch',
        _.className = 'a-msg-subscribe-action',
        c.id = I = `J-msg-subscribe-main-${t.showEntityIds.length}`,
        c.className = 'a-msg-subscribe-main-panel',
        s.className = A = `a-msg-subscribe-left-main ${t.showPanel === 'main' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `,
        tt(s, 'aria-hidden', j = t.showPanel !== 'main'),
        tt(L, 'role', 'button'),
        L.className = 'a-msg-subscribe-demo-logo',
        L.alt = '返回',
        nt(L, 'background-size', 'contain'),
        nt(L, 'background-position', 'center center'),
        L.src = 'https://gw.alipayobjects.com/mdn/rms_3af502/afts/img/A*vrQxTbml3QEAAAAAAAAAAABkARQnAQ',
        Ze(M, 'click', Pe),
        M.className = 'a-msg-subscribe-demo-logo-wrapper',
        F.className = 'a-msg-subscribe-demo-title',
        D.className = 'a-msg-subscribe-head',
        U.className = 'a-msg-subscribe-desc-main',
        nt(U, 'overflow', 'hidden auto'),
        R.className = W = `a-msg-subscribe-desc ${t.showPanel === 'demo' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `,
        tt(R, 'aria-hidden', H = t.showPanel !== 'demo'),
        K.className = 'a-msg-push-text-title',
        G.className = 'a-msg-push-text-desc',
        Ze(Q, 'click', Me),
        tt(Q, 'role', 'button'),
        Q.className = 'a-msg-push-btn-main',
        Ze(ee, 'click', Le),
        tt(ee, 'role', 'button'),
        ee.className = 'a-msg-push-btn-cancel',
        X.className = ne = `a-msg-subscribe-desc ${t.showPanel === 'push' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `,
        tt(X, 'aria-hidden', ie = t.showPanel !== 'push'),
        oe.className = 'a-msg-push-text-title',
        ce.className = 'a-msg-push-text-desc',
        Ze(he, 'click', Fe),
        tt(he, 'role', 'button'),
        he.className = 'a-msg-subscribe-action-btn',
        de.className = 'a-msg-subscribe-flexbox-item',
        Ze(ve, 'click', Ve),
        tt(ve, 'role', 'button'),
        ve.className = 'a-msg-subscribe-action-btn a-msg-subscribe-action-btn-allow',
        me.className = 'a-msg-subscribe-flexbox-item',
        pe.className = 'a-msg-subscribe-flexbox  a-msg-subscribe-flexbox-dir-row a-msg-subscribe-flexbox-nowrap a-msg-subscribe-flexbox-justify-start a-msg-subscribe-flexbox-align-center a-msg-subscribe-flexbox-align-content-stretch',
        ue.className = 'a-msg-subscribe-action',
        ae.className = 'a-msg-subscribe-confirm-wrapper',
        re.className = be = `a-msg-subscribe-desc ${t.showPanel === 'confirm' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `,
        tt(re, 'aria-hidden', ye = t.showPanel !== 'confirm'),
        o.className = _e = `a-msg-subscribe-main-box a-msg-${t.showPanel}-panel a-msg-subscribe-main-box-${t.showEntityIds.length} `,
        nt(o, 'height', `${e.getHeight(t.showPanel, t.bottomTextShow, t.popHeight)}rem`),
        a.className = 'a-msg-subscribe-popup-content a-msg-subscribe-popup-bottom',
        nt(a, 'z-index', '1000'),
        i.className = 'a-msg-subscribe-popup  a-msg-subscribe-popup-show a-msg-animation ',
        nt(i, 'z-index', '1000'),
        n.className = 'a-msg-subscribe-container';
      },
      m(t, O) {
        $e(n, t, O),
        Ye(i, n),
        Ye(r, i),
        Ye(a, i),
        Ye(o, a),
        Ye(s, o),
        Ye(c, s),
        Ye(l, c),
        Ye(u, l),
        Ye(p, l),
        Ye(d, p),
        Ye(h, l),
        Ye(f, h),
        Ye(m, c),
        Ye(v, m),
        Ye(g, v),
        we && we.m(m, null),
        Ye(b, c),
        Ye(y, c);
        for (let P = 0; P < xe.length; P += 1) xe[P].m(y, null);
        Ye(_, c),
        Ye(w, _),
        Ye(C, w),
        Ye(x, C),
        Ye(T, x),
        Ye(S, w),
        Ye(E, S),
        Ye(k, E),
        ke && ke.m(c, null),
        Ye(N, c),
        Oe && Oe.m(c, null),
        e.refs.msgSubscribeMain = c,
        Ye(R, o),
        Ye(D, R),
        Ye(M, D),
        Ye(L, M),
        Ye(F, D),
        Ye(V, F),
        Ye(U, R),
        Ne && Ne.m(U, null),
        Ye(B, U),
        Ie && Ie.m(U, null),
        Ye(z, U),
        Ae && Ae.m(U, null),
        Ye(X, o),
        je && je.m(X, null),
        Ye(Y, X),
        Re && Re.m(X, null),
        Ye($, X),
        De && De.m(X, null),
        Ye(K, X),
        Ye(q, K),
        Ye(G, X),
        Ye(J, G),
        Ye(Q, X),
        Ye(Z, Q),
        Ye(ee, X),
        Ye(te, ee),
        Ye(re, o),
        Ye(ae, re),
        Ye(oe, ae),
        Ye(se, oe),
        Ye(ce, ae),
        Ye(le, ce),
        Ye(ue, ae),
        Ye(pe, ue),
        Ye(de, pe),
        Ye(he, de),
        Ye(fe, he),
        Ye(me, pe),
        Ye(ve, me),
        Ye(ge, ve);
      },
      p(t, n) {
        t.ownerLogo && (u.src = n.ownerLogo),
        t.ownerName && (d.data = n.ownerName),
        t.pluginTitle && (g.data = n.pluginTitle),
        n.subscribeType === 'longterm' ? we ? we.p(t, n) : ((we = wt(0, n)).c(),
        we.m(m, null)) : we && (we.u(),
        we.d(),
        we = null);
        const i = n.entityList;
        if (t.entityList) {
          for (var r = 0; r < i.length; r += 1) {
            const a = Xe(Xe({}, n), {
              each_value: i,
              item: i[r],
              index: r
            });
            xe[r] ? xe[r].p(t, a) : (xe[r] = Ct(e, a),
            xe[r].c(),
            xe[r].m(y, null));
          }
          for (; r < xe.length; r += 1) {
            xe[r].u(),
            xe[r].d();
          }
          xe.length = i.length;
        }
        (t.btnDisable || t.oneTimeRemember) && O !== (O = `a-msg-subscribe-action-btn a-msg-subscribe-action-btn-allow ${n.btnDisable && !n.oneTimeRemember ? 'a-msg-subscribe-action-btn-allow-disabled' : ''}`) && (E.className = O),
        (t.btnDisable || t.oneTimeRemember) && P !== (P = n.btnDisable && !n.oneTimeRemember) && tt(E, 'aria-disabled', P),
        n.subscribeType === 'onetime' && n.bottomTextShow ? ke ? ke.p(t, n) : ((ke = St(e, n)).c(),
        ke.m(c, N)) : ke && (ke.u(),
        ke.d(),
        ke = null),
        n.subscribeType === 'longterm' && n.bottomTextShow ? Oe ? Oe.p(t, n) : ((Oe = Et(e, n)).c(),
        Oe.m(c, null)) : Oe && (Oe.u(),
        Oe.d(),
        Oe = null),
        t.showEntityIds && I !== (I = `J-msg-subscribe-main-${n.showEntityIds.length}`) && (c.id = I),
        t.showPanel && A !== (A = `a-msg-subscribe-left-main ${n.showPanel === 'main' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `) && (s.className = A),
        t.showPanel && j !== (j = n.showPanel !== 'main') && tt(s, 'aria-hidden', j),
        n.demoData.first && n.demoData.first.demo ? Ne ? Ne.p(t, n) : ((Ne = kt(0, n)).c(),
        Ne.m(U, B)) : Ne && (Ne.u(),
        Ne.d(),
        Ne = null),
        n.demoData.keywords ? Ie ? Ie.p(t, n) : ((Ie = Pt(0, n)).c(),
        Ie.m(U, z)) : Ie && (Ie.u(),
        Ie.d(),
        Ie = null),
        n.demoData.remark && n.demoData.remark.demo ? Ae ? Ae.p(t, n) : ((Ae = Nt(0, n)).c(),
        Ae.m(U, null)) : Ae && (Ae.u(),
        Ae.d(),
        Ae = null),
        t.showPanel && W !== (W = `a-msg-subscribe-desc ${n.showPanel === 'demo' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `) && (R.className = W),
        t.showPanel && H !== (H = n.showPanel !== 'demo') && tt(R, 'aria-hidden', H),
        n.showEntityIds.length === 1 ? je || ((je = It()).c(),
        je.m(X, Y)) : je && (je.u(),
        je.d(),
        je = null),
        n.showEntityIds.length === 2 ? Re || ((Re = At()).c(),
        Re.m(X, $)) : Re && (Re.u(),
        Re.d(),
        Re = null),
        n.showEntityIds.length === 3 ? De || ((De = jt()).c(),
        De.m(X, K)) : De && (De.u(),
        De.d(),
        De = null),
        t.showPanel && ne !== (ne = `a-msg-subscribe-desc ${n.showPanel === 'push' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `) && (X.className = ne),
        t.showPanel && ie !== (ie = n.showPanel !== 'push') && tt(X, 'aria-hidden', ie),
        t.showPanel && be !== (be = `a-msg-subscribe-desc ${n.showPanel === 'confirm' ? 'a-msg-subscribe-show-panel' : 'a-msg-subscribe-hide-panel'} `) && (re.className = be),
        t.showPanel && ye !== (ye = n.showPanel !== 'confirm') && tt(re, 'aria-hidden', ye),
        (t.showPanel || t.showEntityIds) && _e !== (_e = `a-msg-subscribe-main-box a-msg-${n.showPanel}-panel a-msg-subscribe-main-box-${n.showEntityIds.length} `) && (o.className = _e),
        (t.showPanel || t.bottomTextShow || t.popHeight) && nt(o, 'height', `${e.getHeight(n.showPanel, n.bottomTextShow, n.popHeight)}rem`);
      },
      u() {
        Ke(n),
        we && we.u();
        for (let e = 0; e < xe.length; e += 1) xe[e].u();
        ke && ke.u(),
        Oe && Oe.u(),
        Ne && Ne.u(),
        Ie && Ie.u(),
        Ae && Ae.u(),
        je && je.u(),
        Re && Re.u(),
        De && De.u();
      },
      d() {
        we && we.d(),
        qe(xe),
        et(x, 'click', Se),
        et(E, 'click', Ee),
        ke && ke.d(),
        Oe && Oe.d(),
        e.refs.msgSubscribeMain === c && (e.refs.msgSubscribeMain = null),
        et(M, 'click', Pe),
        Ne && Ne.d(),
        Ie && Ie.d(),
        Ae && Ae.d(),
        je && je.d(),
        Re && Re.d(),
        De && De.d(),
        et(Q, 'click', Me),
        et(ee, 'click', Le),
        et(he, 'click', Fe),
        et(ve, 'click', Ve);
      }
    };
  }

  function Dt(e) {
    const t = this._svelte.component;
    const n = t.get();
    const i = this._svelte.each_value;
    const r = this._svelte.index;
    i[r];
    t.onCheckedChange(n.entityList, r);
  }

  function Mt(e) {
    const t = this._svelte.component;
    const n = t.get();
    const i = this._svelte.each_value;
    const r = this._svelte.index;
    i[r];
    t.onCheckedChange(n.entityList, r);
  }

  function Lt(e) {
    const t = this._svelte.component;
    const n = t.get();
    const i = this._svelte.each_value;
    const r = this._svelte.index;
    i[r];
    t.onIconClick(e, n.entityList, r);
  }

  function Ft(e) {
    e.preventDefault();
  }

  function Vt() {
    return !!(function () {
      if (void 0 === mt) {
        mt = !1;
        try {
          const e = Object.defineProperty({}, 'passive', {
            get() {
              mt = !0;
            }
          });
          window.addEventListener('test', null, e);
        } catch (e) {
        }
      }
      return mt;
    }()) && {
      capture: !1,
      passive: !1
    };
  }

  const Ut = (function (e) {
    function t(t) {
      const n = e.call(this, _t, t) || this;
      return n.updatePopHeight(n.get('showEntityIds').length),
      n;
    }

    return (function (e, t) {
      function n() {
        this.constructor = e;
      }

      Ue(e, t),
      e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype,
      new n());
    }(t, e)),
    t.prototype.mount = function (t, n) {
      return document.body.addEventListener('touchmove', Ft, Vt()),
      e.prototype.mount.call(this, t, n);
    }
    ,
    t.prototype.onCheckedChange = function (e, t) {
      const n = e[t];
      const i = n.entityId;
      const r = n.checked;
      e[t].checked = !r;
      const a = e.some(((e) => e.checked
      ));
      this.set({
        btnDisable: !a,
        entityList: e
      });
      const o = r ? 'c46662.d95504' : 'c46662.d95505';
      const s = this.get();
      const c = {
        ...this.options.getTracertParamsWithEntities(s),
        traceId: this.options.traceId,
        appId: s.appId,
        templateId: i,
        checked: r ? '0' : '1'
      };
      this.options.tracert('clicked', o, c);
    }
    ,
    t.prototype.onPopupClose = function () {
      this.set({
        visible: !1
      }),
      document.getElementById('__react-content')
        .removeAttribute('aria-hidden'),
      document.body.removeEventListener('touchmove', Ft, Vt());
      const e = this.get();
      const t = Bt({
        success: !1,
        stat: 'ok',
        behavior: 'cancel',
        errorCode: 11,
        errorMessage: '用户取消订阅'
      }, e);
      this.options.onResponse(t);
      const n = e.showPanel;
      const i = e.appId;
      const r = n === 'confirm' ? 'c72228.d148620' : 'c46662.d95501';
      const a = {
        ...this.options.getTracertParamsWithEntities(e),
        traceId: this.options.traceId,
        appId: i
      };
      this.options.tracert('clicked', r, a);
    }
    ,
    t.prototype.onIconClick = function (e, t, n) {
      const i = this.get();
      const r = {
        ...this.options.getTracertParamsWithEntities(i),
        traceId: this.options.traceId,
        appId: i.appId,
        templateId: t[n].entityId,
        checked: t[n].checked ? '1' : '0'
      };
      this.options.tracert('clicked', 'c46662.d95503', r),
      this.set({
        showPanel: 'demo',
        demoData: t[n].entityDemo
      });
    }
    ,
    t.prototype.onReturnMsgClick = function () {
      this.set({
        showPanel: 'main',
        demoData: {}
      });
    }
    ,
    t.prototype.onOneTimeRememberChange = function (e) {
      const t = this.get();
      const n = this.options.getTracertParamsWithEntities(t);
      const i = {
        ...n,
        keep: e ? '0' : '1',
        refuse: '0'
      };
      this.options.tracert('clicked', 'c46662.d103872', i),
      this.set({
        oneTimeRemember: !e,
        showCheckGuide: !1
      });
    }
    ,
    t.prototype.onLongTermRefuseChange = function () {
      return ze(this, void 0, void 0, (function () {
        let e;
        let t;
        let n;
        let
          i;
        return We(this, (function (r) {
          switch (r.label) {
            case 0:
              return this.set({
                longTermRemember: !0,
                visible: !1
              }),
              document.getElementById('__react-content')
                .removeAttribute('aria-hidden'),
              document.body.removeEventListener('touchmove', Ft, Vt()),
              this.convertAndSetEntityList(),
              e = this.get(),
              t = this.options.getTracertParamsWithEntities(e),
              n = {
                ...t,
                keep: '0',
                refuse: '1'
              },
              this.options.tracert('clicked', 'c46662.d103873', n),
              [4, this.options.submitSubscribe({
                slient: !0
              }, e)];
            case 1:
              return i = r.sent(),
              this.options.onResponse(i),
              [2];
          }
        }
        ));
      }
      ));
    }
    ,
    t.prototype.updatePopHeight = function (e) {
      const t = this;
      setTimeout((() => {
        let n = 0;
        try {
          n = t.refs.msgSubscribeMain.getBoundingClientRect().height / (document.documentElement.clientWidth / 750 * 100);
        } catch (t) {
          n = [3, 7.2, 8.28, 9.46][e];
        }
        t.set({
          popHeight: n
        });
      }
      ), 0);
    }
    ,
    t.prototype.getHeight = function (e, t, n) {
      return e === 'confirm' ? 4.24 : e !== 'push' || t ? n : n + 0.65;
    }
    ,
    t.prototype.onSubmitSubscribeClick = function () {
      return ze(this, void 0, void 0, (function () {
        let e;
        let t;
        let n;
        let
          i;
        return We(this, (function (r) {
          switch (r.label) {
            case 0:
              return this.get('btnDisable') && !this.get('oneTimeRemember') ? [2] : (e = this.convertAndSetEntityList(),
              t = this.get(),
              this.get('isConfirmMode') ? (this.set({
                showPanel: 'confirm'
              }),
              n = this.options.getTracertParamsWithEntities(t),
              this.options.tracert('exposure', 'c72228', n),
              [2]) : [4, this.options.submitSubscribe({
                slient: !1
              }, t)]);
            case 1:
              return i = r.sent(),
              this.options.onResponse(i),
              i && this.showPushGuide(e),
              [2];
          }
        }
        ));
      }
      ));
    }
    ,
    t.prototype.onSubmitSubscribeOfConfirmClick = function () {
      return ze(this, void 0, void 0, (function () {
        let e;
        let t;
        let n;
        let
          i;
        return We(this, (function (r) {
          switch (r.label) {
            case 0:
              return this.set({
                isConfirmMode: !1
              }),
              e = this.convertAndSetEntityList(),
              t = this.get(),
              n = this.options.getTracertParamsWithEntities(t),
              this.options.tracert('clicked', 'c72228.d148621', n),
              [4, this.options.submitSubscribe({
                slient: !1
              }, t)];
            case 1:
              return i = r.sent(),
              this.options.onResponse(i),
              i && this.showPushGuide(e),
              [2];
          }
        }
        ));
      }
      ));
    }
    ,
    t.prototype.onCancelPushClick = function () {
      const e = this.get();
      const t = this.options.getTracertParamsWithEntities(e);
      this.options.tracert('clicked', 'c50453.d103995', t, 'b19827'),
      this.set({
        visible: !1
      }),
      document.getElementById('__react-content')
        .removeAttribute('aria-hidden'),
      document.body.removeEventListener('touchmove', Ft, Vt());
    }
    ,
    t.prototype.onOpenPushClick = function () {
      const e = this;
      const t = this.get();
      const n = this.options.getTracertParamsWithEntities(t);
      this.options.tracert('clicked', 'c50453.d103994', n, 'b19827'),
      this.closePop((() => {
        e.options.openNotificationSetting();
      }
      ));
    }
    ,
    t.prototype.closePop = function (e) {
      const t = this;
      this.set({
        visible: !1
      }),
      document.getElementById('__react-content')
        .removeAttribute('aria-hidden'),
      document.body.removeEventListener('touchmove', Ft, Vt()),
      setTimeout((() => {
        t.set({
          showPanel: 'main'
        }),
        e && e();
      }
      ), 300);
    }
    ,
    t.prototype.tryGuidePush = function () {
      return ze(this, void 0, void 0, (function () {
        let e;
        let t;
        let
          n;
        return We(this, (function (i) {
          switch (i.label) {
            case 0:
              return i.trys.push([0, 2, , 3]),
              [4, this.options.tryGuidePush()];
            case 1:
              return typeof (e = i.sent()) === 'boolean' ? [2, e] : (this.set({
                showPanel: 'push'
              }),
              t = this.get(),
              n = this.options.getTracertParamsWithEntities(t),
              this.options.tracert('exposure', 'c50453', n, 'b19827'),
              this.options.tracert('exposure', 'c50453.d103994', n, 'b19827'),
              this.options.tracert('exposure', 'c50453.d103995', n, 'b19827'),
              [3, 3]);
            case 2:
              return i.sent(),
              [3, 3];
            case 3:
              return [2, !0];
          }
        }
        ));
      }
      ));
    }
    ,
    t.prototype.convertAndSetEntityList = function () {
      const e = this;
      const t = this.get('entityList')
        .map(((t) => {
          let n = t.subscribeState;
          return t.show ? e.get('longTermRemember') ? n = '0' : typeof t.checked === 'boolean' && (n = t.checked ? '1' : '0') : n = t.subscribeState,
          ({
            ...t,
            subscribeState: n
          });
        }
        ));
      return this.set({
        entityList: t
      }),
      t;
    }
    ,
    t.prototype.showPushGuide = function (e) {
      return ze(this, void 0, void 0, (function () {
        let t;
        return We(this, (function (n) {
          switch (n.label) {
            case 0:
              return t = !1,
              e.some(((e) => e.subscribeState === '1' && e.push
              )) ? [4, this.tryGuidePush()] : [3, 2];
            case 1:
              t = n.sent(),
              n.label = 2;
            case 2:
              return t || (this.set({
                visible: !1
              }),
              document.getElementById('__react-content')
                .removeAttribute('aria-hidden'),
              document.body.removeEventListener('touchmove', Ft, Vt())),
              [2];
          }
        }
        ));
      }
      ));
    }
    ,
    t;
  }(function () {
    function e(e, t) {
      typeof t.options === 'function' ? (this.options = t.options.call(null, this),
      this._state = { ...t.data, ...this.options.data }) : (this.options = t,
      this._state = { ...t.data }),
      this.root = this,
      this.refs = {},
      this._handlers = bt(),
      this._fragment = e(this, this._state),
      t.target && this.mount(t.target, t.anchor);
    }

    return vt(e.prototype, gt),
    e.prototype.mount = yt,
    e;
  }()));

  function Bt(e, t) {
    const n = t.entityList;
    const i = t.userCanSee;
    const r = t.longTermRemember;
    const a = t.oneTimeRemember;
    const o = t.oldPropsEntityIds;
    const s = (function (e, t, n) {
      for (var i = [], r = [], a = [], o = [], s = 0, c = t; s < c.length; s++) {
        const l = c[s];
        l.subscribeState === '1' ? (r.push(l.entityId),
        i.push(l.entityId),
        l.show && o.push(l.entityId)) : a.push(l.entityId);
      }
      return e === 'subscribe' ? {
        subscribeEntityIds: i,
        subscribedEntityIds: r,
        unsubscribedEntityIds: a,
        currentSubscribedEntityIds: o
      } : e === 'cancel' ? {
        entityList: n,
        subscribedEntityIds: r,
        unsubscribedEntityIds: a,
        currentSubscribedEntityIds: o
      } : {};
    }(e.behavior, n, o));
    const c = {
      success: !0,
      stat: 'ok',
      behavior: '',
      result: s,
      show: i,
      keep: a,
      refuse: r,
      ...e
    };
    return n.forEach(((e) => {
      c[e.entityId] = e.subscribeState === '1' ? 'accept' : 'reject',
      r ? e.show && (c[e.entityId] = 'reject') : e.show && typeof e.checked === 'boolean' && (c[e.entityId] = e.checked ? 'accept' : 'reject');
    }
    )),
    c;
  }

  const zt = (function () {
    function e(e) {
      this.proxy = e,
      this.startupParams = this.proxy.getStartupParams(),
      this.traceId = Math.random()
        .toString(36)
        .slice(2);
    }

    return e.prototype.request = function (e) {
      return Fe(this, void 0, void 0, (function () {
        let t;
        let n;
        let i;
        let r;
        let a;
        let o;
        let s;
        let c;
        const
          l = this;
        return Ve(this, (function (u) {
          switch (u.label) {
            case 0:
              return t = this.createFinalOptDefaultValue(e),
              [4, this.queryTemplateInfo(e)];
            case 1:
              return !1 === (n = u.sent()).success ? [2, Bt(n, t)] : [4, this.getFinalOpt(t, n)];
            case 2:
              return i = u.sent(),
              r = i.showEntityIds,
              a = i.finalOpt,
              r.length > 0 ? (o = this.getTracertParamsWithEntities(a),
              s = {
                appId: a.appId,
                ...o,
                traceId: this.traceId
              },
              this.tracert('exposure', 'c46662', s),
              c = 'c46662.d103872',
              a.subscribeType === 'longterm' && (c = 'c46662.d103873'),
              this.tracert('exposure', c, {
                ...o,
                keep: '0',
                refuse: '0'
              }),
              this.requestResolver ? [2, {
                error: 12,
                errorCode: 12,
                errorMessage: '重复触发消息订阅，调用失败',
                stat: 'failed',
                success: !1
              }] : [2, new Promise((((e) => {
                l.requestResolver = e,
                l.showEntity(a);
              })
              ))]) : [3, 3];
            case 3:
              return [4, this.submitSubscribe({
                slient: !0
              }, a)];
            case 4:
              return [2, u.sent()];
            case 5:
              return [2];
          }
        }
        ));
      }
      ));
    }
    ,
    e.prototype.tracert = function (e, t, n, i, r) {
      void 0 === n && (n = {}),
      i || (i = '18583'),
      r || (r = 'a1939');
      const a = this.startupParams;
      const o = a.url;
      const s = a.chInfo;
      const c = a.chinfo;
      const l = {
        actionId: e,
        bizType: 'bmsgsubscribe',
        eventTime: Date.now(),
        logLevel: 2,
        param1: o,
        param2: {
          version: '2.0.0'
        },
        param4: { chInfo: s || c || u('chInfo', o) || u('chinfo', o), ...n },
        spmId: (function (e) {
          void 0 === e && (e = '');
          if (e.split('.').length > 2) return e;
          return `${r}.${i}.${e}`;
        }(t)),
        type: 'monitor'
      };

      function u(e, t) {
        let n = '';
        const i = new RegExp(`(?=\\?|\\&|\\b|^)${e}\\=(.+?)(?=\\&|$)`).exec(t);
        return n = i ? `${i[1]}` : '',
        n = decodeURIComponent(n);
      }

      this.invokeHostBridgeCall('remoteLog', l, ((e) => e
      ));
    }
    ,
    e.prototype.getTracertParamsWithEntities = function (e) {
      const t = e.appId;
      const n = e.entityList;
      const i = e.oneTimeRemember;
      const r = e.longTermRemember;
      const a = [];
      const o = [];
      const s = [];
      return n.forEach(((e) => {
        const t = e.checked;
        const n = e.entityId;
        const i = e.subscribeState;
        let r = !1;
        e.show ? (r = t,
        s.push(n)) : r = i === '1',
        r ? a.push(n) : o.push(n);
      }
      )),
      {
        appId: t,
        checked: a.join(','),
        keep: i ? '1' : '0',
        refuse: r ? '1' : '0',
        show: s.join(','),
        unchecked: o.join(',')
      };
    }
    ,
    e.prototype.onResponse = function (e) {
      this.requestResolver && this.requestResolver(e),
      this.requestResolver = null;
    }
    ,
    e.prototype.invokeHostBridgeCall = function (e, t, n) {
      const i = this;
      return new Promise((((r) => {
        i.proxy.invokeHostBridgeCallProxy(e, t, ((e) => {
          const t = n(e);
          r(t);
        }
        ));
      })
      ));
    }
    ,
    e.prototype.invokeInternalAPI = function (e, t, n) {
      const i = this;
      return new Promise((((r) => {
        i.proxy.invokeClientBridgeCall4InternalAPI(e, t, ((e) => {
          const t = n(e);
          r(t);
        }
        ));
      })
      ));
    }
    ,
    e.prototype.checkIsNotificationDialogAllowed = function () {
      return Fe(this, void 0, void 0, (function () {
        let e;
        return Ve(this, (function (t) {
          return e = function (e) {
            return e && (e.result === 1 || e.result === '1' || !0 === e.result);
          }
          ,
          [2, this.invokeHostBridgeCall('APSocialNebulaPlugin.isNotificationDialogAllowed', {}, e)];
        }
        ));
      }
      ));
    }
    ,
    e.prototype.showEntity = function (e) {
      const t = this;
      const n = document.createElement('div');
      n.setAttribute('snapshot-delete', '1');
      new Ut({
        data: e,
        getTracertParamsWithEntities: this.getTracertParamsWithEntities.bind(this),
        onResponse: this.onResponse.bind(this),
        openNotificationSetting: this.openNotificationSetting.bind(this),
        submitSubscribe: this.submitSubscribe.bind(this),
        target: n,
        traceId: this.traceId,
        tracert: this.tracert.bind(this),
        tryGuidePush() {
          return Fe(t, void 0, void 0, (function () {
            return Ve(this, (function (e) {
              switch (e.label) {
                case 0:
                  return [4, this.checkIsNotificationEnabled()];
                case 1:
                  return e.sent() ? [2, !1] : [4, this.checkIsNotificationDialogAllowed()];
                case 2:
                  return e.sent() ? (this.setNotificationDialogShowed(),
                  [2]) : [2, !1];
              }
            }
            ));
          }
          ));
        }
      });
      document.body.appendChild(n),
      document.getElementById('__react-content')
        .setAttribute('aria-hidden', 'true');
    }
    ,
    e.prototype.setNotificationDialogShowed = function () {
      return Fe(this, void 0, void 0, (function () {
        let e;
        return Ve(this, (function (t) {
          return e = function (e) {
            return e;
          }
          ,
          [2, this.invokeHostBridgeCall('APSocialNebulaPlugin.setNotificationDialogShowed', {}, e)];
        }
        ));
      }
      ));
    }
    ,
    e.prototype.openNotificationSetting = function () {
      return Fe(this, void 0, void 0, (function () {
        let e;
        return Ve(this, (function (t) {
          return e = function (e) {
            return e;
          }
          ,
          [2, this.invokeHostBridgeCall('showAuthPage', {
            authType: 'NOTIFICATION',
            bizType: 'bmsgsubscribe'
          }, e)];
        }
        ));
      }
      ));
    }
    ,
    e.prototype.checkIsNotificationEnabled = function () {
      return Fe(this, void 0, void 0, (function () {
        let e;
        return Ve(this, (function (t) {
          return e = function (e) {
            return e && e.authStatus === '1';
          }
          ,
          [2, this.invokeHostBridgeCall('getAuthStatus', {
            authType: 'NOTIFICATION',
            bizType: 'bmsgsubscribe'
          }, e)];
        }
        ));
      }
      ));
    }
    ,
    e.prototype.recordOneTimeSubscribe = function (e) {
      return Fe(this, void 0, void 0, (function () {
        let t;
        let n;
        let
          i;
        return Ve(this, (function (r) {
          switch (r.label) {
            case 0:
              return [4, this.getCheckGuideInfo()];
            case 1:
              return t = r.sent(),
              n = t.entityIdMapSuccessTimes,
              i = { ...(void 0 === n ? {} : n) },
              e.forEach(((e) => {
                const t = e.entityId;
                i[t] = i[t] || 0,
                i[t] += 1;
              }
              )),
              this.setCheckGuideInfo({
                ...t,
                entityIdMapSuccessTimes: i
              }),
              [2];
          }
        }
        ));
      }
      ));
    }
    ,
    e.prototype.subscribe = function (e, t, n) {
      return Fe(this, void 0, void 0, (function () {
        let n;
        let i;
        let r;
        let a;
        let o;
        let s;
        let c;
        let l;
        const
          u = this;
        return Ve(this, (function (p) {
          return n = t.appId,
          i = t.subscribeType,
          r = t.oneTimeRemember,
          a = t.longTermRemember,
          o = t.thirdTypeAppId,
          s = {
            bizType: 'template',
            clientType: 'tinyapp',
            entityList: e,
            keep: !1,
            ownerId: n,
            refuse: !1,
            serialNo: this.traceId,
            subscribeType: i,
            thirdTypeAppId: o,
            timestamp: Date.now(),
            version: '2.0.0'
          },
          i === 'onetime' && r ? s.keep = !0 : a && (s.refuse = !0),
          c = {
            headers: {},
            operationType: 'alipay.lifemsgprod.message.subscribe',
            requestData: [s]
          },
          l = function (e) {
            return Bt(e.success ? {
              behavior: 'subscribe',
              stat: 'ok',
              success: !0
            } : u.buildErrorResult(e, '订阅失败'), t);
          }
          ,
          [2, this.invokeInternalAPI('appxrpc', c, l)];
        }
        ));
      }
      ));
    }
    ,
    e.prototype.submitSubscribe = function (e, t) {
      return void 0 === e && (e = {
        slient: !1
      }),
      Fe(this, void 0, void 0, (function () {
        let n;
        let i;
        let r;
        let a;
        let o;
        let s;
        let
          c;
        return Ve(this, (function (l) {
          switch (l.label) {
            case 0:
              return n = t.entityList,
              i = void 0 === n ? [] : n,
              r = t.subscribeType,
              i.length === 0 ? [2] : (a = i.filter(((e) => e.subscribeState === '1'
              )),
              r === 'onetime' && this.recordOneTimeSubscribe(a),
              e.slient || (this.showLoading({
                content: '订阅中...'
              }),
              o = this.getTracertParamsWithEntities(t),
              s = {
                ...o,
                appId: t.appId,
                traceId: this.traceId
              },
              this.tracert('clicked', 'c46662.d95502', s)),
              [4, this.subscribe(i, t, a)]);
            case 1:
              return c = l.sent(),
              e.slient || this.hideLoading(),
              [2, c];
          }
        }
        ));
      }
      ));
    }
    ,
    e.prototype.getFinalOpt = function (e, t) {
      return Fe(this, void 0, void 0, (function () {
        let n;
        let i;
        let r;
        let a;
        let o;
        let s;
        let
          c;
        return Ve(this, (function (l) {
          switch (l.label) {
            case 0:
              return n = t.entityList,
              i = t.subscribeType,
              r = (function (e, t) {
                for (var n = [], i = [], r = (function (e, t) {
                    if (t !== 'longterm') return !1;
                    const n = e.filter(((e) => e.show
                    ));
                    return n.length > 0 && n.every(((e) => e.defaultState === 'nocheck'
                    ));
                  }(e, t)), a = 0, o = e; a < o.length; a++) {
                  const s = o[a];
                  const c = s.defaultState;
                  s.show && (n.push(s.entityId),
                  s.checked = !!r || c === 'check',
                  s.disabled = !1),
                  i.push(s);
                }
                return {
                  initialEntityList: i,
                  isConfirmMode: r,
                  showEntityIds: n
                };
              }(n, i)),
              a = r.initialEntityList,
              o = r.showEntityIds,
              s = r.isConfirmMode,
              e = {
                ...e,
                ...t,
                entityList: a,
                inHand: !0,
                isConfirmMode: s,
                showEntityIds: o
              },
              t.defaultAlways && (e.oneTimeRemember = !0),
              o.length > 0 ? (c = typeof t.showBottomText !== 'boolean' || t.showBottomText,
              e = {
                ...e,
                bottomTextShow: c,
                btnDisable: !a.some(((e) => e.checked
                )),
                showPanel: 'main',
                userCanSee: !0,
                visible: !0
              },
              i !== 'onetime' || t.defaultAlways ? [3, 2] : [4, this.checkShouldShowCheckGuide(a, e)]) : [3, 2];
            case 1:
              l.sent(),
              l.label = 2;
            case 2:
              return [2, {
                showEntityIds: o,
                finalOpt: e
              }];
          }
        }
        ));
      }
      ));
    }
    ,
    e.prototype.createFinalOptDefaultValue = function (e) {
      return {
        appId: e.appId || this.startupParams.appId,
        bottomText: '',
        bottomTextShow: !1,
        btnDisable: !0,
        demoData: {},
        entityList: [],
        inHand: !1,
        invokedByApi: !1,
        isConfirmMode: !1,
        longTermRemember: !1,
        mask: !0,
        oldPropsEntityIds: e.entityIds,
        oneTimeRemember: !1,
        ownerLogo: '',
        ownerName: '',
        pluginDesc: '你可能收到多次消息，可以在【小程序-右上角三个点-授权管理】中管理消息',
        pluginTitle: '向你推送一次以下消息',
        popHeight: 0,
        showCheckGuide: !1,
        showEntityIds: [],
        showPanel: 'main',
        subscribeType: '',
        thirdTypeAppId: e.thirdTypeAppId,
        userCanSee: !1,
        visible: !1
      };
    }
    ,
    e.prototype.checkShouldShowCheckGuide = function (e, t) {
      return Fe(this, void 0, void 0, (function () {
        let n;
        let i;
        let r;
        let a;
        let o;
        let s;
        let
          c;
        return Ve(this, (function (l) {
          switch (l.label) {
            case 0:
              return [4, this.getCheckGuideInfo()];
            case 1:
              return n = l.sent(),
              r = (i = n || {}).previousShowTime,
              a = void 0 === r ? 0 : r,
              o = i.entityIdMapSuccessTimes,
              s = void 0 === o ? {} : o,
              (Date.now() - a) / 864e5 <= 15 ? [2] : (c = 0,
              e.forEach(((e) => {
                const t = s[e.entityId];
                typeof t === 'number' && t > c && (c = t);
              }
              )),
              c < 2 ? [2] : (t.showCheckGuide = !0,
              this.setCheckGuideInfo({
                ...n,
                previousShowTime: Date.now()
              }),
              [2]));
          }
        }
        ));
      }
      ));
    }
    ,
    e.prototype.getCheckGuideInfo = function () {
      return Fe(this, void 0, void 0, (function () {
        let e;
        return Ve(this, (function (t) {
          switch (t.label) {
            case 0:
              return [4, this.getStorage('CHECK_GUIDE_STORAGE_KEY')];
            case 1:
              return (e = t.sent()) ? [2, e] : [2, {
                entityIdMapSuccessTimes: {},
                previousShowTime: 0
              }];
          }
        }
        ));
      }
      ));
    }
    ,
    e.prototype.getStorage = function (e) {
      const t = this;
      return new Promise((((n) => {
        t.proxy.invokeClientBridgeCall('getAPDataStorage', {
          key: e,
          type: 'user'
        }, ((e) => {
          e && e.data ? n(JSON.parse(e.data)) : n(null);
        }
        ));
      })
      ));
    }
    ,
    e.prototype.showLoading = function (e) {
      this.proxy.invokeClientBridgeCall('showLoading', e);
    }
    ,
    e.prototype.hideLoading = function () {
      this.proxy.invokeClientBridgeCall('hideLoading', {});
    }
    ,
    e.prototype.setStorage = function (e, t) {
      const n = this;
      return new Promise((((i) => {
        n.proxy.invokeClientBridgeCall('setAPDataStorage', {
          data: JSON.stringify(t),
          key: e,
          type: 'user'
        }, (() => {
          i();
        }
        ));
      })
      ));
    }
    ,
    e.prototype.setCheckGuideInfo = function (e) {
      this.setStorage('CHECK_GUIDE_STORAGE_KEY', e);
    }
    ,
    e.prototype.buildErrorResult = function (e, t) {
      const n = e.error;
      const i = {
        error: n,
        errorCode: n,
        errorMessage: '接口调用失败',
        stat: 'failed',
        success: !1
      };
      return n === 100201 ? (i.errorMessage = '调用次数超限',
      i) : (i.errorCode = e.resultCode || n || '-1',
      i.errorMessage = e.resultMsg || e.errorMessage || t,
      i);
    }
    ,
    e.prototype.queryTemplateInfo = function (e) {
      return Fe(this, void 0, void 0, (function () {
        let t;
        let n;
        let i;
        let r;
        let a;
        const
          o = this;
        return Ve(this, (function (s) {
          return t = e.appId,
          n = e.entityIds,
          i = e.thirdTypeAppId,
          r = {
            headers: {},
            operationType: 'alipay.lifemsgprod.message.querySubscribeEntityList',
            requestData: [{
              bizType: 'template',
              clientType: 'tinyapp',
              entityIds: n,
              ownerId: t || this.startupParams.appId,
              serialNo: this.traceId,
              thirdTypeAppId: i,
              version: '2.0.0'
            }]
          },
          a = function (e) {
            return e.success && e.data ? e.data : o.buildErrorResult(e, '校验模板列表失败');
          }
          ,
          [2, this.invokeInternalAPI('appxrpc', r, a)];
        }
        ));
      }
      ));
    }
    ,
    e;
  }());
  let Wt = null;
  const Ht = {};
  const Xt = o()({
    SDKVersion: L.a,
    ExtSDKVersion: F.ExtSDKVersion
  }, T, S.a, V, {
    createSelectorQuery(e, t, n) {
      let i;
      const
        r = [];
      if (e) {
        const a = Object(E.e)()
          .getComponentById(e);
        a && (i = O.a.findDOMNode(a));
      } else {
        i = P;
      }
      i ? (t.forEach(((e) => {
        const t = e.selector;
        const n = e.type;
        const a = t.value;
        const o = t.type;
        if (a === 'viewport') {
          n === 'rect' ? r.push({
            width: N.innerWidth,
            height: N.innerHeight
          }) : n === 'scroll' && r.push({
            scrollTop: N.pageYOffset,
            scrollLeft: N.pageXOffset
          });
        } else if (o === 'all') {
          const s = [].slice.call(i.querySelectorAll(a), 0);
          s.length ? r.push(s.map(((e) => I(e, n)
          ))) : r.push(null);
        } else {
          const c = i.querySelector(a);
          c ? r.push(I(c, n)) : r.push(null);
        }
      }
      )),
      n && n(r)) : n && n(r);
    },
    createSelectorQueryEnhanced(e, t, n) {
      n && n(function (e, t, n, i, r) {
        let a;
        let o;
        const
          s = new Array(r.length);
        return r.forEach(((r, c) => {
          let l;
          let u;
          let
            p;
          if (a = r.selector,
          o = r.option || ((l = r.type) === 'rect' ? {
            rect: 1,
            size: 1
          } : l === 'scroll' ? {
            scrollOffset: 1
          } : void 0)) {
            if ((p = a).type !== 'all' && p.value === 'viewport') {
              u = {},
              o.size && (u.width = t(0),
              u.height = t(1)),
              o.scrollOffset && (u.scrollLeft = window.pageXOffset,
              u.scrollTop = window.pageYOffset);
            } else if (a.type === 'all') {
              const d = e(i, a.value, !0);
              if (d) {
                u = new Array(d.length);
                for (let h = 0; h < d.length; h++) u[h] = A(d[h], o, n);
              }
            } else {
              const f = e(i, a.value, !1);
              f && (u = A(f, o, n));
            }
          }
          s[c] = u || null;
        }
        )),
        s;
      }(j, R, D, e, t));
    },
    addIntersectionObserver(e) {
      const t = e.intersectionObserverId;
      const n = e.options;
      const i = e.relativeInfo;
      const r = e.targetSelector;
      let a = [];
      if (n.selectAll) {
        a = document.querySelectorAll(r);
      } else {
        const o = document.querySelector(r);
        a = o ? [o] : [];
      }
      a.length || console.warn(`目标节点${r}未找到，当前监听未生效`);
      const s = [];
      return i.forEach(((e) => {
        let t;
        const n = e.selector;
        const
          i = e.margins;
        (t = n == null ? null : document.querySelector(n)) || n == null ? s.push({
          node: t,
          margins: te(i)
        }) : console.warn(`参照节点${n}未找到，此参照节点将会被忽略`);
      }
      )),
      s.length || console.warn('未找到任何参照节点，当前监听未生效'),
      (function (e, t, n, i, r) {
        e.length && t.length && (Z[r] = e.length,
        e.forEach(((e, a) => {
          const o = `${r}@${a}`;
          const s = {
            targetNode: e,
            relatives: t,
            thresholds: n,
            currentRatio: i,
            intersectionObserverId: r
          };
          e ? (ee[o] = s,
          Object(G.a)(((e) => {
            ie(s);
          }
          ))) : (delete ee[o],
          --Z[r]);
        }
        )));
      }(a, s, n.thresholds, n.initialRatio, t));
    },
    removeIntersectionObserver(e) {
      for (let t = Z[e], n = 0; n < t; n++) {
        delete ee[`${e}@${n}`];
      }
      delete Z[e];
    },
    call: c.a,
    callInternalAPI: l.a,
    __reportFrameworkPerf(e, t) {
      let n;
      const i = t.start;
      const r = t.end;
      const
        a = {
          state: 'renderFrameworkLoaded',
          loadTime: e,
          time: Date.now()
        };
      Object(De.k)(((n = {})[De.i] = i,
      n[De.h] = r,
      n)),
      Object(l.a)('onAppPerfEvent', a),
      S.a.emitRemoteTrackerEvent('Tracker.onAppPerf', a),
      Me && Me(s.a.ClientDidFrameworkLoad, Date.now(), e);
    },
    console: (function (e) {
      function t(t) {
        return e.apply(this, arguments);
      }

      return t.toString = function () {
        return e.toString();
      }
      ,
      t;
    }((function (e) {
      for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
      console[e].apply(console, n.slice(0, -2));
    }
    ))),
    hideKeyboard() {
      const e = document.activeElement;
      e && e.blur && e.blur(),
      void 0 !== window._AppxActiveNativeElement && Object(c.a)('NBComponent.sendMessage', {
        actionType: 'blur',
        element: window._AppxActiveNativeElement
      });
    },
    setKeyboardCursor(e) {
      const t = e.cursor;
      if (typeof t === 'number') {
        const n = document.activeElement;
        n && n.setSelectionRange && n.setSelectionRange(t, t),
        Object(l.a)('updateNativeKeyBoardInput', {
          cursor: t
        }),
        void 0 !== window._AppxActiveNativeElement && Object(c.a)('NBComponent.sendMessage', {
          actionType: 'cursor',
          element: window._AppxActiveNativeElement,
          data: {
            cursor: t
          }
        });
      }
    },
    preloadImages(e, t) {
      Object(se.b)(e, t);
    },
    triggerSnapshot() {
      E.b.emit('snapshot', {
        type: 'snapshot'
      });
    },
    triggerTemplateSnapshot(e) {
      const t = e.templateType;
      E.b.emit('templateSnapshot', {
        type: 'templateSnapshot',
        templateType: t
      });
    },
    enableRDSDetect(e, t) {
      const n = void 0 === e ? {} : e;
      const i = n.enabled;
      const r = n.appId;
      const a = {
        enabled: !0
      };
      if (i) {
        if (oe.json_ua) {
          t(a);
        } else {
          const o = new Date();
          const s = `${o.getFullYear()}${o.getMonth() + 1}${o.getDate()}${o.getHours()}`;
          const c = `https://${Object(E.g)().baseRDSUrl || 'rds.alipay.com/ua_'}${r}.js?t=${s}`;
          Object(ae.a)(c, (() => {
            t(a);
          }
          ), (() => {
            t({
              enabled: !1,
              error: 1,
              errorMessage: 'RDS资源加载失败'
            });
          }
          ), 'json_ua');
        }
      }
    },
    getRDSData(e) {
      oe.json_ua ? e({
        data: oe.json_ua.toString()
      }) : e({
        error: 1,
        errorMessage: '获取RDS数据失败'
      });
    },
    getSelectedTextRange(e) {
      if (document.activeElement && document.activeElement !== document.body) {
        const t = document.activeElement;
        const n = t.selectionStart;
        const i = t.selectionEnd;
        e(void 0 !== n ? n === i ? {
          cursor: n
        } : {
          start: n,
          end: i
        } : {});
      } else {
        e({});
      }
    },
    msgSubscribe(e, t) {
      const n = {
        getExtraInfo() {
          return Ht;
        },
        getStartupParams: E.g,
        invokeHostBridgeCallProxy: Object(E.e)().callRemoteBridge,
        invokeClientBridgeCall4InternalAPI: l.a,
        invokeClientBridgeCall: c.a
      };
      const i = n.getExtraInfo();
      let r = i.msgSubscribe;
      r || (i.msgSubscribe = r = new zt(n)),
      r.request(e)
        .then(((e) => {
          t(e);
        }
        ), (() => {
          t({
            errorCode: 10,
            errorMessage: '系统异常',
            stat: 'failed',
            success: !1
          });
        }
        ));
    }
  }, q, {
    emitTitleCloseClickEvt() {
      E.b.emit('titleCloseClick');
    },
    invokeMethod(e, t) {
      const n = void 0 === e ? {} : e;
      const i = n.method;
      const r = void 0 === i ? '' : i;
      const a = n.params;
      const o = void 0 === a ? {} : a;
      const s = Ie.i.renderMethods || {};
      typeof s[r] === 'function' ? s[r].call(Object(Ae.c)(), o, t) : t && t({
        error: 1,
        errorMessage: `${r} 未找到`
      });
    },
    getTrackerData(e) {
      let t;
      if (Wt !== null && e.hasOwnProperty(Wt)) {
        t = e[Wt];
      } else {
        const n = Object(U.default)(e)
          .find(((e) => e.indexOf('__reactInternalInstance') === 0
          ));
        n && (t = e[Wt = n]);
      }
      if (t) {
        let i;
        const
          r = t.return && t.return.memoizedProps;
        return r && r['data-tracker'] && (i = {
          tracker: r['data-tracker']
        },
        r['data-tracker-params'] && (i['tracker-params'] = r['data-tracker-params'])),
        i;
      }
    }
  });
  E.a.bridge = Xt;
  const Yt = Xt;
  const $t = n(0);
  const Kt = n.n($t);
  const qt = {};
  const Gt = n(7);
  const Jt = n(106);
  const Qt = n(110);
  const Zt = n(98);
  const en = n(37);
  const tn = n(48);
  const nn = n(74);
  const rn = Ie.i && Ie.i.onInit && Ie.i.onInit.bind(Object(Ae.c)());
  const an = self;
  const on = tn.a.REGISTER_WORKER_ERROR;
  const sn = tn.a.RENDER_GLOBAL_ERROR;
  const cn = tn.a.BLOCK_WORKER_ERROR;
  const ln = tn.a.TRACER;
  let un = !1;
  let pn = !1;

  function dn() {
    let e;
    (e = an.AlipayJSBridge).call.apply(e, arguments);
  }

  an.onerror = function (e, t, n, i, r) {
    void 0 === e && (e = ''),
    void 0 === t && (t = ''),
    void 0 === n && (n = 0),
    void 0 === i && (i = 0);
    let a = [];
    const o = r || {};
    const s = [e, t, n, i, o];
    Ie.i.onError && Ie.i.onError.apply(Object(Ae.c)(), s);
    try {
      a = (o.stack || '').split('\n')
        .splice(0, 8);
    } catch (c) {
    }
    const c = {
      msg: e,
      url: t,
      line: n,
      col: i,
      error: {
        type: o.type,
        column: o.column,
        line: o.line,
        message: o.message,
        sourceURL: o.sourceURL,
        stack: a
      }
    };
    e.indexOf('nebula work error') === 0 ? (Object(en.a)(on, c),
    console.error('[RENDER] registerWorker error', s)) : e.indexOf('[Tracer]') === 0 ? Object(en.a)(ln, c) : (Object(en.a)(sn, c),
    console.error('[RENDER] error', s));
  };
  const hn = Object(F.isFeatureAvailable)('f_skipKeepAlive_24_0');

  function fn(e) {
    const t = vn().appId;
    Object(pe.a)({
      param4: Object(de.a)({
        step: e
      }),
      type: 'behavior',
      seedId: `TinyApp-${t}-render-bootstrap`,
      actionId: 'event',
      logLevel: 1
    });
  }

  function mn(e, t) {
    if (!pn) {
      if (L.q && Jt.a.onRenderBlockError(t),
      L.o && t && e) {
        const n = document.documentElement && document.documentElement.clientHeight;
        if (n && n < 100) return void (e.innerHTML = '');
      }
      dn('getAppInfo', {
        appId: vn().appId || '',
        stageCode: ''
      }, ((n) => {
        n.name && dn('setTitle', {
          title: n.name
        });
        let i = '';
        n.iconUrl && !L.o && (i = `background-image: url(${n.iconUrl})`);
        let r = '';
        const a = Object(ce.a)();
        let o = '';
        let s = '';
        let c = '';
        const l = L.p ? 'Mini Program' : '小程序';
        if (t ? (r = '很抱歉，您访问的页面不存在',
        L.p ? r = 'Sorry! Page Not Found' : L.u && (r = '很抱歉，你訪問的頁面不存在'),
        a && (o = `<a id="relaunchApp" class="a-page-result-button">${L.p ? 'Back to ' : '回到'}${n.name || l}${L.p ? ' HomePage' : L.u ? '首頁' : '首页'}</a>`),
        s = L.o || L.q ? '' : `<a id="updateApp" class="a-page-result-button">${L.p ? 'Update' : '更新'}</a>`) : (r = '系统错误，正在排查',
        L.p ? r = 'System error, troubleshooting!' : L.u && (r = '人氣太旺，請稍後再試'),
        c = L.q ? '' : `<a id="exitApp" class="a-page-result-button">${L.p ? 'Exit' : '退出'}</a>`),
        e) {
          e.innerHTML = `<div class="a-page-result"><div class="a-page-result-wrap"><div class="a-page-result-pic-error${L.o ? '-dd' : ''}" style="${i}"></div><div class="a-page-result-title">${r}</div></div><div class="a-page-result-button-group">${o}${s}${c}</div></div>`;
          const u = e.querySelector('#relaunchApp');
          u && u.addEventListener('click', (() => {
            E.a.bridge.reLaunch({
              url: a
            });
          }
          ));
          const p = e.querySelector('#updateApp');
          p && p.addEventListener('click', (() => {
            dn('updateApp');
          }
          ));
          const d = e.querySelector('#exitApp');
          d && d.addEventListener('click', (() => {
            L.o ? dn('popWindow') : (hn && dn('skipKeepAlive', {}),
            dn('exitApp'));
          }
          )),
          pn = !0;
        }
      }
      ));
    }
  }

  function vn() {
    const e = an.AlipayJSBridge.startupParams;
    return L.o && (!e.appId && e.miniAppId && (e.appId = e.miniAppId),
    e.version && (e.ddVersion = e.version)),
    e;
  }

  Object(Gt.a)({
    getStartupParams: vn,
    onSystemWorkerError(e) {
      const t = e.code;
      const n = e.e;
      const i = e.container;
      const r = e.page;
      if (Object(en.a)(t, n, !0),
      i && !r && (function (e) {
        return (e && e.error && e.error.type) !== Zt.b && !un;
      }(n))) {
        const a = n && n.error && n.error.type === Zt.a;
        a ? mn(i, a) : setTimeout((() => {
          i.querySelector('.a-page') || (Object(en.a)(cn, n, !0),
          mn(i, a));
        }
        ), 1e3);
      }
    },
    onPageNotFoundEvent(e) {
      switch (e.code) {
        case 'pause_process_error_page':
          un = !0;
          break;
        case 'restart_process_error_page':
          un = !1;
          break;
        case 'show_page_not_found':
          mn(document.getElementById('__react-content'), !0);
      }
    },
    getWorkerUrl(e) {
      const t = vn();
      const n = ['apiMessageChannel', 'appId', 'debug', 'query', 'nbsn', 'app_startup_type', 'chInfo', 'isInternalApp', 'isNotTinyProcess', 'referrerInfo', 'hasNativeCanvas'];
      L.o && n.push.apply(n, ['ddAppType', 'ddAppId', 'ddAgentId', 'ddVersion', 'ddPVersion', 'ddPackageType']),
      n.push('ap_framework_sceneId');
      let i = '';
      n.forEach(((e) => {
        t[e] && (i += `&${e}=${encodeURIComponent(t[e])}`);
      }
      ));
      const r = t.cdnBaseUrl;
      const a = void 0 === r ? '' : r;
      const o = `${a.replace(/\/$/, '')}/`;
      let s = e + (e.indexOf('?') !== -1 ? '&' : '?');
      return s = a ? `${s}source=${encodeURIComponent(o + e)}&` : s,
      s += `from_service_worker=true&url=${encodeURIComponent(`${location.protocol}//${location.host}${location.pathname}`)}${i}`;
    },
    onRegisterWorkerReady() {
      let e;
      Object(De.k)(((e = {})[De.g] = Date.now(),
      e)),
      fn('worker ready');
    },
    onRegisterWorkerFail(e) {
      const t = vn();
      L.o && dn('ddExec', {
        serviceName: 'internal.notify',
        actionName: 'send',
        args: {
          name: 'sw_error_need_refresh',
          data: {
            errorMsg: e && e.message ? e.message : '',
            miniAppId: t.appId || ''
          }
        }
      }),
      e.message.indexOf('接口不存在') !== 0 && Object(en.a)(on, {
        msg: e.message
      }),
      fn(e.message || e),
      console.error('[RENDER] registerWorker error', e);
    },
    onRegisterWorkerSuccess() {
      fn('register worker successfully'),
      Me && Me(s.a.ClientDidRegisterWorkerSuccess, Date.now());
    },
    onPageRender(e) {
      let t;
      Object(De.k)(((t = {})[De.b] = Date.now(),
      t)),
      fn(`render successfully by ${e}`);
    },
    ViewMixins: [Qt.a],
    VoiceMixin: nn.a,
    beforeRegisterWorker() {
      let e;
      const
        t = Date.now();
      Object(De.k)(((e = {})[De.c] = t,
      e[De.f] = t,
      e)),
      K(vn()),
      Me && Me(s.a.ClientWillRegisterWorker, t);
    },
    onInitMessageChannel() {
      let e;
      const
        t = Date.now();
      Object(De.k)(((e = {})[De.d] = t,
      e)),
      Me && Me(s.a.ClientWillCreateMessageChannel, t);
    },
    multiCfg: {
      forbidReturnOwner: Object(F.isFeatureAvailable)('f_forbidReturnOwner_24_0'),
      skipKeepAlive: hn,
      fixMouseEvent: Object(F.isFeatureAvailable)('f_fixMouseEvent_24_2'),
      allowDynamicDefaultProps: Object(F.isFeatureAvailable)('f_allowDynamicDefaultProps_24_3'),
      allowDynamicPluginRefresh: Object(F.isFeatureAvailable)('f_allowDynamicPluginRefresh_24_5'),
      outputComponent2TreeInfo: Object(F.isFeatureAvailable)('f_outputComponent2TreeInfo_24_5'),
      deepCheckTouchSupport: Object(F.isFeatureAvailable)('f_deepCheckTouchSupport_24_7'),
      enableStyleScope: Object(F.isFeatureAvailable)('f_enableStyleScope_24_8'),
      supportAppxSwitch: Object(F.isFeatureAvailable)('f_supportAppxSwitch_24_8'),
      setupAppxTracer: Object(F.isFeatureAvailable)('f_setupAppxTracer_24_11'),
      fixPageWhenLoadDynamicPlugin: Object(F.isFeatureAvailable)('f_fixPageWhenLoadDynamicPlugin_24_13')
    }
  }),
  Me && Object(Gt.a)({
    trace: Me
  }),
  rn && rn(),
  n.d(t, 'abridge', (() => yn
  )),
  n.d(t, 'bridge', (() => Yt
  )),
  n.d(t, 'compilerConfig', (() => qt
  )),
  n.d(t, 'getStartupParams', (() => vn
  )),
  n.d(t, 'Component', (() => u.c
  )),
  n.d(t, 'WorkerComponent', (() => u.f
  )),
  n.d(t, 'workerConsole', (() => u.k
  )),
  n.d(t, 'StyleSheet', (() => u.e
  )),
  n.d(t, 'Page', (() => u.d
  )),
  n.d(t, 'App', (() => u.b
  )),
  n.d(t, 'getApp', (() => u.g
  )),
  n.d(t, 'getCurrentPages', (() => u.i
  )),
  n.d(t, '$global', (() => u.a
  )),
  n.d(t, 'getComponentClass', (() => u.h
  )),
  n.d(t, 'registerApp', (() => u.j
  ));
  const gn = self;
  const bn = Ie.a.bridgeName;
  gn.React = Kt.a,
  bn && bn !== 'my' && (gn[bn] = Yt);
  var yn = Yt;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(46);
  const u = n(1);
  const p = n(16);
  const d = n(8);
  const h = n(12);
  const f = n(6);
  const m = n(115);
  const v = n(73);

  function g() {
  }

  function b(e, t, n) {
    return t - n < e && e < t + n;
  }

  function y(e, t) {
    return b(e, 0, t);
  }

  function _(e) {
    const t = this;
    this.requestAnimationFraming || (this.requestAnimationFraming = !0,
    Object(v.a)((() => {
      e(),
      t.requestAnimationFraming = !1;
    }
    )));
  }

  function w(e, t, n) {
    const i = {
      id: 0,
      cancelled: !1
    };
    return (function e(t, n, i, r) {
      if (!t || !t.cancelled) {
        i(n);
        const a = n.done();
        a || t.cancelled || (t.id = Object(v.a)((() => {
          e(t, n, i, r);
        }
        ))),
        a && r && r(n);
      }
    }(i, e, t, n)),
    {
      cancel: function (e) {
        e && e.id && cancelAnimationFrame(e.id),
        e && (e.cancelled = !0);
      }
        .bind(null, i),
      model: e
    };
  }

  function C(e, t) {
    this._k = e,
    this._c = t,
    this._solution = null,
    this._endPosition = 0,
    this._startTime = 0;
  }

  g.prototype.x = function (e) {
    return Math.sqrt(e);
  }
  ,
  C.prototype.reconfigure = function (e, t) {
    this._k = e,
    this._c = t,
    this.done() || (this._solution = this._solve(this.x() - this._endPosition, this.dx()),
    this._startTime = (new Date()).getTime());
  }
  ,
  C.prototype._solve = function (e, t) {
    const n = this._c;
    const i = this._k;
    const r = n * n - 4 * i;
    if (r === 0) {
      const a = -n / 2;
      const o = e;
      const s = t / (a * e);
      return {
        x(e) {
          return (o + s * e) * Math.pow(Math.E, a * e);
        },
        dx(e) {
          const t = Math.pow(Math.E, a * e);
          return a * (o + s * e) * t + s * t;
        }
      };
    }
    if (r > 0) {
      const c = (-n - Math.sqrt(r)) / 2;
      const l = (-n + Math.sqrt(r)) / 2;
      const u = (t - c * e) / (l - c);
      const p = e - u;
      return {
        x(e) {
          let t = void 0;
          let n = void 0;
          return e === this._t && (t = this._powER1T,
          n = this._powER2T),
          this._t = e,
          t || (t = this._powER1T = Math.pow(Math.E, c * e)),
          n || (n = this._powER2T = Math.pow(Math.E, l * e)),
          p * t + u * n;
        },
        dx(e) {
          let t = void 0;
          let n = void 0;
          return e === this._t && (t = this._powER1T,
          n = this._powER2T),
          this._t = e,
          t || (t = this._powER1T = Math.pow(Math.E, c * e)),
          n || (n = this._powER2T = Math.pow(Math.E, l * e)),
          p * c * t + u * l * n;
        }
      };
    }
    const d = Math.sqrt(4 * i - n * n) / 2;
    const h = -n / 2;
    const f = e;
    const m = (t - h * e) / d;
    return {
      x(e) {
        return Math.pow(Math.E, h * e) * (f * Math.cos(d * e) + m * Math.sin(d * e));
      },
      dx(e) {
        const t = Math.pow(Math.E, h * e);
        const n = Math.cos(d * e);
        const i = Math.sin(d * e);
        return t * (m * d * n - f * d * i) + h * t * (m * i + f * n);
      }
    };
  }
  ,
  C.prototype.x = function (e) {
    return e || (e = ((new Date()).getTime() - this._startTime) / 1e3),
    this._solution ? this._endPosition + this._solution.x(e) : 0;
  }
  ,
  C.prototype.dx = function (e) {
    return e || (e = ((new Date()).getTime() - this._startTime) / 1e3),
    this._solution ? this._solution.dx(e) : 0;
  }
  ,
  C.prototype.setEnd = function (e, t, n) {
    if (n || (n = (new Date()).getTime()),
    e !== this._endPosition || !y(t, 0.1)) {
      t = t || 0;
      let i = this._endPosition;
      this._solution && (y(t, 0.1) && (t = this._solution.dx((n - this._startTime) / 1e3)),
      i = this._solution.x((n - this._startTime) / 1e3),
      y(t, 0.1) && (t = 0),
      y(i, 0.1) && (i = 0),
      i += this._endPosition),
      this._solution && y(i - e, 0.1) && y(t, 0.1) || (this._endPosition = e,
      this._solution = this._solve(i - this._endPosition, t),
      this._startTime = n);
    }
  }
  ,
  C.prototype.done = function () {
    return b(this.x(), this._endPosition, 0.1) && y(this.dx(), 0.1);
  };
  const x = C;

  function T(e, t) {
    this._springX = new x(e, t),
    this._springY = new x(e, t),
    this._springScale = new x(e, t),
    this._startTime = 0;
  }

  T.prototype.setEnd = function (e, t, n) {
    const i = (new Date()).getTime();
    this._springX.setEnd(e, 1, i),
    this._springY.setEnd(t, 1, i),
    this._springScale.setEnd(n, 1, i),
    this._startTime = i;
  }
  ,
  T.prototype.x = function () {
    const e = ((new Date()).getTime() - this._startTime) / 1e3;
    return {
      x: this._springX.x(e),
      y: this._springY.x(e),
      scale: this._springScale.x(e)
    };
  }
  ,
  T.prototype.done = function () {
    const e = (new Date()).getTime();
    return this._springX.done(e) && this._springY.done(e) && this._springScale.done(e);
  }
  ,
  T.prototype.reconfigure = function (e, t) {
    this._springX.reconfigure(e, t),
    this._springY.reconfigure(e, t),
    this._springScale.reconfigure(e, t);
  };
  const S = T;
  const E = n(100);

  function k(e) {
    this._f = 1e3 * e,
    this._startTime = 0;
  }

  k.prototype.reconfigure = function (e) {
    this._f = 1e3 * e;
  }
  ,
  k.prototype.setV = function (e, t) {
    const n = Object(E.a)({
      x: e,
      y: t
    });
    this._x_v = e,
    this._y_v = t,
    this._x_a = -this._f * this._x_v / n,
    this._y_a = -this._f * this._y_v / n,
    this._t = Math.abs(e / this._x_a) || Math.abs(t / this._y_a),
    this._lastDt = null,
    this._startTime = (new Date()).getTime();
  }
  ,
  k.prototype.setS = function (e, t) {
    this._x_s = e,
    this._y_s = t;
  }
  ,
  k.prototype.s = function (e) {
    e || (e = ((new Date()).getTime() - this._startTime) / 1e3),
    e > this._t && (e = this._t,
    this._lastDt = e);
    let t = this._x_v * e + 0.5 * this._x_a * Math.pow(e, 2) + this._x_s;
    let n = this._y_v * e + 0.5 * this._y_a * Math.pow(e, 2) + this._y_s;
    return (this._x_a > 0 && t < this._endPositionX || this._x_a < 0 && t > this._endPositionX) && (t = this._endPositionX),
    (this._y_a > 0 && n < this._endPositionY || this._y_a < 0 && n > this._endPositionY) && (n = this._endPositionY),
    {
      x: t,
      y: n
    };
  }
  ,
  k.prototype.ds = function (e) {
    return e || (e = ((new Date()).getTime() - this._startTime) / 1e3),
    e > this._t && (e = this._t),
    {
      dx: this._x_v + this._x_a * e,
      dy: this._y_v + this._y_a * e
    };
  }
  ,
  k.prototype.delta = function () {
    return {
      x: -1.5 * Math.pow(this._x_v, 2) / this._x_a || 0,
      y: -1.5 * Math.pow(this._y_v, 2) / this._y_a || 0
    };
  }
  ,
  k.prototype.dt = function () {
    return -this._x_v / this._x_a;
  }
  ,
  k.prototype.done = function () {
    const e = this._lastDt === this._t;
    return this._lastDt = null,
    e;
  }
  ,
  k.prototype.setEnd = function (e, t) {
    this._endPositionX = e,
    this._endPositionY = t;
  };
  const O = k;
  const P = n(20);

  function N() {
  }

  const I = Object(u.c)({
    name: 'movable-view'
  })(c()({
    displayName: 'MovableView',
    mixins: [Object(p.f)(), Object(p.d)(), Object(p.e)()],
    statics: {
      contextType: m.a
    },
    getDefaultProps() {
      return {
        x: 0,
        y: 0,
        direction: 'none',
        disabled: !1,
        outOfBounds: !1,
        inertia: !1,
        friction: 2,
        damping: 20,
        scale: !1,
        scaleValue: 1,
        scaleMin: 0.5,
        scaleMax: 10,
        animation: !1
      };
    },
    getInitialState() {
      const e = this.props;
      const t = e.damping;
      const n = e.friction;
      const i = e.direction;
      return this.canXMove = !1,
      this.canYMove = !1,
      this.areaWidth = 0,
      this.areaHeight = 0,
      this.offset = {
        x: 0,
        y: 0
      },
      this.scaleOffset = {
        x: 0,
        y: 0
      },
      this.translateX = 0,
      this.translateY = 0,
      this.scale = 1,
      this.oldScale = 1,
      this.minX = 0,
      this.minY = 0,
      this.maxX = 0,
      this.maxY = 0,
      this._STD = new S(9 * Math.pow(t, 2) / 40, t),
      this.friction = new O(n),
      this.declineX = new g(),
      this.declineY = new g(),
      this.touchInfo = {
        historyX: [0, 0],
        historyY: [0, 0],
        historyT: [0, 0]
      },
      this.canXMove = !(i !== 'horizontal' && i !== 'all'),
      this.canYMove = !(i !== 'vertical' && i !== 'all'),
      {};
    },
    shouldComponentUpdate(e) {
      const t = this.props;
      const n = t.className;
      const i = t.id;
      const r = t.children;
      const a = t.style;
      const o = t.direction;
      const s = !Object(l.a)({
        className: e.className,
        id: e.id,
        children: e.children,
        style: e.style
      }, {
        className: n,
        id: i,
        children: r,
        style: a
      });
      if (!s) {
        const c = e.x;
        const u = e.y;
        const p = e.scaleValue;
        this.props.x !== c && this.setX(c, e.y),
        this.props.y !== u && this.setY(e.x, u),
        this.props.scaleValue !== p && this.setScaleValue(p);
      }
      return e.direction !== o && (this.canXMove = !(e.direction !== 'horizontal' && e.direction !== 'all'),
      this.canYMove = !(e.direction !== 'vertical' && e.direction !== 'all')),
      s;
    },
    componentDidMount() {
      const e = this;
      this.isScaling = !1,
      this.isTouching = !1,
      this.MovableViewEvents = Object(d.a)(this.root, {
        touchstart: this.handleTouchStart,
        touchmove: this.handleTouchMove,
        touchend: this.handleTouchEnd,
        tap: this.onMovableViewTap,
        touchcancel: this.onTouchCancel
      }),
      this.invokeWithMovableArea(((t) => {
        t.updateMovableView(e);
      }
      )),
      this.root.style.transformOrigin = 'center';
    },
    onMovableViewTap() {
      Object(P.c)(this, !1);
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.x;
      const i = t.y;
      const r = t.scaleValue;
      this.updateByParent(),
      e.x !== n && this.setX(n, i),
      e.y !== i && this.setY(n, i),
      e.scaleValue !== r && this.setScaleValue(r);
    },
    componentWillUnmount() {
      const e = this;
      this.invokeWithMovableArea(((t) => {
        t.removeMovableView(e);
      }
      )),
      this.MovableViewEvents.remove();
    },
    invokeWithMovableArea(e) {
      const t = (this && this.context).movableArea;
      t && e(t);
    },
    setX(e, t) {
      this._SFA && (this._SFA = this._SFA.cancel()),
      this.animationTo(Object(h.a)(e), Object(h.a)(t), this.scale);
    },
    setY(e, t) {
      this._SFA && (this._SFA = this._SFA.cancel()),
      this.animationTo(Object(h.a)(e), Object(h.a)(t), this.scale);
    },
    setScaleValue(e) {
      this.props.scale && (e = this.adjustScale(Object(h.a)(e)),
      this.updateScale(e, !0),
      this.updateOldScale(e));
    },
    checkParentIsValid() {
      return this.root.parentNode.dataset.component === 'movable-area';
    },
    handleTouchStart(e) {
      if (this.onTouchStart(e),
      !this.isScaling && !this.props.disabled && this.checkParentIsValid()) {
        this._FrictionAnimation && (this._FrictionAnimation = this._FrictionAnimation.cancel()),
        this._SFA && (this._SFA = this._SFA.cancel()),
        this.touchInfo.historyX = [0, 0],
        this.touchInfo.historyY = [0, 0],
        this.touchInfo.historyT = [0, 0],
        this.baseX = this.translateX,
        this.canYMove && Object(u.g)().allowsBounceVertical !== 'NO' && Object(f.a)('setCanPullDown', {
          canPullDown: !1
        }, ((e) => {
          console.log('setCanPullDown', e);
        }
        )),
        this.baseY = this.translateY,
        this.preventMove = null;
        const t = e.touches[0];
        const n = t.pageX;
        const i = t.pageY;
        this.startX = n,
        this.startY = i,
        this.firstMoveDirection = null,
        this.root.style.willChange = 'transform',
        this.isTouching = !0;
      }
    },
    handleTouchMove(e) {
      const t = this;
      const n = this.props;
      const i = n.disabled;
      const r = n.outOfBounds;
      if (this.onTouchMove(e),
      !this.isScaling && !i && this.checkParentIsValid() && this.isTouching) {
        const a = e.changedTouches[0];
        const o = a.pageX;
        const s = a.pageY;
        let c = this.translateX;
        let l = this.translateY;
        if (this.firstMoveDirection === null) {
          const u = Math.abs(this.startX - o) || 0;
          const p = Math.abs(this.startY - s) || 0;
          u > p ? this.firstMoveDirection = 'htouchmove' : u < p && (this.firstMoveDirection = 'vtouchmove');
        }
        if (this.canXMove && (c = this.baseX + o - this.startX,
        this.touchInfo.historyX.shift(),
        this.touchInfo.historyX.push(c),
        !this.canYMove && this.preventMove === null)) {
          const d = Math.abs(this.startX - o) || 0;
          const h = Math.abs(this.startY - s) || 0;
          h !== 0 && (this.preventMove = Math.abs(d / h) <= 1);
        }
        if (this.canYMove && (l = this.baseY + s - this.startY,
        this.touchInfo.historyY.shift(),
        this.touchInfo.historyY.push(l),
        !this.canXMove && this.preventMove === null)) {
          const f = Math.abs(this.startX - o) || 0;
          const m = Math.abs(this.startY - s) || 0;
          f !== 0 && (this.preventMove = Math.abs(m / f) <= 1);
        }
        if (this.touchInfo.historyT.shift(),
        this.touchInfo.historyT.push(e.timeStamp),
        !this.preventMove) {
          (this.canXMove || this.canYMove) && e.preventDefault();
          let v = 'touch';
          c < this.minX ? r ? (v = 'touch-out-of-bounds',
          c = this.minX - this.declineX.x(this.minX - c)) : c = this.minX : c > this.maxX && (r ? (v = 'touch-out-of-bounds',
          c = this.maxX + this.declineX.x(c - this.maxX)) : c = this.maxX),
          l < this.minY ? r ? (v = 'touch-out-of-bounds',
          l = this.minY - this.declineY.x(this.minY - l)) : l = this.minY : l > this.maxY && (r ? (v = 'touch-out-of-bounds',
          l = this.maxY + this.declineY.x(l - this.maxY)) : l = this.maxY),
          _.call(this, (() => {
            t.setTransform(c, l, t.scale, v);
          }
          ));
        }
      }
    },
    handleTouchEnd(e) {
      const t = this;
      this.onTouchEnd(e);
      const n = this.props;
      const i = n.disabled;
      const r = n.onChangeEnd;
      const a = n.inertia;
      if (!i && this.checkParentIsValid()) {
        if (!this.isScaling && !i && this.isTouching) {
          if (this.root.style.willChange = 'auto',
          this.canYMove && Object(u.g)().allowsBounceVertical !== 'NO' && Object(f.a)('setCanPullDown', {
            canPullDown: !0
          }, ((e) => {
            console.log('setCanPullDown', e);
          }
          )),
          this.isTouching = !1,
          !this.preventMove) {
            if (!this.revise('out-of-bounds') && a) {
              const o = this.touchInfo;
              const s = o.historyX;
              const c = o.historyY;
              const l = o.historyT;
              if (l[1] - l[0] == 0) return;
              const p = (s[1] - s[0]) / (l[1] - l[0]) * 1e3;
              const d = (c[1] - c[0]) / (l[1] - l[0]) * 1e3;
              if (!p && !d) return;
              this.friction.setV(p, d),
              this.friction.setS(this.translateX, this.translateY);
              const h = this.friction.delta();
              const m = h.x;
              const v = h.y;
              let g = m + this.translateX;
              let b = v + this.translateY;
              g < this.minX ? (g = this.minX,
              b = this.translateY + (this.minX - this.translateX) * v / m) : g > this.maxX && (g = this.maxX,
              b = this.translateY + (this.maxX - this.translateX) * v / m),
              b < this.minY ? (b = this.minY,
              g = this.translateX + (this.minY - this.translateY) * m / v) : b > this.maxY && (b = this.maxY,
              g = this.translateX + (this.maxY - this.translateY) * m / v),
              this.friction.setEnd(g, b),
              this._FrictionAnimation = w(this.friction, (() => {
                const e = t.friction.s();
                const n = e.x;
                const i = e.y;
                t.setTransform(n, i, t.scale, 'friction');
              }
              ), (() => {
                t._FrictionAnimation && (t._FrictionAnimation = t._FrictionAnimation.cancel());
              }
              ));
            }
          }
        }
        r && r({
          detail: {
            x: this.translateX,
            y: this.translateY
          }
        });
      }
    },
    revise(e) {
      const t = this.getLimitXY(this.translateX, this.translateY);
      const n = t.x;
      const i = t.y;
      const r = t.outOfBounds;
      return r && this.animationTo(n, i, this._scale, e),
      r;
    },
    animationTo(e, t, n, i, r, a) {
      const o = this;
      this._FrictionAnimation && (this._FrictionAnimation = this._FrictionAnimation.cancel()),
      this._SFA && (this._SFA = this._SFA.cancel()),
      this.props.scale || (n = this.scale);
      const s = this.getLimitXY(e, t);
      e = s.x,
      t = s.y,
      this.props.animation ? (this._STD._springX._solution = null,
      this._STD._springY._solution = null,
      this._STD._springScale._solution = null,
      this._STD._springX._endPosition = this.translateX,
      this._STD._springY._endPosition = this.translateY,
      this._STD._springScale._endPosition = this.scale,
      this._STD.setEnd(e, t, n),
      this._SFA = w(this._STD, (() => {
        const e = o._STD.x();
        const t = e.x;
        const n = e.y;
        const s = e.scale;
        o.setTransform(t, n, +s.toFixed(3), i, r, a);
      }
      ), (() => {
        o._SFA && (o._SFA = o._SFA.cancel());
      }
      ))) : this.setTransform(e, t, n, i, r, a);
    },
    setTransform(e, t, n, i, r, a) {
      if (void 0 === n && (n = 1),
      void 0 === r && (r = !1),
      void 0 === a && (a = !1),
      this.root) {
        const o = this.props;
        const s = o.onChange;
        const c = o.onScale;
        !s || r || this.translateX === e && this.translateY === t || s({
          detail: {
            x: e,
            y: t,
            source: i
          }
        }),
        this.props.scale || (n = this.scale),
        n = +this.adjustScale(n)
          .toFixed(3),
        c && a && n !== this.scale && c({
          detail: {
            scale: n,
            x: e,
            y: t
          }
        });
        const l = `translateX(${e}px) translateY(${t}px) translateZ(0px) scale(${n})`;
        this.root.style.transform = l,
        this.root.style.webkitTransform = l,
        this.translateX = e,
        this.translateY = t,
        this.scale = n;
      }
    },
    updateByParent() {
      const e = this;
      this.invokeWithMovableArea(((t) => {
        const n = e.props;
        const i = n.x;
        const r = n.y;
        const a = n.scale;
        const o = n.scaleValue;
        e._FrictionAnimation && (e._FrictionAnimation = e._FrictionAnimation.cancel()),
        e._SFA && (e._SFA = e._SFA.cancel());
        const s = a ? o : 1;
        e.areaWidth = t.width || 0,
        e.areaHeight = t.height || 0,
        e.updateOffset(t),
        e.updateWH(s),
        e.updateBoundary(),
        e.translateX || (e.translateX = i + e.scaleOffset.x),
        e.translateY || (e.translateY = r + e.scaleOffset.y);
        const c = e.getLimitXY(e.translateX, e.translateY);
        e.setTransform(c.x, c.y, s, '', !0),
        e.updateOldScale(s);
      }
      ));
    },
    updateOffset(e) {
      this.offset.x = (function e(t, n) {
        if (t === n) return 0;
        let i = t.offsetLeft;
        return t.offsetParent ? i += e(t.offsetParent, n) : 0;
      }(this.root, e.root));
      this.offset.y = (function e(t, n) {
        if (t === n) return 0;
        let i = t.offsetTop;
        return t.offsetParent ? i += e(t.offsetParent, n) : 0;
      }(this.root, e.root));
    },
    updateWH(e) {
      e = this.adjustScale(e || this.scale);
      const t = this.root.getBoundingClientRect();
      this.height = t.height / this.scale,
      this.width = t.width / this.scale;
      const n = this.height * e;
      const i = this.width * e;
      this.scaleOffset = {
        x: (i - this.width) / 2,
        y: (n - this.height) / 2
      };
    },
    updateBoundary() {
      const e = 0 - this.offset.x + this.scaleOffset.x;
      const t = this.areaWidth - this.width - this.offset.x - this.scaleOffset.x;
      this.minX = Math.min(e, t),
      this.maxX = Math.max(e, t);
      const n = 0 - this.offset.y + this.scaleOffset.y;
      const i = this.areaHeight - this.height - this.offset.y - this.scaleOffset.y;
      this.minY = Math.min(n, i),
      this.maxY = Math.max(n, i);
    },
    getLimitXY(e, t) {
      let n = !1;
      return e > this.maxX ? (e = this.maxX,
      n = !0) : e < this.minX && (e = this.minX,
      n = !0),
      t > this.maxY ? (t = this.maxY,
      n = !0) : t < this.minY && (t = this.minY,
      n = !0),
      {
        x: e,
        y: t,
        outOfBounds: n
      };
    },
    adjustScale(e) {
      const t = this.props;
      const n = t.scaleMax;
      const i = t.scaleMin;
      return e = Math.max(0.5, i, e),
      e = Math.min(10, n, e);
    },
    beginScale() {
      this.isScaling = !0;
    },
    updateScale(e, t) {
      const n = this;
      if (void 0 === t && (t = !1),
      this.props.scale) {
        e = this.adjustScale(e),
        this.updateWH(e),
        this.updateBoundary();
        const i = this.getLimitXY(this.translateX, this.translateY);
        const r = i.x;
        const a = i.y;
        t ? this.animationTo(r, a, e, '', !0, !0) : _.call(this, (() => {
          n.setTransform(r, a, e, '', !0, !0);
        }
        ));
      }
    },
    updateOldScale(e) {
      this.oldScale = e;
    },
    setScaleByMA(e) {
      this.props.scale && (this.beginScale(),
      this.updateScale(e * this.oldScale));
    },
    endScaleByMA() {
      this.isScaling = !1,
      this.updateOldScale(this.scale);
    },
    saveRoot(e) {
      this.root = e;
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.id;
      const i = e.style;
      const a = e.children;
      const s = e.$appx;
      return o.a.createElement('div', r()({
        className: t,
        style: i,
        id: n,
        ref: this.saveRoot,
        onClick: N
      }, s.getTrackerConfig()), a);
    }
  }));
  t.default = I;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(21);
  const p = n.n(u);
  const d = n(29);
  const h = n(114);
  const f = n(2);
  const m = n(4);
  const v = function (e) {
    return e.split('');
  };
  const g = RegExp('[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]');
  const b = function (e) {
    return g.test(e);
  };
  const y = '[\\ud800-\\udfff]';
  const _ = '[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]';
  const w = '\\ud83c[\\udffb-\\udfff]';
  const C = '[^\\ud800-\\udfff]';
  const x = '(?:\\ud83c[\\udde6-\\uddff]){2}';
  const T = '[\\ud800-\\udbff][\\udc00-\\udfff]';
  const S = `(?:${_}|${w})` + '?';
  const E = `[\\ufe0e\\ufe0f]?${S}(?:\\u200d(?:${[C, x, T].join('|')})[\\ufe0e\\ufe0f]?${S})*`;
  const k = `(?:${[`${C}${_}?`, _, x, T, y].join('|')})`;
  const O = RegExp(`${w}(?=${w})|${k + E}`, 'g');
  const P = function (e) {
    return e.match(O) || [];
  };
  const N = function (e) {
    return b(e) ? P(e) : v(e);
  };
  const I = n(57);
  const A = n(8);
  const j = n(9);
  const R = n(11);
  const D = n(47);
  const M = n(12);
  const L = n(30);
  const F = n(25);
  const V = self;
  t.default = Object(s.c)({
    name: 'textarea'
  })(l()({
    displayName: 'Textarea',
    mixins: [d.b],
    getDefaultProps() {
      return {
        value: '',
        maxlength: 140,
        showCount: !0,
        controlled: !1,
        enableNative: navigator.userAgent.indexOf('AlipayClient') !== -1 || Object(s.g)().enableNativeTextarea,
        autoHeight: !1,
        cursorSpacing: 0,
        cursor: void 0,
        showConfirmBar: !0,
        selectionStart: -1,
        selectionEnd: -1,
        adjustPosition: !0,
        oneRowForAutoHeight: !1
      };
    },
    getInitialState() {
      return this.compositionend = !0,
      this.a11yComponentEnable = s.h.getSwitch('a11yComponentEnable', !1),
      this.supportNative = Object(m.isNativeComponent)() && this.props.enableNative && !f.q && !0 !== V.disableNativeTextArea,
      {
        focused: this.props.focus
      };
    },
    componentDidMount() {
      this.state.focused && this.focus(!0),
      this.handleHeight(),
      this.supportNative && (this.nativeTextareaEvents = Object(A.a)(this.textarea, {
        complete: this.onComplete,
        linechange: this.onLinechange
      }));
    },
    componentDidUpdate(e) {
      const t = this.props;
      const n = t.focus;
      const i = t.value;
      const r = t.controlled;
      if (!n || e.focus || this.state.focused || this.focus(!1),
      this.handleHeight(),
      this.supportNative) {
        this.updateNativeKeyBoardInput();
      } else if (r) {
        const a = this.lastValue;
        const o = this.lastCursor;
        this.lastValue = void 0,
        this.lastCursor = void 0,
        void 0 !== a && void 0 !== o && a === Object(M.a)(i) && this.textarea.setSelectionRange(o, o);
      }
    },
    updateNativeKeyBoardInput() {
      if (V._currentInput === this.textarea && !0 === this.compositionend) {
        const e = Object(I.a)(window.getComputedStyle(this.container, null).color);
        const t = {
          text: Object(M.a)(this.getCurrentValue()),
          color: e
        };
        void 0 !== this.lastCursor && (t.cursor = this.lastCursor),
        this.lastValue = void 0,
        this.lastCursor = void 0,
        Object(R.a)('updateNativeKeyBoardInput', t);
      }
    },
    componentWillUnmount() {
      this.nativeTextareaEvents && this.nativeTextareaEvents.remove();
    },
    handleHeight() {
      if (this.props.autoHeight && this.textarea) {
        this.container.style.height = 'auto';
        const e = this.textarea;
        this.props.oneRowForAutoHeight && e.setAttribute('rows', '1');
        const t = (function (e) {
          for (var t = []; e && e.parentNode && e.parentNode instanceof Element;) {
            e.parentNode.scrollTop && t.push({
              node: e.parentNode,
              scrollTop: e.parentNode.scrollTop
            }),
            e = e.parentNode;
          }
          return t;
        }(e));
        const n = document.documentElement && document.documentElement.scrollTop;
        e.style.height = '',
        e.style.height = `${e.scrollHeight}px`,
        t.forEach(((e) => {
          e.node.scrollTop = e.scrollTop;
        }
        )),
        n && (document.documentElement.scrollTop = n),
        Object(D.a)();
      }
    },
    onInput(e) {
      let t;
      const n = e.target.value;
      const i = (`${n}`).length;
      const r = this.props;
      const a = r.onInput;
      const o = r.controlled;
      const
        s = {};
      if (this.compositionend = this.supportNative && f.r ? !(!0 === e.nativeEvent.marked) : this.compositionend,
      this.compositionend && (void 0 !== (t = this.supportNative ? e.nativeEvent && e.nativeEvent.cursor : this.textarea.selectionStart) && t !== i && (this.lastValue = n,
      this.lastCursor = t),
      a)) {
        const c = {
          value: n
        };
        void 0 !== t && (c.cursor = t),
        a({
          appxReturnHandle: ['bridge', 'setKeyboardCursor'],
          detail: c
        });
      }
      o && this.compositionend || (s.value = n),
      Object(j.default)(s).length > 0 && this.setState(s);
    },
    onFocus(e) {
      const t = this.props.onFocus;
      this.setState({
        focused: !0
      }),
      t && t({
        detail: {
          value: e.target.value
        }
      }),
      L.b.logFocus(this, e.target.value);
    },
    onBlur(e) {
      this.supportNative ? e.nativeEvent.simulated && this.blur(e) : this.blur(e);
    },
    blur(e) {
      const t = this.props.onBlur;
      this.setState({
        focused: !1
      }),
      t && t({
        detail: {
          value: e.target.value
        }
      }),
      L.b.logBlur(this, F.b.TEXTAREA, e.target.value);
    },
    onComplete(e) {
      const t = this.props.onConfirm;
      t && t({
        detail: {
          value: e.target.value
        }
      });
    },
    onLinechange(e) {
      const t = this.props.onLinechange;
      if (t) {
        const n = e.data || {};
        t({
          detail: {
            height: n.height,
            heightRpx: n.heightRpx,
            lineCount: n.lineCount
          }
        });
      }
      Object(D.a)();
    },
    focus(e) {
      void 0 === e && (e = !0),
      !this.props.disabled && this.textarea && Object(h.a)(this.textarea, e, this.supportNative);
    },
    onKeyDown(e) {
      const t = this.props.onConfirm;
      this.supportNative || e.keyCode !== 13 || t && t({
        detail: {
          value: e.target.value
        }
      });
    },
    saveContainer(e) {
      this.container = e;
    },
    saveTextarea(e) {
      this.textarea = e;
    },
    handleCompositionStart() {
      this.compositionend = !1;
    },
    handleCompositionEnd(e) {
      if (!this.compositionend) {
        this.compositionend = !0;
        const t = this.props;
        const n = t.onInput;
        const i = t.controlled;
        const r = e.target.value;
        const a = (`${r}`).length;
        const o = {};
        const s = this.textarea.selectionStart;
        if (void 0 !== s && s !== a && (this.lastValue = r,
        this.lastCursor = s),
        n) {
          const c = {
            value: r
          };
          void 0 !== s && (c.cursor = s),
          n({
            appxReturnHandle: ['bridge', 'setKeyboardCursor'],
            detail: c
          });
        }
        o.value = i ? Object(M.a)(this.getCurrentValue()) : r,
        Object(j.default)(o).length > 0 && this.setState(o);
      }
    },
    render() {
      let e;
      let t;
      const n = this.props;
      const i = n.id;
      const a = n.style;
      const s = n.className;
      const c = n.placeholder;
      const l = n.disabled;
      const u = n.maxlength;
      const d = n.onConfirm;
      const h = n.showCount;
      const m = n.placeholderStyle;
      const v = n.placeholderClass;
      const g = n.autoHeight;
      const b = n.fixed;
      const y = n.cursorSpacing;
      const _ = n.cursor;
      const w = n.showConfirmBar;
      const C = n.selectionStart;
      const x = n.selectionEnd;
      const T = n.adjustPosition;
      const S = n.$appx;
      const E = this.compositionend ? Object(M.a)(this.getCurrentValue()) : this.state.value;
      let
        k = {};
      d && !this.supportNative && (k = {
        onKeyDown: this.onKeyDown
      });
      let O;
      let P;
      const I = this.a11yComponentEnable && S && S.getDOMProps() || {};
      const
        A = {};
      f.r ? (void 0 === (P = E) && (P = ''),
      O = N(P).length + (function (e) {
        return void 0 === e && (e = ''),
        (e.match(/\n/g) || []).length;
      }(E)),
      A.onCompositionStart = this.handleCompositionStart,
      A.onCompositionEnd = this.handleCompositionEnd) : O = E.length;
      const j = p()(((e = {})[s] = !0,
      e['a-textarea-show-count'] = h,
      e));
      const R = p()(((t = {})['a-textarea-placeholder'] = !0,
      t[v] = !!v,
      t));
      return this.supportNative && (A['data-keyboard'] = 'text',
      A['data-auto-height'] = g,
      A['data-cursor-spacing'] = y,
      A['data-fixed'] = b,
      A['data-adjust-position'] = T,
      A['data-show-confirm-bar'] = w,
      A['data-selection-start'] = C,
      A['data-selection-end'] = x,
      void 0 !== _ && (A['data-cursor'] = _)),
      o.a.createElement('div', {
        className: j,
        id: i,
        style: a,
        ref: this.saveContainer
      }, o.a.createElement('div', {
        className: 'a-textarea-wrap'
      }, (typeof E === 'string' && E.length === 0 || !E && E !== 0) && c && o.a.createElement('div', {
        className: R,
        style: m ? this.props.$appx.getNormalizedStyle(m) : {}
      }, c), o.a.createElement('textarea', r()({
        ref: this.saveTextarea,
        value: E,
        className: 'a-textarea-content',
        maxLength: u,
        onInput: this.onInput,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        disabled: l
      }, I, k, A))), h && u > 0 && o.a.createElement('p', {
        className: 'a-textarea-count-wrap'
      }, o.a.createElement('span', {
        className: 'a-textarea-count'
      }, O), '/', u));
    }
  }));
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(5);
  const c = n.n(s);
  const l = n(1);
  const u = n(16);
  const p = n(6);
  const d = n(2);
  const h = n(8);
  const f = n(75);
  const m = n(57);
  const v = n(9);
  const g = n(120);
  const b = n(38);
  const y = n(39);
  const _ = n(40);
  const w = function (e, t) {
    return e / t * 1e3;
  };
  const C = {
    componentDidMount() {
      this.useNative || (this.trackFps = Object(b.a)(this.trackFps, 5e3),
      this.fpsTrackData = {
        drawId: 0,
        currentList: {
          head: null,
          tail: null,
          length: 0
        },
        validTotalFrameCount: 0,
        validTotalElapsedTime: 0,
        avgFps: 0,
        lowestFps: 0,
        highestFps: 0
      }),
      this.trackUsage();
    },
    componentWillUnmount() {
      this.useNative || this.trackFps();
    },
    createFrameNode() {
      return {
        id: this.fpsTrackData ? ++this.fpsTrackData.drawId : 0,
        start: Date.now(),
        end: 0,
        prev: null,
        next: null
      };
    },
    computeFps(e) {
      const t = this.fpsTrackData;
      e.end = Date.now(),
      t.currentList.length === 0 ? (t.currentList.tail = t.currentList.head = e,
      t.currentList.length = 1) : e.start - t.currentList.tail.start < 100 ? t.currentList.length >= 60 ? (this.doFps(),
      t.currentList.tail = t.currentList.head = e,
      t.currentList.length = 1) : (t.currentList.tail = e,
      t.currentList.length++) : t.currentList.length > 1 ? (this.doFps(),
      t.currentList.tail = t.currentList.head = e,
      t.currentList.length = 1) : t.currentList.tail = t.currentList.head = e;
    },
    doFps() {
      const e = this.fpsTrackData;
      const t = e.currentList;
      const n = e.validTotalFrameCount;
      const i = e.validTotalElapsedTime;
      if (t && t.tail.end && t.head.start) {
        const r = t.tail.end - t.head.start;
        e.validTotalFrameCount = n + t.length,
        e.validTotalElapsedTime = i + r,
        e.avgFps = w(e.validTotalFrameCount, e.validTotalElapsedTime);
        const a = w(t.length, r);
        e.highestFps = Math.max(e.highestFps, a),
        e.lowestFps = e.lowestFps === 0 ? a : Math.min(e.lowestFps, a),
        this.useNative || this.trackFps();
      }
    },
    trackUsage() {
      Object(_.a)({
        type: 'monitor',
        bizType: 'TINYAPP',
        seedId: 'canvas.create',
        actionId: 'event',
        param4: Object(y.a)({
          SDKVersion: d.a,
          'canvas-dom-id': this.getId(),
          appId: Object(l.g)().appId,
          isNative: !!this.useNative,
          pagePath: Object(l.e)()
            .getPagePath()
        })
      });
    },
    trackFps() {
      const e = this.fpsTrackData;
      const t = e.avgFps;
      const n = e.lowestFps;
      const i = e.highestFps;
      Object(_.a)({
        type: 'monitor',
        bizType: 'TINYAPP',
        seedId: 'canvas.fps',
        actionId: 'event',
        param4: Object(y.a)({
          'canvas-dom-id': this.getId(),
          SDKVersion: d.a,
          appId: Object(l.g)().appId,
          isNative: !1,
          pagePath: Object(l.e)()
            .getPagePath(),
          avgFps: t.toFixed(3),
          lowestFps: n.toFixed(3),
          highestFps: i.toFixed(3)
        })
      });
    }
  };
  const x = n(4);
  let T;
  let S;
  const E = n(22);
  const
    k = n(20);

  function O() {
  }

  function P(e, t) {
    const n = t(e).detail;
    return n.x = n.pageX - this.baseX,
    n.y = n.pageY - this.baseY,
    {
      detail: n
    };
  }

  function N(e) {
    return e.type === 'webgl' || !(!1 === e.enableNative || !Object(x.isNativeComponentForLyra)('canvas') || !Object(l.g)().hasNativeCanvas) && (!d.r && Object(l.g)().isV8Worker === 'true' || (Object(l.g)().inPageRenderType || '').indexOf('canvas') > -1);
  }

  const I = o.a.createElement('param', {
    name: 'selfdraw',
    value: '1'
  });
  const A = o.a.createElement('param', {
    name: 'type',
    value: 'canvas'
  });
  const j = Object(l.c)({
    name: 'canvas',
    isNativeComponent: N
  })(c()({
    displayName: 'Canvas',
    mixins: [Object(u.f)({
      isDisableScroll(e) {
        return e.disableScroll && !e.$appx.isNativeComponent;
      }
    }), Object(u.d)({
      createTap: P,
      shouldIgnore: N
    }), Object(u.c)({
      createTap: P,
      shouldIgnore: N
    }), Object(u.e)({
      createTouchList(e) {
        const t = this;
        return void 0 === e && (e = []),
        (e && [].slice.call(e, 0) || []).map(((e) => ({
          x: e.pageX - t.baseX,
          y: e.pageY - t.baseY,
          identifier: e.identifier
        })
        ));
      }
    }), f.a, C, E.a],
    getInitialState() {
      return this.useNative = this.props.$appx.isNativeComponent,
      this.baseX = 0,
      this.baseY = 0,
      {};
    },
    componentDidMount() {
      this.useNative ? (this.onDidMountForNative(),
      this.canvasTapEvent = Object(h.a)(document, {
        'nbcomponent.canvas.onTap': this.onNativeCanvasTap
      })) : (this.canvasTapEvent = Object(h.a)(this.root, {
        tap: this.onCanvasTap
      }),
      this.seq = 0,
      this.onLayout());
    },
    onNativeCanvasTap(e) {
      const t = e.data.element;
      const n = this.props;
      const i = n.onTap;
      const r = n.catchTap;
      t === this.getId() && Object(k.c)(this, !0, !(!i && !r), !!r);
    },
    componentDidUpdate() {
      this.useNative ? this.renderNativeComponent() : this.onLayout();
    },
    componentWillUnmount() {
      this.detachCanvasReady && this.detachCanvasReady.remove(),
      this.useNative && Object(p.a)('NBComponent.remove', {
        element: this.getId()
      }),
      this.canvasTapEvent && (this.canvasTapEvent = this.canvasTapEvent.remove());
    },
    renderNativeComponent(e) {
      if (this.readyForRender) {
        this.clearRenderDelay();
        const t = this.props;
        const n = t.width;
        const i = t.height;
        const r = t.offscreen;
        const a = t.disableScroll;
        const o = t.type;
        const s = t.onReady;
        const c = this.nativeRoot || {};
        o === 'webgl' && this.nativeRoot && this.nativeRoot.setAttribute('canvas-type', 'webgl');
        const u = (function (e) {
          for (var t = {}, n = 0, i = Object(v.default)(e); n < i.length; n++) {
            const r = i[n];
            const a = e[r];
            t[r] = void 0 === a ? a : `${a}`;
          }
          return t;
        }({
          timeStamp: Date.now(),
          width: n || c.offsetWidth,
          height: i || c.offsetHeight,
          offscreen: r,
          disableScroll: a,
          type: o
        }));
        if (this.nativeRoot) {
          const h = window.getComputedStyle(this.nativeRoot, null);
          if (h.transform !== 'none') {
            const f = Object(l.e)();
            const g = {
              type: 'monitor',
              bizType: 'TINYAPP',
              seedId: 'canvas.transform',
              actionId: 'event',
              param4: Object(y.a)({
                SDKVersion: d.a,
                'canvas-dom-id': this.getId(),
                pagePath: f.getPagePath(),
                value: h.transform
              })
            };
            Object(_.a)(g);
          }
          this.backgroundColor || (this.backgroundColor = Object(m.a)(h['background-color']));
        }
        this.backgroundColor && (u.backgroundColor = this.backgroundColor),
        Object(p.a)('NBComponent.render', {
          element: this.getId(),
          data: u,
          componentData: d.r && window.componentsManager ? JSON.parse(window.componentsManager.render(this.getId())) : void 0
        }, (() => {
          e === 'mount' && typeof s === 'function' && s();
        }
        ));
      }
    },
    getWH() {
      if (this.webRoot) {
        const e = this.webRoot;
        return {
          width: e.width || e.offsetWidth,
          height: e.height || e.offsetHeight
        };
      }
      return {
        width: 0,
        height: 0
      };
    },
    toTempFilePath(e, t, n) {
      const i = this._getBase64ImageData(e);
      i.base64 && i.format ? Object(p.a)('downloadFile', {
        url: i.base64.replace(`data:${i.format};base64,`, ''),
        type: 'image'
      }, ((e) => {
        e.error ? n(e) : (e.filePath = e.tempFilePath || e.apFilePath,
        t(e));
      }
      )) : n(i);
    },
    getImageData(e, t, n) {
      let i = e.x;
      let r = e.y;
      const a = e.width;
      const o = e.height;
      i = Number(i) || 0,
      r = Number(r) || 0;
      try {
        const s = this.webRoot.getContext('2d')
          .getImageData(i, r, a, o);
        t({
          width: a,
          height: o,
          data: Array.prototype.slice.call(s.data)
        });
      } catch (e) {
        n({
          errorMessage: e.message,
          error: e.message
        });
      }
    },
    putImageData(e, t, n) {
      let i = e.x;
      let r = e.y;
      const a = e.width;
      const o = e.height;
      const s = e.data;
      i = Number(i) || 0,
      r = Number(r) || 0;
      try {
        const c = new ImageData(new Uint8ClampedArray(s), a, o);
        this.webRoot.getContext('2d')
          .putImageData(c, i, r),
        t({});
      } catch (e) {
        n({
          errorMessage: e.message,
          error: e.message
        });
      }
    },
    draw(e, t, n) {
      const i = this;
      const r = this.createFrameNode();
      const a = ++this.seq;
      const o = this.webRoot;
      if (o) {
        const s = o.getContext('2d');
        if (!t) {
          const c = this.getWH();
          const l = c.width;
          const u = c.height;
          s.clearRect(0, 0, l, u);
        }
        const p = {};
        const d = function (e, t) {
          let n = !0;
          let r = !1;
          if (e.property) {
            let o = e.value;
            return o && o.$callId && (o = p[o.$callId]),
            s[e.property] = o,
            n;
          }
          if (!s[e.action] && e.action !== 'drawCanvas') throw new Error(`not find method ${e.action}`);
          let c = e.args;
          if (e.action === 'drawCanvas') {
            const l = c[0];
            const u = [].concat(c);
            return u[0] = document.getElementById(l),
            u[0] && s.drawImage.apply(s, u),
            n;
          }
          if (e.action !== 'drawImage' && e.action !== 'createPattern' || typeof c[0] !== 'string') {
            const d = c[0];
            d && d.$callId && (c = [p[d.$callId]].concat(c.slice(1)));
            const h = s[e.action].apply(s, c);
            e.callId && (p[e.callId] = h),
            e.nested && e.nested.forEach(((e) => {
              h[e.action].apply(h, e.args);
            }
            ));
          } else {
            c = [].concat(e.args),
            n = !1,
            Object(g.a)(c[0], {
              success(o) {
                if (a === i.seq) {
                  c[0] = o;
                  const l = s[e.action].apply(s, c);
                  e.callId && (p[e.callId] = l),
                  r ? t() : n = !0;
                }
              },
              fail() {
                a === i.seq && (r ? t() : n = !0);
              }
            });
          }
          return r = !0,
          n;
        };
        let h = -1;
        const f = e.length;
        !(function t() {
          for (; ;) {
            if (!(++h < f)) {
              i.computeFps(r),
              n && n({});
              break;
            }
            if (!d(e[h], t)) break;
          }
        }());
      }
    },
    _getBase64ImageData(e) {
      let t;
      const n = e || {};
      let i = n.x;
      let r = n.y;
      let a = n.width;
      let o = n.height;
      let s = n.destWidth;
      let c = n.destHeight;
      let l = n.fileType;
      let
        u = n.quality;
      u = (l = ['jpg', 'png'].indexOf(l) > -1 ? l : 'png') === 'jpg' ? u < 0 || u > 1 ? 1 : u : 1;
      const p = {
        jpg: 'image/jpeg',
        png: 'image/png'
      }[l];
      try {
        const d = this.webRoot;
        if (void 0 !== i || void 0 !== r || void 0 !== a || void 0 !== o || void 0 !== s || void 0 !== c) {
          const h = this.getWH();
          const f = h.width;
          const m = h.height;
          i = i || 0,
          r = r || 0,
          a = a || f,
          o = o || m,
          a = Math.min(a, f - i),
          o = Math.min(o, m - r);
          const v = (function (e) {
            const t = e.destWidth;
            const n = e.destHeight;
            return T ? (T.setAttribute('width', t),
            T.setAttribute('height', n),
            T.getContext('2d')
              .clearRect(0, 0, t, n),
            T) : ((T = document.createElement('canvas')).style.display = 'none',
            T.setAttribute('width', t),
            T.setAttribute('height', n),
            document.body.appendChild(T),
            T);
          }({
            destWidth: s = s || a,
            destHeight: c = c || o
          }));
          v.getContext('2d')
            .drawImage(d, i, r, a, o, 0, 0, s, c),
          t = v.toDataURL(p, u);
        } else {
          t = d.toDataURL(p, u);
        }
        return {
          base64: t,
          format: p
        };
      } catch (e) {
        return e;
      }
    },
    toDataURL(e, t, n) {
      const i = this._getBase64ImageData(e);
      i.error ? n(i) : t(i.base64);
    },
    onLayout() {
      const e = this.webRoot;
      if (e) {
        const t = this.props;
        const n = t.width;
        const i = t.height;
        if (!n) {
          const r = e.offsetWidth;
          e.width !== r && e.setAttribute('width', r);
        }
        if (!i) {
          const a = e.offsetHeight;
          e.height !== a && e.setAttribute('height', a);
        }
      }
    },
    getEnableNativeProp() {
      return !1 !== this.props.enableNative;
    },
    onCanvasTap() {
      this.logTestId(),
      Object(k.c)(this, !0);
    },
    onCanvasTouchStart(e) {
      if (this.webRoot) {
        const t = this.webRoot.getBoundingClientRect();
        this.baseX = t.left + window.pageXOffset,
        this.baseY = t.top + window.pageYOffset;
      }
      this.onTouchStart(e);
    },
    saveWebRoot(e) {
      this.root = this.webRoot = e;
    },
    saveNativeRoot(e) {
      this.root = this.nativeRoot = e;
    },
    getSelfDraw() {
      return Object(l.g)()['canvas.selfdraw'] !== '1' || this.props.offscreen ? null : I;
    },
    getUCRenderMode() {
      if (void 0 === S && (S = !(!d.l || !Object(x.isFeatureAvailable)('c_canvas_uc_render_mode_24_4'))),
      S) {
        let e = 3;
        if (this.props.offscreen) {
          e = 2;
        } else {
          const t = Object(l.g)().canvas_uc_render_mode;
          [1, 2].indexOf(t) !== -1 && (e = t);
        }
        return o.a.createElement('param', {
          name: 'uc_render_mode',
          value: e
        });
      }
      return null;
    },
    render() {
      const e = this.props;
      if (this.useNative) {
        return o.a.createElement('object', {
          className: `${e.className} nbcomponentanimation-${this.getId()}`,
          style: e.style,
          id: e.id,
          type: 'application/view',
          role: 'application',
          ref: this.saveNativeRoot
        }, A, o.a.createElement('param', {
          name: 'id',
          value: this.getId()
        }), this.getSelfDraw(), this.getUCRenderMode());
      }
      let t = e.style;
      const n = {};
      e.width && (n.width = e.width),
      e.height && (n.height = e.height);
      let i = {};
      return e && (e.onTap || e.catchTap) && (i = {
        'data-clickable': !0
      }),
      e.offscreen && (t = r()({}, t, {
        position: 'absolute',
        left: '-9999px',
        top: '-9999px'
      })),
      o.a.createElement('canvas', r()({
        id: e.id,
        className: e.className,
        ref: this.saveWebRoot,
        onTouchStart: this.onCanvasTouchStart,
        onClick: O,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd,
        onTouchCancel: this.onTouchCancel,
        style: t
      }, i, n, this.getTestProps()));
    }
  }));
  t.default = j;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(27);
  const o = n.n(a);
  const s = n(0);
  const c = n.n(s);
  const l = (function (e) {
    function t() {
      return e.apply(this, arguments) || this;
    }

    o()(t, e);
    const n = t.prototype;
    return n.getValue = function () {
      const e = this.props;
      const t = e.children;
      const n = e.selectedValue;
      return n && n.length ? n : t ? c.a.Children.map(t, ((e) => {
        const t = c.a.Children.toArray(e.props.children);
        return t && t[0] && t[0].props.value;
      }
      )) : [];
    }
    ,
    n.onValueChange = function (e, t) {
      const n = this.getValue()
        .concat();
      n[e] = t;
      const i = this.props.onValueChange;
      i && i(n, e);
    }
    ,
    n.render = function () {
      const e = this;
      const t = this.props;
      const n = t.className;
      const i = void 0 === n ? '' : n;
      const a = t.rootNativeProps;
      const o = t.children;
      const s = t.style;
      const l = t.id;
      const u = this.getValue();
      const p = c.a.Children.map(o, ((t, n) => c.a.cloneElement(t, {
        selectedValue: u[n],
        onValueChange() {
          for (var t = arguments.length, i = new Array(t), r = 0; r < t; r++) i[r] = arguments[r];
          return e.onValueChange.apply(e, [n].concat(i));
        }
      })
      ));
      return c.a.createElement('div', r()({}, a, {
        style: s,
        className: `${i}`,
        id: l
      }), p);
    }
    ,
    t;
  }(c.a.Component));
  const u = n(5);
  const p = n.n(u);

  function d() {
    return (d = Object.assign || function (e) {
      for (let t = 1; t < arguments.length; t++) {
        const n = arguments[t];
        for (const i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
      }
      return e;
    }
    ).apply(this, arguments);
  }

  let h = {};
  let f = 1;
  let m = typeof window !== 'undefined' ? window : void 0;
  m || (m = void 0 !== global ? global : {}),
  (function () {
    for (var e = 0, t = ['ms', 'moz', 'webkit', 'o'], n = 0; n < t.length && !m.requestAnimationFrame; ++n) {
      m.requestAnimationFrame = m[`${t[n]}RequestAnimationFrame`],
      m.cancelAnimationFrame = m[`${t[n]}CancelAnimationFrame`] || m[`${t[n]}CancelRequestAnimationFrame`];
    }
    m.requestAnimationFrame || (m.requestAnimationFrame = function (t) {
      const n = (new Date()).getTime();
      const i = Math.max(0, 16 - (n - e));
      const r = m.setTimeout((() => {
        t(n + i);
      }
      ), i);
      return e = n + i,
      r;
    }
    ),
    m.cancelAnimationFrame || (m.cancelAnimationFrame = function (e) {
      clearTimeout(e);
    }
    );
  }());
  let v;
  const g = function (e) {
    const t = h[e] != null;
    return t && (h[e] = null),
    t;
  };
  const b = function (e, t, n, i, r) {
    const a = +new Date();
    let o = a;
    let s = 0;
    let c = 0;
    const l = f++;
    if (l % 20 == 0) {
      const u = {};
      for (const p in h) u[p] = !0;
      h = u;
    }
    return h[l] = !0,
    m.requestAnimationFrame((function u(p) {
      const d = !0 !== p;
      const f = +new Date();
      if (!h[l] || t && !t(l)) {
        return h[l] = null,
        void (n && n(60 - c / ((f - a) / 1e3), l, !1));
      }
      if (d) {
        for (let v = Math.round((f - o) / (1e3 / 60)) - 1, g = 0; g < Math.min(v, 4); g++) {
          u(!0),
          c++;
        }
      }
      i && (s = (f - a) / i) > 1 && (s = 1);
      const b = r ? r(s) : s;
      !1 !== e(b, f, d) && s !== 1 || !d ? d && (o = f,
      m.requestAnimationFrame(u)) : (h[l] = null,
      n && n(60 - c / ((f - a) / 1e3), l, s === 1 || i == null));
    }
    )),
    l;
  };
  const
    y = function () {
    };
  v = function (e, t) {
    for (const n in this.__callback = e,
    this.options = {
      scrollingX: !0,
      scrollingY: !0,
      animating: !0,
      animationDuration: 250,
      bouncing: !0,
      locking: !0,
      paging: !1,
      snapping: !1,
      zooming: !1,
      minZoom: 0.5,
      maxZoom: 3,
      speedMultiplier: 1,
      scrollingComplete: y,
      penetrationDeceleration: 0.03,
      penetrationAcceleration: 0.08
    },
    t) {
      this.options[n] = t[n];
    }
  };
  const _ = function (e) {
    return Math.pow(e - 1, 3) + 1;
  };
  const w = function (e) {
    return (e /= 0.5) < 1 ? 0.5 * Math.pow(e, 3) : 0.5 * (Math.pow(e - 2, 3) + 2);
  };
  const C = {
    __isSingleTouch: !1,
    __isTracking: !1,
    __didDecelerationComplete: !1,
    __isGesturing: !1,
    __isDragging: !1,
    __isDecelerating: !1,
    __isAnimating: !1,
    __clientLeft: 0,
    __clientTop: 0,
    __clientWidth: 0,
    __clientHeight: 0,
    __contentWidth: 0,
    __contentHeight: 0,
    __snapWidth: 100,
    __snapHeight: 100,
    __refreshHeight: null,
    __refreshActive: !1,
    __refreshActivate: null,
    __refreshDeactivate: null,
    __refreshStart: null,
    __zoomLevel: 1,
    __scrollLeft: 0,
    __scrollTop: 0,
    __maxScrollLeft: 0,
    __maxScrollTop: 0,
    __scheduledLeft: 0,
    __scheduledTop: 0,
    __scheduledZoom: 0,
    __lastTouchLeft: null,
    __lastTouchTop: null,
    __lastTouchMove: null,
    __positions: null,
    __minDecelerationScrollLeft: null,
    __minDecelerationScrollTop: null,
    __maxDecelerationScrollLeft: null,
    __maxDecelerationScrollTop: null,
    __decelerationVelocityX: null,
    __decelerationVelocityY: null,
    setDimensions(e, t, n, i) {
      e === +e && (this.__clientWidth = e),
      t === +t && (this.__clientHeight = t),
      n === +n && (this.__contentWidth = n),
      i === +i && (this.__contentHeight = i),
      this.__computeScrollMax(),
      this.scrollTo(this.__scrollLeft, this.__scrollTop, !0);
    },
    setPosition(e, t) {
      this.__clientLeft = e || 0,
      this.__clientTop = t || 0;
    },
    setSnapSize(e, t) {
      this.__snapWidth = e,
      this.__snapHeight = t;
    },
    activatePullToRefresh(e, t, n, i) {
      this.__refreshHeight = e,
      this.__refreshActivate = t,
      this.__refreshDeactivate = n,
      this.__refreshStart = i;
    },
    triggerPullToRefresh() {
      this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, !0),
      this.__refreshStart && this.__refreshStart();
    },
    finishPullToRefresh() {
      this.__refreshActive = !1,
      this.__refreshDeactivate && this.__refreshDeactivate(),
      this.scrollTo(this.__scrollLeft, this.__scrollTop, !0);
    },
    getValues() {
      return {
        left: this.__scrollLeft,
        top: this.__scrollTop,
        zoom: this.__zoomLevel
      };
    },
    getScrollMax() {
      return {
        left: this.__maxScrollLeft,
        top: this.__maxScrollTop
      };
    },
    zoomTo(e, t, n, i, r) {
      if (!this.options.zooming) throw new Error('Zooming is not enabled!');
      r && (this.__zoomComplete = r),
      this.__isDecelerating && (g(this.__isDecelerating),
      this.__isDecelerating = !1);
      const a = this.__zoomLevel;
      n == null && (n = this.__clientWidth / 2),
      i == null && (i = this.__clientHeight / 2),
      e = Math.max(Math.min(e, this.options.maxZoom), this.options.minZoom),
      this.__computeScrollMax(e);
      let o = (n + this.__scrollLeft) * e / a - n;
      let s = (i + this.__scrollTop) * e / a - i;
      o > this.__maxScrollLeft ? o = this.__maxScrollLeft : o < 0 && (o = 0),
      s > this.__maxScrollTop ? s = this.__maxScrollTop : s < 0 && (s = 0),
      this.__publish(o, s, e, t);
    },
    zoomBy(e, t, n, i, r) {
      this.zoomTo(this.__zoomLevel * e, t, n, i, r);
    },
    scrollTo(e, t, n, i, r) {
      if (this.__isDecelerating && (g(this.__isDecelerating),
      this.__isDecelerating = !1),
      i != null && i !== this.__zoomLevel) {
        if (!this.options.zooming) throw new Error('Zooming is not enabled!');
        e *= i,
        t *= i,
        this.__computeScrollMax(i);
      } else {
        i = this.__zoomLevel;
      }
      this.options.scrollingX ? this.options.paging ? e = Math.round(e / this.__clientWidth) * this.__clientWidth : this.options.snapping && (e = Math.round(e / this.__snapWidth) * this.__snapWidth) : e = this.__scrollLeft,
      this.options.scrollingY ? this.options.paging ? t = Math.round(t / this.__clientHeight) * this.__clientHeight : this.options.snapping && (t = Math.round(t / this.__snapHeight) * this.__snapHeight) : t = this.__scrollTop,
      e = Math.max(Math.min(this.__maxScrollLeft, e), 0),
      t = Math.max(Math.min(this.__maxScrollTop, t), 0),
      e === this.__scrollLeft && t === this.__scrollTop && (n = !1,
      r && r()),
      this.__isTracking || this.__publish(e, t, i, n);
    },
    scrollBy(e, t, n) {
      const i = this.__isAnimating ? this.__scheduledLeft : this.__scrollLeft;
      const r = this.__isAnimating ? this.__scheduledTop : this.__scrollTop;
      this.scrollTo(i + (e || 0), r + (t || 0), n);
    },
    doMouseZoom(e, t, n, i) {
      const r = e > 0 ? 0.97 : 1.03;
      return this.zoomTo(this.__zoomLevel * r, !1, n - this.__clientLeft, i - this.__clientTop);
    },
    doTouchStart(e, t) {
      if (e.length == null) throw new Error(`Invalid touch list: ${e}`);
      if (t instanceof Date && (t = t.valueOf()),
      typeof t !== 'number') {
        throw new Error(`Invalid timestamp value: ${t}`);
      }
      let n;
      let
        i;
      this.__interruptedAnimation = !0,
      this.__isDecelerating && (g(this.__isDecelerating),
      this.__isDecelerating = !1,
      this.__interruptedAnimation = !0),
      this.__isAnimating && (g(this.__isAnimating),
      this.__isAnimating = !1,
      this.__interruptedAnimation = !0);
      const r = e.length === 1;
      r ? (n = e[0].pageX,
      i = e[0].pageY) : (n = Math.abs(e[0].pageX + e[1].pageX) / 2,
      i = Math.abs(e[0].pageY + e[1].pageY) / 2),
      this.__initialTouchLeft = n,
      this.__initialTouchTop = i,
      this.__zoomLevelStart = this.__zoomLevel,
      this.__lastTouchLeft = n,
      this.__lastTouchTop = i,
      this.__lastTouchMove = t,
      this.__lastScale = 1,
      this.__enableScrollX = !r && this.options.scrollingX,
      this.__enableScrollY = !r && this.options.scrollingY,
      this.__isTracking = !0,
      this.__didDecelerationComplete = !1,
      this.__isDragging = !r,
      this.__isSingleTouch = r,
      this.__positions = [];
    },
    doTouchMove(e, t, n) {
      if (e.length == null) throw new Error(`Invalid touch list: ${e}`);
      if (t instanceof Date && (t = t.valueOf()),
      typeof t !== 'number') {
        throw new Error(`Invalid timestamp value: ${t}`);
      }
      if (this.__isTracking) {
        let i;
        let
          r;
        e.length === 2 ? (i = Math.abs(e[0].pageX + e[1].pageX) / 2,
        r = Math.abs(e[0].pageY + e[1].pageY) / 2) : (i = e[0].pageX,
        r = e[0].pageY);
        const a = this.__positions;
        if (this.__isDragging) {
          const o = i - this.__lastTouchLeft;
          const s = r - this.__lastTouchTop;
          let c = this.__scrollLeft;
          let l = this.__scrollTop;
          let u = this.__zoomLevel;
          if (n != null && this.options.zooming) {
            const p = u;
            if (u = u / this.__lastScale * n,
            p !== (u = Math.max(Math.min(u, this.options.maxZoom), this.options.minZoom))) {
              const d = i - this.__clientLeft;
              const h = r - this.__clientTop;
              c = (d + c) * u / p - d,
              l = (h + l) * u / p - h,
              this.__computeScrollMax(u);
            }
          }
          if (this.__enableScrollX) {
            c -= o * this.options.speedMultiplier;
            const f = this.__maxScrollLeft;
            (c > f || c < 0) && (this.options.bouncing ? c += o / 2 * this.options.speedMultiplier : c = c > f ? f : 0);
          }
          if (this.__enableScrollY) {
            l -= s * this.options.speedMultiplier;
            const m = this.__maxScrollTop;
            (l > m || l < 0) && (this.options.bouncing ? (l += s / 2 * this.options.speedMultiplier,
            this.__enableScrollX || this.__refreshHeight == null || (!this.__refreshActive && l <= -this.__refreshHeight ? (this.__refreshActive = !0,
            this.__refreshActivate && this.__refreshActivate()) : this.__refreshActive && l > -this.__refreshHeight && (this.__refreshActive = !1,
            this.__refreshDeactivate && this.__refreshDeactivate()))) : l = l > m ? m : 0);
          }
          a.length > 60 && a.splice(0, 30),
          a.push(c, l, t),
          this.__publish(c, l, u);
        } else {
          let v;
          const g = Math.abs(i - this.__initialTouchLeft);
          const
            b = Math.abs(r - this.__initialTouchTop);
          this.__enableScrollX = this.options.scrollingX && g >= 3,
          this.__enableScrollY = this.options.scrollingY && b >= 3,
          this.options.locking && this.__enableScrollY && (v = v || Math.atan2(b, g)) < Math.PI / 4 && (this.__enableScrollY = !1),
          this.options.locking && this.__enableScrollX && (v = v || Math.atan2(b, g)) > Math.PI / 4 && (this.__enableScrollX = !1),
          a.push(this.__scrollLeft, this.__scrollTop, t),
          this.__isDragging = (this.__enableScrollX || this.__enableScrollY) && (g >= 5 || b >= 5),
          this.__isDragging && (this.__interruptedAnimation = !1);
        }
        this.__lastTouchLeft = i,
        this.__lastTouchTop = r,
        this.__lastTouchMove = t,
        this.__lastScale = n;
      }
    },
    doTouchEnd(e) {
      if (e instanceof Date && (e = e.valueOf()),
      typeof e !== 'number') {
        throw new Error(`Invalid timestamp value: ${e}`);
      }
      if (this.__isTracking) {
        if (this.__isTracking = !1,
        this.__isDragging) {
          if (this.__isDragging = !1,
          this.__isSingleTouch && this.options.animating && e - this.__lastTouchMove <= 100) {
            for (var t = this.__positions, n = t.length - 1, i = n, r = n; r > 0 && t[r] > this.__lastTouchMove - 100; r -= 3) i = r;
            if (i !== n) {
              const a = t[n] - t[i];
              const o = this.__scrollLeft - t[i - 2];
              const s = this.__scrollTop - t[i - 1];
              this.__decelerationVelocityX = o / a * (1e3 / 60),
              this.__decelerationVelocityY = s / a * (1e3 / 60);
              const c = this.options.paging || this.options.snapping ? 4 : 1;
              Math.abs(this.__decelerationVelocityX) > c || Math.abs(this.__decelerationVelocityY) > c ? this.__refreshActive || this.__startDeceleration(e) : this.options.scrollingComplete();
            } else {
              this.options.scrollingComplete();
            }
          } else {
            e - this.__lastTouchMove > 100 && this.options.scrollingComplete();
          }
        }
        this.__isDecelerating || (this.__refreshActive && this.__refreshStart ? (this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, !0),
        this.__refreshStart && this.__refreshStart()) : ((this.__interruptedAnimation || this.__isDragging) && this.options.scrollingComplete(),
        this.scrollTo(this.__scrollLeft, this.__scrollTop, !0, this.__zoomLevel),
        this.__refreshActive && (this.__refreshActive = !1,
        this.__refreshDeactivate && this.__refreshDeactivate()))),
        this.__positions.length = 0;
      }
    },
    __publish(e, t, n, i) {
      const r = this;
      const a = r.__isAnimating;
      if (a && (g(a),
      r.__isAnimating = !1),
      i && r.options.animating) {
        r.__scheduledLeft = e,
        r.__scheduledTop = t,
        r.__scheduledZoom = n;
        const o = r.__scrollLeft;
        const s = r.__scrollTop;
        const c = r.__zoomLevel;
        const l = e - o;
        const u = t - s;
        const p = n - c;
        r.__isAnimating = b(((e, t, n) => {
          n && (r.__scrollLeft = o + l * e,
          r.__scrollTop = s + u * e,
          r.__zoomLevel = c + p * e,
          r.__callback && r.__callback(r.__scrollLeft, r.__scrollTop, r.__zoomLevel));
        }
        ), ((e) => r.__isAnimating === e
        ), ((e, t, n) => {
          t === r.__isAnimating && (r.__isAnimating = !1),
          (r.__didDecelerationComplete || n) && r.options.scrollingComplete(),
          r.options.zooming && (r.__computeScrollMax(),
          r.__zoomComplete && (r.__zoomComplete(),
          r.__zoomComplete = null));
        }
        ), r.options.animationDuration, a ? _ : w);
      } else {
        r.__scheduledLeft = r.__scrollLeft = e,
        r.__scheduledTop = r.__scrollTop = t,
        r.__scheduledZoom = r.__zoomLevel = n,
        r.__callback && r.__callback(e, t, n),
        r.options.zooming && (r.__computeScrollMax(),
        r.__zoomComplete && (r.__zoomComplete(),
        r.__zoomComplete = null));
      }
    },
    __computeScrollMax(e) {
      e == null && (e = this.__zoomLevel),
      this.__maxScrollLeft = Math.max(this.__contentWidth * e - this.__clientWidth, 0),
      this.__maxScrollTop = Math.max(this.__contentHeight * e - this.__clientHeight, 0);
    },
    __startDeceleration(e) {
      const t = this;
      if (t.options.paging) {
        const n = Math.max(Math.min(t.__scrollLeft, t.__maxScrollLeft), 0);
        const i = Math.max(Math.min(t.__scrollTop, t.__maxScrollTop), 0);
        const r = t.__clientWidth;
        const a = t.__clientHeight;
        t.__minDecelerationScrollLeft = Math.floor(n / r) * r,
        t.__minDecelerationScrollTop = Math.floor(i / a) * a,
        t.__maxDecelerationScrollLeft = Math.ceil(n / r) * r,
        t.__maxDecelerationScrollTop = Math.ceil(i / a) * a;
      } else {
        t.__minDecelerationScrollLeft = 0,
        t.__minDecelerationScrollTop = 0,
        t.__maxDecelerationScrollLeft = t.__maxScrollLeft,
        t.__maxDecelerationScrollTop = t.__maxScrollTop;
      }
      let o = t.options.minVelocityToKeepDecelerating;
      o || (o = t.options.snapping ? 4 : 0.001);
      t.__isDecelerating = b(((e, n, i) => {
        t.__stepThroughDeceleration(i);
      }
      ), (() => {
        const e = Math.abs(t.__decelerationVelocityX) >= o || Math.abs(t.__decelerationVelocityY) >= o;
        return e || (t.__didDecelerationComplete = !0),
        e;
      }
      ), ((e, n, i) => {
        t.__isDecelerating = !1,
        t.scrollTo(t.__scrollLeft, t.__scrollTop, t.options.snapping, null, t.__didDecelerationComplete && t.options.scrollingComplete);
      }
      ));
    },
    __stepThroughDeceleration(e) {
      let t = this.__scrollLeft + this.__decelerationVelocityX;
      let n = this.__scrollTop + this.__decelerationVelocityY;
      if (!this.options.bouncing) {
        const i = Math.max(Math.min(this.__maxDecelerationScrollLeft, t), this.__minDecelerationScrollLeft);
        i !== t && (t = i,
        this.__decelerationVelocityX = 0);
        const r = Math.max(Math.min(this.__maxDecelerationScrollTop, n), this.__minDecelerationScrollTop);
        r !== n && (n = r,
        this.__decelerationVelocityY = 0);
      }
      if (e ? this.__publish(t, n, this.__zoomLevel) : (this.__scrollLeft = t,
      this.__scrollTop = n),
      !this.options.paging) {
        this.__decelerationVelocityX *= 0.95,
        this.__decelerationVelocityY *= 0.95;
      }
      if (this.options.bouncing) {
        let a = 0;
        let o = 0;
        const s = this.options.penetrationDeceleration;
        const c = this.options.penetrationAcceleration;
        t < this.__minDecelerationScrollLeft ? a = this.__minDecelerationScrollLeft - t : t > this.__maxDecelerationScrollLeft && (a = this.__maxDecelerationScrollLeft - t),
        n < this.__minDecelerationScrollTop ? o = this.__minDecelerationScrollTop - n : n > this.__maxDecelerationScrollTop && (o = this.__maxDecelerationScrollTop - n),
        a !== 0 && (a * this.__decelerationVelocityX <= 0 ? this.__decelerationVelocityX += a * s : this.__decelerationVelocityX = a * c),
        o !== 0 && (o * this.__decelerationVelocityY <= 0 ? this.__decelerationVelocityY += o * s : this.__decelerationVelocityY = o * c);
      }
    }
  };
  for (const x in C) v.prototype[x] = C[x];
  const T = v;
  const S = 8;
  let E = typeof window !== 'undefined' ? window : void 0;

  function k(e, t) {
    e.transform = t,
    e.webkitTransform = t,
    e.MozTransform = t;
  }

  E || (E = void 0 !== global ? global : {});
  let O = !1;
  try {
    const P = Object.defineProperty({}, 'passive', {
      get() {
        O = !0;
      }
    });
    E.addEventListener('test', null, P);
  } catch (e) {
  }
  const N = typeof navigator !== 'undefined' && /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

  function I(e, t) {
    N && e.changedTouches[0].clientY < 0 && t(new Event('touchend') || e);
  }

  const A = !!O && {
    passive: !1
  };
  const j = !!O && {
    passive: !0
  };

  function R(e, t) {
    let n;
    let i;
    let r;
    let a;
    let o;
    let s;
    let c;
    let l;
    const
      u = this;
    void 0 === t && (t = {}),
    this.content = e;
    const p = this.container = e.parentNode;
    this.options = {
      ...t,
      scrollingComplete() {
        u.clearScrollbarTimer(),
        u.timer = setTimeout((() => {
          u._destroyed || (t.scrollingComplete && t.scrollingComplete(),
          n && ['x', 'y'].forEach(((e) => {
            n[e] && u.setScrollbarOpacity(e, 0);
          }
          )));
        }
        ), 0);
      }
    },
    this.options.scrollbars && (n = this.scrollbars = {},
    i = this.indicators = {},
    r = this.indicatorsSize = {},
    a = this.scrollbarsSize = {},
    o = this.indicatorsPos = {},
    s = this.scrollbarsOpacity = {},
    c = this.contentSize = {},
    l = this.clientSize = {},
    ['x', 'y'].forEach(((e) => {
      const t = e === 'x' ? 'scrollingX' : 'scrollingY';
      !1 !== u.options[t] && (n[e] = document.createElement('div'),
      n[e].className = `zscroller-scrollbar-${e}`,
      i[e] = document.createElement('div'),
      i[e].className = `zscroller-indicator-${e}`,
      n[e].appendChild(i[e]),
      r[e] = -1,
      s[e] = 0,
      o[e] = 0,
      p.appendChild(n[e]));
    }
    )));
    let h;
    let f;
    let m = !0;
    const
      v = e.style;
    this.scroller = new T((((e, i, r) => {
      !m && t.onScroll && t.onScroll(),
      k(v, `translate3d(${-e}px,${-i}px,0) scale(${r})`),
      n && ['x', 'y'].forEach(((t) => {
        if (n[t]) {
          const r = t === 'x' ? e : i;
          if (l[t] >= c[t]) {
            u.setScrollbarOpacity(t, 0);
          } else {
            m || u.setScrollbarOpacity(t, 1);
            let o;
            const s = l[t] / c[t] * a[t];
            let
              p = s;
            r < 0 ? (p = Math.max(s + r, S),
            o = 0) : r > c[t] - l[t] ? (p = Math.max(s + c[t] - l[t] - r, S),
            o = a[t] - p) : o = r / c[t] * a[t],
            u.setIndicatorSize(t, p),
            u.setIndicatorPos(t, o);
          }
        }
      }
      )),
      m = !1;
    })
    ), this.options),
    this.bindEvents(),
    h = e.style,
    f = 'left top',
    h.transformOrigin = f,
    h.webkitTransformOrigin = f,
    h.MozTransformOrigin = f,
    this.reflow();
  }

  R.prototype = {
    constructor: R,
    setDisabled(e) {
      this.disabled = e;
    },
    clearScrollbarTimer() {
      this.timer && (clearTimeout(this.timer),
      this.timer = null);
    },
    setScrollbarOpacity(e, t) {
      this.scrollbarsOpacity[e] !== t && (this.scrollbars[e].style.opacity = t,
      this.scrollbarsOpacity[e] = t);
    },
    setIndicatorPos(e, t) {
      const n = this.indicatorsPos;
      const i = this.indicators;
      n[e] !== t && (k(i[e].style, e === 'x' ? `translate3d(${t}px,0,0)` : `translate3d(0, ${t}px,0)`),
      n[e] = t);
    },
    setIndicatorSize(e, t) {
      const n = this.indicatorsSize;
      const i = this.indicators;
      n[e] !== t && (i[e].style[e === 'x' ? 'width' : 'height'] = `${t}px`,
      n[e] = t);
    },
    reflow() {
      const e = this.container;
      const t = this.content;
      const n = this.scrollbarsSize;
      const i = this.contentSize;
      const r = this.scrollbars;
      const a = this.clientSize;
      const o = this.scroller;
      r && (i.x = t.offsetWidth,
      i.y = t.offsetHeight,
      a.x = e.clientWidth,
      a.y = e.clientHeight,
      r.x && (n.x = r.x.offsetWidth),
      r.y && (n.y = r.y.offsetHeight)),
      o.setDimensions(e.clientWidth, e.clientHeight, t.offsetWidth, t.offsetHeight);
      const s = e.getBoundingClientRect();
      o.setPosition(s.x + e.clientLeft, s.y + e.clientTop);
    },
    destroy() {
      this._destroyed = !0,
      this.unbindEvent();
    },
    unbindEvent(e) {
      const t = this.eventHandlers;
      e ? t[e] && (t[e](),
      delete t[e]) : Object.keys(t)
        .forEach(((e) => {
          t[e](),
          delete t[e];
        }
        ));
    },
    bindEvent(e, t, n, i) {
      const r = this.eventHandlers;
      r[t] && r[t](),
      r[t] = (function (e, t, n, i) {
        return e.addEventListener(t, n, i),
        function () {
          e.removeEventListener(t, n, i);
        };
      }(e, t, n, i));
    },
    bindEvents() {
      const e = this;
      this.eventHandlers = {},
      this.bindEvent(E, 'resize', (() => {
        e.reflow();
      }
      ), !1);
      let t;
      let n = !1;
      const i = this.container;
      const
        r = this.scroller;
      this.bindEvent(i, 'touchstart', ((i) => {
        n = !0,
        t && (clearTimeout(t),
        t = null),
        i.touches[0] && i.touches[0].target && i.touches[0].target.tagName.match(/input|textarea|select/i) || e.disabled || (e.clearScrollbarTimer(),
        e.reflow(),
        r.doTouchStart(i.touches, i.timeStamp));
      }
      ), j);
      const a = this.options;
      const o = a.preventDefaultOnTouchMove;
      const s = a.zooming;
      const c = function (e) {
        r.doTouchEnd(e.timeStamp),
        t = setTimeout((() => {
          n = !1;
        }
        ), 300);
      };
      !1 !== o ? this.bindEvent(i, 'touchmove', ((e) => {
        e.preventDefault(),
        r.doTouchMove(e.touches, e.timeStamp, e.scale),
        I(e, c);
      }
      ), A) : this.bindEvent(i, 'touchmove', ((e) => {
        r.doTouchMove(e.touches, e.timeStamp, e.scale),
        I(e, c);
      }
      ), j),
      this.bindEvent(i, 'touchend', c, j),
      this.bindEvent(i, 'touchcancel', c, j);
      const l = function (t) {
        r.doTouchEnd(t.timeStamp),
        e.unbindEvent('mousemove'),
        e.unbindEvent('mouseup');
      };
      const u = function (e) {
        r.doTouchMove([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);
      };
      this.bindEvent(i, 'mousedown', ((t) => {
        n || t.target.tagName.match(/input|textarea|select/i) || e.disabled || (e.clearScrollbarTimer(),
        r.doTouchStart([{
          pageX: t.pageX,
          pageY: t.pageY
        }], t.timeStamp),
        e.reflow(),
        t.preventDefault(),
        e.bindEvent(document, 'mousemove', u, j),
        e.bindEvent(document, 'mouseup', l, j));
      }
      ), A),
      s && this.bindEvent(i, 'mousewheel', ((e) => {
        r.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY),
        e.preventDefault();
      }
      ), A);
    }
  };
  const D = R;
  const M = n(116);
  const L = n(1);
  const F = 'a-picker-view-picker';
  const V = p()({
    statics: {
      Item() {
      },
      getDerivedStateFromProps(e) {
        return 'selectedValue' in e ? {
          selectedValue: e.selectedValue
        } : null;
      }
    },
    getInitialState() {
      let e;
      const t = this.props;
      const n = t.selectedValue;
      const i = t.defaultSelectedValue;
      const
        r = t.children;
      if (this.isVoiceOverRunning = Object(M.a)(),
      this.a11yComponentEnable = L.h.getSwitch('a11yComponentEnable', !1),
      void 0 !== n) {
        e = n;
      } else if (void 0 !== i) {
        e = i;
      } else {
        const a = c.a.Children.toArray(r);
        e = a && a[0] && a[0].props.value;
      }
      return {
        selectedValue: e,
        needVoice: !1
      };
    },
    componentDidMount() {
      const e = this.refs;
      const t = e.content;
      const n = e.indicator;
      const i = e.mask;
      const r = e.component.getBoundingClientRect().height;
      const a = this.itemHeight = n.getBoundingClientRect().height;
      const o = Math.floor((r - a) / 2);
      if (t.style.padding = `${o}px 0`,
      n.style.top = `${o}px`,
      i.style.backgroundSize = `100% ${o}px`,
      t) {
        for (let s = t.children || [], c = 0; c < s.length; c++) {
          const l = s[c];
          l.style.height = `${a}px`,
          l.style.lineHeight = `${a}px`;
        }
      }
      this.zscroller = new D(t, {
        scrollingX: !1,
        snapping: !0,
        locking: !1,
        penetrationDeceleration: 0.1,
        minVelocityToKeepDecelerating: 0.5,
        scrollingComplete: this.scrollingComplete
      }),
      this.zscroller.setDisabled(this.props.disabled),
      this.zscroller.scroller.setSnapSize(0, a),
      this.select(this.state.selectedValue);
    },
    shouldComponentUpdate(e, t) {
      return this.state.selectedValue !== t.selectedValue || this.props.children !== e.children;
    },
    componentDidUpdate() {
      this.zscroller.setDisabled(this.props.disabled),
      this.zscroller.reflow(),
      this.select(this.state.selectedValue);
    },
    componentWillUnmount() {
      this.zscroller.destroy();
    },
    select(e) {
      for (let t = c.a.Children.toArray(this.props.children), n = 0, i = t.length; n < i; n++) if (t[n].props.value === e) return void this.selectByIndex(n);
      this.selectByIndex(0);
    },
    selectByIndex(e) {
      e < 0 || e >= c.a.Children.count(this.props.children) || !this.itemHeight || this.zscroller.scroller.scrollTo(0, e * this.itemHeight, !1);
    },
    scrollingComplete() {
      const e = this.zscroller.scroller.getValues().top;
      e >= 0 && this.doScrollingComplete(e);
    },
    doScrollingComplete(e) {
      let t = e / this.itemHeight;
      const n = Math.floor(t);
      t = t - n > 0.5 ? n + 1 : n;
      const i = c.a.Children.toArray(this.props.children);
      const r = i[t = Math.min(t, i.length - 1)];
      r ? this.fireValueChange(r.props.value) : console.warn && console.warn('child not found', i, t);
    },
    fireValueChange(e) {
      e !== this.state.selectedValue && ('selectedValue' in this.props || this.setState({
        selectedValue: e
      }),
      this.isVoiceOverRunning && this.speakChangedContent(),
      this.props.onValueChange && this.props.onValueChange(e));
    },
    getValue() {
      if ('selectedValue' in this.props) return this.props.selectedValue;
      const e = c.a.Children.toArray(this.props.children);
      return e && e[0] && e[0].props.value;
    },
    onA11nTap(e) {
      this.selectByIndex(e);
    },
    speakChangedContent() {
      const e = this;
      this.setState({
        needVoice: !0
      }, (() => {
        clearTimeout(e._timerId),
        e._timerId = setTimeout((() => {
          e.setState({
            needVoice: !1
          });
        }
        ), 0);
      }
      ));
    },
    render() {
      const e = this;
      const t = this.props;
      const n = this.isVoiceOverRunning;
      const i = this.a11yComponentEnable;
      const a = t.itemStyle;
      const o = t.indicatorStyle;
      const s = void 0 === o ? {} : o;
      const l = t.indicatorClassName;
      const u = void 0 === l ? '' : l;
      const p = t.children;
      const d = t.maskClassName;
      const h = void 0 === d ? '' : d;
      const f = t.maskStyle;
      const m = void 0 === f ? {} : f;
      const v = this.state;
      const g = v.selectedValue;
      const b = v.needVoice;
      const y = function (t, o) {
        const l = t.props;
        const u = l.className;
        const p = void 0 === u ? '' : u;
        const d = l.style;
        const h = l.value;
        const f = s.height && {
          height: s.height,
          lineHeight: s.height
        };
        return i ? c.a.createElement('div', {
          'aria-selected': g === h,
          style: r()({}, a, d, f),
          role: 'option',
          'aria-live': g === h && b ? 'assertive' : 'off',
          className: `${g === h ? 'a-picker-view-picker-item a-picker-view-picker-item-selected' : 'a-picker-view-picker-item'} ${p}`,
          onClick: n ? e.onA11nTap.bind(e, o) : void 0,
          key: h
        }, t.children || t.props.children) : c.a.createElement('div', {
          style: r()({}, a, d, f),
          className: `${g === h ? 'a-picker-view-picker-item a-picker-view-picker-item-selected' : 'a-picker-view-picker-item'} ${p}`,
          key: h
        }, t.children || t.props.children);
      };
      const _ = c.a.Children ? c.a.Children.map(p, y) : [].concat(p)
        .map(y);
      return n && (m['pointer-events'] = 'none',
      s['pointer-events'] = 'none',
      m.visibility = 'hidden',
      s.visibility = 'hidden'),
      i ? c.a.createElement('div', {
        className: `${F} ${t.className || ''}`,
        ref: 'component',
        style: t.style
      }, c.a.createElement('div', {
        className: `${F}-mask ${h}`,
        style: m,
        'aria-hidden': 'true',
        ref: 'mask'
      }), c.a.createElement('div', {
        className: `${F}-indicator ${u}`,
        'aria-hidden': 'true',
        ref: 'indicator',
        style: s
      }), c.a.createElement('div', {
        className: `${F}-content`,
        ref: 'content',
        role: 'listbox',
        'aria-busy': 'true'
      }, _)) : c.a.createElement('div', {
        className: `${F} ${t.className || ''}`,
        ref: 'component',
        style: t.style
      }, c.a.createElement('div', {
        className: `${F}-mask ${h}`,
        style: m,
        ref: 'mask'
      }), c.a.createElement('div', {
        className: `${F}-indicator ${u}`,
        ref: 'indicator',
        style: s
      }), c.a.createElement('div', {
        className: `${F}-content`,
        ref: 'content'
      }, _));
    }
  });
  const U = n(29);
  const B = n(101);
  const z = Object(L.c)({
    pure: !1,
    name: 'picker-view'
  })(p()({
    displayName: 'PickerView',
    mixins: [U.b],
    onChange(e) {
      this.setState({
        value: e
      }),
      this.props.onChange && this.props.onChange({
        detail: {
          value: e
        }
      });
    },
    render() {
      const e = this;
      const t = this.props;
      const n = this.props.$appx.getNormalizedStyle({
        style: t.indicatorStyle
      });
      const i = this.props.$appx.getNormalizedStyle({
        style: t.maskStyle
      });
      const r = Object(B.a)(this.props.children)
        .map(((r, a) => {
          const o = Object(B.a)(r.props.children)
            .map(((t, n) => c.a.createElement(V.Item, {
              value: n,
              key: n,
              style: e.props.$appx.getNormalizedStyle(t.props),
              className: t.props.className
            }, t.props.children)
            ));
          const s = e.props.$appx.getNormalizedStyle(r.props);
          return c.a.createElement(V, {
            className: r.props.className,
            style: s,
            key: a,
            indicatorClassName: t.indicatorClass,
            indicatorStyle: n,
            maskClassName: t.maskClass,
            maskStyle: i
          }, o);
        }
        ));
      return c.a.createElement(l, {
        selectedValue: this.state.value,
        onValueChange: this.onChange,
        id: t.id,
        className: t.className,
        style: t.style
      }, r);
    }
  }));
  t.default = z;
},
function (e, t, n) {
  n.r(t);
  let i;
  const r = n(87);
  const a = n(3);
  const o = n.n(a);
  const s = n(0);
  const c = n.n(s);
  const l = n(16);
  const u = n(5);
  const p = n.n(u);
  const d = n(45);
  const h = new (n(68).a)();
  const f = n(7);
  const
    m = {};

  function v(e) {
    return m[e] ? m[e] : (i || (i = document.createElement('div')),
    i.innerHTML = e,
    m[e] = i.textContent,
    m[e]);
  }

  const g = {
    ensp: 1,
    emsp: 1
  };

  function b() {
  }

  const y = new RegExp(['&nbsp;', '&lt;', '&gt;', '&amp;', '&apos;', '&ensp;', '&emsp;'].join('|'), 'g');
  const _ = [Object(l.f)(), Object(l.d)()];
  f.b.VoiceMixin && _.push(f.b.VoiceMixin);
  const w = p()({
    displayName: 'Text',
    mixins: _,
    onTextTap() {
      h.emit('onTap', {
        instance: this
      });
    },
    componentDidMount() {
      this.textTapEvent = Object(d.a)(this.root, {
        tap: this.onTextTap
      });
    },
    componentWillUnmount() {
      this.textTapEvent && (this.textTapEvent.remove(),
      this.textTapEvent = void 0);
    },
    saveRoot(e) {
      this.root = e;
    },
    render() {
      let e;
      const t = this.props;
      const n = t.children;
      const i = t.style;
      const r = t.selectable;
      const a = t.id;
      const s = t.space;
      const l = t.decode;
      const u = t.$appx;
      const p = t.onTap;
      const d = t.catchTap;
      const h = this.props;
      const f = h.className;
      let m = void 0 === f ? '' : f;
      let _ = h.numberOfLines;
      let
        w = o()({
          WebkitUserSelect: r ? 'text' : 'none'
        }, i);
      m += ` a-text-${s ? '' : 'no'}-space`,
      typeof _ === 'string' && (_ = parseInt(_, 10)),
      _ > 0 && (w = o()({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: _,
        WebkitBoxOrient: 'vertical'
      }, w)),
      e = [],
      c.a.Children.forEach(n, ((t) => {
        typeof t === 'string' && (l && (t = t.replace(y, ((e) => v(e)
        ))),
        s && s !== 'nbsp' && (t = (function (e, t) {
          return g[t] ? e.replace(/ /g, v(`&${t};`)) : e;
        }(t, s))),
        t = t.replace(/\\n/g, '\n')),
        e.push(t);
      }
      ));
      const C = u.getDOMProps();
      return (p || d) && (C['data-clickable'] = !0),
      u.getTrackerConfig(C),
      c.a.createElement('span', o()({
        className: m,
        onClick: b,
        style: w,
        id: a,
        ref: this.saveRoot
      }, C), e);
    }
  });
  const C = Object(r.c)({
    name: 'text'
  })(w);
  C.EventHub = h;
  const x = C;
  const T = n(20);
  x.EventHub && x.EventHub.addListener('onTap', ((e) => {
    const t = e.instance;
    Object(T.c)(t, !1);
  }
  ));
  t.default = x;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(23);
  const c = n(1);
  const l = n(29);
  const u = n(21);
  const p = n.n(u);
  const d = n(5);
  const h = n.n(d);
  const f = n(8);

  function m(e, t) {
    e[t ? 'changedTouches' : 'touches'] = [{
      identifier: 0,
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      target: e.target
    }];
  }

  const v = n(116);
  const g = n(130);
  const b = n.n(g);
  const y = n(27);
  const _ = n.n(y);
  const w = (function (e) {
    function t(t) {
      let n;
      return (n = e.call(this, t) || this).state = {
        focused: !1
      },
      n.onInputChange = n.onInputChange.bind(b()(n)),
      n;
    }

    _()(t, e);
    const n = t.prototype;
    return n.speakChangedContent = function () {
      const e = this;
      this.setState({
        needVoice: !0
      }, (() => {
        clearTimeout(e._timerId),
        e._timerId = setTimeout((() => {
          e.setState({
            needVoice: !1
          });
        }
        ), 0);
      }
      ));
    }
    ,
    n.onInputChange = function (e) {
      if (e && e.target && this.props.onChange) {
        const t = e.target.value;
        this.props.onChange(t),
        this.speakChangedContent();
      }
    }
    ,
    n.render = function () {
      const e = this.props;
      const t = e.value;
      const n = e.min;
      const i = e.max;
      const a = e.disabled;
      const s = e.trackSize;
      const c = e.step;
      const l = e.domProps;
      return o.a.createElement('div', {
        className: 'a-slider-a11y-wrapper'
      }, o.a.createElement('input', r()({
        type: 'range',
        className: 'a-slider-a11y-input',
        value: t,
        min: n,
        max: i,
        step: c || 1,
        style: {
          height: 16 + (s || 4)
        },
        disabled: a,
        role: 'slider',
        'aria-valuemin': n,
        'aria-valuemax': i,
        'aria-live': 'assertive',
        'aria-busy': !this.state.needVoice,
        'aria-disabled': a
      }, l, {
        tabindex: -1,
        onChange: this.onInputChange
      })));
    }
    ,
    t;
  }(o.a.Component));

  function C() {
  }

  const x = Object(c.c)({
    name: 'slider'
  })(h()({
    displayName: 'Slider',
    mixins: [l.b],
    getDefaultProps() {
      return {
        min: 0,
        max: 100,
        step: 1,
        disabled: !1,
        value: 0,
        showValue: !1,
        onChange: C,
        onChanging: C
      };
    },
    getInitialState() {
      return this.isVoiceOverRunning = Object(v.a)(),
      {};
    },
    componentDidMount() {
      this.sliderRef && (this.detachSliderEvents = Object(f.a)(this.sliderRef, {
        touchstart: this.onSliderTouchStart,
        mousedown: this.onSliderTouchStart
      }));
    },
    componentDidUpdate(e) {
      if ('value' in this.props || 'min' in this.props || 'max' in this.props) {
        const t = this.props.value;
        const n = this.state.value;
        if (e.value !== t) {
          let i = void 0 !== t ? t : n;
          n !== (i = this.trimAlignValue(i, this.props)) && this.setState({
            value: i
          });
        }
      }
    },
    componentWillUnmount() {
      this.removeDocumentEvents(),
      this.detachSliderEvents && this.detachSliderEvents.remove();
    },
    addDocumentTouchEvents() {
      this.detachEvents = Object(f.a)(this.sliderRef, {
        touchmove: this.onTouchMove,
        mousemove: this.onTouchMove,
        touchend: this.onTouchEnd,
        mouseup: this.onTouchEnd
      });
    },
    removeDocumentEvents() {
      this.detachEvents && this.detachEvents.remove();
    },
    getPrecision(e) {
      const t = `${e}`;
      let n = 0;
      return t.indexOf('.') >= 0 && (n = t.length - t.indexOf('.') - 1),
      n;
    },
    trimAlignValue(e, t) {
      void 0 === t && (t = {});
      const n = r()({}, this.props, t);
      let i = e;
      e < n.min && (i = n.min),
      e > n.max && (i = n.max);
      const a = Math.round((i - n.min) / n.step) * n.step + n.min;
      return parseFloat(a.toFixed(this.getPrecision(n.step)));
    },
    calcValueByPos(e) {
      const t = e - this.sliderRef.getBoundingClientRect().left;
      const n = this.props;
      const i = n.min;
      const r = n.max;
      const a = this.sliderRef.getBoundingClientRect().width;
      const o = Math.abs(Math.max(t, 0) / a) * (r - i) + i;
      return this.trimAlignValue(o);
    },
    pauseEvent(e) {
      e.stopPropagation(),
      e.preventDefault();
    },
    onSliderTouchStart(e) {
      if (!this.props.disabled) {
        e.type === 'mousedown' && m(e, !1);
        let t = e.touches[0].pageX;
        if (e.target !== Object(s.findDOMNode)(this.handleRef)) {
          this.dragOffset = 0;
        } else {
          const n = e.target.getBoundingClientRect();
          const i = n.left + 0.5 * n.width;
          t = i,
          this.dragOffset = t - i;
        }
        const r = this.calcValueByPos(t);
        r !== this.state.value && this.onChanging(r),
        this.addDocumentTouchEvents(),
        this.pauseEvent(e);
      }
    },
    onTouchMove(e) {
      e.type === 'mousemove' && m(e, !1);
      const t = this.state.value;
      const n = e.touches[0].pageX;
      const i = this.calcValueByPos(n - this.dragOffset);
      this.pauseEvent(e),
      i !== t && this.onChanging(i);
    },
    onChanging(e) {
      const t = this;
      this.setState({
        value: e
      }, (() => {
        const e = {
          detail: {
            value: t.state.value
          }
        };
        t.props.onChanging(e);
      }
      ));
    },
    onTouchEnd(e) {
      e.type === 'mouseup' && m(e, !0),
      this.removeDocumentEvents();
      const t = {
        detail: {
          value: this.state.value
        }
      };
      this.props.onChange(t);
    },
    saveSliderRef(e) {
      this.sliderRef = e;
    },
    onA11yInputChange(e) {
      e !== this.state.value && this.onChanging(e);
      const t = {
        detail: {
          value: e
        }
      };
      this.props.onChange(t);
    },
    render() {
      let e;
      const t = this;
      const n = this.props;
      const i = n.className;
      const r = n.style;
      const a = n.id;
      const s = n.min;
      const c = n.max;
      const l = n.disabled;
      const u = n.showValue;
      const d = n.activeColor;
      const h = n.backgroundColor;
      const f = n.trackSize;
      const m = n.handleSize;
      const v = n.handleColor;
      const g = n.step;
      const b = n.$appx;
      const y = this.state.value;
      const _ = this.isVoiceOverRunning;
      const C = p()(((e = {})['a-slider-content'] = !0,
      e['a-slider-disabled'] = l,
      e));
      const x = (y - s) / (c - s) * 100;
      const T = {
        width: `${x}%`
      };
      const S = {};
      const
        E = {
          left: `${x}%`
        };
      return d && (T.backgroundColor = d,
      E.borderColor = d),
      h && (S.backgroundColor = h),
      f && (T.height = +f,
      S.height = +f),
      m && (E.width = +m,
      E.height = +m,
      E.marginLeft = -m / 2,
      E.marginTop = -(m - (f || 4)) / 2),
      v && (E.backgroundColor = v),
      o.a.createElement('div', {
        className: i,
        id: a,
        style: r
      }, o.a.createElement('div', {
        className: 'a-slider-wrapper'
      }, _ && o.a.createElement(w, {
        value: y,
        min: s,
        max: c,
        disabled: l,
        trackSize: f,
        step: g,
        domProps: b.getDOMProps(),
        onChange: this.onA11yInputChange
      }), o.a.createElement('div', {
        ref: this.saveSliderRef,
        className: C
      }, o.a.createElement('div', {
        className: 'a-slider-rail',
        style: S
      }), o.a.createElement('div', {
        className: 'a-slider-track',
        style: T
      }), o.a.createElement('div', {
        className: 'a-slider-handle',
        style: E,
        ref(e) {
          return t.handleRef = e;
        }
      }))), u && o.a.createElement('div', {
        className: 'a-slider-presentation'
      }, y));
    }
  }));
  t.default = x;
},
function (e, t, n) {
  n.r(t);
  const i = n(1);
  const r = n(0);
  const a = n.n(r);
  const o = n(5);
  const s = n.n(o);
  const c = n(64);
  const l = n(20);
  const u = function () {
  };
  const p = self;
  const d = s()({
    getDefaultProps() {
      return {
        longitude: 116.39,
        latitude: 39.9,
        scale: 16,
        showLocation: !1,
        markers: [],
        polyline: [],
        circles: [],
        controls: [],
        polygon: [],
        includePoints: []
      };
    },
    componentDidMount() {
      let e;
      const
        t = this;
      e = function () {
        t.drawMap(),
        t.drawed = !0;
      }
      ,
      Object(c.a)('https://webapi.amap.com/maps?v=1.3&key=f48f7bb209b683d7192bf2efa14c2b91', e);
    },
    componentDidUpdate(e) {
      const t = this;
      if (this.drawed) {
        const n = this.props;
        const i = n.longitude;
        const r = n.latitude;
        const a = n.scale;
        const o = n.markers;
        const s = n.polyline;
        const c = n.polygon;
        const l = n.circles;
        const u = n.controls;
        const d = n.includePoints;
        const h = n.showLocation;
        const f = p.AMap;
        f && f.Map && (e.longitude === i && e.latitude === r || this.map.setCenter([i, r]),
        e.scale !== a && this.map.setZoom(a),
        e.markers !== o && ((this.markers || []).map(((e) => e.setMap(null)
        )),
        this.drawMarkers()),
        e.polyline !== s && ((this.polyline || []).map(((e) => e.setMap(null)
        )),
        this.drawPolyline()),
        e.polygon !== c && ((this.polygon || []).map(((e) => e.setMap(null)
        )),
        this.drawPolygon()),
        e.circles !== l && ((this.circles || []).map(((e) => e.setMap(null)
        )),
        this.drawPolyline()),
        e.controls !== u && ((this.controls || []).map(((e) => t.map.removeControl(e)
        )),
        this.drawControls()),
        e.includePoints !== d && ((this.fitMarkers || []).map(((e) => e.setMap(null)
        )),
        this.drawIncludePoints()),
        e.showLocation !== h && this.showLocation());
      }
    },
    componentWillUnmount() {
      const e = this;
      const t = this.props.controls;
      const n = p.AMap;
      t && t.map && t.forEach(((t, i) => {
        e[`controlListener${i}`] && n.event.removeListener(e[`controlListener${i}`]);
      }
      )),
      this.map && (this.map = null);
    },
    getHexAlpha(e) {
      return e && e.length === 9 ? {
        hex: e.substring(0, 7),
        alpha: 1 - (255 - parseInt(e.substring(7, 9), 16)) / 255
      } : {
        hex: '#000000',
        alpha: 0
      };
    },
    getCenterLocation(e) {
      if (this.map) {
        const t = this.map.getCenter();
        e({
          longitude: t.lng,
          latitude: t.lat
        });
      } else {
        e({
          error: 'not init'
        });
      }
    },
    drawPolyline() {
      const e = this;
      const t = p.AMap;
      const n = this.map;
      const i = this.props.polyline;
      this.polyline = [],
      i && i.map && i.forEach(((i) => {
        const r = i.points.map(((e) => [e.longitude, e.latitude]
        ));
        const a = new t.Polyline({
          path: r,
          strokeColor: e.getHexAlpha(i.color).hex,
          strokeOpacity: e.getHexAlpha(i.color).alpha,
          strokeWeight: i.width || 5,
          strokeStyle: i.dottedLine ? 'dashed' : 'solid'
        });
        a.setMap(n),
        e.polyline.push(a);
      }
      ));
    },
    drawPolygon() {
      const e = this;
      const t = p.AMap;
      const n = this.map;
      const i = this.props.polygon;
      this.polygon = [],
      i && i.map && i.forEach(((i) => {
        const r = i.points.map(((e) => [e.longitude, e.latitude]
        ));
        const a = new t.Polygon({
          path: r,
          strokeColor: e.getHexAlpha(i.color).hex,
          strokeOpacity: e.getHexAlpha(i.color).alpha,
          strokeWeight: i.width || 5,
          fillColor: e.getHexAlpha(i.fillColor).hex,
          fillOpacity: e.getHexAlpha(i.fillColor).alpha
        });
        a.setMap(n),
        e.polygon.push(a);
      }
      ));
    },
    drawCircles() {
      const e = this;
      const t = p.AMap;
      const n = this.map;
      const i = this.props.circles;
      this.circles = [],
      i && i.map && i.forEach(((i) => {
        const r = new t.Circle({
          center: [i.longitude, i.latitude],
          radius: i.radius,
          strokeColor: e.getHexAlpha(i.color).hex,
          strokeOpacity: e.getHexAlpha(i.color).alpha,
          strokeWeight: i.strokeWidth || 5,
          fillColor: e.getHexAlpha(i.fillColor).hex,
          fillOpacity: e.getHexAlpha(i.fillColor).alpha
        });
        r.setMap(n),
        e.circles.push(r);
      }
      ));
    },
    drawControls() {
      const e = this;
      const t = p.AMap;
      const n = this.map;
      const i = this.props;
      const r = i.controls;
      const a = i.onControlTap;
      this.controls = [],
      r && r.map && r.forEach(((i, r) => {
        const o = document.createElement('div');
        i.id && (o.id = i.id),
        o.innerHTML = `<img src="${location.origin}/${i.iconPath}"\n              style="width: 100%; height: 100%; vertical-align: middle" />`,
        o.style.position = 'absolute',
        o.style.left = `${i.position.left}px`,
        o.style.top = `${i.position.top}px`,
        o.style.width = `${i.position.width}px`,
        o.style.height = `${i.position.height}px`,
        o.style.zIndex = 170,
        i.clickable && a && (e[`controlListener${r}`] = t.event.addDomListener(o, 'click', (() => {
          a(i.id ? {
            controlId: i.id
          } : {});
        }
        )));
        var s = {
          dom: o,
          addTo() {
            n.getContainer()
              .appendChild(s.dom);
          },
          removeFrom(e) {
            e.getContainer()
              .removeChild(s.dom);
          }
        };
        n && n.addControl(s),
        e.controls.push(s);
      }
      ));
    },
    drawIncludePoints() {
      const e = p.AMap;
      const t = this.props;
      const n = this.map;
      this.fitMarkers = [];
      const i = t.includePoints;
      if (i && i.map) {
        const r = i.map(((t) => new e.Circle({
          center: [t.longitude, t.latitude],
          map: n,
          radius: 1,
          strokeColor: 'red',
          strokeOpacity: 0,
          fillColor: 'red',
          fillOpacity: 0
        })
        ));
        if (i.length === 1) {
          const a = i[0];
          n && n.setCenter([a.longitude, a.latitude]);
        } else {
          n && n.setFitView(r);
        }
        this.fitMarkers = r;
      }
    },
    drawMarkers() {
      const e = this;
      const t = p.AMap;
      const n = this.map;
      const i = this.props;
      const r = i.markers;
      const a = i.onMarkerTap;
      const o = void 0 === a ? u : a;
      const s = i.$appx;
      const c = i.onCalloutTap;
      const l = void 0 === c ? u : c;
      const d = i.id;
      this.markers = [],
      r && r.map && r.forEach(((i) => {
        let r;
        let a;
        let c;
        let u;
        const p = (r = i.anchorX,
        a = i.anchorY,
        c = i.width,
        u = i.height,
        void 0 === r && (r = 0.5),
        void 0 === a && (a = 1),
        void 0 === c && (c = 20),
        void 0 === u && (u = 34),
        {
          x: -c * r,
          y: -u * a
        });
        const
          h = new t.Marker({
            position: [i.longitude, i.latitude],
            map: n,
            content: i.iconPath ? `<img src="${s.getNormalizedSrc(i.iconPath)}"\n                width="${i.width}" height="${i.height}" style="opacity: ${i.alpha}" />` : '',
            title: i.title || '',
            angle: i.rotate || 0,
            extData: {
              id: i.id || ''
            },
            offset: new t.Pixel(p.x, p.y)
          });
        if (h.on('click', (() => {
          const e = {
            targetDataset: {},
            id: d,
            tagName: 'map',
            dataset: {}
          };
          o(i.id ? {
            markerId: i.id,
            type: 'markerTap',
            timeStamp: (new Date()).getTime(),
            target: e,
            currentTarget: e,
            latitude: i.latitude,
            longitude: i.longitude
          } : {});
        }
        )),
        i.callout && i.callout.content) {
          const f = document.createElement('div');
          f.innerHTML = i.title ? `<span style="font-size: 14px;">${i.title}</span><br/>${i.callout.content}` : i.callout.content,
          t.event.addDomListener(f, 'click', (() => {
            const e = {
              targetDataset: {},
              id: d,
              tagName: 'map',
              dataset: {}
            };
            l({
              type: 'calloutTap',
              timeStamp: (new Date()).getTime(),
              target: e,
              currentTarget: e,
              markerId: i.id,
              latitude: i.latitude,
              longitude: i.longitude
            });
          }
          ));
          const m = new t.InfoWindow({
            content: f
          });
          h.on('click', (() => {
            m.open(n, [i.longitude, i.latitude]);
          }
          ));
        }
        e.markers.push(h);
      }
      ));
    },
    moveToLocation() {
      const e = this.map;
      const t = this.props;
      const n = t.longitude;
      const i = t.latitude;
      if (e) {
        const r = [n, i];
        e.setCenter(r);
      }
    },
    gestureEnable() {
    },
    showsScale(e) {
      const t = this;
      const n = e.data;
      const i = void 0 === n ? {} : n;
      const r = p.AMap;
      const a = this.map;
      r.plugin(['AMap.Scale'], (() => {
        t.scale || (t.scale = new r.Scale({
          visible: !!i.isShowsScale
        }),
        a.addControl(t.scale)),
        i.isShowsScale ? t.scale.show() : t.scale.hide();
      }
      ));
    },
    showsCompass(e) {
      const t = e.data;
      (void 0 === t ? {} : t).isShowsCompass;
    },
    showRoute(e) {
      const t = this;
      const n = e.startLat;
      const i = e.startLng;
      const r = e.endLat;
      const a = e.endLng;
      const o = e.routeColor;
      const s = void 0 === o ? '#6db74d' : o;
      const c = p.AMap;
      const l = this.map;
      c.plugin(['AMap.Walking'], (() => {
        t.walking || (t.walking = new c.Walking({
          map: l,
          autoFitView: !0,
          outlineColor: s
        })),
        t.walking.search([i, n], [a, r]);
      }
      ));
    },
    clearRoute() {
      this.walking && this.walking.clear();
    },
    showLocation() {
      let e;
      const t = p.AMap;
      const
        n = this.map;
      this.props.showLocation ? t.plugin(['AMap.Geolocation'], (() => {
        e = new t.Geolocation({
          showButton: !1
        }),
        n.addControl(e);
      }
      )) : e && n.removeControl(e);
    },
    drawMap() {
      const e = this;
      const t = p.AMap;
      if (t && t.Map) {
        const n = this.props;
        const i = n.longitude;
        const r = n.latitude;
        const a = n.id;
        const o = new t.Map(this.rootMapElement, {
          zoom: n.scale,
          center: [i, r]
        });
        this.map = o,
        n.onTap && o.on('click', ((t) => {
          Object(l.c)(e, !0, !0, !1);
          const i = {
            targetDataset: {},
            id: a,
            tagName: 'map',
            dataset: {}
          };
          n.onTap({
            type: 'tap',
            timeStamp: (new Date()).getTime(),
            target: i,
            currentTarget: i,
            latitude: t.lnglat.getLat(),
            longitude: t.lnglat.getLng()
          });
        }
        )),
        n.onRegionChange && (o.on('dragstart', (() => {
          const e = o.getCenter();
          const t = e.lng;
          const i = e.lat;
          n.onRegionChange({
            type: 'begin',
            scale: o.getZoom(),
            latitude: i,
            longitude: t
          });
        }
        )),
        o.on('dragend', (() => {
          const e = o.getCenter();
          const t = e.lng;
          const i = e.lat;
          n.onRegionChange({
            type: 'end',
            scale: o.getZoom(),
            latitude: i,
            longitude: t
          });
        }
        ))),
        this.showLocation(),
        this.drawMarkers(),
        this.drawPolyline(),
        this.drawPolygon(),
        this.drawCircles(),
        this.drawControls(),
        this.drawIncludePoints();
      }
    },
    render() {
      const e = this;
      const t = this.props;
      const n = t.style;
      return a.a.createElement('div', {
        className: t.className,
        ref(t) {
          e.rootMapElement = t;
        },
        style: n
      });
    }
  });
  const h = n(6);
  const f = n(22);
  const m = n(12);
  const v = n(9);
  const g = n(67);
  const b = n(8);
  const y = n(4);
  let _ = 0;
  const w = a.a.createElement('param', {
    name: 'type',
    value: 'map'
  });
  const C = s()({
    displayName: 'Map',
    mixins: [f.a],
    getDefaultProps() {
      return {
        longitude: 116.39,
        latitude: 39.9,
        defaultScale: 16,
        showLocation: !1,
        markers: [],
        polyline: [],
        circles: [],
        controls: [],
        polygon: [],
        includePoints: [],
        groundOverlays: [],
        showIndoormap: !1,
        skew: 0,
        rotate: 0
      };
    },
    componentDidMount() {
      this.useNative = !0,
      this.onDidMountForNative(),
      this.mapEvent = Object(b.a)(document, {
        'nbcomponent.map.bindtap': this.onMapTap
      });
    },
    componentWillUnmount() {
      this.mapEvent && this.mapEvent.remove();
    },
    componentDidUpdate(e) {
      this.renderNativeComponent('update', e);
    },
    renderNativeComponent(e, t) {
      const n = this;
      if (this.readyForRender) {
        this.clearRenderDelay();
        const r = this.props;
        const a = {
          longitude: Object(m.a)(r.longitude),
          latitude: Object(m.a)(r.latitude),
          scale: Object(m.a)(r.scale),
          markers: r.markers,
          polyline: r.polyline,
          circles: r.circles,
          controls: r.controls,
          polygon: r.polygon,
          'show-location': Object(m.a)(r.showLocation),
          'include-points': r.includePoints,
          'include-points-animation': Object(m.a)(r.includePointsAnimation),
          'include-padding': r.includePadding,
          'ground-overlays': r.groundOverlays,
          'tile-overlay': r.tileOverlay,
          setting: r.setting,
          customMapStyle: r.customMapStyle,
          skew: r.skew,
          rotate: r.rotate,
          limitRegion: r.limitRegion,
          'enable-satellite': r.enableSatellite,
          panels: r.panels,
          'show-indoormap': r.showIndoormap,
          'map-type': r.mapType,
          'min-scale': r.minScale,
          'max-scale': r.maxScale
        };
        if (Object(y.isFeatureAvailable)('c_map_bindEvents_24_0') && (a['bind-events'] = (function (e) {
          const t = [];
          return ['onMarkerTap', 'onControlTap', 'onTap', 'onCalloutTap', 'onPoiTap'].forEach(((n) => {
            e[n] && t.push(n.substr(2)
              .toLowerCase());
          }
          )),
          JSON.stringify(t);
        }(this.props))),
        Object(y.isFeatureAvailable)('c_map_poiFilters_24_1') && (a['poi-filters'] = r.poiFilters),
        Object(y.isFeatureAvailable)('c_map_includeScale_24_1') && (a['include-scale'] = r.includeScale),
        Object(i.g)().appXMapOptimize || r.optimize) {
          if (this._initiated) {
            if (!t) return;
            for (let o = 0, s = Object(v.default)(a); o < s.length; o++) {
              const c = s[o];
              if (c === 'bind-events') {
                a[c] === this.bindEvents ? delete a[c] : this.bindEvents = a[c];
              } else {
                const l = Object(g.a)(c);
                t[l] === r[l] && delete a[c];
              }
            }
            if (Object(v.default)(a).length === 0) return;
            a.optimize = !0,
            a._version = _++,
            a.type = 'map',
            Object(h.a)('NBComponent.render', {
              element: this.getId(),
              data: a
            });
          } else {
            a.optimize = !0,
            a._version = _++,
            a.scale = a.scale != null ? a.scale : 16,
            a.type = 'map',
            Object(h.a)('NBComponent.render', {
              element: this.getId(),
              data: a
            }, ((e) => {
              e.success && (n.bindEvents = a['bind-events'],
              n._initiated = !0);
            }
            ));
          }
        } else {
          t || a.scale != null || (a.scale = r.defaultScale),
          a.type = 'map',
          Object(h.a)('NBComponent.render', {
            element: this.getId(),
            data: a
          });
        }
      }
    },
    onMapTap(e) {
      const t = e.data.element;
      const n = this.props.onTap;
      t === this.getId() && Object(l.c)(this, !0, !!n, !1);
    },
    render() {
      const e = this.props;
      return a.a.createElement('object', {
        className: `${e.className} nbcomponentanimation-${this.getId()}`,
        style: e.style,
        id: e.id,
        type: 'application/view',
        role: 'application'
      }, w, a.a.createElement('param', {
        name: 'id',
        value: this.getId()
      }));
    }
  });
  const x = Object(i.c)({
    name: 'map',
    isNativeComponent() {
      return Object(y.isNativeComponentForLyra)('map');
    }
  })(Object(y.isNativeComponentForLyra)('map') ? C : d);
  t.default = x;
},
function (e, t, n) {
  n.r(t);
  const i = n(10);
  const r = n(4);
  const a = {
    v: '23_0',
    context: {
      method: {
        start: !0,
        stop: !0,
        mute: !0,
        switchCamera: !0,
        enableCamera: !0,
        audioMode: !0,
        showDebugInfo: !0
      },
      eventPrefix: 'nbcomponent.rtc-room.',
      event: {
        error: {
          error: !0,
          errorMessage: !0
        },
        roomInfo: {
          roomId: !0,
          token: !0
        },
        enterRoom: {},
        participantEnter: {
          users: !0
        },
        participantLeave: {
          users: !0,
          leaveInfo: !0
        },
        audioPlayoutMode: {
          mode: !0
        },
        networkType: {
          network: !0
        },
        networkQuality: {
          quality: !0,
          isLocal: !0
        },
        receiveRecordId: {
          recordId: !0
        },
        firstRender: {
          userId: !0
        },
        renderStop: {
          userId: !0
        }
      }
    },
    view: {
      props: {
        roomId: {},
        token: {},
        userId: {},
        signature: {},
        fps: {
          defaultValue: 15
        },
        resolution: {
          defaultValue: 1
        },
        enableCamera: {
          defaultValue: !0,
          type: 'string'
        },
        autoplay: {
          defaultValue: !1
        },
        mute: {
          defaultValue: !1
        },
        record: {
          defaultValue: !1
        },
        minBitrate: {},
        maxBitrate: {},
        extraInfo: {},
        channelId: {},
        aliyunInfo: {},
        privateMapKey: {}
      }
    }
  };
  Object(r.isFeatureAvailable)('a_rtc_room_context_sendMessage_23_5') && (a.context.method.sendMessage = !0),
  Object(r.isFeatureAvailable)('c_rtc_room_onReceiveMessage_23_5') && (a.context.event.receiveMessage = {
    userId: !0,
    message: !0,
    messageId: !0,
    timestamp: !0
  }),
  Object(r.isFeatureAvailable)('c_rtc_room_context_inviteUser_24_0') && (a.context.method.inviteUser = !0),
  Object(r.isFeatureAvailable)('c_rtc_room_onReply_24_0') && (a.context.event.reply = {
    inviteId: !0,
    replyType: !0
  }),
  Object(r.isFeatureAvailable)('a_rtc_room_context_snapshot_23_7') && (a.context.method.snapshot = !0),
  Object(r.isFeatureAvailable)('a_rtc_room_context_snapshot_23_7') && (a.context.method.snapshot = !0),
  Object(r.isFeatureAvailable)('a_rtc_room_context_showPreView_24_1') && (a.context.method.showPreView = !0);
  const o = {
    'rtc-room': a
  };
  const s = n(9);
  const c = n(5);
  const l = n.n(c);
  const u = n(1);
  const p = n(58);
  const d = n(28);
  const h = n(22);
  const f = n(6);
  const m = n(67);
  const v = n(0);
  const g = n.n(v);
  n.d(t, 'default', (() => _
  ));
  const b = {};

  function y(e, t) {
    if (b[e]) return b[e];
    const n = t.view.props;
    let i = [];
    if (Array.isArray(n)) {
      i = n;
    } else {
      for (let a = 0, o = Object(s.default)(n); a < o.length; a++) {
        const c = o[a];
        const v = n[c];
        v.originName = c,
        v.propName = Object(m.a)(c),
        i.push(v);
      }
    }
    return b[e] = Object(u.c)({
      name: e,
      isNativeComponent() {
        return Object(r.isNativeComponentForLyra)(e);
      }
    })(l()({
      displayName: Object(p.a)(e),
      mixins: [d.a, h.a],
      getDefaultProps() {
        for (var e = {}, t = 0, n = i; t < n.length; t++) {
          const r = n[t];
          const a = r.defaultValue;
          const o = r.propName;
          a && (e[o] = a);
        }
        return e;
      },
      getInitialState() {
        return this.useNative = this.props.$appx.isNativeComponent,
        t.view.onInit && t.view.onInit.apply(this) || {};
      },
      componentDidMount() {
        this.useNative && this.onDidMountForNative(),
        t.view.didMount && t.view.didMount.apply(this);
      },
      componentDidUpdate(e) {
        for (let n = 0, r = i; n < r.length; n++) {
          const a = r[n].propName;
          if (e[a] !== this.props[a]) {
            this.renderNativeComponent();
            break;
          }
        }
        t.view.didUpdate && t.view.didUpdate.apply(this, e);
      },
      componentWillUnmount() {
        t.view.didUnmount && t.view.didUnmount.apply(this);
      },
      renderNativeComponent() {
        if (this.readyForRender && this.useNative) {
          this.clearRenderDelay();
          for (var t = {
              type: e
            }, n = 0, r = i; n < r.length; n++) {
            const a = r[n];
            const o = a.originName;
            const s = a.propName;
            t[o] = this.props[s];
          }
          Object(f.a)('NBComponent.render', {
            element: this.getId(),
            data: t
          });
        }
      },
      render() {
        const n = this.props;
        const r = n.style;
        const a = n.className;
        const o = n.id;
        if (!this.checkPermission(e)) {
          return this.getPermissionJSX({
            className: a,
            style: r,
            id: o
          });
        }
        if (!this.useNative) return this.getUnsupportJSX();
        const s = [];
        if (t.view.renderParams) {
          for (let c = 0, l = i; c < l.length; c++) {
            const u = l[c];
            const p = u.originName;
            const d = u.propName;
            s.push(g.a.createElement('param', {
              name: p,
              value: this.props[d]
            }));
          }
        }
        const h = t.view.customType || e;
        return g.a.createElement('object', {
          className: `${a} nbcomponentanimation-${this.getId()}`,
          style: r,
          id: o,
          type: 'application/view',
          role: 'application'
        }, g.a.createElement('param', {
          name: 'type',
          value: h
        }), g.a.createElement('param', {
          name: 'id',
          value: this.getId()
        }), s);
      }
    })),
    b[e];
  }

  function _(e) {
    for (let t = function (t, n) {
        const i = n[t];
        Object(r.isFeatureAvailable)(`c_${i}_${o[i].v}`) && Object.defineProperty(e, Object(p.a)(i), {
          configurable: !0,
          get() {
            return y(i, o[i]);
          }
        });
      }, n = 0, a = Object(s.default)(o); n < a.length; n++) {
      t(n, a);
    }
    for (let c = function (t, n) {
        const a = n[t];
        const o = i.b[a];
        Object(r.isAvailable)(o.support) && Object.defineProperty(e, Object(p.a)(a), {
          configurable: !0,
          get() {
            return y(a, o);
          }
        });
      }, l = 0, u = Object(s.default)(i.b); l < u.length; l++) {
      c(l, u);
    }
  }
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(23);
  const c = n.n(s);
  const l = n(1);
  const u = n(5);
  const p = n.n(u);
  const d = n(16);
  const h = n(38);
  const f = n(8);
  const m = n(2);
  let v = !1;
  try {
    const g = Object.defineProperty({}, 'passive', {
      get() {
        v = !0;
      }
    });
    window.addEventListener('testPassive', null, g),
    window.removeEventListener('testPassive', null, g);
  } catch (e) {
  }
  const b = v;
  const y = n(89);
  const _ = n(12);
  const w = n(4);
  const C = n(18);
  const x = 0;
  const T = 1;
  const S = {
    overflowY: 'hidden',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch'
  };
  Object(w.isFeatureAvailable)('c_scrollView_removeWKOFSOnIOS13_24_4') && m.r && 'visualViewport' in window && delete S.WebkitOverflowScrolling;
  const E = {
    scrollX: {
      overflowY: 'hidden',
      overflowX: 'auto'
    },
    scrollY: {
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  };
  const k = Object(l.c)({
    pure: !1,
    name: 'scroll-view'
  })(p()({
    displayName: 'ScrollView',
    mixins: [Object(d.f)(), Object(d.e)()],
    getDefaultProps() {
      return {
        scrollX: !1,
        scrollY: !1,
        upperThreshold: 50,
        lowerThreshold: 50,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWithAnimation: !1,
        enableBackToTop: !1,
        trapScroll: !1
      };
    },
    getInitialState() {
      return this.pluginId = this.props.__owner && this.props.__owner.getPluginId(),
      {};
    },
    componentDidMount() {
      const e = this.props;
      const t = e.enableBackToTop;
      const n = e.scrollY;
      if (this.onScroll = Object(h.a)(this.onScroll, 16),
      this._xUpperState = T,
      this._xLowerState = x,
      this._yUpperState = T,
      this._yLowerState = x,
      this.componentDidUpdate({}),
      t && n) {
        let i;
        const
          r = m.r ? 'statusBarClick' : 'titleClick';
        this.documentEvents = Object(f.a)(document, ((i = {})[r] = this.scrollToTop,
        i));
      }
      this.scrollView && (this.scrollViewTouchEvents = Object(f.a)(this.scrollView, {
        touchstart: this.onScrollViewTouchEvents,
        touchmove: this.onScrollViewTouchEvents,
        touchend: this.onScrollViewTouchEvents,
        touchcancel: this.onScrollViewTouchEvents
      }));
    },
    componentDidUpdate(e) {
      this.bindEvents();
      const t = this.scrollView;
      const n = this.props;
      const i = n.scrollLeft;
      const r = n.scrollTop;
      const a = n.scrollWithAnimation;
      const o = n.scrollX;
      const s = n.scrollY;
      const u = n.scrollIntoView;
      if (o || s) {
        if (u && e.scrollIntoView !== u) {
          const p = Object(l.e)();
          let d = Object(_.a)(u);
          this.pluginId && (d = Object(C.g)(this.pluginId, d));
          const h = c.a.findDOMNode(p.refComponents[d]);
          if (h) {
            const f = h.getBoundingClientRect();
            const m = t.getBoundingClientRect();
            o && (a ? this.ScrollWithAnimationFn(t, Math.max(t.scrollLeft + f.left - m.left, 0), !1) : t.scrollLeft = Math.max(t.scrollLeft + f.left - m.left, 0)),
            s && (a ? this.ScrollWithAnimationFn(t, Math.max(t.scrollTop + f.top - m.top, 0), !0) : t.scrollTop = Math.max(t.scrollTop + f.top - m.top, 0));
          }
        } else {
          o && void 0 !== i && e.scrollLeft !== i && (a ? this.ScrollWithAnimationFn(t, Object(_.a)(i), !1) : t.scrollLeft = Object(_.a)(i)),
          s && void 0 !== r && e.scrollTop !== r && (a ? this.ScrollWithAnimationFn(t, Object(_.a)(r), !0) : t.scrollTop = Object(_.a)(r));
        }
      }
    },
    componentWillUnmount() {
      this.documentEvents && this.documentEvents.remove(),
      this.scrollViewTouchEvents && this.scrollViewTouchEvents.remove(),
      this.bindEvents({});
    },
    bindEvents(e) {
      const t = e || this.props;
      const n = t.scrollY;
      t.scrollX || n ? this.__binded || (this.__binded = !0,
      this.scrollView.addEventListener('scroll', this.onScroll, !!b && {
        passive: !0
      })) : this.__binded && (this.__binded = !1,
      this.scrollView.removeEventListener('scroll', this.onScroll));
    },
    onScrollViewTouchEvents(e) {
      switch (void 0 === e && (e = {}),
      e.type) {
        case 'touchstart':
          this.fireTouchEvent(e, 'touchStart');
          break;
        case 'touchmove':
          this.animateScrollTimer && (this.animateScrollTimer = clearTimeout(this.animateScrollTimer)),
          this.fireTouchEvent(e, 'touchMove');
          break;
        case 'touchend':
          this.fireTouchEvent(e, 'touchEnd');
          break;
        case 'touchcancel':
          this.fireTouchEvent(e, 'touchCancel');
      }
    },
    fireTouchEvent(e, t) {
      let n;
      this[(n = t,
      `on${Object(y.a)(n)}`)](e);
    },
    scrollToTop() {
      const e = this.scrollView;
      if (e) {
        e.scrollTop = 0;
        const t = {
          x: e.scrollLeft,
          y: e.scrollTop
        };
        const n = {
          width: e.scrollWidth,
          height: e.scrollHeight
        };
        const i = this.props.onScroll;
        if (i) {
          i({
            detail: {
              scrollLeft: t.x,
              scrollTop: t.y,
              scrollWidth: n.width,
              scrollHeight: n.height
            }
          });
        }
      }
    },
    runAnimationScroll(e, t, n, i) {
      const r = this;
      const a = e[i];
      const o = t - a;
      if (n !== 0) {
        if (l.h.getSwitch('scrollViewOptimizeAnimation', !1) && Math.abs(t - e[i]) <= 1) {
          e[i] = t;
        } else {
          !(function s(c) {
            c += 10,
            e[i] = (function (e, t, n, i) {
              return (e /= i / 2) < 1 ? n / 2 * e * e + t : -n / 2 * ((e -= 1) * (e - 2) - 1) + t;
            }(c, a, o, n)),
            c < n ? r.animateScrollTimer = setTimeout((() => {
              s(c);
            }
            ), 10) : e[i] !== t && (e[i] = t);
          }(0));
        }
      } else {
        e[i] = t;
      }
    },
    ScrollWithAnimationFn(e, t, n) {
      const i = this.props.scrollAnimationDuration;
      const r = n ? 'scrollTop' : 'scrollLeft';
      l.h.getSwitch('scrollViewOptimizeAnimation', !1) && (t = n ? t > e.scrollHeight - e.offsetHeight ? e.scrollHeight - e.offsetHeight : t : t > e.scrollWidth - e.offsetWidth ? e.scrollWidth - e.offsetWidth : t);
      const a = i && i > 0 ? i : 1 * Math.abs(t - e[r]);
      this.runAnimationScroll(e, t, a, r);
    },
    saveScrollView(e) {
      this.scrollView = e;
    },
    onScroll() {
      const e = this.props;
      const t = e.onScroll;
      const n = e.onScrollToLower;
      const i = e.onScrollToUpper;
      const r = e.scrollX;
      const a = e.scrollY;
      const o = e.upperThreshold;
      const s = e.lowerThreshold;
      const c = e.trapScroll;
      if (this.scrollView) {
        const l = this.scrollView;
        const u = {
          x: l.scrollLeft,
          y: l.scrollTop
        };
        const p = {
          width: l.scrollWidth,
          height: l.scrollHeight
        };
        const d = l.clientWidth;
        const h = l.clientHeight;
        if (a && u.y < o ? i && this._yUpperState === x && (this._yLowerState = x,
        i(),
        this._yUpperState = T) : this._yUpperState = x,
        p.height - h - u.y < s ? a && n && this._yLowerState === x && (this._yUpperState = x,
        n(),
        this._yLowerState = T) : this._yLowerState = x,
        r && u.x < o ? i && this._xUpperState === x && (this._xLowerState = x,
        i(),
        this._xUpperState = T) : this._xUpperState = x,
        p.width - d - u.x < s ? r && n && this._xLowerState === x && (this._xUpperState = x,
        n(),
        this._xLowerState = T) : this._xLowerState = x,
        t) {
          if (c && a) {
            if (u.y === 1) return;
            if (u.y + l.offsetHeight === l.scrollHeight - 1) return;
          }
          t({
            detail: {
              scrollLeft: u.x,
              scrollTop: u.y,
              scrollWidth: p.width,
              scrollHeight: p.height
            }
          });
        }
        c && a && (u.y === 0 ? l.scrollTop = 1 : u.y + l.offsetHeight === l.scrollHeight && (l.scrollTop = u.y - 1));
      }
    },
    render() {
      const e = this.props;
      const t = e.scrollX;
      const n = e.scrollY;
      const i = e.children;
      const a = e.style;
      const s = e.className;
      const c = e.id;
      const l = e.$appx;
      const u = r()({}, S, t && E.scrollX, n && E.scrollY, a);
      return o.a.createElement('div', r()({
        id: c,
        className: s,
        ref: this.saveScrollView,
        style: u
      }, l.getTrackerConfig()), i);
    }
  }));
  t.default = k;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(61);
  const c = n(21);
  const l = n.n(c);
  const u = n(1);
  const p = {
    scaleToFill: {
      backgroundSize: '100% 100%'
    },
    aspectFit: {
      backgroundSize: 'contain',
      backgroundPosition: 'center'
    },
    widthFix: {
      backgroundSize: '100% 100%',
      height: 'auto',
      lineHeight: 0
    },
    aspectFill: {
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    top: {
      backgroundPosition: 'top'
    },
    bottom: {
      backgroundPosition: 'bottom'
    },
    center: {
      backgroundPosition: 'center'
    },
    left: {
      backgroundPosition: 'center left'
    },
    right: {
      backgroundPosition: 'center right'
    },
    'top left': {
      backgroundPosition: 'top left'
    },
    'top right': {
      backgroundPosition: 'top right'
    },
    'bottom left': {
      backgroundPosition: 'bottom left'
    },
    'bottom right': {
      backgroundPosition: 'bottom right'
    }
  };
  const d = n(5);
  const h = n.n(d);
  const f = n(47);
  const m = n(20);
  const v = n(4);
  const g = {
    visibility: 'hidden',
    width: '100%'
  };
  Object(v.isFeatureAvailable)('c_image_widthFixV2_24_4') && delete g.visibility;
  t.default = Object(u.c)({
    name: 'image'
  })(h()({
    displayName: 'Image',
    getInitialState() {
      return {
        lazyLoaded: !this.props.lazyLoad,
        loaded: !1
      };
    },
    getDefaultProps() {
      return {
        mode: 'scaleToFill',
        lazyLoad: !1
      };
    },
    componentWillReceiveProps(e) {
      const t = this.props.lazyLoad;
      this.state.lazyLoaded || t !== e.lazyLoad && !1 === e.lazyLoad && this.setState({
        lazyLoaded: !0
      });
    },
    componentDidMount() {
      this.state.lazyLoaded && (this.initImg(),
      this.updateSrc());
    },
    componentDidUpdate(e) {
      if (this.state.lazyLoaded) {
        const t = this.props;
        const n = (t.lazyLoad,
        t.src);
        this.initImg(),
        n === e.src && this.lazyLoaded || (this.lazyLoaded = !0,
        this.updateSrc());
      }
    },
    shouldOnLoad() {
      return this.props.defaultSource || this.props.onLoad;
    },
    shouldOnError() {
      return this.props.defaultSource || this.props.onError;
    },
    initImg() {
      const e = this.props;
      const t = e.onLoad;
      const n = e.onError;
      const i = e.defaultSource;
      if (e.mode !== 'widthFix' && (t || n || i)) {
        const r = this.img = this.img || new Image();
        this.shouldOnLoad() && !r.onload && (r.onload = this.onLoad),
        this.shouldOnError() && !r.onerror && (r.onerror = this.onError);
      } else {
        const a = this.img;
        a && (a.onload = null,
        a.onerror = null,
        this.img = null);
      }
    },
    updateSrc() {
      const e = this.props;
      const t = e.src;
      const n = e.$appx;
      t && this.img && (this.img.src = n.getNormalizedSrc(t));
    },
    onLoad(e) {
      const t = this.props;
      const n = t.defaultSource;
      const i = t.onLoad;
      if (n && this.setState({
        loaded: !0
      }),
      i) {
        const r = e.target;
        i({
          detail: {
            width: r.naturalWidth,
            height: r.naturalHeight
          }
        });
      }
      Object(f.a)();
    },
    onError() {
      const e = this.props;
      const t = e.defaultSource;
      const n = e.onError;
      t && this.setState({
        loaded: !1
      }),
      n && n({
        detail: {
          errMsg: 'unknown error'
        }
      });
    },
    onImageLazyLoad() {
      this.state.lazyLoaded || this.setState({
        lazyLoaded: !0
      });
    },
    onTap() {
      const e = this.props.onTap;
      Object(m.c)(this, !1, !!e, !1),
      e && e.apply(void 0, arguments);
    },
    catchTap() {
      const e = this.props.catchTap;
      Object(m.c)(this, !1, !!e, !0),
      e && e.apply(void 0, arguments);
    },
    render() {
      let e;
      const t = this.props;
      const n = t.className;
      const i = t.id;
      const a = t.mode;
      const c = t.alt;
      const u = t.$appx;
      const d = t.catchTap;
      const h = t.onLongTap;
      const f = t.onTouchStart;
      const m = t.onTouchMove;
      const b = t.onTouchCancel;
      const y = t.onTouchEnd;
      const _ = t.lazyLoad;
      const w = this.props;
      let C = w.src;
      let x = w.defaultSource;
      let T = w.style;
      const S = this.state;
      const E = S.lazyLoaded;
      const
        k = S.loaded;
      C = u.getNormalizedSrc(C),
      x = x && u.getNormalizedSrc(x);
      let O = {};
      _ && !E && (O = {
        onFirstAppear: this.onImageLazyLoad,
        appearOffset: 50
      });
      const P = C && E ? x && !k ? x : C : x;
      const N = P ? {
        backgroundImage: `url(${JSON.stringify(P)})`
      } : {};
      T = r()({}, N, T, p[a]);
      let I = null;
      a === 'widthFix' && (E ? (I = o.a.createElement('img', {
        src: C,
        style: g,
        onLoad: this.shouldOnLoad() ? this.onLoad : void 0,
        onError: this.shouldOnError() ? this.onError : void 0,
        'aria-hidden': 'true'
      }),
      Object(v.isFeatureAvailable)('c_image_widthFixV2_24_4') && (delete T.backgroundImage,
      delete T.backgroundSize)) : (T.height = '1px',
      T.visibility = 'hidden'));
      const A = {};
      c === '' ? A['aria-hidden'] = 'true' : typeof c === 'string' && (A['aria-label'] = c),
      A.role = 'img';
      const j = l()(((e = {})[n] = !0,
      e['a-image-lazy-load'] = _ && !E,
      e));
      return u.getTrackerConfig(O),
      o.a.createElement(s.a, r()({
        className: j,
        id: i,
        $appx: u,
        style: T,
        onTap: this.onTap,
        catchTap: d ? this.catchTap : void 0,
        onLongTap: h,
        onTouchStart: f,
        onTouchMove: m,
        onTouchCancel: b,
        onTouchEnd: y
      }, O, {
        presetDOMProps: A
      }), I);
    }
  }));
},
function (e, t, n) {
  n.r(t);
  const i = n(93);
  const r = n(87);
  const a = Object(r.c)({
    pure: !1,
    name: 'view'
  })(i.a);
  n(61),
  t.default = a;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(16);
  const c = n(111);
  const l = n(110);
  const u = n(1);
  const p = n(11);
  const d = n(5);
  const h = n.n(d);
  const f = n(91);
  const m = n(6);
  const v = n(75);
  const g = n(29);
  const b = n(8);
  const y = n(2);
  const _ = function (e) {
    const t = {
      error: -1,
      errorMessage: 'Unknown'
    };
    if (e.content && typeof e.content === 'string') {
      try {
        const n = JSON.parse(e.content);
        void 0 !== n.errorCode && (t.error = n.errorCode,
        t.errorMessage = n.errorMessage);
      } catch (e) {
      }
    }
    return void 0 !== e.error && (t.error = e.error,
    t.errorMessage = e.errorMessage),
    t;
  };
  const w = n(20);
  const C = n(4);
  const x = n(74);

  function T() {
  }

  let S = !1;
  const E = 1;
  const k = 2;
  const O = 3;
  const P = [Object(s.f)(), Object(s.d)(), Object(s.b)(), v.a, l.a];
  x.a && P.push(x.a);
  const N = Object(u.c)({
    name: 'button'
  })(h()({
    displayName: 'Button',
    mixins: P,
    getDefaultProps() {
      return {
        hoverStartTime: 20,
        hoverStayTime: 70,
        hoverClass: 'a-button-active'
      };
    },
    getInitialState() {
      return this.pluginId = this.props.__owner && this.props.__owner.getPluginId(),
      {};
    },
    statics: {
      contextType: g.a
    },
    componentDidMount() {
      this.buttonTapEvent = Object(b.a)(this.root, {
        tap: this.onButtonTap
      });
    },
    componentWillUnmount() {
      this.buttonTapEvent && (this.buttonTapEvent = this.buttonTapEvent.remove());
    },
    getFinalOptions(e) {
      return this.pluginId && (e.__appxDomain = this.pluginId),
      e;
    },
    addFollow() {
      const e = this.props;
      const t = e.publicId;
      const n = e.onFollowLifestyle;
      Object(p.a)('addFollow', this.getFinalOptions({
        publicId: t,
        sourceId: 'tinyApp'
      }), ((e) => {
        const t = e.success === 'true';
        n && n({
          detail: {
            followStatus: t ? E : O
          }
        }),
        Object(m.a)('toast', {
          content: t ? '关注成功' : '关注失败'
        });
      }
      ));
    },
    onButtonTap() {
      const e = this;
      const t = this.props;
      const n = t.formType;
      const i = t.openType;
      const r = t.appParameter;
      const a = t.$appx;
      const o = t.shareTextMsg;
      const s = t.onShareTextMsg;
      const c = t.emotionImageUrl;
      const l = t.emotionMediaId;
      const d = t.emotionAuthMediaId;
      const h = t.onSendEmotion;
      const v = t.shareTarget;
      const g = t.onTap;
      const b = t.disabled;
      const x = t.catchTap;
      if (!Object(C.isFeatureAvailableWithDefault)('c_button_fix_disabled_24_13', !1) || !b) {
        const E = this.context.form;
        if (Object(w.c)(this, !1, !!(n || i || g || x), !!x),
        E && (n === 'submit' ? E.submit(this.props.$appx.getDataset()) : n === 'reset' && E.reset()),
        i === 'share') {
          if (S) return;
          S = !0;
          const k = Object(u.e)();
          k && k.publicInstance.onShareAppMessage && (Object(C.isFeatureAvailable)('c_button_share-target_24_0') && v && v !== 'weibo' && k.consoleToWorker('warn', 'waring: share-target is invalid, please check it, It only can be "Weibo"'),
          k.callRemotePage('startShare', a.getNormalizedEvent('share', {
            detail: {
              shareTarget: v
            }
          }), (() => {
            S = !1;
          }
          )));
        }
        if (i === 'getAuthorize') {
          const O = this.props;
          const P = O.onGetAuthorize;
          const N = O.onError;
          const I = O.scope;
          if (I && typeof I === 'string') {
            const A = I.replace(/ /g, '')
              .split(',');
            Object(p.a)('getComponentAuth', this.getFinalOptions({
              scopeNicks: A
            }), ((e) => {
              e.error ? N && N({
                detail: {
                  errorMessage: e.errorMessage || e.errorDesc,
                  type: 'getAuthorize'
                }
              }) : P && P();
            }
            ));
          } else {
            N && N({
              detail: {
                errorMessage: '请输入合法的scope',
                type: 'getAuthorize'
              }
            });
          }
        }
        if (i === 'launchApp' && Object(p.a)('launchApp', this.getFinalOptions({
          resultData: r
        }), ((t) => {
          const n = e.props.onError;
          t.error && n && n({
            detail: {
              errorMessage: t.errorMessage,
              type: 'launchApp'
            }
          });
        }
        )),
        i === 'contactShare') {
          if (S) return;
          S = !0;
          const j = Object(u.e)();
          j && j.publicInstance.onShareAppMessage && j.callRemotePage('shareToAlipayContact', a.getNormalizedEvent('share'), (() => {
            S = !1;
          }
          ));
        }
        if (i === 'lifestyle') {
          const R = this.props;
          const D = R.onFollowLifestyle;
          const M = void 0 === D ? T : D;
          const L = R.publicId;
          new Promise((((t, n) => {
            Object(p.a)('getLifestyleInfo', e.getFinalOptions({
              publicId: L
            }), ((e) => {
              'error' in e ? n(e) : t(e);
            }
            ));
          })
          )).then(((t) => {
            void 0 === t && (t = {}),
            t.isFollowed ? (Object(m.a)('toast', {
              content: '已关注'
            }),
            M({
              detail: {
                followStatus: t.isFollowed
              }
            })) : e.confirmAddFollow();
          }
          ))
            .catch((() => {
              e.confirmAddFollow();
            }
            ));
        }
        if (y.o) {
          if (i === 'shareTextMsg') {
            const F = Object(u.g)().appId;
            Object(m.a)('ddExec', {
              serviceName: 'internal.chat',
              actionName: 'selectAndSendText',
              args: {
                content: o,
                atList: [],
                bizType: `E-App-${F}`
              }
            }, ((e) => {
              const t = {};
              if (!0 === e.success) {
                t.shareResult = !0;
              } else {
                t.shareResult = !1;
                const n = _(e);
                t.error = n.error,
                t.errorMessage = n.errorMessage;
              }
              s && s({
                detail: t
              });
            }
            ));
          } else {
            i === 'sendEmotion' && Object(m.a)('ddExec', {
              serviceName: 'biz.chat',
              actionName: 'sendEmotion',
              args: {
                imageUrl: c,
                mediaId: l,
                authMediaId: d
              }
            }, ((e) => {
              const t = {};
              if (!0 === e.success) {
                t.success = !0;
              } else {
                const n = _(e);
                t.error = n.error,
                t.errorMessage = n.errorMessage;
              }
              h && h(t);
            }
            ));
          }
        }
        Object(f.b)(this),
        this.logTestId();
      }
    },
    confirmAddFollow() {
      const e = this;
      const t = this.props.onFollowLifestyle;
      const n = void 0 === t ? T : t;
      Object(m.a)('confirm', {
        title: '提示',
        message: '确认关注此生活号?',
        okButton: '关注生活号',
        cancelButton: '暂不关注'
      }, ((t) => {
        !0 === t.ok ? e.addFollow() : n({
          detail: {
            followStatus: k
          }
        });
      }
      ));
    },
    isBindOnTap() {
      const e = this.props;
      const t = e.formType;
      const n = e.openType;
      return this.context.form && t === 'submit' || ['share', 'getAuthorize', 'launchApp', 'contactShare', 'lifestyle'].indexOf(n) !== -1;
    },
    saveRoot(e) {
      this.hoverRoot = this.root = e;
    },
    render() {
      const e = this.props;
      let t = e.type;
      e.plain && (t = 'ghost');
      const n = this.getTestProps();
      return e.$appx.getDOMProps(n),
      e.$appx.getTrackerConfig(n),
      o.a.createElement(c.a, r()({
        id: e.id,
        size: e.size,
        className: e.className,
        style: e.style,
        type: t,
        disabled: e.disabled,
        loading: e.loading
      }, n, {
        deepRef: this.saveRoot,
        onClick: T,
        onTouchStart: this.onHoverTouchStart,
        onTouchEnd: this.onHoverTouchEnd,
        onTouchCancel: this.onHoverTouchCancel
      }), e.children);
    }
  }));
  t.default = N;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(1);

  function o(e) {
    return e < 10 ? `0${e}` : e.toString();
  }

  const s = n(5);
  const c = n.n(s);
  const l = n(2);
  const u = n(8);
  const p = n(28);
  const d = Object(a.c)({
    name: 'audio'
  })(c()({
    displayName: 'Audio',
    mixins: [p.a],
    getDefaultProps() {
      return {
        loop: !1,
        controls: !0,
        name: '未知音频',
        author: '未知作者'
      };
    },
    getInitialState() {
      return {
        progress: 0,
        src: this.props.src,
        playing: !1
      };
    },
    componentDidMount() {
      l.r && (this.documentEvents = Object(u.a)(document, {
        touchstart: this.loadFn
      }));
    },
    componentDidUpdate() {
      this.props.src !== this.state.src && (this.setState({
        src: this.props.src,
        progress: 0
      }),
      this.pause());
    },
    componentWillUnmount() {
      this.removeDocumentEvents();
    },
    removeDocumentEvents() {
      this.documentEvents && (this.documentEvents.remove(),
      this.documentEvents = null);
    },
    loadFn() {
      const e = this.refs.root;
      e.src = this.state.src,
      e.play(),
      e.pause(),
      this.removeDocumentEvents();
    },
    onError(e) {
      let t;
      if (e.target.error && e.target.error.code) {
        t = ['', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'][e.target.error.code];
      }
      if (this.props.onError && t) {
        const n = {
          detail: {
            errMsg: t
          }
        };
        this.props.onError(n);
      }
    },
    play() {
      const e = this.props.onPlay;
      this.refs.root.play(),
      e && e(),
      this.setState({
        playing: !0
      });
    },
    pause() {
      const e = this.props.onPause;
      this.refs.root.pause(),
      e && e(),
      this.setState({
        playing: !1
      });
    },
    seek(e) {
      this.refs.root.currentTime = e || 0,
      this.setState({
        progress: e
      });
    },
    timeUpdate(e) {
      const t = e.target.currentTime;
      if (this.setState({
        progress: t
      }),
      this.props.onTimeUpdate) {
        const n = {
          detail: {
            currentTime: t,
            duration: e.target.duration
          }
        };
        this.props.onTimeUpdate(n);
      }
    },
    ended() {
      this.props.onEnded && this.props.onEnded();
    },
    playpausetap() {
      this.state.playing ? this.pause() : this.play();
    },
    setSrc(e) {
      this.pause(),
      this.setState({
        src: e,
        progress: 0
      });
    },
    render() {
      const e = this.props;
      const t = e.className;
      const n = e.style;
      const i = e.id;
      if (!this.checkPermission('audio')) {
        return this.getPermissionJSX({
          className: t,
          style: n,
          id: i
        });
      }
      let a;
      let s;
      const
        c = {};
      return e.poster && (c.background = `url(${e.poster}) 100%/100% no-repeat`),
      r.a.createElement('div', {
        id: i,
        className: t,
        style: n
      }, e.controls && r.a.createElement('div', {
        className: 'a-audio-container',
        style: n
      }, r.a.createElement('div', {
        className: 'a-audio-poster',
        style: c,
        onClick: this.playpausetap
      }, r.a.createElement('img', {
        src: this.state.playing ? 'https://zos.alipayobjects.com/rmsportal/ZnENqDjdATSxszOcALjL.png' : 'https://zos.alipayobjects.com/rmsportal/GEWVXOYPgcWRvxjPWjYc.png',
        width: '24'
      })), r.a.createElement('div', {
        className: 'a-audio-info'
      }, r.a.createElement('p', {
        className: 'a-audio-info-name',
        'aria-label': 'Audio Name'
      }, e.name), r.a.createElement('p', {
        className: 'a-audio-info-author',
        'aria-label': 'Audio Author'
      }, e.author)), r.a.createElement('div', {
        className: 'a-audio-timer',
        role: 'timer'
      }, (a = this.state.progress,
      s = '',
      s = o(Math.round(a) % 60),
      (a = Math.floor(a / 60)) <= 0 ? `00:${s}` : (s = `${o(a % 60)}:${s}`,
      (a = Math.floor(a / 60)) <= 0 ? s : `${o(a % 24)}:${s}`)))), r.a.createElement('audio', {
        className: 'a-audio-tag',
        ref: 'root',
        src: this.state.src,
        loop: e.loop,
        onError: this.onError,
        onPlay: this.onPlay,
        onPause: this.pause,
        onEnded: this.ended,
        onTimeUpdate: this.timeUpdate
      }));
    }
  }));
  t.default = d;
},
function (e, t, n) {
  n.r(t);
  const i = n(0);
  const r = n.n(i);
  const a = n(38);
  const o = n(29);
  const s = n(1);
  const c = n(5);
  const l = n.n(c);
  const u = n(6);
  const p = n(2);

  function d(e, t) {
    const n = e.showList;
    const i = e.index;
    const r = t.onChange;
    const a = n.map(((e, t) => ({
      key: e,
      value: t
    })
    ));
    const o = a[i] ? a[i].key : null;
    Object(u.a)('ddExec', {
      serviceName: 'biz.util',
      actionName: 'chosen',
      args: {
        source: a,
        selectedKey: o
      }
    }, ((e) => {
      if (!0 === e.success && r) {
        const t = e.content;
        const n = JSON.parse(t);
        r({
          detail: {
            value: n.value
          }
        });
      }
    }
    ));
  }

  function h(e, t) {
    const n = e.mode;
    const i = e.start;
    const r = e.end;
    const a = e.fields;
    const o = t.onChange;
    let s = 'yyyy-MM-dd HH:mm';
    n === 'time' ? s = 'HH:mm' : n === 'date' && a == 3 && (s = 'yyyy-MM');
    let c = 'datepicker';
    s === 'yyyy-MM-dd' ? c = 'datepicker' : s === 'HH:mm' ? c = 'timepicker' : s === 'yyyy-MM-dd HH:mm' ? c = 'datetimepicker' : s === 'yyyy-MM' && (c = 'monthPicker'),
    Object(u.a)('ddExec', {
      serviceName: 'biz.util',
      actionName: c,
      args: {
        value: this.state.value,
        format: s,
        startDate: i,
        endDate: r
      }
    }, ((e) => {
      if (!0 === e.success && o) {
        const t = e.content;
        const n = JSON.parse(t);
        o({
          detail: {
            value: n.value
          }
        });
      }
    }
    ));
  }

  function f(e) {
    const t = e;
    const n = t && t.match(/:/g);
    return n && n.length === 2 ? t.slice(0, t.lastIndexOf(':')) : t;
  }

  const m = Object(s.c)({
    pure: !1,
    name: 'picker'
  })(l()({
    displayName: 'Picker',
    mixins: [o.b],
    getDefaultProps() {
      return {
        mode: 'selector',
        fields: 'day',
        disabled: !1
      };
    },
    componentDidMount() {
      this.onPickerTap = Object(a.a)(this.onPickerTap, 500, {
        trailing: !1
      }),
      this.onDateTap = Object(a.a)(this.onDateTap, 500, {
        trailing: !1
      });
    },
    onPickerTap() {
      const e = this.props;
      const t = e.title;
      const n = e.range;
      const i = void 0 === n ? [] : n;
      const r = e.rangeKey;
      const a = e.onChange;
      let o = i;
      r && typeof i[0] === 'object' && (o = i.map(((e) => e[r]
      )));
      let s = parseInt(this.state.value, 10) || 0;
      s = s < 0 ? 0 : s,
      p.o ? d.call(this, {
        index: s,
        showList: o
      }, {
        onChange: a
      }) : Object(u.a)('beehiveOptionsPicker', {
        title: t,
        optionsOne: o,
        selectedOneIndex: s
      }, ((e) => {
        typeof e.selectedOneIndex === 'number' && a && a({
          detail: {
            value: e.selectedOneIndex
          }
        });
      }
      ));
    },
    onDateTap() {
      let e;
      let t;
      const n = this.props;
      const i = n.start;
      const r = n.end;
      const a = n.onChange;
      const o = n.mode;
      const s = n.fields;
      let
        c = 1;
      if (o === 'time') {
        c = 0;
      } else if (o === 'date') {
        c = {
          day: 1,
          month: 3,
          year: 4
        }[s];
      }
      p.o ? h.call(this, {
        mode: o,
        start: i,
        end: r,
        fields: s
      }, {
        onChange: a
      }) : Object(u.a)('datePicker', {
        beginDate: (e = this.state.value,
        t = e && e.match(/:/g),
        t && t.length === 1 ? `${e}:00` : e),
        minDate: i,
        maxDate: r,
        mode: c
      }, ((e) => {
        e.date && a && a({
          detail: {
            value: f(e.date)
          }
        });
      }
      ));
    },
    render() {
      const e = this.props;
      const t = e.children;
      const n = e.disabled;
      const i = e.mode;
      if (!r.a.isValidElement(t)) throw new Error('Picker\'s child must be an element: <view>');
      return n ? t : r.a.cloneElement(t, {
        onTap: i === 'selector' ? this.onPickerTap : this.onDateTap
      });
    }
  }));
  t.default = m;
},
function (e, t, n) {
  n.r(t);
  const i = n(3);
  const r = n.n(i);
  const a = n(0);
  const o = n.n(a);
  const s = n(61);
  const c = n(1);
  const l = n(5);
  const u = n.n(l);
  const p = n(79);
  const d = Object(c.c)({
    pure: !1,
    name: 'navigator'
  })(u()({
    statics: {
      contextType: p.a
    },
    displayName: 'Navigator',
    getInitialState() {
      return this.a11yComponentEnable = c.h.getSwitch('a11yComponentEnable', !1),
      this.pluginId = this.context && this.context.parent && this.context.parent.getPluginId && this.context.parent.getPluginId(),
      {};
    },
    navigate(e, t) {
      this.pluginId ? Object(c.e)()
        .callRemotePlugin(e, r()({}, t, {
          __pluginId: this.pluginId
        })) : Object(c.e)()
        .callRemoteBridge(e, t);
    },
    go() {
      const e = this.props;
      const t = e.openType;
      const n = e.url;
      const i = e.delta;
      const a = e.target;
      const o = e.appId;
      const s = e.$appx.bridge;
      if (a === 'miniProgram' && o) {
        s.call('navigateToMiniProgram', (function (e, t) {
          const n = {
            appId: e
          };
          const i = {};
          t.path && (i.page = t.path),
          t.extraData && (n.extraData = t.extraData),
          i.referrerInfo = JSON.stringify(n);
          const a = r()({
            appId: t.appId
          }, t, {
            param: i
          });
          return t.envVersion && ['develop', 'trial', 'release', 'examine'].indexOf(t.envVersion) !== -1 && (a.envVersion = t.envVersion),
          a;
        }(o, this.props)));
      } else {
        let c = 'navigateTo';
        if (t === 'redirect') {
          c = 'redirectTo';
        } else if (t === 'switchTab') {
          c = 'switchTab';
        } else if (t === 'reLaunch') {
          c = 'reLaunch';
        } else {
          if (t === 'navigateBack') {
            return void this.navigate('navigateBack', {
              delta: i
            });
          }
          if (t === 'exit' && !this.pluginId) return void s.call('exitApp');
        }
        n && this.navigate(c, {
          url: n,
          delta: i
        });
      }
    },
    render() {
      const e = this.props.$appx;
      const t = this.a11yComponentEnable && e && e.getDOMProps({
        role: 'button'
      }) || {
        role: 'button'
      };
      return o.a.createElement(s.a, r()({}, this.props, {
        presetDOMProps: t,
        onTap: this.go
      }), this.props.children);
    }
  }));
  t.default = d;
},
function (e, t, n) {
  n.r(t);
  const i = n(58);
  const r = n(9);
  const a = n(3);
  const o = n.n(a);
  const s = n(0);
  const c = n.n(s);
  const l = n(5);
  const u = n.n(l);
  const p = n(1);
  const d = n(80);
  const h = n(40);
  const f = n(2);
  const m = self;
  const v = {
    navigateTo(e) {
      Object(p.e)()
        .callRemoteBridge('navigateTo', e);
    }
  };
  const g = n(4);
  const b = n(10);
  n.d(t, 'default', (() => _
  ));
  const y = {};

  function _(e) {
    for (let t = function (t, n) {
        const a = n[t];
        const s = b.g[a];
        const l = s.support;
        const _ = s.appId;
        const w = s.renderType;
        const C = s.discard;
        Object(g.isAvailable)(l) && Object.defineProperty(e, Object(i.a)(a), {
          enumerable: !0,
          get() {
            return y[a] ? y[a] : (y[a] = (function (e, t, n, a) {
              void 0 === n && (n = ''),
              void 0 === a && (a = !1);
              const s = Object(i.a)(e);
              return a ? Object(p.c)({
                name: e
              })(u()({
                displayName: s,
                render() {
                  return null;
                }
              })) : Object(p.c)({
                name: e
              })(u()({
                displayName: s,
                componentDidMount() {
                  const e = this;
                  this.cachedHandles = {};
                  let n = t;
                  const i = this.props;
                  if (this.isCommonExtra()) {
                    if (typeof i.appId !== 'string' || i.appId.indexOf('20') === 0) throw new Error(`${s} appId is required`);
                    n = i.appId,
                    Object(h.a)({
                      type: 'monitor',
                      bizType: 'TINYAPP',
                      seedId: 'APPX_CommonExtra',
                      param1: n
                    });
                  }
                  Object(d.a)(this.getRealDisplayName(), n, (() => {
                    e._componentLoaded = !0,
                    e.renderExtraComponent('mount');
                  }
                  ), this.props);
                },
                componentDidUpdate() {
                  this._componentLoaded && this.renderExtraComponent('update');
                },
                componentWillUnmount() {
                  this._unloaded = !0,
                  this.componentInstance && this.componentInstance.destroy && this.componentInstance.destroy();
                },
                getPortalRootNode() {
                  if (this.root) return this.root;
                  if (n === 'createPortal') {
                    const e = document.createElement('div');
                    this.root = e;
                    const t = this.props;
                    const i = t.id;
                    const r = t.style;
                    const a = t.className;
                    return e.className = a,
                    void 0 !== i && (e.id = i),
                    o()(e.style, r),
                    this.getExtraComponentContainer()
                      .appendChild(e),
                    this.root;
                  }
                },
                isCommonExtra() {
                  return s === 'CommonExtra';
                },
                getRealDisplayName() {
                  return this.isCommonExtra() ? `AppX${s}${this.props.appId}` : `AppX${s}`;
                },
                renderExtraComponent(e) {
                  const t = this.getRealDisplayName();
                  if (m[t] && !this._unloaded) {
                    const n = this.getNeedPassProps(m[t]);
                    e === 'mount' ? this.componentInstance = new m[t](this.getPortalRootNode(), n, v) : e === 'update' && this.componentInstance && this.componentInstance.update && this.componentInstance.update(n);
                  }
                },
                getCacheEventHandle(e) {
                  const t = this;
                  const n = this.cachedHandles;
                  return n[e] ? n[e] : (n[e] = function (n) {
                    t.props[e] && t.props[e]({
                      detail: n
                    });
                  }
                  ,
                  n[e]);
                },
                getNeedPassProps(e) {
                  let t;
                  const
                    n = {};
                  if (this.isCommonExtra()) {
                    t = {};
                    for (let i = 0, a = Object(r.default)(this.props || {}); i < a.length; i++) {
                      const o = a[i];
                      o !== 'appId' && (t[o] = !0);
                    }
                  } else {
                    typeof (t = e.canIUse || {}) === 'function' && (t = t({
                      compareSystemVersion: f.g
                    }) || {});
                  }
                  for (let s = 0, c = Object(r.default)(t); s < c.length; s++) {
                    const l = c[s];
                    void 0 !== this.props[l] && (l.indexOf('on') === 0 ? n[l] = this.getCacheEventHandle(l) : n[l] = this.props[l]);
                  }
                  return n;
                },
                getExtraComponentContainer() {
                  const e = document.createElement('div');
                  return e.setAttribute('snapshot-delete', 'true'),
                  document.body.appendChild(e),
                  e;
                },
                saveRoot(e) {
                  this.root = e;
                },
                render() {
                  const e = this.props;
                  const t = e.id;
                  const i = e.style;
                  const r = e.className;
                  return n === 'createPortal' ? null : c.a.createElement('div', {
                    className: r,
                    'snapshot-ignore': 'true',
                    ref: this.saveRoot,
                    id: t,
                    style: i
                  });
                }
              }));
            }(a, _, w, C)),
            y[a]);
          }
        });
      }, n = 0, a = Object(r.default)(b.g); n < a.length; n++) {
      t(n, a);
    }
  }
}
]));
const __appxEndTime = Date.now();
const __appxCosts = __appxEndTime - __appxStartTime;
AFAppX.bridge.__reportFrameworkPerf(__appxCosts, {
  start: __appxStartTime,
  end: __appxEndTime
});
