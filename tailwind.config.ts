
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'questrial': ['Questrial', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'neon-blue': '#4de9d8',
				'bronze-dark': '#3b302a',
				'metal-blue': '#1e40af',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-neon': {
					'0%, 100%': {
						boxShadow: '0 0 5px #4de9d8, 0 0 10px #4de9d8, 0 0 15px #4de9d8'
					},
					'50%': {
						boxShadow: '0 0 10px #4de9d8, 0 0 20px #4de9d8, 0 0 30px #4de9d8'
					}
				},
				'spectrum-wave': {
					'0%, 100%': { transform: 'scaleY(0.3)' },
					'50%': { transform: 'scaleY(1)' }
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow': {
					'0%, 100%': {
						textShadow: '0 0 5px #4de9d8, 0 0 10px #4de9d8'
					},
					'50%': {
						textShadow: '0 0 10px #4de9d8, 0 0 20px #4de9d8, 0 0 30px #4de9d8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
				'spectrum-wave': 'spectrum-wave 0.5s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'glow': 'glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-metal': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
				'gradient-dark': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
