const eventsStore = [
    {
        title: "INFJ Personality Type - Coffee Shop Meet & Greet",
        description: "Being an INFJ",
        date: new Date(2024, 2, 23, 15),
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1037&auto=format&fit=crop",
        type: "offline",
        attendees: 99,
        category: "Hobbies and Passions",
        distance: 50,
    },
    {
        title: "NYC AI Users - AI Tech Talks, Demo & Social",
        description: "New York AI Users",
        date: new Date(2024, 2, 23, 11, 30),
        image: "https://images.unsplash.com/photo-1696258686454-60082b2c33e2?q=80&w=870&auto=format&fit=crop",
        type: "offline",
        attendees: 43,
        category: "Technology",
        distance: 25,
    },
    {
        title: "Book 40+ Appointments Per Month Using AI",
        description: "New Jersey Business Network",
        date: new Date(2024, 2, 16, 14),
        image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=1032&auto=format&fit=crop",
        type: "online",
        category: "Technology",
        distance: 10,
    },
    {
        title: "Dump writing group weekly meetup",
        description: "Dump writing group",
        date: new Date(2024, 2, 13, 11),
        image: "https://plus.unsplash.com/premium_photo-1678453146992-b80d66df9152?q=80&w=870&auto=format&fit=crop",
        type: "online",
        attendees: 77,
        category: "Business",
        distance: 100,
    },
    {
        title: "Over 40s, 50s, & 60s Senior Singles Chat",
        description: "Singles Dating Community",
        date: new Date(2024, 2, 14, 11),
        image: "https://plus.unsplash.com/premium_photo-1706005542509-a460d6efecb0?q=80&w=870&auto=format&fit=crop",
        type: "online",
        attendees: 140,
        category: "Social Activities",
        distance: 74,
    },
    {
        title: "All Nations - Manhattan Missions Church",
        description: "Manhattan Bible Study",
        date: new Date(2024, 2, 14, 11),
        image: "https://plus.unsplash.com/premium_photo-1679488248784-65a638a3d3fc?q=80&w=870&auto=format&fit=crop",
        type: "offline",
        category: "Health and Wellbeing",
        distance: 15,
    },
];

class EventFilter {
    constructor() {
        this.events = [...eventsStore];
        this.filteredEvents = [...this.events];
        this.filters = { type: "", distance: "", category: "", date: "" };
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderEvents();
    }

    bindEvents() {
        const ids = ["typeFilter", "filterDistance", "categoryFilter", "dateFilter"];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("change", (e) => this.handleFilterChange(e));
            }
        });
    }

    handleFilterChange(e) {
        const { id, value } = e.target;
        const key = id === "filterDistance" ? "distance" : id.replace("Filter", "");
        this.filters[key] = value;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredEvents = this.events.filter((event) => {
            const typeMatch = !this.filters.type || event.type === this.filters.type;
            const distanceMatch = !this.filters.distance || event.distance <= parseInt(this.filters.distance);
            const categoryMatch = !this.filters.category || event.category === this.filters.category;
            
            const eventDateStr = event.date instanceof Date ? event.date.toISOString().slice(0, 10) : "";
            const dateMatch = !this.filters.date || eventDateStr === this.filters.date;
            
            return typeMatch && distanceMatch && categoryMatch && dateMatch;
        });
        this.renderEvents();
    }

    renderEvents() {
        const eventList = document.getElementById("eventList");
        if (!eventList) return;
        
        if (this.filteredEvents.length === 0) {
            eventList.innerHTML = `<div class="no-events"><p>No events found</p></div>`;
            return;
        }
        eventList.innerHTML = this.filteredEvents.map((item) => this.createEventCard(item)).join("");
    }

    createEventCard(event) {
        const formatDate = (date) => date.toLocaleDateString("en-EN", { 
            day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" 
        });
        return `
            <div class="event-card">
                <div class="event-card__img"><img src="${event.image}" alt="${event.title}"></div>
                <div class="event-content">
                    <p class="event-date">${formatDate(event.date)}</p>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-badge">${event.type === "online" ? "Online" : "Offline"} · ${event.distance} км</p>
                    ${event.attendees ? `<p class="event-attendees">${event.attendees} участника(ов)</p>` : ''}
                </div>
            </div>`;
    }
}

async function includeHTML(selector, url) {
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Ошибка ${resp.status}`);
        const html = await resp.text();
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = html;
        }
    } catch (e) {
        console.error('Не удалось подгрузить фрагмент:', e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    includeHTML('#site-header', './components/header.html');
    includeHTML('#site-footer', './components/footer.html');

    new EventFilter();

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        const map = L.map('map').setView([40.7128, -74.0060], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const myIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #E32359; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20]
        });

        L.marker([40.7128, -74.0060], { icon: myIcon }).addTo(map)
            .bindPopup('<b>New York City</b><br>Meetups are happening here!')
            .openPopup();
    }
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar');
    if (header) {
        header.classList.toggle('navbar--scrolled', window.scrollY > 50);
    }
});

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-toggle-btn');
    if (btn) {
        const filtersBlock = document.querySelector('.filters');
        if (filtersBlock) {
            const isActive = filtersBlock.classList.toggle('active');
            btn.innerHTML = isActive ? '<span>🔍</span> Close Filters' : '<span>🔍</span> Filters';
        }
    }
});