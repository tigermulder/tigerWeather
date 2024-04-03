import React, { useState, useEffect, useRef } from 'react';
import './WeatherApp.css';
import axios from 'axios';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import humidity_icon from '../Assets/humidity.png';
import rain_icon from '../Assets/rain.png';
import search_icon from '../Assets/search.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';

const WeatherApp = () => {
  const api_key = "28bb27095ecff6fa8ec2a08e1a7298b7";
  const [wicon, setWicon] = useState(cloud_icon);
  const [weatherData, setWeatherData] = useState({
    humidity: null,
    windSpeed: null,
    temperature: null,
    location: null,
    weatherIcon: null,
  });
  const cityInputRef = useRef();

  async function fetchData(cityName){
    try {
      let response = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=Metric&appid=${api_key}`;
      let jsonData = await axios.get(response);
      let data = jsonData.data;
      const { main, wind, name, weather } = data;
      setWeatherData({
        humidity: `${main.humidity} %`,
        windSpeed: `${Math.floor(wind.speed)} Km/h`,
        temperature: `${Math.floor(main.temp)}°c`,
        location: name,
        weatherIcon: weather[0].icon,
      });
      // 날씨 아이콘 업데이트
      updateWeatherIcon(weather[0].icon);
    } catch (error) {
      if (error.response) {
        // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
        console.log(error.response.status);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답이 수신되지 않았습니다. 
        // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
        // node.js에서는 http.ClientRequest 인스턴스입니다.
        console.log(error.request);
      } else {
        // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
        console.log('Error', error.message);
      }
    }
  }

  function updateWeatherIcon(iconCode){
    switch (iconCode) {
      case "01d":
      case "01n":
        setWicon(clear_icon);
        break;
      case "02d":
      case "02n":
      case "03d":
      case "03n":
        setWicon(cloud_icon);
        break;
      case "04d":
      case "04n":
        setWicon(drizzle_icon);
        break;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        setWicon(rain_icon);
        break;
      case "13d":
      case "13n":
        setWicon(snow_icon);
        break;
      default:
        setWicon(clear_icon);
        break;
    }
  }

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 서울의 날씨 정보를 가져옴
    fetchData('Seoul');
  }, []);

  const handleSearch = () => {
    const cityName = cityInputRef.current.value;
    fetchData(cityName);
  };

  return (
    <div className="container">
      <div className='top-bar'>
        <input ref={cityInputRef} type="text" className='cityInput' placeholder='Search'/>
        <div className="search-icon" onClick={handleSearch}>
            <img src={search_icon} alt="" />
        </div>
      </div>
      <div className="wearther-image">
        <img src={wicon} alt="" />
      </div>
      <div className="weather-temp">{weatherData.temperature || 'N/A'}</div>
      <div className="weather-location">{weatherData.location || 'N/A'}</div>
      <div className="data-container">
        <div className="element">
            <img src={humidity_icon} alt="" className='icon'/>
            <div className="data">
                <div className="humidity-percent">{weatherData.humidity || 'N/A'}</div>
                <div className="text">습도</div>
            </div>
        </div>
        <div className="element">
            <img src={wind_icon} alt="" className='icon'/>
            <div className="data">
                <div className="wind-rate">{weatherData.windSpeed || 'N/A'}</div>
                <div className="text">풍량</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
