import React, { useState } from 'react';
import { Widget } from '@happyreact/react';
 
import '@happyreact/react/theme.css';
 
const VotedYes = () => {
  return <span>Thanks for your feedback. We are glad you like it :)</span>;
};
 
const VotedNo = () => {
  return <span>Thanks for your feedback. We will try to improve :(</span>;
};
 
export default function Feedback({ resource }) {
  const [reaction, setReaction] = useState(null);
 
  const isReacted = reaction === 'Yes' || reaction === 'No';
  const _resource = String(resource).replace(/\//g, '-');
 
  const handleReaction = (params) => {
    setReaction(params.icon);
  };
 
  return (
    <div>
      <h3>Was this page helpful?</h3>
      {!isReacted ? (
        <div>
          <Widget
            token="8c828a21-ead0-4998-b98b-f465fd3e4e4f"
            resource={_resource}
            onReaction={handleReaction}
          />
        </div>
      ) : reaction === 'No' ? (
        <VotedNo />
      ) : (
        <VotedYes />
      )}
    </div>
  );
}

