<div align="center">

<img src="../../assets/logo.svg" alt="" width="96" height="96">

# mobile-agent-testers

**20 tester AI trên 20 chiếc điện thoại khác nhau, chạy song song, trên các runner miễn phí của GitHub.**

[![Tests](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml/badge.svg)](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml)
[![Stars](https://img.shields.io/github/stars/pierridotite/mobile-agent-testers?style=flat)](https://github.com/pierridotite/mobile-agent-testers/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)
![iOS + Android](https://img.shields.io/badge/platforms-iOS%20%2B%20Android-blue)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)

**[Ví dụ](docs/examples.md)** · **[Demo dashboard](https://pierridotite.github.io/mobile-agent-testers/)** · **[So sánh](../../docs/compare.md)** · **[FAQ](docs/faq.md)** · **[Personas](../../personas.json)** · **[Đóng góp](../../CONTRIBUTING.md)**

<sub>[English](../../README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · [Español](../es/README.md) · [Português](../pt-BR/README.md) · Tiếng Việt · [Türkçe](../tr/README.md)</sub>

<a href="https://www.linkedin.com/in/pierre-raffalli/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/linkedin-follow-dark.svg"><img src="../../assets/linkedin-follow-light.svg" alt="Follow Pierre Raffalli on LinkedIn" width="160" height="54"></picture></a>
<a href="https://discord.gg/WuaCANscr8"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/discord-join-dark.svg"><img src="../../assets/discord-join-light.svg" alt="Join us on Discord" width="160" height="54"></picture></a><br>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily?language=Python" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>

<sub>Bản dịch của README tiếng Anh: có thể chậm hơn bản gốc, bản chuẩn là [README.md](../../README.md).</sub>

</div>

<p align="center"><a href="../../assets/launch-video.mp4"><img src="../../assets/launch-video.gif" alt="Video ra mắt, 26 giây. Đầu tiên là bản ghi màn hình thật của 20 tester AI dùng LocalSend cùng lúc: 10 Android emulator và 10 iOS Simulator bằng 14 ngôn ngữ, mỗi điện thoại hiển thị số vấn đề nó đã báo cáo, tổng cộng 103. Sau đó là bản đồ của dashboard với ứng dụng demo: mọi màn hình, mỗi tester một làn màu, một bug trở thành bài test, và một đường đi được phát lại không cần mô hình. Mở video có âm thanh." width="100%"></a><br>
<sub>Các điện thoại là bản ghi màn hình thật của lần chạy LocalSend; bản đồ là dashboard với <a href="../../demo-app/">ứng dụng demo</a>. <a href="../../assets/launch-video.mp4">Video có âm thanh (MP4)</a> · <a href="../../assets/localsend-20.mp4">20 điện thoại, bản ghi đầy đủ</a> · <a href="../../docs/runs/localsend-20.md">Lần chạy, theo từng thiết bị</a></sub></p>

Không cần viết test script. Mỗi tester là một agent Claude Code với iOS
Simulator hoặc Android emulator riêng trên GitHub Actions. Nó đóng vai một persona (iPhone SE
dùng tiếng Thụy Điển ở cỡ chữ lớn nhất, Pixel 7 ở 200%, iPad dùng tiếng Đức, tiếng Ả Rập
đọc từ phải sang trái...), dùng ứng dụng của bạn như một người dùng mới (hoặc chạy qua tính năng bạn
chỉ định) và viết một báo cáo bug kèm ảnh chụp màn hình. Flutter, React Native, Expo, Kotlin và Swift native, Kotlin
Multiplatform, Capacitor và .NET MAUI.

Runner của GitHub miễn phí cho các repo công khai. Bạn chỉ trả tiền cho model, bằng gói đăng ký
Claude hoặc API key của bạn: khoảng $0.15 đến $0.55 mỗi điện thoại trong [các lần chạy này](../../docs/runs/).

## Bắt đầu nhanh

```bash
gh repo create my-testers --public --template pierridotite/mobile-agent-testers --clone
cd my-testers && ./setup.sh           # key pair + secrets + Claude token (Windows: .\setup.ps1)
gh workflow run agent-testers.yml     # demo: 2 Android + 2 iOS testers, ~20 min
bash scripts/collect.sh <run id>      # decrypts reports, groups duplicates: runs/<id>/SUMMARY.md
```

Sau đó, trên ứng dụng của bạn:

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

Hoặc để Claude cài đặt cho ứng dụng của bạn:

```
/plugin marketplace add pierridotite/mobile-agent-testers
/plugin install mobile-agent-testers@mobile-agent-testers
```

Mọi input (build, brief, báo cáo bug, model rẻ hơn, tham số build, video) và các framework được hỗ trợ: [docs/configuration.vi.md](docs/configuration.md).

<details>
<summary>Lần chạy demo tìm thấy gì</summary>

Ứng dụng demo có [11 bug cố ý](../../demo-app/BUGS.md). Trong [một lần chạy](../../docs/runs/), 4 tester demo đã tìm thấy 9 trong số đó (2 đến 7 phút mỗi agent, khoảng 21 phút cho cả lần chạy, tính cả thời gian build), cộng thêm các vấn đề thật không ai gài (một nút nằm dưới thanh điều hướng Android, không dữ liệu nào được giữ lại sau khi mở lại). Mức dùng model: $0.87 cho cả 4.

</details>

## Nó làm được gì

Mỗi persona khám phá ứng dụng của bạn như một người dùng mới và báo cáo những gì cản trở, kèm ảnh chụp màn hình được đánh số. Một lần chạy cũng có thể chạy một tính năng từ đầu đến cuối, tái hiện một báo cáo bug, viết một báo cáo cải tiến, so sánh hai phiên bản hoặc kiểm thử một website trên điện thoại. Mỗi lần chạy một cách dùng, chọn bằng các tham số ở trên.

<details>
<summary>Sáu cách dùng, từng cách một</summary>

| Cách dùng | Bạn nhận được gì |
|---|---|
| **Khám phá như người dùng mới** (mặc định) | Mỗi persona cố gắng đạt mục tiêu của mình và báo cáo những gì cản trở, kèm ảnh chụp màn hình được đánh số. |
| **Chạy một tính năng từ đầu đến cuối** | Brief của riêng bạn đưa mọi agent qua một cơ chế hoàn chỉnh: một lượt đặt chỗ gồm nhiều bước, một trình soạn thảo có hoàn tác, một đồng bộ giữa hai màn hình. Agent chạm, nhấn giữ, vuốt và gõ, rời ứng dụng rồi quay lại, mở lại ứng dụng để kiểm tra những gì đã được lưu, hoặc mở một deep link để bắt đầu ngay tại tính năng, và một brief có thể nâng ngân sách khoảng 30 hành động. Brief của [AnkiDroid](../../briefs/ankidroid.md) đã tìm thấy trường Back của một thẻ mới bị bàn phím che khuất. |
| **Tái hiện một báo cáo bug** | Trên mọi điện thoại: đưa một issue hoặc các bước, và mỗi agent trả lời có, không hoặc không rõ, kèm ảnh chụp màn hình ([briefs/reproduce.md](../../briefs/reproduce.md)). |
| **Nhận một báo cáo cải tiến** | Mỗi persona dùng ứng dụng một lần, rồi nói nó đã do dự ở đâu, nó mong đợi điều gì và nên thay đổi gì trước, theo khu vực và mức tác động ([briefs/improve.md](../../briefs/improve.md)). |
| **So sánh hai phiên bản** | Cùng các persona trên hai branch hoặc hai bản build, rồi một bảng: mục tiêu đạt được, số hành động, điểm số, các vấn đề chỉ thấy ở một phiên bản ([docs/compare-versions.md](../../docs/compare-versions.md)). Một bước kiểm tra trước một A/B test thật, không phải thứ thay thế cho nó. |
| **Kiểm thử một website trên điện thoại** | Cùng các persona trong trình duyệt của điện thoại, trên bất kỳ website hay web app nào. Chạy trên các runner Linux miễn phí ([cấu hình](docs/configuration.md)). |

</details>

**Dùng một model rẻ hơn**: Claude Haiku, hoặc bất kỳ API tương thích Anthropic nào (OpenRouter, DeepSeek, Kimi, GLM, MiniMax, Qwen). Các phát hiện chỉ tốt bằng khả năng đọc ảnh chụp màn hình và suy luận của model ([docs/cheaper-models.md](../../docs/cheaper-models.md)).

Maestro hay Appium chạy các test bạn viết. Các agent này tìm những gì không ai nghĩ tới để test: [so sánh chi tiết](../../docs/compare.md).

## Xem mọi màn hình trên một bản đồ

<a href="https://pierridotite.github.io/mobile-agent-testers/"><img src="../../assets/dashboard.png" alt="Dashboard: mọi màn hình của ứng dụng trên một bản đồ, mỗi tester một làn màu trên từng mũi tên, bản đồ nhiệt trên từng màn hình, màn hình đang chọn ở bên phải" width="100%"></a>

Mọi màn hình mà các tester đã đến, đường đi của mỗi người một màu riêng và bản đồ nhiệt cho thấy họ đã chạm vào đâu. Chọn một thiết bị trong menu Device để xem các màn hình theo hình dạng của nó (điện thoại hay máy tính bảng) và bản đồ nhiệt riêng. Bình luận một màn hình, hoặc biến điều sai trên đó thành một phép kiểm tra.

<p align="center"><a href="https://pierridotite.github.io/mobile-agent-testers/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/demo-try-dark.svg"><img src="../../assets/demo-try-light.svg" alt="Thử bản demo ngay trên trình duyệt" width="190" height="54"></picture></a></p>

Trên lần chạy của bạn: `python3 scripts/dashboard.py runs/<id>`. Nó chạy trên máy của bạn và kết quả không bao giờ rời khỏi máy ([docs/dashboard.md](../../docs/dashboard.md)).

## Mỗi lỗi trở thành một bài test

Tester tìm ra lỗi đã đi một đường mà không script nào viết ra. Mỗi tester Android giữ đường đi đó dưới dạng một trace, mỗi lần chạm được đặt tên theo phần tử nằm dưới ngón tay. Với `-f replay_path=true`, đường đi được phát lại trên cùng điện thoại ngay sau agent, không cần mô hình. Một phép kiểm tra thêm trên bản đồ đưa lỗi vào bài test: lần phát lại báo `bug` khi lỗi còn đó và `fixed` khi nó đã hết ([docs/replay.md](../../docs/replay.md)).

Các trace theo Explore-Compile-Replay, định dạng mở của tôi, biên dịch đường đi của agent thành một flow [Maestro](https://maestro.dev). Hiện chỉ có Android; ECR mới là bản nháp đầu tiên.

<p align="center"><a href="https://github.com/pierridotite/explore-compile-replay"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/ecr-button-dark.svg"><img src="../../assets/ecr-button-light.svg" alt="Explore-Compile-Replay: mỗi lỗi trở thành một bài test" width="320" height="54"></picture></a></p>

## Các lần chạy thật

Các lần chạy thật trên các ứng dụng mã nguồn mở, không gài sẵn gì cả. Trên [LocalSend](https://github.com/localsend/localsend) (Flutter, 100k stars), 20 điện thoại với 14 ngôn ngữ đã tìm thấy 46 bug khác nhau trong 69 phút, với $4.62 dùng model. Trong đó có 1 bug chặn: trên một chiếc iPhone SE dùng tiếng Thụy Điển ở cỡ chữ lớn nhất, bạn không thể gửi tin nhắn văn bản chút nào.

<details>
<summary>Ba lần chạy: LocalSend, AnkiDroid và ứng dụng mẫu animations của Flutter</summary>

| Ứng dụng | Điện thoại | Agent đã tìm thấy gì | Thời gian, mức dùng model |
|---|---|---|---|
| [LocalSend](https://github.com/localsend/localsend) (Flutter, 100k stars) | 20: 10 Android, 10 iOS, 14 ngôn ngữ | 46 bug khác nhau, 1 bug chặn: trên một chiếc iPhone SE dùng tiếng Thụy Điển ở cỡ chữ lớn nhất, bạn không thể gửi tin nhắn văn bản chút nào | 69 phút, $4.62 |
| [AnkiDroid](https://github.com/ankidroid/Anki-Android) (Kotlin, 12k stars, APK bản release) | 10 Android | 43 vấn đề khác nhau, trong đó có các nút trả lời bị cắt một nửa ở font 200% và "Get started" còn nguyên tiếng Anh trong ba ngôn ngữ | dưới 10 phút, $4.69 |
| [Ứng dụng mẫu animations của Flutter](https://github.com/flutter/packages/tree/main/packages/animations/example) | 1 Android, 1 iOS | Cùng một lỗi chính tả, được cả hai agent tự báo cáo độc lập, và một ứng dụng phớt lờ chế độ tối | 19 phút, $0.47 |

</details>

34 trong số 46 bug của LocalSend không liên quan gì đến cỡ chữ hay khả năng tiếp cận: các luồng bị hỏng, lỗi âm thầm, thiếu bản dịch, bố cục máy tính bảng. Ảnh chụp màn hình, mọi phát hiện và các lệnh để chạy lại chúng: [docs/examples.vi.md](docs/examples.md).

## Đóng góp

[Có các issue đang chờ người nhận](https://github.com/pierridotite/mobile-agent-testers/issues/9), một số là [good first issue](https://github.com/pierridotite/mobile-agent-testers/labels/good%20first%20issue): persona mới, một agent CLI khác, GitLab CI, bản dịch. Hãy bình luận vào issue bạn nhận để hai người không làm trùng nhau. [CONTRIBUTING.md](../../CONTRIBUTING.md) cho biết mỗi việc bắt đầu từ đâu và cách test ngoại tuyến. Pull request của bạn đã được merge, hay bạn đã chạy nó trên ứng dụng của mình? [Hãy giới thiệu việc bạn làm](../../docs/share.md). Câu hỏi: [Discord](https://discord.gg/WuaCANscr8).

## Phiên bản hosted cho nhóm (đang thăm dò)

Workflow ở đây vẫn miễn phí, mã nguồn mở và đầy đủ. Tôi đang thăm dò một phiên bản hosted cho các nhóm có ứng dụng riêng tư: kèm macOS runner (trên một repo riêng tư, GitHub tính mỗi phút macOS gấp mười lần) và một dashboard web để chia sẻ các báo cáo với cả nhóm, gồm cả các quản lý sản phẩm.

Điều đó có giúp ích cho nhóm của bạn không? [Trả lời ba câu hỏi](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=teams.yml) hoặc [viết cho tôi trên LinkedIn](https://www.linkedin.com/in/pierre-raffalli/). Đã chạy nó trên ứng dụng của bạn rồi? [Kể cho tôi nó đã tìm thấy gì và điều gì gây trở ngại](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=usage-feedback.yml).

## Lịch sử star

[![Star History Chart](https://api.star-history.com/svg?repos=pierridotite/mobile-agent-testers&type=Date)](https://star-history.com/#pierridotite/mobile-agent-testers&Date)

## Ghi công

[Claude Code](https://docs.claude.com/en/docs/claude-code) ·
[AXe](https://github.com/cameroncooke/axe) ·
[android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner)

## Người đóng góp

Cảm ơn tất cả những người đã đóng góp. Muốn giúp một tay? [Bắt đầu tại đây](../../CONTRIBUTING.md).

<a href="https://github.com/pierridotite/mobile-agent-testers/graphs/contributors"><img src="https://contrib.rocks/image?repo=pierridotite/mobile-agent-testers" alt="Contributors" /></a>

Được làm bởi Pierre Raffalli · [LinkedIn](https://www.linkedin.com/in/pierre-raffalli/) · [GitHub](https://github.com/pierridotite) · [Discord](https://discord.gg/WuaCANscr8) · Giấy phép MIT
