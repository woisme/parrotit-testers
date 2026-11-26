# SSS

[English](../../../docs/faq.md) · [简体中文](../../zh-CN/docs/faq.md) · [日本語](../../ja/docs/faq.md) · [Español](../../es/docs/faq.md) · [Português](../../pt-BR/docs/faq.md) · [Tiếng Việt](../../vi/docs/faq.md) · Türkçe

## 20 ajan aynı hatayı 20 kez mi buluyor?

Hayır. LocalSend'deki 103 rapor 46 farklı hataya karşılık geliyordu ve bunların 29'unu (tek engelleyici hata dahil) yalnızca bir ajan buldu ([grafik](examples.md#localsend-20-ajan-20-cihaz-14-dil)). Sağdan sola yazımla ilgili hatalar yalnızca iki Arapça personadan, tablet hataları da dört tabletten geldi. Tekrar eden raporlar, boş cihaz listesi gibi uygulamanın her yerinde herkesin karşılaştığı durumlardı.

## Maliyeti ne kadar?

GitHub runner'ları public repolarda macOS dahil ücretsizdir. [Bu çalıştırmalarda](../../../docs/runs/) model maliyeti ajan başına 0,15–0,55 $ arasındaydı; 20 telefon için toplam 5 $ civarı. Claude aboneliğiniz varsa çalıştırmalar fatura yerine planınızın kullanım limitinden düşer. Maliyeti azaltmak için `model=haiku` ya da başka bir sağlayıcının modelini kullanabilirsiniz: [docs/cheaper-models.md](../../../docs/cheaper-models.md).

## Bir çalıştırma ne kadar sürer?

Her ajan 1 ile 18 dakika arasında keşif yapar. AnkiDroid'deki 10 Android ajanı, başlangıçtan son rapora kadar 10 dakikadan kısa sürdü. LocalSend'deki 20 cihaz ise build'ler dahil 69 dakika sürdü, çünkü Free plan aynı anda yalnızca 5 macOS işi çalıştırabiliyor.

## Mac gerekli mi?

Hayır. Her şey GitHub runner'larında çalışır: Android için Linux, iOS için macOS. Yalnızca `gh` CLI'a ve bir Claude aboneliğine ya da API anahtarına ihtiyacınız var; gerisini `./setup.sh` (Windows'ta `.\setup.ps1`) halleder.

## İki çalıştırma aynı sonucu verir mi?

Hayır. Her ajan keşif yaptığı için iki çalıştırma hiçbir zaman aynı yolu izlemez: aynı listeyi değil, benzer türde hataları bekleyin. Regresyon testleri için script'li testleri (Maestro, Appium) kullanmaya devam edin; ayrıntılar için [karşılaştırmaya](../../../docs/compare.md) bakın.

## Raporlarım herkese açık mı?

Hayır. Public bir reponun logları herkese açıktır; bu yüzden raporlar, ekran görüntüleri ve videolar runner'dan çıkmadan önce sizin anahtarınızla şifrelenir ve yalnızca siz çözebilirsiniz. Analitik host'ları telefonların içinde engellenir. Gerçek hesaplar yerine her zaman test hesapları kullanın. Ayrıntılar: [PRIVACY.md](../../../PRIVACY.md).

## Kapalı kaynak bir uygulamayı test edebilir miyim?

Evet. Workflow'u private bir repodan, uygulamanızın reposu için salt okunur bir `SOURCE_REPO_TOKEN` ile çalıştırın ya da `android_build` ve `ios_build` parametrelerini hazır derlenmiş bir APK veya .app dosyasına yönlendirin. Private repolar Actions dakikalarınızdan harcar ve macOS dakikaları on kat sayılır.

## Kendi personalarımı oluşturabilir miyim?

Evet. Bir persona, [personas.json](../../../personas.json) içinde birkaç satırdan ibarettir: cihaz, işletim sistemi sürümü, dil, yazı boyutu, karanlık mod, konum, personanın kim olduğu ve ne yapmaya çalıştığı. `device` içinde isteğe bağlı iki ayar da var: `"increase_contrast": true` (iOS'ta Kontrastı Artır, Android'de yüksek kontrastlı metin) ve `"reduce_motion": true` (yalnızca iOS; Android emülatörleri zaten animasyonsuz çalışır).

## Nerelerde yanılıyor?

Zaman zaman bir ekranı yanlış yorumlar: LocalSend'deki 20 ajanın 3'ü, Simulator'ın İngilizce klavyesini uygulamanın bir parçası sandı. Ajan başına birkaç dakika, büyük bir uygulamanın her köşesini değil, ana akışları kapsar. Her bulgu numaralı ekran görüntüleriyle gelir; bir şeyi issue olarak açmadan önce bunları kontrol edin.

## Sınırlamalar

- GitHub runner'ları public repolarda ücretsizdir: aynı anda yaklaşık 20 iş, macOS'ta 5.
- 5 saatlik kullanım limiti olan planlarda 20 ajan bu limiti yaklaşık 15 dakikada doldurabilir: 6–10'luk gruplar halinde çalıştırın.
- Ücretsiz runner'lar, reponun kendi projesi için tasarlanmıştır. Kapalı kaynak bir uygulama için workflow'u kendi private reponuzda ya da kendi Mac'inizde çalıştırın.

## Nasıl çalışır?

<p align="center"><img src="../../../assets/how-it-works.svg" alt="Nasıl çalışır: tek bir workflow uygulamayı derler; ardından her persona için bir emülatör ya da simulator ve bir ajan çalışır, raporlar şifrelenir, özet sizin bilgisayarınızda oluşturulur" width="100%"></p>

- **Personalar** cihazı belirler: model, işletim sistemi, yazı boyutu, karanlık mod, dil, konum.
- **Her ajanın üç aracı vardır**: ekranı görmek (dokunma koordinatlarıyla birlikte), hareketler ve yazı yazmak.
- **Her ekranda erişilebilirlik kontrolü yapılır**: adı olmayan kontroller ve 48 dp (Android) ya da 44 pt (iOS) altındaki dokunma alanları tespit edilir, ajan da bunları ekran görüntüsü üzerinde doğrular.
- **Sonuçlar şifrelenir**: public repoların logları herkese açık olduğu için her şey sizin anahtarınızla şifrelenir.
- **Analitik engellenir**: telefonların içinde analitik engellendiği için testler gerçek istatistiklerinizi etkilemez.
- **Tek bir özet** sizin bilgisayarınızda oluşturulur. `SUMMARY_GROUPING=1` ile Claude aynı hatayı anlatan raporları gruplar (kendi Claude oturumunuzla tek bir çağrı); böylece her hataya kaç personanın takıldığını ve hangi personanın hangi tür sorunları bulduğunu görürsünüz. `SUMMARY_WEBHOOK_URL` tanımlıysa kısa bir sürüm de yalnızca sizin bilgisayarınızdan Slack ya da Discord webhook'unuza gönderilir.
- **Issue taslakları** sizin bilgisayarınızda: `python3 scripts/draft_issues.py runs/<id>`, `SUMMARY.md` içindeki her bulgu için bir GitHub issue'sunun önizlemesini gösterir; `--create --repo OWNER/REPO` ise onayladıklarınızı `gh` ile açar.
- **Testler** her push'ta, internet ve telefon gerektirmeden çalışır: erişilebilirlik kontrolü, persona matrisi, özet ve şifrelenmiş sonuçlar ([tests/](../../../tests/)).

## Neden Maestro, Appium ya da agent-device değil?

Onlar sizin yazdığınız testleri çalıştırır. Bu ajanlar ise kimsenin test etmeyi düşünmediği şeyleri arar.

| | mobile-agent-testers | Maestro, Appium, Detox, e2e |
|---|---|---|
| Sizin yazmanız gereken | Hiçbir şey: listeden persona seçersiniz | Akışlar ya da test kodu |
| Yakaladıkları | Bozuk akışlar, hata vermeden başarısız olan işlemler, eksik çeviriler, büyük yazıda bozulan düzenler, karanlık mod, kafa karıştıran metinler | Her testin kontrol ettiği şey |
| Her çalıştırmada aynı sonuç | Hayır: her çalıştırma keşif yaptığı için ekran görüntülerini kontrol edin | Evet |

[agent-device](https://github.com/callstackincubator/agent-device), tek bir kodlama ajanına tek bir simulator'ı kontrol etme imkânı verir. Bu araç ise oturumun tamamını yönetir: uygulamayı derler, her personaya kendi cihazını verir ve şifrelenmiş raporları toplar. Sürüm öncesinde ajanları, regresyonlar için de script'li akışları kullanın.

Firebase Test Lab Robo, mobile-mcp, phonedriver ve insan beta tester'larla ayrıntılı karşılaştırma: [docs/compare.md](../../../docs/compare.md) (İngilizce).
