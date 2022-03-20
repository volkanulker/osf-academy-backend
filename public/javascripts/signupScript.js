const form = document.querySelector("form");
const errorEl = document.querySelector(".signup.error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorEl.textContent = "";

  // get values
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
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
    // fetch api never throws an error
  }
});
