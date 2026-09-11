import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
} from "adhan";

export interface PrayerTimeEntry {
  name: string;
  azan: string;
  iqamah: string;
  azanTs: number;
  iqamahTs: number;
}

export interface DaySchedule {
  date: string;
  label: string;
  isToday: boolean;
  prayers: PrayerTimeEntry[];
}

export interface PrayerSettingsLike {
  calculationMethod?: string;
  timezone?: string;
  mode?: "auto" | "manual";
  coordinates?: { lat: number; lng: number };
  iqamahOffsets?: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  manualTimes?: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
}

const DEFAULT_TIMEZONE = "Asia/Dhaka";
const DEFAULT_COORDINATES = { lat: 23.8103, lng: 90.4125 };
const DEFAULT_OFFSETS = {
  fajr: 20,
  dhuhr: 15,
  asr: 15,
  maghrib: 10,
  isha: 15,
};

function getCalculationParameters(method?: string) {
  switch (method) {
    case "IslamicSocietyOfNorthAmerica":
      return CalculationMethod.NorthAmerica();
    case "MuslimWorldLeague":
      return CalculationMethod.MuslimWorldLeague();
    case "UmmAlQura":
      return CalculationMethod.UmmAlQura();
    case "EgyptianGeneralAuthorityOfSurvey":
      return CalculationMethod.Egyptian();
    case "UniversityOfIslamicSciencesKarachi":
    default:
      return CalculationMethod.Karachi();
  }
}

function formatTimeInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).format(date);
}

function formatDateInZone(date: Date, timeZone: string, format: "label" | "key") {
  if (format === "key") {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getTimezoneOffsetMs(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = Number(part.value);
  }

  const asUTC = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour,
    map.minute,
    map.second,
  );

  return asUTC - date.getTime();
}

function zonedTimeToDate(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  let guess = Date.UTC(year, month, day, hour, minute, 0);

  for (let i = 0; i < 3; i += 1) {
    const offset = getTimezoneOffsetMs(timeZone, new Date(guess));
    const corrected = Date.UTC(year, month, day, hour, minute, 0) - offset;
    if (corrected === guess) break;
    guess = corrected;
  }

  return new Date(guess);
}

function parseManualTime(date: Date, time?: string, timeZone?: string): Date | null {
  if (!time) return null;

  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  return zonedTimeToDate(
    timeZone ?? DEFAULT_TIMEZONE,
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
  );
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function computeDaySchedule(
  settings: PrayerSettingsLike,
  date: Date,
): DaySchedule {
  const timeZone = settings.timezone || DEFAULT_TIMEZONE;
  const offsets = settings.iqamahOffsets || DEFAULT_OFFSETS;
  const isToday = isSameDay(date, new Date());
  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

  let azanDates: Record<(typeof prayerNames)[number], Date | null> = {
    Fajr: null,
    Dhuhr: null,
    Asr: null,
    Maghrib: null,
    Isha: null,
  };

  if (settings.mode === "manual") {
    const manual = settings.manualTimes || {};
    azanDates = {
      Fajr: parseManualTime(date, manual.fajr, timeZone),
      Dhuhr: parseManualTime(date, manual.dhuhr, timeZone),
      Asr: parseManualTime(date, manual.asr, timeZone),
      Maghrib: parseManualTime(date, manual.maghrib, timeZone),
      Isha: parseManualTime(date, manual.isha, timeZone),
    };
  } else {
    const coordinates = settings.coordinates || DEFAULT_COORDINATES;
    const params = getCalculationParameters(settings.calculationMethod);
    const prayerTimes = new PrayerTimes(
      new Coordinates(coordinates.lat, coordinates.lng),
      date,
      params,
    );

    azanDates = {
      Fajr: prayerTimes.fajr,
      Dhuhr: prayerTimes.dhuhr,
      Asr: prayerTimes.asr,
      Maghrib: prayerTimes.maghrib,
      Isha: prayerTimes.isha,
    };
  }

  const prayers: PrayerTimeEntry[] = prayerNames.map((name) => {
    const azan = azanDates[name];
    const offset =
      offsets[name.toLowerCase() as keyof typeof offsets] ?? 0;

    if (!azan) {
      return {
        name,
        azan: "—",
        iqamah: "—",
        azanTs: 0,
        iqamahTs: 0,
      };
    }

    const iqamah = addMinutes(azan, offset);

    return {
      name,
      azan: formatTimeInZone(azan, timeZone),
      iqamah: formatTimeInZone(iqamah, timeZone),
      azanTs: azan.getTime(),
      iqamahTs: iqamah.getTime(),
    };
  });

  return {
    date: formatDateInZone(date, timeZone, "key"),
    label: formatDateInZone(date, timeZone, "label"),
    isToday,
    prayers,
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
