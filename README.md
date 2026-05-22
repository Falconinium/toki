# Toki — 時

> **Maîtrise ton temps.**

Un minuteur en ligne, coloré, d'inspiration japonaise. Deux univers : **Sport** (le corps) et **Travail** (l'esprit). Pas de compte, pas de mémoire. Ouvre, respire, commence.

## Fonctionnalités

### スポーツ — Sport
- **Tabata** — 20s effort / 10s repos × 8 (configurable)
- **EMOM** — Every Minute On the Minute
- **AMRAP** — As Many Rounds As Possible (durée fixe)
- **Custom** — Effort, repos, séries, rounds, repos entre rounds, tout est libre
- Compte à rebours de démarrage 3-2-1
- Sons japonais traditionnels (taiko, cloche de temple) aux transitions

### 仕事 — Travail
- **Pomodoro** — 25min focus / 5min pause / 15min pause longue toutes les 4 (configurable)
- **Flow** — Mode deep work, chronomètre vers le haut, cercle qui respire, pluie d'ambiance optionnelle, rappel optionnel
- **Citations zen** (30+) affichées pendant les pauses : 七転八起, 一期一会, 侘寂…

## Philosophie

- 🎨 **Coloré** — palette inspirée des saisons japonaises (Shiki, 四季) : sakura, indigo, matcha, vermillon sur fond crème washi. Jamais de noir/blanc pur.
- 🔇 **Sans compte, sans inscription** — l'app ne stocke rien. Fermer l'onglet = tout est perdu. C'est voulu.
- 📱 **Mobile-first** — pensé pour être posé sur un meuble pendant un entraînement
- 🎌 **Japonais authentique** — kanji, romaji, vocabulaire vérifiés (集中, 休憩, 流れ…)
- 🔊 **Sons traditionnels** — taiko, cloche de temple (rin), bol chantant via Web Audio API

## Stack

- **Next.js 14** (App Router) + **TypeScript** strict
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Web Audio API** pour les sons (préchargement en `AudioBuffer`)
- **Zéro backend** — pas de base de données, pas d'auth, pas de persistance
- Déployé sur **Vercel**

## Développement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### Sons

Les fichiers audio ne sont pas inclus dans le repo. Dépose 6 fichiers `.mp3` dans `public/sounds/` selon [public/sounds/README.md](public/sounds/README.md). L'app fonctionne sans (silencieuse).

### Build

```bash
npm run build
npm start
```

## Licence

MIT
