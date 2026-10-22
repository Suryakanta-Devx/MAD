# Smart Issue Reporting & Location Android Application

A comprehensive mobile application for campus civic hazard reporting, municipal dispatch, and infrastructure tracking. Built with **React**, **Capacitor** (for Android APK generation), **Leaflet** (for interactive GPS map pinning), and **Material 3 Design**.

---

## 📱 Core Features & Criteria Implementation

### 1. Input Module
- **Category Selection**: 8 distinct categories (Roads & Potholes, Water & Drainage, Streetlights & Grid, Waste & Sanitation, Traffic & Signage, Trees & Parks, Campus Facilities, Other) with custom icons, color badges, and urgency tags.
- **Issue Description**: Short title, detailed notes field, and 4-tier urgency selector (*Low*, *Medium*, *High*, *Critical*).
- **Location Specification**:
  - One-tap **GPS Detection** button extracting live latitude, longitude, and accuracy radius.
  - **Reverse Geocoding** resolving GPS coordinates into human-readable street names and areas.
  - Editable address & landmark fields.
  - **Interactive Leaflet Map**: Tap anywhere on the map or drag the pin to precisely calibrate the reported location. Includes Satellite / Street map layer toggle.

### 2. Evidence Module
- **Live Device Camera**: Real-time camera viewfinder with capture button, flip camera toggle, and retake/confirm flow.
- **Gallery File Picker**: Upload photos from phone storage / PC files.
- **Quick Demo Presets**: One-click sample evidence buttons (*Road Pothole*, *Water Leak*, *Garbage Dump*, *Broken Streetlight*) for fast presentation and demonstration.
- **Photo Metadata & Preview**: Displays evidence thumbnail, filename, and capture timestamp, with delete/replace options.
- **Additional Observations**: Notes field for extra context (e.g. duration of issue, safety hazards).

### 3. Submission & Tracking Module
- **Unique Ticket Generation**: Generates automated municipal ticket IDs (e.g., `#SIR-2026-4821`).
- **Confirmation Screen**: Celebration modal with one-click copy button for the ticket ID.
- **Persistent Storage**: Saves all reports directly to local device storage (`localStorage`), retaining records across app reloads and device reboots.
- **"My Reports" Dashboard**:
  - Search reports by ticket number, title, or road name.
  - Filter by resolution status (*Submitted*, *Under Review*, *In Progress*, *Resolved*).
  - Issue detail modal showing full resolution lifecycle stepper, timeline history, attached photo, and demo status progression.
  - **Export to JSON**: Download report records backup anytime.
- **City & Campus Interactive Map**: Live map displaying all pinned issues with color-coded category pins and popup details.

---

## 🌟 Campus Impact & Innovation Module

### 📊 1. Dashboard: Campus Impact & Executive Analytics
- **Executive Summary & KPIs**:
  - **Total Issues Logged**: Live counter of all citizen and campus submissions.
  - **Resolution Rate %**: Visual percentage of fixed vs. open tickets.
  - **Active Dispatch Counter**: Crews and engineering teams actively on ground.
  - **Campus Safety Index**: Automated safety compliance score out of 100 based on unresolved hazard weights.
- **Environmental & Civic Impact Scorecard**:
  - 💧 **Estimated Clean Water Saved**: Calculated in liters based on rapid pipeline leak containment.
  - ⚡ **Dark Zones Re-Illuminated**: Night-time campus perimeter fixtures restored.
  - ⏱️ **Average Turnaround Time**: Response velocity tracking (e.g. 4.6 hours).
- **Resolution Lifecycle Pipeline**: Visual stacked progress breakdown (*Submitted* → *Under Review* → *In Progress* → *Resolved*).
- **Category Distribution**: Color-coded progress bars by category percentage.
- **Campus Zone Monitoring**: Real-time status for Academic Quad, Library Walkway, Engineering Block, Hostel Complex, and Sports Grounds.
- **Export Executive Summary**: One-click export of campus metrics as a structured JSON summary.

### 🔔 2. Notifications: In-App Updates & Live Push Dispatch
- **Notification Bell & Live Badge**: Header bell icon with real-time unread alert counter.
- **Notification Center Drawer**:
  - Displays lifecycle progression updates (e.g. *"Crew Dispatched with asphalt patch team"*, *"Water board verified leak"*).
  - Tap any notification to immediately open that specific issue in the detail modal.
  - "Mark All as Read" and "Clear History" options.
- **Simulate Live Push Alert**: In-app button to trigger instant live dispatch updates for demonstration and judging.
- **Heads-Up Android Toast**: Slide-down banner with vibration feedback on ticket logging and status changes.
- **Automatic Status Sync**: Changing status in the issue modal automatically dispatches a new tracking notification.

### 🚀 3. Futuristic Innovation Features

#### 🤖 AI-Assisted Smart Triage & Hazard Scanner
- **One-Tap AI Scan**: Automatically inspects title, description, and attached photo metadata.
- **Intelligent Prediction**: Predicts category, sets urgency level, and standardizes ticket titles with confidence scores (e.g. 98%).
- **Campus Impact Assessment**: AI generates clear explanations of the civic and safety impact of each hazard.
- **AI Duplicate & Proximity Check**: Detects if a similar issue was recently reported within 250 meters, alerting users to prevent redundant tickets.

#### 🎙️ Voice-Based Hands-Free Reporting
- **Speech-to-Text Dictation**: Uses Web Speech Recognition (`webkitSpeechRecognition`) with pulsing mic visualization.
- **Automatic Transcribe**: Converts voice directly into the description and title.
- **Simulated Voice Testing**: Fallback demo voice presets allowing testing on any browser without microphone hardware.
- **Text-to-Speech (TTS) Voice Narration**: Audio speaker button on tickets to read out ticket details for auditory assistance.

#### 🌐 Multilingual Support (i18n)
- **Instant Language Switcher**: Easily switch between **English 🇬🇧**, **Español 🇪🇸**, **हिन्दी 🇮🇳**, and **Français 🇫🇷**.
- All categories, severity tags, statuses, section titles, and notification alerts are fully localized.

#### ♿ Accessibility Features (A11y)
- **High Contrast Mode**: Sharpened borders and high-contrast color ratios for bright outdoor sunlight conditions.
- **Large Text Mode**: Dynamic typography scaling for users with visual impairments.
- **Screen Reader Readiness**: Semantic HTML5 elements and aria attributes.

#### 📡 Offline-First Reporting & Background Sync
- **Network Detection**: Automatically detects online and offline states (`navigator.onLine`).
- **Offline Draft Queue**: Allows users in poor signal areas or basements to record issues without losing data.
- **Background Auto-Sync**: One-click "Sync Now" banner and automatic synchronization when network reconnects.
- **Offline Simulator**: Toggle in settings to simulate network loss for testing.

---

## 🚀 How to Run Locally

### 1. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

> **Tip for Desktop Testing:** The application includes an **Android Phone Frame** simulator by default (with Android status bar, notch camera, and gesture navigation). You can toggle between Phone frame and Full-Screen view using the top-right **"Phone / Full"** button.

---

## 🤖 How to Build as a Native Android App (APK)

This project is configured with **Capacitor Android**:

1. **Build the web production bundle**:
   ```bash
   npm run build
   ```

2. **Add the Android platform** (creates native Android Studio project):
   ```bash
   npm run cap:add:android
   ```

3. **Open in Android Studio**:
   ```bash
   npm run cap:android
   ```
   In Android Studio, click **Run > Run 'app'** to launch on an Android emulator or connected Android smartphone, or click **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate your `.apk` file!

4. **Sync any code changes to Android**:
   ```bash
   npm run cap:sync
   ```

---

## 📂 Project Architecture

```
MAD/
├── android/                   # Generated Capacitor Android platform
├── capacitor.config.json      # Capacitor Android app configuration
├── src/
│   ├── components/
│   │   ├── AndroidFrame.jsx           # Realistic Android smartphone chassis wrapper
│   │   ├── AndroidStatusBar.jsx       # Android status bar (time, battery, Wi-Fi)
│   │   ├── AndroidNavBar.jsx          # Android gesture navigation bar
│   │   ├── BottomNavBar.jsx           # Material 3 bottom tabs (Report, My Reports, Map, Dashboard)
│   │   ├── HeaderBar.jsx              # Top bar with GPS/Offline status, Bell, Settings, View toggles
│   │   ├── ReportIssueForm.jsx        # AI Smart Scan, Voice Mic, GPS, Camera & Offline form
│   │   ├── LocationPickerMap.jsx      # Interactive Leaflet location picker map
│   │   ├── CameraCaptureModal.jsx     # Live camera view & snapshot capture
│   │   ├── MyReportsList.jsx          # Recorded issues list with search & status filters
│   │   ├── IssueDetailModal.jsx       # Issue details, lifecycle stepper, TTS audio & status updates
│   │   ├── CityIssuesMap.jsx          # Campus & city-wide map of all pinned issues
│   │   ├── AnalyticsDashboard.jsx     # Campus Impact KPIs, Eco scorecard & resolution charts
│   │   ├── NotificationCenterModal.jsx# Live notification center with unread badge & push simulation
│   │   ├── NotificationToast.jsx      # Android heads-up notification toast banner
│   │   ├── AccessibilityModal.jsx     # High Contrast, Large Text, TTS & Language selector
│   │   └── SuccessSubmitModal.jsx     # Post-submission celebration & ticket dialog
│   ├── constants/
│   │   ├── categories.js              # Categories, severity levels & status definitions
│   │   └── mockData.js                # Seed sample reports & evidence presets
│   ├── services/
│   │   ├── storageService.js          # LocalStorage persistence & ticket ID generator
│   │   ├── locationService.js         # Geolocation API & OpenStreetMap reverse geocoder
│   │   ├── notificationService.js     # Live notification dispatch, unread tracking & simulation
│   │   ├── aiService.js               # AI hazard classification, triage & duplicate detection
│   │   ├── i18nService.js             # Multilingual localization (EN, ES, HI, FR)
│   │   └── offlineService.js          # Offline queue management & auto-sync engine
│   ├── App.jsx                        # Main application state and coordinator
│   ├── App.css                        # Styling, accessibility modes, animations & Leaflet overrides
│   └── main.jsx                       # Entry point
└── package.json
```
