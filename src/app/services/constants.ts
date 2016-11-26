export const MOBILE = (typeof window !== 'undefined') ? (window.screen.availWidth < 800) : true;
// HOST and PORT are available
export const API_BASE_URL: string = `http://localhost/lazycoding-back/wp-json/wp/v2`;
