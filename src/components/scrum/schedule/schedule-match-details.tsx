import { MdAccessTime, MdGroups, MdLocationOn, MdSportsRugby } from "react-icons/md";
import type { ScheduleMatch } from "@/lib/data/schedule";

type ScheduleMatchDetailsProps = {
  activeMatch: ScheduleMatch | null;
};

export function ScheduleMatchDetails({ activeMatch }: ScheduleMatchDetailsProps) {
  return (
    <div className="xl:col-span-8">
      {activeMatch ? (
        <div className="bg-glass-fill/40 rounded-3xl border border-glass-border/40 overflow-hidden shadow-2xl relative backdrop-blur-xl">
          <div className="h-48 bg-gradient-to-r from-primary-container/30 to-surface-elevated relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 grayscale"
              style={{ backgroundImage: `url(${activeMatch.bannerImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-6 left-8 flex items-center gap-6">
              <div className="w-20 h-20 bg-background rounded-2xl border border-white/10 p-3 shadow-2xl">
                <img
                  src={activeMatch.logo}
                  alt={activeMatch.opponent}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-primary-container/20 text-primary rounded text-[10px] font-bold uppercase tracking-wider border border-primary-container/30">
                    {activeMatch.isHomeFixture ? "Home Fixture" : "Away Fixture"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    {activeMatch.roundLabel ?? "Round"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-on-background">{activeMatch.opponent}</h2>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailInfoCard
              icon={MdAccessTime}
              label="KICK-OFF"
              value={activeMatch.time ?? "TBD"}
              subValue={activeMatch.date}
            />
            <DetailInfoCard
              icon={MdGroups}
              label="MEET TIME"
              value={activeMatch.meetTime ?? "TBD"}
              subValue={activeMatch.meetLocation ?? "TBD"}
            />
            <DetailInfoCard
              icon={MdSportsRugby}
              label="KIT"
              value={activeMatch.kitPrimary ?? "TBD"}
              subValue={activeMatch.kitSecondary ?? "TBD"}
              customContent={<div className="w-3 h-3 rounded-full bg-primary mt-1" />}
            />
          </div>

          <div className="px-8 pb-8 flex items-center justify-between">
            <div className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-white/5 flex-1 mr-4">
              <div className="p-3 bg-surface-elevated rounded-xl">
                <MdLocationOn className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-background">{activeMatch.venueName ?? "Venue"}</h4>
                <p className="text-xs text-muted-foreground">{activeMatch.venueAddress ?? "Address TBD"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type DetailInfoCardProps = {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  subValue: string;
  customContent?: React.ReactNode;
};

function DetailInfoCard({ icon: Icon, label, value, subValue, customContent }: DetailInfoCardProps) {
  return (
    <div className="bg-background p-5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" aria-hidden />
        <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-on-background">{value}</span>
        {customContent}
      </div>
      <p className="text-[10px] text-muted-foreground font-medium mt-1">{subValue}</p>
    </div>
  );
}
