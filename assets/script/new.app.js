'use strict'

class App {
    constructor(data) {
        this.data = data;
    }

    static async getEvents(route) {
        const res = await fetch(route);
        console.log(res.status);
        if (res.status == 200) {
            const data = await res.json();
            return data;
        } else {
            const data = null;
            return data;
        }
    }
}

document.addEventListener('DOMContentLoaded', init);

async function init() {
    console.log('Initialise App');

    const data = await App.getEvents('/.netlify/functions/api');
    const app = new App(data);
    console.log(app.data);
}
