
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
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
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
				// Enhanced oceanographic data colors
				thermal: {
					warm: 'hsl(var(--temp-warm))',
					cool: 'hsl(var(--temp-cool))'
				},
				current: {
					strong: 'hsl(var(--current-strong))',
					mild: 'hsl(var(--current-mild))'
				},
				sardine: {
					primary: 'hsl(var(--sardine-primary))'
				},
				depth: {
					primary: 'hsl(var(--depth-primary))'
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
				}
			},
			backgroundImage: {
				'gradient-ocean': 'var(--gradient-ocean)',
				'gradient-thermal': 'var(--gradient-thermal)',
				'gradient-depth': 'var(--gradient-depth)',
				'gradient-glass': 'var(--gradient-glass)'
			},
			boxShadow: {
				'data': 'var(--shadow-data)',
				'glow': 'var(--shadow-glow)',
				'glass': 'var(--shadow-glass)',
				'depth': 'var(--shadow-depth)',
				'inner': 'var(--shadow-inner)'
			},
			backdropFilter: {
				'glass': 'var(--backdrop-blur)',
				'glass-heavy': 'var(--backdrop-blur-heavy)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'bounce': 'var(--transition-bounce)',
				'glass': 'var(--transition-glass)'
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
				'float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'25%': { transform: 'translateY(-10px) rotate(1deg)' },
					'50%': { transform: 'translateY(-5px) rotate(0deg)' },
					'75%': { transform: 'translateY(-15px) rotate(-1deg)' }
				},
				'wave': {
					'0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
					'50%': { transform: 'scaleY(1.1) scaleX(0.95)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: 'var(--shadow-glow), var(--shadow-glass)' },
					'50%': { boxShadow: '0 0 40px hsla(195, 80%, 45%, 0.6), var(--shadow-glass)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'data-flow': {
					'0%': { transform: 'translateX(-100%) scaleX(0)' },
					'50%': { transform: 'translateX(0%) scaleX(1)' },
					'100%': { transform: 'translateX(100%) scaleX(0)' }
				},
				'depth-scan': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-100%)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'wave': 'wave 4s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'ripple': 'ripple 2s infinite',
				'data-flow': 'data-flow 3s linear infinite',
				'depth-scan': 'depth-scan 4s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
