(function () {
  "use strict";

  const SDK = window.__HERMES_PLUGIN_SDK__ || {};
  const registry = window.__HERMES_PLUGINS__;
  if (!registry) return;

  const React = SDK.React || window.React;
  if (!React) return;

  const h = React.createElement;
  const { useEffect, useMemo, useRef, useState } = React;

  const NIGHTSHIFT_VARS = {
    "--background": "color-mix(in srgb, #1d1f29 100%, transparent)",
    "--background-base": "#1d1f29",
    "--background-alpha": "1",
    "--midground": "color-mix(in srgb, #f3f4f9 100%, transparent)",
    "--midground-base": "#f3f4f9",
    "--midground-alpha": "1",
    "--foreground": "color-mix(in srgb, #f3f4f9 100%, transparent)",
    "--foreground-base": "#f3f4f9",
    "--foreground-alpha": "1",
    "--warm-glow": "rgba(196, 181, 253, 0.16)",
    "--noise-opacity-mul": "0.48",
    "--color-background": "#1d1f29",
    "--color-foreground": "#f3f4f9",
    "--color-card": "#2c3041",
    "--color-card-foreground": "#f3f4f9",
    "--color-primary": "#c4b5fd",
    "--color-primary-foreground": "#1d1f29",
    "--color-secondary": "#262a37",
    "--color-secondary-foreground": "#d6d9e5",
    "--color-muted": "#262a37",
    "--color-muted-foreground": "#b3b9cc",
    "--color-accent": "#34304a",
    "--color-accent-foreground": "#f3f4f9",
    "--color-destructive": "#fca5a5",
    "--color-destructive-foreground": "#2b1114",
    "--color-success": "#86efac",
    "--color-warning": "#fcd34d",
    "--color-border": "rgba(164, 173, 205, 0.22)",
    "--color-input": "rgba(164, 173, 205, 0.20)",
    "--color-ring": "#c4b5fd",
    "--color-popover": "rgba(31, 34, 45, 0.97)",
    "--color-popover-foreground": "#f3f4f9"
  };

  const DATA = {
    nav: ["Overview", "Sessions", "Logs", "Agents", "Triage", "Config"],
    sessions: [
      { id: "s_8f3a", name: "log-triage/api-503-spike", agent: "sonnet-4.5", state: "live", tokens: 142300, cost: 0.18, messages: 47, started: "02:14:08", lastTool: "grep --logs", branch: "ops/incident-2104" },
      { id: "s_2c91", name: "session-hunt/long-running", agent: "sonnet-4.5", state: "live", tokens: 98120, cost: 0.41, messages: 19, started: "01:48:22", lastTool: "list_sessions", branch: "main" },
      { id: "s_4b07", name: "feat/nightshift-theme", agent: "opus-4", state: "waiting", tokens: 220900, cost: 1.12, messages: 88, started: "00:02:11", lastTool: "edit_file", branch: "ui/nightshift" },
      { id: "s_9d12", name: "bug/auth-token-rotation", agent: "haiku-4.5", state: "live", tokens: 18240, cost: 0.02, messages: 6, started: "02:31:55", lastTool: "read_file", branch: "fix/auth" },
      { id: "s_7e44", name: "ops/db-vacuum-postgres", agent: "gpt-5", state: "error", tokens: 72011, cost: 0.31, messages: 22, started: "01:12:03", lastTool: "shell", branch: "ops/db" },
      { id: "s_a210", name: "research/embedding-index", agent: "local/llama", state: "idle", tokens: 401553, cost: 2.04, messages: 142, started: "yesterday", lastTool: "—", branch: "research/index" }
    ],
    agents: [
      { name: "haiku-4.5", load: 0.42, latency: 312, state: "ok" },
      { name: "sonnet-4.5", load: 0.71, latency: 884, state: "ok" },
      { name: "opus-4", load: 0.18, latency: 1620, state: "warm" },
      { name: "gpt-5", load: 0.91, latency: 2100, state: "degraded" },
      { name: "local/llama", load: 0.08, latency: 92, state: "ok" }
    ],
    logs: [
      ["02:41:38.092", "TOOL", "tool.shell", "s_8f3a", "grep --logs returned 84 matching gateway entries"],
      ["02:41:41.188", "INFO", "stream.sse", "s_2c91", "client subscribed to /api/events with replay=latest"],
      ["02:41:45.773", "WARN", "ratelimit", "s_7e44", "gpt-5 bucket at 91%; fallback route is armed"],
      ["02:41:47.029", "DEBUG", "cache.redis", "s_9d12", "prompt cache HIT key=system:nightshift"],
      ["02:41:51.441", "ERROR", "db.pg", "s_7e44", "vacuum analyze exceeded target window by 4x"],
      ["02:41:54.612", "TRACE", "router", "s_4b07", "selected sonnet-4.5 for dashboard CSS pass"],
      ["02:42:00.044", "INFO", "dispatcher", "s_8f3a", "queued next tool call after user approval bypass"],
      ["02:42:03.332", "TOOL", "tool.read_file", "s_4b07", "read dashboard/dist/style.css bytes=18412"],
      ["02:42:05.870", "WARN", "context", "s_4b07", "context window 71%; compression threshold near"],
      ["02:42:09.517", "INFO", "gateway", "s_2c91", "telegram delivery latency 312ms"],
      ["02:42:12.201", "DEBUG", "scheduler", "s_a210", "cron queue idle; next tick in 27s"],
      ["02:42:14.908", "TOOL", "tool.git", "s_9d12", "diff clean except theme assets"],
      ["02:42:17.666", "INFO", "auth", "s_8f3a", "credential pool refreshed; active key remains healthy"],
      ["02:42:20.145", "TRACE", "kernel", "s_4b07", "render pass completed in 18ms"],
      ["02:42:22.880", "INFO", "stream.sse", "s_3f88", "tail attached to 6 sessions"],
      ["02:42:25.491", "WARN", "budget", "s_4b07", "night spend at 68% of budget"],
      ["02:42:28.704", "INFO", "dispatcher", "s_8f3a", "agent resumed after operator review"],
      ["02:42:32.310", "TOOL", "tool.patch", "s_4b07", "updated theme token map and sidebar polish"]
    ],
    tokenSeries: [96, 104, 118, 132, 128, 144, 170, 165, 182, 196, 188, 205, 222, 218, 236, 251, 244, 272, 268, 286, 301, 292, 318, 336, 330, 352, 344, 371, 360, 388, 402, 391, 418, 432, 424, 445, 461, 452, 474, 492, 481, 505, 516, 508, 529, 548, 534, 562, 579, 564, 592, 610, 596, 621, 640, 628, 651, 668, 657, 684],
    costSeries: [0, 1, 1, 2, 1, 0, 2, 3, 2, 2, 1, 3]
  };

  let applying = false;
  function applyNightShift() {
    if (applying) return;
    applying = true;
    const root = document.documentElement;
    root.classList.add("nightshift-ops");
    root.setAttribute("data-nightshift-ops", "quiet-redesign");
    for (const [key, value] of Object.entries(NIGHTSHIFT_VARS)) {
      if (root.style.getPropertyValue(key).trim() !== value) root.style.setProperty(key, value);
    }
    applying = false;
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  function nowLabel() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function tickLabel() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, "0")}`;
  }
  function formatK(n) { return n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n); }
  function cls() { return Array.from(arguments).filter(Boolean).join(" "); }

  function makeLog(index) {
    const session = DATA.sessions[index % DATA.sessions.length];
    const levels = ["INFO", "DEBUG", "WARN", "TRACE", "TOOL"];
    const comps = ["dispatcher", "stream.sse", "tool.shell", "router", "cache.redis", "tool.patch"];
    const verbs = [
      `session=${session.id} cost=$${session.cost.toFixed(4)}`,
      `streamed +${120 + index * 17} tokens for ${session.agent}`,
      `tool=${session.lastTool} ok in ${180 + index * 13}ms`,
      `branch=${session.branch} diff ready for review`,
      `cache HIT key=prompt:${session.id}`,
      `operator focus moved to ${session.name}`
    ];
    return [tickLabel(), levels[index % levels.length], comps[index % comps.length], session.id, verbs[index % verbs.length]];
  }

  function MiniSpark(props) {
    const series = props.series || DATA.tokenSeries.slice(-20);
    const color = props.color || "currentColor";
    const w = 92;
    const hgt = 42;
    const max = Math.max.apply(null, series);
    const min = Math.min.apply(null, series);
    const path = series.map(function (v, i) {
      const x = (i / Math.max(1, series.length - 1)) * w;
      const y = hgt - ((v - min) / (max - min || 1)) * (hgt - 6) - 3;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
    return h("svg", { className: "nightshift-spark", viewBox: `0 0 ${w} ${hgt}`, preserveAspectRatio: "none", "aria-hidden": "true" },
      h("path", { d: path, fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" })
    );
  }

  function MiniBars(props) {
    const values = props.values || DATA.costSeries;
    const color = props.color || "#fca5a5";
    const max = Math.max.apply(null, values.concat([1]));
    return h("div", { className: "nightshift-bars", "aria-hidden": "true" }, values.map(function (v, i) {
      return h("span", { key: i, style: { height: `${Math.max(8, (v / max) * 38)}px`, background: v ? color : "rgba(179,185,204,0.22)" } });
    }));
  }

  function BrandMark() {
    return h("div", { className: "nightshift-brand" },
      h("div", { className: "nightshift-brand__mark", "aria-hidden": "true" },
        h("svg", { viewBox: "0 0 18 18" },
          h("path", { d: "M3 4.5v9M3 9h5.5M8.5 4.5v9M12 5.5l3 8M15 5.5l-3 8", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" })
        )
      ),
      h("div", null,
        h("div", { className: "nightshift-brand__title" }, "Hermes"),
        h("div", { className: "nightshift-brand__subtitle" }, "Night Shift Ops")
      )
    );
  }

  function StatusDot(props) {
    return h("span", { className: cls("nightshift-dot", `is-${props.state || "idle"}`), "aria-hidden": "true" });
  }

  function StatusPill(props) {
    return h("span", { className: cls("nightshift-pill", `is-${props.state || "neutral"}`) },
      props.dot !== false ? h(StatusDot, { state: props.state }) : null,
      props.children
    );
  }

  function Button(props) {
    return h("button", {
      type: "button",
      className: cls("nightshift-button", props.variant && `nightshift-button--${props.variant}`),
      onClick: props.onClick
    }, props.children);
  }

  function Sidebar(props) {
    return h("aside", { className: "nightshift-sidebar" },
      h(BrandMark),
      h("nav", { className: "nightshift-nav", "aria-label": "Night Shift navigation" }, DATA.nav.map(function (label, index) {
        const key = label.toLowerCase();
        return h("button", {
          key: label,
          type: "button",
          className: cls("nightshift-nav__item", index === 0 && "is-active")
        },
          h("span", { className: "nightshift-nav__glyph" }, ["□", "≡", "▤", "○", "△", "⚙"][index]),
          h("span", null, label),
          label === "Logs" ? h("span", { className: "nightshift-nav__badge is-live" }, "live") : null,
          label === "Triage" ? h("span", { className: "nightshift-nav__badge is-alert" }, "2") : null
        );
      })),
      h("div", { className: "nightshift-sidebar__label" }, "Active sessions"),
      h("div", { className: "nightshift-session-list" }, DATA.sessions.slice(0, 6).map(function (session) {
        return h("button", {
          key: session.id,
          type: "button",
          className: cls("nightshift-session-row", session.id === props.selectedId && "is-selected"),
          onClick: function () { props.onSelect(session.id); }
        },
          h(StatusDot, { state: session.state }),
          h("span", { className: "nightshift-session-row__name" }, session.name),
          h("span", { className: "nightshift-session-row__meta" }, formatK(session.tokens))
        );
      })),
      h("div", { className: "nightshift-account" },
        h("div", { className: "nightshift-account__avatar" }, "B3"),
        h("div", { className: "nightshift-account__copy" },
          h("strong", null, "BlueBirdBack"),
          h("span", null, "local ops · pro")
        ),
        h("span", { className: "nightshift-kbd" }, "⌘K")
      )
    );
  }

  function Header(props) {
    return h("header", { className: "nightshift-topbar" },
      h("div", { className: "nightshift-breadcrumb" },
        h("span", null, "Overview"),
        h("span", { className: "nightshift-breadcrumb__sep" }, "/"),
        h("strong", null, `Tonight, ${props.now}`),
        h(StatusPill, { state: props.paused ? "waiting" : "live" }, props.paused ? "paused" : "live")
      ),
      h("div", { className: "nightshift-actions" },
        h(Button, null, "Filter"),
        h(Button, null, "Export"),
        h(Button, { variant: "primary" }, "+ New session")
      )
    );
  }

  function MetricCard(props) {
    return h("section", { className: cls("nightshift-metric", props.tone && `is-${props.tone}`) },
      h("div", { className: "nightshift-metric__body" },
        h("span", { className: "nightshift-label" }, props.label),
        h("strong", { className: "nightshift-metric__value" }, props.value),
        h("span", { className: "nightshift-metric__delta" }, props.delta)
      ),
      h("div", { className: "nightshift-metric__chart" }, props.chart)
    );
  }

  function Panel(props) {
    return h("section", { className: cls("nightshift-panel", props.className) },
      h("header", { className: "nightshift-panel__header" },
        h("div", null,
          h("h3", null, props.title),
          props.subtitle ? h("p", null, props.subtitle) : null
        ),
        props.right || null
      ),
      h("div", { className: "nightshift-panel__body" }, props.children)
    );
  }

  function MainChart() {
    return h(Panel, { title: "Tonight", subtitle: "Tokens / min · last 60 minutes", className: "nightshift-panel--chart" },
      h("div", { className: "nightshift-chart-head" },
        h("strong", null, "14,820"),
        h("span", { className: "nightshift-delta is-positive" }, "↑ 12.4%"),
        h("span", null, "vs trailing 7-night avg")
      ),
      h("div", { className: "nightshift-big-chart" }, h(AreaChart, { series: DATA.tokenSeries })),
      h("div", { className: "nightshift-legend" },
        h("span", null, h("i", { className: "is-accent" }), "tok/min"),
        h("span", null, h("i", null), "baseline"),
        h("span", { className: "nightshift-legend__range" }, "02:00 — now")
      )
    );
  }

  function AreaChart(props) {
    const series = props.series;
    const w = 640;
    const hgt = 190;
    const max = Math.max.apply(null, series);
    const min = Math.min.apply(null, series);
    const path = series.map(function (v, i) {
      const x = (i / Math.max(1, series.length - 1)) * w;
      const y = hgt - ((v - min) / (max - min || 1)) * (hgt - 16) - 8;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
    return h("svg", { viewBox: `0 0 ${w} ${hgt}`, preserveAspectRatio: "none", "aria-hidden": "true" },
      h("defs", null,
        h("linearGradient", { id: "nightshift-area", x1: "0", x2: "0", y1: "0", y2: "1" },
          h("stop", { offset: "0%", stopColor: "#c4b5fd", stopOpacity: "0.42" }),
          h("stop", { offset: "100%", stopColor: "#c4b5fd", stopOpacity: "0" })
        )
      ),
      [0.25, 0.5, 0.75].map(function (p) {
        return h("line", { key: p, x1: 0, x2: w, y1: hgt * p, y2: hgt * p, stroke: "rgba(179,185,204,0.14)", strokeDasharray: "3 6" });
      }),
      h("path", { d: `${path} L${w} ${hgt} L0 ${hgt} Z`, fill: "url(#nightshift-area)" }),
      h("path", { d: path, fill: "none", stroke: "#c4b5fd", strokeWidth: 2.4, strokeLinecap: "round" })
    );
  }

  function SessionDetail(props) {
    const session = props.session;
    const fields = [
      ["Branch", session.branch],
      ["Started", session.started],
      ["Messages", String(session.messages)],
      ["Tokens", session.tokens.toLocaleString()],
      ["Cost", `$${session.cost.toFixed(2)}`, "success"],
      ["Last tool", session.lastTool, "accent"]
    ];
    return h(Panel, {
      title: session.name,
      subtitle: `${session.id} · ${session.agent}`,
      right: h(StatusPill, { state: session.state }, session.state)
    },
      h("div", { className: "nightshift-field-grid" }, fields.map(function (field) {
        return h("div", { className: cls("nightshift-field", field[2] && `is-${field[2]}`), key: field[0] },
          h("span", null, field[0]),
          h("strong", null, field[1])
        );
      })),
      h("div", { className: "nightshift-session-actions" },
        h(Button, null, "Open"),
        h(Button, { onClick: props.onTail }, "Tail"),
        h(Button, null, "Branch"),
        h(Button, { variant: "danger", onClick: props.onPause }, props.paused ? "Resume" : "Pause")
      )
    );
  }

  function AgentsPanel() {
    return h(Panel, { title: "Agents", subtitle: "Routing · last 5m" },
      h("div", { className: "nightshift-agent-list" }, DATA.agents.map(function (agent) {
        const tone = agent.state === "degraded" ? "danger" : agent.state === "warm" ? "warning" : "success";
        return h("div", { className: "nightshift-agent", key: agent.name },
          h("div", { className: "nightshift-agent__head" },
            h("strong", null, agent.name),
            h("span", null, `${agent.latency}ms`)
          ),
          h("div", { className: cls("nightshift-progress", `is-${tone}`) },
            h("span", { style: { width: `${Math.round(agent.load * 100)}%` } })
          )
        );
      }))
    );
  }

  function LogStream(props) {
    const rows = props.filter === "ALL" ? props.logs : props.logs.filter(function (row) { return row[1] === props.filter; });
    useEffect(function () {
      if (props.logRef && props.logRef.current) props.logRef.current.scrollTop = props.logRef.current.scrollHeight;
    }, [rows.length, props.logRef]);
    return h(Panel, {
      title: "Live logs",
      subtitle: `Tailing ${DATA.sessions.length} sessions`,
      className: "nightshift-panel--logs",
      right: h("div", { className: "nightshift-log-filters" }, ["ALL", "INFO", "WARN", "ERROR", "TOOL"].map(function (level) {
        return h("button", {
          key: level,
          type: "button",
          className: cls(level === props.filter && "is-active"),
          onClick: function () { props.onFilter(level); }
        }, level);
      }))
    },
      h("div", { className: "nightshift-logbox", ref: props.logRef }, rows.map(function (row, i) {
        return h("div", { className: cls("nightshift-logrow", `is-${row[1].toLowerCase()}`), key: `${i}-${row[0]}-${row[4]}` },
          h("span", null, row[0]),
          h("span", null, row[1]),
          h("span", null, row[2]),
          h("span", null, row[3]),
          h("span", null, row[4])
        );
      }))
    );
  }

  function NeedsEyesPanel() {
    const items = [
      ["danger", "ratelimit · gpt-5", "91% bucket · last hit 14s ago", "GPT-5 traffic is exceeding the org bucket; auto-fallback is armed for new sessions."],
      ["warning", "db.pg · vacuum slow", "session s_7e44 · 1m 12s", "Vacuum analyze on `sessions` is running 4× expected and may affect search latency."],
      ["info", "ctx · opus-4 hot", "session s_4b07 · 71%", "Theme implementation session is approaching compression threshold."],
    ];
    return h(Panel, { title: "Needs eyes", subtitle: "3 items" },
      h("div", { className: "nightshift-alert-list" }, items.map(function (item) {
        return h("article", { className: cls("nightshift-alert", `is-${item[0]}`), key: item[1] },
          h("div", { className: "nightshift-alert__title" }, h(StatusDot, { state: item[0] }), h("strong", null, item[1])),
          h("div", { className: "nightshift-alert__meta" }, item[2]),
          h("p", null, item[3])
        );
      }))
    );
  }

  function NightShiftPage() {
    const [selectedId, setSelectedId] = useState(DATA.sessions[0].id);
    const [logs, setLogs] = useState(DATA.logs);
    const [filter, setFilter] = useState("ALL");
    const [paused, setPaused] = useState(false);
    const [now, setNow] = useState(nowLabel());
    const counter = useRef(DATA.logs.length);
    const logRef = useRef(null);

    useEffect(function () {
      applyNightShift();
      const observer = new MutationObserver(function () {
        if (!document.documentElement.classList.contains("nightshift-ops")) applyNightShift();
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
      return function () { observer.disconnect(); };
    }, []);

    useEffect(function () {
      const timer = setInterval(function () { setNow(nowLabel()); }, 15000);
      return function () { clearInterval(timer); };
    }, []);

    useEffect(function () {
      if (paused) return undefined;
      const timer = setInterval(function () {
        counter.current += 1;
        setLogs(function (prev) {
          const next = prev.concat([makeLog(counter.current)]);
          return next.length > 80 ? next.slice(-80) : next;
        });
      }, 2600);
      return function () { clearInterval(timer); };
    }, [paused]);

    const selected = useMemo(function () {
      return DATA.sessions.find(function (session) { return session.id === selectedId; }) || DATA.sessions[0];
    }, [selectedId]);

    return h("div", { className: "nightshift-page" },
      h(Sidebar, { selectedId, onSelect: setSelectedId }),
      h("div", { className: "nightshift-main" },
        h(Header, { now, paused }),
        h("main", { className: "nightshift-content" },
          h("div", { className: "nightshift-metrics" },
            h(MetricCard, { label: "Active sessions", value: "4", delta: "+1 since 02:00", chart: h(MiniSpark, { series: DATA.tokenSeries.slice(-20), color: "#c4b5fd" }) }),
            h(MetricCard, { label: "Tokens / minute", value: "14,820", delta: "+12% vs avg", tone: "success", chart: h(MiniSpark, { series: DATA.tokenSeries.slice(-20).map(function (v) { return v * 1.08; }), color: "#86efac" }) }),
            h(MetricCard, { label: "Spend tonight", value: "$8.42", delta: "68% of budget", tone: "warning", chart: h(MiniSpark, { series: DATA.tokenSeries.slice(-20).map(function (v, i) { return v * 0.55 + i * 6; }), color: "#fcd34d" }) }),
            h(MetricCard, { label: "Errors (5m)", value: "2", delta: "ratelimit · db", tone: "danger", chart: h(MiniBars, { values: DATA.costSeries, color: "#fca5a5" }) })
          ),
          h("div", { className: "nightshift-grid nightshift-grid--two" },
            h(MainChart),
            h(SessionDetail, { session: selected, paused, onTail: function () { setFilter("ALL"); }, onPause: function () { setPaused(function (v) { return !v; }); } })
          ),
          h("div", { className: "nightshift-grid nightshift-grid--three" },
            h(AgentsPanel),
            h(LogStream, { logs, filter, onFilter: setFilter, logRef }),
            h(NeedsEyesPanel)
          )
        )
      )
    );
  }

  registry.register("nightshift-ops", NightShiftPage);
})();
