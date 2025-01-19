let expenseForm = document.getElementById("expenseForm");

let itemInput = document.getElementById("item");
let priceInput = document.getElementById("price");
let amountInput = document.getElementById("amount");
let dateInput = document.getElementById("date");
let categoryInput = document.getElementById("category");
let picInput = document.getElementById("pic");

const alertElement = document.querySelector(".alert-popup");
const alertElementTxt = document.querySelector(".alert-popup-m");
const alertElementTitle = document.querySelector(".alert-popup-title");

let datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
let categories = ["food", "clothing", "drinks", "bills", "transportation"]

// adding expenses n shit
expenseForm.addEventListener("submit", async (ev) => {
    showLoadingScreen();
    ev.preventDefault();

    let item = itemInput.value;
    let price = parseInt(priceInput.value);
    let amount = parseInt(amountInput.value);
    let date = dateInput.value == '' ? null : dateInput.value;
    let category = categoryInput.value;
    let pic = picInput.value == '' ? null : picInput.value;

    if(item.length > 50 || item.length < 3) return showAlertError("item is larger than 50 chars or less than 3 chars.");
    if(datePattern.test(date) === false && date != null) return showAlertError("Invalid Date.");
    if(categories.indexOf(category) === -1) return showAlertError("invalid category, try again.");

    let domain = new URL(window.location.href).origin;
    const addExpense = await fetch(`${domain}/add_expense`, {
        method: "post",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify({
            item,
            price,
            amount,
            date,
            category,
            pic
        })
    });

    if(addExpense.redirected) return showAlertError("an error just occured, Please reload your page.");

    let response = await addExpense.json();
    hideLoadingScreen();

    if (response.status == 'ok') {
        showAlertSuccess(response.message)
    } else {
        showAlertError(response.message)
    }
});

let cooldown = false;
function showAlertSuccess(text = "Successfully executed!", bg = 'bg-success', title = 'Success!') {
    hideLoadingScreen();
    if (cooldown) return;
    alertElementTitle.textContent = title;
    alertElementTxt.innerHTML = text;
    alertElement.classList.add("visible-alert");
    alertElement.classList.add(bg);
    cooldown = true;
    setTimeout(() => {
        alertElement.classList.remove("visible-alert");
        alertElement.classList.remove(bg);
        cooldown = false;
    }, 2000);
}

function showAlertError(text = "An Error Just Occured.", bg = 'bg-danger', title = 'Error!') {
    showAlertSuccess(text, bg, title)
}

const loadingScreen = document.querySelector('.blur-overlay');
const loader = document.querySelector('.loader');

function showLoadingScreen() {
    loadingScreen.style.display = 'flex';
    loader.style.display = 'block';
}

function hideLoadingScreen() {
    loadingScreen.style.display = 'none';
    loader.style.display = 'none';
}