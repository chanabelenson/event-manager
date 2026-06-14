function initTables(tables) {
  return tables.map((t) => ({
    ...t,
    capacity: Number(t.capacity),
    current_seats: 0,
    seated_guests: [],
  }));
}

function effectiveCount(guest) {
  return Number(
    guest.status === 'confirmed' && guest.confirmed_count != null
      ? guest.confirmed_count
      : guest.guests_count || 0
  );
}

export function autoArrangeSeating(guests, tables) {
  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const workTables = initTables(tables);

  const categoryGroups = confirmedGuests.reduce((acc, guest) => {
    const key = guest.category || 'ללא קטגוריה';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...guest, effective_count: effectiveCount(guest) });
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryGroups).sort(
    ([, guestsA], [, guestsB]) =>
      guestsB.reduce((sum, g) => sum + g.effective_count, 0) -
      guestsA.reduce((sum, g) => sum + g.effective_count, 0)
  );

  let priorityGuestList = [];
  for (const [, catGuests] of sortedCategories) {
    const sortedCatGuests = [...catGuests].sort((a, b) => b.effective_count - a.effective_count);
    priorityGuestList.push(...sortedCatGuests);
  }

  let unseatedGuests = [];

  for (const guest of priorityGuestList) {
    if (guest.effective_count === 0) continue;

    const sortedTables = [...workTables].sort((a, b) => {
      const aHasCat = a.seated_guests.some(g => g.category === guest.category) ? 1 : 0;
      const bHasCat = b.seated_guests.some(g => g.category === guest.category) ? 1 : 0;
      if (aHasCat !== bHasCat) return bHasCat - aHasCat;
      return (b.capacity - b.current_seats) - (a.capacity - a.current_seats);
    });

    let bestTable = null;
    for (const table of sortedTables) {
      if (table.capacity - table.current_seats >= guest.effective_count) {
        bestTable = table;
        break;
      }
    }

    if (bestTable) {
      bestTable.seated_guests.push(guest);
      bestTable.current_seats += guest.effective_count;
    } else {
      unseatedGuests.push(guest);
    }
  }

  for (const guest of unseatedGuests) {
    let remainingToSeat = guest.effective_count;

    const sortedTables = [...workTables]
      .filter(t => t.capacity - t.current_seats > 0)
      .sort((a, b) => {
        const aHasCat = a.seated_guests.some(g => g.category === guest.category) ? 1 : 0;
        const bHasCat = b.seated_guests.some(g => g.category === guest.category) ? 1 : 0;
        if (aHasCat !== bHasCat) return bHasCat - aHasCat;
        return (b.capacity - b.current_seats) - (a.capacity - a.current_seats);
      });

    for (const table of sortedTables) {
      if (remainingToSeat <= 0) break;
      const availableSeats = table.capacity - table.current_seats;
      if (availableSeats <= 0) continue;
      const countToSeatInThisTable = Math.min(remainingToSeat, availableSeats);
      table.seated_guests.push({ ...guest, effective_count: countToSeatInThisTable });
      table.current_seats += countToSeatInThisTable;
      remainingToSeat -= countToSeatInThisTable;
    }

    if (remainingToSeat > 0) {
      console.warn(`לא נותר מקום עבור ${remainingToSeat} אורחים מקבוצת ${guest.guest_name}`);
    }
  }

  return workTables;
}
