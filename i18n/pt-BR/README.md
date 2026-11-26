<div align="center">

<img src="../../assets/logo.svg" alt="" width="96" height="96">

# mobile-agent-testers

**20 testadores com IA em 20 celulares diferentes, em paralelo, nos runners gratuitos do GitHub.**

[![Tests](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml/badge.svg)](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml)
[![Stars](https://img.shields.io/github/stars/pierridotite/mobile-agent-testers?style=flat)](https://github.com/pierridotite/mobile-agent-testers/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)
![iOS + Android](https://img.shields.io/badge/platforms-iOS%20%2B%20Android-blue)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)

**[Exemplos](docs/examples.md)** · **[Demo do dashboard](https://pierridotite.github.io/mobile-agent-testers/)** · **[Comparação](../../docs/compare.md)** · **[Perguntas frequentes](docs/faq.md)** · **[Personas](../../personas.json)** · **[Contribuir](../../CONTRIBUTING.md)**

<sub>[English](../../README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · [Español](../es/README.md) · Português · [Tiếng Việt](../vi/README.md) · [Türkçe](../tr/README.md)</sub>

<a href="https://www.linkedin.com/in/pierre-raffalli/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/linkedin-follow-dark.svg"><img src="../../assets/linkedin-follow-light.svg" alt="Follow Pierre Raffalli on LinkedIn" width="160" height="54"></picture></a>
<a href="https://discord.gg/WuaCANscr8"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/discord-join-dark.svg"><img src="../../assets/discord-join-light.svg" alt="Join us on Discord" width="160" height="54"></picture></a><br>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily?language=Python" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>

<sub>Tradução do README em inglês: pode estar atrasada, a referência é o [README.md](../../README.md).</sub>

</div>

<p align="center"><a href="../../assets/launch-video.mp4"><img src="../../assets/launch-video.gif" alt="Vídeo de lançamento, 26 segundos. Primeiro, gravações de tela reais de 20 testadores com IA usando o LocalSend ao mesmo tempo: 10 emuladores de Android e 10 simuladores de iOS em 14 idiomas; cada celular mostra quantos problemas relatou, 103 no total. Depois, o mapa do dashboard com o app de demo: todas as telas, uma faixa colorida por testador, um bug que vira teste e um caminho repetido sem modelo. Abre o vídeo com som." width="100%"></a><br>
<sub>Os celulares são gravações de tela reais da execução no LocalSend; o mapa é o dashboard com o <a href="../../demo-app/">app de demo</a>. <a href="../../assets/launch-video.mp4">Vídeo com som (MP4)</a> · <a href="../../assets/localsend-20.mp4">Os 20 celulares, gravação completa</a> · <a href="../../docs/runs/localsend-20.md">A execução, aparelho por aparelho</a></sub></p>

Nenhum script de teste para escrever. Cada testador é um agente do Claude Code com seu próprio simulador de iOS
ou emulador de Android no GitHub Actions. Ele interpreta uma persona (iPhone SE em sueco com o maior tamanho de
texto, Pixel 7 a 200%, iPad em alemão, árabe da direita para a esquerda...), usa o seu app como um usuário novo (ou percorre a função que você indicar) e
escreve um relatório de bugs com capturas de tela. Flutter, React Native, Expo, Kotlin e Swift nativos, Kotlin
Multiplatform, Capacitor e .NET MAUI.

Os runners do GitHub são gratuitos para repositórios públicos. Você paga só o modelo, com sua assinatura do
Claude ou chave de API: de US$ 0,15 a US$ 0,55 por celular [nestas execuções](../../docs/runs/).

## Começo rápido

```bash
gh repo create my-testers --public --template pierridotite/mobile-agent-testers --clone
cd my-testers && ./setup.sh           # par de chaves + secrets + token do Claude (Windows: .\setup.ps1)
gh workflow run agent-testers.yml     # demo: 2 testadores Android + 2 iOS, ~20 min
bash scripts/collect.sh <run id>      # descriptografa os relatórios e agrupa duplicados: runs/<id>/SUMMARY.md
```

Depois, no seu próprio app:

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

Ou deixe o Claude configurar para o seu app:

```
/plugin marketplace add pierridotite/mobile-agent-testers
/plugin install mobile-agent-testers@mobile-agent-testers
```

Todos os parâmetros (build, briefs, reproduzir um bug, modelos mais baratos, argumentos de build, vídeo) e os frameworks suportados: [docs/configuration.pt-BR.md](docs/configuration.md).

<details>
<summary>O que a execução de demo encontra</summary>

O app de demo tem [11 bugs colocados de propósito](../../demo-app/BUGS.md). Em [uma execução](../../docs/runs/), os 4 testadores da demo encontraram 9 deles (de 2 a 7 minutos por agente, cerca de 21 minutos no total, builds incluídos), além de problemas reais que ninguém colocou (um botão debaixo da barra de navegação do Android, dados que não ficam salvos depois de reabrir). Uso do modelo: US$ 0,87 para os 4.

</details>

## O que ele faz

Cada persona explora o seu app como um usuário novo e conta o que atrapalha, com capturas numeradas. Uma execução também pode percorrer uma função do começo ao fim, reproduzir um relato de bug, gerar um relatório de melhorias, comparar duas versões ou testar um site em celulares. Um uso por execução, escolhido com os parâmetros acima.

<details>
<summary>Os seis usos, um por um</summary>

| Uso | O que você recebe |
|---|---|
| **Explorar como usuários novos** (o padrão) | Cada persona tenta chegar ao seu objetivo e conta o que atrapalha, com capturas numeradas. |
| **Percorrer uma função do começo ao fim** | O seu próprio brief manda cada agente por uma mecânica inteira: uma reserva em várias etapas, um editor com desfazer, uma sincronização entre duas telas. Os agentes tocam, pressionam e seguram, deslizam e digitam, saem do app e voltam, reiniciam o app para conferir o que foi salvo ou abrem um deep link para começar direto na função, e um brief pode aumentar o orçamento de cerca de 30 ações. [O do AnkiDroid](../../briefs/ankidroid.md) encontrou o campo do verso de um cartão novo escondido atrás do teclado. |
| **Reproduzir um relato de bug** | Em cada celular: você passa uma issue ou os passos, e cada agente responde sim, não ou incerto, com capturas ([briefs/reproduce.md](../../briefs/reproduce.md)). |
| **Gerar um relatório de melhorias** | Cada persona usa o app uma vez e depois diz onde hesitou, o que esperava e o que mudaria primeiro, por área e impacto ([briefs/improve.md](../../briefs/improve.md)). |
| **Comparar duas versões** | As mesmas personas em dois branches ou builds, e depois uma tabela: objetivos alcançados, ações, notas, problemas vistos em uma versão só ([docs/compare-versions.md](../../docs/compare-versions.md)). Uma checagem antes de um teste A/B de verdade, não um substituto. |
| **Testar um site em celulares** | As mesmas personas no navegador de um celular, em qualquer site ou app web. Roda nos runners Linux gratuitos ([configuração](docs/configuration.md)). |

</details>

**Usar um modelo mais barato**: Claude Haiku, ou qualquer API compatível com a Anthropic (OpenRouter, DeepSeek, Kimi, GLM, MiniMax, Qwen). Os achados dependem de quão bem o modelo lê as capturas e raciocina ([docs/cheaper-models.md](../../docs/cheaper-models.md)).

Maestro ou Appium rodam os testes que você escreve. Estes agentes procuram o que ninguém pensou em testar: [comparação](../../docs/compare.md).

## Ver todas as telas num mapa

<a href="https://pierridotite.github.io/mobile-agent-testers/"><img src="../../assets/dashboard.png" alt="O dashboard: todas as telas do app num mapa, uma faixa colorida por tester em cada seta, um mapa de calor em cada tela e a tela selecionada à direita" width="100%"></a>

Todas as telas a que os testers chegaram, com o percurso de cada um na sua própria cor e um mapa de calor de onde tocaram. Escolha um dispositivo no menu Device para ver as telas no formato dele (celular ou tablet) e o seu próprio mapa de calor. Comente uma tela ou transforme o que está errado nela numa verificação.

<p align="center"><a href="https://pierridotite.github.io/mobile-agent-testers/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/demo-try-dark.svg"><img src="../../assets/demo-try-light.svg" alt="Experimente a demo no seu navegador" width="190" height="54"></picture></a></p>

Na sua própria execução: `python3 scripts/dashboard.py runs/<id>`. Roda na sua máquina e os resultados nunca saem dela ([docs/dashboard.md](../../docs/dashboard.md)).

## Cada bug vira um teste

Um tester que encontra um bug seguiu um percurso que nenhum script teria escrito. Cada tester Android guarda esse percurso como um trace, com cada toque nomeado pelo elemento que estava sob o dedo. Com `-f replay_path=true`, o percurso é reproduzido no mesmo celular logo depois do agente, sem modelo. Uma verificação adicionada no mapa faz o bug entrar no teste: a reprodução diz `bug` enquanto ele está lá e `fixed` quando some ([docs/replay.md](../../docs/replay.md)).

Os traces seguem o Explore-Compile-Replay, meu formato aberto que compila o percurso de um agente num fluxo do [Maestro](https://maestro.dev). Só Android por enquanto; o ECR é um primeiro rascunho.

<p align="center"><a href="https://github.com/pierridotite/explore-compile-replay"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/ecr-button-dark.svg"><img src="../../assets/ecr-button-light.svg" alt="Explore-Compile-Replay: cada bug vira um teste" width="320" height="54"></picture></a></p>

## Execuções reais

Execuções reais em apps de código aberto, sem nada plantado. No [LocalSend](https://github.com/localsend/localsend) (Flutter, 100 mil estrelas), 20 celulares em 14 idiomas encontraram 46 bugs distintos em 69 minutos, por US$ 4,62 de uso do modelo. Um deles é bloqueador: num iPhone SE em sueco com o maior tamanho de texto, não dá para enviar nenhuma mensagem de texto.

<details>
<summary>As três execuções: LocalSend, AnkiDroid e o exemplo de animações do Flutter</summary>

| App | Celulares | O que os agentes encontraram | Tempo, uso do modelo |
|---|---|---|---|
| [LocalSend](https://github.com/localsend/localsend) (Flutter, 100 mil estrelas) | 20: 10 Android, 10 iOS, 14 idiomas | 46 bugs distintos, 1 bloqueador: num iPhone SE em sueco com o maior tamanho de texto, não dá para enviar nenhuma mensagem de texto | 69 min, US$ 4,62 |
| [AnkiDroid](https://github.com/ankidroid/Anki-Android) (Kotlin, 12 mil estrelas, APK publicado) | 10 Android | 43 problemas distintos, entre eles os botões de resposta cortados pela metade com a fonte a 200% e "Get started" em inglês em três idiomas | menos de 10 min, US$ 4,69 |
| [Exemplo de animações do Flutter](https://github.com/flutter/packages/tree/main/packages/animations/example) | 1 Android, 1 iOS | O mesmo erro de digitação, encontrado pelos dois agentes, cada um por conta própria, e um app que ignora o modo escuro | 19 min, US$ 0,47 |

</details>

No LocalSend, 34 dos 46 bugs não tinham nada a ver com tamanho de texto nem com acessibilidade: fluxos quebrados, falhas silenciosas, traduções faltando, layouts de tablet. Capturas de tela, cada bug encontrado e os comandos para rodar de novo: [docs/examples.pt-BR.md](docs/examples.md).

## Contribuir

[Há issues prontas para pegar](https://github.com/pierridotite/mobile-agent-testers/issues/9), algumas delas [good first issues](https://github.com/pierridotite/mobile-agent-testers/labels/good%20first%20issue): novas personas, outro CLI de agente, GitLab CI, traduções. Comente na que você pegar para que duas pessoas não façam a mesma coisa. O [CONTRIBUTING.md](../../CONTRIBUTING.md) diz por onde cada uma começa e como testá-la offline. Teve um pull request aceito ou rodou no seu app? [Mostre o seu trabalho](../../docs/share.md). Dúvidas: [Discord](https://discord.gg/WuaCANscr8).

## Versão hospedada para equipes (em estudo)

O fluxo deste repositório continua gratuito, de código aberto e completo. Estou estudando uma versão hospedada para equipes com apps privados: runners macOS incluídos (num repositório privado, o GitHub conta cada minuto de macOS dez vezes) e um painel web para compartilhar os relatórios com a equipe toda, product managers incluídos.

Isso ajudaria a sua equipe? [Responda três perguntas](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=teams.yml) ou [fale comigo no LinkedIn](https://www.linkedin.com/in/pierre-raffalli/). Já rodou no seu app? [Conte o que ele encontrou e o que atrapalhou](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=usage-feedback.yml).

## Histórico de estrelas

[![Star History Chart](https://api.star-history.com/svg?repos=pierridotite/mobile-agent-testers&type=Date)](https://star-history.com/#pierridotite/mobile-agent-testers&Date)

## Créditos

[Claude Code](https://docs.claude.com/en/docs/claude-code) ·
[AXe](https://github.com/cameroncooke/axe) ·
[android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner)

## Contribuidores

Obrigado a todas as pessoas que contribuíram. Quer ajudar? [Comece aqui](../../CONTRIBUTING.md).

<a href="https://github.com/pierridotite/mobile-agent-testers/graphs/contributors"><img src="https://contrib.rocks/image?repo=pierridotite/mobile-agent-testers" alt="Contributors" /></a>

Feito por Pierre Raffalli · [LinkedIn](https://www.linkedin.com/in/pierre-raffalli/) · [GitHub](https://github.com/pierridotite) · [Discord](https://discord.gg/WuaCANscr8) · licença MIT
