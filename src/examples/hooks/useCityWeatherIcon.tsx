import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useActive} from "examples/hooks/useActive";


export enum WEATHER_ICON {
    empty = "",
    clearSkyDay = "01d",
    clearSkyNight = "01n",
    fewCloudsDay = "02d",
    fewCloudsNight = "02n",
    scatteredCloudsDay = "03d",
    scatteredCloudsNight = "03n",
    brokenCloudsDay = "04d",
    brokenCloudsNight = "04n",
    showerRainDay = "09d",
    showerRainNight = "09n",
    rainDay = "10d",
    rainNight = "10n",
    thunderstormDay = "11d",
    thunderstormNight = "11n",
    snowDay = "13d",
    snowNight = "13n",
    mistDay = "50d",
    mistNight = "50n",
}
interface IUseCityWeatherIconResponse {
    updateCityWeatherIconFilters: Dispatch<SetStateAction<ICityWeatherIconFilters>>,
    cityWeatherIconFilters: ICityWeatherIconFilters,
    getCityWeatherIcon(props: {filters: ICityWeatherIconFilters}): Promise<void>,
    loadingCityWeatherIcon: boolean,
    cityWeatherIcon: string,
}
export interface ICityWeatherIconFilters {
    weatherIcon: WEATHER_ICON,
}


export function useCityWeatherIcon(): IUseCityWeatherIconResponse {
    // https://openweathermap.org/img/wn/{{owm_icon}}@2x.png
    const controller = new AbortController();

    const URL_API = "https://openweathermap.org";
    const URL_API_SERVICE = "img/wn";
    
    
    const {isActive, setActiveValue, resetActiveValue} = useActive(false);
    const [cityWeatherIconFilters, updateCityWeatherIconFilters] = useState<ICityWeatherIconFilters>({weatherIcon: WEATHER_ICON.empty});
    const [cityWeatherIcon, saveCityWeatherIcon] = useState<string>("");


    const getCityWeatherIcon = async (props: {filters: ICityWeatherIconFilters}): Promise<void> => {
        function handleResponseError(err: Error) {
            console.error(err);
            throw new Error('Error when try getting city weather icon');
        }

        const {weatherIcon} = props.filters;
        const url = new URL(`${URL_API}/${URL_API_SERVICE}/${weatherIcon}@2x.png`);


        const signal = controller.signal;
        const params: RequestInit = { signal };
        setActiveValue(true);
        const response = await fetch(url, params);
        await response.blob()
            // .then(saveCityWeatherIcon)
            .then((value: Blob)=>saveCityWeatherIcon(URL.createObjectURL(value)))
            .catch(handleResponseError)
            .finally(resetActiveValue);
    }

    useEffect(() => {
        return () => controller.abort();
    }, []);

    
    return ({
        updateCityWeatherIconFilters,
        cityWeatherIconFilters,

        getCityWeatherIcon,
        loadingCityWeatherIcon: isActive,

        cityWeatherIcon,
    });

}