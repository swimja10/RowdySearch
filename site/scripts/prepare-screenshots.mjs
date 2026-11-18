// Turns the registration-page screenshots into the images the Extension page shows.
//
//   node scripts/prepare-screenshots.mjs "/mnt/c/Users/you/Downloads/REGISTRATION PAGES"
//
// It covers the signed-in student's name in Banner's header, trims each set of three to the same
// height so the page doesn't jump when you flip between them, and saves them as WebP in
// public/extension/. The source folder also holds saved copies of the registration pages, which
// have personal details in them. This script never reads those: only the six .jpg files below.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceFolder = process.argv[2];
if (!sourceFolder) {
  console.error('Say where the screenshots are:  node scripts/prepare-screenshots.mjs "<folder>"');
  process.exit(1);
}

const outputFolder = path.resolve(import.meta.dirname, "../public/extension");

// Banner's header shows who is signed in at its right end. This much of it gets painted over.
const NAME_WIDTH = 165;
const HEADER_HEIGHT = 48;

const SETS = [
  {
    coversName: false,
    shots: [
      ["Schedule Planner Without RowdySearch.jpg", "planner-without.webp"],
      ["Schedule planner with RowdySearch. .jpg", "planner-with.webp"],
      ["Schedule planner with RowdySearch tab open .jpg", "planner-open.webp"],
    ],
  },
  {
    coversName: true,
    shots: [
      ["Registration Page without RowdySearch.jpg", "banner-without.webp"],
      ["Registration Page with RowdySearch.jpg", "banner-with.webp"],
      // The open sidebar already covers the name in this one.
      ["Registration Page with RowdySearch tab open.jpg", "banner-open.webp", { keepsHeader: true }],
    ],
  },
];

await mkdir(outputFolder, { recursive: true });

for (const set of SETS) {
  const sizes = await Promise.all(set.shots.map(([file]) => sharp(path.join(sourceFolder, file)).metadata()));
  const width = Math.min(...sizes.map((size) => size.width));
  const height = Math.min(...sizes.map((size) => size.height));

  for (const [file, output, options = {}] of set.shots) {
    let image = sharp(path.join(sourceFolder, file)).extract({ left: 0, top: 0, width, height });

    if (set.coversName && !options.keepsHeader) {
      // Paint over the name with the header's own color, read from a blank part of the header.
      const { data } = await sharp(path.join(sourceFolder, file))
        .extract({ left: Math.round(width / 2), top: Math.round(HEADER_HEIGHT / 2), width: 1, height: 1 })
        .raw()
        .toBuffer({ resolveWithObject: true });
      const cover = await sharp({
        create: { width: NAME_WIDTH, height: HEADER_HEIGHT, channels: 3, background: { r: data[0], g: data[1], b: data[2] } },
      }).png().toBuffer();
      image = image.composite([{ input: cover, left: width - NAME_WIDTH, top: 0 }]);
    }

    await image.webp({ quality: 80 }).toFile(path.join(outputFolder, output));
    console.log(`${output}  ${width}×${height}`);
  }
}
