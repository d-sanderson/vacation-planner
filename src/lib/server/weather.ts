// Open-Meteo API - completely free, no API key needed

export interface DayWeather {
	date: string;
	high: number;
	low: number;
	morning: PeriodWeather;
	afternoon: PeriodWeather;
	evening: PeriodWeather;
}

export interface PeriodWeather {
	temp: number;
	code: number;
	label: string;
	icon: string;
}

// WMO Weather interpretation codes → label + icon
function decodeWeather(code: number): { label: string; icon: string } {
	if (code === 0) return { label: 'Clear', icon: '☀️' };
	if (code === 1) return { label: 'Mostly Clear', icon: '🌤️' };
	if (code === 2) return { label: 'Partly Cloudy', icon: '⛅' };
	if (code === 3) return { label: 'Overcast', icon: '☁️' };
	if (code >= 45 && code <= 48) return { label: 'Foggy', icon: '🌫️' };
	if (code >= 51 && code <= 55) return { label: 'Drizzle', icon: '🌦️' };
	if (code >= 56 && code <= 57) return { label: 'Freezing Drizzle', icon: '🌧️' };
	if (code >= 61 && code <= 65) return { label: 'Rain', icon: '🌧️' };
	if (code >= 66 && code <= 67) return { label: 'Freezing Rain', icon: '🌧️' };
	if (code >= 71 && code <= 77) return { label: 'Snow', icon: '🌨️' };
	if (code >= 80 && code <= 82) return { label: 'Showers', icon: '🌦️' };
	if (code >= 85 && code <= 86) return { label: 'Snow Showers', icon: '🌨️' };
	if (code >= 95) return { label: 'Thunderstorm', icon: '⛈️' };
	return { label: 'Unknown', icon: '❓' };
}

function avgForHours(
	hourlyTemps: number[],
	hourlyCodes: number[],
	hourlyTimes: string[],
	date: string,
	startHour: number,
	endHour: number
): PeriodWeather {
	const temps: number[] = [];
	const codes: number[] = [];

	for (let i = 0; i < hourlyTimes.length; i++) {
		const t = hourlyTimes[i];
		if (!t.startsWith(date)) continue;
		const hour = parseInt(t.substring(11, 13), 10);
		if (hour >= startHour && hour < endHour) {
			temps.push(hourlyTemps[i]);
			codes.push(hourlyCodes[i]);
		}
	}

	if (temps.length === 0) {
		return { temp: 0, code: 0, label: 'N/A', icon: '—' };
	}

	const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
	// Most frequent weather code for the period
	const codeFreq = new Map<number, number>();
	for (const c of codes) codeFreq.set(c, (codeFreq.get(c) ?? 0) + 1);
	let dominantCode = codes[0];
	let maxFreq = 0;
	for (const [c, f] of codeFreq) {
		if (f > maxFreq) {
			maxFreq = f;
			dominantCode = c;
		}
	}

	const decoded = decodeWeather(dominantCode);
	return { temp: avgTemp, code: dominantCode, ...decoded };
}

async function tryNominatim(query: string): Promise<{ lat: number; lon: number } | null> {
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
			{ headers: { 'User-Agent': 'VacationPlanner/1.0' } }
		);
		const data = await res.json();
		if (data.length > 0) {
			return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
		}
	} catch {
		// ignore
	}
	return null;
}

async function geocode(destination: string): Promise<{ lat: number; lon: number } | null> {
	// Try exact string
	let result = await tryNominatim(destination);
	if (result) return result;

	// Try with commas replaced by spaces (Nominatim prefers spaces)
	result = await tryNominatim(destination.replace(/,/g, ' '));
	if (result) return result;

	// Try first part only (e.g. "Honolulu" from "Honolulu, Oahu, Hawaii")
	const firstPart = destination.split(',')[0].trim();
	if (firstPart !== destination) {
		result = await tryNominatim(firstPart);
		if (result) return result;
	}

	return null;
}

export async function fetchWeather(
	destination: string,
	startDate: string,
	endDate: string
): Promise<DayWeather[]> {
	const coords = await geocode(destination);
	if (!coords) return [];

	const now = new Date();
	const start = new Date(startDate);
	const end = new Date(endDate);

	// Determine which API to use
	const isPast = end < now;
	const isFuture = start > now;
	const isNearFuture = isFuture && (start.getTime() - now.getTime()) / 86400000 < 16;

	let url: string;

	if (isPast) {
		// Historical weather
		url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=fahrenheit`;
	} else if (isNearFuture || !isFuture) {
		// Forecast (covers up to 16 days)
		url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=fahrenheit`;
	} else {
		// Too far in the future — no data available
		return [];
	}

	try {
		const res = await fetch(url);
		if (!res.ok) return [];
		const data = await res.json();

		if (!data.daily || !data.hourly) return [];

		const days: DayWeather[] = [];
		const dailyDates: string[] = data.daily.time;
		const dailyHighs: number[] = data.daily.temperature_2m_max;
		const dailyLows: number[] = data.daily.temperature_2m_min;
		const hourlyTimes: string[] = data.hourly.time;
		const hourlyTemps: number[] = data.hourly.temperature_2m;
		const hourlyCodes: number[] = data.hourly.weather_code;

		for (let i = 0; i < dailyDates.length; i++) {
			const date = dailyDates[i];
			days.push({
				date,
				high: Math.round(dailyHighs[i]),
				low: Math.round(dailyLows[i]),
				morning: avgForHours(hourlyTemps, hourlyCodes, hourlyTimes, date, 6, 12),
				afternoon: avgForHours(hourlyTemps, hourlyCodes, hourlyTimes, date, 12, 18),
				evening: avgForHours(hourlyTemps, hourlyCodes, hourlyTimes, date, 18, 24),
			});
		}

		return days;
	} catch {
		return [];
	}
}
