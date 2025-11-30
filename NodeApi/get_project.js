import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = 'rnd_ckPGUIDiyXNLMMVD3UDdbovzAqKK';

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
        console.log(JSON.stringify(data, null, 2));
        
        // יצירת HTML
        // generateHTML(data);
        
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

// function generateHTML(data) {
//     const html = `
// <!DOCTYPE html>
// <html dir="rtl" lang="he">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Render Services</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             min-height: 100vh;
//             padding: 40px 20px;
//         }
//         .container {
//             max-width: 1200px;
//             margin: 0 auto;
//         }
//         h1 {
//             color: white;
//             text-align: center;
//             margin-bottom: 30px;
//             font-size: 2.5em;
//             text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
//         }
//         .controls {
//             text-align: center;
//             margin-bottom: 30px;
//         }
//         .btn {
//             background: white;
//             color: #667eea;
//             border: none;
//             padding: 15px 30px;
//             border-radius: 50px;
//             font-size: 1.1em;
//             font-weight: bold;
//             cursor: pointer;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             transition: all 0.3s;
//             margin: 5px;
//         }
//         .btn:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 20px rgba(0,0,0,0.3);
//         }
//         .service-card {
//             background: white;
//             border-radius: 15px;
//             padding: 25px;
//             margin-bottom: 20px;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             transition: all 0.3s;
//         }
//         .service-card:hover {
//             transform: translateY(-5px);
//             box-shadow: 0 8px 25px rgba(0,0,0,0.3);
//         }
//         .service-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             margin-bottom: 15px;
//             padding-bottom: 15px;
//             border-bottom: 2px solid #f0f0f0;
//         }
//         .service-name {
//             font-size: 1.5em;
//             font-weight: bold;
//             color: #667eea;
//         }
//         .service-type {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 5px 15px;
//             border-radius: 20px;
//             font-size: 0.9em;
//         }
//         .service-info {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//             gap: 15px;
//             margin-top: 15px;
//         }
//         .info-item {
//             background: #f8f9fa;
//             padding: 12px;
//             border-radius: 8px;
//         }
//         .info-label {
//             font-weight: bold;
//             color: #666;
//             font-size: 0.9em;
//             margin-bottom: 5px;
//         }
//         .info-value {
//             color: #333;
//             font-size: 1em;
//         }
//         .status {
//             display: inline-block;
//             padding: 4px 12px;
//             border-radius: 15px;
//             font-size: 0.85em;
//             font-weight: bold;
//         }
//         .status.live {
//             background: #10b981;
//             color: white;
//         }
//         .status.suspended {
//             background: #ef4444;
//             color: white;
//         }
//         .url {
//             color: #667eea;
//             text-decoration: none;
//             word-break: break-all;
//         }
//         .url:hover {
//             text-decoration: underline;
//         }
//         .json-display {
//             background: #1e1e1e;
//             color: #d4d4d4;
//             padding: 20px;
//             border-radius: 10px;
//             overflow-x: auto;
//             margin-top: 20px;
//             display: none;
//         }
//         .json-display pre {
//             margin: 0;
//             font-family: 'Courier New', monospace;
//             font-size: 0.9em;
//             line-height: 1.5;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <h1>🚀 Render Services Dashboard</h1>
        
//         <div class="controls">
//             <button class="btn" onclick="printPage()">🖨️ הדפס</button>
//             <button class="btn" onclick="toggleJSON()">📋 הצג JSON</button>
//             <button class="btn" onclick="copyJSON()">📄 העתק JSON</button>
//         </div>

//         <div id="services">
//             ${data.map(service => `
//                 <div class="service-card">
//                     <div class="service-header">
//                         <div class="service-name">${service.service.name}</div>
//                         <div class="service-type">${service.service.type}</div>
//                     </div>
                    
//                     <div class="service-info">
//                         <div class="info-item">
//                             <div class="info-label">סטטוס</div>
//                             <div class="info-value">
//                                 <span class="status ${service.service.suspended === 'not_suspended' ? 'live' : 'suspended'}">
//                                     ${service.service.suspended === 'not_suspended' ? '🟢 פעיל' : '🔴 מושעה'}
//                                 </span>
//                             </div>
//                         </div>
                        
//                         <div class="info-item">
//                             <div class="info-label">URL</div>
//                             <div class="info-value">
//                                 <a href="${service.service.serviceDetails?.url || '#'}" target="_blank" class="url">
//                                     ${service.service.serviceDetails?.url || 'N/A'}
//                                 </a>
//                             </div>
//                         </div>
                        
//                         <div class="info-item">
//                             <div class="info-label">סביבה</div>
//                             <div class="info-value">${service.service.serviceDetails?.env || 'N/A'}</div>
//                         </div>
                        
//                         <div class="info-item">
//                             <div class="info-label">תאריך יצירה</div>
//                             <div class="info-value">${new Date(service.service.createdAt).toLocaleDateString('he-IL')}</div>
//                         </div>
                        
//                         <div class="info-item">
//                             <div class="info-label">עדכון אחרון</div>
//                             <div class="info-value">${new Date(service.service.updatedAt).toLocaleDateString('he-IL')}</div>
//                         </div>
                        
//                         <div class="info-item">
//                             <div class="info-label">Region</div>
//                             <div class="info-value">${service.service.serviceDetails?.region || 'N/A'}</div>
//                         </div>
//                     </div>
//                 </div>
//             `).join('')}
//         </div>

//         <div class="json-display" id="jsonDisplay">
//             <pre>${JSON.stringify(data, null, 2)}</pre>
//         </div>
//     </div>

//     <script>
//         function printPage() {
//             window.print();
//         }

//         function toggleJSON() {
//             const jsonDisplay = document.getElementById('jsonDisplay');
//             if (jsonDisplay.style.display === 'none' || jsonDisplay.style.display === '') {
//                 jsonDisplay.style.display = 'block';
//                 jsonDisplay.scrollIntoView({ behavior: 'smooth' });
//             } else {
//                 jsonDisplay.style.display = 'none';
//             }
//         }

//         function copyJSON() {
//             const jsonText = ${JSON.stringify(JSON.stringify(data, null, 2))};
//             navigator.clipboard.writeText(jsonText).then(() => {
//                 alert('JSON הועתק ללוח!');
//             }).catch(err => {
//                 console.error('Error copying:', err);
//             });
//         }
//     </script>
// </body>
// </html>
//     `;

//     fs.writeFileSync('render_services.html', html, 'utf8');
//     console.log('\n✅ קובץ HTML נוצר: render_services.html');
//     console.log('פתח את הקובץ בדפדפן כדי לראות את המידע בצורה יפה!\n');
// }

getServices();