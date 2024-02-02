(() => {
  function hash(str) {
    let hash = 0;
    for (const char of str) {
      hash = ((hash << 5) - hash) + char.codePointAt();
    }
    return hash;
  }

  const usernameScr = document.querySelectorAll("#username-scr")[0];
  const usernameIn = document.querySelectorAll("#username-in")[0];
  const passwordScr = document.querySelectorAll("#password-scr")[0];
  const passwordIn = document.querySelectorAll("#password-in")[0];
  const passwordSpinner = document.querySelectorAll("#password-spinner")[0];
  usernameIn.addEventListener("keydown", event => {
    if (event.code === "Enter") {
      const username = usernameIn.value;
      usernameScr.classList.add("hidden");
      passwordScr.classList.remove("hidden");
      passwordIn.addEventListener("keydown", function onkeydown(event) {
        if (event.code === "Enter") {
          const password = hash(passwordIn.value);
          passwordSpinner.classList.remove("hidden");
          fetch("/login", {
            method: "POST",
            body: JSON.stringify({
              username,
              password
            })
          })
            .then(response => {
              if (response.status === 403) {
                passwordIn.value = "";
                passwordIn.focus();
                passwordIn.classList.add("sh");
                setTimeout(() => passwordIn.classList.remove("sh"), 500);
              } else if (response.status === 200) {
                response.text().then(data => {
                  document.documentElement.innerHTML = data;
                });
              }
              passwordSpinner.classList.add("hidden");
            });
        } else if (event.code === "Escape") {
          this.removeEventListener("keydown", onkeydown);
          passwordScr.classList.add("hidden");
          usernameScr.classList.remove("hidden");
        }
      });
      passwordIn.focus();
    }
  });
})();