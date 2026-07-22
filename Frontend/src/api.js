import axios from "axios"

const BASE_URL = "http://localhost:5000/api"

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// ── WEATHER ────────────────────────────────────────────
export const getWeather = (location) =>
  api.get(`/weather?location=${location}`)

export const getForecast = (location) =>
  api.get(`/forecast?location=${location}`)

export const getCoordinates = (location) =>
  api.get(`/coordinates?location=${location}`)

// ── AIR QUALITY ────────────────────────────────────────
export const getAirQuality = (lat, lon) =>
  api.get(`/airquality?lat=${lat}&lon=${lon}`)

// ── YOUTUBE ────────────────────────────────────────────
export const getYoutubeVideos = (location) =>
  api.get(`/youtube?location=${location}`)

// ── CRUD ───────────────────────────────────────────────
export const getSearches = () =>
  api.get("/searches")

export const createSearch = (data) =>
  api.post("/searches", data)

export const updateSearch = (id, data) =>
  api.put(`/searches/${id}`, data)

export const deleteSearch = (id) =>
  api.delete(`/searches/${id}`)

// ── EXPORT ─────────────────────────────────────────────
export const getExportUrl = (format) =>
  `${BASE_URL}/export/${format}`