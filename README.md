# Hermes Dashboard Theme: Night Shift Ops

A high-contrast **Hermes Agent dashboard theme** for late-night sessions, log triage, and session hunting.

**Night Shift Ops** is tuned for the hackathon brief: *ADHD command center / 2am ops dashboard* — fast scanning, bright signal colors, readable dense surfaces, and just enough glow to feel alive without turning the dashboard into a toy.

## What ships

This repo ships two pieces:

- `theme/nightshift-ops.yaml` — the actual **custom dashboard theme** for the Hermes theme picker
- `dashboard/` — an optional lightweight plugin that adds a `/nightshift` showcase tab and reinforces the visual treatment across the dashboard

The theme is the main deliverable. The plugin is there to make the entry more demonstrable and easier to preview.

## Design goals

- **High signal density** for logs, sessions, and config marathons
- **Readable contrast** on dark surfaces
- **Clear state colors** for live, warning, destructive, and interactive UI
- **Memorable look** without sacrificing utility

## Screenshots

### Status / overview
![Night Shift Ops status view](screenshots/nightshift-status.png)

### Theme page / palette overview
![Night Shift Ops plugin page](screenshots/nightshift-plugin-page.png)

## Install

### Recommended

```bash
git clone https://github.com/BlueBirdBack/hermes-dashboard-nightshift-ops.git
cd hermes-dashboard-nightshift-ops
./install.sh
hermes dashboard
```

Then open the theme picker in the dashboard header and choose **Night Shift Ops**.

### Manual install

```bash
git clone https://github.com/BlueBirdBack/hermes-dashboard-nightshift-ops.git ~/.hermes/plugins/nightshift-ops
mkdir -p ~/.hermes/dashboard-themes
cp ~/.hermes/plugins/nightshift-ops/theme/nightshift-ops.yaml ~/.hermes/dashboard-themes/nightshift-ops.yaml
hermes dashboard
```

## Use

1. Open the Hermes dashboard.
2. Pick **Night Shift Ops** from the theme switcher.
3. Open the **Night Shift** tab for the built-in preview / quick links.

## Files

```text
nightshift-ops/
├── plugin.yaml
├── install.sh
├── theme/
│   └── nightshift-ops.yaml
├── dashboard/
│   ├── manifest.json
│   └── dist/
│       ├── index.js
│       └── style.css
└── screenshots/
```

## Notes

- Zero build step for the theme itself — the theme is plain YAML and the plugin is plain JS + CSS.
- The optional plugin applies a stronger surface treatment so the repo looks great immediately in screenshots.
- Remove the theme by deleting `~/.hermes/dashboard-themes/nightshift-ops.yaml` and unlinking `~/.hermes/plugins/nightshift-ops`.

## License

MIT
