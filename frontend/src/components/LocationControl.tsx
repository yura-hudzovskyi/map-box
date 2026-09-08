import { useState } from 'react';

import {
  LocationService,
  type MapCoordinates,
} from '../services/LocationService';

interface LocationControlProps {
  onLocate: (coordinates: MapCoordinates) => void;
}

type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

interface LocationState {
  status: LocationStatus;
  message: string;
}

const BUTTON_LABELS: Record<LocationStatus, string> = {
  idle: 'Show my city',
  loading: 'Locating...',
  success: 'Locate again',
  error: 'Try again',
};

const INITIAL_STATE: LocationState = { status: 'idle', message: '' };

export function LocationControl({ onLocate }: LocationControlProps) {
  const [state, setState] = useState(INITIAL_STATE);

  const locate = async () => {
    setState({ status: 'loading', message: '' });

    try {
      const coordinates = await LocationService.requestCoordinates();
      onLocate(coordinates);

      const city = await LocationService.findCity(coordinates).catch(
        () => 'Current location',
      );
      setState({ status: 'success', message: city });
    } catch {
      setState({
        status: 'error',
        message: 'Could not get location. Check browser permission.',
      });
    }
  };

  return (
    <div className="location-control">
      {state.message && (
        <div className={`location-message ${state.status}`} role="status">
          {state.message}
        </div>
      )}

      <button
        className="location-button"
        disabled={state.status === 'loading'}
        onClick={locate}
        title="Request location access and show my city"
        type="button"
      >
        <span aria-hidden="true" className="location-icon" />
        {BUTTON_LABELS[state.status]}
      </button>
    </div>
  );
}
