import React from 'react';
import { render } from '@flopflip/test-utils';
import useIsMounted from './use-is-mounted';

const TestComponent = () => {
  const isMounted = useIsMounted();

  return (
    <ul>
      <li>Is mounted: {isMounted.current ? 'Yes' : 'No'}</li>
    </ul>
  );
};

describe('when mounted', () => {
  it('should indicate that component is mounted', () => {
    const rendered = render(<TestComponent />);

    expect(rendered.queryByText(/Is mounted: Yes/i)).toBeInTheDocument();
  });
});
