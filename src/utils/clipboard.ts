// Copies text to the clipboard and says whether it worked. Some websites don't let the sidebar use
// the clipboard, so this falls back to the browser's older copy command, which works on most of them.
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    document.body.append(scratch);
    scratch.select();
    const copied = document.execCommand("copy");
    scratch.remove();
    return copied;
  }
}
