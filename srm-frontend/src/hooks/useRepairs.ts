import { useState } from 'react';
export const useRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  return { repairs, fetchRepairs: () => {} };
};
