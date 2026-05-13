# Hermes Dashboard Themes

[中文](README.md)

Themes for the **Hermes Agent Web Dashboard**.

Included:

- `AskClaw ADHD`: light, low-distraction, blue-accent theme. Its colors come from the AskClaw chat UI before commit `7843bbd`.
- `Night Shift Ops`: dark ops theme for late-night sessions, logs, models, cost, and triage.
- `Night Shift` plugin page: optional dashboard tab, no build step required.

## Install

```bash
git clone https://github.com/BlueBirdBack/hermes-dashboard-nightshift-ops.git
cd hermes-dashboard-nightshift-ops
./install.sh
```

The installer:

- links the plugin to `~/.hermes/plugins/nightshift-ops`
- copies all themes to `~/.hermes/dashboard-themes/`

## Use AskClaw ADHD

```bash
hermes config set dashboard.theme askclaw-adhd
hermes dashboard
```

Open the dashboard URL printed by Hermes.

You can also choose **AskClaw ADHD** from the dashboard theme switcher.

## Use Night Shift Ops

```bash
hermes config set dashboard.theme nightshift-ops
hermes dashboard
```

The **Night Shift** sidebar item is the plugin page.

## VPS usage

On the server:

```bash
hermes dashboard --host 127.0.0.1 --port 9123 --no-open
```

On your laptop:

```bash
ssh -L 9123:127.0.0.1:9123 root@YOUR_SERVER_IP
```

Then open:

```text
http://127.0.0.1:9123
```

## Remove

```bash
rm -f ~/.hermes/dashboard-themes/askclaw-adhd.yaml
rm -f ~/.hermes/dashboard-themes/nightshift-ops.yaml
rm -f ~/.hermes/plugins/nightshift-ops
hermes config set dashboard.theme default
```

## Files

```text
theme/askclaw-adhd.yaml      # AskClaw-style theme
theme/nightshift-ops.yaml    # dark ops theme
dashboard/                   # Night Shift plugin
install.sh                   # installer
```

## License

MIT
