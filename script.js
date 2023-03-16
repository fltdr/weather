var api = (function () {

  const API_KEY = '04f0f323bf7e845c959dc8ccf2bf773f';
  const $form = $('#search-form');
  const $spinner = $form.find('.spinner-border');
  const $history = $('#history');
  const historyData = [];

  const init = () => {
    addSubmitEvent();
  };

  const showSpinner = () => {
    $spinner.removeClass('d-none');
  };

  const hideSpinner = () => {
    $spinner.addClass('d-none');
  };

  const addSubmitEvent = () => {
    $form.on('submit', function () {
      let $this = $(this);
      let city = $this.find('#search-input').val();
      if (city && city.length) {
        showSpinner();
        getCityLatLong(city);
      } else {
        alert('Please enter a valid city...');
        return;
      }
      return false;
    });
  };

  const addHistoryButtonEvent = () => {
    $('.history-button').on('click', function () {
      let $this = $(this);
      let city = $this.val();
      $form.find('#search-input').val(city).submit();
    });
  };

  const appendInHistory = (city) => {
    if (historyData.includes(city)) {
      return;
    }
    historyData.push(city);
    $history.append('<button type="button" class="btn btn-secondary btn-sm history-button" value="' + city + '">' + city + '</button>');
    addHistoryButtonEvent();
  };

  const getCityLatLong = (city) => {
    const API_URL_GET_LAT_LONG = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    //console.log(API_URL_GET_LAT_LONG);
    fetch(API_URL_GET_LAT_LONG)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        if (data.cod == 404) {
          alert(data.message);
          hideSpinner();
          return;
        };
        console.log(data);
        appendInHistory(data.name);
        populateToday(data);
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        getWeatherForecast(lat, lon);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const populateToday = (data) => {
    let $today = $('#today');
    $today.empty();
    let date = moment().format('DD/MM/YYYY');
    let image = '<img src ="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png"/>';
    $today.append('<p class="h1">' + data.name + ' ' + date + image + '</p>');
    $today.append('<p>Temp: ' + data.main.temp + ' &#8451</p>');
    $today.append('<p>Wind: ' + data.wind.speed + ' Km/h</p>');
    $today.append('<p>Humidity: ' + data.main.humidity + '%</p>');
  };

  const getWeatherForecast = (lat, lon) => {
    const API_URL_GET_WEATHER = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    //console.log(API_URL_GET_WEATHER);
    fetch(API_URL_GET_WEATHER)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        hideSpinner();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return { init: init }

})();

$(function () {
  api.init();
});