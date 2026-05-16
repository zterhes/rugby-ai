/**
 * Mock team data used by Schedule page dropdowns until a real backend is wired in.
 */

export type Team = {
  id: string;
  name: string;
  logo: string;
  venueMapUrl: string;
};

export const TEAMS: Team[] = [
  {
    id: "t-001",
    name: "Northern Knights",
    logo: "https://images.unsplash.com/photo-1519861531158-286d644df6ad?auto=format&fit=crop&q=80&w=100",
    venueMapUrl: "https://maps.google.com/?q=Kingspan+Stadium",
  },
  {
    id: "t-002",
    name: "Western Wolves",
    logo: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=100",
    venueMapUrl: "https://maps.google.com/?q=City+Park+Arena",
  },
  {
    id: "t-003",
    name: "Eastern Eagles",
    logo: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=100",
    venueMapUrl: "https://maps.google.com/?q=Eagles+Nest+Stadium",
  },
];
