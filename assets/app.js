function registerUser() {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const pincode = document.getElementById("pincodeInput").value.trim();

    if (!name || name.length < 2) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!/^\d{10}$/.test(phone)) return;
    if (!/^\d{6}$/.test(pincode)) return;

    const user = { name, email, phone, pincode };
    localStorage.setItem("voyage_user", JSON.stringify(user));

    window.location.href = "blog.html";
}
