export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  try {
    if (!valid) {
      throw Error('provided file is not a png, jpg or jpeg image.');
    }
  } catch (e) {
    return new Promise((resolve, reject) => {
      const error = new Error('provided file is not a png, jpg or jpeg image.');
      reject(error);
    });
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// compute trip length in nights given two dates (start and end dates)
export const computeTripLength = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = Math.abs(startDate - endDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// reformats date to follow DD/MM/YYYY
export const reformatDate = (date) => {
  const splitDate = date.split('-');
  const [year, month, day] = splitDate;
  return `${day}/${month}/${year}`;
}

// compute average review rating
export const computeAverageRating = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  }
  const average = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
  return average.toFixed(2);
}

export const isDateInRange = (startDateOne, endDateOne, startDateTwo, endDateTwo) => {
  // Convert strings to Date objects if needed
  startDateOne = new Date(startDateOne);
  endDateOne = new Date(endDateOne);
  startDateTwo = new Date(startDateTwo);
  endDateTwo = new Date(endDateTwo);
  // Check if the first date range is within the second date range
  return startDateOne >= startDateTwo && endDateOne <= endDateTwo;
}

export const computeBedCount = (bedroomList) => {
  let total = 0;
  for (const bedroom of bedroomList) {
    for (const bed of bedroom) {
      total += parseInt(bed.quantity);
    }
  }
  return total;
}

export const encodeImage = async (imageUrl) => {
  try {
    if (imageUrl === undefined) {
      return '';
    } else {
      const bitEncoding = await fileToDataUrl(imageUrl);
      return bitEncoding;
    }
  } catch (e) {
    alert(e);
  }
}

export const addressString = (addressObject) => {
  const { street, suburb, postcode, city, country } = addressObject;
  return street + ', ' + suburb + ', ' + postcode + ', ' + city + ', ' + country;
}
