const ChartSection = ({ charts }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {charts.map((chart, index) => {
        const ChartComponent = chart.component;

        return (
          <div key={index}>
            <ChartComponent />
          </div>
        );
      })}
    </div>
  );
};

export default ChartSection;
