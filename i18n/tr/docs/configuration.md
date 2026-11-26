# Kendi uygulamanızı test edin

[English](../../../docs/configuration.md) · [简体中文](../../zh-CN/docs/configuration.md) · [日本語](../../ja/docs/configuration.md) · [Español](../../es/docs/configuration.md) · [Português](../../pt-BR/docs/configuration.md) · [Tiếng Việt](../../vi/docs/configuration.md) · Türkçe

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

| Parametre | |
|---|---|
| `source_repo`, `ref` | Uygulama reposu ve branch'i (boş = bu repo). Private repo: salt okunur bir `SOURCE_REPO_TOKEN` secret'ı ekle |
| `app_dir`, `app_id` | Uygulama klasörü, Android paket adı / iOS bundle id (diğer platform başka bir id kullanıyorsa, o platformun derlenmiş uygulamasından okunur) |
| `android_personas`, `ios_personas` | [personas.json](../../../personas.json) içindeki id'ler, her biri bir telefon; ya da `all`, bir platformu atlamak için `none`. 20 hazır persona: 14 dil, sağdan sola, tabletler, küçükten en büyük erişilebilirlik boyutuna kadar yazı |
| `brief` | Ajan talimatları: keşif için [AGENT_BRIEF.md](../../../AGENT_BRIEF.md), iyileştirme raporu için [briefs/improve.md](../../../briefs/improve.md) ya da tek bir özellik için kendi talimatın |
| `bug_report` | Keşif yerine yeniden üretilecek bir hata: bir issue (`owner/repo#123` ya da URL'si) veya metin olarak adımlar. Her ajan bunu kendi cihazında izler ([briefs/reproduce.md](../../../briefs/reproduce.md)) |
| `web_personas`, `web_url` | Web personalarının id'leri (`tom`, `amelie`, `lena`, `arjun`), `all` ya da `none` (varsayılan) ve test edilecek sitenin adresi. Diğer platformlar varsayılanlarını korur; yalnızca web için `android_personas=none` ve `ios_personas=none` verin. |
| `model`, `llm_base_url` | Varsayılan `sonnet`, daha az harcamak için `haiku` ya da anahtarı bir `LLM_API_KEY` secret'ında duran, Anthropic uyumlu herhangi bir API ([docs/cheaper-models.md](../../../docs/cheaper-models.md)) |
| `framework` | `auto` (varsayılan) ya da aşağıdaki framework'lerden birini zorla |
| `android_build` + `apk_path`, `ios_build` + `ios_app_path` | Kendi build komutun ya da hazır derlenmiş bir uygulamanın indirilmesi (yollar `app_dir`'e göre) |
| `build_args` | Her iki platformun otomatik build'i için ek argümanlar; Flutter için `--dart-define=API_URL=https://staging.example.com` gibi (diğerleri için Gradle ve xcodebuild argümanları). Anahtarlar bir `BUILD_ARGS` secret'ına konur: public bir repoda çalıştırma girdileri herkese açıktır |
| `block_hosts` | Testler sırasında engellenen analitik host'ları |
| `record_video` | Her telefonun ekran kaydı, raporlarla birlikte şifrelenir |
| `replay_path` | Deneysel, Android: her ajandan sonra izlediği yol aynı telefonda modelsiz olarak yeniden oynatılır ([docs/replay.md](../../../docs/replay.md)) |
| `replay_traces`, `replay_times` | Deneysel, Android: ajan yok. Deponun bir klasöründe tutulan izler, her personanın telefonunda her biri `replay_times` kez (varsayılan 20) modelsiz olarak yeniden oynatılır ([docs/replay.md](../../../docs/replay.md#replay-kept-traces-many-times)) |
| `map` | Deneysel, Android: önce tüm ekranlar gezilir. `robot`: modelsiz bir robot, ücretsiz. `robot+agent`: önce robot, ardından yalnızca robotun geçemediği formlar için bir ajan. Tek persona yeterli ([docs/dashboard.md](../../../docs/dashboard.md)) |

**Hazır desteklenen framework'ler** (otomatik algılanır):

| Framework | Android | iOS Simulator |
|---|---|---|
| Flutter | `flutter build apk --debug` | `flutter build ios --simulator` |
| React Native / Expo | Gradle release | Xcode, arm64 |
| Native Kotlin / Java, Swift / Objective-C | Gradle debug | Xcode, arm64 |
| Kotlin Multiplatform | Gradle debug | iOS uygulamasının Xcode projesi |
| Capacitor / Ionic | `cap sync` sonrasında Gradle debug | `cap sync` sonrasında Xcode |
| .NET MAUI (beta) | `dotnet publish` | `iossimulator-arm64` için `dotnet build` |
| Diğerleri | `android_build` + `apk_path` | `ios_build` + `ios_app_path` |

Ajanlar ekranı ekran görüntüleri ve erişilebilirlik ağacı üzerinden okur; bu yüzden
her UI kütüphanesiyle çalışır. Etiketlenmiş widget'lar (Flutter'da `Semantics`, Android'de `contentDescription`,
iOS'ta `accessibilityLabel`) ajanların doğru yere dokunmasını kolaylaştırır.
