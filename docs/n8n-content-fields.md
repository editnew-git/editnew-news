# Editnew support-content fields for n8n

The existing GitHub upsert must continue writing Markdown to:

```text
src/content/news/<slug>.md
```

Add these optional columns to the source row used by **Build Markdown**:

| Source column | Markdown frontmatter key | Accepted values | Default |
| --- | --- | --- | --- |
| Category | `category` | `Getting Started`, `Daily Use`, `Training & Layouts`, `Troubleshooting`, `Product Updates` | `Product Updates` |
| Content Type | `contentType` | `Guide`, `Training`, `Troubleshooting`, `Update` | `Update` |
| Audience | `audience` | `All users`, `Content contributors`, `Administrators`, `Resellers` | `All users` |

In **Build Markdown**, normalize each value against its accepted list. Treat blank values, `unknown`, and Google Sheets error values as missing and use the default. Add the generated lines after `tags`:

```yaml
category: "Training & Layouts"
contentType: "Training"
audience: "Content contributors"
```

Do not change the existing `title`, `date`, `location`, `slug`, `image`, `tags`, `draft`, GitHub SHA lookup, create/edit branch, or destination path. Old files without these fields remain valid and appear as `Product Updates` for `All users`.

For an embedded runSAM layout, preserve the iframe in the Markdown body and provide a meaningful title and lazy loading:

```html
<iframe src="https://example.runsam.com/layout" title="Lobby welcome-screen layout example" loading="lazy" allowfullscreen></iframe>
```
