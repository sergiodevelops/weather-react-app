import {useState} from "react";


export function useActive(initialState?: boolean) {
    const [isActive, updateIsActive] = useState<boolean>(initialState || false);


    const setActiveValue = (value: boolean) => updateIsActive(value);
    const toogleActiveValue = () => updateIsActive(!isActive);
    const resetActiveValue = () => updateIsActive(initialState || false);


    return ({
        isActive,
        setActiveValue,
        toogleActiveValue,
        resetActiveValue,
    });
}
