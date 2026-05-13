# Hermes Dashboard 主题

[English](README.en.md)

这是给 **Hermes Agent Web Dashboard** 用的主题包。

包含：

- `AskClaw ADHD`：浅色、低干扰、蓝色强调色。配色来自 AskClaw 在 `7843bbd` 之前的聊天界面。
- `Night Shift Ops`：深色运维风格，适合夜间看日志、会话、模型、成本和告警。
- `Night Shift` 插件页：可选的 dashboard tab，无需构建。

## 安装

```bash
git clone https://github.com/BlueBirdBack/hermes-dashboard-nightshift-ops.git
cd hermes-dashboard-nightshift-ops
./install.sh
```

安装脚本会：

- 把插件链接到 `~/.hermes/plugins/nightshift-ops`
- 把所有主题复制到 `~/.hermes/dashboard-themes/`

## 使用 AskClaw ADHD

```bash
hermes config set dashboard.theme askclaw-adhd
hermes dashboard
```

打开 Hermes 打印出来的 dashboard 地址。

也可以在 dashboard 右下角主题切换器里选择 **AskClaw ADHD**。

## 使用 Night Shift Ops

```bash
hermes config set dashboard.theme nightshift-ops
hermes dashboard
```

侧边栏里的 **Night Shift** 是插件页。

## VPS 用法

服务器上运行：

```bash
hermes dashboard --host 127.0.0.1 --port 9123 --no-open
```

本地开 SSH 隧道：

```bash
ssh -L 9123:127.0.0.1:9123 root@YOUR_SERVER_IP
```

然后打开：

```text
http://127.0.0.1:9123
```

## 卸载

```bash
rm -f ~/.hermes/dashboard-themes/askclaw-adhd.yaml
rm -f ~/.hermes/dashboard-themes/nightshift-ops.yaml
rm -f ~/.hermes/plugins/nightshift-ops
hermes config set dashboard.theme default
```

## 文件

```text
theme/askclaw-adhd.yaml      # AskClaw 风格主题
theme/nightshift-ops.yaml    # 夜间运维主题
dashboard/                   # Night Shift 插件
install.sh                   # 安装脚本
```

## License

MIT
