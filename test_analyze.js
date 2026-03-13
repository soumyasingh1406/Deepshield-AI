const fs = require('fs');

async function run() {
    fs.writeFileSync('test_upload.txt', 'simulate an image or file content here.');
    
    const fileContent = fs.readFileSync('test_upload.txt');
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const form = new FormData();
    form.append('file', blob, 'test_upload.txt');
    
    try {
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            body: form
        });
        const data = await response.json();
        console.log("Success:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
