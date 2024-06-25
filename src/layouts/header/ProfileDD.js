import React from 'react';
import { DropdownItem } from 'reactstrap';
import { Lock } from 'react-feather';

const ProfileDD = ({ user }) => {
  return (
    <div>
      <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
        <span>
          <h5 className="mb-0 fw-medium">{user.fullName}</h5>
          <small className="text-muted">{user.email}</small>
        </span>
      </div>

      <DropdownItem className="px-4 py-3">
        <Lock size={20} className="text-muted" />
        &nbsp; Change Password
      </DropdownItem>
      <DropdownItem divider />
    </div>
  );
};

export default ProfileDD;
