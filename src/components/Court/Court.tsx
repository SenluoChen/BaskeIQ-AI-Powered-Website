import React, { useState } from 'react';

type ShotType = {
  x: number;
  y: number;
  made: boolean;
};

export default function Court() {
  const [shots, setShots] = useState<ShotType[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, made: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShots((prev) => [...prev, { x, y, made }]);
  };

  return (
    <div
      onClick={(e) => handleClick(e, true)} // 左鍵：進球
      onContextMenu={(e) => {
        e.preventDefault(); // 防止跳出瀏覽器右鍵選單
        handleClick(e, false); // 右鍵：未進
      }}
      style={{
        backgroundImage: 'url(/01.jpg)', // 換成你自己的球場圖
        backgroundSize: 'contain',
        width: '700',                   // ✅ 自適應寬度
        height: 350,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        aspectRatio: '16 / 9',
        position: 'relative',
        transform: 'translateY(-20px)',
      }}
    >
      {shots.map((shot, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: shot.y - 5,
            left: shot.x - 5,
            width: 11,
            height: 11,
            
            borderRadius: '50%',
            backgroundColor: shot.made ? 'green' : 'red',
            border: '1px solid white',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
