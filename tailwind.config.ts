import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				progress: "progress 1000ms linear infinite",
			},
			keyframes: {
				progress: {
					"0%": { "background-position": "0 0" },
					"100%": { "background-position": "40px 0" },
				},
			},
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
				sans2: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
				logo: [],
			},
			aria: {
				currentpage: 'current="page"',
			},
		},
	},
	plugins: [forms],
} satisfies Config;
