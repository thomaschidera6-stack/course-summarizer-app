# ClairCours

Application Next.js qui transforme un cours en résumé pédagogique et quiz interactif.

## Démarrage

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## IA

L'application fonctionne immédiatement avec un moteur local de démonstration. Pour activer les résumés avancés, renseigne `OPENAI_API_KEY` dans `.env.local` (et éventuellement `OPENAI_MODEL`). La route `POST /api/summarize` valide les entrées avec Zod et renvoie un JSON structuré.

## Production

- Ajouter une authentification et une base PostgreSQL pour persister les cours.
- Ajouter un stockage objet et un parseur PDF/DOCX côté serveur.
- Mettre en place un rate limit et une file de jobs pour les longs documents.
- Ne jamais exposer `OPENAI_API_KEY` au navigateur.
