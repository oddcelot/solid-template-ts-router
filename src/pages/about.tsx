import { createEffect, Suspense } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import type { AboutDataType } from "./about.data";

export default function About(
  props: RouteSectionProps<ReturnType<AboutDataType>>
) {
  const name = props.data;

  createEffect(() => {
    console.log(name());
  });

  return (
    <>
      <h1 class="text-2xl font-bold">About</h1>

      <p>A page all about this website.</p>

      <section class="bg-slate-600 rounded-lg p-4">
        <span>We love</span>
        <Suspense fallback={<span>...</span>}>
          <span>&nbsp;{name()}</span>
        </Suspense>
      </section>
    </>
  );
}
