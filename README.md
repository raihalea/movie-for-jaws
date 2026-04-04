# movie-for-jaws

JAWS-UG Lightning Talk イベント用の動画を自動生成するツール。[Remotion](https://www.remotion.dev/) を使用。

イベント情報（タイトル、登壇者、ハッシュタグなど）を JSON で渡すと、1920x1080 / 30fps の MP4 動画を生成します。

## 動画の構成

```
Intro → Title → Speaker×N → Hashtag → License(optional)
```

各シーン間は fade / slide トランジションで接続され、BGM の長さに合わせて全体の尺が自動調整されます。

## 必要なもの

- [Docker](https://docs.docker.com/get-docker/)

## 使い方

### 動画をレンダリングする

```bash
# sample-props.json を使ってレンダリング（出力: out/video.mp4）
./render.sh

# props ファイルを指定
./render.sh samples/sample-neon-green.json

# props ファイルと出力先を指定
./render.sh my-event.json out/my-event.mp4
```

初回実行時に Docker イメージが自動でビルドされます。

### Remotion Studio でプレビューする

```bash
npm install
npm run dev
```

ブラウザでリアルタイムプレビューしながら調整できます。

### GitHub Actions でレンダリングする

Actions タブから「Render Video」ワークフローを手動実行できます。

- `props_json`: 完全な JSON props を直接指定
- `event_title` / `hashtag`: `sample-props.json` をベースに個別フィールドを上書き

出力動画は Artifacts としてダウンロードできます（30日間保持）。

## Props の設定

`sample-props.json` をコピーして編集してください。

| フィールド | 必須 | 説明 |
|---|---|---|
| `eventTitle` | Yes | イベントタイトル |
| `chapterName` | Yes | 支部名 |
| `eventDate` | No | 開催日（例: `"2025-01-15"`） |
| `speakers` | Yes | 登壇者グループの配列 |
| `hashtag` | Yes | ハッシュタグ（例: `"#jawsug_tokyo"`） |
| `musicLicense` | No | BGM のライセンス情報（省略するとライセンスシーンなし） |
| `musicUrl` | No | `public/` 内の BGM ファイル名 |
| `theme` | No | グローバルカラーテーマ（6色） |
| `*Effect` | No | 各シーンのアニメーション種類 |
| `*Theme` | No | シーン別カラーテーマの上書き |

### サンプル props

| ファイル | 説明 |
|---|---|
| `sample-props.json` | デフォルト |
| `samples/sample-warm-sunset.json` | 暖色テーマ + typewriter/wipeIn エフェクト |
| `samples/sample-neon-green.json` | ネオングリーンテーマ |
| `samples/sample-per-scene-theme.json` | シーンごとに異なるテーマ |
| `samples/sample-no-license.json` | ライセンスシーンなし |

### 静的アセット

`public/` ディレクトリに BGM ファイル（`.mp3`）やスピーカー画像を配置してください。props 内では `"musicUrl": "bgm.mp3"` のようにファイル名で参照します。
