# assignment 1 - Multi-API Dashboard

## Group Members

- Ahmed Zaki - 1213413

- Shahd Wasel - 1211873

## Project Description


This project is a React-built application. It connects to several RESTful web service APIs.

The application, called Multi-API Dashboard, allows the user to:

- Search for current weather information based on city name

- Convert currencies

- Search for additional information about a specific country

This project demonstrates how to connect to REST APIs from a front-end application using the JavaScript Fetch API, receive JSON responses, handle potential errors, and display the received data in the user interface.

## APIs Used

### 1. Open-Meteo Geolocation API

API Provider: Open-Meteo

Purpose:
This API converts a user-entered city name into its latitude and longitude coordinates.

HTTP Method:
GET

Endpoint:
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1

Example:
https://geocoding-api.open-meteo.com/v1/search?name=London&count=1

User Input:
City Name

Returned Data:
- City Name
- Country
- Latitude
- Longitude
- Time Zone

---

### 2. Open-Meteo Weather Forecast API

API Provider: Open-Meteo

Purpose:
This API returns current weather data based on latitude and longitude.

HTTP Method:
GET

Endpoint:

https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto

Example:

https://api.open-meteo.com/v1/forecast?latitude=51.50853&longitude=-0.12574&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto

Retrieved Data:

- Temperature
- Relative Humidity
- Wind Speed
- Weather Code
- Weather Condition (Day/Night)
- Last Updated Time

---

### 3. Frankfurter Currency API

Service Provider: Frankfurter

Purpose:

This API is designed to retrieve the exchange rate of two different currencies. The amount is calculated after conversion within a React application.

HTTP Method:
GET

Endpoint:

https://api.frankfurter.dev/v2/rate/{fromCurrency}/{toCurrency}

Example:

https://api.frankfurter.dev/v2/rate/USD/EUR

User Input:

- Amount
- Source Currency
- Destination Currency

Returned Data:

- Exchange Rate
- Exchange Rate History

Amount to Calculate:

Converted Amount = Amount × Exchange Rate

---

### 4. Country REST API

Service Provider: REST Countries

Purpose:

This API is designed to retrieve information about a country using its name.

HTTP Method:
GET

Endpoint:
https://restcountries.com/v3.1/name/{countryName}?fields=name,capital,region,subregion,population,flags,currencies,languages,timezones,maps

Example:

https://restcountries.com/v3.1/name/germany?fields=name,capital,region,subregion,population,flags,currencies,languages,timezones,maps

User Input:

- Country Name

Retrieved Data:

- Common Name
- Official Name
- Capital
- Region
- Subregion
- Population
- Flag
- Currencies
- Languages
- Time Zones
- Google Maps Link


---

### 5. TheMealDB Meals API

Service Provider: TheMealDB

Purpose:
The API allows searching for recipes of meals based on meal names.

HTTP Method:
GET

Endpoint:
https://www.themealdb.com/api/json/v1/1/search.php?s={mealName}

Example:
https://www.themealdb.com/api/json/v1/1/search.php?s=pasta

Input from User:
- Meal name

Data Received from API:
- Meal name
- Category
- Cuisine
- Instructions
- Image of meal
- Tags
- YouTube video link
- Source link
- Ingredients
- Measure

---

### 6. TVMaze TV Shows API

Service Provider: TVMaze

Purpose:
This API enables users to look up details of TV shows by show names.

HTTP Method:
GET

Endpoint:
https://api.tvmaze.com/singlesearch/shows?q={showName}&embed[]=cast&embed[]=seasons

Example:
https://api.tvmaze.com/singlesearch/shows?q=Breaking%20Bad&embed[]=cast&embed[]=seasons

Input from User:
- TV show name

Data Received from API:
- Show name
- Type
- Language
- Status
- Premiere date
- End date
- Rating
- Genres
- Summary
- Network
- Country
-Poster image
- Runtime
- Cast
- Number of seasons
- Schedule


## Features

- Homepage with Navigation Cards
- Weather Search using City Names
- Currency Conversion using Exchange Rates
- Country Information Search
- Displays Loading Messages when fetching data from APIs (Application Programming Interfaces) Applications)
- Error messages for incorrect inputs and error responses
- User-friendly and responsive application
- Displays API responses using structured scoreboards

## Technologies Used

- React
- Vite
- React Router DOM
- JavaScript
- Fetch API
- CSS
- Public REST APIs

