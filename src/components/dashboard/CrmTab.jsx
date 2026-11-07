import { Users, Repeat, MapPin, Trophy } from 'lucide-react';

// Placeholder: the API has no customer or CRM endpoints yet. The cards below mark where the
// metrics will go once the backend exposes them.
const PLANNED = [
  { icon: Users, title: 'Customers', note: 'Total customers and new sign-ups over time' },
  { icon: Repeat, title: 'Repeat buyers', note: 'New vs returning customers' },
  { icon: Trophy, title: 'Top customers', note: 'Highest spend and order count' },
  { icon: MapPin, title: 'Customer locations', note: 'Customers by city and state' },
];

export default function CrmTab() {
  return (
    <div className="space-y-4">
      <div className="bg-blush/40 border border-tan/40 rounded-xl px-5 py-4">
        <p className="text-sm font-medium text-ink">CRM dashboard coming soon</p>
        <p className="text-xs text-brown/60 mt-1">
          This view needs customer data from the backend, which isn&apos;t available yet.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANNED.map(({ icon: Icon, title, note }) => (
          <div key={title}
            className="bg-white/60 rounded-xl border border-dashed border-tan/50 p-5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blush/50 text-brown/50">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink/70">{title}</p>
              <p className="text-xs text-brown/50 mt-0.5">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
