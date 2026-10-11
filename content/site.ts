import { riderResults } from "./riderResults";
/**
 * All factual content lives here, separate from presentation.
 * Sources: otownwatersports.com (home, about, glen-fletcher-2, rates), @fletcherotown on Instagram,
 * and the rider sources listed per rider. Update facts here — components only render this file.
 */

export const contact = {
  phone: { label: "407 529 7727", href: "tel:+14075297727" },
  email: "info@otownwatersports.com",
  instagram: { label: "@fletcherotown", href: "https://www.instagram.com/fletcherotown/" },
  facebook: { label: "Facebook", href: "https://www.facebook.com/otownwatersports/" },
  waiver: "/waiver",
  location: "Lake Barton · Orlando, Florida",
  address: "5220 E Colonial Dr, Orlando, FL 32807",
  directions: "https://www.google.com/maps/dir/?api=1&destination=5220+E+Colonial+Dr,+Orlando,+FL+32807",
  mapEmbed: "https://www.google.com/maps?q=O%27Town+Watersports,+5220+E+Colonial+Dr,+Orlando,+FL+32807&z=15&output=embed",
  hours: "Open every week of the year, by appointment",
};

export const brandLine = "Learn. Ride. Progress.";

/** Hero slides map to the brand line. Photos: O'Town originals (otownwatersports.com). */
export const heroSlides = [
  {
    key: "learn",
    label: "Learn",
    caption: "O’Town rider, golden hour on Lake Barton",
    image: "/images/hero-kitt.jpg",
    alt: "A rider throwing spray off the wake in golden evening light",
    portrait: false,
    position: "60% 40%",
    mobilePosition: "56% 42%",
    mobileZoom: 0.8,
    mobileOrigin: "50% 42%",
    zoom: 1,
    origin: "50% 50%",
  },
  {
    key: "ride",
    label: "Ride",
    caption: "Fully inverted above the wake",
    image: "/images/hero-bec-invert.jpg",
    alt: "A rider fully inverted high above the boat",
    portrait: false,
    position: "50% 18%",
    mobilePosition: "50% 20%",
    zoom: 1,
    origin: "50% 50%",
  },
  {
    key: "progress",
    label: "Progress",
    caption: "Big air at sunset",
    image: "/images/bg-sunset-air.jpg",
    alt: "A rider inverted high above the wake at sunset",
    portrait: false,
    position: "42% 30%",
    mobilePosition: "19% 30%",
    mobileZoom: 1.18,
    mobileOrigin: "26% 21%",
    zoom: 1,
    origin: "50% 50%",
  },
];

export const glen = {
  role: "Head coach",
  // From otownwatersports.com/about/glen-fletcher-2/, @fletcherotown bio and Wakeboarding Mag.
  points: [
    "New Zealand-born former pro rider, coaching wakeboarding for more than twenty years.",
    "Has worked with first-timers, juniors and some of the best-known riders in the sport.",
    
  ],
  aside: "Between sets, there’s a fair chance of a guitar on the dock.",
};

export type Rider = {
  key: string;
  name: string;
  country: string;
  title: string;
  /** Short, sourced achievements (see research/riders.json for sources). */
  points: string[];
  instagram?: string;
  photo?: string;
  /** 4:5 crop for the athletes grid, rider centred. */
  cardPhoto?: string;
  photoAlt?: string;
  photoPosition?: string;
  /** Second image for the floating card on the landing page: a portrait or podium shot. */
  card?: string;
  cardCaption?: string;
  featured?: boolean;
};

/** O’Town’s rider roster (client list, Sept 2026). Surnames of Rex, Ana, Stella and Zoey confirmed against the 2026 WWA Nautique Wake Series rankings.
 *  Photos: public web sources, see ASSETS.md. Riders agreed to image use in exchange for Instagram links. */
export const riders: Rider[] = [
  { key: "meagan", name: "Meagan Ethell", country: "USA", title: "Pro wakeboarder", featured: true, instagram: "meaganethell",
    points: ["Nine-time WWA Wakeboard World Champion.", "Six-time Best Female Rider at the Wake Awards."],
    photo: "/athletes/meagan-air.jpg", cardPhoto: "/athletes/meagan-air-4x5.jpg", photoAlt: "Meagan Ethell inverted above the wake", photoPosition: "40% 30%",
    card: "/athletes/meagan-portrait.jpg", cardCaption: "Off the water" },
  { key: "rusty", name: "Rusty Malinoski", country: "Canada", title: "Pro wakeboarder", featured: true, instagram: "rustymalinoski",
    points: ["Landed the first 1080 in competition, in 2009.", "Pro Men winner at the 2005 U.S. Pro-Am Championship."],
    photo: "/athletes/rusty.jpg", cardPhoto: "/athletes/rusty-4x5.jpg", photoAlt: "Rusty Malinoski inverted, his signature board overhead", photoPosition: "50% 34%",
    card: "/athletes/rusty-card.jpg", cardCaption: "Off the water" },
  { key: "steel", name: "Steel Lafferty", country: "USA", title: "Pro wakeboarder", instagram: "steellafferty",
    points: ["2017 X Games gold.", "2017 Wakeboarder of the Year."],
    photo: "/athletes/steel-air.jpg", cardPhoto: "/athletes/steel-air-4x5.jpg", photoAlt: "Steel Lafferty high above the lake", photoPosition: "50% 30%" },
  { key: "zoey", name: "Zoey Carroll", country: "USA", title: "Junior pro wakeboarder", instagram: "zoeytcarroll",
    points: ["Gold, U14 Girls, 2024 IWWF Pan American Championships.", "2026 WWA World Champion, Junior Pro Women."],
    photo: "/athletes/zoey-hd.jpg", cardPhoto: "/athletes/zoey-4x5.jpg", photoAlt: "Zoey Carroll inverted over the wake", photoPosition: "50% 40%" },
  { key: "jamie", name: "Jamie Huser", country: "Switzerland", title: "Pro wakeboarder", featured: true, instagram: "jamiehuser",
    points: ["World record: a 140 metre wakeboard rail slide, 2025.", "2022 WWA World Champion, Junior Pro Men."],
    photo: "/athletes/jamie.jpg", cardPhoto: "/athletes/jamie-4x5.jpg", photoAlt: "Jamie Huser on his 140 metre world record rail in the Swiss Alps", photoPosition: "45% 55%",
    card: "/athletes/jamie-card.jpg", cardCaption: "Off the water" },
  { key: "shota", name: "Shota Tezuka", country: "Japan", title: "Pro wakeboarder", instagram: "shotatezuka",
    points: ["Gold at the 2017 World Games.", "Silver at the 2025 World Games."],
    photo: "/athletes/shota.jpg", cardPhoto: "/athletes/shota-4x5.jpg", photoAlt: "Shota Tezuka riding", photoPosition: "35% 40%" },
  { key: "camden", name: "Camden Marsden", country: "USA", title: "Pro wakeboarder", featured: true, instagram: "camdenmarsden",
    points: ["2023 WWA U.S. National Champion, Junior Men.", "6th overall, Pro Men, 2026 Pro Wakeboard Tour."],
    photo: "/athletes/camden.jpg", cardPhoto: "/athletes/camden-4x5.jpg", photoAlt: "Camden Marsden carving hard into the wake", photoPosition: "62% 45%",
    card: "/athletes/camden-portrait.jpg", cardCaption: "Off the water" },
  { key: "rex", name: "Rex Abbott", country: "USA", title: "Junior pro wakeboarder", featured: true, instagram: "rad_rexx", photo: "/athletes/rex-2026.jpg", cardPhoto: "/athletes/rex-2026-4x5.jpg", photoAlt: "Rex Abbott on the dock in his competition jersey, 2026", photoPosition: "58% 45%",
    points: ["3rd at the 2026 WWA Wakeboard World Championships.", "3rd overall, Junior Pro, 2026 Pro Wakeboard Tour.", "2022 WWA World Champion, Men’s Wakeskate."] },
  { key: "stella", name: "Stella Tracy", country: "USA", title: "Junior pro wakeboarder", instagram: "stellajtracy", photo: "/athletes/stella.jpg", cardPhoto: "/athletes/stella-4x5.jpg", photoAlt: "Stella Tracy on the back of the boat, ready to ride", photoPosition: "50% 35%",
    points: ["5th, Junior Pro Women, 2026 Nautique Wake Series."] },
  { key: "hina", name: "Hina Yoshihara", country: "Japan", title: "Pro wakeboarder", instagram: "hinata_yoshihara",
    points: ["Four-time Japanese champion and two-time WWA Asian champion."],
    photo: "/athletes/hina-hd.jpg", cardPhoto: "/athletes/hina-4x5.jpg", photoAlt: "Hinata Yoshihara on the boat after a set", photoPosition: "40% 35%" },
  { key: "ashley", name: "Ashley Kazmer", country: "USA", title: "Pro wakeboarder", instagram: "ashley_kazmer",
    points: ["2023 Junior Pro Women World Champion."],
    photo: "/athletes/ashley-ig.jpg", cardPhoto: "/athletes/ashley-ig-4x5.jpg", photoAlt: "Ashley Kazmer grabbing her board high above the wake, in a clip shared with Glen Fletcher", photoPosition: "50% 30%" },
  { key: "blaze", name: "Blaze Poss", country: "USA", title: "Junior wakeboarder", instagram: "blazewake",
    points: ["2025 WWA World Champion, Junior Boys.", "2025 WWA U.S. National Champion, Junior Boys.", "Won Stops 1 and 2 of the 2026 Gravel Tour, Orlando."],
    photo: "/athletes/blaze.jpg", cardPhoto: "/athletes/blaze-4x5.jpg", photoAlt: "Blaze Poss on the podium with his trophy and board after winning Stop 2 of the 2026 Gravel Tour", photoPosition: "50% 30%" },
  { key: "fernanda", name: "Fernanda Larios", country: "Mexico", title: "Pro wakeboarder", photo: "/athletes/fernanda-hd.jpg", cardPhoto: "/athletes/fernanda-4x5.jpg", photoAlt: "Fernanda Larios carving behind the boat", photoPosition: "50% 40%",
    points: ["Silver at the 2025 Junior Pan American Games.", "4th at the 2023 Pan American Games."] },
  { key: "payton", name: "Payton Gross", country: "USA", title: "Junior pro wakeboarder", instagram: "payton.gross.wake", photo: "/athletes/payton.jpg", cardPhoto: "/athletes/payton-4x5.jpg", photoAlt: "Payton Gross inverted above the wake at the Moomba Masters in Melbourne", photoPosition: "55% 40%",
    points: ["Gold, Junior (U18) Women, 2024 IWWF Pan American Championships."] },
  { key: "kira", name: "Kira Lewis", country: "USA", title: "Pro wakeboarder", instagram: "kira.wake",
    points: ["Two-time WWA Junior Pro Women World Champion, 2018 and 2019."],
    photo: "/athletes/kira.jpg", cardPhoto: "/athletes/kira-4x5.jpg", photoAlt: "Kira Lewis grabbing high above the lake", photoPosition: "65% 30%" },
  { key: "campbell", name: "Campbell Scarborough", country: "USA", title: "Pro wakeboarder", instagram: "campbell_scarborough",
    points: ["Open Women champion, cable wakeboard, 2024 IWWF Pan American Championships."],
    photo: "/athletes/campbell.jpg", cardPhoto: "/athletes/campbell-4x5.jpg", photoAlt: "Campbell Scarborough jumping at the cable park", photoPosition: "55% 35%" },
  { key: "luna", name: "Luna Cassart", country: "Belgium", title: "Pro wakeboarder", instagram: "lunacassart",
    points: ["Represented Belgium at the 2025 World Games.", "4th, Open Women, 2025 IWWF Europe & Africa Championships."],
    photo: "/athletes/luna-hd.jpg", cardPhoto: "/athletes/luna-4x5.jpg", photoAlt: "Luna Cassart grabbing above the lake", photoPosition: "50% 40%" },
  { key: "anna-mariia", name: "Anna-Mariia Kushkovskaia", country: "Russia", title: "Pro wakeboarder", instagram: "anna_maria_wake", photo: "/athletes/anna-mariia.jpg", cardPhoto: "/athletes/anna-mariia-card.jpg", photoAlt: "Anna-Mariia Kushkovskaia grabbing her board mid-air behind the boat", photoPosition: "54% 40%",
    points: ["Junior European Champion, 2019.", "Russian national champion, 2022–2025."] },
  { key: "lane", name: "Lane Huerkamp", country: "USA", title: "Pro wakeboarder", instagram: "lanehuerkamp", photo: "/athletes/lane.jpg", cardPhoto: "/athletes/lane-4x5.jpg", photoAlt: "Lane Huerkamp getting up behind the boat", photoPosition: "50% 45%",
    points: ["14th overall, Pro Women, 2026 Pro Wakeboard Tour."] },
  { key: "ana", name: "Ana Thomas", country: "USA", title: "Junior pro wakeboarder", instagram: "awesomelyana", photo: "/athletes/ana.jpg", cardPhoto: "/athletes/ana-4x5.jpg", photoAlt: "Ana Thomas with her USA Wakeboard award", photoPosition: "50% 30%",
    points: ["2022 WWA World Champion, Jr. Girls 9 & Under.", "4th, Junior Pro Women, 2026 Nautique Wake Series."] },
  { key: "alize", name: "Alizé Piana", country: "Italy", title: "Pro wakeboarder", instagram: "alizewake",
    points: ["2022 IWWF World Champion, Wakeboard Under 18 Women."],
    photo: "/athletes/alize.jpg", cardPhoto: "/athletes/alize-4x5.jpg", photoAlt: "Alizé Piana tucked mid-air through a curtain of spray", photoPosition: "50% 30%" },
  { key: "tucker", name: "Tucker Balmert", country: "USA", title: "Junior wakeboarder", instagram: "tbalmert_wakeboarding", photo: "/athletes/tucker.jpg", cardPhoto: "/athletes/tucker-4x5.jpg", photoAlt: "Tucker Balmert in the air above the wake", photoPosition: "50% 25%",
    points: ["2022 WWA World Champion, Junior Boys 9 & Under."] },
];

/** Landing page features, in order. */
// Card points come from the verified results (first two = strongest), one style everywhere: "Did X (year)."
for (const r of riders) {
  const res = riderResults[r.key];
  if (res?.length) r.points = res.slice(0, 2).map((x) => `${x.text} (${x.year}).`);
}

export const spotlight: Rider[] = riders.filter((r) => r.featured);


/** How a session works — from the rates page (training on and off the water, trampoline, video review). */
export const method = [
  { n: "01", title: "On the water", body: "One-to-one sets behind the boat, with Glen driving and coaching every pass: speed, line length and timing tuned to you.", image: "/images/sophia-wakesurf.jpg", alt: "A rider wakesurfing behind the boat on Lake Barton", position: "50% 55%" },
  { n: "02", title: "On the trampoline", body: "Air awareness and trick progressions on the lakeside trampoline, so the movement is familiar before you try it behind the boat.", image: "/images/new/trampoline-flip.jpg", alt: "A rider flips on the lakeside trampoline", position: "50% 30%" },
  { n: "03", title: "In video review", body: "Full days include video review of your sessions. See what you felt, and know exactly what to change on the next set.", image: "/images/glen-driving.jpg", alt: "Glen driving the boat, looking back toward the rider", position: "35% 40%" },
];



export type ActivityKey = "first-session" | "coaching" | "training-stay" | "wakesurf" | "other";

export const experiences = [
  {
    key: "first-session" as ActivityKey,
    index: "01",
    title: "Your first session",
    who: "For people learning to wakeboard or wakesurf.",
    body: "Start behind the boat with a coach who has taught every kind of rider, from standing up for the first time to riding comfortably across the wake.",
    image: "/images/new/dock-start-sl450.jpg",
    alt: "A rider ready for a dock start, the new Supra SL 450 waiting on the lake",
    position: "50% 58%",
  },
  {
    key: "coaching" as ActivityKey,
    index: "02",
    title: "Develop your riding",
    who: "For riders seeking focused coaching and progression.",
    body: "One-to-one coaching on and off the water, with trampoline work and video review to connect what you feel to what you see.",
    image: "/images/big-air.jpg",
    alt: "A rider high above the wake against a bright, cloudy sky",
    position: "62% 40%",
  },
  {
    key: "training-stay" as ActivityKey,
    index: "03",
    title: "Plan a training stay",
    who: "For visitors who want more time on the water.",
    body: "Camps and overnight stays are tailored to you: coaching, video review and a room at O’Town on the lake. Tell us your dates and we’ll confirm what’s available.",
    image: "/images/stay-bedroom.jpg",
    alt: "A bright bedroom with a window looking onto the lake",
    position: "50% 72%",
  },
];

export const boat = {
  /** O'Town's new boat is a Supra SL (owner + @fletcherotown, Sept 2026).
   *  NOTE: the 360° render was recorded from a configurator build that carries an SV badge — re-record an SL build to match. */
  model: "SL 450" as string | null,
  make: "Supra",
  link: "https://www.supraboats.com/boats/sl",
  frames: 36,
};

/** Latest posts from @fletcherotown (covers downloaded Sept 2026). */
export const igPosts = [
  { id: "DVM2FoiATjD", caption: "Dock start, French style", image: "/ig/DVM2FoiATjD.jpg" },
  { id: "DPkBb_gEgYb", caption: "Wipeout Wednesday, with redemption", image: "/ig/DPkBb_gEgYb.jpg" },
  { id: "DZ2ndOUhbpu", caption: "What spin is this?", image: "/ig/DZ2ndOUhbpu.jpg" },
  { id: "DS8A6e7AZeI", caption: "End of 2025", image: "/ig/DS8A6e7AZeI.jpg" },
  { id: "DaYLopoBBOZ", caption: "The KGB, and why it got loose", image: "/ig/DaYLopoBBOZ.jpg" },
  { id: "DTd591RAfuu", caption: "Winter in the Deep South", image: "/ig/DTd591RAfuu.jpg" },
];

export const faqs = [
  { q: "Do I need any experience?", a: "No. Beginners are welcomed and pros are challenged. Every session is built around the rider on the end of the rope." },
  { q: "What happens if the weather turns?", a: "O’Town is open year-round and lessons run rain or shine, wind or no wind." },
  { q: "How do I reserve a session?", a: "Send an inquiry or call. A 50% deposit holds your time, and the balance is due on arrival." },
  { q: "Is there a waiver?", a: "Yes. Every rider signs the O’Town waiver. Riders under 18 need it signed before they arrive." },
  { q: "Can I stay on site?", a: "Yes. Camps and overnight stays include a room at O’Town with a stocked kitchen, laundry and high speed Wi-Fi. Call with your dates for pricing and availability." },
  { q: "Where are you?", a: "5220 E Colonial Dr, Orlando, on private Lake Barton, about 15 to 20 minutes from Orlando International Airport. Look for the two-story building with the big blue “O”." },
];

export const rates = {
  items: [
    { key: "set", name: "Private lesson", price: "$175", unit: "1 set: 30 minutes", includes: ["1:1 coaching", "Training on and off the water"], featured: true },
    { key: "day", name: "Full day", price: "$450", unit: "per day", includes: ["Two 45 minute sessions", "Training on and off the water", "Trampoline training", "Video review of sessions"] },
    { key: "stay", name: "Camps & overnight stay", price: "Tailored", unit: "to your needs", includes: ["Coaching on and off the water", "Video review", "A room at O’Town on the lake", "Stocked kitchen, laundry, Wi-Fi"] },
  ],
  note: "All sessions are by appointment only.",
  policies: [
    {
      q: "Making a reservation",
      a: "Email or call 407 529 7727 with each rider’s name and age, riding experience and goals, and the dates and times you’d like. A 50% deposit holds the reservation.",
    },
    { q: "Waiver", a: "Every rider signs the O’Town Watersports waiver. Riders under 18 need it signed before arriving." },
    { q: "Payment", a: "Visa, MasterCard, AMEX, check, traveler’s check or cash. A 3% fee is added to card transactions. Full payment is due on arrival." },
    {
      q: "Cancellations",
      a: "Cancel 30 days ahead in season or 14 days ahead off-season, with a 50% charge. No-shows and later cancellations are charged in full, as there’s a waiting list and limited availability.",
    },
    {
      q: "On the day",
      a: "Open year-round; lessons run rain or shine, wind or no wind. Be on the dock with your equipment on at your start time. Once you’ve booked the time, it’s yours. No refunds for sore muscles.",
    },
  ],
};
