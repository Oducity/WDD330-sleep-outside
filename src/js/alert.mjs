
export default class alert{
    constructor(url) {
        this.url = url;
    }
    async getAlertData() {
        const main = document.querySelector("main");
        try {
            //const alertAPI = "../public/json/alert.json";
            const alertAPI = this.url;
            const response = await fetch(alertAPI);
            if (!response.ok) {
                throw new Error(`Network response is not ok. Status: ${response.status}`);
            }
            const messages = await response.json();
            const section = document.createElement("section");
            section.classList.add = "alert-list";
            messages.forEach((message) => {
                const textP = document.createElement("p");
                textP.innerText = message.text;
                textP.style.backgroundColor = message.background;
                textP.style.color = message.color;
                section.appendChild(textP);
            })
            main.prepend(section);
        } catch (error) {
            const p = document.createElement("p");
            p.classList.add = "error-message";
            p.innerText = `Error displaying alert message! Error: ${error.message}`;
            if (!main) {
                console.error("<main> element not found");
            } else {
                main.prepend(p);
            }
        }    
    }

}

