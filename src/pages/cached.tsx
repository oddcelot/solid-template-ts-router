import { Suspense, useTransition, Component, ErrorBoundary } from "solid-js";
import { RouteSectionProps, useParams } from "@solidjs/router";
import { createAsync, useBeforeLeave } from "@solidjs/router";
import { getCachedData, getCachedDataNext } from "./cached.data";
import { Skeleton } from "@kobalte/core";

const ChildComponent: Component<{ data: string }> = (props) => {
  const params = useParams();

  return (
    <div>
      <h3>
        child in <code>{params.id}</code>
      </h3>
      <span>child data:</span>
      <pre>{props.data}</pre>
    </div>
  );
};

const ChildComponentAsync: Component<{ id: string }> = (props) => {
  const params = useParams();
  const data = createAsync(() => getCachedData(props.id));

  return (
    <div>
      <h3>
        async child in <code>{params.id}</code>
      </h3>
      <Suspense fallback="loading data…">
        <span>child data:</span>
        <pre>{JSON.stringify(data(), null, 2)}</pre>
      </Suspense>
    </div>
  );
};

export default function CachedPage(props: RouteSectionProps) {
  const params = useParams();
  const [getData, controller] = getCachedDataNext();
  const [pending] = useTransition();

  const data = createAsync(() => {
    console.log(`running createAsync for ${params.id}`);

    return getData(params.id);
  });

  useBeforeLeave((ev) => {
    controller.abort("route change");
    if (ev.to !== ev.from.pathname) {
      controller.abort("route change");
    }
  });

  const displayData = () => JSON.stringify(data(), null, 2);

  return (
    <>
      <h1>Cached {params.id}</h1>

      <section>
        <details open={false}>
          <summary>initial route props</summary>
          <pre>{JSON.stringify(props, undefined, 2)}</pre>
        </details>
      </section>

      <section>
        <ErrorBoundary fallback={(err) => err.message}>
          <Suspense
            fallback={
              <Skeleton.Root>
                <ChildComponent data={displayData()} />
              </Skeleton.Root>
            }
          >
            <ChildComponent data={displayData()} />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section>
        <ChildComponentAsync id={params.id} />
      </section>

      <Skeleton.Root class="skeleton" visible={!data() || pending()}>
        <section>
          <Suspense fallback="loading data…">
            <ChildComponent data={displayData()} />
          </Suspense>
        </section>
      </Skeleton.Root>

      <section>
        <Suspense
          fallback={
            /* this won't be shown while tranisitioning within a route, since Suspense is not emptied */
            <Skeleton.Root class="skeleton">
              <ChildComponent data={"fake data"} />
            </Skeleton.Root>
          }
        >
          <ChildComponent data={displayData()} />
        </Suspense>
      </section>

      <section>
        <Skeleton.Root class="skeleton" visible={!displayData() || pending()}>
          <Suspense fallback={<ChildComponent data={"fake data"} />}>
            <ChildComponent data={displayData()} />
          </Suspense>
        </Skeleton.Root>
      </section>
    </>
  );
}
