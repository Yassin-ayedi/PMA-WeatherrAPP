import { useState, useEffect } from "react"
import {
  getWeather, getForecast, getCoordinates,
  getAirQuality, getYoutubeVideos,
  getSearches, createSearch
} from "./api"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import WeatherCard from "./components/WeatherCard"
import ForecastCard from "./components/ForecastCard"
import ErrorMessage from "./components/ErrorMessage"
import MapView from "./components/MapView"
import YoutubeVideos from "./components/YoutubeVideos"
import AirQuality from "./components/AirQuality"
import HistoryPanel from "./components/HistoryPanel"

export default function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [coords, setCoords] = useState(null)
  const [videos, setVideos] = useState([])
  const [airQuality, setAirQuality] = useState(null)
  const [searches, setSearches] = useState([])

  async function loadSearches() {
    try {
      const res = await getSearches()
      setSearches(res.data)
    } catch (err) {
      console.error("Could not load search history", err)
    }
  }

  useEffect(() => {
    loadSearches()
  }, [])

  async function onSearch() {
    if (!city.trim()) {
      setError("Please enter a city name")
      return
    }
    setError("")
    setLoading(true)
    try {
      const weatherRes = await getWeather(city)
      setWeather(weatherRes.data)

      const forecastRes = await getForecast(city)
      setForecast(forecastRes.data)

      const coordsRes = await getCoordinates(city)
      setCoords(coordsRes.data)

      const aqRes = await getAirQuality(coordsRes.data.lat, coordsRes.data.lon)
      setAirQuality(aqRes.data)

      const youtubeRes = await getYoutubeVideos(city)
      setVideos(youtubeRes.data)

      await createSearch({
        location: city,
        date_from: new Date().toISOString().split("T")[0],
        date_to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString().split("T")[0]
      })

      loadSearches()

    } catch (err) {
      console.error(err)
      if (err.response?.status === 404) {
        setError("City not found. Try another name or check spelling.")
      } else {
        setError("Something went wrong. Please try again.")
      }
      setWeather(null)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }

  async function onLocationClick() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }
    setError("")
    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude.toFixed(4)
          const lon = position.coords.longitude.toFixed(4)

          const weatherRes = await getWeather(`${lat},${lon}`)
          setWeather(weatherRes.data)
          const detectedCity = weatherRes.data.name
          setCity(detectedCity)

          const forecastRes = await getForecast(detectedCity)
          setForecast(forecastRes.data)

          const coordsRes = await getCoordinates(detectedCity)
          setCoords(coordsRes.data)

          const aqRes = await getAirQuality(lat, lon)
          setAirQuality(aqRes.data)

          const youtubeRes = await getYoutubeVideos(detectedCity)
          setVideos(youtubeRes.data)

          await createSearch({
            location: detectedCity,
            date_from: new Date().toISOString().split("T")[0],
            date_to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString().split("T")[0]
          })

          loadSearches()

        } catch (err) {
          console.error(err)
          setError("Could not fetch weather for your location. Try searching manually.")
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError("Location access denied. Please allow location access.")
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0d1117", color: "#e6edf3", fontFamily: "Inter, sans-serif" }}>

      <Header />

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={onSearch}
        onLocationClick={onLocationClick}
        loading={loading}
      />

      <ErrorMessage error={error} />

      <div style={{ height: "24px" }} />

      <WeatherCard weather={weather} loading={loading} />

      {forecast.length > 0 && (
        <div style={{ margin: "24px 32px 0" }}>
          <p style={{
            color: "#8b949e",
            fontSize: "13px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "16px"
          }}>
            5-Day Forecast
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {forecast.map((day) => (
              <ForecastCard key={day.dt} day={day} />
            ))}
          </div>
        </div>
      )}

      <AirQuality data={airQuality} />

      <MapView coords={coords} locationName={weather?.name} />

      <YoutubeVideos videos={videos} />

      <HistoryPanel searches={searches} onRefresh={loadSearches} />

      <div style={{ height: "48px" }} />

    </div>
  )
}