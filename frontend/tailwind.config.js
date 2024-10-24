/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"node_modules/daisyui/dist/**/*.js",
		"node_modules/react-daisyui/dist/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				customOrange: '#d4430c', 
			},
		},
	},
	daisyui: {
		themes: ["nucleo"],
		themes: [
			{
				nucleo: {
					primary: "#ff6347", // Matches the dominant red-orange color
					"primary-content": "#ffffff", // White text on primary buttons
					secondary: "#34bdeb", // Light blue color
					"secondary-content": "#ffffff", // White text on secondary buttons
					accent: "#ffda44", // Yellow accent color
					"accent-content": "#000000", // Black text on accent elements
					neutral: "#2c2c2c", // Dark gray for neutral elements
					"neutral-content": "#ffffff", // White text on neutral elements
					"base-100": "#ffffff", // White background for base elements
					"base-200": "#f0f0f0", // Light gray for secondary background
					"base-300": "#d4d4d4", // Medium gray for tertiary background
					"base-content": "#000000", // Black text on base elements
					info: "#34bdeb", // Same as secondary color for info elements
					"info-content": "#ffffff", // White text on info elements
					success: "#00e676", // Bright green for success
					"success-content": "#ffffff", // White text on success elements
					warning: "#ffb300", // Orange-yellow for warning
					"warning-content": "#ffffff", // White text on warning elements
					error: "#ff1744", // Bright red for errors
					"error-content": "#ffffff", // White text on error elements
				},
			},
		],
	},
	plugins: [require("daisyui")],
};
