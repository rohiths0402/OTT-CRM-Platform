export const celebrities = [
  {
    id: 1,
    name: "Arjun Varma",
    role: "Lead Actor",
    image: "/celebrities/celebrity-1.jpg",
  },
  {
    id: 2,
    name: "Meera Nair",
    role: "Actress",
    image: "/celebrities/celebrity-2.jpg",
  },
  {
    id: 3,
    name: "Kabir Anand",
    role: "Director",
    image: "/celebrities/celebrity-3.jpg",
  },
  {
    id: 4,
    name: "Tanvi Rao",
    role: "Actress and Host",
    image: "/celebrities/celebrity-4.jpg",
  },
  {
    id: 5,
    name: "Rohan Iyer",
    role: "Lead Actor",
    image: "/celebrities/celebrity-5.jpg",
  },
  {
    id: 6,
    name: "Sana Qureshi",
    role: "Playback Singer",
    image: "/celebrities/celebrity-6.jpg",
  },
];

export const todayShoot = {
  title: "The Blood Oath",
  scene: "Climax sequence",
  shift: "Night shoot",
  callTime: "6:30 PM",
  location: "Film City, Set 14",
  vanity: "Caravan 09, Bay A",
  costume: "Tactical gear",
};

export const attention = [
  {
    id: 1,
    title: "Approve the watch ad cut",
    detail: "30 second festival film",
    tag: "Today",
    tone: "gold",
    target: "deals",
  },
  {
    id: 2,
    title: "Sign the dubbing contract",
    detail: "Harbour Lights",
    tag: "This week",
    tone: "aqua",
    target: "contracts",
  },
];

const currentMonthDate = new Date();

export const upcoming = [
  {
    id: 1,
    day: "31",
    month: "Oct",
    title: "Night shoot continues",
    place: "Film City, Set 14",
    time: "6:30 PM",
    date: new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth(),
      31,
    ),
  },
  {
    id: 2,
    day: "02",
    month: "Nov",
    title: "Script narration meeting",
    place: "Chennai office",
    time: "4:00 PM",
    date: new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth() + 1,
      2,
    ),
  },
  {
    id: 3,
    day: "04",
    month: "Nov",
    title: "Brand photoshoot",
    place: "Studio 4",
    time: "10:30 AM",
    date: new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth() + 1,
      4,
    ),
  },
];

export const payments = {
  received: 850000,
  waiting: 675000,
  next: "Northlight Productions, 5 Nov",
};

export const projects = [
  {
    id: 1,
    title: "The Blood Oath",
    role: "Lead role",
    phase: "Shooting, day 38 of 52",
    progress: 74,
  },
  {
    id: 2,
    title: "Harbour Lights",
    role: "Cameo",
    phase: "Dubbing",
    progress: 92,
  },
];

export const recentPayments = [
  {
    id: 1,
    title: "Aster Watches",
    event: "Festival campaign shoot",
    date: "18 Oct 2026",
    amount: 200000,
    status: "Cleared",
  },
  {
    id: 2,
    title: "Northlight Productions",
    event: "The Blood Oath",
    date: "12 Oct 2026",
    amount: 175000,
    status: "Cleared",
  },
  {
    id: 3,
    title: "Studio Lotus",
    event: "Commercial shoot",
    date: "08 Oct 2026",
    amount: 98000,
    status: "Cleared",
  },
];

export const pendingPayments = [
  {
    id: 1,
    title: "Aster Watches",
    event: "Brand photoshoot",
    dueDate: "05 Nov 2026",
    amount: 120000,
    status: "Pending",
  },
  {
    id: 2,
    title: "Horizon Films",
    event: "Trailer promotion",
    dueDate: "12 Nov 2026",
    amount: 95000,
    status: "Pending",
  },
  {
    id: 3,
    title: "Chola Studios",
    event: "Script narration",
    dueDate: "18 Nov 2026",
    amount: 68000,
    status: "Pending",
  },
];


// export const notifications = [
//   {
//     id: 1,
//     title: "Call time updated",
//     desc: "Tonight's shoot now starts at 6:30 PM.",
//     time: "25m ago",
//     read: false,
//   },
//   {
//     id: 2,
//     title: "Payment received",
//     desc: "₹ 30 L advance from Lumen Studios.",
//     time: "2d ago",
//     read: false,
//   },
// ];
export const coverPhotos = [
  { id: 1, image: "/celebrities/celebrity-1.jpg" },
  { id: 2, image: "/celebrities/celebrity-2.jpg" },
  { id: 3, image: "/celebrities/celebrity-3.jpg" },
  { id: 4, image: "/celebrities/celebrity-4.jpg" },
  { id: 5, image: "/celebrities/celebrity-5.jpg" },
  { id: 6, image: "/celebrities/celebrity-6.jpg" },
];

export const manager = {
  name: "Priya Menon",
  phone: "919876543210",
  display: "+91 98765 43210",
};

export const notifications = [
  {
    id: 1,
    title: "Call time updated",
    desc: "Tonight's shoot now starts at 6:30 PM.",
    time: "25m ago",
    read: false,
    target: "schedule",
  },
  {
    id: 2,
    title: "Payment received",
    desc: "₹ 30 L advance from Lumen Studios.",
    time: "2d ago",
    read: false,
    target: "payments",
  },
  {
    id: 3,
    title: "Contract needs your signature",
    desc: "Festival Watch Campaign · Aster Watches",
    time: "1h ago",
    read: false,
    target: "contracts",
  },
  {
    id: 4,
    title: "Campaign cut is ready",
    desc: "Review the latest Aster Watches deliverable.",
    time: "3h ago",
    read: true,
    target: "deals",
  },
];
