import { el, setChildren } from "redom";
import Navigo from "navigo";
const router = new Navigo("/");

function validateInput(value, minLength) {
  return value.trim().length >= minLength;
}

function validateLoginForm(loginValue, passValue, login, pass) {
  const isValidLogin = validateInput(loginValue, 6);
  const isValidPass = validateInput(passValue, 6);

  login.addEventListener("blur", () => {
    const loginValue = login.value.trim();
    if (loginValue.length >= 1) {
      login.classList.remove("form-error");
    }
  });

  pass.addEventListener("blur", () => {
    const passValue = pass.value.trim();
    if (passValue.length >= 6) {
      pass.classList.remove("form-error");
    }
  });

  return isValidLogin && isValidPass;
}

export function createLogin() {
  const main = el("div.login-main");
  const contentLogin = el("div.login-content");
  const form = el("form.form");
  const labelLogin = el("p.form-label", { textContent: "Логин" });
  const login = el("input.form-input", { placeholder: "Login" });
  const labelPass = el("p.form-label", { textContent: "Пароль" });
  const pass = el("input.form-input", {
    placeholder: "Password",
    type: "password",
  });
  const h2 = el("h2.login-title", { textContent: "Вход в аккаунт" });
  const btn = el("button.form-btn", { textContent: "Войти" });
  const loginGroup = el("div.input-group");
  const passGroup = el("div.input-group");

  setChildren(loginGroup, [labelLogin, login]);
  setChildren(passGroup, [labelPass, pass]);
  setChildren(form, [loginGroup, passGroup, btn]);
  setChildren(contentLogin, [h2, form]);
  setChildren(main, contentLogin);
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const loginValue = login.value.trim();
    const passValue = pass.value.trim();

    const isValid = validateLoginForm(loginValue, passValue, login, pass);

    if (!isValid) {
      login.classList.add("form-error");
      pass.classList.add("form-error");
      return;
    }

    login.classList.remove("form-error");
    pass.classList.remove("form-error");

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        login: "developer",
        password: "skillbox",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const token = data.payload.token;
        sessionStorage.setItem("authToken", token);
        router.navigate("/check");
      });
  });

  return main;
}

export { router };
