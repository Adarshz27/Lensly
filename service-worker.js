self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("lensly").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js"
      ])
    )
  );
});
