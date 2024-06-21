import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useActive} from "./useActive";


interface ICityGeolocation {
    name: string,
    state: string,
    country: string,
    lat: number,
    lon: number,
}
export interface ICityGeolocationFilters {
    limit?: string,
    q: string,
}
interface IUseCityGeolocationResponse {
    updateCityGeolocationFilters: Dispatch<SetStateAction<ICityGeolocationFilters>>,
    cityGeolocationFilters: ICityGeolocationFilters,
    getCityGeolocation(props: {filters: ICityGeolocationFilters}): Promise<void>,
    loadingCityGeolocation: boolean,
    cityGeolocation: ICityGeolocation,
}


export function useCityGeolocation(): IUseCityGeolocationResponse {
    const controller = new AbortController();

    // http://api.openweathermap.org/geo/1.0/direct
    // ?q=Alessandria
    // &limit=1
    // &appid={{owm_appid}}
    const URL_API = "https://api.openweathermap.org";
    const KEY_API = "8933d1a13d4ddd84b640f7ac50064db2";
    const URL_API_SERVICE = "geo/1.0/direct";


    const {isActive, setActiveValue, resetActiveValue} = useActive(false);
    const [cityGeolocationFilters, updateCityGeolocationFilters] = useState<ICityGeolocationFilters>({q: '', limit: ''});
    const [cityGeolocation, saveCityGeolocation] = useState<ICityGeolocation>({
        country: "",
        lat: 0,
        lon: 0,
        name: "",
        state: "",
    });


    const getCityGeolocation = async (props: {filters: ICityGeolocationFilters}): Promise<void> => {
        if (!cityGeolocationFilters.q) throw new Error('No ha escrito ningun texto');

        function handleResponseError(err: Error) {
            console.error(err);
            throw new Error('Error when try getting city geolocation');
        }

        const limitDefault = '5';
        const filters = {
            ...props.filters,
            limit: props.filters.limit || limitDefault,
            appid: KEY_API,
        }
        const queryParams = Object.entries(filters);
        const url = new URL(`${URL_API}/${URL_API_SERVICE}`);
        for (const [key, value] of queryParams) {
            url.searchParams.append(key, value);
        }

        // const mockedResponse: ICityGeolocationResponse = {country: "", lat: 2, lon: 3, name: "", state: ""};
        // saveCityGeolocation(mockedResponse);
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
            .then((value: ICityGeolocation[]) => {
                if (!value.length) return;
                saveCityGeolocation(value[0])
            })
            .catch(handleResponseError)
            .finally(resetActiveValue);
    }


    useEffect(() => {
        return () => controller.abort()
    }, []);

    useEffect(() => {
        if(!cityGeolocationFilters.q) return;
        console.log(cityGeolocationFilters);
    }, [cityGeolocationFilters]);

    useEffect(() => {
        if(!cityGeolocation) return;
        console.log(cityGeolocation)
    }, [cityGeolocation]);


    return ({
        updateCityGeolocationFilters,
        cityGeolocationFilters,

        getCityGeolocation,
        loadingCityGeolocation: isActive,

        cityGeolocation,
    });
}