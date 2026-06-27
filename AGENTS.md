## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## AI Work Guidance

- Astro に関する実装、調査、検証は、まず Astro のドキュメント MCP を優先して参照すること。
- Cloudflare に関する実装、調査、検証は、まず公式ドキュメントを優先して参照すること。
- Supabase に関する実装、調査、検証は、まず公式ドキュメントを優先して参照すること。
- Cloudflare Pages の情報を案内することを禁止。
- Astro v6 は Pages ではなく Workers 専用として扱うこと。
- Cloudflare 関連の案内では必ず Workers 前提で確認すること。
- 公式ドキュメントと記憶や推測が異なる場合は、公式情報を優先すること。
- API、SDK、設定値、制限、推奨構成は古い知識で断定せず、必ず最新の公式情報で確認してから判断すること。
- `package.json` の直接編集禁止
- `npm install` と開発サーバーの起動禁止。必要な場合は、人間に依頼すること。
