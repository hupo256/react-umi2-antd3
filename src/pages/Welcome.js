import React, { PureComponent } from 'react';
import DataBoard from './DataBoard/DataBoard';
class Welcome extends PureComponent {
  render() {
    return (
      <div ref="root">
        <DataBoard />
      </div>
    );
  }
}

export default Welcome;
