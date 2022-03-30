const form = document.querySelector("form");
const errorEl = document.querySelector(".signin.error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.textContent = "";

    // get values
    const email = form.email.value;
    const password = form.password.value;

    try {
        const res = await fetch("/auth/signin", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (data.error) {
            errorEl.textContent = data.error;
        }

        if (data.user) {
            location.assign("/");
        }
    } catch (err) {
        alert("An error occured please try again later.");
    }
});
