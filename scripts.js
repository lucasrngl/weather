let apiKey = "285b4f6e042728e7265e096a30eefc25";

setColor()

getInfos('São Paulo')

// Define a cor da interface de acordo com o horário
function setColor() {
    if (new Date().getHours() > 18 || new Date().getHours() < 6) {
        document.querySelector('.current-forecast').classList.add('night')
    } else {
        document.querySelector('.current-forecast').classList.add('day')
    }
}

// Captura o valor informado na barra de pesquisa
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', event => {
    if (event.keyCode == 13) {
        getInfos(searchbox.value);
    }
});

// Usa o valor informado na função acima para realizar a pesquisa na API e retornar a latitude e longitude
function getInfos(value) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=${apiKey}`)
        .then(infos => {
            return infos.json();
        }).then(getResults);
}

// Captura as informações de latitude e longitude para usar na API final
function getResults(infos) {
    // Define variáveis com informações básicas sobre a região
    let lat = infos.coord.lat;
    let lon = infos.coord.lon;
    let city = infos.name;
    let country = infos.sys.country;
    
    // Captura os dados da API que com as informações climáticas
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=pt_br&exclude-hourly,minutely&units=metric&appid=${apiKey}`)
        .then(infos => {
            return infos.json();
        }).then(displayResults);

        // Responsável por mostrar os resultados na tela
        function displayResults(weather) {
            let time = new Date(weather.current.dt * 1000);
            let month = time.toLocaleString("pt-BR", {month: "long"});
            let day = time.toLocaleString("pt-BR", {day: "numeric"});
            let hour = time.toLocaleString("pt-BR", {hour: "numeric"});
            let minute = time.toLocaleString("pt-BR", {minute: "numeric"});

            // Converte minutos que por padrão possuem apenas um caractere para dois caracteres, mantendo o formato de horário padrão
            function convertMinute() {
                if (minute < 10) {
                    newMinute = `0${minute}`;
                    return newMinute;
                } else {
                    return minute;
                }
            };

            // Seleciona os elementos na DOM e as modifica de acordo com suas funções
            let location = document.querySelector('.location');
            location.innerText = `${city}, ${country}`;
            
            rawDescription = weather.current.weather[0].description;
            capDescription = rawDescription.charAt(0).toUpperCase() + rawDescription.slice(1);
            
            let icon = document.querySelector('.weather div');
            icon.innerHTML = `<img src="./assets/${weather.current.weather[0].icon}.svg">`;
            
            let degrees = document.querySelector('.weather p');
            degrees.innerText = `${Math.round(weather.current.temp)}°C`;
            
            let description = document.querySelector('.description');
            description.innerText = `${capDescription}`;

            let date = document.querySelector('.date');
            date.innerText = `${day} de ${month}, ${hour}:${convertMinute()}`

            let feelsLike = document.querySelector('.feels-like');
            feelsLike.innerText = `Sensação térmica: ${Math.round(weather.current.feels_like)}°C`;

            let humidity = document.querySelector('.humidity');
            humidity.innerText = `Umidade: ${weather.current.humidity}%`;

            let wind = document.querySelector('.wind');
            wind.innerText = `Vento: ${weather.current.wind_speed}m/s`;

            let visibility = document.querySelector('.visibility');
            visibility.innerText = `Visibilidade: ${(weather.current.visibility) / 1000}km`;

            let cards = document.querySelector('.cards');

            let daily = '';

            // Responsável por criar os cards de previsões diárias
            weather.daily.forEach((nextDays, data) => {
                if(data == 0) {

                } else {
                    daily += `<div class="card">
                        <p>${new Date(nextDays.dt * 1000).toLocaleString("pt-BR", {weekday: "short"})} ${new Date(nextDays.dt * 1000).toLocaleString("pt-BR", {day: "numeric"})}</p>
                        <div>
                            <img src="./assets/${nextDays.weather[0].icon}.svg" alt="Símbolo da temperatura">
                        </div>
                        <div>
                            <span>${Math.round(nextDays.temp.max)}°</span>
                            <span>${Math.round(nextDays.temp.min)}°</span>
                        </div>
                        <p>${nextDays.weather[0].description}</p>
                        </div>`
                }
            });
            
            cards.innerHTML = daily;
        }
}