# Session Staking

Session Staking is a [Next.js](https://nextjs.org/) app for managing and staking
to [Session Nodes](https://github.com/oxen-io/oxen-core).

## Getting Started

You can follow the generic instructions in the root [README.md](../../README.md#getting-started) to get started.

## Development

Running the app requires several environment variables to be set. See the [.env.example](.env.example) file for a list
of required variables.

We recommend running the [Session Token Staking Backend](https://github.com/oxen-io/sent-staking-backend/) and
a [Session Node](https://github.com/oxen-io/oxen-core) yourself to ensure any changes you make will work
with the latest changes.

### Session Node

You'll need a [Session Node](https://github.com/oxen-io/oxen-core) to make RPC calls to, this node
does not need to be staked to and does not need to join the network as a participating node. You'll need to run the
following to start the node:

```shell
oxend --stagenet --lmq-public tcp://127.0.0.1:<PORT> --l2-provider https://sepolia-rollup.arbitrum.io/rpc
```

You can then set the `NEXT_PUBLIC_SENT_EXPLORER_API_URL` environment variable in your `.env.local` file to point to
the Session Node's RPC endpoint (`tcp://127.0.0.1:<PORT>` in the example above).

**Note:** You can use any available port for the node RPC endpoint, just make sure it's consistent in all places.

### Session Token Staking Backend

Set up the [Session Token Staking Backend](https://github.com/oxen-io/sent-staking-backend/) by following the
instructions in the [README.md](https://github.com/oxen-io/sent-staking-backend/blob/main/README.md).

Make sure the `config.py` file in the backend directory has the following values:

```python
stagenet_rpc = 'tcp://127.0.0.1:<PORT>'
```

You can then run the backend with the following command:

```shell
uwsgi --http 127.0.0.1:5000 --master -p 4 -w sent --callable app --fs-reload sent.py 
```

You can then set the `NEXT_PUBLIC_SENT_STAKING_BACKEND_URL` environment variable in your `.env.local` file to point to
the Session Token Staking Backend's RPC endpoint (`http://127.0.0.1:5000` in the example above).