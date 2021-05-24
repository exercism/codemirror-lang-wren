<!-- NOTE: README.md is generated from src/README.md -->

# codemirror-lang-wren ![NPM version](https://img.shields.io/badge/npm-notyet-red)

This package implements Wren language support for the
[CodeMirror](https://codemirror.net/6/) code editor.  Originally derived from the JavaScript grammar and language support.

The project page for [CodeMirror](https://codemirror.net/6/) has more information, a
number of [examples](https://codemirror.net/6/examples/) and the
[documentation](https://codemirror.net/6/docs/).

This code is released under an
[MIT license](https://github.com/codemirror/lang-wren/tree/main/LICENSE).

### Language Support + Lezer Grammar

This includes both the CodeMirror `LanguageSupport` and the `LezerLanguage` grammar all bundled into a single small repository with a simple build process.


### Maintainers
There is a very rough developer tool in `devtool` that can be used for testing.

```
npm run build-devtool
```



### API Reference
<dl>
<dt id="user-content-wren">
  <code>wren() → <a href="https://codemirror.net/6/docs/ref#language.LanguageSupport">LanguageSupport</a></code></dt>

<dd><p>Wren support. Includes <a href="#user-content-snippets">snippet</a>
completion.</p>
</dd>
<dt id="user-content-wrenlanguage">
  <code>wrenLanguage: <a href="https://codemirror.net/6/docs/ref#language.LezerLanguage">LezerLanguage</a></code></dt>

<dd><p>A language provider based on the <a href="https://github.com/lezer-parser/wren">Lezer wren
parser</a>, extended with
highlighting and indentation information.</p>
</dd>

<dt id="user-content-snippets">
  <code><a href="#user-content-snippets">snippets</a>: <a href="https://codemirror.net/6/docs/ref#autocomplete.Completion">Completion</a>[]</code></dt>

<dd><p>A collection of simple Wren-related
<a href="https://codemirror.net/6/docs/ref/#autocomplete.snippet">snippets</a>.</p>
</dd>
