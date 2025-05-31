import { parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs/server';
import { createSearchParamsCache } from 'nuqs/server';

export const directorySearchParams = {
  zipcode: parseAsString,
  service: parseAsString,
  radius: parseAsInteger.withDefault(25),
  rating: parseAsInteger.withDefault(0),
  services: parseAsArrayOf(parseAsString).withDefault([]),
  city: parseAsString,
};

export const directoryCache = createSearchParamsCache(directorySearchParams);
