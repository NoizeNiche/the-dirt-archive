const form = document.getElementById("missingSearch");
const input = document.getElementById("missingSearchInput");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input?.value.trim() ?? "";
  const url = new URL("./index.html", window.location.href);
  if (query) url.searchParams.set("q", query);
  window.location.href = url.href;
});
