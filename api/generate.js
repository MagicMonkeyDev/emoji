export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = JSON.parse(request.body);
    
    try {
        // Start the prediction
        const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: "2a865c9a302c9f18e2a649dac2c41aec03b7a1d5d4f0fca8835c8661e711eedf",
                input: { prompt }
            })
        });

        const prediction = await startResponse.json();
        
        // Poll for the result
        let resultResponse;
        while (!resultResponse?.output) {
            const checkResponse = await fetch(prediction.urls.get, {
                headers: {
                    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                }
            });
            resultResponse = await checkResponse.json();
            
            if (resultResponse.status === 'succeeded') {
                return response.status(200).json({ imageUrl: resultResponse.output[0] });
            } else if (resultResponse.status === 'failed') {
                throw new Error('Emoji generation failed');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
} 