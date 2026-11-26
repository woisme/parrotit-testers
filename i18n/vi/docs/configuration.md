# Kiểm thử ứng dụng của bạn

[English](../../../docs/configuration.md) · [简体中文](../../zh-CN/docs/configuration.md) · [日本語](../../ja/docs/configuration.md) · [Español](../../es/docs/configuration.md) · [Português](../../pt-BR/docs/configuration.md) · Tiếng Việt · [Türkçe](../../tr/docs/configuration.md)

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

| Đầu vào | |
|---|---|
| `source_repo`, `ref` | Repo của ứng dụng và branch (để trống = repo này). Repo riêng tư: thêm secret `SOURCE_REPO_TOKEN` chỉ đọc |
| `app_dir`, `app_id` | Thư mục ứng dụng, package Android / bundle id iOS (nếu nền tảng còn lại dùng id khác, nó được đọc từ ứng dụng đã build của nền tảng đó) |
| `android_personas`, `ios_personas` | Các id từ [personas.json](../../../personas.json), mỗi id một điện thoại, `all`, hoặc `none` để bỏ qua một nền tảng. 20 persona có sẵn: 14 ngôn ngữ, chiều phải sang trái, máy tính bảng, cỡ chữ từ nhỏ đến cỡ trợ năng lớn nhất |
| `brief` | Chỉ dẫn cho agent: [AGENT_BRIEF.md](../../../AGENT_BRIEF.md) để khám phá, [briefs/improve.md](../../../briefs/improve.md) cho một báo cáo cải tiến, hoặc bản của riêng bạn cho một tính năng |
| `bug_report` | Một bug cần tái hiện thay vì khám phá: một issue (`owner/repo#123` hoặc URL của nó) hoặc các bước dạng văn bản. Mỗi agent làm theo trên thiết bị của riêng mình ([briefs/reproduce.md](../../../briefs/reproduce.md)) |
| `web_personas`, `web_url` | Id của các persona web (`tom`, `amelie`, `lena`, `arjun`), `all`, hoặc `none` (mặc định), và địa chỉ của website cần kiểm thử. Các nền tảng khác giữ giá trị mặc định, nên hãy đặt `android_personas=none` và `ios_personas=none` khi chỉ chạy web. |
| `model`, `llm_base_url` | `sonnet` mặc định, `haiku` để tốn ít hơn, hoặc bất kỳ API nào tương thích Anthropic với key của nó trong secret `LLM_API_KEY` ([docs/cheaper-models.md](../../../docs/cheaper-models.md)) |
| `framework` | `auto` (mặc định) hoặc ép dùng một trong các framework bên dưới |
| `android_build` + `apk_path`, `ios_build` + `ios_app_path` | Lệnh build của riêng bạn, hoặc tải về một ứng dụng đã build sẵn (đường dẫn tương đối so với `app_dir`) |
| `build_args` | Đối số bổ sung cho quá trình build tự động của cả hai nền tảng, như `--dart-define=API_URL=https://staging.example.com` cho Flutter (đối số Gradle và xcodebuild cho các framework khác). Key để trong secret `BUILD_ARGS`: input của lần chạy là công khai trên repo công khai |
| `block_hosts` | Các host phân tích bị chặn trong lúc kiểm thử |
| `record_video` | Quay màn hình của mỗi điện thoại, được mã hóa cùng các báo cáo |
| `replay_path` | Thử nghiệm, Android: sau mỗi agent, đường đi của nó được chạy lại trên cùng điện thoại, không cần mô hình ([docs/replay.md](../../../docs/replay.md)) |
| `replay_traces`, `replay_times` | Thử nghiệm, Android: không có agent. Các trace lưu trong một thư mục của repo được chạy lại mỗi trace `replay_times` lần (mặc định 20) trên điện thoại của từng persona, không cần mô hình ([docs/replay.md](../../../docs/replay.md#replay-kept-traces-many-times)) |
| `map` | Thử nghiệm, Android: trước tiên đi qua mọi màn hình. `robot`: một robot không dùng mô hình, miễn phí. `robot+agent`: robot trước, sau đó một agent chỉ cho các biểu mẫu robot không vượt qua được. Chỉ cần một persona ([docs/dashboard.md](../../../docs/dashboard.md)) |

**Hỗ trợ sẵn** (tự động phát hiện):

| Framework | Android | iOS Simulator |
|---|---|---|
| Flutter | `flutter build apk --debug` | `flutter build ios --simulator` |
| React Native / Expo | Gradle release | Xcode, arm64 |
| Kotlin / Java, Swift / Objective-C native | Gradle debug | Xcode, arm64 |
| Kotlin Multiplatform | Gradle debug | Project Xcode của ứng dụng iOS |
| Capacitor / Ionic | Gradle debug sau `cap sync` | Xcode sau `cap sync` |
| .NET MAUI (beta) | `dotnet publish` | `dotnet build` cho `iossimulator-arm64` |
| Bất kỳ framework nào khác | `android_build` + `apk_path` | `ios_build` + `ios_app_path` |

Các agent đọc màn hình từ ảnh chụp màn hình và cây trợ năng, nên mọi bộ công cụ UI
đều dùng được. Các widget có nhãn (Flutter `Semantics`, `contentDescription`,
`accessibilityLabel`) giúp chúng có điểm chạm chính xác hơn.
