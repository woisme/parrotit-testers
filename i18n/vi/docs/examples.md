# Các ví dụ thực tế

[English](../../../docs/examples.md) · [简体中文](../../zh-CN/docs/examples.md) · [日本語](../../ja/docs/examples.md) · [Español](../../es/docs/examples.md) · [Português](../../pt-BR/docs/examples.md) · Tiếng Việt · [Türkçe](../../tr/docs/examples.md)

Các lần chạy thật trên các ứng dụng mã nguồn mở, không gài sẵn gì cả. Mọi con số đều lấy từ [các lần chạy](../../../docs/runs/), nơi mỗi báo cáo được liệt kê theo từng thiết bị.

## Không chỉ về trợ năng

Cỡ chữ lớn tạo ra những ảnh chụp màn hình ấn tượng nhất, nhưng đó chỉ là một phần nhỏ trong những gì các agent báo cáo. Mỗi persona có một mục tiêu ("hoàn thành một tác vụ mà không dùng tiếng Anh", "điền mọi trường văn bản bằng ký tự tiếng Thổ Nhĩ Kỳ, emoji và văn bản rất dài", "thoát ứng dụng giữa chừng rồi quay lại") và cố đạt mục tiêu như một người dùng mới, nên các agent báo cáo bất cứ thứ gì cản đường:

- **Luồng bị hỏng và lỗi im lặng**: một danh sách thiết bị tải mãi không xong và không bao giờ nói là không tìm thấy gì (12 trong 20 điện thoại), một lần gửi thất bại chỉ nói "Error", một hộp thoại chờ mãi khi một địa chỉ không trả lời, một hộp thoại văn bản vứt bỏ những gì bạn đã gõ chỉ sau một lần chạm lạc.
- **Thiết lập ban đầu và quyền truy cập**: AnkiDroid chặn việc thiết lập cho đến khi bạn cấp quyền truy cập mọi tệp trên một trang hệ thống, mà không giải thích gì (8 trong 10 agent của nó).
- **Bản dịch**: "Get started" còn nguyên tiếng Anh trên các điện thoại tiếng Bồ Đào Nha, tiếng Tây Ban Nha và tiếng Nhật, tab # mang nhãn "Jogo da velha" (cờ ca rô) trong tiếng Bồ Đào Nha, kích cỡ viết "B 14" trong tiếng Ả Rập, ngày tháng theo định dạng ISO thay vì định dạng của điện thoại, một chính sách quyền riêng tư chỉ có tiếng Anh.
- **Nội dung chữ**: một lỗi chính tả trong bản mẫu chính thức của Flutter, một tin nhắn văn bản bị đếm thành "Files: 1", "#16 #15" trên màn hình chính mà không có giải thích.
- **Thiết bị**: máy tính bảng hiển thị bố cục điện thoại trong một cột hẹp, bàn phím che mất Cancel và Confirm, thanh điều hướng Android che các mục cuối của danh sách, một ứng dụng phớt lờ chế độ tối.
- **Dữ liệu**: không có gì được giữ lại sau khi mở lại ứng dụng (trong ứng dụng demo).

Trên LocalSend, 34 trong 46 bug không liên quan gì đến cỡ chữ hay trợ năng. Mỗi báo cáo cũng kết thúc bằng ý kiến của persona và điểm trên 10 (họ có giữ lại ứng dụng không?), nên một lần chạy cho thấy người dùng mới lạc ở đâu, không chỉ là cái gì bị hỏng.

## LocalSend: 20 agent, 20 thiết bị, 14 ngôn ngữ

<p align="center"><img src="../../../assets/real-findings-localsend-20.png" alt="Bốn màn hình LocalSend với các sọc tràn của Flutter, mỗi vấn đề được khoanh đỏ: một chiếc Pixel 7 ở cỡ chữ 200% nơi cả sáu nút Send đều tràn, một chiếc iPhone SE dùng tiếng Thụy Điển ở cỡ chữ lớn nhất nơi hộp thoại tin nhắn tràn 149 pixel và che mất trường văn bản cùng nút Confirm, một chiếc iPad Air dùng tiếng Đức nơi nút Add tràn khỏi thẻ của nó 114 pixel, và một chiếc iPhone SE dùng tiếng Pháp ở cỡ chữ mặc định nơi một hàng tràn 28 pixel" width="100%"></p>

[LocalSend](https://github.com/localsend/localsend) là một ứng dụng Flutter với 100k stars. Những gì các agent tìm thấy:

- iPhone SE dùng tiếng Thụy Điển ở cỡ chữ lớn nhất của iOS: hộp thoại tin nhắn tràn 149 px, nên trường văn bản và nút Confirm nằm ngoài màn hình và bạn không thể gửi văn bản chút nào.
- Pixel 7 ở font 200% của Android: cả sáu nút Send đều tràn và cắt đôi nhãn của chúng. Tương tự trên một chiếc iPhone 16 Plus dùng tiếng Ý ở cỡ trợ năng đầu tiên.
- iPad Air dùng tiếng Đức với cỡ chữ lớn: "Hinzufügen" tràn 114 px khỏi thẻ của nó, và các giá trị trong Settings bị ngắt giữa từ.
- iPhone SE dùng tiếng Pháp ở cỡ chữ mặc định: "Recevoir via un lien" tràn 28 px và che mất một ô đánh dấu.
- Pixel Tablet dùng tiếng Tây Ban Nha: bàn phím che mất Cancel và Confirm của hộp thoại địa chỉ.
- Một lần gửi thủ công thất bại chỉ nói "Error", "Erreur", "Fehler", "エラー", "Hata" hoặc "Erro", mà không có lý do. Trên iOS, một địa chỉ không trả lời khiến hộp thoại cứ chờ mà không hiển thị tiến trình (ba agent).

Tổng cộng 103 báo cáo (1 bug chặn, 15 bug lớn). Gom thủ công, chúng là 46 bug khác nhau, và phần lớn chỉ được một điện thoại nhìn thấy:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../../../assets/bugs-per-phone-dark.svg">
  <img src="../../../assets/bugs-per-phone-light.svg" alt="29 trong 46 bug của LocalSend chỉ được một điện thoại nhìn thấy, kể cả bug chặn duy nhất. 6 bug được 2 điện thoại nhìn thấy, 6 bug được 3 điện thoại, và mỗi mức 4, 5, 6, 10 và 12 điện thoại có một bug: các nút gửi tràn ở cỡ chữ lớn, các nút biểu tượng không có nhãn trợ năng, một lần gửi thất bại chỉ nói Error, các giá trị cài đặt bị cắt giữa từ, và một danh sách thiết bị tải mãi không xong. Không bug nào được quá 12 trong 20 điện thoại nhìn thấy." width="100%">
</picture>

69 phút từ lúc bắt đầu đến báo cáo cuối cùng (gói Free chạy 5 job macOS cùng lúc), $4.62 mức dùng model cho cả 20. Mọi báo cáo, theo từng thiết bị: [docs/runs/localsend-20.md](../../../docs/runs/localsend-20.md). Tự chạy:

```bash
gh workflow run agent-testers.yml -f source_repo=localsend/localsend -f app_dir=app \
  -f app_id=org.localsend.localsend_app -f android_personas=all -f ios_personas=all -f record_video=true
```

## AnkiDroid: 10 agent, chạy thẳng từ APK của bản release

<p align="center"><img src="../../../assets/real-findings-ankidroid.png" alt="Bốn màn hình AnkiDroid, mỗi vấn đề được khoanh đỏ: một chiếc Pixel 7 ở cỡ chữ 200% nơi các nút Again, Hard, Good và Easy bị cắt một nửa (hiển thị phóng to), trang Statistics của cùng chiếc điện thoại đó nơi các dòng tràn ra khỏi mép phải, và màn hình chào mừng bằng tiếng Bồ Đào Nha và tiếng Nhật nơi nút Get started vẫn còn tiếng Anh" width="100%"></p>

[AnkiDroid](https://github.com/ankidroid/Anki-Android) là một ứng dụng Kotlin với 12k stars. 10 agent trên 10 trình giả lập Android, từ APK của bản release trên GitHub của họ, không cần build:

- Pixel 7 ở font 200% của Android: các nút Again / Hard / Good / Easy bị cắt một nửa, và chữ trong Statistics tràn ra khỏi mép phải. Một agent thứ hai thấy các nút vẫn bị cắt trên bản alpha 2.26 của họ, ở cả hai hàng khi "Show large answer buttons" được bật.
- Màn hình chào mừng hiển thị "Get started" bằng tiếng Anh trên các thiết bị đặt tiếng Bồ Đào Nha, tiếng Tây Ban Nha và tiếng Nhật, trong khi phần còn lại của màn hình đã được dịch (ba agent, mỗi agent tự phát hiện).

83 báo cáo, gom thành 43 vấn đề khác nhau (hai trong số đó đến từ WebView hệ thống đã lỗi thời của các image giả lập Android 10 và 11, không phải từ ứng dụng). Dưới 10 phút từ lúc bắt đầu đến báo cáo cuối cùng, $4.69 mức dùng model cho cả 10. Mọi báo cáo: [docs/runs/ankidroid-10.md](../../../docs/runs/ankidroid-10.md). Tự chạy:

```bash
gh workflow run agent-testers.yml -f app_dir=. -f app_id=com.ichi2.anki -f brief=briefs/ankidroid.md \
  -f android_build="curl -fsSL -o anki.apk https://github.com/ankidroid/Anki-Android/releases/download/v2.25.3/AnkiDroid-2.25.3-full-universal.apk" \
  -f apk_path=anki.apk -f android_personas=all -f ios_personas=none -f block_hosts="ankiweb.net www.google-analytics.com"
```

## Ứng dụng mẫu animations chính thức của Flutter

<p align="center"><img src="../../../assets/real-finding-flutter.png" alt="Hai điện thoại ở cùng một màn hình của ứng dụng mẫu animations của Flutter, một chiếc Pixel 7 và một chiếc iPhone SE dùng tiếng Pháp, với tiêu đề Streamling your courses được khoanh tròn: cả hai agent đều tự báo cáo lỗi chính tả này" width="100%"></p>

Trong [ứng dụng mẫu của flutter/packages](https://github.com/flutter/packages/tree/main/packages/animations/example), một agent trên Pixel 7 và một agent khác trên iPhone SE dùng tiếng Pháp mỗi agent đều báo cáo cùng một lỗi chính tả, "Streamling your courses" ([dòng 110](https://github.com/flutter/packages/blob/main/packages/animations/example/lib/shared_axis_transition.dart#L110)), và agent Android nhận thấy ứng dụng phớt lờ chế độ tối. 19 phút, $0.47 mức dùng model.

Đã chạy trên ứng dụng của bạn? [Chia sẻ những gì nó tìm thấy](https://github.com/pierridotite/mobile-agent-testers/issues/new?title=Finding:%20) và nó sẽ vào [các lần chạy](../../../docs/runs/). Nếu bạn bảo trì một trong các ứng dụng này và cho rằng một phát hiện là sai, hãy mở một issue và nó sẽ được sửa rồi chạy lại.
