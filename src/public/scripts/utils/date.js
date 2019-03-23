const time = {
  justNow: {
    description: `just now`,
    milliseconds: 0,
  },
  thirtySecondsAgo: {
    description: `30 seconds ago`,
    milliseconds: 30000,
  },
  aMinuteAgo: {
    description: `a minute ago`,
    milliseconds: 60000,
  },
  twoMinutesAgo: {
    description: `2 minutes ago`,
    milliseconds: 120000,
  },
  threeMinutesAgo: {
    description: `3 minutes ago`,
    milliseconds: 180000,
  },
  fourMinutesAgo: {
    description: `4 minutes ago`,
    milliseconds: 240000,
  },
  fiveMinutesAgo: {
    description: `5 minutes ago`,
    milliseconds: 300000,
  },
  tenMinutesAgo: {
    description: `10 minutes ago`,
    milliseconds: 600000,
  },
  fifteenMinutesAgo: {
    description: `15 minutes ago`,
    milliseconds: 900000,
  },
  twentyMinutesAgo: {
    description: `20 minutes ago`,
    milliseconds: 1200000,
  },
  halfAnHourAgo: {
    description: `half an hour ago`,
    milliseconds: 1800000,
  },
  anHourAgo: {
    description: `an hour ago`,
    milliseconds: 3600000,
  },
  twoHoursAgo: {
    description: `2 hours ago`,
    milliseconds: 7200000,
  },
  threeHoursAgo: {
    description: `3 hours ago`,
    milliseconds: 10800000,
  },
  fourHoursAgo: {
    description: `4 hours ago`,
    milliseconds: 14400000,
  },
  fiveHoursAgo: {
    description: `5 hours ago`,
    milliseconds: 18000000,
  },
  sixHoursAgo: {
    description: `6 hours ago`,
    milliseconds: 21600000,
  },
  sevenHoursAgo: {
    description: `7 hours ago`,
    milliseconds: 25200000,
  },
  eightHoursAgo: {
    description: `8 hours ago`,
    milliseconds: 28800000,
  },
  nineHoursAgo: {
    description: `9 hours ago`,
    milliseconds: 32400000,
  },
  tenHoursAgo: {
    description: `10 hours ago`,
    milliseconds: 36000000,
  },
  elevenHoursAgo: {
    description: `11 hours ago`,
    milliseconds: 39600000,
  },
  twelveHoursAgo: {
    description: `12 hours ago`,
    milliseconds: 43200000,
  },
  yesterday: {
    description: `yesterday`,
    milliseconds: 86400000,
  },
  twoDaysAgp: {
    description: `2 days ago`,
    milliseconds: 172800000,
  },
  threeDaysAgo: {
    description: `3 days ago`,
    milliseconds: 259200000,
  },
  fourDaysAgo: {
    description: `4 days ago`,
    milliseconds: 345600000,
  },
  fiveDaysAgo: {
    description: `5 days ago`,
    milliseconds: 432000000,
  },
  sixDaysAgo: {
    description: `6 days ago`,
    milliseconds: 518400000,
  },
  aWeekAgo: {
    description: `a week ago`,
    milliseconds: 604800000
  },
  twoWeekaAgo: {
    description: `2 weeks ago`,
    milliseconds: 1209600000,
  },
  threeWeekaAgo: {
    description: `3 weeks ago`,
    milliseconds: 1814400000,
  },
  aMonthAgo: {
    description: `a month ago`,
    milliseconds: 2419200000,
  },
  twoMonthsAgo: {
    description: `2 months ago`,
    milliseconds: 4838400000,
  },
  threeMonthsAgo: {
    description: `3 months ago`,
    milliseconds: 7257600000,
  },
  fourMonthsAgo: {
    description: `4 months ago`,
    milliseconds: 9676800000,
  },
  fiveMonthsAgo: {
    description: `5 months ago`,
    milliseconds: 12096000000,
  },
  sixMonthsAgo: {
    description: `6 months ago`,
    milliseconds: 14515200000,
  },
  sevenMonthsAgo: {
    description: `7 months ago`,
    milliseconds: 16934400000,
  },
  eightMonthsAgo: {
    description: `8 months ago`,
    milliseconds: 19353600000,
  },
  nineMonthsAgo: {
    description: `9 months ago`,
    milliseconds: 21772800000,
  },
  tenMonthsAgo: {
    description: `10 months ago`,
    milliseconds: 24192000000,
  },
  elevenMonthsAgo: {
    description: `11 months ago`,
    milliseconds: 26611200000,
  },
  aYearAgo: {
    description: `a year ago`,
    milliseconds: 29030400000,
  },
  twoYearsAgo: {
    description: `2 years ago`,
    milliseconds: 58060800000,
  },
  threeYearsAgo: {
    description: `3 years ago`,
    milliseconds: 87091200000,
  },
  fourYearsAgo: {
    description: `4 years ago`,
    milliseconds: 116121600000,
  },
  fiveYearsAgo: {
    description: `5 years ago`,
    milliseconds: 145152000000,
  },
  sixYearsAgo: {
    description: `6 years ago`,
    milliseconds: 174182400000,
  },
  sevenYearsAgo: {
    description: `7 years ago`,
    milliseconds: 203212800000,
  },
  eightYearsAgo: {
    description: `8 years ago`,
    milliseconds: 232243200000,
  },
  nineYearsAgo: {
    description: `9 years ago`,
    milliseconds: 261273600000,
  },
  aDecadeAgo: {
    description: `a decade ago`,
    milliseconds: 290304000000,
  },
}

const getTimeDescription = (createdTime) => {
  const timeArray = Object
    .values(time)
    .map(({ milliseconds }) => {
      return milliseconds;
    }
  );

  const currentTime = Date.now();
  const timeDifference = currentTime - createdTime;

  const closestTime = timeArray
    .reduce((selectedTime, time) => {
      if (timeDifference > time) {
        selectedTime = time;
      }
      return selectedTime;
    }, 0);

  return Object
    .values(time)
    .reduce((selectedDescription, { description, milliseconds }) => {
      if (milliseconds === closestTime) {
        selectedDescription = description;
      }
      return selectedDescription;
    }, null);
};

module.exports = getTimeDescription;