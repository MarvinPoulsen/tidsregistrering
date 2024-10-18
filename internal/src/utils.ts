import { add, differenceInDays, getDay, isSameDay } from "date-fns";

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



/**
 * @description
 * Denne funktion beregner flex, ferie og sygdom for en given periode. den tager en startdato, slutdato, data, helligdage og normtal som input.
 */
export const getPeriodData = (startDate: Date, endDate: Date, data, holidays, norms) => {
    let flexStatus: number = 0;
    let vacation: number = 0;
    let illness: number = 0;
    let normTime: number = 0;

    const daysInPeriod = differenceInDays(endDate,startDate)
    let currentDate = new Date(startDate);
    for (let i = 0; i <= daysInPeriod; i++){
        const filteredByDate = data.filter((item) => isSameDay(item.resource ? item.resource.taskDate : item.taskDate, currentDate));
        const isVacation = filteredByDate.filter((item) => item.resource ? item.resource.taskId === 24 : item.taskId === 24);
        const isIllness = filteredByDate.filter((item) => item.resource ? item.resource.taskId === 27 : item.taskId === 27);
        const isWork = filteredByDate.filter((item) => item.resource ? item.resource.taskId !== 27 && item.resource.taskId !== 24 && item.resource.taskId !== 26 : item.taskId !== 27 && item.taskId !== 24 && item.taskId !== 26);
        const workTime = isWork.reduce((total, currentItem) => (total = total + (currentItem.resource ? currentItem.resource.taskTime || 0 : currentItem.taskTime || 0)), 0);
        const illnessTime = isIllness.reduce((total, currentItem) => (total = total + (currentItem.resource ? currentItem.resource.taskTime || 0 : currentItem.taskTime || 0)), 0);
        // const isFuture = new Date() < currentDate || isSameDay(currentDate, new Date());
        const isFuture = new Date() < currentDate;
        const holiday = holidays.find((item) => isSameDay(item.start, currentDate));
        const dayNo = getDay(currentDate);
        const norm = norms[dayNo];
        let normDeviation = null;

        if (isVacation.length > 0) {
            isVacation.forEach((item) => {
                const vacationStart = new Date(item.taskStart);
                const vacationEnd = new Date(item.taskEnd);
                const normStart = norm > 0 ? new Date(currentDate.setHours(8, 0, 0, 0)) : currentDate;
                const normEnd = norm > 0 ? add(normStart, { minutes: norm }) : currentDate;
                const vacationTime = overlapMinutes(normStart, normEnd, vacationStart, vacationEnd);

                if (vacationTime > 0 && item.allDay === 'false') {
                    vacation += vacationTime;
                    const newNorm = norm - vacationTime;
                    if (workTime > newNorm) {
                        flexStatus += workTime - newNorm;
                    } else {
                        flexStatus -= newNorm - workTime;
                    }
                } else {
                    flexStatus += workTime;
                    vacation += norm;
                }
            });
        } else if (holiday) {
            if (holiday.allDay) {
                flexStatus += workTime;
                normDeviation = 0;
            } else {
                const holidayWorkTime = norm > holiday.workTime ? holiday.workTime : norm;
                normDeviation = holidayWorkTime;
                if (holidayWorkTime < workTime) {
                    const flex = workTime - holidayWorkTime;
                    flexStatus += flex;
                } else {
                    const flex = isFuture
                        ? 0
                        : illnessTime > holidayWorkTime - workTime
                        ? 0
                        : holidayWorkTime - workTime - illnessTime;
                    flexStatus -= flex;
                }
            }
        } else {
            if (norm < workTime) {
                const flex = workTime - norm;
                flexStatus += flex;
            } else {
                const flex = isFuture ? 0 : illnessTime > norm - workTime ? 0 : norm - workTime - illnessTime;
                flexStatus -= flex;
            }
        }
        illness += illnessTime;
        normTime += normDeviation !== null ? normDeviation : norm;
        currentDate = add(currentDate, { days: 1 });
    }

    return { flex: flexStatus, vacation, illness, normTime };
};