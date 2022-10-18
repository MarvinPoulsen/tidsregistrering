export interface Colors {
    bgColors: string[];
    borderColors: string[];
}

const bgColors: string[] =
    [
        'rgba(30, 30, 255, 0.4)',
        'rgba(0, 135, 245, 0.4)',
        'rgba(50, 210, 50, 0.4)',
        'rgba(255, 240, 10, 0.4)',
        'rgba(255, 140, 0, 0.4)',
        'rgba(225, 20, 50, 0.4)',
        'rgba(200, 50, 255, 0.4)',
        'rgba(128, 128, 128, 0.4)',
        'rgba(0, 0, 0, 0.4)',
        'rgba(0, 0, 255, 0.6)',
        'rgba(255, 0, 0, 0.6)',
        'rgba(0, 255, 0, 0.6)',
        'rgba(75, 192, 192, 0.4)',
    ];
const borderColors: string[] =
    [
        'rgba(30, 30, 255, 1)',
        'rgba(0, 135, 245, 1)',
        'rgba(50, 210, 50, 1)',
        'rgba(255, 240, 10, 1)',
        'rgba(255, 140, 0, 1)',
        'rgba(225, 20, 50, 1)',
        'rgba(200, 50, 255, 1)',
        'rgba(128, 128, 128, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(75, 192, 192, 1)',
    ];

const colors: Colors ={
    bgColors,
    borderColors
}

export default colors