
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
				// Veloblanco specific colors
				spectrum: {
					left: 'hsl(var(--spectrum-left))',
					center: 'hsl(var(--spectrum-center))',
					right: 'hsl(var(--spectrum-right))'
				},
				neutrality: {
					high: 'hsl(var(--neutrality-high))',
					medium: 'hsl(var(--neutrality-medium))',
					low: 'hsl(var(--neutrality-low))'
				},
				// Dynamic geometric colors
				geometric: {
					primary: 'hsl(var(--geometric-primary))',
					secondary: 'hsl(var(--geometric-secondary))',
					accent: 'hsl(var(--geometric-accent))',
					surface: 'hsl(var(--geometric-surface))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Geometric border radius
				'xl': '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
				'asymmetric': '0.75rem 1.5rem 0.75rem 1.5rem',
				'skewed': '0.5rem 1rem 0.5rem 1rem',
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
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px hsl(var(--primary))' },
					'50%': { boxShadow: '0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))' }
				},
				// Geometric animations
				'geometric-float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-20px) rotate(2deg)' }
				},
				'geometric-spin': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'50%': { transform: 'rotate(180deg) scale(1.05)' },
					'100%': { transform: 'rotate(360deg) scale(1)' }
				},
				'skew-hover': {
					'0%': { transform: 'skewX(0deg) skewY(0deg)' },
					'100%': { transform: 'skewX(-2deg) skewY(1deg)' }
				},
				'morph-shape': {
					'0%': { borderRadius: '0.75rem' },
					'33%': { borderRadius: '0.75rem 1.5rem 0.75rem 1.5rem' },
					'66%': { borderRadius: '1.5rem 0.75rem 1.5rem 0.75rem' },
					'100%': { borderRadius: '0.75rem' }
				},
				'depth-shadow': {
					'0%': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
					'100%': { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
				},
				'parallax-bg': {
					'0%': { transform: 'translateX(-100%) translateY(-50%) rotate(45deg)' },
					'100%': { transform: 'translateX(100%) translateY(-50%) rotate(45deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				// Geometric animations
				'geometric-float': 'geometric-float 6s ease-in-out infinite',
				'geometric-spin': 'geometric-spin 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
				'skew-hover': 'skew-hover 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'morph-shape': 'morph-shape 4s ease-in-out infinite',
				'depth-shadow': 'depth-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'parallax-bg': 'parallax-bg 20s linear infinite',
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
			},
			// Geometric transforms
			transform: {
				'skew-1': 'skewX(-1deg) skewY(1deg)',
				'skew-2': 'skewX(-2deg) skewY(1deg)',
			},
			// Enhanced shadows for depth
			boxShadow: {
				'geometric': '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
				'geometric-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
				'inner-geometric': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
