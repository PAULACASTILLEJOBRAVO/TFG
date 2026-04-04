import { 
    searchDictionary, 
    roleMap,
    statusMap,
    difficultyMap
} from "./constants";

export const normalizeWord = (word) => {
    word = word.toLowerCase();

    for (const key in searchDictionary) {
        if (searchDictionary[key].includes(word)) {
            return key; 
        }
    }

    return word;
}

export const matchesRole = (role, word) => {
  const variants = roleMap[role] || [role];

  return variants.some(variant =>
    variant.toLowerCase().includes(word)
  );
}

export const matchesStatus = (status, word) => {
    const variants = statusMap[status] || [status];

    return variants.some(variant =>
        variant.toLowerCase().includes(word)
    );
}

export const matchesDifficulty = (difficulty, word) => {
    const variants = difficultyMap[difficulty] || [difficulty];

    return variants.some(variant =>
        variant.toLowerCase().includes(word)
    );
}