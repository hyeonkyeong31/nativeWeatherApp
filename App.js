import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

const API_KEY = "551d7941ef7f8e2afd00ea0657c07d52";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
export default function App() {
	const [city, setCity] = useState("Loading..");
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);
	const getWeather = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();
		if (!granted) {
			setOk(false);
		}
		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync();
		const location = await Location.reverseGeocodeAsync(
			{ latitude, longitude },
			{ useGoogleMaps: false }
		);
		setCity(location[0].city);
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
		);
		const json = await response.json();
		setDays(json.list);
	};
	useEffect(() => {
		getWeather();
	}, []);
	const koreanOffset = 9 * 60 * 60 * 1000;
	return (
		<View style={styles.container}>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				pagingEnabled
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.weather}
			>
				{days.length === 0 ? (
					<View style={styles.day}>
						<ActivityIndicator color="white" size="large" />
					</View>
				) : (
					days.map((day, idx) => (
						<View key={idx} style={styles.day}>
							<Text style={styles.date}>
								{new Date(day.dt * 1000).toLocaleDateString(
									"ko-KR"
								)}
							</Text>
							<Text style={styles.temp}>
								{parseFloat(day.main.temp).toFixed(1)}
							</Text>
							<Text style={styles.description}>
								{day.weather[0].main}
							</Text>
							<Text style={styles.tinyText}>
								{day.weather[0].description}
							</Text>
						</View>
					))
				)}
			</ScrollView>
			<StatusBar style="light" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0693E3" },
	city: {
		flex: 1.2,
		justifyContent: "center",
		alignItems: "center",
	},
	cityName: {
		fontSize: 68,
		fontWeight: "500",
	},
	weather: {},
	day: {
		width: SCREEN_WIDTH,
		alignItems: "center",
	},
	temp: {
		marginTop: 50,
		fontSize: 170,
	},
	description: {
		marginTop: -30,
		fontSize: 60,
	},
	tinyText: {
		fontSize: 20,
	},
	date: {
		marginBottom: -50,
		fontSize: 25,
		color: "white",
	},
});
