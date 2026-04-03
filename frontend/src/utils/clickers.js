export const HexadecimalToDecimal = (hexadecimal) => {
  return parseInt(hexadecimal, 16);
};

export const DecimalToHexadecimal = (decimal) => {
  const hexadecimal = decimal.toString(16).padStart(4, '0'); // Convert decimal to hexadecimal and pad with zeros to ensure it's 6 characters long

  return '0x' + hexadecimal;
};
