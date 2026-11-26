# Traces kept in the repository

Paths written as [Explore-Compile-Replay](https://github.com/pierridotite/explore-compile-replay) traces, kept here to be replayed many times with no model: `replay_traces=traces/<app>` in [agent-testers.yml](../.github/workflows/agent-testers.yml), see [docs/replay.md](../docs/replay.md#replay-kept-traces-many-times).

- `<app>/<persona>/NAME.trace.json` is replayed on the phone of that persona, with its settings.
- `NAME.params.json` next to it gives the texts the trace types. It is public: test data only. A value for a real account goes in the `REPLAY_PARAMS` secret, `{"trace id": {"NAME": "text"}}`, which wins over the file.

`demo-app/malik/` holds two paths on the demo app, written by hand: one that passes, and one that stops on a planted bug, as the trace records. The account in their files exists nowhere: the demo app keeps nothing and calls no server.
