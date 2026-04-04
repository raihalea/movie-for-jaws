# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JAWS-UG Lightning Talk イベント用の動画を自動生成する Remotion プロジェクト。イベント情報（タイトル、登壇者、ハッシュタグなど）を JSON props として渡すと、1920x1080 / 30fps の MP4 動画をレンダリングする。

## Commands

- `npm run dev` — Remotion Studio を起動してプレビュー（ブラウザでリアルタイム確認）
- `npm run lint` — ESLint + TypeScript 型チェック (`eslint src && tsc`)
- `npm run build` — `remotion render JawsUgLT` でビルド
- `./render.sh` — Docker 経由で `sample-props.json` を使い `out/video.mp4` にレンダリング（初回はイメージを自動ビルド）
- `./render.sh samples/sample-neon-green.json out/custom.mp4` — props ファイルと出力先を指定してレンダリング

## Architecture

**Composition 構成** (`src/compositions/JawsUgLT.tsx`):
`TransitionSeries` で以下のシーンを順番に表示する。各シーン間は fade / slide トランジションで接続。

Intro → Title → Speaker×N → Hashtag → License(optional)

**動的メタデータ** (`src/Root.tsx`):
`calculateMetadata` が BGM ファイルから実際の音声長を取得し、Composition の `durationInFrames` と props の `musicDurationInSeconds` を動的に設定する。Studio プレビューでは `defaultProps` が使われる。

**シーン間のタイミング制御** (`src/utils/timing.ts`):
`calculateSceneDurations()` が `musicDurationInSeconds` を元に全体フレーム数を計算し、固定シーン（Intro 3s, Title 4s, Hashtag 3s, License 3s）を除いた残りを Speaker シーン群に均等配分する。トランジション長は固定 15 フレーム（0.5s）。

**テーマシステム** (`src/utils/theme.ts`, `src/types.ts`):
グローバル `theme` とシーン別 `*Theme` override を `resolveTheme()` でマージ（`DEFAULT_THEME → theme → sceneTheme`）。`ColorTheme` は backgroundColor, accentColor, textColor, mutedTextColor, gradientFrom, gradientTo の6色。

**フォント** (`src/utils/font.ts`):
`@remotion/google-fonts` で Noto Sans JP をウェイト 700/900 のみロード。エクスポートされる `fontFamily` を全コンポーネントで使用する。

**アニメーション** (`src/components/common/animations.tsx`):
共通アニメーションコンポーネント（FadeIn, SlideUp, ScaleIn）。各シーンは `effect` prop でアニメーションバリエーションを切り替える。各エフェクト型（IntroEffect, TitleEffect, SpeakerEffect, HashtagEffect, LicenseEffect）は `src/types.ts` で定義。

**Props の入力**:
- `sample-props.json` — ルートにあるサンプル props ファイル
- `samples/` — テーマバリエーションのサンプル
- `Root.tsx` の `defaultProps` — Studio プレビュー用デフォルト値
- GitHub Actions (`render.yml`) の workflow_dispatch で props_json を直接渡すか、sample-props.json をベースに event_title / hashtag を上書き可能

**ローカルレンダリング** (`render.sh`, `Dockerfile`):
Docker コンテナ内で Remotion レンダリングを実行。Chromium 依存ライブラリと `fonts-noto-cjk` を含む。`render.sh` がイメージのビルド・props のマウント・出力ディレクトリの作成を自動で行う。

**静的アセット** (`public/`):
BGM ファイル（`bgm.mp3`）や `speaker-placeholder.svg` など。`staticFile()` で参照。
