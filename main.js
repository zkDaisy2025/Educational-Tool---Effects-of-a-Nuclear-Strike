// ===============================
// Cesium Setup
// ===============================
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1M2Y0YWY3Mi1lODY3LTQ0NjAtYWVmMi0zNWFlYTI1YzRjYzAiLCJpZCI6MzQwOTc1LCJpYXQiOjE3NTc3NTk3OTJ9.3-Fr8ZVd-hbUCK0wRDKiWORND9YxdXVxqaPIE34RoXk"; // replace with your own token


const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  animation: false,
  timeline: false
});

// Preload explosion sound
const explosionSound = new Audio("explosion.wav");
explosionSound.volume = 0.5;

// ===============================
// Dropdown population
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  populateCityDropdown("fromCity");
  populateCityDropdown("toCity");
  populateMissileDropdown("missileType", missiles);
  populateDropdown("burstHeight", burstHeights);
});

function populateCityDropdown(selectId) {
  const select = document.getElementById(selectId);
  Object.entries(cityGroups).forEach(([groupName, cities]) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = groupName;
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      optGroup.appendChild(option);
    });
    select.appendChild(optGroup);
  });
}

function populateMissileDropdown(selectId, missileList) {
  const select = document.getElementById(selectId);
  missileList.forEach(m => {
    const option = document.createElement("option");
    option.value = m.name;
    option.textContent = m.name; // only show the name
    select.appendChild(option);
  });
}



function populateDropdown(selectId, options) {
  const select = document.getElementById(selectId);
  options.forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

// ===============================
// Simulation logic
// ===============================
document.getElementById("flyBtn").addEventListener("click", () => {
  const fromCity = document.getElementById("fromCity").value;
  const toCity = document.getElementById("toCity").value;
  const selectedMissile = document.getElementById("missileType").value;
  const burstHeight = parseInt(document.getElementById("burstHeight").value);

  const missile = missiles.find(m => m.name === selectedMissile);

  if (!fromCity || !toCity || !missile || !burstHeight) {
    alert("Please select all options before firing!");
    return;
  }


// 🔹 Step 2: Casualty + blast estimates
const { low, high, blastRadii } = estimateCasualtiesAndBlast(missile.yield, burstHeight);

document.getElementById("summary").innerHTML = `
  <h3>Summary</h3>
  <div style="max-height: 200px; overflow-y: auto; font-size: 0.9em; line-height: 1.3;">
    <p><em>
      Assumed yield: <strong>${missile.yield} kt</strong><br>
      Burst height: <strong>${burstHeight} m</strong><br>
      Estimated casualties: <strong>${low.toLocaleString()} – ${high.toLocaleString()}</strong>
    </em></p>
    <p><em>
      Approximate blast radii:<br>
      - Severe destruction (20 psi): <strong>${blastRadii.severe} km</strong><br>
      - Moderate destruction (5 psi): <strong>${blastRadii.moderate} km</strong><br>
      - Light damage (1 psi): <strong>${blastRadii.light} km</strong>
    </em></p>
    <p style="font-style: italic; color: darkred; margin-top: 10px;">
      This is for educational purposes only, to show how horrifying nuclear weapons are, 
      and that we should never use them.
    </p>
  </div>
`;



  const from = cityCoords[fromCity];
  const to = cityCoords[toCity];

  // Distance (Haversine formula)
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = Cesium.Math.toRadians(lat2 - lat1);
    const dLon = Cesium.Math.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(Cesium.Math.toRadians(lat1)) *
      Math.cos(Cesium.Math.toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const dist = haversine(from[1], from[0], to[1], to[0]);

  // Check missile range
  if (dist > missile.range) {
    alert(`${missile.name} cannot reach ${toCity}. Distance = ${dist.toFixed(0)} km, Range = ${missile.range} km`);
    return;
  }

  const speed = missile.speed; // use missile’s own speed
  const flightTimeHours = dist / speed;
  const flightTimeMinutes = flightTimeHours * 60;

 
// Update outputs
document.getElementById("outputMissile").textContent = missile.name;
document.getElementById("outputRange").textContent = missile.range.toLocaleString();
document.getElementById("outputYield").textContent = missile.yield.toLocaleString();
document.getElementById("outputSpeed").textContent = missile.speed.toLocaleString();
document.getElementById("distance").textContent = dist.toFixed(1);
document.getElementById("time").textContent = flightTimeMinutes.toFixed(1);

  // Reset entities
  viewer.entities.removeAll();

  const start = Cesium.Cartesian3.fromDegrees(from[0], from[1], 0);
  const end = Cesium.Cartesian3.fromDegrees(to[0], to[1], 0);

  // Parabolic flight path
  function createParabola(start, end, steps) {
    const startCarto = Cesium.Cartographic.fromCartesian(start);
    const endCarto = Cesium.Cartographic.fromCartesian(end);

    const R = 6371000; // Earth radius in meters
    const dLat = endCarto.latitude - startCarto.latitude;
    const dLon = endCarto.longitude - startCarto.longitude;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(startCarto.latitude) *
      Math.cos(endCarto.latitude) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    let height = distance * 0.1;
    if (height > 250000) height = 250000;

    const positions = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lon = Cesium.Math.lerp(startCarto.longitude, endCarto.longitude, t);
      const lat = Cesium.Math.lerp(startCarto.latitude, endCarto.latitude, t);
      const h = 4 * height * t * (1 - t);
      positions.push(Cesium.Cartesian3.fromRadians(lon, lat, h));
    }
    return positions;
  }

  const flightPath = createParabola(start, end, 200);

  // Animate along path
  const property = new Cesium.SampledPositionProperty();
  const startTime = Cesium.JulianDate.now();
  const totalSeconds = flightTimeHours * 3600;

  flightPath.forEach((pos, i) => {
    const time = Cesium.JulianDate.addSeconds(
      startTime,
      (i / flightPath.length) * totalSeconds,
      new Cesium.JulianDate()
    );
    property.addSample(time, pos);
  });

  const dot = viewer.entities.add({
    position: property,
    point: { pixelSize: 12, color: Cesium.Color.RED }
  });

  viewer.entities.add({
    polyline: { positions: flightPath, width: 2, material: Cesium.Color.RED }
  });



  // Add blast radius circles (using km → meters)
const circleDefs = [
  { radius: blastRadii.severe * 1000, color: Cesium.Color.RED, label: "Severe" },
  { radius: blastRadii.moderate * 1000, color: Cesium.Color.ORANGE, label: "Moderate" },
  { radius: blastRadii.light * 1000, color: Cesium.Color.YELLOW, label: "Light" }
];

circleDefs.forEach(c => {
  viewer.entities.add({
    position: end,
    ellipse: {
      semiMinorAxis: c.radius,
      semiMajorAxis: c.radius,
      material: c.color.withAlpha(0.3),
      height: 5000,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      outline: true,
      outlineColor: c.color
    }
  });

  // Optional: Add labels
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(to[0], to[1], 0),
    label: {
      text: `${c.label}: ${Math.round(c.radius/1000)} km`,
      font: "12px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, -40)
    }
  });
});




  // Clock animation
  viewer.clock.startTime = startTime.clone();
  viewer.clock.stopTime = Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate());
  viewer.clock.currentTime = startTime.clone();
  viewer.clock.multiplier = totalSeconds / 20; // speed up playback
  viewer.clock.shouldAnimate = true;
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
  viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
  viewer.trackedEntity = dot;

  // Zoom & explosion when finished
  const endTime = Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate());
  function zoomToCity(clock) {
    if (Cesium.JulianDate.greaterThanOrEquals(clock.currentTime, endTime)) {
      explosionSound.play();
      showDamageMessage(toCity, missile, burstHeight);
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(to[0], to[1], 40000),
        orientation: { heading: 0.0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0.0 },
        duration: 3
      });
      viewer.clock.onTick.removeEventListener(zoomToCity);
    }
  }
  viewer.clock.onTick.addEventListener(zoomToCity);
});

// ===============================
// Damage message
// ===============================
function showDamageMessage(city, missile, burstHeight) {
  const population = cityPopulations[city] || 1000;

  const msg = `
    <em style="font-size:12px;">
      Target city: <strong>${city}</strong><br>
      Estimated population: <strong>${population.toLocaleString()}</strong><br>
      Burst height: <strong>${burstHeight} m</strong><br><br>
      The detonation occurs above the city. Expect a blinding flash, a powerful blast wave,
      widespread fires, and severe radiation effects.  
      This is a **simulation for educational purposes only**.
    </em>
  `;
  document.getElementById("damageText").innerHTML = msg;
}

function estimateCasualtiesAndBlast(yieldKt, burstHeight) {
  // Base reference (20 kt, 540 m)
  const baseYield = 20;
  const baseCasualties = 175000;

  // Casualty scaling (cube root of yield)
  let casualties = baseCasualties * Math.pow(yieldKt / baseYield, 1/3);

  // Burst height effect (simplified)
  if (burstHeight < 200) {
    casualties *= 0.7; 
  } else if (burstHeight > 2000) {
    casualties *= 0.5;
  }

  const low = Math.round(casualties * 0.85);
  const high = Math.round(casualties * 1.15);

  // Blast radius scaling (cube root law, relative to 20 kt reference)
  // Reference values (approximate, from nuclear effects handbooks):
  // - 20 psi (severe destruction) → 0.6 km
  // - 5 psi (moderate destruction) → 1.7 km
  // - 1 psi (light damage, windows shatter) → 4.7 km
  const scale = Math.pow(yieldKt / baseYield, 1/3);

  const blastRadii = {
    severe: (0.6 * scale).toFixed(1),   // km
    moderate: (1.7 * scale).toFixed(1), // km
    light: (4.7 * scale).toFixed(1)     // km
  };

  return { low, high, blastRadii };
}



