import React, { PureComponent } from 'react';
import welcome from '../assets/img_welcome@2x.png';
class Welcome extends PureComponent {
  render() {
    return (
      <div style={{textAlign:'center',paddingTop:160}}>
        <img src={welcome} alt="营销站" style={{ width: 284, height: 224 ,marginBottom:70}} />
        <p style={{fontWeight:400,fontSize:20,textAlign:'center',color:"#222"}}>欢迎使用<span style={{color:'#fe6a30'}}>营销站</span>管理后台</p>
      </div>
    );
  }
}

export default Welcome;
