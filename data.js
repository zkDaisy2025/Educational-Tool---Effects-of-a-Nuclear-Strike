// =====================
// City Coordinates
// =====================
const cityCoords = {
  "Bangalore": [77.5946, 12.9716],
  "Beijing": [116.4074, 39.9042],
  "Chicago": [-87.6298, 41.8781],
  "Chengdu": [104.0665, 30.5728],
  "Delhi": [77.1025, 28.7041],
  "Guangzhou": [113.2644, 23.1291],
  "Houston": [-95.3698, 29.7604],
  "Islamabad": [73.0479, 33.6844],
  "Isfahan": [51.6776, 32.6546],
  "Jeddah": [39.1979, 21.4858],
  "Karachi": [67.0099, 24.8615],
  "Lahore": [74.3587, 31.5204],
  "London": [-0.1276, 51.5074],
  "Los Angeles": [-118.2437, 34.0522],
  "Moscow": [37.6173, 55.7558],
  "Mumbai": [72.8777, 19.0760],
  "New York": [-74.0060, 40.7128],
  "Novosibirsk": [82.9204, 55.0084],
  "Paris": [2.3522, 48.8566],
  "Pyongyang": [125.7625, 39.0392],
  "Riyadh": [46.6753, 24.7136],
  "Saint Petersburg": [30.3351, 59.9343],
  "Shanghai": [121.4737, 31.2304],
  "Shenzhen": [114.0579, 22.5431],
  "Tehran": [51.3890, 35.6892],
  "Tel Aviv": [34.7818, 32.0853],
  "Vladivostok": [131.8855, 43.1155],
  "Washington DC": [-77.0369, 38.9072],

  // Sea Targets
  "PK Sea Target": [67.0099, 23.8615],
  "USA Sea Target": [-72.0, 36.0],
  "Russia Sea Target": [150.0, 45.0],
  "China Sea Target": [122.0, 25.0],
  "North Korea Sea Target": [129.0, 38.0],
  "Israel Sea Target": [34.0, 31.5]
};

// =====================
// City Populations
// =====================
const cityPopulations = {
  "Chicago": 2716000,
  "Houston": 2328000,
  "Los Angeles": 3980400,
  "New York": 8419600,
  "Washington DC": 705749,
  "Moscow": 11920000,
  "Novosibirsk": 1619000,
  "Saint Petersburg": 5384000,
  "Vladivostok": 606500,
  "Yekaterinburg": 1494000,
  "Beijing": 21540000,
  "Chengdu": 16330000,
  "Guangzhou": 14040000,
  "Shanghai": 24240000,
  "Shenzhen": 12530000,
  "Pyongyang": 2900000,
  "Tel Aviv": 460613,
  "London": 8982000,
  "Paris": 2148000,
  "Isfahan": 1985000,
  "Tehran": 9000000,
  "Jeddah": 3976000,
  "Riyadh": 6881000,
  "Islamabad": 2200000,
  "Karachi": 16400000,
  "Lahore": 11100000,
  "Bangalore": 12000000,
  "Delhi": 19000000,
  "Mumbai": 20400000,
  "Sea Target": 1000
};

// =====================
// Dropdown Data
// =====================

// Grouped cities for dropdowns
const cityGroups = {
  "USA": ["Chicago", "Houston", "Los Angeles", "New York", "Washington DC"],
  "Russia": ["Moscow", "Novosibirsk", "Saint Petersburg", "Vladivostok", "Yekaterinburg"],
  "China": ["Beijing", "Chengdu", "Guangzhou", "Shanghai", "Shenzhen"],
  "North Korea": ["Pyongyang"],
  "Israel": ["Tel Aviv"],
  "Europe": ["London", "Paris"],
  "Iran": ["Isfahan", "Tehran"],
  "Saudi Arabia": ["Jeddah", "Riyadh"],
  "Pakistan": ["Islamabad", "Karachi", "Lahore"],
  "India": ["Bangalore", "Delhi", "Mumbai"],
  "Sea Targets": [
    "PK Sea Target",
    "USA Sea Target",
    "Russia Sea Target",
    "China Sea Target",
    "North Korea Sea Target",
    "Israel Sea Target"
  ]
};

// Missile options
// =====================
// Missile Data
// =====================
const missiles = [
  { name: "LGM-30 Minuteman USA", range: 13000, yield: 335, speed: 24000 },
  { name: "RS-28 Russia", range: 18000, yield: 50000, speed: 25000 },
  { name: "DF-31 China", range: 11200, yield: 1000, speed: 20000 },
  { name: "DF-41 China", range: 15000, yield: 2500, speed: 25000 },
  { name: "Hwasong-19 N Korea", range: 18000, yield: 1000, speed: 18000 },
  { name: "Agni-V India", range: 5000, yield: 200, speed: 24000 },
  { name: "Agni-VI India", range: 8000, yield: 300, speed: 24000 },
  { name: "Titan II USA", range: 16000, yield: 9000, speed: 23000 },
  { name: "H1 Ababeel", range: 2200, yield: 50, speed: 6000 },
  { name: "H2 Abdali", range: 200, yield: 20, speed: 1200 },
  { name: "H3 Ghaznavi", range: 290, yield: 12, speed: 1500 },
  { name: "H4 Shaheen1", range: 750, yield: 15, speed: 2500 },
  { name: "H5 Ghauri", range: 1250, yield: 20, speed: 3000 },
  { name: "H6 Shaheen2", range: 1500, yield: 25, speed: 3500 },
  { name: "H7 Babar", range: 350, yield: 10, speed: 900 },
  { name: "H8 Raad", range: 70, yield: 5, speed: 800 },
  { name: "H9 Nasr", range: 70, yield: 1, speed: 800 }
];

// =====================
// Burst Heights (user options, meters)
// =====================
const burstHeights = [200, 400, 540, 1000, 5000];