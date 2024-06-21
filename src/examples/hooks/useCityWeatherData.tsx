import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {WEATHER_ICON} from "./useCityWeatherIcon";
import {useActive} from "./useActive";


interface IUseCityWeatherDataResponse {
    updateCityWeatherDataFilters: Dispatch<SetStateAction<ICityWeatherDataFilters>>,
    cityWeatherDataFilters: ICityWeatherDataFilters,
    getCityWeatherData(props: {filters: ICityWeatherDataFilters}): Promise<void>,
    loadingCityWeatherData: boolean,
    cityWeatherData: ICityWeatherData,
}
export interface ICityWeatherDataFilters {
    lat: number,
    lon: number,
    units?: string,
    lang?: string,
}
interface ICityWeatherData {
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: WEATHER_ICON
        }
    ],
    coord?: {
        "lon": 8.6189,
        "lat": 44.9124
    },
    base?: string,
    main?: {
        "temp": number,
        "feels_like": number,
        "temp_min": number,
        "temp_max": number,
        "pressure": number,
        "humidity": number,
        "sea_level": number,
        "grnd_level": number
    },
    visibility?: number,
    wind?: {
        "speed": number,
        "deg": number,
        "gust": number
    },
    clouds?: {
        "all": number
    },
    dt?: number,
    sys?: {
        "type": number,
        "id": number,
        "country": "IT",
        "sunrise": number,
        "sunset": number
    },
    timezone?: number,
    id?: number,
    name?: string,
    cod?: number,
}


export function useCityWeatherData(): IUseCityWeatherDataResponse {
    const controller = new AbortController();

    // https://api.openweathermap.org/data/2.5/weather
    // ?appid={{owm_appid}}
    // &lat=44.9129069
    // &lon=8.6153899
    // &lang=en
    // &units=metric
    const URL_API = "https://api.openweathermap.org";
    const KEY_API = "8933d1a13d4ddd84b640f7ac50064db2";
    const URL_API_SERVICE = "data/2.5/weather";

    const {isActive, setActiveValue, resetActiveValue} = useActive(false);
    const [cityWeatherDataFilters, updateCityWeatherDataFilters] = useState<ICityWeatherDataFilters>({
        lang: "",
        lat: 0,
        lon: 0,
        units: ""
    });
    const [cityWeatherData, saveCityWeatherData] = useState<ICityWeatherData>({
        weather: [{
            description: "",
            icon: WEATHER_ICON.empty,
            id: 0,
            main: ""
        }]
    });

    const getCityWeatherData = async (props: {filters: ICityWeatherDataFilters}): Promise<void> => {
        function handleResponseError(err: Error) {
            console.error(err);
            throw new Error('Error when try getting city geolocation');
        }

        const unitsDefault = 'metric';
        const langDefault = 'en';
        const {units, lang, lat, lon} = props.filters
        const filters = ({
            ...props.filters,
            units: units || unitsDefault,
            lang: lang || langDefault,
            lat: String(lat),
            lon: String(lon),
            appid: KEY_API,
        });
        const queryParams = Object.entries(filters);
        const url = new URL(`${URL_API}/${URL_API_SERVICE}`);
        for (const [key, value] of queryParams) {
            url.searchParams.append(key, value);
        }

        // const mockedResponse: ICityWeatherDataResponse = {country: "", lat: 2, lon: 3, name: "", state: ""};
        // saveCityWeatherData(mockedResponse);
        // throw new Error('fetch stoped');

        const signal = controller.signal;
        const params: RequestInit = {
            method: "GET",
            headers: new Headers(),
            signal,
        };
        setActiveValue(true);
        const response = await fetch(url, params);
        if(response.ok) await response.json()
            .then((value: ICityWeatherData) => {
                saveCityWeatherData(value)
            })
            .catch(handleResponseError)
            .finally(resetActiveValue);
    }


    useEffect(() => {
        return () => controller.abort()
    }, []);
 
    
    return ({
        updateCityWeatherDataFilters,
        cityWeatherDataFilters,

        getCityWeatherData,
        loadingCityWeatherData: isActive,

        cityWeatherData,
    });
}