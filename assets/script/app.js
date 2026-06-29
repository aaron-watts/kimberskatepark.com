'use strict'

class App {
    constructor(data) {
//        this.scheduleEl = document.querySelector('#schedule-list');
        this.schedulePar = document.querySelector('#schedule-list--container');
        this.userMsg = document.querySelector('#user-msg');
        this.data = data;
        if (this.data) {
            this.schedule = [...this.data.holidayHours, ...this.data.events];
            this.schedule.sort((a, b) => new Date(a.start) - new Date(b.start));
        }
    }

    dataError() {
        this.userMsg.innerText = 'Something went wrong while fetching the Schedule.';
        this.userMsg.innerText += ' Please try again later.';
    }

    populateSchedule() {
        const scheduleEl = document.createElement('ul');
        for (let event of this.schedule) {
            const liEl = document.createElement('li');
            liEl.appendChild(this.buildArticle(event));
            scheduleEl.appendChild(liEl);
        }

        scheduleEl.classList.add('reset-list');
        this.schedulePar.appendChild(scheduleEl);
        this.userMsg.classList.add('hidden');
    }

    buildArticle(event) {
        const { start, end, title, description } = event;
        const articleEl = document.createElement('article');
        const timeEl = document.createElement('h3');
        const titleEl = document.createElement('h4');
        const pEl = document.createElement('p');
        timeEl.innerHTML = this.formatDateStr(start, end);
        titleEl.innerText = title;
        pEl.innerHTML = description;
        articleEl.appendChild(timeEl);
        articleEl.appendChild(titleEl);
        articleEl.appendChild(pEl);
        return articleEl;
    }

    formatDateStr(eventStart, eventEnd) {
        const start = this.dateData(eventStart);
        const end = this.dateData(eventEnd);
        const isAllDay = this.isAllDay(start.date, end.date);
        const isOneDay = this.isOneDay(start.date, end.date);
        let dateString = '';
        if (!isAllDay && isOneDay) {
            dateString += `<time datetime="${start.yy}-${start.mm}-${start.dd} ${start.HH}:${start.MM}">`
            dateString += `${start.HH}:${start.MM}</time> - `;
            dateString += `<time datetime="${end.yy}-${end.mm}-${end.dd} ${end.HH}:${end.MM}">`;
            dateString += `${end.HH}:${end.MM}</time> `
        }
        dateString += `<time datetime="${start.yy}-${start.mm}-${start.dd}">${start.date.toDateString()}</time>`;
        if (!isOneDay) {
            end.date.setDate(end.date.getDate() - 1);
            const updateEnd = this.dateData(end.date)
            dateString += ` - <time datetime="${updateEnd.yy}-${updateEnd.mm}-${updateEnd.dd}">`
            dateString += `${updateEnd.date.toDateString()}</time>`;
        }
        return dateString;
    }

    dateData(date) {
        const data = {
            date: new Date(date)
        };
        data.yy = data.date.getFullYear();
        data.mm = this.doubleDigit(data.date.getMonth() + 1);
        data.dd = this.doubleDigit(data.date.getDate());
        data.HH = this.doubleDigit(data.date.getHours());
        data.MM = this.doubleDigit(data.date.getMinutes());
        return data;
    }

    doubleDigit(i) {
        return i < 10 ? `0${i}` : i;
    }

    isAllDay(start, end) {
        if (
            !start.getHours()
            && !start.getMinutes()
            && !start.getSeconds()
            && !end.getHours()
            && !end.getMinutes()
            && !end.getSeconds()
        ) return true;
        return false;
    }

    isOneDay(start, end) {
        const diffTime = Math.abs(start - end);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) return true;
        return false;
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

    static detectScript() {
        const noscript = document.querySelectorAll('.noscript');
        for (const el of noscript) {
            el.classList.remove('noscript');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);

async function init() {
    console.log('Initialise App');
    App.detectScript();
    const data = await App.getEvents('/.netlify/functions/api');
    const app = new App(data);
    if (app.data) app.populateSchedule();
    else app.dataError();
}
