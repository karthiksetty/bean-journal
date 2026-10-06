# Add Bean from Photo

Use this skill when the user shares a photo of a coffee bag/packaging and wants to add it to their Bean Journal database. Also trigger when the user says "add this bean", "log this coffee", "scan this bag", or similar.

---

## Workflow

### Step 1 — Get the photo
If the user hasn't shared a photo yet, ask:
> "Share a photo of the bag or packaging and I'll extract the details."

### Step 2 — Extract bean data from the image
Carefully examine the photo and extract every visible detail. Map to these fields:

| Field | What to look for |
|---|---|
| `name` | The coffee name / lot name (e.g. "La Joya", "Finca Milán") |
| `brand` | The roaster or brand name (e.g. "Brew", "TANAT") |
| `producer` | The farm or producer name if shown |
| `region` | Origin — include region and country (e.g. ["Nariño, Colombia"]) — **array** |
| `variety` | Coffee cultivar(s) (e.g. ["Caturra", "Typica"]) — **array** |
| `process` | Processing method (e.g. "Washed", "Natural", "Co-fermented") |
| `bean` | Bean type — default to "Arabica" unless stated otherwise |
| `aroma` | All listed tasting/aroma notes (e.g. ["Blueberry", "Caramel", "Jasmine"]) — **array** |
| `notes` | Anything else useful: altitude, harvest date, SCA score, roast date |
| `website` | A link to the roaster's or producer's page for this coffee, only if the user gives one. Never guess it; use `null` otherwise |

Leave a field as empty string `""` or empty array `[]` if not visible on the packaging.

### Step 3 — Present for confirmation
Show the extracted data in a clean summary like this:

```
☕ Ready to add to Bean Journal

Name:      La Joya
Brand:     Brew
Producer:  Jermy Pedraza
Region:    Nariño, Colombia
Variety:   Caturra · Castillo · Colombia
Process:   Natural
Aroma:     Tropical Fruits · Strawberry · Blood Orange
Notes:     Altitude: 2000m. Roasted: 28.01.2026

Does this look right? Say "yes" to save, or tell me what to change.
```

### Step 4 — Handle edits
If the user requests any changes, update the relevant fields and show the corrected summary before proceeding. Repeat until the user confirms.

### Step 5 — Save to database
Once confirmed, insert the row straight into the Supabase `beans` table with the service role key. The app's `/api/add-bean` endpoint now requires a signed-in owner, so do not post to it.

Run this from the project root with the Bash tool. It reads the key from `.env.local`; never print the key or paste it into a reply.

```bash
set -a && source .env.local && set +a
curl -s -X POST "https://uumvzroswrgqmaeoqajc.supabase.co/rest/v1/beans" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "name": "...",
    "brand": "...",
    "producer": "...",
    "region": ["..."],
    "variety": ["..."],
    "process": "...",
    "bean": "Arabica",
    "aroma": ["...", "..."],
    "my_rating": 0,
    "notes": "...",
    "website": null,
    "available": true
  }'
```

Column names are the database's own: `my_rating`, not `myRating`. A successful insert returns the new row, including its `id`.

### Step 6 — Confirm success
On a successful response, confirm:
> "✅ **[Bean Name]** has been added to your Bean Journal."

If the insert returns an error instead of a row, show the error message and ask the user how to proceed.

---

## Notes
- `available` should always be `true` for new beans (they're in the user's collection)
- `my_rating` should always be `0` for new entries
- Never insert before the user has confirmed the summary in Step 3
- Multiple regions/varieties/aromas are common — always use arrays
- If the photo is unclear, make your best guess and flag uncertain fields in the confirmation step
