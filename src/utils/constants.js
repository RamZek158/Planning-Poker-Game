const HALF_POINT_CARD = "\u00bd";
const BREAK_CARD = "\u2615";

const LEGACY_VOTING_VALUE_MAP = {
	"": "0",
	"01": "1",
	"1/2": HALF_POINT_CARD,
	"ВЅ": HALF_POINT_CARD,
	"в•": BREAK_CARD,
};

export const T_SHIRT_VOTING_SYSTEM = [
	"XS",
	"S",
	"M",
	"L",
	"XL",
	"XXL",
	"?",
	BREAK_CARD,
];

export const FIBONACCI_VOTING_SYSTEM = [
	"0",
	HALF_POINT_CARD,
	"1",
	"2",
	"3",
	"5",
	"8",
	"13",
	"20",
	"40",
	"100",
	"?",
	BREAK_CARD,
];

export const normalizeVotingValue = (value) => {
	if (typeof value !== "string") return value;

	const trimmedValue = value.trim();
	return LEGACY_VOTING_VALUE_MAP[trimmedValue] ?? trimmedValue;
};

export const normalizeVotingType = (values) => {
	if (!Array.isArray(values)) return [];

	return values
		.map(normalizeVotingValue)
		.filter((value) => typeof value === "string" && value.length > 0);
};
