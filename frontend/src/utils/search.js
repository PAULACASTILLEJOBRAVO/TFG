import { searchDictionary } from "./constants";

export const normalizeWord = (word) => {
    word = word.toLowerCase();

    for (const key in searchDictionary) {
        if (searchDictionary[key].includes(word)) {
            return key; 
        }
    }

    return word;
}