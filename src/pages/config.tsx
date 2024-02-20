import { DelayMode } from "msw";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type Config = {
  delay: number | DelayMode;
};
export const [config, setConfig] = createStore<Config>({
  delay: "real",
});

export default function ConfigPage() {
  const [customDuration, setCustomDuration] = createSignal<number>(3000);

  return (
    <>
      <section class="grid gap-4">
        <fieldset class="col-span-full grid grid-cols-[min-content_auto] gap-x-4 place-content-start">
          <legend class="col-span-full">Select a delay mode:</legend>

          <input
            id="delay-real"
            type="radio"
            name="delayMode"
            value="real"
            checked={config.delay === "real"}
            onInput={() => setConfig("delay", "real")}
          />
          <label for="delay-real">real</label>

          <input
            id="delay-infinite"
            type="radio"
            name="delayMode"
            value="infinite"
            checked={config.delay === "infinite"}
            onInput={() => setConfig("delay", "infinite")}
          />
          <label for="delay-infinite">infinite</label>
          <input
            id="delay-custom"
            type="radio"
            name="delayMode"
            value={customDuration()}
            checked={typeof config.delay === "number"}
            onInput={() => setConfig("delay", customDuration())}
          />
          <label for="delay-custom">
            <output class="font-mono" name="delayResult" for="delay">
              custom ({customDuration()} ms)
            </output>
          </label>
          <input
            class="col-start-2"
            disabled={typeof config.delay === "string"}
            id="delay"
            name="delay"
            type="range"
            step={500}
            min={0}
            max={9000}
            value={customDuration()}
            onInput={(ev) => {
              setCustomDuration(Number(ev.currentTarget.value.trim()));
              setConfig("delay", customDuration());
            }}
          />
        </fieldset>
      </section>
    </>
  );
}
