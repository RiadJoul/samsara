/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Montreal', "sans-serif"],
       },
      colors: {
        'primary': '#FFBF52',
        'primary-focus': '#F7851C'
      },

      keyframes: {
        floating: {
            '0%': {
                transform: 'translatey(0px)'
            },
            '50%': {
                transform: 'translatey(-10px)'
            },
            '100%': {
               transform: 'translatey(0px)'
            }
        },
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },

        type: {
          '0%': { width: '0ch' },
          '5%, 10%': { width: '1ch' },
          '15%, 20%': { width: '2ch' },
          '25%, 30%': { width: '3ch' },
          '35%, 40%': { width: '4ch' },
          '45%, 50%': { width: '5ch' },
          '55%, 60%': { width: '6.5ch' },
          '65%, 70%': { width: '8.5ch' },
          '75%, 80%': { width: '8ch' },
          '85%, 90%': { width: '8ch' },
          '95%': { width: '8ch' },
        },


        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)'
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)'
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)'
          },
        }

        
        },
        animation: {
            //floating animation
            floating: 'floating 2s ease-in-out infinite',

            //text colors change animation
            text: 'text 3s ease infinite',

            //typing animation
            cursor: 'cursor .6s linear infinite alternate',
            type: 'type 1.8s ease-out .3s 1 normal both',
            'type-reverse': 'type 1.8s ease-out 0s infinite alternate-reverse both',

            //shake animation
            shake: 'shake 0.82s cubic-bezier(.36, .07, .19, .97) both'
        }
    },
  },
  plugins: [],
}
