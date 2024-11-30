async function generateEmoji() {
    const prompt = document.getElementById('prompt').value;
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    if (!prompt) {
        alert('Please enter a description for your emoji');
        return;
    }

    loading.classList.remove('hidden');
    result.innerHTML = '';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        result.innerHTML = `<img src="${data.imageUrl}" alt="Generated emoji">`;
    } catch (error) {
        result.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        loading.classList.add('hidden');
    }
} 