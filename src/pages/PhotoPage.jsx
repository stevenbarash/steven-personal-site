import React from 'react';
import InstagramEmbed from "../components/InstagramEmbed"
import { useLocation } from 'react-router-dom';

const PhotoPage = () => {
  const location = useLocation();
  return (
    <div key={location.key}>
      <InstagramEmbed url="https://www.instagram.com/steven.photography"/>
    </div>
  );};

export default PhotoPage;