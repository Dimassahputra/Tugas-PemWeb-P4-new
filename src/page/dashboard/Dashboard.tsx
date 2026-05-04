type Stat = {
  title: string;
  value: number;
  icon: string;
};

type EventItem = {
  name: string;
  category: string;
  date: string;
};

type SpeakerItem = {
  name: string;
  job: string;
};

const stats: Stat[] = [
  { title: "Kategori", value: 10, icon: "🗂️" },
  { title: "Event", value: 25, icon: "📅" },
  { title: "Pembicara", value: 8, icon: "🎤" },
  { title: "Event Aktif", value: 5, icon: "✅" },
];

const latestEvents: EventItem[] = [
  { name: "Seminar AI 2025", category: "Seminar", date: "10 Jan 2026" },
  { name: "Workshop UI/UX", category: "Workshop", date: "15 Feb 2026" },
  { name: "Talkshow Startup", category: "Talkshow", date: "20 Mar 2026" },
];

const latestSpeakers: SpeakerItem[] = [
  { name: "Danang Avan M", job: "UI/UX Designer" },
  { name: "Lhuqita Fazry", job: "Software Engineer" },
  { name: "M. Dendi Purwanto", job: "Product Manager" },
];

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-400 uppercase">
          {stat.title}
        </span>
        <span className="text-2xl">{stat.icon}</span>
      </div>

      <p className="text-4xl font-bold text-[#1a0a10]">
        {stat.value}
      </p>

      <div className="h-1 w-10 bg-[#7B1D3F] rounded-full" />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-4 h-0.5 bg-[#7B1D3F]" />
      <h2 className="text-sm font-bold text-[#1a0a10]">{title}</h2>
    </div>
  );
}

function EventListItem({ item, isLast }: { item: EventItem; isLast: boolean }) {
  return (
    <li
      className={`flex items-center justify-between py-4 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      <div>
        <p className="font-semibold text-[#1a0a10]">{item.name}</p>
        <p className="text-sm text-gray-400">{item.date}</p>
      </div>

      <span className="text-sm bg-rose-100 text-[#7B1D3F] px-3 py-1 rounded-full font-medium">
        {item.category}
      </span>
    </li>
  );
}

function SpeakerListItem({
  item,
  index,
  isLast,
}: {
  item: SpeakerItem;
  index: number;
  isLast: boolean;
}) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-[#7B1D3F] to-[#c9395e]",
    "from-[#1a4f7B] to-[#3982c9]",
    "from-[#1a7B3F] to-[#39c970]",
  ];

  return (
    <li
      className={`flex items-center gap-4 py-4 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-brown ${
          colors[index % colors.length]
        } text-white text-sm font-bold flex items-center justify-center`}
      >
        {initials}
      </div>

      <div>
        <p className="font-semibold text-[#1a0a10]">{item.name}</p>
        <p className="text-sm text-gray-400">{item.job}</p>
      </div>
    </li>
  );
}

export default function Dashboard() {
  return (
    <div className="px-10 py-10 w-full space-y-10">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-0.5 bg-[#7B1D3F]" />
          <span className="text-xs font-semibold text-[#7B1D3F] uppercase tracking-widest">
            Overview
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#1a0a10]">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Ringkasan data Invofest hari ini
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* EVENT */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <SectionHeader title="Event Terbaru" />
          <ul>
            {latestEvents.map((item, i) => (
              <EventListItem
                key={item.name}
                item={item}
                isLast={i === latestEvents.length - 1}
              />
            ))}
          </ul>
        </div>

        {/* SPEAKER */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <SectionHeader title="Pembicara Terbaru" />
          <ul>
            {latestSpeakers.map((item, i) => (
              <SpeakerListItem
                key={item.name}
                item={item}
                index={i}
                isLast={i === latestSpeakers.length - 1}
              />
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}