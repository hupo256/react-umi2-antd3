import React, { Component } from 'react';
import PersonnelCheckbox from './PersonnelCheckbox';
import PersonnelRedio from './PersonnelRedio';
class Personnels extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    return props.type === 'radio' ? (
      <PersonnelRedio {...props} />
    ) : (
      <PersonnelCheckbox {...props} />
    );
  }
}
export default Personnels;
