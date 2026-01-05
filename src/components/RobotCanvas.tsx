import { useEffect, useRef } from 'react';
import { useRobotStore } from '@/store/useRobotStore';

export function RobotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { x, y, rotation, currentAction } = useRobotStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw robot
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    // Robot body
    ctx.fillStyle = currentAction !== 'idle' ? '#3b82f6' : '#6b7280';
    ctx.fillRect(-20, -15, 40, 30);

    // Robot direction indicator
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(30, -5);
    ctx.lineTo(30, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw action text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Action: ${currentAction}`, 10, 30);
  }, [x, y, rotation, currentAction]);

  return (
    <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="bg-gray-900"
      />
    </div>
  );
}