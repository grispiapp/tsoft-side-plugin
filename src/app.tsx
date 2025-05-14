import { Toaster } from "react-hot-toast";
import { GrispiProvider } from "./contexts/grispi-context";
import { StoreProvider } from "./contexts/store-context";
import { ScreenManager } from "./screens/screen-manager";

const App = () => {
  return (
    <StoreProvider>
      <GrispiProvider>
        <ScreenManager />
      </GrispiProvider>
      <Toaster position="bottom-center" />
    </StoreProvider>
  );
};

export default App;
