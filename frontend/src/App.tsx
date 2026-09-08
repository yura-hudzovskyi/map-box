import { MapView } from './components/MapView';
import { MarkerControls } from './components/MarkerControls';
import { MarkerEditor } from './components/MarkerEditor';
import { StatsPanel } from './components/StatsPanel';
import { useMarkers } from './hooks/useMarkers';

export default function App() {
  const {
    markers,
    createScore,
    selectedId,
    selectedMarker,
    isCreating,
    notice,
    setCreateScore,
    selectMarker,
    addMarker,
    moveMarker,
    updateMarkerScore,
    deleteMarker,
    importMarkers,
    exportMarkers,
  } = useMarkers();

  return (
    <main className="app-shell">
      <MapView
        createScore={createScore}
        isCreating={isCreating}
        markers={markers}
        onCreate={addMarker}
        onMove={moveMarker}
        onSelect={selectMarker}
        selectedId={selectedId}
      />

      <MarkerControls
        hasMarkers={markers.length > 0}
        onExport={exportMarkers}
        onImport={importMarkers}
        onScoreChange={setCreateScore}
        score={createScore}
      />

      <StatsPanel markers={markers} />

      {selectedMarker && (
        <MarkerEditor
          marker={selectedMarker}
          onClose={() => selectMarker(null)}
          onDelete={deleteMarker}
          onScoreChange={updateMarkerScore}
        />
      )}

      {isCreating && <div className="saving-indicator">Saving marker...</div>}
      {notice && (
        <div className={`toast ${notice.type}`} role="status">
          {notice.message}
        </div>
      )}
    </main>
  );
}
