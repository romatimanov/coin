import { el, setChildren } from "redom";
import icon from "../../images/x.svg";
import { router } from "../login.js";
import { createCheckCard, sceleton } from "./createCheckCard.js";
import { createSelect } from "./createSelect.js";

const token = sessionStorage.getItem("authToken");

if (!token) {
  router.navigate("/");
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("check-btn")) {
    const accountId = event.target.dataset.accountId;
    router.navigate(`/check/${accountId}`);
  }
});

export function createCheck() {
  const check = el("div.check-body");
  const checkHeader = el("div.check-header");
  const checkGroup = el("div.check-group");
  const checkContent = el("div", { className: "check-content" });
  const img = el("img");
  img.src = icon;
  img.alt = "icon";
  const title = el("h1.check-title", { textContent: "Ваши счета" });
  const createBtn = el("button.check-btn");
  const selectContainer = el("select", { className: "form-select-container" });

  const options = [
    { value: "number", text: "По номеру" },
    { value: "balance", text: "По балансу" },
    { value: "transaction", text: "По последней транзакции" },
  ];

  const placeholderOption = {
    value: "Сортировка",
    placeholder: true,
    selected: "selected",
  };

  options.unshift(placeholderOption);

  checkContent.append(sceleton());

  const cachedData = JSON.parse(localStorage.getItem("check"));

  if (cachedData && cachedData.payload) {
    checkContent.innerHTML = "";
    cachedData.payload.forEach((accountData) => {
      const checkCard = createCheckCard(accountData);
      checkContent.append(checkCard);
    });
    setTimeout(() => {
      createSelect(cachedData, selectContainer, checkContent, options);
    }, 0.1);
  } else {
    fetch("http://localhost:3000/accounts", {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        checkContent.innerHTML = "";
        localStorage.setItem("check", JSON.stringify(data));
        data.payload.forEach((accountData) => {
          const checkCard = createCheckCard(accountData);
          checkContent.append(checkCard);
        });
        createSelect(data, selectContainer, checkContent, options);
      })
      .catch(() => {
        window.location.reload();
      });
  }

  createBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/create-account", {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const existingData = JSON.parse(localStorage.getItem("check")) || {
          payload: [],
        };
        existingData.payload.push(data.payload);
        localStorage.setItem("check", JSON.stringify(existingData));
        const newCheckCard = createCheckCard(data.payload);
        checkContent.append(newCheckCard);
      });
  });

  setChildren(createBtn, [img, el("span", "Создать новый счет")]);
  setChildren(checkGroup, [title, selectContainer]);
  setChildren(checkHeader, [checkGroup, createBtn]);
  setChildren(check, [checkHeader, checkContent]);

  return check;
}
