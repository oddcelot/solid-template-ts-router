import { useTransition, type ParentComponent, createSignal } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import Config, { config, setConfig } from './pages/config'
import Resizer from './components/Resizer'
import { makePersisted } from '@solid-primitives/storage'

const App: ParentComponent = (props) => {
    const location = useLocation()
    const [pending] = useTransition()

    let sectionConfig: HTMLElement

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
        )
    }

    return (
        <>
            <nav class=" col-span-full grid grid-cols-subgrid gap-4 rounded-xl border-slate-700 bg-slate-800 px-4 font-semibold">
                <ul class="custom-scrollbar col-span-3 flex w-full items-stretch gap-4 overflow-auto">
                    <Item href="/">Home</Item>
                    <Item href="/about">About</Item>
                    <Item href="/test/1">Test 1</Item>
                    <Item href="/test/2">Test 2</Item>
                    <Item href="/cached/1">Cached 1</Item>
                    <Item href="/cached/2">Cached 2</Item>
                    <Item href="/error">Error</Item>
                </ul>

                <div class="col-span-1 ml-auto flex w-full items-center justify-end text-sm ">
                    <span class="rounded-lg rounded-e-none bg-slate-700 px-4 py-2">
                        URL:
                    </span>
                    <input
                        class="w-full rounded-lg rounded-s-none bg-slate-900 px-4 py-2"
                        type="text"
                        readOnly
                        name="currentPath"
                        value={location.pathname}
                    />
                </div>
            </nav>

            <main
                class="col-span-3 row-span-5 flex flex-col gap-4 overflow-auto rounded-xl bg-slate-700 p-4 clip-inset-radius-xl"
                classList={{ 'animate-pulse': pending() }}
            >
                {props.children}
            </main>
            <aside
                ref={sectionConfig}
                class="relative col-span-1 row-span-5 grid min-w-60 rounded-xl bg-slate-800 p-4"
                style={{ width: `${config.sidebarWidth}px` }}
            >
                <Resizer
                    direction="horizontal"
                    class="group absolute inset-2 left-0 right-auto grid w-4 -translate-x-full"
                    onResizeEnd={() =>
                        setConfig(
                            'sidebarWidth',
                            sectionConfig.getBoundingClientRect().width
                        )
                    }
                >
                    <div class="h-16 w-1 place-self-center rounded-full bg-slate-400 opacity-20 transition group-hover:opacity-60 group-data-[resizing=true]:scale-110 group-data-[resizing=true]:opacity-100" />
                </Resizer>

                <Config />
            </aside>
        </>
    )
}

export default App
