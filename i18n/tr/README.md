<div align="center">

<img src="../../assets/logo.svg" alt="" width="96" height="96">

# mobile-agent-testers

**20 farklı telefonda aynı anda çalışan 20 yapay zekâ tester, GitHub'ın ücretsiz runner'larında.**

[![Tests](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml/badge.svg)](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml)
[![Stars](https://img.shields.io/github/stars/pierridotite/mobile-agent-testers?style=flat)](https://github.com/pierridotite/mobile-agent-testers/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)
![iOS + Android](https://img.shields.io/badge/platforms-iOS%20%2B%20Android-blue)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)

**[Örnekler](docs/examples.md)** · **[Dashboard demosu](https://pierridotite.github.io/mobile-agent-testers/)** · **[Karşılaştırma](../../docs/compare.md)** · **[SSS](docs/faq.md)** · **[Personalar](../../personas.json)** · **[Katkıda bulunun](../../CONTRIBUTING.md)**

<sub>[English](../../README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · [Español](../es/README.md) · [Português](../pt-BR/README.md) · [Tiếng Việt](../vi/README.md) · Türkçe</sub>

<a href="https://www.linkedin.com/in/pierre-raffalli/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/linkedin-follow-dark.svg"><img src="../../assets/linkedin-follow-light.svg" alt="Follow Pierre Raffalli on LinkedIn" width="160" height="54"></picture></a>
<a href="https://discord.gg/WuaCANscr8"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/discord-join-dark.svg"><img src="../../assets/discord-join-light.svg" alt="Join us on Discord" width="160" height="54"></picture></a><br>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily?language=Python" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>

<sub>Bu sayfa İngilizce README'nin çevirisidir ve güncel olmayabilir. Esas sürüm [README.md](../../README.md) dosyasıdır.</sub>

</div>

<p align="center"><a href="../../assets/launch-video.mp4"><img src="../../assets/launch-video.gif" alt="Tanıtım videosu, 26 saniye. Önce LocalSend'i aynı anda kullanan 20 yapay zekâ tester'ın gerçek ekran kayıtları: 14 dilde 10 Android emülatörü ve 10 iOS Simulator; her telefon bildirdiği sorun sayısını gösteriyor, toplam 103. Ardından dashboard'daki demo uygulamanın haritası: tüm ekranlar, her tester için renkli bir şerit, teste dönüşen bir hata ve modelsiz yeniden oynatılan bir yol. Tıklayınca sesli video açılır." width="100%"></a><br>
<sub>Telefonlar LocalSend çalıştırmasının gerçek ekran kayıtları; harita dashboard'daki <a href="../../demo-app/">demo uygulamanın</a> haritası. <a href="../../assets/launch-video.mp4">Sesli video (MP4)</a> · <a href="../../assets/localsend-20.mp4">20 telefonun kaydının tamamı</a> · <a href="../../docs/runs/localsend-20.md">Cihaz cihaz çalıştırma sonuçları</a></sub></p>

Test script'i yazmanıza gerek yok. Her tester, GitHub Actions üzerinde kendi iOS
Simulator'ı ya da Android emülatörü bulunan bir Claude Code ajanıdır. Ajan bir kullanıcı
profiline bürünür (en büyük yazı boyutunda İsveççe bir iPhone SE, %200 yazı ölçeğinde bir Pixel 7,
Almanca bir iPad, sağdan sola Arapça…), uygulamanızı ilk kez kullanan biri gibi gezer
(ya da belirttiğiniz özelliği baştan sona dener) ve ekran görüntüleriyle bir hata raporu yazar.
Flutter, React Native, Expo, native Kotlin ve Swift, Kotlin Multiplatform, Capacitor ve .NET MAUI desteklenir.

GitHub runner'ları public repolarda ücretsizdir. Yalnızca model kullanımı için,
Claude aboneliğiniz ya da API anahtarınız üzerinden ödeme yaparsınız: [bu çalıştırmalarda](../../docs/runs/) telefon başına yaklaşık 0,15–0,55 $.

## Hızlı başlangıç

```bash
gh repo create my-testers --public --template pierridotite/mobile-agent-testers --clone
cd my-testers && ./setup.sh           # anahtar çifti + secret'lar + Claude token'ı (Windows: .\setup.ps1)
gh workflow run agent-testers.yml     # demo: 2 Android + 2 iOS tester, ~20 dk
bash scripts/collect.sh <run id>      # raporların şifresini çözer, tekrarları gruplar: runs/<id>/SUMMARY.md
```

Ardından kendi uygulamanızda:

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

Ya da uygulamanız için kurulumu Claude'a bırakabilirsiniz:

```
/plugin marketplace add pierridotite/mobile-agent-testers
/plugin install mobile-agent-testers@mobile-agent-testers
```

Tüm parametreler (build'ler, brief'ler, hata raporları, daha ucuz modeller, build argümanları, video kaydı) ve desteklenen framework'ler: [docs/configuration.tr.md](docs/configuration.md).

<details>
<summary>Demo çalıştırmasının buldukları</summary>

Demo uygulamaya [bilerek 11 hata yerleştirildi](../../demo-app/BUGS.md). [Bir test çalıştırmasında](../../docs/runs/) 4 demo tester bu hataların 9'unu buldu. Her ajan 2–7 dakika çalıştı; build'ler dahil tüm süreç yaklaşık 21 dakika sürdü. Ajanlar bunların dışında, kimsenin bilerek eklemediği gerçek sorunlar da buldu: Android gezinme çubuğunun altında kalan bir buton ve uygulama yeniden başlatılınca kaybolan veriler. 4 tester'ın toplam model maliyeti 0,87 $ oldu.

</details>

## Neler yapabilir

Her persona uygulamanızı yeni bir kullanıcı gibi keşfeder ve karşısına çıkan engelleri numaralı ekran görüntüleriyle raporlar. Bir çalıştırma ayrıca tek bir özelliği baştan sona test edebilir, bir hatayı yeniden üretebilir, iyileştirme raporu yazabilir, iki sürümü karşılaştırabilir ya da bir web sitesini telefonlarda test edebilir. Her çalıştırmada tek bir kullanım; yukarıdaki parametrelerle seçilir.

<details>
<summary>Altı kullanım, tek tek</summary>

| Kullanım | Ne elde edersiniz |
|---|---|
| **Yeni bir kullanıcı gibi keşfetme** (varsayılan) | Her persona kendi hedefine ulaşmaya çalışır ve karşısına çıkan engelleri numaralı ekran görüntüleriyle raporlar. |
| **Tek bir özelliği baştan sona test etme** | Yazdığınız bir brief, her ajanı bir akışın tamamından geçirir: birkaç adımlı bir rezervasyon, geri alma özelliği olan bir editör, iki ekran arasında senkronizasyon gibi. Ajanlar dokunur, uzun basar, kaydırır ve yazı yazar; uygulamayı arka plana atıp geri döner, nelerin kaydedildiğini görmek için uygulamayı yeniden başlatır ya da doğrudan ilgili özellikten başlamak için bir deep link açar. Brief ile yaklaşık 30 eylemlik varsayılan sınırı da artırabilirsiniz. [AnkiDroid için yazılan brief](../../briefs/ankidroid.md), yeni bir kartın arka yüz alanının klavyenin altında kaldığını ortaya çıkardı. |
| **Bir hatayı her telefonda yeniden üretme** | Bir issue ya da adımları verirsiniz; her ajan ekran görüntüleriyle "evet", "hayır" ya da "belirsiz" diye cevap verir ([briefs/reproduce.md](../../briefs/reproduce.md)). |
| **İyileştirme raporu** | Her persona uygulamayı bir kez kullanır; ardından nerede tereddüt ettiğini, ne beklediğini ve öncelikle neyin değişmesi gerektiğini, alana ve etkiye göre sıralayarak anlatır ([briefs/improve.md](../../briefs/improve.md)). |
| **İki sürümü karşılaştırma** | Aynı personalar iki farklı branch ya da build üzerinde çalışır, sonuçlar tek bir tabloda toplanır: ulaşılan hedefler, eylem sayıları, puanlar ve yalnızca bir sürümde görülen sorunlar ([docs/compare-versions.md](../../docs/compare-versions.md)). Bu, gerçek bir A/B testinin yerini tutmaz; ondan önce yapılacak bir ön kontroldür. |
| **Bir web sitesini telefonlarda test etme** | Aynı personalar bir telefonun tarayıcısında, herhangi bir sitede ya da web uygulamasında. Ücretsiz Linux runner'larda çalışır ([yapılandırma](docs/configuration.md)). |

</details>

**Daha ucuz bir model kullanma.** Claude Haiku ya da Anthropic uyumlu herhangi bir API'yi (OpenRouter, DeepSeek, Kimi, GLM, MiniMax, Qwen) kullanabilirsiniz. Bulguların kalitesi, modelin ekran görüntülerini ne kadar iyi okuyup akıl yürütebildiğine bağlıdır ([docs/cheaper-models.md](../../docs/cheaper-models.md)).

Maestro ya da Appium sizin yazdığınız testleri çalıştırır. Bu ajanlar ise kimsenin test etmeyi düşünmediği şeyleri arar: [Karşılaştırmanın tamamı](../../docs/compare.md).

## Tüm ekranları tek haritada görün

<a href="https://pierridotite.github.io/mobile-agent-testers/"><img src="../../assets/dashboard.png" alt="Dashboard: uygulamanın tüm ekranları bir haritada, her okta test eden başına renkli bir şerit, her ekranda bir ısı haritası, sağda seçili ekran" width="100%"></a>

Test edenlerin ulaştığı tüm ekranlar; her birinin yolu kendi renginde, dokundukları yerler bir ısı haritasında. Device menüsünden bir cihaz seçerek ekranları onun biçiminde (telefon veya tablet) ve kendi ısı haritasıyla görün. Bir ekrana yorum ekleyin ya da o ekrandaki hatayı bir kontrole dönüştürün.

<p align="center"><a href="https://pierridotite.github.io/mobile-agent-testers/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/demo-try-dark.svg"><img src="../../assets/demo-try-light.svg" alt="Demoyu tarayıcınızda deneyin" width="190" height="54"></picture></a></p>

Kendi çalıştırmanızda: `python3 scripts/dashboard.py runs/<id>`. Kendi makinenizde çalışır ve sonuçlar makinenizden hiç çıkmaz ([docs/dashboard.md](../../docs/dashboard.md)).

## Her hata bir teste dönüşür

Bir hata bulan test eden, hiçbir betiğin yazmayacağı bir yol izlemiştir. Her Android test edeni bu yolu bir iz olarak saklar; her dokunuş, parmağın altındaki öğenin adıyla kaydedilir. `-f replay_path=true` ile yol, ajan biter bitmez aynı telefonda modelsiz yeniden oynatılır. Haritada eklenen bir kontrol hatayı testin parçası yapar: hata durdukça yeniden oynatma `bug`, düzeldiğinde `fixed` der ([docs/replay.md](../../docs/replay.md)).

İzler, bir ajanın yolunu bir [Maestro](https://maestro.dev) akışına derleyen açık formatım Explore-Compile-Replay'i izler. Şimdilik yalnızca Android; ECR erken bir taslak.

<p align="center"><a href="https://github.com/pierridotite/explore-compile-replay"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/ecr-button-dark.svg"><img src="../../assets/ecr-button-light.svg" alt="Explore-Compile-Replay: her hata bir teste dönüşür" width="320" height="54"></picture></a></p>

## Gerçek çalıştırmalar

Açık kaynak uygulamalarda yapılmış gerçek çalıştırmalar; hiçbir hata önceden yerleştirilmedi. [LocalSend](https://github.com/localsend/localsend) (Flutter, 100 bin yıldız) üzerinde 14 dilde 20 telefon, 69 dakikada 46 farklı hata buldu; model maliyeti 4,62 $ oldu. Bunlardan biri engelleyici (blocker): en büyük yazı boyutundaki İsveççe bir iPhone SE'de metin mesajı hiç gönderilemiyor.

<details>
<summary>Üç çalıştırma: LocalSend, AnkiDroid ve Flutter'ın animasyon örneği</summary>

| Uygulama | Telefonlar | Bulgular | Süre, model maliyeti |
|---|---|---|---|
| [LocalSend](https://github.com/localsend/localsend) (Flutter, 100 bin yıldız) | 20: 10 Android, 10 iOS, 14 dil | 46 farklı hata, 1 engelleyici hata (blocker): en büyük yazı boyutundaki İsveççe bir iPhone SE'de metin mesajı hiç gönderilemiyor | 69 dk, 4,62 $ |
| [AnkiDroid](https://github.com/ankidroid/Anki-Android) (Kotlin, 12 bin yıldız, release APK) | 10 Android | 43 farklı sorun; bunlar arasında %200 yazı ölçeğinde yarısı kesilen cevap butonları ve üç dilde İngilizce kalmış "Get started" butonu var | 10 dk'dan kısa, 4,69 $ |
| [Flutter'ın animasyon örneği](https://github.com/flutter/packages/tree/main/packages/animations/example) | 1 Android, 1 iOS | İki ajanın birbirinden bağımsız olarak bulduğu aynı yazım hatası ve karanlık modu desteklemeyen bir uygulama | 19 dk, 0,47 $ |

</details>

LocalSend'de bulunan 46 hatanın 34'ünün yazı boyutu ya da erişilebilirlikle bir ilgisi yoktu: bozuk akışlar, hata vermeden başarısız olan işlemler, eksik çeviriler ve tablet düzenleri. Ekran görüntüleri, tüm bulgular ve çalıştırmaları tekrarlamak için gereken komutlar: [docs/examples.tr.md](docs/examples.md).

## Katkıda bulunun

[Alınmaya hazır issue'lar var](https://github.com/pierridotite/mobile-agent-testers/issues/9), bazıları [good first issue](https://github.com/pierridotite/mobile-agent-testers/labels/good%20first%20issue): yeni personalar, başka bir ajan CLI'ı, GitLab CI, çeviriler. İki kişi aynı şeyi yapmasın diye aldığınız issue'ya yorum yazın. [CONTRIBUTING.md](../../CONTRIBUTING.md) her birinin nereden başladığını ve çevrimdışı nasıl test edileceğini anlatır. Pull request'iniz birleştirildi mi ya da kendi uygulamanızda mı denediniz? [Çalışmanızı gösterin](../../docs/share.md). Sorular: [Discord](https://discord.gg/WuaCANscr8).

## Ekipler için barındırılan sürüm (araştırılıyor)

Buradaki workflow ücretsiz, açık kaynak ve eksiksiz kalmaya devam edecek. Private uygulamaları olan ekipler için barındırılan bir sürüm üzerinde çalışıyorum. Bu sürüm; macOS runner'larını (private bir repoda GitHub her macOS dakikasını on dakika olarak hesaplar) ve raporların ürün yöneticileri dahil tüm ekiple paylaşılabileceği bir web panelini içerecek.

Bu, ekibinizin işine yarar mı? [Üç soruyu cevaplayın](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=teams.yml) ya da [LinkedIn'den bana yazın](https://www.linkedin.com/in/pierre-raffalli/). Kendi uygulamanızda zaten denediniz mi? [Neler bulduğunuzu ve nerede takıldığınızı paylaşın](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=usage-feedback.yml).

## Yıldız geçmişi

[![Star History Chart](https://api.star-history.com/svg?repos=pierridotite/mobile-agent-testers&type=Date)](https://star-history.com/#pierridotite/mobile-agent-testers&Date)

## Teşekkürler

[Claude Code](https://docs.claude.com/en/docs/claude-code) ·
[AXe](https://github.com/cameroncooke/axe) ·
[android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner)

## Katkıda bulunanlar

Katkıda bulunan herkese teşekkürler. Siz de yardım etmek ister misiniz? [Buradan başlayın](../../CONTRIBUTING.md).

<a href="https://github.com/pierridotite/mobile-agent-testers/graphs/contributors"><img src="https://contrib.rocks/image?repo=pierridotite/mobile-agent-testers" alt="Contributors" /></a>

Geliştiren: Pierre Raffalli · [LinkedIn](https://www.linkedin.com/in/pierre-raffalli/) · [GitHub](https://github.com/pierridotite) · [Discord](https://discord.gg/WuaCANscr8) · MIT lisansı
