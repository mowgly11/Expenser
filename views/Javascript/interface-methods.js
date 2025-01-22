export class Loading {
    constructor(loadingScreen, loader) {
        this.loadingScreen = loadingScreen;
        this.loader = loader;
    }

    showLoadingScreen() {
        this.loadingScreen.style.display = 'flex';
        this.loader.style.display = 'block';
    }

    hideLoadingScreen() {
        this.loadingScreen.style.display = 'none';
        this.loader.style.display = 'none';
    }
}

export class Errors {
    constructor(alertElement, alertElementTxt, alertElementTitle) {
        this.cooldown = false;
        this.alertElement = alertElement;
        this.alertElementTxt = alertElementTxt;
        this.alertElementTitle = alertElementTitle;
    }

    showAlertSuccess(text = "Successfully executed!", bg = 'bg-success', title = 'Success!') {
        if (this.cooldown) return;
        this.alertElementTitle.textContent = title;
        this.alertElementTxt.innerHTML = text;
        this.alertElement.classList.add("visible-alert");
        this.alertElement.classList.add(bg);
        this.cooldown = true;
        setTimeout(() => {
            this.alertElement.classList.remove("visible-alert");
            this.alertElement.classList.remove(bg);
            this.cooldown = false;
        }, 2000);
    }

    showAlertError(text = "An Error Just Occured.", bg = 'bg-danger', title = 'Error!') {
        this.showAlertSuccess(text, bg, title);
    }
}