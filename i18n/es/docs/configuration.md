# Prueba tu propia app

[English](../../../docs/configuration.md) · [简体中文](../../zh-CN/docs/configuration.md) · [日本語](../../ja/docs/configuration.md) · Español · [Português](../../pt-BR/docs/configuration.md) · [Tiếng Việt](../../vi/docs/configuration.md) · [Türkçe](../../tr/docs/configuration.md)

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

| Entrada | |
|---|---|
| `source_repo`, `ref` | Repositorio y rama de la app (vacío = este repositorio). Repositorio privado: añade un secret `SOURCE_REPO_TOKEN` de solo lectura |
| `app_dir`, `app_id` | Carpeta de la app, paquete de Android / bundle id de iOS (si la otra plataforma usa otro id, se lee de su app compilada) |
| `android_personas`, `ios_personas` | Ids de [personas.json](../../../personas.json), un teléfono cada una, `all`, o `none` para saltar una plataforma. 20 listas: 14 idiomas, derecha a izquierda, tabletas, texto desde pequeño hasta el mayor tamaño de accesibilidad |
| `brief` | Instrucciones para los agentes: [AGENT_BRIEF.md](../../../AGENT_BRIEF.md) para explorar, [briefs/improve.md](../../../briefs/improve.md) para un informe de mejoras, o el tuyo para una función |
| `bug_report` | Un error que reproducir en lugar de explorar: un issue (`owner/repo#123` o su URL) o los pasos en texto. Cada agente lo sigue en su propio dispositivo ([briefs/reproduce.md](../../../briefs/reproduce.md)) |
| `web_personas`, `web_url` | Ids de personas web (`tom`, `amelie`, `lena`, `arjun`), `all`, o `none` (por defecto), y la dirección del sitio que probar. Las otras plataformas conservan sus valores por defecto: pon `android_personas=none` y `ios_personas=none` para una ejecución solo web. |
| `model`, `llm_base_url` | `sonnet` por defecto, `haiku` para gastar menos, o cualquier API compatible con Anthropic con su clave en un secret `LLM_API_KEY` ([docs/cheaper-models.md](../../../docs/cheaper-models.md)) |
| `framework` | `auto` (por defecto) o fuerza uno de los frameworks de abajo |
| `android_build` + `apk_path`, `ios_build` + `ios_app_path` | Tu propio comando de compilación, o la descarga de una app ya compilada (rutas relativas a `app_dir`) |
| `build_args` | Argumentos extra para la compilación automática de las dos plataformas, como `--dart-define=API_URL=https://staging.example.com` en Flutter (argumentos de Gradle y xcodebuild en los demás). Las claves van en un secreto `BUILD_ARGS`: en un repo público, las entradas de cada ejecución son públicas |
| `block_hosts` | Hosts de analítica bloqueados durante las pruebas |
| `record_video` | Grabación de pantalla de cada teléfono, cifrada con los informes |
| `replay_path` | Experimental, Android: después de cada agente, su recorrido se repite en el mismo teléfono sin modelo ([docs/replay.md](../../../docs/replay.md)) |
| `replay_traces`, `replay_times` | Experimental, Android: sin agente. Las trazas guardadas en una carpeta del repo se repiten `replay_times` veces cada una (20 por defecto) en el teléfono de cada persona, sin modelo ([docs/replay.md](../../../docs/replay.md#replay-kept-traces-many-times)) |
| `map` | Experimental, Android: primero se recorren todas las pantallas. `robot`: un robot sin modelo, gratis. `robot+agent`: el robot y después un agente solo para los formularios que no pudo pasar. Usa una sola persona ([docs/dashboard.md](../../../docs/dashboard.md)) |

**Compatibles de serie** (detección automática):

| Framework | Android | Simulador de iOS |
|---|---|---|
| Flutter | `flutter build apk --debug` | `flutter build ios --simulator` |
| React Native / Expo | Gradle release | Xcode, arm64 |
| Kotlin / Java, Swift / Objective-C nativos | Gradle debug | Xcode, arm64 |
| Kotlin Multiplatform | Gradle debug | Proyecto Xcode de la app de iOS |
| Capacitor / Ionic | Gradle debug tras `cap sync` | Xcode tras `cap sync` |
| .NET MAUI (beta) | `dotnet publish` | `dotnet build` para `iossimulator-arm64` |
| Cualquier otro | `android_build` + `apk_path` | `ios_build` + `ios_app_path` |

Los agentes leen la pantalla a partir de capturas y del árbol de accesibilidad, así que funciona con cualquier
toolkit de interfaz. Los widgets con etiqueta (`Semantics` de Flutter, `contentDescription`,
`accessibilityLabel`) les dan toques más precisos.
