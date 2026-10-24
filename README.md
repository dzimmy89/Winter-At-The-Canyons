# Winter Season Expedition

One winter destination — the signed lease at **900 Bitner Road, Apartment E17, Park City, UT 84098** (Nov 15, 2026 – May 15, 2027, $3,600/month) — plus **Secure Investments Realty & Management**, with Tanya Chappell, managing **4922 NW 81st Ave** for the same season. Florida rent pays the mortgage only. Confirm what the $3,600 includes.

```bash
npm install
npm start
```

`npm start` builds a production bundle and serves it at [http://127.0.0.1:3003](http://127.0.0.1:3003). Stop any other process on 3003 first. `npm run dev` is HMR only and is not the intended run path.

The shipped site is a static SPA. Hunt, Drive, and Florida read bundled JSON. Checklists stay in `localStorage`. There is no `/api`.

## Sections

- `#map` — click Gainesville, a park Hilton, a corridor segment, or E17
- `#hunt` — signed Park City lease (prior PCLodge page is background only)
- `#drive` — Leave Thu Nov 12, 2026. Cookeville, Topeka, Wheat Ridge. Sunday uses I-25 and I-80, not Eisenhower or Vail, unless Wyoming has snow. Arrive E17 Sun Nov 15. 13-hour cap. Hilton Honors + 150,000 points.
- `#florida` — Secure Investments Realty is hired. Tanya Chappell is the contact. Written lease Nov 15, 2026 – May 16, 2027 so the Florida tax exemption holds.

## Hosting

- Google Cloud project: `winter-exp-teocalli`
- Billing account: `0135F5-66FE5E-BB6D9B` (We Like Food App)
- Live: [https://winter-exp-teocalli.web.app](https://winter-exp-teocalli.web.app) (also [https://winter-exp-teocalli.firebaseapp.com](https://winter-exp-teocalli.firebaseapp.com))
- Live bundle is the four-job shell (`index-CwiwFxWl.js`).

```bash
npm run build
firebase deploy --only hosting --project winter-exp-teocalli
```

If the Firebase CLI asks to reauth, run `firebase login --reauth` as `hello@defiuniversity.xyz`. The first deploy used the same `dist/` as local production.

## Optional local rebuilds

```bash
npm run seed                 # rewrite the E17 listing, Hilton catalog, and one route
npm run refresh:hotels       # no-op without LITEAPI_KEY
npm run refresh:routes       # no-op without MAPBOX_TOKEN
```

`npm run seed` must not reintroduce other ski towns.
