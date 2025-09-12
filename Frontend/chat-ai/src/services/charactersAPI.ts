import { json } from "stream/consumers";
import { openLoadingModal, closeLoadingModal, showResponseMessage } from "../app/lib/alert";
import config from "../includes/config";
import { log } from "console";

// add character
export const createCharacter = async(data: FormData) => {
    openLoadingModal();
    const res = await fetch(`${config.BACKENDSITEURL}/characters`, 
        {
            method: "POST",
            body: data,
        }
    )

    const result = await res.json();
    
    closeLoadingModal();

    await showResponseMessage(result.response_code, result.response_message);
    return result;
}

// list character
export const getCharacters = async () => {
    const res = await fetch(`${config.BACKENDSITEURL}/characters/`)
    const result = await res.json();

    if (!result.response_code) {
        throw new Error(result.response_message || "Failed to fetch characters.");
    }

    console.log(result.response_data);
    
    return result.response_data;
}

// edit character
export const getCharacterById = async (id: number) => {
    const res = await fetch(`${config.BACKENDSITEURL}/characters/${id}`);
    const result = await res.json();

    if (!result.response_code) {
        throw new Error(result.response_message || "Failed to fetch character details");
    }
    return result.response_data;
}

export const updateCharacter = async (id: number, data: FormData) => {
    openLoadingModal();
    const res = await fetch(`${config.BACKENDSITEURL}/characters/${id}`, {
        method: "PUT",
        body: data
    });

    const result = await res.json();
    closeLoadingModal();

    await showResponseMessage(result.response_code, result.response_message);
    return result;

}

export const deleteCharacter = async (id: number) => {
    const res = await fetch(`${config.BACKENDSITEURL}/characters/${id}`, {
        method: "DELETE",
    })
    
    const result = await res.json();
    if (!result.response_code) {
        throw new Error(result.response_message || "Delete failed.");
    }
    return  result;
}