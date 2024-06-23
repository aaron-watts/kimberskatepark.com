const getEvents = async () => {
    const res = await fetch('/.netlify/functions/api');

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
    const eventList = document.querySelector('#events--list');
    const termDatesList = document.querySelector('#term-dates--list');
    const loaderWidgets = document.querySelectorAll('.loader');

    try {
        const data = await getEvents();
        const { events, holidayHours } = data;

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
    } catch (e) {
        const eventFrame = `<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&bgcolor=%23ffffff&showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&hl=en_GB&src=NjdhM2RhYmRiNjkxMjNjNzg2MzkyMWYwMTYwYjE1MjdhZWFmOGI0OWMwZDEyOWI1N2ZmMTM4OTMxYTdjNTU5MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23795548" style="border:solid 1px #777" width="90%" height="400" frameborder="0" scrolling="no"></iframe>`;
        const termDateFrame = `<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&bgcolor=%23ffffff&showTitle=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=MONTH&hl=en_GB&src=N2FwZGFzcTJ1ODJlZmNoa2pmdHRxbG82Y2tAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23AD1457" style="border:solid 1px #777" width="90%" height="400" frameborder="0" scrolling="no"></iframe>`;
        eventList.innerHTML = eventFrame;
        termDatesList.innerHTML = termDateFrame;
    }
    
    loaderWidgets.forEach(i => i.classList.add('hidden'))
};

document.addEventListener('DOMContentLoaded', populateLists)