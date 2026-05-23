import { Article, AuthorProfile, Issue } from "./types";

export const INITIAL_ISSUES: Issue[] = [
  {
    id: "issue-1",
    titleEn: "Cosmic Whispers & Quantum Foundations",
    titleSi: "කොස්මික් රාවය සහ ක්වොන්ටම් පදනම",
    volume: 1,
    number: 1,
    publishedAt: "May 2026",
    coverImage: "https://picsum.photos/seed/quantum/1200/800",
    descriptionEn: "Exploring the depth of quantum physical interactions, gene structures, and the blueprint for humanity’s expansion to outer worlds.",
    descriptionSi: "ක්වොන්ටම් භෞතික අන්තර්ක්‍රියා, ජාන ව්‍යුහයන් සහ මිනිසාගේ අභ්‍යවකාශ ගවේෂණයේ සැලසුම් පිළිබඳ ගැඹුරු විවරණයක්.",
    articleIds: ["art-1", "art-2", "art-3"]
  },
  {
    id: "issue-2",
    titleEn: "The AI Horizon & Synthetic Biology",
    titleSi: "කෘතිම බුද්ධියේ ක්ෂිතිජය සහ කෘතිම ජීව විද්‍යාව",
    volume: 1,
    number: 2,
    publishedAt: "July 2026",
    coverImage: "https://picsum.photos/seed/bio/1200/800",
    descriptionEn: "Unmasking the synergy between machine neuro-networks and organic genomic alterations shaping tomorrow’s technologies.",
    descriptionSi: "හෙට දින තාක්ෂණය හැඩගස්වන කෘතිම ස්නායුක ජාල සහ කාබනික ජානමය වෙනස්වීම් අතර සහජීවනය ගවේෂණය කිරීම.",
    articleIds: ["art-4"]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    titleEn: "The Quantum Odyssey: Exploring Superposition",
    titleSi: "ක්වොන්ටම් විශ්වය: සුපිරි පිහිටීම ගවේෂණය කිරීම",
    category: "science",
    summaryEn: "A deep dive into quantum physics, superposition, entanglements and how they revolutionize futuristic computation models.",
    summarySi: "ක්වොන්ටම් යාන්ත්‍ර විද්‍යාව, සුපිරි පිහිටීම, ක්වොන්ටම් වෙලීම සහ ඒවා අනාගත පරිගණක සැකසුම් විප්ලවීය වෙනසකට ලක් කරන ආකාරය පිළිබඳ ගැඹුරු විශ්ලේෂණයක්.",
    coverUrl: "https://picsum.photos/seed/physics/800/600",
    readingTimeMin: 9,
    layoutTemplate: "scifi-neon",
    status: "published",
    version: 1,
    issueId: "issue-1",
    authorId: "auth-1",
    authorName: "Dr. K. L. Wickramasinghe",
    publishedAt: "May 15, 2026",
    comments: [
      {
        id: "com-1",
        author: "Editor Nishantha",
        role: "editor",
        text: "The translation of quantum terms in the Sinhala blocks is wonderfully descriptive. Excellent work!",
        timestamp: "May 14, 2026, 10:20 AM"
      }
    ],
    blocks: [
      {
        id: "b1",
        type: "heading",
        valueEn: "The Paradox of Being and Not Being",
        valueSi: "පැවැත්ම සහ නොපැවැත්ම පිළිබඳ විරුද්ධාභාසය"
      },
      {
        id: "b2",
        type: "paragraph",
        valueEn: "At the heart of quantum mechanics lies an uncomfortable truth: particles at the microscopic scale do not reside in definite places or states. Instead, they exist in a mathematical blur called a superposition of all possible states simultaneously, until they are measured.",
        valueSi: "ක්වොන්ටම් යාන්ත්‍ර විද්‍යාවේ හදවතෙහි ඇත්තේ සිතාගත නොහැකි සත්‍යයකි: අන්වීක්ෂීය පරිමාණයේ ඇති අංශු නිශ්චිත ස්ථානවල හෝ තත්ත්වයන්හි පවතින්නේ නැත. ඒ වෙනුවට, ඒවා මනිනු ලබන තෙක් හැකි සියලු තත්ත්වයන්ගේ එකතුවක් ලෙස පවතී. මෙය 'සුපිරි පිහිටීම' (Superposition) ලෙස හැඳින්වේ."
      },
      {
        id: "b3",
        type: "quote",
        valueEn: "Historically, Erwin Schrödinger formulated his famous cat thought experiment to highlight the apparent absurdity of this microscopic superposition when scaled to macroscopic objects.",
        valueSi: "ඓතිහාසිකව, අන්වීක්ෂීය මට්ටමේ පවතින මෙම සුපිරි පිහිටීම සාර්ව වස්තූන් සඳහා යොදාගත් විට ඇතිවන අමුතු ස්වභාවය පෙන්වීමට අර්වින් ශ්‍රෝඩිංගර් සිය ප්‍රකට 'ශ්‍රෝඩිංගර්ගේ බළලා' (Schrödinger's Cat) නම් සිතීමේ පරීක්ෂණය ඉදිරිපත් කළේය."
      },
      {
        id: "b4",
        type: "heading",
        valueEn: "Harnessing the Superposition for Computing",
        valueSi: "පරිගණක තාක්ෂණය සඳහා සුපිරි පිහිටීම භාවිතය"
      },
      {
        id: "b5",
        type: "paragraph",
        valueEn: "Classical computers process binary digits—bits—which represent either a strict 0 or a 1. Quantum computers utilize qubits. A qubit can represent a 0, a 1, or any arbitrary superposition of both. This multi-state flexibility scales exponentially, enabling parallel computational capabilities of unimaginable complexity.",
        valueSi: "සාම්ප්‍රදායික පරිගණක ද්විමය ඉලක්කම් (බිට්ස් - bits) මඟින් ක්‍රියාත්මක වන අතර ඒවා 0 හෝ 1 නිරූපණය කරයි. නමුත් ක්වොන්ටම් පරිගණක ක්‍යුබිට්ස් (qubits) භාවිතා කරයි. ක්‍යුබිට් එකකට 0, 1 හෝ මේ දෙකේම සුපිරි පිහිටීමක් එකවර නිරූපණය කළ හැක. මෙමඟින් පරිගණකයේ සැකසුම් වේගය ඝාතීය ලෙස ඉහළ යයි."
      },
      {
        id: "b6",
        type: "highlight",
        valueEn: "Application Highlight: Shor's algorithm running on an advanced quantum computer could easily crack modern cryptography in minutes, sparking an international rush towards post-quantum encryption.",
        valueSi: "වැදගත් කරුණක්: දියුණු ක්වොන්ටම් පරිගණකයක් මත ක්‍රියාත්මක වන ෂෝර්ගේ ඇල්ගොරිතමයට විනාඩි කිහිපයකින් වත්මන් ආරක්ෂිත ක්‍රිප්ටෝග්‍රැෆික් සංකේත කේත හරණය කළ හැකි බැවින්, පශ්චාත්-ක්වොන්ටම් කේතාංකන ක්‍රම සඳහා විශාල තරඟයක් නිර්මාණය වී ඇත."
      }
    ]
  },
  {
    id: "art-2",
    titleEn: "CRISPR-Cas9: Redefining the Human Blueprint",
    titleSi: "CRISPR-Cas9: මානව ජාන සැකසුම නැවත අර්ථ දැක්වීම",
    category: "education",
    summaryEn: "An educational guide detailing the genomic editing tool, CRISPR, and discussing the ethical parameters of gene modification.",
    summarySi: "CRISPR ජානමය සංස්කරණ මෙවලම පිළිබඳව සහ ජාන වෙනස් කිරීම්වල පවතින සදාචාරාත්මක රාමු පිළිබඳව විස්තර කෙරෙන අධ්‍යාපනික ලිපියකි.",
    coverUrl: "https://picsum.photos/seed/gene/800/600",
    readingTimeMin: 7,
    layoutTemplate: "academic",
    status: "published",
    version: 1,
    issueId: "issue-1",
    authorId: "auth-2",
    authorName: "Prof. Anura Ilangasingha",
    publishedAt: "May 18, 2026",
    blocks: [
      {
        id: "b21",
        type: "heading",
        valueEn: "The Scissors of Life",
        valueSi: "ජීවයේ කතුර"
      },
      {
        id: "b22",
        type: "paragraph",
        valueEn: "CRISPR-Cas9 acts as a molecular pair of scissors, capable of cutting DNA sequences at precise locations. Discovered as part of an immune defense strategy in bacteria, researchers have loaded this tool with custom RNA coordinates to repair or modify specific cellular sequences in multi-cellular organisms.",
        valueSi: "CRISPR-Cas9 ක්‍රියා කරන්නේ ජීව විද්‍යාත්මක කතුරක් ලෙසය, එයට DNA දාමයන්හි අතිශය නිශ්චිත ස්ථාන කපා ඉවත් කිරීමට හැකියාව ඇත. බැක්ටීරියාවල පවතින ස්වභාවික ප්‍රතිශක්තිකරණ පද්ධතියකින් සොයාගත් මෙම මෙවලමට, විද්‍යාඥයන් විසින් රිසිකරණය කරන ලද RNA ඛණ්ඩාංක ඇතුළු කර සෛලවල ජානමය අනුපිළිවෙල වෙනස් කිරීමට ඉගෙනගෙන තිබේ."
      },
      {
        id: "b23",
        type: "quote",
        valueEn: "With great capability comes systemic ethical responsibilities. Editing somatic cells cures active diseases, but modifying germline cells alters inherited codes across entire generations.",
        valueSi: "විශාල හැකියාවන් සමඟ විශාල සමාජීය සහ සදාචාරාත්මක වගකීමක් ද පැමිණේ. සාමාන්‍ය සෛල (somatic cells) සංස්කරණය කිරිමෙන් රෝග සුව කළ හැකි වුවද, ප්‍රජනන සෛල (germline cells) වෙනස් කිරීමෙන් මුළු පරම්පරාවකම පාරම්පරික උරුමය වෙනස් වේ."
      },
      {
        id: "b24",
        type: "image",
        valueEn: "https://picsum.photos/seed/crispr/800/400",
        valueSi: "https://picsum.photos/seed/crispr/800/400",
        imageCaptionEn: "A visual simulation of Cas9 protein intersecting a double-helix DNA strand.",
        imageCaptionSi: "Cas9 ප්‍රෝටීනය ද්විත්ව හෙලික්ස් DNA දාමයක් සමඟ සම්බන්ධ වන ආකාරය නිරූපණය කරන දෘශ්‍යකරණයක්."
      }
    ]
  },
  {
    id: "art-3",
    titleEn: "The Mars Colony Blueprint: Biosphere and Domes",
    titleSi: "අඟහරු ජනපදකරණ සැලැස්ම: ජෛවගෝලය සහ ගෝලාකාර නගර",
    category: "scifi",
    summaryEn: "A visionary design analyzing environmental engineering paradigms needed to host biological human life inside Mars pressure domes.",
    summarySi: "අඟහරු ග්‍රහයා මත පීඩන ගෝලාකාර නගර තුළ මානව සහ ජීව විද්‍යාත්මක ජීවිතය පවත්වා ගැනීමට අවශ්‍ය පාරිසරික ඉංජිනේරු ශිල්ප ක්‍රම පිළිබඳ විද්‍යාත්මක ගවේෂණයක්.",
    coverUrl: "https://picsum.photos/seed/mars/800/600",
    readingTimeMin: 12,
    layoutTemplate: "editorial-serif",
    status: "published",
    version: 1,
    issueId: "issue-1",
    authorId: "auth-1",
    authorName: "Dr. K. L. Wickramasinghe",
    publishedAt: "May 19, 2026",
    blocks: [
      {
        id: "b31",
        type: "heading",
        valueEn: "Sealing the Atmospheric Frontier",
        valueSi: "වායුගෝලීය සීමාවන් ජය ගැනීම"
      },
      {
        id: "b32",
        type: "paragraph",
        valueEn: "Colonizing Mars requires constructing highly persistent closed-loop biospheres. The thin atmospheric density (equivalent to 1% of Earth's sea-level pressure) and rich carbon-dioxide mixture force us to design modular pneumatic domes anchored into natural regolith or subterranean lava tubes.",
        valueSi: "අඟහරු වාසස්ථානයක් ගොඩනැගීමේදී ස්වයංපෝෂිත සංවෘත ජෛවගෝල සෑදීම අනිවාර්ය වේ. එහි පවතින අතිශය සිහින් වායුගෝලය (පෘථිවි පීඩනයෙන් 1%ක් පමණ) සහ අධික කාබන් ඩයොක්සයිඩ් ප්‍රමාණය හේතුවෙන්, ස්වභාවික පාෂාණ හෝ භූගත ලාවා උමං තුළ සවි කරන ලද මොඩියුලර් පීඩන ගෝලයන් නිපදවීමට සැලසුම් කෙරේ."
      },
      {
        id: "b33",
        type: "highlight",
        valueEn: "Architectural Parameter: Utilizing 3D-printed regolith outer-shields block cosmic ionizing radiation while polymer buffer layers retain structural air mixtures.",
        valueSi: "නිර්මාණ පරාමිතිය: ත්‍රිමාණ මුද්‍රිත රෙගොලිත් බාහිර ආවරණ මඟින් අභ්‍යවකාශ කොස්මික් කිරණ වළක්වන අතර පොලිමර් පටල මඟින් ඇතුළත වාතය රඳවා තබා ගනී."
      }
    ]
  },
  {
    id: "art-4",
    titleEn: "Neuromorphic Computing: Building Brain-like Microchips",
    titleSi: "නියුරෝමෝර්ෆික් පරිගණකකරණය: මොළයක ස්වරූපී ක්ෂුද්‍ර චිප්ස් නිපදවීම",
    category: "technology",
    summaryEn: "Investigating silicon chips designed to mimic organic neural synapses to trigger highly efficient, real-time localized AI executions.",
    summarySi: "අධි-කාර්යක්ෂම, තථ්‍ය කාලීන කෘතිම බුද්ධි ක්‍රියාවලීන් සඳහා මිනිස් මොළයේ නියුරෝන සම්බන්ධතා අනුකරණය කරන සිලිකන් චිප්ස් පිළිබඳ ගවේෂණයක්.",
    coverUrl: "https://picsum.photos/seed/silicon/800/600",
    readingTimeMin: 8,
    layoutTemplate: "academic",
    status: "published",
    version: 2,
    issueId: "issue-2",
    authorId: "auth-3",
    authorName: "Dr. K. L. Wickramasinghe",
    publishedAt: "July 2, 2026",
    blocks: [
      {
        id: "b41",
        type: "heading",
        valueEn: "Breaking the Von Neumann Bottleneck",
        valueSi: "වොන් නියුමන් බාධකයෙන් මිදීම"
      },
      {
        id: "b42",
        type: "paragraph",
        valueEn: "Traditional processors separate execution cores (CPUs) from storage registers (RAM), requiring constant power-hungry data transfers. Neuromorphic microchips combine memory and computation directly within unified silicon hardware architecture resembling biological synaptic structures.",
        valueSi: "සාම්ප්‍රදායික ප්‍රොසෙසරවල දත්ත සැකසුම් කොටස (CPU) සහ දත්ත ගබඩා කොටස (RAM) වෙන් වෙන්ව පිහිටන අතර නිරන්තරයෙන් දත්ත හුවමාරු කිරීමට සිදුවේ. මෙයට සාපේක්ෂව නියුරෝමෝර්ෆික් චිප් මතකයන් සහ ගණනය කිරීම් යන දෙකම මොළයක ව්‍යුහය මෙන් එකම සිලිකන් දෘඩාංගයක සිදු කරයි."
      }
    ]
  }
];

export const INITIAL_DRAFTS: Article[] = [
  {
    id: "draft-1",
    titleEn: "Quantum Biology: Photosynthetic Superposition",
    titleSi: "ක්වොන්ටම් ජීව විද්‍යාව: ප්‍රභාසංස්ලේෂක සුපිරි පිහිටීම්",
    category: "science",
    summaryEn: "Investigating how green leaves may use subtle quantum mechanics to increase light capturing efficiency to nearly 100%.",
    summarySi: "හරිත පත්‍ර සූර්යාලෝකය ප්‍රතිග්‍රහණය කිරීමේ කාර්යක්ෂමතාවය 100% දක්වා වැඩි කිරීමට සියුම් ක්වොන්ටම් භෞතික නියමයන් භාවිතා කරන්නේ කෙසේද යන්න පිළිබඳව සොයා බැලීම.",
    coverUrl: "https://picsum.photos/seed/leaf/800/600",
    readingTimeMin: 6,
    layoutTemplate: "academic",
    status: "under-review",
    version: 1,
    authorId: "auth-1",
    authorName: "Dr. K. L. Wickramasinghe",
    blocks: [
      {
        id: "bd11",
        type: "heading",
        valueEn: "Coherent Energy Pathways",
        valueSi: "සංගතික ශක්ති මාර්ග"
      },
      {
        id: "bd12",
        type: "paragraph",
        valueEn: "Recent observations suggest that during photosynthesis, energy exciton packages don't randomly bounce towards reaction centers. Instead, they travel across multiple pathways at once in coherent quantum superpositions, finding the absolute quickest path in fractional femtoseconds.",
        valueSi: "මෑත කාලීන පර්යේෂණ පෙන්වා දෙන්නේ ප්‍රභාසංස්ලේෂණයේදී ශක්ති පැකේජ ප්‍රතික්‍රියා කේන්ද්‍රය වෙත අහඹු ලෙස ගමන් නොකරන බවයි. වෙනුවට, ඒවා සංගත ක්වොන්ටම් සුපිරි පිහිටීමක් ලෙස එකවර පිහිටි මාර්ග කිහිපයකින් ගමන් කර, ෆෙම්ටෝතත්පර කොටසකදී කෙටිම මාර්ගය සොයාගනී."
      }
    ]
  },
  {
    id: "draft-2",
    titleEn: "The Science Fiction Future of Space Elevators",
    titleSi: "අභ්‍යවකාශ විදුලි බෝට්ටු (Space Elevators) පිළිබඳ විද්‍යා ප්‍රබන්ධ අනාගතය",
    category: "scifi",
    summaryEn: "A creative blueprint on construction mechanics using carbon nanotubes to connect Earth directly to equatorial geostationary scaffolds.",
    summarySi: "පෘථිවියේ සිට කෙලින්ම සමකය හරහා ගෝලීය ස්ථාවර අභ්‍යවකාශ පර්යන්තයකට සම්බන්ධ වන කාබන් නැනෝටියුබ් විදුලි එසවුම් යාන්ත්‍ර විද්‍යාව පිළිබඳ නිර්මාණාත්මක විස්තරයක්.",
    coverUrl: "https://picsum.photos/seed/elevator/800/600",
    readingTimeMin: 10,
    layoutTemplate: "scifi-neon",
    status: "draft",
    version: 1,
    authorId: "auth-3",
    authorName: "Author Senaka",
    blocks: [
      {
        id: "bd21",
        type: "heading",
        valueEn: "Tethered to the Sky",
        valueSi: "අහසට බැඳි කේබලය"
      },
      {
        id: "bd22",
        type: "paragraph",
        valueEn: "To scale gravity wells without heavy combustible chemical propellants, planetary civilizations must construct 36,000 kilometer long structural cables. In orbit, centrifugal forces on outer counterweights pull the line taut, allowing electric cabs to haul heavy payloads with perfect efficiency.",
        valueSi: "රසායනික ඉන්ධන භාවිතයකින් තොරව ගුරුත්වාකර්ෂණ බලය මැඩපවත්වා අභ්‍යවකාශයට යාම සඳහා කිලෝමීටර් 36,000ක් දිග කේබලයක් අභ්‍යවකාශයේ රඳවා තැබිය යුතුය. මෙහිදී ඇතිවන කේන්ද්‍රාපසාරී බලය මඟින් කේබලය තදින් ඇදී පවතින බැවින් විදුලි සෝපාන මඟින් බර පැටවීම් පහසුවෙන් සිදු කල හැකිය."
      }
    ]
  }
];

export const GLOSSARY_TERMS: import("./types").GlossaryTerm[] = [
  {
    term: "Superposition",
    termSi: "සුපිරි පිහිටීම",
    definitionEn: "A fundamental principle of quantum mechanics where a physical system exists in multiple states or configurations simultaneously until an active measurement forces it into a single state.",
    definitionSi: "භෞතික පද්ධතියක් මැනීමට ලක්කරන තෙක් එය එකවර විය හැකි සියලුම තත්ත්වයන්ගේ එකතුවක් ලෙස පැවතීමේ ක්වොන්ටම් යාන්ත්‍ර විද්‍යාත්මක මූලධර්මයයි.",
    category: "physics"
  },
  {
    term: "Entanglement",
    termSi: "ක්වොන්ටම් වෙලීම",
    definitionEn: "A quantum phenomenon where two or more particles become mutually intertwined so that the physical state of one instantly defines the state of the other, regardless of local physical distance.",
    definitionSi: "අංශු දෙකක් හෝ කිහිපයක් එකිනෙකට කෙතරම් සම්බන්ධ වන්නේද යත්, ඔවුන් අතර දුර කෙතෙක් වුවද එකම අංශුවක් මත සිදු කරන මැනීමක් අනෙක් අංශුවේ ස්වභාවය ක්ෂණිකව තීරණය කෙරෙන අද්භූත සංසිද්ධියකි.",
    category: "physics"
  },
  {
    term: "Qubits",
    termSi: "කීව්බිට්ස්",
    definitionEn: "Quantum bits; the basic structural unit of quantum computing information, representing a 0, a 1, or any custom superposition state of both simultaneously.",
    definitionSi: "ක්වොන්ටම් පරිගණක තොරතුරු සැකසුමේ මූලික ඒකකයයි. සාම්ප්‍රදායික 0 හෝ 1 වෙනුවට මේ දෙකම එකවර නිරූපණය වන සුපිරි පිහිටීමක් පැවතිය හැක.",
    category: "computing"
  },
  {
    term: "CRISPR-Cas9",
    termSi: "ක්‍රිස්පර් කස්-9",
    definitionEn: "A scientific molecular technology adapted from bacterial genetic defense mechanisms that enables precision DNA edits, splicing, or replacements within living organism tissues.",
    definitionSi: "බැක්ටීරියාවන්ගෙන් තෝරාගත්, සජීවී සෛල දාමයන්හි නිශ්චිත ස්ථාන කපා ජාන සැකසීමට ලක්කළ හැකි සුවිශේෂී ජීව-විද්‍යාත්මක අණුක කතුරු තාක්ෂණයයි.",
    category: "genetics"
  },
  {
    term: "Regolith",
    termSi: "රෙගොලිත්",
    definitionEn: "The superficial mantle of loose rocky debris, dirt, and dust overlying solid bedrock, particularly referencing Martian or Lunar surface soils used to construct space shields.",
    definitionSi: "ඝන පාෂාණ තට්ටුවලට ඉහළින් පවතින ලිහිල් පස්, වැලි සහ දූවිලි තට්ටුවයි. විශේෂයෙන් අඟහරු සහ සඳ මත පවතින පස මින් අදහස් කෙරේ.",
    category: "space"
  },
  {
    term: "Somatic Cells",
    termSi: "කායික සෛල",
    definitionEn: "Any biological cell forming the body of a multicellular organism, excluding reproductive cells. Edits made here are not passed to offspring.",
    definitionSi: "බහුසෛලික ජීවියෙකුගේ ප්‍රජනන සෛල හැර ශරීරය සෑදෙන සාමාන්‍ය දේහ සෛල වේ. මේවායේ සිදුකරන ප්‍රවේණික වෙනස්කම් ඉන්පසු පරම්පරාවට උරුම නොවේ.",
    category: "genetics"
  },
  {
    term: "Germline Cells",
    termSi: "ප්‍රජනක සෛල",
    definitionEn: "Reproductive cells (sperm or egg gametes) that pass genomic DNA down to subsequent generations. Editing these creates permanent inherited variations.",
    definitionSi: "මීළඟ පරම්පරාවන් වෙත ජානමය උරුමයන් රැගෙන යන බීජ හෝ ප්‍රජනක සෛල (ශුක්‍රාණු හෝ ඩිම්බ) වේ. මේවා සංස්කරණය කළහොත් වෙනස්වීම් ස්ථිරවම උරුම වේ.",
    category: "genetics"
  },
  {
    term: "Shor's Algorithm",
    termSi: "ෂෝර්ගේ ඇල්ගොරිතම",
    definitionEn: "A highly acclaimed quantum mathematical algorithm engineered to crack prime factorizations of extreme numbers, posing a direct threat to RSA web cryptography.",
    definitionSi: "ඉතා වේගයෙන් විශාල සංඛ්‍යා ප්‍රථමක සාධකවලට වෙන් කිරීමට නිර්මාණය කරන ලද ක්වොන්ටම් ඇල්ගොරිතමයකි. මෙය සාම්ප්‍රදායික අන්තර්ජාල ආරක්ෂණ ක්‍රම බිඳ හෙලීමට සමත් වේ.",
    category: "computing"
  },
  {
    term: "Von Neumann Bottleneck",
    termSi: "වොන් නියුමන් බාධාව",
    definitionEn: "A systemic latency constraint in computer architecture where data throughput is restricted because processing logic cores and memory are physically separated.",
    definitionSi: "සාම්ප්‍රදායික පරිගණක ප්‍රොසෙසරයේ (processing core) සහ මතක ගබඩාවේ (memory cache) වෙන්වීම හේතුවෙන් නිරන්තර දත්ත හුවමාරුවේදී සිදුවන කාලය සහ ශක්තිය නිරර්ථක වීමයි.",
    category: "computing"
  },
  {
    term: "Neuromorphic",
    termSi: "නියුරෝමෝර්ෆික්",
    definitionEn: "Microchip designs containing physical circuits modeled closely on biological synapses and organic human brain neurological architecture for real-time edge intelligence.",
    definitionSi: "මිනිස් මොළයේ ඇති නියුරෝන සම්බන්ධතා සහ ස්නායුක ජාල ව්‍යුහය අනුකරණය කරමින් නිපදවනු ලබන ක්ෂුද්‍ර පරිපථ හා සිලිකන් චිප්ස් වේ.",
    category: "computing"
  }
];

export const INITIAL_PROFILES: AuthorProfile[] = [
  {
    id: "prof-wickramasinghe",
    slug: "dr-wickramasinghe",
    userId: "u-author",
    nameEn: "Dr. K. L. Wickramasinghe",
    nameSi: "ආචාර්ය කේ. එල්. වික්‍රමසිංහ",
    titleEn: "Quantum Physicist & Science Columnist",
    titleSi: "ක්වොන්ටම් භෞතික විද්‍යාඥ සහ විද්‍යා ලේඛක",
    bioEn:
      "Dr. Wickramasinghe writes on quantum foundations, computing horizons, and bilingual science communication for Sri Lankan readers.",
    bioSi: "ආචාර්ය වික්‍රමසිංහ ක්වොන්ටම් පදනම සහ ද්විභාෂා විද්‍යා සන්නිවේදනය පිළිබඳ ලියනව.",
    avatarUrl: "https://picsum.photos/seed/wick/400/400",
    coverUrl: "https://picsum.photos/seed/wick-cover/1200/400",
    expertise: ["Quantum Physics", "Science Writing", "Bilingual Publishing"],
    locationEn: "Colombo, Sri Lanka",
    locationSi: "කොළඹ, ශ්‍රී ලංකාව",
    featured: true,
    social: {
      email: "wickramasinghe@vidya.lk",
      twitter: "vidyachinthana",
      website: "https://vidya.lk",
      facebook: "vidyachinthana",
      instagram: "vidyachinthana",
      whatsapp: "94771234567",
    },
  },
  {
    id: "prof-anura",
    slug: "prof-anura-ilangasingha",
    nameEn: "Prof. Anura Ilangasingha",
    nameSi: "ප්‍රොෆ. අනුර ඉලංගසිංහ",
    titleEn: "Education & Policy Researcher",
    titleSi: "අධ්‍යාපන සහ ප්‍රතිපත්ති පර්යේෂක",
    bioEn: "Long-form analysis on education systems and national science policy.",
    bioSi: "අධ්‍යාපන පද්ධති සහ ජාතික විද්‍යා ප්‍රතිපත්ති පිළිබධ විශ්ලේෂණ.",
    avatarUrl: "https://picsum.photos/seed/anura/400/400",
    coverUrl: "https://picsum.photos/seed/anura-cover/1200/400",
    expertise: ["Education", "Policy", "Research"],
    locationEn: "Kandy, Sri Lanka",
    locationSi: "මහනුවර, ශ්‍රී ලංකාව",
    featured: true,
    social: {
      email: "anura@vidya.lk",
      twitter: "",
      website: "",
      facebook: "",
      instagram: "prof.anura",
      whatsapp: "",
    },
  },
  {
    id: "auth-senaka",
    slug: "senaka-perera",
    nameEn: "Author Senaka",
    nameSi: "ලේඛක සේනක",
    titleEn: "Sci-Fi & Technology Editor",
    titleSi: "Sci-Fi සහ තාක්ෂණ සංස්කාරක",
    bioEn: "Speculative futures, AI ethics, and narrative technology journalism.",
    bioSi: "අනාගත තාක්ෂණය, AI ආචාරධර්මය සහ කතාන්දර ලේඛන.",
    avatarUrl: "https://picsum.photos/seed/senaka/400/400",
    coverUrl: "https://picsum.photos/seed/senaka-cover/1200/400",
    expertise: ["Sci-Fi", "Technology", "Ethics"],
    locationEn: "Galle, Sri Lanka",
    locationSi: "ගාල්ල, ශ්‍රී ලංකාව",
    featured: false,
    social: {
      email: "senaka@vidya.lk",
      twitter: "authorsenaka",
      website: "https://senaka.dev",
      facebook: "",
      instagram: "senaka.perera",
      whatsapp: "94770000000",
    },
  },
];

