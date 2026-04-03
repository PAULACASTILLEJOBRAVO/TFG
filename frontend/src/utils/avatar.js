export const stringToHlsColor = (str, lightness = 55) => {
    let hash = 0;

    [...str].forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, ${lightness}%)`;
}

export const getInitials = (name) => {
    if(!name) return "?";

    const words = name.trim().split(" ");

    if (words.length === 1) return words[0][0].toUpperCase();
    
    return (words[0][0] + words[1][0]).toUpperCase();
}