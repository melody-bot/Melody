/**
 * Default options to use when parsing a timestring
 *
 * @type {Object}
 */

const DEFAULT_OPTS : { hoursPerDay: number,daysPerWeek: number,weeksPerMonth: number,monthsPerYear: number,daysPerYear: number, } = {
  hoursPerDay: 24,
  daysPerWeek: 7,
  weeksPerMonth: 4,
  monthsPerYear: 12,
  daysPerYear: 365.25,
};

/**
 * Map of accepted strings to unit
 *
 * @type {Object}
 */

const UNIT_MAP : any = {
  ms: ["ms", "milli", "millisecond", "milliseconds"],
  s: ["s", "sec", "secs", "second", "seconds"],
  m: ["m", "min", "mins", "minute", "minutes"],
  h: ["h", "hr", "hrs", "hour", "hours"],
  d: ["d", "day", "days"],
  w: ["w", "week", "weeks"],
  mth: ["mon", "mth", "mths", "month", "months"],
  y: ["y", "yr", "yrs", "year", "years"],
};

/**
 * Get the key for a unit
 *
 * @param   {string} unit
 * @returns {string}
 */

function getUnitKey(unit) {
  for (const key of Object.keys(UNIT_MAP)) {
    if (UNIT_MAP[key].indexOf(unit) > -1) {
      return key;
    }
  }

  throw new Error(`The unit [${unit}] is not supported by timestring`);
}

/**
 * Convert a value from its existing unit to a new unit
 *
 * @param   {number} value
 * @param   {string} unit
 * @param   {Object} unitValues
 * @returns {number}
 */

function convert(value, unit, unitValues) {
  return value / unitValues[getUnitKey(unit)];
}

/**
 *  Get the number of seconds for a value, based on the unit
 *
 * @param   {number} value
 * @param   {string} unit
 * @param   {Object} unitValues
 * @returns {number}
 */

function getSeconds(value, unit, unitValues) {
  return value * unitValues[getUnitKey(unit)];
}

/**
 * Get unit values based on the passed options
 *
 * @param   {Object} opts
 * @returns {Object}
 */

function getUnitValues(opts) {
  const unitValues : { ms: number,s: number,m: number,h: number, } = {
    ms: 0.001,
    s: 1,
    m: 60,
    h: 3600,
  };

  unitValues.d = opts.hoursPerDay * unitValues.h;
  unitValues.w = opts.daysPerWeek * unitValues.d;
  unitValues.mth = (opts.daysPerYear / opts.monthsPerYear) * unitValues.d;
  unitValues.y = opts.daysPerYear * unitValues.d;

  return unitValues;
}

/**
 * Parse a timestring
 *
 * @param   {string} string
 * @param   {string} returnUnit
 * @param   {Object} opts
 * @returns {number}
 */

function parseTimestring(string, returnUnit, opts) {
  opts = Object.assign({}, DEFAULT_OPTS, opts || {});

  let totalSeconds : number = 0;
  const unitValues : any = getUnitValues(opts);
  const groups : any = string
    .toLowerCase()
    .replace(/[^.\w+-]+/g, "")
    .match(/[-+]?[0-9.]+[a-z]+/g); // skipcq

  if (groups === null) {
    throw new Error(`The string [${string}] could not be parsed by timestring`);
  }

  groups.forEach((group) => {
    const value : any = group.match(/[0-9.]+/g)[0];
    const unit : any = group.match(/[a-z]+/g)[0];

    totalSeconds += getSeconds(value, unit, unitValues);
  });

  if (returnUnit) {
    return convert(totalSeconds, returnUnit, unitValues);
  }

  return totalSeconds;
}

module.exports = parseTimestring;
