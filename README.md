# GAdmin 游戏管理工具使用手册

## 概述
GAdmin 是一个用于管理游戏库的命令行工具，支持添加、删除、查询和启动游戏等功能。它帮助你高效地维护游戏资源，并提供灵活的配置选项。

### 版本信息
版本号: 1.0.0

---

## 安装指南
要在系统中安装 GAdmin，请按照以下步骤操作：

### 系统要求
- Node.js (建议使用版本 6 或更高)
- npm 包管理器

### 安装方法
在终端运行以下命令：

```bash
npm install gadmin -g
```

这将全局 installs GAdmin，允许你在任何位置通过命令行使用 `gadmin`。

---

## 使用方法
GAdmin 工具的命令可以通过以下格式执行：

```bash
gadmin <command> [options]
```

其中 `<command>` 是具体的子命令，如 `list`, `scan`, 等等，[options] 是各个命令支持的选项参数。

### 可用子命令
| 子命令     | 描述                     |
|------------|--------------------------|
| list       | 列出游戏库中的游戏       |
| scan       | 扫描指定目录下的游戏     |
| search     | 根据关键字搜索游戏       |
| modify     | 修改游戏信息             |
| start      | 启动游戏                 |
| remove     | 从游戏库中移除游戏       |

---

## 子命令详细说明

### 1. `list` - 列出游戏库中的游戏
显示当前游戏库中的所有游戏，支持分页显示或列出所有游戏。

#### 用法
```bash
gadmin list [options]
```

#### 可选选项
- `-a, --all`：显示所有游戏记录（不分页）
- `--page <number>`：指定查看的页数，默认为第一页
- `--limit <number>`：每页显示的游戏数量，默认为 10

#### 示例
- 显示所有游戏：
```bash
gadmin list --all
```

- 分页显示，每页5条记录：
```bash
gadmin list --limit=5 --page=3
```

---

### 2. `scan` - 扫描指定目录下的游戏
扫描目标目录，发现并记录其中的游戏。默认处理多个游戏，若文件夹中只有一个游戏，则视为单个。

#### 用法
```bash
gadmin scan [options]
```

#### 必要参数
- `-p, --path <string>`：指定需要扫描的路径

#### 可选选项
- `--single`：强制将路径下的内容视为单个游戏（不论文件夹中有多少）

#### 示例
- 扫描默认游戏目录：
```bash
gadmin scan --path=./games
```

- 强制认为是单个游戏：
```bash
gadmin scan --path=./mygame --single
```

---

### 3. `search` - 根据关键字搜索游戏
根据指定的关键字，在游戏名称中进行搜索。

#### 用法
```bash
gadmin search [options]
```

#### 必要参数
- `-k, --keyword <string>`：必须的，指定搜索的关键字

#### 可选选项
- `-j, --json`：返回结果为 JSON 格式

#### 示例
- 搜索关键字 "新开传奇":
```bash
gadmin search --keyword="新开传奇"
```

- 返回 JSON 格式：
```bash
gadmin search --keyword="新开传奇" --json
```

---

### 4. `modify` - 修改游戏信息
根据指定的游戏名称或 ID，修改游戏的信息，如环境变量和启动参数。

#### 用法
```bash
gadmin modify [options]
```

#### 参数选项
- `-i, --id <number>`：指定要修改的游戏 ID
- `-n, --name <string>`：指定要修改的游戏名称

#### 操作选项
- `--env <key>=<value>`：添加或更新环境变量
- `--param <key>=<value>`：添加或更新启动参数

#### 示例
- 修改游戏 "新开传奇" 的环境变量：
```bash
gadmin modify --name="新开传奇" --env=SERVER_ADDRESS=localhost --env=DB_NAME=testdb
```

---

### 5. `start` - 启动游戏
根据指定的游戏名称或 ID，启动相应的游戏。

#### 用法
```bash
gadmin start [options]
```

#### 参数选项
- `-i, --id <number>`：指定要启动的游戏 ID（可选）
- `-n, --name <string>`：指定要启动的游戏名称（可选）

#### 环境与参数选项
- `--env <value>`：设置环境变量值，可重复使用以设置多个变量
- `--param <value>`：设置启动参数值，可重复使用以设置多个参数
- `--replace-env`：覆盖库中记录的环境变量
- `--replace-param`：覆盖库中记录的启动参数

#### 示例
- 启动游戏并带自定义环境变量：
```bash
gadmin start --id=12345 --env=DEBUG=true --replace-env
```

---

### 6. `remove` - 移除游戏
从游戏库中删除指定的游戏。

#### 用法
```bash
gadmin remove [options]
```

#### 参数选项
- `-i, --id <number>`：指定要删除的游戏 ID（可选）
- `-n, --name <string>`：指定要删除的游戏名称（可选）

#### 示例
- 删除游戏 "新开传奇":
```bash
gadmin remove --name="新开传奇"
```

---

## 帮助信息
如果需要查看具体命令的帮助信息，可以直接运行：

```bash
gadmin <command> --help
```

这将显示对应子命令的使用说明和选项。

---

## 示例用例
### 1. 列出所有游戏：
```bash
gadmin list --all
```

### 2. 扫描并记录新游戏：
```bash
gadmin scan --path=/mnt/gamedir
```

### 3. 搜索游戏：
```bash
gadmin search --keyword=仙侠
```

### 4. 修改游戏配置以启动：
```bash
gadmin modify --id=123 --env=VERBOSE=true
```

### 5. 启动游戏：
```bash
gadmin start --name="新开传奇" --param=X_RESOLUTION=800
```

---

## 注意事项
- **权限问题**：运行命令时，确保拥有对目标路径的读写权限。
- **环境变量覆盖**：使用 `--replace-env` 和 `--replace-param` 选项需谨慎，避免误操作导致游戏无法启动。

希望以上说明能够帮助你顺利使用 GAdmin 工具！
