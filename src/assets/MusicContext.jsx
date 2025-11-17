import { createContext } from 'react';

// This context will provide the audio state and control functions to any component that needs it.
const MusicContext = createContext(null);

export default MusicContext;