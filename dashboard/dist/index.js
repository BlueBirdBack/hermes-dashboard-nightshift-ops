(function () {
  "use strict";

  const SDK = window.__HERMES_PLUGIN_SDK__;
  if (!SDK || !window.__HERMES_PLUGINS__) return;

  const React = SDK.React;
  const { useEffect, useState } = SDK.hooks;
  const { Card, CardHeader, CardTitle, CardContent, Badge, Button, Separator } = SDK.components;
  const cn = SDK.utils.cn;

  const NIGHTSHIFT_VARS = {
    "--background": "color-mix(in srgb, #070a16 100%, transparent)",
    "--background-base": "#070a16",
    "--background-alpha": "1",
    "--midground": "color-mix(in srgb, #edf3ff 100%, transparent)",
    "--midground-base": "#edf3ff",
    "--midground-alpha": "1",
    "--foreground": "color-mix(in srgb, #86e7ff 22%, transparent)",
    "--foreground-base": "#86e7ff",
    "--foreground-alpha": "0.22",
    "--warm-glow": "rgba(255, 179, 71, 0.18)",
    "--noise-opacity-mul": "0.76",
    "--color-foreground": "#edf3ff",
    "--color-card": "color-mix(in srgb, #79a4ff 8%, #070a16)",
    "--color-card-foreground": "#edf3ff",
    "--color-primary": "#8deaff",
    "--color-primary-foreground": "#070a16",
    "--color-secondary": "color-mix(in srgb, #607bff 8%, #070a16)",
    "--color-secondary-foreground": "#d9e3ff",
    "--color-muted": "color-mix(in srgb, #3f5ae0 10%, #070a16)",
    "--color-muted-foreground": "#97a5cf",
    "--color-accent": "color-mix(in srgb, #78a2ff 12%, #070a16)",
    "--color-accent-foreground": "#edf3ff",
    "--color-destructive": "#ff6b88",
    "--color-destructive-foreground": "#fff5f8",
    "--color-success": "#5ef0b2",
    "--color-warning": "#ffb454",
    "--color-border": "rgba(125, 149, 255, 0.24)",
    "--color-input": "rgba(125, 149, 255, 0.22)",
    "--color-ring": "#86e7ff",
    "--color-popover": "rgba(9, 12, 28, 0.96)",
    "--color-popover-foreground": "#edf3ff"
  };

  let applying = false;

  function applyNightShift() {
    if (applying) return;
    applying = true;
    const root = document.documentElement;
    root.classList.add("nightshift-ops");
    root.setAttribute("data-nightshift-ops", "active");
    for (const [key, value] of Object.entries(NIGHTSHIFT_VARS)) {
      if (root.style.getPropertyValue(key).trim() !== value) {
        root.style.setProperty(key, value);
      }
    }
    applying = false;
  }

  applyNightShift();

  const observer = new MutationObserver(function () {
    if (applying) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(NIGHTSHIFT_VARS)) {
      if (root.style.getPropertyValue(key).trim() !== value) {
        applyNightShift();
        return;
      }
    }
    if (!root.classList.contains("nightshift-ops")) {
      applyNightShift();
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style", "class"],
  });

  window.addEventListener("beforeunload", function () {
    observer.disconnect();
  }, { once: true });

  const WORKFLOWS = [
    {
      title: "Logs that stay readable",
      copy: "Warnings, errors, and live tails pop instantly without blowing out the entire screen.",
      href: "/logs",
      cta: "Open logs",
    },
    {
      title: "Session hunting",
      copy: "Dense cards, crisp borders, and calm contrast help you scan titles, sources, and live state fast.",
      href: "/sessions",
      cta: "Open sessions",
    },
    {
      title: "Config marathons",
      copy: "Inputs, toggles, and tab rails keep enough edge contrast to survive long setup sessions at 2am.",
      href: "/config",
      cta: "Open config",
    },
  ];

  const PALETTE = [
    { label: "Canvas", value: "#070A16", className: "nightshift-palette-canvas" },
    { label: "Signal", value: "#86E7FF", className: "nightshift-palette-signal" },
    { label: "Focus", value: "#7D95FF", className: "nightshift-palette-focus" },
    { label: "Warning", value: "#FFB454", className: "nightshift-palette-warning" },
  ];

  function jump(href) {
    window.location.assign(href);
  }

  function StatCard(props) {
    return React.createElement("div", { className: cn("nightshift-stat", props.tone && `nightshift-stat--${props.tone}`) },
      React.createElement("span", { className: "nightshift-stat__label" }, props.label),
      React.createElement("span", { className: "nightshift-stat__value" }, props.value),
    );
  }

  function WorkflowCard(item) {
    return React.createElement("div", { className: "nightshift-workflow", key: item.title },
      React.createElement("div", { className: "nightshift-workflow__eyebrow" }, "workflow"),
      React.createElement("h3", { className: "nightshift-workflow__title" }, item.title),
      React.createElement("p", { className: "nightshift-workflow__copy" }, item.copy),
      React.createElement(Button, {
        onClick: function () { jump(item.href); },
        className: "nightshift-button",
      }, item.cta),
    );
  }

  function PaletteChip(item) {
    return React.createElement("div", { className: "nightshift-chip", key: item.label },
      React.createElement("span", { className: cn("nightshift-chip__swatch", item.className) }),
      React.createElement("div", { className: "nightshift-chip__meta" },
        React.createElement("span", { className: "nightshift-chip__label" }, item.label),
        React.createElement("code", { className: "nightshift-chip__value" }, item.value),
      ),
    );
  }

  function NightShiftPage() {
    const [status, setStatus] = useState(null);

    useEffect(function () {
      let cancelled = false;
      applyNightShift();
      if (!SDK.api || !SDK.api.getStatus) return function () { cancelled = true; };
      SDK.api.getStatus()
        .then(function (resp) {
          if (!cancelled) setStatus(resp);
        })
        .catch(function () {});
      return function () { cancelled = true; };
    }, []);

    const stats = [
      {
        label: "Active sessions",
        value: status ? String(status.active_sessions) : "…",
        tone: "signal",
      },
      {
        label: "Gateway",
        value: status ? (status.gateway_running ? "Live" : "Idle") : "…",
        tone: status && status.gateway_running ? "success" : "warning",
      },
      {
        label: "Hermes",
        value: status && status.version ? `v${status.version}` : "local",
        tone: "focus",
      },
      {
        label: "Install mode",
        value: "theme + plugin",
        tone: "muted",
      },
    ];

    return React.createElement("div", { className: "nightshift-page" },
      React.createElement(Card, { className: "nightshift-hero-card" },
        React.createElement(CardHeader, { className: "nightshift-hero-card__header" },
          React.createElement("div", { className: "nightshift-kicker-row" },
            React.createElement("span", { className: "nightshift-kicker" }, "night shift ops"),
            React.createElement("div", { className: "nightshift-badge-row" },
              React.createElement(Badge, { variant: "outline", className: "nightshift-outline-badge" }, "theme active"),
              React.createElement(Badge, { variant: "outline", className: "nightshift-outline-badge" }, "zero-build"),
              React.createElement(Badge, { variant: "outline", className: "nightshift-outline-badge" }, "2am ready"),
            ),
          ),
          React.createElement(CardTitle, { className: "nightshift-hero-title" },
            "A dashboard lens for log triage, session scanning, and late-night config work."
          ),
        ),
        React.createElement(CardContent, { className: "nightshift-hero-content" },
          React.createElement("p", { className: "nightshift-hero-copy" },
            "Deep navy canvas, cold signal blues, controlled amber warnings, and enough structure to keep your eyes locked on the important stuff instead of the chrome."
          ),
          React.createElement("div", { className: "nightshift-stat-grid" }, stats.map(function (item) {
            return React.createElement(StatCard, Object.assign({ key: item.label }, item));
          })),
          React.createElement("div", { className: "nightshift-action-row" },
            React.createElement(Button, {
              onClick: function () { jump("/logs"); },
              className: "nightshift-button nightshift-button--primary",
            }, "open logs"),
            React.createElement(Button, {
              onClick: function () { jump("/sessions"); },
              className: "nightshift-button",
            }, "open sessions"),
            React.createElement(Button, {
              onClick: function () { jump("/config"); },
              className: "nightshift-button",
            }, "open config"),
          ),
        ),
      ),

      React.createElement("div", { className: "nightshift-grid" },
        React.createElement(Card, { className: "nightshift-panel" },
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, { className: "nightshift-panel__title" }, "Where it helps most"),
          ),
          React.createElement(CardContent, { className: "nightshift-workflow-grid" },
            WORKFLOWS.map(function (item) {
              return React.createElement(WorkflowCard, Object.assign({ key: item.title }, item));
            }),
          ),
        ),

        React.createElement(Card, { className: "nightshift-panel" },
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, { className: "nightshift-panel__title" }, "Signal palette"),
          ),
          React.createElement(CardContent, { className: "nightshift-panel-stack" },
            React.createElement("div", { className: "nightshift-chip-grid" }, PALETTE.map(function (item) {
              return React.createElement(PaletteChip, Object.assign({ key: item.label }, item));
            })),
            React.createElement(Separator, { className: "nightshift-separator" }),
            React.createElement("div", { className: "nightshift-note-block" },
              React.createElement("div", { className: "nightshift-note-block__eyebrow" }, "installation"),
              React.createElement("pre", { className: "nightshift-codeblock" }, "git clone https://github.com/BlueBirdBack/hermes-dashboard-nightshift-ops.git ~/.hermes/plugins/nightshift-ops\nhermes dashboard"),
            ),
            React.createElement("ul", { className: "nightshift-list" },
              React.createElement("li", null, "Live badges and warnings stand out without flooding the whole surface."),
              React.createElement("li", null, "Inputs and borders keep their edges during long config sessions."),
              React.createElement("li", null, "Cards get a restrained glass treatment instead of neon soup."),
            ),
          ),
        ),
      ),
    );
  }

  window.__HERMES_PLUGINS__.register("nightshift-ops", NightShiftPage);
})();
