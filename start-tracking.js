const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 Starting Visitor Tracking Backend...\n');

// Ensure tracking-data directory exists
const dataDir = './tracking-data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('📁 Created tracking-data directory for storing visitor data\n');
}

console.log('📊 VISITOR TRACKING SYSTEM');
console.log('==========================');
console.log('✅ Data will be saved permanently in JSON files');
console.log(`📁 Storage location: ${path.resolve(dataDir)}`);
console.log('🌐 Backend server: http://localhost:3000');
console.log('📈 Dashboard: http://localhost:3000/dashboard');
console.log('');
console.log('💾 Data Files Created:');
console.log('   - pageview-YYYY-MM-DD.json (page visits)');
console.log('   - event-YYYY-MM-DD.json (user interactions)');
console.log('   - pageview_end-YYYY-MM-DD.json (time on page)');
console.log('');
console.log('🔒 Admin Access to Website:');
console.log('   - Press: Ctrl + Shift + Alt + A');
console.log('   - Or visit: your-website.com?dashboard=admin');
console.log('   - Username: youssef | Password: admin2024');
console.log('');
console.log('🛑 To stop tracking: Press Ctrl+C');
console.log('==========================\n');

// Start the backend server
const server = exec('npm start', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error starting server:', error);
        return;
    }
});

server.stdout.on('data', (data) => {
    console.log(data);
});

server.stderr.on('data', (data) => {
    console.error(data);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down visitor tracking...');
    console.log('📁 All visitor data saved permanently in ./tracking-data/');
    console.log('💡 Your JSON files will persist until you manually delete them');
    process.exit(0);
}); 