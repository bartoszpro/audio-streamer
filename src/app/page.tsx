import React from "react";
import AudioStream from "../components/AudioStream";

const HomePage: React.FC = () => {
  return (
    <>
      <h1 className='text-center text-3xl font-bold my-8 mb-16'>
        Audio Streamer
      </h1>
      <div className='flex justify-center'>
        <AudioStream />
      </div>
    </>
  );
};

export default HomePage;
