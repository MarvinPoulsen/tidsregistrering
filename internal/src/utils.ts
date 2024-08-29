/**
 * @description
 * Denne funktion tager et tal som input og formaterer det til en mere læsevenlig form ved hjælp af Intl.NumberFormat. For eksempel vil 1000 blive formateret som 1,000 (afhængigt af lokaliteten).
 */
export const toPrettyNumber = (numValue) => {
    return new Intl.NumberFormat().format(numValue);
};

/**
 * @description
 * Denne funktion konverterer et totalt antal minutter til et format med timer og minutter (hh:mm). For eksempel vil 125 minutter blive konverteret til 02:05.
 */
export const toHoursAndMinutes = (totalMinutes) => {
    const sign = Math.sign(totalMinutes) < 0 ? '-' : '';
    const absMinutes = Math.abs(totalMinutes);
    const minutes = absMinutes % 60;
    const hours = Math.floor(absMinutes / 60);
    const tekst = `${sign}${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;

    return tekst;
};

/**
 * @description
 * Denne funktion tager et tal som input og returnerer en streng, der er nuludfyldt til to cifre. For eksempel vil 5 blive konverteret til 05.
 */
export const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
};

/**
 * @description
 * Denne funktion beregner overlappet i minutter mellem to tidsintervaller.
 */
export const overlapMinutes = (interval1Start, interval1End, interval2Start, interval2End) => {
    const start = interval1Start > interval2Start ? interval1Start : interval2Start;
    const end = interval1End < interval2End ? interval1End : interval2End;
    const overlap = start < end ? (end - start) / (1000 * 60) : 0; // Convert milliseconds to minutes

    return overlap;
};
