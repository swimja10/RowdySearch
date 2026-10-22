// Every link from RowdySearch to another website.

// RowdySearch's Chrome Web Store page, as the store's own Share button gives it out.
export const STORE_LINK = "https://chromewebstore.google.com/detail/geiimkdngembhenfhcnbmlfgbclheoek?utm_source=item-share-cb";

// The store page's Reviews tab, where "Write a review" is.
export const STORE_REVIEWS_LINK = "https://chromewebstore.google.com/detail/rowdysearch/geiimkdngembhenfhcnbmlfgbclheoek/reviews";

export function syllabusLink(syllabusCode: string): string {
  return `https://utsa.simplesyllabus.com/en-US/doc/${syllabusCode}`;
}

export function rmpLink(rmpId: number): string {
  return `https://www.ratemyprofessors.com/professor/${rmpId}`;
}
