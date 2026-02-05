/**
 * A utility to handle requests to external backend APIs.
 * It uses the API_BASE_URL environment variable to prefix requests.
 */

export class ApiClient {
    constructor(
        private baseUrl: string,
        private defaultHeaders: HeadersInit = {},
    ) {
        if (this.baseUrl.endsWith('/')) {
            this.baseUrl = this.baseUrl.slice(0, -1);
        }
    }

    async fetch(path: string, init?: RequestInit): Promise<Response> {
        const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;

        const headers = new Headers(this.defaultHeaders);
        if (init?.headers) {
            new Headers(init.headers).forEach((value, key) => {
                headers.set(key, value);
            });
        }

        const response = await fetch(url, {
            ...init,
            headers,
        });

        return response;
    }
}

export function createApiClient(baseUrl: string, accessToken?: string) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = accessToken; // Assuming the token handles its own prefix or is a direct key
    }

    return new ApiClient(baseUrl, headers);
}
