// Import statements
// Interface definitions
export interface Colors {
    bgColors: string[];
    borderColors: string[];
}

// Constants
const bgColors: string[] =
[
    'rgba(0, 153, 204, 0.9)',       // Ball Blue (0)
    'rgba(0, 204, 0, 0.9)',         // green (1)
    'rgba(255, 255, 0, 0.9)',       // yellow (2)
    'rgba(255, 153, 0, 0.9)',       // orange (3)
    'rgba(255, 51, 51, 0.9)',       // red (4)
    'rgba(102, 102, 255, 0.9)',     // blue (5)
    'rgba(30, 30, 255, 0.4)',       // Dull Lavender (6)
    'rgba(0, 135, 245, 0.4)',       // Jeans Blue (7)
    'rgba(50, 210, 50, 0.4)',       // Green Thumb (8)
    'rgba(255, 240, 10, 0.4)',       // Honeysuckle (9)
    'rgba(255, 140, 0, 0.4)',       // Peach Orange (10)
    'rgba(225, 20, 50, 0.4)',       // Pink Rose (11)
    'rgba(200, 50, 255, 0.4)',       // Pale Violet (12)
    'rgba(128, 128, 128, 0.4)',       // Powder Ash (13)
    'rgba(0, 0, 0, 0.4)',       // Dusty Grey (14)
    'rgba(0, 0, 255, 0.6)',       // Blue Lotus (15)
    'rgba(255, 0, 0, 0.6)',       // Tomato (16)
    'rgba(0, 255, 0, 0.6)',       // Light Bright Green (17)
    'rgba(75, 192, 192, 0.4)',       // Powder Blue (18)
    'rgb(220, 20, 60)',     // Crimson (19)
    'rgb(255, 105, 180)',     // HotPink (20)
    'rgb(199, 21, 133)',     // MediumVioletRed (21)
    'rgb(255, 69, 0)',     // OrangeRed (22)
    'rgb(255, 140, 0)',     // DarkOrange (23)
    'rgb(255, 215, 0)',     // Gold (24)
    'rgb(255, 255, 0)',     // Yellow (25)
    'rgb(238, 130, 238)',     // Violet (26)
    'rgb(186, 85, 211)',     // MediumOrchid (27)
    'rgb(148, 0, 211)',     // DarkViolet (28)
    'rgb(128, 0, 128)',     // Purple (29)
    'rgb(173, 255, 47)',     // GreenYellow (30)
    'rgb(50, 205, 50)',     // LimeGreen (31)
    'rgb(0, 255, 127)',     // SpringGreen (32)
    'rgb(32, 178, 170)',     // LightSeaGreen (33)
    'rgb(0, 206, 209)',     // DarkTurquoise (34)
    'rgb(0, 191, 255)',     // DeepSkyBlue (35)
    'rgb(30, 144, 255)',     // DodgerBlue (36)
    'rgb(184, 134, 11)',     // DarkGoldenrod (37)
    'rgb(192, 192, 192)',     // Silver (38)
    'rgb(127, 255, 212)',     // Aquamarine (39)
    'rgba(0, 204, 204, 0.9)',       // turquoise (40)
    'rgb(30, 144, 255)',     // DodgerBlue (41)
    'rgb(220, 20, 60)',     // Crimson (42)
    'rgb(50, 205, 50)',     // LimeGreen (43)
    'rgb(255, 215, 0)',     // Gold (44)
    'rgb(238, 130, 238)',     // Violet (45)
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
    'rgba(0, 153, 0, 1)',       // index 13
    'rgba(204, 204, 0, 1)',
    'rgba(204, 102, 0, 1)',
    'rgba(204, 0, 0, 1)',
    'rgba(51, 51, 204, 1)',
];
const colors: Colors ={
    bgColors,
    borderColors
}
// Component export
export default colors