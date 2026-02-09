import axios from "axios";

/**
 * IMPORTANT:
 * BASE_URL must NEVER end with a slash
 * This prevents //uploads/... ORB errors
 */
export const BASE_URL =
	import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
	"https://ecommerce-backend-1-1ic5.onrender.com";

/**
 * Axios instance for API calls
 */
const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
