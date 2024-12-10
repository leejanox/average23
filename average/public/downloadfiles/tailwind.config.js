/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      "fontFamily":{
        "Ubuntu":"Ubuntu",
        "cute":"cute"
      },
      "backgroundImage":{
        "mainBG":"url(images/mainBG.jpg)",
        "loginBG":"url(images/loginBG.jpg)"
      },
    },
  },
  plugins: [],
}

