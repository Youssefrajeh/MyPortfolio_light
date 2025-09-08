# 💾 Permanent Visitor Data Storage

## ✅ **ACTIVATED: Permanent JSON File Storage**

Your visitor tracking system is now configured to save **ALL visitor data permanently** in JSON files until you manually delete them.

## 🚀 **How to Start Tracking**

### Option 1: Windows (Easy)
Double-click the `start-tracking.bat` file

### Option 2: Command Line
```bash
npm run track
```

### Option 3: Manual
```bash
npm start
```

## 📁 **Where Your Data is Saved**

All visitor data is automatically saved in the `./tracking-data/` directory:

```
tracking-data/
├── pageview-2024-01-15.json      # Page visits
├── event-2024-01-15.json         # User interactions (clicks, scrolls)
├── pageview_end-2024-01-15.json  # Time spent on pages
├── pageview-2024-01-16.json      # Next day's visits
└── ...
```

## 📊 **Data Structure Example**

### Page Views (`pageview-YYYY-MM-DD.json`)
```json
[
  {
    "sessionId": "vis_1705123456789",
    "url": "https://yourdomain.com/",
    "title": "Home Page",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "referrer": "https://google.com",
    "userAgent": "Mozilla/5.0...",
    "visitorInfo": {
      "language": "en-US",
      "timezone": "America/New_York",
      "screenResolution": "1920x1080",
      "isReturningVisitor": false
    },
    "serverTimestamp": "2024-01-15T10:30:01.000Z"
  }
]
```

### Events (`event-YYYY-MM-DD.json`)
```json
[
  {
    "sessionId": "vis_1705123456789",
    "eventName": "click",
    "element": "button",
    "text": "Contact Me",
    "url": "https://yourdomain.com/",
    "timestamp": "2024-01-15T10:32:15.000Z",
    "serverTimestamp": "2024-01-15T10:32:16.000Z"
  }
]
```

## 🔍 **Accessing Your Data**

### 1. **Raw JSON Files**
- Navigate to `./tracking-data/` folder
- Open any JSON file in a text editor
- Data is human-readable and well-formatted

### 2. **Built-in Dashboard**
- Visit: `http://localhost:3000/dashboard`
- View live statistics and analytics
- Download data in various formats

### 3. **Admin Panel on Your Website**
- Press `Ctrl + Shift + Alt + A` on your website
- Login: `youssef` / `admin2024`
- View real-time visitor stats

## 🗂️ **Data Management**

### View All Data Files
```bash
ls -la tracking-data/
```

### Copy Data to Another Location
```bash
cp -r tracking-data/ /path/to/backup/
```

### Delete Specific Day's Data
```bash
rm tracking-data/*2024-01-15*
```

### Delete ALL Data (Permanent)
```bash
rm -rf tracking-data/
```

## 📈 **What Gets Tracked & Saved**

### ✅ **Visitor Information**
- Session ID (unique per visit)
- Page views and navigation
- Time spent on each page
- Referrer sources
- Browser and device info
- Geographic data (with permission)

### ✅ **User Behavior**
- All clicks and interactions
- Scroll behavior (25%, 50%, 75%, 100%)
- Form submissions
- Page visibility changes
- Window resizing

### ✅ **Session Analytics**
- Total time on site
- Pages per session
- Return visitor detection
- Engagement metrics

## 🔒 **Data Security**

- **Local Storage**: All data saved on YOUR server
- **No Third-Party**: Data doesn't leave your system
- **Privacy Compliant**: GDPR ready with consent management
- **Admin Only**: Hidden tracking interface

## 🛠️ **Customization**

### Change Data Storage Location
Edit `visitor-tracking-backend.js`:
```javascript
const DATA_DIR = './your-custom-folder';
```

### Change File Naming Pattern
Edit the `saveTrackingData` function:
```javascript
const filename = `${DATA_DIR}/custom-${type}-${date}.json`;
```

### Add Data Processing
Edit the `/api/track` endpoint to process data before saving:
```javascript
// Add custom processing
data.processed = true;
data.customField = 'your-value';

await saveTrackingData(data, type);
```

## 🔧 **Troubleshooting**

### Server Won't Start
1. Check if port 3000 is available
2. Run `npm install` to ensure dependencies
3. Check console for error messages

### Data Not Saving
1. Ensure `tracking-data/` folder exists
2. Check file permissions
3. Verify server is running at `http://localhost:3000`

### Website Not Tracking
1. Ensure server is running
2. Check browser console for errors
3. Verify `script.js` has tracking enabled

## 📞 **Support**

If you need help:
1. Check the console output for error messages
2. Verify all files are in place
3. Test with the dashboard at `http://localhost:3000/dashboard`

---

## 🎉 **Success!**

Your visitor data is now being saved **permanently** in JSON files. The data will persist until you manually delete it, giving you complete control over your visitor analytics. 