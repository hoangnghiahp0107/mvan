import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Auth = lazy(() => import("./modules/Auth/Auth.jsx"));

function App() {
  return (
      <Suspense>
        <BrowserRouter>
          <Routes>
              <Route index element={<Auth/>} />
          </Routes>
        </BrowserRouter>
      </Suspense>
  );
}

export default App;
