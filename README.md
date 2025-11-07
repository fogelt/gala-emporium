# Gala Start – Eventklubb App

### För att köra stripe servern behövs ett gratis stripe konto

Installera beroenden
```bash
npm install
```

Skapa en .env-fil i projektets root, lägg till dina Stripe-testnycklar:
```bash
STRIPE_SECRET_KEY=sk_test_din_testnyckel
```

Starta utvecklingsservrarna
```bash
npm run dev
```

Detta startar både:
JSON Server (databas)
Stripe backend-server


Obs
Dela aldrig dina hemliga nycklar. .env är inkluderad i .gitignore.

Boka biljetter
Klicka på ett eventkort → “Boka biljett” → omdirigeras till Stripe checkout.

Betalningar är i testläge, inga riktiga pengar hanteras.
