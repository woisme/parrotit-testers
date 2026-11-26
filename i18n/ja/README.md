<div align="center">

<img src="../../assets/logo.svg" alt="" width="96" height="96">

# mobile-agent-testers

**20 人の AI テスターが、20 台の異なるスマートフォンで、GitHub の無料ランナー上で同時にテスト。**

[![Tests](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml/badge.svg)](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml)
[![Stars](https://img.shields.io/github/stars/pierridotite/mobile-agent-testers?style=flat)](https://github.com/pierridotite/mobile-agent-testers/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)
![iOS + Android](https://img.shields.io/badge/platforms-iOS%20%2B%20Android-blue)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)

**[適用例](docs/examples.md)** · **[ダッシュボードのデモ](https://pierridotite.github.io/mobile-agent-testers/)** · **[比較](../../docs/compare.md)** · **[よくある質問](docs/faq.md)** · **[ペルソナ](../../personas.json)** · **[コントリビュート](../../CONTRIBUTING.md)**

<sub>[English](../../README.md) · [简体中文](../zh-CN/README.md) · 日本語 · [Español](../es/README.md) · [Português](../pt-BR/README.md) · [Tiếng Việt](../vi/README.md) · [Türkçe](../tr/README.md)</sub>

<a href="https://www.linkedin.com/in/pierre-raffalli/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/linkedin-follow-dark.svg"><img src="../../assets/linkedin-follow-light.svg" alt="Follow Pierre Raffalli on LinkedIn" width="160" height="54"></picture></a>
<a href="https://discord.gg/WuaCANscr8"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/discord-join-dark.svg"><img src="../../assets/discord-join-light.svg" alt="Join us on Discord" width="160" height="54"></picture></a><br>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily?language=Python" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>

<sub>このページは英語版の翻訳です。更新が遅れることがあるため、最新の内容は [README.md](../../README.md) をご覧ください。</sub>

</div>

<p align="center"><a href="../../assets/launch-video.mp4"><img src="../../assets/launch-video.gif" alt="ローンチ動画（26 秒）。まず、20 人の AI テスターが同時に LocalSend を使う実際の画面録画：Android エミュレーター 10 台と iOS シミュレーター 10 台、14 言語。各端末に報告した問題の数が表示され、合計 103 件。続いて、デモアプリのダッシュボードのマップ：全画面、テスターごとの色のレーン、テストになるバグ、モデルなしで再生される経路。クリックで音声付きの動画を開きます。" width="100%"></a><br>
<sub>端末の映像は LocalSend での実行の実際の画面録画、マップは<a href="../../demo-app/">デモアプリ</a>のダッシュボードです。 <a href="../../assets/launch-video.mp4">音声付き動画（MP4）</a> · <a href="../../assets/localsend-20.mp4">20 台の端末の録画全体</a> · <a href="../../docs/runs/localsend-20.md">端末ごとの実行記録</a></sub></p>

テストスクリプトを書く必要はありません。各テスターは Claude Code のエージェントで、GitHub Actions 上に
自分専用の iOS シミュレーターまたは Android エミュレーターを持ちます。ペルソナ（スウェーデン語で文字サイズ最大の
iPhone SE、フォント 200% の Pixel 7、ドイツ語の iPad、右から左に読むアラビア語……）を演じ、新しいユーザーとして
アプリを使い（または指定した機能を試し）、スクリーンショット付きのバグレポートを書きます。Flutter、React Native、Expo、ネイティブの Kotlin と
Swift、Kotlin Multiplatform、Capacitor、.NET MAUI に対応しています。

公開リポジトリなら GitHub のランナーは無料です。費用はモデルの利用料だけで、Claude のサブスクリプションか
API キーを使います。[これまでの実行](../../docs/runs/)では 1 台あたり約 0.15〜0.55 ドルでした。

## クイックスタート

```bash
gh repo create my-testers --public --template pierridotite/mobile-agent-testers --clone
cd my-testers && ./setup.sh           # 鍵ペア + シークレット + Claude トークン（Windows：.\setup.ps1）
gh workflow run agent-testers.yml     # デモ：Android 2 + iOS 2 のテスター、約 20 分
bash scripts/collect.sh <run id>      # レポートを復号して重複をまとめる：runs/<id>/SUMMARY.md
```

次に、自分のアプリで：

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

または、Claude にあなたのアプリ用のセットアップを任せることもできます：

```
/plugin marketplace add pierridotite/mobile-agent-testers
/plugin install mobile-agent-testers@mobile-agent-testers
```

すべての入力（ビルド、指示書、バグの再現、安いモデル、ビルド引数、動画）と対応フレームワーク：[docs/configuration.ja.md](docs/configuration.md)

<details>
<summary>デモ実行で見つかるもの</summary>

デモアプリには[わざと仕込んだバグが 11 個](../../demo-app/BUGS.md)あります。[ある実行](../../docs/runs/)では、4 人のデモテスターがそのうち 9 個を見つけ（エージェントごとに 2〜7 分、ビルドを含めて全体で約 21 分）、さらに誰も仕込んでいない本物の問題（Android のナビゲーションバーの下に隠れたボタン、再起動するとデータが残っていない）も見つけました。モデル使用量：4 人で 0.87 ドル。

</details>

## できること

各ペルソナが新しいユーザーとしてアプリを探索し、妨げになったことを番号付きのスクリーンショットとともに報告します。ほかに、1 つの機能を最初から最後まで試す、バグ報告を再現する、改善レポートを作る、2 つのバージョンを比較する、ウェブサイトをスマホで試す、といった使い方もできます。1 回の実行で 1 つの使い方。上のパラメーターで選びます。

<details>
<summary>6 つの使い方を 1 つずつ</summary>

| 使い方 | 得られるもの |
|---|---|
| **新しいユーザーとして探索** （デフォルト） | 各ペルソナが自分の目標を達成しようとし、妨げになったことを番号付きのスクリーンショットとともに報告します。 |
| **1 つの機能を最初から最後まで試す** | 自分で書いた brief で、各エージェントに 1 つの仕組みを通しで試させます。複数ステップの予約、元に戻せるエディター、2 つの画面間の同期などです。エージェントはタップ、長押し、スワイプ、入力ができ、アプリを離れて戻ったり、再起動して保存内容を確かめたり、ディープリンクで目的の機能から直接始めたりします。brief では約 30 操作という上限を増やすこともできます。[AnkiDroid 用の brief](../../briefs/ankidroid.md) では、新しいカードの裏面の入力欄がキーボードに隠れることが見つかりました。 |
| **バグ報告をすべての端末で再現** | Issue か手順を渡すと、各エージェントが「再現した / しなかった / はっきりしない」をスクリーンショット付きで答えます（[briefs/reproduce.md](../../briefs/reproduce.md)）。 |
| **改善レポートを作る** | 各ペルソナがアプリを一度使い、どこで迷ったか、何を期待していたか、まず何を変えるべきかを、領域と影響度つきで挙げます（[briefs/improve.md](../../briefs/improve.md)）。 |
| **2 つのバージョンを比較する** | 同じペルソナで 2 つのブランチやビルドを試し、目標の達成、操作数、スコア、片方のバージョンだけで見つかった問題を 1 つの表にまとめます（[docs/compare-versions.md](../../docs/compare-versions.md)）。本物の A/B テストの前のチェックであり、その代わりにはなりません。 |
| **ウェブサイトをスマホで試す** | 同じペルソナがスマホのブラウザで、どんなサイトやウェブアプリでも試します。無料の Linux ランナーで動きます（[設定](docs/configuration.md)）。 |

</details>

**安いモデルを使う**：Claude Haiku、または Anthropic 互換の API（OpenRouter、DeepSeek、Kimi、GLM、MiniMax、Qwen）。見つかるものの質は、モデルがスクリーンショットをどれだけ正しく読めるかと推論力で決まります（[docs/cheaper-models.md](../../docs/cheaper-models.md)）。

Maestro や Appium はあなたが書いたテストを実行します。このエージェントたちは、誰もテストしようと思わなかったところを探します（[比較](../../docs/compare.md)）。

## 全画面を 1 枚のマップで見る

<a href="https://pierridotite.github.io/mobile-agent-testers/"><img src="../../assets/dashboard.png" alt="ダッシュボード：アプリの全画面を1枚のマップに表示し、各矢印にテスターごとの色のレーン、各画面にヒートマップ、右側に選択中の画面" width="100%"></a>

テスターがたどり着いたすべての画面を、テスターごとに色分けした経路と、タップした場所のヒートマップ付きで表示します。Device メニューでデバイスを選ぶと、その形（スマートフォンかタブレット）の画面と専用のヒートマップが見られます。画面にコメントしたり、画面上の問題をチェックに変えたりできます。

<p align="center"><a href="https://pierridotite.github.io/mobile-agent-testers/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/demo-try-dark.svg"><img src="../../assets/demo-try-light.svg" alt="ブラウザでデモを試す" width="190" height="54"></picture></a></p>

自分の実行結果では：`python3 scripts/dashboard.py runs/<id>`。手元のマシンで動き、結果がマシンの外に出ることはありません（[docs/dashboard.md](../../docs/dashboard.md)）。

## 見つけたバグがそのままテストになる

バグを見つけたテスターは、どのスクリプトも書かなかった経路をたどっています。Android の各テスターはその経路をトレースとして残し、各タップは指の下にあった要素の名前で記録されます。`-f replay_path=true` を付けると、エージェントの終了直後に同じ端末でモデルなしで経路を再生します。マップで追加したチェックでバグがテストの一部になり、バグが残っている間は再生結果が `bug`、直ると `fixed` になります（[docs/replay.md](../../docs/replay.md)）。

トレースは Explore-Compile-Replay に従います。エージェントの経路を [Maestro](https://maestro.dev) のフローにコンパイルする、私が作っているオープンな形式です。今は Android のみで、ECR はまだ初期ドラフトです。

<p align="center"><a href="https://github.com/pierridotite/explore-compile-replay"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/ecr-button-dark.svg"><img src="../../assets/ecr-button-light.svg" alt="Explore-Compile-Replay：見つけたバグがそのままテストになる" width="320" height="54"></picture></a></p>

## 実際の実行

オープンソースのアプリでの実際の実行です。仕込んだバグはありません。[LocalSend](https://github.com/localsend/localsend)（Flutter、スター数 10 万）では、14 言語・20 台の端末が 69 分で異なるバグ 46 件を見つけました。モデル使用量は 4.62 ドルです。うち 1 件はブロッカーで、スウェーデン語で文字サイズ最大の iPhone SE ではテキストメッセージを一切送れません。

<details>
<summary>3 つの実行：LocalSend、AnkiDroid、Flutter 公式のアニメーションサンプル</summary>

| アプリ | 端末 | エージェントが見つけたもの | 時間、モデル使用量 |
|---|---|---|---|
| [LocalSend](https://github.com/localsend/localsend)（Flutter、スター数 10 万） | 20 台：Android 10 台、iOS 10 台、14 言語 | 異なるバグ 46 件、うちブロッカー 1 件：スウェーデン語で文字サイズ最大の iPhone SE では、テキストメッセージを一切送れない | 69 分、4.62 ドル |
| [AnkiDroid](https://github.com/ankidroid/Anki-Android)（Kotlin、スター数 1.2 万、リリース版 APK） | Android 10 台 | 異なる問題 43 件。フォント 200% で回答ボタンが半分に切れる、3 つの言語で「Get started」が英語のまま、など | 10 分未満、4.69 ドル |
| [Flutter 公式のアニメーションサンプル](https://github.com/flutter/packages/tree/main/packages/animations/example) | Android 1 台、iOS 1 台 | 2 つのエージェントがそれぞれ同じタイプミスを報告。アプリはダークモードにも対応していない | 19 分、0.47 ドル |

</details>

LocalSend では、46 件のバグのうち 34 件が文字サイズともアクセシビリティとも無関係でした：途中で止まる流れ、黙って失敗する操作、抜けている翻訳、崩れたタブレットのレイアウト。スクリーンショット、すべての指摘、もう一度実行するためのコマンド：[docs/examples.ja.md](docs/examples.md)。

## コントリビュート

[すぐ取り組める issue](https://github.com/pierridotite/mobile-agent-testers/issues/9) があり、一部は [good first issue](https://github.com/pierridotite/mobile-agent-testers/labels/good%20first%20issue) です：新しいペルソナ、別のエージェント CLI、GitLab CI、翻訳。同じものを二人で作らないよう、取り組む issue にコメントしてください。[CONTRIBUTING.md](../../CONTRIBUTING.md) にそれぞれの始め方とオフラインでのテスト方法があります。プルリクエストがマージされた方、自分のアプリで試した方は、[ぜひ紹介してください](../../docs/share.md)。質問は [Discord](https://discord.gg/WuaCANscr8) へ。

## チーム向けホスト版（検討中）

このワークフローは今後も無料・オープンソースのまま、機能もすべてそろっています。非公開アプリを持つチーム向けに、ホスト版を検討しています。macOS ランナー込み（非公開リポジトリでは、GitHub は macOS の 1 分を 10 分として数えます）で、レポートをプロダクトマネージャーも含めたチーム全員と共有できる Web ダッシュボード付きです。

チームの役に立ちそうですか？ [3 つの質問に答える](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=teams.yml)か、[LinkedIn で連絡してください](https://www.linkedin.com/in/pierre-raffalli/)。もう自分のアプリで試しましたか？ [見つかったことと、つまずいたところを教えてください](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=usage-feedback.yml)。

## スターの推移

[![Star History Chart](https://api.star-history.com/svg?repos=pierridotite/mobile-agent-testers&type=Date)](https://star-history.com/#pierridotite/mobile-agent-testers&Date)

## クレジット

[Claude Code](https://docs.claude.com/en/docs/claude-code) ·
[AXe](https://github.com/cameroncooke/axe) ·
[android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner)

## コントリビューター

貢献してくださったみなさん、ありがとうございます。参加したい方は[こちらから](../../CONTRIBUTING.md)。

<a href="https://github.com/pierridotite/mobile-agent-testers/graphs/contributors"><img src="https://contrib.rocks/image?repo=pierridotite/mobile-agent-testers" alt="Contributors" /></a>

作者：Pierre Raffalli · [LinkedIn](https://www.linkedin.com/in/pierre-raffalli/) · [GitHub](https://github.com/pierridotite) · [Discord](https://discord.gg/WuaCANscr8) · MIT ライセンス
