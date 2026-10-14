// Every string below is taken from speedtin.com. Nothing here is invented.
// Where the live site has a typo or a broken link, the note says how it was handled.

export const STORE_URL = "https://speedtin.com";

export const nav = [
  { label: "Home", to: "/" },
  { label: "Our Story", to: "/pages/about-us" },
  {
    label: "Shop",
    to: "/collections/shop",
    children: [
      { label: "Speed Tin Standard", sub: "28oz Stainless Steel", to: "/products/standard-stainless-steel", img: "cut-standard" },
      { label: "Speed Tin 2.0", sub: "16oz Stainless Steel", to: "/products/2-0-stainless-steel", img: "cut-2-0" },
      { label: "The Set", sub: "One Standard, one 2.0", to: "/products/the-set-1-standard-speed-tin-1-2-0-speed-tin", img: "cut-set" },
      { label: "Colored Grips", sub: "Red · Fire · Green · Ice · Pink", to: "/products/grip-fire", img: null },
    ],
  },
  { label: "How To", to: "/pages/learn-more" },
  // The live footer links this to /pages/bars-and-restaurants-2, which 404s. The working page is used here.
  { label: "Bars & Restaurants", to: "/pages/bars-and-restaurants" },
  { label: "Affiliate", to: "/pages/affiliate" },
  { label: "Contact", to: "/pages/contact-us" },
];

export const footerNav = [
  { label: "Home", to: "/" },
  { label: "Our Story", to: "/pages/about-us" },
  { label: "Shop", to: "/collections/shop" },
  { label: "How To", to: "/pages/learn-more" },
  { label: "Bars & Restaurants", to: "/pages/bars-and-restaurants" },
  { label: "Wholesale", to: "/pages/wholesale" },
  { label: "Affiliate", to: "/pages/affiliate" },
  { label: "Contact Us", to: "/pages/contact-us" },
];

export const policies = [
  { label: "Shipping policy", href: `${STORE_URL}/policies/shipping-policy` },
  { label: "Returns", href: `${STORE_URL}/policies/refund-policy` },
  { label: "Privacy policy", href: `${STORE_URL}/policies/privacy-policy` },
];

export const social = [
  { label: "Instagram", href: "https://www.instagram.com/speedtins/" },
  { label: "TikTok", href: "https://www.tiktok.com/@speedtin_" },
];

export const accountUrl = `${STORE_URL}/account/login`;
export const affiliateSignupUrl = "https://speedtin.goaffpro.com/create-account";

export const hero = {
  title: "The World’s First One-Handed Cocktail Shaker",
  sub: "Shake, Strain, and Pour Faster",
};

export const difference = {
  banner: "Experience the Speed Tin Difference!",
  title: "The World’s First Single-Handed Cocktail Shaker",
  lead: "Making Cocktails has never been easier!",
  benefits: ["Built-in Strainer", "Easy to Use", "High Quality Stainless Steel"],
};

export const performance = {
  title: "Built for Speed & Performance",
  copy: "Designed to help bartenders work faster and serve more guests while keeping quality high and workflow smooth.",
  points: ["Faster drink preparation", "Happier guests and shorter wait times", "Higher tips and smoother operations"],
  tabs: ["Faster Drink Service", "Higher Bartender Efficiency", "Happier Customers"],
};

export const audiences = [
  {
    key: "home",
    title: "For the Home Bartender",
    copy: "Bartending at home has never been simpler! No need for multiple tools, the Speed Tin has a built-strainer that makes serving you and your guests easy!",
    cta: { label: "Shop Speed Tin", to: "/collections/shop" },
  },
  {
    key: "bartenders",
    title: "For Bartenders",
    copy: "Bring your bartending to the next level! Speed Tin opens the door to new techniques and faster service. Never look for a strainer again!",
    cta: { label: "Shop Speed Tin", to: "/collections/shop" },
  },
  {
    key: "bars",
    title: "For Bars and Restaurants",
    copy: "Quicker drink prep leads to higher sales and smoother operations. Speedtin lightens the load for bartenders, keeps customers satisfied, and reduces training time and costs for new staff.",
    cta: { label: "Learn More", to: "/pages/bars-and-restaurants" },
  },
];

export const wholesaleTeaser = {
  title: "Wholesale",
  copy: "Purchasing Speed Tin wholesale offers significant cost savings and increased efficiency.",
  cta: { label: "Learn More", to: "/pages/wholesale" },
};

export const story = {
  title: "The Story of Speed Tin",
  purposeTitle: "Our Purpose: Giving Back to the Community I Love",
  purpose: [
    "I’ve been a bartender for 15 years, and even when people ask when I’ll “hang up my shakers,” I tell them I still truly love it. It was never my plan to invent something, let alone an invention for the bar but I’m incredibly glad I did. This has turned into a true passion project.",
  ],
  wants: [
    ["Bartenders", "Make more tips, be faster, and make the job easier."],
    ["Bar Owners", "Increase revenue and efficiency."],
    ["Patrons", "Receive their cocktails faster and with fewer delays."],
    ["Home Bartenders", "Simply make it easier to shake and pour a cocktail after a long day."],
  ],
  gratitude: "I’m truly grateful for the opportunity to give back to the community that I’ve been so involved with and that I truly love.",
  evolutionTitle: "The Evolution: From Concept to Cocktail Tool",
  evolutionLead: "What started as just a thought has become something real something I wholeheartedly believe will make a difference. The journey has tested every limit.",
  evolutionIntro: "Over nearly 3 years of late nights and long hours, we documented the evolution of Speed Tin, which involved:",
  evolution: [
    ["Countless Prototypes", "From the initial sketches and “aha!” moment in 2022, the concept evolved through multiple prototypes. We went from early basic concepts (like Concept Prototypes 1 & 2 in 2023) to detailed 3D prints, functional models, and finally, the perfected design."],
    ["Testing and Refinement", "Each iteration (shown in the evolution photos) brought us closer to the final product. We tested materials, functionality, and performance tirelessly to ensure it was a product I could be proud to put in the hands of my peers."],
    ["The Patent Process", "The legal process alone was a marathon, requiring countless rounds of editing and patience to secure both the provisional and non-provisional patent (secured in 2024 and 2025)."],
  ],
  dedicationTitle: "The Dedication: A Three-Year Commitment",
  dedication: [
    "So much time, money, and energy went into prototyping, designing, and manufacturing. Each of which pushed me to my limits. But I refused to quit, because I believed in this vision. I believed in creating something that could truly give back.",
    "After nearly 3 years of pouring everything I had into this dream, I am beyond proud to officially introduce this innovation to the world. We look forward to delivering the Speed Tin and contributing a truly valuable tool to the world that has shaped who I am.",
  ],
  kickstarterLabel: "Watch Our Kickstarter Video",
  // 44 MB film: streamed from the live site's CDN instead of being bundled
  kickstarterSrc: "https://speedtin.com/cdn/shop/videos/c/vp/772352a34ec14e8bb76064c5120f2e86/772352a34ec14e8bb76064c5120f2e86.SD-480p-1.0Mbps-67179634.mp4?v=0",
};

// Reviewer names and wording are exactly as on the homepage. The live badge reads “Verify Buyer”.
export const testimonials = [
  { title: "Game Changer", quote: "I do believe Speed Tin is going to revolutionize the industry for bartenders", name: "Johan “JoJo”", product: "2-0-stainless-steel" },
  { title: null, quote: "Speed Tins are a complete game changer and eliminates looking for a strainer and needing to separate the tins. Much more streamlined experience.", name: "Jaylin Epperly", product: "standard-stainless-steel" },
  { title: null, quote: "Incredible product that has revolutionized the bartending game! Won’t catch me behind the bar without it!", name: "Tom Brauner", product: "the-set-1-standard-speed-tin-1-2-0-speed-tin" },
];

export const closing = {
  headline: "Level up your bartending speed and efficiency with Speedtin",
  newsletterNote: "Follow us on social media",
};

export const howTo = {
  title: "Shake and Serve",
  sub: "With Only One Hand",
  fullTutorial: { id: "XpW9115dckg", title: "Speed Tin Tutorial" },
  quickTitle: "Quick Tutorials",
  quick: [
    { id: "ELNXHUlMtZE", title: "3 Quick Pointers" },
    { id: "f9R-f1Q8_Z4", title: "Basic Usage" },
    { id: "H0ZUNia9I2Y", title: "Separation" },
    { id: "smLrpbmz4S4", title: "Cleaning" },
  ],
  models: [
    { key: "standard", name: "The Speed Tin Standard", copy: "The Speed Tin Standard pairs with a 28oz base tin for multiple martinis and cocktails, and 10+ shots. A must-have for every bartender!", to: "/products/standard-stainless-steel", img: "cut-standard" },
    { key: "two", name: "The Speed Tin 2.0", copy: "With a 16oz base tin, the Speed Tin 2.0 is ideal for 1 to 2 cocktails or up to 6 shots. It is also more ergonomic for those with smaller hands!", to: "/products/2-0-stainless-steel", img: "cut-2-0" },
  ],
  disclaimer: "The Speed Tin is not designed to be used for dry shaking ingredients, and as such doing so may lead to leaking. This is not a defect, simply not the intended use.",
};

// The three-step method, as written on the live product pages
export const method = [
  { n: "01", title: "Build with ice", copy: "Add your ingredients and ice to the base tin, then fit the Speed Tin." },
  { n: "02", title: "Shake", copy: "Keep the pouring mechanism closed while shaking with ice." },
  { n: "03", title: "Strain and pour", copy: "Use the finger grip to open the quick-pour mechanism. Pour through the built-in strainer without separating the tins." },
];

export const bars = {
  title: "Bars and Restaurants",
  lead: "Outfit your bar with Speed Tins and serve faster, more consistently—every shift.",
  blocks: [
    { title: "Easier to Learn. Faster to Use.", copy: "The built-in strainer makes learning to pour cocktails and shots easier than ever, while simultaneously being faster than other shakers.", cta: { label: "Learn More", to: "/pages/learn-more" } },
    { title: "Two Sizes. Endless Scenarios.", copy: "From different drink volume to different hand sizes. We designed 2 versions of the Speed Tin with the many challenges of the industry in mind.", cta: { label: "Shop Speed Tin", to: "/collections/shop" } },
  ],
  trustedTitle: "Trusted by Bartenders & Bar Owners",
  trusted: "Trusted by bartenders everywhere, SpeedTin is changing cocktail service from dive bars to five-star restaurants",
  multi: "Multiple Locations? Contact us for larger quantities!",
};

export const wholesale = {
  title: "Wholesale Solutions",
  lead: "Save money and improve efficiency by purchasing Speed Tin in wholesale quantities.",
  subtitle: "Wholesale pricing for retail partners",
  copy: "Purchasing Speed Tin wholesale offers significant cost savings. Whether you want to distribute at retail, own multiple restaurants, or offer engraving, we are committed to providing a streamlined purchasing experience.",
  perks: [
    "Save more with volume discounts on wholesale purchases",
    "Get priority shipping for your wholesale orders",
    "Unlock Long-Term Savings and Scalability with Speed Tin Wholesale Orders",
    "Enjoy dedicated support for all wholesale partners",
  ],
};

export const affiliate = {
  title: "Join the Speed Tin Affiliation Program",
  lead: "Be part of the revolution that’s redefining bartending.",
  whyTitle: "Why Partner with Speed Tin?",
  why: "Empowering Affiliates with Rewards, Recognition, and Results. At Speed Tin, we believe in supporting our affiliates every step of the way. We are looking to partner with bartenders and creators who can help introduce Speed Tin to the world. As a brand new, revolutionary product, the room for growth is limitless.",
};

export const contact = {
  title: "Contact Us",
  sub: "Get in Touch",
  copy: "Use this form bellow to get in touch with us and we’ll get back to you within 48 hours",
  topics: [
    ["wholesale-solutions", "Wholesale Solutions"],
    ["affiliate-program", "Affiliate Program"],
    ["product-support", "Product Support"],
    ["other", "Other"],
  ],
};

// Hosted video (optimised copies of the live site's own footage)
export const videos = {
  demo: { src: "/media/video/demo.mp4", poster: "/media/video/demo-poster.jpg" },
  social: [
    { src: "/media/video/social-1.mp4", poster: "/media/video/social-1-poster.jpg" },
    { src: "/media/video/social-2.mp4", poster: "/media/video/social-2-poster.jpg" },
    { src: "/media/video/social-3.mp4", poster: "/media/video/social-3-poster.jpg" },
  ],
};
