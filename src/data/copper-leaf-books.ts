import type { ImageMetadata } from "astro";

/**
 * Copper Leaf Editions — featured books.
 *
 * Owner-supplied facts live here and nowhere else; replacing them never
 * touches markup. Images are the owner's `CL-00N-Cover.png` and
 * `CL-00N-Spread{1,2}.png` exports, placed in
 * `src/assets/images/copper-leaf/`.
 *
 * An entry renders in placeholder mode when `placeholder` is true, it has no
 * title, or any of its image files is missing.
 */
interface BookImage {
  /** File name under src/assets/images/copper-leaf/ */
  file: string;
  /** Describes what is visible; never how the art was made. */
  alt: string;
}

export interface CopperLeafBook {
  slug: string;
  /** Exact printed title. */
  title: string;
  /** Description paragraphs, in order. */
  description: string[];
  /** Small detail line shown beside the cover. */
  details: string;
  cover: BookImage;
  spreads: [BookImage, BookImage];
  /** Plain https://www.amazon.com/... link — no affiliate or tracking parameters. */
  amazonUrl: string | null;
  placeholder?: boolean;
}

export interface ResolvedImage {
  src: ImageMetadata;
  alt: string;
}

export interface ResolvedCopperLeafBook extends CopperLeafBook {
  coverImage: ResolvedImage | null;
  spreadImages: ResolvedImage[];
  isPlaceholder: boolean;
}

const DETAILS = "Coloring book for adults · 30 illustrations · 8.5 × 11 inches";

export const books: CopperLeafBook[] = [
  {
    slug: "cl-001",
    title: "Great National Parks of America",
    description: [
      "Explore sweeping landscapes, remarkable wildlife, and striking geological formations inspired by America’s national parks. This collection pairs 30 coloring illustrations with short editorial notes about the places they depict, adding a little discovery to every stop along the journey.",
      "From quiet woodland scenes to dramatic vistas, bring your own colors to the beauty of the natural world.",
    ],
    details: DETAILS,
    cover: {
      file: "CL-001-Cover.png",
      alt: "Cover of Great National Parks of America, subtitled A coloring art expedition, showing a canyon landscape that moves from line drawing to full color.",
    },
    spreads: [
      {
        file: "CL-001-Spread1.png",
        alt: "Book spread. On the left, a page of notes headed “Granite Cliffs and Waterfalls of Yosemite Valley”. On the right, a black-and-white line drawing of granite cliffs, a waterfall, conifer forest and a river.",
      },
      {
        file: "CL-001-Spread2.png",
        alt: "Book spread. On the left, a page of notes headed “Sandstone Fins and Windows at Dusk in Arches”. On the right, a black-and-white line drawing of sandstone fins and a natural arch framing a desert valley at sunset.",
      },
    ],
    amazonUrl: null,
  },
  {
    slug: "cl-002",
    title: "The Haunted Atlas",
    description: [
      "Travel through a world of haunted houses, historic ruins, and places where stories linger. Thirty atmospheric coloring illustrations invite you to explore distinctive architecture and evocative settings, accompanied by short readings about their history and the legends associated with them.",
      "Follow your curiosity through weathered stone, shadowed windows, and the spaces between history and folklore.",
    ],
    details: DETAILS,
    cover: {
      file: "CL-002-Cover.png",
      alt: "Cover of The Haunted Atlas, subtitled Legendary Houses, Castles & Ruins to Color, showing a three-storey townhouse that moves from line drawing to full color.",
    },
    spreads: [
      {
        file: "CL-002-Spread1.png",
        alt: "Book spread. On the left, a page of notes headed “Sorrel-Weed House, Savannah, Georgia”. On the right, a black-and-white line drawing of a townhouse with balconies, front steps, an iron fence, a street lamp and an oak tree.",
      },
      {
        file: "CL-002-Spread2.png",
        alt: "Book spread. On the left, a page of notes headed “Berry Pomeroy Castle Ruins, Devon, England”. On the right, a black-and-white line drawing of a ruined round tower among woodland, with a stone bridge and a manor house beyond.",
      },
    ],
    amazonUrl: null,
  },
  {
    slug: "cl-006",
    title: "Halloween & Spirit Traditions Around the World",
    description: [
      "Explore Halloween and related traditions of remembrance, folklore, and the spirit world through 30 coloring illustrations. Accompanying editorial notes introduce the customs and cultural settings behind each scene, revealing different ways communities celebrate, remember, and tell stories about the unknown.",
      "A coloring journey through seasonal celebrations and enduring traditions, with something new to discover along the way.",
    ],
    details: DETAILS,
    cover: {
      file: "CL-006-Cover.png",
      alt: "Cover of Halloween & Spirit Traditions Around the World, subtitled A Spooky Coloring Journey, showing lanterns and pumpkins that move from line drawing to full color.",
    },
    spreads: [
      {
        file: "CL-006-Spread1.png",
        alt: "Book spread. On the left, a page of notes headed “Mexican Ofrenda with Marigolds and Sugar Skulls”. On the right, a black-and-white line drawing of a tiered altar with marigolds, candles, framed portraits, a sugar skull and paper banners.",
      },
      {
        file: "CL-006-Spread2.png",
        alt: "Book spread. On the left, a page of notes headed “Galway Halloween Street Parade, Galway, Ireland”. On the right, a black-and-white line drawing of giant leaf-covered figures, a drummer, a piper and masked lantern bearers in a street at night.",
      },
    ],
    amazonUrl: null,
  },
];

const images = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/copper-leaf/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

function resolveImage({ file, alt }: BookImage): ResolvedImage | null {
  const src = images[`../assets/images/copper-leaf/${file}`]?.default;
  return src ? { src, alt } : null;
}

export function resolveBooks(): ResolvedCopperLeafBook[] {
  const resolved = books.map((book) => {
    const coverImage = resolveImage(book.cover);
    const spreadImages = book.spreads.map(resolveImage).filter((s): s is ResolvedImage => s !== null);
    const isPlaceholder =
      Boolean(book.placeholder) || !book.title || !coverImage || spreadImages.length !== book.spreads.length;
    return { ...book, coverImage, spreadImages, isPlaceholder };
  });

  const pending = resolved.filter((b) => b.isPlaceholder).map((b) => b.slug);
  if (pending.length > 0) {
    console.warn(
      `[copper-leaf] ${pending.length} book(s) still in placeholder mode: ${pending.join(", ")} — fill in src/data/copper-leaf-books.ts before merging.`,
    );
  }
  return resolved;
}
