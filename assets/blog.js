(function () {
  document.addEventListener("DOMContentLoaded", () => {

    const destinations = [
      { id: 1, name: "Paris", country: "France", category: "europe", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", description: "Romantic boulevards and museums." },
      { id: 2, name: "Tokyo", country: "Japan", category: "asia", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200", description: "Tradition meets technology." },
      { id: 3, name: "Rome", country: "Italy", category: "europe", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200", description: "Historic landmarks." },
      { id: 4, name: "Bali", country: "Indonesia", category: "asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200", description: "Beaches and culture." },
      { id: 5, name: "Dubai", country: "UAE", category: "middle-east", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200", description: "Futuristic skyline." },
      { id: 6, name: "New York", country: "USA", category: "americas", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200", description: "Endless attractions." }
    ];

    const grid = document.getElementById("destinationsGrid");
    const search = document.getElementById("searchInput");
    const modal = document.getElementById("destModal");
    const modalImg = document.getElementById("destImage");
    const modalName = document.getElementById("destName");
    const modalDesc = document.getElementById("destDesc");
    const favBtn = document.getElementById("favToggle");
    const planBtn = document.getElementById("planBtn");

    const profileName = document.getElementById("profileName");
    profileName.textContent = VUser.get().name || "Profile";

    let favs = JSON.parse(localStorage.getItem("voyage_favs") || "[]");

    grid.innerHTML = `
      <div class="shimmer-card"></div>
      <div class="shimmer-card"></div>
      <div class="shimmer-card"></div>
      <div class="shimmer-card"></div>
    `;

    setTimeout(() => render(destinations), 400);

    function render(list) {
      grid.innerHTML = list.map(d => `
        <div class="card-box" data-id="${d.id}">
          <img src="${d.image}">
          <div class="card-body">
            <h3>${d.name} · <span class="muted">${d.country}</span></h3>
            <p class="muted">${d.description}</p>
          </div>
        </div>
      `).join("");
    }

    grid.onclick = e => {
      const card = e.target.closest(".card-box");
      if (!card) return;
      open(parseInt(card.dataset.id));
    };

    function open(id) {
      const d = destinations.find(x => x.id === id);
      modalImg.src = d.image;
      modalName.textContent = d.name + " · " + d.country;
      modalDesc.textContent = d.description;

      favBtn.textContent = favs.includes(id) ? "Unfavorite" : "Favorite";
      favBtn.onclick = () => toggleFav(id);

      planBtn.onclick = () => {
        localStorage.setItem("voyage_selected_destination", id);
        goTo("calculator.html");
      };

      modal.classList.remove("hidden");
    }

    function toggleFav(id) {
      if (favs.includes(id)) favs = favs.filter(x => x !== id);
      else favs.push(id);

      localStorage.setItem("voyage_favs", JSON.stringify(favs));
      favBtn.textContent = favs.includes(id) ? "Unfavorite" : "Favorite";
    }

    document.getElementById("modalCloseBtn").onclick = () => modal.classList.add("hidden");
    modal.onclick = e => { if (e.target === modal) modal.classList.add("hidden") };

    search.oninput = () => {
      const q = search.value.toLowerCase();
      if (!q) return render(destinations);
      render(destinations.filter(d => (d.name + d.country + d.description).toLowerCase().includes(q)));
    };

    document.querySelectorAll(".chip").forEach(c =>
      c.onclick = () => {
        document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
        c.classList.add("active");
        const cat = c.dataset.cat;
        if (cat === "all") render(destinations);
        else render(destinations.filter(x => x.category === cat));
      }
    );

  });
})();
