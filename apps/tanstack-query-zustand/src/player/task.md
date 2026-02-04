### Revised Prompt for AI Assistant:

**Task: Implement a Global Audio Player State Management using Zustand**

**Context:**
I need to create a robust audio player business logic using **Zustand**.
The player should wrap a browser `Audio` instance and manage playback for
a web application that might display hundreds of tracks simultaneously.

**Core Requirements:**

1.  **Singleton Audio Instance:** Only one track can play at a time.
2.  **Playback Logic:**
    - `play(track, playlist)`: If it's a new track, start from 0. If it's the current track, resume from the paused moment.
    - `pause()`: Pause the current track and save the position.
    - `toggle(track, playlist)`: Smart toggle (play/pause).
3.  **Playlist Management:**
    - The store should know about the current playlist context.
    - When a track ends, automatically play the next one based on the current mode.
4.  **Playback Modes:**
    - `repeat`: 'off' | 'one' | 'all'
    - `shuffle`: boolean.
5.  **Performance & Scaling:**
    - The application will render lists with hundreds of tracks.
    - **Crucial:** Re-renders must be optimized. A track component should only re-render if its specific state (isCurrent, isPlaying) changes, not when the progress bar of another track moves.
6.  **Missing Requirements to Add:**
    - **Progress Tracking:** Handle `currentTime` and `duration` updates.
    - **Volume & Mute:** Global volume state.
    - **Loading State:** Handle `isLoading` or `isBuffering` states for the audio.
    - **Error Handling:** Handle cases where the audio source fails to load.

**Technical Specifications:**

- **Zustand Store:**
  - Define the state interface (Track object, CurrentState, Modes).
  - Define actions (play, pause, stop, next, previous, setVolume, setModes).
  - The `Audio` instance should be managed within the store (or a ref/service), ensuring event listeners (`onEnded`, `onTimeUpdate`) are properly synchronized with the state.
- **Selectors:**
  - Create efficient hooks or selectors to allow components to subscribe only to the necessary parts of the state.
- **Business Logic:**
  - Implement "Next Track" logic considering `shuffle` and `repeat` modes.
  - For `shuffle`, explain how you will handle the queue (e.g., a shuffled array of IDs).

**Expected Output:**

1.  **Zustand Store implementation:** Full code for the store using TypeScript.
2.  **Performance-optimized Selectors:** Examples of how to use `useStore` with shallow comparisons or specific selectors.
3.  **React Component Examples:**
    - `PlayerControls`: A global component for Play/Pause/Next/Prev/Progress/Volume.
    - `TrackItem`: A high-performance list item component that shows:
      - Play/Pause button for this specific track.
      - Visual indication if this track is currently active.
      - A progress bar that _only_ appears/updates if this specific track is the one playing.

**Focus solely on Business Logic and State Management.** Use a clean, modular approach. Ensure that the `Audio` object is properly cleaned up (listeners removed) to avoid memory leaks.

You can look at musicfun-react-all-stacks/apps/rtk-query/src/player to get imagination of what I want you do

---
