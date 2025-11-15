(function () {
  document.addEventListener("DOMContentLoaded", () => {

    const nameEl = document.getElementById("nameInput");
    const emailEl = document.getElementById("emailInput");
    const phoneEl = document.getElementById("phoneInput");
    const pinEl = document.getElementById("pincodeInput");
    const clockEl = document.getElementById("clock");

    function tick() {
      clockEl.textContent = new Date().toLocaleTimeString();
    }
    tick();
    setInterval(tick, 1000);

    function err(id, msg) {
      document.getElementById(id).textContent = msg;
    }

    function ok(id) {
      err(id, "");
    }

    function valid() {
      let good = true;

      if (nameEl.value.trim().length < 2) { err("nameError", "Invalid name"); good = false; } else ok("nameError");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) { err("emailError", "Invalid email"); good = false; } else ok("emailError");
      if (!/^\d{10}$/.test(phoneEl.value)) { err("phoneError", "Enter 10 digits"); good = false; } else ok("phoneError");
      if (!/^\d{6}$/.test(pinEl.value)) { err("pincodeError", "Enter 6 digits"); good = false; } else ok("pincodeError");

      return good;
    }

    document.getElementById("continueBtn").onclick = () => {
      if (!valid()) return;

      VUser.set({
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl.value.trim(),
        pincode: pinEl.value.trim()
      });

      goTo("blog.html");
    };

    document.getElementById("demoBtn").onclick = () => {
      VUser.set({
        name: "Demo Traveler",
        email: "demo@voyageflow.test",
        phone: "9999999999",
        pincode: "110001"
      });
      goTo("blog.html");
    };

    phoneEl.oninput = e => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    pinEl.oninput = e => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);

  });
})();
