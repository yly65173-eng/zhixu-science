# Third-party notices

The original Zhixu Science application is MIT licensed. Runtime/build dependencies retain their respective licenses.

| Dependency | Version | License | Repository |
| --- | --- | --- | --- |
| pdfjs-dist | 5.4.394 | Apache-2.0 | https://github.com/mozilla/pdf.js |
| fflate | 0.8.3 | MIT | https://github.com/101arrowz/fflate |
| jStat | 1.9.6 | MIT | https://github.com/jstat/jstat |
| Vite | 8.3.5 | MIT and dependency notices | https://github.com/vitejs/vite |

Exact transitive versions and integrity hashes are recorded in `package-lock.json`. Complete license texts for redistributed runtime code and build tooling are copied from installed packages into `public/licenses/`, and included in the static build. Vite's bundled dependency license notice is included with its license. Do not remove upstream license banners from compiled assets.

PDF.js is Copyright Mozilla Foundation and contributors. Its source and license are distributed under Apache License, Version 2.0. fflate's copyright and permission notice are retained verbatim in its copied license.

Google Fonts CSS references Noto Sans SC and Noto Serif SC. Fonts are not vendored. Both families are available under the SIL Open Font License; deployments can remove the external CSS import and use system fonts. No other project's molecular rendering code, images or textbook diagrams are incorporated.

External literature retains its original authorship and publication rights. API access does not grant a new license to redistribute every article. The app retrieves evidence in the visitor's browser and does not host a public full-text corpus. Respect the source article's license before republishing exported text.
