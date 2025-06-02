export const TERM_DATES_2025 = {
  term1: { start: new Date(2025, 1, 4), end: new Date(2025, 3, 11) },
  term2: { start: new Date(2025, 3, 28), end: new Date(2025, 5, 27) },
  term3: { start: new Date(2025, 6, 14), end: new Date(2025, 8, 19) },
  term4: { start: new Date(2025, 9, 6), end: new Date(2025, 11, 18) },
};

export function calculateEnrollmentYear(dateOfBirth: Date): number {
  return dateOfBirth.getFullYear() + 5;
}

export function calculateClassification(
  dateOfBirth: Date,
): "Year 0" | "Year 1" {
  const may1st = new Date(dateOfBirth.getFullYear(), 4, 1); // May 1st
  return dateOfBirth < may1st ? "Year 0" : "Year 1";
}

export function getIntakeDates(year: number): Date[] {
  const dates: Date[] = [];
  const terms = [
    TERM_DATES_2025.term1,
    TERM_DATES_2025.term2,
    TERM_DATES_2025.term3,
    TERM_DATES_2025.term4,
  ];

  terms.forEach((term) => {
    // First Monday of term
    const firstMonday = getNextMonday(term.start);
    dates.push(firstMonday);

    // Sixth Monday of term
    const sixthMonday = new Date(firstMonday);
    sixthMonday.setDate(sixthMonday.getDate() + 35); // 5 weeks later
    if (sixthMonday <= term.end) {
      dates.push(sixthMonday);
    }
  });

  return dates;
}

function getNextMonday(date: Date): Date {
  const result = new Date(date);
  const day = date.getDay();
  const diff = day === 0 ? 1 : 8 - day; // If Sunday (0), add 1; otherwise, add days until next Monday
  result.setDate(date.getDate() + diff);
  return result;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-NZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
