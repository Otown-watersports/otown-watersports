/** Verified, dated career results for /athletes/[slug] (checked Sept 2026 against the sources listed).
 *  Every entry must have a year and a source. List the strongest result first: the first two feed the athlete cards; the rider page sorts by year. "rider" = stated by the rider / her own records. */
export type Result = { year: string; text: string; source: string };

const PWT26 = "https://prowakeboardtour.com/2025-results/"; // page is headed "2026 Results"
const WWA22W = "https://www.thewwa.com/2022-nautique-wwa-wakeboard-world-championships-masters-wakesurf-championships-presented-by-gm-marine-conclude-in-pine-mountain-georgia/";
const WWA22N = "https://www.thewwa.com/2022-national-champions-crowned-in-polk-county/";
const WWA24W = "https://www.thewwa.com/gold-medals-awarded-on-australias-gold-coast-for-the-2024-nautique-wwa-wakeboard-world-championships/";
const MC = "https://www.mastercraft.com/athletes/meagan-ethell/";
const OLY = "https://olympic.ca/team-canada/rusty-malinoski/";
const STEEL = "https://steellafferty.com/accomplishments/";
const KIRA = "https://www.wakeboardingmag.com/story/gear/whats-in-kira-lewis-board-bag/";
const ZOEY = "https://zoeycarroll.com/";

export const riderResults: Record<string, Result[]> = {
  meagan: [
    { year: "2026", text: "Won the WWA Wakeboard World Championship in Pro Women, her 9th world title", source: "https://www.instagram.com/p/DdRgCpllN45/" },
    { year: "2024", text: "Won her 8th WWA Wakeboard World Championship title in Australia", source: "https://www.wakeboardingmag.com/news/ethell-earns-eighth-wwa-title-while-rapa-snares-mens-title/" },
    { year: "2026", text: "Won the Pro Wakeboard Tour Pro Women overall title", source: PWT26 },
    { year: "2025", text: "Won the WWA U.S. National Championship and the Nautique Masters, her ninth Masters title", source: "https://www.wakeboardingmag.com/news/meagan-ethell-nails-x-mobe-540-and-defends-her-masters-crown/" },
    { year: "2012–2025", text: "Named Best Female Rider at the Wake Awards six times", source: MC },
    { year: "2012", text: "Won Queen of Wake, The Masters and Wake Games as a rookie, and was named Rookie of the Year", source: MC },
  ],
  rusty: [
    { year: "2013", text: "Won his second World Championship title", source: OLY },
    { year: "2009", text: "Landed the first 1080 in competition, at the Pro Wakeboard Tour finale in Reno", source: "https://www.wakeboardingmag.com/blog/news/2009/08/16/rusty-malinoski-lands-first-1080-in-competition/" },
    { year: "2008", text: "Won his first World Championship title", source: OLY },
    { year: "2007, 2011, 2013", text: "Named Canada’s Wakeboard Male Athlete of the Year", source: OLY },
    { year: "2005", text: "Won Pro Men at the U.S. Pro-Am Championship", source: "https://en.wikipedia.org/wiki/Rusty_Malinoski" },
  ],
  steel: [
    { year: "2017", text: "Won gold in Real Wake Throwdown at the X Games", source: STEEL },
    { year: "2017", text: "Named Wakeboarder of the Year", source: STEEL },
    { year: "2017", text: "Won Trick of the Year for his double mute moby and took 1st at Double Up Pro", source: STEEL },
    { year: "2010", text: "Named Rookie of the Year", source: STEEL },
  ],
  shota: [
    { year: "2017", text: "Won gold in men’s wakeboard freestyle at the World Games in Wrocław, Poland", source: "https://en.wikipedia.org/wiki/Water_skiing_at_the_2017_World_Games_%E2%80%93_Men%27s_wakeboard" },
    { year: "2025", text: "Won silver in men’s wakeboard freestyle at the World Games in Chengdu, China", source: "https://en.wikipedia.org/wiki/Wakeboarding_at_the_2025_World_Games" },
    { year: "2026", text: "Finished 16th overall in Pro Men on the Pro Wakeboard Tour", source: PWT26 },
  ],
  jamie: [
    { year: "2025", text: "Set the world record for the longest wakeboard rail slide: 140 m (460 ft) in Laax, Switzerland", source: "https://alliancewake.com/wake/switzerlands-jamie-huser-sets-a-new-world-record/" },
    { year: "2022", text: "Won the WWA World Championship in Junior Pro Men", source: WWA22W },
    { year: "2022", text: "Won the WWA U.S. National Championship in Junior Pro Men", source: WWA22N },
    { year: "2023", text: "Named Rookie of the Year after finishing 2nd overall in his first pro season", source: "https://alliancewake.com/wake/switzerlands-jamie-huser-sets-a-new-world-record/" },
  ],
  camden: [
    { year: "2023", text: "Won the WWA U.S. National Championship in Junior Men", source: "https://www.thewwa.com/2023-nautique-wwa-national-championships-presented-by-gm-marine-wrap-up-in-pine-mountain-georgia/" },
    { year: "2026", text: "Finished 6th overall in Pro Men on the Pro Wakeboard Tour", source: PWT26 },
  ],
  blaze: [
    { year: "2025", text: "Won the WWA World Championship in Junior Boys", source: "https://www.instagram.com/blazewake/" },
    { year: "2026", text: "Won Stop 2 of the Gravel Tour, Orlando", source: "https://www.instagram.com/blazewake/" },
    { year: "2026", text: "Won Stop 1 of the Gravel Tour, Orlando", source: "https://www.instagram.com/blazewake/" },
  ],
  kira: [
    { year: "2019", text: "Won the WWA World Championship in Junior Pro Women in Mexico", source: KIRA },
    { year: "2018", text: "Won the WWA World Championship in Junior Pro Women in Japan", source: KIRA },
    { year: "2026", text: "Finished 8th overall in Pro Women on the Pro Wakeboard Tour", source: PWT26 },
    { year: "2023", text: "Finished 2nd overall on the Junior Pro Tour", source: "https://montverde.org/kira-lewis-ranks-second-in-junior-pro-tour-after-competing-in-wwa-wakeboard-world-championships/" },
    { year: "2021", text: "Won Junior Pro Women at the Nautique Masters", source: KIRA },
  ],
  ashley: [
    { year: "2023", text: "Won the World Championship in Junior Pro Women in Portugal", source: "https://www.carymagazine.com/features/ashley-kazmer-wakeboard-world-champion/" },
    { year: "2024", text: "Finished 2nd in Junior Pro Women at the WWA World Championships in Australia", source: WWA24W },
    { year: "2026", text: "Finished tied 5th overall in Pro Women on the Pro Wakeboard Tour", source: PWT26 },
  ],
  rex: [
    { year: "2026", text: "Finished 3rd at the WWA Wakeboard World Championships", source: "https://www.instagram.com/rad_rexx/" },
    { year: "2022", text: "Won the WWA World Championship in Men’s Wakeskate", source: WWA22W },
    { year: "2026", text: "Finished 3rd overall in Junior Pro on the Pro Wakeboard Tour", source: PWT26 },
  ],
  campbell: [
    { year: "2024", text: "Won Open Women cable wakeboard at the Pan American Championships in Orlando, earning a spot at the 2025 World Games", source: "https://www.usawaterski.org/news/2024/july/20/u-s-cable-wakeboard-athletes-qualify-for-world-games" },
    { year: "2022", text: "Won Pro Women Traditional at the WWA Wake Park Nationals", source: WWA22N },
    { year: "2026", text: "Finished 11th overall in Pro Women on the Pro Wakeboard Tour", source: PWT26 },
  ],
  hina: [
    { year: "by 2022", text: "Won four Japanese titles and two WWA Asian titles", source: "https://www.wakeboardingmag.com/howto/hinata-yoshihara-interview/" },
    { year: "2026", text: "Finished tied 5th overall in Pro Women on the Pro Wakeboard Tour", source: PWT26 },
  ],
  luna: [
    { year: "2025", text: "Represented Belgium at the World Games, finishing 8th in women’s wakeboard freestyle", source: "https://en.wikipedia.org/wiki/Wakeboarding_at_the_2025_World_Games" },
    { year: "2025", text: "Finished 4th in Open Women at the IWWF Europe & Africa Boat Championships", source: "https://www.iwwfed-ea.org/boatwake/25/25EURO15/women_wakeboard_final_startlist_r.pdf" },
  ],
  alize: [
    { year: "2022", text: "Won the IWWF World Championship in Under 18 Women, 13 months after severe burn injuries", source: "https://fissw.com/news/la-campionessa-alize-piana-insignita-della-civica-benemerenza-della-citta-di-lecco/" },
  ],
  fernanda: [
    { year: "2025", text: "Won silver in women’s wakeboard at the Junior Pan American Games", source: "https://en.wikipedia.org/wiki/Water_skiing_at_the_2025_Junior_Pan_American_Games" },
    { year: "2023", text: "Finished 4th in women’s wakeboard at the Pan American Games in Santiago, Chile", source: "https://en.wikipedia.org/wiki/Water_skiing_at_the_2023_Pan_American_Games_%E2%80%93_Women%27s_wakeboard" },
    { year: "2026", text: "Finished 12th overall in Pro Women on the Pro Wakeboard Tour", source: PWT26 },
    { year: "2022", text: "Won the Mexican National Championship in Women’s Open", source: "https://communitynewspapers.com/featured/palmer-trinity-sophomore-wins-mexicos-national-wakeboarding-championship/" },
  ],
  "anna-mariia": [
    { year: "2019", text: "Won the Junior European Championship", source: "rider" },
    { year: "2022–2025", text: "Won the Russian National Championship in boat wakeboard four years in a row", source: "rider" },
    { year: "2019", text: "Won bronze in the junior division at the IWWF championships", source: "rider" },
    { year: "2023", text: "Finished 2nd in WWA Junior Pro Women", source: "rider" },
  ],
  zoey: [
    { year: "2026", text: "Won the WWA World Championship in Junior Pro Women", source: ZOEY },
    { year: "2026", text: "Won Junior Pro Women at the Nautique Masters", source: ZOEY },
    { year: "2025", text: "Finished 3rd in Junior Pro Women at the Nautique Masters", source: ZOEY },
    { year: "2024", text: "Won gold in U14 Girls at the IWWF Pan American Championships", source: "https://en.wikipedia.org/wiki/Zoey_Carroll" },
    { year: "2022", text: "Won the WWA U.S. National Championship", source: "https://www.orthocarolina.com/news/elevenyearold-wakeboarder-overcomes-injury-and-wins-national-title-" },
  ],
  ana: [
    { year: "2026", text: "Finished 2nd at the WWA National Championships in her first Junior Pro season", source: "https://www.instagram.com/p/DbS_yw7yuX7/" },
    { year: "2022", text: "Won the WWA World Championship in Jr. Girls 9 & Under", source: WWA22W },
    { year: "2025", text: "Won her division at the WWA National Championships in Grand Junction, Colorado", source: "https://www.instagram.com/p/DNDdJXauHFF/" },
    { year: "2025", text: "Received the Shatter the Standard (Cable) award at the USA Wakeboard awards banquet", source: "https://www.instagram.com/p/DUgCKcUkVil/" },
    { year: "2026", text: "Ranked 4th in Junior Pro Women on the Nautique Wake Series", source: "https://app.thewwa.com/wwa-rankings" },
  ],
  stella: [
    { year: "2026", text: "Finished 3rd at the WWA Wakeboard World Championships", source: "https://www.instagram.com/p/DdaQR7NDCeA/" },
    { year: "2026", text: "Won bronze at the WWA Wakeboard National Championships", source: "https://www.instagram.com/p/DbV-0vUETYj/" },
    { year: "2026", text: "Ranked 5th in Junior Pro Women on the Nautique Wake Series", source: "https://app.thewwa.com/wwa-rankings" },
  ],
  payton: [
    { year: "2025", text: "Won gold at the Moomba Masters in Melbourne, Australia", source: "https://www.instagram.com/payton.gross.wake/" },
    { year: "2024", text: "Won gold in Junior (U18) Women at the IWWF Pan American Wakeboard Championships", source: "https://www.usawaterski.org/news/2024/october/18/u-s-team-wins-gold-medal-at-iwwf-pan-american-wakeboard-championships" },
    { year: "2022", text: "Won Junior Pro Women at the WWA Wakeboard World Championships", source: WWA22W },
  ],
  lane: [
    { year: "2026", text: "Finished 14th overall in Pro Women on the Pro Wakeboard Tour", source: PWT26 },
  ],
  tucker: [
    { year: "2022", text: "Won the WWA World Championship in Junior Boys 9 & Under", source: WWA22W },
  ],
};
