
export async function get() {
	return {
		headers: { Location: '/' },
		status: 301
	};
};