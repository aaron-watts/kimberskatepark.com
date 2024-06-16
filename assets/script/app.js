const devData = { "data": { "holidayHours": [{ "start": "2024-07-24T23:00:00.000Z", "end": "2024-08-30T23:00:00.000Z", "title": "Summer Holiday", "description": "Open Hours 12-6pm (except Bank Holidays)" }, { "start": "2024-08-25T23:00:00.000Z", "end": "2024-08-26T23:00:00.000Z", "title": "Bank holiday", "description": "Closed" }], "events": [{ "start": "2024-07-06T16:00:00.000Z", "end": "2024-07-06T19:00:00.000Z", "title": "CLT event", "description": "" }] } }
// const devData = {'data':{'holidayHours': [], 'events': []}};

const getEvents = async () => {
    const res = await fetch(
        'https://script.google.com/macros/s/AKfycbwy-Jfw-II_FcG0bhNqKm8KtP-e48g5_CFSBv-nOBbvUVSFftRKrfgceIqYTRnj5W9v/exec',
        {
            redirect: 'follow'
        }
    );

    const data = await res.json();

    return data;
}

const formatDate = (start, end) => {
    const isAllDay = (start, end) => {
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

    const isOneDay = (start, end) => {
        if (end.getDate() - start.getDate() <= 1) return true;
        return false;
    }

    const dateElement = document.createElement('div');
    let dateString = '';

    if (!isAllDay(start, end) && isOneDay(start, end)) {
        const startHH = start.getHours();
        const startMM = start.getMinutes();
        const endHH = end.getHours();
        const endMM = end.getMinutes();

        dateString += `${startHH}:${
            startMM.toString.length < 2 ? startMM + '0' : startMM
        } - ${endHH}:${
            endMM.toString.length < 2 ? endMM + '0' : endMM
        }, `;
    }

    dateString += `${start.toDateString()}`;

    if (!isOneDay(start, end)) {
        dateString += ` - ${end.toDateString()}`;
    }

    return dateString;
};

const buildEvent = event => {
    const { start, end, title, description } = event;

    const eventItem = document.createElement('div');
    eventItem.classList.add('entry');
    const titleItem = document.createElement('h4');
    titleItem.innerText = title;

    const startDate = new Date(start)
    const endDate = new Date(end);
    
    const dateElement = document.createElement('h3');
    dateElement.innerText = formatDate(startDate, endDate);

    const descriptionItem = document.createElement('p');
    descriptionItem.innerText = description;

    eventItem.appendChild(dateElement);
    eventItem.appendChild(titleItem);
    eventItem.appendChild(descriptionItem);

    return eventItem;
};

const populateLists = async () => {
    // const data = await getEvents();
    const data = devData;

    const { events, holidayHours } = data.data;
    const eventList = document.querySelector('#events--list');
    const termDatesList = document.querySelector('#term-dates--list');

    if (events.length) {
        events.forEach(event => {
            eventList.appendChild(buildEvent(event));
        });
    } else {
        eventList.innerText = 'No events information available'
    };
    
    if (holidayHours.length) {
        holidayHours.forEach(event => {
            termDatesList.appendChild(buildEvent(event));
        });
    } else {
        termDatesList.innerText = 'No holiday information available';
    };
    
};

// document.addEventListener('DOMContentLoaded', populateLists)