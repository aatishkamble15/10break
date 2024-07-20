async function calculateResumeTime() {
    const totalSleepRequired = 10; // hours
    const timeZoneOffsets = {
        'ET': 'America/New_York',    // Eastern Time
        'CT': 'America/Chicago',     // Central Time
        'MT': 'America/Denver',      // Mountain Time
        'PT': 'America/Los_Angeles', // Pacific Time
        'AKT': 'America/Anchorage',  // Alaska Time
        'HAT': 'Pacific/Honolulu'    // Hawaii-Aleutian Time
    };

    // Get user input
    const hoursSlept = parseInt(document.getElementById('hoursSlept').value) || 0;
    const minutesSlept = parseInt(document.getElementById('minutesSlept').value) || 0;

    // Get current Phoenix time from API
    const currentPhoenixTime = await getCurrentPhoenixTime();

    if (!currentPhoenixTime) {
        alert("Failed to fetch the current time for Phoenix, AZ.");
        return;
    }

    // Log the fetched time and moment object
    console.log("Fetched Phoenix Time (raw):", currentPhoenixTime.raw);
    console.log("Current Phoenix Time (moment object):", currentPhoenixTime.moment.format());

    // Calculate total minutes slept
    const totalSleptMinutes = (hoursSlept * 60) + minutesSlept;

    // Calculate remaining sleep time in minutes
    const totalRequiredSleepMinutes = totalSleepRequired * 60;
    const remainingSleepMinutes = totalRequiredSleepMinutes - totalSleptMinutes;

    // Calculate resume time in Phoenix time
    const resumeTimePhoenix = currentPhoenixTime.moment.add(remainingSleepMinutes, 'minutes');

    // Clear previous results
    const timeZoneList = document.getElementById('timeZones');
    timeZoneList.innerHTML = '';

    // Calculate and display resume time in each time zone
    for (const [zone, timeZoneName] of Object.entries(timeZoneOffsets)) {
        const resumeTime = resumeTimePhoenix.clone().tz(timeZoneName);
        const timeString = `${zone}: ${resumeTime.format('hh:mm A')} ${resumeTime.format('MM/DD/YYYY')}`;
        const listItem = document.createElement('li');
        listItem.textContent = timeString;
        timeZoneList.appendChild(listItem);
    }
}

// Function to get current Phoenix time from World Time API
async function getCurrentPhoenixTime() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/America/Phoenix');
        if (!response.ok) {
            console.error('Failed to fetch the current time for Phoenix, AZ.');
            return null;
        }
        const data = await response.json();
        console.log("API Response:", data);
        return { 
            raw: data.datetime, 
            moment: moment.tz(data.datetime, 'America/Phoenix') 
        };
    } catch (error) {
        console.error('Error fetching the current time for Phoenix, AZ:', error);
        return null;
    }
}
