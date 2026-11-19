'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Cake, Stethoscope, HeartPulse, NotebookText } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null; // hide empty fields instead of showing blanks
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-blush rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-brown" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-brown/50 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm text-ink mt-0.5 break-words whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

function Card({ title, children, empty }) {
  return (
    <div className="bg-white rounded-xl border border-tan/30 p-5 space-y-4">
      <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">{title}</h3>
      {children || <p className="text-sm text-brown/40 italic">{empty}</p>}
    </div>
  );
}

export default function ClientDetail({ client }) {
  const hasEmergency = client.emergencyContactName || client.emergencyContactPhone;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 overflow-y-auto"
    >
      <div className="px-8 pt-8 flex items-start gap-5">
        <Avatar name={client.name} size="xl" />
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-serif font-semibold text-ink">{client.name}</h2>
            <Badge status={client.status} />
          </div>
          <p className="text-sm text-brown/60 mt-1">
            {client.therapistName ? `Therapist: ${client.therapistName} · ` : ''}
            Client since {formatDate(client.createdAt)}
          </p>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Contact" empty="No contact details.">
          {(client.email || client.phone || client.address) && (
            <>
              <InfoRow icon={Mail} label="Email" value={client.email} />
              <InfoRow icon={Phone} label="Phone" value={client.phone} />
              <InfoRow icon={MapPin} label="Address" value={client.address} />
            </>
          )}
        </Card>

        <Card title="Personal" empty="No personal details.">
          {(client.dateOfBirth || client.therapistName) && (
            <>
              <InfoRow icon={Cake} label="Date of birth" value={client.dateOfBirth && formatDate(client.dateOfBirth)} />
              <InfoRow icon={Stethoscope} label="Therapist" value={client.therapistName} />
            </>
          )}
        </Card>

        <Card title="Emergency contact" empty="No emergency contact on file.">
          {hasEmergency && (
            <>
              <InfoRow icon={HeartPulse} label="Name" value={client.emergencyContactName} />
              <InfoRow icon={Phone} label="Phone" value={client.emergencyContactPhone} />
            </>
          )}
        </Card>

        <Card title="Session notes" empty="No session notes.">
          {client.sessionNotes && <InfoRow icon={NotebookText} label="Notes" value={client.sessionNotes} />}
        </Card>
      </div>
    </motion.div>
  );
}
