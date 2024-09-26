import { ReadonlyURLSearchParams } from "next/navigation";

type createQueryStringType = {
  name1: string;
  value1: string;
  searchParams: ReadonlyURLSearchParams;
};

type deleteQueryStringType = {
  namesToDelete: string[];
  router: any;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
};

type createRaportQueryStringType = {
  sensorID: string;
  dateFrom: string;
  dateTo: string;
  existingSearchParams: string;
};

export const createQueryString = ({
  name1,
  value1,
  searchParams,
}: createQueryStringType) => {
  const params = new URLSearchParams(searchParams);
  params.set(name1, value1);

  return params.toString();
};

export const deleteQueryString = ({
  namesToDelete,
  router,
  pathname,
  searchParams,
}: deleteQueryStringType) => {
  // console.log('Deleting Query String:', namesToDelete);
  const params = new URLSearchParams(searchParams);

  namesToDelete.forEach((name) => {
    params.delete(name);
  });
  // console.log('Updated Params:', params.toString());

  router.replace(`${pathname}?${params.toString()}`);
};

export const createRaportQueryString = ({
  sensorID,
  dateFrom,
  dateTo,
  existingSearchParams,
}: createRaportQueryStringType) => {
  const params = new URLSearchParams(existingSearchParams);

  params.delete('sensorID');

  if (sensorID) {
    params.set('sensorID', sensorID);
  }

  if (dateFrom) {
    params.set('dateFrom', dateFrom);
  }

  if (dateTo) {
    params.set('dateTo', dateTo);
  }

  return params.toString();
};
