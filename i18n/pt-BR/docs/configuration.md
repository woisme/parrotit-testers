# Teste o seu próprio app

[English](../../../docs/configuration.md) · [简体中文](../../zh-CN/docs/configuration.md) · [日本語](../../ja/docs/configuration.md) · [Español](../../es/docs/configuration.md) · Português · [Tiếng Việt](../../vi/docs/configuration.md) · [Türkçe](../../tr/docs/configuration.md)

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

| Entrada | |
|---|---|
| `source_repo`, `ref` | Repositório e branch do app (vazio = este repositório). Repositório privado: adicione um secret `SOURCE_REPO_TOKEN` somente leitura |
| `app_dir`, `app_id` | Pasta do app, pacote Android / bundle id iOS (se a outra plataforma usa outro id, ele é lido do app compilado) |
| `android_personas`, `ios_personas` | Ids do [personas.json](../../../personas.json), um celular cada, `all`, ou `none` para pular uma plataforma. 20 prontas: 14 idiomas, direita para a esquerda, tablets, texto do pequeno ao maior tamanho de acessibilidade |
| `brief` | Instruções para os agentes: [AGENT_BRIEF.md](../../../AGENT_BRIEF.md) para explorar, [briefs/improve.md](../../../briefs/improve.md) para um relatório de melhorias, ou o seu para uma função |
| `bug_report` | Um bug para reproduzir em vez de explorar: uma issue (`owner/repo#123` ou a URL dela) ou os passos em texto. Cada agente segue os passos no próprio aparelho ([briefs/reproduce.md](../../../briefs/reproduce.md)) |
| `web_personas`, `web_url` | Ids das personas web (`tom`, `amelie`, `lena`, `arjun`), `all`, ou `none` (padrão), e o endereço do site a testar. As outras plataformas mantêm seus padrões: use `android_personas=none` e `ios_personas=none` para rodar só na web. |
| `model`, `llm_base_url` | `sonnet` por padrão, `haiku` para gastar menos, ou qualquer API compatível com a Anthropic com a chave em um secret `LLM_API_KEY` ([docs/cheaper-models.md](../../../docs/cheaper-models.md)) |
| `framework` | `auto` (padrão) ou force um dos frameworks abaixo |
| `android_build` + `apk_path`, `ios_build` + `ios_app_path` | Seu próprio comando de build, ou o download de um app já compilado (caminhos relativos a `app_dir`) |
| `build_args` | Argumentos extras para a compilação automática das duas plataformas, como `--dart-define=API_URL=https://staging.example.com` no Flutter (argumentos de Gradle e xcodebuild nos outros). Chaves vão num secret `BUILD_ARGS`: num repositório público, as entradas de cada execução são públicas |
| `block_hosts` | Hosts de analytics bloqueados durante os testes |
| `record_video` | Gravação de tela de cada celular, criptografada com os relatórios |
| `replay_path` | Experimental, Android: depois de cada agente, o percurso dele é repetido no mesmo celular sem modelo ([docs/replay.md](../../../docs/replay.md)) |
| `replay_traces`, `replay_times` | Experimental, Android: sem agente. Os traces guardados em uma pasta do repo são repetidos `replay_times` vezes cada um (20 por padrão) no celular de cada persona, sem modelo ([docs/replay.md](../../../docs/replay.md#replay-kept-traces-many-times)) |
| `map` | Experimental, Android: primeiro percorre todas as telas. `robot`: um robô sem modelo, gratuito. `robot+agent`: o robô e depois um agente só para os formulários que ele não conseguiu passar. Use uma só persona ([docs/dashboard.md](../../../docs/dashboard.md)) |

**Suportados de fábrica** (detecção automática):

| Framework | Android | Simulador de iOS |
|---|---|---|
| Flutter | `flutter build apk --debug` | `flutter build ios --simulator` |
| React Native / Expo | Gradle release | Xcode, arm64 |
| Kotlin / Java, Swift / Objective-C nativos | Gradle debug | Xcode, arm64 |
| Kotlin Multiplatform | Gradle debug | Projeto Xcode do app iOS |
| Capacitor / Ionic | Gradle debug depois de `cap sync` | Xcode depois de `cap sync` |
| .NET MAUI (beta) | `dotnet publish` | `dotnet build` para `iossimulator-arm64` |
| Qualquer outro | `android_build` + `apk_path` | `ios_build` + `ios_app_path` |

Os agentes leem a tela pelas capturas e pela árvore de acessibilidade, então qualquer toolkit de interface
funciona. Widgets com rótulo (`Semantics` do Flutter, `contentDescription`, `accessibilityLabel`) dão a eles
toques mais precisos.
