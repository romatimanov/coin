import mail from "../../images/mail.png";
import { accountAutoComplete } from "./auto-complete.js";
import { el, setChildren } from "redom";

export function createTransfer(account, token, getData) {
  const transferContent = el("div.transfer-content");
  const title = el("h2.transfer-title", { textContent: "Новый перевод" });
  const form = el("form");
  const inputGroupCheck = el("div.transfer-group");
  const inputGroupSum = el("div.transfer-group");
  const inputCheck = el("input.transfer-input");
  const inputSum = el("input.transfer-input");
  const inputCheckText = el("p.transfer-text", {
    textContent: "Номер счёта получателя",
  });
  const inputSumText = el("p.transfer-text", { textContent: "Сумма перевода" });
  const transferBtn = el("button.transfer-btn");
  const mailImg = el("img");
  mailImg.src = mail;
  mailImg.alt = "mail";

  let savedAccounts = JSON.parse(localStorage.getItem("savedAccount")) || [];

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!savedAccounts.includes(inputCheck.value)) {
      savedAccounts.push(inputCheck.value);
    }
    if (inputSum.value <= 0 || inputSum.value == "") {
      inputSum.classList.add("form-error");
      return;
    }
    if (inputCheck.value == "") {
      inputCheck.classList.add("form-error");
      return;
    }
    inputCheck.classList.remove("form-error");
    inputSum.classList.remove("form-error");
    localStorage.setItem("savedAccount", JSON.stringify(savedAccounts));

    fetch("http://localhost:3000/transfer-funds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({
        from: account,
        to: inputCheck.value,
        amount: inputSum.value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Ошибка при отправке данных");
        }
      })
      .then((data) => {
        if (data.error) {
          transferContent.classList.add("sum-error");
        } else {
          inputCheck.value = "";
          inputSum.value = "";
          transferContent.classList.remove("sum-error");
          getData(data);
          localStorage.removeItem("check");
          localStorage.setItem("arr", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  });

  inputCheck.addEventListener("click", () => {
    accountAutoComplete(inputCheck);
  });

  setChildren(transferBtn, [mailImg, el("span", "Отправить")]);
  setChildren(inputGroupCheck, [inputCheckText, inputCheck]);
  setChildren(inputGroupSum, [inputSumText, inputSum]);
  setChildren(form, [inputGroupCheck, inputGroupSum, transferBtn]);
  setChildren(transferContent, [title, form]);

  return transferContent;
}
