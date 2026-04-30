export interface AssistantTranscript {
  id: string;
  matchKeywords: string[];
  question: { fi: string; en: string };
  answer: { fi: string; en: string };
}

export const assistantTranscripts: AssistantTranscript[] = [
  {
    id: 'a1',
    matchKeywords: ['tekniikka', 'engineering', '11', 'eng', 'gap'],
    question: {
      fi: 'Miksi tekniikan ero on 11 %?',
      en: 'Why is engineering’s gap 11 %?',
    },
    answer: {
      fi:
        'Tekniikan keskimääräinen ero on 11,4 %. Suurin ajuri on tasojakauma: vain 19 % L4-tason ja 25 % L5-tason työntekijöistä on naisia. Tasokohtainen ero on huomattavasti pienempi (3,8 %), mutta sitä kasvattavat kaksi yli markkinapremiumin maksettua erityisosaajan tehtävää, joiden perustelut on dokumentoitu (J-2035, J-2043). Suosittelemme avaamaan yhteisen palkkakartoituksen ja laatimaan urapolkusuunnitelman naisten siirtymiseksi L3 → L4.',
      en:
        'Engineering’s mean gap is 11.4 %. The largest driver is the level distribution: only 19 % of L4 and 25 % of L5 employees are women. Within-level gap is much smaller (3.8 %), but it is amplified by two above-market scarce-skill premiums (justifications J-2035, J-2043). I recommend opening a Joint Pay Assessment and a career-path plan for L3 → L4 transitions.',
    },
  },
  {
    id: 'a2',
    matchKeywords: ['outlier', 'haarukan', 'haarukka', 'band', 'ulkop'],
    question: {
      fi: 'Näytä haarukan ulkopuoliset henkilöt',
      en: 'Show me employees outside the band',
    },
    answer: {
      fi:
        'Haarukan ulkopuolella on 14 työntekijää: 6 yli haarukan (kaikki perusteltuja markkinapremiumilla tai harvinaisella osaamisella) ja 8 alle haarukan. Alle haarukan jääneistä kolmella ei ole vielä peruste-merkintää — nämä on listattu Palkkahaarukat-sivulla "Lisää peruste" -toiminnolla.',
      en:
        '14 employees are outside the band: 6 above (all justified by market premium or scarce skill) and 8 below. Three of the below-band cases have no justification on file yet — they are listed on the Salary bands page with the “Add justification” action.',
    },
  },
  {
    id: 'a3',
    matchKeywords: ['artikla 9', 'article 9', 'valmius', 'readiness'],
    question: {
      fi: 'Mikä on artiklan 9 valmiutemme?',
      en: 'What is our Article 9 readiness?',
    },
    answer: {
      fi:
        'Artiklan 9 raportoinnin valmiusaste on 92 %. Pakolliset kentät (mediaani- ja keskiarvoero kokonais- ja muuttuvasta palkasta, kvartiilien sukupuolijakauma, ero osastoittain) on katettu. Puuttuva 8 % koskee henkilöstöryhmittäistä tarkennusta — tarvitsemme vielä tehtäväluokituksen tarkistuksen Operaatioiden ja Asiakaspalvelun osalta. Ensimmäinen pakollinen raportti erääntyy 7.6.2027.',
      en:
        'Article 9 readiness is 92 %. The required fields (mean & median gap, total and variable pay separately, gender distribution by quartile, gap by department) are covered. The remaining 8 % concerns category-of-employee detail — we need to revisit the role classification for Operations and Customer Service. First mandatory report is due 7 June 2027.',
    },
  },
  {
    id: 'a4',
    matchKeywords: ['q1', 'kierros', 'review', 'cycle', 'yhteenve'],
    question: {
      fi: 'Yhteenveto Q1-palkkakierroksesta',
      en: 'Summarise the Q1 review cycle',
    },
    answer: {
      fi:
        'Q1 2026 -kierroksessa esimiehet ovat ehdottaneet 32 palkankorotusta (keskiarvo 4,3 %). Järjestelmä on merkinnyt 7 ehdotusta tarkistettavaksi: ne kasvattaisivat haarukan sisäistä sukupuolieroa. Suosittelemme käsittelemään lippuilla merkityt erikseen ennen massahyväksyntää.',
      en:
        'In Q1 2026 managers have proposed 32 raises (mean 4.3 %). The system has flagged 7 of them for review because they would widen the within-band gender gap. I recommend handling the flagged proposals individually before a bulk approval.',
    },
  },
  {
    id: 'a5',
    matchKeywords: ['recruit', 'rekry', 'hakij', 'job posting', 'artikla 5', 'article 5'],
    question: {
      fi: 'Miten julkaisen palkan rekrytoinnissa?',
      en: 'How should I publish pay in recruitment?',
    },
    answer: {
      fi:
        'Direktiivin artikla 5 vaatii palkkahaarukan tai -tason ilmoittamisen ennen haastattelua. Käytä Raportit-sivulta löytyvää mallipohjaa "Rekrytoinnin palkkatieto". Aiempaa palkkahistoriaa ei saa kysyä. Suosittelemme L1–L4-tasoille koko haarukkaa ja L5–L6-tasoille tason midpoint ± 10 %.',
      en:
        'Directive Article 5 requires the pay range or level to be disclosed before the interview. Use the “Recruitment pay disclosure” template on the Reports page. Asking for prior pay history is prohibited. Recommended: full band for L1–L4 and midpoint ± 10 % for L5–L6.',
    },
  },
];

export function findResponse(query: string): AssistantTranscript | null {
  const q = query.toLowerCase();
  let best: { hit: AssistantTranscript; score: number } | null = null;
  for (const t of assistantTranscripts) {
    const score = t.matchKeywords.reduce((s, k) => (q.includes(k.toLowerCase()) ? s + 1 : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { hit: t, score };
  }
  return best?.hit ?? null;
}
