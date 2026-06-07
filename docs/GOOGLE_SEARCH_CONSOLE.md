# Google Search Console Setup

Use this for the real KrayoSkriptz domain:

```txt
https://krayoskriptz.vercel.app/
```

## Steps

1. Open Google Search Console: https://search.google.com/search-console
2. Add a new property as `URL prefix`.
3. Paste `https://krayoskriptz.vercel.app/`.
4. Choose `HTML tag` verification.
5. Copy the full verification tag, for example:

```html
<meta name="google-site-verification" content="PASTE_GOOGLE_CODE_HERE" />
```

6. Send that tag/code back so it can be added to `index.html`.
7. After deploy, click `Verify` in Google Search Console.
8. Submit this sitemap URL:

```txt
https://krayoskriptz.vercel.app/sitemap.xml
```

## Notes

- Do not use `www.scriptzroblox.eu`; that is not this project domain.
- The sitemap is generated dynamically and should include public pages plus post URLs from Supabase.
- If Google says the sitemap is empty, first check that `supabase-setup.sql` was run and the `posts` table has rows.
