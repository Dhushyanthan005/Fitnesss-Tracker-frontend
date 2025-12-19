// A super fake "chart" made with div bars (beginner UI)
export default function SimpleChart({ values, colorType }) {
  // values: array of numbers like [10, 20, 15]
  // colorType: optional to change bar color
  const maxValue = Math.max(...values) || 1;

  return (
    <div className="chartRow">
      {values.map((v, idx) => {
        // Scale the height proportionally
        const h = Math.max(10, (v / maxValue) * 100);
        const cls = colorType === "green" ? "bar bar2" : "bar";
        return (
          <div 
            key={idx} 
            className={cls} 
            style={{ height: h + "%" }}
            title={`Value: ${v}`}
          />
        );
      })}
    </div>
  );
}


