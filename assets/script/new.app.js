'use strict'

class App {
    constructor(data) {
        this.disclaimer = document.getElementById('disclaimer');
        this.confirmBtn = this.disclaimer.querySelector('#confirmBtn');
        this.confirmBtn.addEventListener('click', evt => {
            evt.preventDefault();
            this.buildIframes();
        });
        this.data = data;
        if (this.data == null) this.openDialog(this.disclaimer);
    }

    openDialog(dialog){
        dialog.showModal();
    }

    buildIframes() {
        console.log('build iframes');
    }

    static async getEvents(route) {
        const res = await fetch(route);
        let data;
        
        if (res.status == 200) {
            data = await res.json();
        } else {
            data = null;
        }

        return data;
    }
}

document.addEventListener('DOMContentLoaded', init);

async function init() {
    console.log('Initialise App');

    const data = await App.getEvents('/.netlify/functions/api');
    const app = new App(data);

    
}
