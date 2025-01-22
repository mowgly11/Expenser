"use strict";

import {Loading, Errors} from './interface-methods.js';

let expenseForm = document.getElementById("expenseForm");

let expensesTemplate = document.getElementById("expense");
let expensesHolder = document.getElementById("expenses-container");
let showMoreBtn = document.getElementById("show-more");

let itemInput = document.getElementById("item");
let priceInput = document.getElementById("price");
let amountInput = document.getElementById("amount");
let dateInput = document.getElementById("date");
let categoryInput = document.getElementById("category");

const alertElement = document.querySelector(".alert-popup");
const alertElementTxt = document.querySelector(".alert-popup-m");
const alertElementTitle = document.querySelector(".alert-popup-title");

let datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
let categories = ["food", "clothing", "drinks", "bills", "transportation"];

let domain = new URL(window.location.href).origin;
let currentExpensesStart = 0;

const loadingScreen = document.querySelector('.blur-overlay');
const loader = document.querySelector('.loader');

const ui = new Loading(loadingScreen, loader);
const errors = new Errors(alertElement, alertElementTxt, alertElementTitle);

document.addEventListener("DOMContentLoaded", async () => {
    let getExpenses = await requestExpensesList(currentExpensesStart, 10);
    if (getExpenses == null) errors.showAlertError("failed to get expenses, please try reloading your page");

    getExpenses = await getExpenses.json();

    let getExpensesArray = getExpenses.message;

    getExpensesArray.forEach(expense => addExpenseCard(expense));

    showMoreBtn.addEventListener("click", () => { });

    expenseForm.addEventListener("submit", async (ev) => {
        ui.showLoadingScreen();
        ev.preventDefault();

        let item = itemInput.value;
        let price = parseInt(priceInput.value);
        let amount = parseInt(amountInput.value);
        let date = dateInput.value == '' ? null : dateInput.value;
        let category = categoryInput.value;

        if (item.length > 50 || item.length < 3) return errors.showAlertError("item is larger than 50 chars or less than 3 chars.");
        if (datePattern.test(date) === false && date != null) return errors.showAlertError("Invalid Date.");
        if (categories.indexOf(category) === -1) return errors.showAlertError("invalid category, try again.");

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
            })
        });

        if (addExpense.redirected) return errors.showAlertError("an error just occured, Please reload your page.");

        let response = await addExpense.json();
        ui.hideLoadingScreen();

        if (response.status == 'ok') {
            errors.showAlertSuccess(response.message);
            addExpenseCard({ item, price, amount, date, category })
        } else {
            errors.showAlertError(response.message)
        }
    });
});

function addExpenseCard(details) {
    let { id, item, price, amount, category, date } = details;
    const expenseClone = expensesTemplate.content.cloneNode(true);

    expenseClone.querySelector("#show-item").textContent = item;
    expenseClone.querySelector("#show-price").textContent = price;
    expenseClone.querySelector("#show-amount").textContent = amount;
    expenseClone.querySelector("#show-category").textContent = category;
    expenseClone.querySelector("#show-date").textContent = date;
    expenseClone.querySelector("button[data-expense-id]").value = id ?? "none";

    setupDeleter(expenseClone.querySelector("button[data-expense-id]"));

    expensesHolder.append(expenseClone);
}

function setupDeleter(btn) {
    btn.addEventListener("click", async() => {
        try {
            let deleteResponse = await fetch(`${domain}/delete_expense`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: btn.value
                })
            });

            deleteResponse = await deleteResponse.json();

            if(deleteResponse.status === "ok") {
                btn.parentElement.remove();
                errors.showAlertSuccess(deleteResponse.message);
            } else {
                errors.showAlertError(deleteResponse.message)
            }
        } catch(e) {
            console.log(e);
            errors.showAlertError("Couldn't delete expense, try again.");
        }
        
    });
}

async function requestExpensesList(start, amount) {
    let getExpenses;
    try {
        getExpenses = await fetch(`${domain}/expenses`, {
            method: "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                start,
                amount
            })
        });

        return getExpenses;
    } catch (e) {
        console.log(e)
        return null;
    }

}