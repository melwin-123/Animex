export const MOCK_ANIME = [
  {
    id: 1,
    title: "Attack on Titan",
    titleJP: "進撃の巨人",
    cover: "https://wallpapercave.com/wp/wp9143364.jpg",
    banner: "https://wallpapercave.com/wp/wp9143364.jpg",
    genre: ["Action", "Drama", "Fantasy"],
    rating: 9.1, episodes: 87, status: "Completed", year: 2013, studio: "MAPPA",
    description: "In a world where humanity lives within enormous walled cities to protect themselves from Titans—gigantic humanoid creatures—a young boy named Eren Yeager vows to exterminate the Titans after they destroy his hometown and kill his mother.",
    trending: true, new: false, type: "TV",
    seasons: [
      { id: 1, name: "Season 1", episodes: 25 },
      { id: 2, name: "Season 2", episodes: 12 },
      { id: 3, name: "Season 3", episodes: 22 },
      { id: 4, name: "The Final Season", episodes: 28 }
    ]
  },
  {
    id: 2,
    title: "Demon Slayer",
    titleJP: "鬼滅の刃",
    cover: "https://assetsio.reedpopcdn.com/demon-slayer-season-3.jpg?width=1920&height=1920&fit=bounds&quality=80&format=jpg&auto=webp",
    banner: "https://assetsio.reedpopcdn.com/demon-slayer-season-3.jpg?width=1920&height=1920&fit=bounds&quality=80&format=jpg&auto=webp",
    genre: ["Action", "Adventure", "Supernatural"],
    rating: 8.9, episodes: 44, status: "Ongoing", year: 2019, studio: "ufotable",
    description: "Tanjiro Kamado's peaceful life is shattered when a demon slaughters his family. His younger sister Nezuko survives but has been transformed into a demon. Tanjiro sets out to find a cure and joins the Demon Slayer Corps.",
    trending: true, new: true, type: "TV",
    seasons: [
      { id: 1, name: "Season 1", episodes: 26 },
      { id: 2, name: "Mugen Train Arc", episodes: 7 },
      { id: 3, name: "Entertainment District Arc", episodes: 11 }
    ]
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    titleJP: "呪術廻戦",
    cover: "https://img1.ak.crunchyroll.com/i/spire4/6b4c9dcac0bcdf27fe1d21e75769f8861661079175_main.jpg",
    banner: "https://sm.ign.com/t/ign_pt/news/j/jujutsu-ka/jujutsu-kaisen-cursed-clash-announced-at-the-bandai-namco-su_kwd5.1200.jpg",
    genre: ["Action", "School", "Supernatural"],
    rating: 8.8, episodes: 47, status: "Ongoing", year: 2020, studio: "MAPPA",
    description: "Yuji Itadori, a high schooler with extraordinary physical abilities, swallows a cursed object to save others and becomes host to a powerful demon. He joins the Tokyo Metropolitan Curse Technical College to learn sorcery.",
    trending: true, new: true, type: "TV",
    seasons: [
      { id: 1, name: "Season 1", episodes: 24 },
      { id: 2, name: "Season 2", episodes: 23 }
    ]
  },
  {
    id: 4,
    title: "One Piece",
    titleJP: "ワンピース",
    cover: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/09/one-piece-9.jpg",
    banner: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2021/11/One-Piece-Character-Guide.jpg",
    genre: ["Adventure", "Comedy", "Fantasy"],
    rating: 9.0, episodes: 1100, status: "Ongoing", year: 1999, studio: "Toei Animation",
    description: "Monkey D. Luffy sets sail with his pirate crew to find the legendary treasure One Piece and become King of the Pirates. An epic adventure across the seas full of unique characters and incredible battles.",
    trending: false, new: false, type: "TV",
    seasons: [{ id: 1, name: "Main Series", episodes: 1100 }]
  },
  {
    id: 5,
    title: "Chainsaw Man",
    titleJP: "チェンソーマン",
    cover: "https://m.media-amazon.com/images/I/71TibT8WrLL.jpg",
    banner: "https://prod.assets.earlygamecdn.com/images/Chainsaw-Man-Header.jpg?transform=banner2x_webp",
    genre: ["Action", "Horror", "Supernatural"],
    rating: 8.7, episodes: 12, status: "Ongoing", year: 2022, studio: "MAPPA",
    description: "Denji is a young man merged with his devil-dog Pochita, becoming Chainsaw Man. He joins Public Safety Devil Hunters to fight demons while yearning for a simple, peaceful life.",
    trending: true, new: true, type: "TV",
    seasons: [{ id: 1, name: "Season 1", episodes: 12 }]
  },
  {
    id: 6,
    title: "Fullmetal Alchemist: Brotherhood",
    titleJP: "鋼の錬金術師",
    cover: "https://tse1.explicit.bing.net/th/id/OIP.6i2buMJXdwcy27vJHZmUeQHaKe?rs=1&pid=ImgDetMain&o=7&rm=3",
    banner: "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/ac0052958fa876ed2ef926920a88ec75.jpg",
    genre: ["Action", "Adventure", "Drama", "Fantasy"],
    rating: 9.2, episodes: 64, status: "Completed", year: 2009, studio: "Bones",
    description: "Two brothers seek the Philosopher's Stone to restore their bodies after a failed alchemical ritual. A masterpiece of storytelling and complex world-building that shaped modern anime.",
    trending: false, new: false, type: "TV",
    seasons: [{ id: 1, name: "Complete Series", episodes: 64 }]
  },
  {
    id: 7,
    title: "Spy x Family",
    titleJP: "SPY×FAMILY",
    cover: "https://tse4.mm.bing.net/th/id/OIP.oIlfhCTH0nWcGsW857rLVQHaPa?w=1080&h=2248&rs=1&pid=ImgDetMain&o=7&rm=3",
    banner: "https://tse1.mm.bing.net/th/id/OIP.UMWOe1qsomdUH6y4eeM7NwHaDt?rs=1&pid=ImgDetMain&o=7&rm=3",
    genre: ["Comedy", "Action", "Slice of Life"],
    rating: 8.5, episodes: 37, status: "Ongoing", year: 2022, studio: "Wit Studio",
    description: "A spy must create a fake family to complete his mission. He adopts a telepath and marries an assassin—and none of them know each other's true identity. Comedy and heartwarming moments ensue.",
    trending: true, new: false, type: "TV",
    seasons: [
      { id: 1, name: "Season 1", episodes: 25 },
      { id: 2, name: "Season 2", episodes: 12 }
    ]
  },
  {
    id: 8,
    title: "Hunter x Hunter",
    titleJP: "ハンター×ハンター",
    cover: "https://tse4.mm.bing.net/th/id/OIP.vlxMvf3K43cCcdJxrE8f5AHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    banner: "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/07/gon-killua-kurapika-leorio-dark-continent.jpeg",
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 9.0, episodes: 148, status: "Completed", year: 2011, studio: "Madhouse",
    description: "Gon Freecss follows in his legendary Hunter father's footsteps. He meets Killua, Kurapika, and Leorio as they navigate a world of hunters, criminals, and supernatural dangers.",
    trending: false, new: false, type: "TV",
    seasons: [{ id: 1, name: "Complete Series", episodes: 148 }]
  },
  {
    id: 9,
    title: "Vinland Saga",
    titleJP: "ヴィンランド・サガ",
    cover: "https://cdn.hmv.com/r/w-640/hmv/files/96/96a11dfd-f2a4-4ded-888b-b71fc5555026.jpg",
    banner: "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/04/vinland-saga-season-2-visual.jpg",
    genre: ["Action", "Adventure", "Historical"],
    rating: 8.8, episodes: 48, status: "Completed", year: 2019, studio: "Wit Studio",
    description: "Set in the Viking Age, young warrior Thorfinn seeks revenge in a world of war and brutality. An epic tale of revenge, redemption, and the search for a true warrior's paradise.",
    trending: false, new: false, type: "TV",
    seasons: [
      { id: 1, name: "Season 1", episodes: 24 },
      { id: 2, name: "Season 2", episodes: 24 }
    ]
  },
  {
    id: 10,
    title: "Frieren: Beyond Journey's End",
    titleJP: "葬送のフリーレン",
    cover: "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/frieren-beyond-journeys-end-tv-poster.jpg",
    banner: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/08/frieren-beyond-journey-s-end.jpg",
    genre: ["Adventure", "Drama", "Fantasy"],
    rating: 9.0, episodes: 28, status: "Completed", year: 2023, studio: "Madhouse",
    description: "After the Demon King is defeated, elven mage Frieren begins a new journey, reflecting on relationships with her mortal companions and discovering the profound meaning of human connection.",
    trending: true, new: true, type: "TV",
    seasons: [{ id: 1, name: "Season 1", episodes: 28 }]
  },
  {
    id: 11,
    title: "Bleach: TYBW",
    titleJP: "BLEACH 千年血戦篇",
    cover: "https://upload.wikimedia.org/wikipedia/en/a/a2/Bleach_Thousand-Year_Blood_War.png",
    banner: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/09/Bleach-Thousand-Year-Blood-War-Feature.jpg",
    genre: ["Action", "Adventure", "Supernatural"],
    rating: 9.1, episodes: 52, status: "Ongoing", year: 2022, studio: "Pierrot",
    description: "The final arc of Bleach. Soul Society is invaded by the Wandenreich, a powerful army of Quincy, threatening to destroy everything Ichigo Kurosaki has sworn to protect.",
    trending: true, new: true, type: "TV",
    seasons: [{ id: 1, name: "Thousand-Year Blood War", episodes: 52 }]
  },
  {
    id: 12,
    title: "Mushoku Tensei",
    titleJP: "無職転生",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620425222i/57974989.jpg",
    banner: "https://tse1.mm.bing.net/th/id/OIP._uWMHp0kgC9mJCvoW_nWZgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    genre: ["Adventure", "Drama", "Fantasy"],
    rating: 8.4, episodes: 34, status: "Ongoing", year: 2021, studio: "Studio Bind",
    description: "A 34-year-old man reincarnated in a fantasy world as Rudeus Greyrat with his memories intact. Determined not to repeat past mistakes, he masters magic and builds meaningful relationships.",
    trending: false, new: false, type: "TV",
    seasons: [
      { id: 1, name: "Season 1", episodes: 23 },
      { id: 2, name: "Season 2", episodes: 12 }
    ]
  }
];

export const MOCK_ACCOUNTS = [
  {
    id: 1, username: "MelwinDaniel", email: "melwin@animex.com", password: "melwin123",
    avatar: "https://i.pravatar.cc/150?img=12", role: "admin", joinDate: "2023-01-15", plan: "Premium",
    bio: "Anime is life. 🔥"
  },
  {
    id: 2, username: "SakuraDream", email: "sakura@animex.com", password: "sakura123",
    avatar: "https://i.pravatar.cc/150?img=25", role: "user", joinDate: "2023-06-20", plan: "Free",
    bio: "Slice of life enthusiast 🌸"
  },
  {
    id: 3, username: "NarutoFan99", email: "naruto@animex.com", password: "naruto123",
    avatar: "https://i.pravatar.cc/150?img=33", role: "user", joinDate: "2024-01-01", plan: "Premium",
    bio: "Believe it! 🍥"
  }
];

export const GENRES = ["Action","Adventure","Comedy","Drama","Fantasy","Horror","Romance","Sci-Fi","Slice of Life","Supernatural","Sports","Historical"];

export const generateEpisodes = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Episode ${i + 1}: ${["The Beginning", "Awakening", "Dark Path", "New Power", "Final Stand", "Truth Revealed", "Battle Cry", "Hope Returns", "Sacrifice", "Destiny"][i % 10]}`,
    duration: `${Math.floor(Math.random() * 5) + 22}m`,
    watched: false,
    thumbnail: `https://images.unsplash.com/photo-${1578632767115 + i * 1000}?w=320&h=180&fit=crop`
  }));
