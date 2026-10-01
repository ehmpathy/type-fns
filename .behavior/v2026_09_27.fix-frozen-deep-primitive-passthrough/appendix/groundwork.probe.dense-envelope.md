# appendix — the arms' interaction on one dense envelope, measured

## .what

a third groundwork probe, compiled under this repo's `tsconfig.json` (typescript 5.4.5) on
2026-09-27. it asks a question the seven isolated demos cannot: **what happens when the arms meet
on one realistic shape?**

## .why it was run

the self review graded the vision against `define.experience._.metric=boundary-density`, whose
warn is blunt:

> a dense experience is the one **most likely to break**, *because* it crosses so many
> boundaries. each boundary is a failure point, and their interactions compound.

seven demos, each on one arm, exercise no interaction at all. so the probe built one payload that
touches the primitive arm, the object arm, and the array arm at once — and forwarded it, the way
a handler does.

## .the result

| # | the case | verdict |
|---|----------|---------|
| A | the reported shape (branded primitive at depth 4, **no array**) → a mutable sink | ✅ **compiles** — the fix works |
| B | `frozen.page.range.since.lastMessageAt` is still a `Stamp` at depth 4 | ✅ confirmed |
| C | 🔴 the **same payload plus one `tags: string[]` field** → a mutable sink | ⛔ **refused** |
| D | the branded primitive inside that payload | ✅ still a `Stamp` |
| E | the same payload → a `FrozenDeep`-typed sink | ✅ compiles |
| F | writes at depth 4, and `tags.push('x')` | ⛔ both refused |

## 🔴 .what it found

> **the fix unblocks the reported shape. it does not unblock a payload that also holds an array.**

row A and row C differ by **one field**. the branded primitive is fixed in both (rows B, D). what
still refuses in C is the array — via the sink bound that case 5 documents, which predates this
wish, is correct, and is **entirely separate from it**.

⇒ so the vision's before/after claim is true and **narrower than it reads**. "svc-chat imports and
ships" holds for the shape issue #48 reports. a peer service one array-field away meets a second
wall, with a different cause and a different remedy (row E: declare the sink readonly).

⚠️ **no isolated demo could have found this.** case 1 proves the primitive arm; case 5 proves the
sink bound; neither says what happens when a payload has both. the interaction is the whole point,
and the density lens is what asked for it.

## .what it does NOT mean

- **it is not a defect in the fix.** the fix does exactly what it claims; row C's refusal is the
  array arm at work, and it refused identically before this wish.
- **it is not a reason to change the type.** the remedy is row E — the handler declares its sink
  readonly, which is the cooperative path the sdk already recommends.
- **it does not touch the wish's done-when.** all four still hold.

it is a **scope correction on the outcome claim**, and a second wall an adopter should be told
about before they meet it.

## .the probe source, as compiled

```ts
// (FrozenDeep declared as in the other appendices)
type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };

interface PayloadReported  { page: { range: { since: { lastMessageAt: Stamp } } } }
interface PayloadWithArray { page: { range: { since: { lastMessageAt: Stamp } } }; tags: string[] }

const queryReported  = (_input: PayloadReported): void => undefined;
const queryWithArray = (_input: PayloadWithArray): void => undefined;

// A — the reported shape forwards cleanly after the fix
declare const frozenReported: FrozenDeep<PayloadReported>;
queryReported(frozenReported);

// B — the brand survives at depth four
const deepStamp: Stamp = frozenReported.page.range.since.lastMessageAt;

// C — one array field added: the forward is refused
declare const frozenWithArray: FrozenDeep<PayloadWithArray>;
// @ts-expect-error
queryWithArray(frozenWithArray);

// D — the brand is fine either way
const stampBesideArray: Stamp = frozenWithArray.page.range.since.lastMessageAt;

// E — a readonly sink accepts it
const queryReadonly = (_input: FrozenDeep<PayloadWithArray>): void => undefined;
queryReadonly(frozenWithArray);

// F — writes refused throughout
// @ts-expect-error
frozenWithArray.page.range.since.lastMessageAt = '' as Stamp;
// @ts-expect-error
frozenWithArray.tags.push('x');
```

## .see also

- `1.vision.experience.case=8.a-dense-envelope-walks-every-arm.md` — the demo this produced
- `groundwork.probe.readonly-variance.md` — the sink bound row C depends on
- `groundwork.probe.tsc-measured.md` — the defect and the fix
