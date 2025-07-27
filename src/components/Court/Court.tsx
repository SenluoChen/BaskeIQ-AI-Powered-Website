import React, { useState, useEffect } from 'react';
import { Shot } from '../../types/Match.type';
import { usePutMatchMutation } from '../../store/api/MatchApi';

type CourtProps = {
  matchTimestamp: number; // timestamp of the match to update
  shots?: Shot[];         // initial shots
  editable?: boolean;
};

export default function Court({
  matchTimestamp,
  shots = [],
  editable = true,
}: CourtProps) {
  const [localShots, setLocalShots] = useState<Shot[]>([]);

  const [putMatch] = usePutMatchMutation();

  useEffect(() => {
    setLocalShots(shots);
  }, [shots]);

  const handleClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    made: boolean
  ) => {
    if (!editable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newShot: Shot = {
      x,
      y,
      type: made ? 'success' : 'failed',
    };

    const updatedShots = [...localShots, newShot];
    setLocalShots(updatedShots);

    // Immediately update the match in DB
    try {
      await putMatch({
        timestamp: matchTimestamp,
        shots: updatedShots,
      }).unwrap();
    } catch (err) {
      console.error('❌ Failed to update shots:', err);
    }
  };

  return (
    <div
      onClick={(e) => handleClick(e, true)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleClick(e, false);
      }}
      style={{
        backgroundImage: 'url(/01.jpg)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 700,
        height: 350,
        position: 'relative',
        aspectRatio: '16 / 9',
        transform: 'translateY(-20px)',
        cursor: editable ? 'crosshair' : 'default',
      }}
    >
      {localShots.map((shot, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: shot.y - 5,
            left: shot.x - 5,
            width: 11,
            height: 11,
            borderRadius: '50%',
            backgroundColor: shot.type === 'success' ? 'green' : 'red',
            border: '1px solid white',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
