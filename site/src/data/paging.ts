// Long lists (every professor, every subject, a subject's courses) show this many at a time.
// See components/Pager.astro for how.
export const PAGE_SIZE = 50;

// True for an item that isn't on the first page. Those get the "later" class, which hides them
// until the reader pages to them.
export const isLater = (index: number) => index >= PAGE_SIZE;
