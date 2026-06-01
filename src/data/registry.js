// Helper function for cricket overs parsing (e.g., 5.3 overs = 5 + 3/6 = 5.5 overs)
export const parseOvers = (oversVal) => {
  const o = parseFloat(oversVal) || 0;
  const completedOvers = Math.floor(o);
  const balls = Math.round((o - completedOvers) * 10);
  return completedOvers + (Math.min(balls, 6) / 6);
};

// Main Registry of all Calculators
export const calculatorsRegistry = {
  // === DAILY USE ===
  'age-calculator': {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'Daily Use',
    slug: 'age-calculator',
    description: 'Calculate your exact age in years, months, weeks, days, hours, and minutes from your date of birth, and find the countdown to your next birthday.',
    metaTitle: 'Age Calculator - Calculate Exact Age Online - CalcNest',
    metaDescription: 'Find your exact age in years, months, and days with our free, fast online Age Calculator. Includes next birthday countdown and interesting life milestones.',
    fields: [
      { id: 'dob', label: 'Date of Birth', type: 'date', defaultValue: '1995-01-01', required: true },
      { id: 'targetDate', label: 'Age at the Date of', type: 'date', defaultValue: new Date().toISOString().split('T')[0], required: true }
    ],
    calculate: (inputs) => {
      const birth = new Date(inputs.dob);
      const target = new Date(inputs.targetDate);
      
      if (birth > target) {
        return { error: 'Date of birth cannot be after the target date.' };
      }

      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        // Get days in the previous month
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      // Next Birthday Countdown
      const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < target) {
        nextBday.setFullYear(target.getFullYear() + 1);
      }
      const timeDiff = nextBday.getTime() - target.getTime();
      const daysToNextBday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) % 365;

      const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
      const totalHours = totalDays * 24;
      const totalMinutes = totalHours * 60;

      return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes,
        daysToNextBday: daysToNextBday === 0 ? 'Today!' : `${daysToNextBday} days`
      };
    },
    outputs: [
      { id: 'years', label: 'Years', type: 'number' },
      { id: 'months', label: 'Months', type: 'number' },
      { id: 'days', label: 'Days', type: 'number' },
      { id: 'daysToNextBday', label: 'Time until Next Birthday', type: 'text' },
      { id: 'totalDays', label: 'Total Days Lived', type: 'number' },
      { id: 'totalHours', label: 'Total Hours Lived', type: 'number' }
    ],
    formula: {
      text: 'Age is calculated by finding the difference between your date of birth and the current (or target) date, taking leap years and varying month lengths into account.',
      explanation: 'Age = Target Date - Date of Birth (expressed in years, months, and days).'
    },
    steps: [
      'Subtract the birth day from the target day. If negative, borrow days from the previous month.',
      'Subtract the birth month from the target month. If negative, borrow 12 months from the target year.',
      'Subtract the birth year from the target year to find the years.',
      'Find the next occurrence of the birth date to calculate the countdown to your next birthday.'
    ],
    examples: [
      { input: 'DOB: Jan 15, 1990; Target: Jun 10, 2026', calculation: 'Days: 10 - 15 (negative, borrow 31 days from May -> 41 - 15 = 26). Months: 4 - 0 = 4. Years: 2026 - 1990 = 36.', result: '36 Years, 4 Months, 26 Days' }
    ],
    faq: [
      { question: 'Does this age calculator account for leap years?', answer: 'Yes, the calculation uses standard JavaScript date libraries that automatically account for leap years (29 days in February) and the exact number of days in each month.' },
      { question: 'What is a target date?', answer: 'The target date is the date on which you want to calculate your age. By default, it is set to today, but you can set it to a future date to see how old you will be then, or a past date to check your age on a specific historic event.' }
    ]
  },

  'percentage-calculator': {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'Daily Use',
    slug: 'percentage-calculator',
    description: 'Calculate percentages, percentage increase or decrease, and solve common percentage problems with ease.',
    metaTitle: 'Percentage Calculator - Free Online Tool - CalcNest',
    metaDescription: 'Find percentages, calculate percentage changes (increase/decrease), and solve values. Fast, real-time math percentage calculations.',
    fields: [
      { id: 'calcType', label: 'Calculation Type', type: 'select', defaultValue: 'of', options: [
        { label: 'What is X% of Y?', value: 'of' },
        { label: 'X is what percentage of Y?', value: 'is' },
        { label: 'Percentage change from X to Y?', value: 'change' }
      ]},
      { id: 'x', label: 'Value X', type: 'number', defaultValue: 10, required: true },
      { id: 'y', label: 'Value Y', type: 'number', defaultValue: 200, required: true }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.x) || 0;
      const y = parseFloat(inputs.y) || 0;
      const type = inputs.calcType;

      let result = 0;
      let explanation = '';

      if (type === 'of') {
        result = (x / 100) * y;
        explanation = `(${x} / 100) * ${y} = ${result}`;
      } else if (type === 'is') {
        if (y === 0) return { error: 'Cannot divide by zero.' };
        result = (x / y) * 100;
        explanation = `(${x} / ${y}) * 100 = ${result.toFixed(2)}%`;
      } else if (type === 'change') {
        if (x === 0) return { error: 'Initial value X cannot be zero.' };
        result = ((y - x) / x) * 100;
        explanation = `((${y} - ${x}) / ${x}) * 100 = ${result.toFixed(2)}%`;
      }

      return {
        result: type === 'of' ? result.toFixed(2) : `${result.toFixed(2)}%`,
        formulaExplanation: explanation
      };
    },
    outputs: [
      { id: 'result', label: 'Result', type: 'text' },
      { id: 'formulaExplanation', label: 'Calculation Path', type: 'text' }
    ],
    formula: {
      text: 'Depending on the operation: \n1. X% of Y = (X / 100) * Y \n2. X is what % of Y = (X / Y) * 100 \n3. % Change = ((Y - X) / X) * 100',
      explanation: 'Percentage is a relative value indicating hundredths parts of any quantity.'
    },
    steps: [
      'Choose the type of percentage problem you want to solve.',
      'Enter the values for X and Y.',
      'For percentage value, divide rate by 100 and multiply by the total.',
      'For portion rate, divide the part by the total and multiply by 100.',
      'For change, subtract old from new, divide by old, and multiply by 100.'
    ],
    examples: [
      { input: 'What is 15% of 200?', calculation: '(15 / 100) * 200 = 30', result: '30' },
      { input: '50 is what % of 250?', calculation: '(50 / 250) * 100 = 20%', result: '20%' }
    ],
    faq: [
      { question: 'What does percentage mean?', answer: 'Percentage literally means "per hundred". It represents a fraction of 100. For example, 50% means 50 out of 100, or 1/2.' },
      { question: 'How is a negative percentage change interpreted?', answer: 'A negative percentage change indicates a decrease from the original value X to the new value Y.' }
    ]
  },

  'discount-calculator': {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'Daily Use',
    slug: 'discount-calculator',
    description: 'Find the final price, savings amount, and tax components on products with sales discounts.',
    metaTitle: 'Discount Calculator - Calculate Sales Price & Savings - CalcNest',
    metaDescription: 'Calculate final prices, net discounts, and total savings including sales taxes. Make shopping easier with real-time discounts.',
    fields: [
      { id: 'price', label: 'Original Price ($)', type: 'number', defaultValue: 100, required: true },
      { id: 'discount', label: 'Discount Percentage (%)', type: 'number', defaultValue: 20, required: true },
      { id: 'tax', label: 'Sales Tax (%)', type: 'number', defaultValue: 8, required: false }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const discount = parseFloat(inputs.discount) || 0;
      const tax = parseFloat(inputs.tax) || 0;

      const savings = price * (discount / 100);
      const discountedPrice = price - savings;
      const taxAmount = discountedPrice * (tax / 100);
      const finalPrice = discountedPrice + taxAmount;

      return {
        savings: savings.toFixed(2),
        discountedPrice: discountedPrice.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        finalPrice: finalPrice.toFixed(2)
      };
    },
    outputs: [
      { id: 'discountedPrice', label: 'Discounted Price (Before Tax)', type: 'currency' },
      { id: 'savings', label: 'Total Savings', type: 'currency' },
      { id: 'taxAmount', label: 'Tax Amount', type: 'currency' },
      { id: 'finalPrice', label: 'Final Price (Including Tax)', type: 'currency' }
    ],
    formula: {
      text: 'Savings = Original Price * (Discount % / 100); \nFinal Price = (Original Price - Savings) * (1 + Tax % / 100)',
      explanation: 'Applies the percentage discount to the original cost, and then adds sales tax to the remaining balance.'
    },
    steps: [
      'Enter the original retail price before discounts.',
      'Input the promotional discount percentage.',
      'Add the local sales tax rate if applicable.',
      'The calculator computes how much you save, the pre-tax price, the tax itself, and your ultimate cash register total.'
    ],
    examples: [
      { input: 'Price: $120; Discount: 25%; Tax: 8%', calculation: 'Savings = 120 * 0.25 = $30. Pre-tax price = $90. Tax = 90 * 0.08 = $7.20. Final = 90 + 7.20 = $97.20.', result: '$97.20' }
    ],
    faq: [
      { question: 'What is double discounting?', answer: 'Double discounting is when a store applies a second discount to a price that was already marked down. To calculate this, apply the first discount, then apply the second percentage discount to the resulting new price (rather than adding the two percentages together).' }
    ]
  },

  'date-difference-calculator': {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    category: 'Daily Use',
    slug: 'date-difference-calculator',
    description: 'Calculate the total number of days, weeks, months, and years between two calendar dates.',
    metaTitle: 'Date Difference Calculator - Time Between Dates - CalcNest',
    metaDescription: 'Find the duration between two dates. Get results in total days, weeks, months, and years with our precise date duration calculator.',
    fields: [
      { id: 'start', label: 'Start Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0], required: true },
      { id: 'end', label: 'End Date', type: 'date', defaultValue: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], required: true }
    ],
    calculate: (inputs) => {
      const d1 = new Date(inputs.start);
      const d2 = new Date(inputs.end);

      const diffTime = Math.abs(d2 - d1);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;

      // Calendar month/year diff
      const startYear = d1.getFullYear();
      const startMonth = d1.getMonth();
      const startDay = d1.getDate();
      
      const endYear = d2.getFullYear();
      const endMonth = d2.getMonth();
      const endDay = d2.getDate();

      let yearDiff = endYear - startYear;
      let monthDiff = endMonth - startMonth;
      let dayDiff = endDay - startDay;

      if (dayDiff < 0) {
        monthDiff--;
        const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
        dayDiff += prevMonth.getDate();
      }
      if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
      }

      return {
        totalDays,
        weeksDays: `${weeks} weeks and ${remDays} days`,
        calendarDiff: `${Math.abs(yearDiff)} years, ${Math.abs(monthDiff)} months, ${Math.abs(dayDiff)} days`
      };
    },
    outputs: [
      { id: 'totalDays', label: 'Total Days', type: 'number' },
      { id: 'weeksDays', label: 'Weeks Breakdown', type: 'text' },
      { id: 'calendarDiff', label: 'Calendar Interval', type: 'text' }
    ],
    formula: {
      text: 'Duration = End Date - Start Date (converted to milliseconds, then divided by 86,400,000 milliseconds per day).',
      explanation: 'Finds raw epoch timestamp difference, plus accounts for calendar year/month spans.'
    },
    steps: [
      'Select the start calendar date.',
      'Select the target end calendar date.',
      'The engine finds the absolute millisecond gap.',
      'It formats this into total days, weeks, and a friendly "Years, Months, Days" calendar reading.'
    ],
    examples: [
      { input: 'Start: Aug 15, 2023; End: Oct 20, 2023', calculation: 'Total days difference is 66 days.', result: '9 weeks & 3 days (or 2 months & 5 days)' }
    ],
    faq: [
      { question: 'Does this date calculator include the start date?', answer: 'By default, date difference calculations measure the duration *between* two dates (i.e. the start date is excluded). To include it, simply add 1 to the final days count.' }
    ]
  },

  'gst-calculator': {
    id: 'gst-calculator',
    name: 'GST Calculator',
    category: 'Daily Use',
    slug: 'gst-calculator',
    description: 'Calculate goods and services tax (GST) components for inclusive and exclusive prices with standard percentages.',
    metaTitle: 'GST Calculator Online - Add or Remove GST - CalcNest',
    metaDescription: 'Find CGST, SGST, IGST values with our free online GST calculator. Choose standard slabs or custom tax percentages instantly.',
    fields: [
      { id: 'amount', label: 'Base Amount', type: 'number', defaultValue: 1000, required: true },
      { id: 'gstRate', label: 'GST Rate (%)', type: 'select', defaultValue: '18', options: [
        { label: '5%', value: '5' },
        { label: '12%', value: '12' },
        { label: '18%', value: '18' },
        { label: '28%', value: '28' },
        { label: 'Custom', value: 'custom' }
      ]},
      { id: 'customRate', label: 'Custom Rate (%)', type: 'number', defaultValue: 10, required: false },
      { id: 'type', label: 'GST Type', type: 'select', defaultValue: 'add', options: [
        { label: 'GST Exclusive (Add GST)', value: 'add' },
        { label: 'GST Inclusive (Remove GST)', value: 'remove' }
      ]}
    ],
    calculate: (inputs) => {
      const baseAmount = parseFloat(inputs.amount) || 0;
      const rate = inputs.gstRate === 'custom' ? (parseFloat(inputs.customRate) || 0) : parseFloat(inputs.gstRate);
      const isAdd = inputs.type === 'add';

      let gstAmount = 0;
      let netAmount = 0;
      let totalAmount = 0;

      if (isAdd) {
        gstAmount = baseAmount * (rate / 100);
        netAmount = baseAmount;
        totalAmount = baseAmount + gstAmount;
      } else {
        totalAmount = baseAmount;
        netAmount = baseAmount / (1 + rate / 100);
        gstAmount = baseAmount - netAmount;
      }

      return {
        netAmount: netAmount.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        cgst: (gstAmount / 2).toFixed(2),
        sgst: (gstAmount / 2).toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      };
    },
    outputs: [
      { id: 'netAmount', label: 'Net Price (Exclusive of GST)', type: 'currency' },
      { id: 'gstAmount', label: 'Total GST Amount', type: 'currency' },
      { id: 'cgst', label: 'CGST (50% of GST)', type: 'currency' },
      { id: 'sgst', label: 'SGST / UTGST', type: 'currency' },
      { id: 'totalAmount', label: 'Total Cost (Inclusive of GST)', type: 'currency' }
    ],
    formula: {
      text: 'GST Exclusive (Add): GST = Base * Rate/100; Total = Base + GST. \nGST Inclusive (Remove): GST = Total - (Total / (1 + Rate/100)); Net = Total - GST.',
      explanation: 'Determines the taxable cost or the tax due depending on whether your sticker price already includes tax.'
    },
    steps: [
      'Enter the raw financial amount.',
      'Choose a tax slab (5%, 12%, 18%, 28%) or type a custom percentage.',
      'Specify if the rate is GST Exclusive (adding tax) or GST Inclusive (subtracting tax).',
      'The calculator splits the tax into central CGST and state SGST components.'
    ],
    examples: [
      { input: 'Amount: $1000; Rate: 18% Exclusive', calculation: 'GST = 1000 * 0.18 = $180. Total = $1180.', result: '$1180 Total' }
    ],
    faq: [
      { question: 'What are CGST and SGST?', answer: 'Under the GST regime, local sales are split into Central GST (CGST) and State GST (SGST) in a 50:50 ratio. For interstate transactions, Integrated GST (IGST) is applied instead, which equals the total GST rate.' }
    ]
  },

  'scientific-calculator': {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'Daily Use',
    slug: 'scientific-calculator',
    description: 'An advanced scientific calculator featuring trigonometry, logarithms, power indices, square roots, and equation memory.',
    metaTitle: 'Scientific Calculator Online - Full Screen Math Tool - CalcNest',
    metaDescription: 'Use our free interactive online scientific calculator. Performs trigonometric functions, log, ln, powers, radians, degrees, and basic arithmetic.',
    customRenderer: 'ScientificCalculator',
    fields: [],
    calculate: () => ({}),
    outputs: [],
    formula: {
      text: 'Performs scientific formulas natively inside the browser using Javascript Math APIs.',
      explanation: 'Evaluates formulas including sin(x), cos(x), tan(x), log(x), ln(x), square roots, exponents, and brackets.'
    },
    steps: [
      'Use the keypad or your physical keyboard to enter your equation.',
      'Toggle between Degrees (Deg) and Radians (Rad) for trigonometric operations.',
      'Utilize math constants like pi (π) and e (euler number).',
      'Press "=" to compute results.'
    ],
    examples: [
      { input: 'sin(30 deg)', calculation: 'sin(30 * pi / 180)', result: '0.5' },
      { input: 'log(100)', calculation: 'base 10 log of 100', result: '2' }
    ],
    faq: [
      { question: 'What is the difference between Rad and Deg?', answer: 'Degrees split a full rotation into 360 units, while Radians measure rotations in terms of the radius length (2*pi for a full circle). Ensure you select the correct mode when using trigonometry functions!' }
    ]
  },

  'basic-calculator': {
    id: 'basic-calculator',
    name: 'Basic Calculator',
    category: 'Daily Use',
    slug: 'basic-calculator',
    description: 'A standard daily-use calculator for addition, subtraction, multiplication, division, and percentage calculations.',
    metaTitle: 'Basic Calculator Online - Simple Desktop Calculator - CalcNest',
    metaDescription: 'A clean, easy-to-use basic calculator for simple arithmetic. Great for daily chores, homework, and quick checkouts.',
    customRenderer: 'BasicCalculator',
    fields: [],
    calculate: () => ({}),
    outputs: [],
    formula: {
      text: 'Simple arithmetic: Addition (+), Subtraction (-), Multiplication (*), Division (/).',
      explanation: 'Computes basic mathematics operations using keyboard and screen interfaces.'
    },
    steps: [
      'Type numbers using the buttons or keyboard.',
      'Press the operators (+, -, *, /) to chain calculations.',
      'Use "C" to clear the screen, "Back" to correct a digit.',
      'Press "=" to calculate.'
    ],
    examples: [
      { input: '45 * 12 + 15', calculation: '45 * 12 = 540; 540 + 15 = 555', result: '555' }
    ],
    faq: [
      { question: 'Does this basic calculator support PEMDAS?', answer: 'Yes, calculations are evaluated using standard mathematical order of operations (multiplication and division occur before addition and subtraction).' }
    ]
  },

  'unit-converter': {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'Daily Use',
    slug: 'unit-converter',
    description: 'Convert between physical units of measurement including Length, Weight, Area, Volume, Speed, and Temperature.',
    metaTitle: 'Unit Converter Online - Length, Weight, Volume - CalcNest',
    metaDescription: 'Free online unit converter. Instantly convert miles to km, pounds to kg, Celsius to Fahrenheit, and other metric and imperial units.',
    customRenderer: 'UnitConverter',
    fields: [],
    calculate: () => ({}),
    outputs: [],
    formula: {
      text: 'Multiplies input values by standard scientific conversion ratios relative to base units (e.g. meters for length, grams for weight).',
      explanation: 'Value_Converted = Value_Original * Conversion_Multiplier'
    },
    steps: [
      'Select the measurement type category (e.g., Length, Mass, Temperature).',
      'Choose the source unit (e.g. Inches) and the target unit (e.g. Centimeters).',
      'Type the number. The converted output generates in real-time as you type.'
    ],
    examples: [
      { input: '12 Inches to Centimeters', calculation: '12 * 2.54 = 30.48 cm', result: '30.48 cm' }
    ],
    faq: [
      { question: 'What is the metric system?', answer: 'The metric system is a decimal-based system of measurement used worldwide (meters, kilograms, liters) based on power-of-10 multipliers. The Imperial system is used in the US/UK (inches, pounds, gallons).' }
    ]
  },

  'currency-converter': {
    id: 'currency-converter',
    name: 'Currency Converter',
    category: 'Daily Use',
    slug: 'currency-converter',
    description: 'Convert global currencies using current reference exchange rates. Supports USD, EUR, INR, GBP, and more.',
    metaTitle: 'Currency Converter - Exchange Rates Calculator - CalcNest',
    metaDescription: 'Free online currency converter. Convert between major world currencies like USD, EUR, GBP, CAD, INR, JPY, and AUD instantly.',
    customRenderer: 'CurrencyConverter',
    fields: [],
    calculate: () => ({}),
    outputs: [],
    formula: {
      text: 'Target Value = Source Value * (Target Exchange Rate / Source Exchange Rate).',
      explanation: 'Uses baseline exchange rates relative to USD to convert funds.'
    },
    steps: [
      'Select the base currency you own.',
      'Select the target currency you want to purchase.',
      'Enter the cash amount to see the exchange breakdown.'
    ],
    examples: [
      { input: '$100 USD to EUR (Rate: 0.92)', calculation: '100 * 0.92 = 92.00 EUR', result: '92.00 EUR' }
    ],
    faq: [
      { question: 'How often are the rates updated?', answer: 'This offline module utilizes standard stable reference rates. For live banking transactions, always consult your local exchange house or bank details.' }
    ]
  },

  'time-calculator': {
    id: 'time-calculator',
    name: 'Time Calculator',
    category: 'Daily Use',
    slug: 'time-calculator',
    description: 'Add or subtract time durations (hours, minutes, seconds) or calculate time intervals between two clock readings.',
    metaTitle: 'Time Calculator - Add or Subtract Time - CalcNest',
    metaDescription: 'Add, subtract, or find intervals of hours, minutes, and seconds. Great for tracking work sheets, athletic laps, or video projects.',
    fields: [
      { id: 'op', label: 'Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Add Durations', value: 'add' },
        { label: 'Subtract Durations', value: 'sub' }
      ]},
      { id: 'h1', label: 'Time 1 (Hours)', type: 'number', defaultValue: 2, required: true },
      { id: 'm1', label: 'Time 1 (Minutes)', type: 'number', defaultValue: 30, required: true },
      { id: 's1', label: 'Time 1 (Seconds)', type: 'number', defaultValue: 0, required: false },
      { id: 'h2', label: 'Time 2 (Hours)', type: 'number', defaultValue: 1, required: true },
      { id: 'm2', label: 'Time 2 (Minutes)', type: 'number', defaultValue: 45, required: true },
      { id: 's2', label: 'Time 2 (Seconds)', type: 'number', defaultValue: 0, required: false }
    ],
    calculate: (inputs) => {
      const h1 = parseInt(inputs.h1) || 0;
      const m1 = parseInt(inputs.m1) || 0;
      const s1 = parseInt(inputs.s1) || 0;
      const h2 = parseInt(inputs.h2) || 0;
      const m2 = parseInt(inputs.m2) || 0;
      const s2 = parseInt(inputs.s2) || 0;

      const t1Secs = h1 * 3600 + m1 * 60 + s1;
      const t2Secs = h2 * 3600 + m2 * 60 + s2;

      let totalSecs = 0;
      if (inputs.op === 'add') {
        totalSecs = t1Secs + t2Secs;
      } else {
        totalSecs = Math.max(0, t1Secs - t2Secs);
      }

      const resH = Math.floor(totalSecs / 3600);
      const resM = Math.floor((totalSecs % 3600) / 60);
      const resS = totalSecs % 60;

      return {
        formatted: `${resH} hours, ${resM} minutes, ${resS} seconds`,
        totalHours: (totalSecs / 3600).toFixed(4),
        totalMinutes: (totalSecs / 60).toFixed(2),
        totalSeconds: totalSecs
      };
    },
    outputs: [
      { id: 'formatted', label: 'Duration Result', type: 'text' },
      { id: 'totalHours', label: 'Total Hours', type: 'number' },
      { id: 'totalMinutes', label: 'Total Minutes', type: 'number' },
      { id: 'totalSeconds', label: 'Total Seconds', type: 'number' }
    ],
    formula: {
      text: 'Converts both values to total seconds, performs addition/subtraction, and splits the resulting seconds back into hours, minutes, and seconds.',
      explanation: 'T_total = T1 (sec) +/- T2 (sec)'
    },
    steps: [
      'Select whether to add or subtract time units.',
      'Enter the hours, minutes, and seconds for both blocks.',
      'Press Calculate to unify standard 60-base math components.'
    ],
    examples: [
      { input: '2hr 30min + 1hr 45min', calculation: '150 mins + 105 mins = 255 mins', result: '4 hours 15 minutes' }
    ],
    faq: [
      { question: 'Why does time use base 60?', answer: 'Our time units (60 seconds per minute, 60 minutes per hour) originated from the ancient Sumerians and Babylonians, who used a sexagesimal (base 60) numeral system because 60 is divisible by many integers.' }
    ]
  },

  // === FINANCE ===
  'emi-calculator': {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    category: 'Finance',
    slug: 'emi-calculator',
    description: 'Calculate monthly EMIs, total interest payable, and amortization schedules for loans.',
    metaTitle: 'EMI Calculator - Calculate Loan EMIs Online - CalcNest',
    metaDescription: 'Find your monthly equated payments (EMI) for home, car, or personal loans. Includes interest breakdown pie charts and amortization schedules.',
    customRenderer: 'EmiCalculator',
    fields: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', defaultValue: 100000, required: true },
      { id: 'rate', label: 'Interest Rate (% annual)', type: 'number', defaultValue: 8.5, required: true },
      { id: 'tenure', label: 'Tenure (Years)', type: 'number', defaultValue: 15, required: true }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const rAnnual = parseFloat(inputs.rate) || 0;
      const tYears = parseFloat(inputs.tenure) || 0;

      const rMonthly = (rAnnual / 12) / 100;
      const nMonths = tYears * 12;

      if (p <= 0 || rAnnual <= 0 || tYears <= 0) {
        return { error: 'Please enter valid loan parameters.' };
      }

      // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const emi = p * rMonthly * Math.pow(1 + rMonthly, nMonths) / (Math.pow(1 + rMonthly, nMonths) - 1);
      const totalPayment = emi * nMonths;
      const totalInterest = totalPayment - p;

      // Amortization schedule summary
      let balance = p;
      const schedule = [];
      for (let i = 1; i <= Math.min(nMonths, 12); i++) {
        const interest = balance * rMonthly;
        const principal = emi - interest;
        balance -= principal;
        schedule.push({
          month: i,
          emi: emi.toFixed(2),
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          balance: Math.max(0, balance).toFixed(2)
        });
      }

      return {
        emi: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        principalPct: ((p / totalPayment) * 100).toFixed(1),
        interestPct: ((totalInterest / totalPayment) * 100).toFixed(1),
        schedule
      };
    },
    outputs: [
      { id: 'emi', label: 'Monthly EMI', type: 'currency' },
      { id: 'totalInterest', label: 'Total Interest Payable', type: 'currency' },
      { id: 'totalPayment', label: 'Total Repayment', type: 'currency' }
    ],
    formula: {
      text: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]',
      explanation: 'Where P is Principal, R is monthly rate (annual rate / 12 / 100), and N is loan tenure in months.'
    },
    steps: [
      'Input the total amount you wish to borrow.',
      'Enter the annual interest rate charge from your bank.',
      'Choose the loan duration in years.',
      'The calculator outputs the monthly repayment, total interest cost, and first-year amortization breakdown.'
    ],
    examples: [
      { input: 'Amount: $10,000; Rate: 12%; Tenure: 2 years', calculation: 'Monthly rate = 1%. Months = 24. EMI = [10000 * 0.01 * (1.01^24)] / [(1.01^24) - 1] = $470.73', result: '$470.73/mo' }
    ],
    faq: [
      { question: 'What does EMI stand for?', answer: 'EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.' }
    ]
  },

  'sip-calculator': {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    category: 'Finance',
    slug: 'sip-calculator',
    description: 'Calculate maturity values and wealth gained from Systematic Investment Plans (SIP) in mutual funds.',
    metaTitle: 'SIP Calculator - Mutual Fund Wealth Growth - CalcNest',
    metaDescription: 'Find your SIP returns online. Estimate your wealth gain and final amount using compound growth projections.',
    customRenderer: 'SipCalculator',
    fields: [
      { id: 'monthly', label: 'Monthly Investment ($)', type: 'number', defaultValue: 500, required: true },
      { id: 'returns', label: 'Expected Return Rate (% per year)', type: 'number', defaultValue: 12, required: true },
      { id: 'years', label: 'Tenure (Years)', type: 'number', defaultValue: 10, required: true }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.monthly) || 0;
      const rAnnual = parseFloat(inputs.returns) || 0;
      const t = parseFloat(inputs.years) || 0;

      const rMonthly = (rAnnual / 12) / 100;
      const nMonths = t * 12;

      if (p <= 0 || rAnnual <= 0 || t <= 0) {
        return { error: 'Please enter valid numbers.' };
      }

      // SIP Formula: M = P * [ (1 + i)^n - 1 ] * (1 + i) / i
      const maturity = p * ((Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly) * (1 + rMonthly);
      const totalInvested = p * nMonths;
      const wealthGained = maturity - totalInvested;

      return {
        totalInvested: totalInvested.toFixed(2),
        wealthGained: wealthGained.toFixed(2),
        maturity: maturity.toFixed(2),
        investedPct: ((totalInvested / maturity) * 100).toFixed(1),
        gainedPct: ((wealthGained / maturity) * 100).toFixed(1)
      };
    },
    outputs: [
      { id: 'totalInvested', label: 'Total Invested Amount', type: 'currency' },
      { id: 'wealthGained', label: 'Wealth Gained', type: 'currency' },
      { id: 'maturity', label: 'Future Maturity Value', type: 'currency' }
    ],
    formula: {
      text: 'Maturity = P x [((1 + i)^n - 1) / i] x (1 + i)',
      explanation: 'Where P is monthly amount, i is monthly return rate (r / 12 / 100), and n is total months.'
    },
    steps: [
      'Enter your recurring monthly investment.',
      'Specify the estimated annual return rate percentage (e.g. 12% average for index funds).',
      'Set the total investment time span in years.',
      'Calculate to view the compound return curve and wealth gain vs. initial capital.'
    ],
    examples: [
      { input: 'Monthly: $100; Returns: 12%; Time: 5 years', calculation: 'Invested: $6,000. Maturity: $8,248.64', result: '$8,248.64' }
    ],
    faq: [
      { question: 'What is a Systematic Investment Plan?', answer: 'A Systematic Investment Plan (SIP) allows investors to invest a fixed amount regularly (monthly, quarterly) in mutual funds, enabling dollar-cost averaging and compounding growth.' }
    ]
  },

  'loan-calculator': {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    category: 'Finance',
    slug: 'loan-calculator',
    description: 'Basic loan calculator to evaluate monthly payments, interest totals, and payoff times.',
    metaTitle: 'Loan Calculator - Estimate Repayment & Schedules - CalcNest',
    metaDescription: 'Determine your monthly payments, principal breakdowns, and total interest for loans. Perfect for quick planning.',
    fields: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', defaultValue: 20000, required: true },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 6.0, required: true },
      { id: 'years', label: 'Tenure (Years)', type: 'number', defaultValue: 5, required: true }
    ],
    calculate: (inputs) => {
      const amount = parseFloat(inputs.amount) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const years = parseFloat(inputs.years) || 0;

      const monthlyRate = (rate / 12) / 100;
      const months = years * 12;

      if (amount <= 0 || rate <= 0 || years <= 0) return { error: 'Please enter valid inputs.' };

      const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - amount;

      return {
        monthlyPayment: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      };
    },
    outputs: [
      { id: 'monthlyPayment', label: 'Monthly Payment', type: 'currency' },
      { id: 'totalInterest', label: 'Total Interest Paid', type: 'currency' },
      { id: 'totalPayment', label: 'Total Payback', type: 'currency' }
    ],
    formula: {
      text: 'Monthly Payment = [P * r * (1+r)^n] / [(1+r)^n - 1]',
      explanation: 'Calculates standard amortization where payments are split between principal reduction and interest fees.'
    },
    steps: [
      'Enter the base principal loan amount.',
      'Enter the fixed interest rate percentage.',
      'Select the term duration to compute the amortized payment.'
    ],
    examples: [
      { input: 'Amount: $5,000; Rate: 5%; Term: 3 years', calculation: 'Payment = $149.85/month. Total pay = $5,394.75', result: '$149.85/mo' }
    ],
    faq: [
      { question: 'What is amortization?', answer: 'Amortization is the process of spreading out a loan into a series of equal periodic payments. Over time, the interest portion of each payment decreases while the principal repayment portion increases.' }
    ]
  },

  'home-loan-calculator': {
    id: 'home-loan-calculator',
    name: 'Home Loan Calculator',
    category: 'Finance',
    slug: 'home-loan-calculator',
    description: 'Calculate mortgage repayments, principal totals, and monthly dues for housing loans.',
    metaTitle: 'Home Loan Mortgage Calculator - CalcNest',
    metaDescription: 'Find your monthly home loan repayments, total interest obligations, and see your payoff progress dynamically.',
    fields: [
      { id: 'amount', label: 'Home Price ($)', type: 'number', defaultValue: 350000, required: true },
      { id: 'downpayment', label: 'Down Payment ($)', type: 'number', defaultValue: 70000, required: true },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 7.2, required: true },
      { id: 'years', label: 'Tenure (Years)', type: 'number', defaultValue: 30, required: true }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.amount) || 0;
      const down = parseFloat(inputs.downpayment) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const years = parseFloat(inputs.years) || 0;

      const principal = Math.max(0, price - down);
      const monthlyRate = (rate / 12) / 100;
      const months = years * 12;

      if (principal <= 0 || rate <= 0 || years <= 0) return { error: 'Please enter valid loan details.' };

      const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - principal;

      return {
        loanAmount: principal.toFixed(2),
        monthlyPayment: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      };
    },
    outputs: [
      { id: 'loanAmount', label: 'Net Mortgage Principal', type: 'currency' },
      { id: 'monthlyPayment', label: 'Monthly Payment (P&I)', type: 'currency' },
      { id: 'totalInterest', label: 'Total Interest', type: 'currency' },
      { id: 'totalPayment', label: 'Total Payment', type: 'currency' }
    ],
    formula: {
      text: 'Principal = Home Price - Down Payment; \nPayment = [Principal * r * (1+r)^n] / [(1+r)^n - 1]',
      explanation: 'Subtracts down payment to get mortgage value, then applies monthly compound interest.'
    },
    steps: [
      'Enter the full property listing value.',
      'Enter the initial cash deposit (down payment).',
      'Provide annual interest rate and mortgage tenure.',
      'The engine computes your monthly principal and interest payment.'
    ],
    examples: [
      { input: 'Price: $300k; Down: $60k; Rate: 6%; Term: 30yr', calculation: 'Mortgage: $240k. EMI: $1,438.92', result: '$1,438.92/mo' }
    ],
    faq: [
      { question: 'What is a typical down payment?', answer: 'In many countries, a standard down payment is 20% of the property value, which helps avoid paying private mortgage insurance (PMI).' }
    ]
  },

  'car-loan-calculator': {
    id: 'car-loan-calculator',
    name: 'Car Loan Calculator',
    category: 'Finance',
    slug: 'car-loan-calculator',
    description: 'Calculate auto loan payments, down payments, interest costs, and total vehicle expenditures.',
    metaTitle: 'Car Loan Calculator - Estimate Auto Financing - CalcNest',
    metaDescription: 'Plan your auto purchase. Calculate monthly payments, interest charges, and total car budget requirements.',
    fields: [
      { id: 'price', label: 'Vehicle Price ($)', type: 'number', defaultValue: 25000, required: true },
      { id: 'down', label: 'Down Payment / Trade-in ($)', type: 'number', defaultValue: 5000, required: false },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 5.5, required: true },
      { id: 'years', label: 'Tenure (Years)', type: 'number', defaultValue: 5, required: true }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const down = parseFloat(inputs.down) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const years = parseFloat(inputs.years) || 0;

      const principal = Math.max(0, price - down);
      const monthlyRate = (rate / 12) / 100;
      const months = years * 12;

      if (principal <= 0 || rate <= 0 || years <= 0) return { error: 'Please enter valid parameters.' };

      const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - principal;

      return {
        loanAmount: principal.toFixed(2),
        monthlyPayment: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      };
    },
    outputs: [
      { id: 'loanAmount', label: 'Net Auto Loan Principal', type: 'currency' },
      { id: 'monthlyPayment', label: 'Monthly Payment', type: 'currency' },
      { id: 'totalInterest', label: 'Total Interest Charged', type: 'currency' },
      { id: 'totalPayment', label: 'Total Auto Cost (w/o Down)', type: 'currency' }
    ],
    formula: {
      text: 'Principal = Vehicle Price - Down Payment; \nEMI = [Principal * r * (1+r)^n] / [(1+r)^n - 1]',
      explanation: 'Applies auto loan compounding over short tenures (typically 3 to 7 years).'
    },
    steps: [
      'Enter the final vehicle dealer price.',
      'Enter your trade-in value or down payment.',
      'Set the annual percentage rate (APR) and term.'
    ],
    examples: [
      { input: 'Price: $20,000; Down: $2,000; Rate: 4.5%; Term: 5yr', calculation: 'Loan: $18,000. EMI: $335.53/mo.', result: '$335.53/mo' }
    ],
    faq: [
      { question: 'How do auto loan terms differ from mortgages?', answer: 'Auto loans have shorter lifespans, ranging from 36 to 84 months. Interest rates on used cars are usually higher than on new cars.' }
    ]
  },

  'personal-loan-calculator': {
    id: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    category: 'Finance',
    slug: 'personal-loan-calculator',
    description: 'Calculate monthly dues, compounding schedules, and total repayment costs for unsecured personal loans.',
    metaTitle: 'Personal Loan Calculator - Budget Unsecured Loans - CalcNest',
    metaDescription: 'Find interest and monthly dues on personal loans. Enter loan amount, APR, and term to see your breakdown instantly.',
    fields: [
      { id: 'amount', label: 'Amount Borrowed ($)', type: 'number', defaultValue: 10000, required: true },
      { id: 'rate', label: 'APR (%)', type: 'number', defaultValue: 10.5, required: true },
      { id: 'years', label: 'Term (Years)', type: 'number', defaultValue: 3, required: true }
    ],
    calculate: (inputs) => {
      const amount = parseFloat(inputs.amount) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const years = parseFloat(inputs.years) || 0;

      const monthlyRate = (rate / 12) / 100;
      const months = years * 12;

      if (amount <= 0 || rate <= 0 || years <= 0) return { error: 'Please enter valid inputs.' };

      const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - amount;

      return {
        monthlyPayment: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      };
    },
    outputs: [
      { id: 'monthlyPayment', label: 'Monthly Payment', type: 'currency' },
      { id: 'totalInterest', label: 'Total Interest Cost', type: 'currency' },
      { id: 'totalPayment', label: 'Total Repayment Amount', type: 'currency' }
    ],
    formula: {
      text: 'Monthly Payment = [P * r * (1+r)^n] / [(1+r)^n - 1]',
      explanation: 'Unsecured loan compounding based on standard monthly amortization schedules.'
    },
    steps: [
      'Enter the personal signature loan principal.',
      'Enter the fixed annual rate (APR).',
      'Select terms (1 to 5 years is typical).'
    ],
    examples: [
      { input: 'Amount: $10,000; Rate: 10%; Term: 3yr', calculation: 'EMI = $322.67/mo. Total Interest = $1,616.19', result: '$322.67/mo' }
    ],
    faq: [
      { question: 'What is an unsecured loan?', answer: 'An unsecured loan does not require physical collateral (like a house or car). Lenders approve personal loans based on credit scores and income stability.' }
    ]
  },

  'compound-interest-calculator': {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    category: 'Finance',
    slug: 'compound-interest-calculator',
    description: 'Calculate the compound growth of your savings or investments over time with custom compounding frequencies.',
    metaTitle: 'Compound Interest Calculator - Calculate Growth - CalcNest',
    metaDescription: 'Estimate your investment maturity value with compound interest. Supports monthly, quarterly, semi-annual, and annual frequencies.',
    fields: [
      { id: 'principal', label: 'Initial Principal ($)', type: 'number', defaultValue: 5000, required: true },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 7.0, required: true },
      { id: 'time', label: 'Time Horizon (Years)', type: 'number', defaultValue: 10, required: true },
      { id: 'frequency', label: 'Compounding Frequency', type: 'select', defaultValue: '12', options: [
        { label: 'Annually (1/year)', value: '1' },
        { label: 'Semi-Annually (2/year)', value: '2' },
        { label: 'Quarterly (4/year)', value: '4' },
        { label: 'Monthly (12/year)', value: '12' },
        { label: 'Daily (365/year)', value: '365' }
      ]}
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.time) || 0;
      const n = parseInt(inputs.frequency) || 1;

      if (p <= 0 || r <= 0 || t <= 0) return { error: 'Please enter valid parameters.' };

      // Formula: A = P * (1 + r/n)^(n*t)
      const maturity = p * Math.pow(1 + (r / n), n * t);
      const interest = maturity - p;

      return {
        principal: p.toFixed(2),
        interest: interest.toFixed(2),
        maturity: maturity.toFixed(2)
      };
    },
    outputs: [
      { id: 'principal', label: 'Invested Principal', type: 'currency' },
      { id: 'interest', label: 'Compound Interest Earned', type: 'currency' },
      { id: 'maturity', label: 'Future Maturity Value', type: 'currency' }
    ],
    formula: {
      text: 'A = P * (1 + r/n)^(n*t)',
      explanation: 'Where P is principal, r is annual rate, n is compounding cycles per year, and t is time in years.'
    },
    steps: [
      'Enter the starting investment capital (principal).',
      'Provide the expected annual interest rate.',
      'Specify compounding cycles (e.g. Monthly compound adds interest 12 times a year).',
      'Select target years to calculate compound returns.'
    ],
    examples: [
      { input: 'Principal: $1000; Rate: 10%; Time: 5yr; Monthly Compound', calculation: 'A = 1000 * (1 + 0.10/12)^(12*5) = $1,645.31', result: '$1,645.31' }
    ],
    faq: [
      { question: 'How does compound interest differ from simple interest?', answer: 'Simple interest only pays on the original principal. Compound interest pays interest on both the principal and previously accumulated interest, leading to exponential growth.' }
    ]
  },

  'simple-interest-calculator': {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    category: 'Finance',
    slug: 'simple-interest-calculator',
    description: 'Calculate simple interest components, principal accumulations, and total payoffs.',
    metaTitle: 'Simple Interest Calculator - Fast Online Tool - CalcNest',
    metaDescription: 'Find simple interest earned or paid. Easy calculation based on principal, rate, and time.',
    fields: [
      { id: 'principal', label: 'Principal ($)', type: 'number', defaultValue: 1000, required: true },
      { id: 'rate', label: 'Annual Rate (%)', type: 'number', defaultValue: 5.0, required: true },
      { id: 'time', label: 'Time Horizon (Years)', type: 'number', defaultValue: 3, required: true }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = parseFloat(inputs.rate) || 0;
      const t = parseFloat(inputs.time) || 0;

      const interest = p * (r / 100) * t;
      const total = p + interest;

      return {
        interest: interest.toFixed(2),
        total: total.toFixed(2)
      };
    },
    outputs: [
      { id: 'interest', label: 'Interest Earned', type: 'currency' },
      { id: 'total', label: 'Total Future Value', type: 'currency' }
    ],
    formula: {
      text: 'I = P * r * t; Total = P + I',
      explanation: 'Where P is Principal, r is rate, and t is time in years. Simple interest does not compound.'
    },
    steps: [
      'Enter the starting base cash principal.',
      'Enter the fixed interest rate percentage.',
      'Set time tenure in years to get interest amounts.'
    ],
    examples: [
      { input: 'Principal: $1,000; Rate: 5%; Time: 3 years', calculation: 'Interest = 1000 * 0.05 * 3 = $150. Total = $1150.', result: '$150 interest' }
    ],
    faq: [
      { question: 'When is simple interest used?', answer: 'Simple interest is common in short-term personal loans, retail credit accounts, and simple fixed investments where compound cycles are absent.' }
    ]
  },

  'fd-calculator': {
    id: 'fd-calculator',
    name: 'FD Calculator',
    category: 'Finance',
    slug: 'fd-calculator',
    description: 'Calculate maturity amounts and interest earnings for Fixed Deposits (FD) in banks.',
    metaTitle: 'FD Calculator - Fixed Deposit Returns - CalcNest',
    metaDescription: 'Find fixed deposit maturity payouts. Calculate interest earned based on principal, rate, and tenure.',
    fields: [
      { id: 'deposit', label: 'Investment Deposit ($)', type: 'number', defaultValue: 5000, required: true },
      { id: 'rate', label: 'Rate of Interest (%)', type: 'number', defaultValue: 6.5, required: true },
      { id: 'tenure', label: 'Tenure (Years)', type: 'number', defaultValue: 5, required: true },
      { id: 'comp', label: 'Compounding Cycle', type: 'select', defaultValue: '4', options: [
        { label: 'Monthly Compounding', value: '12' },
        { label: 'Quarterly Compounding', value: '4' },
        { label: 'Half-yearly Compounding', value: '2' },
        { label: 'Yearly Compounding', value: '1' }
      ]}
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.deposit) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.tenure) || 0;
      const n = parseInt(inputs.comp) || 4;

      if (p <= 0 || r <= 0 || t <= 0) return { error: 'Please check your inputs.' };

      // FD compound interest: A = P * (1 + r/n)^(n*t)
      const maturity = p * Math.pow(1 + (r / n), n * t);
      const interest = maturity - p;

      return {
        invested: p.toFixed(2),
        interest: interest.toFixed(2),
        maturity: maturity.toFixed(2)
      };
    },
    outputs: [
      { id: 'invested', label: 'Total Principal Invested', type: 'currency' },
      { id: 'interest', label: 'Total Interest Earned', type: 'currency' },
      { id: 'maturity', label: 'Maturity Payout', type: 'currency' }
    ],
    formula: {
      text: 'Maturity Amount = Principal * (1 + Rate / Comp_per_year) ^ (Comp_per_year * Years)',
      explanation: 'Applies standard banking compounds (quarterly compounding is typical for bank fixed deposits).'
    },
    steps: [
      'Enter the fixed deposit deposit amount.',
      'Specify the interest rate from the bank.',
      'Select term duration and compounding frequency (default is Quarterly).'
    ],
    examples: [
      { input: 'Deposit: $10,000; Rate: 7%; Time: 3yr; Quarterly Compound', calculation: 'Maturity = 10000 * (1 + 0.07/4)^(4*3) = $12,314.39', result: '$12,314.39' }
    ],
    faq: [
      { question: 'What is a Fixed Deposit?', answer: 'A Fixed Deposit (FD) is a financial instrument provided by banks which offers investors a fixed rate of interest until a given maturity date.' }
    ]
  },

  'rd-calculator': {
    id: 'rd-calculator',
    name: 'RD Calculator',
    category: 'Finance',
    slug: 'rd-calculator',
    description: 'Calculate recurring deposit maturity valuations and cumulative interest earnings.',
    metaTitle: 'RD Calculator - Recurring Deposit Payouts - CalcNest',
    metaDescription: 'Find bank Recurring Deposit maturity values. Put in monthly deposit, rates, and term to see your return values.',
    fields: [
      { id: 'monthly', label: 'Monthly Deposit ($)', type: 'number', defaultValue: 200, required: true },
      { id: 'rate', label: 'Rate of Interest (%)', type: 'number', defaultValue: 6.0, required: true },
      { id: 'tenure', label: 'Tenure (Months)', type: 'number', defaultValue: 24, required: true }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.monthly) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const nMonths = parseInt(inputs.tenure) || 0;

      if (p <= 0 || r <= 0 || nMonths <= 0) return { error: 'Please check your inputs.' };

      // Recurring Deposit formulas (typically quarterly compounding in banks)
      // M = P * ((1+i)^n - 1) / (1 - (1+i)^(-1/3)) where i is quarterly rate.
      // Let's use standard compound formula for monthly contributions:
      const rMonthly = r / 12;
      let maturity = 0;
      for (let i = 1; i <= nMonths; i++) {
        maturity += p * Math.pow(1 + rMonthly, nMonths - i + 1);
      }
      const invested = p * nMonths;
      const interest = maturity - invested;

      return {
        invested: invested.toFixed(2),
        interest: interest.toFixed(2),
        maturity: maturity.toFixed(2)
      };
    },
    outputs: [
      { id: 'invested', label: 'Total Invested Amount', type: 'currency' },
      { id: 'interest', label: 'Total Interest Earned', type: 'currency' },
      { id: 'maturity', label: 'Maturity Amount', type: 'currency' }
    ],
    formula: {
      text: 'M = Sum_{i=1}^{n} P * (1 + r/12)^(n - i + 1)',
      explanation: 'Compiles compound growth monthly for each subsequent installment.'
    },
    steps: [
      'Provide your monthly recurring deposit value.',
      'Enter the bank RD interest rate.',
      'Specify the term in months to see cumulative earnings.'
    ],
    examples: [
      { input: 'Monthly: $100; Rate: 6%; Term: 12 months', calculation: 'Total invested: $1200. Maturity value: $1239.72', result: '$1239.72' }
    ],
    faq: [
      { question: 'What is a Recurring Deposit?', answer: 'A Recurring Deposit (RD) allows customers to save a fixed amount regularly every month and earn interest rates comparable to Fixed Deposits.' }
    ]
  },

  'salary-calculator': {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    category: 'Finance',
    slug: 'salary-calculator',
    description: 'Convert your hourly rate, monthly wage, or annual salary across common pay periods.',
    metaTitle: 'Salary Converter - Hourly to Annual Income - CalcNest',
    metaDescription: 'Convert gross annual wages to hourly rate, weekly, bi-weekly, and monthly payouts. Great for job offer calculations.',
    fields: [
      { id: 'base', label: 'Salary Amount ($)', type: 'number', defaultValue: 60000, required: true },
      { id: 'period', label: 'Pay Period', type: 'select', defaultValue: 'year', options: [
        { label: 'Hourly Rate', value: 'hour' },
        { label: 'Weekly Wage', value: 'week' },
        { label: 'Monthly Wage', value: 'month' },
        { label: 'Annual Salary', value: 'year' }
      ]},
      { id: 'hours', label: 'Hours per Week', type: 'number', defaultValue: 40, required: true }
    ],
    calculate: (inputs) => {
      const amount = parseFloat(inputs.base) || 0;
      const hoursPerWeek = parseFloat(inputs.hours) || 40;
      const period = inputs.period;

      if (amount <= 0 || hoursPerWeek <= 0) return { error: 'Please enter positive parameters.' };

      let annualGross = 0;
      if (period === 'hour') {
        annualGross = amount * hoursPerWeek * 52;
      } else if (period === 'week') {
        annualGross = amount * 52;
      } else if (period === 'month') {
        annualGross = amount * 12;
      } else if (period === 'year') {
        annualGross = amount;
      }

      const hourly = annualGross / (52 * hoursPerWeek);
      const weekly = annualGross / 52;
      const biweekly = annualGross / 26;
      const monthly = annualGross / 12;

      return {
        hourly: hourly.toFixed(2),
        weekly: weekly.toFixed(2),
        biweekly: biweekly.toFixed(2),
        monthly: monthly.toFixed(2),
        annual: annualGross.toFixed(2)
      };
    },
    outputs: [
      { id: 'hourly', label: 'Hourly Equivalent', type: 'currency' },
      { id: 'weekly', label: 'Weekly Equivalent', type: 'currency' },
      { id: 'biweekly', label: 'Bi-Weekly Equivalent', type: 'currency' },
      { id: 'monthly', label: 'Monthly Equivalent', type: 'currency' },
      { id: 'annual', label: 'Annual Total', type: 'currency' }
    ],
    formula: {
      text: 'Annual = Hourly * Hours/Week * 52 Weeks; \nWeekly = Annual / 52; Monthly = Annual / 12.',
      explanation: 'Standardizes work metrics assuming a 52-week calendar year.'
    },
    steps: [
      'Enter your wage amount.',
      'Select the frequency cycle of the input amount.',
      'Specify your weekly working hours (default is 40).'
    ],
    examples: [
      { input: 'Amount: $30/hr; 40 hours/week', calculation: 'Annual = 30 * 40 * 52 = $62,400. Monthly = $5,200', result: '$62,400/yr' }
    ],
    faq: [
      { question: 'How many pay weeks are in a year?', answer: 'A standard calendar year has 52 weeks. Bi-weekly pay occurs 26 times a year, while semi-monthly pay occurs 24 times (twice per month).' }
    ]
  },

  'income-tax-calculator': {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    category: 'Finance',
    slug: 'income-tax-calculator',
    description: 'A standard income tax estimator based on progressive tax brackets.',
    metaTitle: 'Income Tax Bracket Calculator - Estimate Tax Due - CalcNest',
    metaDescription: 'Estimate your tax burden, effective tax rate, and take-home pay using a standard progressive tax bracket structure.',
    fields: [
      { id: 'income', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 75000, required: true },
      { id: 'deductions', label: 'Tax Deductions ($)', type: 'number', defaultValue: 13850, required: false }
    ],
    calculate: (inputs) => {
      const income = parseFloat(inputs.income) || 0;
      const deductions = parseFloat(inputs.deductions) || 0;
      const taxableIncome = Math.max(0, income - deductions);

      // Simple US-style bracket calculation
      const brackets = [
        { limit: 11000, rate: 0.10 },
        { limit: 44725, rate: 0.12 },
        { limit: 95375, rate: 0.22 },
        { limit: 182100, rate: 0.24 },
        { limit: Infinity, rate: 0.32 }
      ];

      let tax = 0;
      let remaining = taxableIncome;
      let previousLimit = 0;

      for (let i = 0; i < brackets.length; i++) {
        const currentLimit = brackets[i].limit;
        const currentRate = brackets[i].rate;
        const range = currentLimit - previousLimit;

        if (remaining > range) {
          tax += range * currentRate;
          remaining -= range;
          previousLimit = currentLimit;
        } else {
          tax += remaining * currentRate;
          break;
        }
      }

      const takeHome = income - tax;
      const effectiveRate = taxableIncome > 0 ? (tax / income) * 100 : 0;

      return {
        taxable: taxableIncome.toFixed(2),
        taxDue: tax.toFixed(2),
        takeHome: takeHome.toFixed(2),
        effectiveRate: `${effectiveRate.toFixed(2)}%`
      };
    },
    outputs: [
      { id: 'taxable', label: 'Taxable Income', type: 'currency' },
      { id: 'taxDue', label: 'Estimated Tax Due', type: 'currency' },
      { id: 'takeHome', label: 'Net Take-Home Pay', type: 'currency' },
      { id: 'effectiveRate', label: 'Effective Tax Rate', type: 'text' }
    ],
    formula: {
      text: 'Taxable Income = Gross Income - Deductions; \nTax = Sum of (Taxable Income in bracket * Bracket Rate).',
      explanation: 'Calculated using progressive brackets. Only income within each specific bracket is taxed at that rate.'
    },
    steps: [
      'Enter your total annual pre-tax income.',
      'Add any tax-exempt deductions or allowances.',
      'The calculator computes brackets progressive layers.'
    ],
    examples: [
      { input: 'Income: $50,000; Standard Deduction: $13,850', calculation: 'Taxable: $36,150. Tax: (11,000 * 0.10) + (25,150 * 0.12) = $4,118.', result: '$4,118 tax due' }
    ],
    faq: [
      { question: 'What is a progressive tax system?', answer: 'A progressive tax system imposes higher tax rates on higher-income earners. As your income increases, the rate at which additional dollars are taxed increases.' }
    ]
  },

  'profit-calculator': {
    id: 'profit-calculator',
    name: 'Profit Calculator',
    category: 'Finance',
    slug: 'profit-calculator',
    description: 'Find gross profit margins, cost markups, cost prices, and selling prices for products.',
    metaTitle: 'Profit Margin Calculator - Selling Price & Markup - CalcNest',
    metaDescription: 'Determine profit margins, cost markups, and final retail values. Enter product costs and target margins to price products.',
    fields: [
      { id: 'cost', label: 'Cost Price ($)', type: 'number', defaultValue: 50, required: true },
      { id: 'selling', label: 'Selling Price ($)', type: 'number', defaultValue: 75, required: true }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const selling = parseFloat(inputs.selling) || 0;

      if (cost <= 0 || selling <= 0) return { error: 'Please enter positive pricing.' };

      const profit = selling - cost;
      const margin = (profit / selling) * 100;
      const markup = (profit / cost) * 100;

      return {
        profit: profit.toFixed(2),
        margin: `${margin.toFixed(2)}%`,
        markup: `${markup.toFixed(2)}%`
      };
    },
    outputs: [
      { id: 'profit', label: 'Gross Profit', type: 'currency' },
      { id: 'margin', label: 'Profit Margin (on Revenue)', type: 'text' },
      { id: 'markup', label: 'Markup (on Cost)', type: 'text' }
    ],
    formula: {
      text: 'Profit = Selling Price - Cost Price; \nMargin = (Profit / Selling Price) * 100; \nMarkup = (Profit / Cost Price) * 100',
      explanation: 'Compares costs and prices to understand product margins.'
    },
    steps: [
      'Enter the total cost to produce or purchase the item.',
      'Enter the final selling price to the customer.',
      'Calculate markup percentage and profit margin.'
    ],
    examples: [
      { input: 'Cost: $10; Selling: $15', calculation: 'Profit = $5. Margin = 5/15 = 33.3%. Markup = 5/10 = 50%', result: '33.3% Margin' }
    ],
    faq: [
      { question: 'What is the difference between margin and markup?', answer: 'Margin is the ratio of profit to the sales price. Markup is the ratio of profit to the acquisition cost.' }
    ]
  },

  'roi-calculator': {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    category: 'Finance',
    slug: 'roi-calculator',
    description: 'Calculate Return on Investment (ROI) and annualized yields on financial projects.',
    metaTitle: 'ROI Calculator - Return on Investment Yields - CalcNest',
    metaDescription: 'Find investment percentage returns. Easily compute ROI, total returns, and compound growth returns.',
    fields: [
      { id: 'invested', label: 'Amount Invested ($)', type: 'number', defaultValue: 10000, required: true },
      { id: 'returned', label: 'Amount Returned ($)', type: 'number', defaultValue: 15000, required: true },
      { id: 'years', label: 'Investment Duration (Years)', type: 'number', defaultValue: 2, required: false }
    ],
    calculate: (inputs) => {
      const invested = parseFloat(inputs.invested) || 0;
      const returned = parseFloat(inputs.returned) || 0;
      const years = parseFloat(inputs.years) || 1;

      if (invested <= 0) return { error: 'Investment amount must be greater than zero.' };

      const gain = returned - invested;
      const roi = (gain / invested) * 100;
      // Annualized ROI formula: (Returned / Invested)^(1/years) - 1
      const annualizedRoi = (Math.pow((returned / invested), 1 / years) - 1) * 100;

      return {
        gain: gain.toFixed(2),
        roi: `${roi.toFixed(2)}%`,
        annualized: `${annualizedRoi.toFixed(2)}%`
      };
    },
    outputs: [
      { id: 'gain', label: 'Investment Gain', type: 'currency' },
      { id: 'roi', label: 'Total ROI (%)', type: 'text' },
      { id: 'annualized', label: 'Annualized ROI (%)', type: 'text' }
    ],
    formula: {
      text: 'ROI = (Gain / Invested) * 100; \nAnnualized ROI = [(Returned / Invested) ^ (1/Years) - 1] * 100',
      explanation: 'Standardizes returns to compare multi-year projects.'
    },
    steps: [
      'Enter the starting money invested.',
      'Enter the final value returned (including earnings).',
      'Provide the holding period in years to annualized results.'
    ],
    examples: [
      { input: 'Invested: $1,000; Returned: $1,500; Term: 3 years', calculation: 'ROI = 50%. Annualized = (1.5)^(1/3) - 1 = 14.47%', result: '14.47% annualized' }
    ],
    faq: [
      { question: 'Why is annualized ROI important?', answer: 'Annualized ROI is important because it allows investors to compare the performance of different investments that have been held for different lengths of time.' }
    ]
  },

  'break-even-calculator': {
    id: 'break-even-calculator',
    name: 'Break-Even Calculator',
    category: 'Finance',
    slug: 'break-even-calculator',
    description: 'Calculate the point where business revenues match expenses, displaying units and revenue totals.',
    metaTitle: 'Break-Even Point Calculator - Units & Revenue - CalcNest',
    metaDescription: 'Find your break-even business requirements. Enter fixed costs, sales prices, and variable costs to see profitability thresholds.',
    fields: [
      { id: 'fixed', label: 'Total Fixed Costs ($)', type: 'number', defaultValue: 12000, required: true },
      { id: 'price', label: 'Sale Price per Unit ($)', type: 'number', defaultValue: 50, required: true },
      { id: 'variable', label: 'Variable Cost per Unit ($)', type: 'number', defaultValue: 20, required: true }
    ],
    calculate: (inputs) => {
      const fixed = parseFloat(inputs.fixed) || 0;
      const price = parseFloat(inputs.price) || 0;
      const variable = parseFloat(inputs.variable) || 0;

      const margin = price - variable;
      if (margin <= 0) return { error: 'Sale price must be higher than variable cost.' };

      const breakEvenUnits = fixed / margin;
      const breakEvenRevenue = breakEvenUnits * price;

      return {
        margin: margin.toFixed(2),
        units: Math.ceil(breakEvenUnits),
        revenue: breakEvenRevenue.toFixed(2)
      };
    },
    outputs: [
      { id: 'margin', label: 'Contribution Margin', type: 'currency' },
      { id: 'units', label: 'Break-Even Units Required', type: 'number' },
      { id: 'revenue', label: 'Break-Even Sales Revenue', type: 'currency' }
    ],
    formula: {
      text: 'Break-Even Units = Fixed Costs / (Price - Variable Cost); \nBreak-Even Revenue = Break-Even Units * Price',
      explanation: 'Calculates the sales volume required to cover fixed operating expenditures.'
    },
    steps: [
      'Enter the fixed overhead cost (rent, salaries, etc.).',
      'Provide your single unit sell rate.',
      'Input the variable cost (materials, shipping) to make one unit.'
    ],
    examples: [
      { input: 'Overhead: $9,000; Price: $15; Variable: $6', calculation: 'Margin = 15 - 6 = $9. Units = 9000 / 9 = 1000 units.', result: '1000 units' }
    ],
    faq: [
      { question: 'What are fixed vs variable costs?', answer: 'Fixed costs remain constant regardless of sales levels (rent, insurance, salaries). Variable costs change in direct proportion to production volume (materials, packaging, commissions).' }
    ]
  },

  // === STUDENT ===
  'cgpa-calculator': {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    category: 'Student',
    slug: 'cgpa-calculator',
    description: 'Calculate your Cumulative Grade Point Average (CGPA) from semester grade points and course credits.',
    metaTitle: 'CGPA Calculator - Cumulative Grade Points - CalcNest',
    metaDescription: 'Find your college or school CGPA. Standard grade point averaging using course weights and credits.',
    fields: [
      { id: 'semesters', label: 'Number of Semesters', type: 'select', defaultValue: '4', options: [
        { label: '2 Semesters', value: '2' },
        { label: '4 Semesters', value: '4' },
        { label: '6 Semesters', value: '6' },
        { label: '8 Semesters', value: '8' }
      ]},
      { id: 's1', label: 'Semester 1 SGPA', type: 'number', defaultValue: 8.5, required: true },
      { id: 's2', label: 'Semester 2 SGPA', type: 'number', defaultValue: 8.2, required: true },
      { id: 's3', label: 'Semester 3 SGPA', type: 'number', defaultValue: 7.9, required: false },
      { id: 's4', label: 'Semester 4 SGPA', type: 'number', defaultValue: 8.8, required: false },
      { id: 's5', label: 'Semester 5 SGPA', type: 'number', defaultValue: 0, required: false },
      { id: 's6', label: 'Semester 6 SGPA', type: 'number', defaultValue: 0, required: false },
      { id: 's7', label: 'Semester 7 SGPA', type: 'number', defaultValue: 0, required: false },
      { id: 's8', label: 'Semester 8 SGPA', type: 'number', defaultValue: 0, required: false }
    ],
    calculate: (inputs) => {
      const numSems = parseInt(inputs.semesters);
      let sum = 0;
      let count = 0;
      for (let i = 1; i <= numSems; i++) {
        const val = parseFloat(inputs[`s${i}`]);
        if (val > 0) {
          sum += val;
          count++;
        }
      }

      if (count === 0) return { error: 'Please enter at least one semester score.' };
      const cgpa = sum / count;

      return {
        cgpa: cgpa.toFixed(2),
        percentage: `${((cgpa - 0.75) * 10).toFixed(1)}%` // Typical Indian university conversion
      };
    },
    outputs: [
      { id: 'cgpa', label: 'Calculated CGPA', type: 'number' },
      { id: 'percentage', label: 'Equivalent Percentage (typical)', type: 'text' }
    ],
    formula: {
      text: 'CGPA = Sum of Semesters SGPAs / Number of Semesters evaluated.',
      explanation: 'Calculates the arithmetic mean across all graded academic terms.'
    },
    steps: [
      'Select the semesters count.',
      'Enter the individual SGPA values you scored.',
      'The engine averages the scores and converts them to percentage equivalent.'
    ],
    examples: [
      { input: 'Semesters 1-3 SGPA: 8.0, 9.0, 7.0', calculation: '(8.0 + 9.0 + 7.0) / 3 = 8.0 CGPA', result: '8.0 CGPA' }
    ],
    faq: [
      { question: 'How is CGPA converted to percentage?', answer: 'In many education boards (like CBSE or Indian universities), CGPA is converted to percentage by multiplying by 9.5 or using the formula: (CGPA - 0.75) * 10.' }
    ]
  },

  'sgpa-calculator': {
    id: 'sgpa-calculator',
    name: 'SGPA Calculator',
    category: 'Student',
    slug: 'sgpa-calculator',
    description: 'Calculate your Semester Grade Point Average (SGPA) based on course credits and grade points.',
    metaTitle: 'SGPA Calculator - Calculate Semester GPA - CalcNest',
    metaDescription: 'Find your semester grade point average. Enter course credits and letter grades to calculate SGPA instantly.',
    fields: [
      { id: 'c1', label: 'Subject 1 Credits', type: 'number', defaultValue: 4, required: true },
      { id: 'g1', label: 'Subject 1 Grade Points (1-10)', type: 'number', defaultValue: 9, required: true },
      { id: 'c2', label: 'Subject 2 Credits', type: 'number', defaultValue: 3, required: true },
      { id: 'g2', label: 'Subject 2 Grade Points (1-10)', type: 'number', defaultValue: 8, required: true },
      { id: 'c3', label: 'Subject 3 Credits', type: 'number', defaultValue: 3, required: false },
      { id: 'g3', label: 'Subject 3 Grade Points (1-10)', type: 'number', defaultValue: 7, required: false },
      { id: 'c4', label: 'Subject 4 Credits', type: 'number', defaultValue: 2, required: false },
      { id: 'g4', label: 'Subject 4 Grade Points (1-10)', type: 'number', defaultValue: 10, required: false }
    ],
    calculate: (inputs) => {
      let weightedPoints = 0;
      let totalCredits = 0;

      for (let i = 1; i <= 4; i++) {
        const credit = parseFloat(inputs[`c${i}`]) || 0;
        const grade = parseFloat(inputs[`g${i}`]) || 0;
        if (credit > 0 && grade > 0) {
          weightedPoints += credit * grade;
          totalCredits += credit;
        }
      }

      if (totalCredits === 0) return { error: 'Please enter valid subject credits.' };
      const sgpa = weightedPoints / totalCredits;

      return {
        sgpa: sgpa.toFixed(2),
        totalCredits
      };
    },
    outputs: [
      { id: 'sgpa', label: 'Calculated SGPA', type: 'number' },
      { id: 'totalCredits', label: 'Total Credits Registered', type: 'number' }
    ],
    formula: {
      text: 'SGPA = Sum(Course Credits * Grade Points) / Total Course Credits',
      explanation: 'Calculates the weighted average of grades based on course credit weightings.'
    },
    steps: [
      'Enter course credit values for each class.',
      'Enter grade points achieved in each class (typically from 1 to 10).',
      'The engine computes weight-adjusted SGPA.'
    ],
    examples: [
      { input: 'Sub 1: 4 credits, Grade 9. Sub 2: 3 credits, Grade 8.', calculation: '((4*9) + (3*8)) / (4+3) = (36 + 24) / 7 = 60/7 = 8.57', result: '8.57 SGPA' }
    ],
    faq: [
      { question: 'What is SGPA?', answer: 'SGPA (Semester Grade Point Average) is the average of the grade points obtained in all courses registered by a student during a single semester.' }
    ]
  },

  'attendance-calculator': {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    category: 'Student',
    slug: 'attendance-calculator',
    description: 'Calculate your attendance percentage, and check how many classes you can skip or need to attend to meet a target percentage.',
    metaTitle: 'Attendance Calculator - Classes to Skip or Attend - CalcNest',
    metaDescription: 'Calculate attendance percentages. Know exactly how many more classes to attend to reach targets or how many you can skip safely.',
    fields: [
      { id: 'total', label: 'Total Classes Conducted', type: 'number', defaultValue: 100, required: true },
      { id: 'attended', label: 'Classes Attended', type: 'number', defaultValue: 70, required: true },
      { id: 'target', label: 'Required Attendance (%)', type: 'number', defaultValue: 75, required: true }
    ],
    calculate: (inputs) => {
      const total = parseInt(inputs.total) || 0;
      const attended = parseInt(inputs.attended) || 0;
      const target = parseFloat(inputs.target) || 75;

      if (total <= 0 || attended < 0 || attended > total) {
        return { error: 'Classes attended must be positive and less than or equal to total classes.' };
      }

      const current = (attended / total) * 100;
      let statusText = '';
      let actionCount = 0;

      if (current >= target) {
        // Can skip classes: Find x where (attended) / (total + x) >= target/100
        // attended >= (target/100) * (total + x)
        // x <= (attended * 100 / target) - total
        actionCount = Math.floor((attended * 100 / target) - total);
        statusText = `Safe! You have sufficient attendance. You can skip the next ${actionCount} classes and still maintain ${target}% attendance.`;
      } else {
        // Must attend classes: Find x where (attended + x) / (total + x) >= target/100
        // attended + x >= (target/100) * total + (target/100) * x
        // x * (1 - target/100) >= (target/100) * total - attended
        // x >= (target * total - 100 * attended) / (100 - target)
        actionCount = Math.ceil((target * total - 100 * attended) / (100 - target));
        statusText = `Shortage! You need to attend the next ${actionCount} classes consecutively to reach your ${target}% target.`;
      }

      return {
        current: `${current.toFixed(1)}%`,
        status: statusText
      };
    },
    outputs: [
      { id: 'current', label: 'Current Attendance', type: 'text' },
      { id: 'status', label: 'Target Strategy', type: 'text' }
    ],
    formula: {
      text: 'Current % = (Attended / Total) * 100; \nRequired Classes = (Target*Total - 100*Attended) / (100 - Target).',
      explanation: 'Calculates the ratio of attended sessions and estimates limits for skipping or attending additional lectures.'
    },
    steps: [
      'Enter total lectures conducted so far.',
      'Enter your attendance count.',
      'Input the target college threshold (e.g. 75% or 85%).',
      'The tool tells you your current standing and what actions to take.'
    ],
    examples: [
      { input: 'Total: 50; Attended: 40; Target: 75%', calculation: 'Current = 80%. Can skip: floor(40*100/75 - 50) = 3 classes.', result: '80% (Can skip 3 classes)' }
    ],
    faq: [
      { question: 'What does consecutive class attendance mean?', answer: 'It means attending every upcoming class without missing any, which increases your overall attendance percentage as quickly as possible.' }
    ]
  },

  'marks-percentage-calculator': {
    id: 'marks-percentage-calculator',
    name: 'Marks Percentage Calculator',
    category: 'Student',
    slug: 'marks-percentage-calculator',
    description: 'Calculate marks percentages, grade boundaries, and test score ratings instantly.',
    metaTitle: 'Marks Percentage Calculator - Score Percentage Online - CalcNest',
    metaDescription: 'Find percentages for academic tests. Enter obtained marks and maximum marks to see grade ratings.',
    fields: [
      { id: 'obtained', label: 'Marks Obtained', type: 'number', defaultValue: 420, required: true },
      { id: 'max', label: 'Maximum Marks', type: 'number', defaultValue: 500, required: true }
    ],
    calculate: (inputs) => {
      const obtained = parseFloat(inputs.obtained) || 0;
      const max = parseFloat(inputs.max) || 0;

      if (max <= 0 || obtained < 0 || obtained > max) {
        return { error: 'Obtained marks cannot exceed maximum marks.' };
      }

      const pct = (obtained / max) * 100;
      let grade = 'F';

      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B';
      else if (pct >= 60) grade = 'C';
      else if (pct >= 50) grade = 'D';

      return {
        pct: `${pct.toFixed(2)}%`,
        grade
      };
    },
    outputs: [
      { id: 'pct', label: 'Percentage Scored', type: 'text' },
      { id: 'grade', label: 'Letter Grade', type: 'text' }
    ],
    formula: {
      text: 'Percentage = (Marks Obtained / Maximum Marks) * 100',
      explanation: 'Normalizes scores to a 100-point scale.'
    },
    steps: [
      'Enter the actual marks you obtained.',
      'Enter the maximum possible marks for the test or exam.',
      'The calculator computes percentage and assigns a grade.'
    ],
    examples: [
      { input: 'Obtained: 85; Max: 100', calculation: '(85/100) * 100 = 85%', result: '85% (Grade A)' }
    ],
    faq: [
      { question: 'How is GPA related to percentage?', answer: 'Percentages represent raw proportional scores, whereas GPAs normalize these scores onto standard scales (typically 4.0 or 10.0 scale) used by universities.' }
    ]
  },

  'grade-calculator': {
    id: 'grade-calculator',
    name: 'Grade Calculator',
    category: 'Student',
    slug: 'grade-calculator',
    description: 'Calculate the minimum final exam grade required to achieve a target overall course grade.',
    metaTitle: 'Final Grade Calculator - Target Score Planner - CalcNest',
    metaDescription: 'Find out what grade you need on your final exam to pass or reach your target semester score.',
    fields: [
      { id: 'current', label: 'Current Grade (%)', type: 'number', defaultValue: 82, required: true },
      { id: 'target', label: 'Target Overall Grade (%)', type: 'number', defaultValue: 85, required: true },
      { id: 'weight', label: 'Final Exam Weight (%)', type: 'number', defaultValue: 25, required: true }
    ],
    calculate: (inputs) => {
      const current = parseFloat(inputs.current) || 0;
      const target = parseFloat(inputs.target) || 0;
      const weight = parseFloat(inputs.weight) || 0;

      if (weight <= 0 || weight >= 100) {
        return { error: 'Final exam weight must be between 1 and 99.' };
      }

      // Overall = Current * (1 - weight/100) + Final * (weight/100)
      // Final = [Overall - Current * (1 - weight/100)] / (weight/100)
      const wFraction = weight / 100;
      const requiredFinal = (target - current * (1 - wFraction)) / wFraction;

      return {
        required: `${requiredFinal.toFixed(2)}%`,
        status: requiredFinal > 100 
          ? 'Extra credit needed! You must score over 100% on the final to reach this target.' 
          : requiredFinal <= 0 
            ? 'Success! You already secured this target grade.'
            : `You need to score at least ${requiredFinal.toFixed(1)}% on the final exam.`
      };
    },
    outputs: [
      { id: 'required', label: 'Required Final Grade', type: 'text' },
      { id: 'status', label: 'Advisory Note', type: 'text' }
    ],
    formula: {
      text: 'Final Exam Grade = [Target - Current * (1 - Weight)] / Weight',
      explanation: 'Determines the minimum final exam grade required to meet an overall course percentage target.'
    },
    steps: [
      'Enter your current cumulative course grade percentage.',
      'Enter the overall target grade you want to achieve.',
      'Input the percentage weight assigned to the final exam.'
    ],
    examples: [
      { input: 'Current: 80%; Target: 85%; Final weight: 20%', calculation: 'Required = [85 - 80 * 0.8] / 0.2 = [85 - 64] / 0.2 = 21 / 0.2 = 105%', result: '105%' }
    ],
    faq: [
      { question: 'What is weighted grading?', answer: 'Weighted grading is when different categories of assignments (tests, quizzes, homework, finals) contribute different percentages to your overall course grade.' }
    ]
  },

  'gpa-calculator': {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'Student',
    slug: 'gpa-calculator',
    description: 'Calculate your college or high school GPA on a standard 4.0 weighted scale.',
    metaTitle: 'GPA Calculator - Weighted 4.0 Scale - CalcNest',
    metaDescription: 'Find your Grade Point Average (GPA) using course credit weights and letter grades (A, B, C, etc.). Free online GPA tool.',
    fields: [
      { id: 'gr1', label: 'Subject 1 Grade', type: 'select', defaultValue: '4.0', options: [
        { label: 'A (4.0)', value: '4.0' },
        { label: 'B (3.0)', value: '3.0' },
        { label: 'C (2.0)', value: '2.0' },
        { label: 'D (1.0)', value: '1.0' },
        { label: 'F (0.0)', value: '0.0' }
      ]},
      { id: 'cr1', label: 'Subject 1 Credits', type: 'number', defaultValue: 3, required: true },
      { id: 'gr2', label: 'Subject 2 Grade', type: 'select', defaultValue: '3.0', options: [
        { label: 'A (4.0)', value: '4.0' },
        { label: 'B (3.0)', value: '3.0' },
        { label: 'C (2.0)', value: '2.0' },
        { label: 'D (1.0)', value: '1.0' },
        { label: 'F (0.0)', value: '0.0' }
      ]},
      { id: 'cr2', label: 'Subject 2 Credits', type: 'number', defaultValue: 3, required: true },
      { id: 'gr3', label: 'Subject 3 Grade', type: 'select', defaultValue: '4.0', options: [
        { label: 'A (4.0)', value: '4.0' },
        { label: 'B (3.0)', value: '3.0' },
        { label: 'C (2.0)', value: '2.0' },
        { label: 'D (1.0)', value: '1.0' },
        { label: 'F (0.0)', value: '0.0' }
      ]},
      { id: 'cr3', label: 'Subject 3 Credits', type: 'number', defaultValue: 4, required: false }
    ],
    calculate: (inputs) => {
      let weightPoints = 0;
      let totalCredits = 0;

      for (let i = 1; i <= 3; i++) {
        const gradePoint = parseFloat(inputs[`gr${i}`]) || 0;
        const credit = parseFloat(inputs[`cr${i}`]) || 0;
        if (credit > 0) {
          weightPoints += gradePoint * credit;
          totalCredits += credit;
        }
      }

      if (totalCredits === 0) return { error: 'Please enter subject credits.' };
      const gpa = weightPoints / totalCredits;

      return {
        gpa: gpa.toFixed(2),
        totalCredits
      };
    },
    outputs: [
      { id: 'gpa', label: 'Calculated GPA (4.0 scale)', type: 'number' },
      { id: 'totalCredits', label: 'Total Credits', type: 'number' }
    ],
    formula: {
      text: 'GPA = Sum(Grade Points * Credits) / Total Credits',
      explanation: 'Calculates academic grade point average weighted by credit value.'
    },
    steps: [
      'Select letter grades for each class.',
      'Enter course credit hours.',
      'Calculate to find your 4.0 weighted average.'
    ],
    examples: [
      { input: 'A (4cr), B (3cr)', calculation: '((4 * 4) + (3 * 3)) / 7 = (16 + 9) / 7 = 25/7 = 3.57', result: '3.57 GPA' }
    ],
    faq: [
      { question: 'What is a good GPA?', answer: 'A GPA of 3.0 or higher is generally considered good. A GPA of 3.5 or higher makes you a strong candidate for honors and competitive admissions.' }
    ]
  },

  'study-hours-calculator': {
    id: 'study-hours-calculator',
    name: 'Study Hours Calculator',
    category: 'Student',
    slug: 'study-hours-calculator',
    description: 'Plan and balance study hours based on target goals, daily availability, and prep periods.',
    metaTitle: 'Study Planner - Hours and Time Allocator - CalcNest',
    metaDescription: 'Find how many hours you need to study daily to pass exams. Simple planner matching study load and deadlines.',
    fields: [
      { id: 'target', label: 'Total Study Hours Needed', type: 'number', defaultValue: 150, required: true },
      { id: 'days', label: 'Days Remaining for Exams', type: 'number', defaultValue: 30, required: true },
      { id: 'current', label: 'Hours Completed', type: 'number', defaultValue: 30, required: false }
    ],
    calculate: (inputs) => {
      const target = parseFloat(inputs.target) || 0;
      const days = parseFloat(inputs.days) || 0;
      const current = parseFloat(inputs.current) || 0;

      if (days <= 0) return { error: 'Remaining days must be positive.' };

      const remaining = Math.max(0, target - current);
      const daily = remaining / days;

      return {
        remaining: remaining.toFixed(1),
        daily: daily.toFixed(2),
        weekly: (daily * 7).toFixed(1)
      };
    },
    outputs: [
      { id: 'remaining', label: 'Remaining Hours Needed', type: 'number' },
      { id: 'daily', label: 'Required Daily Study Time (hrs)', type: 'number' },
      { id: 'weekly', label: 'Required Weekly Study Time (hrs)', type: 'number' }
    ],
    formula: {
      text: 'Daily Study Hours = (Total Hours Needed - Hours Completed) / Days Remaining',
      explanation: 'Distributes required educational preparation time evenly across the days remaining.'
    },
    steps: [
      'Enter the estimated total study hours required to master the material.',
      'Enter the days remaining before the exam or deadline.',
      'Input the hours you have completed so far.'
    ],
    examples: [
      { input: 'Target: 100 hrs; Days: 20; Completed: 20 hrs', calculation: 'Remaining = 80 hrs. Daily = 80 / 20 = 4.0 hrs/day', result: '4.0 hrs/day' }
    ],
    faq: [
      { question: 'What is a realistic study limit?', answer: 'Most studies suggest focusing in 45-minute blocks followed by 10-minute breaks. Limit intense study to 4-6 productive hours per day to avoid burnout.' }
    ]
  },

  // === HEALTH ===
  'bmi-calculator': {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'Health',
    slug: 'bmi-calculator',
    description: 'Calculate Body Mass Index (BMI) and determine body weight classification indices.',
    metaTitle: 'BMI Calculator - Body Mass Index Online - CalcNest',
    metaDescription: 'Find your BMI score instantly. Includes rating meter showing underweight, normal weight, overweight, and obesity ranges.',
    customRenderer: 'BmiCalculator',
    fields: [
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, required: true },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, required: true }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weight) || 0;
      const h = parseFloat(inputs.height) || 0;

      if (w <= 0 || h <= 0) return { error: 'Please enter positive height and weight values.' };

      // Formula: w / (h/100)^2
      const bmi = w / Math.pow(h / 100, 2);
      let category = 'Normal';
      let colorClass = 'success';

      if (bmi < 18.5) {
        category = 'Underweight';
        colorClass = 'warning';
      } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        colorClass = 'success';
      } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        colorClass = 'warning';
      } else {
        category = 'Obese';
        colorClass = 'error';
      }

      return {
        bmi: bmi.toFixed(2),
        category,
        colorClass
      };
    },
    outputs: [
      { id: 'bmi', label: 'BMI Score', type: 'number' },
      { id: 'category', label: 'Weight Category', type: 'text' }
    ],
    formula: {
      text: 'BMI = Weight (kg) / [Height (m)]^2',
      explanation: 'Body Mass Index is a simple mathematical ratio measuring a person\'s weight relative to height.'
    },
    steps: [
      'Enter your weight in kilograms.',
      'Enter your height in centimeters.',
      'The engine divides your weight by height squared.'
    ],
    examples: [
      { input: 'Weight: 70kg; Height: 175cm', calculation: '70 / (1.75 * 1.75) = 70 / 3.0625 = 22.86', result: '22.86 (Normal)' }
    ],
    faq: [
      { question: 'What is a normal BMI range?', answer: 'According to the World Health Organization, a normal BMI for adults ranges from 18.5 to 24.9. Scores below 18.5 are underweight, while 25+ are overweight.' }
    ]
  },

  'calorie-calculator': {
    id: 'calorie-calculator',
    name: 'Calorie Calculator',
    category: 'Health',
    slug: 'calorie-calculator',
    description: 'Estimate daily calorie intake targets for weight maintenance, loss, or gain.',
    metaTitle: 'Calorie Intake Calculator - Weight Goals - CalcNest',
    metaDescription: 'Find daily calorie requirements to maintain, lose, or gain weight based on metabolic formulas.',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, required: true },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, required: true },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 30, required: true },
      { id: 'activity', label: 'Activity Level', type: 'select', defaultValue: '1.375', options: [
        { label: 'Sedentary (Little or no exercise)', value: '1.2' },
        { label: 'Lightly Active (Exercise 1-3 days/week)', value: '1.375' },
        { label: 'Moderately Active (Exercise 3-5 days/week)', value: '1.55' },
        { label: 'Very Active (Exercise 6-7 days/week)', value: '1.725' }
      ]}
    ],
    calculate: (inputs) => {
      const g = inputs.gender;
      const w = parseFloat(inputs.weight) || 0;
      const h = parseFloat(inputs.height) || 0;
      const age = parseFloat(inputs.age) || 0;
      const act = parseFloat(inputs.activity) || 1.2;

      if (w <= 0 || h <= 0 || age <= 0) return { error: 'Please check your inputs.' };

      // Mifflin-St Jeor Formula
      let bmr = 10 * w + 6.25 * h - 5 * age;
      if (g === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      const maintenance = bmr * act;
      const loss = maintenance - 500;
      const gain = maintenance + 500;

      return {
        bmr: Math.round(bmr),
        maintenance: Math.round(maintenance),
        loss: Math.round(loss),
        gain: Math.round(gain)
      };
    },
    outputs: [
      { id: 'bmr', label: 'Basal Metabolic Rate (BMR)', type: 'number' },
      { id: 'maintenance', label: 'Daily Maintenance (TDEE)', type: 'number' },
      { id: 'loss', label: 'Weight Loss Target (Cal/day)', type: 'number' },
      { id: 'gain', label: 'Weight Gain Target (Cal/day)', type: 'number' }
    ],
    formula: {
      text: 'BMR = 10*Weight + 6.25*Height - 5*Age (+5 for men, -161 for women); \nTDEE = BMR * Activity_Multiplier.',
      explanation: 'Calculates standard energy expenditures and adjusts targets for caloric surplus or deficit.'
    },
    steps: [
      'Select biological gender.',
      'Enter weight, height, and age.',
      'Choose activity factor representing daily exertion.'
    ],
    examples: [
      { input: 'Male, 80kg, 180cm, 30yo, Sedentary', calculation: 'BMR = 800 + 1125 - 150 + 5 = 1780. TDEE = 1780 * 1.2 = 2136 calories.', result: '2136 calories/day' }
    ],
    faq: [
      { question: 'What is a calorie deficit?', answer: 'A calorie deficit is when you consume fewer calories than your body burns, prompting it to use stored fat for energy and resulting in weight loss.' }
    ]
  },

  'bmr-calculator': {
    id: 'bmr-calculator',
    name: 'BMR Calculator',
    category: 'Health',
    slug: 'bmr-calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) representing energy spent resting.',
    metaTitle: 'BMR Calculator - Basal Metabolic Rate - CalcNest',
    metaDescription: 'Find your resting metabolic calories using Mifflin-St Jeor and Harris-Benedict algorithms.',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, required: true },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, required: true },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 30, required: true }
    ],
    calculate: (inputs) => {
      const g = inputs.gender;
      const w = parseFloat(inputs.weight) || 0;
      const h = parseFloat(inputs.height) || 0;
      const age = parseFloat(inputs.age) || 0;

      if (w <= 0 || h <= 0 || age <= 0) return { error: 'Please check your inputs.' };

      // Mifflin-St Jeor
      let bmrMifflin = 10 * w + 6.25 * h - 5 * age + (g === 'male' ? 5 : -161);
      // Original Harris-Benedict
      let bmrHarris = g === 'male'
        ? 66.473 + 13.7516 * w + 5.0033 * h - 6.755 * age
        : 655.0955 + 9.5634 * w + 1.8496 * h - 4.6756 * age;

      return {
        mifflin: Math.round(bmrMifflin),
        harris: Math.round(bmrHarris)
      };
    },
    outputs: [
      { id: 'mifflin', label: 'BMR (Mifflin-St Jeor)', type: 'number' },
      { id: 'harris', label: 'BMR (Harris-Benedict)', type: 'number' }
    ],
    formula: {
      text: 'Mifflin BMR = 10*Weight + 6.25*Height - 5*Age (+5 for men, -161 for women).',
      explanation: 'Measures resting calorie requirements without exercise factors.'
    },
    steps: [
      'Enter personal gender, weight, height, and age.',
      'The engine computes baseline resting metabolism.'
    ],
    examples: [
      { input: 'Female, 60kg, 165cm, 25yo', calculation: 'BMR = 600 + 1031 - 125 - 161 = 1345 calories.', result: '1345 calories' }
    ],
    faq: [
      { question: 'What is Basal Metabolic Rate?', answer: 'BMR represents the number of calories your body needs to maintain basic life-sustaining functions (breathing, circulation, cell production) while at complete rest.' }
    ]
  },

  'tdee-calculator': {
    id: 'tdee-calculator',
    name: 'TDEE Calculator',
    category: 'Health',
    slug: 'tdee-calculator',
    description: 'Calculate Total Daily Energy Expenditure (TDEE) to plan workout and nutritional targets.',
    metaTitle: 'TDEE Calculator - Total Daily Energy - CalcNest',
    metaDescription: 'Find your TDEE online. Calculate total active calories based on baseline metabolic rate and training frequency.',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 75, required: true },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 180, required: true },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 28, required: true },
      { id: 'activity', label: 'Activity Mult', type: 'select', defaultValue: '1.375', options: [
        { label: 'Sedentary (1.2)', value: '1.2' },
        { label: 'Lightly Active (1.375)', value: '1.375' },
        { label: 'Moderately Active (1.55)', value: '1.55' },
        { label: 'Very Active (1.725)', value: '1.725' },
        { label: 'Athlete (1.9)', value: '1.9' }
      ]}
    ],
    calculate: (inputs) => {
      const g = inputs.gender;
      const w = parseFloat(inputs.weight) || 0;
      const h = parseFloat(inputs.height) || 0;
      const age = parseFloat(inputs.age) || 0;
      const act = parseFloat(inputs.activity) || 1.2;

      if (w <= 0 || h <= 0 || age <= 0) return { error: 'Please check your inputs.' };

      const bmr = 10 * w + 6.25 * h - 5 * age + (g === 'male' ? 5 : -161);
      const tdee = bmr * act;

      return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
      };
    },
    outputs: [
      { id: 'bmr', label: 'Basal Metabolic Rate (BMR)', type: 'number' },
      { id: 'tdee', label: 'Total Daily Energy Expenditure (TDEE)', type: 'number' }
    ],
    formula: {
      text: 'TDEE = BMR * Activity Factor',
      explanation: 'Scales resting metabolism based on physical work and exercise multipliers.'
    },
    steps: [
      'Enter personal details to get BMR.',
      'Select activity multiplier representing workout density.'
    ],
    examples: [
      { input: 'Male, 75kg, 180cm, 28yo, Moderately Active', calculation: 'BMR = 1715. TDEE = 1715 * 1.55 = 2658 calories.', result: '2658 calories' }
    ],
    faq: [
      { question: 'How is TDEE used in fitness?', answer: 'TDEE is the starting point for bodybuilding or fitness goals. Consume below your TDEE to lose fat, or above it to build muscle mass.' }
    ]
  },

  'water-intake-calculator': {
    id: 'water-intake-calculator',
    name: 'Water Intake Calculator',
    category: 'Health',
    slug: 'water-intake-calculator',
    description: 'Calculate your recommended daily water consumption targets based on body weight.',
    metaTitle: 'Water Intake Calculator - Daily Hydration - CalcNest',
    metaDescription: 'Find out how much water to drink daily. Enter weight to get hydration targets in liters and cups.',
    fields: [
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, required: true },
      { id: 'exercise', label: 'Daily Exercise Time (Minutes)', type: 'number', defaultValue: 30, required: false }
    ],
    calculate: (inputs) => {
      const weight = parseFloat(inputs.weight) || 0;
      const exercise = parseFloat(inputs.exercise) || 0;

      if (weight <= 0) return { error: 'Please enter positive weight.' };

      // Base hydration: 35ml per kg body weight
      // Plus 350ml per 30 mins exercise
      const baseLit = weight * 0.035;
      const exerciseLit = (exercise / 30) * 0.35;
      const totalLit = baseLit + exerciseLit;
      const cups = totalLit / 0.25; // 250ml cup

      return {
        liters: `${totalLit.toFixed(2)} Liters`,
        cups: `${Math.round(cups)} cups (250ml each)`,
        ounces: `${(totalLit * 33.814).toFixed(1)} fl. oz.`
      };
    },
    outputs: [
      { id: 'liters', label: 'Water Requirement', type: 'text' },
      { id: 'cups', label: 'Cups Equivalent', type: 'text' },
      { id: 'ounces', label: 'Fluid Ounces', type: 'text' }
    ],
    formula: {
      text: 'Water (ml) = Weight (kg) * 35 + (Exercise mins / 30) * 350.',
      explanation: 'Compiles basic physiological hydration rules adjusted for metabolic heat release.'
    },
    steps: [
      'Enter body mass.',
      'Enter daily physical exercise duration.',
      'The calculator returns liters, fluid ounces, and cup ratings.'
    ],
    examples: [
      { input: 'Weight: 70kg; Exercise: 30 mins', calculation: '70 * 35 + 350 = 2450 + 350 = 2800 ml = 2.8L.', result: '2.8 Liters' }
    ],
    faq: [
      { question: 'Why is hydration critical?', answer: 'Hydration regulates body temperature, lubricates joints, carries nutrients to cells, and keeps major biological organs functioning smoothly.' }
    ]
  },

  'protein-intake-calculator': {
    id: 'protein-intake-calculator',
    name: 'Protein Intake Calculator',
    category: 'Health',
    slug: 'protein-intake-calculator',
    description: 'Calculate daily protein requirements in grams based on activity metrics and bodybuilding goals.',
    metaTitle: 'Protein Intake Calculator - Daily Target Grams - CalcNest',
    metaDescription: 'Find daily protein targets based on physical goals (fat loss, maintenance, muscle gain) and body weight.',
    fields: [
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, required: true },
      { id: 'goal', label: 'Fitness Goal', type: 'select', defaultValue: 'maintain', options: [
        { label: 'Lose Weight / Fat Loss', value: 'lose' },
        { label: 'Maintain Weight', value: 'maintain' },
        { label: 'Build Muscle / Gain Mass', value: 'build' }
      ]},
      { id: 'activity', label: 'Activity Profile', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Sedentary (No workouts)', value: 'sedentary' },
        { label: 'Moderately Active (Gym 3x/week)', value: 'moderate' },
        { label: 'Athlete / Heavy Lifter', value: 'heavy' }
      ]}
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weight) || 0;
      const goal = inputs.goal;
      const act = inputs.activity;

      if (w <= 0) return { error: 'Please enter positive weight.' };

      // Base multipliers (grams of protein per kg)
      let mult = 1.0;
      if (act === 'sedentary') mult = 0.8;
      else if (act === 'moderate') mult = 1.4;
      else if (act === 'heavy') mult = 2.0;

      if (goal === 'build') mult += 0.2;
      if (goal === 'lose') mult += 0.1; // Protect muscle mass during deficit

      const protein = w * mult;

      return {
        protein: `${protein.toFixed(1)} grams`,
        multiplier: `${mult.toFixed(1)} g/kg`,
        calories: `${Math.round(protein * 4)} kcal`
      };
    },
    outputs: [
      { id: 'protein', label: 'Daily Protein Target', type: 'text' },
      { id: 'multiplier', label: 'Intensity Multiplier', type: 'text' },
      { id: 'calories', label: 'Caloric Contribution from Protein', type: 'text' }
    ],
    formula: {
      text: 'Protein (g) = Weight (kg) * Goal-specific Intensity Multiplier',
      explanation: 'Weights muscle-maintenance guidelines (0.8 to 2.2 g/kg) according to fitness goals.'
    },
    steps: [
      'Enter body mass.',
      'Select active fitness goal and physical profile.',
      'The calculator multiplies factors to yield protein gram counts.'
    ],
    examples: [
      { input: 'Weight: 80kg; Goal: Build Muscle; Profile: Heavy Lifter', calculation: 'Mult = 2.0 + 0.2 = 2.2 g/kg. Protein = 80 * 2.2 = 176 grams.', result: '176 grams' }
    ],
    faq: [
      { question: 'Why does weight loss need extra protein?', answer: 'Eating high protein during a caloric deficit prevents muscle breakdown, forcing the body to burn fat tissue instead, while increasing satiety.' }
    ]
  },

  'ideal-weight-calculator': {
    id: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    category: 'Health',
    slug: 'ideal-weight-calculator',
    description: 'Calculate your ideal body weight ranges using Devine, Robinson, and Miller formulas.',
    metaTitle: 'Ideal Weight Calculator - Free Online Tool - CalcNest',
    metaDescription: 'Find your healthy body weight range based on gender and height using standard clinical formulas.',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, required: true }
    ],
    calculate: (inputs) => {
      const gender = inputs.gender;
      const heightCm = parseFloat(inputs.height) || 0;

      if (heightCm <= 0) return { error: 'Please enter positive height.' };

      const heightInches = heightCm / 2.54;
      const inchesOver60 = Math.max(0, heightInches - 60);

      // Devine Formula
      // Male: 50.0 kg + 2.3 kg per inch over 5 feet
      // Female: 45.5 kg + 2.3 kg per inch over 5 feet
      let devine = 0;
      let robinson = 0;

      if (gender === 'male') {
        devine = 50.0 + 2.3 * inchesOver60;
        robinson = 52.0 + 1.9 * inchesOver60;
      } else {
        devine = 45.5 + 2.3 * inchesOver60;
        robinson = 49.0 + 1.7 * inchesOver60;
      }

      return {
        devine: `${devine.toFixed(1)} kg`,
        robinson: `${robinson.toFixed(1)} kg`,
        range: `${(devine * 0.9).toFixed(1)} kg - ${(devine * 1.1).toFixed(1)} kg`
      };
    },
    outputs: [
      { id: 'devine', label: 'Ideal Weight (Devine Formula)', type: 'text' },
      { id: 'robinson', label: 'Ideal Weight (Robinson Formula)', type: 'text' },
      { id: 'range', label: 'Healthy Weight Range (+/- 10%)', type: 'text' }
    ],
    formula: {
      text: 'Devine Formula: Men = 50.0 + 2.3 * (Height_in - 60); Women = 45.5 + 2.3 * (Height_in - 60)',
      explanation: 'Calculates reference body weight weights for pharmaceutical clearance and physiological targets.'
    },
    steps: [
      'Choose gender.',
      'Enter height. The system computes standard height index offsets.'
    ],
    examples: [
      { input: 'Male, 175cm (68.9 inches)', calculation: 'Inches over 60 = 8.9. Devine = 50 + 2.3 * 8.9 = 70.47 kg.', result: '70.5 kg' }
    ],
    faq: [
      { question: 'Are these ideal weights absolute?', answer: 'No. These clinical formulas are based solely on height and gender. They do not account for muscle mass, bone density, or body frame width.' }
    ]
  },

  'body-fat-calculator': {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    category: 'Health',
    slug: 'body-fat-calculator',
    description: 'Estimate body fat percentage using standard tape-measure metrics and the US Navy Method.',
    metaTitle: 'Body Fat Calculator - US Navy Method - CalcNest',
    metaDescription: 'Find your body fat percentage online. Simple calculator using waist, neck, hips, and height measurements.',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, required: true },
      { id: 'neck', label: 'Neck Circumference (cm)', type: 'number', defaultValue: 38, required: true },
      { id: 'waist', label: 'Waist Circumference (cm)', type: 'number', defaultValue: 88, required: true },
      { id: 'hip', label: 'Hip Circumference (cm, Females only)', type: 'number', defaultValue: 95, required: false }
    ],
    calculate: (inputs) => {
      const gender = inputs.gender;
      const h = parseFloat(inputs.height) || 0;
      const neck = parseFloat(inputs.neck) || 0;
      const waist = parseFloat(inputs.waist) || 0;
      const hip = parseFloat(inputs.hip) || 0;

      if (h <= 0 || neck <= 0 || waist <= 0) return { error: 'Please enter valid body dimensions.' };

      let bodyFat = 0;
      if (gender === 'male') {
        if (waist <= neck) return { error: 'Waist must be larger than neck.' };
        // US Navy Formula Men (metric): 86.010*log10(waist - neck) - 70.041*log10(height) + 36.76
        bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
      } else {
        if (hip <= 0) return { error: 'Hip measurement is required for women.' };
        if (waist + hip <= neck) return { error: 'Waist + Hips must be larger than neck.' };
        // US Navy Formula Women (metric): 163.205*log10(waist + hip - neck) - 97.684*log10(height) - 78.387
        bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
      }

      if (isNaN(bodyFat) || bodyFat < 2) return { error: 'Invalid measurements resulting in mathematically impossible body fat.' };

      return {
        bodyFat: `${bodyFat.toFixed(1)}%`,
        category: bodyFat < 6 ? 'Essential Fat' : bodyFat < 14 ? 'Athletes' : bodyFat < 18 ? 'Fitness' : bodyFat < 25 ? 'Acceptable' : 'Excess Fat'
      };
    },
    outputs: [
      { id: 'bodyFat', label: 'Body Fat Percentage', type: 'text' },
      { id: 'category', label: 'Body Fat Classification', type: 'text' }
    ],
    formula: {
      text: 'Navy Men % = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76; \nNavy Women % = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387.',
      explanation: 'US Navy equations matching torso circumferences against overall height.'
    },
    steps: [
      'Select gender.',
      'Provide height, waist line, neck line, and hips (if female).',
      'The engine computes body composition ratios.'
    ],
    examples: [
      { input: 'Male, 180cm height, 38cm neck, 85cm waist', calculation: 'BF = 86.01 * log10(47) - 70.04 * log10(180) + 36.76 = 14.1%', result: '14.1%' }
    ],
    faq: [
      { question: 'How accurate is the Navy body fat calculator?', answer: 'When measured correctly, it is usually accurate within 3-4% of DEXA scans, making it a reliable and cheap option for tracking progress.' }
    ]
  },

  // === CRICKET ===
  'run-rate-calculator': {
    id: 'run-rate-calculator',
    name: 'Run Rate Calculator',
    category: 'Cricket',
    slug: 'run-rate-calculator',
    description: 'Calculate a team\'s Run Rate (RR) in a cricket match from total runs scored and overs faced.',
    metaTitle: 'Cricket Run Rate Calculator - Quick Matches - CalcNest',
    metaDescription: 'Find your team\'s cricket Run Rate instantly. Put in runs scored and overs to calculate runs per over.',
    fields: [
      { id: 'runs', label: 'Runs Scored', type: 'number', defaultValue: 150, required: true },
      { id: 'overs', label: 'Overs Bowled / Faced (e.g. 15.3)', type: 'number', defaultValue: 15.3, required: true }
    ],
    calculate: (inputs) => {
      const runs = parseFloat(inputs.runs) || 0;
      const oversVal = parseFloat(inputs.overs) || 0;
      
      const totalOvers = parseOvers(oversVal);
      if (totalOvers <= 0) return { error: 'Overs faced must be greater than zero.' };

      const rr = runs / totalOvers;

      return {
        runRate: rr.toFixed(2),
        totalOvers: totalOvers.toFixed(2)
      };
    },
    outputs: [
      { id: 'runRate', label: 'Run Rate (Runs/Over)', type: 'number' },
      { id: 'totalOvers', label: 'Exact Overs faced', type: 'number' }
    ],
    formula: {
      text: 'Run Rate = Total Runs / Total Overs Faced',
      explanation: 'Where overs represent completed sets of 6 balls (e.g., 10.3 overs = 10.5 total overs in math).'
    },
    steps: [
      'Enter total runs scored.',
      'Enter overs bowled (e.g. enter 10.3 to represent 10 overs and 3 balls).',
      'The engine normalizes balls to decimal and finds runs per over.'
    ],
    examples: [
      { input: 'Runs: 120, Overs: 15.3', calculation: 'Overs = 15.5. RR = 120 / 15.5 = 7.74', result: '7.74 runs/over' }
    ],
    faq: [
      { question: 'What does 10.3 overs mean?', answer: 'In cricket, 10.3 overs means 10 completed overs of 6 balls, plus 3 balls of the next over. For calculation, 3 balls equals 3/6 = 0.5 overs.' }
    ]
  },

  'net-run-rate-calculator': {
    id: 'net-run-rate-calculator',
    name: 'Net Run Rate Calculator',
    category: 'Cricket',
    slug: 'net-run-rate-calculator',
    description: 'Calculate Net Run Rate (NRR) for cricket tournaments, featuring adjustments for teams bowled out.',
    metaTitle: 'Net Run Rate (NRR) Calculator - Tournament Standings - CalcNest',
    metaDescription: 'Find cricket Net Run Rate. Easy math matching runs/overs scored against runs/overs conceded.',
    fields: [
      { id: 'runsScored', label: 'Runs Scored by Your Team', type: 'number', defaultValue: 850, required: true },
      { id: 'oversFaced', label: 'Total Overs Faced (e.g. 100.2)', type: 'number', defaultValue: 100.2, required: true },
      { id: 'runsConceded', label: 'Runs Conceded to Opponents', type: 'number', defaultValue: 800, required: true },
      { id: 'oversBowled', label: 'Total Overs Bowled (e.g. 98.4)', type: 'number', defaultValue: 98.4, required: true }
    ],
    calculate: (inputs) => {
      const runsScored = parseFloat(inputs.runsScored) || 0;
      const oversFaced = parseOvers(inputs.oversFaced);
      const runsConceded = parseFloat(inputs.runsConceded) || 0;
      const oversBowled = parseOvers(inputs.oversBowled);

      if (oversFaced <= 0 || oversBowled <= 0) {
        return { error: 'Overs must be greater than zero.' };
      }

      const teamRR = runsScored / oversFaced;
      const oppRR = runsConceded / oversBowled;
      const nrr = teamRR - oppRR;

      return {
        teamRR: teamRR.toFixed(3),
        oppRR: oppRR.toFixed(3),
        nrr: (nrr > 0 ? '+' : '') + nrr.toFixed(3)
      };
    },
    outputs: [
      { id: 'teamRR', label: 'Team Run Rate (For)', type: 'number' },
      { id: 'oppRR', label: 'Opponent Run Rate (Against)', type: 'number' },
      { id: 'nrr', label: 'Net Run Rate (NRR)', type: 'text' }
    ],
    formula: {
      text: 'NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)',
      explanation: 'Measures your scoring rate relative to your opponents in a tournament.'
    },
    steps: [
      'Enter total runs scored across all matches.',
      'Enter total overs faced. (If bowled out, use the full quota of overs).',
      'Enter runs conceded and overs bowled, then calculate.'
    ],
    examples: [
      { input: 'Scored: 250 runs in 50 overs. Conceded: 200 runs in 50 overs.', calculation: 'For RR = 5.0. Against RR = 4.0. NRR = 5.0 - 4.0 = +1.000.', result: '+1.000' }
    ],
    faq: [
      { question: 'What happens to NRR if a team is bowled out?', answer: 'If a team is bowled out before completing their allotted overs, the calculation uses the full number of allotted overs (e.g. 50 overs in an ODI) for that match rather than the actual overs completed.' }
    ]
  },

  'strike-rate-calculator': {
    id: 'strike-rate-calculator',
    name: 'Strike Rate Calculator',
    category: 'Cricket',
    slug: 'strike-rate-calculator',
    description: 'Calculate a batsman\'s Strike Rate (SR) representing runs scored per 100 balls.',
    metaTitle: 'Cricket Batting Strike Rate Calculator - CalcNest',
    metaDescription: 'Find batting strike rates. Enter runs scored and balls faced to calculate batsman scoring speed.',
    fields: [
      { id: 'runs', label: 'Runs Scored', type: 'number', defaultValue: 45, required: true },
      { id: 'balls', label: 'Balls Faced', type: 'number', defaultValue: 30, required: true }
    ],
    calculate: (inputs) => {
      const runs = parseFloat(inputs.runs) || 0;
      const balls = parseFloat(inputs.balls) || 0;

      if (balls <= 0) return { error: 'Balls faced must be greater than zero.' };

      const sr = (runs / balls) * 100;

      return {
        sr: sr.toFixed(2)
      };
    },
    outputs: [
      { id: 'sr', label: 'Strike Rate (%)', type: 'number' }
    ],
    formula: {
      text: 'Strike Rate = (Runs Scored / Balls Faced) * 100',
      explanation: 'Indicates how many runs a batsman would score on average over 100 balls.'
    },
    steps: [
      'Enter runs scored.',
      'Enter balls faced, and press Calculate.'
    ],
    examples: [
      { input: 'Runs: 45; Balls: 30', calculation: '(45 / 30) * 100 = 1.5 * 100 = 150.00', result: '150.00' }
    ],
    faq: [
      { question: 'What is a good strike rate in T20 cricket?', answer: 'In T20 matches, a strike rate above 130 is generally considered good, while rates above 150 are excellent.' }
    ]
  },

  'required-run-rate-calculator': {
    id: 'required-run-rate-calculator',
    name: 'Required Run Rate Calculator',
    category: 'Cricket',
    slug: 'required-run-rate-calculator',
    description: 'Calculate the required run rate (RRR) during a run chase based on remaining targets and deliveries.',
    metaTitle: 'Required Run Rate Calculator - Cricket Chases - CalcNest',
    metaDescription: 'Calculate required runs per over. Put in target, runs scored, and overs remaining to see chase targets.',
    fields: [
      { id: 'target', label: 'Target Score to Win', type: 'number', defaultValue: 180, required: true },
      { id: 'scored', label: 'Current Runs Scored', type: 'number', defaultValue: 120, required: true },
      { id: 'oversRemaining', label: 'Overs Remaining (e.g. 5.2)', type: 'number', defaultValue: 5.2, required: true }
    ],
    calculate: (inputs) => {
      const target = parseFloat(inputs.target) || 0;
      const scored = parseFloat(inputs.scored) || 0;
      const oversVal = parseFloat(inputs.oversRemaining) || 0;

      const oversRemaining = parseOvers(oversVal);
      if (oversRemaining <= 0) return { error: 'Overs remaining must be greater than zero.' };

      const needed = Math.max(0, target - scored);
      const rrr = needed / oversRemaining;

      return {
        needed,
        rrr: rrr.toFixed(2)
      };
    },
    outputs: [
      { id: 'needed', label: 'Runs Needed to Win', type: 'number' },
      { id: 'rrr', label: 'Required Run Rate (RRR)', type: 'number' }
    ],
    formula: {
      text: 'Required Run Rate = (Target - Current Runs) / Overs Remaining',
      explanation: 'Calculates the average scoring rate needed to win the match before running out of overs.'
    },
    steps: [
      'Enter the target score set by the first batting team.',
      'Enter your team\'s current runs.',
      'Input the overs remaining to check target speeds.'
    ],
    examples: [
      { input: 'Target: 180; Current: 120; Overs Left: 6.0', calculation: 'Needed = 60 runs. RRR = 60 / 6 = 10.00', result: '10.00 runs/over' }
    ],
    faq: [
      { question: 'How does required run rate differ from current run rate?', answer: 'Current run rate (CRR) measures the actual rate at which runs have been scored. Required run rate (RRR) is the speed at which the chasing team needs to score to win.' }
    ]
  },

  'bowling-economy-calculator': {
    id: 'bowling-economy-calculator',
    name: 'Bowling Economy Calculator',
    category: 'Cricket',
    slug: 'bowling-economy-calculator',
    description: 'Calculate a bowler\'s Economy Rate (Econ) representing runs conceded per over.',
    metaTitle: 'Bowling Economy Rate Calculator - Cricket Stats - CalcNest',
    metaDescription: 'Calculate bowling economy rates. Put in runs conceded and overs bowled to analyze bowler performance.',
    fields: [
      { id: 'runs', label: 'Runs Conceded', type: 'number', defaultValue: 32, required: true },
      { id: 'overs', label: 'Overs Bowled (e.g. 4.0)', type: 'number', defaultValue: 4.0, required: true }
    ],
    calculate: (inputs) => {
      const runs = parseFloat(inputs.runs) || 0;
      const oversVal = parseFloat(inputs.overs) || 0;

      const overs = parseOvers(oversVal);
      if (overs <= 0) return { error: 'Overs bowled must be greater than zero.' };

      const econ = runs / overs;

      return {
        econ: econ.toFixed(2)
      };
    },
    outputs: [
      { id: 'econ', label: 'Economy Rate (Runs/Over)', type: 'number' }
    ],
    formula: {
      text: 'Economy Rate = Runs Conceded / Overs Bowled',
      explanation: 'Measures a bowler\'s efficiency in preventing opponent runs.'
    },
    steps: [
      'Enter total runs conceded by the bowler.',
      'Enter total overs bowled by the bowler.'
    ],
    examples: [
      { input: 'Runs: 24; Overs: 3.2', calculation: 'Overs = 3.333. Economy = 24 / 3.333 = 7.20', result: '7.20 runs/over' }
    ],
    faq: [
      { question: 'What is a good economy rate in ODI cricket?', answer: 'In One Day Internationals (ODI), an economy rate below 5.0 is considered excellent, while below 6.0 is acceptable.' }
    ]
  },

  // === TECH ===
  'binary-calculator': {
    id: 'binary-calculator',
    name: 'Binary Calculator',
    category: 'Tech',
    slug: 'binary-calculator',
    description: 'Perform arithmetic operations (addition, subtraction, multiplication, division) on binary numbers.',
    metaTitle: 'Binary Arithmetic Calculator - Operations Online - CalcNest',
    metaDescription: 'Add, subtract, multiply, or divide binary numbers (base 2). View binary outputs alongside decimal conversions.',
    fields: [
      { id: 'bin1', label: 'Binary Number 1', type: 'text', defaultValue: '1010', required: true },
      { id: 'op', label: 'Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Addition (+)', value: 'add' },
        { label: 'Subtraction (-)', value: 'sub' },
        { label: 'Multiplication (*)', value: 'mul' },
        { label: 'Division (/)', value: 'div' }
      ]},
      { id: 'bin2', label: 'Binary Number 2', type: 'text', defaultValue: '0010', required: true }
    ],
    calculate: (inputs) => {
      const b1 = inputs.bin1.trim();
      const b2 = inputs.bin2.trim();
      
      const isBinary = /^[01]+$/;
      if (!isBinary.test(b1) || !isBinary.test(b2)) {
        return { error: 'Please enter valid binary numbers containing only 0 and 1.' };
      }

      const dec1 = parseInt(b1, 2);
      const dec2 = parseInt(b2, 2);
      const op = inputs.op;

      let resultDec = 0;
      if (op === 'add') resultDec = dec1 + dec2;
      else if (op === 'sub') resultDec = dec1 - dec2;
      else if (op === 'mul') resultDec = dec1 * dec2;
      else if (op === 'div') {
        if (dec2 === 0) return { error: 'Cannot divide by zero.' };
        resultDec = Math.floor(dec1 / dec2);
      }

      const isNegative = resultDec < 0;
      const absResult = Math.abs(resultDec);
      let resultBin = absResult.toString(2);
      if (isNegative) resultBin = '-' + resultBin;

      return {
        binResult: resultBin,
        dec1,
        dec2,
        decResult: resultDec
      };
    },
    outputs: [
      { id: 'binResult', label: 'Binary Output (Base 2)', type: 'text' },
      { id: 'decResult', label: 'Decimal Output (Base 10)', type: 'number' },
      { id: 'dec1', label: 'Number 1 in Decimal', type: 'number' },
      { id: 'dec2', label: 'Number 2 in Decimal', type: 'number' }
    ],
    formula: {
      text: 'Converts base-2 strings to standard base-10 integers, performs math, and outputs the result in binary representation.',
      explanation: 'Binary arithmetic follows base-2 carries (e.g. 1 + 1 = 10, 1 + 1 + 1 = 11).'
    },
    steps: [
      'Input two binary string numbers.',
      'Select the arithmetic operation.',
      'The engine computes and outputs binary values and decimal cross-checks.'
    ],
    examples: [
      { input: '1010 + 0010', calculation: '10 (decimal) + 2 (decimal) = 12 = 1100 (binary)', result: '1100' }
    ],
    faq: [
      { question: 'What is a binary number?', answer: 'Binary is a base-2 numbering system that uses only two digits, 0 and 1, used internally by computer systems to store instructions and process memory.' }
    ]
  },

  'binary-to-decimal': {
    id: 'binary-to-decimal',
    name: 'Binary to Decimal Converter',
    category: 'Tech',
    slug: 'binary-to-decimal',
    description: 'Convert base-2 binary numbers into base-10 decimal numbers.',
    metaTitle: 'Binary to Decimal Converter - Base 2 to 10 - CalcNest',
    metaDescription: 'Convert binary strings (e.g., 1101) to standard decimal values. Free online conversion utility.',
    fields: [
      { id: 'binary', label: 'Binary String (Base 2)', type: 'text', defaultValue: '11111111', required: true }
    ],
    calculate: (inputs) => {
      const bin = inputs.binary.trim();
      if (!/^[01]+$/.test(bin)) return { error: 'Please enter a valid binary number containing only 0 and 1.' };

      const dec = parseInt(bin, 2);
      return {
        decimal: dec
      };
    },
    outputs: [
      { id: 'decimal', label: 'Decimal (Base 10) Value', type: 'number' }
    ],
    formula: {
      text: 'Decimal = Sum(Binary_Digit_i * 2^i) from i=0 to length-1 (right to left)',
      explanation: 'Multiplies each digit by subsequent powers of 2.'
    },
    steps: [
      'Enter your binary number.',
      'Press calculate to find the decimal output.'
    ],
    examples: [
      { input: '1101', calculation: '(1*2^3) + (1*2^2) + (0*2^1) + (1*2^0) = 8 + 4 + 0 + 1 = 13', result: '13' }
    ],
    faq: [
      { question: 'How do you read binary numbers?', answer: 'Read from right to left, matching positions to powers of 2 starting at 2^0 (1), 2^1 (2), 2^2 (4), 2^3 (8), etc. Add up values where a "1" is present.' }
    ]
  },

  'decimal-to-binary': {
    id: 'decimal-to-binary',
    name: 'Decimal to Binary Converter',
    category: 'Tech',
    slug: 'decimal-to-binary',
    description: 'Convert base-10 decimal integers into base-2 binary strings.',
    metaTitle: 'Decimal to Binary Converter - Base 10 to 2 - CalcNest',
    metaDescription: 'Convert standard decimal numbers to binary bits. Clear step-by-step division-by-2 method included.',
    fields: [
      { id: 'decimal', label: 'Decimal Integer (Base 10)', type: 'number', defaultValue: 255, required: true }
    ],
    calculate: (inputs) => {
      const dec = parseInt(inputs.decimal);
      if (isNaN(dec) || dec < 0) return { error: 'Please enter a positive decimal integer.' };

      return {
        binary: dec.toString(2)
      };
    },
    outputs: [
      { id: 'binary', label: 'Binary (Base 2) Value', type: 'text' }
    ],
    formula: {
      text: 'Decimal to Binary is achieved using the division-by-2 method, tracking remainders upwards.',
      explanation: 'Keep dividing the quotient by 2 and write the remainder (0 or 1). Read remainders in reverse order.'
    },
    steps: [
      'Input a positive decimal integer.',
      'Divide by 2, note the remainder, and repeat with the quotient until it is 0.',
      'The binary string is the sequence of remainders from bottom to top.'
    ],
    examples: [
      { input: '13', calculation: '13/2 = 6 r 1; 6/2 = 3 r 0; 3/2 = 1 r 1; 1/2 = 0 r 1.', result: '1101' }
    ],
    faq: [
      { question: 'Does this support decimal fractions?', answer: 'This version focuses on integer conversions, which represent standard byte registers.' }
    ]
  },

  'password-generator': {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'Tech',
    slug: 'password-generator',
    description: 'Generate secure, randomized passwords with customizable length, symbols, numbers, and letter cases.',
    metaTitle: 'Password Generator Online - Create Secure Keys - CalcNest',
    metaDescription: 'Generate secure passwords. Customize lengths, include special characters, numbers, and cases for ultimate security.',
    customRenderer: 'PasswordGenerator',
    fields: [],
    calculate: () => ({}),
    outputs: [],
    formula: {
      text: 'Uses secure randomized character indexes matching checkboxes configurations.',
      explanation: 'Compiles custom ASCII ranges (uppercase, lowercase, digits, symbols).'
    },
    steps: [
      'Select password length (8 to 32 characters is recommended).',
      'Toggle checkboxes (Numbers, Symbols, Lowercase, Uppercase).',
      'Generate and copy the output password.'
    ],
    examples: [
      { input: 'Length: 12; All boxes checked', calculation: 'Generates 12 random characters from the active pool', result: 'g9#K!p8@mN2z' }
    ],
    faq: [
      { question: 'What makes a password strong?', answer: 'A strong password is at least 12 characters long, contains a mix of uppercase and lowercase letters, numbers, and special symbols, and is completely random.' }
    ]
  },

  'data-storage-converter': {
    id: 'data-storage-converter',
    name: 'Data Storage Converter',
    category: 'Tech',
    slug: 'data-storage-converter',
    description: 'Convert between digital file sizes including Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes.',
    metaTitle: 'Data Size Converter - Bytes to GB/TB - CalcNest',
    metaDescription: 'Convert digital storage capacities. Convert easily between MB, GB, TB, and Bytes using base-1024 binary sizes.',
    fields: [
      { id: 'value', label: 'Data Size Value', type: 'number', defaultValue: 1024, required: true },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'MB', options: [
        { label: 'Bytes (B)', value: 'B' },
        { label: 'Kilobytes (KB)', value: 'KB' },
        { label: 'Megabytes (MB)', value: 'MB' },
        { label: 'Gigabytes (GB)', value: 'GB' },
        { label: 'Terabytes (TB)', value: 'TB' }
      ]},
      { id: 'toUnit', label: 'To Unit', type: 'select', defaultValue: 'GB', options: [
        { label: 'Bytes (B)', value: 'B' },
        { label: 'Kilobytes (KB)', value: 'KB' },
        { label: 'Megabytes (MB)', value: 'MB' },
        { label: 'Gigabytes (GB)', value: 'GB' },
        { label: 'Terabytes (TB)', value: 'TB' }
      ]}
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit;
      const to = inputs.toUnit;

      const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024, TB: 1024 * 1024 * 1024 * 1024 };
      if (!units[from] || !units[to]) return { error: 'Invalid conversion units.' };

      const valueInBytes = val * units[from];
      const result = valueInBytes / units[to];

      return {
        result: `${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to}`,
        bytes: valueInBytes.toLocaleString()
      };
    },
    outputs: [
      { id: 'result', label: 'Converted Size', type: 'text' },
      { id: 'bytes', label: 'Size in Raw Bytes', type: 'text' }
    ],
    formula: {
      text: 'Value_To = Value_From * (Bytes_per_From_Unit / Bytes_per_To_Unit)',
      explanation: 'Computes using binary multipliers where 1 KB = 1024 Bytes.'
    },
    steps: [
      'Enter the numerical data storage size.',
      'Select the initial units (e.g. Megabytes).',
      'Select the target units (e.g. Gigabytes) and press Calculate.'
    ],
    examples: [
      { input: '1024 Megabytes to Gigabytes', calculation: '1024 * (1024^2) / (1024^3) = 1 GB', result: '1.00 GB' }
    ],
    faq: [
      { question: 'Why is 1 KB equal to 1024 Bytes instead of 1000?', answer: 'Digital computers utilize binary circuits, so memory size represents powers of 2. 2^10 equals 1024, which is the closest power of 2 to 1000.' }
    ]
  },

  // === STATISTICS ===
  'mean-median-mode': {
    id: 'mean-median-mode',
    name: 'Mean, Median, Mode Calculator',
    category: 'Statistics',
    slug: 'mean-median-mode',
    description: 'Calculate the mean, median, mode, and range for a set of numbers.',
    metaTitle: 'Mean, Median, Mode, Range Calculator - CalcNest',
    metaDescription: 'Find statistical values for a set of data points. Quick, free calculator showing mean, median, mode, and ranges.',
    fields: [
      { id: 'numbers', label: 'Enter Numbers (comma-separated)', type: 'text', defaultValue: '10, 15, 20, 15, 30, 25', required: true }
    ],
    calculate: (inputs) => {
      const str = inputs.numbers;
      const arr = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

      if (arr.length === 0) return { error: 'Please enter a valid list of numbers.' };

      // Mean
      const sum = arr.reduce((a, b) => a + b, 0);
      const mean = sum / arr.length;

      // Median
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      // Mode
      const freqs = {};
      let maxFreq = 0;
      arr.forEach(val => {
        freqs[val] = (freqs[val] || 0) + 1;
        if (freqs[val] > maxFreq) maxFreq = freqs[val];
      });

      const modes = [];
      for (const val in freqs) {
        if (freqs[val] === maxFreq && maxFreq > 1) {
          modes.push(parseFloat(val));
        }
      }

      const modeText = modes.length === 0 ? 'No Mode' : modes.join(', ');

      // Range
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      const range = max - min;

      return {
        mean: mean.toFixed(2),
        median: median.toFixed(2),
        mode: modeText,
        range: range.toFixed(2),
        count: arr.length
      };
    },
    outputs: [
      { id: 'mean', label: 'Mean (Average)', type: 'number' },
      { id: 'median', label: 'Median (Middle Value)', type: 'number' },
      { id: 'mode', label: 'Mode (Most Frequent)', type: 'text' },
      { id: 'range', label: 'Range (Max - Min)', type: 'number' },
      { id: 'count', label: 'Sample Count (N)', type: 'number' }
    ],
    formula: {
      text: 'Mean = Sum(x) / N; Median = Middle index value; Mode = Value with highest frequency.',
      explanation: 'Computes descriptive central tendency metrics on numeric arrays.'
    },
    steps: [
      'Input comma-separated numbers (e.g. 5, 10, 15).',
      'The calculator cleans entries, sorts data, and extracts indicators.'
    ],
    examples: [
      { input: '2, 3, 3, 4, 8', calculation: 'Mean = 20/5 = 4. Median = 3. Mode = 3. Range = 6.', result: 'Mean 4.0, Median 3.0' }
    ],
    faq: [
      { question: 'What is a multimodal set?', answer: 'A multimodal set has more than one value that repeats with the maximum frequency.' }
    ]
  },

  'standard-deviation': {
    id: 'standard-deviation',
    name: 'Standard Deviation Calculator',
    category: 'Statistics',
    slug: 'standard-deviation',
    description: 'Calculate population and sample standard deviation, variance, and mean for a dataset.',
    metaTitle: 'Standard Deviation & Variance Calculator - CalcNest',
    metaDescription: 'Find population/sample standard deviation and variance for a set of data points online.',
    fields: [
      { id: 'numbers', label: 'Enter Numbers (comma-separated)', type: 'text', defaultValue: '10, 20, 30, 40, 50', required: true }
    ],
    calculate: (inputs) => {
      const str = inputs.numbers;
      const arr = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

      if (arr.length < 2) return { error: 'Please enter at least two numbers.' };

      // Mean
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;

      // Variance
      const diffSqSum = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
      
      const varSample = diffSqSum / (arr.length - 1);
      const varPop = diffSqSum / arr.length;

      const sdSample = Math.sqrt(varSample);
      const sdPop = Math.sqrt(varPop);

      return {
        mean: mean.toFixed(2),
        sdSample: sdSample.toFixed(4),
        sdPop: sdPop.toFixed(4),
        varSample: varSample.toFixed(4),
        varPop: varPop.toFixed(4)
      };
    },
    outputs: [
      { id: 'mean', label: 'Mean (Average)', type: 'number' },
      { id: 'sdSample', label: 'Sample Standard Deviation (s)', type: 'number' },
      { id: 'sdPop', label: 'Population Standard Deviation (σ)', type: 'number' },
      { id: 'varSample', label: 'Sample Variance (s²)', type: 'number' },
      { id: 'varPop', label: 'Population Variance (σ²)', type: 'number' }
    ],
    formula: {
      text: 's = sqrt( Sum((xi - Mean)^2) / (N - 1) ); \nσ = sqrt( Sum((xi - Mean)^2) / N )',
      explanation: 'Quantifies variation or dispersion in datasets.'
    },
    steps: [
      'Input comma-separated numbers.',
      'The engine finds the mean and sums squared errors.',
      'Computes sample (N-1 denominator) and population (N denominator) values.'
    ],
    examples: [
      { input: '4, 8', calculation: 'Mean = 6. Errors: (4-6)^2 = 4, (8-6)^2 = 4. Sum = 8. Sample Var = 8/1 = 8. SD = sqrt(8) = 2.828', result: 'Sample SD: 2.8284' }
    ],
    faq: [
      { question: 'When should I use Sample vs. Population SD?', answer: 'Use Sample SD when your dataset represents a small slice of a larger group. Use Population SD when your dataset covers the entire group under consideration.' }
    ]
  }
};
