import { useTransition, type ParentComponent } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import Config from "./pages/config";

const App: ParentComponent = (props) => {
  const location = useLocation();
  const [pending] = useTransition();

  const Item: ParentComponent<{ href: string }> = (props) => {
    return (
      <li class="flex items-center">
        <A
          href={props.href}
          class="whitespace-nowrap no-underline hover:underline"
          activeClass="font-bold"
        >
          {props.children}
        </A>
      </li>
    );
  };

  return (
    <>
      <nav class="grid grid-cols-subgrid gap-4 col-span-full rounded-xl bg-slate-800 border-slate-700">
        <ul class="col-span-3 flex gap-4 items-stretch w-full overflow-auto px-6">
          <Item href="/">Home</Item>
          <Item href="/about">About</Item>
          <Item href="/test/1">Test 1</Item>
          <Item href="/test/2">Test 2</Item>
          <Item href="/cached/1">Cached 1</Item>
          <Item href="/cached/2">Cached 2</Item>
          <Item href="/error">Error</Item>
        </ul>

        <div class="w-full col-span-1 text-sm flex items-center ml-auto justify-end px-6">
          <span class=" py-2 px-4 bg-slate-700 rounded-lg rounded-e-none">
            URL:
          </span>
          <input
            class="w-full py-2 px-4 bg-slate-900 rounded-lg rounded-s-none"
            type="text"
            readOnly
            name="currentPath"
            value={location.pathname}
          />
        </div>
      </nav>

      <main
        class="col-span-3 row-span-5 flex flex-col gap-4 rounded-xl overflow-hidden bg-slate-700 p-6"
        classList={{ "animate-pulse": pending() }}
      >
        {props.children}
      </main>
      <aside class="col-span-1 row-span-5 grid rounded-xl overflow-hidden bg-slate-800 p-6 min-w-max">
        <Config />
      </aside>
    </>
  );
};

export default App;
