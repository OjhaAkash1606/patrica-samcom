import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react-test-renderer';
import Login from '../../../pages/auth/Login';

import { renderWithProviders } from '../../utils';

test('Login component', async () => {
  //when
  await renderWithProviders(<Login />);
  const emailTextbox = await screen.findByTestId('email');
  act(() => {
    fireEvent.change(emailTextbox, {
      target: { value: 'alon2@visualestate.com' },
    });
  });
  const passwordTextBox = await screen.findByTestId('password');
  act(() => {
    fireEvent.change(passwordTextBox, {
      target: { value: 'Alon1234' },
    });
  });
  const submitButton = await screen.findAllByRole('button');
  act(() => {
    fireEvent(
      submitButton.filter(e => e.getAttribute('type') === 'submit')[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
  });
  await new Promise(r => setTimeout(r, 10000));

  //then
  expect(window.document.location.pathname).toBe('/app');
});
