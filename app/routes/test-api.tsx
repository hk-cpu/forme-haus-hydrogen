import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ context }: LoaderFunctionArgs) {
    const { api, env } = context;

    // This is a test to verify the API client is configured
    return new Response(
        JSON.stringify({
            message: 'API Client Configured',
            baseUrl: env.API_BASE_URL,
            hasAccessToken: !!env.API_ACCESS_TOKEN,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
}

export default function TestApi() {
    return null;
}
