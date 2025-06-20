import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './features/store';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
