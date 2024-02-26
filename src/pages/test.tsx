import { createEffect, Suspense, Component, createResource } from "solid-js";
import { RouteSectionProps, useParams } from "@solidjs/router";

import { cache, createAsync } from "@solidjs/router";
import { TestDataType } from "./test.data";
import { delay } from "msw";
import { config } from "./config";

export const getData = cache(async (id: string) => {
  await delay(config.delay);
  return `some data for ${id}`;
}, "test");

const ChildComponent: Component<{ data: string }> = (props) => {
  const params = useParams();

  return (
    <div>
      <h2>
        <code>params.id: {params.id}</code>
      </h2>
      <pre>{JSON.stringify(props.data, undefined, 2)}</pre>
    </div>
  );
};

export default function TestPage(
  props: RouteSectionProps<ReturnType<TestDataType>>
) {
  const params = useParams();
  const [routeData] = props.data;

  /* using createAsync will trigger a transition */
  const somedata = createAsync(() => getData(params.id));

  /* using createResource and refetching on param change will NOT trigger a transition */
  // const [somedata, { refetch }] = createResource(params.id, () =>
  //   getData(params.id)
  // );

  // createEffect(() => {
  //   params.id && refetch();
  // });

  return (
    <>
      <h1>Test {params.id}</h1>

      <section>
        <h2 class="text-l font-bold">local data</h2>
        <Suspense fallback="loading data…">
          <ChildComponent data={somedata()} />
        </Suspense>
      </section>

      <section>
        <h2 class="text-l font-bold">route data injected from loader</h2>
        <Suspense fallback={<span>attached data: {routeData.state}…</span>}>
          <pre>{JSON.stringify(routeData(), undefined, 2)}</pre>
        </Suspense>
      </section>
    </>
  );
}
