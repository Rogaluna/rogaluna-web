const black = '#000000'
const blackRGB = '0, 0, 0';
const white = '#FFFFFF'
const whiteRGB = '255, 255, 255';

const darkRed = '#E53935'
const darkRedRGB = '229, 57, 53';
const darkGrey = '#424242'
const darkGreyRGB = '66, 66, 66';

const themes = {
    dark: {
        primary: darkRed, 
        primaryRGB: darkRedRGB,

        secondary: black, 
        secondaryRGB: blackRGB,

        accent: white,
        accentRGB: whiteRGB,

        split: darkGrey,
        splitRGB: darkGreyRGB,

        deepBackground: black,
        deepBackgroundRGB: blackRGB,
        
        lightBackground: white,
        lightBackgroundRGB: whiteRGB,
    },
}

export default themes;