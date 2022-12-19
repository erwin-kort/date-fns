import type { Locale, Day } from 'date-fns'

import {
  getDay as _getDay,
  setDay as _setDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  nextDay,
  setDate,
} from 'date-fns'

export * from 'date-fns'

export let normalizeDay = (
  day: Day,
  format: 'date-fns' | 'local',
  options?: {
    locale?: Locale,
    weekStartsOn?: Day
  },
): Day => {
  let weekStartsOn = 0

  if (options?.locale?.options?.weekStartsOn) {
    weekStartsOn = options.locale.options.weekStartsOn
  }

  if (options?.weekStartsOn) {
    weekStartsOn = options.weekStartsOn
  }

  if (format == 'date-fns') {
    // @ts-expect-error
    day = day + weekStartsOn

    if (day > 6) {
      day = day - 7 as Day
    }
  } else {
    // @ts-expect-error
    day = day - weekStartsOn

    if (day < 0) {
      day = day + 7 as Day
    }
  }

  return day
}

export let getDay = (
  date: Date | number,
  options?: {
    locale?: Locale,
    weekStartsOn?: Day
  },
): Day => {
  return normalizeDay(_getDay(date), 'local', options)
}

export let setDay = (
  date: Date | number,
  day: Day,
  options?: {
    locale?: Locale,
    weekStartsOn?: Day
  },
): Date => {
  return _setDay(date, normalizeDay(day, 'date-fns', options))
}

export let getWeekDayOfMonth = (date: Date | number) => {
  let ordinal = 1

  while (isSameMonth(date, subWeeks(date, ordinal))) {
    ordinal++
  }

  return ordinal
}

export let getWeekDaysInMonth = (
  date: Date | number,
  day: Day,
  options?: {
    locale?: Locale,
    weekStartsOn?: Day
  },
) => {
  date = setDate(date, 1)

  if (getDay(date, options) != day) {
    date = nextDay(date, normalizeDay(day, 'date-fns', options))
  }

  let ordinal = 0

  while (isSameMonth(date, addWeeks(date, ordinal))) {
    ordinal++
  }

  return ordinal
}

export let setWeekDayOfMonth = (
  date: Date | number,
  day: Day,
  ordinal: number,
  options?: {
    locale?: Locale,
    weekStartsOn?: Day
  },
) => {
  date = setDate(date, 1)

  if (getDay(date, options) != day) {
    date = nextDay(date, day)
  }

  if (ordinal > 1) {
    date = addWeeks(date, ordinal - 1)
  }

  return date
}
