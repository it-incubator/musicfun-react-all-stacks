---
name: i18n-rules
description: Rules for adding internationalization (i18n) translations. Activated automatically when adding new UI text, buttons, labels, or any user-facing strings. Use when user says "add translation", "добавь перевод", "i18n", "интернационализация".
autoActivate: always
---

# Skill: i18n Rules

## Purpose

Ensure every new user-facing string is properly internationalized in **both** language files.

## Translation Files

| Language | File                                        |
| -------- | ------------------------------------------- |
| English  | `src/shared/translations/languages/en.json` |
| Russian  | `src/shared/translations/languages/ru.json` |

## Rules

1. **Always add to both files.** Every new key must be added to `en.json` AND `ru.json` simultaneously.

2. **Key structure.** Keys are nested by domain and category using dot notation:

   - `<domain>.<category>.<key>` — e.g. `tracks.button.publish`, `playlists.title.create_playlist`
   - Top-level domains: `auth`, `tracks`, `playlists`, `sidebar`, `tabs`, `tags`, `title`, `description`, `sort`, `placeholder`, `profile`, `date`, `playlist`, `player`, `common`, `button`, `image_uploader`, `artists`
   - Common categories within a domain: `button`, `label`, `title`, `placeholder`, `error`, `success`, `table`, `aria_labels`, `stats`

3. **Key naming.** Use `snake_case` for all keys. Keep names short and descriptive: `delete_from_playlist`, `show_text_song`, `upload_track`.

4. **Placement.** Add new keys next to related existing keys within the same domain/category block. Maintain alphabetical order when practical, but grouping by feature context takes priority.

5. **Interpolation.** Use `{{ variable }}` syntax (with spaces inside braces) for dynamic values:

   - `"max_value": "Title must be less than {{ quantity }} characters"`
   - `"file_too_large": "The file is too large. Max size is {{size}} MB"`

6. **Plurals (Russian).** Russian requires `_one`, `_few`, `_many` suffixes. English uses `_one`, `_other`:

   - EN: `"tracks_count_one": "{{count}} track"`, `"tracks_count_other": "{{count}} tracks"`
   - RU: `"tracks_count_one": "{{count}} трек"`, `"tracks_count_few": "{{count}} трека"`, `"tracks_count_many": "{{count}} треков"`

7. **Usage in components.** Import `useTranslation` from `react-i18next` and use the `t()` function:

   ```tsx
   const { t } = useTranslation()
   // ...
   {
     t('tracks.button.publish')
   }
   ```

8. **JSON validity.** Ensure trailing commas are correct — the last key in a block must NOT have a trailing comma. Always verify both files remain valid JSON after editing.

9. **No hardcoded strings.** Never leave user-facing text as raw strings in components. Always use `t('...')`.

10. **Russian translations must be real.** Do not use transliteration or machine-translated gibberish. Provide natural, idiomatic Russian text.
