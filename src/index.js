import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


// import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/js/all.min.js'
import NotFound from './Components/NotFound/NotFound.jsx';


export const baseURL = 'http://localhost:3001/api/v1'
export const BEARERKEY = "gameStore3000__"
export const roles = { user: "user", admin: "admin", superAdmin: "superAdmin" }

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  // return (
  //   <div role="alert">
  //     <p>Something went wrong:</p>
  //     <pre style={{ color: "red" }}>{error.message}</pre>
  //     <button className='btn' onClick={resetErrorBoundary}> Try again </button>
  //   </div>
  // );
  return <> <NotFound error={error} resetErrorBoundary={resetErrorBoundary} /> </>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ErrorBoundary fallbackRender={fallbackRender} onReset={(details) => {


      }}>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  </BrowserRouter>
);
