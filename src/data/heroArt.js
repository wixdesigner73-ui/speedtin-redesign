// Art direction for the inner-page heroes (see PageHero). Positions are % of the art box.
const f = (n) => `/media/fx/${n}.webp`;
const m = (n) => `/media/${n}.webp`;

export const pour = { type: "pour" };

export const shopArt = {
  type: "items",
  items: [
    { src: m("cut-standard"), x: 42, y: 7, w: 34, r: -2, d: 0.025, z: 4 },
    { src: m("cut-2-0"), x: 14, y: 36, w: 26, r: 3, d: 0.05, z: 5 },
    { src: f("ice-1"), x: 77, y: 10, w: 15, r: 12, d: 0.09, z: 6 },
    { src: f("ice-3"), x: 1, y: 4, w: 21, r: -14, d: 0.16, blur: 6, z: 7 },
    { src: f("lime"), x: 71, y: 64, w: 15, r: -12, d: 0.1, z: 6 },
    { src: f("peel"), x: 85, y: 40, w: 8, r: 18, d: 0.07, z: 6 },
    { src: f("drop"), x: 37, y: 5, w: 2.6, d: 0.1, z: 6 },
    { src: f("drop"), x: 80, y: 33, w: 1.8, d: 0.06, z: 6 },
  ],
};

export const barsArt = {
  type: "items",
  items: [
    { src: m("cut-bundle-1"), x: 40, y: 10, w: 36, r: -2, d: 0.025, z: 4 },
    { src: m("cut-bundle-2"), x: 14, y: 40, w: 30, r: 3, d: 0.05, z: 5 },
    { src: f("ice-2"), x: 78, y: 12, w: 14, r: -10, d: 0.09, z: 6 },
    { src: f("lemon"), x: 74, y: 64, w: 14, r: 14, d: 0.1, z: 6 },
    { src: f("ice-3"), x: 0, y: 6, w: 20, r: 10, d: 0.16, blur: 6, z: 7 },
    { src: f("drop"), x: 36, y: 8, w: 2.4, d: 0.1, z: 6 },
  ],
};

export const wholesaleArt = {
  type: "items",
  items: [
    { src: m("cut-set"), x: 36, y: 10, w: 42, r: -1, d: 0.025, z: 4 },
    { src: m("cut-sled"), x: 10, y: 74, w: 24, r: -6, d: 0.06, z: 5 },
    { src: f("ice-1"), x: 80, y: 10, w: 14, r: 14, d: 0.09, z: 6 },
    { src: f("lime"), x: 76, y: 66, w: 14, r: -16, d: 0.1, z: 6 },
    { src: f("peel"), x: 12, y: 18, w: 7, r: -20, d: 0.07, z: 6 },
    { src: f("drop"), x: 34, y: 6, w: 2.4, d: 0.1, z: 6 },
  ],
};

export const contactArt = {
  type: "items",
  items: [
    { src: m("cut-standard"), x: 38, y: 7, w: 34, r: 2, d: 0.025, z: 4 },
    { src: f("lemon"), x: 74, y: 16, w: 15, r: -14, d: 0.1, z: 6 },
    { src: f("ice-2"), x: 12, y: 52, w: 15, r: 12, d: 0.09, z: 6 },
    { src: f("ice-3"), x: 74, y: 62, w: 20, r: -10, d: 0.16, blur: 6, z: 7 },
    { src: f("peel"), x: 30, y: 74, w: 7, r: 20, d: 0.07, z: 6 },
    { src: f("drop"), x: 66, y: 8, w: 2.2, d: 0.1, z: 6 },
  ],
};
