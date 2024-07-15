import React from 'react';

interface UserProps {
  params: { id: string };
}

const User = ({ params }: UserProps) => {
  return <div>{params.id}</div>;
};

export default User;
