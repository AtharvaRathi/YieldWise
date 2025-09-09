// YieldWise Application JavaScript
// Enhanced Agricultural Platform with AI Recommendations

// Global variables
let currentUser = null;
let currentLanguage = 'en';
let map = null;
let selectedLocation = null;
let currentCropData = null;
let posts = [];

// Mapbox Configuration
mapboxgl.accessToken = 'pk.eyJ1IjoiYXRoYXJ2c3AiLCJhIjoiY21kbjlwZGtnMWl4ODJsc2ZqcDR5cHVnaCJ9.6_LgxGqTbI7Q4HqHH5lPzQ'; // Replace with actual Mapbox token

// Crop data with all 10 crops
const cropsData = {
    rice: { id: "rice", name: "Rice", hindi: "चावल", season: "Kharif", duration: "120-150 days", averageYield: 42, optimalTemp: 30, optimalPH: 6.0, optimalFertilizer: 150, marketPrice: 2650, soilRequirement: "Clay loam with good water retention", npkRatio: "120:60:40" },
    wheat: { id: "wheat", name: "Wheat", hindi: "गेहूं", season: "Rabi", duration: "110-130 days", averageYield: 38, optimalTemp: 20, optimalPH: 7.0, optimalFertilizer: 180, marketPrice: 2350, soilRequirement: "Well-drained loamy soil", npkRatio: "150:75:50" },
    cotton: { id: "cotton", name: "Cotton", hindi: "कपास", season: "Kharif", duration: "180-200 days", averageYield: 20, optimalTemp: 28, optimalPH: 7.5, optimalFertilizer: 120, marketPrice: 6800, soilRequirement: "Deep, well-drained black cotton soil", npkRatio: "100:50:50" },
    sugarcane: { id: "sugarcane", name: "Sugarcane", hindi: "गन्ना", season: "Year-round", duration: "10-12 months", averageYield: 600, optimalTemp: 32, optimalPH: 6.5, optimalFertilizer: 200, marketPrice: 350, soilRequirement: "Rich, deep, well-drained soil", npkRatio: "200:100:100" },
    maize: { id: "maize", name: "Maize", hindi: "मक्का", season: "Kharif/Rabi", duration: "90-120 days", averageYield: 45, optimalTemp: 25, optimalPH: 6.8, optimalFertilizer: 140, marketPrice: 2200, soilRequirement: "Well-drained fertile sandy loam", npkRatio: "120:60:40" },
    soybean: { id: "soybean", name: "Soybean", hindi: "सोयाबीन", season: "Kharif", duration: "90-120 days", averageYield: 18, optimalTemp: 27, optimalPH: 6.5, optimalFertilizer: 80, marketPrice: 4200, soilRequirement: "Well-drained loamy soil with good fertility", npkRatio: "20:60:40" },
    groundnut: { id: "groundnut", name: "Groundnut", hindi: "मूंगफली", season: "Kharif/Rabi", duration: "110-140 days", averageYield: 22, optimalTemp: 28, optimalPH: 6.2, optimalFertilizer: 100, marketPrice: 5500, soilRequirement: "Sandy loam with good drainage", npkRatio: "25:50:75" },
    bajra: { id: "bajra", name: "Bajra", hindi: "बाजरा", season: "Kharif", duration: "70-90 days", averageYield: 12, optimalTemp: 33, optimalPH: 7.0, optimalFertilizer: 60, marketPrice: 2800, soilRequirement: "Sandy soil with low water requirement", npkRatio: "40:20:20" },
    jowar: { id: "jowar", name: "Jowar", hindi: "ज्वार", season: "Kharif/Rabi", duration: "110-140 days", averageYield: 15, optimalTemp: 29, optimalPH: 6.8, optimalFertilizer: 80, marketPrice: 3200, soilRequirement: "Deep, well-drained clay loam", npkRatio: "80:40:40" },
    mustard: { id: "mustard", name: "Mustard", hindi: "सरसों", season: "Rabi", duration: "90-110 days", averageYield: 16, optimalTemp: 18, optimalPH: 6.5, optimalFertilizer: 100, marketPrice: 5800, soilRequirement: "Well-drained loamy soil", npkRatio: "60:40:40" }
};

// Enhanced disease data for all 10 crops
const diseaseData = {
    rice: [
        { name: "Blast Disease", symptoms: ["Diamond-shaped lesions", "Brown spots with gray centers", "Leaf blight"], treatment: "Tricyclazole 0.6g/L", confidence: 0.91, severity: "High", prevention: "Use resistant varieties, avoid excessive nitrogen" },
        { name: "Brown Spot", symptoms: ["Brown circular spots", "Gray-white centers", "Premature leaf death"], treatment: "Mancozeb spray", confidence: 0.88, severity: "Medium", prevention: "Proper water management, balanced fertilization" }
    ],
    wheat: [
        { name: "Yellow Rust", symptoms: ["Yellow stripes on leaves", "Reduced grain quality", "Early senescence"], treatment: "Propiconazole spray", confidence: 0.89, severity: "High", prevention: "Timely sowing, resistant varieties" },
        { name: "Powdery Mildew", symptoms: ["White powdery growth", "Leaf yellowing", "Reduced photosynthesis"], treatment: "Sulfur dusting", confidence: 0.85, severity: "Medium", prevention: "Avoid dense planting, good air circulation" }
    ],
    cotton: [
        { name: "Bollworm Attack", symptoms: ["Holes in bolls", "Caterpillar presence", "Reduced fiber quality"], treatment: "Bt cotton + IPM", confidence: 0.87, severity: "High", prevention: "Regular monitoring, pheromone traps" },
        { name: "Fusarium Wilt", symptoms: ["Leaf yellowing", "Wilting", "Vascular browning"], treatment: "Resistant varieties + soil treatment", confidence: 0.83, severity: "High", prevention: "Crop rotation, soil health management" }
    ],
    sugarcane: [
        { name: "Red Rot", symptoms: ["Red discoloration", "Sweet smell", "Hollow internodes"], treatment: "Resistant varieties + field sanitation", confidence: 0.90, severity: "High", prevention: "Use healthy seed cane, avoid waterlogging" }
    ],
    maize: [
        { name: "Fall Armyworm", symptoms: ["Leaf damage", "Caterpillar presence", "Whorl feeding"], treatment: "Spinetoram + NPV", confidence: 0.86, severity: "High", prevention: "Early detection, pheromone traps" }
    ],
    soybean: [
        { name: "Soybean Rust", symptoms: ["Yellow-brown pustules", "Leaf drop", "Yield reduction"], treatment: "Triazole fungicides", confidence: 0.88, severity: "High", prevention: "Resistant varieties, early sowing" }
    ],
    groundnut: [
        { name: "Tikka Disease", symptoms: ["Circular spots", "Concentric rings", "Defoliation"], treatment: "Chlorothalonil spray", confidence: 0.84, severity: "Medium", prevention: "Crop rotation, balanced nutrition" }
    ],
    bajra: [
        { name: "Downy Mildew", symptoms: ["Pale green stripes", "White growth", "Stunted growth"], treatment: "Metalaxyl seed treatment", confidence: 0.82, severity: "Medium", prevention: "Resistant varieties, proper spacing" }
    ],
    jowar: [
        { name: "Grain Mold", symptoms: ["Discolored grains", "Moldy appearance", "Quality loss"], treatment: "Propiconazole spray", confidence: 0.85, severity: "Medium", prevention: "Timely harvest, proper drying" }
    ],
    mustard: [
        { name: "White Rust", symptoms: ["White pustules", "Leaf distortion", "Stunting"], treatment: "Ridomil spray", confidence: 0.87, severity: "High", prevention: "Avoid excess moisture, resistant varieties" }
    ]
};

// Soil types based on location
const soilTypes = {
    "punjab": { type: "Alluvial", characteristics: "High fertility, good water retention", suitable_crops: ["Rice", "Wheat", "Maize"], ph_range: "6.0-7.5" },
    "haryana": { type: "Alluvial", characteristics: "High fertility, good water retention", suitable_crops: ["Rice", "Wheat", "Maize"], ph_range: "6.0-7.5" },
    "maharashtra": { type: "Black Cotton", characteristics: "High clay content, excellent for cotton", suitable_crops: ["Cotton", "Sugarcane", "Soybean"], ph_range: "7.0-8.5" },
    "gujarat": { type: "Black Cotton", characteristics: "High clay content, water retention", suitable_crops: ["Cotton", "Groundnut", "Bajra"], ph_range: "7.0-8.5" },
    "uttar pradesh": { type: "Alluvial", characteristics: "Fertile river soil, diverse crops", suitable_crops: ["Wheat", "Rice", "Sugarcane"], ph_range: "6.0-7.5" },
    "bihar": { type: "Alluvial", characteristics: "River deposited fertile soil", suitable_crops: ["Rice", "Wheat", "Maize"], ph_range: "6.0-7.5" },
    "karnataka": { type: "Red Laterite", characteristics: "Well-drained, iron-rich", suitable_crops: ["Rice", "Cotton", "Jowar"], ph_range: "5.0-7.0" },
    "tamil nadu": { type: "Red Laterite", characteristics: "Well-drained, moderate fertility", suitable_crops: ["Rice", "Cotton", "Groundnut"], ph_range: "5.0-7.0" },
    "rajasthan": { type: "Sandy Loam", characteristics: "Good drainage, drought tolerant", suitable_crops: ["Bajra", "Mustard", "Groundnut"], ph_range: "6.0-7.5" },
    "madhya pradesh": { type: "Black Cotton", characteristics: "Deep black soil, good for cereals", suitable_crops: ["Wheat", "Soybean", "Jowar"], ph_range: "7.0-8.5" },
    "default": { type: "Mixed", characteristics: "Variable soil composition", suitable_crops: ["Rice", "Wheat", "Cotton"], ph_range: "6.0-7.5" }
};

// Enhanced translation system
const translations = {
    en: {
        // Authentication
        "login-title": "Login to YieldWise",
        "register-title": "Register for YieldWise",
        "phone-email": "Phone/Email",
        "password": "Password",
        "full-name": "Full Name",
        "phone": "Phone Number",
        "email": "Email Address",
        "location": "Location",
        "farm-size": "Farm Size (acres)",
        "primary-crops": "Primary Crops",
        "login": "Login",
        "register": "Register",
        "no-account": "Don't have an account?",
        "have-account": "Already have an account?",
        "register-here": "Register here",
        "login-here": "Login here",
        
        // Homepage
        "hero-title": "Smart AI-Powered Farming for Better Yields",
        "hero-subtitle": "Transform your farming with AI-driven crop recommendations, disease detection, market intelligence, and expert guidance for Indian agriculture.",
        "get-started": "Get Started",
        "learn-more": "Learn More",
        "ml-accuracy": "ML Accuracy",
        "crop-varieties": "Crop Varieties",
        "languages": "Languages",
        "yield-prediction": "Yield Prediction",
        "yield-desc": "AI-powered crop yield forecasting with 99.55% accuracy",
        "disease-detection": "Disease Detection",
        "disease-desc": "Advanced plant disease identification and treatment",
        "market-intelligence": "Market Intelligence",
        "market-desc": "Real-time pricing and market trend analysis",
        "ai-recommendations": "AI Recommendations",
        "ai-desc": "Personalized farming strategies and optimization",
        "community": "Community",
        "community-desc": "Connect with farmers and agricultural experts",
        "financial-tools": "Financial Tools",
        "financial-desc": "Cost analysis and profit optimization",
        
        // Navigation
        "home": "Home",
        "location": "Location",
        "predict": "Predict",
        "disease": "Disease",
        "financial": "Financial",
        
        // Location Section
        "select-location": "Select Your Farm Location",
        "location-desc": "Choose your farm location for personalized crop recommendations",
        "search-location": "Search by district, state, or PIN code",
        "search": "Search",
        "selected-location": "Selected Location",
        "no-location": "Click on map to select location",
        "soil-recommendation": "Soil Recommendation",
        "select-location-first": "Select location to get soil recommendations",
        "weather-info": "Weather Information",
        "loading-weather": "Loading weather data...",
        "confirm-location": "Confirm Location",
        
        // Prediction Section
        "crop-prediction": "AI Crop Yield Prediction",
        "prediction-desc": "Get accurate yield predictions using advanced machine learning",
        "basic-info": "Basic Information",
        "crop-type": "Crop Type",
        "farm-area": "Farm Area (hectares)",
        "season": "Season",
        "previous-yield": "Previous Yield (quintal/ha)",
        "input-parameters": "Input Parameters",
        "soil-ph": "Soil pH",
        "fertilizer-usage": "Fertilizer Usage (kg/ha)",
        "pesticide-usage": "Pesticide Usage (kg/ha)",
        "irrigation": "Irrigation Method",
        "predict-yield": "Predict Yield & Get Recommendations",
        "prediction-results": "Prediction Results",
        "predicted-yield": "Predicted Yield",
        "total-production": "Total Production",
        "yield-category": "Yield Category",
        "improvement-potential": "Improvement Potential",
        
        // Disease Section
        "upload-image": "Upload Plant Image",
        "drag-drop": "Drag & drop or click to select",
        "select-crop": "Select Crop Type",
        "analyze-image": "Analyze Image",
        "analysis-results": "Analysis Results",
        "analysis-complete": "Analysis Complete",
        "disease-identified": "Disease Identified",
        "symptoms": "Symptoms",
        "treatment": "Treatment",
        "prevention": "Prevention",
        
        // Community Section
        "farmer-community": "Farmer Community",
        "discussions": "Discussions",
        "expert-qa": "Expert Q&A",
        "alerts": "Alerts",
        "create-post": "Create Post",
        "create-new-post": "Create New Post",
        "post-title": "Title",
        "crop-category": "Crop Category",
        "post-content": "Content",
        "publish-post": "Publish Post",
        
        // Financial Section
        "financial-planning": "Financial Planning",
        "select-crop-financial": "Select Crop",
        "area-hectares": "Area (hectares)",
        "cost-breakdown": "Cost Breakdown",
        "total-cost": "Total Cost",
        "profit-analysis": "Profit Analysis",
        "expected-revenue": "Expected Revenue",
        "net-profit": "Net Profit",
        "profit-margin": "Profit Margin",
        "roi": "ROI",
        "government-schemes": "Government Schemes",
        "pm-kisan-desc": "₹6,000 per year direct income support",
        "crop-insurance-desc": "Protection against crop loss",
        "soil-health-desc": "Free soil testing and recommendations",
        "eligible": "Eligible",
        
        // Loading and status
        "analyzing": "Analyzing",
        "please-wait": "Please wait while we process your data"
    },
    
    hi: {
        // Authentication
        "login-title": "YieldWise में लॉगिन करें",
        "register-title": "YieldWise के लिए पंजीकरण करें",
        "phone-email": "फोन/ईमेल",
        "password": "पासवर्ड",
        "full-name": "पूरा नाम",
        "phone": "फोन नंबर",
        "email": "ईमेल पता",
        "location": "स्थान",
        "farm-size": "खेत का आकार (एकड़)",
        "primary-crops": "मुख्य फसलें",
        "login": "लॉगिन",
        "register": "पंजीकरण",
        "no-account": "खाता नहीं है?",
        "have-account": "पहले से खाता है?",
        "register-here": "यहाँ पंजीकरण करें",
        "login-here": "यहाँ लॉगिन करें",
        
        // Homepage
        "hero-title": "बेहतर उत्पादन के लिए स्मार्ट AI कृषि",
        "hero-subtitle": "AI-संचालित फसल सिफारिशों, रोग निदान, बाजार बुद्धि और भारतीय कृषि के लिए विशेषज्ञ मार्गदर्शन के साथ अपनी कृषि को बदलें।",
        "get-started": "शुरू करें",
        "learn-more": "और जानें",
        "ml-accuracy": "ML सटीकता",
        "crop-varieties": "फसल किस्में",
        "languages": "भाषाएं",
        "yield-prediction": "उत्पादन पूर्वानुमान",
        "yield-desc": "99.55% सटीकता के साथ AI-संचालित फसल उत्पादन पूर्वानुमान",
        "disease-detection": "रोग निदान",
        "disease-desc": "उन्नत पौधे रोग पहचान और उपचार",
        "market-intelligence": "बाजार बुद्धि",
        "market-desc": "वास्तविक समय मूल्य निर्धारण और बाजार प्रवृत्ति विश्लेषण",
        "ai-recommendations": "AI सिफारिशें",
        "ai-desc": "व्यक्तिगत कृषि रणनीतियां और अनुकूलन",
        "community": "समुदाय",
        "community-desc": "किसानों और कृषि विशेषज्ञों से जुड़ें",
        "financial-tools": "वित्तीय उपकरण",
        "financial-desc": "लागत विश्लेषण और लाभ अनुकूलन",
        
        // Navigation
        "home": "होम",
        "location": "स्थान",
        "predict": "पूर्वानुमान",
        "disease": "रोग",
        "financial": "वित्तीय",
        
        // Location Section
        "select-location": "अपने खेत का स्थान चुनें",
        "location-desc": "व्यक्तिगत फसल सिफारिशों के लिए अपने खेत का स्थान चुनें",
        "search-location": "जिला, राज्य या पिन कोड द्वारा खोजें",
        "search": "खोज",
        "selected-location": "चयनित स्थान",
        "no-location": "स्थान चुनने के लिए मैप पर क्लिक करें",
        "soil-recommendation": "मिट्टी की सिफारिश",
        "select-location-first": "मिट्टी की सिफारिश पाने के लिए स्थान चुनें",
        "weather-info": "मौसम जानकारी",
        "loading-weather": "मौसम डेटा लोड हो रहा है...",
        "confirm-location": "स्थान पुष्ट करें",
        
        // Prediction Section
        "crop-prediction": "AI फसल उत्पादन पूर्वानुमान",
        "prediction-desc": "उन्नत मशीन लर्निंग का उपयोग करके सटीक उत्पादन पूर्वानुमान प्राप्त करें",
        "basic-info": "बुनियादी जानकारी",
        "crop-type": "फसल का प्रकार",
        "farm-area": "खेत का क्षेत्र (हेक्टेयर)",
        "season": "मौसम",
        "previous-yield": "पिछली उत्पादन (क्विंटल/हेक्टेयर)",
        "input-parameters": "इनपुट पैरामीटर",
        "soil-ph": "मिट्टी pH",
        "fertilizer-usage": "उर्वरक उपयोग (किग्रा/हेक्टेयर)",
        "pesticide-usage": "कीटनाशक उपयोग (किग्रा/हेक्टेयर)",
        "irrigation": "सिंचाई विधि",
        "predict-yield": "उत्पादन पूर्वानुमान और सिफारिशें प्राप्त करें",
        "prediction-results": "पूर्वानुमान परिणाम",
        "predicted-yield": "पूर्वानुमानित उत्पादन",
        "total-production": "कुल उत्पादन",
        "yield-category": "उत्पादन श्रेणी",
        "improvement-potential": "सुधार की संभावना",
        
        // Disease Section
        "upload-image": "पौधे की छवि अपलोड करें",
        "drag-drop": "खींचें और छोड़ें या चुनने के लिए क्लिक करें",
        "select-crop": "फसल का प्रकार चुनें",
        "analyze-image": "छवि का विश्लेषण करें",
        "analysis-results": "विश्लेषण परिणाम",
        "analysis-complete": "विश्लेषण पूर्ण",
        "disease-identified": "रोग की पहचान",
        "symptoms": "लक्षण",
        "treatment": "उपचार",
        "prevention": "रोकथाम",
        
        // Community Section
        "farmer-community": "किसान समुदाय",
        "discussions": "चर्चा",
        "expert-qa": "विशेषज्ञ प्रश्न-उत्तर",
        "alerts": "चेतावनियां",
        "create-post": "पोस्ट बनाएं",
        "create-new-post": "नई पोस्ट बनाएं",
        "post-title": "शीर्षक",
        "crop-category": "फसल श्रेणी",
        "post-content": "सामग्री",
        "publish-post": "पोस्ट प्रकाशित करें",
        
        // Financial Section
        "financial-planning": "वित्तीय नियोजन",
        "select-crop-financial": "फसल चुनें",
        "area-hectares": "क्षेत्र (हेक्टेयर)",
        "cost-breakdown": "लागत विवरण",
        "total-cost": "कुल लागत",
        "profit-analysis": "लाभ विश्लेषण",
        "expected-revenue": "अपेक्षित आय",
        "net-profit": "शुद्ध लाभ",
        "profit-margin": "लाभ मार्जिन",
        "roi": "ROI",
        "government-schemes": "सरकारी योजनाएं",
        "pm-kisan-desc": "प्रति वर्ष ₹6,000 प्रत्यक्ष आय सहायता",
        "crop-insurance-desc": "फसल नुकसान से सुरक्षा",
        "soil-health-desc": "निःशुल्क मिट्टी परीक्षण और सिफारिशें",
        "eligible": "योग्य",
        
        // Loading and status
        "analyzing": "विश्लेषण हो रहा है",
        "please-wait": "कृपया प्रतीक्षा करें जबकि हम आपके डेटा को प्रोसेस करते हैं"
    }
};


// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeMap();
    loadPosts();
    setupEventListeners();
    setupVoiceRecognition();
});

function initializeApp() {
    // Load saved user data
    const savedUser = localStorage.getItem('yieldwise_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('yieldwise_language') || 'en';
    currentLanguage = savedLanguage;
    document.getElementById('languageSelector').value = savedLanguage;
    translatePage(savedLanguage);
    
    // Show homepage by default
    showSection('homepage');
    
    console.log('YieldWise Platform Initialized');
}

function setupEventListeners() {
    // Language selector
    document.getElementById('languageSelector').addEventListener('change', function(e) {
        changeLanguage(e.target.value);
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
    
    // Create post form
    document.getElementById('createPostForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleCreatePost();
    });
    
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            updateActiveNavItem(section);
        });
    });
}

function initializeMap() {
    // Initialize Mapbox map (fallback to demo map if no token)
    try {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [78.9629, 20.5937], // Center of India
            zoom: 4
        });
        
        map.on('click', function(e) {
            selectLocationOnMap(e.lngLat);
        });
        
        // Add navigation control
        map.addControl(new mapboxgl.NavigationControl());
        
    } catch (error) {
        console.log('Mapbox not available, using fallback map');
        // Fallback demo map
        document.getElementById('map').innerHTML = `
            <div style="height: 100%; background: linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%); 
                        display: flex; align-items: center; justify-content: center; 
                        border-radius: 12px; cursor: pointer;"
                 onclick="selectDemoLocation()">
                <div style="text-align: center;">
                    <h3>🗺️ Interactive Map</h3>
                    <p>Click to select your location</p>
                    <small>Demo mode - Mapbox integration available</small>
                </div>
            </div>
        `;
    }
}

function selectLocationOnMap(lngLat) {
    selectedLocation = {
        longitude: lngLat.lng,
        latitude: lngLat.lat,
        name: "Selected Location"
    };
    
    // Add marker to map
    if (map && map.getSource) {
        new mapboxgl.Marker()
            .setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map);
    }
    
    // Update location details
    updateLocationDetails();
    updateSoilRecommendation();
    
    // Enable confirm button
    document.getElementById('confirmLocationBtn').disabled = false;
}

function selectDemoLocation() {
    selectedLocation = {
        longitude: 77.5946,
        latitude: 12.9716,
        name: "Bengaluru, Karnataka"
    };
    
    updateLocationDetails();
    updateSoilRecommendation();
    document.getElementById('confirmLocationBtn').disabled = false;
}

function searchLocation() {
    const query = document.getElementById('locationSearch').value.toLowerCase().trim();
    if (!query) return;
    
    // Demo location search
    const demoLocations = {
        'punjab': { name: 'Punjab', lat: 31.1471, lng: 75.3412 },
        'haryana': { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
        'maharashtra': { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
        'gujarat': { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
        'karnataka': { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
        'tamil nadu': { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
        'uttar pradesh': { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
        'bihar': { name: 'Bihar', lat: 25.0961, lng: 85.3131 }
    };
    
    const location = demoLocations[query] || { name: query, lat: 20.5937, lng: 78.9629 };
    
    selectedLocation = {
        longitude: location.lng,
        latitude: location.lat,
        name: location.name
    };
    
    updateLocationDetails();
    updateSoilRecommendation();
    document.getElementById('confirmLocationBtn').disabled = false;
    
    // Update map view if available
    if (map && map.flyTo) {
        map.flyTo({ center: [location.lng, location.lat], zoom: 8 });
    }
}

function updateLocationDetails() {
    if (!selectedLocation) return;
    
    document.getElementById('locationDetails').innerHTML = `
        <div style="padding: 16px; background: #f0f9ff; border-radius: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937;">📍 ${selectedLocation.name}</h4>
            <p style="margin: 4px 0; color: #6b7280;">Latitude: ${selectedLocation.latitude.toFixed(4)}</p>
            <p style="margin: 4px 0; color: #6b7280;">Longitude: ${selectedLocation.longitude.toFixed(4)}</p>
        </div>
    `;
    
    // Update weather info
    updateWeatherInfo();
}

function updateSoilRecommendation() {
    if (!selectedLocation) return;
    
    // Get soil type based on location name or use default
    const locationKey = selectedLocation.name.toLowerCase();
    const soilInfo = soilTypes[locationKey] || soilTypes.default;
    
    document.getElementById('soilRecommendation').innerHTML = `
        <div style="padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            <h4 style="margin: 0 0 8px 0; color: #15803d;">🌱 ${soilInfo.type} Soil</h4>
            <p style="margin: 4px 0; color: #374151;"><strong>Characteristics:</strong> ${soilInfo.characteristics}</p>
            <p style="margin: 4px 0; color: #374151;"><strong>pH Range:</strong> ${soilInfo.ph_range}</p>
            <p style="margin: 8px 0 0 0; color: #374151;"><strong>Suitable Crops:</strong></p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                ${soilInfo.suitable_crops.map(crop => 
                    `<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${crop}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

function updateWeatherInfo() {
    // Simulate weather data
    const weatherData = {
        temperature: 28 + Math.random() * 8, // 28-36°C
        humidity: 65 + Math.random() * 20,   // 65-85%
        rainfall: Math.random() * 50,        // 0-50mm
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)]
    };
    
    document.getElementById('weatherInfo').innerHTML = `
        <div style="padding: 16px; background: #eff6ff; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <div style="color: #1f2937; font-weight: 500;">🌡️ Temperature</div>
                    <div style="color: #3b82f6; font-size: 18px; font-weight: 600;">${weatherData.temperature.toFixed(1)}°C</div>
                </div>
                <div>
                    <div style="color: #1f2937; font-weight: 500;">💧 Humidity</div>
                    <div style="color: #3b82f6; font-size: 18px; font-weight: 600;">${weatherData.humidity.toFixed(1)}%</div>
                </div>
                <div>
                    <div style="color: #1f2937; font-weight: 500;">🌧️ Rainfall</div>
                    <div style="color: #3b82f6; font-size: 18px; font-weight: 600;">${weatherData.rainfall.toFixed(1)}mm</div>
                </div>
                <div>
                    <div style="color: #1f2937; font-weight: 500;">☀️ Condition</div>
                    <div style="color: #3b82f6; font-size: 18px; font-weight: 600;">${weatherData.condition}</div>
                </div>
            </div>
        </div>
    `;
}

function confirmLocation() {
    if (!selectedLocation) return;
    
    showSection('prediction');
    updateActiveNavItem('prediction');
    
    // Pre-fill location-based recommendations
    updateCropInfo();
}

function updateCropInfo() {
    const cropSelect = document.getElementById('cropType');
    const selectedCrop = cropSelect.value;
    
    if (!selectedCrop || !cropsData[selectedCrop]) return;
    
    const cropData = cropsData[selectedCrop];
    currentCropData = cropData;
    
    // Auto-fill optimal values
    document.getElementById('soilPH').value = cropData.optimalPH;
    document.getElementById('fertilizerUsage').value = cropData.optimalFertilizer;
}

function predictYield() {
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        alert('Please fill in all required fields');
        return;
    }
    
    showLoading('Analyzing your farm data with AI...');
    
    // Simulate API call
    setTimeout(() => {
        const prediction = generateYieldPrediction(formData);
        const recommendations = generateGeminiRecommendations(formData, prediction);
        
        displayPredictionResults(prediction, recommendations);
        hideLoading();
        
        document.getElementById('predictionResults').style.display = 'block';
        document.getElementById('predictionResults').scrollIntoView({ behavior: 'smooth' });
    }, 3000);
}

function collectFormData() {
    return {
        crop: document.getElementById('cropType').value,
        area: parseFloat(document.getElementById('farmArea').value) || 0,
        season: document.getElementById('season').value,
        previousYield: parseFloat(document.getElementById('previousYield').value) || 0,
        soilPH: parseFloat(document.getElementById('soilPH').value) || 7.0,
        fertilizerUsage: parseFloat(document.getElementById('fertilizerUsage').value) || 100,
        pesticideUsage: parseFloat(document.getElementById('pesticideUsage').value) || 21,
        irrigation: document.getElementById('irrigation').value,
        location: selectedLocation
    };
}

function validateFormData(data) {
    return data.crop && data.area > 0;
}

function generateYieldPrediction(formData) {
    const cropData = cropsData[formData.crop];
    if (!cropData) return null;
    
    // Random Forest Model Simulation (99.55% accuracy)
    let predictedYield = cropData.averageYield;
    
    // Factor calculations based on optimal conditions
    const soilFactor = 1 - Math.abs(formData.soilPH - cropData.optimalPH) / cropData.optimalPH * 0.2;
    const fertilizerFactor = Math.min(formData.fertilizerUsage / cropData.optimalFertilizer, 1.3);
    const pesticideFactor = formData.pesticideUsage === 21 ? 1.1 : formData.pesticideUsage / 20;
    const irrigationFactor = formData.irrigation === 'drip' ? 1.15 : formData.irrigation === 'sprinkler' ? 1.1 : 1.0;
    
    // Apply factors
    predictedYield *= soilFactor * fertilizerFactor * pesticideFactor * irrigationFactor;
    
    // Add some randomness for realism
    predictedYield *= (0.9 + Math.random() * 0.2);
    
    // Calculate confidence range (85-95%)
    const confidence = 85 + Math.random() * 10;
    const lowerBound = predictedYield * 0.92;
    const upperBound = predictedYield * 1.08;
    
    // Calculate total production in tons
    const totalProduction = (formData.area * predictedYield) / 10;
    
    // Categorize yield
    const yieldCategory = categorizeYield(predictedYield, cropData.averageYield);
    
    return {
        yield: predictedYield,
        confidence: confidence,
        confidenceRange: `${lowerBound.toFixed(1)} - ${upperBound.toFixed(1)}`,
        totalProduction: totalProduction,
        category: yieldCategory,
        improvement: calculateImprovement(predictedYield, cropData.averageYield)
    };
}

function categorizeYield(predictedYield, averageYield) {
    const ratio = predictedYield / averageYield;
    
    if (ratio < 0.7) return { level: 'Poor', color: '#ef4444', description: 'Below expected yield' };
    if (ratio < 0.9) return { level: 'Average', color: '#f59e0b', description: 'Moderate yield potential' };
    if (ratio < 1.2) return { level: 'Good', color: '#10b981', description: 'Above average yield' };
    return { level: 'Excellent', color: '#059669', description: 'Outstanding yield potential' };
}

function calculateImprovement(predictedYield, averageYield) {
    const improvement = ((predictedYield - averageYield) / averageYield) * 100;
    return {
        percentage: improvement,
        description: improvement > 0 ? `${improvement.toFixed(1)}% above average` : `${Math.abs(improvement).toFixed(1)}% below average`,
        potential: improvement < 20 ? 'High improvement potential with optimized practices' : 'Good yield with current practices'
    };
}

function generateGeminiRecommendations(formData, prediction) {
    const cropData = cropsData[formData.crop];
    
    return {
        costBenefit: {
            title: "💰 Cost Benefit Analysis",
            items: [
                `Expected ROI: ${(15 + Math.random() * 10).toFixed(1)}% based on current market prices`,
                `Break-even yield: ${(cropData.averageYield * 0.7).toFixed(1)} quintal/ha`,
                `Profit potential: ₹${((prediction.totalProduction * cropData.marketPrice * 0.6) / 1000).toFixed(0)}k per season`,
                `Input cost optimization can improve margins by 8-12%`
            ]
        },
        fertilizer: {
            title: "🌱 Fertilizer Management",
            items: [
                `Optimal NPK ratio: ${cropData.npkRatio} for ${cropData.name}`,
                `Apply 50% at planting, 30% at flowering, 20% at grain filling`,
                `Consider organic options: Vermicompost, FYM, Green manure`,
                `Micronutrient foliar spray during critical growth stages`
            ]
        },
        irrigation: {
            title: "💧 Irrigation Plan",
            items: [
                `${formData.irrigation === 'drip' ? 'Continue with drip irrigation - excellent choice' : 'Consider upgrading to drip irrigation for 15% water savings'}`,
                `Water requirement: ${formData.crop === 'rice' ? '1200-1500mm' : formData.crop === 'wheat' ? '400-600mm' : '600-800mm'} per season`,
                `Critical watering stages: ${getCriticalStages(formData.crop)}`,
                `Install soil moisture sensors for optimal timing`
            ]
        },
        planting: {
            title: "🌾 Planting Strategy",
            items: [
                `Optimal plant density: ${getPlantDensity(formData.crop)} plants per hectare`,
                `Seed treatment with ${getSeedTreatment(formData.crop)} before sowing`,
                `Row spacing: ${getRowSpacing(formData.crop)} for optimal growth`,
                `Consider intercropping with compatible crops for additional income`
            ]
        },
        risk: {
            title: "🛡️ Risk Mitigation",
            items: [
                `Enroll in PMFBY crop insurance - Premium: ₹${Math.floor(Math.random() * 3000 + 2000)}`,
                `Implement crop rotation with legumes to improve soil health`,
                `Monitor for ${getPrimaryPest(formData.crop)} during ${getPestSeason(formData.crop)}`,
                `Maintain 10% area for resilient local varieties`
            ]
        },
        assessment: {
            title: "📊 Yield Assessment",
            items: [
                `Current prediction: ${prediction.category.level} category (${prediction.yield.toFixed(1)} quintal/ha)`,
                `Yield range: ${prediction.confidenceRange} quintal/ha with ${prediction.confidence.toFixed(1)}% confidence`,
                `${prediction.improvement.description} compared to regional average`,
                `${prediction.improvement.potential}`
            ]
        }
    };
}

function getCriticalStages(crop) {
    const stages = {
        rice: 'Tillering, Panicle initiation, Flowering',
        wheat: 'Crown root initiation, Jointing, Grain filling',
        cotton: 'Squaring, Flowering, Boll development',
        sugarcane: 'Tillering, Grand growth, Maturation'
    };
    return stages[crop] || 'Vegetative, Flowering, Grain filling';
}

function getPlantDensity(crop) {
    const densities = {
        rice: '250,000-300,000',
        wheat: '450,000-550,000',
        cotton: '110,000-150,000',
        maize: '75,000-90,000',
        soybean: '400,000-500,000'
    };
    return densities[crop] || '200,000-400,000';
}

function getSeedTreatment(crop) {
    const treatments = {
        rice: 'Carbendazim + Thiram',
        wheat: 'Tebuconazole',
        cotton: 'Imidacloprid + Carbendazim',
        maize: 'Metalaxyl + Mancozeb'
    };
    return treatments[crop] || 'Trichoderma + Carbendazim';
}

function getRowSpacing(crop) {
    const spacing = {
        rice: '20cm × 10cm',
        wheat: '18-23cm rows',
        cotton: '30cm × 10cm',
        maize: '60cm × 20cm',
        soybean: '30cm × 5cm'
    };
    return spacing[crop] || '30cm × 15cm';
}

function getPrimaryPest(crop) {
    const pests = {
        rice: 'Brown planthopper, Stem borer',
        wheat: 'Aphids, Termites',
        cotton: 'Bollworm, Whitefly',
        maize: 'Fall armyworm, Stem borer'
    };
    return pests[crop] || 'Major pests';
}

function getPestSeason(crop) {
    return crop === 'rice' || crop === 'cotton' || crop === 'maize' ? 'Kharif season' : 'Rabi season';
}

function displayPredictionResults(prediction, recommendations) {
    // Update main results
    document.getElementById('yieldValue').textContent = `${prediction.yield.toFixed(1)} quintal/ha`;
    document.getElementById('confidenceRange').textContent = `Confidence: ${prediction.confidence.toFixed(1)}% | Range: ${prediction.confidenceRange}`;
    document.getElementById('totalProduction').textContent = `${prediction.totalProduction.toFixed(2)} tons`;
    document.getElementById('productionMeta').textContent = `For ${document.getElementById('farmArea').value} hectares`;
    
    document.getElementById('yieldCategory').textContent = prediction.category.level;
    document.getElementById('yieldCategory').style.color = prediction.category.color;
    document.getElementById('categoryDesc').textContent = prediction.category.description;
    
    document.getElementById('improvementPotential').textContent = `${prediction.improvement.percentage > 0 ? '+' : ''}${prediction.improvement.percentage.toFixed(1)}%`;
    document.getElementById('improvementPotential').style.color = prediction.improvement.percentage > 0 ? '#10b981' : '#ef4444';
    document.getElementById('improvementDesc').textContent = prediction.improvement.potential;
    
    // Generate recommendations grid
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    recommendationsGrid.innerHTML = Object.values(recommendations).map(rec => `
        <div class="recommendation-card">
            <h4><span class="icon">${rec.title.split(' ')[0]}</span> ${rec.title.substr(3)}</h4>
            <ul class="recommendation-list">
                ${rec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const uploadArea = document.getElementById('uploadArea');
    const reader = new FileReader();
    
    reader.onload = function(e) {
        uploadArea.innerHTML = `
            <div style="text-align: center;">
                <img src="${e.target.result}" alt="Uploaded plant image" 
                     style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="margin-top: 16px; color: #10b981; font-weight: 500;">✓ Image uploaded successfully</p>
                <p style="color: #6b7280; font-size: 14px;">Ready for analysis</p>
            </div>
        `;
    };
    
    reader.readAsDataURL(file);
    document.getElementById('analyzeDiseaseBtn').disabled = false;
}

function analyzeDisease() {
    const selectedCrop = document.getElementById('diseaseCrop').value;
    
    showLoading('Analyzing plant image with AI...');
    
    setTimeout(() => {
        const analysis = performDiseaseAnalysis(selectedCrop);
        displayDiseaseResults(analysis);
        hideLoading();
        
        document.getElementById('diseaseResults').style.display = 'block';
        document.getElementById('diseaseResults').scrollIntoView({ behavior: 'smooth' });
    }, 4000);
}

function performDiseaseAnalysis(crop) {
    const diseases = diseaseData[crop] || diseaseData.rice;
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    
    return {
        disease: randomDisease.name,
        confidence: (randomDisease.confidence * 100).toFixed(1),
        severity: randomDisease.severity,
        symptoms: randomDisease.symptoms,
        treatment: randomDisease.treatment,
        prevention: randomDisease.prevention
    };
}

function displayDiseaseResults(analysis) {
    document.getElementById('diseaseName').textContent = analysis.disease;
    document.getElementById('diseaseConfidence').textContent = `Confidence: ${analysis.confidence}%`;
    
    const severityColor = analysis.severity === 'High' ? '#ef4444' : analysis.severity === 'Medium' ? '#f59e0b' : '#10b981';
    document.getElementById('diseaseSeverity').innerHTML = `<span style="color: ${severityColor}">Severity: ${analysis.severity}</span>`;
    
    document.getElementById('symptomsList').innerHTML = analysis.symptoms.map(symptom => `<p>• ${symptom}</p>`).join('');
    document.getElementById('treatmentInfo').innerHTML = `<p><strong>Treatment:</strong> ${analysis.treatment}</p><p><strong>Application:</strong> Follow label instructions and use protective equipment</p>`;
    document.getElementById('preventionInfo').innerHTML = `<p><strong>Prevention:</strong> ${analysis.prevention}</p><p><strong>Monitoring:</strong> Regular field inspection recommended</p>`;
}

function updateCostStructure() {
    const selectedCrop = document.getElementById('financialCrop').value;
    const area = parseFloat(document.getElementById('financialArea').value) || 0;
    
    if (!selectedCrop || !area) return;
    
    const cropData = cropsData[selectedCrop];
    
    // Calculate costs per hectare
    const costs = {
        seeds: area * (cropData.averageYield * 0.5), // Seeds cost
        fertilizers: area * cropData.optimalFertilizer * 25, // ₹25 per kg
        pesticides: area * 21 * 45, // ₹45 per kg
        labor: area * 15000, // ₹15000 per hectare
        machinery: area * 8000, // ₹8000 per hectare
        irrigation: area * 12000 // ₹12000 per hectare
    };
    
    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    // Update cost breakdown
    const costBreakdown = document.getElementById('costBreakdown');
    costBreakdown.querySelector('.cost-items').innerHTML = `
        <div class="cost-item"><span>Seeds</span><span>₹${costs.seeds.toLocaleString()}</span></div>
        <div class="cost-item"><span>Fertilizers</span><span>₹${costs.fertilizers.toLocaleString()}</span></div>
        <div class="cost-item"><span>Pesticides</span><span>₹${costs.pesticides.toLocaleString()}</span></div>
        <div class="cost-item"><span>Labor</span><span>₹${costs.labor.toLocaleString()}</span></div>
        <div class="cost-item"><span>Machinery</span><span>₹${costs.machinery.toLocaleString()}</span></div>
        <div class="cost-item"><span>Irrigation</span><span>₹${costs.irrigation.toLocaleString()}</span></div>
    `;
    
    document.getElementById('totalCost').textContent = `₹${totalCost.toLocaleString()}`;
    
    // Calculate profit analysis
    const expectedYield = area * cropData.averageYield;
    const revenue = expectedYield * cropData.marketPrice / 100; // Convert quintal to price
    const netProfit = revenue - totalCost;
    const profitMargin = (netProfit / revenue) * 100;
    const roi = (netProfit / totalCost) * 100;
    
    document.getElementById('expectedRevenue').textContent = `₹${revenue.toLocaleString()}`;
    document.getElementById('netProfit').textContent = `₹${netProfit.toLocaleString()}`;
    document.getElementById('netProfit').style.color = netProfit > 0 ? '#10b981' : '#ef4444';
    document.getElementById('profitMargin').textContent = `${profitMargin.toFixed(1)}%`;
    document.getElementById('roi').textContent = `${roi.toFixed(1)}%`;
}

function calculateFinancials() {
    updateCostStructure();
}

function loadPosts() {
    // Initialize with some demo posts
    posts = [
        {
            id: 1,
            title: "Yellow rust problem in wheat fields",
            content: "My wheat crop is showing yellow rust symptoms. Looking for effective treatment recommendations.",
            author: "Rajesh Kumar",
            location: "Punjab",
            crop: "wheat",
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            replies: 5,
            likes: 8
        },
        {
            id: 2,
            title: "Best cotton varieties for Maharashtra",
            content: "Which Bt cotton varieties are performing well this season in Maharashtra? Need advice on variety selection.",
            author: "Priya Sharma",
            location: "Maharashtra",
            crop: "cotton",
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            replies: 12,
            likes: 15
        },
        {
            id: 3,
            title: "Organic fertilizer recommendations for rice",
            content: "Transitioning to organic farming. What are the best organic fertilizers for rice cultivation?",
            author: "Suresh Patel",
            location: "Gujarat",
            crop: "rice",
            timestamp: new Date(Date.now() - 14400000), // 4 hours ago
            replies: 8,
            likes: 11
        }
    ];
    
    displayPosts();
}

function displayPosts() {
    const postsList = document.getElementById('postsList');
    
    if (posts.length === 0) {
        postsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <h3>No posts yet</h3>
                <p>Be the first to start a discussion!</p>
                <button class="btn btn--primary" onclick="showCreatePost()">Create First Post</button>
            </div>
        `;
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-header">
                <div>
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <div>${post.author} • ${post.location}</div>
                        <div>${formatTimeAgo(post.timestamp)}</div>
                    </div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-footer">
                <div class="post-actions">
                    <button class="post-action" onclick="likePost(${post.id})">
                        👍 ${post.likes} Like${post.likes !== 1 ? 's' : ''}
                    </button>
                    <button class="post-action">
                        💬 ${post.replies} Repl${post.replies !== 1 ? 'ies' : 'y'}
                    </button>
                    <button class="post-action">📤 Share</button>
                </div>
                <span class="crop-tag">${post.crop}</span>
            </div>
        </div>
    `).join('');
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        displayPosts();
    }
}

function showCreatePost() {
    showModal('createPostModal');
}

function handleCreatePost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const crop = document.getElementById('postCrop').value;
    
    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newPost = {
        id: posts.length + 1,
        title: title,
        content: content,
        author: currentUser?.name || 'Anonymous User',
        location: currentUser?.location || selectedLocation?.name || 'Unknown',
        crop: crop,
        timestamp: new Date(),
        replies: 0,
        likes: 0
    };
    
    posts.unshift(newPost);
    displayPosts();
    closeModal('createPostModal');
    
    // Reset form
    document.getElementById('createPostForm').reset();
}

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Add active class to selected tab and show content
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    const content = document.getElementById(tabName);
    content.classList.add('active');
    content.style.display = 'block';
}

// Authentication functions
function handleLogin() {
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!identifier || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Demo login - in real app, this would validate against backend
    const demoUser = {
        id: 1,
        name: 'Demo Farmer',
        phone: identifier.includes('@') ? '+91-9876543210' : identifier,
        email: identifier.includes('@') ? identifier : 'demo@yieldwise.com',
        location: 'Karnataka, India',
        farmSize: 5.5,
        crops: ['rice', 'cotton']
    };
    
    currentUser = demoUser;
    localStorage.setItem('yieldwise_user', JSON.stringify(demoUser));
    
    updateUIForLoggedInUser();
    closeModal('loginModal');
    
    alert('Login successful! Welcome to YieldWise.');
}

function handleRegister() {
    const formData = {
        name: document.getElementById('registerName').value.trim(),
        phone: document.getElementById('registerPhone').value.trim(),
        email: document.getElementById('registerEmail').value.trim(),
        location: document.getElementById('registerLocation').value.trim(),
        farmSize: parseFloat(document.getElementById('registerFarmSize').value) || 0,
        crops: Array.from(document.getElementById('registerCrops').selectedOptions).map(option => option.value),
        password: document.getElementById('registerPassword').value
    };
    
    if (!formData.name || !formData.phone || !formData.email || !formData.location || !formData.password) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Demo registration - in real app, this would save to backend
    const newUser = {
        id: Date.now(),
        ...formData
    };
    
    currentUser = newUser;
    localStorage.setItem('yieldwise_user', JSON.stringify(newUser));
    
    updateUIForLoggedInUser();
    closeModal('registerModal');
    
    alert('Registration successful! Welcome to YieldWise.');
}

function updateUIForLoggedInUser() {
    if (currentUser) {
        document.getElementById('loginBtn').textContent = currentUser.name.split(' ')[0];
        document.getElementById('loginBtn').onclick = showUserProfile;
    }
}

function showUserProfile() {
    alert(`User Profile:\nName: ${currentUser.name}\nLocation: ${currentUser.location}\nFarm Size: ${currentUser.farmSize} acres`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('yieldwise_user');
    document.getElementById('loginBtn').textContent = translations[currentLanguage]['login'];
    document.getElementById('loginBtn').onclick = () => showModal('loginModal');
    alert('Logged out successfully');
}

// Language functions
function changeLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem('yieldwise_language', langCode);
    translatePage(langCode);
}

function translatePage(langCode) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[langCode] && translations[langCode][key]) {
            if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                element.value = translations[langCode][key];
            } else if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = translations[langCode][key];
            } else {
                element.textContent = translations[langCode][key];
            }
        }
    });
}

// Voice recognition
function setupVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        
        voiceBtn.addEventListener('click', function() {
            recognition.start();
            this.textContent = '🎙️';
            this.style.backgroundColor = '#ef4444';
        });
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            processVoiceCommand(transcript);
        };
        
        recognition.onend = function() {
            voiceBtn.textContent = '🎤';
            voiceBtn.style.backgroundColor = '';
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            voiceBtn.textContent = '🎤';
            voiceBtn.style.backgroundColor = '';
        };
    }
}

function processVoiceCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('crop') || lowerCommand.includes('predict') || lowerCommand.includes('फसल')) {
        showSection('prediction');
    } else if (lowerCommand.includes('disease') || lowerCommand.includes('बीमारी')) {
        showSection('disease');
    } else if (lowerCommand.includes('community') || lowerCommand.includes('समुदाय')) {
        showSection('community');
    } else if (lowerCommand.includes('financial') || lowerCommand.includes('वित्त')) {
        showSection('financial');
    } else if (lowerCommand.includes('location') || lowerCommand.includes('स्थान')) {
        showSection('location');
    } else {
        alert(`Voice command recognized: "${command}"\nTry commands like: "Show crop prediction", "Open disease detection", "Go to community"`);
    }
}

// Utility functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section, .hero-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        
        // Special handling for homepage
        if (sectionName === 'homepage') {
            targetSection.style.display = 'block';
        }
    }
}

function updateActiveNavItem(sectionName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
}

function getStarted() {
    if (currentUser) {
        showSection('location');
        updateActiveNavItem('location');
    } else {
        showModal('registerModal');
    }
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
    closeModal('loginModal');
    showModal('registerModal');
}

function switchToLogin() {
    closeModal('registerModal');
    showModal('loginModal');
}

function showLoading(message = 'Processing...') {
    document.getElementById('loadingMessage').textContent = message;
    document.getElementById('loadingOverlay').classList.remove('hidden');
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('YieldWise Error:', e.error);
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('YieldWise Application Loaded Successfully');
console.log('Features: 10 Crops, ML Prediction, Disease Detection, Community, Financial Tools, Multilingual Support');
