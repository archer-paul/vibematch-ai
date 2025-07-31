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
				corporate: {
					blue: 'hsl(var(--corporate-blue))',
					'blue-light': 'hsl(var(--corporate-blue-light))',
					'blue-dark': 'hsl(var(--corporate-blue-dark))',
					gray: 'hsl(var(--corporate-gray))',
					'gray-light': 'hsl(var(--corporate-gray-light))',
					'gray-dark': 'hsl(var(--corporate-gray-dark))',
					teal: 'hsl(var(--corporate-teal))',
					'teal-light': 'hsl(var(--corporate-teal-light))',
					success: 'hsl(var(--corporate-success))',
					warning: 'hsl(var(--corporate-warning))',
					danger: 'hsl(var(--corporate-danger))'
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
				// Swipe animations
				'swipe-left': {
					'0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateX(-100%) rotate(-15deg)', opacity: '0' }
				},
				'swipe-right': {
					'0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateX(100%) rotate(15deg)', opacity: '0' }
				},
				'swipe-up': {
					'0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
					'100%': { transform: 'translateY(-100%) scale(1.1)', opacity: '0' }
				},
				// Stack animations
				'stack-appear': {
					'0%': { transform: 'scale(0.8) translateY(40px)', opacity: '0' },
					'100%': { transform: 'scale(1) translateY(0)', opacity: '1' }
				},
				'like-pop': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.2)' },
					'100%': { transform: 'scale(1)' }
				},
				'dislike-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' }
				},
				'super-glow': {
					'0%': { boxShadow: '0 0 0 0 hsl(45 95% 55% / 0.7)' },
					'70%': { boxShadow: '0 0 0 20px hsl(45 95% 55% / 0)' },
					'100%': { boxShadow: '0 0 0 0 hsl(45 95% 55% / 0)' }
				},
				// Gamification animations
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 0 0 currentColor' },
					'50%': { boxShadow: '0 0 20px 5px currentColor' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Swipe animations
				'swipe-left': 'swipe-left 0.6s cubic-bezier(0.6, 0, 0.4, 1) forwards',
				'swipe-right': 'swipe-right 0.6s cubic-bezier(0.6, 0, 0.4, 1) forwards',
				'swipe-up': 'swipe-up 0.8s cubic-bezier(0.6, 0, 0.4, 1) forwards',
				'stack-appear': 'stack-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
				// Button feedback
				'like-pop': 'like-pop 0.3s ease-in-out',
				'dislike-shake': 'dislike-shake 0.5s ease-in-out',
				'super-glow': 'super-glow 1.5s ease-out',
				// Gamification
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'pulse-glow': 'pulse-glow 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
