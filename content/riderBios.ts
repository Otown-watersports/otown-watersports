/** Short rider bios for the /athletes/[slug] pages (SEO). Every fact is from a public source listed below
 *  (full research notes in research/riders.json). Nothing here is invented; keep it that way when editing. */
export type RiderBio = { from?: string; bio: string[]; /** Extra sourced results shown under Career highlights. */ more?: string[]; sources: { label: string; url: string }[] };

export const riderBios: Record<string, RiderBio> = {
  meagan: {
    more: ["2026: Pro Wakeboard Tour Pro Women overall winner.", "Queen of Wake and Wake Games champion.", "MasterCraft team rider."],
    bio: [
      "Meagan Ethell is one of the most decorated riders in women’s wakeboarding. She won her ninth WWA Wakeboard World Championship title in September 2026, after her eighth on the Gold Coast, Australia, in 2024, and won the 2026 Pro Wakeboard Tour Pro Women overall title. In 2025 she won the WWA U.S. Nationals and her ninth Nautique Masters.",
      "As a rookie in 2012 she won Queen of Wake, The Masters and Wake Games, and she has been named Best Female Rider at the Wake Awards six times. She is a MasterCraft team rider.",
    ],
    sources: [
      { label: "WWA, 2024 World Championships", url: "https://www.thewwa.com/gold-medals-awarded-on-australias-gold-coast-for-the-2024-nautique-wwa-wakeboard-world-championships/" },
      { label: "Pro Wakeboard Tour results", url: "https://prowakeboardtour.com/2025-results/" },
      { label: "MasterCraft athlete page", url: "https://www.mastercraft.com/athletes/meagan-ethell/" },
    ],
  },
  rusty: {
    more: ["2009: first 1080 landed in competition, a switch toeside 1080 at the Pro Wakeboard Tour finale in Reno."],
    from: "Canada",
    bio: [
      "Canadian pro Rusty Malinoski made history in 2009 when he landed the first 1080 ever done in competition, a switch toeside 1080 at the Pro Wakeboard Tour finale in Reno.",
      "He is a two-time World Champion (2008 and 2013) and was Canada’s Wakeboard Male Athlete of the Year in 2007, 2011 and 2013. He remains one of the best-known names in progressive boat wakeboarding.",
    ],
    sources: [
      { label: "Wakeboarding Mag, first 1080 in competition", url: "https://www.wakeboardingmag.com/blog/news/2009/08/16/rusty-malinoski-lands-first-1080-in-competition/" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rusty_Malinoski" },
    ],
  },
  steel: {
    more: ["2010: Rookie of the Year."],
    bio: [
      "Steel Lafferty won gold at the 2017 X Games and was named Wakeboarder of the Year the same season, seven years after taking Rookie of the Year in 2010.",
      "Known for big, technical riding behind the boat, he is part of the pro men’s group on the O’Town roster.",
    ],
    sources: [{ label: "Steel Lafferty, accomplishments", url: "https://steellafferty.com/accomplishments/" }],
  },
  shota: {
    more: ["2017: World Games gold in Wrocław, Poland.", "2025: World Games silver in Chengdu, China.", "2026: 16th, Pro Men, Pro Wakeboard Tour."],
    from: "Japan",
    bio: [
      "Japan’s Shota Tezuka won gold in men’s wakeboard freestyle at the 2017 World Games in Wrocław, and came back to take silver at the 2025 World Games in Chengdu.",
      "Eight years between two World Games podiums makes him one of the most consistent riders of his generation.",
    ],
    sources: [
      { label: "2017 World Games results", url: "https://en.wikipedia.org/wiki/Water_skiing_at_the_2017_World_Games_%E2%80%93_Men%27s_wakeboard" },
      { label: "2025 World Games results", url: "https://en.wikipedia.org/wiki/Wakeboarding_at_the_2025_World_Games" },
    ],
  },
  jamie: {
    more: ["2022: WWA U.S. National Champion, Junior Pro Men.", "Red Bull and Ronix athlete, based in Clermont, Florida."],
    from: "Switzerland",
    bio: [
      "Swiss rider Jamie Huser set a world record in 2025 with a 140 metre (460 ft) wakeboard rail slide in Laax, Switzerland.",
      "He won the 2022 WWA World Championship and the 2022 WWA U.S. Nationals in Junior Pro Men. A Red Bull and Ronix athlete, he has lived in Clermont, Florida, near Orlando, since 2020.",
    ],
    sources: [
      { label: "Alliance Wake, world record", url: "https://alliancewake.com/wake/switzerlands-jamie-huser-sets-a-new-world-record/" },
      { label: "WWA, 2022 World Championships", url: "https://www.thewwa.com/2022-nautique-wwa-wakeboard-world-championships-masters-wakesurf-championships-presented-by-gm-marine-conclude-in-pine-mountain-georgia/" },
    ],
  },
  camden: {
    more: ["2026: 6th overall, Pro Men, Pro Wakeboard Tour.", "2022: 2nd at the WWA World Championships.", "Centurion Boats, Ronix and Inland Wave team rider."],
    bio: [
      "Camden Marsden grew up riding on Lake Lanier in Cumming, Georgia. He won the 2023 WWA U.S. National Championship in Junior Men and finished 6th overall in Pro Men on the 2026 Pro Wakeboard Tour.",
    ],
    sources: [
      { label: "WWA, 2023 Nationals", url: "https://www.thewwa.com/2023-nautique-wwa-national-championships-presented-by-gm-marine-wrap-up-in-pine-mountain-georgia/" },
      { label: "Pro Wakeboard Tour results", url: "https://prowakeboardtour.com/2025-results/" },
    ],
  },
  blaze: {
    more: ["Rides a Liquid Force board; trains with Glen at O’Town."],
    bio: [
      "Blaze Poss is one of the youngest riders on the O’Town dock, and already a world and national champion: in 2025 he won Junior Boys at both the WWA Wakeboard World Championships and the Nautique WWA Wakeboard National Championships in Grand Junction, Colorado.",
      "In 2026 he won the first two stops of Performance Ski & Surf’s Gravel Tour in Orlando, going two for two to start the season.",
    ],
    sources: [
      { label: "@blazewake on Instagram", url: "https://www.instagram.com/blazewake/" },
    ],
  },
  kira: {
    more: ["2023: 2nd overall, Junior Pro Tour.", "2026: 8th, Pro Women, Pro Wakeboard Tour."],
    bio: [
      "Kira Lewis, from New Jersey, won back-to-back WWA Junior Pro Women World Championships in Japan (2018) and Mexico (2019), and finished 2nd overall on the 2023 Junior Pro Tour.",
      "She trains in Clermont, Florida, and now competes in Pro Women, finishing 8th on the 2026 Pro Wakeboard Tour.",
    ],
    sources: [
      { label: "Wakeboarding Mag", url: "https://www.wakeboardingmag.com/story/gear/whats-in-kira-lewis-board-bag/" },
      { label: "Montverde Academy", url: "https://montverde.org/kira-lewis-ranks-second-in-junior-pro-tour-after-competing-in-wwa-wakeboard-world-championships/" },
    ],
  },
  ashley: {
    more: ["2024: 2nd, Junior Pro Women, WWA World Championships, Gold Coast.", "2026: 6th, Pro Women, Pro Wakeboard Tour."],
    bio: [
      "Ashley Kazmer won the 2023 Junior Pro Women World Championship in Portugal, then took 2nd in Junior Pro Women at the 2024 WWA World Championships on the Gold Coast.",
      "She trains on Smith Mountain Lake, Virginia, spends winters riding in Florida, and finished tied 5th in Pro Women on the 2026 Pro Wakeboard Tour.",
    ],
    sources: [
      { label: "Cary Magazine", url: "https://www.carymagazine.com/features/ashley-kazmer-wakeboard-world-champion/" },
      { label: "WWA, 2024 World Championships", url: "https://www.thewwa.com/gold-medals-awarded-on-australias-gold-coast-for-the-2024-nautique-wwa-wakeboard-world-championships/" },
    ],
  },
  alize: {
    more: ["2025: 5th, Open Women, IWWF Europe & Africa Boat Championships.", "Won her 2022 world title 13 months after being hospitalised with severe burns."],
    from: "Italy",
    bio: [
      "Alizé Piana, from Lecco, Italy, won the 2022 IWWF World Championship in Wakeboard Under 18 Women at Varco Sabino, just 13 months after being hospitalised with severe burns.",
      "She now competes in Open Women.",
    ],
    sources: [
      { label: "FISSW", url: "https://fissw.com/news/la-campionessa-alize-piana-insignita-della-civica-benemerenza-della-citta-di-lecco/" },
      { label: "Il Fatto Quotidiano", url: "https://www.ilfattoquotidiano.it/2022/08/08/dai-mesi-passati-in-un-letto-dospedale-alloro-mondiale-nel-wakeboard-lincredibile-rinascita-di-alize-piana/6756082/" },
    ],
  },
  hina: {
    more: ["2026: 5th overall, Pro Women, Pro Wakeboard Tour.", "Trained with Glen at O’Town, per Wakeboarding Mag (2022)."],
    from: "Japan",
    bio: [
      "Hinata “Hina” Yoshihara had won four Japanese titles and two WWA Asian titles by 2022. In a 2022 Wakeboarding Mag interview she talked about training with Glen at O’Town Watersports.",
      "She finished tied 5th overall in Pro Women on the 2026 Pro Wakeboard Tour.",
    ],
    sources: [
      { label: "Wakeboarding Mag interview", url: "https://www.wakeboardingmag.com/howto/hinata-yoshihara-interview/" },
      { label: "Pro Wakeboard Tour results", url: "https://prowakeboardtour.com/2025-results/" },
    ],
  },
  campbell: {
    more: ["2022: WWA Wake Park Nationals champion, Pro Women Traditional.", "2026: 11th, Pro Women, Pro Wakeboard Tour.", "Hyperlite team rider."],
    bio: [
      "Campbell Scarborough, from Winter Springs in the Orlando area, rides both boat and cable. She won Open Women cable wakeboard at the 2024 IWWF Pan American Championships in Orlando, and the 2022 WWA Wake Park Nationals in Pro Women Traditional.",
      "Behind the boat she finished 11th in Pro Women on the 2026 Pro Wakeboard Tour. She is a Hyperlite team rider.",
    ],
    sources: [
      { label: "USA Water Ski & Wake Sports", url: "https://www.usawaterski.org/news/2024/july/20/u-s-cable-wakeboard-athletes-qualify-for-world-games" },
      { label: "WWA, 2022 Nationals", url: "https://www.thewwa.com/2022-national-champions-crowned-in-polk-county/" },
    ],
  },
  luna: {
    more: ["2025: World Games, women’s wakeboard freestyle, for Belgium.", "Belgian and French senior champion while still a junior."],
    from: "Belgium",
    bio: [
      "Luna Cassart, from Namur, represented Belgium in women’s wakeboard freestyle at the 2025 World Games and finished 4th in Open Women at the 2025 IWWF Europe & Africa Boat Wakeboard Championships.",
      "As a junior she already held Belgian and French senior titles.",
    ],
    sources: [
      { label: "2025 World Games", url: "https://en.wikipedia.org/wiki/Wakeboarding_at_the_2025_World_Games" },
      { label: "IWWF Europe & Africa results", url: "https://www.iwwfed-ea.org/boatwake/25/25EURO15/women_wakeboard_final_startlist_r.pdf" },
    ],
  },
  fernanda: {
    more: ["2022: Mexican national champion, Women.", "Trained between Miami and Orlando while at school in Florida."],
    from: "Mexico",
    bio: [
      "Fernanda Larios, from Mexico City, won silver in women’s wakeboard at the 2025 Junior Pan American Games and finished 4th at the 2023 Pan American Games in Santiago.",
      "She is a former Mexican national champion and trained weekends between Miami and Orlando while at school in Florida.",
    ],
    sources: [
      { label: "2025 Junior Pan American Games", url: "https://en.wikipedia.org/wiki/Water_skiing_at_the_2025_Junior_Pan_American_Games" },
      { label: "2023 Pan American Games", url: "https://en.wikipedia.org/wiki/Water_skiing_at_the_2023_Pan_American_Games_%E2%80%93_Women%27s_wakeboard" },
      { label: "Community Newspapers", url: "https://communitynewspapers.com/featured/palmer-trinity-sophomore-wins-mexicos-national-wakeboarding-championship/" },
    ],
  },
  "anna-mariia": {
    more: ["Two-time European youth championships winner."],
    from: "Russia",
    bio: [
      "Anna-Mariia Kushkovskaia is a competitive boat wakeboarder. She was Junior European Champion and took bronze in Junior at the IWWF championships in 2019, was 2nd in WWA Junior Pro Women in 2023, and was Russian national champion from 2022 to 2025.",
      "She also built this website.",
    ],
    sources: [{ label: "Vesti Kaliningrad", url: "https://vesti-kaliningrad.ru/kaliningrad-prinyal-chempionat-rossii-po-katernomu-vejkbordu/" }],
  },
  zoey: {
    more: ["2026: WWA World Champion and Nautique Masters champion, Junior Pro Women (per her website).", "GoPro and Ronix rider."],
    bio: [
      "Zoey Carroll, from Hickory, North Carolina, won U14 Girls wakeboard at the 2024 IWWF Pan American Championships and won the 2026 WWA World Championship and the 2026 Nautique Masters in Junior Pro Women.",
      "She is a GoPro athlete.",
    ],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Zoey_Carroll" },
      { label: "zoeycarroll.com", url: "https://zoeycarroll.com/" },
    ],
  },
  ana: {
    bio: [
      "Ana Thomas won the 2022 WWA World Championship in Jr. Girls 9 & Under and the 2025 WWA Nationals in her age division. In 2026, her first season in Junior Pro Women, she took 2nd at the WWA National Championships.",
      "She rides both boat and cable, and was recognised at the USA Wakeboard awards for her cable riding.",
    ],
    sources: [
      { label: "WWA, 2022 World Championships", url: "https://www.thewwa.com/2022-nautique-wwa-wakeboard-world-championships-masters-wakesurf-championships-presented-by-gm-marine-conclude-in-pine-mountain-georgia/" },
      { label: "Ana Thomas on Instagram", url: "https://www.instagram.com/awesomelyana/" },
    ],
  },
  rex: {
    more: ["2026: 3rd overall, Junior Pro, Pro Wakeboard Tour."],
    bio: [
      "Rex Abbott, from the Lake Norman area of North Carolina, rides both wakeboard and wakeskate. He was 3rd at the 2026 WWA Wakeboard World Championships and 3rd overall in Junior Pro on the 2026 Pro Wakeboard Tour.",
      "He also won the 2022 WWA World Championship in Men’s Wakeskate.",
    ],
    sources: [
      { label: "WWA, 2022 World Championships", url: "https://www.thewwa.com/2022-nautique-wwa-wakeboard-world-championships-masters-wakesurf-championships-presented-by-gm-marine-conclude-in-pine-mountain-georgia/" },
      { label: "Pro Wakeboard Tour results", url: "https://prowakeboardtour.com/2025-results/" },
    ],
  },
  stella: {
    from: "USA",
    bio: [
      "Stella Tracy is a wakeboarder from Eufaula, Oklahoma. In 2026 she finished 3rd at the WWA Wakeboard World Championships, took bronze at the WWA Nationals and ranked 5th in Junior Pro Women on the Nautique Wake Series.",
      "She got her start at a local event run by Sammy’s Surf Shop, where she has competed every year for a decade.",
    ],
    sources: [{ label: "Stella Tracy on Instagram", url: "https://www.instagram.com/stellajtracy/" }],
  },
  payton: {
    bio: [
      "Payton Gross, from Sanford, North Carolina, won Junior Pro Women at the 2022 WWA Wakeboard World Championships and took gold in Junior (U18) Women at the 2024 IWWF Pan American Championships, helping Team USA to the team title. In 2025 she added a Moomba Masters title in Australia.",
    ],
    sources: [
      { label: "USA Water Ski & Wake Sports", url: "https://www.usawaterski.org/news/2024/october/18/u-s-team-wins-gold-medal-at-iwwf-pan-american-wakeboard-championships" },
      { label: "WWA, 2022 World Championships", url: "https://www.thewwa.com/2022-nautique-wwa-wakeboard-world-championships-masters-wakesurf-championships-presented-by-gm-marine-conclude-in-pine-mountain-georgia/" },
    ],
  },
  lane: {
    bio: [
      "Lane Huerkamp is a pro wakeboarder and Connelly team rider. She finished 14th overall in Pro Women on the 2026 Pro Wakeboard Tour.",
    ],
    sources: [
      { label: "Pro Wakeboard Tour results", url: "https://prowakeboardtour.com/2025-results/" },
      { label: "Lane Huerkamp on Instagram", url: "https://www.instagram.com/lanehuerkamp/" },
    ],
  },
  tucker: {
    bio: [
      "Tucker Balmert, from Colorado, won the Junior Boys 9 & Under division at the 2022 WWA Wakeboard World Championships. He is already landing 720s.",
    ],
    sources: [
      { label: "WWA, 2022 World Championships", url: "https://www.thewwa.com/2022-nautique-wwa-wakeboard-world-championships-masters-wakesurf-championships-presented-by-gm-marine-conclude-in-pine-mountain-georgia/" },
      { label: "Tucker Balmert on Instagram", url: "https://www.instagram.com/tbalmert_wakeboarding/" },
    ],
  },
};
