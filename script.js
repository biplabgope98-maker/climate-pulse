const url =
    "https://api.openweathermap.org/data/2.5/weather";

const apiKey =
    "f00c38e0279b7bc85480c3fe775d518c";

$(document).ready(function () {

    loadSearchHistory();
    loadTheme();

    $("#city-input-btn")
        .click(function () {
            getWeather();
        });

    $("#city-input")
        .keypress(function (e) {

            if (e.which === 13) {
                getWeather();
            }

        });

    $("#theme-toggle")
        .click(function () {
            toggleTheme();
        });

});

function getWeather() {

    const cityName =
        $("#city-input")
            .val()
            .trim();

    if (cityName === "") {

        alert(
            "Please enter a city name"
        );

        return;
    }

    weatherFn(cityName);
}

async function weatherFn(cityName) {

    try {

        const response =
            await fetch(
`${url}?q=${cityName}&appid=${apiKey}&units=metric`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                "City not found"
            );
        }

        weatherShowFn(data);

    }

    catch (error) {

        alert(
            error.message
        );

        console.error(
            error
        );
    }
}

function weatherShowFn(data) {

    $("#weather-info")
        .fadeIn();

    $("#city-name")
        .text(
            data.name
        );

    $("#date")
        .text(
            moment().format(
                "MMMM Do YYYY, h:mm A"
            )
        );

    $("#temperature")
        .html(
`${Math.round(
data.main.temp
)}°C`
        );

    $("#description")
        .text(
data.weather[0]
.description
        );

    $("#humidity")
        .text(
`${data.main.humidity}%`
        );

    $("#feels-like")
        .text(
`${Math.round(
data.main.feels_like
)}°C`
        );

    $("#wind-speed")
        .text(
`${data.wind.speed} m/s`
        );

    const iconCode =
        data.weather[0]
            .icon;

    $("#weather-icon")
        .attr(
            "src",
`https://openweathermap.org/img/wn/${iconCode}@4x.png`
        );

    saveSearch(
        data.name
    );

    updateGlow(
        data.weather[0]
            .main
            .toLowerCase()
    );

    $("#city-input")
        .val("");
}

function updateGlow(weather) {

    const card =
        document.querySelector(
            ".app-container"
        );

    if (
        weather.includes(
            "clear"
        )
    ) {

        card.style.boxShadow =
"0 20px 60px rgba(255,165,0,0.25)";
    }

    else if (
        weather.includes(
            "cloud"
        )
    ) {

        card.style.boxShadow =
"0 20px 60px rgba(180,180,180,0.25)";
    }

    else if (

        weather.includes(
            "rain"
        ) ||

        weather.includes(
            "drizzle"
        )
    ) {

        card.style.boxShadow =
"0 20px 60px rgba(0,150,255,0.25)";
    }

    else {

        card.style.boxShadow =
"0 20px 60px rgba(255,255,255,0.12)";
    }
}

function saveSearch(cityName) {

    let cities =
        JSON.parse(
            localStorage.getItem(
                "recentCities"
            )
        ) || [];

    cities =
        cities.filter(
            city =>
                city.toLowerCase() !==
                cityName.toLowerCase()
        );

    cities.unshift(
        cityName
    );

    cities =
        cities.slice(
            0,
            6
        );

    localStorage.setItem(
        "recentCities",
        JSON.stringify(
            cities
        )
    );

    loadSearchHistory();
}

function loadSearchHistory() {

    const cities =
        JSON.parse(
            localStorage.getItem(
                "recentCities"
            )
        ) || [];

    $("#search-history")
        .html("");

    cities.forEach(
        city => {

            $("#search-history")
                .append(
`
<button
class="history-btn"
onclick="weatherFn('${city}')">

${city}

</button>
`
                );

        });
}

function toggleTheme() {

    const body =
        $("body");

    const icon =
        $("#theme-toggle i");

    body.toggleClass(
        "light-theme"
    );

    if (
        body.hasClass(
            "light-theme"
        )
    ) {

        icon
            .removeClass(
                "fa-moon"
            )
            .addClass(
                "fa-sun"
            );

        localStorage.setItem(
            "theme",
            "light"
        );

    }

    else {

        icon
            .removeClass(
                "fa-sun"
            )
            .addClass(
                "fa-moon"
            );

        localStorage.setItem(
            "theme",
            "dark"
        );
    }
}

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    const icon =
        $("#theme-toggle i");

    if (
        savedTheme ===
        "light"
    ) {

        $("body")
            .addClass(
                "light-theme"
            );

        icon
            .removeClass(
                "fa-moon"
            )
            .addClass(
                "fa-sun"
            );
    }

    else {

        $("body")
            .removeClass(
                "light-theme"
            );

        icon
            .removeClass(
                "fa-sun"
            )
            .addClass(
                "fa-moon"
            );
    }
}