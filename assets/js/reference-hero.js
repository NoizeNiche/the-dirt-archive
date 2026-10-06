(function () {
  const poster = document.getElementById("referenceHeroPoster");
  const hero = document.querySelector(".archiveHero");
  if (!poster || !hero) return;

  const ready = () => {
    hero.classList.add("referenceHeroLoaded");
    document.body.classList.add("referenceHeroLoaded");
  };
  const failed = () => {
    hero.classList.remove("referenceHeroLoaded");
    document.body.classList.remove("referenceHeroLoaded");
  };

  if (poster.complete && poster.naturalWidth > 0) ready();
  poster.addEventListener("load", ready, { once: true });
  poster.addEventListener("error", failed, { once: true });
})();