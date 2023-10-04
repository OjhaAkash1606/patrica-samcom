import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import styled from 'styled-components';
import Provider from '../App/AppProvider';
import { SupportedLanguage } from '../types/common.types';
import messages from '../i18n/messages';
import { useSession } from '../hooks';

export function renderWithProviders(ui: React.ReactElement) {
  function ChildWrapper({ children }: PropsWithChildren<{}>) {
    const { locale = SupportedLanguage.ENGLISH } = useSession();
    return (
      <ReactIntlProvider
        defaultLocale={SupportedLanguage.ENGLISH}
        locale={locale ?? 'en'}
        messages={messages[locale]}
      >
        {children}
      </ReactIntlProvider>
    );
  }

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider>
        <ChildWrapper>{children}</ChildWrapper>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
