import type { RouteLoadFunc } from "@solidjs/router";
import { createResource, ResourceReturn } from "solid-js";
import { getData } from "./test";

const TestData: RouteLoadFunc<ResourceReturn<string>> = ({ params }) => {
  const resource = createResource(() => {
    console.log("running loader func", params.id);
    return getData(params.id);
  });

  return resource;
};

export default TestData;
export type TestDataType = typeof TestData;
