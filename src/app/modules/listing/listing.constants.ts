export const RENT_TYPE = {
    family: "family",
    bachelor: "bachelor",
    office: "office",
    sublet: "sublet",
} as const;
export const rentTypeArray = Object.values(RENT_TYPE);

export const RENT_AREA = {
    Mirpur: "Mirpur",
    Dhanmondi: "Dhanmondi",
    Mohammadpur: "Mohammadpur",
    Uttora: "Uttora",
    Badda: "Badda",
    Bashundhara: "Bashundhara",
} as const;
export const rentAreaArray = Object.values(RENT_AREA);

export const LISTING_STATUS = {
    Rended: "Rended",
    Available: "Available",
    Hold: "Hold",
} as const;
export const listingStatusArray = Object.values(LISTING_STATUS);
