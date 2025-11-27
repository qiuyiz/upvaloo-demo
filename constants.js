// constants.js
// Centralized constants for Upvaloo Demo

const GOOGLE_CLIENT_ID = "176533971134-71jtjk2v597k4dsltvj799n6ssdbmg82.apps.googleusercontent.com";

// EmailJS placeholders (optional). To enable direct client-side sending, sign up at https://www.emailjs.com/
// and create a service + template. Then fill these values.
const EMAILJS_SERVICE_ID = "service_svdbcd6"; // e.g. 'service_xxx'
const EMAILJS_TEMPLATE_ID = "template_oltgnoo"; // e.g. 'template_xxx' (for investors)
const EMAILJS_FINFLUENCER_TEMPLATE_ID = "template_5j8yxrs"; // Finfluencer signup template
const EMAILJS_PUBLIC_KEY = "xBWjzPKxbjCJnFwhE"; // e.g. 'user_xxx' (public key)

// Expose to window for global access (since we're not using modules on file://)
window.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
window.EMAILJS_PUBLIC_KEY = EMAILJS_PUBLIC_KEY;

// Expose a simple global config for non-module scripts / CDN libraries
window.UPVALOO_CONFIG = {
	GOOGLE_CLIENT_ID,
	EMAILJS_SERVICE_ID: EMAILJS_SERVICE_ID,
	EMAILJS_TEMPLATE_ID: EMAILJS_TEMPLATE_ID,
	EMAILJS_FINFLUENCER_TEMPLATE_ID: EMAILJS_FINFLUENCER_TEMPLATE_ID,
	EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY
};