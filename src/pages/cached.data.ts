import { cache, type RouteLoadFunc } from "@solidjs/router";

const controller = new AbortController();
const { signal } = controller;
export const fetcher = (id: string) =>
  fetch(`https://api.example.com/user/${id}`, {
    signal,
  });

export const getCachedData = cache(async (id: string) => {
  console.log("caching data for", id);

  return fetcher(id).then((res) => {
    if (res.ok) {
      console.log(res);
      return res.json();
    } else {
      console.log(res);
    }
  });
}, "cached");

export const getCachedDataNext = () => {
  const controller = new AbortController();
  const { signal } = controller;
  const fetcher = (id: string) =>
    fetch(`https://api.example.com/user/${id}`, {
      signal,
    });

  const cachedFn = cache(async (id: string) => {
    console.log("caching data for", id);

    return fetcher(id).then((res) => {
      if (res.ok) {
        console.log(res);
        return res.json();
      } else {
        console.log(res);
      }
    });
  }, "cached");

  cachedFn.abort = controller.abort;
  cachedFn.controller = controller;
  return [cachedFn, controller] as const;
};

export const dataLoader: RouteLoadFunc<void> = ({ params, intent }) => {
  console.log("loader intent:", intent);

  const [getData] = getCachedDataNext();
  void getData(params.id);
};
