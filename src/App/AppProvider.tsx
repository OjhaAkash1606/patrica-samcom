import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Notifications from 'components/Notifications';
import { IntlProvider } from 'i18n';
import history from 'router/history';
import store from 'store';
import ThemeProvider from 'styles/theme/ThemeProvider';

const AppProvider: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <IntlProvider>
        <ThemeProvider>
          <ConnectedRouter history={history}>{children}</ConnectedRouter>
          <Notifications />
        </ThemeProvider>
      </IntlProvider>
    </Provider>
  );
};

export default AppProvider;
