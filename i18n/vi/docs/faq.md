# Câu hỏi thường gặp

[English](../../../docs/faq.md) · [简体中文](../../zh-CN/docs/faq.md) · [日本語](../../ja/docs/faq.md) · [Español](../../es/docs/faq.md) · [Português](../../pt-BR/docs/faq.md) · Tiếng Việt · [Türkçe](../../tr/docs/faq.md)

## Có phải 20 agent chỉ tìm thấy cùng một bug 20 lần?

Không. Trên LocalSend, 103 báo cáo là 46 bug khác nhau, và 29 trong số đó chỉ được một agent tìm thấy, kể cả bug chặn duy nhất ([xem lần chạy](../../../docs/runs/localsend-20.md)). Các bug phải-sang-trái chỉ đến từ hai persona tiếng Ả Rập, và các bug máy tính bảng từ bốn chiếc máy tính bảng. Các bản trùng lặp là những trạng thái toàn ứng dụng mà ai cũng gặp, như danh sách thiết bị trống.

## Chi phí bao nhiêu?

Runner của GitHub miễn phí cho các repo công khai, kể cả macOS. Mức dùng model là $0.15 đến $0.55 mỗi agent trong [các lần chạy này](../../../docs/runs/), nên khoảng $5 cho 20 điện thoại. Với gói đăng ký Claude, các lần chạy tính vào mức dùng của gói của bạn thay vì hóa đơn. Để tốn ít hơn, chạy `model=haiku` hoặc model của nhà cung cấp khác: [docs/cheaper-models.md](../../../docs/cheaper-models.md).

## Một lần chạy mất bao lâu?

Mỗi agent khám phá từ 1 đến 18 phút. 10 agent Android của AnkiDroid mất dưới 10 phút từ lúc bắt đầu đến báo cáo cuối cùng. 20 thiết bị của LocalSend mất 69 phút, tính cả build, vì gói Free chạy 5 job macOS cùng lúc.

## Tôi có cần máy Mac không?

Không. Mọi thứ chạy trên runner của GitHub: Linux cho Android, macOS cho iOS. Bạn cần CLI `gh` và một gói đăng ký Claude hoặc API key, và `./setup.sh` (`.\setup.ps1` trên Windows) lo phần còn lại.

## Hai lần chạy có cho cùng kết quả không?

Không. Mỗi agent tự khám phá, nên hai lần chạy không bao giờ đi cùng một đường: hãy kỳ vọng cùng các loại bug, không phải cùng một danh sách. Giữ các test dạng script (Maestro, Appium) cho hồi quy, xem [bản so sánh](../../../docs/compare.md).

## Báo cáo của tôi có công khai không?

Không. Log của một repo công khai là công khai, nên các báo cáo, ảnh chụp màn hình và video được mã hóa bằng key của bạn trước khi rời runner, và chỉ bạn mới giải mã được. Các host phân tích bị chặn bên trong điện thoại. Dùng tài khoản test, đừng bao giờ dùng tài khoản thật. Thêm trong [PRIVACY.md](../../../PRIVACY.md).

## Tôi có thể kiểm thử một ứng dụng mã nguồn đóng không?

Có. Chạy workflow từ một repo riêng tư, với `SOURCE_REPO_TOKEN` chỉ đọc cho repo ứng dụng của bạn, hoặc trỏ `android_build` và `ios_build` tới một APK hoặc .app đã build sẵn. Repo riêng tư dùng phút Actions của bạn, và phút macOS tính gấp mười.

## Tôi có thể tự tạo persona không?

Có. Một persona là vài dòng trong [personas.json](../../../personas.json): thiết bị, phiên bản hệ điều hành, ngôn ngữ, cỡ chữ, chế độ tối, vị trí, họ là ai và họ cố làm gì. Hai tùy chọn trong `device`: `"increase_contrast": true` (Tăng độ tương phản trên iOS, chữ tương phản cao trên Android) và `"reduce_motion": true` (chỉ iOS: trình giả lập Android vốn đã tắt hiệu ứng chuyển động).

## Nó hay sai ở đâu?

Đôi khi nó đọc sai một màn hình: 3 trong 20 agent của LocalSend đã gắn cờ bàn phím tiếng Anh của Simulator như một phần của ứng dụng. Vài phút mỗi agent bao quát các đường đi chính, không phải mọi ngóc ngách của một ứng dụng lớn. Mỗi phát hiện đều kèm ảnh chụp màn hình được đánh số, nên hãy kiểm tra chúng trước khi báo cáo bất cứ điều gì.

## Giới hạn

- Runner của GitHub miễn phí cho repo công khai: khoảng 20 job cùng lúc, 5 trên macOS.
- Trên các gói có giới hạn dùng 5 giờ, 20 agent có thể dùng hết trong ~15 phút: chạy theo đợt 6-10.
- Runner được lưu trữ dành cho dự án của chính repo đó. Với ứng dụng mã nguồn đóng, chạy workflow trong repo riêng tư của bạn hoặc trên máy Mac của riêng bạn.

## Cách hoạt động

<p align="center"><img src="../../../assets/how-it-works.svg" alt="Cách hoạt động: một workflow build ứng dụng, rồi một trình giả lập với một agent cho mỗi persona, các báo cáo được mã hóa, bản tóm tắt trên máy của bạn" width="100%"></p>

- **Persona** quyết định thiết bị: model, hệ điều hành, cỡ font, chế độ tối, ngôn ngữ, vị trí.
- **Ba công cụ cho mỗi agent**: nhìn màn hình (với tọa độ chạm), cử chỉ, gõ chữ.
- **Kiểm tra trợ năng** trên mọi màn hình: các điều khiển không có tên và vùng chạm dưới 48 dp (Android) hoặc 44 pt (iOS), để agent xác nhận trên ảnh chụp màn hình.
- **Kết quả được mã hóa**: log của repo công khai là công khai, nên mọi thứ được mã hóa bằng key của bạn.
- **Chặn phân tích** bên trong điện thoại, để các lần kiểm thử không bao giờ chạm vào số liệu thật của bạn.
- **Một bản tóm tắt** trên máy của bạn. Với `SUMMARY_GROUPING=1`, Claude gom các báo cáo mô tả cùng một bug (một lần gọi bằng tài khoản Claude của bạn), để bạn thấy bao nhiêu persona gặp mỗi bug và persona nào tìm thấy loại vấn đề nào. Khi đặt `SUMMARY_WEBHOOK_URL`, một bản ngắn cũng được gửi tới webhook Slack hoặc Discord của bạn, chỉ từ máy của bạn.
- **Bản nháp issue** trên máy của bạn: `python3 scripts/draft_issues.py runs/<id>` xem trước một issue GitHub cho mỗi phát hiện trong `SUMMARY.md`, và `--create --repo OWNER/REPO` mở những issue bạn xác nhận bằng `gh`.
- **Test** trên mỗi lần push, ngoại tuyến và không cần điện thoại: kiểm tra trợ năng, ma trận persona, tóm tắt, kết quả được mã hóa ([tests/](../../../tests/)).

## Sao không dùng Maestro, Appium hay agent-device?

Chúng chạy các test bạn viết. Các agent này tìm những gì không ai nghĩ tới để kiểm thử.

| | mobile-agent-testers | Maestro, Appium, Detox, e2e |
|---|---|---|
| Bạn viết | Không gì cả: chọn persona từ danh sách | Các luồng hoặc mã test |
| Nó bắt được | Luồng bị hỏng, lỗi im lặng, bản dịch còn thiếu, bố cục ở cỡ chữ lớn, chế độ tối, nội dung chữ gây khó hiểu | Những gì mỗi test kiểm tra |
| Cùng kết quả mỗi lần chạy | Không: mỗi lần chạy tự khám phá, nên hãy kiểm tra ảnh chụp màn hình | Có |

[agent-device](https://github.com/callstackincubator/agent-device) cho một agent lập trình điều khiển một trình giả lập. Công cụ này chạy cả một phiên: nó build ứng dụng, cho mỗi persona thiết bị riêng và thu thập các báo cáo được mã hóa. Dùng agent trước một bản phát hành, và các luồng dạng script cho hồi quy.

So sánh đầy đủ, với Firebase Test Lab Robo, mobile-mcp, phonedriver và người kiểm thử beta: [docs/compare.md](../../../docs/compare.md) (bằng tiếng Anh).
