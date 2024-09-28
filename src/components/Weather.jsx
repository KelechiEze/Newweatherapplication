import React, { useState, useEffect, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if(city === ""){
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert(`Error: ${data.message}`);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, // Use actual URL for image
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    search('London');
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const city = inputRef.current.value;
      search(city);
    }
  };

  const handleSendEmail = async () => {
    if (!weatherData || !email) {
      alert('Please enter a valid email and search for a city.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          location: weatherData.location,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          windSpeed: weatherData.windSpeed,
          icon: weatherData.icon, // Ensure 'icon' is being sent
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message); // Set success message from server response
        alert(result.message); // Optional alert for success
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || 'Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          ref={inputRef}
          placeholder="Search"
          onKeyPress={handleSearch}
        />
        <img src={search_icon} alt="Search Icon" onClick={() => search(inputRef.current.value)} />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Icon" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          <div className="email-form">
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="send-button" onClick={handleSendEmail}>Send Weather Report</button>
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        </>
      )}
    </div>
  );
};

export default Weather;
