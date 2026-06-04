// ─── Initialize tables with runtime seating state ────────────────────────────

function initTables(tables) {
  return tables.map((t) => ({
    ...t,
    capacity: Number(t.capacity),
    current_seats: 0,
    seated_guests: [],
  }));
}

// ─── Group guests by category ─────────────────────────────────────────────────

function groupByCategory(guests) {
  return guests.reduce((acc, guest) => {
    const key = guest.category || 'ללא קטגוריה';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...guest, guests_count: Number(guest.guests_count) });
    return acc;
  }, {});
}

// ─── Remaining seats on a table ──────────────────────────────────────────────

function freeSeats(table) {
  return table.capacity - table.current_seats;
}

// ─── Seat a guest at a table ─────────────────────────────────────────────────

function seatGuest(table, guest, overrideCount) {
  const count = overrideCount ?? guest.guests_count;
  table.seated_guests.push({ ...guest, guests_count: count, table_id: table.id });
  table.current_seats += count;
}

// ─── Find best table with enough free seats ───────────────────────────────────

function findTable(tables, seatsNeeded) {
  return tables.find((t) => freeSeats(t) >= seatsNeeded) ?? null;
}

// ─── Split oversized group across multiple tables ────────────────────────────
// If no single table fits the whole group, fill tables one by one until done.

function splitGuest(tables, guest) {
  let remaining = guest.guests_count;

  // prefer tables that already have guests from the same category
  const sorted = [...tables].sort((a, b) => {
    const aHas = a.seated_guests.some((g) => g.category === guest.category) ? 1 : 0;
    const bHas = b.seated_guests.some((g) => g.category === guest.category) ? 1 : 0;
    return bHas - aHas;
  });

  for (const table of sorted) {
    if (remaining <= 0) break;
    const available = freeSeats(table);
    if (available <= 0) continue;
    const toSeat = Math.min(remaining, available);
    seatGuest(table, guest, toSeat);
    remaining -= toSeat;
  }

  if (remaining > 0) {
    console.warn(`⚠️ לא היה מקום ל-${remaining} אנשים מקבוצת "${guest.guest_name}"`);
  }
}

// ─── Phase 2: Backfill holes - sorted largest first ──────────────────────────

function backfill(unseated, tables) {
  const sorted = [...unseated].sort((a, b) => b.guests_count - a.guests_count);

  for (const guest of sorted) {
    const table = findTable(tables, guest.guests_count);
    if (table) {
      seatGuest(table, guest);
    } else {
      // try to split even in backfill phase
      splitGuest(tables, guest);
    }
  }
}

// ─── Main: Auto seating arrangement ──────────────────────────────────────────

export function autoArrangeSeating(guests, tables) {
  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const workTables = initTables(tables);
  const categoryGroups = groupByCategory(confirmedGuests);

  // sort categories by total guests descending
  const sortedCategories = Object.entries(categoryGroups).sort(
    ([, a], [, b]) =>
      b.reduce((s, g) => s + g.guests_count, 0) -
      a.reduce((s, g) => s + g.guests_count, 0)
  );

  const unseated = [];

  for (const [, categoryGuests] of sortedCategories) {
    const sorted = [...categoryGuests].sort((a, b) => b.guests_count - a.guests_count);

    for (const guest of sorted) {
      const table = findTable(workTables, guest.guests_count);
      if (table) {
        seatGuest(table, guest);
      } else if (workTables.some((t) => freeSeats(t) > 0)) {
        // no single table fits - split across tables
        splitGuest(workTables, guest);
      } else {
        unseated.push(guest);
      }
    }
  }

  // Phase 2: backfill remaining holes, largest groups first
  if (unseated.length) backfill(unseated, workTables);

  return workTables;
}
