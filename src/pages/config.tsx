import { makePersisted } from '@solid-primitives/storage'
import { DelayMode } from 'msw'
import { createStore, reconcile } from 'solid-js/store'

export type Config = {
    delay: number | DelayMode
    customDelay: number
    sidebarWidth: number
}

const defaultConfig: Config = {
    delay: 'real',
    customDelay: 3000,
    sidebarWidth: 300,
}

export const [config, setConfig] = makePersisted(
    createStore<Config>({ ...defaultConfig }),
    {
        storage: sessionStorage,
    }
)

export default function ConfigPage() {
    return (
        <div class="grid place-content-between place-items-stretch justify-stretch">
            <fieldset class="col-span-full grid grid-cols-[min-content_auto] place-content-start gap-x-4">
                <legend class="col-span-full">Select a delay mode:</legend>

                <input
                    id="delay-real"
                    type="radio"
                    name="delayMode"
                    value="real"
                    checked={config.delay === 'real'}
                    onInput={() => setConfig('delay', 'real')}
                />
                <label for="delay-real">real</label>

                <input
                    id="delay-infinite"
                    type="radio"
                    name="delayMode"
                    value="infinite"
                    checked={config.delay === 'infinite'}
                    onInput={() => setConfig('delay', 'infinite')}
                />
                <label for="delay-infinite">infinite</label>
                <input
                    id="delay-custom"
                    type="radio"
                    name="delayMode"
                    value={config.customDelay}
                    checked={typeof config.delay === 'number'}
                    onInput={() => setConfig('delay', config.customDelay)}
                />
                <label for="delay-custom">
                    <output class="font-mono" name="delayResult" for="delay">
                        custom ({config.customDelay} ms)
                    </output>
                </label>
                <input
                    class="col-start-2"
                    disabled={typeof config.delay === 'string'}
                    id="delay"
                    name="delay"
                    type="range"
                    step={500}
                    min={0}
                    max={9000}
                    value={config.customDelay}
                    onInput={(ev) => {
                        const d = Number(ev.currentTarget.value.trim())
                        setConfig('customDelay', d)
                        setConfig('delay', d)
                    }}
                />
            </fieldset>
            <button
                class="btn-primary"
                type="button"
                onClick={() => setConfig(reconcile(defaultConfig))}
            >
                Reset Config
            </button>
        </div>
    )
}
