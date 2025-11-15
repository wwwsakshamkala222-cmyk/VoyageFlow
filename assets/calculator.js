(function () {
  document.addEventListener("DOMContentLoaded", () => {

    const options = [
      { id:"economy", name:"Economy Flight", price:450, category:"travel" },
      { id:"business", name:"Business Class", price:1200, category:"travel" },
      { id:"hotel3", name:"3-Star Hotel", price:80, category:"accommodation", perNight:true },
      { id:"hotel5", name:"5-Star Resort", price:250, category:"accommodation", perNight:true },
      { id:"breakfast", name:"Breakfast Included", price:25, category:"food", perNight:true },
      { id:"tour", name:"City Sightseeing", price:60, category:"activity" },
      { id:"adventure", name:"Adventure Package", price:150, category:"activity" }
    ];

    const promoCodes = { TRAVEL20:20, SUMMER15:15, VOYAGE10:10 };

    const grid = document.getElementById("optionsGrid");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    const discountRow = document.getElementById("discountRow");
    const discountAmt = document.getElementById("discountAmt");
    const promoInput = document.getElementById("promoInput");

    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const confirmBtn = document.getElementById("confirmBtn");

    const review = document.getElementById("reviewList");

    const dot1 = document.getElementById("dot1");
    const dot2 = document.getElementById("dot2");
    const dot3 = document.getElementById("dot3");

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    const modal = document.getElementById("confirmModal");
    const modalSummary = document.getElementById("modalSummary");

    const travelersEl = document.getElementById("travelerCount");
    const minus = document.getElementById("travMinus");
    const plus = document.getElementById("travPlus");

    document.getElementById("profileNameCalc").textContent = VUser.get().name || "Profile";

    let selected = [];
    let discount = 0;
    let travelers = 1;
    let step = 1;

    function renderOpts() {
      grid.innerHTML = options.map(o => `
        <div class="option-card ${selected.includes(o.id) ? "selected":""}" data-id="${o.id}">
          <h3>${o.name}</h3>
          <div class="muted">${o.category} ${o.perNight ? "/night":""}</div>
          <div style="margin-top:8px;font-weight:700">$${o.price}${o.perNight?"/night":""}</div>
        </div>
      `).join("");
    }

    function nights() {
      if (!start.value || !end.value) return 0;
      const s = new Date(start.value);
      const e = new Date(end.value);
      const diff = (e - s) / 86400000;
      return diff > 0 ? Math.ceil(diff) : 0;
    }

    function calc() {
      const n = nights();
      let subtotal = 0;
      selected.forEach(id => {
        const o = options.find(x => x.id === id);
        if (!o) return;
        subtotal += o.perNight ? o.price * n : o.price;
      });
      subtotal *= travelers;

      const disc = subtotal * (discount / 100);
      const total = subtotal - disc;

      subtotalEl.textContent = "$" + subtotal.toFixed(2);
      totalEl.textContent = "$" + total.toFixed(2);

      if (discount > 0) {
        discountRow.classList.remove("hidden");
        discountAmt.textContent = "-$" + disc.toFixed(2);
      } else {
        discountRow.classList.add("hidden");
      }

      refreshUI();
      renderReview();
    }

    function refreshUI() {
      dot1.classList.toggle("active", step>=1);
      dot2.classList.toggle("active", step>=2);
      dot3.classList.toggle("active", step>=3);

      step1.classList.toggle("hidden", step!==1);
      step2.classList.toggle("hidden", step!==2);
      step3.classList.toggle("hidden", step!==3);

      prevBtn.classList.toggle("hidden", step===1);
      nextBtn.classList.toggle("hidden", step===3);
      confirmBtn.classList.toggle("hidden", step!==3);

      if (step===1) nextBtn.classList.toggle("disabled", selected.length===0);
      if (step===2) nextBtn.classList.toggle("disabled", nights()===0);
      if (step===3) confirmBtn.classList.toggle("disabled", selected.length===0 || nights()===0);
    }

    function renderReview() {
      review.innerHTML = selected.map(id => {
        const o = options.find(x => x.id===id);
        return `<div><strong>${o.name}</strong> · $${o.price}${o.perNight?"/night":""}</div>`;
      }).join("");
    }

    grid.onclick = e => {
      const card = e.target.closest(".option-card");
      if (!card) return;

      const id = card.dataset.id;
      const o = options.find(x => x.id===id);

      if (o.category==="travel" || o.category==="accommodation") {
        selected = selected.filter(s => options.find(z=>z.id===s).category !== o.category);
      }

      if (selected.includes(id)) selected = selected.filter(x => x!==id);
      else selected.push(id);

      renderOpts();
      calc();
    };

    document.getElementById("applyPromoBtn").onclick = () => {
      const code = promoInput.value.trim().toUpperCase();
      discount = promoCodes[code] || 0;
      calc();
    };

    minus.onclick = () => { travelers = Math.max(1, travelers-1); travelersEl.textContent = travelers; calc(); };
    plus.onclick = () => { travelers++; travelersEl.textContent = travelers; calc(); };

    start.onchange = calc;
    end.onchange = calc;

    nextBtn.onclick = () => { if (nextBtn.classList.contains("disabled")) return; step++; refreshUI(); };
    prevBtn.onclick = () => { step--; refreshUI(); };

    confirmBtn.onclick = () => {
      const total = totalEl.textContent;
      const destId = localStorage.getItem("voyage_selected_destination") || "N/A";
      const u = VUser.get();

      modalSummary.innerHTML =
        "Total: " + total + "<br>" +
        "Destination ID: " + destId + "<br>" +
        "Guest: " + (u.name||"Guest");

      modal.classList.remove("hidden");
    };

    document.getElementById("finishBtn").onclick = () => {
      modal.classList.add("hidden");
      goTo("blog.html");
    };

    modal.onclick = e => { if (e.target===modal) modal.classList.add("hidden"); };

    document.getElementById("backBtn").onclick = () => goTo("blog.html");

    renderOpts();
    calc();

  });
})();
