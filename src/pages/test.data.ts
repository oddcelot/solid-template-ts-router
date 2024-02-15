import type { RouteLoadFunc } from "@solidjs/router";
import { createResource, Resource } from "solid-js";
import { getData } from "./test";

const TestData: RouteLoadFunc<Resource<string>> = ({ params }) => {
  const [data] = createResource(() => {
    console.log("running loader func", params.id);
    return getData(params.id);
  });

  return data;
};

export default TestData;
export type TestDataType = typeof TestData;
