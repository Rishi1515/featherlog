// Sample data for the concept phase.
// Colors stand in for real photos until storage + real images are wired up.
// Each species has a set of photos; one is pinned (shown on the gallery home).

export const initialBirds = [
  {
    id: "indian-roller",
    common: "Indian Roller",
    sci: "Coracias benghalensis",
    match: 91,
    location: "Ameenpur Lake, Hyderabad",
    coords: "17.51°N, 78.32°E",
    photos: [
      { id: "ir1", tone: "linear-gradient(155deg,#C3D2AE,#7B9A5B)", date: "12 Jan 2026", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/1600 · f/6.3 · ISO 450", pinned: true, fav: true },
      { id: "ir2", tone: "linear-gradient(155deg,#B9CC9E,#6E8C52)", date: "08 Jan 2026", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/2000 · f/6.3 · ISO 400", pinned: false, fav: true },
      { id: "ir3", tone: "linear-gradient(155deg,#CBD7B4,#88A468)", date: "22 Dec 2025", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/1250 · f/7.1 · ISO 500", pinned: false, fav: false },
      { id: "ir4", tone: "linear-gradient(155deg,#AFC49A,#5F7D48)", date: "18 Dec 2025", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/1600 · f/6.3 · ISO 640", pinned: false, fav: false },
    ],
  },
  {
    id: "white-throated-kingfisher",
    common: "White-throated Kingfisher",
    sci: "Halcyon smyrnensis",
    match: 94,
    location: "Ameenpur Lake, Hyderabad",
    coords: "17.51°N, 78.32°E",
    photos: [
      { id: "wk1", tone: "linear-gradient(155deg,#AFC8C0,#5E8478)", date: "12 Jan 2026", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/1600 · f/6.3 · ISO 450", pinned: true, fav: false },
      { id: "wk2", tone: "linear-gradient(155deg,#9FBDB3,#4E7468)", date: "02 Jan 2026", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/1250 · f/6.3 · ISO 560", pinned: false, fav: true },
      { id: "wk3", tone: "linear-gradient(155deg,#BFD3CB,#6E9488)", date: "28 Dec 2025", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/2000 · f/5.6 · ISO 400", pinned: false, fav: false },
    ],
  },
  {
    id: "hoopoe",
    common: "Hoopoe",
    sci: "Upupa epops",
    match: 88,
    location: "Shamirpet Lake, Hyderabad",
    coords: "17.62°N, 78.55°E",
    photos: [
      { id: "hp1", tone: "linear-gradient(155deg,#E0BFA0,#C98E6A)", date: "05 Jan 2026", cam: "Canon R5", lens: "600mm f/4", exp: "1/2000 · f/5.6 · ISO 320", pinned: true, fav: true },
      { id: "hp2", tone: "linear-gradient(155deg,#D8B392,#BE805C)", date: "30 Dec 2025", cam: "Canon R5", lens: "600mm f/4", exp: "1/1600 · f/5.6 · ISO 400", pinned: false, fav: false },
    ],
  },
  {
    id: "green-bee-eater",
    common: "Green Bee-eater",
    sci: "Merops orientalis",
    match: 96,
    location: "Ameenpur Lake, Hyderabad",
    coords: "17.51°N, 78.32°E",
    photos: [
      { id: "gb1", tone: "linear-gradient(155deg,#B9CC9E,#879F68)", date: "10 Jan 2026", cam: "Sony A1", lens: "200-600mm", exp: "1/2500 · f/6.3 · ISO 500", pinned: true, fav: false },
      { id: "gb2", tone: "linear-gradient(155deg,#C6D6AC,#94AC74)", date: "04 Jan 2026", cam: "Sony A1", lens: "200-600mm", exp: "1/2000 · f/6.3 · ISO 640", pinned: false, fav: true },
      { id: "gb3", tone: "linear-gradient(155deg,#AEC291,#7C945D)", date: "26 Dec 2025", cam: "Sony A1", lens: "200-600mm", exp: "1/3200 · f/6.3 · ISO 400", pinned: false, fav: false },
    ],
  },
  {
    id: "painted-stork",
    common: "Painted Stork",
    sci: "Mycteria leucocephala",
    match: 90,
    location: "Shamirpet Lake, Hyderabad",
    coords: "17.62°N, 78.55°E",
    photos: [
      { id: "ps1", tone: "linear-gradient(155deg,#D2C4A4,#A88F6C)", date: "07 Jan 2026", cam: "Nikon Z9", lens: "800mm f/6.3", exp: "1/1600 · f/8 · ISO 450", pinned: true, fav: false },
      { id: "ps2", tone: "linear-gradient(155deg,#C8B896,#9C8460)", date: "01 Jan 2026", cam: "Nikon Z9", lens: "800mm f/6.3", exp: "1/1250 · f/8 · ISO 560", pinned: false, fav: false },
    ],
  },
  {
    id: "brown-fish-owl",
    common: "Brown Fish Owl",
    sci: "Ketupa zeylonensis",
    match: 85,
    location: "Ananthagiri Hills, Telangana",
    coords: "17.36°N, 78.02°E",
    photos: [
      { id: "bo1", tone: "linear-gradient(155deg,#D8C6A6,#B49873)", date: "03 Jan 2026", cam: "Canon R5", lens: "600mm f/4", exp: "1/500 · f/4 · ISO 3200", pinned: true, fav: true },
      { id: "bo2", tone: "linear-gradient(155deg,#CEBB99,#A88C67)", date: "27 Dec 2025", cam: "Canon R5", lens: "600mm f/4", exp: "1/400 · f/4 · ISO 4000", pinned: false, fav: false },
    ],
  },
];

// Photos the AI could not confidently identify — the "no birds detected" queue.
export const initialUnidentified = [
  { id: "un1", tone: "linear-gradient(155deg,#CFCcC0,#9A9788)", date: "12 Jan 2026", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/1600 · f/6.3 · ISO 500", note: "Blurry — bird in flight" },
  { id: "un2", tone: "linear-gradient(155deg,#C4C8CC,#8E9296)", date: "09 Jan 2026", cam: "Nikon Z9", lens: "500mm f/5.6", exp: "1/2000 · f/6.3 · ISO 400", note: "Distant silhouette" },
  { id: "un3", tone: "linear-gradient(155deg,#D0Cabb,#9C9683)", date: "05 Jan 2026", cam: "Canon R5", lens: "600mm f/4", exp: "1/1250 · f/5.6 · ISO 640", note: "Partially hidden in foliage" },
  { id: "un4", tone: "linear-gradient(155deg,#C8CcC6,#92968E)", date: "31 Dec 2025", cam: "Sony A1", lens: "200-600mm", exp: "1/1600 · f/6.3 · ISO 500", note: "Backlit" },
];
