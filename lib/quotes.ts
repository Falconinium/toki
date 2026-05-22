// lib/quotes.ts — Pool de citations japonaises (proverbes, kotowaza, philosophie zen).
// Affichées entre les sessions Pomodoro (transitions pause → focus) via le composant ZenQuote.
// Format : kanji original + romaji (translittération) + traduction française.

import type { ZenQuote } from "./types";

export const ZEN_QUOTES: ZenQuote[] = [
  // === Proverbes (ことわざ) ===
  {
    kanji: "七転八起",
    romaji: "Nana korobi ya oki",
    french: "Tombe sept fois, relève-toi huit.",
  },
  {
    kanji: "一期一会",
    romaji: "Ichi-go ichi-e",
    french: "Chaque rencontre, chaque moment est unique.",
  },
  {
    kanji: "急がば回れ",
    romaji: "Isogaba maware",
    french: "Si tu es pressé, fais le détour.",
  },
  {
    kanji: "今を生きる",
    romaji: "Ima wo ikiru",
    french: "Vis l'instant présent.",
  },
  {
    kanji: "塵も積もれば山となる",
    romaji: "Chiri mo tsumoreba yama to naru",
    french: "Même la poussière, en s'accumulant, devient montagne.",
  },
  {
    kanji: "石の上にも三年",
    romaji: "Ishi no ue ni mo san-nen",
    french: "Trois ans assis sur une pierre — la patience finit par tout réchauffer.",
  },
  {
    kanji: "猿も木から落ちる",
    romaji: "Saru mo ki kara ochiru",
    french: "Même le singe tombe de l'arbre.",
  },
  {
    kanji: "出る杭は打たれる",
    romaji: "Deru kui wa utareru",
    french: "Le clou qui dépasse se fait taper dessus.",
  },
  {
    kanji: "雨降って地固まる",
    romaji: "Ame futte ji katamaru",
    french: "Après la pluie, la terre durcit.",
  },
  {
    kanji: "井の中の蛙大海を知らず",
    romaji: "I no naka no kawazu taikai wo shirazu",
    french: "La grenouille du puits ne connaît pas l'océan.",
  },

  // === Zen & philosophie ===
  {
    kanji: "無",
    romaji: "Mu",
    french: "Vide. L'esprit ouvert, libre d'attente.",
  },
  {
    kanji: "間",
    romaji: "Ma",
    french: "L'intervalle. L'espace entre les choses est aussi la chose.",
  },
  {
    kanji: "侘寂",
    romaji: "Wabi-sabi",
    french: "La beauté de l'imparfait, de l'éphémère, de l'incomplet.",
  },
  {
    kanji: "無常",
    romaji: "Mujō",
    french: "Tout change, rien ne dure. C'est la nature des choses.",
  },
  {
    kanji: "和敬清寂",
    romaji: "Wa-kei-sei-jaku",
    french: "Harmonie, respect, pureté, tranquillité.",
  },
  {
    kanji: "初心",
    romaji: "Shoshin",
    french: "L'esprit du débutant — toujours ouvert, jamais figé.",
  },
  {
    kanji: "禅",
    romaji: "Zen",
    french: "Assis, simplement. La pensée passe comme un nuage.",
  },
  {
    kanji: "一日一生",
    romaji: "Ichinichi isshō",
    french: "Un jour, une vie. Vis chaque jour comme une existence entière.",
  },
  {
    kanji: "日日是好日",
    romaji: "Nichinichi kore kōjitsu",
    french: "Chaque jour est un bon jour.",
  },
  {
    kanji: "明鏡止水",
    romaji: "Meikyō shisui",
    french: "Miroir poli, eau calme — l'esprit clair reflète le réel.",
  },

  // === Travail, effort, persévérance ===
  {
    kanji: "継続は力なり",
    romaji: "Keizoku wa chikara nari",
    french: "La constance est une force.",
  },
  {
    kanji: "千里の道も一歩から",
    romaji: "Senri no michi mo ippo kara",
    french: "Même un voyage de mille lieues commence par un pas.",
  },
  {
    kanji: "改善",
    romaji: "Kaizen",
    french: "Amélioration continue — un petit pas, chaque jour.",
  },
  {
    kanji: "頑張って",
    romaji: "Ganbatte",
    french: "Tiens bon. Donne ton meilleur.",
  },
  {
    kanji: "我慢",
    romaji: "Gaman",
    french: "Endurer avec dignité ce qui semble insupportable.",
  },
  {
    kanji: "心技体",
    romaji: "Shin-gi-tai",
    french: "Esprit, technique, corps — les trois ensemble.",
  },

  // === Nature & saisons ===
  {
    kanji: "花鳥風月",
    romaji: "Kachō fūgetsu",
    french: "Fleur, oiseau, vent, lune — la beauté du monde naturel.",
  },
  {
    kanji: "桜",
    romaji: "Sakura",
    french: "La fleur de cerisier — belle parce qu'éphémère.",
  },
  {
    kanji: "森林浴",
    romaji: "Shinrin-yoku",
    french: "Le bain de forêt. Respire les arbres.",
  },
  {
    kanji: "風林火山",
    romaji: "Fū-rin-ka-zan",
    french: "Vif comme le vent, calme comme la forêt, ardent comme le feu, immobile comme la montagne.",
  },
];

/**
 * Retourne une citation aléatoire différente de la précédente (si possible).
 * Utile pour ne pas répéter deux fois la même entre deux pauses consécutives.
 */
export function pickRandomQuote(previous?: ZenQuote): ZenQuote {
  if (ZEN_QUOTES.length === 0) {
    return { kanji: "時", romaji: "Toki", french: "Le temps." };
  }
  if (ZEN_QUOTES.length === 1 || !previous) {
    return ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)];
  }
  let next = previous;
  let safety = 8;
  while (next.kanji === previous.kanji && safety-- > 0) {
    next = ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)];
  }
  return next;
}
