/**
 * Mock schedule data used by the Schedule page until a real backend is wired in.
 */

export type MatchStatus = "Final" | "Upcoming";

export type ScheduleMatch = {
  id: number;
  opponent: string;
  date: string;
  monthLabel: string;
  venue: string;
  status: MatchStatus;
  logo: string;
  isActive?: boolean;
  result?: string;
  time?: string;
  isHomeFixture?: boolean;
  roundLabel?: string;
  meetTime?: string;
  meetLocation?: string;
  kitPrimary?: string;
  kitSecondary?: string;
  venueName?: string;
  venueAddress?: string;
  bannerImage?: string;
};

export const SCHEDULE_MATCHES: ScheduleMatch[] = [
  {
    id: 1,
    opponent: "Northern Knights",
    date: "Oct 14",
    monthLabel: "October 2023",
    venue: "Away • Kingspan Stadium",
    result: "W 24-10",
    status: "Final",
    logo: "https://images.unsplash.com/photo-1519861531158-286d644df6ad?auto=format&fit=crop&q=80&w=100",
    isHomeFixture: false,
    roundLabel: "Round 3",
    meetTime: "11:30",
    meetLocation: "Away Gate",
    kitPrimary: "Primary Red",
    kitSecondary: "Black Shorts",
    venueName: "Kingspan Stadium",
    venueAddress: "134 Queens Rd, Belfast",
    bannerImage:
      "https://images.unsplash.com/photo-1519861531158-286d644df6ad?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    opponent: "Western Wolves",
    date: "Nov 04",
    monthLabel: "November 2023",
    venue: "Home • City Park Arena",
    time: "15:00",
    status: "Upcoming",
    isActive: true,
    logo: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=100",
    isHomeFixture: true,
    roundLabel: "Round 4",
    meetTime: "13:30",
    meetLocation: "Locker Room A",
    kitPrimary: "Primary Red",
    kitSecondary: "Black Shorts",
    venueName: "City Park Arena",
    venueAddress: "123 Sports Blvd, Metro District",
    bannerImage:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    opponent: "Eastern Eagles",
    date: "Nov 18",
    monthLabel: "November 2023",
    venue: "Away • Eagle's Nest",
    time: "TBD",
    status: "Upcoming",
    logo: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=100",
    isHomeFixture: false,
    roundLabel: "Round 5",
    meetTime: "TBD",
    meetLocation: "Team Bus",
    kitPrimary: "Alternate White",
    kitSecondary: "Black Shorts",
    venueName: "Eagle's Nest",
    venueAddress: "7 Falcon Street, Eastborough",
    bannerImage:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1200",
  },
];
