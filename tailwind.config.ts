
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
			padding: '1rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// ReintegrateME brand colors
				reintegrate: {
					'blue': '#2563eb',      // blue-600
					'blue-light': '#3b82f6', // blue-500
					'blue-dark': '#1d4ed8',  // blue-700
					'orange': '#ea580c',     // orange-600
					'orange-light': '#f97316', // orange-500
					'orange-dark': '#c2410c', // orange-700
					'gray': '#8E9196',
					'light-bg': '#f8fafc',   // slate-50
					'soft-blue': '#dbeafe',  // blue-100
					'soft-orange': '#fed7aa', // orange-200
				},
				// Legacy ReME colors for backward compatibility
				reme: {
					'orange': '#ea580c',     // Updated to match new orange
					'gray': '#8E9196',
					'purple': '#9b87f5',
					'dark-purple': '#1A1F2C',
					'light-purple': '#D6BCFA',
					'light-bg': '#f8fafc',
					'soft-green': '#F2FCE2',
					'soft-yellow': '#FEF7CD',
					'soft-orange': '#fed7aa',
					'soft-purple': '#E5DEFF',
					'soft-pink': '#FFDEE2'
				}
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
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'slide-out-right': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'card-swipe-left': {
					'0%': {
						transform: 'translateX(0) rotate(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(-200%) rotate(-20deg)',
						opacity: '0'
					}
				},
				'card-swipe-right': {
					'0%': {
						transform: 'translateX(0) rotate(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(200%) rotate(20deg)',
						opacity: '0'
					}
				},
				'pulsate': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'card-swipe-left': 'card-swipe-left 0.5s ease-out forwards',
				'card-swipe-right': 'card-swipe-right 0.5s ease-out forwards',
				'pulsate': 'pulsate 1.5s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
