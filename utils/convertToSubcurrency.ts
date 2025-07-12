export const convertToSubcurrency : (amount: number, factor?: number) => number =  (amount: number, factor = 100) => {
    return Math.round(amount * factor);
};
