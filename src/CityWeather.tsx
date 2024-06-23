import React, {ChangeEvent, useEffect} from 'react';
import logo from 'logo.svg';
import "CityWeather.scss";
import {useCityGeolocation} from "examples/hooks/useCityGeolocation";
import {useCityWeatherData} from 'examples/hooks/useCityWeatherData';
import {useCityWeatherIcon} from 'examples/hooks/useCityWeatherIcon';


function CityWeather() {
    // implementando hook para logica adicional compartida
    const {
        updateCityGeolocationFilters,
        cityGeolocationFilters,
        getCityGeolocation,
        loadingCityGeolocation,
        cityGeolocation,
    } = useCityGeolocation();
    const {
        getCityWeatherData,
        loadingCityWeatherData,
        cityWeatherData,
    } = useCityWeatherData();
    const {
        getCityWeatherIcon,
        loadingCityWeatherIcon,
        cityWeatherIcon,
    } = useCityWeatherIcon();
    const {name, state, country, lat, lon} = cityGeolocation;

    const componentDidUnmount = () => {
        console.log("componentDidUnmount");
    }


    const handleOnChangeInput = (ev: ChangeEvent<HTMLInputElement>): void => {
        updateCityGeolocationFilters({q: ev.target.value, limit: '1'});
    }

    const handleOnClickButtonFind = (): void => {
        getCityGeolocation({filters:cityGeolocationFilters})
            .catch((err: Error) => console.error(err.message));
    }


    useEffect(() => {
        return () => componentDidUnmount();
    }, []);

    useEffect(() => {
        const {lat, lon} = cityGeolocation;
        if (!!lat && !!lon) getCityWeatherData({filters:{lat, lon}})
    }, [cityGeolocation.lat, cityGeolocation.lon]);

    useEffect(() => {
        const {icon: weatherIcon} = cityWeatherData.weather[0];
        if (!!weatherIcon) getCityWeatherIcon({filters: {weatherIcon}});
    }, [cityWeatherData?.weather[0]?.icon]);




    return (
        <div className="App">
            <header className="App-header">
                <h1>{cityGeolocationFilters.q || "Input the 'city name' to find"}</h1>
                <input
                    type={'text'}
                    onChange={handleOnChangeInput}
                />
                <input
                    className="App-input"
                    value={"FIND"}
                    type={'button'}
                    onClick={handleOnClickButtonFind}
                />
                <div>
                    <span>{name}</span>
                    {state && <span>, {state}</span>}
                    {country && <span>, {country}</span>}
                </div>
                <p>{!!lat ?
                        "Latitud:" + String(lat) : " "}</p>
                <p>{!!lon ?
                        "Longitud:" + String(lon) : " "}</p>

                {(loadingCityGeolocation || loadingCityWeatherData || loadingCityWeatherIcon) ?
                    <img src={logo} className="App-logo" alt="reactSpiner"/> : null}

                {cityWeatherIcon ?
                    <img src={cityWeatherIcon} className="" alt="cityWeatherIcon"/> :
                    null}
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <footer>
                {"FOOTER"}
            </footer>
        </div>
    );
}


export default CityWeather;
