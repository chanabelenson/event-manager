import ProducerCard from './ProducerCard';

export default function ProducerCatalog({ producers, assignedId, onClickProducer }) {
  if (!producers.length) return <p>אין מפיקים רשומים במערכת</p>;

  const sorted = [
    ...producers.filter((p) => p.id === assignedId),
    ...producers.filter((p) => p.id !== assignedId),
  ];

  return (
    <div className="events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
      {sorted.map((p) => (
        <ProducerCard
          key={p.id}
          producer={p}
          isAssigned={p.id === assignedId}
          onClick={() => onClickProducer(p)}
        />
      ))}
    </div>
  );
}
