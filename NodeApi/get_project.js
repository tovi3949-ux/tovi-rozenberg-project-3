import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = process.env.RENDER_API_KEY;

async function getServices() {
    try {
        const response = await fetch('https://api.render.com/v1/services?limit=20', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        fs.writeFileSync('./public/data.json', JSON.stringify(data, null, 2));
        console.log('Saved data.json');

        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

getServices();
