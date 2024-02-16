import {
  createEffect,
  Suspense,
  useTransition,
  Component,
  createResource,
} from "solid-js";
import { RouteSectionProps, useParams } from "@solidjs/router";

import { cache, createAsync } from "@solidjs/router";
import { TestDataType } from "./test.data";

export const getData = cache(async (id: string) => {
  await new Promise((res) =>
    setTimeout(() => {
      return res(true);
    }, 2000),
  );
  return `some data for ${id}`;
}, "data"); // used as cache key + serialized arguments

const ChildComponent: Component<{ data: string }> = (props) => {
  const params = useParams();

  return (
    <div>
      <h2>this is {params.id}</h2>
      <span>this is {props.data}</span>
    </div>
  );
};

export default function TestPage(
  props: RouteSectionProps<ReturnType<TestDataType>>,
) {
  const params = useParams();
  const [routeData] = props.data;

  /* using createAsync will trigger a transition */
  // const somedata = createAsync(() => getData(params.id));

  /* using createResource and refetching on param change will NOT trigger a transition */
  const [somedata, { refetch }] = createResource(params.id, () =>
    getData(params.id),
  );

  createEffect(() => {
    params.id && refetch();
  });

  const [pending, start] = useTransition();

  return (
    <section
      class="bg-green-100 text-gray-700 p-8"
      classList={{ "opacity-50": pending() }}
    >
      <h1 class="text-2xl font-bold">Test {params.id}</h1>

      <Suspense fallback="loading…">
        <ChildComponent data={somedata()} />
      </Suspense>

      <p class="mt-4">A page all about this website.</p>
      <pre>{routeData()}</pre>
      <p>
        <span>This is load data: </span>
        <Suspense fallback={<span>{routeData.state}…</span>}>
          <span>{routeData()}</span>
        </Suspense>
      </p>
    </section>
  );
}
