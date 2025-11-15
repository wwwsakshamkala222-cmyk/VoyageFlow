(function () {

  function goTo(url) {
    window.location.href = url;
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("voyage_user") || "{}");
    } catch {
      return {};
    }
  }

  function setUser(obj) {
    localStorage.setItem("voyage_user", JSON.stringify(obj));
  }

  window.goTo = goTo;
  window.VUser = { get: getUser, set: setUser };

  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });

})();
