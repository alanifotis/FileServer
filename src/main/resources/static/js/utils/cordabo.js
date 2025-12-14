(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload"))
        return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
        u(e);
    new MutationObserver(e => {
        for (const n of e)
            if (n.type === "childList")
                for (const c of n.addedNodes)
                    c.tagName === "LINK" && c.rel === "modulepreload" && u(c)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function a(e) {
        const n = {};
        return e.integrity && (n.integrity = e.integrity),
        e.referrerPolicy && (n.referrerPolicy = e.referrerPolicy),
        e.crossOrigin === "use-credentials" ? n.credentials = "include" : e.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin",
        n
    }
    function u(e) {
        if (e.ep)
            return;
        e.ep = !0;
        const n = a(e);
        fetch(e.href, n)
    }
}
)();
var P0 = {
    exports: {}
}
  , bn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var td = Symbol.for("react.transitional.element")
  , ad = Symbol.for("react.fragment");
function ls(l, t, a) {
    var u = null;
    if (a !== void 0 && (u = "" + a),
    t.key !== void 0 && (u = "" + t.key),
    "key"in t) {
        a = {};
        for (var e in t)
            e !== "key" && (a[e] = t[e])
    } else
        a = t;
    return t = a.ref,
    {
        $$typeof: td,
        type: l,
        key: u,
        ref: t !== void 0 ? t : null,
        props: a
    }
}
bn.Fragment = ad;
bn.jsx = ls;
bn.jsxs = ls;
P0.exports = bn;
var z = P0.exports
  , ts = {
    exports: {}
}
  , N = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zi = Symbol.for("react.transitional.element")
  , ud = Symbol.for("react.portal")
  , ed = Symbol.for("react.fragment")
  , nd = Symbol.for("react.strict_mode")
  , cd = Symbol.for("react.profiler")
  , id = Symbol.for("react.consumer")
  , fd = Symbol.for("react.context")
  , sd = Symbol.for("react.forward_ref")
  , yd = Symbol.for("react.suspense")
  , dd = Symbol.for("react.memo")
  , as = Symbol.for("react.lazy")
  , od = Symbol.for("react.activity")
  , Ef = Symbol.iterator;
function md(l) {
    return l === null || typeof l != "object" ? null : (l = Ef && l[Ef] || l["@@iterator"],
    typeof l == "function" ? l : null)
}
var us = {
    isMounted: function() {
        return !1
    },
    enqueueForceUpdate: function() {},
    enqueueReplaceState: function() {},
    enqueueSetState: function() {}
}
  , es = Object.assign
  , ns = {};
function tu(l, t, a) {
    this.props = l,
    this.context = t,
    this.refs = ns,
    this.updater = a || us
}
tu.prototype.isReactComponent = {};
tu.prototype.setState = function(l, t) {
    if (typeof l != "object" && typeof l != "function" && l != null)
        throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, l, t, "setState")
}
;
tu.prototype.forceUpdate = function(l) {
    this.updater.enqueueForceUpdate(this, l, "forceUpdate")
}
;
function cs() {}
cs.prototype = tu.prototype;
function Ai(l, t, a) {
    this.props = l,
    this.context = t,
    this.refs = ns,
    this.updater = a || us
}
var Ei = Ai.prototype = new cs;
Ei.constructor = Ai;
es(Ei, tu.prototype);
Ei.isPureReactComponent = !0;
var Tf = Array.isArray;
function pc() {}
var W = {
    H: null,
    A: null,
    T: null,
    S: null
}
  , is = Object.prototype.hasOwnProperty;
function Ti(l, t, a) {
    var u = a.ref;
    return {
        $$typeof: zi,
        type: l,
        key: t,
        ref: u !== void 0 ? u : null,
        props: a
    }
}
function vd(l, t) {
    return Ti(l.type, t, l.props)
}
function pi(l) {
    return typeof l == "object" && l !== null && l.$$typeof === zi
}
function hd(l) {
    var t = {
        "=": "=0",
        ":": "=2"
    };
    return "$" + l.replace(/[=:]/g, function(a) {
        return t[a]
    })
}
var pf = /\/+/g;
function Xn(l, t) {
    return typeof l == "object" && l !== null && l.key != null ? hd("" + l.key) : t.toString(36)
}
function gd(l) {
    switch (l.status) {
    case "fulfilled":
        return l.value;
    case "rejected":
        throw l.reason;
    default:
        switch (typeof l.status == "string" ? l.then(pc, pc) : (l.status = "pending",
        l.then(function(t) {
            l.status === "pending" && (l.status = "fulfilled",
            l.value = t)
        }, function(t) {
            l.status === "pending" && (l.status = "rejected",
            l.reason = t)
        })),
        l.status) {
        case "fulfilled":
            return l.value;
        case "rejected":
            throw l.reason
        }
    }
    throw l
}
function Ea(l, t, a, u, e) {
    var n = typeof l;
    (n === "undefined" || n === "boolean") && (l = null);
    var c = !1;
    if (l === null)
        c = !0;
    else
        switch (n) {
        case "bigint":
        case "string":
        case "number":
            c = !0;
            break;
        case "object":
            switch (l.$$typeof) {
            case zi:
            case ud:
                c = !0;
                break;
            case as:
                return c = l._init,
                Ea(c(l._payload), t, a, u, e)
            }
        }
    if (c)
        return e = e(l),
        c = u === "" ? "." + Xn(l, 0) : u,
        Tf(e) ? (a = "",
        c != null && (a = c.replace(pf, "$&/") + "/"),
        Ea(e, t, a, "", function(d) {
            return d
        })) : e != null && (pi(e) && (e = vd(e, a + (e.key == null || l && l.key === e.key ? "" : ("" + e.key).replace(pf, "$&/") + "/") + c)),
        t.push(e)),
        1;
    c = 0;
    var i = u === "" ? "." : u + ":";
    if (Tf(l))
        for (var f = 0; f < l.length; f++)
            u = l[f],
            n = i + Xn(u, f),
            c += Ea(u, t, a, n, e);
    else if (f = md(l),
    typeof f == "function")
        for (l = f.call(l),
        f = 0; !(u = l.next()).done; )
            u = u.value,
            n = i + Xn(u, f++),
            c += Ea(u, t, a, n, e);
    else if (n === "object") {
        if (typeof l.then == "function")
            return Ea(gd(l), t, a, u, e);
        throw t = String(l),
        Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(l).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.")
    }
    return c
}
function de(l, t, a) {
    if (l == null)
        return l;
    var u = []
      , e = 0;
    return Ea(l, u, "", "", function(n) {
        return t.call(a, n, e++)
    }),
    u
}
function Sd(l) {
    if (l._status === -1) {
        var t = l._result;
        t = t(),
        t.then(function(a) {
            (l._status === 0 || l._status === -1) && (l._status = 1,
            l._result = a)
        }, function(a) {
            (l._status === 0 || l._status === -1) && (l._status = 2,
            l._result = a)
        }),
        l._status === -1 && (l._status = 0,
        l._result = t)
    }
    if (l._status === 1)
        return l._result.default;
    throw l._result
}
var _f = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error",{
            bubbles: !0,
            cancelable: !0,
            message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
            error: l
        });
        if (!window.dispatchEvent(t))
            return
    } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", l);
        return
    }
    console.error(l)
}
  , bd = {
    map: de,
    forEach: function(l, t, a) {
        de(l, function() {
            t.apply(this, arguments)
        }, a)
    },
    count: function(l) {
        var t = 0;
        return de(l, function() {
            t++
        }),
        t
    },
    toArray: function(l) {
        return de(l, function(t) {
            return t
        }) || []
    },
    only: function(l) {
        if (!pi(l))
            throw Error("React.Children.only expected to receive a single React element child.");
        return l
    }
};
N.Activity = od;
N.Children = bd;
N.Component = tu;
N.Fragment = ed;
N.Profiler = cd;
N.PureComponent = Ai;
N.StrictMode = nd;
N.Suspense = yd;
N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W;
N.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(l) {
        return W.H.useMemoCache(l)
    }
};
N.cache = function(l) {
    return function() {
        return l.apply(null, arguments)
    }
}
;
N.cacheSignal = function() {
    return null
}
;
N.cloneElement = function(l, t, a) {
    if (l == null)
        throw Error("The argument must be a React element, but you passed " + l + ".");
    var u = es({}, l.props)
      , e = l.key;
    if (t != null)
        for (n in t.key !== void 0 && (e = "" + t.key),
        t)
            !is.call(t, n) || n === "key" || n === "__self" || n === "__source" || n === "ref" && t.ref === void 0 || (u[n] = t[n]);
    var n = arguments.length - 2;
    if (n === 1)
        u.children = a;
    else if (1 < n) {
        for (var c = Array(n), i = 0; i < n; i++)
            c[i] = arguments[i + 2];
        u.children = c
    }
    return Ti(l.type, e, u)
}
;
N.createContext = function(l) {
    return l = {
        $$typeof: fd,
        _currentValue: l,
        _currentValue2: l,
        _threadCount: 0,
        Provider: null,
        Consumer: null
    },
    l.Provider = l,
    l.Consumer = {
        $$typeof: id,
        _context: l
    },
    l
}
;
N.createElement = function(l, t, a) {
    var u, e = {}, n = null;
    if (t != null)
        for (u in t.key !== void 0 && (n = "" + t.key),
        t)
            is.call(t, u) && u !== "key" && u !== "__self" && u !== "__source" && (e[u] = t[u]);
    var c = arguments.length - 2;
    if (c === 1)
        e.children = a;
    else if (1 < c) {
        for (var i = Array(c), f = 0; f < c; f++)
            i[f] = arguments[f + 2];
        e.children = i
    }
    if (l && l.defaultProps)
        for (u in c = l.defaultProps,
        c)
            e[u] === void 0 && (e[u] = c[u]);
    return Ti(l, n, e)
}
;
N.createRef = function() {
    return {
        current: null
    }
}
;
N.forwardRef = function(l) {
    return {
        $$typeof: sd,
        render: l
    }
}
;
N.isValidElement = pi;
N.lazy = function(l) {
    return {
        $$typeof: as,
        _payload: {
            _status: -1,
            _result: l
        },
        _init: Sd
    }
}
;
N.memo = function(l, t) {
    return {
        $$typeof: dd,
        type: l,
        compare: t === void 0 ? null : t
    }
}
;
N.startTransition = function(l) {
    var t = W.T
      , a = {};
    W.T = a;
    try {
        var u = l()
          , e = W.S;
        e !== null && e(a, u),
        typeof u == "object" && u !== null && typeof u.then == "function" && u.then(pc, _f)
    } catch (n) {
        _f(n)
    } finally {
        t !== null && a.types !== null && (t.types = a.types),
        W.T = t
    }
}
;
N.unstable_useCacheRefresh = function() {
    return W.H.useCacheRefresh()
}
;
N.use = function(l) {
    return W.H.use(l)
}
;
N.useActionState = function(l, t, a) {
    return W.H.useActionState(l, t, a)
}
;
N.useCallback = function(l, t) {
    return W.H.useCallback(l, t)
}
;
N.useContext = function(l) {
    return W.H.useContext(l)
}
;
N.useDebugValue = function() {}
;
N.useDeferredValue = function(l, t) {
    return W.H.useDeferredValue(l, t)
}
;
N.useEffect = function(l, t) {
    return W.H.useEffect(l, t)
}
;
N.useEffectEvent = function(l) {
    return W.H.useEffectEvent(l)
}
;
N.useId = function() {
    return W.H.useId()
}
;
N.useImperativeHandle = function(l, t, a) {
    return W.H.useImperativeHandle(l, t, a)
}
;
N.useInsertionEffect = function(l, t) {
    return W.H.useInsertionEffect(l, t)
}
;
N.useLayoutEffect = function(l, t) {
    return W.H.useLayoutEffect(l, t)
}
;
N.useMemo = function(l, t) {
    return W.H.useMemo(l, t)
}
;
N.useOptimistic = function(l, t) {
    return W.H.useOptimistic(l, t)
}
;
N.useReducer = function(l, t, a) {
    return W.H.useReducer(l, t, a)
}
;
N.useRef = function(l) {
    return W.H.useRef(l)
}
;
N.useState = function(l) {
    return W.H.useState(l)
}
;
N.useSyncExternalStore = function(l, t, a) {
    return W.H.useSyncExternalStore(l, t, a)
}
;
N.useTransition = function() {
    return W.H.useTransition()
}
;
N.version = "19.2.1";
ts.exports = N;
var Ol = ts.exports
  , fs = {
    exports: {}
}
  , rn = {}
  , ss = {
    exports: {}
}
  , ys = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(l) {
    function t(p, C) {
        var R = p.length;
        p.push(C);
        l: for (; 0 < R; ) {
            var tl = R - 1 >>> 1
              , yl = p[tl];
            if (0 < e(yl, C))
                p[tl] = C,
                p[R] = yl,
                R = tl;
            else
                break l
        }
    }
    function a(p) {
        return p.length === 0 ? null : p[0]
    }
    function u(p) {
        if (p.length === 0)
            return null;
        var C = p[0]
          , R = p.pop();
        if (R !== C) {
            p[0] = R;
            l: for (var tl = 0, yl = p.length, fe = yl >>> 1; tl < fe; ) {
                var se = 2 * (tl + 1) - 1
                  , Gn = p[se]
                  , Pt = se + 1
                  , ye = p[Pt];
                if (0 > e(Gn, R))
                    Pt < yl && 0 > e(ye, Gn) ? (p[tl] = ye,
                    p[Pt] = R,
                    tl = Pt) : (p[tl] = Gn,
                    p[se] = R,
                    tl = se);
                else if (Pt < yl && 0 > e(ye, R))
                    p[tl] = ye,
                    p[Pt] = R,
                    tl = Pt;
                else
                    break l
            }
        }
        return C
    }
    function e(p, C) {
        var R = p.sortIndex - C.sortIndex;
        return R !== 0 ? R : p.id - C.id
    }
    if (l.unstable_now = void 0,
    typeof performance == "object" && typeof performance.now == "function") {
        var n = performance;
        l.unstable_now = function() {
            return n.now()
        }
    } else {
        var c = Date
          , i = c.now();
        l.unstable_now = function() {
            return c.now() - i
        }
    }
    var f = []
      , d = []
      , h = 1
      , g = null
      , o = 3
      , v = !1
      , r = !1
      , E = !1
      , H = !1
      , y = typeof setTimeout == "function" ? setTimeout : null
      , s = typeof clearTimeout == "function" ? clearTimeout : null
      , m = typeof setImmediate < "u" ? setImmediate : null;
    function S(p) {
        for (var C = a(d); C !== null; ) {
            if (C.callback === null)
                u(d);
            else if (C.startTime <= p)
                u(d),
                C.sortIndex = C.expirationTime,
                t(f, C);
            else
                break;
            C = a(d)
        }
    }
    function T(p) {
        if (E = !1,
        S(p),
        !r)
            if (a(f) !== null)
                r = !0,
                O || (O = !0,
                Fl());
            else {
                var C = a(d);
                C !== null && It(T, C.startTime - p)
            }
    }
    var O = !1
      , A = -1
      , _ = 5
      , D = -1;
    function U() {
        return H ? !0 : !(l.unstable_now() - D < _)
    }
    function I() {
        if (H = !1,
        O) {
            var p = l.unstable_now();
            D = p;
            var C = !0;
            try {
                l: {
                    r = !1,
                    E && (E = !1,
                    s(A),
                    A = -1),
                    v = !0;
                    var R = o;
                    try {
                        t: {
                            for (S(p),
                            g = a(f); g !== null && !(g.expirationTime > p && U()); ) {
                                var tl = g.callback;
                                if (typeof tl == "function") {
                                    g.callback = null,
                                    o = g.priorityLevel;
                                    var yl = tl(g.expirationTime <= p);
                                    if (p = l.unstable_now(),
                                    typeof yl == "function") {
                                        g.callback = yl,
                                        S(p),
                                        C = !0;
                                        break t
                                    }
                                    g === a(f) && u(f),
                                    S(p)
                                } else
                                    u(f);
                                g = a(f)
                            }
                            if (g !== null)
                                C = !0;
                            else {
                                var fe = a(d);
                                fe !== null && It(T, fe.startTime - p),
                                C = !1
                            }
                        }
                        break l
                    } finally {
                        g = null,
                        o = R,
                        v = !1
                    }
                    C = void 0
                }
            } finally {
                C ? Fl() : O = !1
            }
        }
    }
    var Fl;
    if (typeof m == "function")
        Fl = function() {
            m(I)
        }
        ;
    else if (typeof MessageChannel < "u") {
        var su = new MessageChannel
          , qn = su.port2;
        su.port1.onmessage = I,
        Fl = function() {
            qn.postMessage(null)
        }
    } else
        Fl = function() {
            y(I, 0)
        }
        ;
    function It(p, C) {
        A = y(function() {
            p(l.unstable_now())
        }, C)
    }
    l.unstable_IdlePriority = 5,
    l.unstable_ImmediatePriority = 1,
    l.unstable_LowPriority = 4,
    l.unstable_NormalPriority = 3,
    l.unstable_Profiling = null,
    l.unstable_UserBlockingPriority = 2,
    l.unstable_cancelCallback = function(p) {
        p.callback = null
    }
    ,
    l.unstable_forceFrameRate = function(p) {
        0 > p || 125 < p ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _ = 0 < p ? Math.floor(1e3 / p) : 5
    }
    ,
    l.unstable_getCurrentPriorityLevel = function() {
        return o
    }
    ,
    l.unstable_next = function(p) {
        switch (o) {
        case 1:
        case 2:
        case 3:
            var C = 3;
            break;
        default:
            C = o
        }
        var R = o;
        o = C;
        try {
            return p()
        } finally {
            o = R
        }
    }
    ,
    l.unstable_requestPaint = function() {
        H = !0
    }
    ,
    l.unstable_runWithPriority = function(p, C) {
        switch (p) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            break;
        default:
            p = 3
        }
        var R = o;
        o = p;
        try {
            return C()
        } finally {
            o = R
        }
    }
    ,
    l.unstable_scheduleCallback = function(p, C, R) {
        var tl = l.unstable_now();
        switch (typeof R == "object" && R !== null ? (R = R.delay,
        R = typeof R == "number" && 0 < R ? tl + R : tl) : R = tl,
        p) {
        case 1:
            var yl = -1;
            break;
        case 2:
            yl = 250;
            break;
        case 5:
            yl = 1073741823;
            break;
        case 4:
            yl = 1e4;
            break;
        default:
            yl = 5e3
        }
        return yl = R + yl,
        p = {
            id: h++,
            callback: C,
            priorityLevel: p,
            startTime: R,
            expirationTime: yl,
            sortIndex: -1
        },
        R > tl ? (p.sortIndex = R,
        t(d, p),
        a(f) === null && p === a(d) && (E ? (s(A),
        A = -1) : E = !0,
        It(T, R - tl))) : (p.sortIndex = yl,
        t(f, p),
        r || v || (r = !0,
        O || (O = !0,
        Fl()))),
        p
    }
    ,
    l.unstable_shouldYield = U,
    l.unstable_wrapCallback = function(p) {
        var C = o;
        return function() {
            var R = o;
            o = C;
            try {
                return p.apply(this, arguments)
            } finally {
                o = R
            }
        }
    }
}
)(ys);
ss.exports = ys;
var rd = ss.exports
  , ds = {
    exports: {}
}
  , Al = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zd = Ol;
function os(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++)
            t += "&args[]=" + encodeURIComponent(arguments[a])
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
}
function _t() {}
var zl = {
    d: {
        f: _t,
        r: function() {
            throw Error(os(522))
        },
        D: _t,
        C: _t,
        L: _t,
        m: _t,
        X: _t,
        S: _t,
        M: _t
    },
    p: 0,
    findDOMNode: null
}
  , Ad = Symbol.for("react.portal");
function Ed(l, t, a) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
        $$typeof: Ad,
        key: u == null ? null : "" + u,
        children: l,
        containerInfo: t,
        implementation: a
    }
}
var Eu = zd.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function zn(l, t) {
    if (l === "font")
        return "";
    if (typeof t == "string")
        return t === "use-credentials" ? t : ""
}
Al.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = zl;
Al.createPortal = function(l, t) {
    var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)
        throw Error(os(299));
    return Ed(l, t, null, a)
}
;
Al.flushSync = function(l) {
    var t = Eu.T
      , a = zl.p;
    try {
        if (Eu.T = null,
        zl.p = 2,
        l)
            return l()
    } finally {
        Eu.T = t,
        zl.p = a,
        zl.d.f()
    }
}
;
Al.preconnect = function(l, t) {
    typeof l == "string" && (t ? (t = t.crossOrigin,
    t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null,
    zl.d.C(l, t))
}
;
Al.prefetchDNS = function(l) {
    typeof l == "string" && zl.d.D(l)
}
;
Al.preinit = function(l, t) {
    if (typeof l == "string" && t && typeof t.as == "string") {
        var a = t.as
          , u = zn(a, t.crossOrigin)
          , e = typeof t.integrity == "string" ? t.integrity : void 0
          , n = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
        a === "style" ? zl.d.S(l, typeof t.precedence == "string" ? t.precedence : void 0, {
            crossOrigin: u,
            integrity: e,
            fetchPriority: n
        }) : a === "script" && zl.d.X(l, {
            crossOrigin: u,
            integrity: e,
            fetchPriority: n,
            nonce: typeof t.nonce == "string" ? t.nonce : void 0
        })
    }
}
;
Al.preinitModule = function(l, t) {
    if (typeof l == "string")
        if (typeof t == "object" && t !== null) {
            if (t.as == null || t.as === "script") {
                var a = zn(t.as, t.crossOrigin);
                zl.d.M(l, {
                    crossOrigin: a,
                    integrity: typeof t.integrity == "string" ? t.integrity : void 0,
                    nonce: typeof t.nonce == "string" ? t.nonce : void 0
                })
            }
        } else
            t == null && zl.d.M(l)
}
;
Al.preload = function(l, t) {
    if (typeof l == "string" && typeof t == "object" && t !== null && typeof t.as == "string") {
        var a = t.as
          , u = zn(a, t.crossOrigin);
        zl.d.L(l, a, {
            crossOrigin: u,
            integrity: typeof t.integrity == "string" ? t.integrity : void 0,
            nonce: typeof t.nonce == "string" ? t.nonce : void 0,
            type: typeof t.type == "string" ? t.type : void 0,
            fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
            referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
            imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
            imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
            media: typeof t.media == "string" ? t.media : void 0
        })
    }
}
;
Al.preloadModule = function(l, t) {
    if (typeof l == "string")
        if (t) {
            var a = zn(t.as, t.crossOrigin);
            zl.d.m(l, {
                as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
                crossOrigin: a,
                integrity: typeof t.integrity == "string" ? t.integrity : void 0
            })
        } else
            zl.d.m(l)
}
;
Al.requestFormReset = function(l) {
    zl.d.r(l)
}
;
Al.unstable_batchedUpdates = function(l, t) {
    return l(t)
}
;
Al.useFormState = function(l, t, a) {
    return Eu.H.useFormState(l, t, a)
}
;
Al.useFormStatus = function() {
    return Eu.H.useHostTransitionStatus()
}
;
Al.version = "19.2.1";
function ms() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
        try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ms)
        } catch (l) {
            console.error(l)
        }
}
ms(),
ds.exports = Al;
var Td = ds.exports;
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sl = rd
  , vs = Ol
  , pd = Td;
function b(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++)
            t += "&args[]=" + encodeURIComponent(arguments[a])
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
}
function hs(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11)
}
function Fu(l) {
    var t = l
      , a = l;
    if (l.alternate)
        for (; t.return; )
            t = t.return;
    else {
        l = t;
        do
            t = l,
            t.flags & 4098 && (a = t.return),
            l = t.return;
        while (l)
    }
    return t.tag === 3 ? a : null
}
function gs(l) {
    if (l.tag === 13) {
        var t = l.memoizedState;
        if (t === null && (l = l.alternate,
        l !== null && (t = l.memoizedState)),
        t !== null)
            return t.dehydrated
    }
    return null
}
function Ss(l) {
    if (l.tag === 31) {
        var t = l.memoizedState;
        if (t === null && (l = l.alternate,
        l !== null && (t = l.memoizedState)),
        t !== null)
            return t.dehydrated
    }
    return null
}
function Of(l) {
    if (Fu(l) !== l)
        throw Error(b(188))
}
function _d(l) {
    var t = l.alternate;
    if (!t) {
        if (t = Fu(l),
        t === null)
            throw Error(b(188));
        return t !== l ? null : l
    }
    for (var a = l, u = t; ; ) {
        var e = a.return;
        if (e === null)
            break;
        var n = e.alternate;
        if (n === null) {
            if (u = e.return,
            u !== null) {
                a = u;
                continue
            }
            break
        }
        if (e.child === n.child) {
            for (n = e.child; n; ) {
                if (n === a)
                    return Of(e),
                    l;
                if (n === u)
                    return Of(e),
                    t;
                n = n.sibling
            }
            throw Error(b(188))
        }
        if (a.return !== u.return)
            a = e,
            u = n;
        else {
            for (var c = !1, i = e.child; i; ) {
                if (i === a) {
                    c = !0,
                    a = e,
                    u = n;
                    break
                }
                if (i === u) {
                    c = !0,
                    u = e,
                    a = n;
                    break
                }
                i = i.sibling
            }
            if (!c) {
                for (i = n.child; i; ) {
                    if (i === a) {
                        c = !0,
                        a = n,
                        u = e;
                        break
                    }
                    if (i === u) {
                        c = !0,
                        u = n,
                        a = e;
                        break
                    }
                    i = i.sibling
                }
                if (!c)
                    throw Error(b(189))
            }
        }
        if (a.alternate !== u)
            throw Error(b(190))
    }
    if (a.tag !== 3)
        throw Error(b(188));
    return a.stateNode.current === a ? l : t
}
function bs(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6)
        return l;
    for (l = l.child; l !== null; ) {
        if (t = bs(l),
        t !== null)
            return t;
        l = l.sibling
    }
    return null
}
var F = Object.assign
  , Od = Symbol.for("react.element")
  , oe = Symbol.for("react.transitional.element")
  , Su = Symbol.for("react.portal")
  , _a = Symbol.for("react.fragment")
  , rs = Symbol.for("react.strict_mode")
  , _c = Symbol.for("react.profiler")
  , zs = Symbol.for("react.consumer")
  , mt = Symbol.for("react.context")
  , _i = Symbol.for("react.forward_ref")
  , Oc = Symbol.for("react.suspense")
  , Mc = Symbol.for("react.suspense_list")
  , Oi = Symbol.for("react.memo")
  , Ot = Symbol.for("react.lazy")
  , Dc = Symbol.for("react.activity")
  , Md = Symbol.for("react.memo_cache_sentinel")
  , Mf = Symbol.iterator;
function yu(l) {
    return l === null || typeof l != "object" ? null : (l = Mf && l[Mf] || l["@@iterator"],
    typeof l == "function" ? l : null)
}
var Dd = Symbol.for("react.client.reference");
function Uc(l) {
    if (l == null)
        return null;
    if (typeof l == "function")
        return l.$$typeof === Dd ? null : l.displayName || l.name || null;
    if (typeof l == "string")
        return l;
    switch (l) {
    case _a:
        return "Fragment";
    case _c:
        return "Profiler";
    case rs:
        return "StrictMode";
    case Oc:
        return "Suspense";
    case Mc:
        return "SuspenseList";
    case Dc:
        return "Activity"
    }
    if (typeof l == "object")
        switch (l.$$typeof) {
        case Su:
            return "Portal";
        case mt:
            return l.displayName || "Context";
        case zs:
            return (l._context.displayName || "Context") + ".Consumer";
        case _i:
            var t = l.render;
            return l = l.displayName,
            l || (l = t.displayName || t.name || "",
            l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"),
            l;
        case Oi:
            return t = l.displayName || null,
            t !== null ? t : Uc(l.type) || "Memo";
        case Ot:
            t = l._payload,
            l = l._init;
            try {
                return Uc(l(t))
            } catch {}
        }
    return null
}
var bu = Array.isArray
  , M = vs.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  , X = pd.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  , na = {
    pending: !1,
    data: null,
    method: null,
    action: null
}
  , Nc = []
  , Oa = -1;
function et(l) {
    return {
        current: l
    }
}
function ml(l) {
    0 > Oa || (l.current = Nc[Oa],
    Nc[Oa] = null,
    Oa--)
}
function J(l, t) {
    Oa++,
    Nc[Oa] = l.current,
    l.current = t
}
var ut = et(null)
  , Bu = et(null)
  , Yt = et(null)
  , Ze = et(null);
function Ve(l, t) {
    switch (J(Yt, t),
    J(Bu, l),
    J(ut, null),
    t.nodeType) {
    case 9:
    case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? R0(l) : 0;
        break;
    default:
        if (l = t.tagName,
        t = t.namespaceURI)
            t = R0(t),
            l = Xy(t, l);
        else
            switch (l) {
            case "svg":
                l = 1;
                break;
            case "math":
                l = 2;
                break;
            default:
                l = 0
            }
    }
    ml(ut),
    J(ut, l)
}
function La() {
    ml(ut),
    ml(Bu),
    ml(Yt)
}
function xc(l) {
    l.memoizedState !== null && J(Ze, l);
    var t = ut.current
      , a = Xy(t, l.type);
    t !== a && (J(Bu, l),
    J(ut, a))
}
function Le(l) {
    Bu.current === l && (ml(ut),
    ml(Bu)),
    Ze.current === l && (ml(Ze),
    wu._currentValue = na)
}
var Qn, Df;
function ta(l) {
    if (Qn === void 0)
        try {
            throw Error()
        } catch (a) {
            var t = a.stack.trim().match(/\n( *(at )?)/);
            Qn = t && t[1] || "",
            Df = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : ""
        }
    return `
` + Qn + l + Df
}
var Zn = !1;
function Vn(l, t) {
    if (!l || Zn)
        return "";
    Zn = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
        var u = {
            DetermineComponentFrameRoot: function() {
                try {
                    if (t) {
                        var g = function() {
                            throw Error()
                        };
                        if (Object.defineProperty(g.prototype, "props", {
                            set: function() {
                                throw Error()
                            }
                        }),
                        typeof Reflect == "object" && Reflect.construct) {
                            try {
                                Reflect.construct(g, [])
                            } catch (v) {
                                var o = v
                            }
                            Reflect.construct(l, [], g)
                        } else {
                            try {
                                g.call()
                            } catch (v) {
                                o = v
                            }
                            l.call(g.prototype)
                        }
                    } else {
                        try {
                            throw Error()
                        } catch (v) {
                            o = v
                        }
                        (g = l()) && typeof g.catch == "function" && g.catch(function() {})
                    }
                } catch (v) {
                    if (v && o && typeof v.stack == "string")
                        return [v.stack, o.stack]
                }
                return [null, null]
            }
        };
        u.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var e = Object.getOwnPropertyDescriptor(u.DetermineComponentFrameRoot, "name");
        e && e.configurable && Object.defineProperty(u.DetermineComponentFrameRoot, "name", {
            value: "DetermineComponentFrameRoot"
        });
        var n = u.DetermineComponentFrameRoot()
          , c = n[0]
          , i = n[1];
        if (c && i) {
            var f = c.split(`
`)
              , d = i.split(`
`);
            for (e = u = 0; u < f.length && !f[u].includes("DetermineComponentFrameRoot"); )
                u++;
            for (; e < d.length && !d[e].includes("DetermineComponentFrameRoot"); )
                e++;
            if (u === f.length || e === d.length)
                for (u = f.length - 1,
                e = d.length - 1; 1 <= u && 0 <= e && f[u] !== d[e]; )
                    e--;
            for (; 1 <= u && 0 <= e; u--,
            e--)
                if (f[u] !== d[e]) {
                    if (u !== 1 || e !== 1)
                        do
                            if (u--,
                            e--,
                            0 > e || f[u] !== d[e]) {
                                var h = `
` + f[u].replace(" at new ", " at ");
                                return l.displayName && h.includes("<anonymous>") && (h = h.replace("<anonymous>", l.displayName)),
                                h
                            }
                        while (1 <= u && 0 <= e);
                    break
                }
        }
    } finally {
        Zn = !1,
        Error.prepareStackTrace = a
    }
    return (a = l ? l.displayName || l.name : "") ? ta(a) : ""
}
function Ud(l, t) {
    switch (l.tag) {
    case 26:
    case 27:
    case 5:
        return ta(l.type);
    case 16:
        return ta("Lazy");
    case 13:
        return l.child !== t && t !== null ? ta("Suspense Fallback") : ta("Suspense");
    case 19:
        return ta("SuspenseList");
    case 0:
    case 15:
        return Vn(l.type, !1);
    case 11:
        return Vn(l.type.render, !1);
    case 1:
        return Vn(l.type, !0);
    case 31:
        return ta("Activity");
    default:
        return ""
    }
}
function Uf(l) {
    try {
        var t = ""
          , a = null;
        do
            t += Ud(l, a),
            a = l,
            l = l.return;
        while (l);
        return t
    } catch (u) {
        return `
Error generating stack: ` + u.message + `
` + u.stack
    }
}
var Hc = Object.prototype.hasOwnProperty
  , Mi = sl.unstable_scheduleCallback
  , Ln = sl.unstable_cancelCallback
  , Nd = sl.unstable_shouldYield
  , xd = sl.unstable_requestPaint
  , Cl = sl.unstable_now
  , Hd = sl.unstable_getCurrentPriorityLevel
  , As = sl.unstable_ImmediatePriority
  , Es = sl.unstable_UserBlockingPriority
  , Ke = sl.unstable_NormalPriority
  , Rd = sl.unstable_LowPriority
  , Ts = sl.unstable_IdlePriority
  , Cd = sl.log
  , jd = sl.unstable_setDisableYieldValue
  , ku = null
  , jl = null;
function Ht(l) {
    if (typeof Cd == "function" && jd(l),
    jl && typeof jl.setStrictMode == "function")
        try {
            jl.setStrictMode(ku, l)
        } catch {}
}
var Bl = Math.clz32 ? Math.clz32 : qd
  , Bd = Math.log
  , Yd = Math.LN2;
function qd(l) {
    return l >>>= 0,
    l === 0 ? 32 : 31 - (Bd(l) / Yd | 0) | 0
}
var me = 256
  , ve = 262144
  , he = 4194304;
function aa(l) {
    var t = l & 42;
    if (t !== 0)
        return t;
    switch (l & -l) {
    case 1:
        return 1;
    case 2:
        return 2;
    case 4:
        return 4;
    case 8:
        return 8;
    case 16:
        return 16;
    case 32:
        return 32;
    case 64:
        return 64;
    case 128:
        return 128;
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
        return l & 261888;
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
        return l & 3932160;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
        return l & 62914560;
    case 67108864:
        return 67108864;
    case 134217728:
        return 134217728;
    case 268435456:
        return 268435456;
    case 536870912:
        return 536870912;
    case 1073741824:
        return 0;
    default:
        return l
    }
}
function An(l, t, a) {
    var u = l.pendingLanes;
    if (u === 0)
        return 0;
    var e = 0
      , n = l.suspendedLanes
      , c = l.pingedLanes;
    l = l.warmLanes;
    var i = u & 134217727;
    return i !== 0 ? (u = i & ~n,
    u !== 0 ? e = aa(u) : (c &= i,
    c !== 0 ? e = aa(c) : a || (a = i & ~l,
    a !== 0 && (e = aa(a))))) : (i = u & ~n,
    i !== 0 ? e = aa(i) : c !== 0 ? e = aa(c) : a || (a = u & ~l,
    a !== 0 && (e = aa(a)))),
    e === 0 ? 0 : t !== 0 && t !== e && !(t & n) && (n = e & -e,
    a = t & -t,
    n >= a || n === 32 && (a & 4194048) !== 0) ? t : e
}
function Iu(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0
}
function Gd(l, t) {
    switch (l) {
    case 1:
    case 2:
    case 4:
    case 8:
    case 64:
        return t + 250;
    case 16:
    case 32:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
        return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
        return -1;
    case 67108864:
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
        return -1;
    default:
        return -1
    }
}
function ps() {
    var l = he;
    return he <<= 1,
    !(he & 62914560) && (he = 4194304),
    l
}
function Kn(l) {
    for (var t = [], a = 0; 31 > a; a++)
        t.push(l);
    return t
}
function Pu(l, t) {
    l.pendingLanes |= t,
    t !== 268435456 && (l.suspendedLanes = 0,
    l.pingedLanes = 0,
    l.warmLanes = 0)
}
function Xd(l, t, a, u, e, n) {
    var c = l.pendingLanes;
    l.pendingLanes = a,
    l.suspendedLanes = 0,
    l.pingedLanes = 0,
    l.warmLanes = 0,
    l.expiredLanes &= a,
    l.entangledLanes &= a,
    l.errorRecoveryDisabledLanes &= a,
    l.shellSuspendCounter = 0;
    var i = l.entanglements
      , f = l.expirationTimes
      , d = l.hiddenUpdates;
    for (a = c & ~a; 0 < a; ) {
        var h = 31 - Bl(a)
          , g = 1 << h;
        i[h] = 0,
        f[h] = -1;
        var o = d[h];
        if (o !== null)
            for (d[h] = null,
            h = 0; h < o.length; h++) {
                var v = o[h];
                v !== null && (v.lane &= -536870913)
            }
        a &= ~g
    }
    u !== 0 && _s(l, u, 0),
    n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(c & ~t))
}
function _s(l, t, a) {
    l.pendingLanes |= t,
    l.suspendedLanes &= ~t;
    var u = 31 - Bl(t);
    l.entangledLanes |= t,
    l.entanglements[u] = l.entanglements[u] | 1073741824 | a & 261930
}
function Os(l, t) {
    var a = l.entangledLanes |= t;
    for (l = l.entanglements; a; ) {
        var u = 31 - Bl(a)
          , e = 1 << u;
        e & t | l[u] & t && (l[u] |= t),
        a &= ~e
    }
}
function Ms(l, t) {
    var a = t & -t;
    return a = a & 42 ? 1 : Di(a),
    a & (l.suspendedLanes | t) ? 0 : a
}
function Di(l) {
    switch (l) {
    case 2:
        l = 1;
        break;
    case 8:
        l = 4;
        break;
    case 32:
        l = 16;
        break;
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
        l = 128;
        break;
    case 268435456:
        l = 134217728;
        break;
    default:
        l = 0
    }
    return l
}
function Ui(l) {
    return l &= -l,
    2 < l ? 8 < l ? l & 134217727 ? 32 : 268435456 : 8 : 2
}
function Ds() {
    var l = X.p;
    return l !== 0 ? l : (l = window.event,
    l === void 0 ? 32 : ky(l.type))
}
function Nf(l, t) {
    var a = X.p;
    try {
        return X.p = l,
        t()
    } finally {
        X.p = a
    }
}
var Ft = Math.random().toString(36).slice(2)
  , hl = "__reactFiber$" + Ft
  , Dl = "__reactProps$" + Ft
  , au = "__reactContainer$" + Ft
  , Rc = "__reactEvents$" + Ft
  , Qd = "__reactListeners$" + Ft
  , Zd = "__reactHandles$" + Ft
  , xf = "__reactResources$" + Ft
  , le = "__reactMarker$" + Ft;
function Ni(l) {
    delete l[hl],
    delete l[Dl],
    delete l[Rc],
    delete l[Qd],
    delete l[Zd]
}
function Ma(l) {
    var t = l[hl];
    if (t)
        return t;
    for (var a = l.parentNode; a; ) {
        if (t = a[au] || a[hl]) {
            if (a = t.alternate,
            t.child !== null || a !== null && a.child !== null)
                for (l = q0(l); l !== null; ) {
                    if (a = l[hl])
                        return a;
                    l = q0(l)
                }
            return t
        }
        l = a,
        a = l.parentNode
    }
    return null
}
function uu(l) {
    if (l = l[hl] || l[au]) {
        var t = l.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
            return l
    }
    return null
}
function ru(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6)
        return l.stateNode;
    throw Error(b(33))
}
function Ya(l) {
    var t = l[xf];
    return t || (t = l[xf] = {
        hoistableStyles: new Map,
        hoistableScripts: new Map
    }),
    t
}
function ol(l) {
    l[le] = !0
}
var Us = new Set
  , Ns = {};
function ha(l, t) {
    Ka(l, t),
    Ka(l + "Capture", t)
}
function Ka(l, t) {
    for (Ns[l] = t,
    l = 0; l < t.length; l++)
        Us.add(t[l])
}
var Vd = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$")
  , Hf = {}
  , Rf = {};
function Ld(l) {
    return Hc.call(Rf, l) ? !0 : Hc.call(Hf, l) ? !1 : Vd.test(l) ? Rf[l] = !0 : (Hf[l] = !0,
    !1)
}
function Me(l, t, a) {
    if (Ld(t))
        if (a === null)
            l.removeAttribute(t);
        else {
            switch (typeof a) {
            case "undefined":
            case "function":
            case "symbol":
                l.removeAttribute(t);
                return;
            case "boolean":
                var u = t.toLowerCase().slice(0, 5);
                if (u !== "data-" && u !== "aria-") {
                    l.removeAttribute(t);
                    return
                }
            }
            l.setAttribute(t, "" + a)
        }
}
function ge(l, t, a) {
    if (a === null)
        l.removeAttribute(t);
    else {
        switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
            l.removeAttribute(t);
            return
        }
        l.setAttribute(t, "" + a)
    }
}
function ct(l, t, a, u) {
    if (u === null)
        l.removeAttribute(a);
    else {
        switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
            l.removeAttribute(a);
            return
        }
        l.setAttributeNS(t, a, "" + u)
    }
}
function Ql(l) {
    switch (typeof l) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "undefined":
        return l;
    case "object":
        return l;
    default:
        return ""
    }
}
function xs(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio")
}
function Kd(l, t, a) {
    var u = Object.getOwnPropertyDescriptor(l.constructor.prototype, t);
    if (!l.hasOwnProperty(t) && typeof u < "u" && typeof u.get == "function" && typeof u.set == "function") {
        var e = u.get
          , n = u.set;
        return Object.defineProperty(l, t, {
            configurable: !0,
            get: function() {
                return e.call(this)
            },
            set: function(c) {
                a = "" + c,
                n.call(this, c)
            }
        }),
        Object.defineProperty(l, t, {
            enumerable: u.enumerable
        }),
        {
            getValue: function() {
                return a
            },
            setValue: function(c) {
                a = "" + c
            },
            stopTracking: function() {
                l._valueTracker = null,
                delete l[t]
            }
        }
    }
}
function Cc(l) {
    if (!l._valueTracker) {
        var t = xs(l) ? "checked" : "value";
        l._valueTracker = Kd(l, t, "" + l[t])
    }
}
function Hs(l) {
    if (!l)
        return !1;
    var t = l._valueTracker;
    if (!t)
        return !0;
    var a = t.getValue()
      , u = "";
    return l && (u = xs(l) ? l.checked ? "true" : "false" : l.value),
    l = u,
    l !== a ? (t.setValue(l),
    !0) : !1
}
function Je(l) {
    if (l = l || (typeof document < "u" ? document : void 0),
    typeof l > "u")
        return null;
    try {
        return l.activeElement || l.body
    } catch {
        return l.body
    }
}
var Jd = /[\n"\\]/g;
function Ll(l) {
    return l.replace(Jd, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " "
    })
}
function jc(l, t, a, u, e, n, c, i) {
    l.name = "",
    c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.type = c : l.removeAttribute("type"),
    t != null ? c === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + Ql(t)) : l.value !== "" + Ql(t) && (l.value = "" + Ql(t)) : c !== "submit" && c !== "reset" || l.removeAttribute("value"),
    t != null ? Bc(l, c, Ql(t)) : a != null ? Bc(l, c, Ql(a)) : u != null && l.removeAttribute("value"),
    e == null && n != null && (l.defaultChecked = !!n),
    e != null && (l.checked = e && typeof e != "function" && typeof e != "symbol"),
    i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.name = "" + Ql(i) : l.removeAttribute("name")
}
function Rs(l, t, a, u, e, n, c, i) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n),
    t != null || a != null) {
        if (!(n !== "submit" && n !== "reset" || t != null)) {
            Cc(l);
            return
        }
        a = a != null ? "" + Ql(a) : "",
        t = t != null ? "" + Ql(t) : a,
        i || t === l.value || (l.value = t),
        l.defaultValue = t
    }
    u = u ?? e,
    u = typeof u != "function" && typeof u != "symbol" && !!u,
    l.checked = i ? l.checked : !!u,
    l.defaultChecked = !!u,
    c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (l.name = c),
    Cc(l)
}
function Bc(l, t, a) {
    t === "number" && Je(l.ownerDocument) === l || l.defaultValue === "" + a || (l.defaultValue = "" + a)
}
function qa(l, t, a, u) {
    if (l = l.options,
    t) {
        t = {};
        for (var e = 0; e < a.length; e++)
            t["$" + a[e]] = !0;
        for (a = 0; a < l.length; a++)
            e = t.hasOwnProperty("$" + l[a].value),
            l[a].selected !== e && (l[a].selected = e),
            e && u && (l[a].defaultSelected = !0)
    } else {
        for (a = "" + Ql(a),
        t = null,
        e = 0; e < l.length; e++) {
            if (l[e].value === a) {
                l[e].selected = !0,
                u && (l[e].defaultSelected = !0);
                return
            }
            t !== null || l[e].disabled || (t = l[e])
        }
        t !== null && (t.selected = !0)
    }
}
function Cs(l, t, a) {
    if (t != null && (t = "" + Ql(t),
    t !== l.value && (l.value = t),
    a == null)) {
        l.defaultValue !== t && (l.defaultValue = t);
        return
    }
    l.defaultValue = a != null ? "" + Ql(a) : ""
}
function js(l, t, a, u) {
    if (t == null) {
        if (u != null) {
            if (a != null)
                throw Error(b(92));
            if (bu(u)) {
                if (1 < u.length)
                    throw Error(b(93));
                u = u[0]
            }
            a = u
        }
        a == null && (a = ""),
        t = a
    }
    a = Ql(t),
    l.defaultValue = a,
    u = l.textContent,
    u === a && u !== "" && u !== null && (l.value = u),
    Cc(l)
}
function Ja(l, t) {
    if (t) {
        var a = l.firstChild;
        if (a && a === l.lastChild && a.nodeType === 3) {
            a.nodeValue = t;
            return
        }
    }
    l.textContent = t
}
var wd = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
function Cf(l, t, a) {
    var u = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? u ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : u ? l.setProperty(t, a) : typeof a != "number" || a === 0 || wd.has(t) ? t === "float" ? l.cssFloat = a : l[t] = ("" + a).trim() : l[t] = a + "px"
}
function Bs(l, t, a) {
    if (t != null && typeof t != "object")
        throw Error(b(62));
    if (l = l.style,
    a != null) {
        for (var u in a)
            !a.hasOwnProperty(u) || t != null && t.hasOwnProperty(u) || (u.indexOf("--") === 0 ? l.setProperty(u, "") : u === "float" ? l.cssFloat = "" : l[u] = "");
        for (var e in t)
            u = t[e],
            t.hasOwnProperty(e) && a[e] !== u && Cf(l, e, u)
    } else
        for (var n in t)
            t.hasOwnProperty(n) && Cf(l, n, t[n])
}
function xi(l) {
    if (l.indexOf("-") === -1)
        return !1;
    switch (l) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
        return !1;
    default:
        return !0
    }
}
var $d = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]])
  , Wd = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function De(l) {
    return Wd.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l
}
function vt() {}
var Yc = null;
function Hi(l) {
    return l = l.target || l.srcElement || window,
    l.correspondingUseElement && (l = l.correspondingUseElement),
    l.nodeType === 3 ? l.parentNode : l
}
var Da = null
  , Ga = null;
function jf(l) {
    var t = uu(l);
    if (t && (l = t.stateNode)) {
        var a = l[Dl] || null;
        l: switch (l = t.stateNode,
        t.type) {
        case "input":
            if (jc(l, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name),
            t = a.name,
            a.type === "radio" && t != null) {
                for (a = l; a.parentNode; )
                    a = a.parentNode;
                for (a = a.querySelectorAll('input[name="' + Ll("" + t) + '"][type="radio"]'),
                t = 0; t < a.length; t++) {
                    var u = a[t];
                    if (u !== l && u.form === l.form) {
                        var e = u[Dl] || null;
                        if (!e)
                            throw Error(b(90));
                        jc(u, e.value, e.defaultValue, e.defaultValue, e.checked, e.defaultChecked, e.type, e.name)
                    }
                }
                for (t = 0; t < a.length; t++)
                    u = a[t],
                    u.form === l.form && Hs(u)
            }
            break l;
        case "textarea":
            Cs(l, a.value, a.defaultValue);
            break l;
        case "select":
            t = a.value,
            t != null && qa(l, !!a.multiple, t, !1)
        }
    }
}
var Jn = !1;
function Ys(l, t, a) {
    if (Jn)
        return l(t, a);
    Jn = !0;
    try {
        var u = l(t);
        return u
    } finally {
        if (Jn = !1,
        (Da !== null || Ga !== null) && (Rn(),
        Da && (t = Da,
        l = Ga,
        Ga = Da = null,
        jf(t),
        l)))
            for (t = 0; t < l.length; t++)
                jf(l[t])
    }
}
function Yu(l, t) {
    var a = l.stateNode;
    if (a === null)
        return null;
    var u = a[Dl] || null;
    if (u === null)
        return null;
    a = u[t];
    l: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
        (u = !u.disabled) || (l = l.type,
        u = !(l === "button" || l === "input" || l === "select" || l === "textarea")),
        l = !u;
        break l;
    default:
        l = !1
    }
    if (l)
        return null;
    if (a && typeof a != "function")
        throw Error(b(231, t, typeof a));
    return a
}
var rt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u")
  , qc = !1;
if (rt)
    try {
        var du = {};
        Object.defineProperty(du, "passive", {
            get: function() {
                qc = !0
            }
        }),
        window.addEventListener("test", du, du),
        window.removeEventListener("test", du, du)
    } catch {
        qc = !1
    }
var Rt = null
  , Ri = null
  , Ue = null;
function qs() {
    if (Ue)
        return Ue;
    var l, t = Ri, a = t.length, u, e = "value"in Rt ? Rt.value : Rt.textContent, n = e.length;
    for (l = 0; l < a && t[l] === e[l]; l++)
        ;
    var c = a - l;
    for (u = 1; u <= c && t[a - u] === e[n - u]; u++)
        ;
    return Ue = e.slice(l, 1 < u ? 1 - u : void 0)
}
function Ne(l) {
    var t = l.keyCode;
    return "charCode"in l ? (l = l.charCode,
    l === 0 && t === 13 && (l = 13)) : l = t,
    l === 10 && (l = 13),
    32 <= l || l === 13 ? l : 0
}
function Se() {
    return !0
}
function Bf() {
    return !1
}
function Ul(l) {
    function t(a, u, e, n, c) {
        this._reactName = a,
        this._targetInst = e,
        this.type = u,
        this.nativeEvent = n,
        this.target = c,
        this.currentTarget = null;
        for (var i in l)
            l.hasOwnProperty(i) && (a = l[i],
            this[i] = a ? a(n) : n[i]);
        return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Se : Bf,
        this.isPropagationStopped = Bf,
        this
    }
    return F(t.prototype, {
        preventDefault: function() {
            this.defaultPrevented = !0;
            var a = this.nativeEvent;
            a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1),
            this.isDefaultPrevented = Se)
        },
        stopPropagation: function() {
            var a = this.nativeEvent;
            a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0),
            this.isPropagationStopped = Se)
        },
        persist: function() {},
        isPersistent: Se
    }),
    t
}
var ga = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
        return l.timeStamp || Date.now()
    },
    defaultPrevented: 0,
    isTrusted: 0
}, En = Ul(ga), te = F({}, ga, {
    view: 0,
    detail: 0
}), Fd = Ul(te), wn, $n, ou, Tn = F({}, te, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Ci,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
        return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget
    },
    movementX: function(l) {
        return "movementX"in l ? l.movementX : (l !== ou && (ou && l.type === "mousemove" ? (wn = l.screenX - ou.screenX,
        $n = l.screenY - ou.screenY) : $n = wn = 0,
        ou = l),
        wn)
    },
    movementY: function(l) {
        return "movementY"in l ? l.movementY : $n
    }
}), Yf = Ul(Tn), kd = F({}, Tn, {
    dataTransfer: 0
}), Id = Ul(kd), Pd = F({}, te, {
    relatedTarget: 0
}), Wn = Ul(Pd), lo = F({}, ga, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
}), to = Ul(lo), ao = F({}, ga, {
    clipboardData: function(l) {
        return "clipboardData"in l ? l.clipboardData : window.clipboardData
    }
}), uo = Ul(ao), eo = F({}, ga, {
    data: 0
}), qf = Ul(eo), no = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
}, co = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
}, io = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
};
function fo(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = io[l]) ? !!t[l] : !1
}
function Ci() {
    return fo
}
var so = F({}, te, {
    key: function(l) {
        if (l.key) {
            var t = no[l.key] || l.key;
            if (t !== "Unidentified")
                return t
        }
        return l.type === "keypress" ? (l = Ne(l),
        l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? co[l.keyCode] || "Unidentified" : ""
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ci,
    charCode: function(l) {
        return l.type === "keypress" ? Ne(l) : 0
    },
    keyCode: function(l) {
        return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0
    },
    which: function(l) {
        return l.type === "keypress" ? Ne(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0
    }
})
  , yo = Ul(so)
  , oo = F({}, Tn, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
})
  , Gf = Ul(oo)
  , mo = F({}, te, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ci
})
  , vo = Ul(mo)
  , ho = F({}, ga, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
})
  , go = Ul(ho)
  , So = F({}, Tn, {
    deltaX: function(l) {
        return "deltaX"in l ? l.deltaX : "wheelDeltaX"in l ? -l.wheelDeltaX : 0
    },
    deltaY: function(l) {
        return "deltaY"in l ? l.deltaY : "wheelDeltaY"in l ? -l.wheelDeltaY : "wheelDelta"in l ? -l.wheelDelta : 0
    },
    deltaZ: 0,
    deltaMode: 0
})
  , bo = Ul(So)
  , ro = F({}, ga, {
    newState: 0,
    oldState: 0
})
  , zo = Ul(ro)
  , Ao = [9, 13, 27, 32]
  , ji = rt && "CompositionEvent"in window
  , Tu = null;
rt && "documentMode"in document && (Tu = document.documentMode);
var Eo = rt && "TextEvent"in window && !Tu
  , Gs = rt && (!ji || Tu && 8 < Tu && 11 >= Tu)
  , Xf = " "
  , Qf = !1;
function Xs(l, t) {
    switch (l) {
    case "keyup":
        return Ao.indexOf(t.keyCode) !== -1;
    case "keydown":
        return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
        return !0;
    default:
        return !1
    }
}
function Qs(l) {
    return l = l.detail,
    typeof l == "object" && "data"in l ? l.data : null
}
var Ua = !1;
function To(l, t) {
    switch (l) {
    case "compositionend":
        return Qs(t);
    case "keypress":
        return t.which !== 32 ? null : (Qf = !0,
        Xf);
    case "textInput":
        return l = t.data,
        l === Xf && Qf ? null : l;
    default:
        return null
    }
}
function po(l, t) {
    if (Ua)
        return l === "compositionend" || !ji && Xs(l, t) ? (l = qs(),
        Ue = Ri = Rt = null,
        Ua = !1,
        l) : null;
    switch (l) {
    case "paste":
        return null;
    case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
            if (t.char && 1 < t.char.length)
                return t.char;
            if (t.which)
                return String.fromCharCode(t.which)
        }
        return null;
    case "compositionend":
        return Gs && t.locale !== "ko" ? null : t.data;
    default:
        return null
    }
}
var _o = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
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
function Zf(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!_o[l.type] : t === "textarea"
}
function Zs(l, t, a, u) {
    Da ? Ga ? Ga.push(u) : Ga = [u] : Da = u,
    t = dn(t, "onChange"),
    0 < t.length && (a = new En("onChange","change",null,a,u),
    l.push({
        event: a,
        listeners: t
    }))
}
var pu = null
  , qu = null;
function Oo(l) {
    Yy(l, 0)
}
function pn(l) {
    var t = ru(l);
    if (Hs(t))
        return l
}
function Vf(l, t) {
    if (l === "change")
        return t
}
var Vs = !1;
if (rt) {
    var Fn;
    if (rt) {
        var kn = "oninput"in document;
        if (!kn) {
            var Lf = document.createElement("div");
            Lf.setAttribute("oninput", "return;"),
            kn = typeof Lf.oninput == "function"
        }
        Fn = kn
    } else
        Fn = !1;
    Vs = Fn && (!document.documentMode || 9 < document.documentMode)
}
function Kf() {
    pu && (pu.detachEvent("onpropertychange", Ls),
    qu = pu = null)
}
function Ls(l) {
    if (l.propertyName === "value" && pn(qu)) {
        var t = [];
        Zs(t, qu, l, Hi(l)),
        Ys(Oo, t)
    }
}
function Mo(l, t, a) {
    l === "focusin" ? (Kf(),
    pu = t,
    qu = a,
    pu.attachEvent("onpropertychange", Ls)) : l === "focusout" && Kf()
}
function Do(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
        return pn(qu)
}
function Uo(l, t) {
    if (l === "click")
        return pn(t)
}
function No(l, t) {
    if (l === "input" || l === "change")
        return pn(t)
}
function xo(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t
}
var ql = typeof Object.is == "function" ? Object.is : xo;
function Gu(l, t) {
    if (ql(l, t))
        return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
        return !1;
    var a = Object.keys(l)
      , u = Object.keys(t);
    if (a.length !== u.length)
        return !1;
    for (u = 0; u < a.length; u++) {
        var e = a[u];
        if (!Hc.call(t, e) || !ql(l[e], t[e]))
            return !1
    }
    return !0
}
function Jf(l) {
    for (; l && l.firstChild; )
        l = l.firstChild;
    return l
}
function wf(l, t) {
    var a = Jf(l);
    l = 0;
    for (var u; a; ) {
        if (a.nodeType === 3) {
            if (u = l + a.textContent.length,
            l <= t && u >= t)
                return {
                    node: a,
                    offset: t - l
                };
            l = u
        }
        l: {
            for (; a; ) {
                if (a.nextSibling) {
                    a = a.nextSibling;
                    break l
                }
                a = a.parentNode
            }
            a = void 0
        }
        a = Jf(a)
    }
}
function Ks(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ks(l, t.parentNode) : "contains"in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1
}
function Js(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Je(l.document); t instanceof l.HTMLIFrameElement; ) {
        try {
            var a = typeof t.contentWindow.location.href == "string"
        } catch {
            a = !1
        }
        if (a)
            l = t.contentWindow;
        else
            break;
        t = Je(l.document)
    }
    return t
}
function Bi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true")
}
var Ho = rt && "documentMode"in document && 11 >= document.documentMode
  , Na = null
  , Gc = null
  , _u = null
  , Xc = !1;
function $f(l, t, a) {
    var u = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Xc || Na == null || Na !== Je(u) || (u = Na,
    "selectionStart"in u && Bi(u) ? u = {
        start: u.selectionStart,
        end: u.selectionEnd
    } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(),
    u = {
        anchorNode: u.anchorNode,
        anchorOffset: u.anchorOffset,
        focusNode: u.focusNode,
        focusOffset: u.focusOffset
    }),
    _u && Gu(_u, u) || (_u = u,
    u = dn(Gc, "onSelect"),
    0 < u.length && (t = new En("onSelect","select",null,t,a),
    l.push({
        event: t,
        listeners: u
    }),
    t.target = Na)))
}
function la(l, t) {
    var a = {};
    return a[l.toLowerCase()] = t.toLowerCase(),
    a["Webkit" + l] = "webkit" + t,
    a["Moz" + l] = "moz" + t,
    a
}
var xa = {
    animationend: la("Animation", "AnimationEnd"),
    animationiteration: la("Animation", "AnimationIteration"),
    animationstart: la("Animation", "AnimationStart"),
    transitionrun: la("Transition", "TransitionRun"),
    transitionstart: la("Transition", "TransitionStart"),
    transitioncancel: la("Transition", "TransitionCancel"),
    transitionend: la("Transition", "TransitionEnd")
}
  , In = {}
  , ws = {};
rt && (ws = document.createElement("div").style,
"AnimationEvent"in window || (delete xa.animationend.animation,
delete xa.animationiteration.animation,
delete xa.animationstart.animation),
"TransitionEvent"in window || delete xa.transitionend.transition);
function Sa(l) {
    if (In[l])
        return In[l];
    if (!xa[l])
        return l;
    var t = xa[l], a;
    for (a in t)
        if (t.hasOwnProperty(a) && a in ws)
            return In[l] = t[a];
    return l
}
var $s = Sa("animationend")
  , Ws = Sa("animationiteration")
  , Fs = Sa("animationstart")
  , Ro = Sa("transitionrun")
  , Co = Sa("transitionstart")
  , jo = Sa("transitioncancel")
  , ks = Sa("transitionend")
  , Is = new Map
  , Qc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
Qc.push("scrollEnd");
function Pl(l, t) {
    Is.set(l, t),
    ha(t, [l])
}
var we = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error",{
            bubbles: !0,
            cancelable: !0,
            message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
            error: l
        });
        if (!window.dispatchEvent(t))
            return
    } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", l);
        return
    }
    console.error(l)
}
  , Xl = []
  , Ha = 0
  , Yi = 0;
function _n() {
    for (var l = Ha, t = Yi = Ha = 0; t < l; ) {
        var a = Xl[t];
        Xl[t++] = null;
        var u = Xl[t];
        Xl[t++] = null;
        var e = Xl[t];
        Xl[t++] = null;
        var n = Xl[t];
        if (Xl[t++] = null,
        u !== null && e !== null) {
            var c = u.pending;
            c === null ? e.next = e : (e.next = c.next,
            c.next = e),
            u.pending = e
        }
        n !== 0 && Ps(a, e, n)
    }
}
function On(l, t, a, u) {
    Xl[Ha++] = l,
    Xl[Ha++] = t,
    Xl[Ha++] = a,
    Xl[Ha++] = u,
    Yi |= u,
    l.lanes |= u,
    l = l.alternate,
    l !== null && (l.lanes |= u)
}
function qi(l, t, a, u) {
    return On(l, t, a, u),
    $e(l)
}
function ba(l, t) {
    return On(l, null, null, t),
    $e(l)
}
function Ps(l, t, a) {
    l.lanes |= a;
    var u = l.alternate;
    u !== null && (u.lanes |= a);
    for (var e = !1, n = l.return; n !== null; )
        n.childLanes |= a,
        u = n.alternate,
        u !== null && (u.childLanes |= a),
        n.tag === 22 && (l = n.stateNode,
        l === null || l._visibility & 1 || (e = !0)),
        l = n,
        n = n.return;
    return l.tag === 3 ? (n = l.stateNode,
    e && t !== null && (e = 31 - Bl(a),
    l = n.hiddenUpdates,
    u = l[e],
    u === null ? l[e] = [t] : u.push(t),
    t.lane = a | 536870912),
    n) : null
}
function $e(l) {
    if (50 < Cu)
        throw Cu = 0,
        fi = null,
        Error(b(185));
    for (var t = l.return; t !== null; )
        l = t,
        t = l.return;
    return l.tag === 3 ? l.stateNode : null
}
var Ra = {};
function Bo(l, t, a, u) {
    this.tag = l,
    this.key = a,
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
    this.index = 0,
    this.refCleanup = this.ref = null,
    this.pendingProps = t,
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null,
    this.mode = u,
    this.subtreeFlags = this.flags = 0,
    this.deletions = null,
    this.childLanes = this.lanes = 0,
    this.alternate = null
}
function Hl(l, t, a, u) {
    return new Bo(l,t,a,u)
}
function Gi(l) {
    return l = l.prototype,
    !(!l || !l.isReactComponent)
}
function gt(l, t) {
    var a = l.alternate;
    return a === null ? (a = Hl(l.tag, t, l.key, l.mode),
    a.elementType = l.elementType,
    a.type = l.type,
    a.stateNode = l.stateNode,
    a.alternate = l,
    l.alternate = a) : (a.pendingProps = t,
    a.type = l.type,
    a.flags = 0,
    a.subtreeFlags = 0,
    a.deletions = null),
    a.flags = l.flags & 65011712,
    a.childLanes = l.childLanes,
    a.lanes = l.lanes,
    a.child = l.child,
    a.memoizedProps = l.memoizedProps,
    a.memoizedState = l.memoizedState,
    a.updateQueue = l.updateQueue,
    t = l.dependencies,
    a.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
    },
    a.sibling = l.sibling,
    a.index = l.index,
    a.ref = l.ref,
    a.refCleanup = l.refCleanup,
    a
}
function l1(l, t) {
    l.flags &= 65011714;
    var a = l.alternate;
    return a === null ? (l.childLanes = 0,
    l.lanes = t,
    l.child = null,
    l.subtreeFlags = 0,
    l.memoizedProps = null,
    l.memoizedState = null,
    l.updateQueue = null,
    l.dependencies = null,
    l.stateNode = null) : (l.childLanes = a.childLanes,
    l.lanes = a.lanes,
    l.child = a.child,
    l.subtreeFlags = 0,
    l.deletions = null,
    l.memoizedProps = a.memoizedProps,
    l.memoizedState = a.memoizedState,
    l.updateQueue = a.updateQueue,
    l.type = a.type,
    t = a.dependencies,
    l.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
    }),
    l
}
function xe(l, t, a, u, e, n) {
    var c = 0;
    if (u = l,
    typeof l == "function")
        Gi(l) && (c = 1);
    else if (typeof l == "string")
        c = Qm(l, a, ut.current) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
        l: switch (l) {
        case Dc:
            return l = Hl(31, a, t, e),
            l.elementType = Dc,
            l.lanes = n,
            l;
        case _a:
            return ca(a.children, e, n, t);
        case rs:
            c = 8,
            e |= 24;
            break;
        case _c:
            return l = Hl(12, a, t, e | 2),
            l.elementType = _c,
            l.lanes = n,
            l;
        case Oc:
            return l = Hl(13, a, t, e),
            l.elementType = Oc,
            l.lanes = n,
            l;
        case Mc:
            return l = Hl(19, a, t, e),
            l.elementType = Mc,
            l.lanes = n,
            l;
        default:
            if (typeof l == "object" && l !== null)
                switch (l.$$typeof) {
                case mt:
                    c = 10;
                    break l;
                case zs:
                    c = 9;
                    break l;
                case _i:
                    c = 11;
                    break l;
                case Oi:
                    c = 14;
                    break l;
                case Ot:
                    c = 16,
                    u = null;
                    break l
                }
            c = 29,
            a = Error(b(130, l === null ? "null" : typeof l, "")),
            u = null
        }
    return t = Hl(c, a, t, e),
    t.elementType = l,
    t.type = u,
    t.lanes = n,
    t
}
function ca(l, t, a, u) {
    return l = Hl(7, l, u, t),
    l.lanes = a,
    l
}
function Pn(l, t, a) {
    return l = Hl(6, l, null, t),
    l.lanes = a,
    l
}
function t1(l) {
    var t = Hl(18, null, null, 0);
    return t.stateNode = l,
    t
}
function lc(l, t, a) {
    return t = Hl(4, l.children !== null ? l.children : [], l.key, t),
    t.lanes = a,
    t.stateNode = {
        containerInfo: l.containerInfo,
        pendingChildren: null,
        implementation: l.implementation
    },
    t
}
var Wf = new WeakMap;
function Kl(l, t) {
    if (typeof l == "object" && l !== null) {
        var a = Wf.get(l);
        return a !== void 0 ? a : (t = {
            value: l,
            source: t,
            stack: Uf(t)
        },
        Wf.set(l, t),
        t)
    }
    return {
        value: l,
        source: t,
        stack: Uf(t)
    }
}
var Ca = []
  , ja = 0
  , We = null
  , Xu = 0
  , Zl = []
  , Vl = 0
  , Jt = null
  , lt = 1
  , tt = "";
function dt(l, t) {
    Ca[ja++] = Xu,
    Ca[ja++] = We,
    We = l,
    Xu = t
}
function a1(l, t, a) {
    Zl[Vl++] = lt,
    Zl[Vl++] = tt,
    Zl[Vl++] = Jt,
    Jt = l;
    var u = lt;
    l = tt;
    var e = 32 - Bl(u) - 1;
    u &= ~(1 << e),
    a += 1;
    var n = 32 - Bl(t) + e;
    if (30 < n) {
        var c = e - e % 5;
        n = (u & (1 << c) - 1).toString(32),
        u >>= c,
        e -= c,
        lt = 1 << 32 - Bl(t) + e | a << e | u,
        tt = n + l
    } else
        lt = 1 << n | a << e | u,
        tt = l
}
function Xi(l) {
    l.return !== null && (dt(l, 1),
    a1(l, 1, 0))
}
function Qi(l) {
    for (; l === We; )
        We = Ca[--ja],
        Ca[ja] = null,
        Xu = Ca[--ja],
        Ca[ja] = null;
    for (; l === Jt; )
        Jt = Zl[--Vl],
        Zl[Vl] = null,
        tt = Zl[--Vl],
        Zl[Vl] = null,
        lt = Zl[--Vl],
        Zl[Vl] = null
}
function u1(l, t) {
    Zl[Vl++] = lt,
    Zl[Vl++] = tt,
    Zl[Vl++] = Jt,
    lt = t.id,
    tt = t.overflow,
    Jt = l
}
var gl = null
  , $ = null
  , q = !1
  , qt = null
  , Jl = !1
  , Zc = Error(b(519));
function wt(l) {
    var t = Error(b(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw Qu(Kl(t, l)),
    Zc
}
function Ff(l) {
    var t = l.stateNode
      , a = l.type
      , u = l.memoizedProps;
    switch (t[hl] = l,
    t[Dl] = u,
    a) {
    case "dialog":
        j("cancel", t),
        j("close", t);
        break;
    case "iframe":
    case "object":
    case "embed":
        j("load", t);
        break;
    case "video":
    case "audio":
        for (a = 0; a < Ku.length; a++)
            j(Ku[a], t);
        break;
    case "source":
        j("error", t);
        break;
    case "img":
    case "image":
    case "link":
        j("error", t),
        j("load", t);
        break;
    case "details":
        j("toggle", t);
        break;
    case "input":
        j("invalid", t),
        Rs(t, u.value, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name, !0);
        break;
    case "select":
        j("invalid", t);
        break;
    case "textarea":
        j("invalid", t),
        js(t, u.value, u.defaultValue, u.children)
    }
    a = u.children,
    typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || u.suppressHydrationWarning === !0 || Gy(t.textContent, a) ? (u.popover != null && (j("beforetoggle", t),
    j("toggle", t)),
    u.onScroll != null && j("scroll", t),
    u.onScrollEnd != null && j("scrollend", t),
    u.onClick != null && (t.onclick = vt),
    t = !0) : t = !1,
    t || wt(l, !0)
}
function kf(l) {
    for (gl = l.return; gl; )
        switch (gl.tag) {
        case 5:
        case 31:
        case 13:
            Jl = !1;
            return;
        case 27:
        case 3:
            Jl = !0;
            return;
        default:
            gl = gl.return
        }
}
function za(l) {
    if (l !== gl)
        return !1;
    if (!q)
        return kf(l),
        q = !0,
        !1;
    var t = l.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = l.type,
    a = !(a !== "form" && a !== "button") || mi(l.type, l.memoizedProps)),
    a = !a),
    a && $ && wt(l),
    kf(l),
    t === 13) {
        if (l = l.memoizedState,
        l = l !== null ? l.dehydrated : null,
        !l)
            throw Error(b(317));
        $ = Y0(l)
    } else if (t === 31) {
        if (l = l.memoizedState,
        l = l !== null ? l.dehydrated : null,
        !l)
            throw Error(b(317));
        $ = Y0(l)
    } else
        t === 27 ? (t = $,
        kt(l.type) ? (l = Si,
        Si = null,
        $ = l) : $ = t) : $ = gl ? $l(l.stateNode.nextSibling) : null;
    return !0
}
function ya() {
    $ = gl = null,
    q = !1
}
function tc() {
    var l = qt;
    return l !== null && (_l === null ? _l = l : _l.push.apply(_l, l),
    qt = null),
    l
}
function Qu(l) {
    qt === null ? qt = [l] : qt.push(l)
}
var Vc = et(null)
  , ra = null
  , ht = null;
function Dt(l, t, a) {
    J(Vc, t._currentValue),
    t._currentValue = a
}
function St(l) {
    l._currentValue = Vc.current,
    ml(Vc)
}
function Lc(l, t, a) {
    for (; l !== null; ) {
        var u = l.alternate;
        if ((l.childLanes & t) !== t ? (l.childLanes |= t,
        u !== null && (u.childLanes |= t)) : u !== null && (u.childLanes & t) !== t && (u.childLanes |= t),
        l === a)
            break;
        l = l.return
    }
}
function Kc(l, t, a, u) {
    var e = l.child;
    for (e !== null && (e.return = l); e !== null; ) {
        var n = e.dependencies;
        if (n !== null) {
            var c = e.child;
            n = n.firstContext;
            l: for (; n !== null; ) {
                var i = n;
                n = e;
                for (var f = 0; f < t.length; f++)
                    if (i.context === t[f]) {
                        n.lanes |= a,
                        i = n.alternate,
                        i !== null && (i.lanes |= a),
                        Lc(n.return, a, l),
                        u || (c = null);
                        break l
                    }
                n = i.next
            }
        } else if (e.tag === 18) {
            if (c = e.return,
            c === null)
                throw Error(b(341));
            c.lanes |= a,
            n = c.alternate,
            n !== null && (n.lanes |= a),
            Lc(c, a, l),
            c = null
        } else
            c = e.child;
        if (c !== null)
            c.return = e;
        else
            for (c = e; c !== null; ) {
                if (c === l) {
                    c = null;
                    break
                }
                if (e = c.sibling,
                e !== null) {
                    e.return = c.return,
                    c = e;
                    break
                }
                c = c.return
            }
        e = c
    }
}
function eu(l, t, a, u) {
    l = null;
    for (var e = t, n = !1; e !== null; ) {
        if (!n) {
            if (e.flags & 524288)
                n = !0;
            else if (e.flags & 262144)
                break
        }
        if (e.tag === 10) {
            var c = e.alternate;
            if (c === null)
                throw Error(b(387));
            if (c = c.memoizedProps,
            c !== null) {
                var i = e.type;
                ql(e.pendingProps.value, c.value) || (l !== null ? l.push(i) : l = [i])
            }
        } else if (e === Ze.current) {
            if (c = e.alternate,
            c === null)
                throw Error(b(387));
            c.memoizedState.memoizedState !== e.memoizedState.memoizedState && (l !== null ? l.push(wu) : l = [wu])
        }
        e = e.return
    }
    l !== null && Kc(t, l, a, u),
    t.flags |= 262144
}
function Fe(l) {
    for (l = l.firstContext; l !== null; ) {
        if (!ql(l.context._currentValue, l.memoizedValue))
            return !0;
        l = l.next
    }
    return !1
}
function da(l) {
    ra = l,
    ht = null,
    l = l.dependencies,
    l !== null && (l.firstContext = null)
}
function Sl(l) {
    return e1(ra, l)
}
function be(l, t) {
    return ra === null && da(l),
    e1(l, t)
}
function e1(l, t) {
    var a = t._currentValue;
    if (t = {
        context: t,
        memoizedValue: a,
        next: null
    },
    ht === null) {
        if (l === null)
            throw Error(b(308));
        ht = t,
        l.dependencies = {
            lanes: 0,
            firstContext: t
        },
        l.flags |= 524288
    } else
        ht = ht.next = t;
    return a
}
var Yo = typeof AbortController < "u" ? AbortController : function() {
    var l = []
      , t = this.signal = {
        aborted: !1,
        addEventListener: function(a, u) {
            l.push(u)
        }
    };
    this.abort = function() {
        t.aborted = !0,
        l.forEach(function(a) {
            return a()
        })
    }
}
  , qo = sl.unstable_scheduleCallback
  , Go = sl.unstable_NormalPriority
  , cl = {
    $$typeof: mt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
};
function Zi() {
    return {
        controller: new Yo,
        data: new Map,
        refCount: 0
    }
}
function ae(l) {
    l.refCount--,
    l.refCount === 0 && qo(Go, function() {
        l.controller.abort()
    })
}
var Ou = null
  , Jc = 0
  , wa = 0
  , Xa = null;
function Xo(l, t) {
    if (Ou === null) {
        var a = Ou = [];
        Jc = 0,
        wa = vf(),
        Xa = {
            status: "pending",
            value: void 0,
            then: function(u) {
                a.push(u)
            }
        }
    }
    return Jc++,
    t.then(If, If),
    t
}
function If() {
    if (--Jc === 0 && Ou !== null) {
        Xa !== null && (Xa.status = "fulfilled");
        var l = Ou;
        Ou = null,
        wa = 0,
        Xa = null;
        for (var t = 0; t < l.length; t++)
            (0,
            l[t])()
    }
}
function Qo(l, t) {
    var a = []
      , u = {
        status: "pending",
        value: null,
        reason: null,
        then: function(e) {
            a.push(e)
        }
    };
    return l.then(function() {
        u.status = "fulfilled",
        u.value = t;
        for (var e = 0; e < a.length; e++)
            (0,
            a[e])(t)
    }, function(e) {
        for (u.status = "rejected",
        u.reason = e,
        e = 0; e < a.length; e++)
            (0,
            a[e])(void 0)
    }),
    u
}
var Pf = M.S;
M.S = function(l, t) {
    by = Cl(),
    typeof t == "object" && t !== null && typeof t.then == "function" && Xo(l, t),
    Pf !== null && Pf(l, t)
}
;
var ia = et(null);
function Vi() {
    var l = ia.current;
    return l !== null ? l : K.pooledCache
}
function He(l, t) {
    t === null ? J(ia, ia.current) : J(ia, t.pool)
}
function n1() {
    var l = Vi();
    return l === null ? null : {
        parent: cl._currentValue,
        pool: l
    }
}
var nu = Error(b(460))
  , Li = Error(b(474))
  , Mn = Error(b(542))
  , ke = {
    then: function() {}
};
function l0(l) {
    return l = l.status,
    l === "fulfilled" || l === "rejected"
}
function c1(l, t, a) {
    switch (a = l[a],
    a === void 0 ? l.push(t) : a !== t && (t.then(vt, vt),
    t = a),
    t.status) {
    case "fulfilled":
        return t.value;
    case "rejected":
        throw l = t.reason,
        a0(l),
        l;
    default:
        if (typeof t.status == "string")
            t.then(vt, vt);
        else {
            if (l = K,
            l !== null && 100 < l.shellSuspendCounter)
                throw Error(b(482));
            l = t,
            l.status = "pending",
            l.then(function(u) {
                if (t.status === "pending") {
                    var e = t;
                    e.status = "fulfilled",
                    e.value = u
                }
            }, function(u) {
                if (t.status === "pending") {
                    var e = t;
                    e.status = "rejected",
                    e.reason = u
                }
            })
        }
        switch (t.status) {
        case "fulfilled":
            return t.value;
        case "rejected":
            throw l = t.reason,
            a0(l),
            l
        }
        throw fa = t,
        nu
    }
}
function ua(l) {
    try {
        var t = l._init;
        return t(l._payload)
    } catch (a) {
        throw a !== null && typeof a == "object" && typeof a.then == "function" ? (fa = a,
        nu) : a
    }
}
var fa = null;
function t0() {
    if (fa === null)
        throw Error(b(459));
    var l = fa;
    return fa = null,
    l
}
function a0(l) {
    if (l === nu || l === Mn)
        throw Error(b(483))
}
var Qa = null
  , Zu = 0;
function re(l) {
    var t = Zu;
    return Zu += 1,
    Qa === null && (Qa = []),
    c1(Qa, l, t)
}
function mu(l, t) {
    t = t.props.ref,
    l.ref = t !== void 0 ? t : null
}
function ze(l, t) {
    throw t.$$typeof === Od ? Error(b(525)) : (l = Object.prototype.toString.call(t),
    Error(b(31, l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l)))
}
function i1(l) {
    function t(y, s) {
        if (l) {
            var m = y.deletions;
            m === null ? (y.deletions = [s],
            y.flags |= 16) : m.push(s)
        }
    }
    function a(y, s) {
        if (!l)
            return null;
        for (; s !== null; )
            t(y, s),
            s = s.sibling;
        return null
    }
    function u(y) {
        for (var s = new Map; y !== null; )
            y.key !== null ? s.set(y.key, y) : s.set(y.index, y),
            y = y.sibling;
        return s
    }
    function e(y, s) {
        return y = gt(y, s),
        y.index = 0,
        y.sibling = null,
        y
    }
    function n(y, s, m) {
        return y.index = m,
        l ? (m = y.alternate,
        m !== null ? (m = m.index,
        m < s ? (y.flags |= 67108866,
        s) : m) : (y.flags |= 67108866,
        s)) : (y.flags |= 1048576,
        s)
    }
    function c(y) {
        return l && y.alternate === null && (y.flags |= 67108866),
        y
    }
    function i(y, s, m, S) {
        return s === null || s.tag !== 6 ? (s = Pn(m, y.mode, S),
        s.return = y,
        s) : (s = e(s, m),
        s.return = y,
        s)
    }
    function f(y, s, m, S) {
        var T = m.type;
        return T === _a ? h(y, s, m.props.children, S, m.key) : s !== null && (s.elementType === T || typeof T == "object" && T !== null && T.$$typeof === Ot && ua(T) === s.type) ? (s = e(s, m.props),
        mu(s, m),
        s.return = y,
        s) : (s = xe(m.type, m.key, m.props, null, y.mode, S),
        mu(s, m),
        s.return = y,
        s)
    }
    function d(y, s, m, S) {
        return s === null || s.tag !== 4 || s.stateNode.containerInfo !== m.containerInfo || s.stateNode.implementation !== m.implementation ? (s = lc(m, y.mode, S),
        s.return = y,
        s) : (s = e(s, m.children || []),
        s.return = y,
        s)
    }
    function h(y, s, m, S, T) {
        return s === null || s.tag !== 7 ? (s = ca(m, y.mode, S, T),
        s.return = y,
        s) : (s = e(s, m),
        s.return = y,
        s)
    }
    function g(y, s, m) {
        if (typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint")
            return s = Pn("" + s, y.mode, m),
            s.return = y,
            s;
        if (typeof s == "object" && s !== null) {
            switch (s.$$typeof) {
            case oe:
                return m = xe(s.type, s.key, s.props, null, y.mode, m),
                mu(m, s),
                m.return = y,
                m;
            case Su:
                return s = lc(s, y.mode, m),
                s.return = y,
                s;
            case Ot:
                return s = ua(s),
                g(y, s, m)
            }
            if (bu(s) || yu(s))
                return s = ca(s, y.mode, m, null),
                s.return = y,
                s;
            if (typeof s.then == "function")
                return g(y, re(s), m);
            if (s.$$typeof === mt)
                return g(y, be(y, s), m);
            ze(y, s)
        }
        return null
    }
    function o(y, s, m, S) {
        var T = s !== null ? s.key : null;
        if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
            return T !== null ? null : i(y, s, "" + m, S);
        if (typeof m == "object" && m !== null) {
            switch (m.$$typeof) {
            case oe:
                return m.key === T ? f(y, s, m, S) : null;
            case Su:
                return m.key === T ? d(y, s, m, S) : null;
            case Ot:
                return m = ua(m),
                o(y, s, m, S)
            }
            if (bu(m) || yu(m))
                return T !== null ? null : h(y, s, m, S, null);
            if (typeof m.then == "function")
                return o(y, s, re(m), S);
            if (m.$$typeof === mt)
                return o(y, s, be(y, m), S);
            ze(y, m)
        }
        return null
    }
    function v(y, s, m, S, T) {
        if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
            return y = y.get(m) || null,
            i(s, y, "" + S, T);
        if (typeof S == "object" && S !== null) {
            switch (S.$$typeof) {
            case oe:
                return y = y.get(S.key === null ? m : S.key) || null,
                f(s, y, S, T);
            case Su:
                return y = y.get(S.key === null ? m : S.key) || null,
                d(s, y, S, T);
            case Ot:
                return S = ua(S),
                v(y, s, m, S, T)
            }
            if (bu(S) || yu(S))
                return y = y.get(m) || null,
                h(s, y, S, T, null);
            if (typeof S.then == "function")
                return v(y, s, m, re(S), T);
            if (S.$$typeof === mt)
                return v(y, s, m, be(s, S), T);
            ze(s, S)
        }
        return null
    }
    function r(y, s, m, S) {
        for (var T = null, O = null, A = s, _ = s = 0, D = null; A !== null && _ < m.length; _++) {
            A.index > _ ? (D = A,
            A = null) : D = A.sibling;
            var U = o(y, A, m[_], S);
            if (U === null) {
                A === null && (A = D);
                break
            }
            l && A && U.alternate === null && t(y, A),
            s = n(U, s, _),
            O === null ? T = U : O.sibling = U,
            O = U,
            A = D
        }
        if (_ === m.length)
            return a(y, A),
            q && dt(y, _),
            T;
        if (A === null) {
            for (; _ < m.length; _++)
                A = g(y, m[_], S),
                A !== null && (s = n(A, s, _),
                O === null ? T = A : O.sibling = A,
                O = A);
            return q && dt(y, _),
            T
        }
        for (A = u(A); _ < m.length; _++)
            D = v(A, y, _, m[_], S),
            D !== null && (l && D.alternate !== null && A.delete(D.key === null ? _ : D.key),
            s = n(D, s, _),
            O === null ? T = D : O.sibling = D,
            O = D);
        return l && A.forEach(function(I) {
            return t(y, I)
        }),
        q && dt(y, _),
        T
    }
    function E(y, s, m, S) {
        if (m == null)
            throw Error(b(151));
        for (var T = null, O = null, A = s, _ = s = 0, D = null, U = m.next(); A !== null && !U.done; _++,
        U = m.next()) {
            A.index > _ ? (D = A,
            A = null) : D = A.sibling;
            var I = o(y, A, U.value, S);
            if (I === null) {
                A === null && (A = D);
                break
            }
            l && A && I.alternate === null && t(y, A),
            s = n(I, s, _),
            O === null ? T = I : O.sibling = I,
            O = I,
            A = D
        }
        if (U.done)
            return a(y, A),
            q && dt(y, _),
            T;
        if (A === null) {
            for (; !U.done; _++,
            U = m.next())
                U = g(y, U.value, S),
                U !== null && (s = n(U, s, _),
                O === null ? T = U : O.sibling = U,
                O = U);
            return q && dt(y, _),
            T
        }
        for (A = u(A); !U.done; _++,
        U = m.next())
            U = v(A, y, _, U.value, S),
            U !== null && (l && U.alternate !== null && A.delete(U.key === null ? _ : U.key),
            s = n(U, s, _),
            O === null ? T = U : O.sibling = U,
            O = U);
        return l && A.forEach(function(Fl) {
            return t(y, Fl)
        }),
        q && dt(y, _),
        T
    }
    function H(y, s, m, S) {
        if (typeof m == "object" && m !== null && m.type === _a && m.key === null && (m = m.props.children),
        typeof m == "object" && m !== null) {
            switch (m.$$typeof) {
            case oe:
                l: {
                    for (var T = m.key; s !== null; ) {
                        if (s.key === T) {
                            if (T = m.type,
                            T === _a) {
                                if (s.tag === 7) {
                                    a(y, s.sibling),
                                    S = e(s, m.props.children),
                                    S.return = y,
                                    y = S;
                                    break l
                                }
                            } else if (s.elementType === T || typeof T == "object" && T !== null && T.$$typeof === Ot && ua(T) === s.type) {
                                a(y, s.sibling),
                                S = e(s, m.props),
                                mu(S, m),
                                S.return = y,
                                y = S;
                                break l
                            }
                            a(y, s);
                            break
                        } else
                            t(y, s);
                        s = s.sibling
                    }
                    m.type === _a ? (S = ca(m.props.children, y.mode, S, m.key),
                    S.return = y,
                    y = S) : (S = xe(m.type, m.key, m.props, null, y.mode, S),
                    mu(S, m),
                    S.return = y,
                    y = S)
                }
                return c(y);
            case Su:
                l: {
                    for (T = m.key; s !== null; ) {
                        if (s.key === T)
                            if (s.tag === 4 && s.stateNode.containerInfo === m.containerInfo && s.stateNode.implementation === m.implementation) {
                                a(y, s.sibling),
                                S = e(s, m.children || []),
                                S.return = y,
                                y = S;
                                break l
                            } else {
                                a(y, s);
                                break
                            }
                        else
                            t(y, s);
                        s = s.sibling
                    }
                    S = lc(m, y.mode, S),
                    S.return = y,
                    y = S
                }
                return c(y);
            case Ot:
                return m = ua(m),
                H(y, s, m, S)
            }
            if (bu(m))
                return r(y, s, m, S);
            if (yu(m)) {
                if (T = yu(m),
                typeof T != "function")
                    throw Error(b(150));
                return m = T.call(m),
                E(y, s, m, S)
            }
            if (typeof m.then == "function")
                return H(y, s, re(m), S);
            if (m.$$typeof === mt)
                return H(y, s, be(y, m), S);
            ze(y, m)
        }
        return typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint" ? (m = "" + m,
        s !== null && s.tag === 6 ? (a(y, s.sibling),
        S = e(s, m),
        S.return = y,
        y = S) : (a(y, s),
        S = Pn(m, y.mode, S),
        S.return = y,
        y = S),
        c(y)) : a(y, s)
    }
    return function(y, s, m, S) {
        try {
            Zu = 0;
            var T = H(y, s, m, S);
            return Qa = null,
            T
        } catch (A) {
            if (A === nu || A === Mn)
                throw A;
            var O = Hl(29, A, null, y.mode);
            return O.lanes = S,
            O.return = y,
            O
        } finally {}
    }
}
var oa = i1(!0)
  , f1 = i1(!1)
  , Mt = !1;
function Ki(l) {
    l.updateQueue = {
        baseState: l.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null,
            lanes: 0,
            hiddenCallbacks: null
        },
        callbacks: null
    }
}
function wc(l, t) {
    l = l.updateQueue,
    t.updateQueue === l && (t.updateQueue = {
        baseState: l.baseState,
        firstBaseUpdate: l.firstBaseUpdate,
        lastBaseUpdate: l.lastBaseUpdate,
        shared: l.shared,
        callbacks: null
    })
}
function Gt(l) {
    return {
        lane: l,
        tag: 0,
        payload: null,
        callback: null,
        next: null
    }
}
function Xt(l, t, a) {
    var u = l.updateQueue;
    if (u === null)
        return null;
    if (u = u.shared,
    G & 2) {
        var e = u.pending;
        return e === null ? t.next = t : (t.next = e.next,
        e.next = t),
        u.pending = t,
        t = $e(l),
        Ps(l, null, a),
        t
    }
    return On(l, u, t, a),
    $e(l)
}
function Mu(l, t, a) {
    if (t = t.updateQueue,
    t !== null && (t = t.shared,
    (a & 4194048) !== 0)) {
        var u = t.lanes;
        u &= l.pendingLanes,
        a |= u,
        t.lanes = a,
        Os(l, a)
    }
}
function ac(l, t) {
    var a = l.updateQueue
      , u = l.alternate;
    if (u !== null && (u = u.updateQueue,
    a === u)) {
        var e = null
          , n = null;
        if (a = a.firstBaseUpdate,
        a !== null) {
            do {
                var c = {
                    lane: a.lane,
                    tag: a.tag,
                    payload: a.payload,
                    callback: null,
                    next: null
                };
                n === null ? e = n = c : n = n.next = c,
                a = a.next
            } while (a !== null);
            n === null ? e = n = t : n = n.next = t
        } else
            e = n = t;
        a = {
            baseState: u.baseState,
            firstBaseUpdate: e,
            lastBaseUpdate: n,
            shared: u.shared,
            callbacks: u.callbacks
        },
        l.updateQueue = a;
        return
    }
    l = a.lastBaseUpdate,
    l === null ? a.firstBaseUpdate = t : l.next = t,
    a.lastBaseUpdate = t
}
var $c = !1;
function Du() {
    if ($c) {
        var l = Xa;
        if (l !== null)
            throw l
    }
}
function Uu(l, t, a, u) {
    $c = !1;
    var e = l.updateQueue;
    Mt = !1;
    var n = e.firstBaseUpdate
      , c = e.lastBaseUpdate
      , i = e.shared.pending;
    if (i !== null) {
        e.shared.pending = null;
        var f = i
          , d = f.next;
        f.next = null,
        c === null ? n = d : c.next = d,
        c = f;
        var h = l.alternate;
        h !== null && (h = h.updateQueue,
        i = h.lastBaseUpdate,
        i !== c && (i === null ? h.firstBaseUpdate = d : i.next = d,
        h.lastBaseUpdate = f))
    }
    if (n !== null) {
        var g = e.baseState;
        c = 0,
        h = d = f = null,
        i = n;
        do {
            var o = i.lane & -536870913
              , v = o !== i.lane;
            if (v ? (Y & o) === o : (u & o) === o) {
                o !== 0 && o === wa && ($c = !0),
                h !== null && (h = h.next = {
                    lane: 0,
                    tag: i.tag,
                    payload: i.payload,
                    callback: null,
                    next: null
                });
                l: {
                    var r = l
                      , E = i;
                    o = t;
                    var H = a;
                    switch (E.tag) {
                    case 1:
                        if (r = E.payload,
                        typeof r == "function") {
                            g = r.call(H, g, o);
                            break l
                        }
                        g = r;
                        break l;
                    case 3:
                        r.flags = r.flags & -65537 | 128;
                    case 0:
                        if (r = E.payload,
                        o = typeof r == "function" ? r.call(H, g, o) : r,
                        o == null)
                            break l;
                        g = F({}, g, o);
                        break l;
                    case 2:
                        Mt = !0
                    }
                }
                o = i.callback,
                o !== null && (l.flags |= 64,
                v && (l.flags |= 8192),
                v = e.callbacks,
                v === null ? e.callbacks = [o] : v.push(o))
            } else
                v = {
                    lane: o,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                },
                h === null ? (d = h = v,
                f = g) : h = h.next = v,
                c |= o;
            if (i = i.next,
            i === null) {
                if (i = e.shared.pending,
                i === null)
                    break;
                v = i,
                i = v.next,
                v.next = null,
                e.lastBaseUpdate = v,
                e.shared.pending = null
            }
        } while (!0);
        h === null && (f = g),
        e.baseState = f,
        e.firstBaseUpdate = d,
        e.lastBaseUpdate = h,
        n === null && (e.shared.lanes = 0),
        Wt |= c,
        l.lanes = c,
        l.memoizedState = g
    }
}
function s1(l, t) {
    if (typeof l != "function")
        throw Error(b(191, l));
    l.call(t)
}
function y1(l, t) {
    var a = l.callbacks;
    if (a !== null)
        for (l.callbacks = null,
        l = 0; l < a.length; l++)
            s1(a[l], t)
}
var $a = et(null)
  , Ie = et(0);
function u0(l, t) {
    l = Tt,
    J(Ie, l),
    J($a, t),
    Tt = l | t.baseLanes
}
function Wc() {
    J(Ie, Tt),
    J($a, $a.current)
}
function Ji() {
    Tt = Ie.current,
    ml($a),
    ml(Ie)
}
var Gl = et(null)
  , wl = null;
function Ut(l) {
    var t = l.alternate;
    J(al, al.current & 1),
    J(Gl, l),
    wl === null && (t === null || $a.current !== null || t.memoizedState !== null) && (wl = l)
}
function Fc(l) {
    J(al, al.current),
    J(Gl, l),
    wl === null && (wl = l)
}
function d1(l) {
    l.tag === 22 ? (J(al, al.current),
    J(Gl, l),
    wl === null && (wl = l)) : Nt()
}
function Nt() {
    J(al, al.current),
    J(Gl, Gl.current)
}
function xl(l) {
    ml(Gl),
    wl === l && (wl = null),
    ml(al)
}
var al = et(0);
function Pe(l) {
    for (var t = l; t !== null; ) {
        if (t.tag === 13) {
            var a = t.memoizedState;
            if (a !== null && (a = a.dehydrated,
            a === null || hi(a) || gi(a)))
                return t
        } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
            if (t.flags & 128)
                return t
        } else if (t.child !== null) {
            t.child.return = t,
            t = t.child;
            continue
        }
        if (t === l)
            break;
        for (; t.sibling === null; ) {
            if (t.return === null || t.return === l)
                return null;
            t = t.return
        }
        t.sibling.return = t.return,
        t = t.sibling
    }
    return null
}
var zt = 0
  , x = null
  , L = null
  , el = null
  , ln = !1
  , Za = !1
  , ma = !1
  , tn = 0
  , Vu = 0
  , Va = null
  , Zo = 0;
function P() {
    throw Error(b(321))
}
function wi(l, t) {
    if (t === null)
        return !1;
    for (var a = 0; a < t.length && a < l.length; a++)
        if (!ql(l[a], t[a]))
            return !1;
    return !0
}
function $i(l, t, a, u, e, n) {
    return zt = n,
    x = t,
    t.memoizedState = null,
    t.updateQueue = null,
    t.lanes = 0,
    M.H = l === null || l.memoizedState === null ? Z1 : nf,
    ma = !1,
    n = a(u, e),
    ma = !1,
    Za && (n = m1(t, a, u, e)),
    o1(l),
    n
}
function o1(l) {
    M.H = Lu;
    var t = L !== null && L.next !== null;
    if (zt = 0,
    el = L = x = null,
    ln = !1,
    Vu = 0,
    Va = null,
    t)
        throw Error(b(300));
    l === null || il || (l = l.dependencies,
    l !== null && Fe(l) && (il = !0))
}
function m1(l, t, a, u) {
    x = l;
    var e = 0;
    do {
        if (Za && (Va = null),
        Vu = 0,
        Za = !1,
        25 <= e)
            throw Error(b(301));
        if (e += 1,
        el = L = null,
        l.updateQueue != null) {
            var n = l.updateQueue;
            n.lastEffect = null,
            n.events = null,
            n.stores = null,
            n.memoCache != null && (n.memoCache.index = 0)
        }
        M.H = V1,
        n = t(a, u)
    } while (Za);
    return n
}
function Vo() {
    var l = M.H
      , t = l.useState()[0];
    return t = typeof t.then == "function" ? ue(t) : t,
    l = l.useState()[0],
    (L !== null ? L.memoizedState : null) !== l && (x.flags |= 1024),
    t
}
function Wi() {
    var l = tn !== 0;
    return tn = 0,
    l
}
function Fi(l, t, a) {
    t.updateQueue = l.updateQueue,
    t.flags &= -2053,
    l.lanes &= ~a
}
function ki(l) {
    if (ln) {
        for (l = l.memoizedState; l !== null; ) {
            var t = l.queue;
            t !== null && (t.pending = null),
            l = l.next
        }
        ln = !1
    }
    zt = 0,
    el = L = x = null,
    Za = !1,
    Vu = tn = 0,
    Va = null
}
function rl() {
    var l = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
    };
    return el === null ? x.memoizedState = el = l : el = el.next = l,
    el
}
function ul() {
    if (L === null) {
        var l = x.alternate;
        l = l !== null ? l.memoizedState : null
    } else
        l = L.next;
    var t = el === null ? x.memoizedState : el.next;
    if (t !== null)
        el = t,
        L = l;
    else {
        if (l === null)
            throw x.alternate === null ? Error(b(467)) : Error(b(310));
        L = l,
        l = {
            memoizedState: L.memoizedState,
            baseState: L.baseState,
            baseQueue: L.baseQueue,
            queue: L.queue,
            next: null
        },
        el === null ? x.memoizedState = el = l : el = el.next = l
    }
    return el
}
function Dn() {
    return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
    }
}
function ue(l) {
    var t = Vu;
    return Vu += 1,
    Va === null && (Va = []),
    l = c1(Va, l, t),
    t = x,
    (el === null ? t.memoizedState : el.next) === null && (t = t.alternate,
    M.H = t === null || t.memoizedState === null ? Z1 : nf),
    l
}
function Un(l) {
    if (l !== null && typeof l == "object") {
        if (typeof l.then == "function")
            return ue(l);
        if (l.$$typeof === mt)
            return Sl(l)
    }
    throw Error(b(438, String(l)))
}
function Ii(l) {
    var t = null
      , a = x.updateQueue;
    if (a !== null && (t = a.memoCache),
    t == null) {
        var u = x.alternate;
        u !== null && (u = u.updateQueue,
        u !== null && (u = u.memoCache,
        u != null && (t = {
            data: u.data.map(function(e) {
                return e.slice()
            }),
            index: 0
        })))
    }
    if (t == null && (t = {
        data: [],
        index: 0
    }),
    a === null && (a = Dn(),
    x.updateQueue = a),
    a.memoCache = t,
    a = t.data[t.index],
    a === void 0)
        for (a = t.data[t.index] = Array(l),
        u = 0; u < l; u++)
            a[u] = Md;
    return t.index++,
    a
}
function At(l, t) {
    return typeof t == "function" ? t(l) : t
}
function Re(l) {
    var t = ul();
    return Pi(t, L, l)
}
function Pi(l, t, a) {
    var u = l.queue;
    if (u === null)
        throw Error(b(311));
    u.lastRenderedReducer = a;
    var e = l.baseQueue
      , n = u.pending;
    if (n !== null) {
        if (e !== null) {
            var c = e.next;
            e.next = n.next,
            n.next = c
        }
        t.baseQueue = e = n,
        u.pending = null
    }
    if (n = l.baseState,
    e === null)
        l.memoizedState = n;
    else {
        t = e.next;
        var i = c = null
          , f = null
          , d = t
          , h = !1;
        do {
            var g = d.lane & -536870913;
            if (g !== d.lane ? (Y & g) === g : (zt & g) === g) {
                var o = d.revertLane;
                if (o === 0)
                    f !== null && (f = f.next = {
                        lane: 0,
                        revertLane: 0,
                        gesture: null,
                        action: d.action,
                        hasEagerState: d.hasEagerState,
                        eagerState: d.eagerState,
                        next: null
                    }),
                    g === wa && (h = !0);
                else if ((zt & o) === o) {
                    d = d.next,
                    o === wa && (h = !0);
                    continue
                } else
                    g = {
                        lane: 0,
                        revertLane: d.revertLane,
                        gesture: null,
                        action: d.action,
                        hasEagerState: d.hasEagerState,
                        eagerState: d.eagerState,
                        next: null
                    },
                    f === null ? (i = f = g,
                    c = n) : f = f.next = g,
                    x.lanes |= o,
                    Wt |= o;
                g = d.action,
                ma && a(n, g),
                n = d.hasEagerState ? d.eagerState : a(n, g)
            } else
                o = {
                    lane: g,
                    revertLane: d.revertLane,
                    gesture: d.gesture,
                    action: d.action,
                    hasEagerState: d.hasEagerState,
                    eagerState: d.eagerState,
                    next: null
                },
                f === null ? (i = f = o,
                c = n) : f = f.next = o,
                x.lanes |= g,
                Wt |= g;
            d = d.next
        } while (d !== null && d !== t);
        if (f === null ? c = n : f.next = i,
        !ql(n, l.memoizedState) && (il = !0,
        h && (a = Xa,
        a !== null)))
            throw a;
        l.memoizedState = n,
        l.baseState = c,
        l.baseQueue = f,
        u.lastRenderedState = n
    }
    return e === null && (u.lanes = 0),
    [l.memoizedState, u.dispatch]
}
function uc(l) {
    var t = ul()
      , a = t.queue;
    if (a === null)
        throw Error(b(311));
    a.lastRenderedReducer = l;
    var u = a.dispatch
      , e = a.pending
      , n = t.memoizedState;
    if (e !== null) {
        a.pending = null;
        var c = e = e.next;
        do
            n = l(n, c.action),
            c = c.next;
        while (c !== e);
        ql(n, t.memoizedState) || (il = !0),
        t.memoizedState = n,
        t.baseQueue === null && (t.baseState = n),
        a.lastRenderedState = n
    }
    return [n, u]
}
function v1(l, t, a) {
    var u = x
      , e = ul()
      , n = q;
    if (n) {
        if (a === void 0)
            throw Error(b(407));
        a = a()
    } else
        a = t();
    var c = !ql((L || e).memoizedState, a);
    if (c && (e.memoizedState = a,
    il = !0),
    e = e.queue,
    lf(S1.bind(null, u, e, l), [l]),
    e.getSnapshot !== t || c || el !== null && el.memoizedState.tag & 1) {
        if (u.flags |= 2048,
        Wa(9, {
            destroy: void 0
        }, g1.bind(null, u, e, a, t), null),
        K === null)
            throw Error(b(349));
        n || zt & 127 || h1(u, t, a)
    }
    return a
}
function h1(l, t, a) {
    l.flags |= 16384,
    l = {
        getSnapshot: t,
        value: a
    },
    t = x.updateQueue,
    t === null ? (t = Dn(),
    x.updateQueue = t,
    t.stores = [l]) : (a = t.stores,
    a === null ? t.stores = [l] : a.push(l))
}
function g1(l, t, a, u) {
    t.value = a,
    t.getSnapshot = u,
    b1(t) && r1(l)
}
function S1(l, t, a) {
    return a(function() {
        b1(t) && r1(l)
    })
}
function b1(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
        var a = t();
        return !ql(l, a)
    } catch {
        return !0
    }
}
function r1(l) {
    var t = ba(l, 2);
    t !== null && Ml(t, l, 2)
}
function kc(l) {
    var t = rl();
    if (typeof l == "function") {
        var a = l;
        if (l = a(),
        ma) {
            Ht(!0);
            try {
                a()
            } finally {
                Ht(!1)
            }
        }
    }
    return t.memoizedState = t.baseState = l,
    t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: At,
        lastRenderedState: l
    },
    t
}
function z1(l, t, a, u) {
    return l.baseState = a,
    Pi(l, L, typeof u == "function" ? u : At)
}
function Lo(l, t, a, u, e) {
    if (xn(l))
        throw Error(b(485));
    if (l = t.action,
    l !== null) {
        var n = {
            payload: e,
            action: l,
            next: null,
            isTransition: !0,
            status: "pending",
            value: null,
            reason: null,
            listeners: [],
            then: function(c) {
                n.listeners.push(c)
            }
        };
        M.T !== null ? a(!0) : n.isTransition = !1,
        u(n),
        a = t.pending,
        a === null ? (n.next = t.pending = n,
        A1(t, n)) : (n.next = a.next,
        t.pending = a.next = n)
    }
}
function A1(l, t) {
    var a = t.action
      , u = t.payload
      , e = l.state;
    if (t.isTransition) {
        var n = M.T
          , c = {};
        M.T = c;
        try {
            var i = a(e, u)
              , f = M.S;
            f !== null && f(c, i),
            e0(l, t, i)
        } catch (d) {
            Ic(l, t, d)
        } finally {
            n !== null && c.types !== null && (n.types = c.types),
            M.T = n
        }
    } else
        try {
            n = a(e, u),
            e0(l, t, n)
        } catch (d) {
            Ic(l, t, d)
        }
}
function e0(l, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function(u) {
        n0(l, t, u)
    }, function(u) {
        return Ic(l, t, u)
    }) : n0(l, t, a)
}
function n0(l, t, a) {
    t.status = "fulfilled",
    t.value = a,
    E1(t),
    l.state = a,
    t = l.pending,
    t !== null && (a = t.next,
    a === t ? l.pending = null : (a = a.next,
    t.next = a,
    A1(l, a)))
}
function Ic(l, t, a) {
    var u = l.pending;
    if (l.pending = null,
    u !== null) {
        u = u.next;
        do
            t.status = "rejected",
            t.reason = a,
            E1(t),
            t = t.next;
        while (t !== u)
    }
    l.action = null
}
function E1(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++)
        (0,
        l[t])()
}
function T1(l, t) {
    return t
}
function c0(l, t) {
    if (q) {
        var a = K.formState;
        if (a !== null) {
            l: {
                var u = x;
                if (q) {
                    if ($) {
                        t: {
                            for (var e = $, n = Jl; e.nodeType !== 8; ) {
                                if (!n) {
                                    e = null;
                                    break t
                                }
                                if (e = $l(e.nextSibling),
                                e === null) {
                                    e = null;
                                    break t
                                }
                            }
                            n = e.data,
                            e = n === "F!" || n === "F" ? e : null
                        }
                        if (e) {
                            $ = $l(e.nextSibling),
                            u = e.data === "F!";
                            break l
                        }
                    }
                    wt(u)
                }
                u = !1
            }
            u && (t = a[0])
        }
    }
    return a = rl(),
    a.memoizedState = a.baseState = t,
    u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: T1,
        lastRenderedState: t
    },
    a.queue = u,
    a = G1.bind(null, x, u),
    u.dispatch = a,
    u = kc(!1),
    n = ef.bind(null, x, !1, u.queue),
    u = rl(),
    e = {
        state: t,
        dispatch: null,
        action: l,
        pending: null
    },
    u.queue = e,
    a = Lo.bind(null, x, e, n, a),
    e.dispatch = a,
    u.memoizedState = l,
    [t, a, !1]
}
function i0(l) {
    var t = ul();
    return p1(t, L, l)
}
function p1(l, t, a) {
    if (t = Pi(l, t, T1)[0],
    l = Re(At)[0],
    typeof t == "object" && t !== null && typeof t.then == "function")
        try {
            var u = ue(t)
        } catch (c) {
            throw c === nu ? Mn : c
        }
    else
        u = t;
    t = ul();
    var e = t.queue
      , n = e.dispatch;
    return a !== t.memoizedState && (x.flags |= 2048,
    Wa(9, {
        destroy: void 0
    }, Ko.bind(null, e, a), null)),
    [u, n, l]
}
function Ko(l, t) {
    l.action = t
}
function f0(l) {
    var t = ul()
      , a = L;
    if (a !== null)
        return p1(t, a, l);
    ul(),
    t = t.memoizedState,
    a = ul();
    var u = a.queue.dispatch;
    return a.memoizedState = l,
    [t, u, !1]
}
function Wa(l, t, a, u) {
    return l = {
        tag: l,
        create: a,
        deps: u,
        inst: t,
        next: null
    },
    t = x.updateQueue,
    t === null && (t = Dn(),
    x.updateQueue = t),
    a = t.lastEffect,
    a === null ? t.lastEffect = l.next = l : (u = a.next,
    a.next = l,
    l.next = u,
    t.lastEffect = l),
    l
}
function _1() {
    return ul().memoizedState
}
function Ce(l, t, a, u) {
    var e = rl();
    x.flags |= l,
    e.memoizedState = Wa(1 | t, {
        destroy: void 0
    }, a, u === void 0 ? null : u)
}
function Nn(l, t, a, u) {
    var e = ul();
    u = u === void 0 ? null : u;
    var n = e.memoizedState.inst;
    L !== null && u !== null && wi(u, L.memoizedState.deps) ? e.memoizedState = Wa(t, n, a, u) : (x.flags |= l,
    e.memoizedState = Wa(1 | t, n, a, u))
}
function s0(l, t) {
    Ce(8390656, 8, l, t)
}
function lf(l, t) {
    Nn(2048, 8, l, t)
}
function Jo(l) {
    x.flags |= 4;
    var t = x.updateQueue;
    if (t === null)
        t = Dn(),
        x.updateQueue = t,
        t.events = [l];
    else {
        var a = t.events;
        a === null ? t.events = [l] : a.push(l)
    }
}
function O1(l) {
    var t = ul().memoizedState;
    return Jo({
        ref: t,
        nextImpl: l
    }),
    function() {
        if (G & 2)
            throw Error(b(440));
        return t.impl.apply(void 0, arguments)
    }
}
function M1(l, t) {
    return Nn(4, 2, l, t)
}
function D1(l, t) {
    return Nn(4, 4, l, t)
}
function U1(l, t) {
    if (typeof t == "function") {
        l = l();
        var a = t(l);
        return function() {
            typeof a == "function" ? a() : t(null)
        }
    }
    if (t != null)
        return l = l(),
        t.current = l,
        function() {
            t.current = null
        }
}
function N1(l, t, a) {
    a = a != null ? a.concat([l]) : null,
    Nn(4, 4, U1.bind(null, t, l), a)
}
function tf() {}
function x1(l, t) {
    var a = ul();
    t = t === void 0 ? null : t;
    var u = a.memoizedState;
    return t !== null && wi(t, u[1]) ? u[0] : (a.memoizedState = [l, t],
    l)
}
function H1(l, t) {
    var a = ul();
    t = t === void 0 ? null : t;
    var u = a.memoizedState;
    if (t !== null && wi(t, u[1]))
        return u[0];
    if (u = l(),
    ma) {
        Ht(!0);
        try {
            l()
        } finally {
            Ht(!1)
        }
    }
    return a.memoizedState = [u, t],
    u
}
function af(l, t, a) {
    return a === void 0 || zt & 1073741824 && !(Y & 261930) ? l.memoizedState = t : (l.memoizedState = a,
    l = zy(),
    x.lanes |= l,
    Wt |= l,
    a)
}
function R1(l, t, a, u) {
    return ql(a, t) ? a : $a.current !== null ? (l = af(l, a, u),
    ql(l, t) || (il = !0),
    l) : !(zt & 42) || zt & 1073741824 && !(Y & 261930) ? (il = !0,
    l.memoizedState = a) : (l = zy(),
    x.lanes |= l,
    Wt |= l,
    t)
}
function C1(l, t, a, u, e) {
    var n = X.p;
    X.p = n !== 0 && 8 > n ? n : 8;
    var c = M.T
      , i = {};
    M.T = i,
    ef(l, !1, t, a);
    try {
        var f = e()
          , d = M.S;
        if (d !== null && d(i, f),
        f !== null && typeof f == "object" && typeof f.then == "function") {
            var h = Qo(f, u);
            Nu(l, t, h, Yl(l))
        } else
            Nu(l, t, u, Yl(l))
    } catch (g) {
        Nu(l, t, {
            then: function() {},
            status: "rejected",
            reason: g
        }, Yl())
    } finally {
        X.p = n,
        c !== null && i.types !== null && (c.types = i.types),
        M.T = c
    }
}
function wo() {}
function Pc(l, t, a, u) {
    if (l.tag !== 5)
        throw Error(b(476));
    var e = j1(l).queue;
    C1(l, e, t, na, a === null ? wo : function() {
        return B1(l),
        a(u)
    }
    )
}
function j1(l) {
    var t = l.memoizedState;
    if (t !== null)
        return t;
    t = {
        memoizedState: na,
        baseState: na,
        baseQueue: null,
        queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: At,
            lastRenderedState: na
        },
        next: null
    };
    var a = {};
    return t.next = {
        memoizedState: a,
        baseState: a,
        baseQueue: null,
        queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: At,
            lastRenderedState: a
        },
        next: null
    },
    l.memoizedState = t,
    l = l.alternate,
    l !== null && (l.memoizedState = t),
    t
}
function B1(l) {
    var t = j1(l);
    t.next === null && (t = l.alternate.memoizedState),
    Nu(l, t.next.queue, {}, Yl())
}
function uf() {
    return Sl(wu)
}
function Y1() {
    return ul().memoizedState
}
function q1() {
    return ul().memoizedState
}
function $o(l) {
    for (var t = l.return; t !== null; ) {
        switch (t.tag) {
        case 24:
        case 3:
            var a = Yl();
            l = Gt(a);
            var u = Xt(t, l, a);
            u !== null && (Ml(u, t, a),
            Mu(u, t, a)),
            t = {
                cache: Zi()
            },
            l.payload = t;
            return
        }
        t = t.return
    }
}
function Wo(l, t, a) {
    var u = Yl();
    a = {
        lane: u,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
    },
    xn(l) ? X1(t, a) : (a = qi(l, t, a, u),
    a !== null && (Ml(a, l, u),
    Q1(a, t, u)))
}
function G1(l, t, a) {
    var u = Yl();
    Nu(l, t, a, u)
}
function Nu(l, t, a, u) {
    var e = {
        lane: u,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
    };
    if (xn(l))
        X1(t, e);
    else {
        var n = l.alternate;
        if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer,
        n !== null))
            try {
                var c = t.lastRenderedState
                  , i = n(c, a);
                if (e.hasEagerState = !0,
                e.eagerState = i,
                ql(i, c))
                    return On(l, t, e, 0),
                    K === null && _n(),
                    !1
            } catch {} finally {}
        if (a = qi(l, t, e, u),
        a !== null)
            return Ml(a, l, u),
            Q1(a, t, u),
            !0
    }
    return !1
}
function ef(l, t, a, u) {
    if (u = {
        lane: 2,
        revertLane: vf(),
        gesture: null,
        action: u,
        hasEagerState: !1,
        eagerState: null,
        next: null
    },
    xn(l)) {
        if (t)
            throw Error(b(479))
    } else
        t = qi(l, a, u, 2),
        t !== null && Ml(t, l, 2)
}
function xn(l) {
    var t = l.alternate;
    return l === x || t !== null && t === x
}
function X1(l, t) {
    Za = ln = !0;
    var a = l.pending;
    a === null ? t.next = t : (t.next = a.next,
    a.next = t),
    l.pending = t
}
function Q1(l, t, a) {
    if (a & 4194048) {
        var u = t.lanes;
        u &= l.pendingLanes,
        a |= u,
        t.lanes = a,
        Os(l, a)
    }
}
var Lu = {
    readContext: Sl,
    use: Un,
    useCallback: P,
    useContext: P,
    useEffect: P,
    useImperativeHandle: P,
    useLayoutEffect: P,
    useInsertionEffect: P,
    useMemo: P,
    useReducer: P,
    useRef: P,
    useState: P,
    useDebugValue: P,
    useDeferredValue: P,
    useTransition: P,
    useSyncExternalStore: P,
    useId: P,
    useHostTransitionStatus: P,
    useFormState: P,
    useActionState: P,
    useOptimistic: P,
    useMemoCache: P,
    useCacheRefresh: P
};
Lu.useEffectEvent = P;
var Z1 = {
    readContext: Sl,
    use: Un,
    useCallback: function(l, t) {
        return rl().memoizedState = [l, t === void 0 ? null : t],
        l
    },
    useContext: Sl,
    useEffect: s0,
    useImperativeHandle: function(l, t, a) {
        a = a != null ? a.concat([l]) : null,
        Ce(4194308, 4, U1.bind(null, t, l), a)
    },
    useLayoutEffect: function(l, t) {
        return Ce(4194308, 4, l, t)
    },
    useInsertionEffect: function(l, t) {
        Ce(4, 2, l, t)
    },
    useMemo: function(l, t) {
        var a = rl();
        t = t === void 0 ? null : t;
        var u = l();
        if (ma) {
            Ht(!0);
            try {
                l()
            } finally {
                Ht(!1)
            }
        }
        return a.memoizedState = [u, t],
        u
    },
    useReducer: function(l, t, a) {
        var u = rl();
        if (a !== void 0) {
            var e = a(t);
            if (ma) {
                Ht(!0);
                try {
                    a(t)
                } finally {
                    Ht(!1)
                }
            }
        } else
            e = t;
        return u.memoizedState = u.baseState = e,
        l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: l,
            lastRenderedState: e
        },
        u.queue = l,
        l = l.dispatch = Wo.bind(null, x, l),
        [u.memoizedState, l]
    },
    useRef: function(l) {
        var t = rl();
        return l = {
            current: l
        },
        t.memoizedState = l
    },
    useState: function(l) {
        l = kc(l);
        var t = l.queue
          , a = G1.bind(null, x, t);
        return t.dispatch = a,
        [l.memoizedState, a]
    },
    useDebugValue: tf,
    useDeferredValue: function(l, t) {
        var a = rl();
        return af(a, l, t)
    },
    useTransition: function() {
        var l = kc(!1);
        return l = C1.bind(null, x, l.queue, !0, !1),
        rl().memoizedState = l,
        [!1, l]
    },
    useSyncExternalStore: function(l, t, a) {
        var u = x
          , e = rl();
        if (q) {
            if (a === void 0)
                throw Error(b(407));
            a = a()
        } else {
            if (a = t(),
            K === null)
                throw Error(b(349));
            Y & 127 || h1(u, t, a)
        }
        e.memoizedState = a;
        var n = {
            value: a,
            getSnapshot: t
        };
        return e.queue = n,
        s0(S1.bind(null, u, n, l), [l]),
        u.flags |= 2048,
        Wa(9, {
            destroy: void 0
        }, g1.bind(null, u, n, a, t), null),
        a
    },
    useId: function() {
        var l = rl()
          , t = K.identifierPrefix;
        if (q) {
            var a = tt
              , u = lt;
            a = (u & ~(1 << 32 - Bl(u) - 1)).toString(32) + a,
            t = "_" + t + "R_" + a,
            a = tn++,
            0 < a && (t += "H" + a.toString(32)),
            t += "_"
        } else
            a = Zo++,
            t = "_" + t + "r_" + a.toString(32) + "_";
        return l.memoizedState = t
    },
    useHostTransitionStatus: uf,
    useFormState: c0,
    useActionState: c0,
    useOptimistic: function(l) {
        var t = rl();
        t.memoizedState = t.baseState = l;
        var a = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null
        };
        return t.queue = a,
        t = ef.bind(null, x, !0, a),
        a.dispatch = t,
        [l, t]
    },
    useMemoCache: Ii,
    useCacheRefresh: function() {
        return rl().memoizedState = $o.bind(null, x)
    },
    useEffectEvent: function(l) {
        var t = rl()
          , a = {
            impl: l
        };
        return t.memoizedState = a,
        function() {
            if (G & 2)
                throw Error(b(440));
            return a.impl.apply(void 0, arguments)
        }
    }
}
  , nf = {
    readContext: Sl,
    use: Un,
    useCallback: x1,
    useContext: Sl,
    useEffect: lf,
    useImperativeHandle: N1,
    useInsertionEffect: M1,
    useLayoutEffect: D1,
    useMemo: H1,
    useReducer: Re,
    useRef: _1,
    useState: function() {
        return Re(At)
    },
    useDebugValue: tf,
    useDeferredValue: function(l, t) {
        var a = ul();
        return R1(a, L.memoizedState, l, t)
    },
    useTransition: function() {
        var l = Re(At)[0]
          , t = ul().memoizedState;
        return [typeof l == "boolean" ? l : ue(l), t]
    },
    useSyncExternalStore: v1,
    useId: Y1,
    useHostTransitionStatus: uf,
    useFormState: i0,
    useActionState: i0,
    useOptimistic: function(l, t) {
        var a = ul();
        return z1(a, L, l, t)
    },
    useMemoCache: Ii,
    useCacheRefresh: q1
};
nf.useEffectEvent = O1;
var V1 = {
    readContext: Sl,
    use: Un,
    useCallback: x1,
    useContext: Sl,
    useEffect: lf,
    useImperativeHandle: N1,
    useInsertionEffect: M1,
    useLayoutEffect: D1,
    useMemo: H1,
    useReducer: uc,
    useRef: _1,
    useState: function() {
        return uc(At)
    },
    useDebugValue: tf,
    useDeferredValue: function(l, t) {
        var a = ul();
        return L === null ? af(a, l, t) : R1(a, L.memoizedState, l, t)
    },
    useTransition: function() {
        var l = uc(At)[0]
          , t = ul().memoizedState;
        return [typeof l == "boolean" ? l : ue(l), t]
    },
    useSyncExternalStore: v1,
    useId: Y1,
    useHostTransitionStatus: uf,
    useFormState: f0,
    useActionState: f0,
    useOptimistic: function(l, t) {
        var a = ul();
        return L !== null ? z1(a, L, l, t) : (a.baseState = l,
        [l, a.queue.dispatch])
    },
    useMemoCache: Ii,
    useCacheRefresh: q1
};
V1.useEffectEvent = O1;
function ec(l, t, a, u) {
    t = l.memoizedState,
    a = a(u, t),
    a = a == null ? t : F({}, t, a),
    l.memoizedState = a,
    l.lanes === 0 && (l.updateQueue.baseState = a)
}
var li = {
    enqueueSetState: function(l, t, a) {
        l = l._reactInternals;
        var u = Yl()
          , e = Gt(u);
        e.payload = t,
        a != null && (e.callback = a),
        t = Xt(l, e, u),
        t !== null && (Ml(t, l, u),
        Mu(t, l, u))
    },
    enqueueReplaceState: function(l, t, a) {
        l = l._reactInternals;
        var u = Yl()
          , e = Gt(u);
        e.tag = 1,
        e.payload = t,
        a != null && (e.callback = a),
        t = Xt(l, e, u),
        t !== null && (Ml(t, l, u),
        Mu(t, l, u))
    },
    enqueueForceUpdate: function(l, t) {
        l = l._reactInternals;
        var a = Yl()
          , u = Gt(a);
        u.tag = 2,
        t != null && (u.callback = t),
        t = Xt(l, u, a),
        t !== null && (Ml(t, l, a),
        Mu(t, l, a))
    }
};
function y0(l, t, a, u, e, n, c) {
    return l = l.stateNode,
    typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(u, n, c) : t.prototype && t.prototype.isPureReactComponent ? !Gu(a, u) || !Gu(e, n) : !0
}
function d0(l, t, a, u) {
    l = t.state,
    typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, u),
    typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, u),
    t.state !== l && li.enqueueReplaceState(t, t.state, null)
}
function va(l, t) {
    var a = t;
    if ("ref"in t) {
        a = {};
        for (var u in t)
            u !== "ref" && (a[u] = t[u])
    }
    if (l = l.defaultProps) {
        a === t && (a = F({}, a));
        for (var e in l)
            a[e] === void 0 && (a[e] = l[e])
    }
    return a
}
function L1(l) {
    we(l)
}
function K1(l) {
    console.error(l)
}
function J1(l) {
    we(l)
}
function an(l, t) {
    try {
        var a = l.onUncaughtError;
        a(t.value, {
            componentStack: t.stack
        })
    } catch (u) {
        setTimeout(function() {
            throw u
        })
    }
}
function o0(l, t, a) {
    try {
        var u = l.onCaughtError;
        u(a.value, {
            componentStack: a.stack,
            errorBoundary: t.tag === 1 ? t.stateNode : null
        })
    } catch (e) {
        setTimeout(function() {
            throw e
        })
    }
}
function ti(l, t, a) {
    return a = Gt(a),
    a.tag = 3,
    a.payload = {
        element: null
    },
    a.callback = function() {
        an(l, t)
    }
    ,
    a
}
function w1(l) {
    return l = Gt(l),
    l.tag = 3,
    l
}
function $1(l, t, a, u) {
    var e = a.type.getDerivedStateFromError;
    if (typeof e == "function") {
        var n = u.value;
        l.payload = function() {
            return e(n)
        }
        ,
        l.callback = function() {
            o0(t, a, u)
        }
    }
    var c = a.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (l.callback = function() {
        o0(t, a, u),
        typeof e != "function" && (Qt === null ? Qt = new Set([this]) : Qt.add(this));
        var i = u.stack;
        this.componentDidCatch(u.value, {
            componentStack: i !== null ? i : ""
        })
    }
    )
}
function Fo(l, t, a, u, e) {
    if (a.flags |= 32768,
    u !== null && typeof u == "object" && typeof u.then == "function") {
        if (t = a.alternate,
        t !== null && eu(t, a, e, !0),
        a = Gl.current,
        a !== null) {
            switch (a.tag) {
            case 31:
            case 13:
                return wl === null ? fn() : a.alternate === null && ll === 0 && (ll = 3),
                a.flags &= -257,
                a.flags |= 65536,
                a.lanes = e,
                u === ke ? a.flags |= 16384 : (t = a.updateQueue,
                t === null ? a.updateQueue = new Set([u]) : t.add(u),
                hc(l, u, e)),
                !1;
            case 22:
                return a.flags |= 65536,
                u === ke ? a.flags |= 16384 : (t = a.updateQueue,
                t === null ? (t = {
                    transitions: null,
                    markerInstances: null,
                    retryQueue: new Set([u])
                },
                a.updateQueue = t) : (a = t.retryQueue,
                a === null ? t.retryQueue = new Set([u]) : a.add(u)),
                hc(l, u, e)),
                !1
            }
            throw Error(b(435, a.tag))
        }
        return hc(l, u, e),
        fn(),
        !1
    }
    if (q)
        return t = Gl.current,
        t !== null ? (!(t.flags & 65536) && (t.flags |= 256),
        t.flags |= 65536,
        t.lanes = e,
        u !== Zc && (l = Error(b(422), {
            cause: u
        }),
        Qu(Kl(l, a)))) : (u !== Zc && (t = Error(b(423), {
            cause: u
        }),
        Qu(Kl(t, a))),
        l = l.current.alternate,
        l.flags |= 65536,
        e &= -e,
        l.lanes |= e,
        u = Kl(u, a),
        e = ti(l.stateNode, u, e),
        ac(l, e),
        ll !== 4 && (ll = 2)),
        !1;
    var n = Error(b(520), {
        cause: u
    });
    if (n = Kl(n, a),
    Ru === null ? Ru = [n] : Ru.push(n),
    ll !== 4 && (ll = 2),
    t === null)
        return !0;
    u = Kl(u, a),
    a = t;
    do {
        switch (a.tag) {
        case 3:
            return a.flags |= 65536,
            l = e & -e,
            a.lanes |= l,
            l = ti(a.stateNode, u, l),
            ac(a, l),
            !1;
        case 1:
            if (t = a.type,
            n = a.stateNode,
            (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (Qt === null || !Qt.has(n))))
                return a.flags |= 65536,
                e &= -e,
                a.lanes |= e,
                e = w1(e),
                $1(e, l, a, u),
                ac(a, e),
                !1
        }
        a = a.return
    } while (a !== null);
    return !1
}
var cf = Error(b(461))
  , il = !1;
function vl(l, t, a, u) {
    t.child = l === null ? f1(t, null, a, u) : oa(t, l.child, a, u)
}
function m0(l, t, a, u, e) {
    a = a.render;
    var n = t.ref;
    if ("ref"in u) {
        var c = {};
        for (var i in u)
            i !== "ref" && (c[i] = u[i])
    } else
        c = u;
    return da(t),
    u = $i(l, t, a, c, n, e),
    i = Wi(),
    l !== null && !il ? (Fi(l, t, e),
    Et(l, t, e)) : (q && i && Xi(t),
    t.flags |= 1,
    vl(l, t, u, e),
    t.child)
}
function v0(l, t, a, u, e) {
    if (l === null) {
        var n = a.type;
        return typeof n == "function" && !Gi(n) && n.defaultProps === void 0 && a.compare === null ? (t.tag = 15,
        t.type = n,
        W1(l, t, n, u, e)) : (l = xe(a.type, null, u, t, t.mode, e),
        l.ref = t.ref,
        l.return = t,
        t.child = l)
    }
    if (n = l.child,
    !ff(l, e)) {
        var c = n.memoizedProps;
        if (a = a.compare,
        a = a !== null ? a : Gu,
        a(c, u) && l.ref === t.ref)
            return Et(l, t, e)
    }
    return t.flags |= 1,
    l = gt(n, u),
    l.ref = t.ref,
    l.return = t,
    t.child = l
}
function W1(l, t, a, u, e) {
    if (l !== null) {
        var n = l.memoizedProps;
        if (Gu(n, u) && l.ref === t.ref)
            if (il = !1,
            t.pendingProps = u = n,
            ff(l, e))
                l.flags & 131072 && (il = !0);
            else
                return t.lanes = l.lanes,
                Et(l, t, e)
    }
    return ai(l, t, a, u, e)
}
function F1(l, t, a, u) {
    var e = u.children
      , n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
    }),
    u.mode === "hidden") {
        if (t.flags & 128) {
            if (n = n !== null ? n.baseLanes | a : a,
            l !== null) {
                for (u = t.child = l.child,
                e = 0; u !== null; )
                    e = e | u.lanes | u.childLanes,
                    u = u.sibling;
                u = e & ~n
            } else
                u = 0,
                t.child = null;
            return h0(l, t, n, a, u)
        }
        if (a & 536870912)
            t.memoizedState = {
                baseLanes: 0,
                cachePool: null
            },
            l !== null && He(t, n !== null ? n.cachePool : null),
            n !== null ? u0(t, n) : Wc(),
            d1(t);
        else
            return u = t.lanes = 536870912,
            h0(l, t, n !== null ? n.baseLanes | a : a, a, u)
    } else
        n !== null ? (He(t, n.cachePool),
        u0(t, n),
        Nt(),
        t.memoizedState = null) : (l !== null && He(t, null),
        Wc(),
        Nt());
    return vl(l, t, e, a),
    t.child
}
function zu(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
    }),
    t.sibling
}
function h0(l, t, a, u, e) {
    var n = Vi();
    return n = n === null ? null : {
        parent: cl._currentValue,
        pool: n
    },
    t.memoizedState = {
        baseLanes: a,
        cachePool: n
    },
    l !== null && He(t, null),
    Wc(),
    d1(t),
    l !== null && eu(l, t, u, !0),
    t.childLanes = e,
    null
}
function je(l, t) {
    return t = un({
        mode: t.mode,
        children: t.children
    }, l.mode),
    t.ref = l.ref,
    l.child = t,
    t.return = l,
    t
}
function g0(l, t, a) {
    return oa(t, l.child, null, a),
    l = je(t, t.pendingProps),
    l.flags |= 2,
    xl(t),
    t.memoizedState = null,
    l
}
function ko(l, t, a) {
    var u = t.pendingProps
      , e = (t.flags & 128) !== 0;
    if (t.flags &= -129,
    l === null) {
        if (q) {
            if (u.mode === "hidden")
                return l = je(t, u),
                t.lanes = 536870912,
                zu(null, l);
            if (Fc(t),
            (l = $) ? (l = Zy(l, Jl),
            l = l !== null && l.data === "&" ? l : null,
            l !== null && (t.memoizedState = {
                dehydrated: l,
                treeContext: Jt !== null ? {
                    id: lt,
                    overflow: tt
                } : null,
                retryLane: 536870912,
                hydrationErrors: null
            },
            a = t1(l),
            a.return = t,
            t.child = a,
            gl = t,
            $ = null)) : l = null,
            l === null)
                throw wt(t);
            return t.lanes = 536870912,
            null
        }
        return je(t, u)
    }
    var n = l.memoizedState;
    if (n !== null) {
        var c = n.dehydrated;
        if (Fc(t),
        e)
            if (t.flags & 256)
                t.flags &= -257,
                t = g0(l, t, a);
            else if (t.memoizedState !== null)
                t.child = l.child,
                t.flags |= 128,
                t = null;
            else
                throw Error(b(558));
        else if (il || eu(l, t, a, !1),
        e = (a & l.childLanes) !== 0,
        il || e) {
            if (u = K,
            u !== null && (c = Ms(u, a),
            c !== 0 && c !== n.retryLane))
                throw n.retryLane = c,
                ba(l, c),
                Ml(u, l, c),
                cf;
            fn(),
            t = g0(l, t, a)
        } else
            l = n.treeContext,
            $ = $l(c.nextSibling),
            gl = t,
            q = !0,
            qt = null,
            Jl = !1,
            l !== null && u1(t, l),
            t = je(t, u),
            t.flags |= 4096;
        return t
    }
    return l = gt(l.child, {
        mode: u.mode,
        children: u.children
    }),
    l.ref = t.ref,
    t.child = l,
    l.return = t,
    l
}
function Be(l, t) {
    var a = t.ref;
    if (a === null)
        l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
        if (typeof a != "function" && typeof a != "object")
            throw Error(b(284));
        (l === null || l.ref !== a) && (t.flags |= 4194816)
    }
}
function ai(l, t, a, u, e) {
    return da(t),
    a = $i(l, t, a, u, void 0, e),
    u = Wi(),
    l !== null && !il ? (Fi(l, t, e),
    Et(l, t, e)) : (q && u && Xi(t),
    t.flags |= 1,
    vl(l, t, a, e),
    t.child)
}
function S0(l, t, a, u, e, n) {
    return da(t),
    t.updateQueue = null,
    a = m1(t, u, a, e),
    o1(l),
    u = Wi(),
    l !== null && !il ? (Fi(l, t, n),
    Et(l, t, n)) : (q && u && Xi(t),
    t.flags |= 1,
    vl(l, t, a, n),
    t.child)
}
function b0(l, t, a, u, e) {
    if (da(t),
    t.stateNode === null) {
        var n = Ra
          , c = a.contextType;
        typeof c == "object" && c !== null && (n = Sl(c)),
        n = new a(u,n),
        t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null,
        n.updater = li,
        t.stateNode = n,
        n._reactInternals = t,
        n = t.stateNode,
        n.props = u,
        n.state = t.memoizedState,
        n.refs = {},
        Ki(t),
        c = a.contextType,
        n.context = typeof c == "object" && c !== null ? Sl(c) : Ra,
        n.state = t.memoizedState,
        c = a.getDerivedStateFromProps,
        typeof c == "function" && (ec(t, a, c, u),
        n.state = t.memoizedState),
        typeof a.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (c = n.state,
        typeof n.componentWillMount == "function" && n.componentWillMount(),
        typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(),
        c !== n.state && li.enqueueReplaceState(n, n.state, null),
        Uu(t, u, n, e),
        Du(),
        n.state = t.memoizedState),
        typeof n.componentDidMount == "function" && (t.flags |= 4194308),
        u = !0
    } else if (l === null) {
        n = t.stateNode;
        var i = t.memoizedProps
          , f = va(a, i);
        n.props = f;
        var d = n.context
          , h = a.contextType;
        c = Ra,
        typeof h == "object" && h !== null && (c = Sl(h));
        var g = a.getDerivedStateFromProps;
        h = typeof g == "function" || typeof n.getSnapshotBeforeUpdate == "function",
        i = t.pendingProps !== i,
        h || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i || d !== c) && d0(t, n, u, c),
        Mt = !1;
        var o = t.memoizedState;
        n.state = o,
        Uu(t, u, n, e),
        Du(),
        d = t.memoizedState,
        i || o !== d || Mt ? (typeof g == "function" && (ec(t, a, g, u),
        d = t.memoizedState),
        (f = Mt || y0(t, a, f, u, o, d, c)) ? (h || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(),
        typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()),
        typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308),
        t.memoizedProps = u,
        t.memoizedState = d),
        n.props = u,
        n.state = d,
        n.context = c,
        u = f) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308),
        u = !1)
    } else {
        n = t.stateNode,
        wc(l, t),
        c = t.memoizedProps,
        h = va(a, c),
        n.props = h,
        g = t.pendingProps,
        o = n.context,
        d = a.contextType,
        f = Ra,
        typeof d == "object" && d !== null && (f = Sl(d)),
        i = a.getDerivedStateFromProps,
        (d = typeof i == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c !== g || o !== f) && d0(t, n, u, f),
        Mt = !1,
        o = t.memoizedState,
        n.state = o,
        Uu(t, u, n, e),
        Du();
        var v = t.memoizedState;
        c !== g || o !== v || Mt || l !== null && l.dependencies !== null && Fe(l.dependencies) ? (typeof i == "function" && (ec(t, a, i, u),
        v = t.memoizedState),
        (h = Mt || y0(t, a, h, u, o, v, f) || l !== null && l.dependencies !== null && Fe(l.dependencies)) ? (d || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(u, v, f),
        typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(u, v, f)),
        typeof n.componentDidUpdate == "function" && (t.flags |= 4),
        typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && o === l.memoizedState || (t.flags |= 4),
        typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && o === l.memoizedState || (t.flags |= 1024),
        t.memoizedProps = u,
        t.memoizedState = v),
        n.props = u,
        n.state = v,
        n.context = f,
        u = h) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && o === l.memoizedState || (t.flags |= 4),
        typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && o === l.memoizedState || (t.flags |= 1024),
        u = !1)
    }
    return n = u,
    Be(l, t),
    u = (t.flags & 128) !== 0,
    n || u ? (n = t.stateNode,
    a = u && typeof a.getDerivedStateFromError != "function" ? null : n.render(),
    t.flags |= 1,
    l !== null && u ? (t.child = oa(t, l.child, null, e),
    t.child = oa(t, null, a, e)) : vl(l, t, a, e),
    t.memoizedState = n.state,
    l = t.child) : l = Et(l, t, e),
    l
}
function r0(l, t, a, u) {
    return ya(),
    t.flags |= 256,
    vl(l, t, a, u),
    t.child
}
var nc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
};
function cc(l) {
    return {
        baseLanes: l,
        cachePool: n1()
    }
}
function ic(l, t, a) {
    return l = l !== null ? l.childLanes & ~a : 0,
    t && (l |= Rl),
    l
}
function k1(l, t, a) {
    var u = t.pendingProps, e = !1, n = (t.flags & 128) !== 0, c;
    if ((c = n) || (c = l !== null && l.memoizedState === null ? !1 : (al.current & 2) !== 0),
    c && (e = !0,
    t.flags &= -129),
    c = (t.flags & 32) !== 0,
    t.flags &= -33,
    l === null) {
        if (q) {
            if (e ? Ut(t) : Nt(),
            (l = $) ? (l = Zy(l, Jl),
            l = l !== null && l.data !== "&" ? l : null,
            l !== null && (t.memoizedState = {
                dehydrated: l,
                treeContext: Jt !== null ? {
                    id: lt,
                    overflow: tt
                } : null,
                retryLane: 536870912,
                hydrationErrors: null
            },
            a = t1(l),
            a.return = t,
            t.child = a,
            gl = t,
            $ = null)) : l = null,
            l === null)
                throw wt(t);
            return gi(l) ? t.lanes = 32 : t.lanes = 536870912,
            null
        }
        var i = u.children;
        return u = u.fallback,
        e ? (Nt(),
        e = t.mode,
        i = un({
            mode: "hidden",
            children: i
        }, e),
        u = ca(u, e, a, null),
        i.return = t,
        u.return = t,
        i.sibling = u,
        t.child = i,
        u = t.child,
        u.memoizedState = cc(a),
        u.childLanes = ic(l, c, a),
        t.memoizedState = nc,
        zu(null, u)) : (Ut(t),
        ui(t, i))
    }
    var f = l.memoizedState;
    if (f !== null && (i = f.dehydrated,
    i !== null)) {
        if (n)
            t.flags & 256 ? (Ut(t),
            t.flags &= -257,
            t = fc(l, t, a)) : t.memoizedState !== null ? (Nt(),
            t.child = l.child,
            t.flags |= 128,
            t = null) : (Nt(),
            i = u.fallback,
            e = t.mode,
            u = un({
                mode: "visible",
                children: u.children
            }, e),
            i = ca(i, e, a, null),
            i.flags |= 2,
            u.return = t,
            i.return = t,
            u.sibling = i,
            t.child = u,
            oa(t, l.child, null, a),
            u = t.child,
            u.memoizedState = cc(a),
            u.childLanes = ic(l, c, a),
            t.memoizedState = nc,
            t = zu(null, u));
        else if (Ut(t),
        gi(i)) {
            if (c = i.nextSibling && i.nextSibling.dataset,
            c)
                var d = c.dgst;
            c = d,
            u = Error(b(419)),
            u.stack = "",
            u.digest = c,
            Qu({
                value: u,
                source: null,
                stack: null
            }),
            t = fc(l, t, a)
        } else if (il || eu(l, t, a, !1),
        c = (a & l.childLanes) !== 0,
        il || c) {
            if (c = K,
            c !== null && (u = Ms(c, a),
            u !== 0 && u !== f.retryLane))
                throw f.retryLane = u,
                ba(l, u),
                Ml(c, l, u),
                cf;
            hi(i) || fn(),
            t = fc(l, t, a)
        } else
            hi(i) ? (t.flags |= 192,
            t.child = l.child,
            t = null) : (l = f.treeContext,
            $ = $l(i.nextSibling),
            gl = t,
            q = !0,
            qt = null,
            Jl = !1,
            l !== null && u1(t, l),
            t = ui(t, u.children),
            t.flags |= 4096);
        return t
    }
    return e ? (Nt(),
    i = u.fallback,
    e = t.mode,
    f = l.child,
    d = f.sibling,
    u = gt(f, {
        mode: "hidden",
        children: u.children
    }),
    u.subtreeFlags = f.subtreeFlags & 65011712,
    d !== null ? i = gt(d, i) : (i = ca(i, e, a, null),
    i.flags |= 2),
    i.return = t,
    u.return = t,
    u.sibling = i,
    t.child = u,
    zu(null, u),
    u = t.child,
    i = l.child.memoizedState,
    i === null ? i = cc(a) : (e = i.cachePool,
    e !== null ? (f = cl._currentValue,
    e = e.parent !== f ? {
        parent: f,
        pool: f
    } : e) : e = n1(),
    i = {
        baseLanes: i.baseLanes | a,
        cachePool: e
    }),
    u.memoizedState = i,
    u.childLanes = ic(l, c, a),
    t.memoizedState = nc,
    zu(l.child, u)) : (Ut(t),
    a = l.child,
    l = a.sibling,
    a = gt(a, {
        mode: "visible",
        children: u.children
    }),
    a.return = t,
    a.sibling = null,
    l !== null && (c = t.deletions,
    c === null ? (t.deletions = [l],
    t.flags |= 16) : c.push(l)),
    t.child = a,
    t.memoizedState = null,
    a)
}
function ui(l, t) {
    return t = un({
        mode: "visible",
        children: t
    }, l.mode),
    t.return = l,
    l.child = t
}
function un(l, t) {
    return l = Hl(22, l, null, t),
    l.lanes = 0,
    l
}
function fc(l, t, a) {
    return oa(t, l.child, null, a),
    l = ui(t, t.pendingProps.children),
    l.flags |= 2,
    t.memoizedState = null,
    l
}
function z0(l, t, a) {
    l.lanes |= t;
    var u = l.alternate;
    u !== null && (u.lanes |= t),
    Lc(l.return, t, a)
}
function sc(l, t, a, u, e, n) {
    var c = l.memoizedState;
    c === null ? l.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: u,
        tail: a,
        tailMode: e,
        treeForkCount: n
    } : (c.isBackwards = t,
    c.rendering = null,
    c.renderingStartTime = 0,
    c.last = u,
    c.tail = a,
    c.tailMode = e,
    c.treeForkCount = n)
}
function I1(l, t, a) {
    var u = t.pendingProps
      , e = u.revealOrder
      , n = u.tail;
    u = u.children;
    var c = al.current
      , i = (c & 2) !== 0;
    if (i ? (c = c & 1 | 2,
    t.flags |= 128) : c &= 1,
    J(al, c),
    vl(l, t, u, a),
    u = q ? Xu : 0,
    !i && l !== null && l.flags & 128)
        l: for (l = t.child; l !== null; ) {
            if (l.tag === 13)
                l.memoizedState !== null && z0(l, a, t);
            else if (l.tag === 19)
                z0(l, a, t);
            else if (l.child !== null) {
                l.child.return = l,
                l = l.child;
                continue
            }
            if (l === t)
                break l;
            for (; l.sibling === null; ) {
                if (l.return === null || l.return === t)
                    break l;
                l = l.return
            }
            l.sibling.return = l.return,
            l = l.sibling
        }
    switch (e) {
    case "forwards":
        for (a = t.child,
        e = null; a !== null; )
            l = a.alternate,
            l !== null && Pe(l) === null && (e = a),
            a = a.sibling;
        a = e,
        a === null ? (e = t.child,
        t.child = null) : (e = a.sibling,
        a.sibling = null),
        sc(t, !1, e, a, n, u);
        break;
    case "backwards":
    case "unstable_legacy-backwards":
        for (a = null,
        e = t.child,
        t.child = null; e !== null; ) {
            if (l = e.alternate,
            l !== null && Pe(l) === null) {
                t.child = e;
                break
            }
            l = e.sibling,
            e.sibling = a,
            a = e,
            e = l
        }
        sc(t, !0, a, null, n, u);
        break;
    case "together":
        sc(t, !1, null, null, void 0, u);
        break;
    default:
        t.memoizedState = null
    }
    return t.child
}
function Et(l, t, a) {
    if (l !== null && (t.dependencies = l.dependencies),
    Wt |= t.lanes,
    !(a & t.childLanes))
        if (l !== null) {
            if (eu(l, t, a, !1),
            (a & t.childLanes) === 0)
                return null
        } else
            return null;
    if (l !== null && t.child !== l.child)
        throw Error(b(153));
    if (t.child !== null) {
        for (l = t.child,
        a = gt(l, l.pendingProps),
        t.child = a,
        a.return = t; l.sibling !== null; )
            l = l.sibling,
            a = a.sibling = gt(l, l.pendingProps),
            a.return = t;
        a.sibling = null
    }
    return t.child
}
function ff(l, t) {
    return l.lanes & t ? !0 : (l = l.dependencies,
    !!(l !== null && Fe(l)))
}
function Io(l, t, a) {
    switch (t.tag) {
    case 3:
        Ve(t, t.stateNode.containerInfo),
        Dt(t, cl, l.memoizedState.cache),
        ya();
        break;
    case 27:
    case 5:
        xc(t);
        break;
    case 4:
        Ve(t, t.stateNode.containerInfo);
        break;
    case 10:
        Dt(t, t.type, t.memoizedProps.value);
        break;
    case 31:
        if (t.memoizedState !== null)
            return t.flags |= 128,
            Fc(t),
            null;
        break;
    case 13:
        var u = t.memoizedState;
        if (u !== null)
            return u.dehydrated !== null ? (Ut(t),
            t.flags |= 128,
            null) : a & t.child.childLanes ? k1(l, t, a) : (Ut(t),
            l = Et(l, t, a),
            l !== null ? l.sibling : null);
        Ut(t);
        break;
    case 19:
        var e = (l.flags & 128) !== 0;
        if (u = (a & t.childLanes) !== 0,
        u || (eu(l, t, a, !1),
        u = (a & t.childLanes) !== 0),
        e) {
            if (u)
                return I1(l, t, a);
            t.flags |= 128
        }
        if (e = t.memoizedState,
        e !== null && (e.rendering = null,
        e.tail = null,
        e.lastEffect = null),
        J(al, al.current),
        u)
            break;
        return null;
    case 22:
        return t.lanes = 0,
        F1(l, t, a, t.pendingProps);
    case 24:
        Dt(t, cl, l.memoizedState.cache)
    }
    return Et(l, t, a)
}
function P1(l, t, a) {
    if (l !== null)
        if (l.memoizedProps !== t.pendingProps)
            il = !0;
        else {
            if (!ff(l, a) && !(t.flags & 128))
                return il = !1,
                Io(l, t, a);
            il = !!(l.flags & 131072)
        }
    else
        il = !1,
        q && t.flags & 1048576 && a1(t, Xu, t.index);
    switch (t.lanes = 0,
    t.tag) {
    case 16:
        l: {
            var u = t.pendingProps;
            if (l = ua(t.elementType),
            t.type = l,
            typeof l == "function")
                Gi(l) ? (u = va(l, u),
                t.tag = 1,
                t = b0(null, t, l, u, a)) : (t.tag = 0,
                t = ai(null, t, l, u, a));
            else {
                if (l != null) {
                    var e = l.$$typeof;
                    if (e === _i) {
                        t.tag = 11,
                        t = m0(null, t, l, u, a);
                        break l
                    } else if (e === Oi) {
                        t.tag = 14,
                        t = v0(null, t, l, u, a);
                        break l
                    }
                }
                throw t = Uc(l) || l,
                Error(b(306, t, ""))
            }
        }
        return t;
    case 0:
        return ai(l, t, t.type, t.pendingProps, a);
    case 1:
        return u = t.type,
        e = va(u, t.pendingProps),
        b0(l, t, u, e, a);
    case 3:
        l: {
            if (Ve(t, t.stateNode.containerInfo),
            l === null)
                throw Error(b(387));
            u = t.pendingProps;
            var n = t.memoizedState;
            e = n.element,
            wc(l, t),
            Uu(t, u, null, a);
            var c = t.memoizedState;
            if (u = c.cache,
            Dt(t, cl, u),
            u !== n.cache && Kc(t, [cl], a, !0),
            Du(),
            u = c.element,
            n.isDehydrated)
                if (n = {
                    element: u,
                    isDehydrated: !1,
                    cache: c.cache
                },
                t.updateQueue.baseState = n,
                t.memoizedState = n,
                t.flags & 256) {
                    t = r0(l, t, u, a);
                    break l
                } else if (u !== e) {
                    e = Kl(Error(b(424)), t),
                    Qu(e),
                    t = r0(l, t, u, a);
                    break l
                } else {
                    switch (l = t.stateNode.containerInfo,
                    l.nodeType) {
                    case 9:
                        l = l.body;
                        break;
                    default:
                        l = l.nodeName === "HTML" ? l.ownerDocument.body : l
                    }
                    for ($ = $l(l.firstChild),
                    gl = t,
                    q = !0,
                    qt = null,
                    Jl = !0,
                    a = f1(t, null, u, a),
                    t.child = a; a; )
                        a.flags = a.flags & -3 | 4096,
                        a = a.sibling
                }
            else {
                if (ya(),
                u === e) {
                    t = Et(l, t, a);
                    break l
                }
                vl(l, t, u, a)
            }
            t = t.child
        }
        return t;
    case 26:
        return Be(l, t),
        l === null ? (a = X0(t.type, null, t.pendingProps, null)) ? t.memoizedState = a : q || (a = t.type,
        l = t.pendingProps,
        u = on(Yt.current).createElement(a),
        u[hl] = t,
        u[Dl] = l,
        bl(u, a, l),
        ol(u),
        t.stateNode = u) : t.memoizedState = X0(t.type, l.memoizedProps, t.pendingProps, l.memoizedState),
        null;
    case 27:
        return xc(t),
        l === null && q && (u = t.stateNode = Vy(t.type, t.pendingProps, Yt.current),
        gl = t,
        Jl = !0,
        e = $,
        kt(t.type) ? (Si = e,
        $ = $l(u.firstChild)) : $ = e),
        vl(l, t, t.pendingProps.children, a),
        Be(l, t),
        l === null && (t.flags |= 4194304),
        t.child;
    case 5:
        return l === null && q && ((e = u = $) && (u = Dm(u, t.type, t.pendingProps, Jl),
        u !== null ? (t.stateNode = u,
        gl = t,
        $ = $l(u.firstChild),
        Jl = !1,
        e = !0) : e = !1),
        e || wt(t)),
        xc(t),
        e = t.type,
        n = t.pendingProps,
        c = l !== null ? l.memoizedProps : null,
        u = n.children,
        mi(e, n) ? u = null : c !== null && mi(e, c) && (t.flags |= 32),
        t.memoizedState !== null && (e = $i(l, t, Vo, null, null, a),
        wu._currentValue = e),
        Be(l, t),
        vl(l, t, u, a),
        t.child;
    case 6:
        return l === null && q && ((l = a = $) && (a = Um(a, t.pendingProps, Jl),
        a !== null ? (t.stateNode = a,
        gl = t,
        $ = null,
        l = !0) : l = !1),
        l || wt(t)),
        null;
    case 13:
        return k1(l, t, a);
    case 4:
        return Ve(t, t.stateNode.containerInfo),
        u = t.pendingProps,
        l === null ? t.child = oa(t, null, u, a) : vl(l, t, u, a),
        t.child;
    case 11:
        return m0(l, t, t.type, t.pendingProps, a);
    case 7:
        return vl(l, t, t.pendingProps, a),
        t.child;
    case 8:
        return vl(l, t, t.pendingProps.children, a),
        t.child;
    case 12:
        return vl(l, t, t.pendingProps.children, a),
        t.child;
    case 10:
        return u = t.pendingProps,
        Dt(t, t.type, u.value),
        vl(l, t, u.children, a),
        t.child;
    case 9:
        return e = t.type._context,
        u = t.pendingProps.children,
        da(t),
        e = Sl(e),
        u = u(e),
        t.flags |= 1,
        vl(l, t, u, a),
        t.child;
    case 14:
        return v0(l, t, t.type, t.pendingProps, a);
    case 15:
        return W1(l, t, t.type, t.pendingProps, a);
    case 19:
        return I1(l, t, a);
    case 31:
        return ko(l, t, a);
    case 22:
        return F1(l, t, a, t.pendingProps);
    case 24:
        return da(t),
        u = Sl(cl),
        l === null ? (e = Vi(),
        e === null && (e = K,
        n = Zi(),
        e.pooledCache = n,
        n.refCount++,
        n !== null && (e.pooledCacheLanes |= a),
        e = n),
        t.memoizedState = {
            parent: u,
            cache: e
        },
        Ki(t),
        Dt(t, cl, e)) : (l.lanes & a && (wc(l, t),
        Uu(t, null, null, a),
        Du()),
        e = l.memoizedState,
        n = t.memoizedState,
        e.parent !== u ? (e = {
            parent: u,
            cache: u
        },
        t.memoizedState = e,
        t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = e),
        Dt(t, cl, u)) : (u = n.cache,
        Dt(t, cl, u),
        u !== e.cache && Kc(t, [cl], a, !0))),
        vl(l, t, t.pendingProps.children, a),
        t.child;
    case 29:
        throw t.pendingProps
    }
    throw Error(b(156, t.tag))
}
function it(l) {
    l.flags |= 4
}
function yc(l, t, a, u, e) {
    if ((t = (l.mode & 32) !== 0) && (t = !1),
    t) {
        if (l.flags |= 16777216,
        (e & 335544128) === e)
            if (l.stateNode.complete)
                l.flags |= 8192;
            else if (Ty())
                l.flags |= 8192;
            else
                throw fa = ke,
                Li
    } else
        l.flags &= -16777217
}
function A0(l, t) {
    if (t.type !== "stylesheet" || t.state.loading & 4)
        l.flags &= -16777217;
    else if (l.flags |= 16777216,
    !Jy(t))
        if (Ty())
            l.flags |= 8192;
        else
            throw fa = ke,
            Li
}
function Ae(l, t) {
    t !== null && (l.flags |= 4),
    l.flags & 16384 && (t = l.tag !== 22 ? ps() : 536870912,
    l.lanes |= t,
    Fa |= t)
}
function vu(l, t) {
    if (!q)
        switch (l.tailMode) {
        case "hidden":
            t = l.tail;
            for (var a = null; t !== null; )
                t.alternate !== null && (a = t),
                t = t.sibling;
            a === null ? l.tail = null : a.sibling = null;
            break;
        case "collapsed":
            a = l.tail;
            for (var u = null; a !== null; )
                a.alternate !== null && (u = a),
                a = a.sibling;
            u === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : u.sibling = null
        }
}
function w(l) {
    var t = l.alternate !== null && l.alternate.child === l.child
      , a = 0
      , u = 0;
    if (t)
        for (var e = l.child; e !== null; )
            a |= e.lanes | e.childLanes,
            u |= e.subtreeFlags & 65011712,
            u |= e.flags & 65011712,
            e.return = l,
            e = e.sibling;
    else
        for (e = l.child; e !== null; )
            a |= e.lanes | e.childLanes,
            u |= e.subtreeFlags,
            u |= e.flags,
            e.return = l,
            e = e.sibling;
    return l.subtreeFlags |= u,
    l.childLanes = a,
    t
}
function Po(l, t, a) {
    var u = t.pendingProps;
    switch (Qi(t),
    t.tag) {
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
        return w(t),
        null;
    case 1:
        return w(t),
        null;
    case 3:
        return a = t.stateNode,
        u = null,
        l !== null && (u = l.memoizedState.cache),
        t.memoizedState.cache !== u && (t.flags |= 2048),
        St(cl),
        La(),
        a.pendingContext && (a.context = a.pendingContext,
        a.pendingContext = null),
        (l === null || l.child === null) && (za(t) ? it(t) : l === null || l.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024,
        tc())),
        w(t),
        null;
    case 26:
        var e = t.type
          , n = t.memoizedState;
        return l === null ? (it(t),
        n !== null ? (w(t),
        A0(t, n)) : (w(t),
        yc(t, e, null, u, a))) : n ? n !== l.memoizedState ? (it(t),
        w(t),
        A0(t, n)) : (w(t),
        t.flags &= -16777217) : (l = l.memoizedProps,
        l !== u && it(t),
        w(t),
        yc(t, e, l, u, a)),
        null;
    case 27:
        if (Le(t),
        a = Yt.current,
        e = t.type,
        l !== null && t.stateNode != null)
            l.memoizedProps !== u && it(t);
        else {
            if (!u) {
                if (t.stateNode === null)
                    throw Error(b(166));
                return w(t),
                null
            }
            l = ut.current,
            za(t) ? Ff(t) : (l = Vy(e, u, a),
            t.stateNode = l,
            it(t))
        }
        return w(t),
        null;
    case 5:
        if (Le(t),
        e = t.type,
        l !== null && t.stateNode != null)
            l.memoizedProps !== u && it(t);
        else {
            if (!u) {
                if (t.stateNode === null)
                    throw Error(b(166));
                return w(t),
                null
            }
            if (n = ut.current,
            za(t))
                Ff(t);
            else {
                var c = on(Yt.current);
                switch (n) {
                case 1:
                    n = c.createElementNS("http://www.w3.org/2000/svg", e);
                    break;
                case 2:
                    n = c.createElementNS("http://www.w3.org/1998/Math/MathML", e);
                    break;
                default:
                    switch (e) {
                    case "svg":
                        n = c.createElementNS("http://www.w3.org/2000/svg", e);
                        break;
                    case "math":
                        n = c.createElementNS("http://www.w3.org/1998/Math/MathML", e);
                        break;
                    case "script":
                        n = c.createElement("div"),
                        n.innerHTML = "<script><\/script>",
                        n = n.removeChild(n.firstChild);
                        break;
                    case "select":
                        n = typeof u.is == "string" ? c.createElement("select", {
                            is: u.is
                        }) : c.createElement("select"),
                        u.multiple ? n.multiple = !0 : u.size && (n.size = u.size);
                        break;
                    default:
                        n = typeof u.is == "string" ? c.createElement(e, {
                            is: u.is
                        }) : c.createElement(e)
                    }
                }
                n[hl] = t,
                n[Dl] = u;
                l: for (c = t.child; c !== null; ) {
                    if (c.tag === 5 || c.tag === 6)
                        n.appendChild(c.stateNode);
                    else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                        c.child.return = c,
                        c = c.child;
                        continue
                    }
                    if (c === t)
                        break l;
                    for (; c.sibling === null; ) {
                        if (c.return === null || c.return === t)
                            break l;
                        c = c.return
                    }
                    c.sibling.return = c.return,
                    c = c.sibling
                }
                t.stateNode = n;
                l: switch (bl(n, e, u),
                e) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                    u = !!u.autoFocus;
                    break l;
                case "img":
                    u = !0;
                    break l;
                default:
                    u = !1
                }
                u && it(t)
            }
        }
        return w(t),
        yc(t, t.type, l === null ? null : l.memoizedProps, t.pendingProps, a),
        null;
    case 6:
        if (l && t.stateNode != null)
            l.memoizedProps !== u && it(t);
        else {
            if (typeof u != "string" && t.stateNode === null)
                throw Error(b(166));
            if (l = Yt.current,
            za(t)) {
                if (l = t.stateNode,
                a = t.memoizedProps,
                u = null,
                e = gl,
                e !== null)
                    switch (e.tag) {
                    case 27:
                    case 5:
                        u = e.memoizedProps
                    }
                l[hl] = t,
                l = !!(l.nodeValue === a || u !== null && u.suppressHydrationWarning === !0 || Gy(l.nodeValue, a)),
                l || wt(t, !0)
            } else
                l = on(l).createTextNode(u),
                l[hl] = t,
                t.stateNode = l
        }
        return w(t),
        null;
    case 31:
        if (a = t.memoizedState,
        l === null || l.memoizedState !== null) {
            if (u = za(t),
            a !== null) {
                if (l === null) {
                    if (!u)
                        throw Error(b(318));
                    if (l = t.memoizedState,
                    l = l !== null ? l.dehydrated : null,
                    !l)
                        throw Error(b(557));
                    l[hl] = t
                } else
                    ya(),
                    !(t.flags & 128) && (t.memoizedState = null),
                    t.flags |= 4;
                w(t),
                l = !1
            } else
                a = tc(),
                l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = a),
                l = !0;
            if (!l)
                return t.flags & 256 ? (xl(t),
                t) : (xl(t),
                null);
            if (t.flags & 128)
                throw Error(b(558))
        }
        return w(t),
        null;
    case 13:
        if (u = t.memoizedState,
        l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
            if (e = za(t),
            u !== null && u.dehydrated !== null) {
                if (l === null) {
                    if (!e)
                        throw Error(b(318));
                    if (e = t.memoizedState,
                    e = e !== null ? e.dehydrated : null,
                    !e)
                        throw Error(b(317));
                    e[hl] = t
                } else
                    ya(),
                    !(t.flags & 128) && (t.memoizedState = null),
                    t.flags |= 4;
                w(t),
                e = !1
            } else
                e = tc(),
                l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e),
                e = !0;
            if (!e)
                return t.flags & 256 ? (xl(t),
                t) : (xl(t),
                null)
        }
        return xl(t),
        t.flags & 128 ? (t.lanes = a,
        t) : (a = u !== null,
        l = l !== null && l.memoizedState !== null,
        a && (u = t.child,
        e = null,
        u.alternate !== null && u.alternate.memoizedState !== null && u.alternate.memoizedState.cachePool !== null && (e = u.alternate.memoizedState.cachePool.pool),
        n = null,
        u.memoizedState !== null && u.memoizedState.cachePool !== null && (n = u.memoizedState.cachePool.pool),
        n !== e && (u.flags |= 2048)),
        a !== l && a && (t.child.flags |= 8192),
        Ae(t, t.updateQueue),
        w(t),
        null);
    case 4:
        return La(),
        l === null && hf(t.stateNode.containerInfo),
        w(t),
        null;
    case 10:
        return St(t.type),
        w(t),
        null;
    case 19:
        if (ml(al),
        u = t.memoizedState,
        u === null)
            return w(t),
            null;
        if (e = (t.flags & 128) !== 0,
        n = u.rendering,
        n === null)
            if (e)
                vu(u, !1);
            else {
                if (ll !== 0 || l !== null && l.flags & 128)
                    for (l = t.child; l !== null; ) {
                        if (n = Pe(l),
                        n !== null) {
                            for (t.flags |= 128,
                            vu(u, !1),
                            l = n.updateQueue,
                            t.updateQueue = l,
                            Ae(t, l),
                            t.subtreeFlags = 0,
                            l = a,
                            a = t.child; a !== null; )
                                l1(a, l),
                                a = a.sibling;
                            return J(al, al.current & 1 | 2),
                            q && dt(t, u.treeForkCount),
                            t.child
                        }
                        l = l.sibling
                    }
                u.tail !== null && Cl() > nn && (t.flags |= 128,
                e = !0,
                vu(u, !1),
                t.lanes = 4194304)
            }
        else {
            if (!e)
                if (l = Pe(n),
                l !== null) {
                    if (t.flags |= 128,
                    e = !0,
                    l = l.updateQueue,
                    t.updateQueue = l,
                    Ae(t, l),
                    vu(u, !0),
                    u.tail === null && u.tailMode === "hidden" && !n.alternate && !q)
                        return w(t),
                        null
                } else
                    2 * Cl() - u.renderingStartTime > nn && a !== 536870912 && (t.flags |= 128,
                    e = !0,
                    vu(u, !1),
                    t.lanes = 4194304);
            u.isBackwards ? (n.sibling = t.child,
            t.child = n) : (l = u.last,
            l !== null ? l.sibling = n : t.child = n,
            u.last = n)
        }
        return u.tail !== null ? (l = u.tail,
        u.rendering = l,
        u.tail = l.sibling,
        u.renderingStartTime = Cl(),
        l.sibling = null,
        a = al.current,
        J(al, e ? a & 1 | 2 : a & 1),
        q && dt(t, u.treeForkCount),
        l) : (w(t),
        null);
    case 22:
    case 23:
        return xl(t),
        Ji(),
        u = t.memoizedState !== null,
        l !== null ? l.memoizedState !== null !== u && (t.flags |= 8192) : u && (t.flags |= 8192),
        u ? a & 536870912 && !(t.flags & 128) && (w(t),
        t.subtreeFlags & 6 && (t.flags |= 8192)) : w(t),
        a = t.updateQueue,
        a !== null && Ae(t, a.retryQueue),
        a = null,
        l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool),
        u = null,
        t.memoizedState !== null && t.memoizedState.cachePool !== null && (u = t.memoizedState.cachePool.pool),
        u !== a && (t.flags |= 2048),
        l !== null && ml(ia),
        null;
    case 24:
        return a = null,
        l !== null && (a = l.memoizedState.cache),
        t.memoizedState.cache !== a && (t.flags |= 2048),
        St(cl),
        w(t),
        null;
    case 25:
        return null;
    case 30:
        return null
    }
    throw Error(b(156, t.tag))
}
function lm(l, t) {
    switch (Qi(t),
    t.tag) {
    case 1:
        return l = t.flags,
        l & 65536 ? (t.flags = l & -65537 | 128,
        t) : null;
    case 3:
        return St(cl),
        La(),
        l = t.flags,
        l & 65536 && !(l & 128) ? (t.flags = l & -65537 | 128,
        t) : null;
    case 26:
    case 27:
    case 5:
        return Le(t),
        null;
    case 31:
        if (t.memoizedState !== null) {
            if (xl(t),
            t.alternate === null)
                throw Error(b(340));
            ya()
        }
        return l = t.flags,
        l & 65536 ? (t.flags = l & -65537 | 128,
        t) : null;
    case 13:
        if (xl(t),
        l = t.memoizedState,
        l !== null && l.dehydrated !== null) {
            if (t.alternate === null)
                throw Error(b(340));
            ya()
        }
        return l = t.flags,
        l & 65536 ? (t.flags = l & -65537 | 128,
        t) : null;
    case 19:
        return ml(al),
        null;
    case 4:
        return La(),
        null;
    case 10:
        return St(t.type),
        null;
    case 22:
    case 23:
        return xl(t),
        Ji(),
        l !== null && ml(ia),
        l = t.flags,
        l & 65536 ? (t.flags = l & -65537 | 128,
        t) : null;
    case 24:
        return St(cl),
        null;
    case 25:
        return null;
    default:
        return null
    }
}
function ly(l, t) {
    switch (Qi(t),
    t.tag) {
    case 3:
        St(cl),
        La();
        break;
    case 26:
    case 27:
    case 5:
        Le(t);
        break;
    case 4:
        La();
        break;
    case 31:
        t.memoizedState !== null && xl(t);
        break;
    case 13:
        xl(t);
        break;
    case 19:
        ml(al);
        break;
    case 10:
        St(t.type);
        break;
    case 22:
    case 23:
        xl(t),
        Ji(),
        l !== null && ml(ia);
        break;
    case 24:
        St(cl)
    }
}
function ee(l, t) {
    try {
        var a = t.updateQueue
          , u = a !== null ? a.lastEffect : null;
        if (u !== null) {
            var e = u.next;
            a = e;
            do {
                if ((a.tag & l) === l) {
                    u = void 0;
                    var n = a.create
                      , c = a.inst;
                    u = n(),
                    c.destroy = u
                }
                a = a.next
            } while (a !== e)
        }
    } catch (i) {
        Z(t, t.return, i)
    }
}
function $t(l, t, a) {
    try {
        var u = t.updateQueue
          , e = u !== null ? u.lastEffect : null;
        if (e !== null) {
            var n = e.next;
            u = n;
            do {
                if ((u.tag & l) === l) {
                    var c = u.inst
                      , i = c.destroy;
                    if (i !== void 0) {
                        c.destroy = void 0,
                        e = t;
                        var f = a
                          , d = i;
                        try {
                            d()
                        } catch (h) {
                            Z(e, f, h)
                        }
                    }
                }
                u = u.next
            } while (u !== n)
        }
    } catch (h) {
        Z(t, t.return, h)
    }
}
function ty(l) {
    var t = l.updateQueue;
    if (t !== null) {
        var a = l.stateNode;
        try {
            y1(t, a)
        } catch (u) {
            Z(l, l.return, u)
        }
    }
}
function ay(l, t, a) {
    a.props = va(l.type, l.memoizedProps),
    a.state = l.memoizedState;
    try {
        a.componentWillUnmount()
    } catch (u) {
        Z(l, t, u)
    }
}
function xu(l, t) {
    try {
        var a = l.ref;
        if (a !== null) {
            switch (l.tag) {
            case 26:
            case 27:
            case 5:
                var u = l.stateNode;
                break;
            case 30:
                u = l.stateNode;
                break;
            default:
                u = l.stateNode
            }
            typeof a == "function" ? l.refCleanup = a(u) : a.current = u
        }
    } catch (e) {
        Z(l, t, e)
    }
}
function at(l, t) {
    var a = l.ref
      , u = l.refCleanup;
    if (a !== null)
        if (typeof u == "function")
            try {
                u()
            } catch (e) {
                Z(l, t, e)
            } finally {
                l.refCleanup = null,
                l = l.alternate,
                l != null && (l.refCleanup = null)
            }
        else if (typeof a == "function")
            try {
                a(null)
            } catch (e) {
                Z(l, t, e)
            }
        else
            a.current = null
}
function uy(l) {
    var t = l.type
      , a = l.memoizedProps
      , u = l.stateNode;
    try {
        l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
            a.autoFocus && u.focus();
            break l;
        case "img":
            a.src ? u.src = a.src : a.srcSet && (u.srcset = a.srcSet)
        }
    } catch (e) {
        Z(l, l.return, e)
    }
}
function dc(l, t, a) {
    try {
        var u = l.stateNode;
        Em(u, l.type, a, t),
        u[Dl] = t
    } catch (e) {
        Z(l, l.return, e)
    }
}
function ey(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && kt(l.type) || l.tag === 4
}
function oc(l) {
    l: for (; ; ) {
        for (; l.sibling === null; ) {
            if (l.return === null || ey(l.return))
                return null;
            l = l.return
        }
        for (l.sibling.return = l.return,
        l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
            if (l.tag === 27 && kt(l.type) || l.flags & 2 || l.child === null || l.tag === 4)
                continue l;
            l.child.return = l,
            l = l.child
        }
        if (!(l.flags & 2))
            return l.stateNode
    }
}
function ei(l, t, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
        l = l.stateNode,
        t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(l, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a,
        t.appendChild(l),
        a = a._reactRootContainer,
        a != null || t.onclick !== null || (t.onclick = vt));
    else if (u !== 4 && (u === 27 && kt(l.type) && (a = l.stateNode,
    t = null),
    l = l.child,
    l !== null))
        for (ei(l, t, a),
        l = l.sibling; l !== null; )
            ei(l, t, a),
            l = l.sibling
}
function en(l, t, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
        l = l.stateNode,
        t ? a.insertBefore(l, t) : a.appendChild(l);
    else if (u !== 4 && (u === 27 && kt(l.type) && (a = l.stateNode),
    l = l.child,
    l !== null))
        for (en(l, t, a),
        l = l.sibling; l !== null; )
            en(l, t, a),
            l = l.sibling
}
function ny(l) {
    var t = l.stateNode
      , a = l.memoizedProps;
    try {
        for (var u = l.type, e = t.attributes; e.length; )
            t.removeAttributeNode(e[0]);
        bl(t, u, a),
        t[hl] = l,
        t[Dl] = a
    } catch (n) {
        Z(l, l.return, n)
    }
}
var ot = !1
  , nl = !1
  , mc = !1
  , E0 = typeof WeakSet == "function" ? WeakSet : Set
  , dl = null;
function tm(l, t) {
    if (l = l.containerInfo,
    di = gn,
    l = Js(l),
    Bi(l)) {
        if ("selectionStart"in l)
            var a = {
                start: l.selectionStart,
                end: l.selectionEnd
            };
        else
            l: {
                a = (a = l.ownerDocument) && a.defaultView || window;
                var u = a.getSelection && a.getSelection();
                if (u && u.rangeCount !== 0) {
                    a = u.anchorNode;
                    var e = u.anchorOffset
                      , n = u.focusNode;
                    u = u.focusOffset;
                    try {
                        a.nodeType,
                        n.nodeType
                    } catch {
                        a = null;
                        break l
                    }
                    var c = 0
                      , i = -1
                      , f = -1
                      , d = 0
                      , h = 0
                      , g = l
                      , o = null;
                    t: for (; ; ) {
                        for (var v; g !== a || e !== 0 && g.nodeType !== 3 || (i = c + e),
                        g !== n || u !== 0 && g.nodeType !== 3 || (f = c + u),
                        g.nodeType === 3 && (c += g.nodeValue.length),
                        (v = g.firstChild) !== null; )
                            o = g,
                            g = v;
                        for (; ; ) {
                            if (g === l)
                                break t;
                            if (o === a && ++d === e && (i = c),
                            o === n && ++h === u && (f = c),
                            (v = g.nextSibling) !== null)
                                break;
                            g = o,
                            o = g.parentNode
                        }
                        g = v
                    }
                    a = i === -1 || f === -1 ? null : {
                        start: i,
                        end: f
                    }
                } else
                    a = null
            }
        a = a || {
            start: 0,
            end: 0
        }
    } else
        a = null;
    for (oi = {
        focusedElem: l,
        selectionRange: a
    },
    gn = !1,
    dl = t; dl !== null; )
        if (t = dl,
        l = t.child,
        (t.subtreeFlags & 1028) !== 0 && l !== null)
            l.return = t,
            dl = l;
        else
            for (; dl !== null; ) {
                switch (t = dl,
                n = t.alternate,
                l = t.flags,
                t.tag) {
                case 0:
                    if (l & 4 && (l = t.updateQueue,
                    l = l !== null ? l.events : null,
                    l !== null))
                        for (a = 0; a < l.length; a++)
                            e = l[a],
                            e.ref.impl = e.nextImpl;
                    break;
                case 11:
                case 15:
                    break;
                case 1:
                    if (l & 1024 && n !== null) {
                        l = void 0,
                        a = t,
                        e = n.memoizedProps,
                        n = n.memoizedState,
                        u = a.stateNode;
                        try {
                            var r = va(a.type, e);
                            l = u.getSnapshotBeforeUpdate(r, n),
                            u.__reactInternalSnapshotBeforeUpdate = l
                        } catch (E) {
                            Z(a, a.return, E)
                        }
                    }
                    break;
                case 3:
                    if (l & 1024) {
                        if (l = t.stateNode.containerInfo,
                        a = l.nodeType,
                        a === 9)
                            vi(l);
                        else if (a === 1)
                            switch (l.nodeName) {
                            case "HEAD":
                            case "HTML":
                            case "BODY":
                                vi(l);
                                break;
                            default:
                                l.textContent = ""
                            }
                    }
                    break;
                case 5:
                case 26:
                case 27:
                case 6:
                case 4:
                case 17:
                    break;
                default:
                    if (l & 1024)
                        throw Error(b(163))
                }
                if (l = t.sibling,
                l !== null) {
                    l.return = t.return,
                    dl = l;
                    break
                }
                dl = t.return
            }
}
function cy(l, t, a) {
    var u = a.flags;
    switch (a.tag) {
    case 0:
    case 11:
    case 15:
        st(l, a),
        u & 4 && ee(5, a);
        break;
    case 1:
        if (st(l, a),
        u & 4)
            if (l = a.stateNode,
            t === null)
                try {
                    l.componentDidMount()
                } catch (c) {
                    Z(a, a.return, c)
                }
            else {
                var e = va(a.type, t.memoizedProps);
                t = t.memoizedState;
                try {
                    l.componentDidUpdate(e, t, l.__reactInternalSnapshotBeforeUpdate)
                } catch (c) {
                    Z(a, a.return, c)
                }
            }
        u & 64 && ty(a),
        u & 512 && xu(a, a.return);
        break;
    case 3:
        if (st(l, a),
        u & 64 && (l = a.updateQueue,
        l !== null)) {
            if (t = null,
            a.child !== null)
                switch (a.child.tag) {
                case 27:
                case 5:
                    t = a.child.stateNode;
                    break;
                case 1:
                    t = a.child.stateNode
                }
            try {
                y1(l, t)
            } catch (c) {
                Z(a, a.return, c)
            }
        }
        break;
    case 27:
        t === null && u & 4 && ny(a);
    case 26:
    case 5:
        st(l, a),
        t === null && u & 4 && uy(a),
        u & 512 && xu(a, a.return);
        break;
    case 12:
        st(l, a);
        break;
    case 31:
        st(l, a),
        u & 4 && sy(l, a);
        break;
    case 13:
        st(l, a),
        u & 4 && yy(l, a),
        u & 64 && (l = a.memoizedState,
        l !== null && (l = l.dehydrated,
        l !== null && (a = ym.bind(null, a),
        Nm(l, a))));
        break;
    case 22:
        if (u = a.memoizedState !== null || ot,
        !u) {
            t = t !== null && t.memoizedState !== null || nl,
            e = ot;
            var n = nl;
            ot = u,
            (nl = t) && !n ? yt(l, a, (a.subtreeFlags & 8772) !== 0) : st(l, a),
            ot = e,
            nl = n
        }
        break;
    case 30:
        break;
    default:
        st(l, a)
    }
}
function iy(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null,
    iy(t)),
    l.child = null,
    l.deletions = null,
    l.sibling = null,
    l.tag === 5 && (t = l.stateNode,
    t !== null && Ni(t)),
    l.stateNode = null,
    l.return = null,
    l.dependencies = null,
    l.memoizedProps = null,
    l.memoizedState = null,
    l.pendingProps = null,
    l.stateNode = null,
    l.updateQueue = null
}
var k = null
  , pl = !1;
function ft(l, t, a) {
    for (a = a.child; a !== null; )
        fy(l, t, a),
        a = a.sibling
}
function fy(l, t, a) {
    if (jl && typeof jl.onCommitFiberUnmount == "function")
        try {
            jl.onCommitFiberUnmount(ku, a)
        } catch {}
    switch (a.tag) {
    case 26:
        nl || at(a, t),
        ft(l, t, a),
        a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode,
        a.parentNode.removeChild(a));
        break;
    case 27:
        nl || at(a, t);
        var u = k
          , e = pl;
        kt(a.type) && (k = a.stateNode,
        pl = !1),
        ft(l, t, a),
        ju(a.stateNode),
        k = u,
        pl = e;
        break;
    case 5:
        nl || at(a, t);
    case 6:
        if (u = k,
        e = pl,
        k = null,
        ft(l, t, a),
        k = u,
        pl = e,
        k !== null)
            if (pl)
                try {
                    (k.nodeType === 9 ? k.body : k.nodeName === "HTML" ? k.ownerDocument.body : k).removeChild(a.stateNode)
                } catch (n) {
                    Z(a, t, n)
                }
            else
                try {
                    k.removeChild(a.stateNode)
                } catch (n) {
                    Z(a, t, n)
                }
        break;
    case 18:
        k !== null && (pl ? (l = k,
        j0(l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, a.stateNode),
        lu(l)) : j0(k, a.stateNode));
        break;
    case 4:
        u = k,
        e = pl,
        k = a.stateNode.containerInfo,
        pl = !0,
        ft(l, t, a),
        k = u,
        pl = e;
        break;
    case 0:
    case 11:
    case 14:
    case 15:
        $t(2, a, t),
        nl || $t(4, a, t),
        ft(l, t, a);
        break;
    case 1:
        nl || (at(a, t),
        u = a.stateNode,
        typeof u.componentWillUnmount == "function" && ay(a, t, u)),
        ft(l, t, a);
        break;
    case 21:
        ft(l, t, a);
        break;
    case 22:
        nl = (u = nl) || a.memoizedState !== null,
        ft(l, t, a),
        nl = u;
        break;
    default:
        ft(l, t, a)
    }
}
function sy(l, t) {
    if (t.memoizedState === null && (l = t.alternate,
    l !== null && (l = l.memoizedState,
    l !== null))) {
        l = l.dehydrated;
        try {
            lu(l)
        } catch (a) {
            Z(t, t.return, a)
        }
    }
}
function yy(l, t) {
    if (t.memoizedState === null && (l = t.alternate,
    l !== null && (l = l.memoizedState,
    l !== null && (l = l.dehydrated,
    l !== null))))
        try {
            lu(l)
        } catch (a) {
            Z(t, t.return, a)
        }
}
function am(l) {
    switch (l.tag) {
    case 31:
    case 13:
    case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new E0),
        t;
    case 22:
        return l = l.stateNode,
        t = l._retryCache,
        t === null && (t = l._retryCache = new E0),
        t;
    default:
        throw Error(b(435, l.tag))
    }
}
function Ee(l, t) {
    var a = am(l);
    t.forEach(function(u) {
        if (!a.has(u)) {
            a.add(u);
            var e = dm.bind(null, l, u);
            u.then(e, e)
        }
    })
}
function El(l, t) {
    var a = t.deletions;
    if (a !== null)
        for (var u = 0; u < a.length; u++) {
            var e = a[u]
              , n = l
              , c = t
              , i = c;
            l: for (; i !== null; ) {
                switch (i.tag) {
                case 27:
                    if (kt(i.type)) {
                        k = i.stateNode,
                        pl = !1;
                        break l
                    }
                    break;
                case 5:
                    k = i.stateNode,
                    pl = !1;
                    break l;
                case 3:
                case 4:
                    k = i.stateNode.containerInfo,
                    pl = !0;
                    break l
                }
                i = i.return
            }
            if (k === null)
                throw Error(b(160));
            fy(n, c, e),
            k = null,
            pl = !1,
            n = e.alternate,
            n !== null && (n.return = null),
            e.return = null
        }
    if (t.subtreeFlags & 13886)
        for (t = t.child; t !== null; )
            dy(t, l),
            t = t.sibling
}
var Il = null;
function dy(l, t) {
    var a = l.alternate
      , u = l.flags;
    switch (l.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
        El(t, l),
        Tl(l),
        u & 4 && ($t(3, l, l.return),
        ee(3, l),
        $t(5, l, l.return));
        break;
    case 1:
        El(t, l),
        Tl(l),
        u & 512 && (nl || a === null || at(a, a.return)),
        u & 64 && ot && (l = l.updateQueue,
        l !== null && (u = l.callbacks,
        u !== null && (a = l.shared.hiddenCallbacks,
        l.shared.hiddenCallbacks = a === null ? u : a.concat(u))));
        break;
    case 26:
        var e = Il;
        if (El(t, l),
        Tl(l),
        u & 512 && (nl || a === null || at(a, a.return)),
        u & 4) {
            var n = a !== null ? a.memoizedState : null;
            if (u = l.memoizedState,
            a === null)
                if (u === null)
                    if (l.stateNode === null) {
                        l: {
                            u = l.type,
                            a = l.memoizedProps,
                            e = e.ownerDocument || e;
                            t: switch (u) {
                            case "title":
                                n = e.getElementsByTagName("title")[0],
                                (!n || n[le] || n[hl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = e.createElement(u),
                                e.head.insertBefore(n, e.querySelector("head > title"))),
                                bl(n, u, a),
                                n[hl] = l,
                                ol(n),
                                u = n;
                                break l;
                            case "link":
                                var c = Z0("link", "href", e).get(u + (a.href || ""));
                                if (c) {
                                    for (var i = 0; i < c.length; i++)
                                        if (n = c[i],
                                        n.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && n.getAttribute("rel") === (a.rel == null ? null : a.rel) && n.getAttribute("title") === (a.title == null ? null : a.title) && n.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                                            c.splice(i, 1);
                                            break t
                                        }
                                }
                                n = e.createElement(u),
                                bl(n, u, a),
                                e.head.appendChild(n);
                                break;
                            case "meta":
                                if (c = Z0("meta", "content", e).get(u + (a.content || ""))) {
                                    for (i = 0; i < c.length; i++)
                                        if (n = c[i],
                                        n.getAttribute("content") === (a.content == null ? null : "" + a.content) && n.getAttribute("name") === (a.name == null ? null : a.name) && n.getAttribute("property") === (a.property == null ? null : a.property) && n.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && n.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                                            c.splice(i, 1);
                                            break t
                                        }
                                }
                                n = e.createElement(u),
                                bl(n, u, a),
                                e.head.appendChild(n);
                                break;
                            default:
                                throw Error(b(468, u))
                            }
                            n[hl] = l,
                            ol(n),
                            u = n
                        }
                        l.stateNode = u
                    } else
                        V0(e, l.type, l.stateNode);
                else
                    l.stateNode = Q0(e, u, l.memoizedProps);
            else
                n !== u ? (n === null ? a.stateNode !== null && (a = a.stateNode,
                a.parentNode.removeChild(a)) : n.count--,
                u === null ? V0(e, l.type, l.stateNode) : Q0(e, u, l.memoizedProps)) : u === null && l.stateNode !== null && dc(l, l.memoizedProps, a.memoizedProps)
        }
        break;
    case 27:
        El(t, l),
        Tl(l),
        u & 512 && (nl || a === null || at(a, a.return)),
        a !== null && u & 4 && dc(l, l.memoizedProps, a.memoizedProps);
        break;
    case 5:
        if (El(t, l),
        Tl(l),
        u & 512 && (nl || a === null || at(a, a.return)),
        l.flags & 32) {
            e = l.stateNode;
            try {
                Ja(e, "")
            } catch (r) {
                Z(l, l.return, r)
            }
        }
        u & 4 && l.stateNode != null && (e = l.memoizedProps,
        dc(l, e, a !== null ? a.memoizedProps : e)),
        u & 1024 && (mc = !0);
        break;
    case 6:
        if (El(t, l),
        Tl(l),
        u & 4) {
            if (l.stateNode === null)
                throw Error(b(162));
            u = l.memoizedProps,
            a = l.stateNode;
            try {
                a.nodeValue = u
            } catch (r) {
                Z(l, l.return, r)
            }
        }
        break;
    case 3:
        if (Ge = null,
        e = Il,
        Il = mn(t.containerInfo),
        El(t, l),
        Il = e,
        Tl(l),
        u & 4 && a !== null && a.memoizedState.isDehydrated)
            try {
                lu(t.containerInfo)
            } catch (r) {
                Z(l, l.return, r)
            }
        mc && (mc = !1,
        oy(l));
        break;
    case 4:
        u = Il,
        Il = mn(l.stateNode.containerInfo),
        El(t, l),
        Tl(l),
        Il = u;
        break;
    case 12:
        El(t, l),
        Tl(l);
        break;
    case 31:
        El(t, l),
        Tl(l),
        u & 4 && (u = l.updateQueue,
        u !== null && (l.updateQueue = null,
        Ee(l, u)));
        break;
    case 13:
        El(t, l),
        Tl(l),
        l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Hn = Cl()),
        u & 4 && (u = l.updateQueue,
        u !== null && (l.updateQueue = null,
        Ee(l, u)));
        break;
    case 22:
        e = l.memoizedState !== null;
        var f = a !== null && a.memoizedState !== null
          , d = ot
          , h = nl;
        if (ot = d || e,
        nl = h || f,
        El(t, l),
        nl = h,
        ot = d,
        Tl(l),
        u & 8192)
            l: for (t = l.stateNode,
            t._visibility = e ? t._visibility & -2 : t._visibility | 1,
            e && (a === null || f || ot || nl || ea(l)),
            a = null,
            t = l; ; ) {
                if (t.tag === 5 || t.tag === 26) {
                    if (a === null) {
                        f = a = t;
                        try {
                            if (n = f.stateNode,
                            e)
                                c = n.style,
                                typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                            else {
                                i = f.stateNode;
                                var g = f.memoizedProps.style
                                  , o = g != null && g.hasOwnProperty("display") ? g.display : null;
                                i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim()
                            }
                        } catch (r) {
                            Z(f, f.return, r)
                        }
                    }
                } else if (t.tag === 6) {
                    if (a === null) {
                        f = t;
                        try {
                            f.stateNode.nodeValue = e ? "" : f.memoizedProps
                        } catch (r) {
                            Z(f, f.return, r)
                        }
                    }
                } else if (t.tag === 18) {
                    if (a === null) {
                        f = t;
                        try {
                            var v = f.stateNode;
                            e ? B0(v, !0) : B0(f.stateNode, !1)
                        } catch (r) {
                            Z(f, f.return, r)
                        }
                    }
                } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
                    t.child.return = t,
                    t = t.child;
                    continue
                }
                if (t === l)
                    break l;
                for (; t.sibling === null; ) {
                    if (t.return === null || t.return === l)
                        break l;
                    a === t && (a = null),
                    t = t.return
                }
                a === t && (a = null),
                t.sibling.return = t.return,
                t = t.sibling
            }
        u & 4 && (u = l.updateQueue,
        u !== null && (a = u.retryQueue,
        a !== null && (u.retryQueue = null,
        Ee(l, a))));
        break;
    case 19:
        El(t, l),
        Tl(l),
        u & 4 && (u = l.updateQueue,
        u !== null && (l.updateQueue = null,
        Ee(l, u)));
        break;
    case 30:
        break;
    case 21:
        break;
    default:
        El(t, l),
        Tl(l)
    }
}
function Tl(l) {
    var t = l.flags;
    if (t & 2) {
        try {
            for (var a, u = l.return; u !== null; ) {
                if (ey(u)) {
                    a = u;
                    break
                }
                u = u.return
            }
            if (a == null)
                throw Error(b(160));
            switch (a.tag) {
            case 27:
                var e = a.stateNode
                  , n = oc(l);
                en(l, n, e);
                break;
            case 5:
                var c = a.stateNode;
                a.flags & 32 && (Ja(c, ""),
                a.flags &= -33);
                var i = oc(l);
                en(l, i, c);
                break;
            case 3:
            case 4:
                var f = a.stateNode.containerInfo
                  , d = oc(l);
                ei(l, d, f);
                break;
            default:
                throw Error(b(161))
            }
        } catch (h) {
            Z(l, l.return, h)
        }
        l.flags &= -3
    }
    t & 4096 && (l.flags &= -4097)
}
function oy(l) {
    if (l.subtreeFlags & 1024)
        for (l = l.child; l !== null; ) {
            var t = l;
            oy(t),
            t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
            l = l.sibling
        }
}
function st(l, t) {
    if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null; )
            cy(l, t.alternate, t),
            t = t.sibling
}
function ea(l) {
    for (l = l.child; l !== null; ) {
        var t = l;
        switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            $t(4, t, t.return),
            ea(t);
            break;
        case 1:
            at(t, t.return);
            var a = t.stateNode;
            typeof a.componentWillUnmount == "function" && ay(t, t.return, a),
            ea(t);
            break;
        case 27:
            ju(t.stateNode);
        case 26:
        case 5:
            at(t, t.return),
            ea(t);
            break;
        case 22:
            t.memoizedState === null && ea(t);
            break;
        case 30:
            ea(t);
            break;
        default:
            ea(t)
        }
        l = l.sibling
    }
}
function yt(l, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0,
    t = t.child; t !== null; ) {
        var u = t.alternate
          , e = l
          , n = t
          , c = n.flags;
        switch (n.tag) {
        case 0:
        case 11:
        case 15:
            yt(e, n, a),
            ee(4, n);
            break;
        case 1:
            if (yt(e, n, a),
            u = n,
            e = u.stateNode,
            typeof e.componentDidMount == "function")
                try {
                    e.componentDidMount()
                } catch (d) {
                    Z(u, u.return, d)
                }
            if (u = n,
            e = u.updateQueue,
            e !== null) {
                var i = u.stateNode;
                try {
                    var f = e.shared.hiddenCallbacks;
                    if (f !== null)
                        for (e.shared.hiddenCallbacks = null,
                        e = 0; e < f.length; e++)
                            s1(f[e], i)
                } catch (d) {
                    Z(u, u.return, d)
                }
            }
            a && c & 64 && ty(n),
            xu(n, n.return);
            break;
        case 27:
            ny(n);
        case 26:
        case 5:
            yt(e, n, a),
            a && u === null && c & 4 && uy(n),
            xu(n, n.return);
            break;
        case 12:
            yt(e, n, a);
            break;
        case 31:
            yt(e, n, a),
            a && c & 4 && sy(e, n);
            break;
        case 13:
            yt(e, n, a),
            a && c & 4 && yy(e, n);
            break;
        case 22:
            n.memoizedState === null && yt(e, n, a),
            xu(n, n.return);
            break;
        case 30:
            break;
        default:
            yt(e, n, a)
        }
        t = t.sibling
    }
}
function sf(l, t) {
    var a = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool),
    l = null,
    t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool),
    l !== a && (l != null && l.refCount++,
    a != null && ae(a))
}
function yf(l, t) {
    l = null,
    t.alternate !== null && (l = t.alternate.memoizedState.cache),
    t = t.memoizedState.cache,
    t !== l && (t.refCount++,
    l != null && ae(l))
}
function kl(l, t, a, u) {
    if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; )
            my(l, t, a, u),
            t = t.sibling
}
function my(l, t, a, u) {
    var e = t.flags;
    switch (t.tag) {
    case 0:
    case 11:
    case 15:
        kl(l, t, a, u),
        e & 2048 && ee(9, t);
        break;
    case 1:
        kl(l, t, a, u);
        break;
    case 3:
        kl(l, t, a, u),
        e & 2048 && (l = null,
        t.alternate !== null && (l = t.alternate.memoizedState.cache),
        t = t.memoizedState.cache,
        t !== l && (t.refCount++,
        l != null && ae(l)));
        break;
    case 12:
        if (e & 2048) {
            kl(l, t, a, u),
            l = t.stateNode;
            try {
                var n = t.memoizedProps
                  , c = n.id
                  , i = n.onPostCommit;
                typeof i == "function" && i(c, t.alternate === null ? "mount" : "update", l.passiveEffectDuration, -0)
            } catch (f) {
                Z(t, t.return, f)
            }
        } else
            kl(l, t, a, u);
        break;
    case 31:
        kl(l, t, a, u);
        break;
    case 13:
        kl(l, t, a, u);
        break;
    case 23:
        break;
    case 22:
        n = t.stateNode,
        c = t.alternate,
        t.memoizedState !== null ? n._visibility & 2 ? kl(l, t, a, u) : Hu(l, t) : n._visibility & 2 ? kl(l, t, a, u) : (n._visibility |= 2,
        Ta(l, t, a, u, (t.subtreeFlags & 10256) !== 0 || !1)),
        e & 2048 && sf(c, t);
        break;
    case 24:
        kl(l, t, a, u),
        e & 2048 && yf(t.alternate, t);
        break;
    default:
        kl(l, t, a, u)
    }
}
function Ta(l, t, a, u, e) {
    for (e = e && ((t.subtreeFlags & 10256) !== 0 || !1),
    t = t.child; t !== null; ) {
        var n = l
          , c = t
          , i = a
          , f = u
          , d = c.flags;
        switch (c.tag) {
        case 0:
        case 11:
        case 15:
            Ta(n, c, i, f, e),
            ee(8, c);
            break;
        case 23:
            break;
        case 22:
            var h = c.stateNode;
            c.memoizedState !== null ? h._visibility & 2 ? Ta(n, c, i, f, e) : Hu(n, c) : (h._visibility |= 2,
            Ta(n, c, i, f, e)),
            e && d & 2048 && sf(c.alternate, c);
            break;
        case 24:
            Ta(n, c, i, f, e),
            e && d & 2048 && yf(c.alternate, c);
            break;
        default:
            Ta(n, c, i, f, e)
        }
        t = t.sibling
    }
}
function Hu(l, t) {
    if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) {
            var a = l
              , u = t
              , e = u.flags;
            switch (u.tag) {
            case 22:
                Hu(a, u),
                e & 2048 && sf(u.alternate, u);
                break;
            case 24:
                Hu(a, u),
                e & 2048 && yf(u.alternate, u);
                break;
            default:
                Hu(a, u)
            }
            t = t.sibling
        }
}
var Au = 8192;
function Aa(l, t, a) {
    if (l.subtreeFlags & Au)
        for (l = l.child; l !== null; )
            vy(l, t, a),
            l = l.sibling
}
function vy(l, t, a) {
    switch (l.tag) {
    case 26:
        Aa(l, t, a),
        l.flags & Au && l.memoizedState !== null && Zm(a, Il, l.memoizedState, l.memoizedProps);
        break;
    case 5:
        Aa(l, t, a);
        break;
    case 3:
    case 4:
        var u = Il;
        Il = mn(l.stateNode.containerInfo),
        Aa(l, t, a),
        Il = u;
        break;
    case 22:
        l.memoizedState === null && (u = l.alternate,
        u !== null && u.memoizedState !== null ? (u = Au,
        Au = 16777216,
        Aa(l, t, a),
        Au = u) : Aa(l, t, a));
        break;
    default:
        Aa(l, t, a)
    }
}
function hy(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child,
    l !== null)) {
        t.child = null;
        do
            t = l.sibling,
            l.sibling = null,
            l = t;
        while (l !== null)
    }
}
function hu(l) {
    var t = l.deletions;
    if (l.flags & 16) {
        if (t !== null)
            for (var a = 0; a < t.length; a++) {
                var u = t[a];
                dl = u,
                Sy(u, l)
            }
        hy(l)
    }
    if (l.subtreeFlags & 10256)
        for (l = l.child; l !== null; )
            gy(l),
            l = l.sibling
}
function gy(l) {
    switch (l.tag) {
    case 0:
    case 11:
    case 15:
        hu(l),
        l.flags & 2048 && $t(9, l, l.return);
        break;
    case 3:
        hu(l);
        break;
    case 12:
        hu(l);
        break;
    case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3,
        Ye(l)) : hu(l);
        break;
    default:
        hu(l)
    }
}
function Ye(l) {
    var t = l.deletions;
    if (l.flags & 16) {
        if (t !== null)
            for (var a = 0; a < t.length; a++) {
                var u = t[a];
                dl = u,
                Sy(u, l)
            }
        hy(l)
    }
    for (l = l.child; l !== null; ) {
        switch (t = l,
        t.tag) {
        case 0:
        case 11:
        case 15:
            $t(8, t, t.return),
            Ye(t);
            break;
        case 22:
            a = t.stateNode,
            a._visibility & 2 && (a._visibility &= -3,
            Ye(t));
            break;
        default:
            Ye(t)
        }
        l = l.sibling
    }
}
function Sy(l, t) {
    for (; dl !== null; ) {
        var a = dl;
        switch (a.tag) {
        case 0:
        case 11:
        case 15:
            $t(8, a, t);
            break;
        case 23:
        case 22:
            if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
                var u = a.memoizedState.cachePool.pool;
                u != null && u.refCount++
            }
            break;
        case 24:
            ae(a.memoizedState.cache)
        }
        if (u = a.child,
        u !== null)
            u.return = a,
            dl = u;
        else
            l: for (a = l; dl !== null; ) {
                u = dl;
                var e = u.sibling
                  , n = u.return;
                if (iy(u),
                u === a) {
                    dl = null;
                    break l
                }
                if (e !== null) {
                    e.return = n,
                    dl = e;
                    break l
                }
                dl = n
            }
    }
}
var um = {
    getCacheForType: function(l) {
        var t = Sl(cl)
          , a = t.data.get(l);
        return a === void 0 && (a = l(),
        t.data.set(l, a)),
        a
    },
    cacheSignal: function() {
        return Sl(cl).controller.signal
    }
}
  , em = typeof WeakMap == "function" ? WeakMap : Map
  , G = 0
  , K = null
  , B = null
  , Y = 0
  , Q = 0
  , Nl = null
  , Ct = !1
  , cu = !1
  , df = !1
  , Tt = 0
  , ll = 0
  , Wt = 0
  , sa = 0
  , of = 0
  , Rl = 0
  , Fa = 0
  , Ru = null
  , _l = null
  , ni = !1
  , Hn = 0
  , by = 0
  , nn = 1 / 0
  , cn = null
  , Qt = null
  , fl = 0
  , Zt = null
  , ka = null
  , bt = 0
  , ci = 0
  , ii = null
  , ry = null
  , Cu = 0
  , fi = null;
function Yl() {
    return G & 2 && Y !== 0 ? Y & -Y : M.T !== null ? vf() : Ds()
}
function zy() {
    if (Rl === 0)
        if (!(Y & 536870912) || q) {
            var l = ve;
            ve <<= 1,
            !(ve & 3932160) && (ve = 262144),
            Rl = l
        } else
            Rl = 536870912;
    return l = Gl.current,
    l !== null && (l.flags |= 32),
    Rl
}
function Ml(l, t, a) {
    (l === K && (Q === 2 || Q === 9) || l.cancelPendingCommit !== null) && (Ia(l, 0),
    jt(l, Y, Rl, !1)),
    Pu(l, a),
    (!(G & 2) || l !== K) && (l === K && (!(G & 2) && (sa |= a),
    ll === 4 && jt(l, Y, Rl, !1)),
    nt(l))
}
function Ay(l, t, a) {
    if (G & 6)
        throw Error(b(327));
    var u = !a && (t & 127) === 0 && (t & l.expiredLanes) === 0 || Iu(l, t)
      , e = u ? im(l, t) : vc(l, t, !0)
      , n = u;
    do {
        if (e === 0) {
            cu && !u && jt(l, t, 0, !1);
            break
        } else {
            if (a = l.current.alternate,
            n && !nm(a)) {
                e = vc(l, t, !1),
                n = !1;
                continue
            }
            if (e === 2) {
                if (n = t,
                l.errorRecoveryDisabledLanes & n)
                    var c = 0;
                else
                    c = l.pendingLanes & -536870913,
                    c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
                if (c !== 0) {
                    t = c;
                    l: {
                        var i = l;
                        e = Ru;
                        var f = i.current.memoizedState.isDehydrated;
                        if (f && (Ia(i, c).flags |= 256),
                        c = vc(i, c, !1),
                        c !== 2) {
                            if (df && !f) {
                                i.errorRecoveryDisabledLanes |= n,
                                sa |= n,
                                e = 4;
                                break l
                            }
                            n = _l,
                            _l = e,
                            n !== null && (_l === null ? _l = n : _l.push.apply(_l, n))
                        }
                        e = c
                    }
                    if (n = !1,
                    e !== 2)
                        continue
                }
            }
            if (e === 1) {
                Ia(l, 0),
                jt(l, t, 0, !0);
                break
            }
            l: {
                switch (u = l,
                n = e,
                n) {
                case 0:
                case 1:
                    throw Error(b(345));
                case 4:
                    if ((t & 4194048) !== t)
                        break;
                case 6:
                    jt(u, t, Rl, !Ct);
                    break l;
                case 2:
                    _l = null;
                    break;
                case 3:
                case 5:
                    break;
                default:
                    throw Error(b(329))
                }
                if ((t & 62914560) === t && (e = Hn + 300 - Cl(),
                10 < e)) {
                    if (jt(u, t, Rl, !Ct),
                    An(u, 0, !0) !== 0)
                        break l;
                    bt = t,
                    u.timeoutHandle = Qy(T0.bind(null, u, a, _l, cn, ni, t, Rl, sa, Fa, Ct, n, "Throttled", -0, 0), e);
                    break l
                }
                T0(u, a, _l, cn, ni, t, Rl, sa, Fa, Ct, n, null, -0, 0)
            }
        }
        break
    } while (!0);
    nt(l)
}
function T0(l, t, a, u, e, n, c, i, f, d, h, g, o, v) {
    if (l.timeoutHandle = -1,
    g = t.subtreeFlags,
    g & 8192 || (g & 16785408) === 16785408) {
        g = {
            stylesheets: null,
            count: 0,
            imgCount: 0,
            imgBytes: 0,
            suspenseyImages: [],
            waitingForImages: !0,
            waitingForViewTransition: !1,
            unsuspend: vt
        },
        vy(t, n, g);
        var r = (n & 62914560) === n ? Hn - Cl() : (n & 4194048) === n ? by - Cl() : 0;
        if (r = Vm(g, r),
        r !== null) {
            bt = n,
            l.cancelPendingCommit = r(_0.bind(null, l, t, n, a, u, e, c, i, f, h, g, null, o, v)),
            jt(l, n, c, !d);
            return
        }
    }
    _0(l, t, n, a, u, e, c, i, f)
}
function nm(l) {
    for (var t = l; ; ) {
        var a = t.tag;
        if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue,
        a !== null && (a = a.stores,
        a !== null)))
            for (var u = 0; u < a.length; u++) {
                var e = a[u]
                  , n = e.getSnapshot;
                e = e.value;
                try {
                    if (!ql(n(), e))
                        return !1
                } catch {
                    return !1
                }
            }
        if (a = t.child,
        t.subtreeFlags & 16384 && a !== null)
            a.return = t,
            t = a;
        else {
            if (t === l)
                break;
            for (; t.sibling === null; ) {
                if (t.return === null || t.return === l)
                    return !0;
                t = t.return
            }
            t.sibling.return = t.return,
            t = t.sibling
        }
    }
    return !0
}
function jt(l, t, a, u) {
    t &= ~of,
    t &= ~sa,
    l.suspendedLanes |= t,
    l.pingedLanes &= ~t,
    u && (l.warmLanes |= t),
    u = l.expirationTimes;
    for (var e = t; 0 < e; ) {
        var n = 31 - Bl(e)
          , c = 1 << n;
        u[n] = -1,
        e &= ~c
    }
    a !== 0 && _s(l, a, t)
}
function Rn() {
    return G & 6 ? !0 : (ne(0),
    !1)
}
function mf() {
    if (B !== null) {
        if (Q === 0)
            var l = B.return;
        else
            l = B,
            ht = ra = null,
            ki(l),
            Qa = null,
            Zu = 0,
            l = B;
        for (; l !== null; )
            ly(l.alternate, l),
            l = l.return;
        B = null
    }
}
function Ia(l, t) {
    var a = l.timeoutHandle;
    a !== -1 && (l.timeoutHandle = -1,
    _m(a)),
    a = l.cancelPendingCommit,
    a !== null && (l.cancelPendingCommit = null,
    a()),
    bt = 0,
    mf(),
    K = l,
    B = a = gt(l.current, null),
    Y = t,
    Q = 0,
    Nl = null,
    Ct = !1,
    cu = Iu(l, t),
    df = !1,
    Fa = Rl = of = sa = Wt = ll = 0,
    _l = Ru = null,
    ni = !1,
    t & 8 && (t |= t & 32);
    var u = l.entangledLanes;
    if (u !== 0)
        for (l = l.entanglements,
        u &= t; 0 < u; ) {
            var e = 31 - Bl(u)
              , n = 1 << e;
            t |= l[e],
            u &= ~n
        }
    return Tt = t,
    _n(),
    a
}
function Ey(l, t) {
    x = null,
    M.H = Lu,
    t === nu || t === Mn ? (t = t0(),
    Q = 3) : t === Li ? (t = t0(),
    Q = 4) : Q = t === cf ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1,
    Nl = t,
    B === null && (ll = 1,
    an(l, Kl(t, l.current)))
}
function Ty() {
    var l = Gl.current;
    return l === null ? !0 : (Y & 4194048) === Y ? wl === null : (Y & 62914560) === Y || Y & 536870912 ? l === wl : !1
}
function py() {
    var l = M.H;
    return M.H = Lu,
    l === null ? Lu : l
}
function _y() {
    var l = M.A;
    return M.A = um,
    l
}
function fn() {
    ll = 4,
    Ct || (Y & 4194048) !== Y && Gl.current !== null || (cu = !0),
    !(Wt & 134217727) && !(sa & 134217727) || K === null || jt(K, Y, Rl, !1)
}
function vc(l, t, a) {
    var u = G;
    G |= 2;
    var e = py()
      , n = _y();
    (K !== l || Y !== t) && (cn = null,
    Ia(l, t)),
    t = !1;
    var c = ll;
    l: do
        try {
            if (Q !== 0 && B !== null) {
                var i = B
                  , f = Nl;
                switch (Q) {
                case 8:
                    mf(),
                    c = 6;
                    break l;
                case 3:
                case 2:
                case 9:
                case 6:
                    Gl.current === null && (t = !0);
                    var d = Q;
                    if (Q = 0,
                    Nl = null,
                    Ba(l, i, f, d),
                    a && cu) {
                        c = 0;
                        break l
                    }
                    break;
                default:
                    d = Q,
                    Q = 0,
                    Nl = null,
                    Ba(l, i, f, d)
                }
            }
            cm(),
            c = ll;
            break
        } catch (h) {
            Ey(l, h)
        }
    while (!0);
    return t && l.shellSuspendCounter++,
    ht = ra = null,
    G = u,
    M.H = e,
    M.A = n,
    B === null && (K = null,
    Y = 0,
    _n()),
    c
}
function cm() {
    for (; B !== null; )
        Oy(B)
}
function im(l, t) {
    var a = G;
    G |= 2;
    var u = py()
      , e = _y();
    K !== l || Y !== t ? (cn = null,
    nn = Cl() + 500,
    Ia(l, t)) : cu = Iu(l, t);
    l: do
        try {
            if (Q !== 0 && B !== null) {
                t = B;
                var n = Nl;
                t: switch (Q) {
                case 1:
                    Q = 0,
                    Nl = null,
                    Ba(l, t, n, 1);
                    break;
                case 2:
                case 9:
                    if (l0(n)) {
                        Q = 0,
                        Nl = null,
                        p0(t);
                        break
                    }
                    t = function() {
                        Q !== 2 && Q !== 9 || K !== l || (Q = 7),
                        nt(l)
                    }
                    ,
                    n.then(t, t);
                    break l;
                case 3:
                    Q = 7;
                    break l;
                case 4:
                    Q = 5;
                    break l;
                case 7:
                    l0(n) ? (Q = 0,
                    Nl = null,
                    p0(t)) : (Q = 0,
                    Nl = null,
                    Ba(l, t, n, 7));
                    break;
                case 5:
                    var c = null;
                    switch (B.tag) {
                    case 26:
                        c = B.memoizedState;
                    case 5:
                    case 27:
                        var i = B;
                        if (c ? Jy(c) : i.stateNode.complete) {
                            Q = 0,
                            Nl = null;
                            var f = i.sibling;
                            if (f !== null)
                                B = f;
                            else {
                                var d = i.return;
                                d !== null ? (B = d,
                                Cn(d)) : B = null
                            }
                            break t
                        }
                    }
                    Q = 0,
                    Nl = null,
                    Ba(l, t, n, 5);
                    break;
                case 6:
                    Q = 0,
                    Nl = null,
                    Ba(l, t, n, 6);
                    break;
                case 8:
                    mf(),
                    ll = 6;
                    break l;
                default:
                    throw Error(b(462))
                }
            }
            fm();
            break
        } catch (h) {
            Ey(l, h)
        }
    while (!0);
    return ht = ra = null,
    M.H = u,
    M.A = e,
    G = a,
    B !== null ? 0 : (K = null,
    Y = 0,
    _n(),
    ll)
}
function fm() {
    for (; B !== null && !Nd(); )
        Oy(B)
}
function Oy(l) {
    var t = P1(l.alternate, l, Tt);
    l.memoizedProps = l.pendingProps,
    t === null ? Cn(l) : B = t
}
function p0(l) {
    var t = l
      , a = t.alternate;
    switch (t.tag) {
    case 15:
    case 0:
        t = S0(a, t, t.pendingProps, t.type, void 0, Y);
        break;
    case 11:
        t = S0(a, t, t.pendingProps, t.type.render, t.ref, Y);
        break;
    case 5:
        ki(t);
    default:
        ly(a, t),
        t = B = l1(t, Tt),
        t = P1(a, t, Tt)
    }
    l.memoizedProps = l.pendingProps,
    t === null ? Cn(l) : B = t
}
function Ba(l, t, a, u) {
    ht = ra = null,
    ki(t),
    Qa = null,
    Zu = 0;
    var e = t.return;
    try {
        if (Fo(l, e, t, a, Y)) {
            ll = 1,
            an(l, Kl(a, l.current)),
            B = null;
            return
        }
    } catch (n) {
        if (e !== null)
            throw B = e,
            n;
        ll = 1,
        an(l, Kl(a, l.current)),
        B = null;
        return
    }
    t.flags & 32768 ? (q || u === 1 ? l = !0 : cu || Y & 536870912 ? l = !1 : (Ct = l = !0,
    (u === 2 || u === 9 || u === 3 || u === 6) && (u = Gl.current,
    u !== null && u.tag === 13 && (u.flags |= 16384))),
    My(t, l)) : Cn(t)
}
function Cn(l) {
    var t = l;
    do {
        if (t.flags & 32768) {
            My(t, Ct);
            return
        }
        l = t.return;
        var a = Po(t.alternate, t, Tt);
        if (a !== null) {
            B = a;
            return
        }
        if (t = t.sibling,
        t !== null) {
            B = t;
            return
        }
        B = t = l
    } while (t !== null);
    ll === 0 && (ll = 5)
}
function My(l, t) {
    do {
        var a = lm(l.alternate, l);
        if (a !== null) {
            a.flags &= 32767,
            B = a;
            return
        }
        if (a = l.return,
        a !== null && (a.flags |= 32768,
        a.subtreeFlags = 0,
        a.deletions = null),
        !t && (l = l.sibling,
        l !== null)) {
            B = l;
            return
        }
        B = l = a
    } while (l !== null);
    ll = 6,
    B = null
}
function _0(l, t, a, u, e, n, c, i, f) {
    l.cancelPendingCommit = null;
    do
        jn();
    while (fl !== 0);
    if (G & 6)
        throw Error(b(327));
    if (t !== null) {
        if (t === l.current)
            throw Error(b(177));
        if (n = t.lanes | t.childLanes,
        n |= Yi,
        Xd(l, a, n, c, i, f),
        l === K && (B = K = null,
        Y = 0),
        ka = t,
        Zt = l,
        bt = a,
        ci = n,
        ii = e,
        ry = u,
        t.subtreeFlags & 10256 || t.flags & 10256 ? (l.callbackNode = null,
        l.callbackPriority = 0,
        om(Ke, function() {
            return Hy(),
            null
        })) : (l.callbackNode = null,
        l.callbackPriority = 0),
        u = (t.flags & 13878) !== 0,
        t.subtreeFlags & 13878 || u) {
            u = M.T,
            M.T = null,
            e = X.p,
            X.p = 2,
            c = G,
            G |= 4;
            try {
                tm(l, t, a)
            } finally {
                G = c,
                X.p = e,
                M.T = u
            }
        }
        fl = 1,
        Dy(),
        Uy(),
        Ny()
    }
}
function Dy() {
    if (fl === 1) {
        fl = 0;
        var l = Zt
          , t = ka
          , a = (t.flags & 13878) !== 0;
        if (t.subtreeFlags & 13878 || a) {
            a = M.T,
            M.T = null;
            var u = X.p;
            X.p = 2;
            var e = G;
            G |= 4;
            try {
                dy(t, l);
                var n = oi
                  , c = Js(l.containerInfo)
                  , i = n.focusedElem
                  , f = n.selectionRange;
                if (c !== i && i && i.ownerDocument && Ks(i.ownerDocument.documentElement, i)) {
                    if (f !== null && Bi(i)) {
                        var d = f.start
                          , h = f.end;
                        if (h === void 0 && (h = d),
                        "selectionStart"in i)
                            i.selectionStart = d,
                            i.selectionEnd = Math.min(h, i.value.length);
                        else {
                            var g = i.ownerDocument || document
                              , o = g && g.defaultView || window;
                            if (o.getSelection) {
                                var v = o.getSelection()
                                  , r = i.textContent.length
                                  , E = Math.min(f.start, r)
                                  , H = f.end === void 0 ? E : Math.min(f.end, r);
                                !v.extend && E > H && (c = H,
                                H = E,
                                E = c);
                                var y = wf(i, E)
                                  , s = wf(i, H);
                                if (y && s && (v.rangeCount !== 1 || v.anchorNode !== y.node || v.anchorOffset !== y.offset || v.focusNode !== s.node || v.focusOffset !== s.offset)) {
                                    var m = g.createRange();
                                    m.setStart(y.node, y.offset),
                                    v.removeAllRanges(),
                                    E > H ? (v.addRange(m),
                                    v.extend(s.node, s.offset)) : (m.setEnd(s.node, s.offset),
                                    v.addRange(m))
                                }
                            }
                        }
                    }
                    for (g = [],
                    v = i; v = v.parentNode; )
                        v.nodeType === 1 && g.push({
                            element: v,
                            left: v.scrollLeft,
                            top: v.scrollTop
                        });
                    for (typeof i.focus == "function" && i.focus(),
                    i = 0; i < g.length; i++) {
                        var S = g[i];
                        S.element.scrollLeft = S.left,
                        S.element.scrollTop = S.top
                    }
                }
                gn = !!di,
                oi = di = null
            } finally {
                G = e,
                X.p = u,
                M.T = a
            }
        }
        l.current = t,
        fl = 2
    }
}
function Uy() {
    if (fl === 2) {
        fl = 0;
        var l = Zt
          , t = ka
          , a = (t.flags & 8772) !== 0;
        if (t.subtreeFlags & 8772 || a) {
            a = M.T,
            M.T = null;
            var u = X.p;
            X.p = 2;
            var e = G;
            G |= 4;
            try {
                cy(l, t.alternate, t)
            } finally {
                G = e,
                X.p = u,
                M.T = a
            }
        }
        fl = 3
    }
}
function Ny() {
    if (fl === 4 || fl === 3) {
        fl = 0,
        xd();
        var l = Zt
          , t = ka
          , a = bt
          , u = ry;
        t.subtreeFlags & 10256 || t.flags & 10256 ? fl = 5 : (fl = 0,
        ka = Zt = null,
        xy(l, l.pendingLanes));
        var e = l.pendingLanes;
        if (e === 0 && (Qt = null),
        Ui(a),
        t = t.stateNode,
        jl && typeof jl.onCommitFiberRoot == "function")
            try {
                jl.onCommitFiberRoot(ku, t, void 0, (t.current.flags & 128) === 128)
            } catch {}
        if (u !== null) {
            t = M.T,
            e = X.p,
            X.p = 2,
            M.T = null;
            try {
                for (var n = l.onRecoverableError, c = 0; c < u.length; c++) {
                    var i = u[c];
                    n(i.value, {
                        componentStack: i.stack
                    })
                }
            } finally {
                M.T = t,
                X.p = e
            }
        }
        bt & 3 && jn(),
        nt(l),
        e = l.pendingLanes,
        a & 261930 && e & 42 ? l === fi ? Cu++ : (Cu = 0,
        fi = l) : Cu = 0,
        ne(0)
    }
}
function xy(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache,
    t != null && (l.pooledCache = null,
    ae(t)))
}
function jn() {
    return Dy(),
    Uy(),
    Ny(),
    Hy()
}
function Hy() {
    if (fl !== 5)
        return !1;
    var l = Zt
      , t = ci;
    ci = 0;
    var a = Ui(bt)
      , u = M.T
      , e = X.p;
    try {
        X.p = 32 > a ? 32 : a,
        M.T = null,
        a = ii,
        ii = null;
        var n = Zt
          , c = bt;
        if (fl = 0,
        ka = Zt = null,
        bt = 0,
        G & 6)
            throw Error(b(331));
        var i = G;
        if (G |= 4,
        gy(n.current),
        my(n, n.current, c, a),
        G = i,
        ne(0, !1),
        jl && typeof jl.onPostCommitFiberRoot == "function")
            try {
                jl.onPostCommitFiberRoot(ku, n)
            } catch {}
        return !0
    } finally {
        X.p = e,
        M.T = u,
        xy(l, t)
    }
}
function O0(l, t, a) {
    t = Kl(a, t),
    t = ti(l.stateNode, t, 2),
    l = Xt(l, t, 2),
    l !== null && (Pu(l, 2),
    nt(l))
}
function Z(l, t, a) {
    if (l.tag === 3)
        O0(l, l, a);
    else
        for (; t !== null; ) {
            if (t.tag === 3) {
                O0(t, l, a);
                break
            } else if (t.tag === 1) {
                var u = t.stateNode;
                if (typeof t.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Qt === null || !Qt.has(u))) {
                    l = Kl(a, l),
                    a = w1(2),
                    u = Xt(t, a, 2),
                    u !== null && ($1(a, u, t, l),
                    Pu(u, 2),
                    nt(u));
                    break
                }
            }
            t = t.return
        }
}
function hc(l, t, a) {
    var u = l.pingCache;
    if (u === null) {
        u = l.pingCache = new em;
        var e = new Set;
        u.set(t, e)
    } else
        e = u.get(t),
        e === void 0 && (e = new Set,
        u.set(t, e));
    e.has(a) || (df = !0,
    e.add(a),
    l = sm.bind(null, l, t, a),
    t.then(l, l))
}
function sm(l, t, a) {
    var u = l.pingCache;
    u !== null && u.delete(t),
    l.pingedLanes |= l.suspendedLanes & a,
    l.warmLanes &= ~a,
    K === l && (Y & a) === a && (ll === 4 || ll === 3 && (Y & 62914560) === Y && 300 > Cl() - Hn ? !(G & 2) && Ia(l, 0) : of |= a,
    Fa === Y && (Fa = 0)),
    nt(l)
}
function Ry(l, t) {
    t === 0 && (t = ps()),
    l = ba(l, t),
    l !== null && (Pu(l, t),
    nt(l))
}
function ym(l) {
    var t = l.memoizedState
      , a = 0;
    t !== null && (a = t.retryLane),
    Ry(l, a)
}
function dm(l, t) {
    var a = 0;
    switch (l.tag) {
    case 31:
    case 13:
        var u = l.stateNode
          , e = l.memoizedState;
        e !== null && (a = e.retryLane);
        break;
    case 19:
        u = l.stateNode;
        break;
    case 22:
        u = l.stateNode._retryCache;
        break;
    default:
        throw Error(b(314))
    }
    u !== null && u.delete(t),
    Ry(l, a)
}
function om(l, t) {
    return Mi(l, t)
}
var sn = null
  , pa = null
  , si = !1
  , yn = !1
  , gc = !1
  , Bt = 0;
function nt(l) {
    l !== pa && l.next === null && (pa === null ? sn = pa = l : pa = pa.next = l),
    yn = !0,
    si || (si = !0,
    vm())
}
function ne(l, t) {
    if (!gc && yn) {
        gc = !0;
        do
            for (var a = !1, u = sn; u !== null; ) {
                if (l !== 0) {
                    var e = u.pendingLanes;
                    if (e === 0)
                        var n = 0;
                    else {
                        var c = u.suspendedLanes
                          , i = u.pingedLanes;
                        n = (1 << 31 - Bl(42 | l) + 1) - 1,
                        n &= e & ~(c & ~i),
                        n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0
                    }
                    n !== 0 && (a = !0,
                    M0(u, n))
                } else
                    n = Y,
                    n = An(u, u === K ? n : 0, u.cancelPendingCommit !== null || u.timeoutHandle !== -1),
                    !(n & 3) || Iu(u, n) || (a = !0,
                    M0(u, n));
                u = u.next
            }
        while (a);
        gc = !1
    }
}
function mm() {
    Cy()
}
function Cy() {
    yn = si = !1;
    var l = 0;
    Bt !== 0 && pm() && (l = Bt);
    for (var t = Cl(), a = null, u = sn; u !== null; ) {
        var e = u.next
          , n = jy(u, t);
        n === 0 ? (u.next = null,
        a === null ? sn = e : a.next = e,
        e === null && (pa = a)) : (a = u,
        (l !== 0 || n & 3) && (yn = !0)),
        u = e
    }
    fl !== 0 && fl !== 5 || ne(l),
    Bt !== 0 && (Bt = 0)
}
function jy(l, t) {
    for (var a = l.suspendedLanes, u = l.pingedLanes, e = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
        var c = 31 - Bl(n)
          , i = 1 << c
          , f = e[c];
        f === -1 ? (!(i & a) || i & u) && (e[c] = Gd(i, t)) : f <= t && (l.expiredLanes |= i),
        n &= ~i
    }
    if (t = K,
    a = Y,
    a = An(l, l === t ? a : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1),
    u = l.callbackNode,
    a === 0 || l === t && (Q === 2 || Q === 9) || l.cancelPendingCommit !== null)
        return u !== null && u !== null && Ln(u),
        l.callbackNode = null,
        l.callbackPriority = 0;
    if (!(a & 3) || Iu(l, a)) {
        if (t = a & -a,
        t === l.callbackPriority)
            return t;
        switch (u !== null && Ln(u),
        Ui(a)) {
        case 2:
        case 8:
            a = Es;
            break;
        case 32:
            a = Ke;
            break;
        case 268435456:
            a = Ts;
            break;
        default:
            a = Ke
        }
        return u = By.bind(null, l),
        a = Mi(a, u),
        l.callbackPriority = t,
        l.callbackNode = a,
        t
    }
    return u !== null && u !== null && Ln(u),
    l.callbackPriority = 2,
    l.callbackNode = null,
    2
}
function By(l, t) {
    if (fl !== 0 && fl !== 5)
        return l.callbackNode = null,
        l.callbackPriority = 0,
        null;
    var a = l.callbackNode;
    if (jn() && l.callbackNode !== a)
        return null;
    var u = Y;
    return u = An(l, l === K ? u : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1),
    u === 0 ? null : (Ay(l, u, t),
    jy(l, Cl()),
    l.callbackNode != null && l.callbackNode === a ? By.bind(null, l) : null)
}
function M0(l, t) {
    if (jn())
        return null;
    Ay(l, t, !0)
}
function vm() {
    Om(function() {
        G & 6 ? Mi(As, mm) : Cy()
    })
}
function vf() {
    if (Bt === 0) {
        var l = wa;
        l === 0 && (l = me,
        me <<= 1,
        !(me & 261888) && (me = 256)),
        Bt = l
    }
    return Bt
}
function D0(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : De("" + l)
}
function U0(l, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name,
    a.value = t.value,
    l.id && a.setAttribute("form", l.id),
    t.parentNode.insertBefore(a, t),
    l = new FormData(l),
    a.parentNode.removeChild(a),
    l
}
function hm(l, t, a, u, e) {
    if (t === "submit" && a && a.stateNode === e) {
        var n = D0((e[Dl] || null).action)
          , c = u.submitter;
        c && (t = (t = c[Dl] || null) ? D0(t.formAction) : c.getAttribute("formAction"),
        t !== null && (n = t,
        c = null));
        var i = new En("action","action",null,u,e);
        l.push({
            event: i,
            listeners: [{
                instance: null,
                listener: function() {
                    if (u.defaultPrevented) {
                        if (Bt !== 0) {
                            var f = c ? U0(e, c) : new FormData(e);
                            Pc(a, {
                                pending: !0,
                                data: f,
                                method: e.method,
                                action: n
                            }, null, f)
                        }
                    } else
                        typeof n == "function" && (i.preventDefault(),
                        f = c ? U0(e, c) : new FormData(e),
                        Pc(a, {
                            pending: !0,
                            data: f,
                            method: e.method,
                            action: n
                        }, n, f))
                },
                currentTarget: e
            }]
        })
    }
}
for (var Sc = 0; Sc < Qc.length; Sc++) {
    var bc = Qc[Sc]
      , gm = bc.toLowerCase()
      , Sm = bc[0].toUpperCase() + bc.slice(1);
    Pl(gm, "on" + Sm)
}
Pl($s, "onAnimationEnd");
Pl(Ws, "onAnimationIteration");
Pl(Fs, "onAnimationStart");
Pl("dblclick", "onDoubleClick");
Pl("focusin", "onFocus");
Pl("focusout", "onBlur");
Pl(Ro, "onTransitionRun");
Pl(Co, "onTransitionStart");
Pl(jo, "onTransitionCancel");
Pl(ks, "onTransitionEnd");
Ka("onMouseEnter", ["mouseout", "mouseover"]);
Ka("onMouseLeave", ["mouseout", "mouseover"]);
Ka("onPointerEnter", ["pointerout", "pointerover"]);
Ka("onPointerLeave", ["pointerout", "pointerover"]);
ha("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
ha("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
ha("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
ha("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
ha("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
ha("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Ku = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ")
  , bm = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ku));
function Yy(l, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < l.length; a++) {
        var u = l[a]
          , e = u.event;
        u = u.listeners;
        l: {
            var n = void 0;
            if (t)
                for (var c = u.length - 1; 0 <= c; c--) {
                    var i = u[c]
                      , f = i.instance
                      , d = i.currentTarget;
                    if (i = i.listener,
                    f !== n && e.isPropagationStopped())
                        break l;
                    n = i,
                    e.currentTarget = d;
                    try {
                        n(e)
                    } catch (h) {
                        we(h)
                    }
                    e.currentTarget = null,
                    n = f
                }
            else
                for (c = 0; c < u.length; c++) {
                    if (i = u[c],
                    f = i.instance,
                    d = i.currentTarget,
                    i = i.listener,
                    f !== n && e.isPropagationStopped())
                        break l;
                    n = i,
                    e.currentTarget = d;
                    try {
                        n(e)
                    } catch (h) {
                        we(h)
                    }
                    e.currentTarget = null,
                    n = f
                }
        }
    }
}
function j(l, t) {
    var a = t[Rc];
    a === void 0 && (a = t[Rc] = new Set);
    var u = l + "__bubble";
    a.has(u) || (qy(t, l, 2, !1),
    a.add(u))
}
function rc(l, t, a) {
    var u = 0;
    t && (u |= 4),
    qy(a, l, u, t)
}
var Te = "_reactListening" + Math.random().toString(36).slice(2);
function hf(l) {
    if (!l[Te]) {
        l[Te] = !0,
        Us.forEach(function(a) {
            a !== "selectionchange" && (bm.has(a) || rc(a, !1, l),
            rc(a, !0, l))
        });
        var t = l.nodeType === 9 ? l : l.ownerDocument;
        t === null || t[Te] || (t[Te] = !0,
        rc("selectionchange", !1, t))
    }
}
function qy(l, t, a, u) {
    switch (ky(t)) {
    case 2:
        var e = Jm;
        break;
    case 8:
        e = wm;
        break;
    default:
        e = rf
    }
    a = e.bind(null, t, a, l),
    e = void 0,
    !qc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (e = !0),
    u ? e !== void 0 ? l.addEventListener(t, a, {
        capture: !0,
        passive: e
    }) : l.addEventListener(t, a, !0) : e !== void 0 ? l.addEventListener(t, a, {
        passive: e
    }) : l.addEventListener(t, a, !1)
}
function zc(l, t, a, u, e) {
    var n = u;
    if (!(t & 1) && !(t & 2) && u !== null)
        l: for (; ; ) {
            if (u === null)
                return;
            var c = u.tag;
            if (c === 3 || c === 4) {
                var i = u.stateNode.containerInfo;
                if (i === e)
                    break;
                if (c === 4)
                    for (c = u.return; c !== null; ) {
                        var f = c.tag;
                        if ((f === 3 || f === 4) && c.stateNode.containerInfo === e)
                            return;
                        c = c.return
                    }
                for (; i !== null; ) {
                    if (c = Ma(i),
                    c === null)
                        return;
                    if (f = c.tag,
                    f === 5 || f === 6 || f === 26 || f === 27) {
                        u = n = c;
                        continue l
                    }
                    i = i.parentNode
                }
            }
            u = u.return
        }
    Ys(function() {
        var d = n
          , h = Hi(a)
          , g = [];
        l: {
            var o = Is.get(l);
            if (o !== void 0) {
                var v = En
                  , r = l;
                switch (l) {
                case "keypress":
                    if (Ne(a) === 0)
                        break l;
                case "keydown":
                case "keyup":
                    v = yo;
                    break;
                case "focusin":
                    r = "focus",
                    v = Wn;
                    break;
                case "focusout":
                    r = "blur",
                    v = Wn;
                    break;
                case "beforeblur":
                case "afterblur":
                    v = Wn;
                    break;
                case "click":
                    if (a.button === 2)
                        break l;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                    v = Yf;
                    break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                    v = Id;
                    break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                    v = vo;
                    break;
                case $s:
                case Ws:
                case Fs:
                    v = to;
                    break;
                case ks:
                    v = go;
                    break;
                case "scroll":
                case "scrollend":
                    v = Fd;
                    break;
                case "wheel":
                    v = bo;
                    break;
                case "copy":
                case "cut":
                case "paste":
                    v = uo;
                    break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                    v = Gf;
                    break;
                case "toggle":
                case "beforetoggle":
                    v = zo
                }
                var E = (t & 4) !== 0
                  , H = !E && (l === "scroll" || l === "scrollend")
                  , y = E ? o !== null ? o + "Capture" : null : o;
                E = [];
                for (var s = d, m; s !== null; ) {
                    var S = s;
                    if (m = S.stateNode,
                    S = S.tag,
                    S !== 5 && S !== 26 && S !== 27 || m === null || y === null || (S = Yu(s, y),
                    S != null && E.push(Ju(s, S, m))),
                    H)
                        break;
                    s = s.return
                }
                0 < E.length && (o = new v(o,r,null,a,h),
                g.push({
                    event: o,
                    listeners: E
                }))
            }
        }
        if (!(t & 7)) {
            l: {
                if (o = l === "mouseover" || l === "pointerover",
                v = l === "mouseout" || l === "pointerout",
                o && a !== Yc && (r = a.relatedTarget || a.fromElement) && (Ma(r) || r[au]))
                    break l;
                if ((v || o) && (o = h.window === h ? h : (o = h.ownerDocument) ? o.defaultView || o.parentWindow : window,
                v ? (r = a.relatedTarget || a.toElement,
                v = d,
                r = r ? Ma(r) : null,
                r !== null && (H = Fu(r),
                E = r.tag,
                r !== H || E !== 5 && E !== 27 && E !== 6) && (r = null)) : (v = null,
                r = d),
                v !== r)) {
                    if (E = Yf,
                    S = "onMouseLeave",
                    y = "onMouseEnter",
                    s = "mouse",
                    (l === "pointerout" || l === "pointerover") && (E = Gf,
                    S = "onPointerLeave",
                    y = "onPointerEnter",
                    s = "pointer"),
                    H = v == null ? o : ru(v),
                    m = r == null ? o : ru(r),
                    o = new E(S,s + "leave",v,a,h),
                    o.target = H,
                    o.relatedTarget = m,
                    S = null,
                    Ma(h) === d && (E = new E(y,s + "enter",r,a,h),
                    E.target = m,
                    E.relatedTarget = H,
                    S = E),
                    H = S,
                    v && r)
                        t: {
                            for (E = rm,
                            y = v,
                            s = r,
                            m = 0,
                            S = y; S; S = E(S))
                                m++;
                            S = 0;
                            for (var T = s; T; T = E(T))
                                S++;
                            for (; 0 < m - S; )
                                y = E(y),
                                m--;
                            for (; 0 < S - m; )
                                s = E(s),
                                S--;
                            for (; m--; ) {
                                if (y === s || s !== null && y === s.alternate) {
                                    E = y;
                                    break t
                                }
                                y = E(y),
                                s = E(s)
                            }
                            E = null
                        }
                    else
                        E = null;
                    v !== null && N0(g, o, v, E, !1),
                    r !== null && H !== null && N0(g, H, r, E, !0)
                }
            }
            l: {
                if (o = d ? ru(d) : window,
                v = o.nodeName && o.nodeName.toLowerCase(),
                v === "select" || v === "input" && o.type === "file")
                    var O = Vf;
                else if (Zf(o))
                    if (Vs)
                        O = No;
                    else {
                        O = Do;
                        var A = Mo
                    }
                else
                    v = o.nodeName,
                    !v || v.toLowerCase() !== "input" || o.type !== "checkbox" && o.type !== "radio" ? d && xi(d.elementType) && (O = Vf) : O = Uo;
                if (O && (O = O(l, d))) {
                    Zs(g, O, a, h);
                    break l
                }
                A && A(l, o, d),
                l === "focusout" && d && o.type === "number" && d.memoizedProps.value != null && Bc(o, "number", o.value)
            }
            switch (A = d ? ru(d) : window,
            l) {
            case "focusin":
                (Zf(A) || A.contentEditable === "true") && (Na = A,
                Gc = d,
                _u = null);
                break;
            case "focusout":
                _u = Gc = Na = null;
                break;
            case "mousedown":
                Xc = !0;
                break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
                Xc = !1,
                $f(g, a, h);
                break;
            case "selectionchange":
                if (Ho)
                    break;
            case "keydown":
            case "keyup":
                $f(g, a, h)
            }
            var _;
            if (ji)
                l: {
                    switch (l) {
                    case "compositionstart":
                        var D = "onCompositionStart";
                        break l;
                    case "compositionend":
                        D = "onCompositionEnd";
                        break l;
                    case "compositionupdate":
                        D = "onCompositionUpdate";
                        break l
                    }
                    D = void 0
                }
            else
                Ua ? Xs(l, a) && (D = "onCompositionEnd") : l === "keydown" && a.keyCode === 229 && (D = "onCompositionStart");
            D && (Gs && a.locale !== "ko" && (Ua || D !== "onCompositionStart" ? D === "onCompositionEnd" && Ua && (_ = qs()) : (Rt = h,
            Ri = "value"in Rt ? Rt.value : Rt.textContent,
            Ua = !0)),
            A = dn(d, D),
            0 < A.length && (D = new qf(D,l,null,a,h),
            g.push({
                event: D,
                listeners: A
            }),
            _ ? D.data = _ : (_ = Qs(a),
            _ !== null && (D.data = _)))),
            (_ = Eo ? To(l, a) : po(l, a)) && (D = dn(d, "onBeforeInput"),
            0 < D.length && (A = new qf("onBeforeInput","beforeinput",null,a,h),
            g.push({
                event: A,
                listeners: D
            }),
            A.data = _)),
            hm(g, l, d, a, h)
        }
        Yy(g, t)
    })
}
function Ju(l, t, a) {
    return {
        instance: l,
        listener: t,
        currentTarget: a
    }
}
function dn(l, t) {
    for (var a = t + "Capture", u = []; l !== null; ) {
        var e = l
          , n = e.stateNode;
        if (e = e.tag,
        e !== 5 && e !== 26 && e !== 27 || n === null || (e = Yu(l, a),
        e != null && u.unshift(Ju(l, e, n)),
        e = Yu(l, t),
        e != null && u.push(Ju(l, e, n))),
        l.tag === 3)
            return u;
        l = l.return
    }
    return []
}
function rm(l) {
    if (l === null)
        return null;
    do
        l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null
}
function N0(l, t, a, u, e) {
    for (var n = t._reactName, c = []; a !== null && a !== u; ) {
        var i = a
          , f = i.alternate
          , d = i.stateNode;
        if (i = i.tag,
        f !== null && f === u)
            break;
        i !== 5 && i !== 26 && i !== 27 || d === null || (f = d,
        e ? (d = Yu(a, n),
        d != null && c.unshift(Ju(a, d, f))) : e || (d = Yu(a, n),
        d != null && c.push(Ju(a, d, f)))),
        a = a.return
    }
    c.length !== 0 && l.push({
        event: t,
        listeners: c
    })
}
var zm = /\r\n?/g
  , Am = /\u0000|\uFFFD/g;
function x0(l) {
    return (typeof l == "string" ? l : "" + l).replace(zm, `
`).replace(Am, "")
}
function Gy(l, t) {
    return t = x0(t),
    x0(l) === t
}
function V(l, t, a, u, e, n) {
    switch (a) {
    case "children":
        typeof u == "string" ? t === "body" || t === "textarea" && u === "" || Ja(l, u) : (typeof u == "number" || typeof u == "bigint") && t !== "body" && Ja(l, "" + u);
        break;
    case "className":
        ge(l, "class", u);
        break;
    case "tabIndex":
        ge(l, "tabindex", u);
        break;
    case "dir":
    case "role":
    case "viewBox":
    case "width":
    case "height":
        ge(l, a, u);
        break;
    case "style":
        Bs(l, u, n);
        break;
    case "data":
        if (t !== "object") {
            ge(l, "data", u);
            break
        }
    case "src":
    case "href":
        if (u === "" && (t !== "a" || a !== "href")) {
            l.removeAttribute(a);
            break
        }
        if (u == null || typeof u == "function" || typeof u == "symbol" || typeof u == "boolean") {
            l.removeAttribute(a);
            break
        }
        u = De("" + u),
        l.setAttribute(a, u);
        break;
    case "action":
    case "formAction":
        if (typeof u == "function") {
            l.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break
        } else
            typeof n == "function" && (a === "formAction" ? (t !== "input" && V(l, t, "name", e.name, e, null),
            V(l, t, "formEncType", e.formEncType, e, null),
            V(l, t, "formMethod", e.formMethod, e, null),
            V(l, t, "formTarget", e.formTarget, e, null)) : (V(l, t, "encType", e.encType, e, null),
            V(l, t, "method", e.method, e, null),
            V(l, t, "target", e.target, e, null)));
        if (u == null || typeof u == "symbol" || typeof u == "boolean") {
            l.removeAttribute(a);
            break
        }
        u = De("" + u),
        l.setAttribute(a, u);
        break;
    case "onClick":
        u != null && (l.onclick = vt);
        break;
    case "onScroll":
        u != null && j("scroll", l);
        break;
    case "onScrollEnd":
        u != null && j("scrollend", l);
        break;
    case "dangerouslySetInnerHTML":
        if (u != null) {
            if (typeof u != "object" || !("__html"in u))
                throw Error(b(61));
            if (a = u.__html,
            a != null) {
                if (e.children != null)
                    throw Error(b(60));
                l.innerHTML = a
            }
        }
        break;
    case "multiple":
        l.multiple = u && typeof u != "function" && typeof u != "symbol";
        break;
    case "muted":
        l.muted = u && typeof u != "function" && typeof u != "symbol";
        break;
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "defaultValue":
    case "defaultChecked":
    case "innerHTML":
    case "ref":
        break;
    case "autoFocus":
        break;
    case "xlinkHref":
        if (u == null || typeof u == "function" || typeof u == "boolean" || typeof u == "symbol") {
            l.removeAttribute("xlink:href");
            break
        }
        a = De("" + u),
        l.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
        break;
    case "contentEditable":
    case "spellCheck":
    case "draggable":
    case "value":
    case "autoReverse":
    case "externalResourcesRequired":
    case "focusable":
    case "preserveAlpha":
        u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, "" + u) : l.removeAttribute(a);
        break;
    case "inert":
    case "allowFullScreen":
    case "async":
    case "autoPlay":
    case "controls":
    case "default":
    case "defer":
    case "disabled":
    case "disablePictureInPicture":
    case "disableRemotePlayback":
    case "formNoValidate":
    case "hidden":
    case "loop":
    case "noModule":
    case "noValidate":
    case "open":
    case "playsInline":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "itemScope":
        u && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, "") : l.removeAttribute(a);
        break;
    case "capture":
    case "download":
        u === !0 ? l.setAttribute(a, "") : u !== !1 && u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, u) : l.removeAttribute(a);
        break;
    case "cols":
    case "rows":
    case "size":
    case "span":
        u != null && typeof u != "function" && typeof u != "symbol" && !isNaN(u) && 1 <= u ? l.setAttribute(a, u) : l.removeAttribute(a);
        break;
    case "rowSpan":
    case "start":
        u == null || typeof u == "function" || typeof u == "symbol" || isNaN(u) ? l.removeAttribute(a) : l.setAttribute(a, u);
        break;
    case "popover":
        j("beforetoggle", l),
        j("toggle", l),
        Me(l, "popover", u);
        break;
    case "xlinkActuate":
        ct(l, "http://www.w3.org/1999/xlink", "xlink:actuate", u);
        break;
    case "xlinkArcrole":
        ct(l, "http://www.w3.org/1999/xlink", "xlink:arcrole", u);
        break;
    case "xlinkRole":
        ct(l, "http://www.w3.org/1999/xlink", "xlink:role", u);
        break;
    case "xlinkShow":
        ct(l, "http://www.w3.org/1999/xlink", "xlink:show", u);
        break;
    case "xlinkTitle":
        ct(l, "http://www.w3.org/1999/xlink", "xlink:title", u);
        break;
    case "xlinkType":
        ct(l, "http://www.w3.org/1999/xlink", "xlink:type", u);
        break;
    case "xmlBase":
        ct(l, "http://www.w3.org/XML/1998/namespace", "xml:base", u);
        break;
    case "xmlLang":
        ct(l, "http://www.w3.org/XML/1998/namespace", "xml:lang", u);
        break;
    case "xmlSpace":
        ct(l, "http://www.w3.org/XML/1998/namespace", "xml:space", u);
        break;
    case "is":
        Me(l, "is", u);
        break;
    case "innerText":
    case "textContent":
        break;
    default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = $d.get(a) || a,
        Me(l, a, u))
    }
}
function yi(l, t, a, u, e, n) {
    switch (a) {
    case "style":
        Bs(l, u, n);
        break;
    case "dangerouslySetInnerHTML":
        if (u != null) {
            if (typeof u != "object" || !("__html"in u))
                throw Error(b(61));
            if (a = u.__html,
            a != null) {
                if (e.children != null)
                    throw Error(b(60));
                l.innerHTML = a
            }
        }
        break;
    case "children":
        typeof u == "string" ? Ja(l, u) : (typeof u == "number" || typeof u == "bigint") && Ja(l, "" + u);
        break;
    case "onScroll":
        u != null && j("scroll", l);
        break;
    case "onScrollEnd":
        u != null && j("scrollend", l);
        break;
    case "onClick":
        u != null && (l.onclick = vt);
        break;
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "innerHTML":
    case "ref":
        break;
    case "innerText":
    case "textContent":
        break;
    default:
        if (!Ns.hasOwnProperty(a))
            l: {
                if (a[0] === "o" && a[1] === "n" && (e = a.endsWith("Capture"),
                t = a.slice(2, e ? a.length - 7 : void 0),
                n = l[Dl] || null,
                n = n != null ? n[a] : null,
                typeof n == "function" && l.removeEventListener(t, n, e),
                typeof u == "function")) {
                    typeof n != "function" && n !== null && (a in l ? l[a] = null : l.hasAttribute(a) && l.removeAttribute(a)),
                    l.addEventListener(t, u, e);
                    break l
                }
                a in l ? l[a] = u : u === !0 ? l.setAttribute(a, "") : Me(l, a, u)
            }
    }
}
function bl(l, t, a) {
    switch (t) {
    case "div":
    case "span":
    case "svg":
    case "path":
    case "a":
    case "g":
    case "p":
    case "li":
        break;
    case "img":
        j("error", l),
        j("load", l);
        var u = !1, e = !1, n;
        for (n in a)
            if (a.hasOwnProperty(n)) {
                var c = a[n];
                if (c != null)
                    switch (n) {
                    case "src":
                        u = !0;
                        break;
                    case "srcSet":
                        e = !0;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        throw Error(b(137, t));
                    default:
                        V(l, t, n, c, a, null)
                    }
            }
        e && V(l, t, "srcSet", a.srcSet, a, null),
        u && V(l, t, "src", a.src, a, null);
        return;
    case "input":
        j("invalid", l);
        var i = n = c = e = null
          , f = null
          , d = null;
        for (u in a)
            if (a.hasOwnProperty(u)) {
                var h = a[u];
                if (h != null)
                    switch (u) {
                    case "name":
                        e = h;
                        break;
                    case "type":
                        c = h;
                        break;
                    case "checked":
                        f = h;
                        break;
                    case "defaultChecked":
                        d = h;
                        break;
                    case "value":
                        n = h;
                        break;
                    case "defaultValue":
                        i = h;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (h != null)
                            throw Error(b(137, t));
                        break;
                    default:
                        V(l, t, u, h, a, null)
                    }
            }
        Rs(l, n, i, f, d, c, e, !1);
        return;
    case "select":
        j("invalid", l),
        u = c = n = null;
        for (e in a)
            if (a.hasOwnProperty(e) && (i = a[e],
            i != null))
                switch (e) {
                case "value":
                    n = i;
                    break;
                case "defaultValue":
                    c = i;
                    break;
                case "multiple":
                    u = i;
                default:
                    V(l, t, e, i, a, null)
                }
        t = n,
        a = c,
        l.multiple = !!u,
        t != null ? qa(l, !!u, t, !1) : a != null && qa(l, !!u, a, !0);
        return;
    case "textarea":
        j("invalid", l),
        n = e = u = null;
        for (c in a)
            if (a.hasOwnProperty(c) && (i = a[c],
            i != null))
                switch (c) {
                case "value":
                    u = i;
                    break;
                case "defaultValue":
                    e = i;
                    break;
                case "children":
                    n = i;
                    break;
                case "dangerouslySetInnerHTML":
                    if (i != null)
                        throw Error(b(91));
                    break;
                default:
                    V(l, t, c, i, a, null)
                }
        js(l, u, e, n);
        return;
    case "option":
        for (f in a)
            if (a.hasOwnProperty(f) && (u = a[f],
            u != null))
                switch (f) {
                case "selected":
                    l.selected = u && typeof u != "function" && typeof u != "symbol";
                    break;
                default:
                    V(l, t, f, u, a, null)
                }
        return;
    case "dialog":
        j("beforetoggle", l),
        j("toggle", l),
        j("cancel", l),
        j("close", l);
        break;
    case "iframe":
    case "object":
        j("load", l);
        break;
    case "video":
    case "audio":
        for (u = 0; u < Ku.length; u++)
            j(Ku[u], l);
        break;
    case "image":
        j("error", l),
        j("load", l);
        break;
    case "details":
        j("toggle", l);
        break;
    case "embed":
    case "source":
    case "link":
        j("error", l),
        j("load", l);
    case "area":
    case "base":
    case "br":
    case "col":
    case "hr":
    case "keygen":
    case "meta":
    case "param":
    case "track":
    case "wbr":
    case "menuitem":
        for (d in a)
            if (a.hasOwnProperty(d) && (u = a[d],
            u != null))
                switch (d) {
                case "children":
                case "dangerouslySetInnerHTML":
                    throw Error(b(137, t));
                default:
                    V(l, t, d, u, a, null)
                }
        return;
    default:
        if (xi(t)) {
            for (h in a)
                a.hasOwnProperty(h) && (u = a[h],
                u !== void 0 && yi(l, t, h, u, a, void 0));
            return
        }
    }
    for (i in a)
        a.hasOwnProperty(i) && (u = a[i],
        u != null && V(l, t, i, u, a, null))
}
function Em(l, t, a, u) {
    switch (t) {
    case "div":
    case "span":
    case "svg":
    case "path":
    case "a":
    case "g":
    case "p":
    case "li":
        break;
    case "input":
        var e = null
          , n = null
          , c = null
          , i = null
          , f = null
          , d = null
          , h = null;
        for (v in a) {
            var g = a[v];
            if (a.hasOwnProperty(v) && g != null)
                switch (v) {
                case "checked":
                    break;
                case "value":
                    break;
                case "defaultValue":
                    f = g;
                default:
                    u.hasOwnProperty(v) || V(l, t, v, null, u, g)
                }
        }
        for (var o in u) {
            var v = u[o];
            if (g = a[o],
            u.hasOwnProperty(o) && (v != null || g != null))
                switch (o) {
                case "type":
                    n = v;
                    break;
                case "name":
                    e = v;
                    break;
                case "checked":
                    d = v;
                    break;
                case "defaultChecked":
                    h = v;
                    break;
                case "value":
                    c = v;
                    break;
                case "defaultValue":
                    i = v;
                    break;
                case "children":
                case "dangerouslySetInnerHTML":
                    if (v != null)
                        throw Error(b(137, t));
                    break;
                default:
                    v !== g && V(l, t, o, v, u, g)
                }
        }
        jc(l, c, i, f, d, h, n, e);
        return;
    case "select":
        v = c = i = o = null;
        for (n in a)
            if (f = a[n],
            a.hasOwnProperty(n) && f != null)
                switch (n) {
                case "value":
                    break;
                case "multiple":
                    v = f;
                default:
                    u.hasOwnProperty(n) || V(l, t, n, null, u, f)
                }
        for (e in u)
            if (n = u[e],
            f = a[e],
            u.hasOwnProperty(e) && (n != null || f != null))
                switch (e) {
                case "value":
                    o = n;
                    break;
                case "defaultValue":
                    i = n;
                    break;
                case "multiple":
                    c = n;
                default:
                    n !== f && V(l, t, e, n, u, f)
                }
        t = i,
        a = c,
        u = v,
        o != null ? qa(l, !!a, o, !1) : !!u != !!a && (t != null ? qa(l, !!a, t, !0) : qa(l, !!a, a ? [] : "", !1));
        return;
    case "textarea":
        v = o = null;
        for (i in a)
            if (e = a[i],
            a.hasOwnProperty(i) && e != null && !u.hasOwnProperty(i))
                switch (i) {
                case "value":
                    break;
                case "children":
                    break;
                default:
                    V(l, t, i, null, u, e)
                }
        for (c in u)
            if (e = u[c],
            n = a[c],
            u.hasOwnProperty(c) && (e != null || n != null))
                switch (c) {
                case "value":
                    o = e;
                    break;
                case "defaultValue":
                    v = e;
                    break;
                case "children":
                    break;
                case "dangerouslySetInnerHTML":
                    if (e != null)
                        throw Error(b(91));
                    break;
                default:
                    e !== n && V(l, t, c, e, u, n)
                }
        Cs(l, o, v);
        return;
    case "option":
        for (var r in a)
            if (o = a[r],
            a.hasOwnProperty(r) && o != null && !u.hasOwnProperty(r))
                switch (r) {
                case "selected":
                    l.selected = !1;
                    break;
                default:
                    V(l, t, r, null, u, o)
                }
        for (f in u)
            if (o = u[f],
            v = a[f],
            u.hasOwnProperty(f) && o !== v && (o != null || v != null))
                switch (f) {
                case "selected":
                    l.selected = o && typeof o != "function" && typeof o != "symbol";
                    break;
                default:
                    V(l, t, f, o, u, v)
                }
        return;
    case "img":
    case "link":
    case "area":
    case "base":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "keygen":
    case "meta":
    case "param":
    case "source":
    case "track":
    case "wbr":
    case "menuitem":
        for (var E in a)
            o = a[E],
            a.hasOwnProperty(E) && o != null && !u.hasOwnProperty(E) && V(l, t, E, null, u, o);
        for (d in u)
            if (o = u[d],
            v = a[d],
            u.hasOwnProperty(d) && o !== v && (o != null || v != null))
                switch (d) {
                case "children":
                case "dangerouslySetInnerHTML":
                    if (o != null)
                        throw Error(b(137, t));
                    break;
                default:
                    V(l, t, d, o, u, v)
                }
        return;
    default:
        if (xi(t)) {
            for (var H in a)
                o = a[H],
                a.hasOwnProperty(H) && o !== void 0 && !u.hasOwnProperty(H) && yi(l, t, H, void 0, u, o);
            for (h in u)
                o = u[h],
                v = a[h],
                !u.hasOwnProperty(h) || o === v || o === void 0 && v === void 0 || yi(l, t, h, o, u, v);
            return
        }
    }
    for (var y in a)
        o = a[y],
        a.hasOwnProperty(y) && o != null && !u.hasOwnProperty(y) && V(l, t, y, null, u, o);
    for (g in u)
        o = u[g],
        v = a[g],
        !u.hasOwnProperty(g) || o === v || o == null && v == null || V(l, t, g, o, u, v)
}
function H0(l) {
    switch (l) {
    case "css":
    case "script":
    case "font":
    case "img":
    case "image":
    case "input":
    case "link":
        return !0;
    default:
        return !1
    }
}
function Tm() {
    if (typeof performance.getEntriesByType == "function") {
        for (var l = 0, t = 0, a = performance.getEntriesByType("resource"), u = 0; u < a.length; u++) {
            var e = a[u]
              , n = e.transferSize
              , c = e.initiatorType
              , i = e.duration;
            if (n && i && H0(c)) {
                for (c = 0,
                i = e.responseEnd,
                u += 1; u < a.length; u++) {
                    var f = a[u]
                      , d = f.startTime;
                    if (d > i)
                        break;
                    var h = f.transferSize
                      , g = f.initiatorType;
                    h && H0(g) && (f = f.responseEnd,
                    c += h * (f < i ? 1 : (i - d) / (f - d)))
                }
                if (--u,
                t += 8 * (n + c) / (e.duration / 1e3),
                l++,
                10 < l)
                    break
            }
        }
        if (0 < l)
            return t / l / 1e6
    }
    return navigator.connection && (l = navigator.connection.downlink,
    typeof l == "number") ? l : 5
}
var di = null
  , oi = null;
function on(l) {
    return l.nodeType === 9 ? l : l.ownerDocument
}
function R0(l) {
    switch (l) {
    case "http://www.w3.org/2000/svg":
        return 1;
    case "http://www.w3.org/1998/Math/MathML":
        return 2;
    default:
        return 0
    }
}
function Xy(l, t) {
    if (l === 0)
        switch (t) {
        case "svg":
            return 1;
        case "math":
            return 2;
        default:
            return 0
        }
    return l === 1 && t === "foreignObject" ? 0 : l
}
function mi(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null
}
var Ac = null;
function pm() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Ac ? !1 : (Ac = l,
    !0) : (Ac = null,
    !1)
}
var Qy = typeof setTimeout == "function" ? setTimeout : void 0
  , _m = typeof clearTimeout == "function" ? clearTimeout : void 0
  , C0 = typeof Promise == "function" ? Promise : void 0
  , Om = typeof queueMicrotask == "function" ? queueMicrotask : typeof C0 < "u" ? function(l) {
    return C0.resolve(null).then(l).catch(Mm)
}
: Qy;
function Mm(l) {
    setTimeout(function() {
        throw l
    })
}
function kt(l) {
    return l === "head"
}
function j0(l, t) {
    var a = t
      , u = 0;
    do {
        var e = a.nextSibling;
        if (l.removeChild(a),
        e && e.nodeType === 8)
            if (a = e.data,
            a === "/$" || a === "/&") {
                if (u === 0) {
                    l.removeChild(e),
                    lu(t);
                    return
                }
                u--
            } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
                u++;
            else if (a === "html")
                ju(l.ownerDocument.documentElement);
            else if (a === "head") {
                a = l.ownerDocument.head,
                ju(a);
                for (var n = a.firstChild; n; ) {
                    var c = n.nextSibling
                      , i = n.nodeName;
                    n[le] || i === "SCRIPT" || i === "STYLE" || i === "LINK" && n.rel.toLowerCase() === "stylesheet" || a.removeChild(n),
                    n = c
                }
            } else
                a === "body" && ju(l.ownerDocument.body);
        a = e
    } while (a);
    lu(t)
}
function B0(l, t) {
    var a = l;
    l = 0;
    do {
        var u = a.nextSibling;
        if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display,
        a.style.display = "none") : (a.style.display = a._stashedDisplay || "",
        a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue,
        a.nodeValue = "") : a.nodeValue = a._stashedText || ""),
        u && u.nodeType === 8)
            if (a = u.data,
            a === "/$") {
                if (l === 0)
                    break;
                l--
            } else
                a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || l++;
        a = u
    } while (a)
}
function vi(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var a = t;
        switch (t = t.nextSibling,
        a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
            vi(a),
            Ni(a);
            continue;
        case "SCRIPT":
        case "STYLE":
            continue;
        case "LINK":
            if (a.rel.toLowerCase() === "stylesheet")
                continue
        }
        l.removeChild(a)
    }
}
function Dm(l, t, a, u) {
    for (; l.nodeType === 1; ) {
        var e = a;
        if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
            if (!u && (l.nodeName !== "INPUT" || l.type !== "hidden"))
                break
        } else if (u) {
            if (!l[le])
                switch (t) {
                case "meta":
                    if (!l.hasAttribute("itemprop"))
                        break;
                    return l;
                case "link":
                    if (n = l.getAttribute("rel"),
                    n === "stylesheet" && l.hasAttribute("data-precedence"))
                        break;
                    if (n !== e.rel || l.getAttribute("href") !== (e.href == null || e.href === "" ? null : e.href) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin) || l.getAttribute("title") !== (e.title == null ? null : e.title))
                        break;
                    return l;
                case "style":
                    if (l.hasAttribute("data-precedence"))
                        break;
                    return l;
                case "script":
                    if (n = l.getAttribute("src"),
                    (n !== (e.src == null ? null : e.src) || l.getAttribute("type") !== (e.type == null ? null : e.type) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                        break;
                    return l;
                default:
                    return l
                }
        } else if (t === "input" && l.type === "hidden") {
            var n = e.name == null ? null : "" + e.name;
            if (e.type === "hidden" && l.getAttribute("name") === n)
                return l
        } else
            return l;
        if (l = $l(l.nextSibling),
        l === null)
            break
    }
    return null
}
function Um(l, t, a) {
    if (t === "")
        return null;
    for (; l.nodeType !== 3; )
        if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !a || (l = $l(l.nextSibling),
        l === null))
            return null;
    return l
}
function Zy(l, t) {
    for (; l.nodeType !== 8; )
        if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = $l(l.nextSibling),
        l === null))
            return null;
    return l
}
function hi(l) {
    return l.data === "$?" || l.data === "$~"
}
function gi(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading"
}
function Nm(l, t) {
    var a = l.ownerDocument;
    if (l.data === "$~")
        l._reactRetry = t;
    else if (l.data !== "$?" || a.readyState !== "loading")
        t();
    else {
        var u = function() {
            t(),
            a.removeEventListener("DOMContentLoaded", u)
        };
        a.addEventListener("DOMContentLoaded", u),
        l._reactRetry = u
    }
}
function $l(l) {
    for (; l != null; l = l.nextSibling) {
        var t = l.nodeType;
        if (t === 1 || t === 3)
            break;
        if (t === 8) {
            if (t = l.data,
            t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
                break;
            if (t === "/$" || t === "/&")
                return null
        }
    }
    return l
}
var Si = null;
function Y0(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
        if (l.nodeType === 8) {
            var a = l.data;
            if (a === "/$" || a === "/&") {
                if (t === 0)
                    return $l(l.nextSibling);
                t--
            } else
                a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++
        }
        l = l.nextSibling
    }
    return null
}
function q0(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
        if (l.nodeType === 8) {
            var a = l.data;
            if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
                if (t === 0)
                    return l;
                t--
            } else
                a !== "/$" && a !== "/&" || t++
        }
        l = l.previousSibling
    }
    return null
}
function Vy(l, t, a) {
    switch (t = on(a),
    l) {
    case "html":
        if (l = t.documentElement,
        !l)
            throw Error(b(452));
        return l;
    case "head":
        if (l = t.head,
        !l)
            throw Error(b(453));
        return l;
    case "body":
        if (l = t.body,
        !l)
            throw Error(b(454));
        return l;
    default:
        throw Error(b(451))
    }
}
function ju(l) {
    for (var t = l.attributes; t.length; )
        l.removeAttributeNode(t[0]);
    Ni(l)
}
var Wl = new Map
  , G0 = new Set;
function mn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument
}
var pt = X.d;
X.d = {
    f: xm,
    r: Hm,
    D: Rm,
    C: Cm,
    L: jm,
    m: Bm,
    X: qm,
    S: Ym,
    M: Gm
};
function xm() {
    var l = pt.f()
      , t = Rn();
    return l || t
}
function Hm(l) {
    var t = uu(l);
    t !== null && t.tag === 5 && t.type === "form" ? B1(t) : pt.r(l)
}
var iu = typeof document > "u" ? null : document;
function Ly(l, t, a) {
    var u = iu;
    if (u && typeof t == "string" && t) {
        var e = Ll(t);
        e = 'link[rel="' + l + '"][href="' + e + '"]',
        typeof a == "string" && (e += '[crossorigin="' + a + '"]'),
        G0.has(e) || (G0.add(e),
        l = {
            rel: l,
            crossOrigin: a,
            href: t
        },
        u.querySelector(e) === null && (t = u.createElement("link"),
        bl(t, "link", l),
        ol(t),
        u.head.appendChild(t)))
    }
}
function Rm(l) {
    pt.D(l),
    Ly("dns-prefetch", l, null)
}
function Cm(l, t) {
    pt.C(l, t),
    Ly("preconnect", l, t)
}
function jm(l, t, a) {
    pt.L(l, t, a);
    var u = iu;
    if (u && l && t) {
        var e = 'link[rel="preload"][as="' + Ll(t) + '"]';
        t === "image" && a && a.imageSrcSet ? (e += '[imagesrcset="' + Ll(a.imageSrcSet) + '"]',
        typeof a.imageSizes == "string" && (e += '[imagesizes="' + Ll(a.imageSizes) + '"]')) : e += '[href="' + Ll(l) + '"]';
        var n = e;
        switch (t) {
        case "style":
            n = Pa(l);
            break;
        case "script":
            n = fu(l)
        }
        Wl.has(n) || (l = F({
            rel: "preload",
            href: t === "image" && a && a.imageSrcSet ? void 0 : l,
            as: t
        }, a),
        Wl.set(n, l),
        u.querySelector(e) !== null || t === "style" && u.querySelector(ce(n)) || t === "script" && u.querySelector(ie(n)) || (t = u.createElement("link"),
        bl(t, "link", l),
        ol(t),
        u.head.appendChild(t)))
    }
}
function Bm(l, t) {
    pt.m(l, t);
    var a = iu;
    if (a && l) {
        var u = t && typeof t.as == "string" ? t.as : "script"
          , e = 'link[rel="modulepreload"][as="' + Ll(u) + '"][href="' + Ll(l) + '"]'
          , n = e;
        switch (u) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
            n = fu(l)
        }
        if (!Wl.has(n) && (l = F({
            rel: "modulepreload",
            href: l
        }, t),
        Wl.set(n, l),
        a.querySelector(e) === null)) {
            switch (u) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
                if (a.querySelector(ie(n)))
                    return
            }
            u = a.createElement("link"),
            bl(u, "link", l),
            ol(u),
            a.head.appendChild(u)
        }
    }
}
function Ym(l, t, a) {
    pt.S(l, t, a);
    var u = iu;
    if (u && l) {
        var e = Ya(u).hoistableStyles
          , n = Pa(l);
        t = t || "default";
        var c = e.get(n);
        if (!c) {
            var i = {
                loading: 0,
                preload: null
            };
            if (c = u.querySelector(ce(n)))
                i.loading = 5;
            else {
                l = F({
                    rel: "stylesheet",
                    href: l,
                    "data-precedence": t
                }, a),
                (a = Wl.get(n)) && gf(l, a);
                var f = c = u.createElement("link");
                ol(f),
                bl(f, "link", l),
                f._p = new Promise(function(d, h) {
                    f.onload = d,
                    f.onerror = h
                }
                ),
                f.addEventListener("load", function() {
                    i.loading |= 1
                }),
                f.addEventListener("error", function() {
                    i.loading |= 2
                }),
                i.loading |= 4,
                qe(c, t, u)
            }
            c = {
                type: "stylesheet",
                instance: c,
                count: 1,
                state: i
            },
            e.set(n, c)
        }
    }
}
function qm(l, t) {
    pt.X(l, t);
    var a = iu;
    if (a && l) {
        var u = Ya(a).hoistableScripts
          , e = fu(l)
          , n = u.get(e);
        n || (n = a.querySelector(ie(e)),
        n || (l = F({
            src: l,
            async: !0
        }, t),
        (t = Wl.get(e)) && Sf(l, t),
        n = a.createElement("script"),
        ol(n),
        bl(n, "link", l),
        a.head.appendChild(n)),
        n = {
            type: "script",
            instance: n,
            count: 1,
            state: null
        },
        u.set(e, n))
    }
}
function Gm(l, t) {
    pt.M(l, t);
    var a = iu;
    if (a && l) {
        var u = Ya(a).hoistableScripts
          , e = fu(l)
          , n = u.get(e);
        n || (n = a.querySelector(ie(e)),
        n || (l = F({
            src: l,
            async: !0,
            type: "module"
        }, t),
        (t = Wl.get(e)) && Sf(l, t),
        n = a.createElement("script"),
        ol(n),
        bl(n, "link", l),
        a.head.appendChild(n)),
        n = {
            type: "script",
            instance: n,
            count: 1,
            state: null
        },
        u.set(e, n))
    }
}
function X0(l, t, a, u) {
    var e = (e = Yt.current) ? mn(e) : null;
    if (!e)
        throw Error(b(446));
    switch (l) {
    case "meta":
    case "title":
        return null;
    case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Pa(a.href),
        a = Ya(e).hoistableStyles,
        u = a.get(t),
        u || (u = {
            type: "style",
            instance: null,
            count: 0,
            state: null
        },
        a.set(t, u)),
        u) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
        };
    case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
            l = Pa(a.href);
            var n = Ya(e).hoistableStyles
              , c = n.get(l);
            if (c || (e = e.ownerDocument || e,
            c = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: {
                    loading: 0,
                    preload: null
                }
            },
            n.set(l, c),
            (n = e.querySelector(ce(l))) && !n._p && (c.instance = n,
            c.state.loading = 5),
            Wl.has(l) || (a = {
                rel: "preload",
                as: "style",
                href: a.href,
                crossOrigin: a.crossOrigin,
                integrity: a.integrity,
                media: a.media,
                hrefLang: a.hrefLang,
                referrerPolicy: a.referrerPolicy
            },
            Wl.set(l, a),
            n || Xm(e, l, a, c.state))),
            t && u === null)
                throw Error(b(528, ""));
            return c
        }
        if (t && u !== null)
            throw Error(b(529, ""));
        return null;
    case "script":
        return t = a.async,
        a = a.src,
        typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = fu(a),
        a = Ya(e).hoistableScripts,
        u = a.get(t),
        u || (u = {
            type: "script",
            instance: null,
            count: 0,
            state: null
        },
        a.set(t, u)),
        u) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
        };
    default:
        throw Error(b(444, l))
    }
}
function Pa(l) {
    return 'href="' + Ll(l) + '"'
}
function ce(l) {
    return 'link[rel="stylesheet"][' + l + "]"
}
function Ky(l) {
    return F({}, l, {
        "data-precedence": l.precedence,
        precedence: null
    })
}
function Xm(l, t, a, u) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? u.loading = 1 : (t = l.createElement("link"),
    u.preload = t,
    t.addEventListener("load", function() {
        return u.loading |= 1
    }),
    t.addEventListener("error", function() {
        return u.loading |= 2
    }),
    bl(t, "link", a),
    ol(t),
    l.head.appendChild(t))
}
function fu(l) {
    return '[src="' + Ll(l) + '"]'
}
function ie(l) {
    return "script[async]" + l
}
function Q0(l, t, a) {
    if (t.count++,
    t.instance === null)
        switch (t.type) {
        case "style":
            var u = l.querySelector('style[data-href~="' + Ll(a.href) + '"]');
            if (u)
                return t.instance = u,
                ol(u),
                u;
            var e = F({}, a, {
                "data-href": a.href,
                "data-precedence": a.precedence,
                href: null,
                precedence: null
            });
            return u = (l.ownerDocument || l).createElement("style"),
            ol(u),
            bl(u, "style", e),
            qe(u, a.precedence, l),
            t.instance = u;
        case "stylesheet":
            e = Pa(a.href);
            var n = l.querySelector(ce(e));
            if (n)
                return t.state.loading |= 4,
                t.instance = n,
                ol(n),
                n;
            u = Ky(a),
            (e = Wl.get(e)) && gf(u, e),
            n = (l.ownerDocument || l).createElement("link"),
            ol(n);
            var c = n;
            return c._p = new Promise(function(i, f) {
                c.onload = i,
                c.onerror = f
            }
            ),
            bl(n, "link", u),
            t.state.loading |= 4,
            qe(n, a.precedence, l),
            t.instance = n;
        case "script":
            return n = fu(a.src),
            (e = l.querySelector(ie(n))) ? (t.instance = e,
            ol(e),
            e) : (u = a,
            (e = Wl.get(n)) && (u = F({}, a),
            Sf(u, e)),
            l = l.ownerDocument || l,
            e = l.createElement("script"),
            ol(e),
            bl(e, "link", u),
            l.head.appendChild(e),
            t.instance = e);
        case "void":
            return null;
        default:
            throw Error(b(443, t.type))
        }
    else
        t.type === "stylesheet" && !(t.state.loading & 4) && (u = t.instance,
        t.state.loading |= 4,
        qe(u, a.precedence, l));
    return t.instance
}
function qe(l, t, a) {
    for (var u = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), e = u.length ? u[u.length - 1] : null, n = e, c = 0; c < u.length; c++) {
        var i = u[c];
        if (i.dataset.precedence === t)
            n = i;
        else if (n !== e)
            break
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = a.nodeType === 9 ? a.head : a,
    t.insertBefore(l, t.firstChild))
}
function gf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
    l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
    l.title == null && (l.title = t.title)
}
function Sf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
    l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
    l.integrity == null && (l.integrity = t.integrity)
}
var Ge = null;
function Z0(l, t, a) {
    if (Ge === null) {
        var u = new Map
          , e = Ge = new Map;
        e.set(a, u)
    } else
        e = Ge,
        u = e.get(a),
        u || (u = new Map,
        e.set(a, u));
    if (u.has(l))
        return u;
    for (u.set(l, null),
    a = a.getElementsByTagName(l),
    e = 0; e < a.length; e++) {
        var n = a[e];
        if (!(n[le] || n[hl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
            var c = n.getAttribute(t) || "";
            c = l + c;
            var i = u.get(c);
            i ? i.push(n) : u.set(c, [n])
        }
    }
    return u
}
function V0(l, t, a) {
    l = l.ownerDocument || l,
    l.head.insertBefore(a, t === "title" ? l.querySelector("head > title") : null)
}
function Qm(l, t, a) {
    if (a === 1 || t.itemProp != null)
        return !1;
    switch (l) {
    case "meta":
    case "title":
        return !0;
    case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
            break;
        return !0;
    case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
            break;
        switch (t.rel) {
        case "stylesheet":
            return l = t.disabled,
            typeof t.precedence == "string" && l == null;
        default:
            return !0
        }
    case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
            return !0
    }
    return !1
}
function Jy(l) {
    return !(l.type === "stylesheet" && !(l.state.loading & 3))
}
function Zm(l, t, a, u) {
    if (a.type === "stylesheet" && (typeof u.media != "string" || matchMedia(u.media).matches !== !1) && !(a.state.loading & 4)) {
        if (a.instance === null) {
            var e = Pa(u.href)
              , n = t.querySelector(ce(e));
            if (n) {
                t = n._p,
                t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++,
                l = vn.bind(l),
                t.then(l, l)),
                a.state.loading |= 4,
                a.instance = n,
                ol(n);
                return
            }
            n = t.ownerDocument || t,
            u = Ky(u),
            (e = Wl.get(e)) && gf(u, e),
            n = n.createElement("link"),
            ol(n);
            var c = n;
            c._p = new Promise(function(i, f) {
                c.onload = i,
                c.onerror = f
            }
            ),
            bl(n, "link", u),
            a.instance = n
        }
        l.stylesheets === null && (l.stylesheets = new Map),
        l.stylesheets.set(a, t),
        (t = a.state.preload) && !(a.state.loading & 3) && (l.count++,
        a = vn.bind(l),
        t.addEventListener("load", a),
        t.addEventListener("error", a))
    }
}
var Ec = 0;
function Vm(l, t) {
    return l.stylesheets && l.count === 0 && Xe(l, l.stylesheets),
    0 < l.count || 0 < l.imgCount ? function(a) {
        var u = setTimeout(function() {
            if (l.stylesheets && Xe(l, l.stylesheets),
            l.unsuspend) {
                var n = l.unsuspend;
                l.unsuspend = null,
                n()
            }
        }, 6e4 + t);
        0 < l.imgBytes && Ec === 0 && (Ec = 62500 * Tm());
        var e = setTimeout(function() {
            if (l.waitingForImages = !1,
            l.count === 0 && (l.stylesheets && Xe(l, l.stylesheets),
            l.unsuspend)) {
                var n = l.unsuspend;
                l.unsuspend = null,
                n()
            }
        }, (l.imgBytes > Ec ? 50 : 800) + t);
        return l.unsuspend = a,
        function() {
            l.unsuspend = null,
            clearTimeout(u),
            clearTimeout(e)
        }
    }
    : null
}
function vn() {
    if (this.count--,
    this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets)
            Xe(this, this.stylesheets);
        else if (this.unsuspend) {
            var l = this.unsuspend;
            this.unsuspend = null,
            l()
        }
    }
}
var hn = null;
function Xe(l, t) {
    l.stylesheets = null,
    l.unsuspend !== null && (l.count++,
    hn = new Map,
    t.forEach(Lm, l),
    hn = null,
    vn.call(l))
}
function Lm(l, t) {
    if (!(t.state.loading & 4)) {
        var a = hn.get(l);
        if (a)
            var u = a.get(null);
        else {
            a = new Map,
            hn.set(l, a);
            for (var e = l.querySelectorAll("link[data-precedence],style[data-precedence]"), n = 0; n < e.length; n++) {
                var c = e[n];
                (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (a.set(c.dataset.precedence, c),
                u = c)
            }
            u && a.set(null, u)
        }
        e = t.instance,
        c = e.getAttribute("data-precedence"),
        n = a.get(c) || u,
        n === u && a.set(null, e),
        a.set(c, e),
        this.count++,
        u = vn.bind(this),
        e.addEventListener("load", u),
        e.addEventListener("error", u),
        n ? n.parentNode.insertBefore(e, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l,
        l.insertBefore(e, l.firstChild)),
        t.state.loading |= 4
    }
}
var wu = {
    $$typeof: mt,
    Provider: null,
    Consumer: null,
    _currentValue: na,
    _currentValue2: na,
    _threadCount: 0
};
function Km(l, t, a, u, e, n, c, i, f) {
    this.tag = 1,
    this.containerInfo = l,
    this.pingCache = this.current = this.pendingChildren = null,
    this.timeoutHandle = -1,
    this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null,
    this.callbackPriority = 0,
    this.expirationTimes = Kn(-1),
    this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0,
    this.entanglements = Kn(0),
    this.hiddenUpdates = Kn(null),
    this.identifierPrefix = u,
    this.onUncaughtError = e,
    this.onCaughtError = n,
    this.onRecoverableError = c,
    this.pooledCache = null,
    this.pooledCacheLanes = 0,
    this.formState = f,
    this.incompleteTransitions = new Map
}
function wy(l, t, a, u, e, n, c, i, f, d, h, g) {
    return l = new Km(l,t,a,c,f,d,h,g,i),
    t = 1,
    n === !0 && (t |= 24),
    n = Hl(3, null, null, t),
    l.current = n,
    n.stateNode = l,
    t = Zi(),
    t.refCount++,
    l.pooledCache = t,
    t.refCount++,
    n.memoizedState = {
        element: u,
        isDehydrated: a,
        cache: t
    },
    Ki(n),
    l
}
function $y(l) {
    return l ? (l = Ra,
    l) : Ra
}
function Wy(l, t, a, u, e, n) {
    e = $y(e),
    u.context === null ? u.context = e : u.pendingContext = e,
    u = Gt(t),
    u.payload = {
        element: a
    },
    n = n === void 0 ? null : n,
    n !== null && (u.callback = n),
    a = Xt(l, u, t),
    a !== null && (Ml(a, l, t),
    Mu(a, l, t))
}
function L0(l, t) {
    if (l = l.memoizedState,
    l !== null && l.dehydrated !== null) {
        var a = l.retryLane;
        l.retryLane = a !== 0 && a < t ? a : t
    }
}
function bf(l, t) {
    L0(l, t),
    (l = l.alternate) && L0(l, t)
}
function Fy(l) {
    if (l.tag === 13 || l.tag === 31) {
        var t = ba(l, 67108864);
        t !== null && Ml(t, l, 67108864),
        bf(l, 67108864)
    }
}
function K0(l) {
    if (l.tag === 13 || l.tag === 31) {
        var t = Yl();
        t = Di(t);
        var a = ba(l, t);
        a !== null && Ml(a, l, t),
        bf(l, t)
    }
}
var gn = !0;
function Jm(l, t, a, u) {
    var e = M.T;
    M.T = null;
    var n = X.p;
    try {
        X.p = 2,
        rf(l, t, a, u)
    } finally {
        X.p = n,
        M.T = e
    }
}
function wm(l, t, a, u) {
    var e = M.T;
    M.T = null;
    var n = X.p;
    try {
        X.p = 8,
        rf(l, t, a, u)
    } finally {
        X.p = n,
        M.T = e
    }
}
function rf(l, t, a, u) {
    if (gn) {
        var e = bi(u);
        if (e === null)
            zc(l, t, u, Sn, a),
            J0(l, u);
        else if (Wm(e, l, t, a, u))
            u.stopPropagation();
        else if (J0(l, u),
        t & 4 && -1 < $m.indexOf(l)) {
            for (; e !== null; ) {
                var n = uu(e);
                if (n !== null)
                    switch (n.tag) {
                    case 3:
                        if (n = n.stateNode,
                        n.current.memoizedState.isDehydrated) {
                            var c = aa(n.pendingLanes);
                            if (c !== 0) {
                                var i = n;
                                for (i.pendingLanes |= 2,
                                i.entangledLanes |= 2; c; ) {
                                    var f = 1 << 31 - Bl(c);
                                    i.entanglements[1] |= f,
                                    c &= ~f
                                }
                                nt(n),
                                !(G & 6) && (nn = Cl() + 500,
                                ne(0))
                            }
                        }
                        break;
                    case 31:
                    case 13:
                        i = ba(n, 2),
                        i !== null && Ml(i, n, 2),
                        Rn(),
                        bf(n, 2)
                    }
                if (n = bi(u),
                n === null && zc(l, t, u, Sn, a),
                n === e)
                    break;
                e = n
            }
            e !== null && u.stopPropagation()
        } else
            zc(l, t, u, null, a)
    }
}
function bi(l) {
    return l = Hi(l),
    zf(l)
}
var Sn = null;
function zf(l) {
    if (Sn = null,
    l = Ma(l),
    l !== null) {
        var t = Fu(l);
        if (t === null)
            l = null;
        else {
            var a = t.tag;
            if (a === 13) {
                if (l = gs(t),
                l !== null)
                    return l;
                l = null
            } else if (a === 31) {
                if (l = Ss(t),
                l !== null)
                    return l;
                l = null
            } else if (a === 3) {
                if (t.stateNode.current.memoizedState.isDehydrated)
                    return t.tag === 3 ? t.stateNode.containerInfo : null;
                l = null
            } else
                t !== l && (l = null)
        }
    }
    return Sn = l,
    null
}
function ky(l) {
    switch (l) {
    case "beforetoggle":
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "toggle":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
        return 2;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
        return 8;
    case "message":
        switch (Hd()) {
        case As:
            return 2;
        case Es:
            return 8;
        case Ke:
        case Rd:
            return 32;
        case Ts:
            return 268435456;
        default:
            return 32
        }
    default:
        return 32
    }
}
var ri = !1
  , Vt = null
  , Lt = null
  , Kt = null
  , $u = new Map
  , Wu = new Map
  , xt = []
  , $m = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
function J0(l, t) {
    switch (l) {
    case "focusin":
    case "focusout":
        Vt = null;
        break;
    case "dragenter":
    case "dragleave":
        Lt = null;
        break;
    case "mouseover":
    case "mouseout":
        Kt = null;
        break;
    case "pointerover":
    case "pointerout":
        $u.delete(t.pointerId);
        break;
    case "gotpointercapture":
    case "lostpointercapture":
        Wu.delete(t.pointerId)
    }
}
function gu(l, t, a, u, e, n) {
    return l === null || l.nativeEvent !== n ? (l = {
        blockedOn: t,
        domEventName: a,
        eventSystemFlags: u,
        nativeEvent: n,
        targetContainers: [e]
    },
    t !== null && (t = uu(t),
    t !== null && Fy(t)),
    l) : (l.eventSystemFlags |= u,
    t = l.targetContainers,
    e !== null && t.indexOf(e) === -1 && t.push(e),
    l)
}
function Wm(l, t, a, u, e) {
    switch (t) {
    case "focusin":
        return Vt = gu(Vt, l, t, a, u, e),
        !0;
    case "dragenter":
        return Lt = gu(Lt, l, t, a, u, e),
        !0;
    case "mouseover":
        return Kt = gu(Kt, l, t, a, u, e),
        !0;
    case "pointerover":
        var n = e.pointerId;
        return $u.set(n, gu($u.get(n) || null, l, t, a, u, e)),
        !0;
    case "gotpointercapture":
        return n = e.pointerId,
        Wu.set(n, gu(Wu.get(n) || null, l, t, a, u, e)),
        !0
    }
    return !1
}
function Iy(l) {
    var t = Ma(l.target);
    if (t !== null) {
        var a = Fu(t);
        if (a !== null) {
            if (t = a.tag,
            t === 13) {
                if (t = gs(a),
                t !== null) {
                    l.blockedOn = t,
                    Nf(l.priority, function() {
                        K0(a)
                    });
                    return
                }
            } else if (t === 31) {
                if (t = Ss(a),
                t !== null) {
                    l.blockedOn = t,
                    Nf(l.priority, function() {
                        K0(a)
                    });
                    return
                }
            } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
                l.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
                return
            }
        }
    }
    l.blockedOn = null
}
function Qe(l) {
    if (l.blockedOn !== null)
        return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
        var a = bi(l.nativeEvent);
        if (a === null) {
            a = l.nativeEvent;
            var u = new a.constructor(a.type,a);
            Yc = u,
            a.target.dispatchEvent(u),
            Yc = null
        } else
            return t = uu(a),
            t !== null && Fy(t),
            l.blockedOn = a,
            !1;
        t.shift()
    }
    return !0
}
function w0(l, t, a) {
    Qe(l) && a.delete(t)
}
function Fm() {
    ri = !1,
    Vt !== null && Qe(Vt) && (Vt = null),
    Lt !== null && Qe(Lt) && (Lt = null),
    Kt !== null && Qe(Kt) && (Kt = null),
    $u.forEach(w0),
    Wu.forEach(w0)
}
function pe(l, t) {
    l.blockedOn === t && (l.blockedOn = null,
    ri || (ri = !0,
    sl.unstable_scheduleCallback(sl.unstable_NormalPriority, Fm)))
}
var _e = null;
function $0(l) {
    _e !== l && (_e = l,
    sl.unstable_scheduleCallback(sl.unstable_NormalPriority, function() {
        _e === l && (_e = null);
        for (var t = 0; t < l.length; t += 3) {
            var a = l[t]
              , u = l[t + 1]
              , e = l[t + 2];
            if (typeof u != "function") {
                if (zf(u || a) === null)
                    continue;
                break
            }
            var n = uu(a);
            n !== null && (l.splice(t, 3),
            t -= 3,
            Pc(n, {
                pending: !0,
                data: e,
                method: a.method,
                action: u
            }, u, e))
        }
    }))
}
function lu(l) {
    function t(f) {
        return pe(f, l)
    }
    Vt !== null && pe(Vt, l),
    Lt !== null && pe(Lt, l),
    Kt !== null && pe(Kt, l),
    $u.forEach(t),
    Wu.forEach(t);
    for (var a = 0; a < xt.length; a++) {
        var u = xt[a];
        u.blockedOn === l && (u.blockedOn = null)
    }
    for (; 0 < xt.length && (a = xt[0],
    a.blockedOn === null); )
        Iy(a),
        a.blockedOn === null && xt.shift();
    if (a = (l.ownerDocument || l).$$reactFormReplay,
    a != null)
        for (u = 0; u < a.length; u += 3) {
            var e = a[u]
              , n = a[u + 1]
              , c = e[Dl] || null;
            if (typeof n == "function")
                c || $0(a);
            else if (c) {
                var i = null;
                if (n && n.hasAttribute("formAction")) {
                    if (e = n,
                    c = n[Dl] || null)
                        i = c.formAction;
                    else if (zf(e) !== null)
                        continue
                } else
                    i = c.action;
                typeof i == "function" ? a[u + 1] = i : (a.splice(u, 3),
                u -= 3),
                $0(a)
            }
        }
}
function Py() {
    function l(n) {
        n.canIntercept && n.info === "react-transition" && n.intercept({
            handler: function() {
                return new Promise(function(c) {
                    return e = c
                }
                )
            },
            focusReset: "manual",
            scroll: "manual"
        })
    }
    function t() {
        e !== null && (e(),
        e = null),
        u || setTimeout(a, 20)
    }
    function a() {
        if (!u && !navigation.transition) {
            var n = navigation.currentEntry;
            n && n.url != null && navigation.navigate(n.url, {
                state: n.getState(),
                info: "react-transition",
                history: "replace"
            })
        }
    }
    if (typeof navigation == "object") {
        var u = !1
          , e = null;
        return navigation.addEventListener("navigate", l),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(a, 100),
        function() {
            u = !0,
            navigation.removeEventListener("navigate", l),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            e !== null && (e(),
            e = null)
        }
    }
}
function Af(l) {
    this._internalRoot = l
}
Bn.prototype.render = Af.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null)
        throw Error(b(409));
    var a = t.current
      , u = Yl();
    Wy(a, u, l, t, null, null)
}
;
Bn.prototype.unmount = Af.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
        this._internalRoot = null;
        var t = l.containerInfo;
        Wy(l.current, 2, null, l, null, null),
        Rn(),
        t[au] = null
    }
}
;
function Bn(l) {
    this._internalRoot = l
}
Bn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
        var t = Ds();
        l = {
            blockedOn: null,
            target: l,
            priority: t
        };
        for (var a = 0; a < xt.length && t !== 0 && t < xt[a].priority; a++)
            ;
        xt.splice(a, 0, l),
        a === 0 && Iy(l)
    }
}
;
var W0 = vs.version;
if (W0 !== "19.2.1")
    throw Error(b(527, W0, "19.2.1"));
X.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
        throw typeof l.render == "function" ? Error(b(188)) : (l = Object.keys(l).join(","),
        Error(b(268, l)));
    return l = _d(t),
    l = l !== null ? bs(l) : null,
    l = l === null ? null : l.stateNode,
    l
}
;
var km = {
    bundleType: 0,
    version: "19.2.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.1"
};
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Oe = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Oe.isDisabled && Oe.supportsFiber)
        try {
            ku = Oe.inject(km),
            jl = Oe
        } catch {}
}
rn.createRoot = function(l, t) {
    if (!hs(l))
        throw Error(b(299));
    var a = !1
      , u = ""
      , e = L1
      , n = K1
      , c = J1;
    return t != null && (t.unstable_strictMode === !0 && (a = !0),
    t.identifierPrefix !== void 0 && (u = t.identifierPrefix),
    t.onUncaughtError !== void 0 && (e = t.onUncaughtError),
    t.onCaughtError !== void 0 && (n = t.onCaughtError),
    t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
    t = wy(l, 1, !1, null, null, a, u, null, e, n, c, Py),
    l[au] = t.current,
    hf(l),
    new Af(t)
}
;
rn.hydrateRoot = function(l, t, a) {
    if (!hs(l))
        throw Error(b(299));
    var u = !1
      , e = ""
      , n = L1
      , c = K1
      , i = J1
      , f = null;
    return a != null && (a.unstable_strictMode === !0 && (u = !0),
    a.identifierPrefix !== void 0 && (e = a.identifierPrefix),
    a.onUncaughtError !== void 0 && (n = a.onUncaughtError),
    a.onCaughtError !== void 0 && (c = a.onCaughtError),
    a.onRecoverableError !== void 0 && (i = a.onRecoverableError),
    a.formState !== void 0 && (f = a.formState)),
    t = wy(l, 1, !0, t, a ?? null, u, e, f, n, c, i, Py),
    t.context = $y(null),
    a = t.current,
    u = Yl(),
    u = Di(u),
    e = Gt(u),
    e.callback = null,
    Xt(a, e, u),
    a = u,
    t.current.lanes = a,
    Pu(t, a),
    nt(t),
    l[au] = t.current,
    hf(l),
    new Bn(t)
}
;
rn.version = "19.2.1";
function ld() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
        try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ld)
        } catch (l) {
            console.error(l)
        }
}
ld(),
fs.exports = rn;
var Im = fs.exports;
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Pm = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lv = l => l.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim()
  , Yn = (l, t) => {
    const a = Ol.forwardRef( ({color: u="currentColor", size: e=24, strokeWidth: n=2, absoluteStrokeWidth: c, className: i="", children: f, ...d}, h) => Ol.createElement("svg", {
        ref: h,
        ...Pm,
        width: e,
        height: e,
        stroke: u,
        strokeWidth: c ? Number(n) * 24 / Number(e) : n,
        className: ["lucide", `lucide-${lv(l)}`, i].join(" "),
        ...d
    }, [...t.map( ([g,o]) => Ol.createElement(g, o)), ...Array.isArray(f) ? f : [f]]));
    return a.displayName = `${l}`,
    a
}
;
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tv = Yn("AlertCircle", [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
}], ["line", {
    x1: "12",
    x2: "12",
    y1: "8",
    y2: "12",
    key: "1pkeuh"
}], ["line", {
    x1: "12",
    x2: "12.01",
    y1: "16",
    y2: "16",
    key: "4dfq90"
}]]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const av = Yn("CheckCircle2", [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
}], ["path", {
    d: "m9 12 2 2 4-4",
    key: "dzmm74"
}]]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uv = Yn("KeyRound", [["path", {
    d: "M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z",
    key: "167ctg"
}], ["circle", {
    cx: "16.5",
    cy: "7.5",
    r: ".5",
    fill: "currentColor",
    key: "w0ekpg"
}]]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const F0 = Yn("Lock", [["rect", {
    width: "18",
    height: "11",
    x: "3",
    y: "11",
    rx: "2",
    ry: "2",
    key: "1w4ew1"
}], ["path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4",
    key: "fwvmzm"
}]])
  , ev = l => {
    const t = new Uint8Array(l);
    let a = "";
    for (let u = 0; u < t.byteLength; u++)
        a += String.fromCharCode(t[u]);
    return btoa(a)
}
  , Tc = l => {
    const t = new Uint8Array(l);
    return Array.from(t).map(a => a.toString(16).padStart(2, "0")).join("")
}
  , k0 = l => ({
    base64: btoa(String.fromCharCode(...l)),
    hex: Array.from(l).map(t => t.toString(16).padStart(2, "0")).join("")
})
  , I0 = new TextEncoder().encode("Corbado");
function nv() {
    const [l,t] = Ol.useState(null)
      , [a,u] = Ol.useState(null)
      , [e,n] = Ol.useState(null)
      , [c,i] = Ol.useState(null)
      , [f,d] = Ol.useState({
        creation: "unknown",
        creationValue: "unknown",
        authentication: "unknown"
    })
      , [h,g] = Ol.useState(null)
      , o = Ol.useCallback(async (E=!0) => {
        var H, y, s;
        try {
            if (!window.PublicKeyCredential)
                throw new Error("WebAuthn is not supported in this browser");
            const m = new Uint8Array(32);
            crypto.getRandomValues(m);
            const S = k0(m)
              , T = {
                challenge: m,
                rp: {
                    name: "WebAuthn PRF Demo",
                    id: window.location.hostname
                },
                user: {
                    id: new Uint8Array([1, 2, 3, 4]),
                    name: E ? "created-with-prf@corbado.com" : "created-without-prf@corbado.com",
                    displayName: E ? "created-with-prf@corbado.com" : "created-without-prf@corbado.com"
                },
                pubKeyCredParams: [{
                    type: "public-key",
                    alg: -7
                }, {
                    type: "public-key",
                    alg: -257
                }],
                timeout: 6e4,
                attestation: "direct",
                authenticatorSelection: {
                    residentKey: "required",
                    userVerification: "required"
                },
                ...E && {
                    extensions: {
                        prf: {
                            eval: {
                                first: I0
                            }
                        }
                    }
                }
            };
            u({
                options: {
                    ...T,
                    challenge: {
                        base64: S.base64,
                        hex: S.hex
                    }
                }
            });
            const O = await navigator.credentials.create({
                publicKey: T
            })
              , _ = O.getClientExtensionResults()
              , D = ((H = _.prf) == null ? void 0 : H.enabled) ?? !1
              , U = (s = (y = _.prf) == null ? void 0 : y.results) == null ? void 0 : s.first;
            g(E),
            d(I => ({
                ...I,
                creation: E ? D ? "supported" : "unsupported" : "unknown",
                creationValue: E ? U ? "supported" : "unsupported" : "unknown"
            })),
            t(O.rawId),
            u(I => ({
                ...I,
                credential: {
                    id: O.id,
                    type: O.type,
                    rawId: ev(O.rawId),
                    extensions: {
                        ..._,
                        prf: {
                            ..._.prf,
                            results: {
                                first: U ? Tc(U) : null
                            }
                        }
                    }
                }
            })),
            i({
                type: E ? D ? "success" : "error" : "success",
                message: E ? D ? `Registration successful! PRF enabled${U ? " and PRF value returned during creation!" : ""}` : "Registration successful but PRF is not supported by this authenticator" : "Registration successful without PRF"
            })
        } catch (m) {
            console.error("Registration error:", m),
            i({
                type: "error",
                message: `Registration failed: ${minstanceof Error ? m.message : "Unknown error"}`
            })
        }
    }
    , [])
      , v = Ol.useCallback(async () => {
        var E, H, y, s, m, S;
        try {
            const T = new Uint8Array(32);
            crypto.getRandomValues(T);
            const O = k0(T)
              , A = {
                challenge: T,
                rpId: window.location.hostname,
                timeout: 6e4,
                userVerification: "required",
                extensions: {
                    prf: {
                        eval: {
                            first: I0
                        }
                    }
                }
            };
            l && (A.allowCredentials = [{
                id: l,
                type: "public-key"
            }]),
            n({
                options: {
                    ...A,
                    challenge: {
                        base64: O.base64,
                        hex: O.hex
                    }
                }
            });
            const _ = await navigator.credentials.get({
                publicKey: A
            })
              , U = _.getClientExtensionResults()
              , I = (H = (E = U.prf) == null ? void 0 : E.results) == null ? void 0 : H.first;
            d(It => ({
                ...It,
                authentication: I ? "supported" : "unsupported"
            }));
            const Fl = (S = (m = (s = (y = a == null ? void 0 : a.credential) == null ? void 0 : y.extensions) == null ? void 0 : s.prf) == null ? void 0 : m.results) == null ? void 0 : S.first
              , su = I ? Tc(I) : null
              , qn = Fl && su && Fl === su;
            if (n(It => ({
                ...It,
                assertion: {
                    id: _.id,
                    type: _.type,
                    extensions: {
                        ...U,
                        prf: {
                            ...U.prf,
                            results: {
                                first: I ? Tc(I) : null
                            }
                        }
                    }
                }
            })),
            !I) {
                i({
                    type: h ? "error" : "info",
                    message: h ? "Authentication successful but PRF is not supported by this authenticator" : "Authentication successful (PRF was not requested during registration)"
                });
                return
            }
            i({
                type: "success",
                message: h ? qn ? "Authentication successful! PRF value obtained and identical to registration" : "Authentication successful! PRF value obtained." : "Authentication successful! PRF value obtained without creating credential with PRF."
            })
        } catch (T) {
            console.error("Authentication error:", T),
            i({
                type: "error",
                message: `Authentication failed: ${Tinstanceof Error ? T.message : "Unknown error"}`
            })
        }
    }
    , [l, a, h])
      , r = ({status: E}) => {
        switch (E) {
        case "supported":
            return "✅";
        case "unsupported":
            return "❌";
        default:
            return "❓"
        }
    }
    ;
    return z.jsx("div", {
        className: "min-h-screen bg-gray-50 py-8 px-4",
        children: z.jsx("div", {
            className: "max-w-4xl mx-auto",
            children: z.jsxs("div", {
                className: "bg-white rounded-lg shadow-lg p-6",
                children: [z.jsx("h1", {
                    className: "text-2xl font-bold text-gray-900 mb-4",
                    children: "WebAuthn / Passkeys & PRF Demo by Corbado"
                }), z.jsx("a", {
                    href: "https://www.corbado.com/blog/passkeys-prf-webauthn",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-blue-600 hover:text-blue-800 mb-6 block",
                    children: "Read the full article on Corbado's blog →"
                }), z.jsxs("div", {
                    className: "mb-6 bg-gray-100 p-4 rounded-lg",
                    children: [z.jsx("h2", {
                        className: "text-lg font-semibold mb-3",
                        children: "PRF Support Status"
                    }), z.jsxs("div", {
                        className: "space-y-2 text-lg",
                        children: [z.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [z.jsx(r, {
                                status: f.creation
                            }), z.jsx("span", {
                                children: "PRF Support on Creation"
                            })]
                        }), z.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [z.jsx(r, {
                                status: f.creationValue
                            }), z.jsx("span", {
                                children: "PRF Value on Creation (CTAP 2.2+)"
                            })]
                        }), z.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [z.jsx(r, {
                                status: f.authentication
                            }), z.jsx("span", {
                                children: "PRF Support during Authentication"
                            })]
                        })]
                    })]
                }), c && z.jsxs("div", {
                    className: `mb-6 p-4 rounded-lg flex items-center gap-2 ${c.type === "success" ? "bg-green-50 text-green-700" : c.type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`,
                    children: [c.type === "success" ? z.jsx(av, {
                        className: "h-5 w-5"
                    }) : c.type === "error" ? z.jsx(tv, {
                        className: "h-5 w-5"
                    }) : z.jsx(F0, {
                        className: "h-5 w-5"
                    }), c.message]
                }), z.jsxs("div", {
                    className: "flex flex-col sm:flex-row gap-2 mb-2",
                    children: [z.jsxs("button", {
                        onClick: () => o(!0),
                        className: "flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200",
                        children: [z.jsx(uv, {
                            className: "h-4 w-4 mr-2"
                        }), "Register with PRF"]
                    }), z.jsxs("button", {
                        onClick: v,
                        className: "flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200",
                        children: [z.jsx(F0, {
                            className: "h-4 w-4 mr-2"
                        }), "Authenticate & Get PRF Value"]
                    })]
                }), z.jsxs("div", {
                    className: "mb-8 text-center",
                    children: [z.jsx("button", {
                        onClick: () => o(!1),
                        className: "text-blue-600 hover:text-blue-800 text-sm underline",
                        children: "Register without PRF"
                    }), z.jsx("p", {
                        className: "text-sm text-gray-600 mt-1",
                        children: "Newer authenticators return PRF values, even if credentials have not been created with PRF enabled"
                    })]
                }), z.jsx("p", {
                    className: "text-gray-700 mb-8",
                    children: "The WebAuthn PRF extension enables secure key derivation from passkeys, revolutionizing end-to-end encryption in web applications. This powerful feature allows applications to derive encryption keys directly from passkeys during authentication, eliminating the need for separate passwords. While support varies across platforms, the PRF extension is gaining momentum, particularly in Chrome and Android environments. Its implementation enables compelling use cases like passwordless vault decryption and secure key rotation schemes."
                }), z.jsxs("div", {
                    className: "space-y-6",
                    children: [a && z.jsxs("div", {
                        className: "border rounded-lg p-4",
                        children: [z.jsx("h2", {
                            className: "text-lg font-semibold mb-4",
                            children: "Registration Data"
                        }), z.jsxs("div", {
                            className: "space-y-4",
                            children: [z.jsxs("div", {
                                children: [z.jsx("h3", {
                                    className: "text-sm font-medium text-gray-700 mb-2",
                                    children: "Challenge:"
                                }), z.jsxs("div", {
                                    className: "space-y-2",
                                    children: [z.jsxs("div", {
                                        children: [z.jsx("span", {
                                            className: "text-xs text-gray-500",
                                            children: "Base64:"
                                        }), z.jsx("pre", {
                                            className: "bg-gray-50 p-2 rounded-md overflow-auto text-sm font-mono",
                                            children: a.options.challenge.base64
                                        })]
                                    }), z.jsxs("div", {
                                        children: [z.jsx("span", {
                                            className: "text-xs text-gray-500",
                                            children: "Hex:"
                                        }), z.jsx("pre", {
                                            className: "bg-gray-50 p-2 rounded-md overflow-auto text-sm font-mono",
                                            children: a.options.challenge.hex
                                        })]
                                    })]
                                })]
                            }), z.jsxs("div", {
                                children: [z.jsx("h3", {
                                    className: "text-sm font-medium text-gray-700 mb-2",
                                    children: "PublicKey Options:"
                                }), z.jsx("pre", {
                                    className: "bg-gray-50 p-4 rounded-md overflow-auto text-sm",
                                    children: JSON.stringify({
                                        ...a.options,
                                        challenge: "..."
                                    }, null, 2)
                                })]
                            }), a.credential && z.jsx(z.Fragment, {
                                children: z.jsxs("div", {
                                    children: [z.jsx("h3", {
                                        className: "text-sm font-medium text-gray-700 mb-2",
                                        children: "Credential:"
                                    }), z.jsx("pre", {
                                        className: "bg-gray-50 p-4 rounded-md overflow-auto text-sm",
                                        children: JSON.stringify(a.credential, null, 2)
                                    })]
                                })
                            })]
                        })]
                    }), e && z.jsxs("div", {
                        className: "border rounded-lg p-4",
                        children: [z.jsx("h2", {
                            className: "text-lg font-semibold mb-4",
                            children: "Authentication Data"
                        }), z.jsxs("div", {
                            className: "space-y-4",
                            children: [z.jsxs("div", {
                                children: [z.jsx("h3", {
                                    className: "text-sm font-medium text-gray-700 mb-2",
                                    children: "Challenge:"
                                }), z.jsxs("div", {
                                    className: "space-y-2",
                                    children: [z.jsxs("div", {
                                        children: [z.jsx("span", {
                                            className: "text-xs text-gray-500",
                                            children: "Base64:"
                                        }), z.jsx("pre", {
                                            className: "bg-gray-50 p-2 rounded-md overflow-auto text-sm font-mono",
                                            children: e.options.challenge.base64
                                        })]
                                    }), z.jsxs("div", {
                                        children: [z.jsx("span", {
                                            className: "text-xs text-gray-500",
                                            children: "Hex:"
                                        }), z.jsx("pre", {
                                            className: "bg-gray-50 p-2 rounded-md overflow-auto text-sm font-mono",
                                            children: e.options.challenge.hex
                                        })]
                                    })]
                                })]
                            }), z.jsxs("div", {
                                children: [z.jsx("h3", {
                                    className: "text-sm font-medium text-gray-700 mb-2",
                                    children: "PublicKey Options:"
                                }), z.jsx("pre", {
                                    className: "bg-gray-50 p-4 rounded-md overflow-auto text-sm",
                                    children: JSON.stringify({
                                        ...e.options,
                                        challenge: "..."
                                    }, null, 2)
                                })]
                            }), e.assertion && z.jsx(z.Fragment, {
                                children: z.jsxs("div", {
                                    children: [z.jsx("h3", {
                                        className: "text-sm font-medium text-gray-700 mb-2",
                                        children: "Assertion:"
                                    }), z.jsx("pre", {
                                        className: "bg-gray-50 p-4 rounded-md overflow-auto text-sm",
                                        children: JSON.stringify(e.assertion, null, 2)
                                    })]
                                })
                            })]
                        })]
                    })]
                })]
            })
        })
    })
}
Im.createRoot(document.getElementById("root")).render(z.jsx(Ol.StrictMode, {
    children: z.jsx(nv, {})
}));
