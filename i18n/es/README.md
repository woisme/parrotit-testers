<div align="center">

<img src="../../assets/logo.svg" alt="" width="96" height="96">

# mobile-agent-testers

**20 testers con IA en 20 teléfonos distintos, en paralelo, en los runners gratuitos de GitHub.**

[![Tests](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml/badge.svg)](https://github.com/pierridotite/mobile-agent-testers/actions/workflows/tests.yml)
[![Stars](https://img.shields.io/github/stars/pierridotite/mobile-agent-testers?style=flat)](https://github.com/pierridotite/mobile-agent-testers/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)
![iOS + Android](https://img.shields.io/badge/platforms-iOS%20%2B%20Android-blue)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)

**[Ejemplos](docs/examples.md)** · **[Demo del dashboard](https://pierridotite.github.io/mobile-agent-testers/)** · **[Comparativa](../../docs/compare.md)** · **[Preguntas frecuentes](docs/faq.md)** · **[Personas](../../personas.json)** · **[Contribuir](../../CONTRIBUTING.md)**

<sub>[English](../../README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · Español · [Português](../pt-BR/README.md) · [Tiếng Việt](../vi/README.md) · [Türkçe](../tr/README.md)</sub>

<a href="https://www.linkedin.com/in/pierre-raffalli/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/linkedin-follow-dark.svg"><img src="../../assets/linkedin-follow-light.svg" alt="Follow Pierre Raffalli on LinkedIn" width="160" height="54"></picture></a>
<a href="https://discord.gg/WuaCANscr8"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/discord-join-dark.svg"><img src="../../assets/discord-join-light.svg" alt="Join us on Discord" width="160" height="54"></picture></a><br>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily?language=Python" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>
<a href="https://trendshift.io/repositories/371956?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-371956" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/371956/daily" alt="pierridotite%2Fmobile-agent-testers | Trendshift" width="250" height="55"/></a>

<sub>Traducción del README en inglés: puede ir con retraso, la referencia es [README.md](../../README.md).</sub>

</div>

<p align="center"><a href="../../assets/launch-video.mp4"><img src="../../assets/launch-video.gif" alt="Vídeo de lanzamiento, 26 segundos. Primero, grabaciones de pantalla reales de 20 testers con IA usando LocalSend a la vez: 10 emuladores de Android y 10 simuladores de iOS en 14 idiomas; cada teléfono muestra cuántos problemas reportó, 103 en total. Después, el mapa del dashboard con la app de demo: todas las pantallas, un carril de color por tester, un error que se convierte en test y un recorrido repetido sin modelo. Abre el vídeo con sonido." width="100%"></a><br>
<sub>Los teléfonos son grabaciones de pantalla reales de la ejecución en LocalSend; el mapa es el dashboard con la <a href="../../demo-app/">app de demo</a>. <a href="../../assets/launch-video.mp4">Vídeo con sonido (MP4)</a> · <a href="../../assets/localsend-20.mp4">Los 20 teléfonos, grabación completa</a> · <a href="../../docs/runs/localsend-20.md">La ejecución, dispositivo por dispositivo</a></sub></p>

Sin scripts de prueba que escribir. Cada tester es un agente de Claude Code con su propio simulador de iOS
o emulador de Android en GitHub Actions. Interpreta una persona (iPhone SE en sueco con el texto más grande,
Pixel 7 al 200 %, iPad en alemán, árabe de derecha a izquierda...), usa tu app como un usuario nuevo (o recorre la función que le indiques) y escribe
un informe de errores con capturas. Flutter, React Native, Expo, Kotlin y Swift nativos, Kotlin
Multiplatform, Capacitor y .NET MAUI.

Los runners de GitHub son gratuitos para repos públicos. Solo pagas el modelo, con tu suscripción de Claude
o tu clave de API: entre 0,15 y 0,55 $ por teléfono en [estas ejecuciones](../../docs/runs/).

## Inicio rápido

```bash
gh repo create my-testers --public --template pierridotite/mobile-agent-testers --clone
cd my-testers && ./setup.sh           # par de claves + secrets + token de Claude (Windows: .\setup.ps1)
gh workflow run agent-testers.yml     # demo: 2 testers Android + 2 iOS, ~20 min
bash scripts/collect.sh <run id>      # descifra los informes y agrupa duplicados: runs/<id>/SUMMARY.md
```

Luego, en tu propia app:

```bash
gh workflow run agent-testers.yml -f source_repo=you/app -f app_id=com.you.app \
  -f android_personas=anna,malik -f ios_personas=clara,jonas
```

O deja que Claude lo configure para tu app:

```
/plugin marketplace add pierridotite/mobile-agent-testers
/plugin install mobile-agent-testers@mobile-agent-testers
```

Todos los parámetros (compilación, briefs, reproducir un bug, modelos más baratos, argumentos de compilación, vídeo) y los frameworks compatibles: [docs/configuration.es.md](docs/configuration.md).

<details>
<summary>Lo que encuentra la ejecución de demo</summary>

La app de demo tiene [11 errores puestos a propósito](../../demo-app/BUGS.md). En [una ejecución](../../docs/runs/), los 4 testers de la demo encontraron 9 (de 2 a 7 minutos por agente, unos 21 minutos en total con las compilaciones), además de problemas reales que nadie había puesto (un botón bajo la barra de navegación de Android, datos que no se guardan al reiniciar). Uso del modelo: 0,87 $ para los 4.

</details>

## Qué puede hacer

Cada persona explora tu app como un usuario nuevo y cuenta qué le impide avanzar, con capturas numeradas. Una ejecución también puede recorrer una función de principio a fin, reproducir un informe de error, escribir un informe de mejoras, comparar dos versiones o probar un sitio web en teléfonos. Un uso por ejecución, elegido con los parámetros de arriba.

<details>
<summary>Los seis usos, uno por uno</summary>

| Uso | Lo que obtienes |
|---|---|
| **Explorar como usuarios nuevos** (por defecto) | Cada persona intenta alcanzar su objetivo y cuenta lo que se lo impide, con capturas numeradas. |
| **Recorrer una función de principio a fin** | Tu propio brief manda a cada agente por una mecánica completa: una reserva en varios pasos, un editor con deshacer, una sincronización entre dos pantallas. Los agentes tocan, mantienen pulsado, deslizan y escriben, salen de la app y vuelven, la reinician para comprobar qué se guardó o abren un enlace profundo para empezar directamente en la función, y un brief puede subir el presupuesto de unas 30 acciones. [El de AnkiDroid](../../briefs/ankidroid.md) encontró el campo del reverso de una tarjeta nueva tapado por el teclado. |
| **Reproducir un informe de error** | En cada teléfono: das un issue o los pasos, y cada agente responde sí, no o no está claro, con capturas ([briefs/reproduce.md](../../briefs/reproduce.md)). |
| **Obtener un informe de mejoras** | Cada persona usa la app una vez y luego dice dónde dudó, qué esperaba y qué cambiaría primero, por área e impacto ([briefs/improve.md](../../briefs/improve.md)). |
| **Comparar dos versiones** | Las mismas personas en dos ramas o builds, y luego una tabla: objetivos alcanzados, acciones, puntuaciones, errores vistos en una sola versión ([docs/compare-versions.md](../../docs/compare-versions.md)). Una comprobación antes de un test A/B real, no un sustituto. |
| **Probar un sitio web en teléfonos** | Las mismas personas en el navegador de un teléfono, en cualquier sitio o app web. Funciona en los runners Linux gratuitos ([configuración](docs/configuration.md)). |

</details>

**Usar un modelo más barato**: Claude Haiku, o cualquier API compatible con Anthropic (OpenRouter, DeepSeek, Kimi, GLM, MiniMax, Qwen). Los hallazgos dependen de lo bien que el modelo lea las capturas y razone ([docs/cheaper-models.md](../../docs/cheaper-models.md)).

Maestro o Appium ejecutan las pruebas que tú escribes. Estos agentes buscan lo que nadie pensó en probar: [comparativa](../../docs/compare.md).

## Ver todas las pantallas en un mapa

<a href="https://pierridotite.github.io/mobile-agent-testers/"><img src="../../assets/dashboard.png" alt="El dashboard: todas las pantallas de la app en un mapa, un carril de color por tester en cada flecha, un mapa de calor en cada pantalla y la pantalla seleccionada a la derecha" width="100%"></a>

Todas las pantallas a las que llegaron los testers, con el recorrido de cada uno en su propio color y un mapa de calor de dónde tocaron. Elige un dispositivo en el menú Device para ver las pantallas con su forma (teléfono o tableta) y su propio mapa de calor. Comenta una pantalla o convierte lo que falla en ella en una comprobación.

<p align="center"><a href="https://pierridotite.github.io/mobile-agent-testers/"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/demo-try-dark.svg"><img src="../../assets/demo-try-light.svg" alt="Prueba la demo en tu navegador" width="190" height="54"></picture></a></p>

En tu propia ejecución: `python3 scripts/dashboard.py runs/<id>`. Funciona en tu máquina y los resultados nunca salen de ella ([docs/dashboard.md](../../docs/dashboard.md)).

## Cada bug se convierte en un test

Un tester que encuentra un bug siguió un recorrido que ningún script habría escrito. Cada tester de Android guarda ese recorrido como una traza, con cada toque nombrado según el elemento que estaba bajo el dedo. Con `-f replay_path=true`, el recorrido se reproduce en el mismo teléfono justo después del agente, sin modelo. Una comprobación añadida en el mapa hace que el bug forme parte del test: la reproducción dice `bug` mientras sigue ahí y `fixed` cuando desaparece ([docs/replay.md](../../docs/replay.md)).

Las trazas siguen Explore-Compile-Replay, mi formato abierto que compila el recorrido de un agente en un flujo de [Maestro](https://maestro.dev). Solo Android por ahora; ECR es un primer borrador.

<p align="center"><a href="https://github.com/pierridotite/explore-compile-replay"><picture><source media="(prefers-color-scheme: dark)" srcset="../../assets/ecr-button-dark.svg"><img src="../../assets/ecr-button-light.svg" alt="Explore-Compile-Replay: cada bug se convierte en un test" width="320" height="54"></picture></a></p>

## Ejecuciones reales

Ejecuciones reales en apps de código abierto, sin nada plantado. En [LocalSend](https://github.com/localsend/localsend) (Flutter, 100 000 estrellas), 20 teléfonos en 14 idiomas encontraron 46 errores distintos en 69 minutos, por 4,62 $ de uso del modelo. Uno es bloqueante: en un iPhone SE en sueco con el texto más grande, no se puede enviar ningún mensaje de texto.

<details>
<summary>Las tres ejecuciones: LocalSend, AnkiDroid y el ejemplo de animaciones de Flutter</summary>

| App | Teléfonos | Lo que encontraron los agentes | Tiempo, uso del modelo |
|---|---|---|---|
| [LocalSend](https://github.com/localsend/localsend) (Flutter, 100 000 estrellas) | 20: 10 Android, 10 iOS, 14 idiomas | 46 errores distintos, 1 bloqueante: en un iPhone SE en sueco con el texto más grande, no se puede enviar ningún mensaje de texto | 69 min, 4,62 $ |
| [AnkiDroid](https://github.com/ankidroid/Anki-Android) (Kotlin, 12 000 estrellas, APK publicado) | 10 Android | 43 problemas distintos, entre ellos los botones de respuesta cortados por la mitad con la fuente al 200 % y «Get started» en inglés en tres idiomas | menos de 10 min, 4,69 $ |
| [Ejemplo de animaciones de Flutter](https://github.com/flutter/packages/tree/main/packages/animations/example) | 1 Android, 1 iOS | La misma errata, encontrada por los dos agentes cada uno por su cuenta, y una app que ignora el modo oscuro | 19 min, 0,47 $ |

</details>

En LocalSend, 34 de los 46 errores no tenían nada que ver con el tamaño del texto ni con la accesibilidad: flujos rotos, fallos silenciosos, traducciones que faltan, diseños de tableta. Capturas, cada hallazgo y los comandos para volver a ejecutarlos: [docs/examples.es.md](docs/examples.md).

## Contribuir

[Hay issues listas para tomar](https://github.com/pierridotite/mobile-agent-testers/issues/9), algunas de ellas [good first issues](https://github.com/pierridotite/mobile-agent-testers/labels/good%20first%20issue): nuevas personas, otro CLI de agente, GitLab CI, traducciones. Comenta en la que tomes para que dos personas no hagan lo mismo. [CONTRIBUTING.md](../../CONTRIBUTING.md) dice por dónde empieza cada una y cómo probarla sin conexión. ¿Te fusionaron un pull request o lo probaste en tu app? [Muestra tu trabajo](../../docs/share.md). Preguntas: [Discord](https://discord.gg/WuaCANscr8).

## Versión alojada para equipos (en estudio)

El flujo de este repo sigue siendo gratis, de código abierto y completo. Estoy estudiando una versión alojada para equipos con apps privadas: runners de macOS incluidos (en un repo privado, GitHub cuenta cada minuto de macOS diez veces) y un panel web para compartir los informes con todo el equipo, product managers incluidos.

¿Le serviría a tu equipo? [Responde tres preguntas](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=teams.yml) o [escríbeme por LinkedIn](https://www.linkedin.com/in/pierre-raffalli/). ¿Ya lo probaste con tu app? [Cuéntame qué encontró y qué te frenó](https://github.com/pierridotite/mobile-agent-testers/issues/new?template=usage-feedback.yml).

## Historial de estrellas

[![Star History Chart](https://api.star-history.com/svg?repos=pierridotite/mobile-agent-testers&type=Date)](https://star-history.com/#pierridotite/mobile-agent-testers&Date)

## Créditos

[Claude Code](https://docs.claude.com/en/docs/claude-code) ·
[AXe](https://github.com/cameroncooke/axe) ·
[android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner)

## Colaboradores

Gracias a todas las personas que han contribuido. ¿Quieres ayudar? [Empieza aquí](../../CONTRIBUTING.md).

<a href="https://github.com/pierridotite/mobile-agent-testers/graphs/contributors"><img src="https://contrib.rocks/image?repo=pierridotite/mobile-agent-testers" alt="Contributors" /></a>

Hecho por Pierre Raffalli · [LinkedIn](https://www.linkedin.com/in/pierre-raffalli/) · [GitHub](https://github.com/pierridotite) · [Discord](https://discord.gg/WuaCANscr8) · licencia MIT
