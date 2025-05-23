/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#e8f5e9',
  				'100': '#c8e6c9',
  				'200': '#a5d6a7',
  				'300': '#81c784',
  				'400': '#66bb6a',
  				'500': '#4caf50',
  				'600': '#43a047',
  				'700': '#388e3c',
  				'800': '#2e7d32',
  				'900': '#1b5e20',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#efebe9',
  				'100': '#d7ccc8',
  				'200': '#bcaaa4',
  				'300': '#a1887f',
  				'400': '#8d6e63',
  				'500': '#795548',
  				'600': '#6d4c41',
  				'700': '#5d4037',
  				'800': '#4e342e',
  				'900': '#3e2723',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': '#fff8e1',
  				'100': '#ffecb3',
  				'200': '#ffe082',
  				'300': '#ffd54f',
  				'400': '#ffca28',
  				'500': '#ffc107',
  				'600': '#ffb300',
  				'700': '#ffa000',
  				'800': '#ff8f00',
  				'900': '#ff6f00',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			success: {
  				'50': '#e8f5e9',
  				'100': '#c8e6c9',
  				'200': '#a5d6a7',
  				'300': '#81c784',
  				'400': '#66bb6a',
  				'500': '#4caf50',
  				'600': '#43a047',
  				'700': '#388e3c',
  				'800': '#2e7d32',
  				'900': '#1b5e20'
  			},
  			warning: {
  				'50': '#fffde7',
  				'100': '#fff9c4',
  				'200': '#fff59d',
  				'300': '#fff176',
  				'400': '#ffee58',
  				'500': '#ffeb3b',
  				'600': '#fdd835',
  				'700': '#fbc02d',
  				'800': '#f9a825',
  				'900': '#f57f17'
  			},
  			error: {
  				'50': '#ffebee',
  				'100': '#ffcdd2',
  				'200': '#ef9a9a',
  				'300': '#e57373',
  				'400': '#ef5350',
  				'500': '#f44336',
  				'600': '#e53935',
  				'700': '#d32f2f',
  				'800': '#c62828',
  				'900': '#b71c1c'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Montserrat',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.5s ease-out',
  			grow: 'grow 0.3s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			grow: {
  				'0%': {
  					transform: 'scale(0.95)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 