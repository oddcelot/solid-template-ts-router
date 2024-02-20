import {
  createEffect,
  Suspense,
  useTransition,
  Component,
  onCleanup,
  ErrorBoundary,
} from "solid-js";
import { RouteSectionProps, useParams } from "@solidjs/router";

import { createAsync, useBeforeLeave } from "@solidjs/router";
import { getCachedData, getCachedDataNext } from "./cached.data";

import { Skeleton } from "@kobalte/core";

console.log(process.env.NODE_ENV);

const ChildComponent: Component<{ data: string }> = (props) => {
  const params = useParams();

  return (
    <div>
      <h2>child in {params.id}</h2>
      <span>child data: {props.data}</span>
    </div>
  );
};

const ChildComponentAsync: Component<{ id: string }> = (props) => {
  const params = useParams();
  const data = createAsync(() => getCachedData(props.id));

  return (
    <div>
      <h2>async child in {params.id}</h2>
      <Suspense fallback="loading data…">
        <p>
          child data: <code>{JSON.stringify(data())}</code>
        </p>
      </Suspense>
    </div>
  );
};

export default function CachedPage(props: RouteSectionProps) {
  const params = useParams();
  const [getData, controller] = getCachedDataNext();
  const [pending, start] = useTransition();

  useBeforeLeave((ev) => {
    console.log("beforeleave", ev);

    controller.abort("route change");
    if (ev.to !== ev.from.pathname) {
      controller.abort("route change");
    }
  });

  const data = createAsync(() => {
    console.log(`running createAsync for ${params.id}`);

    return getData(params.id);
  });

  onCleanup(() => {
    console.log("running cleanup");
  });

  return (
    <>
      <h1 class="text-2xl font-bold">Cached {params.id}</h1>

      <section class="bg-slate-600 rounded-lg p-4">
        <details open={false}>
          <summary>initial route props</summary>
          <pre>{JSON.stringify(props, undefined, 2)}</pre>
        </details>
      </section>

      <section class="bg-slate-600 rounded-lg p-4">
        <ErrorBoundary fallback={(err) => err.message}>
          <Suspense
            fallback={
              <Skeleton.Root>
                <ChildComponent data={JSON.stringify(data())} />
              </Skeleton.Root>
            }
          >
            <ChildComponent data={JSON.stringify(data())} />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* <section class="bg-slate-600 rounded-lg p-4">
        <ChildComponentAsync id={params.id} />
      </section>

      <section class="bg-slate-600 rounded-lg p-4">
        <Skeleton.Root class="skeleton" visible={!data() || pending()}>
          <Suspense
            fallback={
              <Skeleton.Root>
                <ChildComponent data={"fake"} />
              </Skeleton.Root>
            }
          >
            <ChildComponent data={JSON.stringify(data())} />
          </Suspense>
        </Skeleton.Root>
      </section> */}
    </>
  );
}
