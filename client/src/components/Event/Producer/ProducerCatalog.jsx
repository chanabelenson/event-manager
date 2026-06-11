import './Producer.css';
import ProducerCard from './ProducerCard';

export default function ProducerCatalog({ producers, assignedId, onClickProducer }) {
  if (!producers.length) return <p>אין מפיקים רשומים במערכת</p>;

  const sorted = [
    ...producers.filter((p) => p.id === assignedId),
    ...producers.filter((p) => p.id !== assignedId),
  ];

  return (
    <div className="producer-catalog">
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
