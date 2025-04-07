
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
				// Cyberpunk theme colors
				cyber: {
					'black': '#1A1F2C',
					'dark': '#222222',
					'purple': {
						light: '#9b87f5',
						DEFAULT: '#7E69AB',
						dark: '#6E59A5'
					},
					'blue': '#1EAEDB',
					'orange': '#F97316',
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
				'pulse-glow': {
					'0%, 100%': {
						opacity: '1',
						filter: 'brightness(100%) blur(0px)'
					},
					'50%': {
						opacity: '0.8',
						filter: 'brightness(130%) blur(1px)'
					}
				},
				'scan-line': {
					'0%': { 
						transform: 'translateY(0)',
						opacity: '0.5'
					},
					'100%': { 
						transform: 'translateY(100%)',
						opacity: '0'
					}
				},
				'data-stream': {
					'0%': { 
						transform: 'translateY(-100%)'
					},
					'100%': { 
						transform: 'translateY(100%)'
					}
				},
				'glitch': {
					'0%, 100%': { 
						transform: 'translateX(0)'
					},
					'5%, 25%, 45%, 65%, 85%': { 
						transform: 'translateX(-2px)'
					},
					'10%, 30%, 50%, 70%, 90%': { 
						transform: 'translateX(2px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'scan-line': 'scan-line 3s linear infinite',
				'data-stream': 'data-stream 7s linear infinite',
				'glitch': 'glitch 0.5s ease-in-out infinite',
			},
			boxShadow: {
				'neon-purple': '0 0 5px theme("colors.cyber.purple.light"), 0 0 20px theme("colors.cyber.purple.light")',
				'neon-blue': '0 0 5px theme("colors.cyber.blue"), 0 0 20px theme("colors.cyber.blue")',
				'neon-orange': '0 0 5px theme("colors.cyber.orange"), 0 0 20px theme("colors.cyber.orange")',
			},
			backgroundImage: {
				'cyber-grid': 'linear-gradient(to right, #222222 1px, transparent 1px), linear-gradient(to bottom, #222222 1px, transparent 1px)',
				'cyber-gradient': 'linear-gradient(135deg, rgba(155, 135, 245, 0.1) 0%, rgba(30, 174, 219, 0.05) 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
