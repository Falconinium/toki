# Sons Toki (時) — fichiers requis

Toki utilise 6 fichiers audio japonais traditionnels, chargés via Web Audio API.

| Fichier | Usage | Durée cible | Caractère |
|---|---|---|---|
| `taiko-light.mp3` | Compte à rebours 3-2-1 (Sport), dernières 3s d'effort/repos | ~200ms | Coup de taiko léger, sec |
| `taiko-strong.mp3` | Début d'effort (Sport) | ~400ms | Coup de taiko fort, profond |
| `rin.mp3` | Transition fin d'effort / début repos | ~1.5s | Cloche de temple "rin" (りん), cristalline |
| `singing-bowl.mp3` | Fin totale de session (Sport ET Travail) | ~3s | Bol chantant, résonance longue |
| `singing-bowl-soft.mp3` | Rappel fin de pause (Travail) | ~2s | Bol chantant doux, attaque plus tendre |
| `ambient-rain.mp3` | Mode Flow (Travail) — son d'ambiance optionnel | 30s+ (loop) | Pluie légère ou ruisseau |

## Format

- **Format principal** : `.mp3` (compatibilité universelle, exigée par le CLAUDE.md §7.3)
- Mono ou stéréo, 44.1 kHz, 128–192 kbps
- Volume normalisé (-3 dB peak pour ne pas saturer)

## Sources libres de droits recommandées

- **Freesound.org** — recherche : `taiko`, `temple bell japan`, `singing bowl`, `rain ambient`
- **Pixabay Audio** — section "Sound effects" → catégorie Asia / Meditation
- **Zapsplat** (compte gratuit)

## Comment ça marche

- Le hook [`useSound`](../../app/hooks/useSound.ts) précharge les 6 fichiers en `AudioBuffer` au montage de l'app
- Les sons manquants sont signalés dans `failedSounds` mais ne plantent pas l'app — chaque `play()` est un no-op gracieux si le buffer n'existe pas
- Les sons jouent même si l'onglet n'est pas au premier plan (Web Audio API contourne les limites des `<audio>` HTML)
- Volume global et mute contrôlés depuis le [`VolumeControl`](../../app/components/audio/VolumeControl.tsx) dans le header

## Tester sans fichiers

L'app fonctionne sans les sons (silencieuse). Tu peux les déposer un par un et recharger la page pour les entendre.
