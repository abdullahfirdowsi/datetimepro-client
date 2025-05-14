import React, { useState, useEffect } from 'react';
import { getLocalTime, getAllTimeZones, getTimeZoneById } from '../services/TimeZoneService';
import './TimeZoneComponent.css'; 

const TimeZoneComponent = () => {
  const [localTime, setLocalTime] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [formattedDateTime, setFormattedDateTime] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      const localTimeData = await getLocalTime();
      setLocalTime(localTimeData);
      // Don't set formattedDateTime initially, keep it empty
      

      const timezonesData = await getAllTimeZones();
      setTimezones(timezonesData);
    };

    fetchInitialData();

    const interval = setInterval(async () => {
      // Update local time
      const localTimeData = await getLocalTime();
      setLocalTime(localTimeData);

      // Update selected timezone time if a timezone is selected
      if (selectedTimezone) {
        const timezoneData = await getTimeZoneById(selectedTimezone);
        setFormattedDateTime(timezoneData.currentTime);
      } else {
        setFormattedDateTime(''); // Leave empty when no timezone is selected
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  const handleTimezoneChange = async (event) => {
    const timeZoneId = event.target.value;
    setSelectedTimezone(timeZoneId);

    // Fetch and set the time immediately upon selection only if a timezone is selected
    if (timeZoneId) {
      const data = await getTimeZoneById(timeZoneId);
      setFormattedDateTime(data.currentTime);
    } else {
      setFormattedDateTime(''); // Clear the time when no timezone is selected
    }
  };

  return (
    <div className="datetime-wrapper">
        <div className="datetime-card">
            <div className="datetime-header">
                <h1>DateTime Display</h1>
                <p className="subtitle">Current Date and Time Across Timezones</p>
            </div>

            {/* System Information Section */}
            <div className="system-info">
                <h3>Your System Time Information</h3>
                <p>Local Timezone: {localTime?.displayName}</p>
                <p>Region: {localTime?.id}</p>
                <p>Local Time: 
                  {' '}{new Date().toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }).replace(' ', ' ')}
                </p>
            </div>

            <div className="timezone-section">
                <label htmlFor="timezone">Select Timezone:</label>
                <select
                    id="timezone"
                    value={selectedTimezone}
                    onChange={handleTimezoneChange}
                    className="timezone-select"
                >
                    <option value="">Select a timezone</option>
                    {timezones.map((tz) => (
                        <option key={tz.id} value={tz.id}>
                            {tz.displayName}
                        </option>
                    ))}
                </select>
            </div>
            {selectedTimezone && (
                <div className="time-display">
                    <div className="time-text">{formattedDateTime}</div>
                    {/* <div className="timezone-indicator" style={{ display: selectedTimezone !== localTime?.id ? 'block' : 'none' }}>
                        (Showing time in selected timezone)
                    </div>
                    <div className="timezone-indicator local" style={{ display: selectedTimezone === localTime?.id ? 'block' : 'none' }}>
                        (Showing your local time)
                    </div> */}
                </div>
            )}
        </div>
    </div>
  );
};

export default TimeZoneComponent;