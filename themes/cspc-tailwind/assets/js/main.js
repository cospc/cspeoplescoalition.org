import { Calendar } from '@fullcalendar/core';
import daygridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

(function() {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  const themeToggle = document.querySelector('.darkmode-toggle input');
  const light = 'light';
  const dark = 'dark';
  let isDark = localStorage.theme === dark || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add(dark);
    themeToggle.checked = true;
  } else {
    document.documentElement.classList.remove(dark);
    themeToggle.checked = false;
  }

  themeToggle.addEventListener('change', function () {
    if (this.checked) {
      localStorage.theme = dark;
      document.documentElement.classList.add(dark);
    } else {
      localStorage.theme = light;
      document.documentElement.classList.remove(dark);
    }
  });

  const navbarMenuToggle = document.getElementById('navbar-menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarLangToggle = document.getElementById('navbar-lang-toggle');
  const navbarLang = document.getElementById('navbar-lang');

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (navbarMenuToggle && navbarMenuToggle.contains(target)) {
      navbarLang && navbarLang.classList.add('hidden');
      navbarMenu && navbarMenu.classList.toggle('hidden');
    } else if (navbarLangToggle && navbarLangToggle.contains(target)) {
      navbarMenu && navbarMenu.classList.add('hidden');
      navbarLang && navbarLang.classList.toggle('hidden');
    } else {
      navbarMenu && navbarMenu.classList.add('hidden');
      navbarLang && navbarLang.classList.add('hidden');
    }
  });

  // On page load, also load calendar
  document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    console.log("CSPC Events Calendar Loading...");
    let events;
    await fetch("/events.json").then((response) => response.json()).then((json) => events = json);
    var calendar = new Calendar(calendarEl, {
        plugins: [daygridPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        views: {
          timeGridDay: {
            
          }
        },
        headerToolbar: {
          left: 'prev,today,next',
          center: '',
          right: 'title,dayGridYear,dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events,
        eventClassNames: ['cspc-event'],
        eventClick: (info) => {
          info.jsEvent.preventDefault();

          if (info.event.url) {
            window.open(info.event.url);
            info.event.classNames = info.event.classNames + ['linkClicked'];
            info.view.calendar.render();
          }
        },
        eventSourceSuccess: (content) => {
          content.forEach((value) => {
            if (value.extendedProps.location) value.title += " @ " + value.extendedProps.location;
          });
          return content;
        }
    });
    calendar.render();
    console.log("Loaded CSPC Events Calendar!");
  });
})();
