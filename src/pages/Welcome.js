import React, { PureComponent } from 'react';
class Welcome extends PureComponent {
  render() {
    return (
      <div ref="root">
        <p style={{fontWeight:600,fontSize:40,textAlign:'center'}}>营销站</p>
      </div>
    );
  }
}

export default Welcome;
