const TableSection = ({ tables }) => {
  return (
    <div className="space-y-6">
      {tables.map((table, index) => {
        const TableComponent = table.component;

        return (
          <div key={index}>
            <TableComponent />
          </div>
        );
      })}
    </div>
  );
};

export default TableSection;
