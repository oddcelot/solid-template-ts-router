import { createEffect, Resource, Suspense, useTransition } from "solid-js";
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

export default function TestPage(
  props: RouteSectionProps<ReturnType<TestDataType>>,
) {
  const somedata = createAsync(() => getData(props.params.id));

  const params = useParams();

  createEffect(() => {
    console.log(props.data());
  });

  const [pending, start] = useTransition();

  return (
    <section
      class="bg-green-100 text-gray-700 p-8"
      classList={{ "opacity-50": pending() }}
    >
      <h1 class="text-2xl font-bold">Test {params.id}</h1>
      <Suspense fallback="loading">
        <h2>{somedata()}</h2>
      </Suspense>

      <p class="mt-4">A page all about this website.</p>

      <p>
        <span>We love</span>
        <Suspense fallback={<span>...</span>}>
          <span>&nbsp;{props.data()}</span>
        </Suspense>
      </p>
    </section>
  );
}
