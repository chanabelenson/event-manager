// // ─── Initialize tables with runtime seating state ────────────────────────────

// function initTables(tables) {
//   return tables.map((t) => ({
//     ...t,
//     capacity: Number(t.capacity),
//     current_seats: 0,
//     seated_guests: [],
//   }));
// }

// // ─── Group guests by category ─────────────────────────────────────────────────

// function effectiveCount(guest) {
//   return Number(guest.status === 'confirmed' && guest.confirmed_count != null
//     ? guest.confirmed_count
//     : guest.guests_count);
// }

// function groupByCategory(guests) {
//   return guests.reduce((acc, guest) => {
//     const key = guest.category || 'ללא קטגוריה';
//     if (!acc[key]) acc[key] = [];
//     acc[key].push({ ...guest, guests_count: effectiveCount(guest) });
//     return acc;
//   }, {});
// }

// // ─── Remaining seats on a table ──────────────────────────────────────────────

// function freeSeats(table) {
//   return table.capacity - table.current_seats;
// }

// // ─── Seat a guest at a table ─────────────────────────────────────────────────

// function seatGuest(table, guest, overrideCount) {
//   const count = overrideCount ?? guest.guests_count;
//   table.seated_guests.push({ ...guest, guests_count: count, table_id: table.id });
//   table.current_seats += count;
// }

// // ─── Find best table with enough free seats ───────────────────────────────────

// function findTable(tables, seatsNeeded) {
//   return tables.find((t) => freeSeats(t) >= seatsNeeded) ?? null;
// }

// // ─── Split oversized group across multiple tables ────────────────────────────
// // If no single table fits the whole group, fill tables one by one until done.

// function splitGuest(tables, guest) {
//   let remaining = guest.guests_count;

//   // prefer tables that already have guests from the same category
//   const sorted = [...tables].sort((a, b) => {
//     const aHas = a.seated_guests.some((g) => g.category === guest.category) ? 1 : 0;
//     const bHas = b.seated_guests.some((g) => g.category === guest.category) ? 1 : 0;
//     return bHas - aHas;
//   });

//   for (const table of sorted) {
//     if (remaining <= 0) break;
//     const available = freeSeats(table);
//     if (available <= 0) continue;
//     const toSeat = Math.min(remaining, available);
//     seatGuest(table, guest, toSeat);
//     remaining -= toSeat;
//   }

//   if (remaining > 0) {
//     console.warn(`⚠️ לא היה מקום ל-${remaining} אנשים מקבוצת "${guest.guest_name}"`);
//   }
// }

// // ─── Phase 2: Backfill holes - sorted largest first ──────────────────────────

// function backfill(unseated, tables) {
//   const sorted = [...unseated].sort((a, b) => b.guests_count - a.guests_count);

//   for (const guest of sorted) {
//     const table = findTable(tables, guest.guests_count);
//     if (table) {
//       seatGuest(table, guest);
//     } else {
//       // try to split even in backfill phase
//       splitGuest(tables, guest);
//     }
//   }
// }

// // ─── Main: Auto seating arrangement ──────────────────────────────────────────

// export function autoArrangeSeating(guests, tables) {
//   const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
//   const workTables = initTables(tables);
//   const categoryGroups = groupByCategory(confirmedGuests);

//   // sort categories by total guests descending
//   const sortedCategories = Object.entries(categoryGroups).sort(
//     ([, a], [, b]) =>
//       b.reduce((s, g) => s + g.guests_count, 0) -
//       a.reduce((s, g) => s + g.guests_count, 0)
//   );

//   const unseated = [];

//   for (const [, categoryGuests] of sortedCategories) {
//     const sorted = [...categoryGuests].sort((a, b) => b.guests_count - a.guests_count);

//     for (const guest of sorted) {
//       const table = findTable(workTables, guest.guests_count);
//       if (table) {
//         seatGuest(table, guest);
//       } else if (workTables.some((t) => freeSeats(t) > 0)) {
//         // no single table fits - split across tables
//         splitGuest(workTables, guest);
//       } else {
//         unseated.push(guest);
//       }
//     }
//   }

//   // Phase 2: backfill remaining holes, largest groups first
//   if (unseated.length) backfill(unseated, workTables);

//   return workTables;
// }


// ─── Initialize tables with runtime seating state ────────────────────────────
function initTables(tables) {
  return tables.map((t) => ({
    ...t,
    capacity: Number(t.capacity),
    current_seats: 0,
    seated_guests: [],
  }));
}

// ─── Calculate effective guest count ─────────────────────────────────────────
function effectiveCount(guest) {
  return Number(
    guest.status === 'confirmed' && guest.confirmed_count != null
      ? guest.confirmed_count
      : guest.guests_count || 0
  );
}

// ─── Main Auto Seating Algorithm ──────────────────────────────────────────────
export function autoArrangeSeating(guests, tables) {
  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const workTables = initTables(tables);

  // 1. Group guests by category
  const categoryGroups = confirmedGuests.reduce((acc, guest) => {
    const key = guest.category || 'ללא קטגוריה';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...guest, effective_count: effectiveCount(guest) });
    return acc;
  }, {});

  // 2. Sort categories by total guest count descending
  const sortedCategories = Object.entries(categoryGroups).sort(
    ([, guestsA], [, guestsB]) =>
      guestsB.reduce((sum, g) => sum + g.effective_count, 0) -
      guestsA.reduce((sum, g) => sum + g.effective_count, 0)
  );

  // Flatten guests so we handle them by priority: largest categories first, 
  // and inside the category, from largest group to smallest.
  let priorityGuestList = [];
  for (const [, catGuests] of sortedCategories) {
    const sortedCatGuests = [...catGuests].sort((a, b) => b.effective_count - a.effective_count);
    priorityGuestList.push(...sortedCatGuests);
  }

  // 3. First Pass: Try to seat groups as a whole without splitting
  let unseatedGuests = [];

  for (const guest of priorityGuestList) {
    if (guest.effective_count === 0) continue;

    // Find a table that can fit the whole group AND preferably has people from the same category
    let bestTable = null;
    
    // Sort tables: those with the same category first, then by available seats
    const sortedTables = [...workTables].sort((a, b) => {
      const aHasCat = a.seated_guests.some(g => g.category === guest.category) ? 1 : 0;
      const bHasCat = b.seated_guests.some(g => g.category === guest.category) ? 1 : 0;
      if (aHasCat !== bHasCat) return bHasCat - aHasCat; // same category wins
      return (b.capacity - b.current_seats) - (a.capacity - a.current_seats); // more space wins
    });

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
      // If it doesn't fit as a whole anywhere, hold it for the split/backfill phase
      unseatedGuests.push(guest);
    }
  }

  // 4. Second Pass: Smart Split for groups that didn't fit anywhere as a whole
  // We only split if the group is larger than what any single empty table can hold,
  // or if we are running out of space.
  for (const guest of unseatedGuests) {
    let remainingToSeat = guest.effective_count;

    // Sort tables by available space, prioritizing tables that already have their category
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

      // STALWART RULE: NEVER exceed table capacity!
      const countToSeatInThisTable = Math.min(remainingToSeat, availableSeats);

      // Crucial Fix: Create a shallow copy with the split count so it doesn't break React state
      table.seated_guests.push({
        ...guest,
        effective_count: countToSeatInThisTable
      });
      table.current_seats += countToSeatInThisTable;
      remainingToSeat -= countToSeatInThisTable;
    }

    if (remainingToSeat > 0) {
      console.warn(`🛑 לא נותר מקום באולם עבור ${remainingToSeat} אורחים מתוך הקבוצה של ${guest.guest_name}`);
    }
  }

  return workTables;
}