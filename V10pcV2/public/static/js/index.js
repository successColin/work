!(function (t, e) {
  typeof exports === 'object' && typeof module === 'object' ? module.exports = e() : typeof define === 'function' && define.amd ? define([], e) : typeof exports === 'object' ? exports.VueBaiduMap = e() : t.VueBaiduMap = e();
}(this, () => (function (t) {
    function e(i) {
      if (n[i]) return n[i].exports;
      const o = n[i] = {
        i,
        l: !1,
        exports: {}
      };
      return t[i].call(o.exports, o, o.exports, e), o.l = !0, o.exports;
    }

    var n = {};
    return e.m = t, e.c = n, e.i = function (t) {
      return t;
    }, e.d = function (t, n, i) {
      e.o(t, n) || Object.defineProperty(t, n, {
        configurable: !1,
        enumerable: !0,
        get: i
      });
    }, e.n = function (t) {
      const n = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };
      return e.d(n, 'a', n), n;
    }, e.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, e.p = '', e(e.s = 42);
  }([function (t, e) {
    t.exports = function (t, e, n, i) {
      let o;
        let a = t = t || {};
        const r = typeof t.default;
      r !== 'object' && r !== 'function' || (o = t, a = t.default);
      const s = typeof a === 'function' ? a.options : a;
      if (e && (s.render = e.render, s.staticRenderFns = e.staticRenderFns), n && (s._scopeId = n), i) {
        const l = s.computed || (s.computed = {});
        Object.keys(i)
          .forEach((t) => {
            const e = i[t];
            l[t] = function () {
              return e;
            };
          });
      }
      return {
        esModule: o,
        exports: a,
        options: s
      };
    };
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (n, r) {
      o = [t, e], i = r, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e) => {
      function n(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }

      function i() {
        const t = this.unload;
          const e = this.renderByParent;
          const n = this.$parent;
        e && n.reload(), t();
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const o = {
          control: { unload: 'removeControl' },
          layer: { unload: 'removeTileLayer' },
          overlay: { unload: 'removeOverlay' },
          contextMenu: { unload: 'removeContextMenu' }
        };
        const a = function t(e) {
          return e.abstract || e.$el === e.$children[0].$el ? t(e.$parent) : e;
        };
        const r = function t(e) {
          n(this, t), this.methods = {
            ready () {
              const t = a(this.$parent);
                const e = this.BMap = t.BMap;
                const n = this.map = t.map;
              this.load(), this.$emit('ready', {
                BMap: e,
                map: n
              });
            },
            transmitEvent (t) {
              this.$emit(t.type.replace(/^on/, ''), t);
            },
            reload () {
              const t = this;
              this && this.BMap && this.$nextTick(() => {
                t.unload(), t.$nextTick(t.load);
              });
            },
            unload () {
              const t = this.map;
                const n = this.originInstance;
              try {
                switch (e.type) {
                  case 'search':
                    return n.clearResults();
                  case 'autoComplete':
                  case 'lushu':
                    return n.dispose();
                  case 'markerClusterer':
                    return n.clearMarkers();
                  default:
                    t[o[e.type].unload](n);
                }
              } catch (t) {
              }
            }
          }, this.computed = {
            renderByParent () {
              return this.$parent.preventChildrenRender;
            }
          }, this.mounted = function () {
            const t = a(this.$parent);
              const e = t.map;
              const n = this.ready;
            e ? n() : t.$on('ready', n);
          }, this.destroyed = i, this.beforeDestroy = i;
        };
      e.default = function (t) {
        return new r({ type: t });
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (n, r) {
      o = [e], i = r, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t) => {
      function e(t) {
        const e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const n = e.lng;
          const i = e.lat;
        return new t.Point(n, i);
      }

      function n(t) {
        const e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const n = e.x;
          const i = e.y;
        return new t.Pixel(n, i);
      }

      function i(t) {
        const n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const i = n.sw;
          const o = n.ne;
        return new t.Bounds(e(t, i), e(t, o));
      }

      function o(t) {
        const e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const n = e.width;
          const i = e.height;
        return new t.Size(n, i);
      }

      function a(t) {
        const e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const n = e.url;
          const i = e.size;
          const a = e.opts;
          const r = void 0 === a ? {} : a;
        return new t.Icon(n, o(t, i), {
          anchor: r.anchor && o(t, r.anchor),
          imageSize: r.imageSize && o(t, r.imageSize),
          imageOffset: r.imageOffset && o(t, r.imageOffset),
          infoWindowAnchor: r.infoWindowAnchor && o(t, r.infoWindowAnchor),
          printImageUrl: r.printImageUrl
        });
      }

      function r(t) {
        const n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const i = n.content;
          const a = n.opts;
        return new t.Label(i, {
          offset: a.offset && o(t, a.offset),
          position: a.position && e(t, a.position),
          enableMassClear: a.enableMassClear
        });
      }

      Object.defineProperty(t, '__esModule', { value: !0 }), t.createPoint = e, t.createPixel = n, t.createBounds = i, t.createSize = o, t.createIcon = a, t.createLabel = r;
    }));
  }, function (t, e) {
    let n;
    n = (function () {
      return this;
    }());
    try {
      n = n || Function('return this')() || (0, eval)('this');
    } catch (t) {
      typeof window === 'object' && (n = window);
    }
    t.exports = n;
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(41)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n) => {
      Object.defineProperty(e, '__esModule', { value: !0 }), e.default = function (t, e) {
        const n = this;
          const o = e || i.default[this.$options.name];
        o && o.forEach((e) => {
          const i = e.slice(0, 2) === 'on';
            const o = i ? e.slice(2) : e;
            const a = n.$listeners[o];
          a && t.addEventListener(e, a.fns);
        });
      };
      var i = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(n));
      t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [e, n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e) => {
      Object.defineProperty(t, '__esModule', { value: !0 }), t.getPosition = t.checkType = t.isPoint = void 0;
      const n = t.isPoint = function (t) {
        return t.lng && t.lat;
      };
      t.checkType = function (t) {
        return Object.prototype.toString.call(t)
          .slice(8, -1);
      }, t.getPosition = function (t, i) {
        return n(i) ? (0, e.createPoint)(t, i) : i;
      };
    }));
  }, function (t, e, n) {
    const i = n(0)(n(71), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(43), n(89), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(44), n(87), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(45), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(46), n(94), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(47), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(48), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(49), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(50), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(51), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(52), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(53), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(54), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(55), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(56), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(57), n(90), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(58), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(59), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(60), n(97), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(61), n(82), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(62), n(95), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(63), n(86), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(64), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(65), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(66), n(83), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(67), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(68), n(96), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(69), n(84), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(70), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(72), null, null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(73), n(91), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(74), n(85), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(75), n(93), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(76), n(92), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    const i = n(0)(n(77), n(88), null, null);
    t.exports = i.exports;
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (n, r) {
      o = [t, e], i = r, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e) => {
      Object.defineProperty(e, '__esModule', { value: !0 }), e.default = {
        'bm-map': ['click', 'dblclick', 'rightclick', 'rightdblclick', 'maptypechange', 'mousemove', 'mouseover', 'mouseout', 'movestart', 'moving', 'moveend', 'zoomstart', 'zoomend', 'addoverlay', 'addcontrol', 'removecontrol', 'removeoverlay', 'clearoverlays', 'dragstart', 'dragging', 'dragend', 'addtilelayer', 'removetilelayer', 'load', 'resize', 'hotspotclick', 'hotspotover', 'hotspotout', 'tilesloaded', 'touchstart', 'touchmove', 'touchend', 'longpress'],
        'bm-geolocation': ['locationSuccess', 'locationError'],
        'bm-overview-map': ['viewchanged', 'viewchanging'],
        'bm-marker': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'infowindowclose', 'infowindowopen', 'dragstart', 'dragging', 'dragend', 'rightclick'],
        'bm-polyline': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'lineupdate'],
        'bm-polygon': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'lineupdate'],
        'bm-circle': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'lineupdate'],
        'bm-label': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'rightclick'],
        'bm-info-window': ['close', 'open', 'maximize', 'restore', 'clickclose'],
        'bm-ground': ['click', 'dblclick'],
        'bm-autocomplete': ['onconfirm', 'onhighlight'],
        'bm-point-collection': ['click', 'mouseover', 'mouseout']
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [e, n(24), n(25), n(17), n(14), n(13), n(15), n(12), n(11), n(9), n(16), n(10), n(32), n(34), n(35), n(6), n(28), n(29), n(31), n(30), n(33), n(8), n(7), n(38), n(39), n(40), n(37), n(36), n(22), n(23), n(27), n(26), n(21), n(20), n(19), n(18)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o, a, r, s, l, c, u, h, p, d, f, m, g, y, v, _, b, x, w, M, C, k, I, S, B, P, O, E, T, z, j, L) => {
      function R(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(t, '__esModule', { value: !0 }), t.BmlCurveLine = t.BmlHeatmap = t.BmlLushu = t.BmlMarkerClusterer = t.BmAutoComplete = t.BmBoundary = t.BmTraffic = t.BmTile = t.BmBus = t.BmDriving = t.BmWalking = t.BmTransit = t.BmLocalSearch = t.BmContextMenuItem = t.BmContextMenu = t.BmOverlay = t.BmInfoWindow = t.BmLabel = t.BmGround = t.BmCircle = t.BmPolygon = t.BmPolyline = t.BmPointCollection = t.BmMarker = t.BmControl = t.BmPanorama = t.BmCityList = t.BmCopyright = t.BmGeolocation = t.BmOverviewMap = t.BmMapType = t.BmNavigation = t.BmScale = t.BmView = t.BaiduMap = void 0;
      const A = R(e);
        const $ = R(n);
        const F = R(i);
        const W = R(o);
        const N = R(a);
        const D = R(r);
        const Z = R(s);
        const V = R(l);
        const H = R(c);
        const G = R(u);
        const U = R(h);
        const J = R(p);
        const K = R(d);
        const X = R(f);
        const q = R(m);
        const Q = R(g);
        const Y = R(y);
        const tt = R(v);
        const et = R(_);
        const nt = R(b);
        const it = R(x);
        const ot = R(w);
        const at = R(M);
        const rt = R(C);
        const st = R(k);
        const lt = R(I);
        const ct = R(S);
        const ut = R(B);
        const ht = R(P);
        const pt = R(O);
        const dt = R(E);
        const ft = R(T);
        const mt = R(z);
        const gt = R(j);
        const yt = R(L);
      t.default = {
        install (t, e) {
          const n = e.ak;
          t.prototype._BMap = function () {
            return { ak: n };
          }, t.component('baidu-map', A.default), t.component('bm-view', $.default), t.component('bm-scale', F.default), t.component('bm-navigation', W.default), t.component('bm-map-type', N.default), t.component('bm-overview-map', D.default), t.component('bm-geolocation', Z.default), t.component('bm-copyright', V.default), t.component('bm-city-list', H.default), t.component('bm-panorama', G.default), t.component('bm-control', U.default), t.component('bm-marker', J.default), t.component('bm-point-collection', K.default), t.component('bm-polyline', X.default), t.component('bm-polygon', q.default), t.component('bm-circle', Q.default), t.component('bm-ground', Y.default), t.component('bm-label', tt.default), t.component('bm-info-window', et.default), t.component('bm-overlay', nt.default), t.component('bm-context-menu', it.default), t.component('bm-context-menu-item', ot.default), t.component('bm-local-search', at.default), t.component('bm-transit', rt.default), t.component('bm-walking', st.default), t.component('bm-driving', lt.default), t.component('bm-bus', ct.default), t.component('bm-tile', ut.default), t.component('bm-traffic', ht.default), t.component('bm-auto-complete', dt.default), t.component('bm-boundary', pt.default);
        }
      }, t.BaiduMap = A.default, t.BmView = $.default, t.BmScale = F.default, t.BmNavigation = W.default, t.BmMapType = N.default, t.BmOverviewMap = D.default, t.BmGeolocation = Z.default, t.BmCopyright = V.default, t.BmCityList = H.default, t.BmPanorama = G.default, t.BmControl = U.default, t.BmMarker = J.default, t.BmPointCollection = K.default, t.BmPolyline = X.default, t.BmPolygon = q.default, t.BmCircle = Q.default, t.BmGround = Y.default, t.BmLabel = tt.default, t.BmInfoWindow = et.default, t.BmOverlay = nt.default, t.BmContextMenu = it.default, t.BmContextMenuItem = ot.default, t.BmLocalSearch = at.default, t.BmTransit = rt.default, t.BmWalking = st.default, t.BmDriving = lt.default, t.BmBus = ct.default, t.BmTile = ut.default, t.BmTraffic = ht.default, t.BmBoundary = pt.default, t.BmAutoComplete = dt.default, t.BmlMarkerClusterer = ft.default, t.BmlLushu = mt.default, t.BmlHeatmap = gt.default, t.BmlCurveLine = yt.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (n, r) {
      o = [t, e], i = r, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e) => {
      Object.defineProperty(e, '__esModule', { value: !0 }), e.default = {
        name: 'bm-context-menu-item',
        props: {
          callback: {
            type: Function,
            default () {
            }
          },
          text: { type: String },
          iconUrl: { type: String },
          id: { type: String },
          disabled: { type: Boolean },
          seperator: { type: Boolean }
        },
        methods: {
          reload () {
            this.$parent.map && this.$parent.load();
          }
        },
        watch: {
          text () {
            this.reload();
          },
          iconUrl () {
            this.reload();
          },
          id () {
            this.reload();
          },
          disabled () {
            this.reload();
          },
          iseperator () {
            this.reload();
          },
          callback () {
            this.reload();
          }
        },
        destroyed () {
          this.reload();
        },
        mounted () {
          this.reload();
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n) => {
      Object.defineProperty(e, '__esModule', { value: !0 });
      const i = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(n));
      e.default = {
        name: 'bm-context-menu',
        props: { width: { type: Number } },
        mixins: [(0, i.default)('contextMenu')],
        methods: {
          load () {
            const t = this.width;
              const e = this.BMap;
              const n = this.map;
              const i = this.$parent;
              const o = this.parent = i.originInstance || n;
            this.originInstance && o.removeContextMenu(this.originInstance);
            const a = this.originInstance = new e.ContextMenu();
              let r = !0;
              let s = !1;
              let l = void 0;
            try {
              for (var c, u = this.$children[Symbol.iterator](); !(r = (c = u.next()).done); r = !0) {
                (function () {
                  const i = c.value;
                  if (i.seperator) return a.addSeparator(), 'continue';
                  const r = new e.MenuItem(i.text, ((t, a) => {
                    i.callback({
                      point: t,
                      pixel: a,
                      BMap: e,
                      map: n,
                      target: o
                    });
                  }), {
                    width: t,
                    id: i.id,
                    iconUrl: i.iconUrl
                  });
                  i.disabled ? r.disable() : r.enable(), i.originInstance = r, a.addItem(r);
                }());
              }
            } catch (t) {
              s = !0, l = t;
            } finally {
              try {
                !r && u.return && u.return();
              } finally {
                if (s) throw l;
              }
            }
            o.addContextMenu(a);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-city-list',
          render () {
          },
          mixins: [(0, a.default)('control')],
          props: {
            anchor: { type: String },
            offset: { type: Object }
          },
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const a = this.offset;
                const r = this;
              this.originInstance = new t.CityListControl({
                anchor: i[n],
                offset: a && (0, o.createSize)(t, a),
                onChangeBefore () {
                  r.$emit('changeBefore');
                },
                onChangeAfter () {
                  r.$emit('changeAfter');
                }
              }), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-control',
          mixins: [(0, a.default)('control')],
          props: ['anchor', 'offset'],
          watch: {
            anchor (t) {
              this.originInstance.setAnchor(t);
            },
            offset (t) {
              this.originInstance.setOffset(t);
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const a = this.offset;
                const r = this.$el;
                const s = function () {
                  this.defaultAnchor = i[n || 'BMAP_ANCHOR_TOP_LEFT'], this.defaultOffset = (0, o.createSize)(t, a);
                };
              s.prototype = new t.Control(), s.prototype.initialize = function (t) {
                return t.getContainer()
                  .appendChild(r);
              }, this.originInstance = new s(n, a), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-copyright',
          render () {
          },
          mixins: [(0, a.default)('control')],
          props: ['anchor', 'offset', 'copyright'],
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            },
            copyright () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.offset;
                const a = this.anchor;
                const r = this.updateCopyrightList;
              this.originInstance = new t.CopyrightControl({
                anchor: i[a],
                offset: n && (0, o.createSize)(t, n)
              }), r(), e.addControl(this.originInstance);
            },
            updateCopyrightList () {
              const t = this;
                const e = this.BMap;
                const n = this.map;
                const i = this.originInstance;
                const o = i.removeCopyright;
                const a = i.getCopyrightCollection;
                const r = a();
              r && r.forEach((t) => {
                o(t.id);
              }), this.copyright && this.copyright.forEach((i) => {
                const o = i.bounds ? new e.Bounds(new e.Point(i.bounds.sw.lng, i.bounds.sw.lat), new e.Point(i.bounds.ne.lng, i.bounds.ne.lat)) : n.getBounds();
                t.originInstance.addCopyright({
                  id: i.id,
                  content: i.content,
                  bounds: o
                }), t.originInstance.getCopyrightCollection();
              });
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }

        Object.defineProperty(e, '__esModule', { value: !0 });
        const s = r(n);
          const l = r(o);
        e.default = {
          name: 'bm-geolocation',
          render () {
          },
          mixins: [(0, s.default)('control')],
          props: {
            anchor: { type: String },
            offset: { type: Object },
            showAddressBar: { type: Boolean },
            autoLocation: { type: Boolean },
            locationIcon: { type: Object }
          },
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            },
            showAddressBar () {
              this.reload();
            },
            autoLocation () {
              this.reload();
            },
            locationIcon () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const o = this.showAddressBar;
                const r = this.autoLocation;
                const s = this.locationIcon;
                const c = this.offset;
              this.originInstance = new t.GeolocationControl({
                anchor: i[n],
                showAddressBar: o,
                enableAutoLocation: r,
                offset: c && (0, a.createSize)(t, c),
                locationIcon: s && (0, a.createIcon)(t, s)
              }), l.default.call(this, this.originInstance), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-map-type',
          render () {
          },
          mixins: [(0, a.default)('control')],
          props: ['type', 'mapTypes', 'anchor', 'offset'],
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            },
            type () {
              this.reload();
            },
            mapTypes () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const a = this.offset;
                const r = this.type;
                const s = [];
              this.mapTypes && this.mapTypes.forEach((t) => s.push(i[t])), this.originInstance = new t.MapTypeControl({
                anchor: i[n],
                offset: a && (0, o.createSize)(t, a),
                type: i[r],
                mapTypes: s
              }), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-navigation',
          render () {
          },
          mixins: [(0, a.default)('control')],
          props: {
            anchor: { type: String },
            offset: { type: Object },
            type: { type: String },
            showZoomInfo: { type: Boolean },
            enableGeolocation: {
              type: Boolean,
              default: !1
            }
          },
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            },
            type () {
              this.reload();
            },
            showZoomInfo () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const a = this.offset;
                const r = this.type;
                const s = this.showZoomInfo;
                const l = this.enableGeolocation;
              this.originInstance = new t.NavigationControl({
                anchor: i[n],
                offset: a && (0, o.createSize)(t, a),
                type: i[r],
                showZoomInfo: s,
                enableGeolocation: l
              }), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(2), n(1), n(4)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }

        Object.defineProperty(e, '__esModule', { value: !0 });
        const s = r(o);
          const l = r(a);
        e.default = {
          name: 'bm-overview-map',
          mixins: [(0, s.default)('control')],
          render () {
          },
          props: {
            anchor: { type: String },
            offset: { type: Object },
            size: { type: Object },
            isOpen: { type: Boolean }
          },
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            },
            size () {
              this.reload();
            },
            isOpen () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const o = this.isOpen;
                const a = this.size;
                const r = this.offset;
                const s = this.anchor;
                const c = [];
              this.mapTypes && this.mapTypes.forEach((t) => {
                c.push(i[t]);
              }), this.originInstance = new t.OverviewMapControl({
                anchor: i[s],
                offset: (0, n.createSize)(t, r),
                size: (0, n.createSize)(t, a),
                isOpen: o
              }), l.default.call(this, this.originInstance), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-panorama',
          mixins: [(0, a.default)('control')],
          render () {
          },
          props: ['anchor', 'offset'],
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const a = this.offset;
              this.originInstance = new t.PanoramaControl({
                anchor: i[n],
                offset: a && (0, o.createSize)(t, a)
              }), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-scale',
          render () {
          },
          mixins: [(0, a.default)('control')],
          props: {
            anchor: { type: String },
            offset: { type: Object }
          },
          watch: {
            anchor () {
              this.reload();
            },
            offset () {
              this.reload();
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.anchor;
                const a = this.offset;
              this.originInstance = new t.ScaleControl({
                anchor: i[n],
                offset: a && (0, o.createSize)(t, a)
              }), e.addControl(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(78), n(1), n(4), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o, a) => {
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const s = r(n);
        const l = r(i);
        const c = r(o);
        const u = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'lineupdate'];
      e.default = {
        name: 'bml-curve-line',
        render () {
        },
        mixins: [(0, l.default)('overlay')],
        props: {
          points: {
            type: Array,
            default: Array
          },
          strokeColor: { type: String },
          strokeWeight: { type: Number },
          strokeOpacity: { type: Number },
          strokeStyle: { type: String },
          massClear: {
            type: Boolean,
            default: !0
          },
          clicking: {
            type: Boolean,
            default: !0
          },
          editing: {
            type: Boolean,
            default: !1
          }
        },
        watch: {
          points: {
            handler (t, e) {
              this.originInstance.disableEditing(), this.reload();
            },
            deep: !0
          },
          strokeColor (t) {
            this.originInstance.setStrokeColor(t);
          },
          strokeOpacity (t) {
            this.originInstance.setStrokeOpacity(t);
          },
          strokeWeight (t) {
            this.originInstance.setStrokeWeight(t);
          },
          strokeStyle (t) {
            this.originInstance.setStrokeStyle(t);
          },
          editing (t) {
            t ? this.originInstance.enableEditing() : this.originInstance.disableEditing();
          },
          massClear (t) {
            t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();
          },
          clicking (t) {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.points;
              const i = this.strokeColor;
              const o = this.strokeWeight;
              const r = this.strokeOpacity;
              const l = this.strokeStyle;
              const h = this.editing;
              const p = this.massClear;
              const d = this.clicking;
              const f = new s.default(n.map((e) => (0, a.createPoint)(t, e)), {
                strokeColor: i,
                strokeWeight: o,
                strokeOpacity: r,
                strokeStyle: l,
                enableMassClear: p,
                enableClicking: d
              });
            h ? f.enableEditing() : f.disableEditing(), this.originInstance = f, e.addOverlay(f), c.default.call(this, f, u);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(79)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i) => {
      function o(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const a = o(n);
        const r = o(i);
      e.default = {
        name: 'bml-heatmap',
        render () {
        },
        mixins: [(0, a.default)('overlay')],
        props: {
          data: {
            type: Array,
            default: Array
          },
          max: { type: Number },
          radius: { type: Number },
          gradient: { type: Object },
          opacity: { type: Number }
        },
        watch: {
          data: {
            handler () {
              this.reload();
            },
            deep: !0
          },
          max () {
            this.reload();
          },
          radius (t) {
            const e = this.originInstance;
              const n = this.opacity;
              const i = this.gradient;
            e.setOptions({
              radius: t,
              opacity: n,
              gradient: i
            });
          },
          gradient: {
            handler (t) {
              const e = this.originInstance;
                const n = this.radius;
                const i = this.opacity;
              e.setOptions({
                radius: n,
                opacity: i,
                gradient: t
              });
            },
            deep: !0
          },
          opacity (t) {
            const e = this.originInstance;
              const n = this.radius;
              const i = this.gradient;
            e.setOptions({
              radius: n,
              opacity: t,
              gradient: i
            });
          }
        },
        methods: {
          load () {
            const t = this.map;
              const e = this.data;
              const n = this.max;
              const i = this.radius;
              const o = this.opacity;
              const a = this.gradient;
              const s = this.originInstance = new r.default({
                radius: i,
                opacity: o,
                gradient: a
              });
            t.addOverlay(s), s.setDataSet({
              data: e,
              max: n
            });
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(2), n(80)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(o);
      e.default = {
        name: 'bm-lushu',
        render (t) {
        },
        mixins: [(0, r.default)('lushu')],
        props: {
          path: {
            type: Array,
            default: []
          },
          landmarkPois: {
            type: Array,
            default () {
              return [];
            }
          },
          icon: { type: Object },
          speed: {
            type: Number,
            default: 4e3
          },
          content: {
            type: String,
            default: ''
          },
          autoView: {
            type: Boolean,
            default: !1
          },
          rotation: {
            type: Boolean,
            default: !1
          },
          infoWindow: {
            type: Boolean,
            default: !0
          },
          play: {
            type: Boolean,
            default: !0
          }
        },
        watch: {
          path: {
            handler (t) {
              this.reload();
            },
            deep: !0
          },
          landmarkPois: {
            handler (t) {
              this.reload();
            },
            deep: !0
          },
          icon: {
            handler (t) {
              const e = this.originInstance;
                const n = (this.content, (0, i.createIcon)(BMap, t));
              e._opts.icon = n, e._marker = n;
            },
            deep: !0
          },
          speed (t) {
            const e = this.originInstance;
            this.content;
            e._opts.speed = t;
          },
          content (t) {
            const e = this.originInstance;
              const n = this.infoWindow;
            t && n ? e.showInfoWindow() : e.hideInfoWindow(), e._opts.defaultContent = t, e._overlay && e._overlay.setHtml(t);
          },
          autoView (t) {
            const e = this.originInstance;
            this.content;
            e._opts.autoView = t;
          },
          rotation (t) {
            const e = this.originInstance;
            this.content;
            e._opts.enableRotation = t;
          },
          infoWindow (t) {
            const e = this.originInstance;
              const n = this.content;
            e && t && n ? e.showInfoWindow() : e.hideInfoWindow();
          },
          play (t) {
            const e = this.originInstance;
            t && e ? e.start() : !this._isEnd && e.pause();
          }
        },
        methods: {
          load () {
            const t = this;
              const e = this.BMap;
              const n = this.map;
              const o = this.path;
              const a = this.landmarkPois;
              const r = this.icon;
              const l = this.speed;
              const c = this.content;
              const u = this.autoView;
              const h = this.rotation;
              const p = this.infoWindow;
              const d = this.play;
              const f = this.originInstance = new s.default(n, o, {
                enableRotation: h,
                landmarkPois: a,
                showInfoWindow: p,
                defaultContent: c,
                icon: r && (0, i.createIcon)(e, r),
                speed: l,
                autoView: u,
                onstart (e) {
                  t._isEnd = !1, t.$emit('start');
                },
                onstop (e) {
                  t._isEnd = !0, t.$emit('stop');
                },
                onpause (e) {
                  return t.$emit('pause');
                }
              });
            d && o.length && f.start(this), o.length && (c && p ? f.showInfoWindow() : f.hideInfoWindow());
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(81), n(2), n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(o);
      e.default = {
        name: 'bml-marker-clusterer',
        mixins: [(0, s.default)('markerClusterer')],
        props: {
          gridSize: { type: Object },
          maxZoom: { type: Number },
          minClusterSize: { type: Number },
          styles: {
            type: Array,
            default () {
              return [];
            }
          },
          averageCenter: {
            type: Boolean,
            default: !1
          }
        },
        watch: {
          gridSize: {
            handler (t) {
              const e = this.BMap;
              this.originInstance.setGridSize(e, t.map);
            },
            deep: !0
          },
          maxZoom (t) {
            this.originInstance.setMaxZoom(t);
          },
          minClusterSize: {
            handler (t) {
              const e = this.BMap;
              this.originInstance.setMinClusterSize((0, i.createSize)(e, t));
            },
            deep: !0
          },
          styles: {
            handler (t) {
              const e = this.BMap;
                const n = this.originInstance;
                const o = JSON.parse(JSON.stringify(t))
                  .map((t) => (t.size = t.size && (0, i.createSize)(e, t.size), t));
              n.setStyles(o);
            },
            deep: !0
          },
          averageCenter (t) {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this;
              const e = this.BMap;
              const n = this.map;
              const o = this.gridSize;
              const a = this.minClusterSize;
              const s = this.maxZoom;
              const l = this.styles;
              const c = this.averageCenter;
            this.originInstance = new r.default(n, {
              gridSize: o && (0, i.createSize)(e, o),
              maxZoom: s,
              minClusterSize: a && (0, i.createSize)(e, a),
              styles: l.map((t) => (t.size = (0, i.createSize)(e, t.size), t)),
              isAverageCenter: c
            }), this.$nextTick(() => {
              const n = t.$children.map((t) => t.originInstance)
                .filter((t) => t instanceof e.Marker);
              t.originInstance.addMarkers(n);
            });
          }
        },
        beforeCreate () {
          this.preventChildrenRender = !0;
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i) => {
      Object.defineProperty(e, '__esModule', { value: !0 });
      const o = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(n));
      e.default = {
        name: 'bm-tile',
        render (t) {
        },
        mixins: [(0, o.default)('layer')],
        props: {
          transparentPng: { type: Boolean },
          tileUrlTemplate: { type: String },
          copyright: {},
          zIndex: { type: Number }
        },
        watch: {
          transparentPng () {
            this.reload();
          },
          tileUrlTemplate () {
            this.reload();
          },
          copyright () {
            this.reload();
          },
          zIndex () {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.transparentPng;
              const o = this.tileUrlTemplate;
              const a = this.copyright;
              const r = this.zIndex;
            this.originInstance = new t.TileLayer({
              transparentPng: n,
              tileUrlTemplate: o,
              copyright: a && {
                id: a.id,
                content: a.content,
                bounds: a.bounds && (0, i.createBounds)(a.bounds)
              },
              zIndex: r
            }), e.addTileLayer(this.originInstance);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n) => {
      Object.defineProperty(e, '__esModule', { value: !0 });
      const i = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(n));
      e.default = {
        name: 'bm-triffic',
        render (t) {
        },
        mixins: [(0, i.default)('layer')],
        props: { predictDate: { type: Object } },
        watch: {
          'pridictDate.weekday': function () {
            this.reload();
          },
          'pridictDate.hour': function () {
            this.reload();
          },
          pridictDate () {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this.pridictDate;
              const e = this.BMap;
              const n = this.map;
            this.originInstance = new e.TrafficLayer({ pridictDate: t }), n.addTileLayer(this.originInstance);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(4), n(5)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const a = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        e.default = {
          name: 'bm-map',
          props: {
            ak: { type: String },
            center: { type: [Object, String] },
            zoom: { type: Number },
            minZoom: { type: Number },
            maxZoom: { type: Number },
            highResolution: {
              type: Boolean,
              default: !0
            },
            mapClick: {
              type: Boolean,
              default: !0
            },
            mapType: { type: String },
            dragging: {
              type: Boolean,
              default: !0
            },
            scrollWheelZoom: {
              type: Boolean,
              default: !1
            },
            doubleClickZoom: {
              type: Boolean,
              default: !0
            },
            keyboard: {
              type: Boolean,
              default: !0
            },
            inertialDragging: {
              type: Boolean,
              default: !0
            },
            continuousZoom: {
              type: Boolean,
              default: !0
            },
            pinchToZoom: {
              type: Boolean,
              default: !0
            },
            autoResize: {
              type: Boolean,
              default: !0
            },
            theme: { type: Array },
            mapStyle: { type: Object }
          },
          watch: {
            center (t, e) {
              const n = this.map;
                const i = this.zoom;
              (0, o.checkType)(t) === 'String' && t !== e && n.centerAndZoom(t, i);
            },
            'center.lng': function (t, e) {
              const n = this.BMap;
                const i = this.map;
                const o = this.zoom;
                const a = this.center;
              t !== e && t >= -180 && t <= 180 && i.centerAndZoom(new n.Point(t, a.lat), o);
            },
            'center.lat': function (t, e) {
              const n = this.BMap;
                const i = this.map;
                const o = this.zoom;
                const a = this.center;
              t !== e && t >= -74 && t <= 74 && i.centerAndZoom(new n.Point(a.lng, t), o);
            },
            zoom (t, e) {
              const n = this.map;
              t !== e && t >= 3 && t <= 19 && n.setZoom(t);
            },
            minZoom (t) {
              this.map.setMinZoom(t);
            },
            maxZoom (t) {
              this.map.setMaxZoom(t);
            },
            highResolution () {
              this.reset();
            },
            mapClick () {
              this.reset();
            },
            mapType (t) {
              this.map.setMapType(i[t]);
            },
            dragging (t) {
              const e = this.map;
              t ? e.enableDragging() : e.disableDragging();
            },
            scrollWheelZoom (t) {
              const e = this.map;
              t ? e.enableScrollWheelZoom() : e.disableScrollWheelZoom();
            },
            doubleClickZoom (t) {
              const e = this.map;
              t ? e.enableDoubleClickZoom() : e.disableDoubleClickZoom();
            },
            keyboard (t) {
              const e = this.map;
              t ? e.enableKeyboard() : e.disableKeyboard();
            },
            inertialDragging (t) {
              const e = this.map;
              t ? e.enableInertialDragging() : e.disableInertialDragging();
            },
            continuousZoom (t) {
              const e = this.map;
              t ? e.enableContinuousZoom() : e.disableContinuousZoom();
            },
            pinchToZoom (t) {
              const e = this.map;
              t ? e.enablePinchToZoom() : e.disablePinchToZoom();
            },
            autoResize (t) {
              const e = this.map;
              t ? e.enableAutoResize() : e.disableAutoResize();
            },
            theme (t) {
              this.map.setMapStyle({ styleJson: t });
            },
            'mapStyle.features': {
              handler (t, e) {
                const n = this.map;
                  const i = this.mapStyle;
                  const o = i.style;
                  const a = i.styleJson;
                n.setMapStyle({
                  styleJson: a,
                  features: t,
                  style: o
                });
              },
              deep: !0
            },
            'mapStyle.style': function (t, e) {
              const n = this.map;
                const i = this.mapStyle;
                const o = i.features;
                const a = i.styleJson;
              n.setMapStyle({
                styleJson: a,
                features: o,
                style: t
              });
            },
            'mapStyle.styleJson': {
              handler (t, e) {
                const n = this.map;
                  const i = this.mapStyle;
                  const o = i.features;
                  const a = i.style;
                n.setMapStyle({
                  styleJson: t,
                  features: o,
                  style: a
                });
              },
              deep: !0
            },
            mapStyle (t) {
              const e = this.map;
              !this.theme && e.setMapStyle(t);
            }
          },
          methods: {
            setMapOptions () {
              const t = this.map;
                const e = this.minZoom;
                const n = this.maxZoom;
                const o = this.mapType;
                const a = this.dragging;
                const r = this.scrollWheelZoom;
                const s = this.doubleClickZoom;
                const l = this.keyboard;
                const c = this.inertialDragging;
                const u = this.continuousZoom;
                const h = this.pinchToZoom;
                const p = this.autoResize;
              e && t.setMinZoom(e), n && t.setMaxZoom(n), o && t.setMapType(i[o]), a ? t.enableDragging() : t.disableDragging(), r ? t.enableScrollWheelZoom() : t.disableScrollWheelZoom(), s ? t.enableDoubleClickZoom() : t.disableDoubleClickZoom(), l ? t.enableKeyboard() : t.disableKeyboard(), c ? t.enableInertialDragging() : t.disableInertialDragging(), u ? t.enableContinuousZoom() : t.disableContinuousZoom(), h ? t.enablePinchToZoom() : t.disablePinchToZoom(), p ? t.enableAutoResize() : t.disableAutoResize();
            },
            init (t) {
              if (!this.map) {
                let e = this.$refs.view;
                  let n = !0;
                  let i = !1;
                  let o = void 0;
                try {
                  for (var r, s = (this.$slots.default || [])[Symbol.iterator](); !(n = (r = s.next()).done); n = !0) {
                    const l = r.value;
                    l.componentOptions && l.componentOptions.tag === 'bm-view' && (this.hasBmView = !0, e = l.elm);
                  }
                } catch (t) {
                  i = !0, o = t;
                } finally {
                  try {
                    !n && s.return && s.return();
                  } finally {
                    if (i) throw o;
                  }
                }
                const c = new t.Map(e, {
                  enableHighResolution: this.highResolution,
                  enableMapClick: this.mapClick
                });
                this.map = c;
                const u = this.setMapOptions;
                  const h = this.zoom;
                  const p = this.getCenterPoint;
                  const d = this.theme;
                  const f = this.mapStyle;
                d ? c.setMapStyle({ styleJson: d }) : c.setMapStyle(f), u(), a.default.call(this, c), c.reset(), c.centerAndZoom(p(), h), this.$emit('ready', {
                  BMap: t,
                  map: c
                });
              }
            },
            getCenterPoint () {
              const t = this.center;
                const e = this.BMap;
              switch ((0, o.checkType)(t)) {
                case 'String':
                  return t;
                case 'Object':
                  return new e.Point(t.lng, t.lat);
                default:
                  return new e.Point();
              }
            },
            initMap (t) {
              this.BMap = t, this.init(t);
            },
            getMapScript () {
              if (i.BMap) return i.BMap._preloader ? i.BMap._preloader : Promise.resolve(i.BMap);
              const t = this.ak || this._BMap().ak;
              return i.BMap = {}, i.BMap._preloader = new Promise(((e, n) => {
                i._initBaiduMap = function () {
                  e(i.BMap), i.document.body.removeChild(o), i.BMap._preloader = null, i._initBaiduMap = null;
                };
                var o = document.createElement('script');
                i.document.body.appendChild(o), o.src = `https://api.map.baidu.com/api?v=3.0&ak=${t}&callback=_initBaiduMap`;
              })), i.BMap._preloader;
            },
            reset () {
              const t = this.getMapScript;
                const e = this.initMap;
              t()
                .then(e);
            }
          },
          mounted () {
            this.reset();
          },
          data () {
            return { hasBmView: !1 };
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (n, r) {
      o = [t, e], i = r, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e) => {
      Object.defineProperty(e, '__esModule', { value: !0 }), e.default = { name: 'bm-view' }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(4)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i) => {
      function o(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const a = o(n);
        const r = o(i);
      e.default = {
        name: 'bm-autocomplete',
        mixins: [(0, a.default)()],
        props: {
          types: { type: String },
          location: { type: String },
          sugStyle: {
            type: Object,
            default () {
              return {};
            }
          }
        },
        watch: {
          types () {
            this.reload();
          },
          location () {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this;
              const e = this.BMap;
              const n = this.map;
              const i = this.$el;
              const o = this.types;
              const a = this.location;
              const s = this.sugStyle;
              const l = i.querySelector('input');
            l && (this.originInstance = new e.Autocomplete({
              input: l,
              types: o,
              location: a || n,
              onSearchComplete (e) {
                const n = document.querySelectorAll('.tangram-suggestion-main');
                  let i = !0;
                  let o = !1;
                  let a = void 0;
                try {
                  for (var r, l = n[Symbol.iterator](); !(i = (r = l.next()).done); i = !0) {
                    const c = r.value;
                    for (const u in s) c.style[u] = s[u].toString();
                  }
                } catch (t) {
                  o = !0, a = t;
                } finally {
                  try {
                    !i && l.return && l.return();
                  } finally {
                    if (o) throw a;
                  }
                }
                t.$emit('searchcomplete', e);
              }
            }), this.originInstance.addEventListener('onconfirm', (e) => {
              const n = e.item.value;
              t.$emit('input', n.province + n.city + n.district + n.street + n.business);
            }), r.default.call(this, this.originInstance));
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(6), n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i) => {
      function o(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const a = o(n);
        const r = o(i);
        const s = (function () {
          function t(t, e) {
            const n = [];
              let i = !0;
              let o = !1;
              let a = void 0;
            try {
              for (var r, s = t[Symbol.iterator](); !(i = (r = s.next()).done) && (n.push(r.value), !e || n.length !== e); i = !0) ;
            } catch (t) {
              o = !0, a = t;
            } finally {
              try {
                !i && s.return && s.return();
              } finally {
                if (o) throw a;
              }
            }
            return n;
          }

          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          };
        }());
      e.default = {
        mixins: [(0, r.default)('abstract')],
        props: ['name', 'strokeColor', 'strokeWeight', 'strokeOpacity', 'strokeStyle', 'fillColor', 'fillOpacity', 'massClear', 'clicking'],
        data () {
          return { paths: [] };
        },
        components: { BmPolygon: a.default },
        watch: {
          name () {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this;
              const e = this.BMap;
              const n = this.name;
            (new e.Boundary()).get(n, (e) => {
              t.paths = e.boundaries.map((t) => (t || []).split(';')
                  .map((t) => (function (t) {
                      const e = s(t, 2);
                      return {
                        lng: e[0],
                        lat: e[1]
                      };
                    }(t.split(',')
                      .map((t) => +t)))));
            });
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(i);
      e.default = {
        name: 'bm-circle',
        render () {
        },
        mixins: [(0, r.default)('overlay')],
        props: {
          center: {},
          radius: {},
          strokeColor: { type: String },
          strokeWeight: { type: Number },
          strokeOpacity: { type: Number },
          strokeStyle: { type: String },
          fillColor: { type: String },
          fillOpacity: { type: Number },
          massClear: {
            type: Boolean,
            default: !0
          },
          clicking: {
            type: Boolean,
            default: !0
          },
          editing: {
            type: Boolean,
            default: !1
          }
        },
        watch: {
          'center.lng': function (t, e) {
            const n = this.BMap;
              const i = this.originInstance;
              const a = this.isEditing;
              const r = this.disableEditing;
              const s = this.enableEditing;
              const l = this.center;
              const c = this.editing;
            if (!a) {
              r();
              const u = t;
              t.toString() !== e.toString() && u >= -180 && u <= 180 && i.setCenter((0, o.createPoint)(n, {
                lng: u,
                lat: l.lat
              })), c && s();
            }
          },
          'center.lat': function (t, e) {
            const n = this.BMap;
              const i = this.originInstance;
              const a = this.isEditing;
              const r = this.disableEditing;
              const s = this.enableEditing;
              const l = this.center;
              const c = this.editing;
            if (!a) {
              r();
              const u = t;
              t.toString() !== e.toString() && u >= -74 && u <= 74 && i.setCenter((0, o.createPoint)(n, {
                lng: l.lng,
                lat: u
              })), c && s();
            }
          },
          radius (t, e) {
            const n = this.originInstance;
              const i = this.isEditing;
              const o = this.disableEditing;
              const a = this.enableEditing;
              const r = this.editing;
            i || (o(), n.setRadius(t), r && a());
          },
          strokeColor (t) {
            this.originInstance.setStrokeColor(t);
          },
          strokeOpacity (t) {
            this.originInstance.setStrokeOpacity(t);
          },
          strokeWeight (t) {
            this.originInstance.setStrokeWeight(t);
          },
          strokeStyle (t) {
            this.originInstance.setStrokeStyle(t);
          },
          fillColor (t) {
            this.originInstance.setFillColor(t);
          },
          fillOpacity (t) {
            this.originInstance.setFillOpacity(t);
          },
          editing (t) {
            t ? this.enableEditing() : this.disableEditing();
          },
          massClear (t) {
            t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();
          },
          clicking (t) {
            this.reload();
          }
        },
        methods: {
          dragStartHandler () {
            this.isEditing = !0;
          },
          dragEndHandler () {
            this.isEditing = !1, this.bindEditingNodeEvents();
          },
          bindEditingNodeEvents () {
            const t = this.originInstance;
              const e = this.editingKey;
              const n = this.dragStartHandler;
              const i = this.dragEndHandler;
            t[e].forEach((t) => {
              t.addEventListener('dragstart', n), t.addEventListener('dragend', i);
            });
          },
          enableEditing () {
            const t = this.originInstance;
              const e = this.bindEditingNodeEvents;
            t.enableEditing(), e();
          },
          disableEditing () {
            this.originInstance.disableEditing();
          },
          getEditingKey (t) {
            const e = this;
              const n = [];
            t.enableEditing(), setTimeout(() => {
              for (const i in t) t[i] && t[i].length === 2 && n.push(i);
              t.disableEditing();
              for (const o in t) t[o] && t[o].length === 0 && ~n.indexOf(o) && (e.editingKey = o);
            }, 0);
          },
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.center;
              const i = this.radius;
              const a = this.strokeColor;
              const r = this.strokeWeight;
              const l = this.strokeOpacity;
              const c = this.strokeStyle;
              const u = this.fillColor;
              const h = this.fillOpacity;
              const p = this.editing;
              const d = this.massClear;
              const f = this.clicking;
              const m = this.enableEditing;
              const g = this.disableEditing;
              const y = this.getEditingKey;
              const v = this.editingKey;
              const _ = new t.Circle((0, o.createPoint)(t, {
                lng: n.lng,
                lat: n.lat
              }), i, {
                strokeColor: a,
                strokeWeight: r,
                strokeOpacity: l,
                strokeStyle: c,
                fillColor: u,
                fillOpacity: h,
                enableMassClear: d,
                enableClicking: f
              });
            this.originInstance = _, e.addOverlay(_), s.default.call(this, _), !v && y(_), setTimeout(() => {
              p ? m() : g();
            }, 0);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(i);
      e.default = {
        name: 'bm-ground',
        render () {
        },
        mixins: [(0, r.default)('overlay')],
        props: {
          bounds: { type: Object },
          opacity: { type: Number },
          imageURL: { type: String },
          displayOnMinLevel: { type: Number },
          displayOnMaxLevel: { type: Number }
        },
        watch: {
          bounds: {
            handler (t) {
              const e = this.BMap;
              this.originInstance.setBounds((0, o.createBounds)(e, t));
            },
            deep: !0
          },
          opacity (t) {
            this.originInstance.setOpacity(t);
          },
          imageURL (t) {
            this.originInstance.setImageURL(t);
          },
          displayOnMinLevel (t) {
            this.originInstance.setDisplayOnMinLevel(t);
          },
          displayOnMaxLevel (t) {
            this.originInstance.setDisplayOnMaxLevel(t);
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.bounds;
              const i = this.opacity;
              const a = this.imageURL;
              const r = this.displayOnMinLevel;
              const l = this.displayOnMaxLevel;
              const c = new t.GroundOverlay(n && (0, o.createBounds)(t, n), {
                opacity: i,
                imageURL: a,
                displayOnMaxLevel: l,
                displayOnMinLevel: r
              });
            c.setImageURL(a), this.originInstance = c, s.default.call(this, c), e.addOverlay(c);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }

        Object.defineProperty(e, '__esModule', { value: !0 });
        const s = r(n);
          const l = r(o);
        e.default = {
          name: 'bm-info-window',
          mixins: [(0, s.default)('overlay')],
          props: {
            show: { type: Boolean },
            position: { type: Object },
            title: { type: String },
            width: { type: Number },
            height: { type: Number },
            maxWidth: { type: Number },
            offset: { type: Object },
            maximize: { type: Boolean },
            autoPan: { type: Boolean },
            closeOnClick: {
              type: Boolean,
              default: !0
            },
            message: { type: String }
          },
          watch: {
            show (t) {
              t ? this.openInfoWindow() : this.closeInfoWindow();
            },
            'position.lng': function (t, e) {
              this.reload();
            },
            'position.lat': function (t, e) {
              this.reload();
            },
            'offset.width': function (t, e) {
              this.reload();
            },
            'offset.height': function (t) {
              this.reload();
            },
            maxWidth () {
              this.reload();
            },
            width (t) {
              this.originInstance.setWidth(t);
            },
            height (t) {
              this.originInstance.setHeight(t);
            },
            title (t) {
              this.originInstance.setTitle(t);
            },
            maximize (t) {
              t ? this.originInstance.enableMaximize() : this.originInstance.disableMaximize();
            },
            autoPan (t) {
              t ? this.originInstance.enableAutoPan() : this.originInstance.disableAutoPan();
            },
            closeOnClick (t) {
              t ? this.originInstance.enableCloseOnClick() : this.originInstance.disableCloseOnClick();
            }
          },
          methods: {
            redraw () {
              this.originInstance.redraw();
            },
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.show;
                const i = this.title;
                const o = this.width;
                const r = this.height;
                const s = this.maxWidth;
                const c = this.offset;
                const u = this.autoPan;
                const h = this.closeOnClick;
                const p = this.message;
                const d = this.maximize;
                const f = this.bindObserver;
                const m = this.$parent;
                const g = this.$el;
                const y = new t.InfoWindow(g, {
                  width: o,
                  height: r,
                  title: i,
                  maxWidth: s,
                  offset: (0, a.createSize)(t, c),
                  enableAutoPan: u,
                  enableCloseOnClick: h,
                  enableMessage: void 0 === p,
                  message: p
                });
              d ? y.enableMaximize() : y.disableMaximize(), l.default.call(this, y), this.originInstance = y, y.redraw(), [].forEach.call(g.querySelectorAll('img'), (t) => {
                t.onload = function () {
                  return y.redraw();
                };
              }), f(), this.$container = m.originInstance && m.originInstance.openInfoWindow ? m.originInstance : e, n && this.openInfoWindow();
            },
            bindObserver () {
              const t = i.MutationObserver;
              if (t) {
                const e = this.$el;
                  const n = this.originInstance;
                this.observer = new t(((t) => n.redraw())), this.observer.observe(e, {
                  attributes: !0,
                  childList: !0,
                  characterData: !0,
                  subtree: !0
                });
              }
            },
            openInfoWindow () {
              const t = this.BMap;
                const e = this.$container;
                const n = this.position;
                const i = this.originInstance;
              e.openInfoWindow(i, (0, a.createPoint)(t, n));
            },
            closeInfoWindow () {
              this.$container.closeInfoWindow(this.originInstance);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(i);
      e.default = {
        name: 'bm-label',
        render () {
        },
        mixins: [(0, r.default)('overlay')],
        props: {
          content: { type: String },
          title: { type: String },
          offset: {},
          position: {},
          labelStyle: {},
          zIndex: {
            type: Number,
            default: 0
          },
          massClear: {
            type: Boolean,
            default: !0
          }
        },
        watch: {
          content (t) {
            this.originInstance.setContent(t);
          },
          title (t) {
            this.originInstance.setTitle(t);
          },
          'offset.width': function (t, e) {
            const n = this.BMap;
            t.toString() !== e.toString() && this.originInstance.setOffset((0, o.createSize)(n, {
              width: t,
              height: this.offset.height
            }));
          },
          'offset.height': function (t, e) {
            const n = this.BMap;
            t.toString() !== e.toString() && this.originInstance.setOffset((0, o.createSize)(n, {
              width: this.offset.width,
              height: t
            }));
          },
          'position.lng': function (t, e) {
            const n = this.BMap;
              const i = t;
            t.toString() !== e.toString() && i >= -180 && i <= 180 && this.originInstance.setCenter((0, o.createPoint)(n, {
              lng: i,
              lat: this.center.lat
            }));
          },
          'position.lat': function (t, e) {
            const n = this.BMap;
              const i = t;
            t.toString() !== e.toString() && i >= -74 && i <= 74 && this.originInstance.setCenter((0, o.createPoint)(n, {
              lng: this.center.lng,
              lat: i
            }));
          },
          labelStyle: {
            handler (t) {
              this.originInstance.setStyle(t);
            },
            deep: !0
          },
          zIndex (t) {
            this.originInstance.setZIndex(t);
          },
          massClear (t) {
            t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.content;
              const i = this.title;
              const a = this.offset;
              const r = this.position;
              const l = this.labelStyle;
              const c = this.zIndex;
              const u = this.massClear;
              const h = this.$parent;
              const p = new t.Label(n, {
                offset: (0, o.createSize)(t, a),
                position: (0, o.createPoint)(t, r),
                enableMassClear: u
              });
            this.originInstance = p;
            try {
              h.originInstance.setLabel(p);
            } catch (t) {
              e.addOverlay(p);
            }
            i && p.setTitle(i), l && p.setStyle(l), c && p.setZIndex(c), s.default.call(this, p);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }

        Object.defineProperty(e, '__esModule', { value: !0 });
        const s = r(n);
          const l = r(o);
        e.default = {
          name: 'bm-marker',
          mixins: [(0, s.default)('overlay')],
          props: {
            position: {},
            offset: {},
            icon: {},
            massClear: {
              type: Boolean,
              default: !0
            },
            dragging: {
              type: Boolean,
              default: !1
            },
            clicking: {
              type: Boolean,
              default: !0
            },
            raiseOnDrag: {
              type: Boolean,
              default: !1
            },
            draggingCursor: { type: String },
            rotation: { type: Number },
            shadow: { type: Object },
            title: { type: String },
            label: { type: Object },
            animation: { type: String },
            top: {
              type: Boolean,
              default: !1
            },
            zIndex: {
              type: Number,
              default: 0
            }
          },
          watch: {
            'position.lng': function (t, e) {
              const n = this.BMap;
                const i = this.originInstance;
                const o = this.position;
                const r = this.renderByParent;
                const s = this.$parent;
              t !== e && t >= -180 && t <= 180 && i.setPosition((0, a.createPoint)(n, {
                lng: t,
                lat: o.lat
              })), r && s.reload();
            },
            'position.lat': function (t, e) {
              const n = this.BMap;
                const i = this.originInstance;
                const o = this.position;
                const r = this.renderByParent;
                const s = this.$parent;
              t !== e && t >= -74 && t <= 74 && i.setPosition((0, a.createPoint)(n, {
                lng: o.lng,
                lat: t
              })), r && s.reload();
            },
            'offset.width': function (t, e) {
              const n = this.BMap;
                const i = this.originInstance;
              t !== e && i.setOffset(new n.Size(t, this.offset.height));
            },
            'offset.height': function (t, e) {
              const n = this.BMap;
                const i = this.originInstance;
              t !== e && i.setOffset(new n.Size(this.offset.width, t));
            },
            icon: {
              deep: !0,
              handler (t) {
                const e = this.BMap;
                  const n = this.originInstance;
                  const i = this.rotation;
                n && n.setIcon((0, a.createIcon)(e, t)), i && n && n.setRotation(i);
              }
            },
            massClear (t) {
              t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();
            },
            dragging (t) {
              t ? this.originInstance.enableDragging() : this.originInstance.disableDragging();
            },
            clicking () {
              this.reload();
            },
            raiseOnDrag () {
              this.reload();
            },
            draggingCursor (t) {
              this.originInstance.setDraggingCursor(t);
            },
            rotation (t) {
              this.originInstance.setRotation(t);
            },
            shadow (t) {
              this.originInstance.setShadow(t);
            },
            title (t) {
              this.originInstance.setTitle(t);
            },
            label (t) {
              this.reload();
            },
            animation (t) {
              this.originInstance.setAnimation(i[t]);
            },
            top (t) {
              this.originInstance.setTop(t);
            },
            zIndex (t) {
              this.originInstance.setZIndex(t);
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.position;
                const o = this.offset;
                const r = this.icon;
                const s = this.massClear;
                const c = this.dragging;
                const u = this.clicking;
                const h = this.raiseOnDrag;
                const p = this.draggingCursor;
                const d = this.rotation;
                const f = this.shadow;
                const m = this.title;
                const g = this.label;
                const y = this.animation;
                const v = this.top;
                const _ = this.renderByParent;
                const b = this.$parent;
                const x = this.zIndex;
                const w = new t.Marker(new t.Point(n.lng, n.lat), {
                  offset: o,
                  icon: r && (0, a.createIcon)(t, r),
                  enableMassClear: s,
                  enableDragging: c,
                  enableClicking: u,
                  raiseOnDrag: h,
                  draggingCursor: p,
                  rotation: d,
                  shadow: f,
                  title: m
                });
              this.originInstance = w, g && w && w.setLabel((0, a.createLabel)(t, g)), w.setTop(v), w.setZIndex(x), l.default.call(this, w), _ ? b.reload() : e.addOverlay(w), w.setAnimation(i[y]);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n) => {
      function i(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }

      function o(t, e) {
        if (!t) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
        return !e || typeof e !== 'object' && typeof e !== 'function' ? t : e;
      }

      function a(t, e) {
        if (typeof e !== 'function' && e !== null) throw new TypeError(`Super expression must either be null or a function, not ${typeof e}`);
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(n));
        const s = (function () {
          function t(t, e) {
            for (let n = 0; n < e.length; n++) {
              const i = e[n];
              i.enumerable = i.enumerable || !1, i.configurable = !0, 'value' in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
            }
          }

          return function (e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
          };
        }());
      e.default = {
        name: 'bm-overlay',
        mixins: [(0, r.default)('overlay')],
        props: { pane: { type: String } },
        watch: {
          pane () {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.$el;
              const r = this.pane;
              const l = this.$emit.bind(this);
              const c = (function (c) {
                function u() {
                  return i(this, u), o(this, (u.__proto__ || Object.getPrototypeOf(u)).apply(this, arguments));
                }

                return a(u, c), s(u, [{
                  key: 'initialize',
                  value () {
                    l('initialize', {
                      BMap: t,
                      map: e,
                      el: n,
                      overlay: this
                    });
                    try {
                      e.getPanes()[r].appendChild(n);
                    } catch (t) {
                    }
                    return n;
                  }
                }, {
                  key: 'draw',
                  value () {
                    l('draw', {
                      BMap: t,
                      map: e,
                      el: n,
                      overlay: this
                    });
                  }
                }]), u;
              }(t.Overlay));
              const u = new c();
            this.originInstance = u, e.addOverlay(u);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }

        Object.defineProperty(e, '__esModule', { value: !0 });
        const s = r(n);
          const l = r(o);
        e.default = {
          render () {
          },
          name: 'bm-point-collection',
          mixins: [(0, s.default)('overlay')],
          props: {
            points: {
              type: Array,
              default () {
                return [];
              }
            },
            shape: {
              type: String,
              default: 'BMAP_POINT_SHAPE_CIRCLE'
            },
            color: { type: String },
            size: {
              type: String,
              default: 'BMAP_POINT_SIZE_NORMAL'
            }
          },
          watch: {
            shape (t) {
              const e = this.originInstance;
                const n = this.color;
                const o = this.size;
              e.setStyles({
                shape: i[t],
                color: n,
                size: i[o]
              });
            },
            size (t) {
              const e = this.originInstance;
                const n = this.color;
                const o = this.shape;
              e.setStyles({
                shape: i[o],
                color: n,
                size: i[t]
              });
            },
            color (t) {
              const e = this.originInstance;
                const n = this.shape;
                const o = this.size;
              e.setStyles({
                shape: i[n],
                color: t,
                size: i[o]
              });
            },
            points: {
              deep: !0,
              handler (t) {
                const e = this.originInstance;
                e.clear(), e.setPoints(t);
              }
            }
          },
          methods: {
            load () {
              const t = this.BMap;
                const e = this.map;
                const n = this.points;
                const o = this.shape;
                const r = this.color;
                const s = this.size;
                const c = this.originInstance = new t.PointCollection(n.map((e) => (0, a.createPoint)(t, e)), {
                  shape: i[o],
                  color: r,
                  size: i[s]
                });
              l.default.call(this, c), e.addOverlay(c);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(i);
      e.default = {
        name: 'bm-polygon',
        render () {
        },
        mixins: [(0, r.default)('overlay')],
        props: {
          path: {
            type: Array,
            default () {
              return [];
            }
          },
          strokeColor: { type: String },
          strokeWeight: { type: Number },
          strokeOpacity: { type: Number },
          strokeStyle: { type: String },
          fillColor: { type: String },
          fillOpacity: { type: Number },
          massClear: {
            type: Boolean,
            default: !0
          },
          clicking: {
            type: Boolean,
            default: !0
          },
          editing: {
            type: Boolean,
            default: !1
          }
        },
        watch: {
          path: {
            handler (t, e) {
              this.reload();
            },
            deep: !0
          },
          strokeColor (t) {
            this.originInstance.setStrokeColor(t);
          },
          strokeOpacity (t) {
            this.originInstance.setStrokeOpacity(t);
          },
          strokeWeight (t) {
            this.originInstance.setStrokeWeight(t);
          },
          strokeStyle (t) {
            this.originInstance.setStrokeStyle(t);
          },
          fillColor (t) {
            this.originInstance.setFillColor(t);
          },
          fillOpacity (t) {
            this.originInstance.setFillOpacity(t);
          },
          editing (t) {
            t ? this.originInstance.enableEditing() : this.originInstance.disableEditing();
          },
          massClear (t) {
            t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();
          },
          clicking (t) {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.path;
              const i = this.strokeColor;
              const a = this.strokeWeight;
              const r = this.strokeOpacity;
              const l = this.strokeStyle;
              const c = this.fillColor;
              const u = this.fillOpacity;
              const h = this.editing;
              const p = this.massClear;
              const d = this.clicking;
              const f = new t.Polygon(n.map((e) => (0, o.createPoint)(t, {
                  lng: e.lng,
                  lat: e.lat
                })), {
                strokeColor: i,
                strokeWeight: a,
                strokeOpacity: r,
                strokeStyle: l,
                fillColor: c,
                fillOpacity: u,
                enableMassClear: p,
                enableClicking: d
              });
            this.originInstance = f, e.addOverlay(f), s.default.call(this, f), h ? f.enableEditing() : f.disableEditing();
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }

      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = a(n);
        const s = a(i);
      e.default = {
        name: 'bm-polyline',
        render () {
        },
        mixins: [(0, r.default)('overlay')],
        props: {
          path: { type: Array },
          strokeColor: { type: String },
          strokeWeight: { type: Number },
          strokeOpacity: { type: Number },
          strokeStyle: { type: String },
          massClear: {
            type: Boolean,
            default: !0
          },
          clicking: {
            type: Boolean,
            default: !0
          },
          editing: {
            type: Boolean,
            default: !1
          }
        },
        watch: {
          path: {
            handler (t, e) {
              this.reload();
            },
            deep: !0
          },
          strokeColor (t) {
            this.originInstance.setStrokeColor(t);
          },
          strokeOpacity (t) {
            this.originInstance.setStrokeOpacity(t);
          },
          strokeWeight (t) {
            this.originInstance.setStrokeWeight(t);
          },
          strokeStyle (t) {
            this.originInstance.setStrokeStyle(t);
          },
          editing (t) {
            t ? this.originInstance.enableEditing() : this.originInstance.disableEditing();
          },
          massClear (t) {
            t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();
          },
          clicking (t) {
            this.reload();
          }
        },
        methods: {
          load () {
            const t = this.BMap;
              const e = this.map;
              const n = this.path;
              const i = this.strokeColor;
              const a = this.strokeWeight;
              const r = this.strokeOpacity;
              const l = this.strokeStyle;
              const c = this.editing;
              const u = this.massClear;
              const h = this.clicking;
              const p = new t.Polyline(n.map((e) => (0, o.createPoint)(t, {
                  lng: e.lng,
                  lat: e.lat
                })), {
                strokeColor: i,
                strokeWeight: a,
                strokeOpacity: r,
                strokeStyle: l,
                enableEditing: c,
                enableMassClear: u,
                enableClicking: h
              });
            this.originInstance = p, e.addOverlay(p), s.default.call(this, p);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(2), n(5), n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      Object.defineProperty(e, '__esModule', { value: !0 });
      const a = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(o));
      e.default = {
        name: 'bm-bus',
        mixins: [(0, a.default)('search')],
        props: {
          location: { type: [Object, String] },
          keyword: { type: String },
          panel: {
            type: Boolean,
            default: !0
          },
          pageCapacity: { type: Number },
          autoViewport: { type: Boolean },
          selectFirstResult: { type: Boolean }
        },
        watch: {
          location: {
            handler (t) {
              const e = this.originInstance;
                const n = this.map;
              e.setLocation(t || n);
            },
            deep: !0
          },
          keyword (t) {
            this.search(t);
          },
          panel () {
            this.reload();
          },
          autoViewport (t) {
            this.reload();
          },
          selectFirstResult (t) {
            this.reload();
          }
        },
        methods: {
          search (t) {
            this.originInstance.getBusList(t);
          },
          load () {
            const t = this;
              const e = this.location;
              const o = this.selectFirstResult;
              const a = this.autoViewport;
              const r = this.highlightMode;
              const s = this.keyword;
              const l = this.search;
              const c = this.BMap;
              const u = this.map;
              const h = this.originInstance;
              const p = e ? (0, i.isPoint)(e) ? (0, n.createPoint)(c, e) : e : u;
              var d = this.originInstance = new c.BusLineSearch(p, {
                renderOptions: {
                  map: u,
                  panel: this.$el,
                  selectFirstResult: o,
                  autoViewport: a,
                  highlightMode: r
                },
                onGetBusListComplete (e) {
                  h && h !== d && h.clearResults(), t.$emit('getbuslistcomplete', e);
                },
                onGetBusLineComplete (e) {
                  h && h !== d && h.clearResults(), t.$emit('getbuslinecomplete', e);
                },
                onBusListHtmlSet (e) {
                  t.$emit('buslisthtmlset', e);
                },
                onBusLineHtmlSet (e) {
                  t.$emit('buslinehtmlset', e);
                },
                onMarkersSet (e) {
                  t.$emit('markersset', e);
                },
                onPolylinesSet (e) {
                  t.$emit('polylinesset', e);
                }
              });
            l(s);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(2), n(5), n(1)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const r = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(a));
        e.default = {
          name: 'bm-driving',
          mixins: [(0, r.default)('search')],
          props: {
            location: { type: [Object, String] },
            start: { type: [Object, String] },
            end: { type: [Object, String] },
            startCity: { type: [String, Number] },
            endCity: { type: [String, Number] },
            waypoints: { type: Array },
            policy: { type: String },
            panel: {
              type: Boolean,
              default: !0
            },
            autoViewport: { type: Boolean },
            selectFirstResult: { type: Boolean }
          },
          watch: {
            location: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.map;
                e.setLocation(t || n);
              },
              deep: !0
            },
            start: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.end;
                  const i = this.startCity;
                  const a = this.endCity;
                  const r = this.waypoints;
                  const s = this.BMap;
                  const l = this.getWaypoints;
                e.search((0, o.getPosition)(s, t), (0, o.getPosition)(s, n), {
                  startCity: i,
                  endCity: a,
                  waypoints: l(r)
                });
              },
              deep: !0
            },
            end: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.start;
                  const i = this.startCity;
                  const a = this.endCity;
                  const r = this.waypoints;
                  const s = this.BMap;
                  const l = this.getWaypoints;
                e.search((0, o.getPosition)(s, n), (0, o.getPosition)(s, t), {
                  startCity: i,
                  endCity: a,
                  waypoints: l(r)
                });
              },
              deep: !0
            },
            startCity (t) {
              const e = this.originInstance;
                const n = this.start;
                const i = this.end;
                const o = this.endCity;
                const a = this.waypoints;
                const r = this.getWaypoints;
              e.search(n, i, {
                val: t,
                endCity: o,
                waypoints: r(a)
              });
            },
            endCity (t) {
              const e = this.originInstance;
                const n = this.start;
                const i = this.end;
                const o = this.startCity;
                const a = this.waypoints;
                const r = this.getWaypoints;
              e.search(n, i, {
                startCity: o,
                val: t,
                waypoints: r(a)
              });
            },
            waypoints: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.start;
                  const i = this.end;
                  const o = this.startCity;
                  const a = this.endCity;
                  const r = this.getWaypoints;
                e.search(n, i, {
                  startCity: o,
                  endCity: a,
                  waypoints: r(t)
                });
              },
              deep: !0
            },
            panel () {
              this.reload();
            },
            policy (t) {
              this.reload();
            },
            autoViewport () {
              this.reload();
            },
            selectFirstResult () {
              this.reload();
            },
            highlightMode () {
              this.reload();
            }
          },
          methods: {
            search (t, e, n) {
              const i = n.startCity;
                const o = n.endCity;
                const a = n.waypoints;
                const r = this.originInstance;
                const s = this.getWaypoints;
              r.search(t, e, {
                startCity: i,
                endCity: o,
                waypoints: s(a)
              });
            },
            getWaypoints (t) {
              const e = this.BMap;
              if (t) {
                return t.map((t) => (0, o.getPosition)(e, t));
              }
            },
            load () {
              const t = this;
                const e = this.map;
                const a = this.BMap;
                const r = this.location;
                const s = this.policy;
                const l = this.selectFirstResult;
                const c = this.autoViewport;
                const u = this.highlightMode;
                const h = this.search;
                const p = this.start;
                const d = this.end;
                const f = this.startCity;
                const m = this.endCity;
                const g = this.waypoints;
                const y = this.originInstance;
                const v = this.getWaypoints;
                const _ = r ? (0, o.isPoint)(r) ? (0, n.createPoint)(a, r) : r : e;
                var b = this.originInstance = new a.DrivingRoute(_, {
                  renderOptions: {
                    map: e,
                    panel: this.$el,
                    selectFirstResult: l,
                    autoViewport: c,
                    highlightMode: u
                  },
                  policy: i[s],
                  onSearchComplete (e) {
                    y && y !== b && y.clearResults(), t.$emit('searchcomplete', e);
                  },
                  onMarkersSet (e) {
                    t.$emit('markersset', e);
                  },
                  onInfoHtmlSet (e) {
                    t.$emit('infohtmlset', e);
                  },
                  onPolylinesSet (e) {
                    t.$emit('polylinesset', e);
                  },
                  onResultsHtmlSet (e) {
                    t.$emit('resultshtmlset', e);
                  }
                });
              h((0, o.getPosition)(a, p), (0, o.getPosition)(a, d), {
                startCity: f,
                endCity: m,
                waypoints: v(g)
              });
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(2), n(5), n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      Object.defineProperty(e, '__esModule', { value: !0 });
      const a = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(o));
      e.default = {
        name: 'bm-local-search',
        mixins: [(0, a.default)('search')],
        props: {
          location: { type: [Object, String] },
          keyword: { type: [Array, String] },
          panel: {
            type: Boolean,
            default: !0
          },
          forceLocal: { type: Boolean },
          customData: { type: Object },
          bounds: { type: Object },
          nearby: { type: Object },
          pageCapacity: { type: Number },
          autoViewport: { type: Boolean },
          selectFirstResult: { type: Boolean }
        },
        watch: {
          location: {
            handler (t) {
              const e = this.originInstance;
                const n = this.search;
              e.setLocation(t || this.map), n();
            },
            deep: !0
          },
          keyword () {
            this.search();
          },
          bounds: {
            handler (t) {
              (0, this.searchInBounds)(t);
            },
            deep: !0
          },
          nearby: {
            handler (t) {
              (0, this.searchNearby)(t);
            },
            deep: !0
          },
          forceLocal () {
            this.reload();
          },
          customData: {
            deep: !0,
            handler () {
              this.reload();
            }
          },
          pageCapacity (t) {
            this.originInstance && this.originInstance.setPageCapacity(t);
          },
          autoViewport (t) {
            this.originInstance && (t ? this.originInstance.enableAutoViewport() : this.originInstance.disableAutoViewport());
          },
          selectFirstResult (t) {
            this.originInstance && (t ? this.originInstance.enableFirstResultSelection() : this.originInstance.disableFirstResultSelection());
          },
          highlightMode () {
            this.reload();
          }
        },
        methods: {
          searchNearby (t) {
            const e = this.originInstance;
              const i = this.keyword;
              const o = this.customData;
              const a = this.BMap;
            e.searchNearby(i, (0, n.createPoint)(a, t.center), t.radius, o);
          },
          searchInBounds (t) {
            const e = this.originInstance;
              const i = this.keyword;
              const o = this.customData;
              const a = this.BMap;
            e.searchInBounds(i, (0, n.createBounds)(a, t), o);
          },
          search () {
            const t = this.originInstance;
              const e = this.keyword;
              const n = this.forceLocal;
              const i = this.customData;
              const o = this.nearby;
              const a = this.bounds;
              const r = this.searchNearby;
              const s = this.searchInBounds;
            o ? r(o) : a ? s(a) : t.search(e, {
              forceLocal: n,
              customData: i
            });
          },
          load () {
            const t = this;
              const e = this.map;
              const o = this.BMap;
              const a = this.search;
              const r = this.pageCapacity;
              const s = this.autoViewport;
              const l = this.selectFirstResult;
              const c = this.highlightMode;
              const u = this.location;
              const h = this.originInstance;
              const p = u ? (0, i.isPoint)(u) ? (0, n.createPoint)(o, u) : u : e;
              var d = this.originInstance = new o.LocalSearch(p, {
                onMarkersSet (e) {
                  t.$emit('markersset', e);
                },
                onInfoHtmlSet (e) {
                  t.$emit('infohtmlset', e);
                },
                onResultsHtmlSet (e) {
                  t.$emit('resultshtmlset', e);
                },
                onSearchComplete (e) {
                  h && h !== d && h.clearResults(), t.$emit('searchcomplete', e);
                },
                pageCapacity: r,
                renderOptions: {
                  map: e,
                  panel: this.$el,
                  selectFirstResult: l,
                  autoViewport: s,
                  highlightMode: c
                }
              });
            a();
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    (function (i) {
      let o;
        let a;
        let r;
      !(function (i, s) {
        a = [t, e, n(2), n(5), n(1)], o = s, void 0 !== (r = typeof o === 'function' ? o.apply(e, a) : o) && (t.exports = r);
      }(0, (t, e, n, o, a) => {
        Object.defineProperty(e, '__esModule', { value: !0 });
        const r = (function (t) {
          return t && t.__esModule ? t : { default: t };
        }(a));
        e.default = {
          name: 'bm-transit',
          mixins: [(0, r.default)('search')],
          props: {
            location: { type: [Object, String] },
            start: { type: [Object, String] },
            end: { type: [Object, String] },
            panel: {
              type: Boolean,
              default: !0
            },
            policy: { type: String },
            pageCapacity: { type: Number },
            autoViewport: { type: Boolean },
            selectFirstResult: { type: Boolean }
          },
          watch: {
            location: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.map;
                e.setLocation(t || n);
              },
              deep: !0
            },
            start: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.end;
                  const i = this.BMap;
                e.search((0, o.getPosition)(i, t), (0, o.getPosition)(i, n));
              },
              deep: !0
            },
            end: {
              handler (t) {
                const e = this.originInstance;
                  const n = this.start;
                  const i = this.BMap;
                e.search((0, o.getPosition)(i, n), (0, o.getPosition)(i, t));
              },
              deep: !0
            },
            panel () {
              this.reload();
            },
            policy (t) {
              this.originInstance.setPolicy(i[t]);
            },
            pageCapacity (t) {
              this.originInstance && this.originInstance.setPageCapacity(t);
            },
            autoViewport (t) {
              this.originInstance && (t ? this.originInstance.enableAutoViewport() : this.originInstance.disableAutoViewport());
            },
            selectFirstResult () {
              this.reload();
            },
            highlightMode () {
              this.reload();
            }
          },
          methods: {
            search (t, e) {
              this.originInstance.search(t, e);
            },
            load () {
              const t = this;
                const e = this.map;
                const a = this.BMap;
                const r = this.location;
                const s = this.policy;
                const l = this.pageCapacity;
                const c = this.selectFirstResult;
                const u = this.autoViewport;
                const h = this.highlightMode;
                const p = this.search;
                const d = this.start;
                const f = this.end;
                const m = this.originInstance;
                const g = r ? (0, o.isPoint)(r) ? (0, n.createPoint)(a, r) : r : e;
                var y = this.originInstance = new a.TransitRoute(g, {
                  renderOptions: {
                    map: e,
                    panel: this.$el,
                    selectFirstResult: c,
                    autoViewport: u,
                    highlightMode: h
                  },
                  policy: i[s],
                  pageCapacity: l,
                  onSearchComplete (e) {
                    m && m !== y && m.clearResults(), t.$emit('searchcomplete', e);
                  },
                  onMarkersSet (e) {
                    t.$emit('markersset', e);
                  },
                  onInfoHtmlSet (e) {
                    t.$emit('infohtmlset', e);
                  },
                  onPolylinesSet (e) {
                    t.$emit('polylinesset', e);
                  },
                  onResultsHtmlSet (e) {
                    t.$emit('resultshtmlset', e);
                  }
                });
              p((0, o.isPoint)(d) ? (0, n.createPoint)(a, d) : d, (0, o.isPoint)(f) ? (0, n.createPoint)(a, f) : f);
            }
          }
        }, t.exports = e.default;
      }));
    }).call(e, n(3));
  }, function (t, e, n) {
    let i;
      let o;
      let a;
    !(function (r, s) {
      o = [t, e, n(2), n(5), n(1)], i = s, void 0 !== (a = typeof i === 'function' ? i.apply(e, o) : i) && (t.exports = a);
    }(0, (t, e, n, i, o) => {
      Object.defineProperty(e, '__esModule', { value: !0 });
      const a = (function (t) {
        return t && t.__esModule ? t : { default: t };
      }(o));
      e.default = {
        name: 'bm-walking',
        mixins: [(0, a.default)('search')],
        props: {
          location: { type: [Object, String] },
          start: { type: [Object, String] },
          end: { type: [Object, String] },
          panel: {
            type: Boolean,
            default: !0
          },
          pageCapacity: { type: Number },
          autoViewport: { type: Boolean },
          selectFirstResult: { type: Boolean }
        },
        watch: {
          location: {
            handler (t) {
              const e = this.originInstance;
                const n = this.map;
              e.setLocation(t || n);
            },
            deep: !0
          },
          start: {
            handler (t) {
              const e = this.originInstance;
                const n = this.end;
                const o = this.BMap;
              e.search((0, i.getPosition)(o, t), (0, i.getPosition)(o, n));
            },
            deep: !0
          },
          end: {
            handler (t) {
              const e = this.originInstance;
                const n = this.start;
                const o = this.BMap;
              e.search((0, i.getPosition)(o, n), (0, i.getPosition)(o, t));
            },
            deep: !0
          },
          panel () {
            this.reload();
          },
          autoViewport (t) {
            this.reload();
          },
          selectFirstResult (t) {
            this.reload();
          },
          highlightMode () {
            this.reload();
          }
        },
        methods: {
          search (t, e) {
            this.originInstance.search(t, e);
          },
          load () {
            const t = this;
              const e = this.map;
              const o = this.BMap;
              const a = this.location;
              const r = this.selectFirstResult;
              const s = this.autoViewport;
              const l = this.highlightMode;
              const c = this.search;
              const u = this.start;
              const h = this.end;
              const p = this.originInstance;
              const d = a ? (0, i.isPoint)(a) ? (0, n.createPoint)(o, a) : a : e;
              var f = this.originInstance = new o.WalkingRoute(d, {
                renderOptions: {
                  map: e,
                  panel: this.$el,
                  selectFirstResult: r,
                  autoViewport: s,
                  highlightMode: l
                },
                onSearchComplete (e) {
                  p && p !== f && p.clearResults(), t.$emit('searchcomplete', e);
                },
                onMarkersSet (e) {
                  t.$emit('markersset', e);
                },
                onInfoHtmlSet (e) {
                  t.$emit('infohtmlset', e);
                },
                onPolylinesSet (e) {
                  t.$emit('polylinesset', e);
                },
                onResultsHtmlSet (e) {
                  t.$emit('resultshtmlset', e);
                }
              });
            c((0, i.isPoint)(u) ? (0, n.createPoint)(o, u) : u, (0, i.isPoint)(h) ? (0, n.createPoint)(o, h) : h);
          }
        }
      }, t.exports = e.default;
    }));
  }, function (t, e, n) {
    !(function (e, n) {
      t.exports = n();
    }(0, () => {
      function t(t, n) {
        try {
          BMap;
        } catch (t) {
          throw Error('Baidu Map JS API is not ready yet!');
        }
        const i = e(t);
          const o = new BMap.Polyline(i, n);
        return o.addEventListener('lineupdate', function () {
          this.isEditing && this.enableEditing();
        }), o.cornerPoints = t, o.editMarkers = [], o.enableEditing = function () {
          const t = this;
          if (t.map) {
            t.disableEditing();
            for (let n = 0; n < t.cornerPoints.length; n++) {
              const i = new BMap.Marker(t.cornerPoints[n], {
                icon: new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png', new BMap.Size(16, 16)),
                enableDragging: !0,
                raiseOnDrag: !0
              });
              i.addEventListener('dragend', () => {
                t.cornerPoints.length = 0;
                for (let n = 0; n < t.editMarkers.length; n++) t.cornerPoints.push(t.editMarkers[n].getPosition());
                const i = e(t.cornerPoints);
                t.setPath(i);
              }), i.index = n, t.editMarkers.push(i), t.map.addOverlay(i);
            }
          }
          t.isEditing = !0;
        }, o.disableEditing = function () {
          this.isEditing = !1;
          for (let t = 0; t < this.editMarkers.length; t++) this.map.removeOverlay(this.editMarkers[t]), this.editMarkers[t] = null;
          this.editMarkers.length = 0;
        }, o.getPath = function () {
          return i;
        }, o;
      }

      function e(t) {
        for (var e = [], i = 0; i < t.length - 1; i++) {
          const o = n(t[i], t[i + 1]);
          o && o.length > 0 && (e = e.concat(o));
        }
        return e;
      }

      function n(t, e) {
        let n = [];
        if (!(t && e && t instanceof BMap.Point && e instanceof BMap.Point)) return null;
        let i;
          let o;
          let a;
          let r;
          let s;
          let l;
          const c = function (t) {
            return 1 - 2 * t + t * t;
          };
          const u = function (t) {
            return 2 * t - 2 * t * t;
          };
          const h = function (t) {
            return t * t;
          };
          let p = 0;
          let d = 0;
        if (void 0 === e) return void (void 0 !== n && (n = []));
        const f = parseFloat(t.lat);
          const m = parseFloat(e.lat);
          let g = parseFloat(t.lng);
          let y = parseFloat(e.lng);
        for (y > g && parseFloat(y - g) > 180 && g < 0 && (g = parseFloat(360 + g)), g > y && parseFloat(g - y) > 180 && y < 0 && (y = parseFloat(360 + y)), 0, l = 0, m == f ? (i = 0, o = g - y) : y == g ? (i = Math.PI / 2, o = f - m) : (i = Math.atan((m - f) / (y - g)), o = (m - f) / Math.sin(i)), l == 0 && (l = i + Math.PI / 5), a = o / 2, s = a * Math.cos(l) + g, r = a * Math.sin(l) + f, p = 0; p < 31; p++) n.push(new BMap.Point(g * c(d) + s * u(d) + y * h(d), f * c(d) + r * u(d) + m * h(d))), d += 1 / 30;
        return n;
      }

      return t;
    }));
  }, function (t, e, n) {
    !(function (e, n) {
      t.exports = n();
    }(0, () => {
      function t(t, e, n) {
        let i;
          let o;
          const a = t.prototype;
          const r = new Function();
        r.prototype = e.prototype, o = t.prototype = new r();
        for (i in a) o[i] = a[i];
        t.prototype.constructor = t, t.superClass = e.prototype, typeof n === 'string' && (o._className = n);
      }

      const e = (function () {
          const t = function (t) {
            const e = {
              data: [],
              heatmap: t
            };
            this.max = 1, this.get = function (t) {
              return e[t];
            }, this.set = function (t, n) {
              e[t] = n;
            };
          };
          t.prototype = {
            addDataPoint (t, e) {
              if (!(t < 0 || e < 0)) {
                const n = this;
                  const i = n.get('heatmap');
                  const o = n.get('data');
                if (o[t] || (o[t] = []), o[t][e] || (o[t][e] = 0), o[t][e] += arguments.length < 3 ? 1 : arguments[2], n.set('data', o), n.max < o[t][e]) {
                  return i.get('actx')
                    .clearRect(0, 0, i.get('width'), i.get('height')), void n.setDataSet({
                    max: o[t][e],
                    data: o
                  }, !0);
                }
                i.drawAlpha(t, e, o[t][e], !0);
              }
            },
            setDataSet (t, e) {
              const n = this;
                const i = n.get('heatmap');
                const o = [];
                const a = t.data;
                let r = a.length;
              if (i.clear(), this.max = t.max, i.get('legend') && i.get('legend')
                .update(t.max), e != null && e) {
                for (const s in a) if (void 0 !== s) for (const l in a[s]) void 0 !== l && i.drawAlpha(s, l, a[s][l], !1);
              } else {
                for (; r--;) {
                  const c = a[r];
                  i.drawAlpha(c.x, c.y, c.count, !1), o[c.x] || (o[c.x] = []), o[c.x][c.y] || (o[c.x][c.y] = 0), o[c.x][c.y] = c.count;
                }
              }
              i.colorize(), this.set('data', a);
            },
            exportDataSet () {
              const t = this;
                const e = t.get('data');
                const n = [];
              for (const i in e) {
                if (void 0 !== i) {
                  for (const o in e[i]) {
                    void 0 !== o && n.push({
                      x: parseInt(i, 10),
                      y: parseInt(o, 10),
                      count: e[i][o]
                    });
                  }
                }
              }
              return {
                max: t.max,
                data: n
              };
            },
            generateRandomDataSet (t) {
              const e = this.get('heatmap');
                const n = e.get('width');
                const i = e.get('height');
                const o = {};
                const a = Math.floor(1e3 * Math.random() + 1);
              o.max = a;
              for (var r = []; t--;) {
                r.push({
                  x: Math.floor(Math.random() * n + 1),
                  y: Math.floor(Math.random() * i + 1),
                  count: Math.floor(Math.random() * a + 1)
                });
              }
              o.data = r, this.setDataSet(o);
            }
          };
          const e = function (t) {
            this.config = t;
            const e = {
              element: null,
              labelsEl: null,
              gradientCfg: null,
              ctx: null
            };
            this.get = function (t) {
              return e[t];
            }, this.set = function (t, n) {
              e[t] = n;
            }, this.init();
          };
          e.prototype = {
            init () {
              let t;
                let e;
                const n = this;
                const i = n.config;
                const o = i.title || 'Legend';
                const a = i.position;
                const r = i.offset || 10;
                const s = (i.gradient, document.createElement('ul'));
                let l = '';
              n.processGradientObject(), a.indexOf('t') > -1 ? l += `top:${r}px;` : l += `bottom:${r}px;`, a.indexOf('l') > -1 ? l += `left:${r}px;` : l += `right:${r}px;`, t = document.createElement('div'), t.style.cssText = `border-radius:5px;position:absolute;${l}font-family:Helvetica; width:256px;z-index:10000000000; background:rgba(255,255,255,1);padding:10px;border:1px solid black;margin:0;`, t.innerHTML = `<h3 style='padding:0;margin:0;text-align:center;font-size:16px;'>${o}</h3>`, s.style.cssText = 'position:relative;font-size:12px;display:block;list-style:none;list-style-type:none;margin:0;height:15px;', e = document.createElement('div'), e.style.cssText = ['position:relative;display:block;width:256px;height:15px;border-bottom:1px solid black; background-image:url(', n.createGradientImage(), ');'].join(''), t.appendChild(s), t.appendChild(e), n.set('element', t), n.set('labelsEl', s), n.update(1);
            },
            processGradientObject () {
              const t = this;
                const e = this.config.gradient;
                const n = [];
              for (const i in e) {
                e.hasOwnProperty(i) && n.push({
                  stop: i,
                  value: e[i]
                });
              }
              n.sort((t, e) => t.stop - e.stop), n.unshift({
                stop: 0,
                value: 'rgba(0,0,0,0)'
              }), t.set('gradientArr', n);
            },
            createGradientImage () {
              let t;
                const e = this;
                const n = e.get('gradientArr');
                const i = n.length;
                const o = document.createElement('canvas');
                const a = o.getContext('2d');
              o.width = '256', o.height = '15', t = a.createLinearGradient(0, 5, 256, 10);
              for (var r = 0; r < i; r++) t.addColorStop(1 / (i - 1) * r, n[r].value);
              a.fillStyle = t, a.fillRect(0, 5, 256, 10), a.strokeStyle = 'black', a.beginPath();
              for (var r = 0; r < i; r++) a.moveTo(0.5 + (1 / (i - 1) * r * 256 >> 0), 0), a.lineTo(0.5 + (1 / (i - 1) * r * 256 >> 0), r == 0 ? 15 : 5);
              return a.moveTo(255.5, 0), a.lineTo(255.5, 15), a.moveTo(255.5, 4.5), a.lineTo(0, 4.5), a.stroke(), e.set('ctx', a), o.toDataURL();
            },
            getElement () {
              return this.get('element');
            },
            update (t) {
              for (var e, n, i = this, o = i.get('gradientArr'), a = i.get('ctx'), r = i.get('labelsEl'), s = '', l = 0; l < o.length; l++) e = t * o[l].stop >> 0, n = a.measureText(e).width / 2 >> 0, l == 0 && (n = 0), l == o.length - 1 && (n *= 2), s += `<li style="position:absolute;left:${((1 / (o.length - 1) * l * 256 || 0) >> 0) - n + 0.5}px">${e}</li>`;
              r.innerHTML = s;
            }
          };
          const n = function (e) {
            const n = {
              radius: 40,
              element: {},
              canvas: {},
              acanvas: {},
              ctx: {},
              actx: {},
              legend: null,
              visible: !0,
              width: 0,
              height: 0,
              max: !1,
              gradient: !1,
              opacity: 180,
              premultiplyAlpha: !1,
              bounds: {
                l: 1e3,
                r: 0,
                t: 1e3,
                b: 0
              },
              debug: !1
            };
            this.store = new t(this), this.get = function (t) {
              return n[t];
            }, this.set = function (t, e) {
              n[t] = e;
            }, this.configure(e), this.init();
          };
          return n.prototype = {
            configure (t) {
              const n = this;
              if (n.set('radius', t.radius || 40), n.set('element', t.element instanceof Object ? t.element : document.getElementById(t.element)), n.set('visible', t.visible == null || t.visible), n.set('max', t.max || !1), n.set('gradient', t.gradient || {
                0.45: 'rgb(0,0,255)',
                0.55: 'rgb(0,255,255)',
                0.65: 'rgb(0,255,0)',
                0.95: 'yellow',
                1: 'rgb(255,0,0)'
              }), n.set('opacity', parseInt(255 / (100 / t.opacity), 10) || 180), n.set('width', t.width || 0), n.set('height', t.height || 0), n.set('debug', t.debug), t.legend) {
                const i = t.legend;
                i.gradient = n.get('gradient'), n.set('legend', new e(i));
              }
            },
            resize () {
              const t = this;
                const e = t.get('element');
                const n = t.get('canvas');
                const i = t.get('acanvas');
              n.width = i.width = t.get('width') || e.style.width.replace(/px/, '') || t.getWidth(e), this.set('width', n.width), n.height = i.height = t.get('height') || e.style.height.replace(/px/, '') || t.getHeight(e), this.set('height', n.height);
            },
            init () {
              const t = this;
                const e = document.createElement('canvas');
                const n = document.createElement('canvas');
                const i = e.getContext('2d');
                const o = n.getContext('2d');
                const a = t.get('element');
              t.initColorPalette(), t.set('canvas', e), t.set('ctx', i), t.set('acanvas', n), t.set('actx', o), t.resize(), e.style.cssText = n.style.cssText = 'position:absolute;top:0;left:0;z-index:10000000;', t.get('visible') || (e.style.display = 'none'), a.appendChild(e), t.get('legend') && a.appendChild(t.get('legend')
                .getElement()), t.get('debug') && document.body.appendChild(n), o.shadowOffsetX = 15e3, o.shadowOffsetY = 15e3, o.shadowBlur = 15;
            },
            initColorPalette () {
              let t;
                let e;
                let n;
                const i = this;
                const o = document.createElement('canvas');
                const a = i.get('gradient');
              o.width = '1', o.height = '256', t = o.getContext('2d'), e = t.createLinearGradient(0, 0, 1, 256), n = t.getImageData(0, 0, 1, 1), n.data[0] = n.data[3] = 64, n.data[1] = n.data[2] = 0, t.putImageData(n, 0, 0), n = t.getImageData(0, 0, 1, 1), i.set('premultiplyAlpha', n.data[0] < 60 || n.data[0] > 70);
              for (const r in a) e.addColorStop(r, a[r]);
              t.fillStyle = e, t.fillRect(0, 0, 1, 256), i.set('gradient', t.getImageData(0, 0, 1, 256).data);
            },
            getWidth (t) {
              let e = t.offsetWidth;
              return t.style.paddingLeft && (e += t.style.paddingLeft), t.style.paddingRight && (e += t.style.paddingRight), e;
            },
            getHeight (t) {
              let e = t.offsetHeight;
              return t.style.paddingTop && (e += t.style.paddingTop), t.style.paddingBottom && (e += t.style.paddingBottom), e;
            },
            colorize (t, e) {
              let n;
                let i;
                let o;
                let a;
                let r;
                let s;
                let l;
                let c;
                let u;
                const h = this;
                const p = h.get('width');
                const d = h.get('radius');
                const f = h.get('height');
                const m = h.get('actx');
                const g = h.get('ctx');
                const y = 3 * d;
                const v = h.get('premultiplyAlpha');
                const _ = h.get('gradient');
                const b = h.get('opacity');
                const x = h.get('bounds');
              t != null && e != null ? (t + y > p && (t = p - y), t < 0 && (t = 0), e < 0 && (e = 0), e + y > f && (e = f - y), n = t, i = e, a = t + y, o = e + y) : (n = x.l < 0 ? 0 : x.l, a = x.r > p ? p : x.r, i = x.t < 0 ? 0 : x.t, o = x.b > f ? f : x.b), r = m.getImageData(n, i, a - n, o - i), s = r.data.length;
              for (let w = 3; w < s; w += 4) l = r.data[w], c = 4 * l, c && (u = l < b ? l : b, r.data[w - 3] = _[c], r.data[w - 2] = _[c + 1], r.data[w - 1] = _[c + 2], v && (r.data[w - 3] /= 255 / u, r.data[w - 2] /= 255 / u, r.data[w - 1] /= 255 / u), r.data[w] = u);
              g.putImageData(r, n, i);
            },
            drawAlpha (t, e, n, i) {
              const o = this;
                const a = o.get('radius');
                const r = o.get('actx');
                const s = (o.get('max'), o.get('bounds'));
                const l = t - 1.5 * a >> 0;
                const c = e - 1.5 * a >> 0;
                const u = t + 1.5 * a >> 0;
                const h = e + 1.5 * a >> 0;
              r.shadowColor = `rgba(0,0,0,${n ? n / o.store.max : '0.1'})`, r.shadowOffsetX = 15e3, r.shadowOffsetY = 15e3, r.shadowBlur = 15, r.beginPath(), r.arc(t - 15e3, e - 15e3, a, 0, 2 * Math.PI, !0), r.closePath(), r.fill(), i ? o.colorize(l, c) : (l < s.l && (s.l = l), c < s.t && (s.t = c), u > s.r && (s.r = u), h > s.b && (s.b = h));
            },
            toggleDisplay () {
              const t = this;
                const e = t.get('visible');
                const n = t.get('canvas');
              n.style.display = e ? 'none' : 'block', t.set('visible', !e);
            },
            getImageData () {
              return this.get('canvas')
                .toDataURL();
            },
            clear () {
              const t = this;
                const e = t.get('width');
                const n = t.get('height');
              t.store.set('data', []), t.get('ctx')
                .clearRect(0, 0, e, n), t.get('actx')
                .clearRect(0, 0, e, n);
            },
            cleanup () {
              const t = this;
              t.get('element')
                .removeChild(t.get('canvas'));
            }
          }, {
            create (t) {
              return new n(t);
            },
            util: {
              mousePosition (t) {
                let e;
                  let n;
                if (t.layerX ? (e = t.layerX, n = t.layerY) : t.offsetX && (e = t.offsetX, n = t.offsetY), void 0 !== e) return [e, n];
              }
            }
          };
        }());
        var n = function (e) {
          try {
            BMap;
          } catch (t) {
            throw Error('Baidu Map JS API is not ready yet!');
          }
          if (!n._isExtended) {
            n._isExtended = !0, t(n, BMap.Overlay, 'HeatmapOverlay');
            const i = new n(e);
            this.__proto__ = i.__proto__;
          }
          this.conf = e, this.heatmap = null, this.latlngs = [], this.bounds = null, this._moveendHandler = this._moveendHandler.bind(this);
        };
      return n.prototype.initialize = function (t) {
        this._map = t;
        const n = document.createElement('div');
        return n.style.position = 'absolute', n.style.top = 0, n.style.left = 0, n.style.border = 0, n.style.width = `${this._map.getSize().width}px`, n.style.height = `${this._map.getSize().height}px`, this.conf.element = n, t.getPanes()
          .mapPane
          .appendChild(n), this.heatmap = e.create(this.conf), this._div = n, n;
      }, n.prototype.draw = function () {
        const t = this._map.getBounds();
        if (!t.equals(this.bounds)) {
          this.bounds = t;
          const e = this._map.pointToOverlayPixel(t.getNorthEast());
            const n = this._map.pointToOverlayPixel(t.getSouthWest());
          if (e && n) {
            const i = e.y;
              const o = n.x;
              const a = n.y - e.y;
              const r = e.x - n.x;
            if (this.conf.element.style.left = `${o}px`, this.conf.element.style.top = `${i}px`, this.conf.element.style.width = `${r}px`, this.conf.element.style.height = `${a}px`, this.heatmap.store.get('heatmap')
              .resize(), this.latlngs.length > 0) {
              this.heatmap.clear();
              for (var s = this.latlngs.length, l = {
                max: this.heatmap.store.max,
                data: []
              }; s--;) {
                const c = this.latlngs[s].latlng;
                if (t.containsPoint(c)) {
                  const u = this._map.pointToOverlayPixel(c);
                    const h = new BMap.Pixel(u.x - o, u.y - i);
                    const p = this.pixelTransform(h);
                  l.data.push({
                    x: p.x,
                    y: p.y,
                    count: this.latlngs[s].c
                  });
                }
              }
              this.heatmap.store.setDataSet(l);
            }
          }
        }
      }, n.prototype.pixelTransform = function (t) {
        for (var e = this.heatmap.get('width'), n = this.heatmap.get('height'); t.x < 0;) t.x += e;
        for (; t.x > e;) t.x -= e;
        for (; t.y < 0;) t.y += n;
        for (; t.y > n;) t.y -= n;
        return t.x >>= 0, t.y >>= 0, t;
      }, n.prototype._moveendHandler = function (t) {
        this.setDataSet(this._data), delete this._data, this._map.removeEventListener('moveend', this._moveendHandler);
      }, n.prototype.setDataSet = function (t) {
        if (this._map) {
          const e = this._map.getBounds();
            const n = this._map.pointToOverlayPixel(e.getNorthEast());
            const i = this._map.pointToOverlayPixel(e.getSouthWest());
          n && i || (this._data = t, this._map.addEventListener('moveend', this._moveendHandler));
          const o = {
              max: t.max,
              data: []
            };
            const a = t.data;
            let r = a.length;
          for (this.latlngs = []; r--;) {
            const s = new BMap.Point(a[r].lng, a[r].lat);
            if (this.latlngs.push({
              latlng: s,
              c: a[r].count
            }), e.containsPoint(s)) {
              const l = this._map.pointToOverlayPixel(s);
                const c = this._map.pointToOverlayPixel(e.getSouthWest()).x;
                const u = this._map.pointToOverlayPixel(e.getNorthEast()).y;
                const h = new BMap.Pixel(l.x - c, l.y - u);
                const p = this.pixelTransform(h);
              o.data.push({
                x: p.x,
                y: p.y,
                count: a[r].count
              });
            }
          }
          this.heatmap.clear(), this.heatmap.store.setDataSet(o);
        }
      }, n.prototype.addDataPoint = function (t, e, n) {
        const i = new BMap.Point(t, e);
          const o = this.pixelTransform(this._map.pointToOverlayPixel(i));
        this.heatmap.store.addDataPoint(o.x, o.y, n), this.latlngs.push({
          latlng: i,
          c: n
        });
      }, n.prototype.toggle = function () {
        this.heatmap.toggleDisplay();
      }, n;
    }));
  }, function (t, e, n) {
    !(function (e, n) {
      t.exports = n();
    }(0, () => {
      function t(t, e) {
        this._point = t, this._html = e;
      }

      function e() {
        t.prototype = new BMap.Overlay(), t.prototype.initialize = function (t) {
          const e = this._div = n.dom.create('div', { style: 'border:solid 1px #ccc;width:auto;min-width:50px;text-align:center;position:absolute;background:#fff;color:#000;font-size:12px;border-radius: 10px;padding:5px;white-space: nowrap;' });
          return e.innerHTML = this._html, t.getPanes()
            .floatPane
            .appendChild(e), this._map = t, e;
        }, t.prototype.draw = function () {
          this.setPosition(this.lushuMain._marker.getPosition(), this.lushuMain._marker.getIcon().size);
        }, n.object.extend(t.prototype, {
          setPosition (t, e) {
            const i = this._map.pointToOverlayPixel(t);
              const o = n.dom.getStyle(this._div, 'width');
              const a = n.dom.getStyle(this._div, 'height');
              const r = parseInt(this._div.clientWidth || o, 10);
            parseInt(this._div.clientHeight || a, 10);
            this._div.style.left = `${i.x - r / 2}px`, this._div.style.bottom = `${-(i.y - e.height)}px`;
          },
          setHtml (t) {
            this._div.innerHTML = t;
          },
          setRelatedClass (t) {
            this.lushuMain = t;
          }
        });
      }

      var n = {};
      n.dom = {}, n.dom.g = function (t) {
        return typeof t === 'string' || t instanceof String ? document.getElementById(t) : t && t.nodeName && (t.nodeType == 1 || t.nodeType == 9) ? t : null;
      }, n.g = n.G = n.dom.g, n.lang = n.lang || {}, n.lang.isString = function (t) {
        return Object.prototype.toString.call(t) == '[object String]';
      }, n.isString = n.lang.isString, n.dom._g = function (t) {
        return n.lang.isString(t) ? document.getElementById(t) : t;
      }, n._g = n.dom._g, n.dom.getDocument = function (t) {
        return t = n.dom.g(t), t.nodeType == 9 ? t : t.ownerDocument || t.document;
      }, n.browser = n.browser || {}, n.browser.ie = n.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp.$1 : void 0, n.dom.getComputedStyle = function (t, e) {
        t = n.dom._g(t);
        let i;
          const o = n.dom.getDocument(t);
        return o.defaultView && o.defaultView.getComputedStyle && (i = o.defaultView.getComputedStyle(t, null)) ? i[e] || i.getPropertyValue(e) : '';
      }, n.dom._styleFixer = n.dom._styleFixer || {}, n.dom._styleFilter = n.dom._styleFilter || [], n.dom._styleFilter.filter = function (t, e, i) {
        for (var o, a = 0, r = n.dom._styleFilter; o = r[a]; a++) (o = o[i]) && (e = o(t, e));
        return e;
      }, n.string = n.string || {}, n.string.toCamelCase = function (t) {
        return t.indexOf('-') < 0 && t.indexOf('_') < 0 ? t : t.replace(/[-_][^-_]/g, (t) => t.charAt(1)
            .toUpperCase());
      }, n.dom.getStyle = function (t, e) {
        const i = n.dom;
        t = i.g(t), e = n.string.toCamelCase(e);
        let o = t.style[e] || (t.currentStyle ? t.currentStyle[e] : '') || i.getComputedStyle(t, e);
        if (!o) {
          var a = i._styleFixer[e];
          a && (o = a.get ? a.get(t) : n.dom.getStyle(t, a));
        }
        return (a = i._styleFilter) && (o = a.filter(e, o, 'get')), o;
      }, n.getStyle = n.dom.getStyle, n.dom._NAME_ATTRS = (function () {
        const t = {
          cellpadding: 'cellPadding',
          cellspacing: 'cellSpacing',
          colspan: 'colSpan',
          rowspan: 'rowSpan',
          valign: 'vAlign',
          usemap: 'useMap',
          frameborder: 'frameBorder'
        };
        return n.browser.ie < 8 ? (t.for = 'htmlFor', t.class = 'className') : (t.htmlFor = 'for', t.className = 'class'), t;
      }()), n.dom.setAttr = function (t, e, i) {
        return t = n.dom.g(t), e == 'style' ? t.style.cssText = i : (e = n.dom._NAME_ATTRS[e] || e, t.setAttribute(e, i)), t;
      }, n.setAttr = n.dom.setAttr, n.dom.setAttrs = function (t, e) {
        t = n.dom.g(t);
        for (const i in e) n.dom.setAttr(t, i, e[i]);
        return t;
      }, n.setAttrs = n.dom.setAttrs, n.dom.create = function (t, e) {
        const i = document.createElement(t);
          const o = e || {};
        return n.dom.setAttrs(i, o);
      }, n.object = n.object || {}, n.extend = n.object.extend = function (t, e) {
        for (const n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
        return t;
      };
      const i = function (t, e, n) {
        try {
          BMap;
        } catch (t) {
          throw Error('Baidu Map JS API is not ready yet!');
        }
        !e || e.length < 1 || (this._map = t, this._path = e, this.i = 0, this._setTimeoutQuene = [], this._projection = this._map.getMapType()
          .getProjection(), this._opts = {
          icon: null,
          speed: 4e3,
          defaultContent: '',
          showInfoWindow: !1
        }, this._setOptions(n), this._rotation = 0, !this._opts.icon instanceof BMap.Icon && (this._opts.icon = defaultIcon));
      };
      return i.prototype._setOptions = function (t) {
        if (t) for (const e in t) t.hasOwnProperty(e) && (this._opts[e] = t[e]);
      }, i.prototype.start = function () {
        const t = this;
          const e = t._path.length;
        if (this._opts.onstart && this._opts.onstart(t), t.i && t.i < e - 1) {
          if (!t._fromPause) return;
          t._fromStop || t._moveNext(++t.i);
        } else {
          !t._marker && t._addMarker(), t._timeoutFlag = setTimeout(() => {
            !t._overlay && t._addInfoWin(), t._moveNext(t.i);
          }, 400);
        }
        this._fromPause = !1, this._fromStop = !1;
      }, i.prototype.stop = function () {
        this.i = 0, this._fromStop = !0, clearInterval(this._intervalFlag), this._clearTimeout();
        for (let t = 0, e = this._opts.landmarkPois, n = e.length; t < n; t++) e[t].bShow = !1;
        this._opts.onstop && this._opts.onstop(this);
      }, i.prototype.pause = function () {
        clearInterval(this._intervalFlag), this._fromPause = !0, this._clearTimeout(), this._opts.onpause && this._opts.onpause(this);
      }, i.prototype.hideInfoWindow = function () {
        this._opts.showInfoWindow = !1, this._overlay && (this._overlay._div.style.visibility = 'hidden');
      }, i.prototype.showInfoWindow = function () {
        this._opts.showInfoWindow = !0, this._overlay && (this._overlay._div.style.visibility = 'visible');
      }, i.prototype.dispose = function () {
        clearInterval(this._intervalFlag), this._setTimeoutQuene && this._clearTimeout(), this._map && (this._map.removeOverlay(this._overlay), this._map.removeOverlay(this._marker));
      }, n.object.extend(i.prototype, {
        _addMarker (t) {
          this._marker && (this.stop(), this._map.removeOverlay(this._marker), clearTimeout(this._timeoutFlag)), this._overlay && this._map.removeOverlay(this._overlay);
          const e = new BMap.Marker(this._path[0]);
          this._opts.icon && e.setIcon(this._opts.icon), this._map.addOverlay(e), e.setAnimation(BMAP_ANIMATION_DROP), this._marker = e;
        },
        _addInfoWin () {
          const n = this;
          !t.prototype.initialize && e();
          const i = new t(n._marker.getPosition(), n._opts.defaultContent);
          i.setRelatedClass(this), this._overlay = i, this._map.addOverlay(i), this._opts.showInfoWindow ? this.showInfoWindow() : this.hideInfoWindow();
        },
        _getMercator (t) {
          return this._map.getMapType()
            .getProjection()
            .lngLatToPoint(t);
        },
        _getDistance (t, e) {
          return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
        },
        _move (t, e, n) {
          const i = this;
            let o = 0;
            const a = this._opts.speed / 100;
            const r = this._projection.lngLatToPoint(t);
            const s = this._projection.lngLatToPoint(e);
            const l = Math.round(i._getDistance(r, s) / a);
          if (l < 1) return void i._moveNext(++i.i);
          i._intervalFlag = setInterval(() => {
            if (o >= l) {
              if (clearInterval(i._intervalFlag), i.i > i._path.length) return;
              i._moveNext(++i.i);
            } else {
              o++;
              const a = n(r.x, s.x, o, l);
                const c = n(r.y, s.y, o, l);
                const u = i._projection.pointToLngLat(new BMap.Pixel(a, c));
              if (o == 1) {
                let h = null;
                i.i - 1 >= 0 && (h = i._path[i.i - 1]), i._opts.enableRotation == 1 && i.setRotation(h, t, e), i._opts.autoView && (i._map.getBounds()
                  .containsPoint(u) || i._map.setCenter(u));
              }
              i._marker.setPosition(u), i._setInfoWin(u);
            }
          }, 10);
        },
        setRotation (t, e, n) {
          const i = this;
            let o = 0;
          if (e = i._map.pointToPixel(e), n = i._map.pointToPixel(n), n.x != e.x) {
            const a = (n.y - e.y) / (n.x - e.x);
            o = 360 * Math.atan(a) / (2 * Math.PI), o = n.x < e.x ? 90 - o + 90 : -o, i._marker.setRotation(-o);
          } else {
            const r = n.y - e.y;
              let s = 0;
            s = r > 0 ? -1 : 1, i._marker.setRotation(90 * -s);
          }
        },
        linePixellength (t, e) {
          return Math.sqrt(Math.abs(t.x - e.x) * Math.abs(t.x - e.x) + Math.abs(t.y - e.y) * Math.abs(t.y - e.y));
        },
        pointToPoint (t, e) {
          return Math.abs(t.x - e.x) * Math.abs(t.x - e.x) + Math.abs(t.y - e.y) * Math.abs(t.y - e.y);
        },
        _moveNext (t) {
          const e = this;
          t < this._path.length - 1 ? e._move(e._path[t], e._path[t + 1], e._tween.linear) : e.stop();
        },
        _setInfoWin (t) {
          const e = this;
          e._overlay.setPosition(t, e._marker.getIcon().size);
          const n = e._troughPointIndex(t);
          n != -1 ? (clearInterval(e._intervalFlag), e._overlay.setHtml(e._opts.landmarkPois[n].html), e._overlay.setPosition(t, e._marker.getIcon().size), e._pauseForView(n)) : e._overlay.setHtml(e._opts.defaultContent);
        },
        _pauseForView (t) {
          const e = this;
            const n = setTimeout(() => {
              e._moveNext(++e.i);
            }, 1e3 * e._opts.landmarkPois[t].pauseTime);
          e._setTimeoutQuene.push(n);
        },
        _clearTimeout () {
          for (const t in this._setTimeoutQuene) clearTimeout(this._setTimeoutQuene[t]);
          this._setTimeoutQuene.length = 0;
        },
        _tween: {
          linear (t, e, n, i) {
            return (e - t) * n / i + t;
          }
        },
        _troughPointIndex (t) {
          for (let e = this._opts.landmarkPois, n = 0, i = e.length; n < i; n++) if (!e[n].bShow && this._map.getDistance(new BMap.Point(e[n].lng, e[n].lat), t) < 10) return e[n].bShow = !0, n;
          return -1;
        }
      }), i;
    }));
  }, function (t, e, n) {
    (function (e) {
      let i;
        let o;
      !(function (e, n) {
        t.exports = n();
      }(0, function () {
        function t(t) {
          this._markerClusterer = t, this._map = t.getMap(), this._minClusterSize = t.getMinClusterSize(), this._isAverageCenter = t.isAverageCenter(), this._center = null, this._markers = [], this._gridBounds = null, this._isReal = !1, this._clusterMarker = new s(this._center, this._markers.length, { styles: this._markerClusterer.getStyles() });
        }

        const a = typeof window !== 'undefined' ? window : void 0 !== e ? e : this;
          const r = (function (t, e) {
            return e = { exports: {} }, t(e, e.exports, a), e.exports;
          }((t, e, a) => {
            !(function (a, r) {
              typeof e === 'object' ? t.exports = r() : (i = r, void 0 !== (o = typeof i === 'function' ? i.call(e, n, e, t) : i) && (t.exports = o));
            }(0, () => {
              let t;
                var e = t = e || { version: '1.3.8' };
                const n = {};
              e.guid = '$BAIDU$', n[e.guid] = n[e.guid] || {}, e.dom = e.dom || {}, e.dom.g = function (t) {
                return typeof t === 'string' || t instanceof String ? document.getElementById(t) : t && t.nodeName && (t.nodeType == 1 || t.nodeType == 9) ? t : null;
              }, e.g = e.G = e.dom.g, e.dom.getDocument = function (t) {
                return t = e.dom.g(t), t.nodeType == 9 ? t : t.ownerDocument || t.document;
              }, e.lang = e.lang || {}, e.lang.isString = function (t) {
                return Object.prototype.toString.call(t) == '[object String]';
              }, e.isString = e.lang.isString, e.dom._g = function (t) {
                return e.lang.isString(t) ? document.getElementById(t) : t;
              }, e._g = e.dom._g, e.browser = e.browser || {}, /msie (\d+\.\d)/i.test(navigator.userAgent) && (e.browser.ie = e.ie = document.documentMode || +RegExp.$1), e.dom.getComputedStyle = function (t, n) {
                t = e.dom._g(t);
                let i;
                  const o = e.dom.getDocument(t);
                return o.defaultView && o.defaultView.getComputedStyle && (i = o.defaultView.getComputedStyle(t, null)) ? i[n] || i.getPropertyValue(n) : '';
              }, e.dom._styleFixer = e.dom._styleFixer || {}, e.dom._styleFilter = e.dom._styleFilter || [], e.dom._styleFilter.filter = function (t, n, i) {
                for (var o, a = 0, r = e.dom._styleFilter; o = r[a]; a++) (o = o[i]) && (n = o(t, n));
                return n;
              }, e.string = e.string || {}, e.string.toCamelCase = function (t) {
                return t.indexOf('-') < 0 && t.indexOf('_') < 0 ? t : t.replace(/[-_][^-_]/g, (t) => t.charAt(1)
                    .toUpperCase());
              }, e.dom.getStyle = function (t, n) {
                const i = e.dom;
                t = i.g(t), n = e.string.toCamelCase(n);
                let o = t.style[n] || (t.currentStyle ? t.currentStyle[n] : '') || i.getComputedStyle(t, n);
                if (!o) {
                  var a = i._styleFixer[n];
                  a && (o = a.get ? a.get(t) : e.dom.getStyle(t, a));
                }
                return (a = i._styleFilter) && (o = a.filter(n, o, 'get')), o;
              }, e.getStyle = e.dom.getStyle, /opera\/(\d+\.\d)/i.test(navigator.userAgent) && (e.browser.opera = +RegExp.$1), e.browser.isWebkit = /webkit/i.test(navigator.userAgent), e.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent), e.browser.isStrict = document.compatMode == 'CSS1Compat', e.dom.getPosition = function (t) {
                t = e.dom.g(t);
                let n;
                  let i;
                  const o = e.dom.getDocument(t);
                  const a = e.browser;
                  const r = e.dom.getStyle;
                  const s = (a.isGecko > 0 && o.getBoxObjectFor && r(t, 'position') == 'absolute' && (t.style.top === '' || t.style.left), {
                    left: 0,
                    top: 0
                  });
                  const l = a.ie && !a.isStrict ? o.body : o.documentElement;
                if (t == l) return s;
                if (t.getBoundingClientRect) {
                  i = t.getBoundingClientRect(), s.left = Math.floor(i.left) + Math.max(o.documentElement.scrollLeft, o.body.scrollLeft), s.top = Math.floor(i.top) + Math.max(o.documentElement.scrollTop, o.body.scrollTop), s.left -= o.documentElement.clientLeft, s.top -= o.documentElement.clientTop;
                  const c = o.body;
                    const u = parseInt(r(c, 'borderLeftWidth'));
                    const h = parseInt(r(c, 'borderTopWidth'));
                  a.ie && !a.isStrict && (s.left -= isNaN(u) ? 2 : u, s.top -= isNaN(h) ? 2 : h);
                } else {
                  n = t;
                  do {
                    if (s.left += n.offsetLeft, s.top += n.offsetTop, a.isWebkit > 0 && r(n, 'position') == 'fixed') {
                      s.left += o.body.scrollLeft, s.top += o.body.scrollTop;
                      break;
                    }
                    n = n.offsetParent;
                  } while (n && n != t);
                  for ((a.opera > 0 || a.isWebkit > 0 && r(t, 'position') == 'absolute') && (s.top -= o.body.offsetTop), n = t.offsetParent; n && n != o.body;) s.left -= n.scrollLeft, a.opera && n.tagName == 'TR' || (s.top -= n.scrollTop), n = n.offsetParent;
                }
                return s;
              }, e.event = e.event || {}, e.event._listeners = e.event._listeners || [], e.event.on = function (t, n, i) {
                n = n.replace(/^on/i, ''), t = e.dom._g(t);
                let o;
                  let a = function (e) {
                    i.call(t, e);
                  };
                  const r = e.event._listeners;
                  const s = e.event._eventFilter;
                  let l = n;
                return n = n.toLowerCase(), s && s[n] && (o = s[n](t, n, a), l = o.type, a = o.listener), t.addEventListener ? t.addEventListener(l, a, !1) : t.attachEvent && t.attachEvent(`on${l}`, a), r[r.length] = [t, n, i, a, l], t;
              }, e.on = e.event.on, (function () {
                const t = n[e.guid];
                e.lang.guid = function () {
                  return `TANGRAM__${(t._counter++).toString(36)}`;
                }, t._counter = t._counter || 1;
              }()), n[e.guid]._instances = n[e.guid]._instances || {}, e.lang.isFunction = function (t) {
                return Object.prototype.toString.call(t) == '[object Function]';
              }, e.lang.Class = function (t) {
                this.guid = t || e.lang.guid(), n[e.guid]._instances[this.guid] = this;
              }, n[e.guid]._instances = n[e.guid]._instances || {}, e.lang.Class.prototype.dispose = function () {
                delete n[e.guid]._instances[this.guid];
                for (const t in this) e.lang.isFunction(this[t]) || delete this[t];
                this.disposed = !0;
              }, e.lang.Class.prototype.toString = function () {
                return `[object ${this._className || 'Object'}]`;
              }, e.lang.Event = function (t, e) {
                this.type = t, this.returnValue = !0, this.target = e || null, this.currentTarget = null;
              }, e.lang.Class.prototype.addEventListener = function (t, n, i) {
                if (e.lang.isFunction(n)) {
                  !this.__listeners && (this.__listeners = {});
                  let o;
                    const a = this.__listeners;
                  if (typeof i === 'string' && i) {
                    if (/[^\w\-]/.test(i)) throw `nonstandard key:${i}`;
                    n.hashCode = i, o = i;
                  }
                  t.indexOf('on') != 0 && (t = `on${t}`), typeof a[t] !== 'object' && (a[t] = {}), o = o || e.lang.guid(), n.hashCode = o, a[t][o] = n;
                }
              }, e.lang.Class.prototype.removeEventListener = function (t, n) {
                if (void 0 === n || (!e.lang.isFunction(n) || (n = n.hashCode)) && e.lang.isString(n)) {
                  !this.__listeners && (this.__listeners = {}), t.indexOf('on') != 0 && (t = `on${t}`);
                  const i = this.__listeners;
                  if (i[t]) if (void 0 !== n) i[t][n] && delete i[t][n]; else for (const o in i[t]) delete i[t][o];
                }
              }, e.lang.Class.prototype.dispatchEvent = function (t, n) {
                e.lang.isString(t) && (t = new e.lang.Event(t)), !this.__listeners && (this.__listeners = {}), n = n || {};
                for (var i in n) t[i] = n[i];
                var i;
                  const o = this.__listeners;
                  let a = t.type;
                if (t.target = t.target || this, t.currentTarget = this, a.indexOf('on') != 0 && (a = `on${a}`), e.lang.isFunction(this[a]) && this[a].apply(this, arguments), typeof o[a] === 'object') for (i in o[a]) o[a][i].apply(this, arguments);
                return t.returnValue;
              }, e.lang.inherits = function (t, e, n) {
                let i;
                  let o;
                  const a = t.prototype;
                  const r = new Function();
                r.prototype = e.prototype, o = t.prototype = new r();
                for (i in a) o[i] = a[i];
                t.prototype.constructor = t, t.superClass = e.prototype, typeof n === 'string' && (o._className = n);
              }, e.inherits = e.lang.inherits;
              var i = function (e, n, o) {
                try {
                  BMap;
                } catch (t) {
                  throw Error('Baidu Map JS API is not ready yet!');
                }
                t.lang.inherits(i, BMap.Overlay, 'TextIconOverlay'), this._position = e, this._text = n, this._options = o || {}, this._styles = this._options.styles || [], !this._styles.length && this._setupDefaultStyles();
              };
              return i.prototype._setupDefaultStyles = function () {
                for (var t, e = [53, 56, 66, 78, 90], n = 0; t = e[n]; n++) {
                  this._styles.push({
                    url: `http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m${n}.png`,
                    size: new BMap.Size(t, t)
                  });
                }
              }, i.prototype.initialize = function (t) {
                return this._map = t, this._domElement = document.createElement('div'), this._updateCss(), this._updateText(), this._updatePosition(), this._bind(), this._map.getPanes()
                  .markerMouseTarget
                  .appendChild(this._domElement), this._domElement;
              }, i.prototype.draw = function () {
                this._map && this._updatePosition();
              }, i.prototype.getText = function () {
                return this._text;
              }, i.prototype.setText = function (t) {
                !t || this._text && this._text.toString() == t.toString() || (this._text = t, this._updateText(), this._updateCss(), this._updatePosition());
              }, i.prototype.getPosition = function () {
                return this._position;
              }, i.prototype.setPosition = function (t) {
                !t || this._position && this._position.equals(t) || (this._position = t, this._updatePosition());
              }, i.prototype.getStyleByText = function (t, e) {
                const n = parseInt(t);
                  let i = parseInt(n / 10);
                return i = Math.max(0, i), i = Math.min(i, e.length - 1), e[i];
              }, i.prototype._updateCss = function () {
                if (this._domElement) {
                  const t = this.getStyleByText(this._text, this._styles);
                  this._domElement.style.cssText = this._buildCssText(t);
                }
              }, i.prototype._updateText = function () {
                this._domElement && (this._domElement.innerHTML = this._text);
              }, i.prototype._updatePosition = function () {
                if (this._domElement && this._position) {
                  const t = this._domElement.style;
                    const e = this._map.pointToOverlayPixel(this._position);
                  e.x -= Math.ceil(parseInt(t.width) / 2), e.y -= Math.ceil(parseInt(t.height) / 2), t.left = `${e.x}px`, t.top = `${e.y}px`;
                }
              }, i.prototype._buildCssText = function (e) {
                const n = e.url;
                  const i = e.size;
                  const o = e.anchor;
                  const a = e.offset;
                  const r = e.textColor || 'black';
                  const s = e.textSize || 10;
                  const l = [];
                if (t.browser.ie < 7) {
                  l.push(`filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="${n}");`);
                } else {
                  l.push(`background-image:url(${n});`);
                  let c = '0 0';
                  a instanceof BMap.Size && (c = `${a.width}px ${a.height}px`), l.push(`background-position:${c};`);
                }
                return i instanceof BMap.Size && (o instanceof BMap.Size ? (o.height > 0 && o.height < i.height && l.push(`height:${i.height - o.height}px; padding-top:${o.height}px;`), o.width > 0 && o.width < i.width && l.push(`width:${i.width - o.width}px; padding-left:${o.width}px;`)) : (l.push(`height:${i.height}px; line-height:${i.height}px;`), l.push(`width:${i.width}px; text-align:center;`))), l.push(`cursor:pointer; color:${r}; position:absolute; font-size:${s}px; font-family:Arial,sans-serif; font-weight:bold`), l.join('');
              }, i.prototype._bind = function () {
                function e(e, n) {
                  const o = e.srcElement || e.target;
                    const a = e.clientX || e.pageX;
                    const r = e.clientY || e.pageY;
                  if (e && n && a && r && o) {
                    const s = t.dom.getPosition(i.getContainer());
                    n.pixel = new BMap.Pixel(a - s.left, r - s.top), n.point = i.pixelToPoint(n.pixel);
                  }
                  return n;
                }

                if (this._domElement) {
                  const n = this;
                    var i = this._map;
                    const o = t.lang.Event;
                  t.event.on(this._domElement, 'mouseover', (t) => {
                    n.dispatchEvent(e(t, new o('onmouseover')));
                  }), t.event.on(this._domElement, 'mouseout', (t) => {
                    n.dispatchEvent(e(t, new o('onmouseout')));
                  }), t.event.on(this._domElement, 'click', (t) => {
                    n.dispatchEvent(e(t, new o('onclick')));
                  });
                }
              }, i;
            }));
          }));
          var s = r && typeof r === 'object' && 'default' in r ? r.default : r;
          const l = function (t, e, n) {
            e = c(e);
            const i = t.pointToPixel(e.getNorthEast());
              const o = t.pointToPixel(e.getSouthWest());
            i.x += n, i.y -= n, o.x -= n, o.y += n;
            const a = t.pixelToPoint(i);
              const r = t.pixelToPoint(o);
            return new BMap.Bounds(r, a);
          };
          var c = function (t) {
            const e = u(t.getNorthEast().lng, -180, 180);
              const n = u(t.getSouthWest().lng, -180, 180);
              const i = u(t.getNorthEast().lat, -74, 74);
              const o = u(t.getSouthWest().lat, -74, 74);
            return new BMap.Bounds(new BMap.Point(n, o), new BMap.Point(e, i));
          };
          var u = function (t, e, n) {
            return e && (t = Math.max(t, e)), n && (t = Math.min(t, n)), t;
          };
          const h = function (t) {
            return Object.prototype.toString.call(t) === '[object Array]';
          };
          const p = function (t, e) {
            let n = -1;
            if (h(e)) {
              if (e.indexOf) {
                n = e.indexOf(t);
              } else {
                for (var i, o = 0; i = e[o]; o++) {
                  if (i === t) {
                    n = o;
                    break;
                  }
                }
              }
            }
            return n;
          };
          const d = function (t, e) {
            try {
              BMap;
            } catch (t) {
              throw Error('Baidu Map JS API is not ready yet!');
            }
            if (t) {
              this._map = t, this._markers = [], this._clusters = [];
              const n = e || {};
              this._gridSize = n.gridSize || 60, this._maxZoom = n.maxZoom || 18, this._minClusterSize = n.minClusterSize || 2, this._isAverageCenter = !1, void 0 != n.isAverageCenter && (this._isAverageCenter = n.isAverageCenter), this._styles = n.styles || [];
              const i = this;
              this._map.addEventListener('zoomend', () => {
                i._redraw();
              }), this._map.addEventListener('moveend', () => {
                i._redraw();
              });
              const o = n.markers;
              h(o) && this.addMarkers(o);
            }
          };
        return d.prototype.addMarkers = function (t) {
          if (t.length) {
            for (let e = 0, n = t.length; e < n; e++) this._pushMarkerTo(t[e]);
            this._createClusters();
          }
        }, d.prototype._pushMarkerTo = function (t) {
          p(t, this._markers) === -1 && (t.isInCluster = !1, this._markers.push(t));
        }, d.prototype.addMarker = function (t) {
          this._pushMarkerTo(t), this._createClusters();
        }, d.prototype._createClusters = function () {
          const t = this._map.getBounds();
          if (t.getCenter()) for (var e, n = l(this._map, t, this._gridSize), i = 0; e = this._markers[i]; i++) !e.isInCluster && n.containsPoint(e.getPosition()) && this._addToClosestCluster(e);
        }, d.prototype._addToClosestCluster = function (e) {
          for (var n, i = 4e6, o = null, a = (e.getPosition(), 0); n = this._clusters[a]; a++) {
            const r = n.getCenter();
            if (r) {
              const s = this._map.getDistance(r, e.getPosition());
              s < i && (i = s, o = n);
            }
          }
          if (o && o.isMarkerInClusterBounds(e)) {
            o.addMarker(e);
          } else {
            var n = new t(this);
            n.addMarker(e), this._clusters.push(n);
          }
        }, d.prototype._clearLastClusters = function () {
          for (var t, e = 0; t = this._clusters[e]; e++) t.remove();
          this._clusters = [], this._removeMarkersFromCluster();
        }, d.prototype._removeMarkersFromCluster = function () {
          for (var t, e = 0; t = this._markers[e]; e++) t.isInCluster = !1;
        }, d.prototype._removeMarkersFromMap = function () {
          for (var t, e = 0; t = this._markers[e]; e++) {
            t.isInCluster = !1;
            const n = t.getLabel();
            this._map.removeOverlay(t), t.setLabel(n);
          }
        }, d.prototype._removeMarker = function (t) {
          const e = p(t, this._markers);
          return e !== -1 && (this._map.removeOverlay(t), this._markers.splice(e, 1), !0);
        }, d.prototype.removeMarker = function (t) {
          const e = this._removeMarker(t);
          return e && (this._clearLastClusters(), this._createClusters()), e;
        }, d.prototype.removeMarkers = function (t) {
          for (var e = !1, n = 0; n < t.length; n++) {
            const i = this._removeMarker(t[n]);
            e = e || i;
          }
          return e && (this._clearLastClusters(), this._createClusters()), e;
        }, d.prototype.clearMarkers = function () {
          this._clearLastClusters(), this._removeMarkersFromMap(), this._markers = [];
        }, d.prototype._redraw = function () {
          this._clearLastClusters(), this._createClusters();
        }, d.prototype.getGridSize = function () {
          return this._gridSize;
        }, d.prototype.setGridSize = function (t) {
          this._gridSize = t, this._redraw();
        }, d.prototype.getMaxZoom = function () {
          return this._maxZoom;
        }, d.prototype.setMaxZoom = function (t) {
          this._maxZoom = t, this._redraw();
        }, d.prototype.getStyles = function () {
          return this._styles;
        }, d.prototype.setStyles = function (t) {
          this._styles = t, this._redraw();
        }, d.prototype.getMinClusterSize = function () {
          return this._minClusterSize;
        }, d.prototype.setMinClusterSize = function (t) {
          this._minClusterSize = t, this._redraw();
        }, d.prototype.isAverageCenter = function () {
          return this._isAverageCenter;
        }, d.prototype.getMap = function () {
          return this._map;
        }, d.prototype.getMarkers = function () {
          return this._markers;
        }, d.prototype.getClustersCount = function () {
          for (var t, e = 0, n = 0; t = this._clusters[n]; n++) t.isReal() && e++;
          return e;
        }, t.prototype.addMarker = function (t) {
          if (this.isMarkerInCluster(t)) return !1;
          if (this._center) {
            if (this._isAverageCenter) {
              const e = this._markers.length + 1;
                const n = (this._center.lat * (e - 1) + t.getPosition().lat) / e;
                const i = (this._center.lng * (e - 1) + t.getPosition().lng) / e;
              this._center = new BMap.Point(i, n), this.updateGridBounds();
            }
          } else {
            this._center = t.getPosition(), this.updateGridBounds();
          }
          t.isInCluster = !0, this._markers.push(t);
          const o = this._markers.length;
          if (o < this._minClusterSize) return this._map.addOverlay(t), !0;
          if (o === this._minClusterSize) {
            for (let a = 0; a < o; a++) {
              const r = this._markers[a].getLabel();
              this._markers[a].getMap() && this._map.removeOverlay(this._markers[a]), this._markers[a].setLabel(r);
            }
          }
          return this._map.addOverlay(this._clusterMarker), this._isReal = !0, this.updateClusterMarker(), !0;
        }, t.prototype.isMarkerInCluster = function (t) {
          if (this._markers.indexOf) return this._markers.indexOf(t) != -1;
          for (var e, n = 0; e = this._markers[n]; n++) if (e === t) return !0;
          return !1;
        }, t.prototype.isMarkerInClusterBounds = function (t) {
          return this._gridBounds.containsPoint(t.getPosition());
        }, t.prototype.isReal = function (t) {
          return this._isReal;
        }, t.prototype.updateGridBounds = function () {
          const t = new BMap.Bounds(this._center, this._center);
          this._gridBounds = l(this._map, t, this._markerClusterer.getGridSize());
        }, t.prototype.updateClusterMarker = function () {
          if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
            this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
            for (var t, e = 0; t = this._markers[e]; e++) this._map.addOverlay(t);
          } else {
            if (this._markers.length < this._minClusterSize) return void this._clusterMarker.hide();
            this._clusterMarker.setPosition(this._center), this._clusterMarker.setText(this._markers.length), this._clusterMarker.addEventListener && !this._clusterMarker._hasClickEvent && this._clusterMarker.addEventListener('click', (t) => {
              this._clusterMarker._hasClickEvent = !0, this._markers && this._map.setViewport(this.getBounds());
            });
          }
        }, t.prototype.remove = function () {
          for (let t = 0; this._markers[t]; t++) {
            const e = this._markers[t].getLabel();
            this._markers[t].getMap() && this._map.removeOverlay(this._markers[t]), this._markers[t].setLabel(e);
          }
          this._map.removeOverlay(this._clusterMarker), this._markers.length = 0, delete this._markers;
        }, t.prototype.getBounds = function () {
          for (var t, e = new BMap.Bounds(this._center, this._center), n = 0; t = this._markers[n]; n++) e.extend(t.getPosition());
          return e;
        }, t.prototype.getCenter = function () {
          return this._center;
        }, d;
      }));
    }).call(e, n(3));
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div');
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: t.show,
            expression: 'show'
          }]
        }, [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: t.panel,
            expression: 'panel'
          }]
        }, [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
          const n = t._self._c || e;
        return t.paths.length ? n('div', t._l(t.paths, (e, i) => n('bm-polygon', {
            key: i,
            attrs: {
              path: e,
              'stroke-color': t.strokeColor,
              'stroke-weight': t.strokeWeight,
              'stroke-opacity': t.strokeOpacity,
              'stroke-style': t.strokeStyle,
              'fill-opacity': t.fillOpacity,
              'fill-color': t.fillColor,
              'mass-clear': t.massClear,
              clicking: t.clicking
            },
            on: {
              click (e) {
                t.$emit('click', e);
              },
              dblclick (e) {
                t.$emit('dblclick', e);
              },
              mousedown (e) {
                t.$emit('mousedown', e);
              },
              mouseup (e) {
                t.$emit('mouseup', e);
              },
              mouseout (e) {
                t.$emit('mouseout', e);
              },
              mouseover (e) {
                t.$emit('mouseover', e);
              },
              remove (e) {
                t.$emit('remove', e);
              }
            }
          }))) : t._e();
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: t.panel,
            expression: 'panel'
          }]
        }, [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('span', [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('span', [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: t.panel,
            expression: 'panel'
          }]
        });
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: t.panel,
            expression: 'panel'
          }]
        }, [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: t.panel,
            expression: 'panel'
          }]
        }, [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
          const n = t._self._c || e;
        return n('span', [t._t('default', [n('input')])], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
        return (t._self._c || e)('div', [t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }, function (t, e) {
    t.exports = {
      render () {
        const t = this;
          const e = t.$createElement;
          const n = t._self._c || e;
        return n('div', [t.hasBmView ? t._e() : n('div', {
          ref: 'view',
          staticStyle: {
            width: '100%',
            height: '100%'
          }
        }), t._v(' '), t._t('default')], 2);
      },
      staticRenderFns: []
    };
  }]))));
